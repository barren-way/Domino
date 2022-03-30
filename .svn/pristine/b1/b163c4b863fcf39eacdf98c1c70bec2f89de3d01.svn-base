import { MainDef } from "../../../Dating/Script/MainDef";
import { GameDef } from "../GameDef";
import NetModel from "../NetModel";
import { cfg } from "../Config";
import { g } from "../../../../Framework/Script/G";
import { NetConfig } from "../../../../Framework/Script/Net/NetConfig";
import ListView from "../List/ListView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class layer_store extends cc.Component {
    //商店弹板
    @property(cc.ToggleContainer)
    private mTogLeft: cc.ToggleContainer = null;

    @property(ListView)
    private mNodRightScroll: ListView = null;

    //手机号兑换话费
    @property(cc.Prefab)
    private mFabPhone: cc.Prefab = null;//

    @property(cc.Label)
    private mLabSurplus: cc.Label = null;


    private m_sceneScript = null;
    private m_params = null

    private m_netEvents = [
        'user.paytest', "lobby.lecong.goodlist", "lobby.main.roomcard2goldlist", "lobby.main.roomcard2gold", "lobby.lecong.mobilelist"
    ]

    private m_userInfo = null;
    private m_shopUrl = null
    private m_chargeInfos_roomcard = null; //充值列表数据
    private m_goodsInfos = null; //商品列表数据
    private m_huafeiInfos = null;//话费列表数据
    private m_exchangeInfos = null;//钻石兑换金币数据
    private m_vipInfos = null;//vip数据

    private m_chargeInfos_gold = null

    private m_selHuafeiIdx = 0 //选择的话费兑换档位

    private m_curBuyType = 0 //购买类型
    private m_curPage = 0
    private m_pageMax = 0
    private PAGE_GOODS_MAX = 1000000

    onLoad() {
    }

    onEnable() {
        this.m_sceneScript = g.Manager.getSceneScript()
        for (let i = 0; i < this.m_netEvents.length; i++) {
            g.NetData.addEventListener(this.m_netEvents[i], this.onMessage.bind(this), "layer_store");
        }
        cc.director.on(GameDef.EVENTS.NOTIFY_REF_STORE, this.refPlayerView, this)
    }

    onDisable() {
        for (let i = 0; i < this.m_netEvents.length; i++) {
            g.NetData.removeEventListener(this.m_netEvents[i], "layer_store");
        }
        cc.director.off(GameDef.EVENTS.NOTIFY_REF_STORE, this.refPlayerView, this)

    }

    show(params) {
        cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO_ADD, false)
        this.m_params = params ? params : {}
        cc.log("layer_store params:" + JSON.stringify(params))
        // if (CC_JSB || cc.sys.platform == cc.sys.WECHAT_GAME) {
        //     this.mTogLeft.toggleItems[2].node.active = false
        // }
        this.mTogLeft.toggleItems[2].node.active = true
        this.mTogLeft.toggleItems[4].node.active = false
        this.m_userInfo = g.Player.getAllInfo()
        this.m_chargeInfos_roomcard = null
        this.m_chargeInfos_gold = null
        this.m_vipInfos = null
        this.m_goodsInfos = null
        this.m_huafeiInfos = null
        this.m_exchangeInfos = null
        this.m_curPage = 1
        this.m_pageMax = 1
        this.m_curBuyType = this.m_params.buytype ? this.m_params.buytype : GameDef.BUYTYPE_ROOMCARD
        this.refView()
    }

    isShow() {
        return this.node.active
    }

    refView() {
        g.GameUtil.setToggerCheck(this.mTogLeft, this.m_curBuyType)
        switch (this.m_curBuyType) {
            case GameDef.BUYTYPE_ROOMCARD://充值
                g.NetHttp.send(NetModel.getUsHost() + cfg.chargeServer, { ltype: 1 }, this.getPayInfo.bind(this), "user.getPayInfo");
                break;
            case GameDef.BUYTYPE_GOODS://商品
                g.NetSocket.send("lobby.lecong.goodlist", { page: 1, page_size: this.PAGE_GOODS_MAX });
                break;
            case GameDef.BUYTYPE_EXCHANGE://金币
                g.NetSocket.send("lobby.main.roomcard2goldlist", { page: 1, page_size: this.PAGE_GOODS_MAX });
                break;
            case GameDef.BUYTYPE_GOLD://金币
                g.NetHttp.send(NetModel.getUsHost() + cfg.chargeServer, { ltype: 3 }, this.getPayInfo.bind(this), "user.getPayInfo");
                break;

        }
    }

    refPlayerView() {
        cc.log("layer_store refPlayerView start")
        if (this.m_params.callback) {
            this.m_params.callback()
        }
        cc.log("layer_store refPlayerView start")
    }

    getPayInfo(result: string, event, args) {
        cc.log("getPayInfo args:" + JSON.stringify(args))
        if (result == NetConfig.HttpResult.OK) {
            //获取充值列表
            if (args.result) {
                this.mNodRightScroll.removeAllListChildren()
                switch (args.result.ltype) {
                    case 1:
                        this.m_chargeInfos_roomcard = args.result.list
                        this.refershType(GameDef.BUYTYPE_ROOMCARD)
                        break;
                    case 2:
                        this.m_vipInfos = args.result.list
                        let itemnum = Math.ceil(this.m_vipInfos.length / 2)
                        this.mNodRightScroll.numItems = itemnum
                        break;
                    case 3:
                        this.m_chargeInfos_gold = args.result.list
                        this.refershType(GameDef.BUYTYPE_GOLD)
                        break;
                }

            }
        }
    }

    //话费列表
    createHuafeiList(oneitem, index) {
        this.mLabSurplus.node.active = false
        let startidx = index * 2
        let endidx = index * 2 + 1

        for (let j = startidx; j <= endidx; j++) {
            let onedesk = j == startidx ? cc.find("item0", oneitem) : cc.find("item1", oneitem)
            onedesk.active = false
            if (this.m_huafeiInfos.goodlist.data[j]) {
                let tmpdata = this.m_huafeiInfos.goodlist.data[j]
                onedesk.active = true
                let costicon = cc.find("btn_pay/icon", onedesk)
                if (tmpdata.point > 0) {
                    costicon.active = true
                    costicon.getComponent(cc.Sprite).spriteFrame = g.AssetsMgr.getGoodsSpriteFrame("goods_" + GameDef.ATT_NAMESKV.matchticket)
                    cc.find("btn_pay/price", onedesk).getComponent(cc.Label).string = "x" + tmpdata.point
                } else {
                    costicon.active = false
                    cc.find("btn_pay/price", onedesk).getComponent(cc.Label).string = tmpdata.price + "元"
                }
                onedesk.getChildByName("btn_pay").on(cc.Node.EventType.TOUCH_START, this.huafeiItemClicked.bind(this, j))
                g.GameUtil.DrawHead(onedesk.getChildByName("img").getComponent(cc.Sprite), tmpdata.goods_image)
                onedesk.getChildByName("num").getComponent(cc.Label).string = tmpdata.goods_name
            }
        }
    }

    //实物的列表
    createGoodList(oneitem, index) {
        this.mLabSurplus.node.active = false
        this.m_shopUrl = this.m_goodsInfos.shopurl
        let startidx = index * 2
        let endidx = index * 2 + 1

        for (let j = startidx; j <= endidx; j++) {
            let onedesk = j == startidx ? cc.find("item0", oneitem) : cc.find("item1", oneitem)
            onedesk.active = false
            if (this.m_goodsInfos.data.list[j]) {
                let tmpdata = this.m_goodsInfos.data.list[j]
                onedesk.active = true

                cc.find("btn_pay/icon", onedesk).active = false

                onedesk.getChildByName("btn_pay")["paydata"] = tmpdata
                onedesk.getChildByName("img_bg")["paydata"] = tmpdata

                onedesk.getChildByName("img_bg").active = true
                onedesk.getChildByName("img").active = false
                onedesk.getChildByName("num").active = false
                let txt_scroll = onedesk.getChildByName("txt_scroll")
                txt_scroll.active = false

                g.GameUtil.DrawHead(onedesk.getChildByName("img_bg").getComponent(cc.Sprite), tmpdata.goods_image)

                cc.find("txt", txt_scroll).getComponent(cc.Label).string = tmpdata.goods_name + "\n" + "价格：" + tmpdata.price
                cc.find("btn_pay/price", onedesk).getComponent(cc.Label).string = "兑换"

                onedesk.getChildByName("btn_pay").on(cc.Node.EventType.TOUCH_START, this.huafeiItemClicked.bind(this, j))
                onedesk.getChildByName("img_bg").on(cc.Node.EventType.TOUCH_START, this.showInfo.bind(this, onedesk))
                txt_scroll.on(cc.Node.EventType.TOUCH_START, this.closeInfo.bind(this, onedesk))
            }
        }
    }

    showInfo(onedesk) {
        onedesk.getChildByName("txt_scroll").active = true
    }

    closeInfo(onedesk) {
        onedesk.getChildByName("txt_scroll").active = false
    }

    //充值的列表
    createChargeList(oneitem, index) {
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz============" + index)
        this.mLabSurplus.node.active = false
        let startidx = index * 2
        let endidx = index * 2 + 1
        for (let j = startidx; j <= endidx; j++) {
            let onedesk = j == startidx ? cc.find("item0", oneitem) : cc.find("item1", oneitem)
            onedesk.active = false
            if (this.m_chargeInfos_roomcard[j]) {
                onedesk.active = true
                cc.find("btn_pay/icon", onedesk).active = false
                cc.find("btn_pay/price", onedesk).getComponent(cc.Label).string = this.m_chargeInfos_roomcard[j].price + "元"
                onedesk.getChildByName("btn_pay").on(cc.Node.EventType.TOUCH_START, this.chargeItemClicked.bind(this, this.m_chargeInfos_roomcard[j]))
                let itemid, itemn
                for (const key in GameDef.ATT_NAMESKV) {
                    if (this.m_chargeInfos_roomcard[j][key] != null) {
                        itemid = GameDef.ATT_NAMESKV[key]
                        itemn = this.m_chargeInfos_roomcard[j][key]
                        break
                    }
                }
                if (itemid) {
                    onedesk.getChildByName("num").getComponent(cc.Label).string = "x" + itemn
                    onedesk.getChildByName("img").getComponent(cc.Sprite).spriteFrame = g.AssetsMgr.getGoodsSpriteFrame("goods_" + itemid)
                }
            }
        }
    }

    //充值的列表
    createChargeGoldList(oneitem, index) {
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz============" + index)
        this.mLabSurplus.node.active = false
        let startidx = index * 2
        let endidx = index * 2 + 1
        for (let j = startidx; j <= endidx; j++) {
            let onedesk = j == startidx ? cc.find("item0", oneitem) : cc.find("item1", oneitem)
            onedesk.active = false
            if (this.m_chargeInfos_gold[j]) {
                onedesk.active = true
                cc.find("btn_pay/icon", onedesk).active = false
                cc.find("btn_pay/price", onedesk).getComponent(cc.Label).string = this.m_chargeInfos_gold[j].price + "元"
                onedesk.getChildByName("btn_pay").on(cc.Node.EventType.TOUCH_START, this.chargeItemClicked.bind(this, this.m_chargeInfos_gold[j]))
                let itemid, itemn
                for (const key in GameDef.ATT_NAMESKV) {
                    if (this.m_chargeInfos_gold[j][key] != null) {
                        itemid = GameDef.ATT_NAMESKV[key]
                        itemn = this.m_chargeInfos_gold[j][key]
                        break
                    }
                }
                if (itemid) {
                    onedesk.getChildByName("num").getComponent(cc.Label).string = "x" + itemn
                    onedesk.getChildByName("img").getComponent(cc.Sprite).spriteFrame = g.AssetsMgr.getGoodsSpriteFrame("goods_" + itemid)
                }
            }
        }
    }

    //钻石兑换金币的列表
    createExchangeList(oneitem, index) {
        this.mLabSurplus.node.active = false
        let startidx = index * 2
        let endidx = index * 2 + 1

        for (let j = startidx; j <= endidx; j++) {
            let onedesk = j == startidx ? cc.find("item0", oneitem) : cc.find("item1", oneitem)
            onedesk.active = false
            if (this.m_exchangeInfos[j]) {
                onedesk.active = true
                let costicon = cc.find("btn_pay/icon", onedesk)
                costicon.active = true
                costicon.getComponent(cc.Sprite).spriteFrame = g.AssetsMgr.getGoodsSpriteFrame("goods_" + GameDef.ATT_NAMESKV.roomcard)
                cc.find("btn_pay/price", onedesk).getComponent(cc.Label).string = "x" + this.m_exchangeInfos[j].roomcard
                onedesk.getChildByName("btn_pay").on(cc.Node.EventType.TOUCH_START, this.exchangeItemClicked.bind(this, j))
                onedesk.getChildByName("num").getComponent(cc.Label).string = "x" + this.m_exchangeInfos[j].gold
                onedesk.getChildByName("img").getComponent(cc.Sprite).spriteFrame = g.AssetsMgr.getGoodsSpriteFrame("goods_" + GameDef.ATT_NAMESKV.gold)
            }
        }
    }


    onRightItemRender(node: cc.Node, index: number) {
        node.active = true
        switch (this.m_curBuyType) {
            case GameDef.BUYTYPE_ROOMCARD:
                this.createChargeList(node, index)
                break;
            case GameDef.BUYTYPE_HUAFEI:
                this.createHuafeiList(node, index)
                break;
            case GameDef.BUYTYPE_GOODS:
                this.createGoodList(node, index)
                break;
            case GameDef.BUYTYPE_EXCHANGE:
                this.createExchangeList(node, index)
                break;
            case GameDef.BUYTYPE_GOLD:
                this.createChargeGoldList(node, index)  
                break;
        }
    }

    //钻石购买点击
    chargeItemClicked(iteminfo) {
        if (iteminfo) {
            g.ChargeMgr.doCharge(iteminfo, (ret) => {
                if (ret && ret.code == 0) {
                    if (this.mLabSurplus.node.activeInHierarchy) {
                        this.mLabSurplus.string = "VIP剩余时间：" + g.GameUtil.surplusVipTime() + "天"
                    }
                    g.Dialog.show(g.Dialog.TYPE_ONE_BTN, "充值成功，到账可能有延时...", () => {
                        //底层已刷新，这里暂时不刷了
                    })
                } else {
                    g.Dialog.show(g.Dialog.TYPE_TIP, "充值失败...")
                }
            })
        }
    }

    //钻石兑换金币点击
    exchangeItemClicked(eventdata) {
        let itemidx = parseInt(eventdata)
        if (this.m_exchangeInfos[itemidx]) {
            let iteminfo = this.m_exchangeInfos[itemidx]
            g.Dialog.show(g.Dialog.TYPE_TWO_BTN, "确定要消耗" + iteminfo.roomcard + "钻石兑换" + iteminfo.gold + "金币吗?", (ret) => {
                if (ret == 0) {
                    g.NetSocket.send("lobby.main.roomcard2gold", { gold: iteminfo.gold }, true);
                }
            })
        }
    }

    //话费兑换点击
    huafeiItemClicked(eventdata) {
        this.m_selHuafeiIdx = parseInt(eventdata)
        let itemdata = this.m_huafeiInfos.goodlist.data[this.m_selHuafeiIdx]

        if (this.m_userInfo.matchticket < itemdata.point) {
            g.Dialog.show(g.Dialog.TYPE_TIP, "兑换券不足！")
            return
        }

        this.m_sceneScript.showUIWindow(MainDef.WINS.HUAFEI, { card_id: itemdata })
    }

    //商品列表点击
    btn_pay(event, data) {
        window.location.href = decodeURIComponent(this.m_shopUrl)
    }

    MainClicked(btn) {
        let name = btn.target.name
        cc.log("layer_store MainClicked btnname:" + name)
        switch (name) {
            case "btn_close":
                g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_STORE)
                cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO_ADD, true)
                break;
            case "btn_get":
                g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_STORE)
                cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO_ADD, true)
                break;
            case "btn_up":
                if (this.m_curPage > 1) {
                    this.m_curPage = this.m_curPage - 1
                    g.NetSocket.send("lobby.lecong.goodlist", { page: this.m_curPage, page_size: this.PAGE_GOODS_MAX }, true);
                }
                break;
            case "btn_down":
                if (this.m_curPage < this.m_pageMax) {
                    this.m_curPage = this.m_curPage + 1
                    g.NetSocket.send("lobby.lecong.goodlist", { page: this.m_curPage, page_size: this.PAGE_GOODS_MAX }, true);
                }
                break;
        }
    }

    TogClicked(toggle) {
        let name = toggle.target.name
        cc.log("layer_store TogClicked btnname:" + name)
        let tmpdata = name.match(/toggle(\d+)/)
        if (tmpdata && tmpdata[1]) {
            let buytype = parseInt(tmpdata[1])
            switch (buytype) {
                case GameDef.BUYTYPE_ROOMCARD://充值
                    if (!this.m_chargeInfos_roomcard) {
                        g.NetHttp.send(NetModel.getUsHost() + cfg.chargeServer, { ltype: 1 }, this.getPayInfo.bind(this), "user.getPayInfo");
                    } else {
                        this.refershType(buytype)
                    }
                    break;
                case GameDef.BUYTYPE_GOLD://金币
                    if (!this.m_chargeInfos_gold) {
                        g.NetHttp.send(NetModel.getUsHost() + cfg.chargeServer, { ltype: 3 }, this.getPayInfo.bind(this), "user.getPayInfo");
                    } else {
                        this.refershType(buytype)
                    }
                    break;
                case GameDef.BUYTYPE_HUAFEI://话费
                    g.NetSocket.send("lobby.lecong.mobilelist", { page: 1, page_size: this.PAGE_GOODS_MAX });
                    break;
                case GameDef.BUYTYPE_GOODS://商品
                    g.NetSocket.send("lobby.lecong.goodlist", { page: 1, page_size: this.PAGE_GOODS_MAX });
                    break;
                case GameDef.BUYTYPE_EXCHANGE:
                    if (!this.m_exchangeInfos) {
                        g.NetSocket.send("lobby.main.roomcard2goldlist");
                    } else {
                        this.refershType(buytype)
                    }
                    break;
            }
        }
    }

    public onMessage(event, args, eventid) {
        cc.log("layer_store onMessage args:", args)
        let ret = false
        switch (event) {
            case "user.paytest":
                ret = true
                g.Dialog.show(g.Dialog.TYPE_TIP, "支付成功!!!")
                break;
            case "lobby.lecong.goodlist":
                ret = true
                if (args) {
                    this.m_goodsInfos = args
                    this.refershType(GameDef.BUYTYPE_GOODS)
                }
                break;
            case "lobby.lecong.mobilelist":
                ret = true
                if (args) {
                    this.m_huafeiInfos = args
                    this.refershType(GameDef.BUYTYPE_HUAFEI)
                }
                break;
            case "lobby.main.roomcard2goldlist":
                ret = true
                if (args) {
                    this.m_exchangeInfos = args
                    this.refershType(GameDef.BUYTYPE_EXCHANGE)
                }
                break;
            case "lobby.main.roomcard2gold":
                ret = true
                g.Dialog.show(g.Dialog.TYPE_TIP, "兑换成功!!!")
                break;
        }

        return ret
    }

    refershType(buytype) {
        this.m_curBuyType = buytype
        this.mNodRightScroll.removeAllListChildren()
        let itemnum = null
        switch (buytype) {
            case GameDef.BUYTYPE_ROOMCARD:
                if (this.m_chargeInfos_roomcard) {
                    itemnum = Math.ceil(this.m_chargeInfos_roomcard.length / 2)
                }
                break;
            case GameDef.BUYTYPE_HUAFEI:
                if (this.m_huafeiInfos && this.m_huafeiInfos.goodlist) {
                    itemnum = Math.ceil(this.m_huafeiInfos.goodlist.data.length / 2)
                }
                break;
            case GameDef.BUYTYPE_GOODS:
                if (this.m_goodsInfos && this.m_goodsInfos.data && this.m_goodsInfos.data.list) {
                    itemnum = Math.ceil(this.m_goodsInfos.data.list.length / 2)
                }
                break;
            case GameDef.BUYTYPE_EXCHANGE:
                if (this.m_exchangeInfos) {
                    itemnum = Math.ceil(this.m_exchangeInfos.length / 2)
                }
                break;
            case GameDef.BUYTYPE_GOLD:
                if (this.m_chargeInfos_gold) {
                    itemnum = Math.ceil(this.m_chargeInfos_gold.length / 2)
                }
                break;
        }
        this.mNodRightScroll.numItems = itemnum
    }
}
