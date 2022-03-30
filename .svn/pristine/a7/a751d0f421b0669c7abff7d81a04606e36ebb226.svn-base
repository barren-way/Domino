import { g } from '../../../Framework/Script/G'
import NetData from '../../Common/Script/NetData'
import { cfg } from '../../Common/Script/Config'
import { GameDef } from '../../Common/Script/GameDef'
import BDLangManager from "../../Common/Script/Lang/BDLangManager";
import { LangDef } from "../../Common/Script/Lang/LangDef";
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import BundleManager from '../../../Framework/Script/Engine/BundleManager';

const { ccclass, property } = cc._decorator;

var tbl_chip = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000];
var tbl_angle = [35, 5, -5, -30];
var tag_lang = {
    "zh-CN":"tog_zh",
    "en-US":"tog_en",
    "zh-TW":"tog_tw",
    "ar-EG":"tog_eg",
    "id-ID":"tog_id",
    "ja-JP":"tog_jp",
    "vi-VN":"tog_vn",
}

@ccclass
export default class Dian21UI extends cc.Component {

    @property(cc.SpriteAtlas)
    poker_res: cc.SpriteAtlas = null;

    @property(cc.Node)
    layer_btn: cc.Node = null;

    @property(cc.Node)
    layer_betBtn: cc.Node = null;

    @property(cc.Node)
    layer_btnSecure: cc.Node = null;

    @property(cc.Node)
    layer_over: cc.Node = null;

    //玩家nod
    @property(cc.Node)
    players: cc.Node[] = [];

    @property(cc.Node)
    master: cc.Node = null;

    @property(cc.Node)
    nod_betArea: cc.Node[] = [];

    @property(cc.Node)
    nod_chips: cc.Node = null;

    @property(cc.Label)
    room_num: cc.Label = null;

    @property(cc.Node)
    chip_bar: cc.Node = null;

    @property(cc.Node)
    nod_girl: cc.Node[] = [];

    @property(cc.Node)
    nod_waiting: cc.Node = null;

    @property(cc.Node)
    nod_help: cc.Node = null;

    @property(cc.Node)
    nod_record: cc.Node = null;

    @property(cc.Toggle)
    tog_menu: cc.Toggle = null;

    @property(cc.Node)
    nod_lan_select: cc.Node = null;

    @property(cc.Label)
    txt_lan_cur: cc.Label = null;

    @property(cc.Toggle)
    tog_auto: cc.Toggle = null;

    player_me = null;
    bet_min = 2;
    bet_max = 10000;
    bet_index = 0;
    bet_index_temp = 0;
    is_bet = false;

    is_run = false;
    timer = 0;
    area_t = null;
    is_waitMe = false;

    match_idx = 1;
    data_result = null;
    data_idle_seat = null;

    send_back = false;

    onLoad(): void {
        g.AudioMgr.playMusic("music_21");
        let curLangName = LocalDB.get(LangDef.LOCAL_LANGNAME)
        if (curLangName) {
            this.change_lang_tog(curLangName);
        }
        if (cfg.isFormal) {
            this.nod_lan_select.active = false;
        }
    }

    onDestroy(): void {
        g.MsgCache.clearCache();
    }

    onCreate(data) {
        this.initGame();
        this.initCache();
        if (data && data.type) {
            if (data.type == "playing") {
                g.NetSocket.send("back", {}, true)
            } else {
                g.NetSocket.send('free_match', { level: 1 }, true);
            }
        }
    }

    initGame(){
        this.nod_waiting.active = true;
        this.nod_waiting.getChildByName("item_wait").active = true;
        this.nod_waiting.getChildByName("btn_cancel").active = false;
        this.nod_waiting.getChildByName("btn_match").active = false;
        this.room_num.node.active = false;
        this.hide_btns();
        this.master.getComponent("Master_21").clean()

        for (var i in this.players) {
            this.players[i].active = false
            this.players[i].getComponent("PokerPlayer_21").resetInfo();
            this.players[i].getComponent("PokerPlayer_21").setPosIndex(i);
        }

        for (var i in this.nod_betArea) {
            this.nod_betArea[i].getComponent("BetArea_21").setAngle(tbl_angle[Number(i)]);
        }
        this.reset();
    }

    initCache() {
        // if (!g.MsgCache.isOpen()) {
        //     g.MsgCache.openCache(BundleManager.getInstance().getAppByBundleName("Dian21").getCacheEvents());
        // }
        g.MsgCache.clearCache();
        g.MsgCache.setAgent(this.onMessageCache.bind(this));
    }

    click_language(target, evt) {
        let tar_name = target.node.name;
        for(let k in tag_lang){
            if(tar_name==tag_lang[k]){
                this.change_language(k);
                break;
            }
        }
    }

    change_lang_tog(lan){
        this.txt_lan_cur.string = lan;
        let tog_name = null
        for(let k in tag_lang){
            if(k==lan){
                tog_name = tag_lang[k]
                break;
            }
        }
        
        let tog_select = this.nod_lan_select.getChildByName("tog_select")
        if(tog_name && tog_select){
            for(let i in tog_select.children){
                let c_lang = tog_select.children[i]
                if(c_lang.name == tog_name){
                    c_lang.getComponent(cc.Toggle).check();
                    break;
                }
            }
        }
    }

