import { g } from '../../../Framework/Script/G'
import NetData from '../../Common/Script/NetData'
import { cfg } from '../../Common/Script/Config'
import { GameDef } from '../../Common/Script/GameDef'
import BDLangManager from "../../Common/Script/Lang/BDLangManager";
import { LangDef } from "../../Common/Script/Lang/LangDef";
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import BundleManager from '../../../Framework/Script/Engine/BundleManager';
import CardData_domino from './domino_game/CardData_domino';
import GameCtrl from './domino_game/GameCtrl';

const {ccclass, property} = cc._decorator;
var tag_lang = {
    "zh-CN":"tog_zh",
    "en-US":"tog_en",
    "zh-TW":"tog_tw",
    "ar-EG":"tog_eg",
    "id-ID":"tog_id",
    "ja-JP":"tog_jp",
    "vi-VN":"tog_vn",
}

@ccclass
export default class DominoUI extends cc.Component {
    //四个按钮
    @property(cc.Node)
    layer_btn: cc.Node = null;
    //两个按钮
    @property(cc.Node)
    layer_btnSecure: cc.Node = null;
    //一个按钮
    @property(cc.Node)
    layer_over: cc.Node = null;
    //玩家nod
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    card_area: cc.Node = null;

    @property(cc.Node)
    master: cc.Node = null;

    @property(cc.Node)
    nod_girl: cc.Node[] = [];

    //等待动画
    @property(cc.Node)
    nod_waiting: cc.Node = null;
    
    //选项
    @property(cc.Node)
    nod_lan_select: cc.Node = null;

    @property(cc.Label)
    txt_lan_cur: cc.Label = null;

    @property(cc.Node)
    card_parent:cc.Node=null;

    @property(cc.Node)
    rival_area: cc.Node=null;

    @property(cc.Node)
    rival_parents: cc.Node=null

    @property(cc.Label)
    score:cc.Label=null

    @property(cc.Node)
    winLable:cc.Node=null

    @property(cc.Node)
    lossLable:cc.Node=null

    @property(cc.Label)
    getScore:cc.Label=null

    //-----------参数----------------------
    //暂停，时间相关
    is_run = false;
    timer=0;
    area_t=null;
    is_waitMe = false;


    data_result = null;
    //等级
    match_idx = 1;
    m_gameCtrl:GameCtrl=null

    lastEvent=null

    restartArg=null
    
    playerScore=0
    onDeal=false

    onLoad(): void {
        g.AudioMgr.playMusic("music_21");
        //使用语言
        let curLangName = LocalDB.get(LangDef.LOCAL_LANGNAME)
        if (curLangName) {
            this.change_lang_tog(curLangName);
        }
        this.nod_lan_select.active = false;
    }



    change_lang_tog(lan){
        this.txt_lan_cur.string = lan;
        let tog_name = null
        for(let k in tag_lang){
            if(k==lan){
                tog_name = tag_lang[k]
                break;
            }
        }
        
        let tog_select = this.nod_lan_select.getChildByName("tog_select")
        if(tog_name && tog_select){
            for(let i in tog_select.children){
                let c_lang = tog_select.children[i]
                if(c_lang.name == tog_name){
                    c_lang.getComponent(cc.Toggle).check();
                    break;
                }
            }
        }
    }
    onCreate(data) {
        this.m_gameCtrl=new GameCtrl
        this.m_gameCtrl.init()
        this.initGame();

    }

    initGame(){
        //等待动画是否播放，开始后在cmd_free_start函数中关闭该动画
        this.nod_waiting.active = true;
        this.nod_waiting.getChildByName("item_wait").active = true;
        this.nod_waiting.getChildByName("btn_cancel").active = false;
        this.nod_waiting.getChildByName("btn_match").active = false;
        this.m_gameCtrl.init()
        
        this.hide_btns();
        this.player.active=false
        this.card_parent.destroyAllChildren()
        this.cmd_free_start(event, null, 0)
    }

    //按钮初始化
    hide_btns() {
        this.layer_btn.active = false;
        this.layer_btnSecure.active = false;
        this.layer_over.active = false;
    }

    checkMsg(){
        if(this.m_gameCtrl.ifMsg){
            
            this.m_gameCtrl.ifMsg=false
            this.difMessage(this.m_gameCtrl.getEvent(),this.m_gameCtrl.getArg(),this.m_gameCtrl.getid())
        }
    }


