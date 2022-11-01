using UnityEngine;
using System.Collections;
using System;

using _Global = KBN._Global;

public class CheckForDownloadTxtFile : MonoBehaviour {
    private string m_configLogURL;
    private string m_configVersion;
    private MulticastDelegate m_pfnLoadConfigFile;
    private MulticastDelegate m_pfnSaveConfigFile;
    private GameObject m_gameObj;
    private WWW m_www;
    private float m_waitDelayTime = 90.0f;
    private string m_errorMsg = null;
	public string ErrorMsg {
		get {
			return m_errorMsg;
		}
	}
    private static bool gm_isOnLoad = false;
    
    public static void DownloadCfgFile(string configLogURL, string configVersion, MulticastDelegate pfnLoadConfigFile, MulticastDelegate pfnSaveConfigFile) {
        if (gm_isOnLoad) {
            return;
        }
        gm_isOnLoad = true;
        GameObject go = new GameObject("check_download_cfg_file");
        go.AddComponent<CheckForDownloadTxtFile>();
        CheckForDownloadTxtFile txtFile = go.GetComponent<CheckForDownloadTxtFile>();
        txtFile.m_configLogURL = configLogURL;
        txtFile.m_configVersion = configVersion;
        txtFile.m_pfnLoadConfigFile = pfnLoadConfigFile;
        txtFile.m_pfnSaveConfigFile = pfnSaveConfigFile;
        txtFile.m_gameObj = go;
        DontDestroyOnLoad(go);
    }
    
    public void Start() {
        WWW w = null;
        try {
            w = new WWW(m_configLogURL);
        } catch (System.Net.HttpListenerException ex) {
            m_errorMsg = ex.Message;
            return;
        } catch (System.Exception e) {
            m_errorMsg = e.Message;
            return;
        }
        m_www = w;
    }
    
    public void Update() {
        while (m_www != null && !m_www.isDone && m_www.error == null && m_waitDelayTime >= 0.0f) {
            m_waitDelayTime -= Time.deltaTime;
            return;
        }
        
        try {
            priv_LoadConfig();
        } catch (Exception) {
        }
        
        Destroy(this.m_gameObj, 10.0f);
        gm_isOnLoad = false;
        return;
    }
    
    private void priv_LoadConfig() {
        //this.priv_loopForCheckDataValid(w, 10.0f);
        if (m_www == null || !m_www.isDone)
            return;
        
        string logString = m_www.text;
        m_www.Dispose();
        m_www = null;
        
        HashObject localCfg = null;
        try {
            if (m_pfnLoadConfigFile != null) {
                localCfg = m_pfnLoadConfigFile.DynamicInvoke(true) as HashObject;
            }
        } catch (Exception) {
            if (m_pfnLoadConfigFile != null) {
                localCfg = m_pfnLoadConfigFile.DynamicInvoke(false) as HashObject;
            }
        }
        
        HashObject appendCfg = null;
        try {
            appendCfg = JSONParse.instance.NewInstance().Parse(logString);
        } catch (Exception e) {
            m_errorMsg = e.Message;
            return;
        }
        
        HashObject finCfg = _Global.MergeHashObject(localCfg, appendCfg);
        if (finCfg == null)
            return;
        
        if (finCfg["version"] == null)
            finCfg["version"] = new HashObject();
        finCfg["version"].Value = _Global.INT32(m_configVersion);

        if (m_pfnSaveConfigFile != null) {
            m_pfnSaveConfigFile.DynamicInvoke(finCfg);
        }
    }
}