    change_language(lan) {
        if (lan) {
            this.txt_lan_cur.string = lan
            LocalDB.set(LangDef.LOCAL_LANGNAME, lan)
            BDLangManager.getInstance().changeLang(LangDef.LANGNAMES[lan])
        }
    }

    ReloadConnect(event) {
        console.log("MainUI ReloadConnect start")
        //g.Account.siginEx({ gamename: GameDef.GNAMES })
    }

    hideNotify() {

    }

    showNotify() {
        let flag = g.NetData.getSyncFlag()
        cc.log("MainUI showNotify Sync flag=" + flag)
        if (flag == 1) {
            if (g.NetSocket) {
                g.NetSocket.send('syncinfo', {}, true);
            }
        } else if (flag == 2) {
            g.NetData.setSyncFlag()
            if (g.NetSocket) {
                g.NetSocket.onError({ code: g.NetConfig.SocketError.ERROR_SOCKET_OTHERS }, true)
            }
        } else {

        }
    }

    referGame(data) {
        if (data.desk && data.desk.record_id) {
            this.room_num.node.active = true
            this.room_num.string = " " + data.desk.record_id
        } else {
            this.room_num.string = ""
        }
        this.hide_btns();

        this.master.getComponent("Master_21").setFuncOver(this.show_result.bind(this));
        this.master.getComponent("Master_21").clean()

        for (var i in this.players) {
            this.players[i].getComponent("PokerPlayer_21").resetInfo();
            this.players[i].getComponent("PokerPlayer_21").setPosIndex(i);
            this.players[i].active = true
        }

        for (var i in this.nod_betArea) {
            this.nod_betArea[i].getComponent("BetArea_21").setAngle(tbl_angle[Number(i)]);
        }

        this.reset();

        var my_info = g.Player;
        var my_id = my_info.getInfoBykey("id");

        if (data) {
            var states = data.states;
            var players = data.players;
            var seat_index = data.seat_index;
            if (states) {
                this.match_idx = states.level;
            }
            if (players && seat_index) {
                for (var i in seat_index) {
                    var s_idx = seat_index[i];
                    var cur_p = null;

                    for (var j in players) {
                        var p_data = players[j];
                        if (p_data.idx == s_idx) {
                            cur_p = p_data;
                            break;
                        }
                    }

                    var nod_area = this.nod_betArea[s_idx - 1];
                    if (nod_area) {
                        nod_area.getComponent("BetArea_21").setRealIdx(s_idx);
                    }

                    if (cur_p) {
                        var nod_player = this.players[s_idx - 1];
                        if (nod_player) {
                            nod_player.getComponent("PokerPlayer_21").setInfo(cur_p);
                            if (cur_p.id == my_id) {
                                this.player_me = nod_player;
                                this.bet_index = s_idx;
                            }
                        }
                    }
                }
            }

            var desk = data.desk;
            if (desk) {
                if (desk.seat && players) {
                    for (var i in desk.seat) {
                        var s_data = desk.seat[i];
                        var cur_p = null;

                        for (var j in players) {
                            var p_data = players[j];
                            if (p_data.idx == s_data.idx) {
                                cur_p = p_data;
                                break;
                            }
                        }

                        var nod_area = this.nod_betArea[s_data.idx - 1];
                        if (nod_area) {
                            nod_area.getComponent("BetArea_21").setRealIdx(s_data.idx);
                            if (s_data.cards) {
                                nod_area.getComponent("BetArea_21").get_poker(s_data.cards, false);
                                if (s_data.double_flag) {
                                    nod_area.getComponent("BetArea_21").poker_double();
                                }
                            }
                            if (s_data.extra_cards) {
                                nod_area.getComponent("BetArea_21").refresh_spare(s_data.extra_cards, s_data.extra_double_flag);
                            }
                            if (s_data.nick) {
                                nod_area.getComponent("BetArea_21").show_nick(s_data.nick);
                            }
                            if (s_data.secure_sum) {
                                nod_area.getComponent("BetArea_21").secure_open();
                            }
                        }

                        if (cur_p) {
                            var nod_player = this.players[s_data.idx - 1];
                            if (nod_player) {
                                nod_player.getComponent("PokerPlayer_21").setInfo(cur_p);
                                if (cur_p.id == my_id) {
                                    this.player_me = nod_player;
                                    this.bet_index = s_data.idx;
                                }
                                if (s_data.secure_sum) {
                                    nod_player.getComponent("PokerPlayer_21").add_secure(this.getChipArray(s_data.secure_sum));
                                }
                            }
                        }
                    }

                    var has_bat = false;
                    for (var i in players) {
                        var bet_info = players[i].bet;
                        for (var j in bet_info) {
                            var area = this.getAreaByIndex(bet_info[j].index);
                            if (area) {
                                var chips = this.getChipArray(bet_info[j].stakes);
                                area.refresh_bet(bet_info[j].stakes, chips);
                            }
                            if (players[i].id == my_id) {
                                has_bat = true;
                            }
                        }
                    }
                }

                if (desk.double_record) {

                }

                if (desk.master_cards) {
                    this.master.getComponent("Master_21").get_poker(desk.master_cards, false);
                }

                this.is_bet = false;
                switch (desk.state) {
                    case "idle":
                        {
                            this.reset();
                            break;
                        }
                    case "bet":
                        {
                            this.is_bet = true;
                            if (desk.bet_infos) {
                                this.bet_index = desk.bet_infos.bet_index;
                                this.show_betBtns(desk.bet_infos);
                            }
                            if (has_bat) {
                                this.bet_disable();
                            } else {
                                var btn_betOver = this.layer_betBtn.getChildByName("btn_betOver");
                                btn_betOver.getComponent(cc.Button).interactable = false;
                            }
                            for (var i in this.players) {
                                var player = this.players[i].getComponent("PokerPlayer_21");
                                if (player.getValueByKey("finish")) {
                                    if (player.getPlayerId() == my_id) {
                                        this.hide_btns();
                                    }
                                } else {
                                    player.showTimer(desk.countdown, desk.time);
                                }
                            }
                            for (var i in this.nod_betArea) {
                                var bet_script = this.nod_betArea[i].getComponent("BetArea_21");
                                bet_script.touch_close();
                                if (this.players[i].getComponent("PokerPlayer_21").getPlayerId() == my_id) {
                                    if (has_bat) {
                                        bet_script.unselect();
                                    } else {
                                        bet_script.select(false);
                                    }
                                } else {
                                    bet_script.unselect();
                                }
                            }
                            if (desk.idle_seat) {
                                this.data_idle_seat = desk.idle_seat;
                                for (var i in this.nod_betArea) {
                                    this.nod_betArea[i].getComponent("BetArea_21").unselect();
                                }
                                for (var i in desk.idle_seat) {
                                    var idx = desk.idle_seat[i];
                                    var area = this.getAreaByIndex(idx);
                                    if (area) {
                                        area.touch_open();
                                    }
                                }
                            }
                            break;
                        }
                    case "deal":
                        {
                            for (var i in this.nod_betArea) {
                                var bet_script = this.nod_betArea[i].getComponent("BetArea_21");
                                bet_script.touch_close();
                            }
                            this.hide_btns();
                            break;
                        }
                    case "secure":
                        {
                            for (var i in this.players) {
                                var player = this.players[i].getComponent("PokerPlayer_21");
                                var secure_index = player.getValueByKey("secure_index");
                                if (secure_index && secure_index.length > 0) {
                                    player.showTimer(desk.countdown, desk.time);
                                }
                            }
                            if (desk.secure_index) {
                                this.show_secure();
                                this.area_select(desk.secure_index);
                            }
                            break;
                        }
                    case "master_check":
                        {
                            break;
                        }
                    case "playing":
                        {
                            this.layer_btnSecure.active = false;
                            this.playerWaiting(desk.turn_id, desk.countdown, desk.state_time);
                            if (desk.turn_id == my_id) {
                                this.show_btns(desk.turn_action);
                            }
                            this.area_select(desk.turn_idx);

                            if (desk.turn_extra) {
                                var area = this.getAreaByIndex(desk.turn_idx);
                                if (area) {
                                    this.pause(1, area);
                                }
                            }
                            break;
                        }
                    case "result":
                        {
                            break;
                        }
                }
            }

            for (var i in this.players) {
                var player = this.players[i].getComponent("PokerPlayer_21");
                if (player.isEmpty()) {
                    player.removePlayer();
                }
            }

            if (this.player_me) {
                this.player_me.getComponent("PokerPlayer_21").setIsMine(true);
            }
        }
    }

