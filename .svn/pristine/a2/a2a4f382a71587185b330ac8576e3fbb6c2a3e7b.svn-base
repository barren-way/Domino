import {g} from '../../../../Framework/Script/G'
import Tools from "../../../Common/Script/Tools"

const {ccclass, property} = cc._decorator;

@ccclass
export default class BetArea_21 extends cc.Component {

    @property(cc.Label)
    num_all:cc.Label = null;

    @property(cc.Node)
    nod_chips:cc.Node = null;

    @property(cc.Node)
    nod_pokers:cc.Node = null;

    @property(cc.Node)
    poker_model:cc.Node = null;

    @property(cc.Node)
    nod_start:cc.Node=null;

    @property(cc.Node)
    nod_score:cc.Node = null;

    @property(cc.Label)
    txt_score:cc.Label = null;

    @property(cc.Node)
    nod_select:cc.Node = null;

    @property(cc.Node)
    nod_tip:cc.Node = null;

    @property(cc.Node)
    nod_spare:cc.Node = null;

    @property(cc.Label)
    txt_spare:cc.Label = null;

    @property(cc.Node)
    img_secure:cc.Node = null;

    @property(cc.Node)
    nod_player:cc.Node = null;

    @property(cc.Node)
    spf_eff:cc.Node[] = [];

    @property(cc.SpriteFrame)
    spx_state1:cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    spx_state2:cc.SpriteFrame[] = [];

    chips:cc.Node[]=[];
    pokers:cc.Node[]=[];
    real_idx=0;
    data_cur=null;
    data_spare=null;

    angle_poker=0;

    //当前显示的是否是分支
    is_spare=false;

    onLoad(): void {
        this.is_spare=false;
        this.num_all.string="0";
        this.txt_score.string="";
        this.nod_score.active=false;
        this.nod_select.active=false;
        this.nod_tip.active=false;
        this.nod_spare.active=false;
        this.txt_spare.string="";
        this.nod_player.active=false;
        this.img_secure.active=false;
        this.show_eff(-1);
    }

    isShowSpare(){
        return this.is_spare;
    }

    setNumAll(n_all): void {
        if(n_all){
            this.num_all.string=""+n_all;
        }
    }

    setAngle(angle){
        if(angle){
            this.angle_poker=angle;
        }
    }

    getNumBet(): Number {
        var num=Number(this.num_all.string);
        if(num!=null){
            return num;
        }
        return null;
    }

    setRealIdx(idx): void {
        if(idx){
            this.real_idx=idx;
        }
    }

    getRealIdx(idx): number {
        return this.real_idx;
    }

    getRealPos(px){
        if(this.angle_poker){
            var p_cos=Math.cos(Math.abs(this.angle_poker)*Math.PI/180);
            var p_sin=Math.sin((0-this.angle_poker)*Math.PI/180);
            var new_x=px*p_cos;
            var new_y=px*p_sin;
            return cc.v2(new_x,new_y);
        }else{
            return cc.v2(px,0);
        }
    }

    bet_chip(p_node,chips) {
        if(!p_node||!chips){
            return 
        }

        var p1=p_node.node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_start=this.nod_chips.convertToNodeSpaceAR(p1);

        for (var i in chips){
            var chip=chips[i];
            chip.parent=this.nod_chips;
            chip.position=p_start;
    
            var pos=cc.v2(0,this.chips.length*7);
            chip.runAction(cc.sequence(cc.delayTime(Number(i)*0.01),cc.moveTo(0.1,pos)));
            this.chips.push(chip);
        }

        this.touch_close();
        g.AudioMgr.playSound("bet");
    }

    chip_fly(p_node) {
        if(!p_node){
            return 
        }

        var p1=p_node.node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_end=this.nod_chips.convertToNodeSpaceAR(p1);

        let idx=0;
        for (let i=this.chips.length-1;i>=0;i--){
            var chip=this.chips[i];
            chip.runAction(cc.sequence(cc.delayTime(idx*0.1),cc.moveTo(0.25,p_end),cc.removeSelf()));
            idx ++;
        }
        this.chips=[];
        g.AudioMgr.playSound("betall");
    }

