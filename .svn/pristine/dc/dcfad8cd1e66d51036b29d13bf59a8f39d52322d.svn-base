import { g } from "../../../../Framework/Script/G";

const { ccclass, property } = cc._decorator;

@ccclass
export default class layer_wx extends cc.Component {

    @property(cc.Node)
    node_h: cc.Node = null;

    @property(cc.Node)
    node_v: cc.Node = null;

    start() {

    }

    show() {
        if (!cc.sys.isNative) {
            this.node_h.active = false;
            this.node_v.active = false;

            if (document.body.clientWidth > document.body.clientHeight) {
                this.node_h.active = true;
            } else {
                this.node_v.active = true;
            }
        } else {
            this.Close()
        }
    }

    Close() {
        g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_WX)
    }


    // update (dt) {}
}
