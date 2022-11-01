using UnityEngine;
using System.Collections;
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;

using ProtoBuf;
namespace KBN
{
    public class UnityNet
    {
        public static int IPHONE_PLATFORM_ID = 201;
        public static int GOOGLEPLAY_PLATFORM_ID = 203;
        public static int AMAZON_PLATFORM_ID = 204;
		public delegate void PFN_OkFunction(HashObject dat);
		public delegate void PFN_ErrorFunction(string errorMsg, string errorCode);
        protected static string STATIC_KEY = "1ca48ad63d48c3adfae0d7af77f27027";
        protected static string constMdValue;
        public static string NET_ERROR = "NET_ERROR";
        public static float TIME_OUT_DURATION = 90f;
        
        protected static int platformId = IPHONE_PLATFORM_ID;
        
        protected static bool exceptionOccurred = false;
        protected static bool reportNormalErrorToServer = true;
        protected static MonoBehaviour monoBehaviour;
        protected static bool isInLoadingScene = true;
        
        protected static string baseUrl = "";
        protected static string mobileId;
        protected static long gameNumber;
        
        public static string URL_US_OFFICIAL = "product";
        
        protected static string selectedServer;
        protected static string subDomain;
        protected static string mainDomain;
        protected static string selectedServerURL;
        
        protected static Hashtable debugServers = new Hashtable();

        public const string CLIENT_EXCEPTION = "CLIENT_EXCEPTION";
        public const string CLIENT_LOG = "CLIENT_LOG";

        protected static long slotId;

		public delegate HashObject EventOnReciveFromServer(string www);

        public delegate void OnHookResult(string url, HashObject result);

        protected static OnHookResult onHookResult;

        #region PHP lists and dicts
        protected static HashObject UrlTransfers = new HashObject(
            new Hashtable() {
                {"sendeEmail.php", "getEmail.php"}, 
                {"blockUser.php", "getEmail.php"},
            }
        );

        protected static string[] noConnectMenuPHP = new string[] {
            "getGameTip.php",
            "getServerTime.php",
            "warmStartTracking.php",
            "signup.php",
            "getSeed.php",
            "sendChat.php",
            "successLoginTracking.php",
            "datameerTracking.php",
            "getChat.php",
            "maintenanceChat.php",
            "privatechat.php",
			"avaChat.php",
            "updateSeed.php",
            "clientErrLogs.php",
            "paymentError.php",
            "tracking.php",
            "preLoading.php",
            "upgrade.php",
            "broadcast.php",
            "payments.php", // payments.php connectmenu controlled outside
            "getUserIgnore.php",
            "pushNotification.php",
            "getMysteryChestList.php",
            "fetchMapTiles.php",
            "getReport.php",
            "getEmail.php",
            "gds.php",
            "gdsVersion.php",
            "knightGearMount.php",
            "knightGearSave.php",
            "knightGears.php",
			"ava.php",
            "getGCLeaderboard.php",
            "knightGearFte.php",
			"ota.php",
			"otaResourceList.php",
			"getCarmotInfo.php",
            "getResourceInfo.php",
            "getMonsterPool.php",
            "showSkill.php"
            // "monsterEvent.php"
        };
        
        protected static string[] noNetErrorMenuPHP = new string[] {
            "warmStartTracking.php",
            "successLoginTracking.php",
            "datameerTracking.php",
            "getChat.php",
            "maintenanceChat.php",
            "privatechat.php",
			"avaChat.php",
            "updateSeed.php",
            "listReports.php",
            "clientErrLogs.php",
            "paymentError.php",  
            "tracking.php",
            "preLoading.php",
            "fte.php",
            "broadcast.php",
            "pushNotification.php",
            "getUserIgnore.php",
            "getReport.php",
            "getEmail.php",
            "getGCLeaderboard.php",
        };
        
        protected static string[] Rc4PHP = new string[] {
            "fetchMapTiles.php",
        };

        protected static string[] noFTELocalServerPHP = new string[] {
            "getGameTip.php",
            "signup.php",
            "getSeed.php",
			"migrateCancel.php",
            "getChat.php",
            "maintenanceChat.php",
            "privatechat.php",
			"avaChat.php",
            "alliancewall.php",
            "eventcenter.php",
            "getServerTime.php",
            "warmStartTracking.php",
            "successLoginTracking.php",
            "datameerTracking.php",
            "kabamId.php",
            "tracking.php",
            "preLoading.php",
            "fte.php",
            "clientErrLogs.php",
            "paymentError.php",
            "upgrade.php",
            "getMysteryChestList.php",
            "broadcast.php",
            "gds.php",
            "gdsVersion.php",
            "knightGearMount.php",
            "knightGearSave.php",
            "knightGears.php",
            "knightGearFte.php", 
			"otaResourceList.php",
			"ota.php",
			"getBaseMapInfo.php"
        };
        #endregion

#if UNITY_EDITOR
        //编辑器模式下用来收集 加密前的接口的参数信息
       private static byte[] fromeDataBytes = null;
#endif



        public static void initiateDebugServer(HashObject data)
        {
            debugServers = new Hashtable();
            int index = 0;
            Hashtable tempHashtable;
            while(data[_Global.ap + index] != null)
            {
                tempHashtable = (data[_Global.ap + index] as HashObject).Table;
                debugServers[(tempHashtable["name"] as HashObject).Value] = new Hashtable() {
                    {"mainDomain", (tempHashtable["mainDomain"] as HashObject).Value},
                    {"subDomain", (tempHashtable["subDomain"] as HashObject).Value},
                    {"name", (tempHashtable["name"] as HashObject).Value}
                };
                index++;
            }
        }

        public static Hashtable DebugServers()
        {
            return debugServers;
        }

        public static void free(){
            exceptionOccurred = false;
            monoBehaviour.StopAllCoroutines();
            monoBehaviour = null;
            baseUrl = "";
            onHookResult = null;
        }

        protected static bool needShowNetErrorDlg(string url)
        {
            for (int i = 0; i < noNetErrorMenuPHP.Length; i++) 
            {
                if (url.EndsWith(noNetErrorMenuPHP[i]))
                {
                    return false;
                }
            }
            return true;
        }

        protected static bool needRc4(string url)
        {
            for (int i = 0; i < Rc4PHP.Length; i++)
            {
                if(url.EndsWith(Rc4PHP[i]))
                {
                    return true;
                }
            }
            return false;
        }

        protected static bool isItemEndInArray(string item, string[] list)
        {
            for (int i = 0; i < list.Length; i++)
            {
                if (item.EndsWith(list[i]))
                {
                    return true;
                }
            }       
            return false;
        }

        protected static string getStringParam(string errorMsg, string paramName, string Dim)
        {
            int start = errorMsg.IndexOf(paramName);
            if (start < 0) {
                return string.Empty;
            }
            start += paramName.Length;
            int end = errorMsg.IndexOf(Dim, start);
            if (end < 0){
                end = errorMsg.Length;
            }
            return errorMsg.Substring(start, end - start);
        }

        protected static bool needEncrypt(string url)
        {
            // return true;
             return !(url.EndsWith("gds.php"));
            // return !(url.EndsWith("payments.php") || url.EndsWith("upgrade.php") || url.EndsWith("preLoading.php") || url.EndsWith("getServerTime.php") 
            //         || url.EndsWith("gds.php") || url.EndsWith("gdsVersion.php"));
        }
        private static string des="";
        protected static WWWForm encryptForm(WWWForm form,bool needEncrypt=false)
        {
            string postData = System.Text.Encoding.UTF8.GetString(form.data).ToLower();
            postData = postData.Replace("%3a",":");
            // _Global.LogWarning("postData: +"+postData);
            List<string> postArray = postData.Split('&').ToList<string>();
            
			postArray.Sort((a, b)=>{
				return a.Substring(0, a.IndexOf('=')).CompareTo(b.Substring(0, b.IndexOf('=')));
			});

            //decode
            for (int i = 0; i < postArray.Count; i++)
            {
                postArray[i] = WWW.UnEscapeURL(postArray[i]);
            }
            
			string urlMdFactor = string.Join("&", postArray.ToArray());
            
            string gameKey = getMD5Hash(urlMdFactor + constMdValue);
            
            form.AddField("gameKey", gameKey);
            
            
            //base64
            string b64 = System.Convert.ToBase64String(form.data);
#if UNITY_EDITOR
            fromeDataBytes = form.data;
#endif
            //_Global.LogWarning("b64: "+ b64);
            WWWForm ret = new WWWForm();

            if(needEncrypt){    
                // des 加密
                des = DESEnCode_AES(b64);        
                ret.AddField("data", des);
            }else{
                ret.AddField("data", b64);
            }
                
            // ret.AddField("data", b64);
            ret.AddField("vcs", BuildSetting.CLIENT_VERSION);
            return ret;
        }
      //  private static bool noEncrypt=true;
        
        public static string getMD5Hash(string input)
        {
			return _Global.GetMD5Hash(input);
        }

        protected static WWWForm retryForm(bool encrypted, WWWForm form)
        {
           WWWForm retForm = new WWWForm();
            string formString =  System.Text.Encoding.Default.GetString(form.data);
            //             +    URL 中+号表示空格                                 %2B   
            // 空格 URL中的空格可以用+号或者编码           %20 
            // /   分隔目录和子目录                                     %2F     
            // ?    分隔实际的URL和参数                             %3F     
            // %    指定特殊字符                                          %25     
            // #    表示书签                                                  %23     
            // &    URL 中指定的参数间的分隔符                  %26     
            // =    URL 中指定参数的值                                %3D
            // :                                      %3a
            formString = formString.Replace("%3d","=")
            .Replace("%2b","+")
            .Replace("%2f","/")
            .Replace("%3f","?")
            .Replace("%23","#")
            .Replace("%25","%")
            .Replace("%26","&")
            .Replace("%3a",":");
           

           // _Global.LogWarning("formString: " + formString); 
          

           string orgString;
           try
           {
                    //Decode
                    if (encrypted)
                    {    
                            orgString = formString.Substring(5/* "data=".Length */, formString.IndexOf("&vcs") - 5 );
                           // _Global.LogWarning("orgString: " + orgString); 
                            orgString = DESDeCode_AES(orgString);
                            //_Global.LogWarning("form data1:" + orgString);
                            byte[] orgData = System.Convert.FromBase64String(orgString);
                            orgString = System.Text.Encoding.Default.GetString(orgData);
                            orgString = orgString.Replace("%3a",":");
                           // _Global.LogWarning("form data2:" + orgString);
                    }
                    else
                    {
                        orgString = formString;
                       // _Global.LogWarning("form data:" + orgString);
                    }
                    
                    string[] pair = orgString.Split(new char[] {'&'}, StringSplitOptions.RemoveEmptyEntries);
                    
                    string k;
                    string v;
                    string[] p;
                    for (int i = 0; i < pair.Length; i++)
                    {
                        p = pair[i].Split(new char[] {'='}, StringSplitOptions.RemoveEmptyEntries);
                        if (p == null || p.Length < 1 || p[0] == "gameKey")
                        {
                            continue;
                        }
                        
                        k = p[0];
                        if (p.Length == 1)
                        {
                            v = String.Empty;
                        }
                        else
                        {
                            v = (k == "gameNumber") ? "" + gameNumber++ : p[1];
                        }
                        retForm.AddField(k, v);
                    }
                    
                    //encode
                    if (encrypted)
                    {
                        retForm = encryptForm(retForm,encrypted);
                    }
            }
            catch(Exception e)
            {
               Debug.LogWarning(e);
            }
          
           
           return retForm;
            
        }
        
        public static void initByServerSetting(string subDomain, string mainDomain)
        {
            if (subDomain != null && mainDomain != null)
            {    
                debugServers[URL_US_OFFICIAL] = new Hashtable() {
                    {"mainDomain", mainDomain},
                    {"subDomain", subDomain},
                    {"name", URL_US_OFFICIAL},
                };   
                selectServer(URL_US_OFFICIAL);
            }
        }

        public static void selectServer(string serverName)
        {
            selectedServer = serverName;

            subDomain = (debugServers[selectedServer] as Hashtable)["subDomain"] as string;
            mainDomain = (debugServers[selectedServer] as Hashtable)["mainDomain"] as string;

            selectedServerURL = subDomain + mainDomain + "ajax/";

            baseUrl = selectedServerURL;
        }


        public static void SetSelectServer(string tempSubDomain, string tempMainDomain)
        {
            subDomain = tempSubDomain;
            mainDomain = tempMainDomain;
            selectedServerURL = subDomain + mainDomain + "ajax/";

            baseUrl = selectedServerURL;
        }


        public static void setReportNormalErrorToServer(bool logSwitcher)
        {
            reportNormalErrorToServer = logSwitcher;
        }

        public static void initGameNumber(long num)
        {
            gameNumber = num;
        }

        public static string getBaseURL()
        {
            return baseUrl;
        }

