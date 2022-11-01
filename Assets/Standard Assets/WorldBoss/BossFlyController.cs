using UnityEngine;
using System.Collections;

public class BossFlyController : MonoBehaviour {

	public Vector3 from1=new Vector3(12,-4,30);
	public Vector3 from2=new Vector3(-12,-6,30);
	public Vector3 from3=new Vector3(-12,-2,30);

	public Vector3 to1=new Vector3(-12,10,30);
	public Vector3 to2=new Vector3(12,10,30);
	public Vector3 to3=new Vector3(12,6,30);

	public Vector3 r1=new Vector3(-25,60,-50);
	public Vector3 r2=new Vector3(-22,-53,50);

	public GameObject tp;
	public float durationTime = 2f;
	public float delayTime = 60f;

	public void Start(){
		if(tp==null){
			// tp=gameObject.GetComponent<TweenPosition>();
		}
		// SetAniStart();
	}
	private int bossId=0;
	public void Update(){
		if(KBN.WorldBossController.singleton!= null)
			bossId=KBN.WorldBossController.singleton.GetCurBossId();

		if(bossId!=0){
			if(PlayerPrefs.GetInt(KBN.GameMain.singleton.getUserId()+"_"+KBN.Datas.singleton.worldid()+"_"+bossId+"_fly",0)==0&&
				PlayerPrefs.GetInt(KBN.GameMain.singleton.getUserId()+"_"+KBN.Datas.singleton.worldid()+"_"+bossId+"_fly_Start",0)==0){
				SetAniStart();
				PlayerPrefs.SetInt(KBN.GameMain.singleton.getUserId()+"_"+KBN.Datas.singleton.worldid()+"_"+bossId+"_fly_Start",1);
			}else if(PlayerPrefs.GetInt(KBN.GameMain.singleton.getUserId()+"_"+KBN.Datas.singleton.worldid()+"_"+bossId+"_fly",0)==1){
				SetAniStop();
			}


		}else{
			SetAniStop();
		}
	}

	public void SetAniStart(){
		if(tp!=null){
			tp.gameObject.SetActive(true);
			if (!IsInvoking("PlayAni")) 
			{
				 CancelInvoke("PlayAni");
			}
			InvokeRepeating("PlayAni",1,delayTime);
		}
		
	}

	private void PlayAni(){
		int r=Random.Range(1,4);
		switch(r){
			case 1:
				tp.transform.localPosition=from1;
				tp.transform.localEulerAngles=r2;
				TweenPosition.Begin(tp.gameObject,durationTime,to1);
				break;
			case 2:
				tp.transform.localPosition=from2;
				tp.transform.localEulerAngles=r1;
				TweenPosition.Begin(tp.gameObject,durationTime,to2);
				break;
			case 3:
				tp.transform.localPosition=from3;
				tp.transform.localEulerAngles=r1;
				TweenPosition.Begin(tp.gameObject,durationTime,to3);
				break;
		}


	}



	public void SetAniStop(){
		if (!IsInvoking("PlayAni")) 
		{
			 CancelInvoke("PlayAni");
		}
		if(tp!=null)
			tp.gameObject.SetActive(false);
	}
	
}
