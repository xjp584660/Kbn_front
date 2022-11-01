using UnityEngine;

namespace ThinkingAnalytics.Utils
{
    public class TD_Log
    {
        private static bool enableLog;
        public static void EnableLog(bool enabled)
        {
            enableLog = enabled;
        }

        public static void d(string message)
        {
#if UNITY_EDITOR || true
            if (enableLog)
            {
                var info = "<color=#5474F1FF>[ThinkingSDK Unity_PC_V" + TD_PublicConfig.LIB_VERSION + "]<color=#ffffffff>[Log]</color></color> " + message + "\n------------------";
                Debug.Log(info);
            }
#endif

        }

        public static void e(string message)
        {
#if UNITY_EDITOR || true
            if (enableLog)
            {
                var info = "<color=#5474F1FF>[ThinkingSDK Unity_PC_V" + TD_PublicConfig.LIB_VERSION + "]<color=#ff0000ff>[Log]</color></color> " + message + "\n------------------";
                Debug.LogError(info);

            }
#endif
        }

        public static void w(string message)
        {
#if UNITY_EDITOR || true
            if (enableLog)
            {
                var info = "<color=#5474F1FF>[ThinkingSDK Unity_PC_V" + TD_PublicConfig.LIB_VERSION + "]<color=#ffff00ff>[Log]</color></color> " + message + "\n------------------";
                Debug.LogWarning(info);

            }
#endif
        }
    }
}