        public static string rc4Code(string key, byte[] pt)
        {
            int[] s = new int[256];
            int i;
            for (i = 0; i < 256; i++) 
            {
                s[i] = i;
            }
            int j = 0;
            int x;
            for (i = 0; i < 256; i++) 
            {
                j = (j + s[i] + System.Convert.ToInt32(key[i % key.Length])) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
            }
            i = 0;
            j = 0;
            char[] iOutputChar = new char[pt.Length];   
            for (int y = 0; y < pt.Length; y++) 
            {
                i = (i + 1) % 256;
                j = (j + s[i]) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x; 
                
                iOutputChar[y] = System.Convert.ToChar((System.Convert.ToInt32(pt[y]) & 0x000000FF)^ s[(s[i] + s[j]) % 256]);  
            }
            return new string(iOutputChar);  
        }

        public static void setInLoadingScene(bool param)
        {
            isInLoadingScene = param;
        }

        protected static void reloadDlg(string url)
        {
            //all fatal error need to restartgame exept "clientErrLogs.php"
            if (url.EndsWith( "clientErrLogs.php"))
            {
                return;
            }

			_Global.Log("$$$$ UnityNet.reloadDlg error url : " + url);
            string errorMsg = Datas.getArString("Error.Fatal_Error");
            ErrorMgr.singleton.PushError("", errorMsg, false, null, new Action(GameMain.singleton.restartGame));
        }

        public static string localError(string errorCode, string msg, string feedback)
        {
            if (!Datas.IsStringReady())
            {
                return null;
            }
            
            string ret;
            string resName;
            
            if (!string.IsNullOrEmpty(errorCode) && !string.IsNullOrEmpty(Datas.getArString("Error.err_" + errorCode)))
            {    
				if(errorCode.Equals("4")){
					MyItems.singleton.M_bNeedUpdate = true;
				}
                if(feedback != null && feedback.Trim().Length > 0)
                {

                    switch(errorCode)
                    {
                    case "4":
                        string[] fbarray = feedback.Split("-"[0]);
                        // resources
                        if (fbarray[0] == "5")
                        {    
                            resName = Datas.getArString("ResourceName." + _Global.ap + fbarray[1]);
                            ret = Datas.getArString("Error.err_4").Replace("%1$s", "resources").Replace("%2$s", fbarray[2]).Replace("%3$s", resName);
                        } 
                        // troops
                        else if (fbarray[0] == "3")
                        {
                            resName = Datas.getArString("unitName." + "u" + fbarray[1]);
                            ret = Datas.getArString("Error.err_4").Replace("%1$s", "troops").Replace("%2$s", fbarray[2]).Replace("%3$s", resName);
                        }
                        // buildings
                        else if (fbarray[0] == "1")
                        {
                            
                            string bdgName = Datas.getArString("buildingName." + "b" + fbarray[1]);
                            ret = Datas.getArString("Error.err_4b").Replace("%1$s", bdgName).Replace("%2$s", fbarray[2]);
                        }
                        // items
                        else if (fbarray[0] == "8")
                        {
                            string itemName = Datas.getArString("itemName." + "i" + fbarray[1]);
                            ret = Datas.getArString("Error.err_4c").Replace("%1$s", itemName).Replace("%2$s", fbarray[2]);
                            
                        } 
                        else
                        {
                            ret = Datas.getArString("Error.err_4z");
                        }
                        break;
                    case "7":
                        string time = _Global.DateTime(System.Convert.ToInt64(_Global.parseTime(feedback)));
                        ret = Datas.getArString("Error.err_7").Replace("%1$s", time);
                        break;
                    case "103":
                        string lvl = feedback;
                        ret = Datas.getArString("Error.err_103").Replace("%1$s", lvl);
                        break;
                    case "223":
                        string goldReq = feedback;
                        ret = Datas.getArString("Error.err_223").Replace("%1$s", goldReq);
                        break;
                    default:
                        ret = Datas.getArString("Error.err_" + errorCode);
                        break;  
                    }
                }
                else
                {
                    if (errorCode.Equals("1933"))
                    {
                        ret = String.Format(Datas.getArString("Error.err_" + errorCode), GameMain.singleton.GetPvpLevelRestrict());
                    }
                    else
                    {
                        ret = Datas.getArString("Error.err_" + errorCode);
                    }

                }  
            }
            else if (BuildSetting.DEBUG_MODE != 0 && msg != null && msg.Trim().Length > 0)
            {
                ret = "Add new string to arstrings: " + msg; 
            }
            else
            {
                ret = Datas.getArString("Error.err_default");
            }
            
            if(BuildSetting.DEBUG_MODE != 0)
            {
                ret = string.Format("(Code: {0}) {1}", errorCode, ret);
            }
            return ret;
        }

        protected static void normalErrorDlg(string url, string code, string msg, string feedback)
        {
            //if get data or string error....
            if(!needShowNetErrorDlg(url))
            {
                return;
            }
            
            string errorMsg = localError(code, msg, feedback);
            if (errorMsg != null)
            {
                ErrorMgr.singleton.PushError("", errorMsg, true, "", null);
            }
        }

        protected static bool IsGZip(WWW www)
        {
            foreach (string key in www.responseHeaders.Keys)
            {
                if(0 == string.Compare(key, "Content-Encoding", true))
                {
                    string val = www.responseHeaders[key];
                    if(0 == string.Compare(val, "gzip", true))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        protected static bool checkUsedFTE(string url, WWWForm form)
        {
            if (FTEMgr.getInstance() == null || FTEMgr.getInstance().isFinished)
            {
                return false;
            }
            if (isItemEndInArray(url, noFTELocalServerPHP))
            {
                return false;
            }
            return true;
        }

        protected static bool needConnectMenu(string url)
        {
            for (int i = 0; i < noConnectMenuPHP.Length; i++)
            {
                if (url.EndsWith(noConnectMenuPHP[i]))
                {
                    return false;
                }
            }
            
            if (url.EndsWith("fte.php"))
            {
                return FTEMgr.getInstance().isFinished; //if finish, sending commit.
            }
            
            if (url.EndsWith("fetchMapTiles.php"))
            {
                return GameMain.singleton.MapIsAutoUpdate(); //if it's autoupdate, not show connect menu 
            }
            
            return true;
        }

        protected static WWWForm conPostData(WWWForm form)
        {
            return conPostData(form, true);
        }

        protected static WWWForm conPostData(WWWForm form, bool encrypt,bool needEncrypt=false)
        {
            if( form == null ){
                form = new WWWForm();
            }
            if(Datas.singleton.getKabamId() > 0)
            {
                //_Global.Log("send kabam_id: "+ Datas.instance().getKabamId());
                //_Global.Log("send kabam_id: "+ Datas.instance().getKabamId());
                form.AddField("kabam_id", Datas.singleton.getKabamId() + "");
                // form.AddField("naid",Datas.instance().getNaid());
                form.AddField("access_token", Datas.singleton.getAccessToken() + "");
            }
            
            form.AddField("naid", Datas.singleton.getNaid() + "");
            form.AddField("gcuid", Datas.singleton.GetGameCenterPlayerId_Binded() + "");
            form.AddField("gcunick", Datas.singleton.GetGameCenterAlias_Binded() + "");
            
            form.AddField("mobileid", mobileId);
            // _Global.Log("ming mobileid :" + mobileId);
            form.AddField("platformid", platformId);
            //_Global.Log("after adding, platformid = " + platformId);
            
            form.AddField("become_user_id", Datas.singleton.GetBecomeUserId() + "");
            form.AddField("become_password", Datas.singleton.GetBecomeUserPassword() + "");
            form.AddField("debug", BuildSetting.DEBUG_MODE);
            form.AddField("gver", BuildSetting.CLIENT_VERSION);
            form.AddField("gameSlot", "" + slotId++);
            form.AddField("theme", "" + Datas.singleton.getGameTheme());
            form.AddField("newlang", "" + Datas.singleton.getGameLanguageAb());
            form.AddField("ta_device_id", Datas.singleton.GetTADeviceId());//数数统计，提供给数数统计使用的 device id
            form.AddField("gameNumber", "" + gameNumber++);

            if (!encrypt) {
#if UNITY_EDITOR
                fromeDataBytes = form.data;
#endif
                return form;
            }
            
            return encryptForm( form,needEncrypt );
        }
        


        #region HTTP non-download requests
        public static void DoRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            shortRequest(url, form, okFunc, errorFunc);
        }

		public static void DoRequestRaw(string url, WWWForm form, EventOnReciveFromServer fnOnRecv, MulticastDelegate errorFunc)
		{
			shortRequestRaw(url, form, fnOnRecv, errorFunc);
		}

        protected static void shortRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            baseRequest(baseUrl + url, form, okFunc, errorFunc, false);
        }

		protected static void shortRequestRaw(string url, WWWForm form, EventOnReciveFromServer fnOnRecv, MulticastDelegate errorFunc)
		{
			baseRequest(baseUrl + url, form, fnOnRecv, null, errorFunc, false, false);
		}

        protected static void shortRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool forceNoConnectMenu)
        {
            baseRequest(baseUrl + url, form, okFunc, errorFunc, forceNoConnectMenu);
        }

       protected static void baseRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            baseRequest(url, form, okFunc, errorFunc,false, false);
        }
        
