import { g } from "../../../../Framework/Script/G";

const { ccclass, property } = cc._decorator;
@ccclass
export default class layer_rule extends cc.Component {

    //牌节点
    @property(cc.Node)
    private txt_n: cc.Node = null

    start() {

    }

    updateLayer(path) {
        this.txt_n.getComponent(cc.Label).string = ""
        cc.loader.loadRes("Common/Files/" + path,function(err,data){
			if(err){
                g.Dialog.show(g.Dialog.TYPE_TIP,"资源加载错误，请重新进行加载!")
                this.close()
			}else{
                this.txt_n.getComponent(cc.Label).string = data.text
            }
        }.bind(this))
    }

    close(){
        this.node.active = false
    }
}
