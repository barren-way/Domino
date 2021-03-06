import { NetConfig } from "./NetConfig";

export default class MySocket {
    private static mInstance: MySocket = null;
    private static mWsId:number = null;

    private mDelegate: object = null;
    private mHost: string = null;
    private mHandlerId: any = null;
    private mWaitHandler: any = null;
    private mWs: WebSocket = null;
    private mClosing: Boolean = false;
    private mErroring: Boolean = false;

    public static getInstance(): MySocket {
        if (!MySocket.mInstance) {
            MySocket.mInstance = new MySocket();
            MySocket.mWsId = 0;
        }
        return MySocket.mInstance;
    }
    public buildConnect(delegate, host:string, timeout:number = 5):void {
        cc.log("MySocket buildConnect start \n")
        var self = this;
        if (host) {
            this.mHost = host;
        }

        this.mDelegate = delegate;
        
        if (this.mHandlerId == null) {
            this.mHandlerId = setTimeout(this.connectTimeOut.bind(this), timeout * 1000);
        }

        let connect = function (timeid) {
            this.mWs = new WebSocket(this.mHost);
            let wsid = MySocket.mWsId + 1
            MySocket.mWsId = wsid;
            this.mWs.mWsId = wsid;
            this.mWs.onopen = function (evt) {
                self.onOpen(evt, wsid, timeid);
            };
            this.mWs.onmessage = function (evt) {
                self.onMessage(evt, wsid);
            };
            this.mWs.onerror = function (evt) {
                self.onError(evt, wsid);
            };
            this.mWs.onclose = function (evt) {
                self.onClose(evt, wsid);
            };
            this.mClosing = false;
            this.mErroring = false;
        }.bind(this)

        if (this.mWs != null) {
            this.mWaitHandler = setInterval(function () {
                if (this.mWs == null) {
                    this.stopTimeOut();
                    this.mHandlerId = setTimeout(this.connectTimeOut.bind(this), timeout * 1000);
                    connect(this.mHandlerId);
                }
            }.bind(this), 1000);
        } else {
            connect(this.mHandlerId);
        }

        cc.log("MySocket buildConnect end \n")
    }

    private connectTimeOut(): void {
        cc.log("MySocket connectTimeOut start \n")
        this.stopTimeOut();
        if (this.mDelegate["onError"]) {
            this.mDelegate["onError"]({error: {code: NetConfig.SocketError.ERROR_SOCKET_CONNECT}});
        }
        cc.log("MySocket connectTimeOut end \n")
    }

    stopTimeOut(): void {
        if (this.mHandlerId) {
            clearInterval(this.mHandlerId);
            this.mHandlerId = null;
        }

        if (this.mWaitHandler) {
            clearInterval(this.mWaitHandler);
            this.mWaitHandler = null;
        }
    }

    isOnConnect(): boolean {
        return this.mWs != null && !this.mClosing && this.mWs.readyState == WebSocket.OPEN;
    }

    // ????????????
    closeConnect(): void {
        cc.log("MySocket closeConnect start \n")
        this.mClosing = true;
        if (this.mWs) {
            if (this.mWs.readyState == WebSocket.OPEN) {
                this.mWs.close();
            } else {
                this.releaseSocket();
            }
        }
        cc.log("MySocket closeConnect end \n")
    }
    
    // ???????????? ????????????
    sendMessage(json): void {
        if (this.mWs && this.mWs.readyState === WebSocket.OPEN) {
            var data = JSON.stringify(json);
            this.mWs.send(data);
        } else {
            cc.log("The WebSocket is not Initialize!!!");
        }
    }

    // ??????????????????
    onOpen(evt, wsid, timeid): void {
        cc.log("MySocket onOpen start \n")
        if (this.mWs != null && this.mWs["mWsId"] == wsid) {
            if (!this.mHandlerId || timeid != this.mHandlerId){
                //?????????????????????timeout??????open??????
                return
            }
            this.stopTimeOut();
            if (this.mDelegate["onOpen"]) {
                this.mDelegate["onOpen"]();
            }
            this.mClosing = false;
            this.mErroring = false
        }
        cc.log("MySocket onOpen end \n")
    }

    // ??????
    onMessage(evt, wsid): void {
        if (this.mWs != null && this.mWs["mWsId"] == wsid) {
            let result = JSON.parse(evt.data);
            if (this.mDelegate["onMessage"]) {
                this.mDelegate["onMessage"](result);
            }
        }
    }

    // ??????????????????
    onError(evt, wsid):void {
        cc.log("MySocket onError start \n")
        if (this.mWs != null && this.mWs["mWsId"] == wsid) {
            if (this.mDelegate["onError"]) {
                this.mErroring = true
                this.mDelegate["onError"]({error: {code: NetConfig.SocketError.ERROR_SOCKET_OTHERS}});
            }
        }
        cc.log("MySocket onError end \n")
    }

    // 0??????????????????
    onClose(evt, wsid):void {
        cc.log("MySocket onClose start \n")
        if (this.mWs != null && this.mWs["mWsId"] == wsid) {
            this.releaseSocket();
            if (!this.mClosing) {
                if (this.mDelegate["onClose"]) {
                    this.mDelegate["onClose"](this.mErroring);
                }
            }
        }
        cc.log("MySocket onClose end \n")
    }

    // ??????
    releaseSocket():void {
        cc.log("MySocket releaseSocket start \n")
        this.mWs = null;
        if (this.mHandlerId) {
            clearInterval(this.mHandlerId);
            this.mHandlerId = null;
        }
        cc.log("MySocket releaseSocket end \n")

    }
}