    update(dt) {
        this.checkMsg()    
        if (this.is_run) {

        } else {
            if (this.timer > 0) {
                this.timer -= dt;
                if (this.timer <= 0) {
                    if (this.area_t) {
                        this.area_t.turn_spare();
                        this.area_t = null;
                    }
                    if (this.is_waitMe) {
                        this.layer_btn.active = true;
                    }
                }
            }
        }
    }

    difMessage(event: string,args,id) {
        switch (event) {
            case 'free_match':
                {
                    this.cmd_free_start(event,this.restartArg, id);
                    break;
                }
            case 'state':
                {
                    this.cache_state(event, args, id);
                    break;
                }
            case 'choose_card':
                {
                    this.choose_card(event, args, id)
                    break;
                }
            case 'choose_side':
                {
                    this.choose_side(event, args, id)
                    break;
                }
            case 'reDeal':
                {
                    this.reDeal(event, args, id)
                    break;
                }
            case 'rivalPlay':
                {
                    this.rivalPlay(event, args, id)
                    break;
                }
            case 'rivalReDeal':
                {
                    this.rivalReDeal(event, args, id)
                    break;
                }
            case 'afterDeal':
                {
                    this.card_area.getComponent("CardArea_domino").arrangCard(args.handCardNum,false)
                    break
                    
                }
            case 'useOut':
                {
                    this.card_area.getComponent("CardArea_domino").arrangCard(args.handCardNum,false)
                    this.m_gameCtrl.ifSupplement()
                    break
                    
                }
            case "null":
                break;
        }
    }

    choose_card(event, args, id){
        var chooseRotateLeft=args.chooseRotateLeft
        var chooseRotateRight=args.chooseRotateRight
        console.log('outLeft:'+args.outLeft)
        console.log('outRight:'+args.outRight) 
        var leftShow= args.outLeft? 1:0
        var rightShow= args.outRight? 1:0
        var leftNum=this.m_gameCtrl.getCardNum('left')
        var rightNum=this.m_gameCtrl.getCardNum('right')
        var leftPos=args.leftPos
        var rightPos=args.rightPos
        var leftPosY=args.leftPosY
        var rightPosY=args.rightPosY
        this.changeChooseArea(args,leftNum,'left',leftShow,leftPos,chooseRotateLeft,leftPosY)
        this.changeChooseArea(args,rightNum,'right',rightShow,rightPos,chooseRotateRight,rightPosY)
        this.card_area.getComponent("CardArea_domino").closeLight()
        this.card_area.getComponent("CardArea_domino").openLight(args.choosingCard)
    }

    changeChooseArea(args,num,side,ifshow,pos,rotate,posY){
        var c_data=CardData_domino.getPokerData(args.choosingCard)
        var sideCoefficient=side=='left'? 1:-1
        var special=side=='left'? this.m_gameCtrl.leftSpecial:this.m_gameCtrl.rightSpecial
        if(c_data.up==c_data.down){
            if(num==0){
                rotate+=90
            }
            else if(num>0&&num<5||num>=17&&num<25){
                pos+=sideCoefficient*160/4
                rotate+=90
            }
            else if(num>=5&&num<6||num>=15&&num<16){
                pos+=0
                rotate+=0
                posY+=sideCoefficient*160/4
            }
            else if(num>=6&&num<7){
                pos-=sideCoefficient*160/4
                rotate+=0
                posY-=0
            }
            else if(num>=7&&num<15){
                if(num!=7||!special){
                    pos-=sideCoefficient*160/4
                    rotate+=90
                }

            }
            else if(num>=15&&num<16){
                pos+=0
                rotate+=0
                posY+=sideCoefficient*160/4
            }
            else if(num>=16&&num<17){
                pos+=sideCoefficient*160/4
                rotate+=0
                posY-=0
            }
            

        }

        this.card_area.getComponent("CardArea_domino").setChooseAreaActive(side,ifshow,pos,rotate,posY)
        

    }
    

    choose_side(event, args, id){
        this.card_area.getComponent("CardArea_domino").closeLight()
        var side=args.choosingSide
        var pos= side=='left'? args.leftPos:args.rightPos
        var card=args.choosingCard
        var rotate=args.rotate       
        this.card_area.getComponent("CardArea_domino").moveCard(pos,side,card,rotate)
        var result=this.judgeResult(args)
        this.card_area.getComponent("CardArea_domino").arrangCard(args.handCardNum,true)
        if(!result){
            this.m_gameCtrl.ifRivalSupplement()
        }   
    }

