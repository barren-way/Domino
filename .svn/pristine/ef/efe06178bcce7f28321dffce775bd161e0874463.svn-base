import { g } from "../../../../Framework/Script/G";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    private spinBtn:cc.Button        = null ;       //开始按钮
    @property(cc.Sprite)
    private wheelSp:cc.Sprite        = null ;       //转盘
    @property(cc.Float)
    private maxSpeed:number          = 0 ;          //最大速度
    @property(cc.Float)
    private duration:number          = 0 ;          //减速前旋转时间
    @property(cc.Float)
    private acc:number               = 0 ;          //加速度
    @property(cc.Float)
    private targetID:number          = 0 ;          //指定结束ID
    @property(cc.Boolean)
    private springback:boolean       = true ;       //旋转结束回弹
    @property(cc.AudioClip)
    private effectAudio:cc.AudioClip = null ;       //声音组件
    @property([cc.String])
    private gearInfo:Array<string> = []           //物品数组

    private wheelState:number   = 0;                //判断当前是否正在运行
    private curSpeed:number     = 10;               //当前速度
    private spinTime:number     = 2;                //减速前旋转时间
    private gearNum:number      = 10;               //齿轮数量
    private defaultAngle:number = 52;               //修正默认角度
    private gearAngle:number    = 360/this.gearNum; //每个齿轮的角度
    private finalAngle:number   = 0;                //最终结果指定的角度
    private effectFlag:number   = 0;                //用于音效播放
    private decAngle:number     = 5*360             // 减速旋转两圈
    


    onLoad() {
    }

    clickStartBtn():void{
        if(this.wheelState !== 0){
            return;
       }
       this.wheelState = 1;  //改变当前转盘状态
       this.wheelSp.node.rotation = 0
       var time  =new Date()
       this.targetID = Number(time.getSeconds()) % 10 + 1
       console.log(this.targetID,"targetID+++++++++++++++++++++++========")
    }

    backMain():void{
        g.Manager.changeUI("Dating_Main");
    }
    onDestroy() {
    }

    update(dt) {
        if(this.wheelState === 0)
        {
            return;
        }
        if(this.wheelState == 1)
        {
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if(this.curSpeed <= this.maxSpeed)
            {
                this.curSpeed += this.acc;
            }
            else
            {
                if(this.spinTime<this.duration)
                {
                    return;
                }
                // cc.log('....开始减速');
                // //设置目标角度
                var b = Math.round(Math.random()*(this.targetID+1)*this.gearAngle)
                console.log(b,"b==============================")
                 this.finalAngle = 360-(this.targetID*this.gearAngle+Math.round(Math.random()*this.gearAngle)) + this.defaultAngle
                 this.maxSpeed = this.curSpeed;
                if(this.springback)
                {
                    this.finalAngle += this.gearAngle;
                }
                this.wheelSp.node.rotation = this.finalAngle;
                this.wheelState = 2;
            }
        }
        else if(this.wheelState == 2)
        {
            // cc.log('......减速');
            var curRo = this.wheelSp.node.rotation; //应该等于finalAngle
            var hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed*((this.decAngle-hadRo)/this.decAngle) + 0.2; 
            this.wheelSp.node.rotation = curRo + this.curSpeed;

            if((this.decAngle-hadRo)<=0)
            {  
                // cc.log('....停止');
                this.wheelState = 0;
                //this.wheelSp.node.rotation = this.finalAngle + this.gearAngle
                if(this.springback)
                {
                    //倒转一个齿轮
                    // var act = new cc.rotateBy(0.6, -this.gearAngle);
                    var act = cc.rotateBy(2, -this.gearAngle);
                    var seq = cc.sequence(cc.delayTime(0.2),act,cc.callFunc(this.showRes, this));
                    this.wheelSp.node.runAction(seq);
                }
                else
                {
                    this.showRes();
                }
            }
        }
    }

    showRes(): void {
        if(cc.sys.isBrowser)
        {
            alert('You have got ' + this.gearInfo[this.targetID]);
        }
        else cc.log(this.gearInfo[this.targetID]);
    }
}


