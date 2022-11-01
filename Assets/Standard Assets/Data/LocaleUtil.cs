using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using UnityNet = KBN.UnityNet;
using _Global = KBN._Global;
using Payment = KBN.Payment;
using Datas = KBN.Datas;

public class LocaleUtil {
    #region Nested classes
    public class SysLang {
        public int id;
        public string fileName;
        public string langKey;
        public List<string> devlans;
        public string strKey;
        public bool enable;
        
        public override string ToString() {
            return strKey;
        }
        
        public void initWithHashObject(HashObject ho) {
            //this.id = _Global.INT32(ho["id"]);
            this.fileName = ho["fileName"].Value as string;
            this.langKey = ho["langKey"].Value as string;
            this.enable = _Global.INT32(ho["disable"]) != 1;
            
            object[] tArray = _Global.GetObjectValues(ho["devlans"]);
            this.devlans = new List<string>();
            foreach (object lanHO in tArray) {
                this.devlans.Add((lanHO as HashObject).Value as string);
            }
            
            if (ho["strKey"] != null) {
                strKey = ho["strKey"].Value as string;
            } else {
                strKey = langKey;
            }
            
            try {
                if (ho["langId"] != null)
                    this.id = _Global.INT32(ho["langId"]);
                else
                    this.id = Convert.ToInt32(System.Enum.Parse(typeof(SystemLanguage), langKey, true));
            } catch (System.Exception) {
                _Global.Log("langKey : " + langKey + " error!");
                this.enable = false;
            }
        }
        
        public bool containDevLan(string lan) {
            bool b = false;
            if (this.devlans != null) {
                b = _Global.IsValueInArray(this.devlans, lan);
            }
            b = b || (this.fileName == lan);
            return b;
        }

        //public void initDefault()
        //{
        //    id = 10;
        //    fileName = "en";
        //    langKey = "English";
        //}
    }

    [JasonReflection.JasonDataAttribute(SearchInfo = JasonReflection.JasonDataAttribute.SearchType.All)]
    public class LoadingInfo {
        public string Background = "loading_Background";
        public string ScrollHeader;
    }
    #endregion

    private static LocaleUtil _instance;

    public static LocaleUtil getInstance() {
        if (_instance == null) {
            _instance = new LocaleUtil();
        }
        return _instance;
    }
    /////
    private static string configPath = "Data/config";
    public static int defaultID = 10;
    private SysLang defaultLang;
    private List<SysLang> list;
    private string m_catchFileDirectory;
    private string m_configFileVersion;
    private LoadingInfo m_loadingInfo = new LoadingInfo();
    
    public string ConfigFileVersion {
        get {
            return m_configFileVersion;
        }
    }
    
    public LoadingInfo TheLoadingInfo {
        get {
            return m_loadingInfo;
        }
    }
    
    public void Init() {
		m_catchFileDirectory = KBN.GameMain.GetApplicationDataSavePath();
        HashObject txtObj = priv_loadConfigFile(true);
        
        try {
            this.priv_initWithConfigHashObject(txtObj);
        } catch (Exception) {
            this.priv_deleteConfigFile();
            txtObj = priv_loadConfigFile(false);
            this.priv_initWithConfigHashObject(txtObj);
        }
    }
    
    private void priv_initWithConfigHashObject(HashObject txtObj) {
        int cnt = 0;
        SysLang lang;
        string ap = _Global.ap;
        
        defaultLang = null;
        
        //---------------------------------------------//
        UnityNet.initiateDebugServer(txtObj["server"]);
        
        Payment.initPayment(txtObj["payment"]);
        
        m_configFileVersion = txtObj["version"].Value.ToString();
        
        initGameConfig(txtObj["gameconfig"]);
        
        __initMobileAppTrackerInstall(txtObj["MobileAppTracker"]);
        
        JasonReflection.JasonConvertHelper.ParseToObjectOnce(m_loadingInfo, txtObj["LoadBackground"]);
        
        //---------------------------------------------//
        
        list = new List<SysLang>();
        
        HashObject lanObj = txtObj["lan"];
        while (lanObj[ap + cnt ]!= null) {
            lang = new SysLang();
            lang.initWithHashObject(lanObj[ap + cnt]);
            if (lang.enable) {
                list.Add(lang);
                if (defaultLang == null) {
                    defaultLang = lang;
                    defaultID = defaultLang.id;
                }
            }
            cnt++;
        }
        _Global.Log("cnt:" + cnt);
    }
    
    public static Hashtable UservoiceHash;
    public static Hashtable ApptrackerHash;
    public static Hashtable ChartboostHash;
    public static Hashtable TapjoyHash;
    public static Hashtable NanigansHash;
    public static Hashtable NewRelic;
    public static Hashtable ADXHash;
    
