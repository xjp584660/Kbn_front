using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System;
using System.Threading;
using System.IO;
using ProtoBuf;
using System.Text.RegularExpressions;
using System.Reflection;


namespace KBN
{
    public class _Global
    {
        public const string ap = "a";
        public static string RELEASE_SERVER_ID = UnityNet.URL_US_OFFICIAL;//UnityNet.URL_CLIENT;//UnityNet.URL_SERVER5;//UnityNet.URL_QA1;
        public static bool LOWENDPRODUCT = false;
        public static bool LOWENDPRODUCT_4_MAP_SYSTEM = false;
        public static bool IS_TOUCH5_GEN = false;
        public static bool ISIPHONE4;
        public static bool permissionState = false;

        public static string sqlVersion = "3.0";

        // TODO: When all code becomes C#, we could use the Conditional attribute instead of runtime
        // if checks to eliminate LogXXX invocations on non-INTERNAL_VERSION, so that the input string
        // doesn't need to be allocated or calculated.
        #region Debug.LogXXX wrappers
        static public void Log(string msg)
        {
#if UNITY_EDITOR
            Debug.Log(string.Format("[{0}] {1}", System.DateTime.Now.ToString("HH:mm:ss:fff"), msg));
#endif
            if (BuildSetting.DEBUG_MODE != 0)
            {
                LogTools.Instacne.SaveLog(string.Format("log-normal:{0}", msg));
            }
        }

        static public void LogWarning(string msg)
        {
#if UNITY_EDITOR
            Debug.LogWarning(string.Format("[{0}] {1}", System.DateTime.Now.ToString("HH:mm:ss:fff"), msg));
#endif
            if (BuildSetting.DEBUG_MODE != 0)
            {
                LogTools.Instacne.SaveLog(string.Format("log-waring:{0}", msg));
            }
        }

        static public void LogError(string msg)
        {
#if UNITY_EDITOR
            Debug.LogError(string.Format("[{0}] {1}", System.DateTime.Now.ToString("HH:mm:ss:fff"), msg));
#endif
            if (BuildSetting.DEBUG_MODE != 0)
            {
                LogTools.Instacne.SaveLog(string.Format("log-error:{0}", msg));
            }
        }

        #endregion


        /// <summary>
        /// 返回 Application.persistentDataPath
        /// 非编辑器时，正常返回
        /// 编辑器时，返回 路径增加对应平台字段（Android、iOS）
        /// </summary>
        public static string ApplicationPersistentDataPath
        {
            get
            {
#if UNITY_EDITOR && UNITY_ANDROID
                return Path.Combine(Application.persistentDataPath, "Android");

#elif UNITY_EDITOR && UNITY_IOS
			    return Path.Combine(Application.persistentDataPath, "iOS");
#else
                return Application.persistentDataPath;
#endif
            }
        }


        private static uint gm_logicWidth = 640;
		private static uint gm_logicHeight = 960;
		static public void setGUIMatrix(float w, float h)
		{
			GUI.matrix = calcGUIMatrix(w, h);
		}

		static public Matrix4x4 calcGUIMatrix(float w, float h)
		{
			var horizRatio = Screen.width / w;
			var vertRatio = Screen.height / h;
			
			return Matrix4x4.TRS (Vector3.zero, Quaternion.identity, new Vector3 (horizRatio, vertRatio, 1));
		}

		static public bool IsTallerThanLogicScreen()
		{
			float logicAspect = (float)gm_logicHeight / gm_logicWidth;
			return (((float)Screen.height / Screen.width) > (logicAspect + Single.Epsilon));
		}

		static public bool IsShorterThanLogicScreen()
		{
			float logicAspect = (float)gm_logicHeight / gm_logicWidth;
			return (((float)Screen.height / Screen.width) < (logicAspect - Single.Epsilon));
		}

		static public bool IsFitLogicScreen()
		{
			return !IsTallerThanLogicScreen() && !IsShorterThanLogicScreen();
		}

		static public Vector3 CalcScreenAspectScale(bool lockWidth, bool lockHeight) {
			if (lockWidth && lockHeight)
				return Vector3.one;

			float sx = 1.0f / GUI.matrix[0,0];
			float sy = 1.0f / GUI.matrix[1,1];

			if (lockWidth) {
				sy /= sx;
				sx = 1;
			} else if (lockHeight) {
				sx /= sy;
				sy = 1;
			}

			return new Vector3(sx, sy, 1.0f);
		}

		static public void MultiplyRotateScaleMatrix(Rect drawRect, float rotateAngle, Vector3 scale)
		{
			if ( rotateAngle == 0 && Vector3.one == scale)
				return;
			
			var zeroPoint = GUIUtility.GUIToScreenPoint(Vector2.zero);
			var center = drawRect.center;
			var centerV3 = new Vector3(center.x + zeroPoint.x, center.y + zeroPoint.y, 0.0f);
			
			var tempMatrix = Matrix4x4.TRS(centerV3, Quaternion.Euler (0f, 0f, rotateAngle), scale) 
				* Matrix4x4.TRS(-centerV3, Quaternion.identity, Vector3.one);
			GUI.matrix *= tempMatrix;
		}

		static public void MultiplyAspectAdjustMatrix(Rect drawRect, bool lockWidth, bool lockHeight)
		{
			Vector3 scale = CalcScreenAspectScale(lockWidth, lockHeight);
			MultiplyRotateScaleMatrix(drawRect, 0, scale);
		}

		static public void setGUIMatrix()
		{
            GUI.matrix = getGUIMatrix();
		}
		
		static public Matrix4x4 getGUIMatrix()
		{
			var horizRatio = Screen.width / (640.0f - 1);
			var vertRatio = Screen.height / (960.0f - 1);
			
			return Matrix4x4.TRS (Vector3.zero, Quaternion.identity, new Vector3 (horizRatio, vertRatio, 1));	
		}

		public static Vector4 RectToVec4(Rect rect) {
			return new Vector4(rect.x, rect.y, rect.width, rect.height);
		}

		public static bool IsLargeResolution()
		{
            return ResolutionHelperFactory.Product.IsLargeResolution;
		}
		
		public static bool IsMiniResolution()
		{
            return ResolutionHelperFactory.Product.IsMiniResolution;
		}
		
		public static uint ScreenWidth
		{
            get
            {
                return (uint)(ResolutionHelperFactory.Product.ScreenWidth);
            }
		}
		
		public static uint ScreenHeight
		{
            get
            {
                return (uint)(ResolutionHelperFactory.Product.ScreenHeight);
            }
		}
		
