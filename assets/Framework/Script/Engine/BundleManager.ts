import { GameDef } from "../../../Games/Common/Script/GameDef";

const { ccclass, property } = cc._decorator;

export type CompletedBundleCallBack = (error: Error, bundle: cc.AssetManager.Bundle) => void;
export type LoadResCompletedCallBack = (error: Error, resources: any) => void;
export type PreLoadResCompletedCallBack = (error: Error, resources: cc.AssetManager.RequestItem[]) => void;

//处理bundle资源包的加载
@ccclass
export default class BundleManager extends cc.Component {
    private static mInstance: BundleManager = null;

    private m_bundleCache = null //存储已加载的bundle对象

    private m_bundleApp = null //子游戏的入口脚本文件

    public static getInstance() {
        if (!this.mInstance) {
            this.mInstance = new BundleManager();
            this.mInstance.init()
        }
        return this.mInstance;
    }

    init() {
        this.m_bundleCache = {}
        this.m_bundleApp = {}
    }

    uninit() {
        this.releaseBundle()
        this.m_bundleCache = null
        this.m_bundleApp = null
    }

    /**
     * 移除加载过缓存下来的bundle包，且释放包内的所有资源(目前发现只是释放内存资源，但是不会清除缓存资源)
     * @param name 
     */
    releaseBundle(name: string = null, clearCache = false) {
        console.log("BundleManager releaseBundle name:" + name)
        let isfind = false
        for (const key in this.m_bundleCache) {
            if (name == key) {
                isfind = true
            }
            let bundle = cc.assetManager.getBundle(key);
            if (bundle) {
                bundle.releaseAll();
                cc.assetManager.removeBundle(bundle);
                this.m_bundleApp[key].clearData()

                this.m_bundleApp[key] = null
                this.m_bundleCache[key] = null

                // if (clearCache && cc.sys.isNative) {
                //     let cacheFiles = cc.assetManager.cacheManager.cachedFiles;
                //     if (cacheFiles) {
                //         cacheFiles.forEach((file, k) => {
                //             if (file.bundle && file.bundle == key) {
                //                 console.log("removeCache key====" + key)
                //                 cc.assetManager.cacheManager.removeCache(k); //提示有问题，先无视报红
                //             }
                //         });
                //     }
                // }
            }
            if (isfind) {
                break
            }
        }
    }

    /**
     * 释放bundle中的所有资源
     */
    releaseBundleAllRes(name: string) {
        if (this.m_bundleCache[name]) {
            let bundle = cc.assetManager.getBundle(name);
            if (bundle) {
                bundle.releaseAll();
            }
        }
    }


    /**
     * 释放bundle中的某个资源
     * @param name 
     * @param url 
     * @param type 
     */
    releaseBundleRes(name: string, url: string, type: typeof cc.Asset) {
        if (this.m_bundleCache[name]) {
            let bundle = cc.assetManager.getBundle(name);
            if (bundle) {
                bundle.release(url, type);
            }
        }
    }

    /**
   * 仅移除加载过缓存下来的bundle包，包内的资源不会自动释放
   * @param name
   */
    removeBundle(name: string) {
        if (this.m_bundleCache[name]) {
            let bundle = cc.assetManager.getBundle(name);
            if (bundle) {
                cc.assetManager.removeBundle(bundle);
                this.m_bundleCache[name] = null
                this.m_bundleApp[name] = null
            }
        }
    }

    /**
     * 加载bundle
     * @param name 地址或名称
     * @param onCompleted 加载完成回调
     */
    loadBundle(name: string, onCompleted: CompletedBundleCallBack) {
        console.log("BundleManager loadBundle start name:" + name)
        let finishCallBack = (error, bundle: cc.AssetManager.Bundle) => {
            if (bundle) {
                console.log("BundleManager loadBundle finish name:" + name)
                if (!this.m_bundleCache[name]) {
                    this.m_bundleCache[name] = bundle
                }
                this.initApp(name, (result) => {
                    if (result == 1) {
                        if (onCompleted) {
                            onCompleted(error, bundle)
                        }
                    }
                })
            }
        }
        cc.assetManager.loadBundle(this.getBundlePath(name), finishCallBack);
    }

    /**
     * 加载bundle，通过hash指定的方式
     * @param name 
     * @param hashV 
     * @param onCompleted 
     */
    loadBundleByHash(name: string, hashV: string, onCompleted: CompletedBundleCallBack) {
        cc.assetManager.loadBundle(name, { version: `${hashV}` }, onCompleted);
    }

    /**
     * 通过bundle包名获取加载过缓存下来的bundle资源
     * @param name 
     */
    getBundle(name: string): cc.AssetManager.Bundle {
        return this.m_bundleCache[name];
    }


