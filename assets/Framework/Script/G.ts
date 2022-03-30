import * as mgr from './Engine/Manager';
import * as audio from './Engine/AudioManager';
import * as video from './Engine/VideoManager';
import * as md5 from './Engine/md5';
import * as bdMgr from './Engine/BundleManager';

import * as socket from './Net/NetSocket';
import * as Cache from './Net/MsgCache';
import * as NetCfg from "./Net/NetConfig";
import * as http from './Net/NetHttp';
import * as handler from './Net/EventHandler';

import * as iuser from './Data/User';
import * as iplayer from './Data/Player';


import * as idialog from "./Tips/Dialog";
import * as radio from "./Data/Radio";
import * as iresloader from '../../Games/Common/Script/ResLoader';

//sdk相关封装
import * as sdk from './Sdk/SdkManager';


//用户方面
import * as acct from '../../Games/Common/Script/Account';
import * as net from "../../Games/Common/Script/NetModel"
import * as netdat from '../../Games/Common/Script/NetData';
import * as iglobal from '../../Games/Common/Script/Global';
import * as gshare from '../../Games/Common/Script/GlobalShare';

import * as glui from '../../Games/Common/Script/GlobalUI';
import * as gutil from '../../Games/Common/Script/GameUtil';
import * as assetMgr from '../../Games/Common/Script/AssetsManager';
import * as chargeMgr from '../../Games/Common/Script/ChargeManager';
import BundleHotUpdate from '../../Games/Common/Script/BundleModule/BundleHotUpdate';


export namespace g {
    export let Manager: mgr.default = null;
    export let NetSocket: socket.default = null;
    export let NetHttp: http.default = null;
    export let EventHandler = handler.default;
    export let NetData = netdat.default;
    export let MsgCache: Cache.default = null;
    export let NetConfig = NetCfg.NetConfig;
    export let NetModel = net.default;
    export let AudioMgr: audio.default = null;
    export let VideoMgr: video.default = null;
    export let AssetsMgr: assetMgr.default = null;
    export let BundleMgr: bdMgr.default = null;
    export let ChargeMgr = chargeMgr.default;
    export let MD5 = md5.default;

    export let Sdk: sdk.default = null;

    export let Account: acct.default = null;
    export let Global: iglobal.default = null;
    export let User: iuser.default = null;
    export let Player: iplayer.default = null;
    export let Radio: radio.default = null;

    export let ResLoader: iresloader.default = null;

    export let Dialog = idialog.default;
    export let GlobalUI = glui.default;
    export let GameUtil = gutil.default;
    export let GlobalShare = gshare.default;


    let packageCache = null; //已加载的分包记录


    /*底层调用初始化 */
    export function init(): void {
        Manager = mgr.default.getInstance();

        NetSocket = socket.default.getInstance();
        NetHttp = http.default.getInstance();
        MsgCache = Cache.default.getInstance();

        AudioMgr = audio.default.getInstance();
        VideoMgr = video.default.getInstance();
        AssetsMgr = assetMgr.default.getInstance();
        BundleMgr = bdMgr.default.getInstance();

        Sdk = sdk.default.getInstance();

        Account = acct.default.getInstance();
        Global = iglobal.default.getInstance();
        User = iuser.default.getInstance();
        Player = iplayer.default.getInstance();
        Radio = radio.default.getInstance();

        ResLoader = iresloader.default.getInstance();
        NetModel.initServerList();

        packageCache = {}

        //js调用ts可以再在这里封装处理
        window["MD5"] = MD5
    }

    /*底层调用释放 */
    export function uninit(): void {
        if (NetSocket) {
            NetSocket.release();
            NetSocket = null;
        }
        if (NetHttp) {
            NetHttp.release();
            NetHttp = null;
        }
        if (MsgCache) {
            MsgCache.closeCache();
            MsgCache.clearCache();
            MsgCache = null;
        }
        if (ResLoader) {
            ResLoader.uninit()
        }
        if (BundleMgr) {
            BundleMgr.uninit()
        }

        BundleHotUpdate.getInstance().uninit()

        Dialog.clear();

        VideoMgr.release();
        Manager = null;
        packageCache = null;
    }

    export function preChangeUI() {
        EventHandler.clearEventListener()
        Dialog.clear()
    }

    export function clearNetListener(all?: Boolean) {
        EventHandler.clearEventListener(all)
    }
}