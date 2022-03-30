import { g } from "../../../../Framework/Script/G";
import { GameSingle } from "../GameSingle";
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
    shuffle = "shuffle", //洗牌
    ready = "ready", //准备中
    deal = "deal", //发牌
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
            case "shuffle":
                curState = M_STATE.ready
                break;
            case "ready":
                if (this.isLong){
                    curState = M_STATE.deal
                }else{
                    curState = M_STATE.bet
                }
                break;
            case "deal":
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
        let rTable1 = GameSingle.GetMainRoad(win_list)

        this.selection.removeAllChildren()
        if (rTable1 && rTable1.length > 0) {
            let sub = GameSingle.GetMaxNum(rTable1) - this.column
            let dis = 20
            for (let index = 0; index < rTable1.length; index++) {
                let v = rTable1[index]
                let i = v[0]
                if (sub > 0) {
                    i = i - sub
                }
                let j = v[1]
                switch (v[2]) {
                    case 1:
                        let tpSpriteR = cc.instantiate(this.red)
                        tpSpriteR.active = true
                        tpSpriteR.setPosition(cc.v2(i * dis + dis / 2, (6 - j) * dis - dis / 2))
                        this.selection.addChild(tpSpriteR)
                        if (v[3]) {
                            let tpSpriteG = cc.instantiate(this.green)
                            tpSpriteG.setPosition(cc.v2(0, 0))
                            tpSpriteG.active = true
                            tpSpriteR.addChild(tpSpriteG)
                        }
                        break;
                    case 2:
                        let tpSpriteB = cc.instantiate(this.blue)
                        tpSpriteB.active = true
                        tpSpriteB.setPosition(cc.v2(i * dis + dis / 2, (6 - j) * dis - dis / 2))
                        this.selection.addChild(tpSpriteB)
                        if (v[3]) {
                            let tpSpriteG = cc.instantiate(this.green)
                            tpSpriteG.setPosition(cc.v2(0, 0))
                            tpSpriteG.active = true
                            tpSpriteB.addChild(tpSpriteG)
                        }
                        break;
                    case 3:
                        break;
                }
            }
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
