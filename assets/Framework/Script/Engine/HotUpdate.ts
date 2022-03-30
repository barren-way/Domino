import LocalDB from "./LocalDB"
import NetModel from "../../../Games/Common/Script/NetModel"
import SdkManager from "../Sdk/SdkManager"
import JSB_MD5 from "./jsb_md5"
import { cfg } from "../../../Games/Common/Script/Config"
import { GameDef } from "../../../Games/Common/Script/GameDef"
import Tools from "../../../Games/Common/Script/Tools"
import LangManager from "../../../Games/Common/Script/Lang/LangManager"

const { ccclass, property } = cc._decorator

const PACKAGE_VERSION_DB_KEY = "ASSETSMANAGER_PACKAGE_VERSION_DB_KEY"
const DOWNLOAD_FILE_ERROR_KEY = "DOWNLOAD_FILE_ERROR_KEY" //文件下载错误的标记，防止不重试，直接退出

@ccclass
export default class HotUpdate extends cc.Component {

    @property(cc.Node)
    private btn_update: cc.Node = null

    @property(cc.Node)
    private btn_retry: cc.Node = null

    @property(cc.Node)
    private btn_download: cc.Node = null

    @property(cc.Label)
    private txt_info: cc.Label = null

    @property(cc.Node)
    private bar_mask: cc.Node = null

    @property(cc.Node)
    private nod_splash: cc.Node = null

    @property({
        type: cc.Asset
    })
    private manifestUrl = null

    private m_am = null
    private m_updating = false
    private m_canRetry = false
    private m_storagePath = ''
    private m_failCount = 0
    private m_barWidth = 1168
    private m_deldir = false;//清空目录

    private m_ver = null//大版本
    private m_versionInfo = null//服务器下发的版本信息
    private m_uploadParams = null //上传给服务器的参数
    private m_jumpUrl = null

    private m_interval = 8 //强更连接自定义超时等待时间
    private m_reqTimer = null //强更等待计时器

    private m_checkTimer = null //检测更新等待计时器

    //强更地址索引
    private m_urlIdx = 0

    //备用热更地址索引
    private m_hotIdx = 0

    onLoad() {
        console.log("HotUpdate onLoad start")
        this.checkDownloadErrorFile()
        //设置大厅默认语言显示
        LangManager.getInstance().loadDatingLang()
    }

    onDestroy() {
        if (this.m_am) {
            this.m_am.setEventCallback(null)
            this.m_am = null
        }
        this.releaseReqTimer()
        this.releaseCheckTimer()
    }

    start() {
        cc.director.emit(GameDef.EVENTS.NOTIFY_SCREENPWD_SHOW, { hotupdate: true })
        this.hide_all()
        this.bar_mask.parent.active = false
        this.nod_splash.active = true
        let logo = this.nod_splash.getChildByName("logo")
        if (logo) {
            cc.tween(logo).then(cc.delayTime(1)).then(cc.fadeOut(1)).call(this.start_update.bind(this)).start()
        }
    }

    start_update() {
        this.nod_splash.active = false
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            this.gameEnter()
            return
        }
        this.m_urlIdx = 0
        this.m_hotIdx = -1

        //超级盾设置，默认先启动超级盾检测
        NetModel.setUseDun(NetModel.DUN_OPEN)
        let sdk_ins = SdkManager.getInstance()
        NetModel.setFuncDunPort(sdk_ins.getDunPort.bind(sdk_ins))

