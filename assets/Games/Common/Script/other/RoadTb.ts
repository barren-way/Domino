import { g } from "../../../../Framework/Script/G";
import Tools from "../Tools";

const { ccclass, property } = cc._decorator;

//时间
enum M_TIME {
    shuffle = 0,
    ready = 3,
    deal = 3,
    bet = 20,
    open = 3,
    result = 4,
}

//状态
enum M_STATE {
    ready = "ready", //准备中
    bet = "bet", //下注
    open = "open", //开牌
    result = "result", //派奖
}

enum M_STATENAME {
    ready = "准备中", //准备中
    bet = "下注中", //下注
    open = "开牌中", //开牌
    result = "派奖中", //派奖
}

@ccclass
export default class NewClass extends cc.Component {

    //房间名
    @property(cc.Label)
    private roomname: cc.Label = null;

    //在线人数
    @property(cc.Label)
    private people: cc.Label = null;

    //投注限额
    @property(cc.Label)
    private quota: cc.Label = null;

    //投注限额
    @property(cc.Boolean)
    private isShowFont: boolean = true;


    //时间
    @property(cc.Label)
    private statetime: cc.Label = null;

    //路单节点
    @property(cc.Node)
    private selection: cc.Node = null;

    //列
    @property(cc.Integer)
    private column: number = 0;

    @property(cc.SpriteFrame)
    private pl_dice: Array<cc.SpriteFrame> = []


    @property(cc.Node)
    private btn_go: cc.Node = null;

    private mTimeHandler: number = null;
    private isLong :boolean = true
    private win_list = null

    //场景自带消息处理
    onMessage(event: string, args: object, id: number) {

    }

    onError(code: number, event: string, message: string): boolean {
        return false;
    }

    RefershItem(data): void {
        this.roomname.string = data.title
        if (this.people) {
            this.people.string = "在线 " + data.count
        }
        this.quota.string = this.isShowFont ? ("投注限额 "+ String(data.range[0]) + "-" + String(data.range[1])):(String(data.range[0]) + "-" + String(data.range[1]))
        this.isLong = data.isLong
        this.TimeCountDown(data.countdown, data.state)
        this.win_list = data.win_list
        this.RefershRoad()
        this.btn_go.on("touchend", this.GoGame.bind(this, data.roomid), this.btn_go);
        
    }
    




    GoGame(data): void {
        g.NetSocket.send('join', { roomid: data }, true);
    }

    onDisable(): void {
        this.stopCountDown();
    }

    //倒计时
    TimeCountDown(_time, _state): void {
        let s = _time;
        s < 10 && (s = '0' + s);
        let str = M_STATENAME[_state] + s
        if (this.statetime) {
            this.statetime.string = str
        }
        if (Number(s) == 0) {
            this.CurGameState(_state)
        }
        function countDown() {
            s--;
            if (s >= 0) {
                if (Number(s) == 0) {
                    this.CurGameState(_state)
                } else {
                    s < 10 && (s = '0' + s);
                    let str1 = M_STATENAME[_state] + s
                    if (this.statetime) {
                        this.statetime.string = str1
                    }
                }
            }
        }
        this.stopCountDown();
        this.mTimeHandler = setInterval(countDown.bind(this), 1000);
    }

    private stopCountDown() {
        if (this.mTimeHandler) {
            clearInterval(this.mTimeHandler);
            this.mTimeHandler = null;
        }
    }

    //当前游戏状态
    CurGameState(_state): void {
        let curState = null
        switch (_state) {
            case "ready":
                curState = M_STATE.bet
                break;
            case "bet":
                curState = M_STATE.open
                break;
            case "open":
                curState = M_STATE.result
                break;
            case "result":
                curState = M_STATE.ready
                break;
        }
        let curtime = M_TIME[curState]
        if (curState != "result") {
            this.TimeCountDown(curtime, curState)
        }
    }

    //刷新路单
    RefershRoad(): void {
        let win_list = this.win_list
        if (!Tools.isArray(win_list)) {
            win_list = []
        }
        if (win_list.length < 0) {
            return
        }
        this.selection.removeAllChildren()
        for (let index = 0; index < win_list.length; index++) {
            let item = cc.instantiate(this.node.getChildByName("item"))
            item.active = true
            let posx = win_list.length > 20 ? (index - (win_list.length - 20)) * 33.35 : index * 33.35
            item.setPosition(cc.v2(posx, 0))
            item.getChildByName("points").getComponent(cc.Sprite).spriteFrame = this.pl_dice[win_list[index][3] - 1]
            item.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.pl_dice[win_list[index][0] + 2]
            item.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.pl_dice[win_list[index][1] + 2]
            item.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.pl_dice[win_list[index][2] + 2]
            this.selection.addChild(item)
        }
    }

    AddRoad(data): void {
        if (this.people) {
            this.people.string = "在线 " + data.count
        }
        this.TimeCountDown(M_TIME["result"], M_STATE.result)
        this.win_list = data.win_list
        this.RefershRoad()
    }



    update(dt) {

    }

}
