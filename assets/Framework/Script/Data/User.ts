
export default class User{
    private static mInstance:User = null;
    private mInfo:any = null;

    public static getInstance():User{
        if(!User.mInstance){
            User.mInstance =  new User();
            User.mInstance.init({});
        }
        return User.mInstance;
    }

    public init(data):void{
        this.mInfo = {};
        for (const key in data) {
            this.mInfo[key] = data[key];
        }
    }
    
    public release():void{
        this.mInfo = null;
    }
    
    public get sid():string{
        if(this.mInfo){
            return this.mInfo.sid
        }
    }

    public set sid(token:string) {
        if(this.mInfo){
            this.mInfo["sid"] = token;
        }
    }

    public get KindID():number{
        if(this.mInfo){
            return this.mInfo.KindID
        }
    }

    public set KindID(_KindID:number) {
        if(this.mInfo){
            this.mInfo["KindID"] = _KindID;
        }
    }

    public get url():any{
        if(this.mInfo){
            return this.mInfo.url
        }
    }

    public set url(_url:any) {
        if(this.mInfo){
            this.mInfo["url"] = _url;
        }
    }

    public get InviteInfo():any{
        if(this.mInfo){
            return this.mInfo.InviteInfo;
        }
    }

    public set InviteInfo(info:any) {
        if(this.mInfo){
            this.mInfo["InviteInfo"] = info;
        }
    }
}