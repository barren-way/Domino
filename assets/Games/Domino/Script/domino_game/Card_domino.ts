import CardData_domino from "./CardData_domino";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Card_domino extends cc.Component {

    @property(cc.Node)
    bg:cc.Node=null;

    @property(cc.Node)
    back:cc.Node=null;

    @property(cc.Sprite)
    img_up:cc.Sprite=null;

    @property(cc.Sprite)
    img_down:cc.Sprite =null;

    @property(cc.SpriteFrame)
    numList:cc.SpriteFrame[]=[]

    @property(cc.Button)
    pokerButton:cc.Button=null

    @property(cc.Node)
    light:cc.Node=null




    id:Number = 0;
    p_data=null


    public upPointNum:Number = -1;
    public downPointNum:Number=-1;
    public ifOut=false
    public start(){}


    getPokerId():Number {
        return this.id;
    }
    getIfOut(){
        return this.ifOut
    }
    setIfOut(){
        this.ifOut=true
    }

    closeButton(){
        this.pokerButton.node.active=false
    }

    savePokerId (id):void{
        var p_data=CardData_domino.getPokerData(id)

        if(p_data) {
            this.id=id;
        }else{
            this.id=0;
        }
    }

    setSpriteFrame(spx,res) {
        /*cc.loader.loadRes('Common/Texture/domino/domino_res',cc.SpriteAtlas, function (err, assets) {
            if(assets){
                var frame = assets.getSpriteFrame(res);
                spx.spriteFrame = frame;
            }    
        });*/
        spx.spriteFrame=this.numList[res]
        /*var frame = new cc.SpriteFrame(cc.url.raw('Common/Texture/domino/'+res))
        spx.spriteFrame = frame;*/
    }

    open (){
        
        if(this.id){
            this.refresh(this.id);
            var fun_call=function(){
                this.back.active=false;
            }
            
        }
    }


    refresh (id):void {
        var p_data=CardData_domino.getPokerData(id);
        //console.log(p_data)
        if(p_data){
            this.id=id;
            this.p_data=p_data;
            if (p_data.type==1){
                this.img_up.spriteFrame=this.numList[p_data.up]
                //this.img_up.node.rotation=180

                //console.log(p_data.down)
                this.img_down.spriteFrame=this.numList[p_data.down]

                this.pokerButton.clickEvents[0].customEventData=id
            }
            //this.back.active=false;
        }else{
            this.back.active=true;
        }
    }





}
