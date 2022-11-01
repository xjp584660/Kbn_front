using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;
public class MapOtherPlayerMove : MonoBehaviour {
	private int MarchId = 0;
	private string updateKey="";
	private int carmotMarchStatues=0;
	// Use this for initialization
	void Start () {
		MapController.UpdataCarmotEvent+=OnUpdateCarmot;
	
	}
	
	/// <summary>
	/// Raises the update carmot event.
	/// </summary>
	/// <param name="key">Key.</param>
	void OnUpdateCarmot(string coordXY,string marchId){
		// if(updateKey!=coordXY || _Global.INT32(marchId)!=this.MarchId ){
		// 	return;
		// }
		// HashObject marchtable=CollectionResourcesMgr.instance().tilesResourcesInfos["data"][coordXY]["carmot_march"];
		// if(marchtable!=null){
		// 	int mystatues= _Global.INT32(marchtable[marchId]["marchStatus"].Value);
		// 	if(mystatues!=carmotMarchStatues){
		// 		//				if(mystatues==8 && carmotMarchStatues==2 || mystatues==2 && carmotMarchStatues==1 ){//update report,collect report || attack report
		// 		if(mystatues!=1 && mystatues!=0){
		// 			PlayerPrefs.SetInt("loadReport",1);
		// 		}
		// 		GameMain.singleton.seedUpdate(true);
		// 		carmotMarchStatues=mystatues;
		// 	}
		// }
		
		
	}

	public void setMarchId(int marchId){
		this.MarchId=marchId;
	}

	public void setupdateKey(string updateKey){
		this.updateKey=updateKey;
	}
}
