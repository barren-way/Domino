import NetSocket from "./NetSocket";
import MsgCache from "./MsgCache";
import { NetConfig } from "./NetConfig";
import NetData from "../../../Games/Common/Script/NetData";
import NetModel from "../../../Games/Common/Script/NetModel";
import Dialog from "../Tips/Dialog";

export default class EventHandler {
    private static mEventListeners: { [key: string]: Array<any> } = {};
    private static mErrorListeners: { [key: string]: Array<any> } = {};
    private static mTelCount = 0;

    public static clearEventListener(all?: Boolean) {
        NetData.clearEventListener();
        if (all) {
            EventHandler.mEventListeners = {}
            EventHandler.mErrorListeners = {}
        }
    }

    public static addEventListener(event: string, callback: Function, tag?: string): void {
        if (!EventHandler.mEventListeners[event]) {
            EventHandler.mEventListeners[event] = []
        }
        EventHandler.mEventListeners[event].push({ callback: callback, tag: tag });
    }

    public static removeEventListener(event: string, tag?: string): void {
        if (tag) {
            let cbs = EventHandler.mEventListeners[event]
            if (Object.prototype.toString.call(cbs) == '[object Array]') {
                for (let i = 0; i < cbs.length; i++) {
                    if (cbs[i].tag == tag) {
                        cbs.splice(i, 1)
                        break
                    }
                }
                if (cbs.length == 0) {
                    delete EventHandler.mEventListeners[event]
                }
            }
        } else {
            delete EventHandler.mEventListeners[event]
        }
    }

    public static addErrorListener(event: string, callback: Function, tag?: string): void {
        if (!EventHandler.mErrorListeners[event]) {
            EventHandler.mErrorListeners[event] = []
        }
        EventHandler.mErrorListeners[event].push({ callback: callback, tag: tag });
    }

    public static removeErrorListener(event: string, tag?: string): void {
        if (tag) {
            let cbs = EventHandler.mErrorListeners[event]
            if (Object.prototype.toString.call(cbs) == '[object Array]') {
                for (let i = 0; i < cbs.length; i++) {
                    if (cbs[i].tag == tag) {
                        cbs.splice(i, 1)
                        break
                    }
                }
                if (cbs.length == 0) {
                    delete EventHandler.mErrorListeners[event]
                }
            }
        } else {
            delete EventHandler.mErrorListeners[event]
        }
    }

    public static setTelCount(inc): void {
        EventHandler.mTelCount = Math.max(0, EventHandler.mTelCount + inc);
        if (inc > 0) {
            NetSocket.getInstance().release();
            if (EventHandler.mTelCount <= NetConfig.tryCount) {
                NetSocket.getInstance().send("tel");
            } else {
                EventHandler.mTelCount = 0;
                EventHandler.retry();
            }
        }
    }

    public static retry(): void {
        if (NetModel.nextUrl()) {
            EventHandler.mTelCount = 0;
            NetSocket.getInstance().setHost(NetModel.getGameSvr())
            NetSocket.getInstance().send('tel')
        } else {
            Dialog.show(Dialog.TYPE_ONE_BTN, "网络连接断开，请检查网络设置，重新连接", NetData.backToLogin)
            if (NetData["ResetServer"]) {
                NetData["ResetServer"]()
            }
        }
    }

    public static checkCache(): void {
        let size = MsgCache.getInstance().cacheSize();
        if (size > NetConfig.keepCount) {
            MsgCache.getInstance().clearCache();
            NetData.setSyncFlag(1);
        }
    }

    public static checkPlaying(): boolean {
        return NetData.checkPlaying();
    }

    public static handleEvent(event, args, eventid): boolean {
        let ret = false;
        if (event == 'lobby.signin') {
            NetSocket.getInstance().stopTimeout();
            NetSocket.getInstance().startPing();
            EventHandler.setTelCount(-1);
        } else if (event == "tel") {
            EventHandler.setTelCount(-1);
        } else if (event.search(/\.syncinfo$/) || event.search(/^syncinfo$/)) {
            NetData.setSyncFlag();
        }

        ret = NetData.handleEvent(event, args, eventid);

        if (!ret) {
            for (const key in EventHandler.mEventListeners) {
                if (key == event) {
                    let cbs = EventHandler.mEventListeners[key]
                    if (Object.prototype.toString.call(cbs) == '[object Array]') {
                        for (let i = cbs.length - 1; i > -1; i--) {
                            ret = cbs[i].callback(event, args, eventid)
                            if (ret) {
                                break
                            }
                        }
                    }
                    break
                }
            }
        }
        return ret
    }

    public static handleError(code: number, event: string = null, message: string = null): boolean {
        cc.log("EventHandler handleError start \n")
        cc.log("==============errrcode:" + code)
        if (event == "tel") {
            EventHandler.setTelCount(-1)
        }

        let ret: boolean = false;
        for (const key in EventHandler.mErrorListeners) {
            let cbs = EventHandler.mErrorListeners[key]
            if (Object.prototype.toString.call(cbs) == '[object Array]') {
                for (let i = cbs.length - 1; i > -1; i--) {
                    ret = cbs[i].callback(code, event, message)
                    if (ret) {
                        break
                    }
                }
            }
            if (ret) {
                break;
            }
        }
        if (ret) {
            return true;
        }

        if (code < 0) {
            //console.log("handleError code=======" + code)
            if (code == NetConfig.SocketError.ERROR_SOCKET_TIMEOUT) {
                NetSocket.getInstance().showTimeoutDialog(function () {
                    EventHandler.setTelCount(1)
                }.bind(this))
            } else {

                if (code == NetConfig.SocketError.ERROR_SOCKET_TIMEOUT1) {
                    setTimeout(function () {
                        EventHandler.setTelCount(1);
                    }.bind(this), 1)
                    //NetSocket.getInstance().release();
                    //Dialog.show(Dialog.TYPE_ONE_BTN, "网络连接断开，请检查网络设置，重新连接", NetData.backToLogin);
                } else if (code == NetConfig.SocketError.ERROR_SOCKET_CONNECT) {
                    setTimeout(function () {
                        NetSocket.getInstance().release();
                        EventHandler.retry();
                    }.bind(this), 1)
                } else if (code == NetConfig.SocketError.ERROR_SOCKET_OTHERS) {
                    setTimeout(function () {
                        EventHandler.setTelCount(1);
                    }.bind(this), 1);
                    // NetSocket.getInstance().release();
                    // EventHandler.retry();
                } else if (code == NetConfig.SocketError.ERROR_SOCKET_CLOSING) {
                    setTimeout(function () {
                        EventHandler.setTelCount(1);
                    }.bind(this), 1);
                }
            }
        } else {
            //剩下的游戏逻辑错误，交给游戏错误处理
            ret = NetData.handleError(code, event, message);
        }
        cc.log("EventHandler handleError end \n")
        return ret;
    }

    public static HttpResult(event, args, eventid) {
        let ret = NetData.HttpResult(event, args, eventid)
        return ret
    }

    public static HttpError(event, args, eventid) {
        let ret = NetData.HttpError(event, args, eventid)
        return ret
    }

}
