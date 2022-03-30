const { ccclass, property } = cc._decorator;
import { GameDef } from "./GameDef";

@ccclass
export default class SysUtil {
    //有关全屏的代码
    private static isFullscreenEnabled(): boolean {
        return document["fullscreenEnabled"] ||
            document["mozFullScreenEnabled"] ||
            document["webkitFullscreenEnabled"] ||
            document["msFullscreenEnabled"] || false;

    }

    public static fullScreenState(): boolean {
        return document["fullscreenElement"] ||
            document["msFullscreenElement"] ||
            document["mozFullScreenElement"] ||
            document["webkitFullscreenElement"] || false;
    }

    public static launchFullscreen(element?: any): void {
        if (!element) {
            if (!SysUtil.isFullscreenEnabled()) {
                //TODO 不支持全屏
            }
            element = document.documentElement;
        }
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    public static exitFullscreen(element?: any): void {
        element = element ? element : document.documentElement
        if (document["exitFullscreen"]) {
            document["exitFullscreen"]();
        } else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        } else if (document["webkitExitFullscreen"]) {
            document["webkitExitFullscreen"]();
        } else if (document["webkitExitFullScreen"]) {
            document["webkitExitFullScreen"]();
        }
    }

    public static fullScreenChange(event) {
        cc.director.emit(GameDef.EVENTS.NOTIFY_FULLSCREEN); 
    }

    public static initScreenEvent(): void {
        let ary = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
        for (const event of ary) {
            document.addEventListener(event, SysUtil.fullScreenChange);
        }
    }


}