    refresh_bet(num,chips) {
        if(!num){
            return 
        }
        this.setNumAll(num);

        if(!chips){
            return 
        }

        for (var i in chips){
            var chip=chips[i];
            chip.parent=this.nod_chips;
            var pos=cc.v2(0,this.chips.length*7);
            chip.position=pos;
            this.chips.push(chip);
        }
    }

    poker_start (cards) {
        if(!this.nod_start){
            return;
        }
        if(!cards){
            return;
        }
        if(!this.poker_model){
            return;
        }
        this.nod_pokers.removeAllChildren();
        this.pokers=[];

        var p1=this.nod_start.convertToWorldSpaceAR(cc.v2(0,0));
        var p_start=this.nod_chips.convertToNodeSpaceAR(p1);
        var start_x=p_start.x;
        var start_y=p_start.y;

        this.data_cur=cards;
        for(var i in cards.pei){
            var p_id=cards.pei[i];
            var poker=cc.instantiate(this.poker_model);
            poker.active=true;
            poker.parent=this.nod_pokers;
            poker.scale=0.5;
            poker.x=start_x;
            poker.y=start_y;
            var p_info=poker.getComponent("Poker_21");
            p_info.savePokerId(p_id);

            var pos=this.getRealPos(Number(i)*45);    
            poker.rotation=this.angle_poker;
            poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.moveTo(0.2,pos),cc.callFunc(this.openPokers.bind(this))));
            this.pokers.push(poker);
        }
    }
    
    get_poker (cards,is_action) {
        if(!this.nod_start){
            return;
        }
        if(!cards){
            return;
        }
        if(!this.poker_model){
            return;
        }

        this.data_cur=cards;
        for(var i in cards.pei){
            var p_id=cards.pei[i];
            var poker=this.pokers[i];
            if(!poker){
                var p1=this.nod_start.convertToWorldSpaceAR(cc.v2(0,0));
                var p_start=this.nod_chips.convertToNodeSpaceAR(p1);
                var start_x=p_start.x;
                var start_y=p_start.y;
                poker=cc.instantiate(this.poker_model);
                poker.active=true;
                poker.parent=this.nod_pokers;
                poker.scale=0.5;
                poker.x=start_x;
                poker.y=start_y;
                poker.rotation=this.angle_poker;
                
                var len=this.pokers.length;
                var pos=this.getRealPos(len*45);  
                if(is_action){
                    poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.moveTo(0.2,pos)));
                }else{
                    poker.x=pos.x;
                    poker.y=pos.y;
                }
                this.pokers.push(poker);
            }
            var p_info=poker.getComponent("Poker_21");
            p_info.refresh(p_id);
        }

        this.show_score(cards.type,cards.point);
    }

    poker_sound () {
        g.AudioMgr.playSound("fir");
    }

    openPokers () {
        for(var i in this.pokers){
            var poker=this.pokers[i];
            var p_info=poker.getComponent("Poker_21");
            p_info.open();
        }

        var cards=this.data_cur;
        if(cards){
            this.show_score(cards.type,cards.point);
        }
    }

    refresh_score (num_s) {
        if(num_s==undefined||num_s==null){
            this.nod_score.active=false;
            return;
        }
        this.refresh_lang_text("",true)
        if(Object.prototype.toString.call(num_s)=='[object Array]'){
            this.txt_score.string=num_s[0]+"/"+num_s[1];
        }else{
            this.txt_score.string=""+num_s;
        }
    }

    refresh_lang_text (l_id,is_show = false) {
        if(is_show){
            this.nod_score.active=true;
        }
        this.txt_score.node.getComponent("BDLangComp").uiID = l_id;
        this.txt_score.node.getComponent("BDLangComp").setText();
    }

    refresh_lang_spare(l_id) {
        this.txt_spare.node.getComponent("BDLangComp").uiID = l_id;
        this.txt_spare.node.getComponent("BDLangComp").setText();
    }

    spxBoard_state1(idx){
        var item_board=this.nod_score.getChildByName("item_board");
        var spx_frame=this.spx_state1[idx];
        if(item_board&&spx_frame){
            //item_board.getComponent(cc.Sprite).spriteFrame=spx_frame;
        }
    }

    spxBoard_state2(idx){
        var img_cover=this.nod_spare.getChildByName("img_cover");
        var spx_frame=this.spx_state2[idx];
        if(img_cover&&spx_frame){
            //img_cover.getComponent(cc.Sprite).spriteFrame=spx_frame;
        }
    }

    mark_change(win_normal,win_spare){
        if(win_normal==null||win_normal==undefined){
            return;
        }
        if(win_spare!=undefined){
            if(this.is_spare){
                if(win_normal>0){
                    this.spxBoard_state2(2);
                }
                if(win_spare>0){
                    this.spxBoard_state1(2);
                }
            }else{
                if(win_normal>0){
                    this.spxBoard_state1(2);
                }
                if(win_spare>0){
                    this.spxBoard_state2(2);
                }
            }
        }else{
            if(win_normal>0){
                this.spxBoard_state1(2);
            }
        }
    }

    select (is_all) {
        this.nod_select.active=true;
    }

    unselect () {
        this.nod_select.active=false;
    }

    stop () {
        
    }

    bomb () {
        this.show_eff(0);
        this.spxBoard_state1(1);
        this.refresh_lang_text("game_center_label_26",true);
        g.AudioMgr.playSound("bomb");
    }

    show_score (c_type,c_point) {
        switch(c_type){
            case 0:{
                if(c_point<0){
                    this.bomb();
                }else{
                    this.spxBoard_state1(0);
                    this.refresh_score(c_point);
                }
                break;
            }
            case 1:{
                if(c_point<0){
                    this.bomb();
                }else{
                    this.spxBoard_state1(0);
                    this.refresh_score(c_point);
                }
                break;
            }
            case 2:{
                this.show_eff(2);
                this.spxBoard_state1(0);
                this.refresh_lang_text("game_center_label_8",true);
                break;
            }
            case 3:{
                this.show_eff(1);
                this.spxBoard_state1(0);
                this.refresh_lang_text("game_center_label_7",true);
                break;
            }
        }
    }
    
    //刷新当前
    refresh_cur (cards) {
        if(!cards){
            return;
        }
        if(!this.poker_model){
            return;
        }

        this.data_cur=cards;
        this.pokers=[];
        this.nod_pokers.removeAllChildren();
        for(var i in cards.pei){
            var p_id=cards.pei[i];
            var poker=cc.instantiate(this.poker_model);
            poker.active=true;
            poker.parent=this.nod_pokers;
            poker.scale=0.5;
            poker.rotation=this.angle_poker;
            var pos = this.getRealPos(Number(i)*45);
            poker.x = pos.x;
            poker.y = pos.y;
            this.pokers.push(poker);

            var p_info=poker.getComponent("Poker_21");
            p_info.refresh(p_id);
        }

        this.show_score(cards.type,cards.point);
    }

    //刷新额外分牌
    refresh_spare (cards,is_double) {
        if(!cards){
            return;
        }
        if(!this.poker_model){
            return;
        }

        this.data_spare=cards;
        this.nod_spare.active=true;
        var nod_pokers=this.nod_spare.getChildByName("nod_pokers");
        nod_pokers.scale=0.6;
        nod_pokers.removeAllChildren();

        for(var i in cards.pei){
            var p_id=cards.pei[i];
            var poker=cc.instantiate(this.poker_model);
            poker.active=true;
            poker.parent=nod_pokers;
            poker.scale=0.5;
            poker.rotation=this.angle_poker;
            var pos = this.getRealPos(Number(i)*45);
            poker.x = pos.x;
            poker.y = pos.y;
            var p_info=poker.getComponent("Poker_21");
            p_info.refresh(p_id);
            if(is_double){
                p_info.mark_double();
            }
        }

        // var img_cover=this.nod_spare.getChildByName("img_cover");
        // img_cover.width=65+(cards.pei.length-1)*30;

        switch(cards.type){
            case 0:{
                if(cards.point<0){
                    this.spxBoard_state2(1);
                    this.refresh_lang_spare("game_center_label_26")
                }else{
                    this.spxBoard_state2(0);
                    this.refresh_lang_spare("")
                    if(Object.prototype.toString.call(cards.point)=='[object Array]'){
                        this.txt_spare.string=cards.point[0]+"/"+cards.point[1];
                    }else{
                        this.txt_spare.string=""+cards.point;
                    }
                }
                break;
            }
            case 1:{
                if(cards.point<0){
                    this.spxBoard_state2(1);
                    this.refresh_lang_spare("game_center_label_26")
                }else{
                    this.spxBoard_state2(0);
                    this.refresh_lang_spare("")
                    if(Object.prototype.toString.call(cards.point)=='[object Array]'){
                        this.txt_spare.string=cards.point[0]+"/"+cards.point[1];
                    }else{
                        this.txt_spare.string=""+cards.point;
                    }
                }
                break;
            }
            case 2:{
                this.spxBoard_state2(0);
                this.refresh_lang_text("game_center_label_8",true);
                break;
            }
            case 3:{
                this.spxBoard_state2(0);
                this.refresh_lang_text("game_center_label_7",true);
                break;
            }
        }
    }

    turn_spare(){
        if(this.data_cur&&this.data_spare){
            this.is_spare=true;
            var is_double=this.is_cur_double();
            var temp_cur=this.data_cur;
            var temp_spare=this.data_spare;
            this.refresh_cur(temp_spare);
            this.refresh_spare(temp_cur,is_double);
            this.show_eff(-1);
        }
    }

    touch_open () {
        this.node.getComponent(cc.Button).interactable=true;
        this.nod_tip.active=true;
        this.unselect();
    }

    touch_close () {
        this.node.getComponent(cc.Button).interactable=false;
        this.nod_tip.active=false;
    }

    secure_open () {
        this.img_secure.active=true;
    }

    secure_close(){
        this.img_secure.active=false;
    }

    show_eff(idx){
        for(let i in this.spf_eff){
            let eff_spf=this.spf_eff[i];
            if(Number(i)==idx){
                this.spf_eff[i].active=true;
                if( eff_spf.getComponent(cc.Animation)){
                    eff_spf.getComponent(cc.Animation).play();
                }
            }else{
                this.spf_eff[i].active=false;
                if( eff_spf.getComponent(cc.Animation)){
                    eff_spf.getComponent(cc.Animation).stop();
                }
            }
        }
    }

    show_nick(nick){
        if(nick){
            this.nod_player.active=true;
            var p_nick=this.nod_player.getChildByName("p_nick");
            p_nick.getComponent(cc.Label).string=nick;
        }
    }

    poker_double(){
        for(var i in this.pokers){
            this.pokers[i].getComponent("Poker_21").mark_double();
        }
    }

    is_cur_double(){
        for(var i in this.pokers){
            var is_double=this.pokers[i].getComponent("Poker_21").is_double();
            return is_double;
        }
        return false;
    }

    clean () {
        this.is_spare=false;
        this.pokers=[];
        this.nod_pokers.removeAllChildren();
        this.chips=[];
        this.nod_chips.removeAllChildren();
        this.num_all.string="0";
        this.txt_score.string="";
        this.nod_score.active=false;
        this.nod_select.active=false;
        this.nod_spare.active=false;
        this.txt_spare.string="";
        this.refresh_lang_text("");
        this.refresh_lang_spare("");
        this.img_secure.active=false;
        this.nod_player.active=false;
        this.data_cur=null;
        this.data_spare=null;
        this.show_eff(-1);
        this.touch_close();
    }
}
