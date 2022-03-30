const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    private img: cc.Node = null;

    @property(cc.Node)
    private num: cc.Node = null;

    @property([cc.SpriteFrame])
    private sf_img: Array<cc.SpriteFrame> = [];

    @property([cc.Font])
    private num_img: Array<cc.Font> = [];

    FlyFont(_num,call) {
        if (_num == 0) {
            this.node.runAction(cc.removeSelf())
            return
        }
        this.img.getComponent(cc.Sprite).spriteFrame = _num > 0 ? this.sf_img[0] : this.sf_img[1]
        this.num.getComponent(cc.Label).font = _num > 0 ? this.num_img[0] : this.num_img[1]
        this.num.getComponent(cc.Label).string = String(Math.abs(_num))
        let move = cc.moveBy(0.6, cc.v2(0, 80))
        let wait = cc.delayTime(0.8)
        let fadeOut = cc.fadeOut(0.5)
        this.node.runAction(cc.sequence(cc.sequence(move,wait,fadeOut), cc.callFunc(call)))
    }

    // update (dt) {}
}
