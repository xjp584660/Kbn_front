
using UnityEngine;
using System.Collections;
using System;
using System.Net;
using System.Text;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using KBN;
using LitJson;


namespace KBN
{
	public class GoogleTrans:MonoBehaviour
	{
		public class GoogleTranInfo
		{
			public string la = string.Empty;
			public string transInfo = string.Empty;
		}

		private Dictionary<string, GoogleTranInfo> saveGoogleTransInfos = new Dictionary<string, GoogleTranInfo>();

		public string yuanwen="";
		private string tkk="";
		// private bool isInitTkk=false;
		private System.MulticastDelegate callback=null;

		private static GoogleTrans singleton=null;

		public static GoogleTrans instance(){
			if( singleton == null )
			{
				GameObject obj=new GameObject("GoogleTrans");
				obj.AddComponent<GoogleTrans>();
				singleton = obj.GetComponent<GoogleTrans>();
			}
			return singleton as GoogleTrans;
		}
		public void Awake(){
			singleton=this;
		}
		//翻译外接接口
		public void Trans(string transBase,System.MulticastDelegate f){
			//_Global.LogWarning("开始翻译");
			if(GameMain.singleton.IsTrans()){
				callback=f;
				yuanwen=transBase;

				if(saveGoogleTransInfos.ContainsKey(yuanwen))
				{
					if(callback != null)
					{
						//_Global.LogWarning("saveGoogleTransInfos!!!!!!");
						GoogleTranInfo info = saveGoogleTransInfos[yuanwen];
						callback.DynamicInvoke(true, info.la, info.transInfo);
					}
				}
				else
				{
					if(tkk==null||tkk==""){
					StartCoroutine(InitTkk());
					}else{
						StartCoroutine(TranslateGoogleString(yuanwen));
					}
				}				
			}else{
				//弹出提示
				ErrorMgr.singleton.PushError("",Datas.getArString("Error.err_1205"));
			}
			
		}	

		IEnumerator InitTkk()
		{
			//_Global.LogWarning("初始化tkk");

			// try{
				string tkkHtml = string.Empty;
				string url="https://translate.google.cn";
					
				// WWW www=new WWW(url);



				System.Collections.Hashtable headers = new System.Collections.Hashtable();
	        	
	        	#if  UNITY_ANDROID
	        		headers.Add("User-Agent", "Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1");//android
	    		#else
	        		headers.Add("User-Agent", "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5");//ios 哈希表的数据格式
	    		#endif

				WWW www=new WWW(url,null,headers);
				yield return www;
				if(www.error==null){
					try{
						tkkHtml=www.text;
						//_Global.LogWarning("tkkHtml="+tkkHtml);
						tkk=GetTkk(tkkHtml);

						if(tkk == null || tkk == "")
						{	
							if(callback!=null){
								callback.DynamicInvoke(false,Datas.getArString("Chat.Translate_Text1"),"");
							}

							//弹失败的窗口
							ErrorMgr.singleton.PushError("",Datas.getArString("Error.err_1205"));
						}
						else
						{
							// _Global.LogWarning("tkk="+tkk);
							// isInitTkk=true;
							//_Global.LogWarning("初始化tkk成功");

							StartCoroutine(TranslateGoogleString(yuanwen));
						}
						
					}catch(Exception ex){
						_Global.LogWarning("InitTkk_Error:"+ex);
					}						
				}else{
					// Debug.Log(www.error);
					//_Global.Log("初始化tkk失败："+www.error);
					if(callback!=null){
						callback.DynamicInvoke(false,Datas.getArString("Chat.Translate_Text1"),"");
					}
				}
		}

		private string GetTkk(string tkkHtml){
			string tempStr="";
			try{
				Regex reg = new Regex(@"tkk:'(?<key>.*?)',");
				Match match = reg.Match(tkkHtml);
				tempStr = match.Groups["key"].Value;
			}
			catch (Exception ex)
			{
				_Global.LogWarning("Error:"+ex);
			}
			return tempStr;
		}

