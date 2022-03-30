import MD5 from "../../../Framework/Script/Engine/md5";
import Tools from "./Tools";
import Dialog from "../../../Framework/Script/Tips/Dialog";
import Manager from "../../../Framework/Script/Engine/Manager";
import GlobalUI from "./GlobalUI";
import { cfg } from "./Config";
import SdkManager from "../../../Framework/Script/Sdk/SdkManager";
import GameUtil from './GameUtil';

//全局分享相关调用的接口,这里不能用g接口调用
const { ccclass, property } = cc._decorator;

@ccclass
export default class GlobalShare {

    private static getSign(code) {
        let signAry = ["asion_v587", '尚尚', code]
        let tmpstr = signAry.join('|&|')
        let md5str = MD5.hex_md5(tmpstr);
        md5str = md5str.toLowerCase()
        let signstr = md5str.substr(9, 5)
        return signstr
    }
    //复制带加密的房间号
    public static copyRoomCode(code, copy) {
        let value = '长按复制->【' + code + "】" + this.getSign(code)
        if (copy) {
            Tools.CopyStr(value)
            Dialog.show(Dialog.TYPE_TIP, "房间号【" + code + "】复制成功")
        }
        cc.log("copyRoomCode str:" + value)
        return value
    }
    //粘贴加密的房间号,格式：长按复制->【137194】f00b2
    public static parseRoomCode(pastestr, callback) {
        if (pastestr == null || pastestr == "") {
            cc.log("pastestr is empty!!")
            return
        }
        cc.log("pastestr:" + pastestr)
        let value = pastestr.match(/长按复制->【(\d+)】(\w+)/)
        cc.log("value=" + value)
        if (value && value.length == 3) {
            if (value[1].match(/\d\d\d\d\d\d/) && value[0].match(/\w\w\w\w\w/) && value[2] == this.getSign(value[1])) {
                callback(0, parseInt(value[1]))
            } else {
                callback(1)
            }
        } else {
            callback(1)
        }
    }

    /*复制大结算成绩*/
    public static copyResultInfo(data, states) {
        let ts = []
        let infos = this.getGameIntro(states.gameid, states)
        ts.push(infos[4])
        for (let v of data.players) {
            let creatorstr = (states && states.creator == v.info.id) ? "【房主】 " : ""
            ts.push(creatorstr + "昵称:" + v.info.nick)
            ts.push("ID:" + v.info.id)
            ts.push("分数:" + v.info.gold)
        }
        let copycontent = ts.join('\n')
        cc.log("copyResultInfo:" + copycontent)
        Tools.CopyStr(copycontent)
        Dialog.show(Dialog.TYPE_TIP, "牌局结果复制成功,请到微信内粘贴分享")
    }

    //微信邀请好友
    public static shareCode(desc, roomcode) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

        } else {
            if (window["WXSdk"]) {
                cc.log("share start")
                window["WXSdk"].wxShareFrends({
                    title: "尚尚",
                    desc: desc,
                    roomid: roomcode,
                    link: cfg.wxUrl,
                    isWx: cfg.isWx,
                    callback: (ret) => {
                        Manager.getInstance().hideGlobalUI(GlobalUI.TYPE_CREATE_WX)
                        GlobalShare.initShareInfo()
                    }
                })
                Manager.getInstance().showGlobalUI(GlobalUI.TYPE_CREATE_WX)
            }
        }
    }

    //退出重置
    public static resetShareInfo() {
        GlobalShare.initShareInfo()
    }

    //分享链接
    public static share() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            SdkManager.getInstance().callUnkownFuction("doShare", {
                title: "尚尚", params: GameUtil.getShareParam(), callback: (ret) => {
                    
                }
            })
        } else {
            if (window["WXSdk"]) {
                window["WXSdk"].wxShareFrends({
                    link: cfg.wxUrl,
                    isWx: cfg.isWx,
                    callback: (ret) => {
                        Manager.getInstance().hideGlobalUI(GlobalUI.TYPE_CREATE_WX)
                        GlobalShare.initShareInfo()
                    }
                })
                Manager.getInstance().showGlobalUI(GlobalUI.TYPE_CREATE_WX)
            } else {
                //g.Sdk.wxShare(8)
                //分享到微信好友
                //g.Sdk.wxShare(9,"界首欢乐麻将","最专业的约局神器",cfg.apkUrl)
                //分享到朋友圈
                SdkManager.getInstance().wxShare(7, "尚尚", "最专业的约局神器", cfg.apkUrl)
            }
        }
    }

    public static initShareInfo() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

        } else {
            if (window["WXSdk"]) {
                window["WXSdk"].wxShareFrends({
                    link: cfg.wxUrl,
                    isWx: cfg.isWx,
                })
            }
        }
    }


    public static getGameIntro(gameid, states?) {

    }
}
