import { g } from "../../../../Framework/Script/G";
import Tools from "../Tools";

const { ccclass, property } = cc._decorator;

//时间
enum M_TIME {
    ready = 3,
    bet = 30,
    open = 10,
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
    shuffle = "洗牌中 ", //洗牌
    ready = "准备中", //准备中
    deal = "发牌中", //发牌
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

    @property(cc.SpriteFrame)
    WinListBg: cc.SpriteFrame[] = [];

    //时间
    @property(cc.Label)
    private statetime: cc.Label = null;

    //路单节点
    @property(cc.Node)
    private selection: cc.Node = null;

    //列
    @property(cc.Integer)
    private column: number = 0;

    //红
    @property(cc.Prefab)
    private red: cc.Prefab = null;

    //蓝
    @property(cc.Prefab)
    private blue: cc.Prefab = null;
    //绿
    @property(cc.Prefab)
    private green: cc.Prefab = null;

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
            this.people.string = "" + data.count
        }
        this.quota.string = this.isShowFont ? (""+ String(data.range[0]) + "-" + String(data.range[1])):(String(data.range[0]) + "-" + String(data.range[1]))
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
        this.TimeCountDown(curtime, curState)
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
        this.WinList_join(win_list)
    }

    WinList_join(args) {
        //获胜录单(加入时刷新)
        var winListArray = args;
        for (let i = 0; i < 10; i++) {
            if (winListArray[winListArray.length - 1 - i] == undefined) {
                this.selection.getChildByName("a" + (i + 1)).getChildByName("Num").getComponent(cc.Label).string = "";
            } else {
                this.selection.getChildByName("a" + (i + 1)).getChildByName("Num").getComponent(cc.Label).string = "" + winListArray[winListArray.length - 1 - i]
                switch (winListArray[winListArray.length - 1 - i]) {
                    case 0:
                        this.selection.getChildByName("a" + (i + 1)).getComponent(cc.Sprite).spriteFrame = this.WinListBg[0];
                        break;
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 9:
                    case 12:
                    case 14:
                    case 16:
                    case 18:
                    case 19:
                    case 21:
                    case 23:
                    case 25:
                    case 27:
                    case 30:
                    case 32:
                    case 34:
                    case 36:
                        this.selection.getChildByName("a" + (i + 1)).getComponent(cc.Sprite).spriteFrame = this.WinListBg[1];
                        break;
                    default:
                        this.selection.getChildByName("a" + (i + 1)).getComponent(cc.Sprite).spriteFrame = this.WinListBg[2];
                        break;

                }
            }
        }
    }

    AddRoad(data): void {
        if (this.people) {
            this.people.string = "" + data.count
        }
        this.TimeCountDown(M_TIME["result"], M_STATE.result)
        this.win_list = data.win_list
        this.RefershRoad()
    }



    update(dt) {

    }

}
