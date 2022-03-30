import BundleManager from "../../../../Framework/Script/Engine/BundleManager"
import JSB_MD5 from "../../../../Framework/Script/Engine/jsb_md5"
import LocalDB from "../../../../Framework/Script/Engine/LocalDB"
import Manager from "../../../../Framework/Script/Engine/Manager"
import { GameDef } from "../GameDef"
import GlobalUI from "../GlobalUI"
import ResLoader from "../ResLoader"
import Tools from "../Tools"


const { ccclass, property } = cc._decorator

//子游戏热更脚本
@ccclass
export default class BundleHotUpdate extends cc.Component {

    private mBundleName = ""

    private manifestUrl = null

    private m_am = null
    private m_updating = false
    private m_updatestr = ""
    private m_canRetry = false
    private m_storagePath = ''
    private m_failCount = 0
    private m_deldir = false;//清空目录

    private m_versionInfo = null//服务器下发的版本信息

    private m_checkTimer = null //检测更新等待计时器

    //备用热更地址索引
    private m_hotIdx = 0

    private m_updateCallback = null; //更新结束回调

    private m_checkCallback = null; //检测bundle目录是否存在回调

    private static mInstance: BundleHotUpdate = null;

    public static UPDATE_STATE_FAIL = 0 //更新失败
    public static UPDATE_STATE_SUCCESS = 1 //更新成功
    public static UPDATE_STATE_PROGRESS = 2 //更新中

    onLoad() {
    }

    public static getInstance() {
        if (!this.mInstance) {
            this.mInstance = new BundleHotUpdate()
        }
        return this.mInstance;
    }

    init() {

    }

    uninit() {
        this.releaseUpdate()
        Manager.getInstance().hideGlobalUI(GlobalUI.TYPE_CREATE_BDUPDATE)
    }

    releaseUpdate() {
        console.log("BundleHotUpdate releaseUpdate start")
        if (this.m_am) {
            this.m_am.setEventCallback(null)
            this.m_am = null
        }
        this.releaseCheckTimer()
        console.log("BundleHotUpdate releaseUpdate end")
    }

    getStoragePath() {
        return ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset/assets/Games/' + this.mBundleName)
    }

    checkBundleExist(gameid, callback?) {
        this.m_checkCallback = callback
        this.mBundleName = GameDef.GNAMES[gameid].bdname
        console.log("BundleHotUpdate checkBundleExist this.mBundleName==" + this.mBundleName)
        let ret = false
        if (!cc.sys.isNative) {
            ret = true
        } else {
            this.m_storagePath = this.getStoragePath()
            if (jsb.fileUtils.isDirectoryExist(this.m_storagePath) || BundleManager.getInstance().inAppByGameId(gameid)) {
                ret = true
            }
        }
        return ret
    }

    checkBundleUpdate(gameid, callback?) {
        this.m_updateCallback = callback
        this.mBundleName = GameDef.GNAMES[gameid].bdname
        console.log("BundleHotUpdate checkBundleUpdate this.mBundleName==" + this.mBundleName)
        if (!cc.sys.isNative || BundleManager.getInstance().inAppByGameId(gameid)) { //如果是内置的就无须检测bundle更新
            this.hotUpdateFinish(true)
            return
        }
        this.m_storagePath = this.getStoragePath()
        this.manifestUrl = ResLoader.getInstance().getManifest(this.mBundleName)
        if (!this.manifestUrl) {
            //没有manifest,需要加载一下
            ResLoader.getInstance().preloadManifest(this.mBundleName, () => {
                this.manifestUrl = ResLoader.getInstance().getManifest(this.mBundleName)
                this.startUpdate()
            })
        } else {
            this.startUpdate()
        }

        console.log("BundleHotUpdate checkBundleUpdate end")

    }