    private static void initGameConfig(HashObject data) {
        
        if (data != null) {
            UservoiceHash = new Hashtable();
            ApptrackerHash = new Hashtable();
            ChartboostHash = new Hashtable();
            TapjoyHash = new Hashtable();
            NanigansHash = new Hashtable();
            NewRelic = new Hashtable();
            ADXHash = new Hashtable();
            
            HashObject uservoiceOBj = data[NativeCaller.UserVoice.nodeName] as HashObject;
            UservoiceHash[NativeCaller.UserVoice.VECTOR] = uservoiceOBj[NativeCaller.UserVoice.VECTOR].Value; 
            UservoiceHash[NativeCaller.UserVoice.SECRET] = uservoiceOBj[NativeCaller.UserVoice.SECRET].Value; 
            UservoiceHash[NativeCaller.UserVoice.SITE] = uservoiceOBj[NativeCaller.UserVoice.SITE].Value; 
            UservoiceHash[NativeCaller.UserVoice.KEY] = uservoiceOBj[NativeCaller.UserVoice.KEY].Value; 
            UservoiceHash[NativeCaller.UserVoice.SSOKEY] = uservoiceOBj[NativeCaller.UserVoice.SSOKEY].Value; 
            UservoiceHash[NativeCaller.UserVoice.SUBDOMAIN] = uservoiceOBj[NativeCaller.UserVoice.SUBDOMAIN].Value; 
            
            HashObject apptrackerOBj = data[NativeCaller.AppTracker.nodeName] as HashObject;
            ApptrackerHash[NativeCaller.AppTracker.ADVERTISERID] = apptrackerOBj[NativeCaller.AppTracker.ADVERTISERID].Value; 
            ApptrackerHash[NativeCaller.AppTracker.APPKEY] = apptrackerOBj[NativeCaller.AppTracker.APPKEY].Value; 
            ApptrackerHash[NativeCaller.AppTracker.SITEID] = apptrackerOBj[NativeCaller.AppTracker.SITEID].Value;
			ApptrackerHash[NativeCaller.AppTracker.SITEID_ANDROID] = apptrackerOBj[NativeCaller.AppTracker.SITEID_ANDROID].Value;

            HashObject chartboostOBj = data[NativeCaller.ChartBoost.nodeName] as HashObject;
            ChartboostHash[NativeCaller.ChartBoost.APPSIGNATURE] = chartboostOBj[NativeCaller.ChartBoost.APPSIGNATURE].Value; 
            ChartboostHash[NativeCaller.ChartBoost.APPID] = chartboostOBj[NativeCaller.ChartBoost.APPID].Value; 
			ChartboostHash[NativeCaller.ChartBoost.APPSIGNATURE_ANDROID] = chartboostOBj[NativeCaller.ChartBoost.APPSIGNATURE_ANDROID].Value; 
			ChartboostHash[NativeCaller.ChartBoost.APPID_ANDROID] = chartboostOBj[NativeCaller.ChartBoost.APPID_ANDROID].Value; 

            HashObject TapjoyOBj = data[NativeCaller.TapjoyBoost.nodeName] as HashObject;
            TapjoyHash[NativeCaller.TapjoyBoost.APPID] = TapjoyOBj[NativeCaller.TapjoyBoost.APPID].Value;
            TapjoyHash[NativeCaller.TapjoyBoost.SECRETKEY] = TapjoyOBj[NativeCaller.TapjoyBoost.SECRETKEY].Value;  
            
            HashObject NanigansOBj = data[NativeCaller.NanigansBoost.nodeName] as HashObject;
            NanigansHash[NativeCaller.NanigansBoost.APPID] = NanigansOBj[NativeCaller.NanigansBoost.APPID].Value;
            
            HashObject NewRelicOBj = data[NativeCaller.NewRelic.nodeName] as HashObject;
            NewRelic[NativeCaller.NewRelic.ID] = NewRelicOBj[NativeCaller.NewRelic.ID].Value;

            HashObject ADXObj = data[NativeCaller.ADX.NodeName] as HashObject;
            ADXHash[NativeCaller.ADX.ClientId] = ADXObj[NativeCaller.ADX.ClientId].Value;
        }
    }

    private Action m_MobileAppTrackerInstallCallback;

    public void MobileAppTrackerInstallToServer() {
        if (m_MobileAppTrackerInstallCallback != null) {
            m_MobileAppTrackerInstallCallback();
            m_MobileAppTrackerInstallCallback = null;
        }
    }

    public void UpdateConfigFileFromURL(string configLogURL, string configVersion) {
        if (string.IsNullOrEmpty(configLogURL) || string.IsNullOrEmpty(configVersion))
            return;
        
        CheckForDownloadTxtFile.DownloadCfgFile(configLogURL, configVersion, new Func<bool, HashObject>(priv_loadConfigFile), new Action<HashObject>(priv_saveStringFile));
    }
    
    private string priv_catchLogFilePath {
        get {
            string cfgCatchPath = System.IO.Path.Combine(m_catchFileDirectory, configPath);
            return cfgCatchPath;
        }
    }
    
    private void priv_deleteConfigFile() {
        try {
            System.IO.File.Delete(this.priv_catchLogFilePath);
        } catch (Exception) {
        }
    }
    
