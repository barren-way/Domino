import { g } from "../../../../Framework/Script/G";
import CardData_domino from "./CardData_domino";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardArea extends cc.Component {
    @property(cc.Node) 
    domino_model:cc.Node=null
    @property(cc.Node)
    start_point:cc.Node=null

    @property(cc.Node)
    leftChooseArea:cc.Node=null
    @property(cc.Node)
    rightChooseArea:cc.Node=null

    @property(cc.Node)
    card_parent:cc.Node=null;


    pokers=[]
    angle_poker:number=0
    

    initPokers(){
        this.pokers=[]
        this.leftChooseArea.active=false
        this.rightChooseArea.active=false
    }

    CHANGE_X=140 




    poker_start (cards,num) {
        if(!cards){
            return;
        }
        if(!this.domino_model){
            return;
        }    
        var p_id=cards;
        //创建每一张牌
        var poker=cc.instantiate(this.domino_model);
        poker.active=true      
        poker.parent=this.card_parent;
        poker.scale=0.4;
        poker.x=this.start_point.x
        poker.y=this.start_point.y
        var p_info=poker.getComponent("Card_domino");
            //传入点数
        p_info.savePokerId(p_id);
        

        var pos=cc.v2(num*this.CHANGE_X+250,0); 
  
        poker.rotation=this.angle_poker;
            //执行并返回该执行的动作。该节点将会变成动作的目标。
            //sequence顺序执行动作，创建的动作将按顺序依次运行。
            //callFunc执行回调函数。
            //moveTo，poker在0.2s内移动至pos处
        poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.callFunc(this.openPokers.bind(this))))
        this.pokers.push(poker)       
    }
    arrangCard(handCardNum,ifquick){
          
        var mid =handCardNum/2
        var changeNum=0
        var speed=ifquick? 0.4:0.8
        for(let i=0;i<this.pokers.length;i++){
            var poker=this.pokers[i]
            
            if(!poker.getComponent("Card_domino").getIfOut()){

                var posx=(changeNum-mid+0.5)*this.CHANGE_X+580
                var pos=cc.v2(posx,0)
                changeNum++
                poker.runAction(cc.moveTo(speed,pos))  
            }
            
        }
    }

    openPokers () {
        for(var i in this.pokers){
            var poker=this.pokers[i];
            var p_info=poker.getComponent("Card_domino");
            p_info.open();
        }
    }

    poker_sound () {
        g.AudioMgr.playSound("fir");
    }

    setChooseAreaActive(side:string,state:number,posx,rotate,posY){
        var choose_area= side=='left'? this.leftChooseArea:this.rightChooseArea
        choose_area.active= state==1? true:false
        choose_area.x=posx;
        choose_area.y=posY
        choose_area.rotation=rotate

    }
    openLight(card){
        var onCardNum=this.checkOnCard(card)
        var onCard=this.pokers[onCardNum]
        var light=onCard.getChildByName('light')
        light.active=true
    }
    closeLight(){
        for(let i=0;i<this.pokers.length;i++){
            var light=this.pokers[i].getChildByName('light')
            light.active=false
        }
    }

    moveCard(choosePos,side,card,rotate){      
        var onCardNum=this.checkOnCard(card)
        var onCard=this.pokers[onCardNum]
        var p_info=onCard.getComponent("Card_domino");
        p_info.closeButton()
        var lastCard=onCard
        for(let i=onCardNum+1;i<this.pokers.length;i++){
            var c_info=this.pokers[i].getComponent("Card_domino")          
            if(!c_info.getIfOut()){ 
     
                var poker=this.pokers[i]               
                var pos=cc.v2(lastCard.x,lastCard.y)
                //poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.callFunc(this.openPokers.bind(this)),cc.moveTo(0.4,pos)))
                lastCard=poker
            }
        }
        if(side=='left'){
            onCard.x=this.leftChooseArea.x
            onCard.y=this.leftChooseArea.y    
        }
        else{
            onCard.x=this.rightChooseArea.x
            onCard.y=this.rightChooseArea.y         
        }
        p_info.setIfOut()
        onCard.rotation=rotate
        onCard.scale=0.25
        this.leftChooseArea.active=false
        this.rightChooseArea.active=false    
    }

    checkOnCard(card){
        for(let i=0;i<this.pokers.length;i++){
            var p_info=this.pokers[i].getComponent("Card_domino");
            var id=p_info.getPokerId()
            if(id==card){
                           
                return i
            }           
        }
    
    }
    getLoseScore(args){
        var score=0
        for(let i=0;i<this.pokers.length;i++){
            var c_info=this.pokers[i].getComponent("Card_domino")
            var c_data=CardData_domino.getPokerData(c_info.getPokerId())
            if(!c_info.getIfOut()){
                score+=c_data.up
                score+=c_data.down
            }
        }
        return score

    }
    closeAllBtn(){
        for(let i=0;i<this.pokers.length;i++){
            var poker=this.pokers[i]
            var btn=poker.getChildByName('btn_card')
            btn.active=false
        }
    }

}

