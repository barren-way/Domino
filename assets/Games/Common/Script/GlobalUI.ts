
const { ccclass, property } = cc._decorator;

@ccclass
export default class GlobalUI extends cc.Component {
    //各个界面可能共用的弹板
    public static TYPE_CREATE_ROOM = 0
    public static TYPE_CREATE_SET = GlobalUI.TYPE_CREATE_ROOM + 1
    public static TYPE_CREATE_RULE = GlobalUI.TYPE_CREATE_SET + 1
    public static TYPE_CREATE_WX = GlobalUI.TYPE_CREATE_RULE + 1
    public static TYPE_CREATE_DISMISS = GlobalUI.TYPE_CREATE_WX + 1
    public static TYPE_CREATE_CHAT = GlobalUI.TYPE_CREATE_DISMISS + 1
    public static TYPE_CREATE_ROLE = GlobalUI.TYPE_CREATE_CHAT + 1
    public static TYPE_CREATE_IP = GlobalUI.TYPE_CREATE_ROLE + 1
    public static TYPE_CREATE_GPS = GlobalUI.TYPE_CREATE_IP + 1
    public static TYPE_CREATE_INVITE = GlobalUI.TYPE_CREATE_GPS + 1
    public static TYPE_CREATE_QRCODE = GlobalUI.TYPE_CREATE_INVITE + 1
    public static TYPE_CREATE_STORE = GlobalUI.TYPE_CREATE_QRCODE + 1
    public static TYPE_CREATE_JIUJI = GlobalUI.TYPE_CREATE_STORE + 1
    public static TYPE_CREATE_BDUPDATE = GlobalUI.TYPE_CREATE_JIUJI + 1
    public static TYPE_CREATE_AD = GlobalUI.TYPE_CREATE_BDUPDATE + 1


    private static m_names = [
        "CreateDialog", //创建房间
        "layer_set", //声音设置
        "layer_rule",//规则文档
        "layer_wx", //微信分享
        "layer_dismiss",//解散房间
        "layer_chat",//聊天弹板
        "layer_role",//个人信息弹板
        "layer_ip",//ip弹板
        "layer_gps",//gps弹板
        "layer_invite",//一键邀请线上好友进茶官房
        "layer_qrcode",//二维码图片保存
        "layer_store",//商城
        "layer_jiuji",//救济金
        "layer_bdupdate",//子游戏下载
        "layer_ad"
    ]
    private m_pops: Array<any> = [];

    public show(type, params) {
        let dname = GlobalUI.m_names[type];
        if (!dname) {
            return;
        }
        let pop = this.node.getChildByName(dname);
        if (!pop || pop.active) {
            return
        }

        this.node.active = true
        pop.active = true
        this.m_pops.push({ type: type, pop: pop, parms: params })

        pop['script'] = pop.getComponent(dname)
        if (pop['script'] && pop['script']["show"]) {
            pop['script'].show(params)
        }

        //一些特殊不需要特殊处理的弹板儿，这儿处理一下关闭
        let btns = {
            [GlobalUI.TYPE_CREATE_RULE]: "board/btn_close",
        }
        if (btns[type]) {
            let btnYes = cc.find(btns[type], pop);
            btnYes.on(cc.Node.EventType.TOUCH_END, () => {
                this.hide(type, params)
            });
        }
    }

    public hide(type, params?) {
        if (!this.node.active) {
            return
        }
        for (let i = 0; i < this.m_pops.length; i++) {
            if (this.m_pops[i].type == type) {
                this.m_pops[i].pop.active = false
                if (params && params.callback) {
                    params.callback(params)
                }
                this.m_pops.splice(i, 1)
                break
            }
        }
        if (this.m_pops.length == 0) {
            this.node.active = false
        }
    }

    public clear() {
        this.m_pops.forEach(item => {
            item.pop.active = false
        });
        this.m_pops = []
        this.node.active = false
    }

    public getUIScript(type) {
        let dname = GlobalUI.m_names[type];
        if (!dname) {
            return;
        }
        let pop = this.node.getChildByName(dname);
        if (!pop) {
            return
        }

        pop['script'] = pop.getComponent(dname)
        if (pop['script']) {
            return pop['script']
        }
    }
}
