import Instance from "../../../Games/Common/Script/Instance";
import AudioManager from "./AudioManager";
import EventHandler from "../Net/EventHandler";
import Dialog from "../Tips/Dialog";
import BundleManager from "./BundleManager";

export default class Manager extends Instance {
    public static CMD_NOOP: number = -1;
    public static CMD_INIT: number = 0;
    public static CMD_LOADING_1: number = 1;
    public static CMD_LOADING_2: number = 2;
    public static CMD_ADDUI: number = 3;
    public static CMD_DESTROY: number = 9;
    public static CMD_REPLACE_SCENE: number = 10;
    public static CMD_CREATE: number = 11;
    public static CMD_DELAYCALLBACK: number = 12;

    private static m_instance: Manager = null;
    private m_cmds: Array<Array<any>> = null;
    private m_count: number;
    private m_root: cc.Node = null;
    private m_launchNode: cc.Node = null;
    private m_pause = false
    private m_sceneData: Object = null;
    private m_sceneScript: cc.Component = null;
    private mMessageBox: cc.Component = null;
    private mRootNode: cc.Node = null;
    private m_loadingScene: String = null;
    private m_curBundleName: string = null;

    //waitani相关
    private mNativeWaitAni: cc.Node = null;
    private mGameWaitAni: cc.Node = null;
    private mWaitAni: Boolean = null;

    //loading相关
    private mLoadingAni: cc.Node = null;

    //全局UI相关
    private mNodGlobalUI: cc.Node = null;

    private mDataStack: Array<any> = null;

    public static getInstance() {
        if (!Manager.m_instance) {
            Manager.m_instance = new Manager();
        }
        return Manager.m_instance;
    }

    public lanuch(node: cc.Node, launchNode: cc.Node): void {
        this.m_cmds = [];
        this.m_count = 0;
        this.mRootNode = node;
        this.m_launchNode = launchNode;
        this.mNativeWaitAni = node.getChildByName("Jvhua");
        if (this.mNativeWaitAni) {
            this.mNativeWaitAni["widget"] = this.mNativeWaitAni.getComponent(cc.Widget);
        }
        let loading = node.getChildByName("loading");
        if (loading) {
            loading["progressBar"] = loading.getChildByName("progressBar").getChildByName("mask");
            loading["bar"] = loading.getChildByName("progressBar").getChildByName("mask").getChildByName("bar");
            loading["Bar"] = loading.getChildByName("progressBar").getChildByName("bar");
            loading["txt"] = loading.getChildByName("txt").getComponent(cc.Label);
            loading["widget"] = loading.getComponent(cc.Widget);
            this.mLoadingAni = loading;
        }
        this.mNodGlobalUI = node.getChildByName("GlobalUI")
        if (this.mNodGlobalUI) {
            this.mNodGlobalUI["widget"] = this.mNodGlobalUI.getComponent(cc.Widget);
            this.mNodGlobalUI["script"] = this.mNodGlobalUI.getComponent("GlobalUI");
        }

        if (cc.sys.platform == cc.sys.ANDROID) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
        this.winSizeChange();
        this.addCmd(Manager.CMD_INIT);
    }

    public changeUI(name: string, data: {} = null): void {
        if (name == null) return;
        if (!data) {
            data = {};
        }

        let find
        this.m_cmds.forEach(e => {
            if (e[0] == Manager.CMD_REPLACE_SCENE) {
                find = true
                return
            }
        });

        if (find) {
            //连续重复切换同一个场景，直接无视
            return
        }

        //TODO 为了解决切换界面连点的情况， 暂时把CMD_LOADING_1 换成CMD_REPLACE_SCENE
        this.addCmd(Manager.CMD_REPLACE_SCENE, [name, data])
    }

    private addCmd(cmd: number, data: any = null): void {
        if (!data) {
            data = [];
        }
        //像data数组0号位置添加cmd指令
        data.unshift(cmd);
        cc.log("当前命令数组：");
        cc.log(data);
        this.m_cmds.push(data);
    }

    public getLoadingScene(): String {
        return this.m_loadingScene;
    }

