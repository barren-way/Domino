import {g} from '../../../../Framework/Script/G'
import PokerData_21 from './PokerData_21'

const {ccclass, property} = cc._decorator;

var color_res=["color_1","color_2","color_3","color_4"];

@ccclass
export default class Poker_21 extends cc.Component {

    @property(cc.Node)
    bg:cc.Node=null;

    @property(cc.Node)
    back:cc.Node=null;
    
    @property(cc.Sprite)
    color:cc.Sprite=null;

    @property(cc.Sprite)
    img_num:cc.Sprite=null;

    @property(cc.Node)
    img_double:cc.Node=null;

    id:Number = 0;
    p_data=null;
    base_y=null;
    can_touch:boolean=false;
    is_select:boolean=false;

    start () {

    }

    onLoad () {

    }

    onEnable () {

    }

    onDisable () {

    }

    getPokerId():Number {
        return this.id;
    }

    savePokerId (id):void{
        var p_data=PokerData_21.getPokerData(id);
        if(p_data) {
            this.id=id;
        }else{
            this.id=0;
        }
    }

    setSpriteFrame(spx,res) {
        cc.loader.loadRes('Common/Texture/poker_res',cc.SpriteAtlas, function (err, assets) {
            if(assets){
                var frame = assets.getSpriteFrame(res);
                spx.spriteFrame = frame;
            }    
        });
    }

    refresh (id):void {
        var p_data=PokerData_21.getPokerData(id);
        if(p_data){
            this.id=id;
            this.p_data=p_data;
            if (p_data.type==1){
                var res_color=color_res[p_data.color-1];
                this.setSpriteFrame(this.color,res_color);
                //this.setSpriteFrame(this.color_sml,res_color);
                var res_num=p_data.src;
                this.setSpriteFrame(this.img_num,res_num);
            }else{
                this.color.node.active=false;
                //this.color_sml.node.active=false;

                var res_num=p_data.src;
                this.img_num.node.setContentSize(cc.size(240,340));
                this.img_num.node.setPosition(cc.v2(0,0));
                this.setSpriteFrame(this.img_num,res_num);
            }
            this.back.active=false;
        }else{
            this.back.active=true;
        }
    }
    
    open (){
        if(this.id&&this.back.active){
            this.refresh(this.id);
            this.back.active=true;

            var fun_call=function(){
                this.back.active=false;
            }
            var scale=this.node.scale;
            this.node.runAction(cc.sequence(cc.scaleTo(0.15,0,scale),cc.callFunc(fun_call.bind(this)),cc.scaleTo(0.15,scale)));
        }
    }

    getValue ():Number{
        if(this.p_data){
            return this.p_data.num;
        }else{
            return 0;
        }
    }

    saveBaseY(base_y):void {
        this.base_y=base_y;
    }

    setTouchState(state):void{
        if(state){
            this.can_touch=true;
        }else{
            this.can_touch=false;
        }
    }

    setSelected (is_select):void{
        if(!this.can_touch){
            return;
        }

        if(this.base_y==null){
            return;
        }

        if(is_select){
            this.is_select=true;
        }else{
            this.is_select=false;
        }
        if(this.is_select){
            this.node.y=this.base_y+40;
        }else{
            this.node.y=this.base_y;
        }
    }

    isSelected ():boolean{
        return this.is_select;
    }

    setLight ():void{
        this.bg.color=cc.color(255,255,255,255);
    }

    setDark ():void{
        this.bg.color=cc.color(150,150,150,255);
    }

    mark_double():void{
        if(this.img_double){
            this.img_double.active=true;
        }
    }

    is_double(){
        if(this.img_double){
            return this.img_double.active;
        }
        return false;
    }

    pressPoker ():void {
        if(!this.can_touch){
            return;
        }

        if(this.base_y==null){
            return;
        }

        this.is_select=!this.is_select;
        if(this.is_select){
            this.node.y=this.base_y+40;
        }else{
            this.node.y=this.base_y;
        }
    }
    
    // update (dt) {}
}
