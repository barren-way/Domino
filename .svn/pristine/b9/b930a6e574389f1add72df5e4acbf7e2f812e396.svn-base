
//语音
var yim=null;

var VoiceUtils = {

    //当前房间
    room_id:null,
    
    //voice对象
    voice:null,

    is_init:false,

    user_id:null,
    
    user_token:null,

    saveUserInfo(s_uid,s_token){
        if(s_uid){
            this.user_id=s_uid;
        }
        if(s_token){
            this.user_token=s_token;
        }
    },

    init:function(roomId){
        if(yim){
            return;
        }

        if(this.is_init){
            return;
        }

        if ('undefined' == typeof YIM) {
            console.log("YIM undefined !!!")
            return;
        }

        let _self=this;
        let _roomId=roomId;

        yim = new YIM({
            appKey: 'YOUME4A8437842C3A4624342AED330EC8ADB9E3677F06',
            userId: this.user_id,
            token: this.user_token,
            useMessageType: [VoiceMessage],
        });

        // 为语音消息插件注册录音类型插件
        VoiceMessage.registerRecorder([WechatRecorder,MP3Recorder]);

        if(WechatRecorder.isWechat()) {
            WechatRecorder.setWXObject(wx);
            console.log("WechatRecorder.setWXObject(wx) yes");
        }else{
            console.log("WechatRecorder.setWXObject(wx) no");
        }

        VoiceMessage.initRecorder().then(function () {
            _self.is_init=true;
            _self.doJoinRoom(_roomId);
            console.log('初始化录音完毕')
        }).catch(function (e) {
            console.log("initRecorder Error ",JSON.stringify(e));
        });

        yim.on("message:*",this.onMessage.bind(this));
    },

    joinRoom:function(roomId){
        if(!roomId){
            return;
        }
        var str_roomid=roomId+"";
        if(this.is_init){
            this.doJoinRoom(str_roomid);
        }else{
            this.init(str_roomid);
        }
    },

    doJoinRoom:function(roomId){
        if(this.is_init&&roomId){
            this.room_id = roomId;
            yim.joinRoom(this.room_id).catch(function (e) {
                console.log("joinRoom Error ",JSON.stringify(e));
            });
        }
    },

    leaveRoom:function(){
        if(!this.is_init){
            return;
        }
        if(this.room_id){
            yim.leaveRoom(this.room_id).catch(function (e) {
                console.log("leaveRoom Error ",JSON.stringify(e));
            });
        }
        this.room_id=null;
        this.voice=null;
    },
    
    onMessage:function(eventName, msg){
        if(!this.room_id){
            return;
        }
        var msgObj = msg.message;
        if(msgObj.getType()=='voice'||msgObj.getType()=='wechat'){
            console.log("yim eventName: ",eventName);
            if(eventName.indexOf(this.room_id)!=-1){
                msgObj.play();
            }
        }
    },

    //发送语音消息示例
    startRecord:function() {
        if(!this.is_init){
            return;
        }
        this.voice = null;  
        this.voice = new VoiceMessage(); 
        this.voice.startRecord();  
    },

    //结束录音
    finishRecord:function() {
        if(!this.is_init){
            return;
        }
        if(this.voice){
            this.voice.finishRecord(true);    
            if(this.room_id){
                console.log("this.room_id: "+this.room_id);
                if(this.voice.isError()){
                    console.log("finishRecord Error ",this.voice.getErrorName());
                }else{
                    yim.sendToRoom(this.room_id,this.voice).catch(function (e) {
                        console.log("sendToRoom Error ",JSON.stringify(e));
                    });
                }
            }
        }
    },

    //结束录音
    cancelRecord:function() {
        if(!this.is_init){
            return;
        }
        if(this.voice){
            this.voice.finishRecord();    
        }
    },
};
