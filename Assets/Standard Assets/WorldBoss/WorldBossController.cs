using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;
using UnityEngine;

namespace KBN
{
	public class WorldBossController : MonoBehaviour {

		public static WorldBossController singleton { get; protected set; }

		protected HashObject worldBossInfo;

		protected Dictionary<string, PBMsgWorldBossSocket.PBMsgWorldBossSocket> bossDic
			=new Dictionary<string, PBMsgWorldBossSocket.PBMsgWorldBossSocket>();

		protected Dictionary<string, GameObject> bossObjDic
			=new Dictionary<string, GameObject>();

		public bool isWorldBoss(int x,int y){
			return isWorldBoss(x.ToString(),y.ToString());
		}

		public string GetWorldBossTranform(int x,int y){
			foreach(PBMsgWorldBossSocket.PBMsgWorldBossSocket boss in bossDic.Values){
				int xValue=System.Math.Abs(boss.xCoord-x);
				int yValue=System.Math.Abs(boss.yCoord-y);
				if(xValue*xValue+yValue*yValue<=16){
					GameObject bossObj=GetBossObjByxy(boss.xCoord,boss.yCoord);
					if(bossObj!=null){
						return boss.xCoord+"_"+boss.yCoord;
					} 
					continue;
				}
			}
			return null;
		}

		public PBMsgWorldBossSocket.PBMsgWorldBossSocket GetCurBoss(){
			foreach(PBMsgWorldBossSocket.PBMsgWorldBossSocket boss in bossDic.Values){
				if(boss.status!=0&&boss.status!=4){
					return boss;
				}
			}
			return null;
		}

		public int GetCurBossId(){
			foreach(PBMsgWorldBossSocket.PBMsgWorldBossSocket boss in bossDic.Values){
				if(boss.status!=0&&boss.status!=4){
					return boss.bossId;
				}
			}
			return 0;
		}

		public bool IsFrontAttack(int bossX,int bossY,int marchX,int marchY){

			// Debug.LogWarning(bossX+"  "+bossY+"  "+marchX+"  "+marchY);

			// GameObject bossObj=GetBossObjByxy(bossX,bossY);
			// if(bossObj!=null){
				
			// }

			PBMsgWorldBossSocket.PBMsgWorldBossSocket bossInfo=GetWorldBossInfo(bossX,bossY);
			if(bossInfo!=null){
				Vector2 bossV=new Vector2(0,90f);
 				switch(bossInfo.direction){
					case 2:
						bossV=new Vector2(-90f,0);
						break;
					case 4:
						bossV=new Vector2(0,-90f);
						break;
					case 6:
						bossV=new Vector2(90f,0);
						break;
					case 8:
						bossV=new Vector2(0,90f);
						break;
				}

				// Debug.LogWarning("boss_v="+bossV.x+"  "+bossV.y);

				float x=bossX - marchX;
				float y=bossY - marchY;
				Vector2 bossM=new Vector2(x,y);

				// Debug.LogWarning("march_v="+bossM.x+"  "+bossM.y);

				float angle = Vector3.Angle (bossV, bossM);

				// Debug.LogWarning("angle="+angle);

				if(angle>90){
					return true;
				}
			}

			return false;
		}
		
		public bool isWorldBoss(string x, string y)
		{
			return bossDic.ContainsKey(string.Concat(x, "_", y));
		}

		public Dictionary<string, GameObject> GetBossObjDic
        {
            get{ return bossObjDic;}
        }

        public PBMsgWorldBossSocket.PBMsgWorldBossSocket GetWorldBossInfo(string key)
        {
            return bossDic.ContainsKey(key)?bossDic[key]:null;
        }

		public PBMsgWorldBossSocket.PBMsgWorldBossSocket GetWorldBossInfo(int x,int y)
		{
			return bossDic.ContainsKey(x+"_"+y)?bossDic[x+"_"+y]:null;
		}
		//boss信息变更
		//0:boss死亡; 1:boss常态; 2:boss狂暴; 3:boss虚弱;4:消失
		public void OnBossSocketMsgReceive(byte[] result)
		{
			if (result == null)
			{
				// UnityEngine.Debug.LogWarning("RallyController.OnRallySocketMsgReceive recive a empty packet!");
				return;
			}

			PBMsgWorldBossSocket.PBMsgWorldBossSocket boss = _Global.DeserializePBMsgFromBytes<PBMsgWorldBossSocket.PBMsgWorldBossSocket>(result);
			OnBossSocketMsgReceive(boss);
		}

