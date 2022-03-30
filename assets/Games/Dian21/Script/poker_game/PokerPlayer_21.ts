import {g} from '../../../../Framework/Script/G'

const {ccclass, property} = cc._decorator;

@ccclass
export default class PokerPlayer_21 extends cc.Component {

    @property(cc.Node)
    nod_player:cc.Node=null;

    @property(cc.Sprite)
    icon:cc.Sprite=null;

    @property(cc.Label)
    txt_name:cc.Label=null;
    
    @property(cc.Label)
    txt_score:cc.Label=null;

    @property(cc.Node)
    score_add:cc.Node=null;

    @property(cc.Node)
    score_sub:cc.Node=null;

    @property(cc.Sprite)
    spx_timer:cc.Sprite=null;

    @property(cc.Node)
    nod_state:cc.Node=null;

    @property(cc.Node)
    txt_state:cc.Node[]=[];

    @property(cc.Node)
    nod_secure:cc.Node = null;

    @property(cc.Node)
    nod_eff: cc.Node = null;

    chips=[];

    m_data=null;
    //房间中的位置1-5
    idx=0;
    //座位1-5
    sit_pos=0;
    player_id=0;
    nick="";
    avatar=null;
    score=0;
    sex=2;

    timer_cur=0;
    timer_all=20;

    onLoad () {
        
    }

    getValueByKey(key){
        if(this.m_data){
            return this.m_data[key];
        }else{
            return null;
        }
    }

    onEnable () {

    }

    isEmpty () {
        if(this.player_id){
            return false;
        }
        return true;
    }

    onDisable () {

    }

    getPlayerId () {
        return this.player_id;
    }

    getSeatIdx () {
        return this.idx;
    }

    getSex () {
        return this.sex;
    }

    getNick () {
        return this.nick;
    }

    setPosIndex (pos) {
        this.sit_pos=pos;
    }

    getPosIndex () {
        return this.sit_pos;
    }

    refresh_score (new_score) {
        if (new_score==null||new_score==undefined){
            return;
        }
        this.score=new_score;
        this.txt_score.string=""+this.score;
    }

    setIsMine(is_mine){
        let icon_mine=this.nod_player.getChildByName("icon_mine");
        if(icon_mine){
            icon_mine.active=is_mine;
        }
    }

    isMine(){
        let icon_mine=this.nod_player.getChildByName("icon_mine");
        if(icon_mine && icon_mine.activeInHierarchy){
            return true;
        }
    }

    resetInfo () {
        this.player_id=0;
        this.sit_pos=0;
        this.icon.node.active=false;
        this.txt_name.string="";
        this.txt_score.string="0";
        this.setIsMine(false);
        this.hideTimer();
        this.hide_state();
        if(this.nod_eff){
            this.nod_eff.removeAllChildren();
        }
    }

    setInfo (p_info) {
        this.m_data=p_info;
        this.nod_player.active=true;
        this.resetInfo();
        this.player_id=p_info.id;
        this.nick=decodeURI(p_info.nick);
        this.txt_name.string=this.nick;
        this.icon.node.active=true;
        this.idx=p_info.idx;
        this.sex=p_info.sex;
        this.refresh_score(p_info.gold);
        if(p_info.avatar){
            this.avatar=p_info.avatar;
            g.GameUtil.DrawHead(this.icon,p_info.avatar);
        }
    }

    resetState (){
        this.hideTimer();
    }
    
    isMaster () {

    }

    score_effect (cur_score) {
        if(cur_score==null||cur_score==undefined){
            return;
        }

        var model=cur_score>=0? this.score_add:this.score_sub;
        var eff_txt = cc.instantiate(model);
        eff_txt.active = true;
        eff_txt.opacity=0;
        eff_txt.parent = this.nod_eff;
        eff_txt.position = cc.v3(0,0,0);
        eff_txt.getComponent(cc.Label).string=""+cur_score;
        var act_1=cc.spawn(cc.moveBy(0.3,cc.v2(0,200)),cc.fadeIn(0.3));
        eff_txt.runAction(cc.sequence(act_1,cc.delayTime(5),cc.removeSelf()));
    }

