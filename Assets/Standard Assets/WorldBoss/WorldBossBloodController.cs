using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class WorldBossBloodController : MonoBehaviour {

	public Camera mainCamera; //3为相机
    public Camera uiCamera;	  //UI相机
	public GameObject bloodPre;
	private Dictionary<string,GameObject> bloodObjs=new Dictionary<string,GameObject>();
	private Dictionary<string, GameObject> bossObjs;

	public void SetMainCamera(Camera camera){
		this.mainCamera=camera;
	}
	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		 //UpdateBlood();
	}

	private void UpdateBlood(){
		bossObjs=KBN.WorldBossController.singleton.GetBossObjDic;
		foreach(string key in bossObjs.Keys){
			if(bloodObjs.ContainsKey(key)){
				UpdateBloodObj(bloodObjs[key],bossObjs[key]);
			}else{
				//2d head blood
				GameObject bloodObj=GameObject.Instantiate(bloodPre) as GameObject; 
				bloodObj.transform.parent=uiCamera.transform;
				bloodObj.SetActive(true);
				bloodObj.transform.localScale=Vector3.one;
				bloodObj.name=key;   
				UpdateBloodObj(bloodObj,bossObjs[key]);
				bloodObjs.Add(key,bloodObj);
			}
		}
	}

	private void UpdateBloodObj(GameObject bloodObj,GameObject targetObj){
		Transform bloodPos = bloodObj.transform;

		KBN.GameMain.singleton.getMapController().bendCamera();
		Vector3 screenPoint = mainCamera.WorldToScreenPoint(new Vector3(targetObj.transform.localPosition.x, 1, targetObj.transform.localPosition.z));
		KBN.GameMain.singleton.getMapController().restoreCamera();                                                    
		Vector3 targetPos = uiCamera.ScreenToWorldPoint(screenPoint);                                                               
	    bloodPos.position = new Vector3(targetPos.x, targetPos.y, 0f);

	    PBMsgWorldBossSocket.PBMsgWorldBossSocket bossInfo=
	    	KBN.WorldBossController.singleton.GetWorldBossInfo(bloodObj.name);
	    if(bossInfo!=null){
	    	UISlider slider=bloodObj.transform.GetComponent<UISlider>();
	    	slider.sliderValue=bossInfo.blood/10000f;

	    	UILabel l=bloodObj.transform.Find("Label").GetComponent<UILabel>();
	    	l.text=bossInfo.blood/100f+"%";
	    }	    
	}

	public void KillBlood(){

	}
}