		public static Rect CalcScreenRect(Rect rect)
		{
			var testVert = new Vector3(1.0f, 1.0f, 0.0f);
			testVert = GUI.matrix.MultiplyPoint3x4(testVert);
			testVert.x = 1.0f/testVert.x;
			testVert.y = 1.0f/testVert.y;
			var posXY = GUIUtility.GUIToScreenPoint(new Vector2(rect.x * testVert.x, rect.y * testVert.y));
			var posWH = GUIUtility.GUIToScreenPoint(new Vector2(rect.xMax * testVert.x, rect.yMax * testVert.y)) - posXY;
			posXY.x /= testVert.x;
			posWH.x /= testVert.x;
			posXY.y /= testVert.y;
			posWH.y /= testVert.y;
			Rect rectOnScreen = new Rect();
			rectOnScreen.x = posXY.x;
			rectOnScreen.width = posWH.x;
			rectOnScreen.y = posXY.y;
			rectOnScreen.height = posWH.y;
			return rectOnScreen;
		}

		public static float CalcTextHeight(UnityEngine.GUIStyle style, string val, float width)
		{
			var content = new GUIContent(val);
			return style.CalcHeight(content, width);
		}

		//	Copy From ChatMenu.priv_calculateLength
		public static string CalculateLength(string tempStr, string defaultString, string outAppendMsg, UnityEngine.GUIStyle style, int spaceLength)
		{
			string returnStr = tempStr;
			float miniWidth;
			float maxWidth;

			int tempLength;
			int miniLength = 0;
			int maxLength = tempStr.Length; 
	
			float lessWordsLength = spaceLength;
			if ( outAppendMsg != null )
			{
				style.CalcMinMaxWidth(new UnityEngine.GUIContent(outAppendMsg), out miniWidth, out maxWidth);
				lessWordsLength -= maxWidth;
				if ( lessWordsLength <= 0 )
					return "";
			}

			style.CalcMinMaxWidth(new UnityEngine.GUIContent(tempStr), out miniWidth, out maxWidth);

			if(maxWidth <= lessWordsLength)
				return returnStr;

			float defaultLength = 0;
			style.CalcMinMaxWidth(new UnityEngine.GUIContent(defaultString), out miniWidth, out defaultLength);
			lessWordsLength -= defaultLength;
			if ( lessWordsLength <= 0 )
				return "";

			while(true)
			{
				tempLength = (maxLength + miniLength) / 2;
				returnStr = tempStr.Substring(0, tempLength);
				//	only if maxLength = miniLength || maxLength = miniLength + 1
				if ( tempLength == miniLength )
					break;

				style.CalcMinMaxWidth(new UnityEngine.GUIContent(returnStr), out miniWidth, out maxWidth);

				if(maxWidth > lessWordsLength)
				{
					maxLength = tempLength;
				}
				else if(maxWidth < lessWordsLength - 40)
				{
					miniLength = tempLength;
				}
				else
				{
					break;
				}
			}

			return returnStr + defaultString;
		}

        public static double parseTime(object serverTime)
        {
            double rt;
            object param = serverTime;
            if(serverTime is HashObject)
            {
                param = (serverTime as HashObject).Value;
            }
            if(param is string)
            {
                return double.Parse(param as string);
            }
            else
            {
                try
                {
                    if (param == null) rt = 0.0;
                    else rt = Convert.ToDouble(param);
                    return rt;  
                }
                catch (System.Exception e)
                {
                    //_Global.Log("INT 32 Error Format: " + obj);
                    rt = 0.0;
                    throw e;
                }   
            }   
        }

        public static string DateTime(long ut)
        {
            string dateStr;
            System.DateTime startTime = new System.DateTime(1970, 1, 1);
            System.DateTime st = startTime.AddSeconds(ut);
            if (GameMain.getTimeKind() == "local")
            {
                System.DateTime localTime = st.ToLocalTime();
                dateStr = localTime.ToString("MMM d, hh:mm tt");    
            }
            else 
            {
                //utc
                dateStr = st.ToString("MMM d, HH:mm tt"); 
            }
            return dateStr;
        }

        public static int INT32(object obj)
        {
            int rt;
            object param = obj;
            if(obj is HashObject && obj != null)
            {
                param = (obj as HashObject).Value;
            }
            if (param is string)
            {
                if(param as string == "")
                {
                    rt = 0;
                }
                else
                {
                    //try
                    //{
                    rt = int.Parse(param as String);
                    //}
                    //catch(e:System.Exception)
                    //{
                    //    _Global.Log("INT 32 Error Format: " + obj);
                    //    throw e;
                    //}*/
                }
            }
            else
            {
                //try
                //{
                if(param == null)
                {
                    rt = 0;
                }
                else
                {
                    rt = Convert.ToInt32(param);
                //}catch(e)
                //{
                //    _Global.Log("INT 32 Error Format: " + obj);
                //    rt = 0;
                //    throw e;
                //}
                }
            }
            return rt;
        }

        public static long INT64(object obj)
        {
            long rt;
            object param = obj;
            if(obj is HashObject && obj != null)
            {
                param = (obj as HashObject).Value;
            }
            if(param is string)
            {
                if(param as string == "")
                    rt = 0;
                else
                {   
//                    try
//                    {
                        if(System.Int64.TryParse(param as string, out rt))
                        {
                        }
                        else
                        {
                            rt = Convert.ToInt64(System.Double.Parse(param as string));
                        }
//                    }
//                    catch(System.Exception e)
//                    {
//                        //_Global.Log("INT 64 Error Format: " + obj);
//                        throw e;
//                    }
                }
            }
            else
            {
//                try
//                {
                    if (param == null)
                        rt = 0;
                    else        
                        rt = Convert.ToInt64(param);
//                }
//                catch (System.Exception e)
//                {
//                    //_Global.Log("INT 64 Error Format:" + obj);
//                    rt = 0;
//                    throw e;
//                }
            }
            return rt;
        }

        public static int Bool2INT(bool v)
        {
            return v ? 1 : 0;
        }

        public static Color RGB(int r, int g, int b)
        {
            return new Color(r / 255.0f, g / 255.0f, b / 255.0f, 1.0f);
        }

        public static string ColorToString(Color32 c)
        {
            return string.Format("#{0:x2}{1:x2}{2:x2}{3:x2}", c.r, c.g, c.b, c.a);
        }

