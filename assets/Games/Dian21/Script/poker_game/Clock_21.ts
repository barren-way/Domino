
const {ccclass, property} = cc._decorator;

@ccclass
export default class Clock_21 extends cc.Component {

    @property(cc.Label)
    txt_time: cc.Label = null;

    time=0;
  
    onLoad () {

    }

    update_show () {
        var n_time=Math.ceil(this.time);
        if(n_time>=10){
            this.txt_time.string=""+n_time;
        }else{
            this.txt_time.string="0"+n_time;
        }
    }

    open (time,pos) {
        if(!time){
            return;
        }
        this.node.active=true;
        this.time=time;
        this.update_show();
        if(pos){
            this.node.position=pos;
        }
    }

    hide () {
        this.node.active=false;
    }

    update (dt) {
        this.time-=dt;
        if(this.time<0){
            this.time=0;
        }
        this.update_show();
    }
}