		public void HideBossSelect()
		{
			PBMsgWorldBossSocket.PBMsgWorldBossSocket boss = GetCurBoss();
			if(boss != null && bossObjDic != null && bossObjDic.ContainsKey(boss.xCoord+"_"+boss.yCoord))
			{
				WorldBossBlood blood = bossObjDic[boss.xCoord+"_"+boss.yCoord].transform.Find("blood").GetComponent<WorldBossBlood>();
				blood.HideBossSelect();
			}
		}

		public void SelectBoss()
		{
			PBMsgWorldBossSocket.PBMsgWorldBossSocket boss = GetCurBoss();
			if(boss != null && bossObjDic != null && bossObjDic.ContainsKey(boss.xCoord+"_"+boss.yCoord))
			{
				WorldBossBlood blood = bossObjDic[boss.xCoord+"_"+boss.yCoord].transform.Find("blood").GetComponent<WorldBossBlood>();
				blood.SelectBoss();
			}
		}

		public void UnSelectBoss()
		{
			PBMsgWorldBossSocket.PBMsgWorldBossSocket boss = GetCurBoss();
			if(boss != null && bossObjDic != null && bossObjDic.ContainsKey(boss.xCoord+"_"+boss.yCoord))
			{
				WorldBossBlood blood = bossObjDic[boss.xCoord+"_"+boss.yCoord].transform.Find("blood").GetComponent<WorldBossBlood>();
				blood.UnSelectBoss();
			}
		}

		public bool IsFirstMeetWorldBoss(int bossId)
		{
			if(PlayerPrefs.HasKey(Constant.FIRST_MEET_WORLD_BOSS))
			{
				int id = PlayerPrefs.GetInt(Constant.FIRST_MEET_WORLD_BOSS);
				if(id == bossId)
				{
					return false;
				}
				else
				{
					return true;
				}
			}
			else
			{
				return true;
			}
		}

		//boss信息变更
		//0:boss死亡; 1:boss常态; 2:boss狂暴; 3:boss虚弱;
		public void OnBossSocketMsgReceive(PBMsgWorldBossSocket.PBMsgWorldBossSocket boss)
		{
			DateTime NowTime = DateTime.Now.ToLocalTime();
			NowTime.ToString("yyyy-MM-dd HH:mm:ss");

			// Debug.LogWarning(DateTime.Now.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss")+"===BOSS Base status : "+boss.status+",BOSS Base blood : "+boss.blood+"===");
			// Debug.LogWarning("===BOSS id : "+boss.bossId+",BOSS  : "+boss.xCoord+"==y="+boss.yCoord);
			if(bossDic.ContainsKey(boss.xCoord+"_"+boss.yCoord))
			{	
				PBMsgWorldBossSocket.PBMsgWorldBossSocket info=GetWorldBossInfo(boss.xCoord,boss.yCoord);
				if(boss.direction!=info.direction){
					Vector3 newRotation=GetLoacalRotation(boss.direction);
					SetBossRotation(boss.xCoord,boss.yCoord,newRotation);
				}
				if(boss.status==1){
					bossDic[boss.xCoord+"_"+boss.yCoord] = boss;
				}else if(boss.status==0){  //假死			
					SetBossState(boss.xCoord,boss.yCoord,
						Constant.WorldBossAnimationState.normal,
			        	Constant.WorldBOssAnimationAction.dead,
			        	Constant.WorldBossAnimationPar.frontalAttack
			        	);
					bossDic[boss.xCoord+"_"+boss.yCoord] = boss;
				}else if(boss.status==4){    //真死
					bossDic.Remove(boss.xCoord+"_"+boss.yCoord);
					if(bossObjDic.ContainsKey(boss.xCoord+"_"+boss.yCoord))
					{
						WorldBossBlood blood = bossObjDic[boss.xCoord+"_"+boss.yCoord].transform.Find("blood").GetComponent<WorldBossBlood>();
						blood.transform.localEulerAngles=GetBloodLoacalRotation(boss.direction);
						blood.SetProgress(0f, boss.status);
						bossObjDic[boss.xCoord+"_"+boss.yCoord].transform.localEulerAngles=GetLoacalRotation(boss.direction);

						bossObjDic.Remove(boss.xCoord+"_"+boss.yCoord);

						KBN.GameMain.singleton.getMapController().SetWorldMapShowWord(Datas.getArString("WorldBoss.Information_Text2"));
					}
					
					SetBossState(boss.xCoord,boss.yCoord,
						Constant.WorldBossAnimationState.normal,
			        	Constant.WorldBOssAnimationAction.reallyDead,
			        	Constant.WorldBossAnimationPar.frontalAttack
			        	);
				}
				else{
					bossDic[boss.xCoord+"_"+boss.yCoord] = boss;
				}

				SetBoss(boss.xCoord,boss.yCoord,boss.status);
				string key=boss.xCoord+"_"+boss.yCoord;

				if(bossObjDic.ContainsKey(key)){
					if(bossObjDic[key] != null)
					{
						info=bossDic[key];
						WorldBossBlood blood = bossObjDic[key].transform.Find("blood").GetComponent<WorldBossBlood>();
						blood.transform.localEulerAngles=GetBloodLoacalRotation(info.direction);
						blood.SetProgress(info.blood / 10000f, boss.status);

						// bossObjDic[key].transform.localEulerAngles=newRotation;
					}
				}
			}
			else
			{
				bossDic.Add(boss.xCoord+"_"+boss.yCoord, boss);
			}
		}