        public static string FontColorEnumToString(FontColor fc)
        {
            return ColorToString(FontMgr.GetColorFromTextColorEnum(fc));
        }

        public static string NumFormat(long num)
        {
            string result = string.Format("{0:###,###,###}", num);
            if (num == 0L)
            {
                return "0";
            }
            return result;
        }

        public static string NumOnlyToMillion(long num)
        {
            string s = "";
            if(num > 1000000L)
            {
                double n;
                if(num < 100000000L)
                {
                    num = num / 10000L;     
                    n = num /100.0;
                }
                else
                {
                    num = num / 100000L;   
                    n = num /10.0;
                }
                
                s = n + "M";
            }
            else
                if(num == 0L)
                    s = "0";
            else
            {
                s = "" + NumFormat(num);
            }
            return s;
        }

		//每三位数一个逗号 (金融数字)
		public static string NumFinancial(string num)
		{
			if (IsNumber (num)) {
				long lNum = INT64(num);
				return string.Format("{0:N0}", lNum);
				
			} else {
				return num;
			}
		}

	 	/// <summary>
		/// 判断字符串是否是数字
		/// </summary>
		public static bool IsNumber(string s)
		{
			if (string.IsNullOrEmpty(s)) return false;
		     const string pattern = "^[0-9]*$";
		     Regex rx = new Regex(pattern);
		     return rx.IsMatch(s);
		}

        ///*
        //  num : the value need formated
        //  keepNumLen : how many digitel you want save.
        //  remoeLastZero:
        //      true) remove when have zero at the string tail.         3103 -> 3.1k @NumSimlify(3103, 3, true);
        //      false) fill with zero while the string is too short.    3103 -> 3.10k @NumSimlify(3103, 3, false);
        //  AUTO TEST : __autoTestNumSimplify
        public static string NumSimlify(long num, int keepNumLen, bool removeLastZero)
        {
            string[] tail = {"","k","m", "b"};
            int movCnt = 0;
            long mulNum = 1L;
            for (/* empty initial */; movCnt < tail.Length - 1; ++movCnt)
            {
                if (num < mulNum * 1000L)
                {
                    break;
                }
                mulNum *= 1000L;
            }
            
            //  now, we can format the number
            System.Text.StringBuilder res = new System.Text.StringBuilder(16);
            res.Append((num/mulNum).ToString());
            long lessValue = num % mulNum;
            if (res.Length < keepNumLen && movCnt != 0)
            {
                if (lessValue != 0)
                {
                    string lessValueString = lessValue.ToString();
                    res.Append(".");
                    int padding = movCnt * 3 - lessValueString.Length;
                    //  fill repeat operator want a char
                    //  but javascript can't define char type directly.
                    res.Append('0', padding);
                    res.Append(lessValueString);
                    if (res.Length > keepNumLen + 1)
                    {
                        res.Remove(keepNumLen + 1, res.Length - keepNumLen - 1);
                    }
                    
                    if (removeLastZero)
                    {
                        while (res[res.Length - 1] == '0')
                        {
                            res.Remove(res.Length-1, 1);
                        }
                        if (res[res.Length - 1] == '.')
                        {
                            res.Remove(res.Length - 1, 1);
                        }
                    }
                }
                
                if (!removeLastZero && res.Length < keepNumLen)
                {//  fill zero
                    int needRepeatCount = keepNumLen - res.Length;
                    if (lessValue == 0)
                    {
                        res.Append(".");
                    }
                    res.Append('0', needRepeatCount);
                }
            }
            
            res.Append(tail[movCnt]);
            return res.ToString();
        }

        public static string NumSimlify(long num)
        {
            return NumSimlify(num, 3, false);
        }

        public static string FilterStringToNumberStr(string str)
        {
            if(str == null)
            {
                return "";
            }
            string rt = "";
            char c;
            
            for(int i = 0; i < str.Length; i++)
            {
                c = str[i];
                if( c >= '0'  && c <= '9')
                    rt = rt + c;
            }
            //int64
            if(rt.Length > 18)
            {
                rt = rt.Substring(0,18);
            }
            return rt;
        }

        public static string NumSimlify2(long num)
        {
            string result;
            
            if(num < 1000000)
            {
                return NumFormat(num);
            }
            else if (num < 1000000000)
            {
                result = NumSimlify(num);
            }
            else 
            {
                result = NumFormat(num/1000) + "k";
            }
            return result;
        }

		public static Rect UnitySizeToReal(Rect rect)
		{
			float screenH = NativeCaller.GetMainScreenHeight();
			float screenW = NativeCaller.GetMainScreenWidth();
			
			Rect result = new Rect(0, 0, 0, 0);
			result.x = rect.x * screenW / 640.0f;
			result.width = rect.width * screenW / 640.0f;
			
			result.y = rect.y * screenH / 960.0f;
			result.height = rect.height * screenH / 960.0f;
			return result;
		}
		
		public static float FLOAT(object obj)
		{
			float rt;
			object param = obj;
			if(obj is HashObject && obj != null)
			{
				param = (obj as HashObject).Value;
			}
			if (param is string)
			{
				if(param as string == "")
				{
					rt = 0f;
				}
				else
				{
					rt = System.Convert.ToSingle(param as String);
				}
			}
			else
			{
				if(param == null)
				{
					rt = 0f;
				}
				else
				{
					rt = Convert.ToSingle(param);
				}
			}
			return rt;
        }

        public static string GetString(object obj)
        {
            object param = obj;
            if (param as HashObject != null)
            {
                param = (param as HashObject).Value;
            }
            
            if (param == null)
                return "";
            return param.ToString();
        }

        public static bool GetBoolean(object obj)
        {
            bool rt;
            object param = obj;
            if(obj as HashObject != null)
            {
                rt = Convert.ToBoolean((obj as HashObject).Value);
            }
            else
            {
                //try
                //{
                if(param == null)
                {
                    rt = false;
                }
                else
                {
                    rt = System.Convert.ToBoolean(param);
                }
                //}
                //catch(e)
                //{
                //    rt = false;
                //    throw e;
                //}
            }
            return rt;
        }

        //TODO..
        public static Color ARGB(string str)
        {
            
            float a = 1f;
            float r = 1f;
            float g = 1f;
            float b = 1f;
            if(!string.IsNullOrEmpty(str))
            {
                long u = System.Convert.ToInt64(str, 16);               
                b = (( u       ) & 0xFF) / 255.0f;
                g = (( u >> 8  ) & 0xFF) / 255.0f;
                r = (( u >> 16 ) & 0xFF) / 255.0f;
                a = (( u >> 24 ) & 0xFF) / 255.0f;
            }
            return new Color(r,g,b,a);
        }

