import GameUtil from "../GameUtil"

const { ccclass, property } = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Node)
    private list: cc.Node = null;


    @property(cc.Node)
    private item_pb: cc.Node = null;


    start() {

    }

    updatLayer(data) {
        this.list.removeAllChildren()
        this.list.setContentSize(cc.size(1020, data.length * 62))
        for (let index = 0; index < data.length; index++) {
            let info_d = JSON.parse(data[index])
            let item = cc.instantiate(this.item_pb)
            item.active = true
            item.getChildByName("sln_num").getComponent(cc.Label).string = String(index + 1)
            let a = info_d["id"]
            let b = info_d.id
            //item.getChildByName("cd_num").getComponent(cc.Label).string = String(info_d["id"])
            item.getChildByName("cd_num").getComponent(cc.Label).string = String(info_d["ver"] + "-" + info_d["date"] + "-" + info_d["id"] + "-" + info_d["idx"])
            let str = "体验房"
            switch (info_d["level"]) {
                case 1:
                    str = "体验房"
                    break;
                case 2:
                    str = "初级房"
                    break;
                case 3:
                    str = "中级房"
                    break;
                case 4:
                    str = "高级房"
                    break;
            }
            item.getChildByName("room").getComponent(cc.Label).string = str
            item.getChildByName("win").getComponent(cc.Label).string = String(info_d["win"])
            let time = GameUtil.getLocalTime(info_d["date"])
            item.getChildByName("time").getComponent(cc.Label).string = time

            this.list.addChild(item)
            this.list.getComponent(cc.Layout).updateLayout()
        }
    }

    close() {
        this.node.active = false
    }

    // update (dt) {}
}