        protected static void baseRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool forceNoConnectMenu)
        {
            baseRequest(url, form, okFunc, errorFunc, false, forceNoConnectMenu);
        }
        
        protected static void baseRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool retry, bool forceNoConnectMenu)
        {
			baseRequest(url, form, null, okFunc, errorFunc, retry, forceNoConnectMenu);
		}

		protected static void baseRequest(string url, WWWForm form, EventOnReciveFromServer fnOnRecv, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool retry, bool forceNoConnectMenu)
		{
				monoBehaviour.StartCoroutine(realRequest(url, form, fnOnRecv, okFunc, errorFunc, retry, forceNoConnectMenu));
        }

        protected static void fte_realRequest(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            HashObject result = FTELocalServer.getInstance().doRequest(url, form) as HashObject;
            if(result != null && okFunc != null)
                okFuncWrapper(url, form, result, okFunc, errorFunc);
        }
        
        public static void okFuncWrapper(string url, WWWForm form, HashObject result, MulticastDelegate okFunc, MulticastDelegate errorFunc){
            bool ok = Convert.ToBoolean(result["ok"].Value);
            if (ok)
            {
                try
                {
                    okFunc.DynamicInvoke(new object[] {result});
                } 
                catch (System.Reflection.TargetParameterCountException)
                {
                    okFunc.DynamicInvoke(null);
                }
                catch (System.Reflection.TargetInvocationException e)
                {
                    _Global.LogWarning("Target: " + okFunc.Target + ", Method: " + okFunc.Method);
                    throw;
                }
                
            }
            else
            {    
                if (url.EndsWith("payments.php"))
                {
                    MenuMgr.instance.netBlock = false;
                }
                string errorMsg = "";
                if(result["msg"] != null)
                {
                    errorMsg = result["msg"].Value as string;
                }
                if( errorMsg == null )
                {
                    errorMsg = "";
                }
                string feedback = "";
                if( result["feedback"] != null )
                {
                    feedback = result["feedback"].Value + "";
                }
                //_Global.Log(" feedback:" + (result["feedback"] == null));
                string errorCode = (result["error_code"] == null? "UNKNOWN" : "" + result["error_code"].Value);
                
                int i = 0; 

                
				if (!url.EndsWith("kabamId.php") && Datas.singleton.getKabamId() > 0 && int.TryParse(errorCode, out i) && !url.EndsWith("migrateExcute.php") 
				    && !url.EndsWith("migrateConfirm.php"))
                {   
                    if( i >= 1600 && i <= 1617)
                    {
                        MenuMgr.instance.PushMenu("LoginMenu", null, "trans_zoomComp");
                        reportErrorToServer(url, form, errorCode, errorMsg, false);
                        return;
                    }
                }
                if(errorFunc != null)
                {
                    //MethodInfo mi = errorFunc.Method;
                    //Debug.LogWarning("mi: " + mi.Name + ", class: " + mi.RelfectedType);

                    //TODO: change errorMsg
                    InvokeErrorFunc(errorFunc, errorMsg, errorCode, feedback);
                }
                else
                {
                    if (errorCode == "1")
                    {
                        reloadDlg(url);
                    }
                    else
                    {
						if(errorCode != "2101")
						{
							normalErrorDlg(url, errorCode, errorMsg, feedback);
						}                      
                    }
                }
                reportErrorToServer(url, form, errorCode, errorMsg, false);

				if (int.TryParse(errorCode, out i)&&i==2101&&!KBN.PveController.instance().isVerifing)
                {
                    KBN.PveController.instance().ReqVerify(Constant.PVE_VERIFY_REQ_Type.GET_INFO);
                }

            }
        }

        public static void reportErrorToServer(string orgUrl, WWWForm orgForm, string errorCode, string errorMsg, bool isException){
            string url = "clientErrLogs.php";

			if( isException )
			{
				_Global.LogError( errorMsg );
			}

            if ((!isException && !reportNormalErrorToServer ) || exceptionOccurred || errorMsg == null || orgUrl.EndsWith(url))
            {
                //_Global.Log("reportErrorToServer error!");
                return;
            }
            if (FTEMgr.getInstance() != null && !FTEMgr.getInstance().isFinished)
            {
                if (orgUrl.EndsWith("updateSeed.php"))
                {
                    return;
                }
            }
            
            if (orgUrl.EndsWith( "getGameTip.php" )){ // not care getGameTip.php
                exceptionOccurred = false;
            }
			else if( !errorMsg.Contains("Stale touch detected!"))
            {
                exceptionOccurred = isException;
            }
            
            if (errorCode == null || errorCode == "")
            {
                errorCode = "UNKONWN";
            }

            if (string.IsNullOrEmpty(baseUrl))
            {
                Datas.singleton.saveErrorLog("errorCode:" + errorCode + " Msg:" + errorMsg);
                if (exceptionOccurred)
                {
                    reloadDlg(orgUrl);
                }
                return;
            }
            
            WWWForm form = new WWWForm();
            
            if (!string.IsNullOrEmpty(orgUrl))
            {
                form.AddField("url", orgUrl);
            }
            
            string orgFormString = "";
            if (orgForm != null)
            {
                orgFormString = System.Text.Encoding.UTF8.GetString(orgForm.data);
                form.AddField("form_param", orgFormString);
            }
            
            if (!string.IsNullOrEmpty(errorCode))
            {
                form.AddField("error_code", errorCode);
            }
            form.AddField("error_info", errorMsg);
            Action<HashObject> okFunc = delegate (HashObject result) {
                //_Global.Log("report error to server ok");
                Datas.singleton.delErroLog();
            };
            Action<string, string> errorFunc = delegate (string msg, string ec) {
                //_Global.Log("report error to server error:" + msg + " errorCode:" + ec);
                string saveMsg = "Report error to clientErrLogs.php error! msg:" + msg + " errorCode:" + ec;
                if(!orgUrl.Equals("CLIENT_SAVED_ERROR_LOG"))
                { 
                    saveMsg +="\nlast URL:" + orgUrl + 
                            "\nerrorCode:" + errorCode +
                            "\nformString:" + orgFormString +
                            "\nerrorMsg:" + errorMsg;
                }
                else
                {
                    saveMsg += "\n";
                }
                Datas.singleton.saveErrorLog(saveMsg);
            };
            shortRequest(url, form, okFunc, errorFunc);
            
            if (exceptionOccurred)
            {
                reloadDlg(orgUrl);
            }
        }

        public static void SendMATInstallNotify(string remoteURL, string mac0ParamName, string ifaParamName, string openUDIDParamName) {
            Datas dats = Datas.singleton;
            if (dats == null)
                return;
            Datas.DeviceInfo device = dats.getDeviceInfo();
            if (device == null)
                return;
            
            WWWForm form = new WWWForm();
            
            string debugString = remoteURL;
            Action<string, string> addField = delegate (string paramName, string datName) {
                if (paramName == null) {
                    return;
                }
                debugString = debugString + paramName + "=" + datName + "&";
                form.AddField(paramName, datName);
            };
            
            debugString = debugString + "?";
            addField(mac0ParamName, device.mac0);
            addField(ifaParamName, device.IFA);
            addField(openUDIDParamName, device.OpenUDID);
            debugString = debugString.Substring(0, debugString.Length - 1);
            UnityNet.baseRequest(remoteURL, form, null, null, false, true);
        }
        #region ReportErrorToServerHelper
        private class ReportErrorToServerHelper 
        {
            private string orgUrl;
            private string errorCode;
            private string orgFormString;
            private string errorMsg;

            public ReportErrorToServerHelper(string orgUrl, string errorCode, string orgFormString, string errorMsg)
            {
                this.orgUrl = orgUrl;
                this.errorCode = errorCode;
                this.orgFormString = orgFormString;
                this.errorMsg = errorMsg;
            }

            public void OkFunc(HashObject result)
            {
                //_Global.Log("report error to server ok");
                Datas.singleton.delErroLog();
            }

            public void ErrorFunc(string msg, string ec)
            {
                //_Global.Log("report error to server error:" + msg + " errorCode:" + ec);
                string saveMsg = "Report error to clientErrLogs.php error! msg:" + msg + " errorCode:" + ec;
                if(!orgUrl.Equals("CLIENT_SAVED_ERROR_LOG"))
                { 
                    saveMsg +="\nlast URL:" + orgUrl + 
                        "\nerrorCode:" + errorCode +
                            "\nformString:" + orgFormString +
                            "\nerrorMsg:" + errorMsg;
                }
                else
                {
                    saveMsg += "\n";
                }
                Datas.singleton.saveErrorLog(saveMsg);
            }
        }
        #endregion

        protected static  void retryDlg(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool forceNoConnectMenu){
			GameMain.isUpdateSeed=true;
            if (!needShowNetErrorDlg(url))
            {
                return;
            }
            string promptMsg = Datas.getArString("Error.Network_error");
            if (promptMsg != null)
            {
                Action callback = delegate() {
                    WWWForm newForm = retryForm(NeedDecryption(url), form);
                    baseRequest(url, newForm, okFunc, errorFunc, true, forceNoConnectMenu);
                };
                ErrorMgr.singleton.PushError("", promptMsg, true, Datas.getArString("FTE.Retry"), callback);               
            }
        }

		protected static IEnumerator realRequest(string url, WWWForm form, EventOnReciveFromServer fnOnRecive, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool retry, bool forceNoConnectMenu)
        {

            //_Global.Log("url:" + url);
            string realUrl = url;
            object[] urlKeys = _Global.GetObjectKeys(UrlTransfers);
            foreach (object key in urlKeys)
            {
                string keyStr = key.ToString();
                if(realUrl.EndsWith(keyStr))
                {
                    realUrl = realUrl.Replace(keyStr, UrlTransfers[keyStr].Value as string);
                    break;
                }
            }
 
            if (PopupMgr.instance != null && PopupMgr.instance.isLockScreen)
            {
                yield break;
            }   
            
            if (checkUsedFTE(url,form))
            {
                fte_realRequest(url, form, okFunc, errorFunc);
                yield break;
            }
            
            bool pushConnectMenu = needConnectMenu(url) && !forceNoConnectMenu;  
            if (pushConnectMenu){
                MenuMgr.instance.netBlock = true;
            }else{
                MenuMgr.instance.netBlock = false;
            }
            
            // IsEnterGame is a flag when NewFteMgr is init in GameMain
            if (NewFteMgr.IsEnterGame
                && !NewFteMgr.instance.IsAllFteCompleted
                && NewFteMgr.instance.CheckNeedFteLocalServer(url, form, okFunc, errorFunc))
            {
                if (pushConnectMenu)
                {
                    MenuMgr.instance.netBlock = false;
                }
                yield break;
            }
            
            WWWForm finalForm;
            if (retry)
            {
                finalForm = form;

#if UNITY_EDITOR
                fromeDataBytes = finalForm.data;
#endif
            }
            else
            {
                finalForm = conPostData(form, needEncrypt(url),NeedDecryption(url));
            }

#if UNITY_EDITOR
            string dataStr = fromeDataBytes != null ?  System.Text.Encoding.Default.GetString(fromeDataBytes): string.Empty;
            Debug.Log(string.Format("[{0}] <color=#097A2BFF>UnityNet realRequest> </color>\t<color=#5EFF8EFF>url: {1}</color>\n\n{2}\n\n", System.DateTime.Now.ToString("HH:mm:ss:fff"), url, dataStr));
            fromeDataBytes = null;
#endif

            WWW www = new WWW(realUrl, finalForm); 
            float duration = 0.0f;
            while (!www.isDone && duration < TIME_OUT_DURATION && www.error == null) 
            {
                duration += Time.deltaTime;
                yield return null;
            }

            HashObject result = null;
            try
            {
                if (GameMain.singleton == null && !url.EndsWith("getGameTip.php"))
                {
                    yield break;
                }
                if (pushConnectMenu)
                {
                    MenuMgr.instance.netBlock = false;
                }
               
                if (duration <= TIME_OUT_DURATION && www.isDone && www.error == null && !string.IsNullOrEmpty(www.text) && www.bytes != null)
                {
                     // ProfilerSample.BeginSample("realRequest");
                    string resultString;
                    //ProfilerSample.BeginSample("IsGZip");
                    //gzip
                    if (IsGZip(www))
                    {
                        //DateTime startTime = System.DateTime.Now;
                        byte[] unZipBytes = FileZip.UnZipStream(www.bytes);
                        //DateTime endTime = System.DateTime.Now;
                        //_Global.Log("$$$$$ UnZipStream : " + url + ": " + (endTime - startTime).TotalMilliseconds);
                        resultString = System.Text.Encoding.UTF8.GetString(unZipBytes);
                        unZipBytes = null;
                    }
                    else
                    {
                        resultString = www.text;
                    }
					if( BuildSetting.INTERNAL_VERSION != 0 ){
						int index = resultString.LastIndexOf ("~*~");
						if(index>=0){
							resultString=resultString.Substring (index+3,resultString.Length-index-3);
						}
					}
                    if (!isInLoadingScene && GameMain.singleton.encrypt && needRc4(url))
                    {           
                        byte[] iOutputChar = www.bytes;
                        resultString = rc4Code(Datas.singleton.GetDecodeKey(), iOutputChar);
                    }

                    //DateTime startJsonTime = System.DateTime.Now;
                    string DESData;
					if ( fnOnRecive != null )
					{
						result = fnOnRecive(resultString);
					}
					else
					{
                        if(NeedDecryption(url)){
                           // ProfilerSample.BeginSample("DEsDECode");
							DESData = DESDeCode_AES(resultString,url);
                            //ProfilerSample.EndSample();
                            //ProfilerSample.BeginSample("JSONParse");
                            result = JSONParse.defaultInst().Parse(DESData);
                           // ProfilerSample.EndSample();
                        }else{
                            result = JSONParse.defaultInst().Parse(resultString);       
                        }
						// result = JSONParse.instance.Parse(resultString);
					}
                   // DateTime endJsonTime = System.DateTime.Now;
                    //_Global.Log("$$$$$ JSONParse : " + url + ": " +(endJsonTime - startJsonTime).TotalMilliseconds);
                    
					if (result != null && PopupMgr.instance.checkPointOfSeed(url, result))
                    {
                        yield break;
                    }
                    //serverMerge
					if(url.EndsWith("signup.php"))
					{
						if(result["serverMergeMsg"] != null)
						{
							if(_Global.INT32(result["serverMergeMsg"]["serverMergeStep"]) == 0)
							{
								ErrorMgr.singleton.PushError("", Datas.getArString("MergeServer.Confirm_Wait"),false,Datas.getArString("FTE.Restart"),new Action(delegate()
                                {
                                    RestartGame();
                                }));
								yield break;
							}
						}
					}


                    // tzhou 0805..
                    if (url.EndsWith("payments.php"))   //send it to Object-C with JSON Format.
                    {
						string paymentString=NeedDecryption(url)?DESDeCode_AES(www.text,url):www.text;
                        if (Application.isEditor)
                        {
                            //for test
                            string prefix = Payment.URLPrefix();
                            GameMain.singleton.valideProducts(
                                "{\"Products\":[{\"itunes_productid\":\"" +
                                prefix + ".tier1dbshield\",\"price\":\"$13.35\"},{\"itunes_productid\":\"" +
                                prefix + ".tier2dbshield\",\"price\":\"$14.45\"},{\"itunes_productid\":\"" +
                                prefix + ".tier1\",\"price\":\"$0.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier2\",\"price\":\"$1.99\"},{\"itunes_productid\":\"" + 
                                prefix + ".tier3\",\"price\":\"$2.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier5\",\"price\":\"$4.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier10\",\"price\":\"$9.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier20\",\"price\":\"$19.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier30\",\"price\":\"$29.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier50\",\"price\":\"$49.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier60\",\"price\":\"$99.99\"},{\"itunes_productid\":\"" +
                                prefix + ".tier75\",\"price\":\"$249.99\"}]}"
                            );
                        }
                        else if (platformId == AMAZON_PLATFORM_ID)
                        {                          
                            AmazonPayment.instance.SetProductPackages(paymentString);
                        }
                        else
                        {
                            NativeCaller.SetProductPackages(paymentString);
                        }
                    }
                    HookResult(url, result);
                    if (okFunc != null)
                    {
                       // ProfilerSample.BeginSample("okFuncWrapper");
                        okFuncWrapper(url, form, result, okFunc, errorFunc);
                      //  ProfilerSample.EndSample();
                    }
                }
                else
                {  
                     //_Global.LogWarning("www.error:" + www.error);
                    if (url.EndsWith("payments.php"))
                    {
                        MenuMgr.instance.netBlock = false;
                    }
                    if (isInLoadingScene && url.EndsWith("getGameTip.php"))
                    {
                        yield break;
                    }

                    if (FTEMgr.isFTERuning())
                    {
                        if (url.EndsWith("getServerTime.php") || url.EndsWith("warmStartTracking.php"))
                        {
                            yield break;
                        }
                        if (FTEMgr.getInstance().isFinished && errorFunc != null && url.EndsWith("fte.php"))   //commit FTE.
                        {
                            errorFunc.DynamicInvoke(new object[] {www.error});                       
                        }
                        yield break;
                    }
                    
                    if (errorFunc != null)
                    {
                        InvokeErrorFunc(errorFunc, www.error, NET_ERROR);
                    }
                    else
                    {
                        retryDlg(url, finalForm, okFunc, errorFunc, forceNoConnectMenu);//show retry Dialog
                    }
                    
                    string error = "";
                    if (www.error != null)
                    {
                        error = www.error;
                    }
                    else if (duration >= TIME_OUT_DURATION)
                    {
                        error = "NET_TIMEOUT (Limit:" + TIME_OUT_DURATION + "s)";
                    }
                    reportErrorToServer(url, form, NET_ERROR, error, false);
                }
                
            } 
            catch (Exception e)
            {
                _Global.Log(e.ToString());
                string errorCode = CLIENT_EXCEPTION;
                if (result != null && result["error_code"] != null)
                {
                    errorCode = result["error_code"].Value + "";
                }
                
                if (url.EndsWith("getChat.php") || url.EndsWith("sendChat.php") || url.EndsWith("maintenanceChat.php") || url.EndsWith("avaChat.php"))
                {
                    reportErrorToServer( url, form, errorCode, e.ToString(), false);
                    if (errorFunc != null)
                    {
                        InvokeErrorFunc(errorFunc, e.ToString(), errorCode);
                    }
                }
                if (url.EndsWith("alliancewall.php") || url.EndsWith("eventcenter.php"))
                {
                    reportErrorToServer(url, form, errorCode, e.ToString(), false);
                    if (errorFunc != null)
                    {
                        InvokeErrorFunc(errorFunc, e.ToString(), errorCode);
                    }
                }
                else
                {           
                    reportErrorToServer(url, form, errorCode, e.ToString(), true);
                }
            }
            finally
            {
                www.Dispose();
            }
        }

        private static string[] needUrls={
            "signup.php",
            "getSeed.php"
        };

        //private static List<string> needUrlList=new List<string>(needUrls);

        //用DES解密的过滤
        private static bool NeedDecryption(string url){  
            return !url.EndsWith("maintenanceChat.php")
                    &&!url.EndsWith("ota.php")
                    &&!url.EndsWith("otaResourceList.php")
                    &&!url.EndsWith("otaZip.php")
                    &&!url.EndsWith("ajaxOutPutHeader.php")
                    &&!url.EndsWith("getGameTip.php")
                    &&!url.EndsWith("trackingInstall.php")
			           &&!url.EndsWith("payments.php");

            return (url.EndsWith("signup.php"))
                    ||(url.EndsWith("getSeed.php"))
                    ||(url.EndsWith("kabamId.php"))
                    ||(url.EndsWith("getBaseMapInfo.php"))
                    ||(url.EndsWith("upgrade.php"))
                    ||(url.EndsWith("preLoading.php"))
                    ||(url.EndsWith("payments.php"))
                    ||(url.EndsWith("gdsVersion.php"))
                    ||(url.EndsWith("getServerTime.php"))
                    ||(url.EndsWith("getCarmotInfo.php"))
                    ||(url.EndsWith("getResourceInfo.php"))
                    ||(url.EndsWith("updateSeed.php"))
                    ||(url.EndsWith("getChat.php"))
                    ||(url.EndsWith("getReport.php"))
                    ||(url.EndsWith("getKnightsStaus.php"))
                    ||(url.EndsWith("march.php"))
                    ||(url.EndsWith("eventcenter.php"))
                    ||(url.EndsWith("tracking.php"))
                    ||(url.EndsWith("speedupSleepingHero.php"))
                    ||(url.EndsWith("getCarmotLoot.php"))
                    ||(url.EndsWith("showSkill.php"))
                    ||(url.EndsWith("pushNotification.php"))
                    ||(url.EndsWith("speedupMarch.php"))
                    ||(url.EndsWith("magicalboxPick.php"))
                    ||(url.EndsWith("datameerTracking.php"))
                    ||(url.EndsWith("getEmail.php"))
                    ||(url.EndsWith("warmStartTracking.php"))
                    ||(url.EndsWith("allianceGetInfo.php"))
                    ||(url.EndsWith("sendChat.php"))
                    ||(url.EndsWith("showShop.php"))
                    ||(url.EndsWith("privatechat.php"))
                    ||(url.EndsWith("getMagicalBox.php"))
                    ||(url.EndsWith("itemChest.php"))
                    ||(url.EndsWith("listReports.php"))
                    ||(url.EndsWith("getMysteryChestList.php"))
                    ||(url.EndsWith("knightGears.php"))
                    ||(url.EndsWith("knightGearFte.php"))
                    ||(url.EndsWith("successLoginTracking.php"))
                    ||(url.EndsWith("allianceGetOtherInfo.php"))
                    ||(url.EndsWith("depositShadowGems.php"))
                    ||(url.EndsWith("getDesTileInfo.php"))
                    ||(url.EndsWith("claimDailyQuestRewards.php"))
                    ||(url.EndsWith("getTroopLimit.php"))
                    ||(url.EndsWith("claimDailyLoginReward.php"))
                    ||(url.EndsWith("getGCLeaderboard.php"))
                    ||(url.EndsWith("alliancewall.php"))
                    ||(url.EndsWith("knightGearMount.php"))
                    ||(url.EndsWith("survey.php"))
                    ||(url.EndsWith("sendMessage.php"))
                    ||(url.EndsWith("resourceCrate.php"))
                    ||(url.EndsWith("construct.php"))
                    ||(url.EndsWith("myServers.php"))
                    ||(url.EndsWith("worlds.php"))
                    ||(url.EndsWith("train.php"))
                    ||(url.EndsWith("allianceGetMembersInfo.php"))
                    ||(url.EndsWith("getUserInformation.php"))
                    ||(url.EndsWith("relocate.php"))
                    ||(url.EndsWith("getRoundTowerEvents.php"))
                    ||(url.EndsWith("treasureCrest.php"))
                    ||(url.EndsWith("getLeaderboard.php"))
                    ||(url.EndsWith("treasureChest.php"))
                    ||(url.EndsWith("boostCombat.php"))
                    ||(url.EndsWith("knightGearSave.php"))
                    ||(url.EndsWith("tileBookmark.php"))
                    ||(url.EndsWith("share.php"))
                    ||(url.EndsWith("claimEventReward.php"))
                    ||(url.EndsWith("inviteCode.php"))
                    ||(url.EndsWith("updateDailyQuests.php"))
                    ||(url.EndsWith("getPictCampResource.php"))
                    ||(url.EndsWith("assignknight.php"))
                    ||(url.EndsWith("gearStrengthen.php"))
                    ||(url.EndsWith("speedupConstruction.php"))
                    ||(url.EndsWith("speedupTraining.php"))
                    ||(url.EndsWith("getTargetTile.php"))
                    ||(url.EndsWith("undefend.php"))
                    ||(url.EndsWith("speedupUseGems.php"))
                    ||(url.EndsWith("trainBonus.php"))
                    ||(url.EndsWith("addTroopsBatchItem.php"))
                    ||(url.EndsWith("quest.php"))
                    ||(url.EndsWith("speedupCure.php"))
                    ||(url.EndsWith("gearTierResetSkill.php"))
                    ||(url.EndsWith("unassignKnight.php"))
                    ||(url.EndsWith("getAlliancePoint.php"))
                    ||(url.EndsWith("boostProduction.php"))
                    ||(url.EndsWith("knightGearUnlockSkill.php"))
                    ||(url.EndsWith("scouting.php"))
                    ||(url.EndsWith("allianceRequest.php"))
                    ||(url.EndsWith("experienceKnightLevel.php"))
                    ||(url.EndsWith("buyItemBatch.php"))
                    ||(url.EndsWith("fortify.php"))
                    ||(url.EndsWith("hospitalCure.php"))
                    ||(url.EndsWith("research.php"))
                    ||(url.EndsWith("allianceInvites.php"))
                    ||(url.EndsWith("fertilizePeople.php"))
                    ||(url.EndsWith("speedupScout.php"))
                    ||(url.EndsWith("getCityWilds.php"))
                    ||(url.EndsWith("technology.php"))
                    ||(url.EndsWith("getUserGeneralInfo.php"))
                    ||(url.EndsWith("hospitalDismiss.php"))
                    ||(url.EndsWith("deployCityDefense.php"))
                    ||(url.EndsWith("addTroops.php"))
                    ||(url.EndsWith("fetchMarch.php"))
                    ||(url.EndsWith("dismissUnits.php"))
                    ||(url.EndsWith("speedupDefense.php"))
                    ||(url.EndsWith("clientErrLogs.php"))
                    ||(url.EndsWith("allianceLeave.php"))
                    ||(url.EndsWith("experienceKnight.php"))
                    ||(url.EndsWith("fte.php"))
                    ||(url.EndsWith("destroyBuilding.php"))
                    ||(url.EndsWith("useItem.php"))
                    ||(url.EndsWith("boostMarchSize.php"))
                    ||(url.EndsWith("cancelTraining.php"))
                    ||(url.EndsWith("knightGearLock.php"))
                    ||(url.EndsWith("doveOut.php"))
                    ||(url.EndsWith("viewTile.php"))
                    ||(url.EndsWith("speedupResearch.php"))
                    ||(url.EndsWith("abandonWilderness.php"))
                    ||(url.EndsWith("changeTax.php"))
                    ||(url.EndsWith("changeCityName.php"))
                    ||(url.EndsWith("allianceCreate.php"))
                    ||(url.EndsWith("changename.php"))
                    ||(url.EndsWith("changeKnightRemark.php"))
                    ||(url.EndsWith("allianceHelp.php"))
                    ||(url.EndsWith("avaChat.php"))
                    ||(url.EndsWith("speedupFortifying.php"))
                    ||(url.EndsWith("ignore.php"))
                    ||(url.EndsWith("help.php"))
                   ;
        }

        private static bool NeedDecryptionProtobuff(string url){  
            
            return !url.EndsWith("maintenanceChat.php")
                    &&!url.EndsWith("ota.php")
                    &&!url.EndsWith("otaResourceList.php")
                    &&!url.EndsWith("otaZip.php")
                    &&!url.EndsWith("ajaxOutPutHeader.php")
                    &&!url.EndsWith("getGameTip.php")
                    &&!url.EndsWith("trackingInstall.php")
                      &&!url.EndsWith("payments.php");

            return url.EndsWith("pve.php")
                    || url.EndsWith("getWorldBossList.php")
                    || url.EndsWith("ava.php")
                    || url.EndsWith("gds.php")
                    || url.EndsWith("worldmap.php")
                    || url.EndsWith("heroExploreProcess.php")
                    || url.EndsWith("heroExploreInit.php")
                    || url.EndsWith("heroHouseList.php")
                    || url.EndsWith("allianceDonate.php")
                    || url.EndsWith("assignHero.php")
                    || url.EndsWith("unassignHero.php")
                    || url.EndsWith("allianceShopBuy.php")
                    || url.EndsWith("allianceLeaderboardDonate.php")
                    || url.EndsWith("leaderboardlist.php")
                    || url.EndsWith("boostHero.php")
                    || url.EndsWith("gate_proto.php")
                    || url.EndsWith("heroLeaderboard.php")
                    || url.EndsWith("allianceSkillInfo.php")
                    || url.EndsWith("addHero.php")
                    || url.EndsWith("sellItem.php")
                    || url.EndsWith("heroSkillLevelUp.php")
                    || url.EndsWith("allianceLeaderboardAvaScore.php")
                    || url.EndsWith("ExpeditionMap.php")
                    || url.EndsWith("ExpeditionBattle.php")
                    || (url.EndsWith("ExpeditionRankReward.php"))
                     ;
        }

        public static void RegisterResultHook(OnHookResult hook)
        {
            onHookResult += hook;
        }

        public static void UnregisterResultHook(OnHookResult hook)
        {
            onHookResult -= hook;
        }

        protected static void HookResult(string url, HashObject result)
        {
            if (result == null)
            {
                return;
            }

            bool ok = _Global.GetBoolean(result["ok"]);
            
            if (!ok)
            {
                return;
            }

            if (onHookResult == null)
            {
                return;
            }

            onHookResult(url, result);
        }

        protected static void InvokeErrorFunc(MulticastDelegate errorFunc, string errorMsg, string errorCode)
        {
            InvokeErrorFunc(errorFunc, errorMsg, errorCode, "");
        }

        protected static void InvokeErrorFunc(MulticastDelegate errorFunc, string errorMsg, string errorCode, string feedback)
        {
            if (errorFunc == null)
            {
                return;
            }

            MethodInfo mi = errorFunc.Method;
            if (mi == null)
            {
                return;
            }

            int paramCount = mi.GetParameters().Length;

            object[] paramList = null;
            switch (paramCount)
            {
            case 1:
                paramList = new object[] { errorMsg };
                break;
            case 2:
                paramList = new object[] { errorMsg, errorCode };
                break;
            case 3:
                paramList = new object[] { errorMsg, errorCode, feedback };
                break;
            }

            errorFunc.DynamicInvoke(paramList);
        }
        #endregion

        #region HTTP download requests
        protected static void shortDownload(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            baseDownload(baseUrl + url, form, okFunc, errorFunc );
        }
        
        protected static void baseDownload(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            monoBehaviour.StartCoroutine(download(url, form, okFunc, errorFunc));
        }

        protected static IEnumerator download(string url, WWWForm form, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            //_Global.Log("[UnityNet download] url:" + url);
            
            if(PopupMgr.instance != null && PopupMgr.instance.isLockScreen)
            {
                yield break;
            }
            
            WWW www = new WWW(url, conPostData(form, needEncrypt(url),true));
            yield return www;
            
            if(GameMain.singleton == null)
            {
                yield break;
            }
            
            try
            {
                if (www.error == null)
                {
                    //_Global.Log("url:" + url + "\n www.text:" + www.text);
                    if (okFunc != null)
                    {
                        byte[] unZipBytes;
                        string unZipText;
                        if(IsGZip(www))
                        {
                            unZipBytes = FileZip.UnZipStream(www.bytes);
                            unZipText = System.Text.Encoding.UTF8.GetString(unZipBytes);
                        }
                        else
                        {
                            unZipBytes = www.bytes;
                            unZipText = www.text;
                        }
                        try
                        {
                            okFunc.DynamicInvoke(new object[] {unZipBytes, unZipText});
                        }
                        catch (TargetParameterCountException)
                        {
                            try
                            {
                                okFunc.DynamicInvoke(new object[] {unZipBytes});
                            }
                            catch (TargetParameterCountException)
                            {
                                okFunc.DynamicInvoke(null);
                            }
                        }
                    }
                }
                else
                {
                    if (errorFunc != null)
                    {
                        //TODO: change errorMsg
                        InvokeErrorFunc(errorFunc, www.error, "0");
                    }
                    reportErrorToServer(url, form, null, www.error, false);
                }
            }
            catch (Exception e)
            {
                _Global.Log(e.ToString());
                reportErrorToServer( url, form, "CLIENT_EXCEPTION", e.ToString(), true);
            }
            finally
            {
                www.Dispose();
            }
        }
        #endregion

		#region Others
		public	static	void reqWWW(string url, Hashtable reqVAR, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			var form = new WWWForm();
			foreach (System.Collections.DictionaryEntry i in reqVAR)
			{
				if(i.Key == null) continue;
				if(i.Value == null) continue;
				form.AddField(i.Key.ToString(),i.Value.ToString());
			}

			shortRequest(url, form, okFunc, errorFunc);
		}

		public static void SendBI(int type, int step, int slice)
		{
			Hashtable dat = new Hashtable();
			dat.Add("type", type);
			dat.Add("step", step);
			dat.Add("slice", slice);
			reqWWW("tracking.php",dat,null,null); 

		}

		public	static void	checkAssetBundles(PFN_OkFunction okFunc, PFN_ErrorFunction errorFunc)
		{ 
			var url = selectedServerURL + "upgrade.php";

			var form = new WWWForm();
			form.AddField("type", "ota");
			baseRequest(url,form,okFunc,errorFunc);
		}
		
		#endregion

		#region MapView
		//start mapView
		public static void fetchMapTiles(string[] args, PFN_OkFunction okFunc, PFN_ErrorFunction errorFunc){
			string url = "fetchMapTiles.php";
			
			WWWForm form = new WWWForm();				
			
			form.AddField("blocks",args[0]);
			form.AddField("changed",args[1]);
			
			shortRequest(url, form, okFunc, errorFunc);
		}

		//20170215:get carmot number 
		public static void getCarmotInfo(string reqVAR, PFN_OkFunction okFunc, PFN_ErrorFunction errorFunc)
		{
			
			string url = "getCarmotInfo.php";
			WWWForm form = new WWWForm();
			form.AddField("tileList", reqVAR.ToString());
			shortRequest(url, form, okFunc, errorFunc);	
			
		}

        public static void getResourceInfo(string reqVAR, int type, PFN_OkFunction okFunc, PFN_ErrorFunction errorFunc)
        {
            string url = "getResourceInfo.php";
			WWWForm form = new WWWForm();
			form.AddField("tileList", reqVAR.ToString());
            form.AddField("type", type);
			shortRequest(url, form, okFunc, errorFunc);	
        }
		//end mapView
		#endregion

		#region Alliance Function
		public static void reqJoinAlliance(string message, int aId, string subject, System.Action<bool> onOk)
		{
			System.Action<HashObject> okFunc = delegate(HashObject result)
			{
				if ( onOk == null )
					return;
				if ( result["selfalliance"] != null && _Global.INT32(result["selfalliance"]) > 0 )
				{
					onOk(true);
				}
				else
				{
					onOk(false);
				}
			};

			Hashtable dat = new Hashtable();
			dat.Add("message", message);
			dat.Add("requestToAllianceId", aId);
			dat.Add("subject", subject);
			reqWWW("allianceJoinRequest.php",dat,okFunc,null); 
		}
		
		public static void UpdateAllianceJoinLimit(int minMight, int minLevel, int recurtemode, PFN_OkFunction okFunc)
		{
			var url = "allianceSetJoinLimit.php";
			var form  = new WWWForm();
			form.AddField("mightLimit", minMight);
			form.AddField("levelLimit", minLevel);
			form.AddField("recurtemode", recurtemode);
			shortRequest(url, form, okFunc, null);
		}

        
        public static void reqSendWallText(string[] data, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "alliancewall.php";
            var form = new WWWForm();
            form.AddField("type", data[0]);
            form.AddField("message", data[1]);
            shortRequest(url, form, okFunc, errorFunc); 
        }

        public static void reqGetAllianceWallText(string[] data, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "alliancewall.php";
            var form = new WWWForm();
            form.AddField("type", data[0]);    
            shortRequest(url, form, okFunc, errorFunc);     
        }
        
        public static void reqDelAllianceWallText(string[] data, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "alliancewall.php";
            var form = new WWWForm();
            form.AddField("type", data[0]);
            form.AddField("messageId", data[1]);   
            shortRequest(url, form, okFunc, errorFunc);     
        }
        
        public static void reqEditAllianceWallText(string[] data, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "alliancewall.php";
            var form = new WWWForm();
            form.AddField("type", data[0]);
            form.AddField("messageId", data[1]);
            form.AddField("message", data[2]); 
            shortRequest(url, form, okFunc, errorFunc);     
        }

        public static void reqEditAllianceNotice(string[] data, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "alliancewall.php";
            
            var form = new WWWForm();
            form.AddField("type", data[0]);
            form.AddField("message", data[1]);
            form.AddField("messageId", data[2]);
            shortRequest(url, form, okFunc, errorFunc);     
        }

        public static void getKnightDes(int knightId, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "getKnightDes.php";
            
            var form = new WWWForm();
            form.AddField("gid", knightId);
        
            shortRequest(url, form, okFunc, errorFunc);     
        }

		public static void reqClaimAlliancePoint( int point, MulticastDelegate okFunc, MulticastDelegate errorFunc )
		{
			var url = "getAlliancePoint.php";
			var form = new WWWForm();
			form.AddField("point", point);

			shortRequest( url, form, okFunc, errorFunc );
		}
		#endregion
		#region WorkFunction
		public	static	void	ReqGemsInstantSpeedUp(int cityId, int typeId, int gems, string itemList, int queueId, PFN_OkFunction okFunc)
		{
			var	url = "speedupUseGems.php";
			
			WWWForm form = new WWWForm();
			
			form.AddField("cid",cityId);
			form.AddField("act", typeId);
			form.AddField("gems", gems);
			form.AddField("ilist", itemList);
			form.AddField("qid", queueId);
			shortRequest(url, form, okFunc, null);
		}
		public	static	void reqHealApplySpeedUp(int cityId, int queueId, int itemId, PFN_OkFunction okFunc)
		{
			string	url = "speedupCure.php";

			WWWForm form = new WWWForm();				

			form.AddField("qid", queueId.ToString());
			form.AddField("cid",cityId.ToString());
			form.AddField("iid", itemId.ToString());

			shortRequest(url, form, okFunc, null);
		}

        public static void ReqSelectiveDefenseSpeedUp(int cityId, int queueId, int itemId, PFN_OkFunction okFunc)
        {
            string url = "speedupDefense.php";
            WWWForm form = new WWWForm();
            form.AddField("qid", queueId.ToString());
            form.AddField("cid", cityId.ToString());
            form.AddField("iid", itemId.ToString());

            shortRequest(url, form, okFunc, null);
        }

		public static void reqDoHeal(int cityId, int gems, bool isDirect, string itemList, System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<int, int>> wounded, PFN_OkFunction okFunc)
		{
			string url = "hospitalCure.php";
			WWWForm form = new WWWForm();
			if ( gems > 0 )
			{
				form.AddField("isInstance", 1);
				form.AddField("gems", gems);
				form.AddField("ilist", itemList);
			}

			if ( isDirect )
			{
				form.AddField("direct", 1);
			}

			form.AddField("cid", cityId);
			foreach(var person in wounded)
			{
				form.AddField("u" + person.Key.ToString(), person.Value);
			}

			shortRequest(url, form, okFunc, null);
		}
		public static void reqDoDismiss(int cityId, int gems, bool isDirect, string itemList, System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<int, int>> wounded, PFN_OkFunction okFunc)
		{
			string url = "hospitalDismiss.php";
			WWWForm form = new WWWForm();
			if ( gems > 0 )
			{
				form.AddField("isInstance", 1);
				form.AddField("gems", gems);
				form.AddField("ilist", itemList);
			}
			
			if ( isDirect )
			{
				form.AddField("direct", 1);
			}
			
			form.AddField("cid", cityId);
			form.AddField("isDismiss", "isDismiss");
			foreach(var person in wounded)
			{
				form.AddField("u" + person.Key.ToString(), person.Value);
			}
			
			shortRequest(url, form, okFunc, null);
		}
		public static void UnlockKnights(int knightID, MulticastDelegate okFunc, MulticastDelegate errFunc)
		{
			string url = "unlockKnights.php";
			WWWForm form = new WWWForm();
			form.AddField("knightId", knightID);
			shortRequest(url, form, okFunc, errFunc);
		}

		public static void reqRecipeStudy(object[] pars, System.MulticastDelegate okFunc)
		{
			string url = "recipeStudy.php";
			WWWForm form = new WWWForm();
			form.AddField("cityId", ""+pars[0]);
			form.AddField("recipeId", ""+pars[1]);
			shortRequest(url, form, okFunc, null);	
		}
		
		public static void reqRecipeCraft(object[] pars, System.MulticastDelegate okFunc)
		{
			string url = "recipeCraft.php";
			WWWForm form = new WWWForm();
			form.AddField("cityId", ""+pars[0]);
			form.AddField("recipeId", ""+pars[1]);
			shortRequest(url, form, okFunc, null);	
		}

		#endregion

        #region Event center
        public static void reqGetEventList(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            string url = "eventcenter.php";
            WWWForm form = new WWWForm();
            form.AddField("type", webData[0]);
            form.AddField("lang", webData[1]);
            shortRequest(url, form, okFunc, errorFunc); 
        }

        public static void reqGetEventDetailInfo(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            string url = "eventcenter.php";
            WWWForm form = new WWWForm();
            form.AddField("type", webData[0]);
            form.AddField("lang", webData[1]);
            form.AddField("eventId", webData[2]);
            shortRequest(url, form, okFunc, errorFunc); 
        }
        //获取世界boss详情信息
        public static void reqGetBossEventDetailInfo(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            string url = "getWorldBossInfo.php";
            WWWForm form = new WWWForm();
            form.AddField("action", webData[0]);
            form.AddField("eventId", webData[1]);
            shortRequest(url, form, okFunc, errorFunc); 
        }
        //获取世界boss排行信息
        public static void reqGetBossEventPageOfRanking(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            string url = "getWorldBossInfo.php";
            WWWForm form = new WWWForm();
            form.AddField("action", webData[0]);
            form.AddField("eventId", webData[1]);
            form.AddField("page", webData[2]);
            shortRequest(url, form, okFunc, errorFunc); 
        }
        
        public static void reqGetEventPageOfRanking(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            string url = "eventcenter.php";
            WWWForm form = new WWWForm();
            form.AddField("type", webData[0]);
            form.AddField("eventId", webData[1]);
            form.AddField("page", webData[2]);
            shortRequest(url, form, okFunc, errorFunc); 
        }
        
        public static void reqGetEventPrize(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            string url = "eventcenter.php";
            WWWForm form = new WWWForm();
            form.AddField("type", webData[0]);
            form.AddField("eventId", webData[1]);
            shortRequest(url, form, okFunc, errorFunc); 
        }

		public static void reqGetSeasonEventInfo(string[] webData, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			string url = "getSeasonInfo.php";
			WWWForm form = new WWWForm();
			form.AddField("type", webData[0]);
			form.AddField("seasonId", webData[1]);
			if (webData.Length >= 3) {
				form.AddField("page", webData[2]);
			}
			shortRequest(url, form, okFunc, errorFunc);
		}
        #endregion

		#region Gear Gacha
		public static void reqGearGachaReset(int gearId, int itemId, int itemCount, bool[] skillLock, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			string url = "gearTierResetSkill.php";
			WWWForm form = new WWWForm();
			form.AddField("gearId", gearId);
			form.AddField("resetitem", itemId);
			form.AddField("resetitemcount", itemCount);
			if (null != skillLock) {
				for (int i = 0; i < skillLock.Length; i++) {
					if (skillLock[i])
						form.AddField("lockitem" + i, 1);
				}
			}

			shortRequest(url, form, okFunc, errorFunc);
		}

		public static void reqGearGachaConfirmReset(int gearId, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			string url = "gearTierConfirmSkill.php";
			WWWForm form = new WWWForm();
			form.AddField("gearId", gearId);
			
			shortRequest(url, form, okFunc, errorFunc);
		}

		public static void GearTierLevelUp(int gearId,string item1,string num1,string item2,string num2,System.Action<HashObject> okFunc, System.Action<string,string> errorFunc)
		{
			//gearTierLevelUp.php

			string url = "gearTierLevelUp.php";
			WWWForm form = new WWWForm();
			form.AddField("gearId", gearId);

			form.AddField("requireitem1", item1);
			form.AddField("requirecount1", num1);
			form.AddField("requireitem2", item2);
			form.AddField("requirecount2", num2);

			shortRequest(url, form, okFunc, errorFunc);

		}

		#endregion

		#region March
		public static void reqDestTileInfo(int x, int y, Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "getDesTileInfo.php";
			WWWForm form = new WWWForm();

			form.AddField("xcoord", x);
			form.AddField("ycoord", y);

			shortRequest(url, form, okFunc, errorFunc);
		}

		//In JS : public static function reqExecuteMarch(reqVAR:Object, okFunc:Function, errorFunc:Function);

		#endregion

		#region Alliance Emblem
		
		public static void reqAllianceEmblemEditorInfo(Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "allianceEmblems.php";
			WWWForm form = new WWWForm();
			
			form.AddField("type", "info");
			
			shortRequest(url, form, okFunc, errorFunc);
		}

		public static void reqSaveAllianceEmblem(string banner, int style, string styleColor, int symbol, string symbolColor, Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "allianceEmblems.php";
			WWWForm form = new WWWForm();

			form.AddField("type", "save");
			form.AddField("banner", banner);
			form.AddField("style", style);
			form.AddField("styleColor", styleColor);
			form.AddField("symbol", symbol);
			form.AddField("symbolColor", symbolColor);

			shortRequest(url, form, okFunc, errorFunc);
		}

		public static void reqUnlockAllianceEmblem(int itemId, Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "unlockEmblem.php";
			WWWForm form = new WWWForm();

			form.AddField("iid", itemId);

			shortRequest(url, form, okFunc, errorFunc);
		}
		#endregion

		#region GameCenter
		public  static void SyncAchievmentStatus(string achievementId,string status)
		{
			string url = "gameCenterArchive.php";
			WWWForm form = new WWWForm();
			form.AddField("achievementId",achievementId);	
			form.AddField("achievementStatus",status);	
			shortRequest(url, form, null, null);
		}
		
		public static void CheckGameCenerIdStatus(string playerId, MulticastDelegate okFunc)
		{
			string url = "gameCenterCheck.php";
			WWWForm form = new WWWForm();
			Datas.DeviceInfo deviceInfo = Datas.singleton.getDeviceInfo();
			form.AddField("m_iso", deviceInfo.osName);
			form.AddField("m_osVer",deviceInfo.osVersion);
			form.AddField("gcUidAuth",playerId);	
			shortRequest(url, form, okFunc, null);
		}
		#endregion

		#region Buff Item

		public static void BoostMarchSize(int itemId, Action<HashObject> okFunc)
		{
			string url = "boostMarchSize.php";
			WWWForm form = new WWWForm();
			form.AddField("iid", itemId);
			shortRequest(url, form, okFunc, null);
		}

		public static void UseHealBuffItem(int itemId, Action<HashObject> okFunc)
		{
			string url = "boostTroopHeal.php";
			WWWForm form = new WWWForm();
			form.AddField("iid", itemId);
			shortRequest(url, form, okFunc, null);
		}

		public static void UseRationBuffItem(WWWForm form, Action<HashObject> okFunc)
		{
			string url = "useItem.php";
			shortRequest(url, form, okFunc, null);
		}

		public static void UseLuckBuffItem(WWWForm form, Action<HashObject> okFunc)
		{
			string url = "useItem.php";
			shortRequest(url, form, okFunc, null);
		}

		#endregion


		public static void reqClaimEvent(int eventId, int count, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			string	url = "claimEventReward.php";
			
			WWWForm form = new WWWForm();				
			form.AddField("eventId", eventId);
			form.AddField("claimCount", count);
			
			/*
		var data:HashObject = new HashObject({"ok":true});
		if(okFunc != null)
		{
			okFunc(data);
		}*/
			
			shortRequest(url, form, okFunc, errorFunc);			
		}

		public static void reqClaimEvent(int eventId, int crestId, int count, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			string url = "claimEventReward.php";
			
			WWWForm form = new WWWForm();				
			form.AddField("eventId", eventId);
			form.AddField("crestId", crestId);
			form.AddField("claimCount", count);
			
			shortRequest(url, form, okFunc, errorFunc);
		}

        public static void getAvaReportData(int userId, int reportId, int serverId, int eventId, Action<HashObject>  okFunc, Action<HashObject>  errorFunc)
	    {
            string url = "getShareReport.php";
            WWWForm form = new WWWForm();
            form.AddField("sharePlayerId",userId);
            form.AddField("reportId",reportId);
            form.AddField("ava",1);
            form.AddField("shareServerId",serverId);
            form.AddField("eventId",eventId);
            
            shortRequest(url, form, okFunc, errorFunc);
	    }

		#region Google Protocol Buffer
		//User IResponseHandler in Logic