        public static double DOULBE64(object obj)
        {
//            double rt;
//            if(obj == null) return 0.0;
//            System.Double.TryParse(obj.ToString(), out rt);
//            return rt;
			double rt;
			object param = obj;
			if(obj is HashObject && obj != null)
			{
				param = (obj as HashObject).Value;
			}
			if (param is string)
			{
				if(param as string == "")
				{
					rt = 0.0;
				}
				else
				{
					rt = System.Convert.ToDouble(param as String);
				}
			}
			else
			{
				if(param == null)
				{
					rt = 0.0;
				}
				else
				{
					rt = Convert.ToDouble(param);
				}
			}
			return rt;
        }

		public static string timeFormatAbridged(long ut)
		{
			System.TimeSpan st = new System.TimeSpan(ut * System.TimeSpan.TicksPerSecond);
			StringBuilder sb = new StringBuilder();

			if (st.Hours > 0)
			{
				sb.Append(st.Hours);
				sb.Append('h');
			}
			if (st.Minutes > 0)
			{
				sb.Append(st.Minutes);
				sb.Append('m');
			}
			if (st.Seconds > 0 || sb.Length == 0)
			{
				sb.Append(st.Seconds);
				sb.Append('s');
			}

			return sb.ToString();
		}


        //3Days
        public static string timeFormatStrAbout(long ut)
        {
            System.TimeSpan st = new System.TimeSpan(ut * System.TimeSpan.TicksPerSecond);
            if (st.Days > 0)
            {
                return st.Days + " " + Datas.getArString("Common.Days");
            }
            if (st.Hours > 0)
            {
                return st.Hours +  " " + Datas.getArString("Common.Hours");
            }   
            if (st.Minutes > 0)
            {
                return st.Minutes + " " + Datas.getArString("Common.Minutes");
            }
            if (st.Seconds > 0)
            {
                return "1 " + Datas.getArString("Common.Minutes");
            }
            return "";
        }

        public static string timeFormatStrPlus(long ut)
        {
            if(ut < 0)
            {
                ut = 0;
            }
            return timeFormatStr(ut);
        }

		//total == true return "xxDxxHxxMxxS";
		//total == false return "xxDxxHxxM" or "xxHxxMxxS";
		public static string timeTotalFormatStr(long ut,bool total = true)
		{
			System.TimeSpan st = new System.TimeSpan(ut * System.TimeSpan.TicksPerSecond);
			string str = "";
			if (st.Days > 0)
			{
				str = str + st.Days + "d";
			}
			if (st.Days > 0 || st.Hours > 0)
			{
				str = str + st.Hours + "h";
			}   
			if (st.Days > 0 || st.Hours > 0 || st.Minutes > 0)
			{
				str = str + st.Minutes + "m";
				if(st.Days > 0 && !total)
				{
					return str;
				}
			}
			if (st.Days <= 0)
			{
				str = str + st.Seconds + "s";
			}
			return str; //st.ToString(); // 12344 12:30:59
		}

		public static string timeFormatStr(long ut)
        {
            System.TimeSpan st = new System.TimeSpan(ut * System.TimeSpan.TicksPerSecond);
            string str = "";
            if (st.Days > 0)
            {
                str = str + st.Days + "d";
            }
            if (st.Days > 0 || st.Hours > 0)
            {
                str = str + st.Hours + "h";
            }   
            if (st.Days > 0 || st.Hours > 0 || st.Minutes > 0)
            {
                str = str + st.Minutes + "m";
            }
            if (st.Days <= 0)
            {
                str = str + st.Seconds + "s";
            }
            return str; //st.ToString(); // 12344 12:30:59
        }

        //total == true return "xxHxxMxxS";
        //total == false return "xxHxxM" or "xxMxxS";
        public static string timeFormatShortStr(long ut, bool total)
        {
            System.TimeSpan st = new System.TimeSpan(ut*System.TimeSpan.TicksPerSecond);
            int hours = Mathf.FloorToInt(Convert.ToSingle(st.TotalHours));
            
            if(hours > 0)
            {
                if(total == true)
                {
                    return hours + "h " + st.Minutes + "m " + st.Seconds + "s";
                }
                else
                {
                    return hours + "h" + st.Minutes + "m";
                }
            }
            
            if(st.Minutes >= 1)
            {
                return st.Minutes + "m" + st.Seconds + "s"; 
            }
            if(st.Seconds >= 1)
            {
                return st.Seconds + "s"; 
            }
            return "";
        }

        public static string timeFormatShortStrEx(long ut, bool total)
        {
            System.TimeSpan st = new System.TimeSpan(ut*System.TimeSpan.TicksPerSecond);
            int hours = Mathf.FloorToInt(Convert.ToSingle(st.TotalHours));
            
            if (hours >= 24)
            {
				int totalDays = Convert.ToInt32(st.Days);
                return totalDays.ToString() + "d" + st.Hours.ToString() + "h";
            }
            
            if (hours > 0)
            {
                if (total == true)
                {
                    return hours + "h " + st.Minutes + "m " + st.Seconds + "s";
                }
                else
                {
                    return hours + "h" + st.Minutes + "m";
                }
            }
            
            if (st.Minutes >= 1)
            {
                return st.Minutes + "m" + st.Seconds + "s"; 
            }
            if (st.Seconds >= 1)
            {
                return st.Seconds + "s"; 
            }
            return "";
        }

		public static string timeFormatShortStrNotNull(long ut, bool total)
		{
			string strTime = timeFormatShortStrEx (ut, total);
			if(strTime == "")
				return "0s";
			return strTime;
		}

        public static string timeFormatExceptDate(long ut)
        {
            System.TimeSpan systemTime = new System.TimeSpan(ut * System.TimeSpan.TicksPerSecond);
            string str = "";
            
            str = systemTime.Hours + ":";
            if(systemTime.Minutes < 10)
            {
                str += "0";
            }
            str += systemTime.Minutes;
            
            return str;
        }

