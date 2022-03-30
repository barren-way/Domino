import BundleManager from "../../../../../Framework/Script/Engine/BundleManager";
import BDLangManager from "../BDLangManager";
import { LangDef } from "../LangDef";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class BDLangImgComp extends cc.Component {
    //bundle自定义UI图片组件
    @property
    uiID: string = '';

    start() {
        this.setImg();
        cc.director.on(LangDef.EVENTS.CHANGE_BD_LANG, this.setImg, this)
    }

    onDestroy() {
        cc.director.off(LangDef.EVENTS.CHANGE_BD_LANG, this.setImg, this)
    }

    setUIID(str) {
        this.uiID = str || ""
    }

    setImg() {
        var url = "Texture/lang/" + BDLangManager.getInstance().getLang() + "/image_lan"

        BundleManager.getInstance().loadRes(BDLangManager.getInstance().getBundleName(), url, cc.SpriteAtlas, (err, img: cc.SpriteAtlas) => {
            var frame = img.getSpriteFrame(this.uiID);
            if (cc.isValid(this)) {
                this.getComponent(cc.Sprite).spriteFrame = frame;
            }
        });
    }

}
