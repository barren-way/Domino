import { g } from "../../../../Framework/Script/G";
import Tools from "../Tools"

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    private content: cc.Node = null

    @property(cc.Node)
    private txt_n: cc.Node = null

    start() {

    }

    updateLayer(path) {
        this.txt_n.active = false;
        this.content.removeAllChildren();
        for(let i=1; i<=24; i++){
            let item = cc.instantiate(this.txt_n)
            item.active = true;
            item.parent = this.content;
            item.getComponent("BDLangComp").uiID = "game_center_help_" + i
            item.getComponent("BDLangComp").setText()
        }
    }

    close(){
        this.node.active = false
    }
    // update (dt) {}
}