        //添加上自定义时间格式
        public static long DateTimeChatToTicksWithFormat(string dateStr, string format = "dd/MM hh:mm") {
            System.DateTime dateTime;

            // Globalization parse DateTime
            System.Globalization.CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            cultureInfo = new System.Globalization.CultureInfo("en-US"); // "zh-CN"

            System.Globalization.DateTimeStyles dtStyles = System.Globalization.DateTimeStyles.None;
            if (GameMain.getTimeKind() == "local")
            {
                dtStyles = System.Globalization.DateTimeStyles.AssumeLocal;
            }
            else
            {
                //utc
                dtStyles = System.Globalization.DateTimeStyles.AdjustToUniversal;
            }

            if (System.DateTime.TryParseExact(dateStr, format, cultureInfo, dtStyles, out dateTime))
            {
                return dateTime.Ticks;
            }

            Log("Can not parse the custom dateTime format");
            return -1;
        }

        public static long DateTimeChatToTicks(string dateStr)
        {
            System.DateTime dateTime;
            
            // Globalization parse DateTime
            System.Globalization.CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            cultureInfo = new System.Globalization.CultureInfo("en-US"); // "zh-CN"
            
            System.Globalization.DateTimeStyles dtStyles = System.Globalization.DateTimeStyles.None;
            if (GameMain.getTimeKind() == "local")
            {
                dtStyles = System.Globalization.DateTimeStyles.AssumeLocal;
            }
            else 
            {
                //utc
                dtStyles = System.Globalization.DateTimeStyles.AdjustToUniversal;
            }
            
            if (System.DateTime.TryParseExact(dateStr, "dd/MM hh:mm", cultureInfo, dtStyles, out dateTime))
            {
                return dateTime.Ticks;
			}

            Log("Can not parse the custom dateTime format");
            return -1;
        }

		public static long DateTimeTicksToUnixTimestamp(long ticks)
		{
			long unixTimestamp = new DateTime(ticks).Ticks - new DateTime(1970, 1, 1).Ticks;
			unixTimestamp /= TimeSpan.TicksPerSecond;
			return unixTimestamp;
		}

        public static string DateTimeChatFormat(long ut)
        {
            string dateStr;
            System.DateTime startTime = new System.DateTime(1970, 1, 1);
            System.DateTime st = startTime.AddSeconds(ut);
            if (GameMain.getTimeKind() == "local")
            {
                System.DateTime localTime = st.ToLocalTime();
                dateStr = localTime.ToString("dd/MM hh:mm");    
            }
            else 
            {
                //utc
                dateStr = st.ToString("dd/MM hh:mm"); 
            }
            return dateStr;
        }

		/// <summary>
		/// 使用24小时制格式化日期 
		/// </summary>
		/// <returns>The time chat format2.</returns>
		/// <param name="ut">Ut.</param>
		public static string DateTimeChatFormat2(long ut)
		{
			string dateStr;
			System.DateTime startTime = new System.DateTime(1970, 1, 1);
			System.DateTime st = startTime.AddSeconds(ut);
			if (GameMain.getTimeKind() == "local")
			{
				System.DateTime localTime = st.ToLocalTime();
				dateStr = localTime.ToString("yyyy/MM/dd HH:mm");    
			}
			else 
			{
				//utc
				dateStr = st.ToString("yyyy/MM/dd HH:mm"); 
			}
			return dateStr;
		}

        public static string DateTime24(long ut)
        {
            string dateStr;
            System.DateTime startTime = new System.DateTime(1970, 1, 1);
            System.DateTime st = startTime.AddSeconds(ut);
            if (GameMain.getTimeKind() == "local")
            {
                System.DateTime localTime = st.ToLocalTime();
                dateStr = localTime.ToString("MMM d\n HH:mm");  
            }
            else 
            {
                //utc
                dateStr = st.ToString("MMM d\n HH:mm"); 
            }
            return dateStr;
        }

        public static string HourTimeWithoutSecond(long ut)
        {
            string dateStr;
            System.DateTime startTime = new System.DateTime(1970, 1, 1);
            System.DateTime st = startTime.AddSeconds(ut);
            if (GameMain.getTimeKind() == "local")
            {
                System.DateTime localTime = st.ToLocalTime();
                dateStr = localTime.ToString("h:mm");   
            }
            else 
            {
                //utc
                dateStr = st.ToString("h:mm"); 
            }
            return dateStr;
        }

        public static string HourTime24WithoutSecond(long ut)
        {
            string dateStr;
            System.DateTime startTime = new System.DateTime(1970, 1, 1);
            System.DateTime st = startTime.AddSeconds(ut);
            if (GameMain.getTimeKind() == "local")
            {
                System.DateTime localTime = st.ToLocalTime();
                dateStr = localTime.ToString("HH:mm");  
            }
            else 
            {
                //utc
                dateStr = st.ToString("HH:mm"); 
            }
            return dateStr;
        }

        public static int CalculateKeyboardSpeed(int maxStep)
        {
            
            if (RuntimePlatform.Android == Application.platform)
            {
                return 80;
            }
            else
            {
                if(Screen.width > 640)
                {
                    return 49;
                }
                else
                {
                    return 86;
                }
            }
        }

        public static float GUICalcWidth(GUIStyle Style, GUIContent Content)
        {
            float MinWidth;
            float MaxWidth;
            Style.CalcMinMaxWidth(Content, out MinWidth, out MaxWidth);
            return MaxWidth;
        }

        public static float GUICalcWidth(GUIStyle Style, string Text) 
        {
            float MinWidth;
            float MaxWidth;
            Style.CalcMinMaxWidth(new UnityEngine.GUIContent(Text), out MinWidth, out MaxWidth);
            return MaxWidth;
        }

        public static string GUIClipToWidth(GUIStyle Style, string Text, float Width)
        {
            if (Width <= float.Epsilon || String.IsNullOrEmpty(Text)) 
            {
                return String.Empty;
            }
            GUIContent Content = new UnityEngine.GUIContent(Text);
            int MinLength = 0;
            float MinWidth = 0f;
            int MaxLength = Text.Length;
            float MaxWidth = GUICalcWidth(Style, Content);
            while (MaxWidth - Width > float.Epsilon) 
            {
                int NowRemoveLength = System.Math.Max(Convert.ToInt32(((MaxWidth - Width) * Convert.ToSingle((MaxLength - MinLength)) / (MaxWidth - MinWidth))),1);
                int NewLength = MaxLength - NowRemoveLength;
                if (NewLength == MinLength)
                {
                    ++NewLength;
                }
                Content.text = Text.Substring(0, NewLength);
                float NewWidth = GUICalcWidth(Style, Content);
                if (System.Math.Abs(NewWidth - Width) < float.Epsilon) {
                    Text = Content.text;
                    break;
                } else if (NewWidth < Width) {
                    MinWidth = NewWidth;
                    MinLength = NewLength;
                } else {
                    MaxWidth = NewWidth;
                    MaxLength = NewLength;
                    Text = Content.text;
                }
                if (MinLength + 1 == MaxLength) {
                    Text = Content.text;
                    if (NewLength == MinLength) {
                        Text = Content.text;
                    } else {
                        Text = Text.Substring(0, MinLength);
                    }
                    break;
                }
            }
            return Text;
        }