		private void UpdateBossStatues(string key,int status){
			if(bossObjDic.ContainsKey(key)){
				// SetBossState
			}
		}

		private GameObject WorldBossListObj;
		//增加boss obj，并设置位置信息
		public void RefreshBossObj(GameObject obj,int x,int y){
			if(obj==null)
				return;	

			if(WorldBossListObj==null){
				WorldBossListObj=GameObject.Find("WorldBossListObj");
				if(WorldBossListObj==null){
					WorldBossListObj=new GameObject("WorldBossListObj") as GameObject;
				}
			}
			var key=x+"_"+y;
			PBMsgWorldBossSocket.PBMsgWorldBossSocket info=GetWorldBossInfo(x,y);
			if(bossDic.ContainsKey(key)){

				if(bossObjDic.ContainsKey(key)){
					if(bossObjDic[key] != null)
					{
						WorldBossBlood blood = bossObjDic[key].transform.Find("blood").GetComponent<WorldBossBlood>();
						blood.transform.localEulerAngles=GetBloodLoacalRotation(info.direction);
						blood.SetProgress(info.blood / 10000f, info.status);
						bossObjDic[key].transform.localEulerAngles=GetLoacalRotation(info.direction);
					}
				}else{				
					GameObject pre=GameObject.Instantiate(TextureMgr.instance().LoadPrefab("Model/WorldBoss/boss")) as GameObject;  //初始化
					pre.transform.parent=obj.transform;
					pre.transform.localPosition=Vector3.zero;
					pre.transform.localScale=new Vector3(0.01f,0.01f,0.01f);
					pre.name=x+"_"+y;
					pre.transform.parent=WorldBossListObj.transform;
					pre.SetActive(true);
					pre.transform.localPosition=
						new Vector3(pre.transform.localPosition.x,pre.transform.localPosition.y+0.2f,pre.transform.localPosition.z);
					pre.transform.localScale=new Vector3(7f,7f,7f);
					pre.transform.localEulerAngles=GetLoacalRotation(info.direction);

					WorldBossBlood blood = pre.transform.Find("blood").GetComponent<WorldBossBlood>();
					blood.transform.localEulerAngles=GetBloodLoacalRotation(info.direction);
					blood.SetProgress(info.blood / 10000f, info.status);

					bossObjDic.Add(key,pre);

					if(PlayerPrefs.GetInt(GameMain.singleton.getUserId()+"_"+Datas.singleton.worldid()+"_"+info.bossId+"_fly",0)!=1){
						PlayerPrefs.SetInt(GameMain.singleton.getUserId()+"_"+Datas.singleton.worldid()+"_"+info.bossId+"_fly",1);
					}

					SetBoss(info.xCoord,info.yCoord,info.status);
					
				}
			}else{
				if(bossObjDic.ContainsKey(key)){
					bossObjDic.Remove(key);
				}
				// killBoss(x,y);
				SetBossState(x,y,
					Constant.WorldBossAnimationState.normal,
		        	Constant.WorldBOssAnimationAction.reallyDead,
		        	Constant.WorldBossAnimationPar.frontalAttack
		        	);
			}
		}

