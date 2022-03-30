const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    private eff: cc.Node = null

    @property(cc.Sprite)
    private chip_Img: cc.Sprite = null

    @property(cc.Label)
    private chip_num: cc.Label = null
    @property([cc.SpriteFrame])
    private img_wl: Array<cc.SpriteFrame> = []

    @property([cc.Color])
    private img_color: Array<cc.Color> = []


    
    @property(cc.Node)
    private tx_guangquan: cc.Node = null
    @property(cc.Node)
    private tx_guangquan1: cc.Node = null


    private num = null

    onCreate(data) {

    }

    onLoad() {
        //this.eff.active = false
    }

    start() {

    }

    update(dt) {

    }

    getValue(){
        return this.num
    }
    refershChip(idx, num): void {
        this.num = num
        this.chip_Img.spriteFrame = this.img_wl[idx]
        var l_color = this.img_color[idx];
        if(l_color){
            this.chip_num.getComponent(cc.LabelOutline).color = l_color;
        }
        this.chip_num.string = num
        if (num < 100) {
            this.chip_num.node.scaleX = 1
        }else if(num >= 100 && num < 1000){
            this.chip_num.node.scaleX = 0.9
        }else if(num >= 1000 && num < 10000){
            this.chip_num.node.scaleX = 0.7
        }else if(num >= 10000) {
            this.chip_num.node.scaleX = 0.6
        }else{
            this.chip_num.node.scaleX = 1
        }
    }

    operationEff(eff): void {
        if (this.tx_guangquan &&this.tx_guangquan1) {
            this.tx_guangquan.active = eff
            this.tx_guangquan1.active = eff
            if (eff) {
                this.node.getComponent(cc.Animation).play("tx_fama")
            }else{
                this.node.getComponent(cc.Animation).stop("tx_fama")
            }
        }else{
            this.eff.active =eff
        }
        
    }

}