    /**
     * 通过场景名获取配置的bundle信息
     * @param name 
     */
    getBundleInfoByScene(name: string) {
        let info
        for (const key in GameDef.GNAMES) {
            let ginfo = GameDef.GNAMES[key]
            if (name == ginfo.scname) {
                info = ginfo
                break
            }
        }
        return info
    }

    /**
     * 加载bundle中的资源
     * @param name bundle名
     * @param url 资源路径
     * @param type 资源类型
     * @param loadCompleted 
     */
    loadRes(name: string, url: string, type: typeof cc.Asset, loadCompleted: LoadResCompletedCallBack) {
        if (this.m_bundleCache[name]) {
            this.m_bundleCache[name].load(url, type, loadCompleted);
        }
    }


    /**
     * 加载bundle中dir中资源
     * @param name bundle名
     * @param url 资源路径
     * @param loadCompleted 
     */
    loadDirRes(name: string, url: string, type: typeof cc.Asset, loadCompleted: LoadResCompletedCallBack) {
        if (this.m_bundleCache[name]) {
            if (type) {
                this.m_bundleCache[name].loadDir(url, type, loadCompleted);
            } else {
                this.m_bundleCache[name].loadDir(url, loadCompleted);
            }
        }
    }


    /**
     * 加载bundle中的场景
     * @param name bundle名
     * @param sceneUrl 场景资源路径
     * @param type 资源类型
     * @param loadCompleted 
     * @returns 该方法只会加载场景，而不会运行场景，如需运行请使用 `cc.director.runScene` 
     */
    loadScene(name: string, sceneUrl: string, loadCompleted: LoadResCompletedCallBack) {
        let finishCallBack = (error, bundle) => {
            if (!error) {
                bundle.loadScene(sceneUrl, loadCompleted);
            }
        }
        this.loadBundle(name, finishCallBack)
    }


    /**
     * 预加载bundle中的资源
     * @param name 
     * @param url 
     * @param type 
     * @param loadCompleted 
     */
    preloadRes(name: string, url: string, type: typeof cc.Asset, preloadCompleted: PreLoadResCompletedCallBack) {
        if (this.m_bundleCache[name]) {
            this.m_bundleCache[name].preload(url, type, preloadCompleted);
        }
    }


    /**
     * 预加载bundle中dir中的资源
     * @param name 
     * @param url 
     * @param type 
     * @param preloadCompleted 
     */
    preloadDirRes(name: string, url: string, type: typeof cc.Asset, preloadCompleted: PreLoadResCompletedCallBack) {
        if (this.m_bundleCache[name]) {
            this.m_bundleCache[name].preloadDir(url, type, preloadCompleted);
        }
    }


    //bundle根目录路径
    getBundleRootPath() {
        return cc.sys.isNative ? ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset/assets/Games/') : ""
    }

    //获取bundle真实路径(先看存储空间里有没有，没有从内置包里读取)
    getBundlePath(bundlename) {
        let dir = this.getBundleRootPath() + bundlename
        if (cc.sys.isNative) {
            if (!jsb.fileUtils.isDirectoryExist(dir) || this.inAppByBundleName(bundlename)) {
                dir = bundlename
            }
        }
        console.log("getBundlePath dir:" + dir)
        return dir
    }

    initApp(bundlename, callback?) {
        if (!this.m_bundleApp[bundlename]) {
            import(bundlename).then(app => {
                console.log("initApp import bundle=====" + bundlename);
                this.m_bundleApp[bundlename] = app.default.getInstance()
                if (callback) {
                    callback(1)
                }
            }).catch(err => {
                console.log("err=====" + err)
            })
        } else {
            if (callback) {
                callback(1)
            }
        }
    }

    getAppByGameName(gamename) {
        let gameid = GameDef.GIDS[gamename]
        return this.m_bundleApp[GameDef.GNAMES[gameid].bdname]
    }

    getAppByGameId(gameid) {
        return this.m_bundleApp[GameDef.GNAMES[gameid].bdname]
    }

    getAppByBundleName(bundlename) {
        return this.m_bundleApp[bundlename]
    }

    //是否是内置的bundle(通过gameid查询)
    inAppByGameId(gameid) {
        return GameDef.GNAMES[gameid].bdname && GameDef.GNAMES[gameid].inapp == 1
    }

    //是否是内置的bundle(通过bundlename查询)
    inAppByBundleName(bundlename) {
        for (const key in GameDef.GNAMES) {
            let ginfo = GameDef.GNAMES[key]
            if (ginfo.bdname && ginfo.bdname == bundlename && ginfo.inapp == 1) {
                return true
            }
        }
        return false
    }

}
