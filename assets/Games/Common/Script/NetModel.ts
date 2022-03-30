import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import { cfg } from "./Config";

const URL_KEY: string = "user_server_host";
const URL_KEY_TIME: string = "user_server_host_time";
const URL_EXPIRE = 3600 * 1000 //保留一个小时;

//H5专用端口
const userH5Ports = [17871, 9141]
const svrH5Ports = [17992, 19090]

//超级盾端口
const dun_port_http = 9269;
const dun_port_ws = 9273;
const dun_port_upload = 9171
const localhost_ip = "127.0.0.1:"

//其他渠道端口
const userPorts = [17871, 19141] //用户服端口
const svrPorts = [17992, 19090] //ws游戏服端口

const managePorts = [17187, 9187] //代理后台端口
const webPorts = [25890, 8090] //网页分享链接端口

//前面是测试服，后面是正式服   "game.ztegame.com:"   manage.quanziyou.com:

const userHosts = [["asionspace.8800.org:"], ["game.ztegame.com:"]] //用户服地址
const manageHosts = [["asionspace.8800.org:"], ["game.ztegame.com:"]] //代理后台域名地址


//强更地址
const updateHosts = ["http://game.ztegame.com:19141"]

//头像上传地址
const uploadHosts = []

const subNames = [] //高防域名前缀备用

//游戏中用到的服务器端口地址统一在这里处理
export default class NetModel {
    private static mChangeCount: number = 0;
    private static mMaxTryCount: number = 999;
    private static mSelectServerIdx: number = -1;
    private static mHostList: Array<string> = [];
    private static mGameSvrList: Array<string> = [];
    private static mManageSvrList: Array<string> = [];
    private static mWebSvrList: Array<string> = [];

    private static mUsHost: string = null;//用户服

    private static mGameServer: string = null; //游戏服

    private static mManageServer: string = null;//代理后台

    private static mWebServer: string = null;//网页分享链接地址

    private static m_isH5 = false //当前是不是H5平台

    //===============================超级盾相关
    public static m_useDun = 0 //当前是否使用超级盾

    public static DUN_OPEN = 1 //打开盾
    public static DUN_CLOSE = 0 //关闭盾
    public static GATE_OPEN = false //这个变量比较诡异，意思是关闭盾，开gate
    public static m_dunCount = 0 //盾不通尝试连接的次数

    /*
        1:强更默认使用盾，如果盾失效，再切换到gate，强更下行带是否使用盾标记useDun
        2:前面的gate能连上，检测登录下行是否带盾标记useDun
            (1)如果当前已经在盾里，如果useDun=false，先记下标志，继续使用盾链接，等下次重新登陆时使用gate登录
            (2)如果当前使用的是gate登录，如果useDun=true，先记下标志，继续使用gate链接，等下次重新登陆时使用盾登录
        3:前面的gate都已经连不上，自动切换到盾
        4:游戏中途收到服务器下发的使用盾标记，都先记录，等下次重新登陆时再切换成对应的链接方式
    */

    private static mFuncDunPort: Function = null; //获取超级盾端口IP

    //控制是否使用超级盾
    public static setUseDun(val) {
        this.m_useDun = val
        this.resetDunCount()
        console.log("NetModel setUseDun :" + this.m_useDun)
    }

    //是否正使用盾
    public static isUseDun(): any {
        return this.m_useDun
    }

    public static getDunCount() {
        return this.m_dunCount
    }

    public static resetDunCount() {
        console.log("NetModel resetDunCount!!!!")
        this.m_dunCount = 0
    }

    public static setFuncDunPort(func) {
        this.mFuncDunPort = func;
    }

    public static getDunSvr(port, http?) {
        let dunhost
        if (this.mFuncDunPort && this.isUseDun()) {
            var port = this.mFuncDunPort(port);
            if (port && port > 0) {
                if (http) {
                    dunhost = "http://" + localhost_ip + port;
                } else {
                    dunhost = "ws://" + localhost_ip + port + "/s"
                }
            }
        }
        return dunhost
    }

    //获取用户服地址
    public static getUsHost(): string {
        let dunhost = this.getDunSvr(dun_port_http, true)
        let server = dunhost ? dunhost : this.mUsHost
        cc.log("=====getUsHost:" + server)
        return server
    }

    //获取游戏服地址
    public static getGameSvr(): string {
        let dunhost = this.getDunSvr(dun_port_ws)
        let server = dunhost ? dunhost : this.mGameServer
        cc.log("=====getUsHost:" + server)
        return server
    }

    //获取强更地址(理论上跟用户服是一样)
    public static getUpdateSvr() {
        let dunhost = this.getDunSvr(dun_port_http, true)
        let servers = dunhost ? [dunhost] : updateHosts
        cc.log("=====getUpdateSvr:" + JSON.stringify(servers))
        return servers
    }

    //获取头像上传地址
    public static getUploadSvr() {
        let dunhost = this.getDunSvr(dun_port_upload, true)
        return dunhost ? dunhost : this.mManageServer
    }

    //获取代理后台地址
    public static getManageSvr(): string {
        return this.mManageServer
    }

