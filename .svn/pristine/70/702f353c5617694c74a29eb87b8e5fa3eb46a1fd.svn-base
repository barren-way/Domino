import { LangDef } from "../LangDef";
import BDText from "./BDText";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class BDLangComp extends cc.Component {
    //bundle自定义UI文本组件
    @property
    uiID: string = '';


    start() {
        this.setText();
        cc.director.on(LangDef.EVENTS.CHANGE_BD_LANG, this.setText, this)
    }

    onDestroy() {
        cc.director.off(LangDef.EVENTS.CHANGE_BD_LANG, this.setText, this)
    }


    setText(uiid?) {
        let curId = uiid ? uiid : this.uiID
        let l_text = BDText.getInstance().getText(curId)
        if (l_text) {
            this.getComponent(cc.Label).string = l_text
        }
    }

}
