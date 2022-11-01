using UnityEngine;  
using System.Collections;  
public class CameraShake : MonoBehaviour {  
    public static bool startShake = false;  //camera是否开始震动  
    public static float seconds  = 0f;    //震动持续秒数  
    public static bool started  = false;    //是否已经开始震动  
    public static float quake = 0.2f;       //震动系数  
    private Vector3 camPOS;  //camera的起始位置  
    // Use this for initialization  
    void Start ()  
    {  
        camPOS = transform.localPosition;  
    }  
    // Update is called once per frame  
    void LateUpdate ()  
    {  
      if(startShake)  
        {  
            transform.localPosition =camPOS+Random.insideUnitSphere * quake;  
        }  
        if(started)  
        {  
            StartCoroutine(WaitForSecond(seconds));  
            started = false;  
        }  
    }  
    /// &lt;summary&gt;  
    /// 外部调用控制camera震动  
    /// &lt;/summary&gt;  
    /// &lt;param name="a"&gt;震动时间&lt;/param&gt;  
    /// &lt;param name="b"&gt;震动幅度&lt;/param&gt;  
    public static void ShakeFor(float a ,float b)  
    {  
//      if (startShake)  
//          return;  
        seconds = a;  
        started = true;  
        startShake = true;  
        quake = b;  
    }  
    IEnumerator WaitForSecond(float a)  
    {  
//      camPOS = transform.position;  
        yield return new WaitForSeconds (a);  
        startShake = false;  
        transform.localPosition = camPOS;  
    }  
}  