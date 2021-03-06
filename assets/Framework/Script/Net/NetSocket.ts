import Manager from "../Engine/Manager";
import MySocket from "./MySocket";
import MsgCache from "./MsgCache";
import EventHandler from "./EventHandler";
import { NetConfig } from "./NetConfig";
import Dialog from "../Tips/Dialog";
import Account from "../../../Games/Common/Script/Account";

export default class NetSocket {
    private static mInstance: NetSocket = null;

    private mHost: string = null;
    private mHandlerId: number = null;
    private mSocket: MySocket = null;
    private mEventid: number = null;
    private mPingCount: number = null;
    private mPingHandle: any = null;
    private mConnectCallBack: Function = null;
    //private mWaitEventId:number = null;
    private mWaitEvent: string = null;
    private mServerTime: number = null;
    private mDelay: number = null;
    private mDialogTag = null;
    public static getInstance(): NetSocket {
        if (!NetSocket.mInstance) {
            NetSocket.mInstance = new NetSocket();
        }
        return NetSocket.mInstance;
    }

    public buildConnect(host: string, connectCallback: Function): void {
        cc.log("ws_url_build: " + host);
        cc.log("NetSocket buildConnect start \n")
        if (this.mSocket) {
            return;
        }

        this.mSocket = MySocket.getInstance();
        this.mSocket.buildConnect(this, host, NetConfig.connectTimeOut);
        this.mHost = host;
        this.mEventid = 100;
        this.mPingCount = 0;
        this.mDelay = 0;
        this.mConnectCallBack = connectCallback;
        Manager.getInstance().showWaitAni(true);
        cc.log("NetSocket buildConnect end \n")
    }

    public release(): void {
        cc.log("NetSocket release start \n")
        if (this.mSocket) {
            let sock = this.mSocket;
            this.mSocket = null;
            sock.closeConnect();
        }
        this.stopPing();
        this.mEventid = null;
        this.mConnectCallBack = null;
        this.mPingCount = null;
        MsgCache.getInstance().clearCache();
        cc.log("NetSocket release end \n")
    }

    public isOnConnect(): boolean {
        if (this.mSocket) {
            return this.mSocket.isOnConnect();
        }
        return false;
    }

    public setHost(host) {
        if (host) {
            this.mHost = host
        }
    }

    // ????????????
    public changeConnect(host: string, connectCallback: Function): void {
        cc.log("NetSocket changeConnect start \n")
        this.release();
        setTimeout(() => {
            this.buildConnect(host, connectCallback);
        }, 100);
        cc.log("NetSocket changeConnect end \n")
    }

    public getServerTime(): number {
        return this.mServerTime;
    }

    public send(event: string, args: object = null, wait: boolean = false): void {
        if (this.mSocket) {
            if (this.mSocket.isOnConnect()) {
                let eventid = this.mEventid;
                args = args || {}
                if (args["netstatus"] == undefined) {
                    args["netstatus"] = this.getDelay()
                }

                let data: object = { event: event, id: eventid, payload: args }
                if (event != "ping") {
                    cc.log("------------------??????:" + JSON.stringify(data));
                }
                this.mSocket.sendMessage(data);
                this.mEventid = eventid + 1;
                if (this.mEventid > 100000000) {
                    this.mEventid = 100;
                }
                if (wait) {
                    if (!this.mWaitEvent) {
                        this.mWaitEvent = event;
                        Manager.getInstance().showWaitAni();
                    }
                }

                if (event == 'lobby.signin') {
                    //?????????????????????????????????????????????????????????
                    this.startTimeout()
                }
                //console.log('NetSocket------------send---------over')
            }
        } else {
            //????????????
            if (event == 'tel') {
                Account.getInstance().sigin(this.mHost, 1, function () {
                    if (!EventHandler.checkPlaying()) {
                        let scene = Manager.getInstance().getSceneScript();
                        if (scene["ReloadConnect"]) {
                            scene["ReloadConnect"]();
                        }
                    }
                }.bind(this));
            }
        }
    }

    public startTimeout() {
        cc.log("NetSocket.startTimeout start \n")
        this.stopTimeout()
        Manager.getInstance().showWaitAni();
        this.mHandlerId = setTimeout(this.timeout.bind(this), NetConfig.connectTimeOut * 1000);
        cc.log("NetSocket.startTimeout end \n")
    }

