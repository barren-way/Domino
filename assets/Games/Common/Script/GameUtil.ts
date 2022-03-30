import AudioManager from "../../../Framework/Script/Engine/AudioManager";
import Manager from "../../../Framework/Script/Engine/Manager";
import SdkManager from "../../../Framework/Script/Sdk/SdkManager";
import NetSocket from "../../../Framework/Script/Net/NetSocket";
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import BundleManager from "../../../Framework/Script/Engine/BundleManager";
import MsgCache from "../../../Framework/Script/Net/MsgCache";
import Dialog from "../../../Framework/Script/Tips/Dialog";
import Player from "../../../Framework/Script/Data/Player";

import Account from "./Account";
import { GameDef } from "./GameDef";
import Global from "./Global";
import NetData from "./NetData";
import Tools from "./Tools";
import ResLoader from "./ResLoader";
import AssetsManager from "./AssetsManager";
import { MainDef } from "../../Dating/Script/MainDef";
import BDLangManager from "./Lang/BDLangManager";


//游戏中通用的一些功能接口,这里不能用g接口调用
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUtil {
    public static m_longitude = -1
    public static m_latitude = -1

    /*  
        切换场景如果需要带参数或者开缓存，可以放在这里统一管理
        gameid:切换的目标场景游戏ID
        uidata:场景切换时传递的ui数据
        netcache:场景切换时是否开启消息缓存
        clearplaying:断连信息是否清除,true表示清除
    */
    public static swithUI(gameid: string, uidata?, netcache?, clearplaying?) {
        let gameinfo = GameDef.GNAMES[gameid]
        if (clearplaying) {
            NetData.setPlaying()
        }
        if (netcache) {
            MsgCache.getInstance().closeCache()
        }

        if (gameinfo.bdname) {
            BundleManager.getInstance().loadBundle(gameinfo.bdname, (err, bundle) => {
                if (bundle) {
                    let curgame = BundleManager.getInstance().getAppByBundleName(gameinfo.bdname)
                    //msgtype这里统一处理了
                    if (uidata && !uidata["msgtype"]) {
                        uidata["msgtype"] = curgame.getMsgType(gameid)
                    }
                    if (uidata && uidata.type == "create") {
                        //创建房间时需要对数据进行特殊处理
                        Tools.SafeCallFunc(curgame, "preCreateGameOk", gameid, uidata.args)
                    }
                    //如果有需要提前设置桌子背景的自己单独处理
                    Tools.SafeCallFunc(curgame, "setDeskBgIdx", curgame.getMsgType())

                    //多语言加载
                    BDLangManager.getInstance().loadBundleLang(gameinfo.bdname)

                    MsgCache.getInstance().openCache(NetData.getCache(gameid))

                    Manager.getInstance().changeUI(gameinfo.scname, uidata)
                }
            })
        } else {
            MsgCache.getInstance().openCache(NetData.getCache(gameid))
            Manager.getInstance().changeUI(gameinfo.scname, uidata)
        }
    }

    //特殊情况下需要踢回到登录界面
    public static changeToLogin() {
        Manager.getInstance().changeUI(GameDef.startScene)
        NetSocket.getInstance().release()
    }

    //同步加载资源
    public static loadResSync(url: string, type: typeof cc.Asset) {
        return new Promise((reovle, reject) => {
            cc.resources.load(url, type, (error: Error, resource: cc.Asset) => {
                if (error) {
                    reject(error);
                } else {
                    reovle(resource);
                }
            });
        });
    }

    //同步加载资源example
    async createSprite(url: string) {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        let resource = await GameUtil.loadResSync(url, cc.SpriteFrame) as cc.SpriteFrame;
        sprite.spriteFrame = resource;

        return sprite;
    }

    /*预加载主场景prefab*/
    public static preloadMainUIPrefab() {
        //同步加载尝试
        for (const i in MainDef.WINS) {
            let layername = MainDef.WINS[i].fabname
            if (layername != "") {
                ResLoader.getInstance().preloadPrefab("Games/DaTing/Prefab/" + layername)
            }
        }

        for (const i in MainDef.MATCH) {
            let layername = MainDef.MATCH[i].fabname
            if (layername != "") {
                ResLoader.getInstance().preloadPrefab("Games/Match/Prefab/" + layername)
            }
        }

    }


    /*预加载游戏中创建房间的prefab*/
    // public static async preloadCreatePrefab() {
    //     //同步加载尝试
    //     for (let i = 0; i < GameDef.GOPENS.length; i++) {
    //         let info = GameDef.GOPENS[i]
    //         let gamename = GameDef.GNAMES[info.gameid].gamename
    //         cc.log("preload prefab index==" + i)
    //         let func = () => {
    //             return new Promise(resolve => {
    //                 ResLoader.getInstance().preloadPrefab("Common/Prefab/CreateRoom/" + gamename + "_create", () => {
    //                     cc.log("preload " + gamename + " ok")
    //                     resolve()
    //                 })
    //             });
    //         }
    //         await func()
    //     }
    // }

    /*
        预加载左边的选择游戏按钮prefab
        btns:保存的按钮列表
        content:按钮添加的父节点，滚动层的content
        curgameid:指定显示哪个游戏按钮
    */

    // public static preloadGameBtns(btns, content, curgameid?) {
    //     if (!btns) {
    //         btns = {}
    //     }

    //     for (let i = 0; i < GameDef.GOPENS.length; i++) {
    //         let gameid = GameDef.GOPENS[i].gameid
    //         let gamename = GameDef.GNAMES[gameid].gamename
    //         if (!btns[gameid]) {
    //             ResLoader.getInstance().createPrefab("Common/Prefab/CreateRoom/btn_" + gamename, (prefab) => {
    //                 btns[gameid] = prefab
    //                 let keys = Tools.getAryKeys(btns)
    //                 if (keys.length == GameDef.GOPENS.length) {
    //                     //防止加载顺序错乱，全部加载完成后重新按ID排下序
    //                     let poskeys = {}
    //                     for (let i = 0; i < GameDef.GOPENS.length; i++) {
    //                         let gamename = GameDef.GNAMES[GameDef.GOPENS[i].gameid].gamename
    //                         poskeys[gamename] = i
    //                     }
    //                     keys.sort(function (id1, id2) {
    //                         let names1 = GameDef.GNAMES[id1].gamename
    //                         let names2 = GameDef.GNAMES[id2].gamename
    //                         return poskeys[names1] - poskeys[names2]
    //                     })

    //                     for (let j = 0; j < keys.length; j++) {
    //                         let tmpgameid = keys[j]
    //                         btns[tmpgameid].parent = content
    //                         btns[tmpgameid].active = curgameid == tmpgameid
    //                         if (curgameid) {
    //                             btns[curgameid].getComponent(cc.Toggle).isChecked = curgameid == tmpgameid
    //                         }
    //                     }
    //                 }

    //             })
    //         } else {
    //             btns[gameid].active = curgameid == gameid
    //             if (curgameid) {
    //                 btns[gameid].getComponent(cc.Toggle).isChecked = curgameid == gameid
    //             }
    //         }
    //     }
    // }


    /*
        播放龙骨动画
        armature:龙骨动画对象
        aniname:指定动画名称
        loop:播放次数 0循环 -1只播放一次
    */
    public static playBonesAni(armature, aniname, loop) {
        if (armature && aniname != "") {
            let _loop = (loop == null) ? 0 : -1
            armature.armatureName = aniname
            armature.playAnimation(aniname, _loop)
        }

    }


    //通过单张png图片创建节点
    public static createImageNode(imagename, atlas?: cc.SpriteAtlas) {
        let imgnode = new cc.Node()
        let sprite = imgnode.addComponent(cc.Sprite)
        if (atlas) {
            sprite.spriteFrame = atlas.getSpriteFrame(imagename);
        } else {
            sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw(imagename))
        }

        return imgnode
    }

    //动态加载Game目录的png图片
    public static loadGameImage(sprite, imagename) {
        if (sprite != null && imagename != null) {
            let imgPath = "resources/Games/" + imagename
            cc.resources.load(imgPath, cc.SpriteFrame, function (err, img: cc.Texture2D) {
                if (!err) {
                    sprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
                }
            })
        }
    }
    //动态加载Common目录下的png图片
    public static loadCommonImage(sprite, imagename) {
        if (sprite != null && imagename != null) {
            let imgPath = "resources/Common/" + imagename
            cc.resources.load(imgPath, cc.SpriteFrame, (err, img: cc.Texture2D) => {
                if (!err) {
                    sprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img)
                }
            })
        }
    }

    //绘制头像
    public static DrawHead(spr, url) {
        //let player_avatar = decodeURI(url);
        let player_avatar = decodeURIComponent(url);
        spr.spriteFrame = null
        let avatar = Number(player_avatar);
        if (spr == null || spr == undefined) return;
        if (!isNaN(avatar)) {
            if (avatar <= 10) {
                if (cc.isValid(spr)) {
                    spr.spriteFrame = AssetsManager.getInstance().getHeadSpriteFrame('icon_' + avatar);
                }
            }
        } else {
            url = player_avatar;
            url = url + "?a=1.jpg";
            cc.assetManager.loadRemote(url, cc.SpriteFrame, function (err, texture: cc.Texture2D) {
                if (cc.isValid(spr)) {
                    spr.spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }
    }

    public static getCanStop(cx, cy, tab, b): any {
        let isHave = false
        if (tab.length <= 0) {
            return isHave
        }
        if (cy == b) {
            isHave = true
        } else {
            for (let index = 0; index < tab.length; index++) {
                if (tab[index][1] = cx) {
                    if (tab[index][2] = cy) {
                        isHave = true
                    }
                }

            }
        }
        return isHave
    }

    public static getNumAbs(_num): any {
        let ret = ""
        let num = Math.abs(_num)
        if (num >= 100000000) {
            let a = Math.floor(num / 1000000)
            let yi = Math.floor(a / 100)
            let dian = a % 100
            if (dian == 0) {
                ret = ret + yi + "亿";
            } else {
                ret = ret + yi + "." + (dian < 10 ? ("0" + dian) : dian) + "亿";
            }

        } else if (num >= 10000) {
            let a = Math.floor(num / 100)
            let wan = Math.floor(a / 100)
            let dian = a % 100
            if (dian == 0) {
                ret = ret + wan + "万";
            } else {
                ret = ret + wan + "." + (dian < 9 ? ("0" + dian) : dian) + "万";
            }
        }
        else {
            ret = "" + num
        }
        return (_num > 0 ? ret : "-" + ret)
    }

    public static getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }

    //播放麻将牌局中的音效
    public static playGameSound(soundname, sex?) {
        if (soundname != "") {
            let gameidx = Manager.getInstance().getSceneScript()["getGameIdx"]()
            let path = "tdhmj/"
            if (sex != null) {
                soundname = (sex == 1 ? "" : "g_") + soundname
            }
            let name = path + soundname + ""
            cc.log("playGameSound name:" + name)
            AudioManager.getInstance().playSound(name)
        }
    }

    //播放聊天中的音效
    public static playChatSound(soundname, sex?) {
        if (soundname != "") {
            let gameidx = Manager.getInstance().getSceneScript()["getGameIdx"]()
            let path = "tdhmj/"
            path = path + "/yuyin/"
            if (sex != null) {
                soundname = (sex == 1 ? "" : "g_") + soundname
            }
            let name = path + soundname + ""
            cc.log("playChatSound name:" + name)
            AudioManager.getInstance().playSound(name)
        }
    }


    public static getToggerCheck(toggerGroup) {
        let idx
        toggerGroup.toggleItems.forEach(tog => {
            if (tog.isChecked) {
                idx = Number(tog.node._name.replace(/[^0-9]/ig, ""))
                return
            }
        });
        if (idx == undefined) {
            idx = 1
        }

        return idx
    }

    public static setToggerCheck(toggerGroup, idx, pre?: string) {
        if (!pre) {
            pre = "toggle"
        }
        let find = false;
        let name = pre + idx
        toggerGroup.toggleItems.forEach(tog => {
            if (tog.node._name == name) {
                tog.isChecked = true
                find = true
                return
            }
        });
        return find
    }
    //获取聊天内容文字
    public static getSpeakRes(sceneScript, sex, idx?) {
        let gameidx = sceneScript.getGameIdx()
        let curgame = BundleManager.getInstance().getAppByGameId(gameidx)
        return curgame.getSpeakRes(sex, idx)
    }


    public static JoinHouseRoom(gameid, states) {
        if (gameid > 0) {
            let data: any = {}
            data.gamename = GameDef.GNAMES[gameid].gamename;
            data.entertype = "house";
            data.roomid = states.roomid;
            Account.getInstance().siginEx(data);
        }

    }
    public static resetBDLocation() {
        this.m_latitude = -1
        this.m_longitude = -1
    }

    //获取坐标
    public static getBDLocation(reset?) {
        console.log("getBDLocation start this.m_longitude=" + this.m_longitude + ",this.m_latitude=" + this.m_latitude)
        if (reset) {
            this.resetBDLocation()
        }
        if (this.m_latitude == -1 || this.m_longitude == -1) {
            //没有坐标，取一次
            SdkManager.getInstance().getLocation((result, p_idx) => {
                console.log("getBDLocation finish result:" + JSON.stringify(result) + "    p_idx:" + p_idx)
                if (result && result.longitude == -1 && result.latitude == -1) {
                    //坐标获取失败
                    console.log("getBDLocation fail !!!!")
                    return;
                }
                if (this.m_longitude == result.longitude && this.m_latitude == result.latitude) {
                    //如果坐标取的相同，就只传一次
                    console.log("getBDLocation same !!!!")
                    return;
                }
                this.m_longitude = result.longitude;
                this.m_latitude = result.latitude;

                let longval = String(result.longitude).match(/\d+\.\d{0,6}/)
                let latval = String(result.latitude).match(/\d+\.\d{0,6}/)

                //可能拆分出来的坐标有问题，这里判断一下
                if (longval && Tools.isArray(longval) && latval && Tools.isArray(latval)) {
                    console.log("getBDLocation finish result:" + JSON.stringify(result) + "    p_idx:" + p_idx)
                    let queryData = {
                        longtitude: longval[0],
                        latitude: latval[0],
                        channelType: '00'
                    }

                    // 以下放置获取坐标后你要执行的代码:
                    NetSocket.getInstance().send('setlongtitude', { "latitude": parseFloat(queryData.latitude), "longtitude": parseFloat(queryData.longtitude), "from": p_idx }, false);
                }
            })
        }
    }

    /**
     * 获取奖励
    */
    public static showRewardAry(_spr, _rwdata) {
        if (_spr == null || _spr == undefined) return;
        if (_rwdata == null || _rwdata == undefined) return;
        _spr.spriteFrame = null
        switch (_rwdata.type) {
            case GameDef.PROP_BASE:
                _spr.spriteFrame = AssetsManager.getInstance().getGoodsSpriteFrame("goods_" + _rwdata.itemid)
                break;
            default:
                let lc_match_reward = Global.getInstance().getData("lc_match_reward")
                let url = null
                for (let i = 0; i < lc_match_reward.length; i++) {
                    if (lc_match_reward[i].type == _rwdata.type && lc_match_reward[i].itemid == _rwdata.itemid) {
                        url = decodeURIComponent(lc_match_reward[i].icon);
                        break
                    }
                }
                url = url + "?a=1.jpg";
                cc.assetManager.loadRemote(url, cc.SpriteFrame, function (err, texture: cc.Texture2D) {
                    if (cc.isValid(_spr)) {
                        _spr.spriteFrame = new cc.SpriteFrame(texture);
                    }
                });
                break;
        }


    }

    //播放获奖动画
    public static playRewardAni(parent, callback?) {

        let fab_reward = Manager.getInstance().getSceneScript()["getRewardFab"]()
        let aninode = parent.getChildByName("aninodes")
        if (cc.isValid(aninode)) {
            aninode.removeFromParent()
            aninode.destroy()
        }
        if (fab_reward) {
            aninode = cc.instantiate(fab_reward)
            parent.addChild(aninode)
            aninode.name = "aninodes"
            aninode.setPosition(cc.v2(0, 0))
            aninode.getComponent("RewardAni").setCB(callback)
            aninode.active = true
        }
    }

    //播放比赛开始动画
    public static playMatchStartAni(parent, callback?) {

        let fab_matchstart = Manager.getInstance().getSceneScript()["getMatchStartFab"]()
        if (fab_matchstart) {
            let aninode = cc.instantiate(fab_matchstart)
            parent.addChild(aninode)
            aninode.setPosition(cc.v2(0, 0))
            aninode.getComponent("MatchStartAni").setCB(callback)
            aninode.active = true
        }
    }

    /*截屏*/
    public static ScreenShot() {
        let curScene = cc.director.getScene()
        if (cc.sys.isNative) {
            SdkManager.getInstance().ShareScreenShot()
        } else {
            let script = curScene.getChildByName("Canvas").getComponent("TextureRenderUtils");
            if (script) {
                script.screenShot();
            }
        }

    }

    //验证手机号合法性
    public static phoneVerify(phonenum) {
        //手机号验证
        let phone = phonenum.replace(/(^\s*)|(\s*$)/g, "")
        if (phone == "") {
            Dialog.show(Dialog.TYPE_TIP, "请输入手机号!")
            return false
        }
        if (!/^[1][3,4,5,6,7,8,9]\d\d\d\d\d\d\d\d\d$/.test(phone)) {
            Dialog.show(Dialog.TYPE_TIP, "手机号无效!")
            return false
        }

        return true
    }

    //密码合法性验证
    public static passVerify(pass) {
        let code = pass.replace(/(^\s*)|(\s*$)/g, "")
        if (code == "") {
            Dialog.show(Dialog.TYPE_TIP, "请输入密码!")
            return false
        }
        if (code.length < 6) {
            Dialog.show(Dialog.TYPE_TIP, "请输入正确密码格式（最低六位)!")
            return false
        }

        return true
    }

    //密码二次确认合法性验证
    public static pass2Verify(pass, pass2) {
        if (pass2.length == 0) {
            Dialog.show(Dialog.TYPE_TIP, "请输入确认密码");
            return false
        }

        if (pass != pass2) {
            Dialog.show(Dialog.TYPE_TIP, "两次密码输入不一致");
            return false
        }

        return true
    }

    //验证码合法性检测
    public static smscodeVerify(smsnum, codelen = 6) {
        let code = smsnum.replace(/(^\s*)|(\s*$)/g, "")
        if (code == "") {
            Dialog.show(Dialog.TYPE_TIP, "请输入验证码!")
            return false
        }
        if (codelen == 6) { //默认6位
            if (!/^\d\d\d\d\d\d$/.test(code)) {
                Dialog.show(Dialog.TYPE_TIP, "验证码格式错误!")
                return false
            }
        } else {
            if (!/^\d\d\d\d$/.test(code)) {
                Dialog.show(Dialog.TYPE_TIP, "验证码格式错误!")
                return false
            }
        }


        return true
    }

    //全局检测比赛公告
    public static checkMatchNotice() {
        let noticedata = Global.getInstance().getMatchNoticeInfo()
        if (noticedata) {
            for (const v of noticedata) {
                Dialog.show(Dialog.TYPE_ONE_BTN, v.content)
            }
            Global.getInstance().setMatchNoticeInfo()
        }
    }

    //弹出键盘
    public static showKeyBoard(parent, params?) {
        let kbfab = AssetsManager.getInstance().getKeyBoardFab()
        if (kbfab) {
            let aninode = cc.instantiate(kbfab)
            parent.addChild(aninode)
            aninode.setPosition(cc.v2(0, 0))
            aninode.active = true
            cc.director.emit(GameDef.EVENTS.NOTIFY_SHOW_KEYBOARD, params)
        }
    }

    //文字转化为*
    public static stringConversionAsterisk(str) {
        let asteriskStr = ""
        if (str.length > 0) {
            for (let k = 0; k < str.length; k++) {
                asteriskStr = asteriskStr + "*"
            }
            return asteriskStr
        } else {
            return null
        }
    }

    public static surplusVipTime() {
        let curtime = Tools.getTimeSecs()
        let m_info = Player.getInstance().getAllInfo()
        if (m_info && m_info.viptime && m_info.viptime > 0) {
            let tday = Tools.zero(m_info.viptime) - Tools.zero(curtime)
            if (tday > 0) {
                return tday / (24 * 60 * 60)
            } else {
                return 0
            }
        } else {
            return 0
        }
    }

    public static getShareParam() {
        let param = { title: "", imageUrlId: "", imageUrl: "" }
        param.imageUrlId = "LT8sVHa/SVWMqS4ugf/mfQ=="
        param.imageUrl = "https://mmocgame.qpic.cn/wechatgame/I5BqI3p1P7Yv0qvdQ4NnkKk7jYCnOQocT5g7Zicots0x2RvpD0HH3DzvQLhrmXic2F/0"

        let ary_random = GameDef.share_title_random;
        let share_txt = ary_random[Math.floor(Math.random() * ary_random.length)];
        if (share_txt) {
            param.title = share_txt
        }
        return param
    }
}
