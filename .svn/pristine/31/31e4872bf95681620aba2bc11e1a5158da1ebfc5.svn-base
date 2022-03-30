
import { g } from "../../../../Framework/Script/G";
import { GameDef } from "../GameDef";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DownloadComp extends cc.Component {
    //登录界面子游戏下载脚本

    private m_params = null

    @property(cc.Node)
    mNodBoard: cc.Node = null

    @property(cc.Node)
    mNodBg: cc.Node = null

    @property(cc.Node)
    mNodJvhua: cc.Node = null

    @property(cc.Node)
    mNodRetry: cc.Node = null

    @property(cc.Label)
    mLabTip: cc.Label = null


    private mWaitAni = null

    private m_updateScript = null

    onLoad() {
        this.m_updateScript = this.node.getComponent('BundleHotUpdate')
    }

    onEnable() {
        cc.director.on(GameDef.EVENTS.NOTIFY_UPDATEDL_SHOW, this.refWinData, this)
    }

    onDisable() {
        cc.director.on(GameDef.EVENTS.NOTIFY_UPDATEDL_SHOW, this.refWinData, this)
        this.hideWaitAni()
    }

    refWinData(params) {
        if (params && params.result) {
            this.mLabTip.string = params.updatetip
            if (params.result == 0) {
                this.mNodBg.active = true
                this.mNodRetry.active = true
            }
        }
    }

    show(params) {
        console.log("layer_bdupdate show start")
        this.m_params = params ? params : {}
        this.mLabTip.string = "准备下载..."
        this.mNodJvhua.active = false
        this.mWaitAni = false
        this.mNodRetry.active = false
        this.mNodBg.active = true
        this.showWaitAni()
        console.log("layer_bdupdate show end")
    }

    isShow() {
        return this.node.active
    }

    MainClicked(btn, eventdata) {
        let name = btn.target.name
        cc.log("DownloadComp MainClicked btnname:" + name)
        switch (name) {
            case "btn_retry":
                this.mNodBg.active = false
                this.mNodRetry.active = false
                this.m_updateScript.retry()
                break;
            case "btn_exit":
                this.mNodBg.active = false
                this.mNodRetry.active = false
                this.m_updateScript.gameExit()
                break;
        }
    }

    public showWaitAni() {
        if (!this.mWaitAni) {
            this.mWaitAni = true;
            this.mNodJvhua.active = true;
            let ani = this.mNodJvhua.getComponent(cc.Animation);
            if (ani) {
                ani.play();
            }
        }
    }

    public hideWaitAni() {
        if (this.mWaitAni) {
            this.mWaitAni = false;
            let ani = this.mNodJvhua.getComponent(cc.Animation);
            if (ani) {
                ani.stop();
            }
            this.mNodJvhua.active = false;
        }
    }
}