//		public static void SendRequest(string url, global::ProtoBuf.IExtensible packet, IResponseHandler handler,bool forceNoConnectMenu = false)
//		{
//			RequestForGPB(url, packet, handler.OKHandler, handler.ErrorHandler,forceNoConnectMenu);
//		}

		//User IResponseHandler in Logic
		public static void SendRequest(string url, global::ProtoBuf.IExtensible packet, IResponseHandler handler)
		{
			RequestForGPB(url, packet, handler.OKHandler, handler.ErrorHandler);
		}

		public static void SendRequestWithOutErrorFunc(string url, global::ProtoBuf.IExtensible packet, IResponseHandler handler,bool forceNoConnectMenu = false)
		{
			RequestForGPB(url, packet, handler.OKHandler, null,forceNoConnectMenu);
		}
		
		//Use OKFunc in Logic
		public static void RequestForGPB(string url, global::ProtoBuf.IExtensible packet, OKHandler okFunc)
		{
			RequestForGPB(url, packet, okFunc, null);
		}
		public static void RequestForGPB(string url, global::ProtoBuf.IExtensible packet, OKHandler okFunc, ErrorHandler errorFunc)
		{
			RequestForGPB(url, packet, okFunc, errorFunc, false);
		}
		public static void RequestForGPB(string url, global::ProtoBuf.IExtensible packet, OKHandler okFunc, ErrorHandler errorFunc, bool forceNoConnectMenu)
		{
			BaseRequestForGPB(baseUrl + url, packet, okFunc, errorFunc, false, forceNoConnectMenu);
		}

		public static void RequestForGPB(string url, global::ProtoBuf.IExtensible packet, MulticastDelegate okFunc)
		{
			RequestForGPB(url, packet, okFunc, null);
		}
		public static void RequestForGPB(string url, global::ProtoBuf.IExtensible packet, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			RequestForGPB(url, packet, okFunc, errorFunc, false);
		}
		public static void RequestForGPB(string url, global::ProtoBuf.IExtensible packet, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool forceNoConnectMenu)
		{
			BaseRequestForGPB(baseUrl + url, packet, okFunc, errorFunc, false, forceNoConnectMenu);
		}

		protected static void BaseRequestForGPB(string url, global::ProtoBuf.IExtensible packet, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool retry, bool forceNoConnectMenu)
		{
			monoBehaviour.StartCoroutine(RealRequestForGPB(url, packet, okFunc, errorFunc, retry, forceNoConnectMenu));
		}
		
		protected static IEnumerator RealRequestForGPB(string url, global::ProtoBuf.IExtensible packet, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool retry, bool forceNoConnectMenu)
		{  
			bool pushConnectMenu = needConnectMenu(url) && !forceNoConnectMenu;  
			if(pushConnectMenu)
			{
				MenuMgr.instance.netBlock = true;
			}

			UnityEngine.WWWForm form = new UnityEngine.WWWForm();
			string dataStr = _Global.SerializePBMsg2Base64Str(packet);
            if(NeedDecryptionProtobuff(url)){
                form.AddField("data", DESEnCode_AES(dataStr));
            }else
            {
                form.AddField("data", dataStr);
            }
			
			string headerStr = AddMsgHeader(form,NeedDecryptionProtobuff(url));

			System.Text.StringBuilder sbForEncode = new System.Text.StringBuilder(dataStr.Length + headerStr.Length + 256);
			sbForEncode.AppendFormat("{0}{1}{2}^r4@(v=vs.11?0)s*02tK69A", dataStr, headerStr, mobileId.ToString());
			string keyForEncode = getMD5Hash(sbForEncode.ToString());
			form.AddField("gameTime", keyForEncode);
            form.AddField("vcs", BuildSetting.CLIENT_VERSION);

#if UNITY_EDITOR
            UnityEngine.WWWForm formTemp = new UnityEngine.WWWForm();
            formTemp.AddField("data", dataStr);
            formTemp.AddField("header", headerStr);
            formTemp.AddField("gameTime", keyForEncode);
            formTemp.AddField("vcs", BuildSetting.CLIENT_VERSION);

            string paraStr = formTemp.data != null ? System.Text.Encoding.Default.GetString(formTemp.data) : string.Empty;
            Debug.Log(string.Format("[{0}] <color=#097A2BFF>UnityNet RealRequestForGPB> </color>\t<color=#5EFF8EFF>url: {1}</color>\n\n{2}\n\n", System.DateTime.Now.ToString("HH:mm:ss:fff"), url, paraStr));
#endif


			WWW www = new WWW(url, form); 
			float duration = 0.0f;
			while (!www.isDone && duration < TIME_OUT_DURATION && www.error == null) 
			{
				duration += Time.deltaTime;
				yield return null;
			}
			if(pushConnectMenu)
			{
				MenuMgr.instance.netBlock = false;
			}
			byte[] result;
            string resultString;
			try
			{
				if (duration <= TIME_OUT_DURATION && www.isDone && www.error == null && !string.IsNullOrEmpty(www.text) && www.bytes != null)
				{
					result = www.bytes;            
					if (IsGZip(www))
					{
						result = FileZip.UnZipStream(result);
					}
                    if (NeedDecryptionProtobuff(url))
                    {
                        resultString=System.Text.Encoding.UTF8.GetString (result);
						string encodeString=DESDeCode_AES(resultString,url);
                        result=DESDeCodeBytes_AES(resultString);
                    }
					if (okFunc != null)
					{
						GPBOkFuncWrapper(url, form, result, okFunc, errorFunc);
					}
				}
				else
				{  	
					if (errorFunc != null)
					{
						InvokeErrorFunc(errorFunc, www.error, NET_ERROR);
					}
					else
					{
						retryDlgForGPB(url, packet, okFunc, errorFunc, forceNoConnectMenu);
					}
					
					string error = "";
					if (www.error != null)
					{
						error = www.error;
					}
					else if (duration >= TIME_OUT_DURATION)
					{
						error = "NET_TIMEOUT (Limit:" + TIME_OUT_DURATION + "s)";
					}
					reportErrorToServer(url, form, NET_ERROR, error, false);
				}
			} 
			catch (Exception e)
			{
				string errorCode = CLIENT_EXCEPTION;
				reportErrorToServer(url, form, errorCode, e.ToString(), true);
			}
			finally
			{
				www.Dispose();
			}
		}
		
		public static void GPBOkFuncWrapper(string url, WWWForm form, byte[] result, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
			MemoryStream ms = new MemoryStream(result);

            PBMsgResponse.PBMsgResponse resp = null;
            try
            {
			    resp = Serializer.Deserialize<PBMsgResponse.PBMsgResponse>(ms);
            }
            catch (ProtoBuf.ProtoException e)
            {
                string path = new System.Uri(url).AbsolutePath;
                string formDataStr = ((form == null || form.data == null) ? "<null>" : Encoding.Default.GetString(form.data));
                string resultStr = (result == null ? "<null>" : System.Convert.ToBase64String(result));
                string exceptionMessage;
                exceptionMessage = string.Format("Protobuf cannot deserialize path={0}, data=[{1}], result=[{2}]\n", path, formDataStr, resultStr);
                throw new ApplicationException(exceptionMessage, e);
            }
			
			if (resp.ok)
			{
				try
				{
					okFunc.DynamicInvoke(new object[] {resp.data});
				} 
				catch (System.Reflection.TargetParameterCountException)
				{
					okFunc.DynamicInvoke(null);
				}
				
			}
			else
			{    
				string feedback = "";
				string errorMsg = "";
				if(resp.msg != null)
				{
					errorMsg = resp.msg;
				}
				if( errorMsg == null )
				{
					errorMsg = "";
				}
				string errorCode = resp.error_code + "";
				
				int i = 0; 
				if (!url.EndsWith("kabamId.php") && Datas.singleton.getKabamId() > 0 && int.TryParse(errorCode, out i))
				{   
					if( i >= 1600 && i <= 1617)
					{
						MenuMgr.instance.PushMenu("LoginMenu", null, "trans_zoomComp");
						reportErrorToServer(url, form, errorCode, errorMsg, false);
						return;
					}
				}
				if(errorFunc != null)
				{
					//MethodInfo mi = errorFunc.Method;
					//Debug.LogWarning("mi: " + mi.Name + ", class: " + mi.RelfectedType);
					
					//TODO: change errorMsg
					InvokeErrorFunc(errorFunc, errorMsg, errorCode);
				}
				else
				{
					if (errorCode == "1")
					{
						reloadDlg(url);
					}
					else
					{
						if(errorCode != "2101")
						{
							normalErrorDlg(url, errorCode, errorMsg, feedback);
						}  
					}
				}
				reportErrorToServer(url, form, errorCode, errorMsg, false);

				if (int.TryParse(errorCode, out i)&&i==2101&&!KBN.PveController.instance().isVerifing)
                {
                    KBN.PveController.instance().ReqVerify(Constant.PVE_VERIFY_REQ_Type.GET_INFO);
                }
			}
		}
		
		protected static void retryDlgForGPB(string url, global::ProtoBuf.IExtensible packet, MulticastDelegate okFunc, MulticastDelegate errorFunc, bool forceNoConnectMenu)
		{
			if (!needShowNetErrorDlg(url))
			{
				return;
			}
			string promptMsg = Datas.getArString("Error.Network_error");
			if (promptMsg != null)
			{
				Action callback = delegate() {
					BaseRequestForGPB(url, packet, okFunc, errorFunc, true, forceNoConnectMenu);
				};
				ErrorMgr.singleton.PushError("", promptMsg, true, Datas.getArString("FTE.Retry"), callback);               
			}
		}


		protected static string AddMsgHeader(WWWForm form,bool jiami=false)
		{
			PBMsgHeader.PBMsgHeader msgHeader = new PBMsgHeader.PBMsgHeader();
			msgHeader.access_token = Datas.singleton.getAccessToken () + "";
			msgHeader.becomeUserId = Datas.singleton.GetBecomeUserId () + "";
			msgHeader.becomePassword = Datas.singleton.GetBecomeUserPassword () + "";
			msgHeader.debug = BuildSetting.DEBUG_MODE;
			msgHeader.gameNumber = gameNumber++;
			msgHeader.gameSlot = slotId++;
			msgHeader.gcUid = Datas.singleton.GetGameCenterPlayerId_Binded () + "";
			msgHeader.gcUnick = Datas.singleton.GetGameCenterAlias_Binded () + "";
			msgHeader.gVer = BuildSetting.CLIENT_VERSION;
			msgHeader.kabamId = Datas.singleton.getKabamId () + "";
			msgHeader.mobileId = mobileId;
			msgHeader.naId = Datas.singleton.getNaid () + "";
			msgHeader.newLang = Datas.singleton.getGameLanguageAb () + "";
			msgHeader.platformId = platformId;
			msgHeader.theme = Datas.singleton.getGameTheme ();
			string strMsgHeader = _Global.SerializePBMsg2Base64Str (msgHeader);
            if(jiami){
                form.AddField ("header", DESEnCode_AES(strMsgHeader));
            }else{
                form.AddField ("header", strMsgHeader);
            }
			return strMsgHeader;
		}

		public static void SodaRewards(string message, Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "sodaRewardsRedemption.php";
			WWWForm form = new WWWForm();
			form.AddField("data", message);
			shortRequest(url, form, okFunc, errorFunc);		
		}
		public static void SodaExpiry(Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "sodaTokenExpiry.php";
			WWWForm form = new WWWForm();
			shortRequest(url, form, okFunc, errorFunc);		
		}

		private static void RestartGame()
		{
			GameMain.singleton.restartGame ();
		}

		#endregion

		public static int GetNetState(){
			int state = 0;
			if(Application.internetReachability == NetworkReachability.NotReachable){
				state= 0;
			}else if(Application.internetReachability == NetworkReachability.ReachableViaCarrierDataNetwork){
				state= 1;
			}else if(Application.internetReachability == NetworkReachability.ReachableViaLocalAreaNetwork){
				state= 2;
			}return state;
		}

        public static void GetAllianceAvaTroops(int allianceId, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "getAllianceAvaTroops.php";
			
			WWWForm form = new WWWForm();
			form.AddField("allianceId", allianceId);
            form.AddField("type", 0);
			
			shortRequest(url, form, okFunc, errorFunc);
        }

        public static void GetAllianceAvaTroop(int allianceId, int userId, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "getAllianceAvaTroops.php";
			
			WWWForm form = new WWWForm();
			form.AddField("allianceId", allianceId);
            form.AddField("userId", userId);
            form.AddField("type", 1);
			
			shortRequest(url, form, okFunc, errorFunc);
        }

        public static void GetSelectAvaAllianceRegion(int allianceId, string region, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "selectAvaAllianceRegion.php";
			
			WWWForm form = new WWWForm();
			form.AddField("allianceId", allianceId);
            form.AddField("region", region);
			
			shortRequest(url, form, okFunc, errorFunc);
        }

        public static void AvaApply(int allianceId, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "avaApply.php";
			
			WWWForm form = new WWWForm();
			form.AddField("allianceId", allianceId);
			
			shortRequest(url, form, okFunc, errorFunc);
        }

		public static void RequestCollectMarchSpeedUP(object[] data, MulticastDelegate okFunc, MulticastDelegate errorFunc)
		{
//			var url = "speedupCollectMarch.php";
//			var form = new WWWForm();
//			form.AddField("cmd", data[0]);
////			form.AddField("subcmd", data[1]);
////			form.AddField("speedUpData", data[2]);
//			
//			shortRequest(url, form, okFunc, errorFunc); 
		}

		public static void getRallyList(int userId, int allianceId, int cityId, Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "rally.php";
			
			WWWForm form = new WWWForm();
			form.AddField("type", 1);
			form.AddField("userId", userId);
			form.AddField("allianceId", allianceId);
			form.AddField("cityId", cityId);
			
			shortRequest(url, form, okFunc, errorFunc);
		}

		public static void getRallyDetailedInfo(int userId, int allianceId, int cityId, int rallyId, Action<HashObject> okFunc, Action<string, string> errorFunc)
		{
			string url = "rally.php";
			
			WWWForm form = new WWWForm();
			form.AddField("type", 2);
			form.AddField("userId", userId);
			form.AddField("allianceId", allianceId);
			form.AddField("cityId", cityId);
			form.AddField("rallyId", rallyId);
			
			shortRequest(url, form, okFunc, errorFunc);
		}

		public	static void	getRallyMarchList(Action<HashObject> okFunc, Action<string, string> errorFunc){
			string url = "getWorldRallyList.php";
			
			WWWForm form = new WWWForm();
			shortRequest(url, form, okFunc, errorFunc);
		}


        // 领取地图最终大奖
        public static void getSeasonFinalReward(Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "getSeasonFinalReward.php";
			
			WWWForm form = new WWWForm();
			shortRequest(url, form, okFunc, errorFunc);
        }

        // 获得任务列表
        public static void getSeasonDetail(Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "getSeasonTaskDetail.php";
			
			WWWForm form = new WWWForm();
			shortRequest(url, form, okFunc, errorFunc);
        }

        // 解锁地图奖励
        public static void unlockMapReward(int id, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "unlockMapReward.php";
			
			WWWForm form = new WWWForm();
            form.AddField("lid", id);
			shortRequest(url, form, okFunc, errorFunc);
        }

        // 刷新任务
        public static void refreshSeasonTask(int id, int type, int itemId, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "refreshSeasonTask.php";
			
			WWWForm form = new WWWForm();
            form.AddField("taskId", id);
            // 1是免费 2是使用物品
            form.AddField("type", type);
            form.AddField("iid", itemId);
			shortRequest(url, form, okFunc, errorFunc);
        }

        // 领取任务奖励
        public static void unlockPass(int id, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "unlockPass.php";
			
			WWWForm form = new WWWForm();
            form.AddField("iid", id);
			shortRequest(url, form, okFunc, errorFunc);
        }

        // 解锁通行证活动
        public static void claimPassPoint(int id, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "claimPassPoint.php";
			
			WWWForm form = new WWWForm();
            form.AddField("taskId", id);
			shortRequest(url, form, okFunc, errorFunc);
        }

        // 获取玩家所有圣物
        public static void getHeroRelics(Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "heroRelics.php";

            WWWForm form = new WWWForm();
            shortRequest(url, form, okFunc, errorFunc);
        }

        // 解锁圣物
        public static void addRelic(int itemID, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "addRelic.php";

            WWWForm form = new WWWForm();
            form.AddField("iid", itemID);
            shortRequest(url, form, okFunc, errorFunc);
        }

        // 装备/卸下圣物 参数：rid圣物id, heroId 英雄id, act操作（load和unload)1,2, slot第几个圣物
        public static void heroRelicUpdate(int rid, int heroId, int act, int slot, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "heroRelicUpdate.php";

            WWWForm form = new WWWForm();
            form.AddField("rid", rid);
            form.AddField("heroId", heroId);
            form.AddField("act", act);
            form.AddField("slot", slot);
            shortRequest(url, form, okFunc, errorFunc);
        }

        // 圣物升级  参数rid, oid祭品id
        public static void relicUpdate(int rid, string oid, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "relicUpgrade.php";

            WWWForm form = new WWWForm();
            form.AddField("rid", rid);
            form.AddField("oid", oid);
            shortRequest(url, form, okFunc, errorFunc);
        }

        // 解锁/锁上圣物 参数：rid, status(1-正常，2-上锁)
        public static void changeRelicStatus(int rid, int status, Action<HashObject> okFunc, Action<string, string> errorFunc)
        {
            string url = "changeRelicStatus.php";

            WWWForm form = new WWWForm();
            form.AddField("rid", rid);
            form.AddField("status", status);
            shortRequest(url, form, okFunc, errorFunc);
        }

        //DES加密
        //加解密密钥
        //protected static string DESkey = "n7UxybHp";
		protected static string tmpDESkey = "NJWmYGzI1xSnxNnH";
         // Create sha256 hash
        static SHA256 mySHA256 = SHA256Managed.Create();
        protected  static byte[] basekey = mySHA256.ComputeHash(Encoding.ASCII.GetBytes(tmpDESkey));
        //key = mySHA256.ComputeHash(Encoding.ASCII.GetBytes(tmpDESkey));
        // Create secret IV
        protected static byte[] baseiv = new byte[16] { 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0 };

        static Rijndael encryptor = Rijndael.Create();
        static byte[] aesKey = new byte[32];
        #region DESEnCode DES加密   
        //public static string DESEnCode(string pToEncrypt, string sKey)
        public static string DESEnCode_AES (string plainText)
        {
            // Debug.LogWarning("-------------------------- start desencode ----------------------------");
            // if(plainText==null)
            //     Debug.LogWarning("plainText==null");
            // else
            // {
            //     Debug.LogWarning("plainText=="+plainText);
            // }


            byte[] key=basekey;
            byte[] iv=baseiv;
            // if(key==null)
            //     Debug.LogWarning("key==null");
            // else
            // {
            //     Debug.LogWarning("key!=null");
            // }
          
            // if(iv==null)
            //     Debug.LogWarning("iv==null");
            // else
            // {
            //     Debug.LogWarning("iv!=null");
            // }
            //string EncryptionKey = "MAKV2SPBNI99212";
            //StringBuilder ret = new StringBuilder();
            //try
            //{
            ////pToEncrypt = HttpContext.Current.Server.UrlEncode(pToEncrypt);
           //DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            //byte[] inputByteArray = Encoding.GetEncoding("UTF-8").GetBytes(pToEncrypt);

           // des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
           // des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
           // MemoryStream ms = new MemoryStream();
           // CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);

           // cs.Write(inputByteArray, 0, inputByteArray.Length);
           // cs.FlushFinalBlock();

           // foreach (byte b in ms.ToArray())
           // {
            //  ret.AppendFormat("{0:X2}", b);
           //}

           // } catch(Exception e){

            //  Console.WriteLine(e);
            //}
           // return ret.ToString();
            // Instantiate a new Aes object to perform string symmetric encryption
			//Aes encryptor = Aes.Create();

			
            // if(encryptor==null)
            //     Debug.LogWarning("encryptor==null");
            // else
            // {
            //     Debug.LogWarning("encryptor!=null");
            // }
            encryptor.Mode = CipherMode.CBC;

            // Set key and IV
            
    
            Array.Copy(key, 0, aesKey, 0, 32);
            encryptor.Key = aesKey;
            encryptor.IV = iv;

            // Instantiate a new MemoryStream object to contain the encrypted bytes
            MemoryStream memoryStream = new MemoryStream();
       
            // Instantiate a new encryptor from our Aes object
            ICryptoTransform aesEncryptor = encryptor.CreateEncryptor();
            // if(aesEncryptor==null)
            //     Debug.LogWarning("aesEncryptor==null");
            // else
            // {
            //     Debug.LogWarning("aesEncryptor!=null");
            // }

            // Instantiate a new CryptoStream object to process the data and write it to the 
            // memory stream
            CryptoStream cryptoStream = new CryptoStream(memoryStream, aesEncryptor, CryptoStreamMode.Write);
            // if(cryptoStream==null)
            //     Debug.LogWarning("cryptoStream==null");
            // else
            // {
            //     Debug.LogWarning("cryptoStream!=null");
            // }
             string cipherText =string.Empty;
            try
            {
                    byte[] plainBytes = Encoding.ASCII.GetBytes(plainText);
                    // if(plainBytes==null)
                    //     Debug.LogWarning("plainBytes==null");
                    // else
                    // {
                    //     Debug.LogWarning("plainBytes!=null");
                    // }

                    // Encrypt the input plaintext string
                    cryptoStream.Write(plainBytes, 0, plainBytes.Length);

                    // Complete the encryption process
                    cryptoStream.FlushFinalBlock();

                    // Convert the encrypted data from a MemoryStream to a byte array
                    byte[] cipherBytes = memoryStream.ToArray();

                    cipherText = Convert.ToBase64String(cipherBytes, 0, cipherBytes.Length);
            }
             catch(Exception e){
                  Debug.LogError("plainText: "+plainText);
            }
            finally  
            {
                memoryStream.Dispose();
                cryptoStream.Dispose();
            }

            // Convert the plainText string into a byte array
           

            // Close both the MemoryStream and the CryptoStream
           

            // Convert the encrypted byte array to a base64 encoded string
            // if(cipherText==null)
            //     Debug.LogWarning("cipherText==null");
            // else
            // {
            //     Debug.LogWarning("cipherText="+cipherText);
            // }

            // // Return the encrypted data as a string
            // Debug.LogWarning("-------------------------- end desencode ----------------------------");
              return cipherText;

        }
        #endregion

        #region DESDeCode DES解密
        //public static  string DESDeCode(string pToDecrypt, string sKey)
        public static string DESDeCode_AES(string cipherText,string url = null)
        {
			//Debug.LogWarning(">>>>>>>>>>>>>>>>> start decode <<<<<<<<<<<<<<<<");
			//Debug.LogWarning ("cipherText>>>>>>>>>>: "+ cipherText);
            byte[] key=basekey;
            byte[] iv=baseiv;
            //MemoryStream ms = new MemoryStream();
            //try{

            //  DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            //  byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
            //  for (int x = 0; x < pToDecrypt.Length / 2; x++)
            //  {
            //      int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
            //      inputByteArray[x] = (byte)i;
            //  }

            //  des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
            //  des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);

            //  CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
            //  cs.Write(inputByteArray, 0, inputByteArray.Length);
            //  cs.FlushFinalBlock();

            //  }catch(Exception e){

            //      Console.WriteLine(e);

            //  }


            //  return Encoding.Default.GetString(ms.ToArray());

            // Instantiate a new Aes object to perform string symmetric encryption
			//Aes encryptor = Aes.Create();
			//Rijndael encryptor = Rijndael.Create();

			// if(encryptor==null)
			// 	Debug.LogWarning("encryptor==null");
			// else
			// {
			// 	Debug.LogWarning("encryptor!=null");
			// }
            encryptor.Mode = CipherMode.CBC;

            // Set key and IV
            Array.Copy(key, 0, aesKey, 0, 32);
            encryptor.Key = aesKey;
            encryptor.IV = iv;

            // Instantiate a new MemoryStream object to contain the encrypted bytes
            MemoryStream memoryStream = new MemoryStream();

            // Instantiate a new encryptor from our Aes object
            ICryptoTransform aesDecryptor = encryptor.CreateDecryptor();

            // Instantiate a new CryptoStream object to process the data and write it to the 
            // memory stream
            CryptoStream cryptoStream = new CryptoStream(memoryStream, aesDecryptor, CryptoStreamMode.Write);

            // Will contain decrypted plaintext
            string plainText = String.Empty;

            try
            {
                // Convert the ciphertext string into a byte array
                byte[] cipherBytes = Convert.FromBase64String(cipherText);

                // Decrypt the input ciphertext string
                cryptoStream.Write(cipherBytes, 0, cipherBytes.Length);

                // Complete the decryption process
                cryptoStream.FlushFinalBlock();

                // Convert the decrypted data from a MemoryStream to a byte array
                byte[] plainBytes = memoryStream.ToArray();

                // Convert the decrypted byte array to string
                plainText = Encoding.ASCII.GetString(plainBytes, 0, plainBytes.Length);
            }
           catch(Exception e){
                Debug.LogError("cipherText: "+cipherText+"\nurl: "+url);
            }
            finally
            {
                // Close both the MemoryStream and the CryptoStream
                memoryStream.Dispose();
                cryptoStream.Dispose();
            }
			 //Debug.LogWarning("plaintext >>>>>>>>>>>>>>>>>: "+plainText);

			 //Debug.LogWarning(">>>>>>>>>>>>>>>>> end decode <<<<<<<<<<<<<<<<");



            // Return the decrypted data as a string
            return plainText;
        }

        public static byte[] DESDeCodeBytes_AES(string cipherText)
        {

			// Debug.LogWarning(">>>>>>>>>>>>>>>>> start decodeByte <<<<<<<<<<<<<<<<");
			// Debug.LogWarning("cipherText>>>>>>>>>>>>>>>>>: "+cipherText);

            byte[] key=basekey;
            byte[] iv=baseiv;
            //MemoryStream ms = new MemoryStream();
            //try{

            //  DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            //  byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
            //  for (int x = 0; x < pToDecrypt.Length / 2; x++)
            //  {
            //      int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
            //      inputByteArray[x] = (byte)i;
            //  }

            //  des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
            //  des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);

            //  CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
            //  cs.Write(inputByteArray, 0, inputByteArray.Length);
            //  cs.FlushFinalBlock();

            //  }catch(Exception e){

            //      Console.WriteLine(e);

            //  }


            //  return Encoding.Default.GetString(ms.ToArray());

            // Instantiate a new Aes object to perform string symmetric encryption
			//Aes encryptor = Aes.Create();
			//Rijndael encryptor = Rijndael.Create();
			// if(encryptor==null)
			// 	Debug.LogWarning("encryptor==null");
			// else
			// {
			// 	Debug.LogWarning("encryptor!=null");
			// }
            encryptor.Mode = CipherMode.CBC;

            // Set key and IV
            Array.Copy(key, 0, aesKey, 0, 32);
            encryptor.Key = aesKey;
            encryptor.IV = iv;

            // Instantiate a new MemoryStream object to contain the encrypted bytes
            MemoryStream memoryStream = new MemoryStream();

            // Instantiate a new encryptor from our Aes object
            ICryptoTransform aesDecryptor = encryptor.CreateDecryptor();

            // Instantiate a new CryptoStream object to process the data and write it to the 
            // memory stream
            CryptoStream cryptoStream = new CryptoStream(memoryStream, aesDecryptor, CryptoStreamMode.Write);

            // Will contain decrypted plaintext
            string plainText = String.Empty;
            byte[] plainBytes;

            try
            {
                // Convert the ciphertext string into a byte array
                byte[] cipherBytes = Convert.FromBase64String(cipherText);

                // Decrypt the input ciphertext string
                cryptoStream.Write(cipherBytes, 0, cipherBytes.Length);

                // Complete the decryption process
                cryptoStream.FlushFinalBlock();

                // Convert the decrypted data from a MemoryStream to a byte array
                plainBytes = memoryStream.ToArray();

                // Convert the decrypted byte array to string
                //plainText = Encoding.ASCII.GetString(plainBytes, 0, plainBytes.Length);
            }
            finally
            {
                // Close both the MemoryStream and the CryptoStream
                memoryStream.Dispose();
                cryptoStream.Dispose();
            }

		    //	Debug.LogWarning(">>>>>>>>>>>>>>>>> end decode <<<<<<<<<<<<<<<<");

            // Return the decrypted data as a string
            // return plainText;
            return plainBytes;
        }
        #endregion

        #region DESEnCode DES加密   
		public static string DESEnCode(string pToEncrypt)
		{
            
            string sKey="gBPZodCk";
			StringBuilder ret = new StringBuilder();
          //  _Global.LogWarning("开始加密"+pToEncrypt);
			try
			{
            //pToEncrypt = HttpContext.Current.Server.UrlEncode(pToEncrypt);
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray = Encoding.GetEncoding("UTF-8").GetBytes(pToEncrypt);

            des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
            des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);

            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            foreach (byte b in ms.ToArray())
            {
            	ret.AppendFormat("{0:X2}", b);
            }

            } catch(Exception e){

               throw e;
            }
           // _Global.LogWarning("加密完成"+ret.ToString());
            return ret.ToString();
        }
        #endregion

        #region DESDeCode DES解密
        public static  string DESDeCode(string pToDecrypt)
        {
            //  Debug.LogWarning("pToDecrypt="+pToDecrypt);
            pToDecrypt=pToDecrypt.Replace("\n", "");
            string sKey="gBPZodCk";
        	MemoryStream ms = new MemoryStream();
        	try{

        		DESCryptoServiceProvider des = new DESCryptoServiceProvider();
        		byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
                // Debug.LogWarning("pToDecrypt.Length="+pToDecrypt.Length);
        		for (int x = 0; x < pToDecrypt.Length / 2; x++)
        		{
        			int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
                    //  Debug.LogWarning("i="+i);
        			inputByteArray[x] = (byte)i;
        		}

        		des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
                // Debug.LogWarning("des.Key="+des.Key);
        		des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
                // Debug.LogWarning("des.IV="+des.IV);

        		CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
        		cs.Write(inputByteArray, 0, inputByteArray.Length);
        		cs.FlushFinalBlock();

            }catch(Exception e){

                Console.WriteLine(e);

            }
            return Encoding.Default.GetString(ms.ToArray());
        }
        public static  byte[] DESDeCodeByte(string pToDecrypt)
        {
            //  Debug.LogWarning("pToDecrypt="+pToDecrypt);
            pToDecrypt=pToDecrypt.Replace("\n", "");
            string sKey="gBPZodCk";
        	MemoryStream ms = new MemoryStream();
        	try{

        		DESCryptoServiceProvider des = new DESCryptoServiceProvider();
        		byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
                // Debug.LogWarning("pToDecrypt.Length="+pToDecrypt.Length);
        		for (int x = 0; x < pToDecrypt.Length / 2; x++)
        		{
        			int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
                    //  Debug.LogWarning("i="+i);
        			inputByteArray[x] = (byte)i;
        		}

        		des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
                // Debug.LogWarning("des.Key="+des.Key);
        		des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
                // Debug.LogWarning("des.IV="+des.IV);

        		CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
        		cs.Write(inputByteArray, 0, inputByteArray.Length);
        		cs.FlushFinalBlock();

            }catch(Exception e){

                Console.WriteLine(e);

            }
            return ms.ToArray();
        }
        #endregion

	}
}
