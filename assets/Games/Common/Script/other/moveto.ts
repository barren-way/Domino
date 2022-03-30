const { ccclass, property } = cc._decorator;

@ccclass
export default class moveto extends cc.Component {

    //广播文本
    @property(cc.Node)
    private m_contentText: cc.Node = null;

    //文本初始位置
    @property(cc.Vec2)
    private m_textOrgPos: cc.Vec2 = null;

    //默认显示内容
    @property([cc.String])
    private m_defaultStrTable: Array<string> = [];

    //相对移动时间
    @property(cc.Integer)
    private m_relativeTime: number = 0;

    //默认广播颜色类型
    @property(cc.Color)
    private m_defaultTextColor: WEBGL_color_buffer_float = null

    //广播颜色类型
    @property([cc.Color])
    private m_radioTextColorTable: Array<WEBGL_color_buffer_float> = []

    //默认显示数据
    private m_defalutShowInfo: Array<string> = [];

    //当前内容
    private m_curCountent: string = "";

    //是否正在播放
    private m_isPlayRadio: Boolean = false;



    onLoad(): void {

    }

    start(): void {

    }
    onDisable(){
        this.m_isPlayRadio = false
    }

    onDestroy() {
        this.m_isPlayRadio = false
    }

    onCreate(data): void {

    }

    //初始化默认数据
    initDefalutRadioData(): void {
        this.m_defalutShowInfo = []
        for (let index = 0; index < this.m_defaultStrTable.length; index++) {
            this.m_defalutShowInfo.push(this.m_defaultStrTable[index])
        }
    }

    update(dt) {
        if (this.m_isPlayRadio) {
            return
        }
        // if (this.m_radioDataTable.length <= 0) {
        //     this.addDefaultSystemRadioData()
        // }
        if (this.isHaveHomeRadio() == false) {
            this.addDefaultSystemRadioData()
        }
        //播放走马灯数据
        this.playRadioAction()
    }

    playRadioAction(): void {
        this.m_isPlayRadio = false
        let radioData = this.removeHomeRadioData()
        if (!radioData) return
        this.m_curCountent = radioData
        //this.m_contentText.color = this.getRadioTextColor(radioData.rType)
        this.m_contentText.getComponent(cc.Label).string = radioData
        //let textContentSize = this.m_contentText.getContentSize()
        //let startPos = cc.v2(this.m_textOrgPos.x, 0 - textContentSize.height - 10)
        //let moveLength = textContentSize.width + 20 + this.m_textOrgPos.x * 2
        //let moveTime = moveLength / this.m_relativeTime

        let startPos = cc.v2(this.m_textOrgPos.x, 0);
        //延迟1
        let delayTime1 = cc.delayTime(0.1)
        //延迟2
        let delayTime2 = cc.delayTime(0.2)
        //上移动动作
        let moveToUp = cc.moveTo(0.2, this.m_textOrgPos)
        //左移动动作
        //let moveToLeft = cc.moveTo(moveTime, cc.v2(this.m_textOrgPos.x - moveLength, this.m_textOrgPos.y))
        //let moveToLeft = cc.moveTo(moveTime, cc.v2(-300-textContentSize.width, this.m_textOrgPos.y))
        //移动回调
        //let callback = cc.callFunc(moveOverCallback.bind(this))
        //移动序列
        //let seq = cc.sequence(delayTime1, moveToUp, delayTime2, moveToLeft, callback)
        let callback2 = cc.tween.call(beginMoveCallback.bind(this))
        //设置起始位置
        this.m_contentText.setPosition(startPos)
        //停止所有动作
        this.m_contentText.stopAllActions()
        //运行动作
        cc.tween(this.m_contentText).then(delayTime2).then(callback2).start()
        //设置标志
        this.m_isPlayRadio = true


        function beginMoveCallback() {

            let callback = cc.callFunc(moveOverCallback.bind(this))

            let textContentSize = this.m_contentText.getContentSize()
            let moveLength = textContentSize.width + 20 + this.m_textOrgPos.x 
            let moveTime = moveLength / this.m_relativeTime
            let moveToLeft = cc.moveTo(moveTime, cc.v2(-moveLength, this.m_textOrgPos.y))

            let seq = cc.sequence(moveToLeft, callback);
            this.m_contentText.runAction(seq)

            function moveOverCallback() {
                this.m_isPlayRadio = false
            }

        }

    }

    addDefaultSystemRadioData(): void {
        this.initDefalutRadioData()
    }
    getRadioTextColor(rType): any {
        if (!rType) {
            return this.m_defaultTextColor
        }
        let rColor = this.m_radioTextColorTable[Number(rType) - 1]
        if (!rColor) {
            rColor = this.m_defaultTextColor
        }
        return rColor
    }

    getCurPlayRadioData(): any {
        return this.m_curCountent
    }

    removeHomeRadioData() {
        return this.m_defalutShowInfo.shift()
    }

    isHaveHomeRadio(): any {
        return this.m_defalutShowInfo.length > 0
    }
}
