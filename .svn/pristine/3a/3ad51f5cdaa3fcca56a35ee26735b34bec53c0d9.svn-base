import { g } from "../../../../Framework/Script/G";
import CardArea from "./CardArea_domino";
import CardData_domino from "./CardData_domino";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Rival_domino extends CardArea {
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
    

    poker_start (cards,num) {
        if(!cards){
            return;
        }      
        if(!this.domino_model){
            return;
        }
        var change_x=70      
        var p_id=cards;
        //创建每一张牌
        var poker=cc.instantiate(this.domino_model);
        var btn=poker.getChildByName('btn_card')
        var back=poker.getChildByName('back')
        back.active=true
        btn.active=false
        poker.active=true
        poker.parent=this.card_parent;
        poker.scale=0.15;
        poker.x=this.start_point.x
        poker.y=this.start_point.y
        var p_info=poker.getComponent("Card_domino");
            //传入点数
        p_info.savePokerId(p_id);
        var pos=cc.v2(num*change_x+350,1000);  
        poker.rotation=this.angle_poker;
            //执行并返回该执行的动作。该节点将会变成动作的目标。
            //sequence顺序执行动作，创建的动作将按顺序依次运行。
            //callFunc执行回调函数。
            //moveTo，poker在0.2s内移动至pos处
        poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.callFunc(this.openPokers.bind(this)),cc.moveTo(0.6,pos)))
        this.pokers.push(poker)       
    }


    

    moveCard(choosePos,side,card,rotate){       
        var onCardNum=this.checkOnCard(card)
        var onCard=this.pokers[onCardNum]
        var p_info=onCard.getComponent("Card_domino");
        p_info.closeButton()
        var childImg=onCard.children
        for(let i in childImg){
            childImg[i].active=false
        }
        var lastCard=onCard      
        for(let i=onCardNum+1;i<this.pokers.length;i++){
            var c_info=this.pokers[i].getComponent("Card_domino")          
            if(!c_info.getIfOut()){     
                var poker=this.pokers[i]               
                var pos=cc.v2(lastCard.x,lastCard.y)
                poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.callFunc(this.openPokers.bind(this)),cc.moveTo(0.3,pos)))
                lastCard=poker
            }
        }
       
    }

    moveOutCard(choosePos,side,card,rotate){
        var onCardNum=this.checkOnCard(card)
        var onCard=this.pokers[onCardNum]
        var childImg=onCard.children
        for(let i in childImg){
            childImg[i].active=true
        }

        
        var p_info=onCard.getComponent("Card_domino");
        p_info.closeButton()
        var back=onCard.getChildByName('back')
        var light=onCard.getChildByName('light')
        back.active=false
        light.active=false
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


    getWinScore(args){
        var score=0
        for(let i=0;i<this.pokers.length;i++){
            var c_info=this.pokers[i].getComponent("Card_domino")
            var c_data=CardData_domino.getPokerData(c_info.getPokerId())
            if(!c_info.getIfOut()){
                score+=c_data.up
                score+=c_data.down
            }
        }
        for(let i in this.pokers){
            var back=this.pokers[i].getChildByName('back')
            back.active=false
        }
        return score
    }

    
}

