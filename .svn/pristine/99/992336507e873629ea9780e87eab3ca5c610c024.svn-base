import { g } from "../../../Framework/Script/G";
import { GameDef } from "./GameDef";
import SysUtil from "./SysUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenCtrl extends cc.Component {
    @property(cc.Node)
    mNodBig: cc.Node = null;
    @property(cc.Node)
    mNodSmall: cc.Node = null;

    onEnable() {
        this.refBtns()
        cc.director.on(GameDef.EVENTS.NOTIFY_FULLSCREEN, this.refBtns, this)
    }

    onDisable() {
        cc.director.off(GameDef.EVENTS.NOTIFY_FULLSCREEN, this.refBtns, this)
    }

    refBtns() {
        let full = SysUtil.fullScreenState()
        this.mNodBig.active = !cc.sys.isNative && !full
        this.mNodSmall.active = !cc.sys.isNative && full
    }
    
    fullBtnClicked() {
        g.AudioMgr.playSound("button");
        SysUtil.launchFullscreen()
    }

    smallBtnClicked() {
        g.AudioMgr.playSound("button");
        SysUtil.exitFullscreen()
    }
}