    startUpdate() {
        console.log("BundleHotUpdate startUpdate start")
        //检测一下本地版本号和包体版本号是否一致
        this.m_hotIdx = -1

        this.m_versionInfo = { version: "0.0.1" }

        let curVer = "0.0.1"
        let urlInfos = LocalDB.getObject(GameDef.LOCAL_UPDATEURL_KEY)
        let gameVers = LocalDB.getObject(GameDef.LOCAL_SUBGAME_VERSION)
        if (urlInfos) {
            if (gameVers && gameVers[this.mBundleName]) {
                curVer = gameVers[this.mBundleName]
            }

            //把后面的版本好捨棄
            let tmpstr = urlInfos.packageUrl.substr(0, urlInfos.packageUrl.length - 1)
            let index = tmpstr.lastIndexOf("/")
            let newurl = tmpstr.substr(0, index + 1)

            console.log("newurl===" + newurl)
            let expath = this.mBundleName + "/" + curVer + "/"
            this.m_versionInfo.packageUrl = newurl + expath
            this.m_versionInfo.remoteManifestUrl = newurl + expath + "project.manifest"
            this.m_versionInfo.remoteVersionUrl = newurl + expath + "version.manifest"
            this.m_versionInfo.version = curVer

            if (urlInfos.urlList) {
                this.m_versionInfo.urlList = Tools.clone(urlInfos.urlList)
            }

            //格式例子
            // {
            //     "packageUrl": "http://192.168.0.71/download/lecong/update/package_update/DouDiZhu/0.1.1/",
            //     "remoteManifestUrl": "http://192.168.0.71/download/lecong/update/package_update/DouDiZhu/0.1.1/project.manifest",
            //     "remoteVersionUrl": "http://192.168.0.71/download/lecong/update/package_update/DouDiZhu/0.1.1/version.manifest",
            //     "version": "0.1.1"
            // }

        }

        console.log("this.m_versionInfo===" + JSON.stringify(this.m_versionInfo))

        let curSaveVer = LocalDB.getString(this.mBundleName + "_resver")
        console.log("curSaveVer1:" + curSaveVer)
        //如果还没更新过，拿包里面的版本号比较一下
        if (!curSaveVer) {
            //读取包里面带的manifest文件,把版本号信息读出来
            let originManifestPath = this.manifestUrl.url
            let originManifest = jsb.fileUtils.getStringFromFile(originManifestPath)
            let originManifestObject = JSON.parse(originManifest)
            curSaveVer = originManifestObject.version
            console.log("curSaveVer2:" + curSaveVer)
        }
        
        if (this.versionCompareHandle(curSaveVer, this.m_versionInfo.version) < 0) {
            Manager.getInstance().showGlobalUI(GlobalUI.TYPE_CREATE_BDUPDATE)
            this.initUpdate()
        } else {
            this.hotUpdateFinish(true)
        }

        console.log("BundleHotUpdate startUpdate end")
    }


