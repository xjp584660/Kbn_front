using UnityEngine;
using System.Collections;

public class TimeDownContrtoller : MonoBehaviour {

	private static TimeDownContrtoller instance;
	public static TimeDownContrtoller GetInstance(){
		if (instance==null)
		{
			GameObject obj=new GameObject("TimeDownContrtoller");
			obj.AddComponent<TimeDownContrtoller>();
			DontDestroyOnLoad(obj);
			instance = obj.GetComponent<TimeDownContrtoller>();
		}
		return instance;
	}

	private int time=0;
	public void SetTime(int time){
		// this.time=time;
		if (IsInvoking("DownTime"))
		{
			CancelInvoke("DownTime");
		}
		InvokeRepeating("DownTime",1,1f);
	}

	private void DownTime(){
		this.time=(int)(KBN.PveController.instance().VerifyStatusLeftTime-KBN.GameMain.unixtime());
		time--;
		// Debug.LogWarning("Left Time:"+time+"s");
		if (this.time<=0)
		{
			KBN.PveController.instance().ReqVerify(Constant.PVE_VERIFY_REQ_Type.GET_INFO);
			CancelInvoke("DownTime");
		}
	}
}