    //获取网页分享链接地址
    public static getWebSvr(): string {
        return this.mWebServer
    }

    public static getServerIdx(): number {
        //这个有切端口的功能
        let curports = this.m_isH5 ? userH5Ports : userPorts
        return (this.mSelectServerIdx && this.mSelectServerIdx > -1) ? (Math.floor(this.mSelectServerIdx / curports.length) + 1) : 99
    }

    public static getServerIdx2(): number {
        return (this.mSelectServerIdx && this.mSelectServerIdx > -1) ? this.mSelectServerIdx : 99
    }

    public static setMaxTryCount(count: number) {
        if (count) {
            this.mMaxTryCount = count;
            this.mChangeCount = 0
        }
    }

    public static nextUrl(init?) {
        if (init) {
            this.mSelectServerIdx = -1
        }

        if (!init && this.isUseDun()) {
            this.m_dunCount = this.m_dunCount + 1
            console.log("this.m_dunCount=======" + this.m_dunCount)
            if (this.m_dunCount >= 3) {
                //已经是盾了，但是不通了，需要试几次之后，强制切换到gate，否则会无限不通
                this.setUseDun(this.GATE_OPEN)
            }
        }

        let ret = true
        do {
            let list = this.mHostList
            if (list == null || list.length == 0) {
                ret = false
                LocalDB.remove(URL_KEY)
                LocalDB.remove(URL_KEY_TIME)
                break
            }

            this.mChangeCount = this.mChangeCount + 1
            if (this.mChangeCount > this.mMaxTryCount) {
                this.mChangeCount = 0
                ret = false
                break
            }

            this.mSelectServerIdx = this.mSelectServerIdx + 1
            if (this.mSelectServerIdx > list.length - 1) {
                this.mSelectServerIdx = -1
                LocalDB.remove(URL_KEY)
                LocalDB.remove(URL_KEY_TIME)
                ret = false
                break
            }

            let refurl = false
            let url
            let time = LocalDB.getInt(URL_KEY_TIME)
            if (time) {
                //console.log("time=====" + (Date.now() - time))
            }
            if (!time || (Date.now() - time) < URL_EXPIRE) {
                url = LocalDB.getString(URL_KEY)
            }

            if (!url) {
                refurl = true
            } else {
                if (init) {
                    let idx = -1
                    for (let i = 0; i < list.length; i++) {
                        let item = list[i];
                        if (url == item) {
                            idx = i
                            break
                        }
                    }
                    if (idx != -1) {
                        this.mSelectServerIdx = idx
                    } else {
                        refurl = true
                    }
                } else {
                    refurl = true
                }
            }
            if (refurl) {
                url = list[this.mSelectServerIdx]
                LocalDB.set(URL_KEY, url)
                LocalDB.setInt(URL_KEY_TIME, Date.now())
            }

            this.mUsHost = url
            this.mGameServer = this.mGameSvrList[this.mSelectServerIdx]
            this.mManageServer = this.mManageSvrList[this.mSelectServerIdx]
            this.mWebServer = this.mWebSvrList[this.mSelectServerIdx]
            console.log("NetModel nextUrl =========")

        } while (false)
        return ret
    }

    public static initServerList() {
        let list = []
        let wslist = []
        let managelist = []
        let weblist = []
        //测试服
        let selIndex = 0
        if (cfg.isFormal) {
            selIndex = 1 //正式服
        }

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.m_isH5 = true
        } else {
            this.m_isH5 = cfg.isFormal && !cc.sys.isNative
        }

        let port = this.m_isH5 ? userH5Ports[selIndex] : userPorts[selIndex]
        let svrport = this.m_isH5 ? svrH5Ports[selIndex] : svrPorts[selIndex]
        let hosts = userHosts[selIndex]

        let manageport = managePorts[selIndex]
        let managehosts = manageHosts[selIndex]

        let webport = webPorts[selIndex]

        //临时搞搞成http 
        let httpEx = this.m_isH5 ? "https://" : "http://"
        let wsEx = this.m_isH5 ? "wss://" : "ws://"

        for (let i = 0; i < hosts.length; i++) {
            list.push([httpEx, hosts[i], port].join(""))
            wslist.push([wsEx, hosts[i], svrport, "/s"].join(""))
        }

        if (selIndex == 1) {
            if (subNames.length > 0) {
                for (let j = 0; j < subNames.length; j++) {
                    list.push([httpEx, subNames[j], hosts[0], port].join(""))
                    wslist.push([wsEx, subNames[j], hosts[0], svrport, "/s"].join(""))
                }
            }
        }

        for (let i = 0; i < managehosts.length; i++) {
            managelist.push([httpEx, managehosts[i], manageport].join(""))
            weblist.push([wsEx, managehosts[i], webport].join(""))
        }
        cc.log("----this.mHostList:", list)
        cc.log("----this.mGameSvrList:", wslist)
        cc.log("----this.mManageSvrList:", managelist)
        cc.log("----this.mWebSvrList:", weblist)

        this.mHostList = list
        this.mGameSvrList = wslist
        this.mManageSvrList = managelist
        this.mWebSvrList = weblist

        NetModel.nextUrl(true)
    }
}
