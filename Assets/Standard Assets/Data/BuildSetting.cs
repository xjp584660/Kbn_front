/*
 * @Author: song.li 
 * @Date: 2022-10-28 17:59:06 
 * @Last Modified by:   song.li 
 * @Last Modified time: 2022-10-28 17:59:06 
 */



using System.Collections.Generic;



public class BuildSetting {

    /// <summary>
	/// 
	/// </summary>
    private static int internalVersion = 1;

    /// <summary>
	/// 测试模式
	/// </summary>
    private static int debugMode = 1;

    /// <summary>
	/// 客户端版本号
	/// </summary>
    private static string clientVersion = "0.0.0";

    /// <summary>
	/// android 端资源压缩格式
	/// </summary>
    private static string androidCompression = "--";


    public static int InternalVersion { get { return internalVersion; } }
    public static int DebugMode { get { return debugMode; } }
    public static string ClientVersion { get { return clientVersion; } }
    public static string AndroidCompression { get { return androidCompression; } }



    static BuildSetting() {
        var dataTxt = UnityEngine.Resources.Load<UnityEngine.TextAsset>("Data/BuildSetting");
        var dataArr = dataTxt.text.Split('\n');

        var dataDic = new Dictionary<string, string>();
        for (int i = 0; i < dataArr.Length; i++) {
            var dataPairArr = dataArr[i].Split('=');

            if (dataPairArr == null || dataPairArr.Length < 2) continue;

            if (!string.IsNullOrEmpty(dataPairArr[0]) && !dataDic.ContainsKey(dataPairArr[0])) {
                dataDic.Add(dataPairArr[0], dataPairArr[1]);
            }
        }

        foreach (var item in dataDic) {
            if (item.Key.Contains("INTERNAL_VERSION")) {
                int.TryParse(item.Value, out internalVersion);

            } else if (item.Key.Contains("DEBUG_MODE")) {
                int.TryParse(item.Value, out debugMode);

            } else if (item.Key.Contains("CLIENT_VERSION")) {
                clientVersion = item.Value;

            } else if (item.Key.Contains("ANDROID_COMPRESSION")) {
                androidCompression = item.Value;

            }
        }

#if UNITY_EDITOR
        //Editor 编辑器下,下面2个值要为 1，否则无法运行游戏
        internalVersion = 1;
        debugMode = 1;
#endif

    }

}