    btn_choseFight (evt,data) {
        if(this.player_id){
            g.NetSocket.send('action',{event:4,fight_player:this.player_id},true);
        }
    }

    removePlayer (){
        this.resetInfo();
        this.nod_player.active=false;
        this.score_add.active=false;
        this.score_sub.active=false;
        this.spx_timer.node.active=false;
    }

    showTimer (timer,t_all){
        if(timer&&timer>0){
            this.spx_timer.node.active=true;
            this.spx_timer.fillRange=1;
            this.timer_cur=timer;
            if(t_all){
                this.timer_all=t_all;
            }else{
                this.timer_all=20;
            }
        }
    }

    hideTimer (){
        this.spx_timer.node.active=false;
        this.spx_timer.fillRange=0;
        this.timer_cur=0;
    }

    show_state(s_idx){
        for(var i in this.txt_state){
            this.txt_state[i].active=(Number(i)==s_idx);
        }
        this.nod_state.stopAllActions();
        this.nod_state.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(this.hide_state.bind(this))));
    }

    hide_state(){
        for(var i in this.txt_state){
            this.txt_state[i].active=false;
        }
    }

    buy_secure(chips) {
        if(!chips){
            return 
        }

        var p1=this.node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_start=this.nod_secure.convertToNodeSpaceAR(p1);

        for (var i in chips){
            var chip=chips[i];
            chip.parent=this.nod_secure;
            chip.position=p_start;
    
            var rand_x=40-Math.random()*80;
            var rand_y=40-Math.random()*80;
            var pos=cc.v2(rand_x,rand_y)
            chip.runAction(cc.sequence(cc.delayTime(Number(i)*0.01),cc.moveTo(0.1,pos)));
            this.chips.push(chip);
        }

        g.AudioMgr.playSound("bet");
    }

    add_secure(chips) {
        if(!chips){
            return 
        }

        for (var i in chips){
            var chip=chips[i];
            chip.parent=this.nod_secure;
            var rand_x=40-Math.random()*80;
            var rand_y=40-Math.random()*80;
            var pos=cc.v2(rand_x,rand_y);
            chip.position=pos;
            this.chips.push(chip);
        }
    }

    secure_yes(p_node){
        if(!p_node){
            return 
        }

        var p1=p_node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_start=this.nod_secure.convertToNodeSpaceAR(p1);

        var p2=this.node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_end=this.nod_secure.convertToNodeSpaceAR(p2);

        for (var i in this.chips){
            var model=this.chips[i];
            var chip=cc.instantiate(model);
            chip.parent=this.nod_secure;
            chip.position=p_start;

            var rand_x=40-Math.random()*80;
            var rand_y=40-Math.random()*80;
            var pos=cc.v2(rand_x,rand_y);

            chip.runAction(cc.sequence(cc.delayTime(0.3),cc.moveTo(0.2,pos),cc.delayTime(0.5),cc.moveTo(0.2,p_end),cc.removeSelf()));
        }

        for (var i in this.chips){
            var chip=this.chips[i];
            chip.runAction(cc.sequence(cc.delayTime(1),cc.moveTo(0.2,p_end),cc.removeSelf()));
        }
        this.chips=[];
        g.AudioMgr.playSound("betall");
    }

    secure_no(p_node){
        if(!p_node){
            return 
        }

        var p1=p_node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_end=this.nod_secure.convertToNodeSpaceAR(p1);

        for (var i in this.chips){
            var chip=this.chips[i];
            chip.runAction(cc.sequence(cc.delayTime(0.5),cc.moveTo(0.2,p_end),cc.removeSelf()));
        }
        this.chips=[];
        g.AudioMgr.playSound("bet");
    }
    
    update (dt){
        if(this.spx_timer.node.active&&this.timer_all>0){
            this.timer_cur=this.timer_cur-dt;
            if(this.timer_cur<0){
                this.timer_cur=0
            }
            if(this.timer_cur<3 && this.timer_cur+dt>=3){
                if(this.isMine()){
                    g.AudioMgr.playSound("3scd");
                }
            }
            this.spx_timer.node.active=true;
            this.spx_timer.fillRange=this.timer_cur/this.timer_all;
        }
    }
}
