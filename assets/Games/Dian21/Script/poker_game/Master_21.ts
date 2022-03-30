
import {g} from '../../../../Framework/Script/G'
import Tools from "../../../Common/Script/Tools"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Master_21 extends cc.Component {

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
    spf_eff:cc.Node[] = [];

    @property(cc.SpriteFrame)
    spx_state1:cc.SpriteFrame[] = [];

    chips:cc.Node[]=[];
    pokers:cc.Node[]=[];
    data_result=null;
    timer=0;
    fun_over=null;

    onLoad(): void {
        this.txt_score.string="";
        this.nod_score.active=false;
        this.show_eff(-1);
    }

    setFuncOver(fun): void {
        this.fun_over=fun;
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

        var p1=this.nod_start.position;
        var p2=this.node.position;
        var p3=this.nod_pokers.position;
        var start_x=p1.x-p2.x-p3.x;
        var start_y=p1.y-p2.y-p3.y;

        for(var i in cards.pei){
            var p_id=cards.pei[i];
            var poker=cc.instantiate(this.poker_model);
            poker.active=true;
            poker.parent=this.nod_pokers;
            poker.scale=0.4;
            poker.x=start_x;
            poker.y=start_y;
            var p_info=poker.getComponent("Poker_21");
            p_info.savePokerId(p_id);

            var pos=cc.v2(Number(i)*45,0);
            poker.runAction(cc.sequence(cc.callFunc(this.poker_sound.bind(this)),cc.moveTo(0.2,pos),cc.callFunc(this.openPokers.bind(this))));
            this.pokers.push(poker);
        }

        this.show_score(cards.type,cards.point);
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

        for(var i in cards.pei){
            var p_id=cards.pei[i];
            var poker=this.pokers[i];
            if(!poker){
                var p1=this.nod_start.position;
                var p2=this.node.position;
                var p3=this.nod_pokers.position;
                var start_x=p1.x-p2.x-p3.x;
                var start_y=p1.y-p2.y-p3.y;
                poker=cc.instantiate(this.poker_model);
                poker.active=true;
                poker.parent=this.nod_pokers;
                poker.scale=0.4;
                poker.x=start_x;
                poker.y=start_y;
                
                var len=this.pokers.length;
                var pos=cc.v2(len*45,0);
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
    
    show_result (r_data) {
        this.data_result=r_data;
    }

    openPokers () {
        for(var i in this.pokers){
            var poker=this.pokers[i];
            var p_info=poker.getComponent("Poker_21");
            p_info.open();
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

    spxBoard_state1(idx){
        var item_board=this.nod_score.getChildByName("item_board");
        var spx_frame=this.spx_state1[idx];
        if(item_board&&spx_frame){
            //item_board.getComponent(cc.Sprite).spriteFrame=spx_frame;
        }
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

    show_eff(idx){
        for(let i in this.spf_eff){
            let eff_spf=this.spf_eff[i];
            if(Number(i)==idx){
                this.spf_eff[i].active=true;
                if(eff_spf){
                    if( eff_spf.getComponent(cc.Animation)){
                        eff_spf.getComponent(cc.Animation).play();
                    }
                }
            }else{
                this.spf_eff[i].active=false;
                if( eff_spf.getComponent(cc.Animation)){
                    eff_spf.getComponent(cc.Animation).stop();
                }
            }
        }
    }

    chip_fly(p_node,chips) {
        if(!p_node||!chips){
            return 
        }
        
        var p1=p_node.node.convertToWorldSpaceAR(cc.v2(0,0));
        var p_end=this.nod_chips.convertToNodeSpaceAR(p1);
        for (var i in chips){
            var chip=chips[i];
            chip.parent=this.nod_chips;
            chip.position=cc.v2(0,0);
            chip.runAction(cc.sequence(cc.delayTime(Number(i)*0.1),cc.moveTo(0.3,p_end),cc.removeSelf()));
        }
        g.AudioMgr.playSound("betall");
    }

    clean () {
        this.pokers=[];
        this.nod_pokers.removeAllChildren();
        this.chips=[];
        this.nod_chips.removeAllChildren();
        this.show_eff(-1);
        this.txt_score.string="";
        this.nod_score.active=false;
        this.refresh_lang_text("");
        this.data_result = null;
        this.timer = 0;
    }

    update(dt){
        if(this.data_result){
            this.timer-=dt;
            if(this.timer<0){
                this.timer=1;
                var r_data=this.data_result.shift();
                if(r_data){
                    this.get_poker(r_data,true);
                }else{
                    this.data_result=null;
                    if(this.fun_over){
                        this.fun_over();
                    }
                }
            }
        }
    }

}
