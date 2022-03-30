import { g } from "../../../../Framework/Script/G";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    private iconAtlas
     onLoad () {
        cc.loader.loadRes('Common/Texture/icon', cc.SpriteAtlas, function (err, atlas) {
            this.iconAtlas = atlas
            this.referIcon()
        }.bind(this));
     }
    
    referIcon(){
        let item =  cc.find("icon",this.node)
        let s_node = cc.find("icongroup/view/content",this.node)
        s_node.removeAllChildren()
        for (let index = 1; index < 13; index++) {
           let itemNode = cc.instantiate(item)
           itemNode.active = true
           itemNode.getComponent(cc.Sprite).spriteFrame = this.iconAtlas.getSpriteFrame("public_icon_"+index)
           s_node.addChild(itemNode)
           itemNode.on(cc.Node.EventType.TOUCH_END,this.chanceIcon.bind(this,index),itemNode)
        }
    }

    chanceIcon(index){
        g.NetSocket.send('user.avatar', {avatar:index}, true); 
    }

    

    close(event, customEventData){
        this.node.active = false
    }

    // update (dt) {}
}