        public static string GUIClipToWidth(GUIStyle mystyle, string text, float width, string omitStr, string suffix)
        {
            if (text == null)
            {
                text = "";
            }
            return string.Format("{0}{1}", GUIClipToWidthWithoutSuffix(mystyle, text, width, omitStr, suffix), suffix);
        }

        protected static string GUIClipToWidthWithoutSuffix(GUIStyle mystyle, string text, float width, string omitStr, string suffix)
        {
            string returnStr = text;
            float miniWidth;
            float maxWidth;
            
            int tempLength;
            int miniLength = 0;
            int maxLength = text.Length; 
            
            float lessWordsLength = width;
            if (suffix != null)
            {
                mystyle.CalcMinMaxWidth(new GUIContent(suffix), out miniWidth, out maxWidth);
                lessWordsLength -= maxWidth;
                if ( lessWordsLength <= 0f )
                    return "";
            }

            mystyle.CalcMinMaxWidth(new GUIContent(text), out miniWidth, out maxWidth);
            if (maxWidth <= lessWordsLength)
                return returnStr;
           

            float defaultLength = 0f;
            mystyle.CalcMinMaxWidth(new GUIContent(omitStr), out miniWidth, out defaultLength);
            lessWordsLength -= defaultLength;
            if ( lessWordsLength <= 0f )
                return "";
            
            while(true)
            {
                tempLength = (maxLength + miniLength) / 2;
                returnStr = text.Substring(0, tempLength);
                //  only if maxLength = miniLength || maxLength = miniLength + 1
                if ( tempLength == miniLength )
                    break;
                
                mystyle.CalcMinMaxWidth(new GUIContent(returnStr), out miniWidth, out maxWidth);
                
                if(maxWidth > lessWordsLength)
                {
                    maxLength = tempLength;
                }
                else if(maxWidth < lessWordsLength - 20)
                {
                    miniLength = tempLength;
                }
                else
                {
                    break;
                }
            }

            return string.Format("{0}{1}", returnStr, omitStr);
        }

        
		[System.Obsolete("ToBool is deprecated, please use GetBoolean instead.")]
        public static bool ToBool(object obj)
        {
            HashObject hashObj = obj as HashObject;
            if (hashObj != null) 
            {
                obj = (obj as HashObject).Value;
            }
            if (obj == null)
            {
                return false;
            }
            bool Result;
            if (obj is String)
            {
                if (!bool.TryParse(obj as string, out Result)) 
                {
                    Result = System.Convert.ToInt32(obj) != 0;
                }
            }
            else 
            {
                Result = System.Convert.ToBoolean(obj);
            }
            return Result;
        }

        public static string ToString(object obj)
        {
            HashObject hashObj = obj as HashObject;
            if(hashObj != null) 
            {
                obj = hashObj.Value;
            }
            if (obj == null) 
            {
                return String.Empty;
            }
            return obj.ToString();
        }

        public static string GetParamStringFromHashObj(HashObject par, string paramName, string defVal)
        {
            if (par == null)
            {
                return defVal;
            }
            HashObject paramObj = par[paramName];
            if (paramObj == null)
            {
                return defVal;
            }
            string paramNameResult = paramObj.Value as string;
            if (string.IsNullOrEmpty(paramNameResult))
            {
                return defVal;
            }
            return paramNameResult;
        }

        public static int GetParamIntFromHashObj(HashObject par, string paramName, int defVal)
        {
            string paramVal = GetParamStringFromHashObj(par, paramName, null);
            if (string.IsNullOrEmpty(paramVal))
            {
                return defVal;
            }
            try
            {
                return _Global.INT32(paramVal);
            }
            catch (System.Exception)
            {
                return defVal;
            }
        }

        public static HashObject CopyHashObject(HashObject src)
        {
            if ( src == null )
                return null;
            HashObject dst = new HashObject();
            dst.Value = src.Value;
            foreach (string k in src.Table.Keys)
            {
                HashObject ho = src[k];
                if (ho == null)
                {
                    continue;
                }
                ho = CopyHashObject(ho);
                if (ho == null)
                {
                    return null;
                }
                dst[k] = ho;
            }
            return dst;
        }

        /// merge object from nho to oho.
        //  nho : new HashObject
        public static HashObject MergeHashObject(HashObject oho, HashObject nho)
        {
            HashObject dst = CopyHashObject(oho);
            if (dst == null)
            {
                return null;
            }
            dst.Value = nho.Value;
            foreach (string k in nho.Table.Keys)
            {
                HashObject ho = nho[k];
                if (ho == null)
                {
                    continue;
                }
                if (dst.Table.ContainsKey(k))
                {
                    dst[k] = MergeHashObject(dst[k], nho[k]);
                    continue;
                }
                dst[k] = CopyHashObject(nho[k]);
                if (dst[k] == null)
                {
                    return null;
                }
            }
            return dst;
        }
       
        public static Rect CalculateLeftTopFromCenter(double centerX, double centerY, double width, double height)
        {   
            Rect rect = new Rect();
            rect.x = Convert.ToSingle(centerX - width / 2.0f);
            rect.y = Convert.ToSingle(centerY - height / 2.0f);
            rect.width = Convert.ToSingle(width);
            rect.height = Convert.ToSingle(height);
            return rect;
        }

        public static Rect CalculateLeftTopFromCenter(Rect rect)
        {
            return CalculateLeftTopFromCenter(rect.x, rect.y, rect.width, rect.height);
        }

        public static Vector2 CalculateCenterFromLeftTop(Rect rect)
        {
            Vector2 v2 = new Vector2();
            v2.x = rect.x + rect.width / 2.0f;
            v2.y = rect.y + rect.height / 2.0f;
            return v2;
        }

        public static Rect ToAbsoluteRect(Rect r)
        {
            Vector2 tempv = Vector2.zero;
            GUI.BeginGroup(r);
            tempv = GUIUtility.GUIToScreenPoint(tempv);
            GUI.EndGroup();
            r.x = tempv.x;
            r.y = tempv.y;
            return r;
        }

        public static int GetStoneType(int id)
        {
            if(id >= 42000 && id < 42400)
            {
                return id / 100 * 100;
            }
            return -1; 
        }