    public process(dt): void {
        // cc.log("--------->process");
        if (this.m_pause) {
            return
        }
        if (this.m_cmds.length > 0 && this.m_count == 0) {
            var cmd = this.m_cmds.shift();
            if (cmd && this.runCmd(cmd)) {
                return;
            }
        }
        else {
            if (this.m_sceneScript && this.m_sceneScript["Process"]) {
                this.m_sceneScript["Process"](dt);
            }
        }
    }

    private init(): void {
        let g = require("../G").g
        g.init();
        this.m_launchNode.removeComponent(cc.Canvas);
        cc.game.on(cc.game.EVENT_HIDE, this.hideNotify.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.showNotify.bind(this));
        window.onresize = this.winSizeChange.bind(this);
        this.onInit(this);
    }

    public fullScreenChange(): void {
        //给小米的全屏做个补丁, 小米浏览器不调用cocos底层刷新回调(发现有的浏览器也会有问题，干脆就直接都强制调用)
        //if (cc.sys.browserType == cc.sys.BROWSER_TYPE_MIUI) {
        if (typeof cc.view["_orientationChange"] === 'function') {
            cc.view["_orientationChange"]()
        }
        //}
    }

    public winSizeChange(): void {
        this.m_launchNode.setAnchorPoint(cc.v2(0.5, 0.5))
        this.m_launchNode.setContentSize(cc.view.getVisibleSize());
        this.m_launchNode.setPosition(cc.view.getVisibleOrigin());
        let wids = this.m_launchNode.getComponentsInChildren(cc.Widget)
        wids.forEach(w => {
            w.updateAlignment()
        });

        this.refCanvasFit()
    }

    //做一次界面适配
    public refCanvasFit() {
        let scene = cc.director.getScene();
        let node = scene.getChildByName("Canvas");
        if (node) {
            let canvas = node.getComponent(cc.Canvas)
            if (!this.FixCanvas(canvas)) {
                //适配解决方案
                let dsize = canvas["designResolution"] || cc.view.getDesignResolutionSize()
                let wsize = cc.view.getFrameSize()
                // 设计分辨率比
                let _rateR = dsize.height >= dsize.width ? (dsize.height / dsize.width) : (dsize.width / dsize.height)
                // 显示分辨率比
                let _rateV = wsize.height >= wsize.width ? (wsize.height / wsize.width) : (wsize.width / wsize.height)
                if (_rateR > _rateV) {
                    //上下留黑边 
                    canvas.fitHeight = true
                    canvas.fitWidth = true
                } else {
                    let b = wsize.height >= wsize.width
                    canvas.fitHeight = !b
                    canvas.fitWidth = b
                }
            }
            //canvas["alignWithScreen"]()
        }

        let wids = scene.getComponentsInChildren(cc.Widget)
        wids.forEach(w => {
            w.updateAlignment()
        });
    }

    public showNotify(): void {
        console.log("showNotify-----------")
        //AudioManager.getInstance().resumeAll();
        EventHandler.checkCache();
        if (this.m_sceneScript && this.m_sceneScript["showNotify"]) {
            this.m_sceneScript["showNotify"]();
        }
    }

    public hideNotify(): void {
        console.log("hideNotify-----------")
        //AudioManager.getInstance().pauseAll();
        if (this.m_sceneScript && this.m_sceneScript["hideNotify"]) {
            this.m_sceneScript["hideNotify"]();
        }
    }

    public onDestroy() {

    }

    public static dump(obj: Object, key: string): void {
        cc.log(key + " = ");
        cc.log(obj);
    }