    private timeout() {
        cc.log("NetSocket.timeout start \n")
        this.stopTimeout()
        this.onError({ error: { code: NetConfig.SocketError.ERROR_SOCKET_CLOSING } }, true);
        cc.log("NetSocket.timeout start \n")
    }

    public stopTimeout() {
        cc.log("NetSocket.stopTimeout start \n")
        if (this.mHandlerId) {
            clearInterval(this.mHandlerId);
            this.mHandlerId = null;
        }
        cc.log("NetSocket.stopTimeout end \n")
    }

    public startPing(): void {
        this.stopPing();
        this.mPingHandle = setInterval(this.ping.bind(this), NetConfig.pintSpace * 1000);
    }

    public stopPing(): void {
        if (this.mPingHandle) {
            clearInterval(this.mPingHandle);
            this.mPingHandle = null;
        }
    }

    public ping(): void {
        if (this.mPingCount == null) {
            return;
        }
        this.mPingCount = this.mPingCount + 1;
        if (this.mPingCount >= NetConfig.pingTimeOut) {
            this.stopPing();
            let code = NetConfig.waitable ? NetConfig.SocketError.ERROR_SOCKET_TIMEOUT : NetConfig.SocketError.ERROR_SOCKET_TIMEOUT1
            this.onError({ error: { code: code } }, true);
        } else if (this.mPingCount < NetConfig.maxPing) {
            this.send("ping", { pingtime: Date.now() });
        }
    }

    public onOpen(): void {
        cc.log("NetSocket onOpen start \n")
        Manager.getInstance().hideWaitAni();
        if (this.mConnectCallBack) {
            this.mConnectCallBack();
        }
        cc.log("NetSocket onOpen end \n")
    }

    public onClose(erroring?): void {
        cc.log("NetSocket onClose start \n")
        if (this.mSocket && !erroring) {
            this.onError({ error: { code: NetConfig.SocketError.ERROR_SOCKET_CLOSING } }, true);
        }
        cc.log("NetSocket onClose end \n")
    }

    public showTimeoutDialog(callback?: Function, delay?: number) {
        this.mDialogTag = Dialog.show(Dialog.TYPE_NET_TIMEOUT, null, callback, delay)
    }
    public getDelay(): number {
        return this.mDelay;
    }

    public onMessage(result): void {
        if (result.payload && result.payload.time) {
            this.mServerTime = result.payload.time;
        }
        if (this.mPingCount && this.mPingCount > 0) {
            this.mPingCount = this.mPingCount - 1;
        }

        if (this.mDialogTag) {
            Dialog.hide(this.mDialogTag, true);
            this.startPing();
            this.mDialogTag = null;
        }
        if (result.event == "ping" && result.payload && result.payload.pingtime) {
            this.mDelay = (Date.now() - result.payload.pingtime) / 2
        }
        //cc.log("===============delay:" + this.mDelay)
        if (result.event != "ping" && result.event != "countdown") {
            if (result.id > 0) {
                cc.log("------------------??????:" + JSON.stringify(result));
            } else if (result.id == 0) {
                cc.log("------------------??????:" + JSON.stringify(result));
            }
        }

        if (result.error) {
            this.onError(result);
        } else {

            if (result.event == this.mWaitEvent) {
                Manager.getInstance().hideWaitAni();
                this.mWaitEvent = null;
            }

            MsgCache.getInstance().addMsg(result.event, result.payload, result.id);
            let ret = EventHandler.handleEvent(result.event, result.payload, result.id);
            if (!ret) {
                Manager.getInstance().onMessage(result.event, result.payload, result.id);
            }
        }
        //console.log('NetSocket------------onMessage---------over')

    }

    public onError(result, unping = false): void {
        cc.log("NetSocket onError start \n")
        if (!this.mSocket) {
            return;
        }

        if (this.mDialogTag) {
            Dialog.hide(this.mDialogTag, true);
            this.startPing();
            this.mDialogTag = null;
        }

        this.stopTimeout()

        if (!unping && this.mPingCount && this.mPingCount > 0) {
            this.mPingCount = this.mPingCount - 1;
        }
        let ret = Manager.getInstance().onError(result.error.code, result.event, result.error.message);
        if (!ret) {
            EventHandler.handleError(result.error.code, result.event, result.error.message);
        }

        if (result.error.code < 0 || result.event == this.mWaitEvent) {
            Manager.getInstance().hideWaitAni();
            this.mWaitEvent = null;
        }
        cc.log("NetSocket onError end \n")
    }
}