        public static bool IsLowEndProduct()
        {
            return LOWENDPRODUCT;
        }

        public static bool IsIphone4()
        {
            return ISIPHONE4;
        }

#region array-related
		public static List<string> GetObjectKeyLists(object inObj)
		{

            return new List<string>(GetObjectKeys(inObj));
		}

        public static string[] GetObjectKeys(object inObj)
        { 
            if (inObj == null)
                return new string[] { };

                        
            Hashtable obj;
            if (inObj is Hashtable)
            {
                obj = inObj as Hashtable;
            }
            else if (inObj is HashObject)
            {
                obj = (inObj as HashObject).Table;
            }
            else
            {
                return new string[] { };
            }


            int i = 0;
            var arr = new string[obj.Count];
            foreach (DictionaryEntry item in obj)
            {
                arr[i] = (string)item.Key;
                i++;
            }
            return arr;
        }

        public static object[] GetObjectValues(object inObj)
        {

            if (inObj == null)
                return new object[] { };

            Hashtable obj;
            if (inObj is Hashtable)
            {
                obj = inObj as Hashtable;
            }
            else if (inObj is HashObject)
            {
                obj = (inObj as HashObject).Table;
            }
            else
            {
                return new object[] { };
            }


            int i = 0;
            var arr = new object[obj.Count];

            foreach (System.Collections.DictionaryEntry item in obj)
            {
                arr[i] = item.Value;
                i++;
            }
            return arr;
        }

        public static List<object> GetObjectValuesToList(object inObj,string key)
        { 
            var list = new List<object>(GetObjectValues(inObj));
             
            list.Sort((o1,o2)=>{
                if(INT32((o1 as HashObject)[key])>INT32((o2 as HashObject)[key])){
                    return 1;
                }else{
                    return -1;
                }
                });
            return list;
        }
        
        public static bool IsValueInArray(IEnumerable array, int v)
        {
            HashObject element;
            foreach (object o in array)
            {
                if (o is HashObject && (element = o as HashObject) != null) 
                {
                    if (Convert.ToInt32(element.Value) == v)
                    {
                        return true;
                    }
                }
                else if(Convert.ToInt32(o) == v)
                {
                    return true;
                }
            }
            return false;
        }

        public static List<object> ArrayToList(IEnumerable array)
        {
            List<object> list=new List<object>();
            foreach(object o in array)
            {
                list.Add(o);
            }
            return list;
        }
        
        public static bool IsValueInArray(IEnumerable array, object v)
        {
            foreach (object o in array)
            {
                if (o == v)
                {
                    return true;  
                }
            }
            return false;
        }

        public static int MaxValue(int[] array)
        {
            int returnValue = array[0];
            for(int a = 1; a < array.Length; a++)
            {
                int cur = array[a];
                if(cur > returnValue)
                {
                    returnValue = array[a];
                }
            }
            return returnValue;
        }

        public static int IndexOf(int[] array, int item)
        {
            if (array == null) return -1;
            for (int i = 0;i < array.Length; i++)
            {
                if(array[i] == item)
                {
                    return i;
                }
            }
            return -1;
        }
          
        public static int[] CollectArray(HashObject[] array, Func<HashObject, int> func)
        {
            var arr = new int[array.Length];
            for (int i = 0; i < array.Length; i ++) 
                arr[i] = func(array[i]);
                
            return arr;
        }

		public static byte[] SerializePBMsg2Bytes<T>(T msg)
		{
			using (MemoryStream ms = new MemoryStream ()) 
			{
				Serializer.Serialize<T> (ms, msg);
				byte[] byData = ms.ToArray ();
				return byData;
			}
		}

		public static string SerializePBMsg2Base64Str<T>(T Msg)
		{
			using (MemoryStream ms = new MemoryStream ()) 
			{
				Serializer.Serialize<T> (ms, Msg);
				byte[] byData = ms.ToArray ();
				return System.Convert.ToBase64String (byData);
			}
		}

		public static T DeserializePBMsgFromBytes<T>(byte[] data)
		{
            using (MemoryStream ms = new MemoryStream(data)) 
			{
				return Serializer.Deserialize<T> (ms);
			}
		}

		public static int GetRandNumber(int iMin, int iMax)
		{
			long tick = System.DateTime.Now.Ticks; 
			System.Random ran = new System.Random((int)(tick & 0xffffffffL) | (int) (tick >> 32));
			return ran.Next(iMin,iMax);
		}

#endregion

        // Unconverted js methods which are not used
        // static function IsValueInObject(src:Object,v:int):boolean
        // static   function    addCommas(nStr:int):String
        // static function expandArray(list:Array,len2:int)
        // static  function    IsStrInArray( array:Array, str:String, caseIgnore:boolean):boolean
        // static function joinArray2Str(arr:Array,link:String):String
        // static function binarySearch(target:int,rlist:Array):int 
        // static function indexOfValueInArray(array:Array, v:int):int
		public static Vector2 TransCoordFromScrren(Vector2 v2)
		{
			v2.x = v2.x / Screen.width * 640.0f;
			v2.y = v2.y / Screen.height * 960.0f;

			v2.y = 960.0f - v2.y;
			
			return v2;
		}
		
		public static string GetMD5Hash(string input)
		{
			byte[] bs = System.Text.Encoding.UTF8.GetBytes(input);
			using (System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider()) 
			{
				bs = md5.ComputeHash(bs);
			}
			StringBuilder s = new StringBuilder();
			foreach (byte b in bs)
			{
				s.Append(b.ToString("x2").ToLower());
			}
			string res = s.ToString();
			return res;
		}

		public static string GetMD5Hash(byte[] input)
		{
			using (System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider()) 
			{
				input = md5.ComputeHash(input);
			}
			StringBuilder s = new StringBuilder();
			foreach (byte b in input)
			{
				s.Append(b.ToString("x2").ToLower());
			}
			string res = s.ToString();
			return res;
		} 

		public static string GetMD5Hash(Stream input)
		{
			byte[] bs;
			using (System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider()) 
			{
				bs = md5.ComputeHash(input);
			}
			StringBuilder s = new StringBuilder();
			foreach (byte b in bs)
			{
				s.Append(b.ToString("x2").ToLower());
			}
			string res = s.ToString();
			return res;
		} 

