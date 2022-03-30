import Dialog from "../../../Framework/Script/Tips/Dialog"
import SysUtil from './SysUtil';
import { GameDef } from './GameDef';
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import AutoExactFit from "./AutoExactFit";

export default class Instance {
    public onInit(Manager): void {
        Manager.changeUI(GameDef.startScene);
        SysUtil.initScreenEvent();
        Dialog.init();
        
        if (!cc.sys.isNative) {
            //检查下是否自动全屏
            let fullscreen = LocalDB.getInt(GameDef.AUTOFULLSCREEN, 0)
            if (fullscreen == 1) {
                SysUtil.launchFullscreen()
            }
        }

        //显示FPS和drawcall信息
        if (GameDef.SHOW_DEBUG) {
            cc.debug.setDisplayStats(true)
        }
    }

    //做一次界面适配
    public FixCanvas(canvas:cc.Canvas): boolean {
        if (canvas) {
            // 适配解决方案,如果引用了适配插件就用插件的适配方案，没有就用之前默认的
            let dsize = canvas["designResolution"] || cc.view.getDesignResolutionSize()
            let wsize = cc.winSize
            let canvasNode = cc.director.getScene().getChildByName("Canvas")
            if (canvasNode && !canvasNode.getComponent(AutoExactFit)) {
                console.log("FixCanvas Default")
                if ((dsize.width / wsize.width) > (dsize.height / wsize.height)) {
                    canvas.fitHeight = false
                    canvas.fitWidth = true
                } else {
                    canvas.fitHeight = true
                    canvas.fitWidth = false
                }
            }
            return true
        }
        return false
    }
}