    private replaceScene(sceneName: string, data: any): void {
        this.m_pause = true
        this.m_sceneData = [sceneName, data];
        cc.log(data, "--------->传入场景的参数");
        Manager.dump(sceneName, "-------------切换")
        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
            if (this.mLoadingAni) {
                this.mLoadingAni.active = false;
            }
            //cc.loader["onProgress"] = null;
            this.m_pause = false
        })
        let g = require("../G").g
        g.preChangeUI()
        if (this.mNodGlobalUI && this.mNodGlobalUI['script']) {
            this.mNodGlobalUI['script'].clear()
        }

        this.m_loadingScene = sceneName;
        this.changeWaitCount(true);

        let lastSceneName = this.getSceneName()
        console.log("lastSceneName:" + lastSceneName)

        console.time("场景加载" + this.m_loadingScene.toString())
        if (sceneName != lastSceneName && this.mLoadingAni) {
            this.mLoadingAni.active = true;
            this.mLoadingAni["widget"].updateAlignment();
            this.mLoadingAni["progressBar"].width = 0;
            this.mLoadingAni["Bar"].position = cc.v2(0, 0);
            this.mLoadingAni["txt"].string = "资源加载中... 0%";
            //检测下是否释放上一个bundle
            let lastBundleInfo = BundleManager.getInstance().getBundleInfoByScene(lastSceneName)
            if (lastBundleInfo && lastBundleInfo.bdname && lastBundleInfo.autorelease == 1) {
                let lastbundle = BundleManager.getInstance().getBundle(lastBundleInfo.bdname)
                if (lastbundle) {
                    BundleManager.getInstance().releaseBundle(lastBundleInfo.bdname)
                }
            }
            //检测下是否加载下一个bundle
            let curBundleInfo = BundleManager.getInstance().getBundleInfoByScene(sceneName)
            if (curBundleInfo && curBundleInfo.bdname) {
                this.m_curBundleName = curBundleInfo.bdname
                let bundle = BundleManager.getInstance().getBundle(curBundleInfo.bdname)
                if (bundle) {
                    bundle.preloadScene(sceneName, null, this.onPreloadProcess.bind(this), this.onScenePreloadOver.bind(this));
                }
            } else {
                cc.director.preloadScene(sceneName, this.onPreloadProcess.bind(this), this.onScenePreloadOver.bind(this));
            }
        } else {
            this.onScenePreloadOver()
        }
    }

    private onPreloadProcess(completedCount, totalCount, item) {
        if (totalCount > 1) {
            let percent = completedCount / totalCount
            this.mLoadingAni["progressBar"].width = percent * (this.mLoadingAni["bar"].width);
            this.mLoadingAni["Bar"].position = cc.v2((this.mLoadingAni["bar"].width) * percent, 0);
            this.mLoadingAni["txt"].string = "资源加载中... " + (percent * 100).toFixed(0) + '%';
        }

    }
    //新场景即使没有预加载完，也可以调用，可以提高加载速度,但是有个问题就是不显示加载进度
    private onScenePreloadOver() {
        cc.log("onScenePreloadOver start")
        //this.mLoadingAni.active = false;
        cc.director.loadScene(this.m_loadingScene.toString(), this.onSceneLoadOver.bind(this));
        cc.log("onScenePreloadOver end")
    }

    // 当场景加载成功之后触发
    private onSceneLoadOver(): void {
        cc.log("onSceneLoadOver start\n")
        console.timeEnd("场景加载" + this.m_loadingScene.toString())
        this.mLoadingAni.active = false;
        var scene = cc.director.getScene();
        var Canvas = scene.getChildByName("Canvas");
        var s
        if (!Canvas) {
            this.m_loadingScene = null;
            this.changeWaitCount(false);
            return
        } else {
            s = Canvas.getComponent(this.m_sceneData[0]);
            if (s == null) {
                let com = Canvas.getComponents(cc.Component)

                if (com && com[1] && com[1]["name"]) {
                    var name = com[1].name;
                    name = name.match("<(.+)>")[1]
                    s = Canvas.getComponent(name);
                }
            }
        }

        this.refCanvasFit()

        this.m_sceneScript = s;
        try {
            if (s && s["onCreate"]) {// 如果场景存在构造方法，就直接调用
                s["onCreate"](this.m_sceneData[1]);
            }
            else if (s) {
                cc.log("未找到UI脚本[%s]", s.name)
            }
            if (this.hasOwnProperty("m_sceneData")) {
                this.m_sceneData = null;
            }
        } catch (error) {
            console.error(error)
        }
        this.m_loadingScene = null;
        this.changeWaitCount(false);
        cc.log("onSceneLoadOver end\n")
    }

    public runCmd(cmd: Array<any>): boolean {
        var result = false;
        var opt = cmd[0];
        cc.log("执行命令:" + opt);
        do {
            switch (opt) {
                case Manager.CMD_INIT:
                    this.init();
                    this.addCmd(Manager.CMD_CREATE, [1])
                    break;
                case Manager.CMD_LOADING_1:
                    cmd.shift();
                    this.addCmd(Manager.CMD_LOADING_2, cmd)
                    break;
                case Manager.CMD_LOADING_2:
                    cmd.shift();
                    this.addCmd(Manager.CMD_REPLACE_SCENE, cmd)
                    break;
                case Manager.CMD_REPLACE_SCENE:
                    this.replaceScene(cmd[1], cmd[2])
                    break;
                case Manager.CMD_DESTROY:
                    let g = require("../G").g
                    g.uninit();
                    break;
                case Manager.CMD_DELAYCALLBACK:

                    break;
                case Manager.CMD_CREATE:
                    {
                        let _this = this
                        let x = cc.delayTime(cmd[1]);
                        let y = cc.tween.call((node) => {
                            if (_this["onCreate"]) {
                                _this["onCreate"]();
                                //_this.m_launchNode.off(cc.Node.EventType.TOUCH_START)
                            }
                        })
                        cc.tween(this.mRootNode).then(x).then(y).start()
                        this.addCmd(Manager.CMD_NOOP)
                    }
                    break;
                case Manager.CMD_NOOP:
                    break;
                default:
                    throw ("不能识别的命令");
                    break;
            }
            result = true;
        } while (false);
        return result;
    }


    public onMessage(event: string, args: object, id: number) {
        if (this.m_sceneScript && this.m_sceneScript["onMessage"]) {
            this.m_sceneScript["onMessage"](event, args, id);
        }
    }

    public onError(code: number, event: string, message: string): boolean {
        if (this.m_sceneScript && this.m_sceneScript["onError"]) {
            return this.m_sceneScript["onError"](code, event, message);
        }
        return false;
    }

    //弹出一些公共的UI
    public showGlobalUI(type?, params?) {
        if (this.mNodGlobalUI && this.mNodGlobalUI['script']) {
            this.mNodGlobalUI['script'].show(type, params)
        }
    }

    public hideGlobalUI(type?, params?) {
        if (this.mNodGlobalUI && this.mNodGlobalUI['script']) {
            this.mNodGlobalUI['script'].hide(type, params)
        }
    }

    public getGlobalUI(type) {
        if (this.mNodGlobalUI && this.mNodGlobalUI['script']) {
            return this.mNodGlobalUI['script'].getUIScript(type)
        }
    }


    public showWaitAni(hidemask?): void {
        if (!this.mWaitAni) {
            this.mWaitAni = true;
            this.mNativeWaitAni.active = true;
            let ani = this.mNativeWaitAni.getComponent(cc.Animation);
            if (ani) {
                ani.play();
            }
            let mask = cc.find("mask", this.mNativeWaitAni)
            if (mask) {
                mask.opacity = hidemask ? 0 : 130
            }
        }
    }

    public hideWaitAni(): void {
        if (this.mWaitAni) {
            this.mWaitAni = false;
            let ani = this.mNativeWaitAni.getComponent(cc.Animation);
            if (ani) {
                ani.stop();
            }
            this.mNativeWaitAni.active = false;
        }
    }

    public getRootNode(): cc.Node {
        return this.mRootNode;
    }

    public clearData() {
        this.mDataStack = []
    }

    public pushData(args) {
        this.mDataStack.push(args)
    }

    public popData() {
        return this.mDataStack.pop()
    }


    private changeWaitCount(wait): void {
        cc.log('Manager changeWaitCount start\n')
        this.m_count += wait ? 1 : -1;
        if (this.m_count < 0) {
            this.m_count = 0
        }
        cc.log('Manager changeWaitCount end:\n' + this.m_count)
    }

    public getSceneScript() {
        return this.m_sceneScript;
    }

    public getSceneName() {
        let scenename = ""
        if (this.m_sceneScript) {
            let name = this.m_sceneScript.name
            let tmpdata = name.match(/Canvas<(\w+)>/)
            if (tmpdata && tmpdata[1]) {
                scenename = tmpdata[1]
            }
        }
        return scenename
    }

    public getCurBundleName() {
        return this.m_curBundleName
    }

    onKeyDown(event) {
        console.log("event.keyCode:" + event.keyCode)
        switch (event.keyCode) {
            case cc.macro.KEY.back:
                // 参考步骤3
                {
                    Dialog.show(Dialog.TYPE_TWO_BTN, "是否退出游戏?", (ret) => {
                        if (ret == 0) {
                            cc.game.end();
                        }
                    })
                }
                break;
        }
    }


}
