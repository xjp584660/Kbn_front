using UnityEngine;

public class ShowFps
{
	public	static bool		isNeedShowProfileInfo = false;
	private	static int		gm_framesInSecond =0;
	private	static string	gm_profileInfo = "";
	private	static float	gm_timeLeft = 1.0f; 
	private static GUIStyle style=new GUIStyle();


	public static void Draw()
	{
		GUI.depth=0;
		if ( !isNeedShowProfileInfo ) return;
		//UnityEngine.GUI.Label(new Rect(10, 77, 180, 80), gm_profileInfo);
		style.normal.textColor = new Color(255f,0,255f);
		style.fontSize=25;
		UnityEngine.GUI.Label(new Rect(50, 50 , Screen.width/2, 100),gm_profileInfo, style);
		//UnityEngine.GUI.Label(new Rect(Screen.width/2,Screen.height/2, 200, 100),gm_profileInfo, style);
		//Debug.Log("x:"+Screen.width/2 +"y" +Screen.height/2 +"memory:"+ gm_profileInfo);

	}
	

	public static void Update()
	{
		if ( !isNeedShowProfileInfo ) return;

		gm_timeLeft -= Time.deltaTime;
		++gm_framesInSecond;

		if( gm_timeLeft > 0.0 ) return;

     	//long unityMemoryUsed = Profiler.usedHeapSize/(1024*1024);
		//long monoMemoryUsed = System.GC.GetTotalMemory(false)/(1024*1024);
		var profileInfoBuilder = new System.Text.StringBuilder(1024);
		//profileInfoBuilder.AppendFormat("FPS:{0}\nMemoryUsed:MB", gm_framesInSecond.ToString());// (unityMemoryUsed+monoMemoryUsed).ToString());
		profileInfoBuilder.AppendFormat("FPS:{0}\nMemoryUsage:{1}MB", gm_framesInSecond.ToString(), NativeCaller.GetMemoryUsage ().ToString("f2"));
		//gm_profileInfo = "FPS:" + gm_framesInSecond.ToString()+"\n"+"system memory:"+memoryUsed.ToString()+"mb";
		gm_profileInfo = profileInfoBuilder.ToString();
		gm_timeLeft = 1;
        gm_framesInSecond = 0;
    }
}
