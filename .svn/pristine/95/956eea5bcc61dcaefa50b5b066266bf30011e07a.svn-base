//各种全局的数据处理放在这里
export default class Global {
    private static mInstance: Global = null;
    private mData: object = null;

    private m_sign7Info = null //7日签到信息
    private m_jiujiInfo = null //领取救济金信息
    private m_shituLvInfo = null //师徒等级奖励
    private m_missionRedInfo = null //任务红点提示
    private m_matchNoticeInfo = null //比赛公告提示

    public static getInstance(): Global {
        if (!Global.mInstance) {
            Global.mInstance = new Global();
            Global.mInstance.init();
        }
        return Global.mInstance;
    }

    public init(): void {
        this.mData = {}
    }


    public setData(key, data): void {
        if (this.mData) {
            this.mData[key] = data;
        }
    }

    public getData(key): any {
        if (this.mData) {
            if (key) {
                return this.mData[key];
            } else {
                return this.mData
            }

        }
    }

    //设置7日签到信息
    public setSign7Info(info) {
        this.m_sign7Info = info
    }

    public getSign7Info() {
        return this.m_sign7Info
    }

    //设置领取救济金信息
    public setJiujiInfo(info) {
        this.m_jiujiInfo = info
    }

    public getJiujiInfo() {
        return this.m_jiujiInfo
    }

    //设置师徒等级奖励数据
    public setShiTuLvInfo(info) {
        this.m_shituLvInfo = info
    }

    public getShiTuLvInfo() {
        return this.m_shituLvInfo
    }

    //设置任务红点提示数据
    public setMissionRedInfo(info?) {
        this.m_missionRedInfo = info
    }

    public getMissionRedInfo() {
        return this.m_missionRedInfo
    }

    //设置比赛公告数据
    public setMatchNoticeInfo(info?) {
        this.m_matchNoticeInfo = info
    }

    public getMatchNoticeInfo() {
        return this.m_matchNoticeInfo
    }

}
