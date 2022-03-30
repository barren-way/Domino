import GameUtil from "../../Common/Script/GameUtil";
import IApp from "../../Common/Script/IApp";
import { LangDef } from "../../Common/Script/Lang/LangDef";
import XlsxDataManager from "../../Common/Script/Lang/xlsx/XlsxDataManager";
import NetData from "../../Common/Script/NetData";
import {DominoDef} from "./DominoDef"

const _EVENTS = [
    "action","bet","finish","state","secure","result","join","quit","dismiss","free_start","free_match","quitmatch","cancelmatch","match.marry"
];

//暴露给主包使用的各种接口
const { ccclass, property } = cc._decorator;

@ccclass
export default class Domino implements IApp {

    clearData() {
        XlsxDataManager.getInstance().remove(LangDef.LANG_TABLENAME)
    }

    initGame(params: any) {
        throw new Error("Method not implemented.");
    }
    getConfig() {
        throw new Error("Method not implemented.");
    }
    getMsgType(gameid?: any) {
        let msgtype = DominoDef.MSGTYPE_GAME
        switch (gameid) {
            
        }
        return msgtype
    }

    getCacheEvents() {
        if (!this.mCaches) {
            this.mCaches = []
            let type = ""
            NetData.pubEvents.forEach(v => {
                this.mCaches.push(v)
            });
            // NetData.matchEvents.forEach(v => {
            //     this.mCaches.push(type + ".match." + v)
            //     this.mCaches.push(type + ".train." + v)
            // });
            _EVENTS.forEach(v => {
                this.mCaches.push(v)
                // this.mCaches.push(type + ".friend." + v)
                // this.mCaches.push(type + ".match." + v)
                // this.mCaches.push(type + ".train." + v)
            });
        }
        return this.mCaches
    }

    getSpeakRes(sex: any, idx?: any) {
        //return GameUtil.getSpeakResMJ(sex, idx)
    }

    getGameRule(states: any) {
        let rule = ""
        let gamename = "霸州麻将 ";

        rule += states.games + "局 ";

        switch (states.costtype) {
            case 1:
                rule += "房主支付 ";
                break;
            case 2:
                rule += "AA支付 ";
                break;
            case 3:
                rule += "大赢家支付 ";
                break;
        }
        if (states.mode == 1) {
            rule = rule + "四人模式 ";
        } else if (states.mode == 2) {
            rule = rule + "三人模式 ";
        } else if (states.mode == 3) {
            rule = rule + "二人模式 ";
        }

        if (states.dianpao == 0) {
            rule = rule + "自摸 ";
        } else if (states.dianpao == 2) {
            rule = rule + "点炮包胡 ";
        }


        if (states.zhuang == 1) {
            rule = rule + "带庄 ";
        }
        if (states.daigang == 1) {
            rule = rule + "带杠 ";
        }
        if (states.daifeng == 1) {
            rule = rule + "带风 ";
        }

        if (states.base) {
            rule = rule + "底分：" + states.base + " ";
        }
        return { gamename: gamename, rule: rule }
    }

    getLangJsonName() {
        return DominoDef.LANG_JSONNAME
    }

    getLangTableName() {
        return DominoDef.LANG_TABLENAME
    }

    //===================自定义的接口方法================================

    private mCaches = null; //消息缓存表

    private static mInstance: Domino = null;


    public static getInstance() {
        if (!this.mInstance) {
            this.mInstance = new Domino()
        }
        return this.mInstance
    }

    //获取脚本
    getScript(node, winid) {
        if (node && winid >= 0) {
            return node.getComponent(DominoDef.SCRIPTS[winid])
        }
    }
}