    initUpdate() {
        console.log("BundleHotUpdate initUpdate start")

        this.releaseCheckTimer()
        this.checkNeedModifyManifest()

        if (this.m_am) {
            this.m_am = null
        }

        this.m_am = new jsb.AssetsManager('', this.m_storagePath, this.versionCompareHandle)
        this.m_am.setVerifyCallback(this.verifyAssetFile.bind(this))

        //console.log('正在检测更新,当前版本:' + this.m_am.getLocalManifest().getVersion())

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.m_am.setMaxConcurrentTask(2)
        }
        this.m_checkTimer = this.checkUpdate.bind(this)
        this.scheduleOnce(this.m_checkTimer, 1)
        console.log("BundleHotUpdate initUpdate end")
    }

    releaseCheckTimer() {
        if (this.m_checkTimer) {
            this.unschedule(this.m_checkTimer)
            this.m_checkTimer = null
        }
    }

    checkUpdate() {
        console.log('BundleHotUpdate checkUpdate start')
        if (this.m_updating) {
            console.log('正在检测更新')
            return
        }
        if (this.m_am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            this.m_am.loadLocalManifest(this.manifestUrl.nativeUrl)
        }
        if (!this.m_am.getLocalManifest() || !this.m_am.getLocalManifest().isLoaded()) {
            this.m_updatestr = '加载manifest文件失败'
            this.showLog(this.m_updatestr)
            this.hotUpdateFinish(false)
            return
        }
        this.m_am.setEventCallback(this.checkCb.bind(this))

        this.m_am.checkUpdate()
        this.m_updating = true
        console.log('BundleHotUpdate checkUpdate end')
    }

    hotUpdate() {
        if (this.m_am && !this.m_updating) {
            console.log("BundleHotUpdate hotUpdate start")
            console.log('正在更新...')

            this.m_am.setEventCallback(this.updateCb.bind(this))

            if (this.m_am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                console.log("BundleHotUpdate hotUpdate 111111")
                this.m_am.loadLocalManifest(this.manifestUrl.nativeUrl)
            }

            this.m_failCount = 0
            this.m_am.update()
            this.m_updating = true
            console.log("BundleHotUpdate hotUpdate end")
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
        console.log('BundleHotUpdate checkCb Code: ' + event.getEventCode())
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog("没有发现本地manifest文件，跳过了热更新.");
                this.hotUpdateFinish(true)
                break
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.m_updatestr = "下载 manifest 文件失败"
                this.showLog(this.m_updatestr)
                this.hotUpdateFinish(false)
                break
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.m_updatestr = "解析 manifest 文件失败"
                this.showLog(this.m_updatestr)
                this.hotUpdateFinish(false)
                break
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog("您已是最新版本，正在进入游戏")
                this.hotUpdateFinish(true)
                break
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.showLog('发现新版本，需要更新')
                this.m_updating = false;
                this.hotUpdate()
                return
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                //有新版本
                let percent = event.getPercent()
                if (isNaN(percent)) return
                var msg = event.getMessage()
                this.showLog("checkCb 更新进度：" + percent + ', msg: ' + msg)
                return;
            default:
                return
        }
        if (this.m_am) {
            this.m_am.setEventCallback(null)
        }
        this.m_updating = false
    }

    updateCb(event) {
        let updateover = 0
        let failed = false
        console.log('BundleHotUpdate updateCb Code: ' + event.getEventCode())
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.m_updatestr = '解析本地 manifest 文件失败'
                this.showLog(this.m_updatestr)
                failed = true
                break
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let percent = event.getPercent()
                if (isNaN(percent)) return
                if (percent > 1) {
                    percent = 1
                }
                this.updateProgress(BundleHotUpdate.UPDATE_STATE_PROGRESS, "下载进度：" + Math.floor(percent * 100) + "%")
                break
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.m_updatestr = "下载 manifest 文件失败"
                this.showLog(this.m_updatestr)
                failed = true
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.m_updatestr = '解析 manifest 文件失败'
                this.showLog(this.m_updatestr)
                failed = true
                break
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog('您已是最新版本，正在进入游戏')
                updateover = 2
                break
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.showLog('更新完成，正在进入游戏')
                updateover = 1
                break
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.m_updatestr = "资源下载失败"
                this.showLog("资源下载失败:" + event.getMessage())
                this.m_updating = false
                this.m_canRetry = true
                failed = true
                break
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.m_updatestr = "更新失败"
                this.showLog("更新失败:" + event.getAssetId() + "," + event.getMessage())
                failed = true
                this.m_deldir = true
                break
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.m_updatestr = "资源解压错误"
                this.showLog('解压错误:' + event.getMessage())
                failed = true
                break
            default:
                break
        }

        if (failed) {
            this.m_am.setEventCallback(null);
            this.m_updating = false;
            this.hotUpdateFinish(false);
        }

        if (updateover > 0) {
            this.m_updating = false
            this.hotUpdateFinish(true, updateover == 1);
        }
    }

    retry() {
        if (!this.m_updating && this.m_canRetry) {
            this.m_canRetry = false
            this.showLog('重新下载资源...')
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
        cc.audioEngine.stopAll()
        this.clearStorage()
        cc.game.restart()
    }

    gameExit() {
        cc.audioEngine.stopAll()
        this.clearStorage()
        cc.game.end()
    }

    showLog(tip) {
        console.log("BundleHotUpdate showLog:" + tip)
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

    //检测是否需要修改.manifest文件 
    checkNeedModifyManifest() {
        if (!cc.sys.isNative) return
        if (!this.m_versionInfo) return
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
                let initializedManifestPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset/assets/Games/' + this.mBundleName)
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

    //热更完成
    hotUpdateFinish(result, updateok?) {
        console.log("hotUpdateFinish result:" + result)
        this.releaseUpdate()
        if (updateok) {
            //热更成功，保存下最新资源版本号
            LocalDB.setString(this.mBundleName + "_resver", this.m_versionInfo.version)
        }
        if (result) {
            this.updateSuccess(updateok)
        } else {
            this.updateProgress(BundleHotUpdate.UPDATE_STATE_FAIL, this.m_updatestr)
        }
    }

    //更新成功逻辑处理
    updateSuccess(updateok) {
        console.log("BundleHotUpdate updateSuccess bundleName:" + this.mBundleName)
        let needrestart = false
        if (updateok && cc.sys.isNative) {
            //下载完成，需要重启游戏(首次下载不需要重启)
            if (BundleManager.getInstance().getBundle(this.mBundleName)) {
                BundleManager.getInstance().releaseBundle(this.mBundleName)
                needrestart = true
            }
        }
        if (needrestart) {
            cc.game.restart()
        } else {
            this.updateProgress(BundleHotUpdate.UPDATE_STATE_SUCCESS, "下载成功")
        }
    }

    //刷新更新进度
    updateProgress(result, updatetip) {
        console.log("updateProgress result:" + result + ",updatetip:" + updatetip)
        let uiscript = Manager.getInstance().getGlobalUI(GlobalUI.TYPE_CREATE_BDUPDATE)
        if (uiscript && uiscript["isShow"]()) {
            cc.director.emit(GameDef.EVENTS.NOTIFY_UPDATEDL_SHOW, { result: result, updatetip: updatetip })
        }
        if (result == BundleHotUpdate.UPDATE_STATE_SUCCESS) {
            BundleManager.getInstance().loadBundle(this.mBundleName, (err, bundle) => {
                if (bundle) {
                    Manager.getInstance().hideGlobalUI(GlobalUI.TYPE_CREATE_BDUPDATE)
                    if (this.m_updateCallback) {
                        this.m_updateCallback(result, updatetip)
                    }
                } else {
                    console.log("BundleHotUpdate updateSuccess loadBundle err:" + err)
                }
            })
        } else {
            if (this.m_updateCallback) {
                this.m_updateCallback(result, updatetip)
            }
        }
    }

}