		IEnumerator TranslateGoogleString(string translateContent, string fromLanguage = "en")
		{
			//_Global.Log("开始google翻译");

			int gameLanguage = PlayerPrefs.GetInt("language" ,LocaleUtil.defaultID);
			string toLanguage=LocaleUtil.getInstance().getFileName(gameLanguage);
			if(toLanguage=="zs"){
				toLanguage="zh-CN";
			}else if(toLanguage=="zt"){
				toLanguage="zh-TW";
			}

			bool isScuess=false;
			string la="";
			string transRetHtml = string.Empty;
			string encodedStr = WWW.EscapeURL(translateContent); //URL编码
			string tk=GetTK(translateContent);
			// Debug.Log("tk="+tk);
			string url = string.Format("https://translate.google.cn/translate_a/single");//?client=t&sl=auto&tl={1}&hl={0}&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&ssel=6&tsel=3&kc=0&tk={3}&q={2}", fromLanguage, toLanguage, encodedStr,tk);

			System.Collections.Hashtable headers = new System.Collections.Hashtable();
        	
        	#if  UNITY_ANDROID
        		headers.Add("User-Agent", "Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1");//android
    		#else
        		headers.Add("User-Agent", "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5");//ios 哈希表的数据格式
    		#endif
        	//将要发送的Post文本内容  
		    string postData = string.Format("client=t&sl=auto&tl={1}&hl={0}&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&ssel=6&tsel=3&kc=0&tk={3}&q={2}", fromLanguage, toLanguage, encodedStr,tk);  
		    //将文本转为byte数组  
		    byte[] bs = System.Text.UTF8Encoding.UTF8.GetBytes (postData); 

			WWW www=new WWW(url,bs,headers);
			// Debug.Log("Url:"+url);
			yield return www;

			String transInfo="";

			if(www.error==null){
				transRetHtml=www.text;		

				try{
					JsonData data=JsonMapper.ToObject(transRetHtml);
					if(data!=null&&data[0]!=null){
						JsonData data0=data[0];
						if(data0!=null){
							int count=data0.Count;
							for(int i=0;i<count;i++){
								if(data0[i][0]!=null)
									transInfo+=data0[i][0].ToString();
							}
						}
					}
					la=data[2].ToString();
					// Debug.Log("la:"+la);
					isScuess=true;
					//_Global.Log("翻译成功："+transInfo);

				}catch(Exception ex){
					_Global.LogWarning("Trans_Error:"+ex);
					ErrorMgr.singleton.PushError("","Trans_Error:"+ex);
				}
				// isInitTkk=false;
			}else{
				// Debug.Log(www.error);
				// if(!isInitTkk){
				// 	StartCoroutine(InitTkk());
				// }
				//弹失败的窗口
				ErrorMgr.singleton.PushError("",Datas.getArString("Error.err_1205"));
			}

			if(transInfo==null||transInfo==""){
				transInfo=translateContent;
			}

			// Debug.Log("原文:"+translateContent+"\n"+"翻译:"+transInfo);
			if(callback!=null){
				la=LocaleUtil.getInstance().getLangIdString(la);
				// Debug.Log("la="+la);
				if(isScuess)
				{
					if(!saveGoogleTransInfos.ContainsKey(yuanwen))
					{
						GoogleTranInfo info = new GoogleTranInfo();
						info.la = la;
						info.transInfo = transInfo;

						saveGoogleTransInfos.Add(yuanwen, info);
					}
				}
				//_Global.LogWarning("GoogleTransInfos!!!!!!");
				callback.DynamicInvoke(isScuess,la,transInfo);
			}
		}


	    string b(long a, string b)
		{
		    for (int d = 0; d < b.Length - 2; d += 3)
		    {
		        char c = b.charAt(d + 2);
		        int c0 = 'a' <= c ? c.charCodeAt(0) - 87 : tools.Number(c);
		        long c1 = '+' == b.charAt(d + 1) ? a >> c0 : a << c0;
		        a = '+' == b.charAt(d) ? a + c1 & 4294967295 : a ^ c1;
		    }
		    a = tools.Number(a);
		    return a.ToString();
		}

	    string GetTK(string a)
		{
		    string[] e = tkk.Split('.');
		    int d = 0;
		    int h = 0;
		    int[] g = new int[a.Length * 3];
		    h = tools.Number(e[0]);
		    for (int f = 0; f < a.Length; f++)
		    {
		        int c = a.charCodeAt(f);
		        if (128 > c)
		        {
		            g[d++] = c;
		        }
		        else
		        {
		            if (2048 > c)
		            {
		                g[d++] = c >> 6 | 192;
		            }
		            else
		            {
		                if (55296 == (c & 64512) && f + 1 < a.Length && 56320 == (a.charCodeAt(f + 1) & 64512))
		                {
		                    c = 65536 + ((c & 1023) << 10) + a.charCodeAt(++f) & 1023;
		                    g[d++] = c >> 18 | 240;
		                    g[d++] = c >> 12 & 63 | 128;
		                }
		                else
		                {
		                    g[d++] = c >> 12 | 224;
		                    g[d++] = c >> 6 & 63 | 128;
		                    
		                }
		            }
		            g[d++] = c & 63 | 128;
		        }
		    }
		    // int[] g0 = g.Where(x => x != 0).ToArray();   //删除的一块代码
		    List<int> g1=new List<int>();
		    foreach(int x in g){
		    	if(x!=0)
		    		g1.Add(x);
		    }
		    int[] g0=g1.ToArray();

		    long aa = h;
		    for (d = 0; d < g0.Length; d++)
		    {
		        aa += g0[d];
		        aa = Convert.ToInt64(b(aa, "+-a^+6"));
		    }
		    aa = Convert.ToInt64(b(aa, "+-3^+b+-f"));
		    long bb = aa ^ tools.Number(e[1]);
		    aa = bb;
		    aa = aa + bb;
		    bb = aa - bb;
		    aa = aa - bb;
		    if (0 > aa)
		    {
		        aa = (aa & 2147483647) + 2147483648;
		    }
		    aa %= (long)1e6;
		    return aa.ToString() + "." + (aa ^ h);
		}

	}

}