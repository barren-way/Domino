class NetMsg {
    public mEvent: string = null;
    public mArgs: object = null;
    public mId: number = null;
    constructor(event: string, args: object, id: number) {
        this.mEvent = event;
        this.mId = id;
        this.mArgs = args;
    }
}

export default class MsgCache {
    private static m_instance: MsgCache = null;
    private mAgent: Function = null;
    private mDelayEvents: { [key: string]: number } = null;
    private mCacheListeners: { [key: string]: Array<any> } = null;
    private mMsgQue: Array<NetMsg> = null;

    public static getInstance(): MsgCache {
        if (!MsgCache.m_instance) {
            MsgCache.m_instance = new MsgCache();
        }
        return MsgCache.m_instance;
    }

    public setAgent(agent: Function): void {
        this.mAgent = agent;
    }

    public registCacheListener(event: string, callback: Function, tag?: string): void {
        if (!this.mCacheListeners[event]) {
            this.mCacheListeners[event] = []
        }
        this.mCacheListeners[event].push({ callback: callback, tag: tag });
    }

    public removeCacheListener(event: string, tag?: string): void {
        if (tag) {
            let cbs = this.mCacheListeners[event]
            if (cbs != null) {
                for (let i = 0; i < cbs.length; i++) {
                    if (cbs[i].tag == tag) {
                        cbs.splice(i, 1)
                        break
                    }
                }
                if (cbs.length == 0) {
                    this.mCacheListeners[event] = null;
                }
            }
        } else {
            this.mCacheListeners[event] = null;
        }
    }

    public openCache(events: Array<string>): void {
        if (!events || events.length == 0) {
            return;
        }

        if (!this.mMsgQue) {
            this.mMsgQue = [];
        }

        if (!this.mDelayEvents) {
            this.mDelayEvents = {};
        }

        if (!this.mCacheListeners) {
            this.mCacheListeners = {}
        }

        for (const evt of events) {
            this.mDelayEvents[evt] = 1
        }
    }

    public closeCache(): void {
        this.mAgent = null;
        this.mMsgQue = null;
        this.mDelayEvents = null;
        this.mCacheListeners = null;
    }

    public isOpen(): boolean {
        return this.mMsgQue != null;
    }

    public clearCache(): void {
        if (this.isOpen()) {
            this.mMsgQue = [];
        }
    }

    public cacheSize(): number {
        if (this.mMsgQue) {
            return this.mMsgQue.length;
        }
        return 0;
    }

    public addMsg(event: string, args: object, id: number): void {
        if (this.isOpen()) {
            if (this.mDelayEvents[event]) {
                this.mMsgQue.push(new NetMsg(event, args, id));
            }
        }
    }

    public handleMsg(): boolean {
        //console.log('MsgCache----------handleMsg')
        if (!this.isOpen()) {
            return;
        }
        let msg = this.mMsgQue.shift();
        let ret = false;
        if (msg) {
            for (const key in this.mCacheListeners) {
                if (key == msg.mEvent) {
                    let cbs = this.mCacheListeners[key]
                    for (let i = cbs.length - 1; i > -1; i--) {
                        ret = cbs[i].callback(msg.mEvent, msg.mArgs, msg.mId)
                        if (ret) {
                            break
                        }
                    }
                    break
                }
            }
            if(this.mAgent){
                ret = this.mAgent(msg.mEvent, msg.mArgs, msg.mId);
            }
            console.log('MsgCache----------handleMsg-----over')
        }
        return ret;
    }
}