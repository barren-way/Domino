import AudioManager from "../../../Framework/Script/Engine/AudioManager";

//resource资源加载控制
const { ccclass, property } = cc._decorator;

@ccclass
export default class ResLoader {

    private static mInstance: ResLoader = null;
    private m_prefabCache = null //存储的已创建的prefab对象
    private m_manifestCache = null //存储已创建的manifest
    private m_spineCache = null //存储已创建的spine


    public static getInstance(): ResLoader {
        if (!ResLoader.mInstance) {
            ResLoader.mInstance = new ResLoader();
            ResLoader.mInstance.init();
        }
        return ResLoader.mInstance;
    }

    public init() {
        this.m_prefabCache = {}
        this.m_manifestCache = {}
        this.m_spineCache = {}
    }

    public uninit() {
        this.clearPrefab()
        this.clearManifest()
    }

    //预加载prefab
    public preloadPrefab(url, callback?) {
        cc.log("preloadPrefab " + url + " start")
        console.time("加载Prefab资源 : " + url);
        return new Promise((reovle, reject) => {
            cc.resources.load(url, (error, prefab) => {
                if (error) {
                    reject(error);
                } else {
                    reovle();
                    if (!this.m_prefabCache[url] && prefab) {
                        this.m_prefabCache[url] = prefab;
                        prefab.addRef()
                    }
                    cc.log("preloadPrefab " + url + " end")
                    console.timeEnd("加载Prefab资源 : " + url)
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    }

    //释放prefab
    public clearPrefab(url?) {
        if (url && this.m_prefabCache[url]) {
            this.m_prefabCache[url].decRef()
            this.m_prefabCache[url] = null
        } else {
            for (const key in this.m_prefabCache) {
                this.m_prefabCache[key].decRef()
                this.m_prefabCache[key] = null
            }
        }
    }

    //取prefab
    public createPrefab(url, callback?) {
        if (this.m_prefabCache[url]) {
            let newnode = cc.instantiate(this.m_prefabCache[url])
            //newnode.parent = parentnode
            if (newnode) {
                newnode.active = false
            }
            if (callback) {
                callback(newnode)
            }
        } else {
            this.preloadPrefab(url, () => {
                if (this.m_prefabCache[url]) {
                    let newnode = cc.instantiate(this.m_prefabCache[url])
                    //newnode.parent = parentnode
                    if (newnode) {
                        newnode.active = false
                    }
                    if (callback) {
                        callback(newnode)
                    }
                }
            })
        }
    }

    /*
        创建prefab对象，立即显示
        url:prefab的路径名
        parentnode:新创建节点的父节点
        callback:新创建节点之后的回调
        checktag:是否需要检测新节点的tagname,(有的prefab只需要创建一次，有的需要重复创建)
    */
    public showPrefab(url, parentnode?, callback?, checktag?) {
        let callFunc = () => {
            cc.log("showPrefab url:" + url)
            let find = false
            let newnode = null
            if (checktag) {
                for (let i = 0; i < parentnode.children.length; i++) {
                    let tmpnode = parentnode.children[i]
                    if (tmpnode["tagname"] && tmpnode["tagname"] == url) {
                        newnode = tmpnode
                        find = true
                        break
                    }
                }
            }

            if (!find) {
                newnode = cc.instantiate(this.m_prefabCache[url])
                newnode.parent = parentnode
                newnode.active = true
                newnode["tagname"] = url
                newnode.setPosition(cc.v2(0, 0))
                AudioManager.getInstance().checkAddDefaultClickClip(newnode)
            } else {
                newnode.active = true
            }

            if (callback) {
                callback(newnode)
            }
        }
        if (this.m_prefabCache[url]) {
            callFunc()
        } else {
            this.preloadPrefab(url, () => {
                if (this.m_prefabCache[url]) {
                    callFunc()
                }
            })
        }
    }

    //==================manifest==============
    //预加载Manifest
    public preloadManifest(bundlename, callback?) {
        cc.log("preloadManifest bundlename start:" + bundlename)
        let url = "Manifest/" + bundlename + "/project"
        cc.resources.load(url, (err, manifest) => {
            if (!this.m_manifestCache[bundlename]) {
                this.m_manifestCache[bundlename] = manifest;
                manifest.addRef()
            }
            cc.log("preloadManifest bundlename end:" + bundlename)
            if (callback) {
                callback();
            }
        });
    }

    //释放Manifest
    public clearManifest(bundlename?) {
        if (bundlename && this.m_manifestCache[bundlename]) {
            this.m_manifestCache[bundlename].decRef()
            this.m_manifestCache[bundlename] = null
        } else {
            for (const key in this.m_manifestCache) {
                this.m_manifestCache[key].decRef()
                this.m_manifestCache[key] = null
            }
        }
    }

    public getManifest(bundlename) {
        return this.m_manifestCache[bundlename]
    }

    //spine
    //预加载Spine
    public preloadSpine(url, callback?) {
        cc.log("preloadSpine " + url + " start")
        console.time("加载spine资源 : " + url);
        return new Promise((reovle, reject) => {
            cc.resources.load(url, sp.SkeletonData, (error, skeletonData: sp.SkeletonData) => {
                if (error) {
                    reject(error);
                } else {
                    reovle();
                    if (!this.m_spineCache[url] && skeletonData) {
                        this.m_spineCache[url] = skeletonData;
                        skeletonData.addRef()
                    }
                    cc.log("preloadSpine " + url + " end")
                    console.timeEnd("加载spine资源 : " + url)
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    }

    //释放Spine
    public clearSpine(url?) {
        if (url && this.m_spineCache[url]) {
            this.m_spineCache[url].decRef()
            this.m_spineCache[url] = null
        } else {
            for (const key in this.m_spineCache) {
                this.m_spineCache[key].decRef()
                this.m_spineCache[key] = null
            }
        }
    }

    public clearSpineByNode(parentnode) {
        let _skeletonData
        if (parentnode) {
            let ske = parentnode.getComponent(sp.Skeleton)
            parentnode.removeComponent(sp.Skeleton)
            if (ske) {
                _skeletonData = ske.skeletonData
                for (const key in this.m_spineCache) {
                    if (this.m_spineCache[key] == _skeletonData) {
                        this.m_spineCache[key].decRef()
                        this.m_spineCache[key] = null
                        break
                    }
                }
            }
        }
    }

    public showSpine(url, parentnode?, callback?, checktag?) {
        let callFunc = () => {
            cc.log("showSpine url:" + url)
            let ske = parentnode.getComponent(sp.Skeleton)

            if (!ske) {
                ske = parentnode.addComponent(sp.Skeleton)
                ske.skeletonData = this.m_spineCache[url]
                ske.premultipliedAlpha = false
                ske.setAnimation(0, "animation", true)
                ske["tagname"] = url
            } else {
                ske.setAnimation(0, "animation", true)
            }

            if (callback) {
                callback()
            }
        }
        if (this.m_spineCache[url]) {
            callFunc()
        } else {
            this.preloadSpine(url, () => {
                if (this.m_spineCache[url]) {
                    callFunc()
                }
            })
        }
    }
}
