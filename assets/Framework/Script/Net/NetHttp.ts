import { NetConfig } from "./NetConfig";
import Manager from "../Engine/Manager";
import EventHandler from "./EventHandler";

class HttpCmd {
    public mUrl: string = null;
    public mParams: object = null;
    public mCallback: Function = null;
    public mEvent: string = null;
    public mEventId: number = null;
    public mNoWait: boolean = null;
    public mMethod: string = null;

    constructor(url: string, params: object, callback: Function, event: string, eventid: number, nowait: boolean, method: string) {
        this.mUrl = url;
        this.mParams = params;
        this.mCallback = callback;
        this.mEvent = event;
        this.mEventId = eventid;
        this.mNoWait = nowait;
        this.mMethod = method;
    }
}

export default class NetHttp {
    private static mInstance: NetHttp = null;

    private mXhr: XMLHttpRequest = null;
    private mWaitCount: number = null;
    private mEventId: number = null;
    private mTimeOut: number = null;
    private mUrllist: Array<HttpCmd> = null;
    private mHandLerId: any = null;
    private mReqTimer: any = null; //http超时计时器

    public static getInstance(): NetHttp {
        if (!NetHttp.mInstance) {
            NetHttp.mInstance = new NetHttp();
            NetHttp.mInstance.init();
        }
        return NetHttp.mInstance;
    }

    init(): void {
        this.mWaitCount = 0;
        this.mEventId = 100;
        this.mUrllist = new Array<HttpCmd>();
    }

    release(): void {
        if (this.mHandLerId) {
            clearInterval(this.mHandLerId);
            this.mHandLerId = null;
        }
        this.mXhr = null;
        this.mUrllist = null;
        this.releaseReqTimer()
    }

    setTimeOut(time): void {
        this.mTimeOut = time;
    }

    send(url: string, params: object, callback: Function = null, event: string = null, nowait: boolean = false, method: string = 'POST'): void {
        console.log("http_url_send: " + url);
        this.mEventId = this.mEventId + 1;
        if (this.mEventId >= 100000000) {
            this.mEventId = 0
        }
        this.mUrllist.push(new HttpCmd(url, params, callback, event, this.mEventId, nowait, method));
        if (!this.mHandLerId) {
            this.mHandLerId = setInterval(this.update.bind(this), 1 / 60 * 1000)
        }
    }

    changeWaitCount(wait): void {
        this.mWaitCount += wait ? 1 : -1;
        if (this.mWaitCount < 0) {
            this.mWaitCount = 0
        }
    }

    reqTimeOut(result): void {
        this.JsonError({ code: -100 })
    }

    releaseReqTimer() {
        if (this.mReqTimer) {
            clearTimeout(this.mReqTimer)
            this.mReqTimer = null
        }
    }

    JsonResult(result): void {
        do {
            if (result.readyState !== 4) {
                break;
            }


            if ((result.status < 200 || result.status > 207)) {
                this.JsonError({ code: -100 });
                break;
            }
            var response = result.responseText;
            if (!response || response.length < 1) {
                this.JsonError({ code: -100 });
                break
            }
            var output = typeof (response) == "string" ? JSON.parse(response) : response;
            if (output.errcode || output.code || output.error) {
                this.JsonError({ code: ((output.error && output.error.code) || output.errcode || output.code), message: ((output.error && output.error.message) || output.errmsg || output.msg) });
                break
            }
            var req = this.mUrllist.shift();
            if (!req.mNoWait) {
                Manager.getInstance().hideWaitAni();
            }
            this.releaseReqTimer()
            this.changeWaitCount(false); //这里往上挪一下,下面那个回调如果碰到wx找不到就断了,计数也不减了,会出bug
            var ret = EventHandler.HttpResult(req.mEvent, { result: output, eventid: req.mEventId }, req.mEventId);
            if (!ret) {
                if (req.mCallback) {
                    req.mCallback(NetConfig.HttpResult.OK, req.mEvent, { result: output, eventid: req.mEventId }, req.mEventId);
                }
            }
            //this.changeWaitCount(false);
        } while (false);
    }

    JsonError(result): void {
        //TODO 暂时没有重试，出错后直接删除
        this.releaseReqTimer()
        var req = this.mUrllist.shift();
        if (req) {
            if (!req.mNoWait) {
                Manager.getInstance().hideWaitAni();
            }
            let ret = false;
            if (req.mCallback) {
                ret = req.mCallback(NetConfig.HttpResult.ERROR, req.mEvent, { code: result.code, message: result.message }, req.mEventId)
            }
            if (!ret) {
                EventHandler.HttpError(req.mEvent, { code: result.code, message: result.message }, req.mEventId)
            }
        }
        this.changeWaitCount(false);
    }

    update(dt): void {
        if (this.mWaitCount === 0) {
            this.doSend();
        }
    }

    private doSend(): void {
        var req = this.mUrllist[0];
        if (req != null) {
            let params = this.encodeData(req.mParams);
            if (!req.mNoWait) {
                Manager.getInstance().showWaitAni();
            }
            let mXhr = new XMLHttpRequest()
            mXhr["ontimeout"] = () => {
                this.reqTimeOut(mXhr)
            };

            mXhr['onreadystatechange'] = () => {
                this.JsonResult(mXhr)
            }
            mXhr.timeout = (this.mTimeOut || 5) * 1000;
            if (req.mMethod === 'POST') {
                mXhr.open("POST", req.mUrl);
                mXhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                mXhr.send(params);
            } else {
                var url = req.mUrl + '?' + params;
                mXhr.open("GET", url, true);
                mXhr.send();
            }
            this.changeWaitCount(true);

            //给http设置个超时时间,防止不走超时回调导致无限转菊花卡死(一般域名解析失败会出)
            this.releaseReqTimer()
            this.mReqTimer = setTimeout(() => {
                this.reqTimeOut(mXhr)
            }, mXhr.timeout + 1000)
        }
    }

    private encodeData(data): string {
        //一直返回字符串
        if (!data) return "";
        //为了保存名=值对
        var pairs = [];
        //为每个名字
        for (var name in data) {
            //跳过继承属性
            if (!data.hasOwnProperty(name)) continue;
            if (typeof data[name] === "function") {
                //跳过方法
                continue;
            }
            if (data[name] == null || data[name] == undefined) {
                //跳过null和undefined
                continue;
            }
            //把值转换成字符串
            var value = data[name].toString();
            //编码名字
            name = encodeURIComponent(name.replace("%20", "+"));
            //编码值
            value = encodeURIComponent(value.replace("%20", "+"));
            //记住名=值对
            pairs.push(name + "=" + value);
        }
        //返回使用"＆"连接的名/值对
        return pairs.join('&');
    }
}
