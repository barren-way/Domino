import UIText from "./UIText";
import { LangDef } from "../LangDef";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class UILangComp extends cc.Component {
    //大厅自定义UI文本组件
    @property
    uiID: string = '';


    start() {
        this.setText();
        cc.director.on(LangDef.EVENTS.CHANGE_LANG, this.setText, this)
    }

    onDestroy() {
        cc.director.off(LangDef.EVENTS.CHANGE_LANG, this.setText, this)
    }

    setText(uiid?) {
        let curId = uiid ? uiid : this.uiID
        let l_text = UIText.getInstance().getText(curId)
        if (l_text) {
            this.getComponent(cc.Label).string = l_text
        }
    }

}
