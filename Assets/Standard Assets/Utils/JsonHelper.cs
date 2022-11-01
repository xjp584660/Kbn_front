

/*
 * @FileName:		JsonHelper.js
 * @Author:			lisong
 * @Date:			2022-04-28 10:51:25
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	json 工具的简单封装
 *
*/


public class JsonHelper {


    public static string ToJson(object obj) {
        return LitJson.JsonMapper.ToJson(obj);
    }

    public static T ToObject<T>(string jsonStr) {
        return LitJson.JsonMapper.ToObject<T>(jsonStr);
    }



}
