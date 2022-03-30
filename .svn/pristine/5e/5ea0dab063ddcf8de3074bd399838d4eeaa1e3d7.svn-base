import {g} from '../../../../Framework/Script/G'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChipBar_21 extends cc.Component {

    @property(cc.Node)
    nod_clip: cc.Node = null;

    @property(cc.Node)
    nod_cover: cc.Node = null;

    @property(cc.Node)
    nod_slide: cc.Node = null;

    @property(cc.Label)
    txt_cur: cc.Label = null;

    num_min=0;
    num_max=0;
    num_cur=0;
    h_min=120;
    h_max=450;

    fun_click=null;

    open (min,max) {
        if(min>max){
            this.node.active=false;
            return;
        }
        this.num_min=min;
        this.num_max=max;
        this.node.active=true;
        this.slide_persent(0);
        if(this.nod_cover){
            this.nod_cover.active=true;
        }
    }

    close () {
        this.node.active=false;
        if(this.nod_cover){
            this.nod_cover.active=false;
        }
    }

    setClickFunc (func) {
        this.fun_click=func;
    }

    onLoad () {
        var fun_start=function(event){
            this.drag_state = true;
            var pos=this.nod_clip.convertToNodeSpaceAR(event.getLocation());
            this.slide_bar(pos);
        }

        var fun_move=function(event){
            if (this.drag_state) {
                var pos=this.nod_clip.convertToNodeSpaceAR(event.getLocation());
                this.slide_bar(pos);
            }
        }

        var fun_end=function(event){
            this.drag_state=false;
        }

        var fun_cancel=function(event){
            this.drag_state=false;
        }

        this.nod_slide.on(cc.Node.EventType.TOUCH_START, fun_start, this);
        this.nod_slide.on(cc.Node.EventType.TOUCH_MOVE, fun_move, this);
        this.nod_slide.on(cc.Node.EventType.TOUCH_END, fun_end, this);
        this.nod_slide.on(cc.Node.EventType.TOUCH_CANCEL, fun_cancel, this);
    }

    slide_bar (pos) {
        if(!pos){
            return;
        }

        var py=pos.y;
        if(py<this.h_min){
            py=this.h_min;
        }
        if(py>this.h_max){
            py=this.h_max;
        }

        var pst=(py-this.h_min)/(this.h_max-this.h_min);
        this.slide_persent(pst);
    }

    slide_persent (pst) {
        if(pst>=0&&pst<=1){
            this.nod_clip.height=this.h_min+pst*(this.h_max-this.h_min);
            if(pst==0){
                this.num_cur=this.num_min;
                this.txt_cur.string=this.num_cur+"";
            }else{
                if(pst==1){
                    this.num_cur=this.num_max;
                    this.txt_cur.string=this.num_cur+"";
                }else{
                    this.num_cur=Math.floor(this.num_min+pst*(this.num_max-this.num_min));
                    if(this.num_cur%2!=0){
                        this.num_cur ++;
                    }
                    this.txt_cur.string=this.num_cur+"";
                }
            }
        }
    }

    btn_click (evt,data) {
        if(this.fun_click){
            this.fun_click(this.num_cur);
        }
        this.close();
    }

}
