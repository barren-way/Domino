import {g} from '../../../Framework/Script/G'
import { GameDef } from './GameDef';
import Tools from './Tools';

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserInfo extends cc.Component {

    @property(cc.Label)
    private user_name: cc.Label = null;

    @property(cc.Label)
    private user_id: cc.Label = null;

    @property(cc.Label)
    private user_money: cc.Label = null;

    @property(cc.Sprite)
    private user_icon: cc.Sprite = null;

	onCreate (data){

	}

    onLoad () {
        cc.director.on(GameDef.EVENTS.NOTIFY_REF_USERINFO, this.refreshUser.bind(this));
    }

    onDestroy(){
        cc.director.off(GameDef.EVENTS.NOTIFY_REF_USERINFO);
    }

    onEnable(){
        this.refreshUser();
    }

    start () {

    }

	//场景自带消息处理
    onMessage(event:string, args:object, id:number){
    //TODO
    }

    onError(code:number, event:string, message:string):boolean{
        return false;
    }

    update (dt) {

    }

    refreshUser():void{
        if(g.Player.isInit()){            
            this.user_name.string = Tools.formatNick(g.Player.getInfoBykey("nick"));
            this.user_id.string = "ID:" + g.Player.getInfoBykey("id");
            console.log( g.Player.getInfoBykey("gold"))
            this.user_money.string = g.Player.getInfoBykey("roomcard");
            g.GameUtil.DrawHead(this.user_icon,g.Player.getInfoBykey("avatar"))
        }
        
    }
}
