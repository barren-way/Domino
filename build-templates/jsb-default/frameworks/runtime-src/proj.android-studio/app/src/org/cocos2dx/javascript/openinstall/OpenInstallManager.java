package org.cocos2dx.javascript.openinstall;

import android.content.Intent;
import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import com.fm.openinstall.OpenInstall;
import com.fm.openinstall.listener.AppInstallAdapter;
import com.fm.openinstall.listener.AppWakeUpAdapter;
import com.fm.openinstall.model.AppData;


public class OpenInstallManager {
	
	//标志
	private static final String m_LogTag="OpenInstallManager";		
	//单例
	private static OpenInstallManager m_INSTANCE = new OpenInstallManager();
	//主ctivity
	private static AppActivity m_app=null;
	
	//代理id
	private static String m_agent="";
	
	//单例
	public static OpenInstallManager getInstance(){
		return m_INSTANCE;
	}
	
	//初始化
	public void initOpenInstall(AppActivity app){

		Log.i(m_LogTag, "*** initOpenInstall***");
		m_app=app;
		//获取唤醒参数
        OpenInstall.getWakeUp(m_app.getIntent(), wakeUpAdapter);
        //获取OpenInstall数据，推荐每次需要的时候调用，而不是自己保存数据
        OpenInstall.getInstall(new AppInstallAdapter() {
            @Override
            public void onInstall(AppData appData) {
                //获取渠道数据
                String channelCode = appData.getChannel();
                //获取个性化安装数据
                String bindData = appData.getData();
                //设置代理参数
                setOpenInstallAgnet(bindData);
                if (!appData.isEmpty()) {
                	//Toast.makeText(m_app, appData.toString(), Toast.LENGTH_LONG).show();
                }
            }
        });
	}
		
	public void onNewIntent(Intent intent) {
        OpenInstall.getWakeUp(intent, wakeUpAdapter);
    }
	
	 /**
     * 唤醒参数获取回调
     * 如果在没有数据时有特殊的需求，可将AppWakeUpAdapter替换成AppWakeUpListener
     *
     * @param appData
     */
    AppWakeUpAdapter wakeUpAdapter = new AppWakeUpAdapter() {
        @Override
        public void onWakeUp(AppData appData) {
            //获取渠道数据
            String channelCode = appData.getChannel();
            //获取自定义数据
            String bindData = appData.getData();
        }
    };
	
	//设置代理数值
    public void setOpenInstallAgnet(String bindData) {
    	if(bindData==null){
    		return;
    	}
    	try {
			JSONObject json = new JSONObject(bindData);
			String agent=(String) json.get("agent");
			if(agent!=null && !agent.isEmpty()){
				m_agent=agent;
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
    }
    
	//获取代理数值
    public static void getOpenInstallAgnet() {
		AppActivity.getInstance().runOnGLThread(new Runnable() {
			@Override
			public void run() {
				Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"event_openinstall_agent\","+m_agent+")");
			}
		});
    }

    
}
