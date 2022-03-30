export module NetConfig {
    //几秒收不到服务器消息，超时，调用telcount
    export const pingTimeOut: number = 12;

    //最大ping几次后就不ping了
    export const maxPing: number = 30;
    //控制是否开启网络等待(54321)弹板儿
    export const waitable: boolean = false; //开了之后maxPing才生效


    //断网后重试次数，全部失败后切换到下一个链接
    export const tryCount: number = 3;

    //连接超时(建立链接时的超时时间)
    export const connectTimeOut: number = 25;

    //ping的事件间隔 秒
    export const pintSpace: number = 1;

    //缓存大于多少时，清理
    export const keepCount: number = 5;


    //网络错误码
    export enum SocketError {
        ERROR_SOCKET_CONNECT = -100,
        ERROR_SOCKET_TIMEOUT = -101, //网络不好倒计时(54321)
        ERROR_SOCKET_OTHERS = -102,
        ERROR_SOCKET_CLOSING = -103,
        ERROR_SOCKET_TIMEOUT1 = -104 //常规的网络不好弹版(有重连)
    };
    
    //网络错误码
    export const HttpResult = {
        OK: "JsonResult",
        ERROR: "JsonError"
    };
}