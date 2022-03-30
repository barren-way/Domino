package org.cocos2dx.javascript;

import java.util.HashMap;
import java.util.Map;

/**
 * @description 游戏中的所有第三方参数或者控制变量放到这里统一设置
 */
public class Config {
    //超级盾
    public static final boolean USE_DUN = false;
    public static final String DUN_KEY = "";
    //超级盾设置的端口
    public static final Map<Integer, String> DUN_PORTS = new HashMap<Integer, String>();

    static {
    }

    //微信参数
    public static final String WX_APPID = "wx76be719a5526af52";

    //友盟参数
    public static final String UM_KEY = "5f335683b4b08b653e93a45f";

    //游密参数
    public static final String YIM_APPKEY = "YOUME4A8437842C3A4624342AED330EC8ADB9E3677F06";
    public static final String YIM_SECRETKEY = "5jJrWhVSJkwZaUqo142v6GVy3rOUukJiQmp1y3+c2Vg4HDhV78jkDKCN40aCpUnLG/BSQ5tJHcx4eGhHhVqNFb6tPutUhr1ZmOXLPNbxyaZXUvjjpnzIK9i1/nc8hxxfVIxUyrAbqh1qrm2341BAJubOHMig2qSnYo17ESjFz/cBAAE=";

}