		public static bool IsDiskFullException(IOException ex)
		{
			const long ERROR_HANDLE_DISK_FULL = 0x27;
			const long ERROR_DISK_FULL = 0x70;
			long errorCode = System.Runtime.InteropServices.Marshal.GetHRForException(ex) & 0xFFFF;
			return (errorCode == ERROR_HANDLE_DISK_FULL || errorCode == ERROR_DISK_FULL);
		}

		//YYYY-MM-DD hh:mm:ss data,
		public static long GetTimeFromString(string stTime){
			if(string.IsNullOrEmpty(stTime)) return 0;

			long time=0;//返回的是微秒
//			TimeZone.CurrentTimeZone.ToLocalTime
//			TimeZone.
			System.DateTime startTime  = TimeZone.CurrentTimeZone.ToUniversalTime(new System.DateTime(1970, 1, 1, 0, 0, 0, 0));
			if (GameMain.getTimeKind() == "local")
			{
				startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1, 0, 0, 0, 0));
			}
			try {
//				 time=Convert.ToDateTime(stTime).Ticks;//返回的是微秒
				time=TimeZone.CurrentTimeZone.ToUniversalTime(Convert.ToDateTime(stTime)).Ticks;
				if (GameMain.getTimeKind() == "local")
				{
					time=Convert.ToDateTime(stTime).Ticks;
				}
			} catch (Exception ex) {
				return 0;	
			}
			return (time - startTime.Ticks)/ 10000000;//get date scond,1秒=1,000,000 微秒(μs)
		}
		/// <summary>
		/// 用于对数值向上取整
		/// </summary>
		/// <returns>The to int.</returns>
		/// <param name="data">Data.</param>
		public static int CeilToInt(float data){
			return Mathf.CeilToInt(data);
		}

		/// <summary>
		/// 用于对数值向下取整.
		/// </summary>
		/// <returns>The to int.</returns>
		/// <param name="data">Data.</param>
		public static int FloorToInt(float data){
			return Mathf.FloorToInt(data);
		}
		public static bool isIphoneX(){
#if UNITY_EDITOR
			float f1=Screen.width/(1.0f*Screen.height);
			float f2=1125.0f/2426;
			if(f1<=f2){
				return true;
			}else return false;
#elif UNITY_IOS
			return (ResolutionHelperFactory.Product.IsIphoneX || ResolutionHelperFactory.Product.IsIphoneXR);
#endif
			return false;
		}

		public static bool isIphoneXR(){
#if UNITY_EDITOR
			return TextureMgr.instance().resolutionType == Constant.EitorResolutionType.IphoneXR;
#elif UNITY_IOS
			return ResolutionHelperFactory.Product.IsIphoneXR;
#endif
			return false;
		}

		public static float IphoneXTopFrameHeight(){
			return (45.0f/812)*960;
		}

		public static float IphoneXBottomFrameHeight(){
			return (36.0f/812)*960;
		}

		public static float IphoneXTopFrameHeight2(){
			return (45.0f/812)*ScreenHeight;
		}
		
		public static float IphoneXBottomFrameHeight2(){
			return (36.0f/812)*ScreenHeight;
		}

		public static float GetIphoneXScaleY(){
			if(!isIphoneX()){
				return 1;
			}

			float mScaleY=(960-IphoneXTopFrameHeight()-IphoneXBottomFrameHeight())/960;
			return 0.91f;
		}

		public static float GetIphoneXScaleY2(){
			if(!isIphoneX()){
				return 1;
			}

			float mScaleY=(ScreenHeight-IphoneXTopFrameHeight()-IphoneXBottomFrameHeight())/ScreenHeight;
			return mScaleY;
		}

        public static void GetPositionFromString(string str,ref string refStr,ref bool isMatch,ref int x,ref int y){
            if(string.IsNullOrEmpty(str)) {
                isMatch=false;
                refStr=str;
                return;
            }
            const string pattern=@"\(\d+\,\d+\)";
            Regex rx = new Regex(pattern);
            if(rx.IsMatch(str)){
                string position="";

                foreach (Match match in Regex.Matches(str, pattern)){
                    position=match.Value;
                    break;
                }
                const string pattern2=@"\d+";
                MatchCollection Matches=Regex.Matches(position, pattern2);
                x=int.Parse(Matches[0].Value);
                y=int.Parse(Matches[1].Value);
                if(x>0&&x<=800&&y>0&&y<=800){
                    isMatch=true;               
                    refStr=str.Replace(position,"<color=#00A0E9>"+position+"</color>");                    
                }             
                // x=x>0&&x<=800?x:800;
                // y=y>0&&x<=800?y:800;
            }
            
        }

        public static List<InventoryInfo> GetItems(HashObject subItems){
            List<InventoryInfo> itemList=new List<InventoryInfo>();
            if (subItems != null)
            {
                List<string> keys = new List<string>(_Global.GetObjectKeys(subItems));
                keys.Sort(SortItemKeys);
                for (int i = 0; i < keys.Count; i++)
                {
                    var newItem = new InventoryInfo();
                    newItem.id = GetIdFromKey(keys[i]);
                    newItem.quant = _Global.INT32(subItems[keys[i]]);

                    itemList.Add(newItem);          
                }
            }
            return itemList;
        }

        private static int SortItemKeys(string key1, string key2)
        {
            return GetIdFromKey(key1) - GetIdFromKey(key2);
        }

        private static int GetIdFromKey(string key)
        {
            return key.IndexOf('i') == 0 ? _Global.INT32(key.Split('i')[1]) : _Global.INT32(key);
        }  

        public static string[] GetStringListByString(string str){
            if(str!=null){
                return str.Split(';');
            }else{
                return new string[0];
            }
        }

        public static string[] GetStringListByString(string str, string str2) {
            char[] a = str2.ToCharArray();
            if (str != null && a != null) {
                return str.Split(a[0]);
            }
            else
            {
                return new string[0];
            }
        }

        //0,活动界面打开，1，场景界面打开
        public static int OpenWorldBossEventType=0;

        //提取字符串中的数字
        public static long GetNumerFromString(string str){
            string result = System.Text.RegularExpressions.Regex.Replace(str, @"[^0-9]+", "");
            return INT64(result);
        }

        public static int GetAndroidFrame()
        {
            if(PlayerPrefs.HasKey(Constant.AndroidFrame.ANDROID_FRAME_KEY))
            {
                int androidFrame = PlayerPrefs.GetInt(Constant.AndroidFrame.ANDROID_FRAME_KEY);
                return androidFrame;
            }
            else
            {
                return Constant.AndroidFrame.LowFrame;
                //return 30;
            }
        }
    }

}