    judgeResult(args){
        //手牌出完
        if(args.handCardNum==0)
        {
            var getScore=this.rival_area.getComponent('Rival_domino').getWinScore()  
            this.win(getScore)  
            console.log('玩家出光')
            this.card_area.getComponent('CardArea_domino').closeAllBtn()
            return true
        }
        else if(args.rivalCardNum==0)
        {
            var getScore=this.card_area.getComponent('CardArea_domino').getLoseScore()
            this.lose(getScore)
            console.log('电脑出光')
            this.card_area.getComponent('CardArea_domino').closeAllBtn()
            return true
        }
        //手牌满，输一半
        if(args.rivalCardNum>14){
            var getScore=this.rival_area.getComponent('Rival_domino').getWinScore()  
            this.win(getScore/2) 
            this.card_area.getComponent('CardArea_domino').closeAllBtn()
            return true
        }
        else if(args.handCardNum>14){
            var getScore=this.card_area.getComponent('CardArea_domino').getLoseScore()
            this.lose(getScore/2)
            this.card_area.getComponent('CardArea_domino').closeAllBtn()
            return true

        }
        if(this.m_gameCtrl.getDealtNum()>=this.m_gameCtrl.DECKSIZE&&!this.m_gameCtrl.canTwoSidePlay()){
            this.card_area.getComponent('CardArea_domino').closeAllBtn()
            var playerScore=this.card_area.getComponent('CardArea_domino').getLoseScore()
            var rivalScore=this.rival_area.getComponent('Rival_domino').getWinScore()
            if(playerScore<=rivalScore){
                this.win(rivalScore-playerScore)  
                return true
            }
            else{
                this.lose(playerScore-rivalScore)               
                return true               
            }
        }
        return false

    }

    judgeDeck(args){
        if(this.m_gameCtrl.getDealtNum()>=this.m_gameCtrl.DECKSIZE){
            return true                
        }
        return false
    }
    
    win(getScore){
        this.winLable.active=true
        this.getScore.node.active=true 
        this.getScore.string='+'+getScore
        this.playerScore+=getScore
        this.score.string=''+this.playerScore
    }
    lose(getScore){
        this.lossLable.active=true
        this.getScore.node.active=true
        this.playerScore-=getScore    
        this.getScore.string='-'+getScore
        this.score.string=''+this.playerScore
    }



    rivalPlay(event, args, id){
        //this.m_gameCtrl.ifRivalSupplement() 
        var chooseRotateLeft=args.chooseRotateLeft
        var chooseRotateRight=args.chooseRotateRight
        var leftNum=this.m_gameCtrl.getCardNum('left')
        var rightNum=this.m_gameCtrl.getCardNum('right')
        var leftPos=args.leftPos
        var rightPos=args.rightPos
        var leftPosY=args.leftPosY
        var rightPosY=args.rightPosY
        this.rivalChangeChooseArea(args,leftNum,'left',0,leftPos,chooseRotateLeft,leftPosY)
        this.rivalChangeChooseArea(args,rightNum,'right',0,rightPos,chooseRotateRight,rightPosY)

        //this.rival_area.getComponent("Rival_domino").setChooseAreaActive('left',0,args.leftPos,args.chooseRotateLeft,args.leftPosY)
        //this.rival_area.getComponent("Rival_domino").setChooseAreaActive('right',0,args.rightPos,args.chooseRotateRight,args.rightPosY)
        var side=args.rivalChoosingSide
        var pos= side=='left'? args.leftPos:args.rightPos
        var card=args.rivalChoosingCard
        
        var moveCardtime=500
        var playCardtime=800
        if(this.onDeal){
            moveCardtime=1100
            playCardtime=1400
            this.onDeal=false
        }
        else{
            moveCardtime=500
            playCardtime=800
        }
        this.m_gameCtrl.duringRivalPlay()
        var rotate=this.m_gameCtrl.getRotate()
        
        setTimeout(()=>{
            this.rival_area.getComponent("Rival_domino").moveCard(pos,side,card,rotate)
        },moveCardtime)
        
        setTimeout(() =>{
            this.rival_area.getComponent("Rival_domino").moveOutCard(pos,side,card,rotate)
            if(!result){
                this.m_gameCtrl.ifSupplement()
            }
            var result=this.judgeResult(args)

        },playCardtime)
        this.m_gameCtrl.changeChoosePos(args.rivalChoosingSide,args.rivalChoosingCard)       
    }
    rivalChangeChooseArea(args,num,side,ifshow,pos,rotate,posY){
        var c_data=CardData_domino.getPokerData(args.rivalChoosingCard)
        var sideCoefficient=side=='left'? 1:-1
        var special=side=='left'? this.m_gameCtrl.leftSpecial:this.m_gameCtrl.rightSpecial
        if(c_data.up==c_data.down){
            if(num==0){
                rotate+=90
            }
            else if(num>0&&num<6||num>=18&&num<25){
                pos+=sideCoefficient*160/4
                rotate+=90
            }
            else if(num>=6&&num<7||num>=16&&num<17){
                pos+=0
                rotate+=0
                posY+=sideCoefficient*160/4
            }
            else if(num>=7&&num<8){
                pos-=sideCoefficient*160/4
                rotate+=0
                posY-=0
            }
            else if(num>=8&&num<16){
                
                if(num!=8||!special){
                    pos-=sideCoefficient*160/4
                    rotate+=90
                }
                
            }
            else if(num>=17&&num<18){
                pos+=sideCoefficient*160/4
                rotate+=0
                posY-=0
            }

        }

        this.rival_area.getComponent("Rival_domino").setChooseAreaActive(side,ifshow,pos,rotate,posY)
        

    }