    onMessage(event: string, args, id: number) {
        switch (event) {
            case 'syncinfo':
                {
                    this.cmd_syncinfo(event, args, id);
                    break;
                }
            case 'back':
                {
                    this.cmd_back(event, args, id);
                    break;
                }
            case 'kickmsg':
                {
                    this.cmd_kick(event, args, id);
                    break;
                }
            case 'record':
                {
                    this.cmd_record(event, args, id);
                    break;
                }
            case 'choose_seat':
                {
                    this.cmd_choose_seat(event, args, id);
                    break;
                }
            case "cast.user.update":
                {
                    if (args && args.gold != undefined) {
                        if (this.player_me) {
                            this.player_me.getComponent("PokerPlayer_21").refresh_score(args.gold);
                        }
                    }
                    break;
                }
            case 'quit':
                {
                    this.cmd_quit(event, args, id);
                    break;
                }
            case "signout":{
                this.preChangeUI()
                break;
                }
        }
    }

    onError(code: number, event: string, message: string): boolean {
        let ret = false
        switch (event) {
            case "back":
                {
                    this.initGame();
                    this.nod_waiting.active = true
                    this.nod_waiting.getChildByName("item_wait").active = false;
                    this.nod_waiting.getChildByName("btn_cancel").active = false;
                    this.nod_waiting.getChildByName("btn_match").active = true;
                    this.send_back = false;
                    ret = true
                    break;
                }
            case "free_match":
                {
                    this.initGame();
                    this.nod_waiting.active = true
                    this.nod_waiting.getChildByName("item_wait").active = false;
                    this.nod_waiting.getChildByName("btn_cancel").active = false;
                    this.nod_waiting.getChildByName("btn_match").active = true;
                    this.send_back = code != 1001;
                    ret = false
                    break;
                }
        }
        return ret;
    }

