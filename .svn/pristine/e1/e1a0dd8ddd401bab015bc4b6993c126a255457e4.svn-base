
import Player from "../../../Framework/Script/Data/Player";
import { NetConfig } from "../../../Framework/Script/Net/NetConfig";
import NetHttp from "../../../Framework/Script/Net/NetHttp";
import NetModel from "./NetModel";
import User from "../../../Framework/Script/Data/User";
import { cfg } from "./Config";
import Sdk_Wechat from "../../../Framework/Script/Sdk/Sdk_Wechat";
import SdkManager from "../../../Framework/Script/Sdk/SdkManager";

//游戏中充值管理接口
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChargeManager {
    //充值回调
    public static chargeTestCallback = null;

    public static charge(callback, itemid, price?) {
        let userinfo = Player.getInstance().getAllInfo()

        let params = {
            userid: userinfo.id,
            platform: 1,
            serverid: 1,
            itemid: itemid,
            gameid: 1,
            token: User.getInstance().sid,
            env: cfg.env,
        }

        if (cc.sys.isNative) {
            //暂时支持微信支付
            let _charge_callback = (result: string, event, args) => {
                if (result == NetConfig.HttpResult.OK) {
                    if (args.result && args.result.payinfo) {
                        SdkManager.getInstance().payWx(args.result.payinfo, (code) => {
                            if (callback) { callback({ code: code }) }
                        })
                    } else {
                        if (callback) { callback({ code: 1 }) }
                    }
                } else {
                    if (callback) { callback({ code: 1 }) }
                }
            }

            NetHttp.getInstance().send(NetModel.getUsHost() + "/pay/weixin/create", params, _charge_callback)
        } else if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            let buy_fun = () => {
                let _pay_callback = (result: string, event, args) => {
                    if (result == NetConfig.HttpResult.OK) {
                        if (callback) { callback({ code: 0 }) }
                    } else {
                        if (callback) { callback({ code: 1 }) }
                    }
                }
                NetHttp.getInstance().send(NetModel.getUsHost() + "/pay_web/wechatgame/buy", params, _pay_callback)
            }

            let buymi_fun = () => {
                SdkManager.getInstance().doPay({
                    env: cfg.env,
                    offerId: cfg.offerId,
                    buyQuantity: cfg.payrate * price,
                    zoneId: cfg.zoneId,
                    callback: (args) => {
                        switch (args.code) {
                            case 0:
                                buy_fun()
                                break;
                            case 1:
                                if (callback) { callback({ code: 1 }) }
                                break;
                        }
                    }
                })
            }

            let _checking_callback = (result: string, event, args) => {
                if (result == NetConfig.HttpResult.OK) {
                    if (args.result.balance != undefined) {
                        if (args.result.balance >= price) {
                            buy_fun()
                        } else {//米大师余额不足，跳转充值
                            buymi_fun()
                        }
                    }
                } else {
                    if (callback) { callback({ code: 1 }) }
                }
            }
            NetHttp.getInstance().send(NetModel.getUsHost() + "/pay_web/wechatgame/balance", params, _checking_callback)

        } else {
            let _charge_callback = (result: string, event, args) => {
                if (result == NetConfig.HttpResult.OK) {
                    if (args.result && args.result.url) {
                        if (window["WXSdk"]) {
                            window["WXSdk"].wxPay({
                                payInfo: args.result.url.payinfo,
                                callback: (ret, res) => {
                                    if (ret == 'ok') {
                                        callback({ code: 0 })
                                    } else {
                                        callback({ code: 1 })
                                    }
                                }
                            })
                        }
                    } else {
                        if (callback) { callback({ code: 1 }) }
                    }
                } else {
                    if (callback) { callback({ code: 1 }) }
                }
            }
            NetHttp.getInstance().send(NetModel.getUsHost() + "/pay_web/weixin/create", params, _charge_callback)
        }
    }

    public static doCharge(iteminfo, resultcallback) {
        if (iteminfo) {
            let userinfo = Player.getInstance().getAllInfo()
            if (!cfg.isFormal) {
                let params = {
                    token: User.getInstance().sid,
                    itemid: iteminfo.id,
                }
                NetHttp.getInstance().send(NetModel.getUsHost() + "/p/pay/paytest", params, resultcallback)
            } else {
                ChargeManager.charge(resultcallback, iteminfo.id, iteminfo.price)
            }
        }
    }
}