		public void KillAllBoss(){
			if(WorldBossListObj!=null){
				bossDic.Clear();
				bossObjDic.Clear();
				Destroy(WorldBossListObj);
			}
		}

		// public void killBoss(int x,int y){
		// 	GameObject willDeadBoss=GetBossObjByxy(x,y);
		// 	if(willDeadBoss!=null){
		// 		SetBossState(x,y,1,"dead");

		// 		KBN.KillSelf killSelf=willDeadBoss.transform.GetComponent<KBN.KillSelf>();
		// 		killSelf.Kill();
		// 	}
			
		// }

		public void SetBoss(int x,int y,int state){
			GameObject willDeadBoss=GetBossObjByxy(x,y);
			if(willDeadBoss!=null){
				KBN.KillSelf killSelf=willDeadBoss.transform.GetComponent<KBN.KillSelf>();
				killSelf.SetBossState(state);
			}
			
		}

		private void SetBossRotation(int x,int y,Vector3 rotation){
			GameObject willDeadBoss=GetBossObjByxy(x,y);
			if(willDeadBoss!=null){
				KBN.KillSelf killSelf=willDeadBoss.transform.GetComponent<KBN.KillSelf>();
				killSelf.SetBossRotation(rotation);
			}
		}

		public GameObject GetBossObjByxy(int x,int y){
			if(WorldBossListObj==null){
				WorldBossListObj=GameObject.Find("WorldBossListObj");
				if(WorldBossListObj==null){
					WorldBossListObj=new GameObject("WorldBossListObj") as GameObject;
				}
			}
			Transform obj=WorldBossListObj.transform.Find(x+"_"+y);
			if(obj!=null){
				return obj.gameObject;
			}
			return null;
			
		}
		//最新动画控制
		public void SetBossState(int x,int y,int state,int action,int par){
			GameObject obj=GetBossObjByxy(x,y);
			if(obj!=null){
				KillSelf killSelf=obj.transform.GetComponent<KillSelf>();
				killSelf.PlayBossAni(state,action,par);
			}
		}
		public void SetBossState(string key,int state,int action,int par){

			string[] arr=key.Split('_');

			if(arr[0]!=null&&arr[1]!=null){
				int x=int.Parse(arr[0]);
				int y=int.Parse(arr[1]);
				SetBossState(x,y,state,action,par);
			}
			
		}

		private Vector3 GetLoacalRotation(int direction){
			float y=540f+direction*45;
			y=y%360f;
			// Debug.LogWarning("GetLoacalRotation.y="+y);
			return new Vector3(0,y,0);
		}
		
		private Vector3 GetBloodLoacalRotation(int direction){
			float y=135f-(direction-2)*45;
			return new Vector3(-50,y,2);
		}

		public Action<PBMsgWorldBossInfo.PBMsgWorldBossInfo> okGetWorldBossListFunc;
		public void getWorldBossList(Action<PBMsgWorldBossInfo.PBMsgWorldBossInfo> okFunc)
		{
			string url = "getWorldBossList.php";

			okGetWorldBossListFunc = okFunc;
			UnityNet.RequestForGPB (url,null,OkMsgGetWorldBossList,null,true); 
		}

		private void OkMsgGetWorldBossList(byte[] result)
		{
			PBMsgWorldBossInfo.PBMsgWorldBossInfo msgPBMsgWorldBossInfo  = null;
			if(result == null)
			{
				// if(okGetWorldBossListFunc != null)
				// {
				// 	okGetWorldBossListFunc(msgPBMsgWorldBossInfo);
				// }
				KillAllBoss();
				return;
			}
			msgPBMsgWorldBossInfo  = _Global.DeserializePBMsgFromBytes<PBMsgWorldBossInfo.PBMsgWorldBossInfo> (result);
			if(okGetWorldBossListFunc != null)
			{
				okGetWorldBossListFunc(msgPBMsgWorldBossInfo);
			}
		}
	}

}