        //检测一下本地版本号和包体版本号是否一致
        this.checkStorageVersion()
        this.checkPakageUpdate()
    }

    checkPakageUpdate() {

        if (cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS) {
            this.gameEnter()
            return
        }

        this.hide_all()
        if (cc.isValid(this.txt_info)) {
            this.txt_info.string = '正在获取版本信息'
        }

        let platform = SdkManager.getInstance().getPlatForm()

        this.initExParams()

        this.releaseReqTimer()
        this.m_versionInfo = null

        if (this.m_urlIdx < NetModel.getUpdateSvr().length) {
            let url = NetModel.getUpdateSvr()[this.m_urlIdx] + "/update/apkver.json?platform=" + platform + this.m_uploadParams
            let mXhr = new XMLHttpRequest()
            mXhr["ontimeout"] = () => {
                this.reqFailed()
            }

            mXhr['onreadystatechange'] = () => {
                this.JsonResult(mXhr)
            }
            mXhr.timeout = 5000
            mXhr.open("GET", url, true)
            mXhr.send()

            console.log("http_url_update: " + url)

            this.m_urlIdx = this.m_urlIdx + 1

            this.m_reqTimer = this.reqFailed.bind(this)
            this.scheduleOnce(this.m_reqTimer, this.m_interval)

            if (cc.isValid(this.txt_info)) {
                this.txt_info.string = "正在获取版本信息(" + this.m_urlIdx + "服)..."
            }
        } else {
            this.reqFailed()
        }
    }

    releaseReqTimer() {
        if (this.m_reqTimer) {
            this.unschedule(this.m_reqTimer)
            this.m_reqTimer = null
        }
    }

    reqFailed(): void {
        this.releaseReqTimer()
        if (this.m_urlIdx <= NetModel.getUpdateSvr().length - 1) {
            this.checkPakageUpdate()
        } else {
            if (NetModel.isUseDun()) {
                //如果盾失效了，使用gate去连
                console.log("useDun req failed!!!")
                NetModel.setUseDun(NetModel.DUN_CLOSE)
                this.m_urlIdx = 0
                this.checkPakageUpdate()
            } else {
                this.JsonError({ code: -100 })
            }
        }
    }

    JsonResult(result): void {
        do {
            if (result.readyState !== 4) {
                break
            }
            if ((result.status < 200 || result.status > 207)) {
                this.reqFailed()
                break
            }
            let response = result.responseText
            if (!response || response.length < 1) {
                this.reqFailed()
                break
            }
            this.releaseReqTimer()
            let output = (typeof (response) == "string" && response != "") ? JSON.parse(response) : response
            this.deal_data(output)
        } while (false)
    }

    JsonError(result): void {
        if (cc.isValid(this.txt_info)) {
            this.txt_info.string = "获取更新信息失败，请检查网络重试"
        }
        this.hide_all()

        if (cc.isValid(this.btn_retry)) {
            this.btn_retry.active = true
        }
    }

    deal_data(data) {
        if (data) {
            console.log("HotUpdate deal_data ==" + JSON.stringify(data))
            this.m_versionInfo = {}
            if (data.resinfo) {
                this.m_versionInfo = data.resinfo
            }
            if (data.bakaddrs) {
                this.m_versionInfo.urlList = data.bakaddrs
            }
            NetModel.setUseDun(data.shield)
        }
        if (data && data.ver) {
            let ver = data.ver
            if (ver.ver && ver.url) {
                this.m_ver = ver
                let appver = SdkManager.getInstance().getAppVer()
                if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
                    if (typeof (appver) == "string") {
                        if (this.versionCompareHandle(appver, ver.ver) >= 0) {
                            this.initUpdate()
                        } else {
                            this.showJumpUrl(ver.url)
                        }
                    } else {
                        this.showJumpUrl(ver.url)
                    }
                } else {
                    this.gameEnter()
                }
            } else {
                this.JsonError({ code: -100 })
            }
        } else {
            this.JsonError({ code: -100 })
        }
    }

    checkStorageVersion() {
        if (!jsb || !jsb.fileUtils) {
            return
        }

        let utils = jsb.fileUtils
        let version = SdkManager.getInstance().getAppVer()
        if (version) {
            // 之前保存在 local Storage 中的版本号，如果没有，则认为是新版本
            //取一下本地版本号
            let packVer = LocalDB.getString(PACKAGE_VERSION_DB_KEY, "")
            if (packVer) {
                if (this.versionCompareHandle(version, packVer) != 0) {
                    LocalDB.setString(PACKAGE_VERSION_DB_KEY, version)
                    let spath = this.getStoragePath()
                    if (utils.isDirectoryExist(spath) && utils.removeDirectory(spath)) {
                        this.gameRestart()
                    }
                }
            } else {
                LocalDB.setString(PACKAGE_VERSION_DB_KEY, version)
                let spath = this.getStoragePath()
                if (utils.isDirectoryExist(spath) && utils.removeDirectory(spath)) {
                    this.gameRestart()
                }
            }
        }
    }

    showJumpUrl(url) {
        this.m_jumpUrl = url
        this.hide_all()
        this.btn_download.active = true
        this.txt_info.string = "检测到新版本，您需要下载最新的包"
    }

    click_download() {
        if (this.m_jumpUrl) {
            cc.sys.openURL(this.m_jumpUrl)
        }
    }

    hide_all() {
        if (cc.isValid(this.btn_update)) {
            this.btn_update.active = false
        }
        if (cc.isValid(this.btn_download)) {
            this.btn_download.active = false
        }
        if (cc.isValid(this.btn_retry)) {
            this.btn_retry.active = false
        }
    }

    getStoragePath() {
        return ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset')
    }

    initUpdate() {
        console.log("initUpdate start")
        this.m_storagePath = this.getStoragePath()

        this.releaseCheckTimer()
        this.checkNeedModifyManifest()

        if (this.m_am) {
            this.m_am = null
        }

        this.m_am = new jsb.AssetsManager('', this.m_storagePath, this.versionCompareHandle)
        this.m_am.setVerifyCallback(this.verifyAssetFile.bind(this))

        if (cc.isValid(this.txt_info)) {
            this.txt_info.string = '正在检测更新'
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.m_am.setMaxConcurrentTask(2)
        }
        if (cc.isValid(this.bar_mask)) {
            this.bar_mask.width = 0
        }
        this.m_checkTimer = this.checkUpdate.bind(this)
        this.scheduleOnce(this.m_checkTimer, 1)
        console.log("initUpdate end")
    }

    releaseCheckTimer() {
        if (this.m_checkTimer) {
            this.unschedule(this.m_checkTimer)
            this.m_checkTimer = null
        }
    }

    checkUpdate() {
        if (this.m_updating) {
            this.txt_info.string = '正在检测更新...'
            return
        }
        if (this.m_am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            //直接通过url转换管线来转
            // let uuid = cc.resources.getInfoWithPath('cacert').uuid;
            // let url = cc.assetManager.utils.getUrlWithUuid(uuid, { isNative: true, ext: '.pem' });
            this.m_am.loadLocalManifest(this.manifestUrl.nativeUrl)
        }
        if (!this.m_am.getLocalManifest() || !this.m_am.getLocalManifest().isLoaded()) {
            this.txt_info.string = '解析本地 manifest 文件失败'
            this.gameError()
            return
        }
        this.m_am.setEventCallback(this.checkCb.bind(this))

        this.m_am.checkUpdate()
        this.m_updating = true
    }

    hotUpdate() {
        if (this.m_am && !this.m_updating) {
            console.log("hotUpdate start")
            this.txt_info.string = '正在更新...'
            this.bar_mask.parent.active = true

            this.m_am.setEventCallback(this.updateCb.bind(this))

            if (this.m_am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                //直接通过url转换管线来转
                // let uuid = cc.resources.getInfoWithPath('cacert').uuid;
                // let url = cc.assetManager.utils.getUrlWithUuid(uuid, { isNative: true, ext: '.pem' });
                this.m_am.loadLocalManifest(this.manifestUrl.nativeUrl)
            }

            this.m_failCount = 0
            this.m_am.update()
            this.hide_all()
            this.m_updating = true
            LocalDB.set(DOWNLOAD_FILE_ERROR_KEY, 1)
            console.log("hotUpdate end")
        }
    }

    verifyCallback(path, asset) {
        // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        let compressed = asset.compressed
        // Retrieve the correct md5 value.
        let expectedMD5 = asset.md5
        // asset.path is relative path and path is absolute.
        let relativePath = asset.path
        // The size of asset file, but this value could be absent.
        let size = asset.size
        if (compressed) {
            this.txt_info.string = "Verification passed : " + relativePath
            return true
        }
        else {
            this.txt_info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')'
            return true
        }
    }

    /**
     * 下载文件校验
     * @param path       下载成功的文件路径
     * @param asset      manifest中的文件属性
     */
    verifyAssetFile(path, asset) {
        //console.log(`verifyAssetFile path=${path}, size=${asset.size}, md5=${asset.md5}`)
        //使用jsb.fileUtils.getDataFromFile读取文件内容，计算md5
        const md5str = JSB_MD5.calMD5OfFile(jsb.fileUtils["getDataFromFile"](path))
        //console.log(`Verification md5str: =${md5str}`)
        //与曾经manifest中的md5做比较
        if (md5str === asset.md5) {
            return true
        }

        //md5不相同，删除下载的错误文件
        if (jsb.fileUtils.isFileExist(path)) {
            jsb.fileUtils.removeFile(path)
        }
        console.log(`Verification passed: path=${path}, filemd5=${md5str}, md5=${asset.md5}`)
        //返回false，重新下载
        return false
    }

    versionCompareHandle(versionA, versionB) {
        console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB)
        let vA = versionA.split('.')
        let vB = versionB.split('.')
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i])
            let b = parseInt(vB[i] || 0)
            if (a === b) {
                continue
            } else {
                return a - b
            }
        }
        if (vB.length > vA.length) {
            return -1
        } else {
            return 0
        }
    }

    checkCb(event) {
        console.log('Code: ' + event.getEventCode())
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.txt_info.string = "解析本地 manifest 文件失败"
                this.gameError()
                break
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.txt_info.string = "下载 manifest 文件失败"
                this.gameError()
                break
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.txt_info.string = "解析 manifest 文件失败"
                this.gameError()
                break
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.txt_info.string = "您已是最新版本，正在进入游戏"
                this.gameEnter()
                break
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.txt_info.string = '发现新版本，是否更新？'
                this.hide_all()
                this.btn_update.active = true
                this.bar_mask.width = 0
                break
            default:
                return
        }

        this.m_am.setEventCallback(null)
        this.m_updating = false
    }

    updateCb(event) {
        let needRestart = false
        let failed = false
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.txt_info.string = '解析本地 manifest 文件失败'
                failed = true
                break
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let progress = event.getPercent()
                //this.bar.progress = event.getPercentByFile()
                if (typeof progress == "number") {
                    if (progress != progress) {
                        progress = 0
                    }
                    this.bar_mask.width = progress * this.m_barWidth
                    this.txt_info.string = "资源下载中..." + Math.floor(progress * 100) + "%"
                }
                break
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.txt_info.string = "下载 manifest 文件失败"
                failed = true
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.txt_info.string = '解析 manifest 文件失败'
                failed = true
                break
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.txt_info.string = '您已是最新版本，正在进入游戏'
                this.gameEnter()
                break
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.txt_info.string = '更新完成，正在进入游戏'
                needRestart = true
                break
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.txt_info.string = '资源下载失败,请重试'
                this.hide_all()
                this.btn_retry.active = true
                this.m_updating = false
                this.m_canRetry = true
                console.log("资源下载失败:" + event.getMessage())
                break
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.txt_info.string = '更新失败,请重试'
                console.log("更新失败:" + event.getAssetId() + "," + event.getMessage())
                failed = true
                this.m_deldir = true
                break
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.txt_info.string = event.getMessage()
                failed = true
                break
            default:
                break
        }

        if (failed) {
            this.m_am.setEventCallback(null)
            this.m_updating = false
            this.gameError()
            return
        }

        if (needRestart) {
            this.m_am.setEventCallback(null)
            // Prepend the manifest's search path
            let searchPaths = jsb.fileUtils.getSearchPaths()
            let newPaths = this.m_am.getLocalManifest().getSearchPaths()
            console.log(JSON.stringify(newPaths))
            Array.prototype.unshift.apply(searchPaths, newPaths)
            LocalDB.set('HotUpdateSearchPaths', JSON.stringify(searchPaths))
            jsb.fileUtils.setSearchPaths(searchPaths)

            LocalDB.remove(DOWNLOAD_FILE_ERROR_KEY)
            cc.audioEngine.stopAll()
            this.gameRestart()
        }
    }

    retry() {
        if (!this.m_updating && this.m_canRetry) {
            this.btn_retry.active = false
            this.m_canRetry = false

            this.txt_info.string = '重新下载资源...'
            this.m_am.downloadFailedAssets()
        } else {
            //换一个新的域名地址，写到project.manifest
            if (this.m_versionInfo && this.m_versionInfo.urlList && (this.m_hotIdx + 1 < this.m_versionInfo.urlList.length)) {
                this.m_hotIdx = this.m_hotIdx + 1
                let newhost = this.m_versionInfo.urlList[this.m_hotIdx]
                console.log("retry newhost:" + newhost)
                if (newhost) {
                    let re = /(https?:\/\/)(.+)(\/update.+)/
                    this.m_versionInfo.packageUrl = this.m_versionInfo.packageUrl.replace(re, "$1" + newhost + "$3")
                    this.m_versionInfo.remoteManifestUrl = this.m_versionInfo.remoteManifestUrl.replace(re, "$1" + newhost + "$3")
                    this.m_versionInfo.remoteVersionUrl = this.m_versionInfo.remoteVersionUrl.replace(re, "$1" + newhost + "$3")
                    this.initUpdate()
                } else {
                    this.gameRestart()
                }
            } else {
                this.gameRestart()
            }
        }
    }

    gameRestart() {
        this.clearStorage()
        cc.game.restart()
    }

    gameExit() {
        this.clearStorage()
        cc.game.end()
    }

    gameEnter() {
        LocalDB.remove(DOWNLOAD_FILE_ERROR_KEY)
        this.releaseCheckTimer()
        this.txt_info.string = '加载中...'
        if (this.m_versionInfo) {
            LocalDB.setObject(GameDef.LOCAL_UPDATEURL_KEY, this.m_versionInfo)
            LocalDB.setString(GameDef.LOCAL_VERSION_KEY, this.m_versionInfo.version)
        }
        this.scheduleOnce(this.enterCall.bind(this), 1)
    }

    gameError() {
        this.hide_all()
        this.btn_retry.active = true
    }

    enterCall() {
        cc.director.loadScene("G_Launch")
    }

    clearStorage() {
        //文件更坏了，删除更新目录
        if (this.m_deldir) {
            let spath = this.getStoragePath()
            if (jsb.fileUtils.isDirectoryExist(spath)) {
                jsb.fileUtils.removeDirectory(spath)
            }
            this.m_deldir = false
        }
    }

    checkDownloadErrorFile() {
        //检测下错误文件下载的标志
        let dlfile_errortag = LocalDB.get(DOWNLOAD_FILE_ERROR_KEY)
        console.log("checkDownloadErrorFile dlfile_errortag==" + dlfile_errortag)
        if (dlfile_errortag) {
            let spath = this.getStoragePath()
            if (jsb.fileUtils.isDirectoryExist(spath)) {
                jsb.fileUtils.removeDirectory(spath)
            }
        }
        LocalDB.remove(DOWNLOAD_FILE_ERROR_KEY)
    }

    //设置下需要传给服务器的参数
    initExParams() {
        if (!LocalDB.getString(GameDef.LOCAL_MACID_KEY)) {
            LocalDB.setString(GameDef.LOCAL_MACID_KEY, Tools.getRandMacId())
        }
        let params = {
            gameid: GameDef.APP_GAMEID,
            macid: LocalDB.getString(GameDef.LOCAL_MACID_KEY),
            device: cc.sys.os,
            resVersion: LocalDB.getString(GameDef.LOCAL_VERSION_KEY, cfg.Version),
            osVersion: cc.sys.osVersion
        }

        let exlist = []
        for (const key in params) {
            exlist.push(key + "=" + params[key])
        }

        this.m_uploadParams = exlist.length > 0 ? "&" + exlist.toString().replace(/,/g, '&') : ""

        console.log("this.m_uploadParam:" + this.m_uploadParams)

    }

    //检测是否需要修改.manifest文件 
    checkNeedModifyManifest() {
        if (!cc.sys.isNative) return
        if (!this.m_versionInfo || !Tools.isMap(this.m_versionInfo)) return
        console.log("this.m_verionInfo=" + JSON.stringify(this.m_versionInfo))
        try {
            if (jsb.fileUtils.isFileExist(this.m_storagePath + '/project.manifest')) {
                console.log("有下载的manifest文件")
                let loadManifest = jsb.fileUtils.getStringFromFile(this.m_storagePath + '/project.manifest')
                let manifestObject = JSON.parse(loadManifest)
                if (manifestObject.packageUrl != this.m_versionInfo.packageUrl || manifestObject.remoteManifestUrl != this.m_versionInfo.remoteManifestUrl || manifestObject.remoteVersionUrl != this.m_versionInfo.remoteVersionUrl) {
                    manifestObject.packageUrl = this.m_versionInfo.packageUrl
                    manifestObject.remoteManifestUrl = this.m_versionInfo.remoteManifestUrl
                    manifestObject.remoteVersionUrl = this.m_versionInfo.remoteVersionUrl
                    let afterString = JSON.stringify(manifestObject)
                    console.log("111 packageUrl : ", manifestObject.packageUrl)
                    console.log("111 remoteManifestUrl : ", manifestObject.remoteManifestUrl)
                    console.log("111 remoteVersionUrl : ", manifestObject.remoteVersionUrl)
                    let isWritten = jsb.fileUtils.writeStringToFile(afterString, this.m_storagePath + '/project.manifest')
                    //更新新请求地址，下次如果检测到不一致就重新修改 manifest 文件
                    console.log("111 Written Status : ", isWritten)
                }

            } else {
                console.log("本地还没有下载的manifest文件")
                let initializedManifestPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset')
                if (!jsb.fileUtils.isDirectoryExist(initializedManifestPath)) jsb.fileUtils.createDirectory(initializedManifestPath)

                //读取包里面带的manifest文件,把版本号信息读出来
                let originManifestPath = this.manifestUrl.url
                let originManifest = jsb.fileUtils.getStringFromFile(originManifestPath)
                let originManifestObject = JSON.parse(originManifest)

                //手动生成一个原始manifest文件
                originManifestObject.packageUrl = this.m_versionInfo.packageUrl
                originManifestObject.remoteManifestUrl = this.m_versionInfo.remoteManifestUrl
                originManifestObject.remoteVersionUrl = this.m_versionInfo.remoteVersionUrl

                let afterString = JSON.stringify(originManifestObject)
                console.log("222 packageUrl : ", originManifestObject.packageUrl)
                console.log("222 remoteManifestUrl : ", originManifestObject.remoteManifestUrl)
                console.log("222 remoteVersionUrl : ", originManifestObject.remoteVersionUrl)
                let isWritten = jsb.fileUtils.writeStringToFile(afterString, initializedManifestPath + '/project.manifest')
                console.log("222 Written Status : ", isWritten)
            }
        } catch (error) {
            console.log("读写manifest文件错误!!!(请看错误详情-->) ", error)
        }
    }

}
