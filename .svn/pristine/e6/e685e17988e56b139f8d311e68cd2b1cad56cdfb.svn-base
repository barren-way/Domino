import { g } from "../../../../Framework/Script/G";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemVoice extends cc.Component {

    @property(cc.Node)
    private nod_mid: cc.Node = null;

    @property(cc.Node)
    private nod_show: cc.Node = null;

    @property(cc.Node)
    private nod_mask: cc.Node = null;

    @property(cc.Node)
    private nod_tip: cc.Node = null;

    state_touch=false;
    time=0;
    h_mask=140;
    h_cur=0;
    h_dist=0;

    start(){
        this.init();
    }

    init(){
        this.init_touch();
        this.nod_mid.active=false;
        this.nod_show.active=false;
        this.nod_tip.active=false;
    }

    show_dot(){
        this.nod_mid.active=true;
        this.nod_show.active=true;
        this.nod_tip.active=false;
        this.node.stopAllActions();
        this.h_cur=0;
        this.h_dist=Math.floor((1-Math.random()*0.3)*this.h_mask);
    }

    show_tip(){
        this.nod_mid.active=true;
        this.nod_show.active=false;
        this.nod_tip.active=true;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(this.hide_item.bind(this))));
    }

    hide_item(){
        this.nod_mid.active=false;
    }

    init_touch(){
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.audioEngine.pauseAll();
            this.state_touch = true;
            this.show_dot();
            this.time = new Date().getTime()/1000;
            g.Sdk.startRecord();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.audioEngine.resumeAll();
            this.state_touch = false;
            this.nod_mid.active=false;
            if(this.time){
                var new_time = new Date().getTime()/1000;
                if(new_time-this.time>=2){
                    g.Sdk.finishRecord();
                }else{
                    g.Sdk.cancelRecord();
                    this.show_tip();
                }
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            cc.audioEngine.resumeAll();
            this.state_touch = false;
            this.nod_mid.active=false;
            g.Sdk.cancelRecord();
        }, this);
    }

    update(dt) {
        if(!this.nod_mid.active){
            return;
        }

        if(Math.abs(this.h_dist-this.h_cur)>=8){
            this.h_cur+=8*(this.h_dist-this.h_cur)/Math.abs(this.h_dist-this.h_cur);
        }else{
            if(this.h_cur>=this.h_mask/2){
                this.h_dist=Math.floor(Math.random()*0.2*this.h_mask);
            }else{
                this.h_dist=Math.floor((1-Math.random()*0.3)*this.h_mask);
            }
        }

        this.nod_mask.height=this.h_cur;
    }
}