    ///*
    private void priv_saveStringFile(HashObject dat) {
        string cfgCatchDirectory = System.IO.Path.GetDirectoryName(this.priv_catchLogFilePath);
        //  copy resource data to the cache file path.
        if (!System.IO.Directory.Exists(cfgCatchDirectory)) {
            System.IO.Directory.CreateDirectory(cfgCatchDirectory);
        }
        
        //System.Runtime.Serialization.Formatters.Binary.BinaryFormatter arc = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
        System.IO.StreamWriter stream = null;
        try {
            System.IO.TextWriter tw = System.IO.File.CreateText(this.priv_catchLogFilePath);
            stream = tw as System.IO.StreamWriter;
            dat.FormatToJson(tw, _Global.ap);
            tw.Close();
        } catch (Exception) {
            if (stream != null) {
                stream.Dispose();
                stream = null;
                System.IO.File.Delete(this.priv_catchLogFilePath);
            }
        } finally {
            if (stream != null)
                stream.Dispose();
        }
    }
    //*/
    private HashObject priv_loadConfigFile(bool isLoadCatchFile) {
        if (isLoadCatchFile && System.IO.File.Exists(this.priv_catchLogFilePath)) {
            System.IO.StreamReader fs = null;
            try {
                //System.Runtime.Serialization.IFormatter arc = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
                fs = System.IO.File.OpenText(this.priv_catchLogFilePath);
                string datStr = fs.ReadToEnd();
                //HashObject serObj = arc.Deserialize(fs) as HashObject;
                fs.Dispose();
                fs = null;
                HashObject serObj = JSONParse.instance.NewInstance().Parse(datStr);
                if (serObj != null)
                    return serObj;
            } catch (Exception) {
                //  do nothing.
            } finally {
                if (fs != null)
                    fs.Dispose();
            }
            
            this.priv_deleteConfigFile();
        }
        
        TextAsset text = Resources.Load(configPath) as TextAsset;
        string strData = text.text;
        return JSONParse.instance.NewInstance().Parse(strData);
    }
	
    private void __initMobileAppTrackerInstall(HashObject matNodeInfo) {
        if (matNodeInfo == null)
            return;
        
        Func<string, string> getParamsInfo = delegate (string paramName) {
            return _Global.GetParamStringFromHashObj(matNodeInfo, paramName, null);
        };
        
#pragma warning disable 429
		string remoteURL_cfg = (BuildSetting.DebugMode == 1 ? "unuse" : "RemoteURL_Release");
#pragma warning restore 429

        string remoteURL = getParamsInfo(remoteURL_cfg);
        if (remoteURL == null)
            return;
        
        string mac0ParamName = getParamsInfo("Mac0ParamName");
        string ifaParamName = getParamsInfo("IFAParamName");
        string openUDIDParamName = getParamsInfo("OpenUDIDParamName");
        m_MobileAppTrackerInstallCallback = delegate () {
            UnityNet.SendMATInstallNotify(remoteURL, mac0ParamName, ifaParamName, openUDIDParamName);
        };
    }

    public SysLang[] getLangList() {
        return list.ToArray();
    }
    
    public SysLang getLang(int id) {
        foreach (SysLang lang in list) {
            if (lang.id == id) {
                return lang;
            }
        }
        return defaultLang;
    }
    
    public int getLangIdByFN(string fn) {
        foreach (SysLang lang in list) {
            if (lang.containDevLan(fn)) {
                _Global.Log("FN:" + fn + " langKey:" + lang.langKey);
                return lang.id;
            }
        }
        return defaultID;
    }

    public int getLangIdByFN(string fn, string countryCode) {
        if (fn == "zh") {
            if (countryCode == "CN") {
                fn = "zs";          
            } else {
                fn = "zt";
            }
        }
        return getLangIdByFN(fn);
    }

    public string getFileName(int id) {
        SysLang lang = getLang(id);
        return lang.fileName;
    }
    
    public string getLangKey(int id) {
        SysLang lang = getLang(id);
        return lang.langKey;
    }
    //根据语言代码获取语言id
    public int getLangId(string fileName){
        foreach(SysLang lang in list){
            if(lang.fileName==fileName)
                return lang.id;
        }
        return 0;
    }
    //根据语言获取翻译由来字符串
    public string getLangIdString(string fileName){
        // int id=getLangId(fileName);
        fileName=GetInTransList(fileName);
        string transLan="error.trans_"+fileName;
        return Datas.getArString(transLan);
    }

    public string GetInTransList(string fileName){
        List<string> transList=new List<string>();
        transList.Add("en");
        transList.Add("fr");
        transList.Add("de");
        transList.Add("it");
        transList.Add("es");
        transList.Add("tr");
        transList.Add("sv");
        transList.Add("nl");
        transList.Add("da");
        transList.Add("ru");
        transList.Add("pl");
        transList.Add("pt");
        transList.Add("ja");
        transList.Add("ko");
        transList.Add("zh-CN");  //这个跟你ISO-639-1不对应
        transList.Add("zh-TW");  //这个跟你ISO-639-1不对应
        
        if(transList.Contains(fileName)){
            return fileName;
        }else{
            return "defult";
        }
    }
}