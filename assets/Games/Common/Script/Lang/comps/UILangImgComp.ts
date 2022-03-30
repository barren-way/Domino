import UIText from "./UIText";
import { LangDef } from "../LangDef";
import LangManager from "../LangManager";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class UILangImgComp extends cc.Component {
    //大厅自定义UI图片组件
    @property
    uiID: string = '';

    start() {
        this.setImg();
        cc.director.on(LangDef.EVENTS.CHANGE_LANG, this.setImg, this)
    }

    onDestroy() {
        cc.director.off(LangDef.EVENTS.CHANGE_LANG, this.setImg, this)
    }

    setUIID(str) {
        this.uiID = str || ""
    }

    setImg() {
        var url = "Common/Texture/lang/" + LangManager.getInstance().getLang() + "/image_lan"

        cc.resources.load(url, cc.SpriteAtlas, (err, img: cc.SpriteAtlas) => {
            var frame = img.getSpriteFrame(this.uiID);
            if (cc.isValid(this)) {
                this.getComponent(cc.Sprite).spriteFrame = frame;
            }
        });
    }

}