    reDeal(event, args, id){
        if (args.cards) {
                var c_data = args.cards[args.cards.length-1];
                var area = this.card_area
                if (area) {
                    //创建并发牌
                    area.getComponent("CardArea_domino").poker_start(c_data,args.handCardNum-1) 
                    var result=this.judgeResult(args)
                    if(!result){
                        this.m_gameCtrl.ifSupplement()    
                    }
                    else{
                        this.m_gameCtrl.afterDeal()
                    }                            
            }
        }
    }


    rivalReDeal(event, args, id){
        if (args.rivalCards) {
                var c_data = args.rivalCards[args.rivalCards.length-1];
                var area = this.rival_area
                if (area) {
                    //创建并发牌
                    this.onDeal=true
                    area.getComponent("Rival_domino").poker_start(c_data,args.rivalCardNum-1) 
                    var result=this.judgeResult(args)
                    if(!result){
                        this.m_gameCtrl.ifRivalSupplement()
                    }                                                
            }
        }
    }

    
    cmd_free_start(event, args, eventid) {
        this.nod_waiting.active = false
        this.referGame(args) 
    }

    cache_state(event, args, eventid) {
        if (!args) return;
        if (eventid != 0) return;
        this.player.active=true
        this.hide_btns();
        this.layer_btnSecure.active=true
        if(args.state=='deal'){
            if (args.cards) {
                for (var i in args.cards) {
                    var c_data = args.cards[i];
                    var rival_c_data = args.rivalCards[i];
                    var area = this.card_area
                    if (area) {
                        //创建并发牌
                        area.getComponent("CardArea_domino").poker_start(c_data,i)
                        this.rival_area.getComponent("Rival_domino").poker_start(rival_c_data,i)
                         
                    }
                }
                this.card_area.getComponent("CardArea_domino").arrangCard(args.handCardNum,false)
            }
        }
    }

    referGame(data){     
        //隐藏按钮
        this.hide_btns();
        this.player.active = true
        var my_info = g.Player;
        var my_id = my_info.getInfoBykey("id");

        this.card_parent.destroyAllChildren()

        this.layer_over.active=true
    }



    ClickGameBtn(btn, data) {
        let name = btn.target.name
        switch (name) {
            //一个钮
            case "btn_rematch":
                //this.initGame();
                //this.cmd_free_start('free_match', this.restartArg, 1);
                this.sendMsg('state')
                break;
            //两个钮
            case 'secure_yes':
                
                this.m_gameCtrl=new GameCtrl
                this.m_gameCtrl.init()
                this.initchild()
                this.initMsg()
                this.card_area.getComponent("CardArea_domino").initPokers()
                this.rival_area.getComponent("Rival_domino").initPokers()
                this.sendMsg('state') 
                break

            //点击牌
            case "btn_card":
                this.m_gameCtrl.sendData(data,'choose_card')
                this.sendMsg('choose_card')              
                break;
            //点击选择区
            case 'btn_choose':
                this.m_gameCtrl.sendData(data,'choose_side')
                this.sendMsg('choose_side')              
                break;
        }
    }

    initMsg(){
        this.winLable.active=false
        this.lossLable.active=false
        this.getScore.node.active=false
    }

    sendMsg(event:string){
        this.m_gameCtrl.getMsg(event)
    }

    initchild(){
        var child=this.card_parent.children
        for(var i=0;i<child.length;i++)
        {
            child[i].destroy()
        }
        var child=this.rival_parents.children
        for(var i=0;i<child.length;i++)
        {
            child[i].destroy()
        }

    }


}
