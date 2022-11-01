using UnityEngine;
using System.Collections;
using System;

using GameMain = KBN.GameMain;

public class Flags {
    public bool GM_STR_LOADED = true;// = "gm_str_loaded";
    public bool GM_DATA_LOADED = false;// = "gm_data_loaded";

    public bool D_ALL_RELOAD = false;// = "data_all_relaod";
    public bool D_DATA_LOADED = false;// = "data_data_loaded";
    public bool D_STR_LOADED = false;// = "data_str_loaded";

    public bool NeedRestartForData { get; set; }
    public bool NeedRestartForStrings { get; set; }

    public bool NeedRestartForGds
    {
        get
        {
            GdsManager mgr = GameMain.GdsManager;
            return GdsManagerHelper.NeedRestartGame(mgr);
        }
    }
	
    public bool MYSTRY_CHEST_CONFIG = false;// = "mystry_chest_config";
    
    private static Flags singleton;
    private Hashtable _hash = new Hashtable();
    
    public  static  Flags instance() {
        if (singleton == null) {
            singleton = new Flags();
            GameMain.singleton.resgisterRestartFunc(new Action(OnRestartGame));
        }
        return singleton;
    }

    private static void OnRestartGame() {
        singleton = null;
    }
    
    private Flags() {
    }
    
    public bool SetValue(string key, object v, bool force) {
        object rv = GetValue(key);
        if (rv != null && !force)
            return false;
        _hash[key] = v;
        return true;    
    }
    
    public bool SetValue(string key, object v) {
        return SetValue(key, v, true);
    }
    
    public object GetValue(string key) {
        return _hash[key];
    }
    
    public object PopValue(string key) {
        object v = GetValue(key);
        if (v != null)
            _hash.Remove(key);
        return v;
    }
    
    public bool GetRestartGameFlag() {
        return NeedRestartForData || NeedRestartForStrings || NeedRestartForGds;
    }
}