    //场景自带消息处理
    onMessageCache(event: string, args: object, id: number) {
        switch (event) {
            case 'action':
                {
                    this.cache_action(event, args, id);
                    break;
                }
            case 'bet':
                {
                    this.cache_bet(event, args, id);
                    break;
                }
            case 'finish':
                {
                    this.cache_finish(event, args, id);
                    break;
                }
            case 'state':
                {
                    this.cache_state(event, args, id);
                    break;
                }
            case 'secure':
                {
                    this.cache_secure(event, args, id);
                    break;
                }
            case 'result':
                {
                    this.cache_result(event, args, id);
                    break;
                }
            case 'dismiss':
                {
                    this.cache_dismiss(event, args, id);
                    break;
                }
            case "free_match":
                {
                    this.cmd_match(event, args, id)
                    break;
                }
            case "cancelmatch":
                {
                    this.cmd_quit_match(event, args, id)
                    break;
                }
            case 'free_start':
                {
                    this.cmd_free_start(event, args, id);
                    break;
                }
            case "quit":
                break;
        }
    }

    preChangeUI(){
        g.Manager.changeUI("MainUI", {})
    }

    update(dt) {
        g.MsgCache.handleMsg();
        if (this.is_run) {

        } else {
            if (this.timer > 0) {
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.msgContinue();
                    if (this.area_t) {
                        this.area_t.turn_spare();
                        this.area_t = null;
                    }
                    if (this.is_waitMe) {
                        this.layer_btn.active = true;
                    }
                }
            }
        }
    }

    msgContinue() {
        this.is_run = true;
    }

    pause(timer, area) {
        if (area) {
            this.area_t = area;
        }
        this.is_run = false;
        this.timer = timer ? timer : 1;
        this.is_waitMe = this.layer_btn.active;
        this.layer_btn.active = false;
    }

    getPlayer(id) {
        for (var i in this.players) {
            var player = this.players[i].getComponent("PokerPlayer_21");
            if (player.getPlayerId() == id) {
                return player;
            }
        }
    }

    getPlayerByIndex(idx) {
        for (var i in this.players) {
            var player = this.players[i].getComponent("PokerPlayer_21");
            if (player.getSeatIdx() == idx) {
                return player;
            }
        }
    }

    getAreaByIndex(idx) {
        for (var i in this.nod_betArea) {
            var area = this.nod_betArea[i].getComponent("BetArea_21");
            if (area.getRealIdx() == idx) {
                return area;
            }
        }
    }

    reset() {
        for (var i in this.nod_betArea) {
            this.nod_betArea[i].getComponent("BetArea_21").clean();
        }
        this.girl_state(0);
    }

    girl_state(g_state) {
        for (var i in this.nod_girl) {
            this.nod_girl[i].active = Number(i) == g_state;
        }
    }

    action_bet(idx, gold) {
        if (!this.is_bet) {
            return;
        }
        if (idx && gold) {
            g.NetSocket.send('bet', { index: idx, stakes: gold }, true);
        }
    }

    play_effect(name) {

    }

    show_btns(turn_action) {
        this.layer_btn.active = true;
        this.layer_betBtn.active = false;
        this.layer_btnSecure.active = false;
        if (turn_action) {
            var btn_fen = this.layer_btn.getChildByName("btn_fen");
            var btn_double = this.layer_btn.getChildByName("btn_double");
            var btn_stop = this.layer_btn.getChildByName("btn_stop");
            var btn_get = this.layer_btn.getChildByName("btn_get");
            btn_fen.getComponent(cc.Button).interactable = (turn_action[0] == 1);
            btn_double.getComponent(cc.Button).interactable = (turn_action[1] == 1);
            btn_stop.getComponent(cc.Button).interactable = (turn_action[2] == 1);
            btn_get.getComponent(cc.Button).interactable = (turn_action[3] == 1);
        }
    }

    show_betBtns(args) {
        this.layer_btn.active = false;
        this.layer_btnSecure.active = false;
        this.layer_betBtn.active = true;
        // this.bet_min = args.min;
        // this.bet_max = args.max;
        this.bet_enable();
    }

    show_secure() {
        this.layer_btnSecure.active = true;
        this.layer_btn.active = false;
        this.layer_betBtn.active = false;
    }

    hide_secure() {
        this.layer_btnSecure.active = false;
    }

    hide_btns() {
        this.layer_btn.active = false;
        this.layer_betBtn.active = false;
        this.layer_btnSecure.active = false;
        this.chip_bar.active = false;
        this.layer_over.active = false;
    }

    btn_shake() {
        let btn_betOver = this.layer_betBtn.getChildByName("btn_betOver")
        if (btn_betOver && btn_betOver.getComponent(cc.Button).interactable) {
            btn_betOver.stopAllActions();
            btn_betOver.runAction(cc.sequence(cc.rotateTo(0.08, 20), cc.rotateTo(0.08, -20), cc.rotateTo(0.08, 20), cc.rotateTo(0.08, -20), cc.rotateTo(0.04, 0)))
        }
    }

    createChipByValue(v_num) {
        let c_children = this.nod_chips.children;
        for (let i in c_children) {
            let model = c_children[i]
            let script_model = model.getComponent("Chip_21")
            if (script_model && script_model.getValue() == v_num) {
                let chip = cc.instantiate(model)
                chip.scale = 0.6
                return chip;
            }
        }
        return null;
    }

    getChipArray(gold) {
        var idx = tbl_chip.length - 1;
        var temp_gold = gold;
        var tbl = [];
        var chips = [];

        while (temp_gold > 0) {
            var mo = tbl_chip[idx];
            var num = Math.floor(temp_gold / mo);
            if (num > 0) {
                temp_gold -= num * mo;
                tbl.push({ v: mo, n: num });
            }
            idx -= 1;
            if (idx < 0) {
                break;
            }
        }

        for (var i in tbl) {
            var c_data = tbl[i];
            for (var j = 0; j < c_data.n; j++) {
                var chip = this.createChipByValue(c_data.v);
                if (chip) {
                    chips.push(chip);
                }
            }
        }

        return chips;
    }

    player_bet(p_player, area, gold) {
        var chips = this.getChipArray(gold);
        area.getComponent("BetArea_21").bet_chip(p_player, chips);
        area.getComponent("BetArea_21").setNumAll(gold);
    }

    playerWaiting(id, time, time_all) {
        var wait_time = time ? time : 20;
        for (var i in this.players) {
            var player = this.players[i].getComponent("PokerPlayer_21");
            if (player.getPlayerId() == id) {
                player.showTimer(wait_time, time_all);
            } else {
                player.hideTimer();
            }
        }
    }

    area_select(idx) {
        for (var i in this.nod_betArea) {
            var area = this.nod_betArea[i].getComponent("BetArea_21");
            if (area.getRealIdx() == idx) {
                this.girl_state(Number(i) + 1);
                area.select(true);
            } else {
                area.unselect();
            }
        }
    }

    area_selectBet(idx) {
        for (var i in this.nod_betArea) {
            var area = this.nod_betArea[i].getComponent("BetArea_21");
            if (area.getRealIdx() == idx) {
                area.select(false);
            } else {
                area.unselect();
            }
        }
    }

    bet_enable() {
        var btn_2 = this.layer_betBtn.getChildByName("btn_2");
        var btn_10 = this.layer_betBtn.getChildByName("btn_10");
        var btn_100 = this.layer_betBtn.getChildByName("btn_100");
        var btn_1000 = this.layer_betBtn.getChildByName("btn_1000");
        var btn_5000 = this.layer_betBtn.getChildByName("btn_5000");
        var btn_betSelect = this.layer_betBtn.getChildByName("btn_betSelect");
        btn_2.getComponent(cc.Button).interactable = true;
        btn_10.getComponent(cc.Button).interactable = true;
        btn_100.getComponent(cc.Button).interactable = true;
        btn_1000.getComponent(cc.Button).interactable = true;
        btn_5000.getComponent(cc.Button).interactable = true;
        btn_betSelect.getComponent(cc.Button).interactable = true;
    }

    bet_disable() {
        var btn_2 = this.layer_betBtn.getChildByName("btn_2");
        var btn_10 = this.layer_betBtn.getChildByName("btn_10");
        var btn_100 = this.layer_betBtn.getChildByName("btn_100");
        var btn_1000 = this.layer_betBtn.getChildByName("btn_1000");
        var btn_5000 = this.layer_betBtn.getChildByName("btn_5000");
        var btn_betSelect = this.layer_betBtn.getChildByName("btn_betSelect");
        var btn_betOver = this.layer_betBtn.getChildByName("btn_betOver");
        btn_2.getComponent(cc.Button).interactable = false;
        btn_10.getComponent(cc.Button).interactable = false;
        btn_100.getComponent(cc.Button).interactable = false;
        btn_1000.getComponent(cc.Button).interactable = false;
        btn_5000.getComponent(cc.Button).interactable = false;
        btn_betSelect.getComponent(cc.Button).interactable = false;
        btn_betOver.getComponent(cc.Button).interactable = true;
    }

    show_btnOver() {
        this.hide_btns();
        //g.NetSocket.send('quit', {}, true);
        if (this.tog_auto.isChecked) {
            g.NetSocket.send('free_match', { level: this.match_idx }, true);
        } else {
            this.layer_over.active = true;
        }
    }

    ///////////////////////////////////////////////////////server///////////////////////////////////////////////////////////

    cache_state(event, args, eventid) {
        if (!args) return;
        if (eventid != 0) return;
        if (args.record_id) {
            this.room_num.node.active = true;
            this.room_num.string = " " + args.record_id
        }
        this.is_bet = false;
        var my_info = g.Player;
        var my_id = my_info.getInfoBykey("id");

        switch (args.state) {
            case "idle":
                {
                    this.play_effect(args.time);
                    this.reset();
                    break;
                }
            case "bet":
                {
                    this.is_bet = true;
                    this.show_betBtns(args);
                    for (var i in this.players) {
                        this.players[i].getComponent("PokerPlayer_21").showTimer(args.time, args.time);
                    }
                    for (var i in this.nod_betArea) {
                        var bet_script = this.nod_betArea[i].getComponent("BetArea_21");
                        bet_script.touch_close();
                        if (this.players[i].getComponent("PokerPlayer_21").getPlayerId() == my_id) {
                            bet_script.select(false);
                        } else {
                            bet_script.unselect();
                        }
                    }
                    var btn_betOver = this.layer_betBtn.getChildByName("btn_betOver");
                    btn_betOver.getComponent(cc.Button).interactable = false;
                    break;
                }
            case "deal":
                {
                    for (var i in this.nod_betArea) {
                        var bet_script = this.nod_betArea[i].getComponent("BetArea_21");
                        bet_script.touch_close();
                    }
                    if (args.cards) {
                        for (var i in args.cards) {
                            var c_data = args.cards[i];
                            var area = this.getAreaByIndex(c_data.index);
                            if (area) {
                                area.poker_start(c_data.cards);
                            }
                        }
                    }
                    this.master.getComponent("Master_21").poker_start(args.master_cards);
                    this.hide_btns();
                    break;
                }
            case "secure":
                {
                    if (args.secure_players) {
                        for (var i in args.secure_players) {
                            var p_id = args.secure_players[i];
                            if (my_id == p_id) {
                                this.show_secure();
                                if (this.player_me) {
                                    this.area_select(this.player_me.getComponent("PokerPlayer_21").getSeatIdx());
                                }
                                break;
                            }
                        }
                    }

                    if (args.time) {
                        for (var i in this.players) {
                            this.players[i].getComponent("PokerPlayer_21").showTimer(args.time, args.time);
                        }
                    }
                    break;
                }
            case "master_check":
                {
                    if (args.master_cards) {
                        for (var i in this.players) {
                            this.players[i].getComponent("PokerPlayer_21").secure_yes(this.master);
                        }
                    } else {
                        for (var i in this.players) {
                            this.players[i].getComponent("PokerPlayer_21").secure_no(this.master);
                        }
                    }
                    this.hide_secure();
                    break;
                }
            case "playing":
                {
                    this.layer_btnSecure.active = false;
                    this.playerWaiting(args.turn_id, args.time, args.time);
                    if (args.turn_id == my_id) {
                        this.show_btns(args.turn_action);
                    }
                    g.AudioMgr.playSound("start");
                    this.area_select(args.turn_idx);
                    break;
                }
            case "result":
                {
                    break;
                }
        }
    }

    cache_bet(event, args, eventid) {
        if (args) {
            if (args.playerid) {
                var player = this.getPlayer(args.playerid);
                var area = this.getAreaByIndex(args.index);
                if (player && area) {
                    if (this.data_idle_seat) {
                        for (var i in this.data_idle_seat) {
                            if (args.index == this.data_idle_seat[i]) {
                                this.data_idle_seat[i] = -1;
                                break;
                            }
                        }
                    }
                    area.unselect();
                    player.refresh_score(args.gold);
                    this.player_bet(player, area, args.stakes);
                    if (player.getSeatIdx() != area.getRealIdx()) {
                        area.getComponent("BetArea_21").show_nick(player.getNick());
                    }
                    if (this.bet_index == args.index) {
                        this.bet_index = 0;
                        this.bet_disable();
                        if (this.data_idle_seat) {
                            let is_shake = false

                            for (var i in this.data_idle_seat) {
                                var index_left = this.data_idle_seat[i]
                                if (index_left > 0) {
                                    var area_left = this.getAreaByIndex(index_left);
                                    if (area_left) {
                                        area_left.touch_open();
                                        is_shake = true;
                                    }
                                }
                            }

                            if(is_shake){
                                this.btn_shake()
                            }
                        }
                    }
                }
            } else {
                if (args.bet_state) {
                    switch (args.bet_state) {
                        case "not_bet": {

                        }
                        case "already_bet": {
                            this.bet_disable();
                            break;
                        }
                        case "bet_other": {
                            this.bet_disable();
                        }
                    }

                    if (args.idle_seat) {
                        this.data_idle_seat = args.idle_seat;
                        for (var i in this.nod_betArea) {
                            this.nod_betArea[i].getComponent("BetArea_21").unselect();
                        }

                        let is_shake = false;
                        
                        for (var i in args.idle_seat) {
                            var idx = args.idle_seat[i];
                            var area = this.getAreaByIndex(idx);
                            if (area) {
                                area.touch_open();
                                is_shake = true;
                            }
                        }

                        if(is_shake){
                            this.btn_shake()
                        }
                    }
                }
            }
        }
    }

    cmd_choose_seat(event, args, eventid) {
        if (args && args.min != undefined) {
            if (this.bet_index_temp) {
                this.show_betBtns(args);
                this.bet_index = this.bet_index_temp;
                this.bet_index_temp = 0;
                for (var i in this.nod_betArea) {
                    var area_script = this.nod_betArea[i].getComponent("BetArea_21");
                    area_script.touch_close();
                    if (area_script.getRealIdx() == this.bet_index) {
                        area_script.select(false);
                    } else {
                        area_script.unselect();
                    }
                }
            }
        }
    }

    cache_secure(event, args, eventid) {
        if (args) {
            if (eventid > 0) {
                if (args.extra_secure_index) {
                    this.area_select(args.extra_secure_index);
                    this.show_secure();
                } else {
                    if (args.secure_state == "already_secure") {
                        this.hide_secure();
                        this.area_select(0);
                    }
                }
            } else {
                var area = this.getAreaByIndex(args.index);
                if (area) {
                    if (args.flag == 1) {
                        area.secure_open();
                    } else {
                        area.secure_close();
                    }
                }

                var player = this.getPlayer(args.playerid);
                if (player) {
                    if (args.secure_sum) {
                        player.refresh_score(args.gold);
                        player.buy_secure(this.getChipArray(args.secure_sum));
                    }
                    if (args.finish) {
                        player.hideTimer();
                    }
                }
            }
        }
    }

    cache_finish(event, args, eventid) {
        if (args && args.playerid) {
            var player = this.getPlayer(args.playerid);
            if (player) {
                player.hideTimer();
            }

            var my_info = g.Player;
            var my_id = my_info.getInfoBykey("id");
            if (my_id == args.playerid) {
                g.AudioMgr.playSound("stop");
                this.hide_btns();
                for (var i in this.nod_betArea) {
                    var bet_script = this.nod_betArea[i].getComponent("BetArea_21");
                    bet_script.unselect();
                    bet_script.touch_close();
                }
            }
        }
    }

    cache_action(event, args, eventid) {
        if (!args) return;
        var my_info = g.Player;
        var my_id = my_info.getInfoBykey("id");
        var player = this.getPlayer(args.playerid);
        var area = this.getAreaByIndex(args.index);
        var turnid = args.turn_id;
        var cur_idx = args.turn_idx ? args.turn_idx : args.index;

        switch (args.event) {
            case "split":
                {
                    //分牌
                    if (player) {
                        player.refresh_score(args.gold);
                        player.show_state(0);
                    }
                    if (area) {
                        var cur_num = area.getNumBet();
                        if (cur_num && args.seat_bet) {
                            if (player) {
                                this.player_bet(player, area, args.seat_bet - cur_num);
                            }
                        }
                        area.setNumAll(args.seat_bet);
                        area.refresh_cur(args.cards);
                        area.refresh_spare(args.extra_cards);
                    }
                    if (turnid > 0) {
                        g.AudioMgr.playSound("start");
                        this.playerWaiting(turnid, args.time, args.time);
                        this.area_select(cur_idx);
                        if (turnid == my_id) {
                            this.show_btns(args.turn_action);
                        } else {
                            this.hide_btns();
                        }
                    } else {
                        if (turnid == 0) {
                            if (this.layer_btn.active) {
                                this.show_btns(args.turn_action);
                            }
                        } else {
                            this.area_select(cur_idx);
                            this.playerWaiting(turnid, args.time, args.time);
                            this.hide_btns();
                        }
                    }
                    break;
                }
            case "double":
                {
                    if (player) {
                        player.refresh_score(args.gold);
                        player.show_state(1);
                    }
                    if (area) {
                        var cur_num = area.getNumBet();
                        if (cur_num && args.seat_bet) {
                            if (player) {
                                this.player_bet(player, area, args.seat_bet - cur_num);
                            }
                        }
                        area.setNumAll(args.seat_bet);
                        area.get_poker(args.cards, true);
                        area.poker_double();
                    }
                    break;
                }
            case "stand":
                {
                    if (player) {
                        player.show_state(2);
                    }
                    if (area) {
                        area.stop();
                    }
                    break;
                }
            case "hit":
                {
                    if (player) {
                        player.refresh_score(args.gold);
                        player.show_state(3);
                    }
                    if (area) {
                        area.get_poker(args.cards, true);
                    }
                    break;
                }
        }

        if (turnid > 0) {
            g.AudioMgr.playSound("start");
            this.playerWaiting(turnid, args.time, args.time);
            this.area_select(cur_idx);
            if (turnid == my_id) {
                this.show_btns(args.turn_action);
            } else {
                this.hide_btns();
            }
            if (args.turn_extra) {
                this.pause(1, area);
            }
        } else {
            if (turnid == 0) {
                if (this.layer_btn.active) {
                    this.show_btns(args.turn_action);
                }
                if (args.turn_extra) {
                    this.pause(1, area);
                }
            } else {
                this.area_select(cur_idx);
                this.playerWaiting(turnid, args.time, args.time);
                this.hide_btns();
            }
        }
    }

    cmd_back(event, args, eventid) {
        if (args && args.deskinfo) {
            this.nod_waiting.active = false
            this.initCache()
            this.referGame(args.deskinfo);
        } else {
            this.initGame();
            this.nod_waiting.active = true
            this.nod_waiting.getChildByName("item_wait").active = false;
            this.nod_waiting.getChildByName("btn_cancel").active = false;
            this.nod_waiting.getChildByName("btn_match").active = true;
            this.send_back = false;
        }
    }

    cmd_syncinfo(event, args, eventid){
        if (args && args.deskinfo) {
            this.nod_waiting.active = false
            this.initCache()
            this.referGame(args.deskinfo);
        } else {
            this.initGame();
            this.nod_waiting.active = true
            this.nod_waiting.getChildByName("item_wait").active = false;
            this.nod_waiting.getChildByName("btn_cancel").active = false;
            this.nod_waiting.getChildByName("btn_match").active = true;
            this.send_back = false;
        }
    }

    cmd_kick(event, args, eventid) {

    }

    cmd_quit(event, args, eventid) {
        if (eventid > 0) {
            this.quitGame();
        }
    }

    cache_result(event, args, eventid) {
        if (!args) return;
        if (!args.players_result) return;

        this.data_result = args;
        if (args.master_list) {
            g.AudioMgr.playSound("start");
            this.master.getComponent("Master_21").show_result(args.master_list);
        }
        this.girl_state(0);
    }

    show_result(event, args, eventid) {
        var args = this.data_result;
        if (!args) {
            return;
        }

        for (var i in args.players_result) {
            var r_data = args.players_result[i];
            var player = this.getPlayer(r_data.playerid);
            if (player) {
                player.refresh_score(r_data.gold);
                player.score_effect(r_data.win);
                if (r_data.win > 0) {
                    this.master.getComponent("Master_21").chip_fly(player, this.getChipArray(r_data.win));
                }
            }
        }

        for (var i in args.seat_result) {
            var s_data = args.seat_result[i];
            var player = this.getPlayer(s_data.playerid);
            var area = this.getAreaByIndex(s_data.index);
            if ((s_data.win > 0)) {
                area.chip_fly(player);
            } else {
                if ((s_data.win < 0)) {
                    area.chip_fly(this.master.getComponent("Master_21"));
                }
            }
            area.mark_change(s_data.win, s_data.extra_win);
        }

        this.playerWaiting(-1, 0, 1);
        this.area_select(-1);
        this.show_btnOver();
    }

    cache_dismiss(event, args, eventid) {

    }

    cmd_record(event, args, eventid) {
        this.nod_record.active = true
        this.nod_record.getComponent("layer_record2").updatLayer(args)
    }

    cmd_match(event, args, eventid) {
        this.nod_waiting.active = true
        this.nod_waiting.getChildByName("item_wait").active = true;
        this.nod_waiting.getChildByName("btn_cancel").active = true;
        this.nod_waiting.getChildByName("btn_match").active = false;
        this.hide_btns();
    }

    cmd_free_start(event, args, eventid) {
        if (args && args.players) {
            this.nod_waiting.active = false
            this.play_effect("start");
            this.referGame(args)
        }
    }

    cmd_quit_match(event, args, eventid) {
        this.nod_waiting.active = true
        this.nod_waiting.getChildByName("item_wait").active = false;
        this.nod_waiting.getChildByName("btn_cancel").active = false;
        this.nod_waiting.getChildByName("btn_match").active = true;
    }

    quitGame() {
        g.NetSocket.send('signout', {}, true);
        g.Dialog.clear();
    }

    click_select(evt, data) {
        if (!this.is_bet) {
            return;
        }
        if (!this.player_me) {
            return;
        }
        if (evt && evt.target) {
            var idx = evt.target.getComponent("BetArea_21").getRealIdx();
            if (idx) {
                if (this.player_me.getComponent("PokerPlayer_21").getSeatIdx() != idx) {
                    this.bet_index_temp = idx;
                    g.NetSocket.send('choose_seat', { index: idx }, true);
                }
            }
        }
    }

    ClickGameBtn(btn, data) {
        let name = btn.target.name
        switch (name) {
            case "btn_set":
                g.Manager.showGlobalUI(g.GlobalUI.TYPE_CREATE_SET, {})
                break;
            case "btn_record":
                g.NetSocket.send("record", {}, true);
                break;
            case "btn_quit":
                g.NetSocket.send("quit", {}, true);
                break;
            case "btn_match":
                if (this.send_back) {
                    g.NetSocket.send('back', {}, true);
                } else {
                    g.NetSocket.send('free_match', { level: this.match_idx }, true);
                }
                break;
            case "btn_cancel":
                g.NetSocket.send('cancelmatch', {}, true);
                break;
            case "btn_help":
                this.nod_help.active = true
                this.nod_help.getComponent("layer_help").updateLayer("rule_21.txt")
                break;
            case "secure_yes":
                g.NetSocket.send('secure', { flag: 1 }, true);
                break;
            case "secure_no":
                g.NetSocket.send('secure', { flag: 0 }, true);
                break;
            case "btn_fen":
                g.NetSocket.send('action', { event: "split" }, true);
                break;
            case "btn_double":
                g.NetSocket.send('action', { event: "double" }, true);
                break;
            case "btn_stop":
                g.NetSocket.send('action', { event: "stand" }, true);
                break;
            case "btn_get":
                g.NetSocket.send('action', { event: "hit" }, true);
                break;
            case "btn_2":
                this.action_bet(this.bet_index, 2);
                break;
            case "btn_10":
                this.action_bet(this.bet_index, 10);
                break;
            case "btn_100":
                this.action_bet(this.bet_index, 100);
                break;
            case "btn_1000":
                this.action_bet(this.bet_index, 1000);
                break;
            case "btn_5000":
                this.action_bet(this.bet_index, 5000);
                break;
            case "btn_betSelect":
                if (this.bet_max) {
                    this.chip_bar.getComponent("ChipBar_21").setClickFunc(this.call_bet.bind(this));
                    this.chip_bar.getComponent("ChipBar_21").open(this.bet_min, this.bet_max);
                }
                break;
            case "btn_betOver":
                g.NetSocket.send('finish', {}, true);
                break;
            case "btn_rematch":
                this.initGame();
                g.NetSocket.send('free_match', { level: this.match_idx }, true);
                break;
            case "menu_cover":
                this.tog_menu.isChecked = false;
                break;
        }
    }

    call_bet(num) {
        this.action_bet(this.bet_index, num);
    }
}
