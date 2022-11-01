
import System.Collections.Generic;

public class UGUIMonsterMenu extends MonoBehaviour
{
	public var bossName:UILabel;
	public var blood:UISlider;
	public var backGround:UITexture;
	public var bossIcon:UITexture;
	public var attackBtnText:UILabel;
	public var attackCostText:UILabel;
	public var pool:UILabel;
	public var timeLabel:UILabel;
	public var myItemsCount:UILabel;

	public var eventObject:GameObject;
	public var eventLabel:UILabel;

	public var particles:GameObject[];

	public var GetRewardTip:GameObject;
	public var TweenP:TweenScale;
	public var getRewardTitle:UILabel;
	public var getRewardDes:UILabel;
	public var priceCount:UILabel;
	public var getRewardPartic:GameObject;

	public var root:UIRoot;
	public var tops:GameObject[];
	public var buttoms:GameObject[];

	public var nsBg:GameObject;
	public var nsBg2:GameObject;
	public var animatorList:Animator[];
	public var nsTS:TweenScale;

	public var isDeadFinsh:boolean=true;

	private var p_bossType:int;
	private var p_data:MonsterEventData;

	private var baojiObj:GameObject;
	public var baojiPre:GameObject;
	public var baojiParent:GameObject;

	public var btnbg:UISprite;
	public var NotEnoghLabel:UILabel;

	public var bossRunObj:UIPanel;
	public var noticePanel:UIPanel;
	public var noticeLabel:UILabel;
	public var noticeTA:TweenAlpha;

	public var godnoticePanel:UIPanel;
	public var godnoticeLabel:UILabel;
	public var godnoticeTA:TweenAlpha;

	public var sliderTxt:UILabel;

	public var poolTS:TweenScale;
	public var boosTP:TweenPosition;
	public var boosTS:TweenScale;

	public var buttomBg:UISprite;

	public var freeGod:GameObject;

	public var objs:GameObject[];
	public var tp_f:float=0.47f;

	public var mask_TA:TweenAlpha;

	public var worldCamera:Camera;
	public var nguiCamera:Camera;
	public var nsCamera:Camera;
	public var poolTexiao:GameObject;
	public var poolPos:GameObject;
	public var nsTrarget1:GameObject;
	public var nsTrarget2:GameObject;
	public var nsTrarget3:GameObject;
	public var nsTX1:GameObject;
	public var nsTX2:GameObject;
	public var nsTX3:GameObject;

	public var btnTi:GameObject;

	public var eventObj:GameObject;

	public var stateBg:GameObject;

	private function ChangePoolTexiaoPosition()
	{
		var pos:Vector3=nguiCamera.WorldToScreenPoint(poolPos.transform.position);
		pos=worldCamera.ScreenToWorldPoint(pos);
		poolTexiao.transform.position=pos;

		var pos1:Vector3=nguiCamera.WorldToScreenPoint(nsTrarget1.transform.position);
		pos1=nsCamera.ScreenToWorldPoint(pos1);
		nsTX1.transform.position=pos1;

		var pos2:Vector3=nguiCamera.WorldToScreenPoint(nsTrarget2.transform.position);
		pos2=nsCamera.ScreenToWorldPoint(pos2);
		nsTX2.transform.position=pos2;

		var pos3:Vector3=nguiCamera.WorldToScreenPoint(nsTrarget3.transform.position);
		pos3=nsCamera.ScreenToWorldPoint(pos3);
		nsTX3.transform.position=pos3;
	}

	public function PlayTPForAnchor(isOpen:boolean)
	{
		for (var i = objs.length - 1; i >= 0; i--) {
			var v:Vector3=new Vector3(objs[i].transform.localPosition.x,objs[i].transform.localPosition.y+1500,objs[i].transform.localPosition.z);
			var v2:Vector3=new Vector3(objs[i].transform.localPosition.x,objs[i].transform.localPosition.y-1500,objs[i].transform.localPosition.z);
			if (isOpen) {TweenPosition.Begin(objs[i],tp_f,v);}
			else{TweenPosition.Begin(objs[i],0.01f,v2);}
			
		}
	}
	private function SetGodnessActive(active:boolean)
	{
		for (var i = animatorList.length - 1; i >= 0; i--) {
			animatorList[i].enabled=active;
		}
		// nsTS.style=active?UITweener.Style.PingPong:UITweener.Style.Once;
		if (active) 
		{			
			nsTS.enabled=true;
			nsTS.ResetToBeginning();
			nsTS.PlayForward();
		}else{
			nsTS.enabled=false;
			nsTS.ResetToBeginning();
			pool.transform.localScale=new Vector3(1.3f,1.3f,1.3f);
		}
		if (active) {nsTX3.SetActive(false);nsTX3.SetActive(true);}

	}
	public function LateUpdate() 
	{
		ChangePoolTexiaoPosition();
	}

	function Awake()
	{
		if (KBN._Global.isIphoneX())
		{
			root.manualHeight=1600;
			for (var i = tops.length - 1; i >= 0; i--) {
				tops[i].transform.localPosition=new Vector3(tops[i].transform.localPosition.x,-75-1500,tops[i].transform.localPosition.z);
			}
			for (var j = buttoms.length - 1; j >= 0; j--) {
				buttoms[j].transform.localPosition=new Vector3(buttoms[j].transform.localPosition.x,40-1500,buttoms[j].transform.localPosition.z);
			}
			buttomBg.transform.localPosition=new Vector3(buttomBg.transform.localPosition.x,-379,buttomBg.transform.localPosition.z);
			freeGod.transform.localPosition=new Vector3(freeGod.transform.localPosition.x,252,freeGod.transform.localPosition.z);
			eventObj.transform.localPosition=new Vector3(0,-248,0);
			backGround.height=root.manualHeight-250;
		}
		else
		{
			root.manualHeight=1365;
			buttomBg.transform.localPosition=new Vector3(buttomBg.transform.localPosition.x,-342,buttomBg.transform.localPosition.z);
			freeGod.transform.localPosition=new Vector3(freeGod.transform.localPosition.x,228,freeGod.transform.localPosition.z);		
			eventObj.transform.localPosition=new Vector3(0,-224,0);
			backGround.height=root.manualHeight-100;
		}	
		backGround.width=root.manualHeight*Screen.width/Screen.height;
		
		// ChangePoolTexiaoPosition();
		
		if (!IsInvoking("NewPoolTween")) 
		{
			 InvokeRepeating("NewPoolTween",0.2,0.2);
		}
	}

	function Start()
	{
		if (!IsInvoking("InvokeTweenEvent")) 
		{
			InvokeRepeating("InvokeTweenEvent",2,22.5);
		}
		NotEnoghLabel.text=Datas.getArString("Labyrinth.NotEnogh");
		if (!IsInvoking("Zhayan")) 
		{
			 InvokeRepeating("Zhayan",2,5);
		}
		ChangePoolTexiaoPosition();
		
	}
	function OnDestroy()
	{
		CancelInvoke("InvokeTweenEvent");
		CancelInvoke("NewPoolTween");
	}
	private function InvokeTweenEvent()
	{
		var count:int = MonsterController.instance().monsterEventList.Count;
		if (count>0)
		{
			isMid=true;
			var eventData:MonsterPoolEventData=MonsterController.instance().monsterEventList[0];
			eventObject.SetActive(true);
			eventLabel.text=Datas.getArString("Chat.Labyrinth_Text1",[eventData.serverName,eventData.playerName,eventData.gems.ToString()]);
			// eventLabel.text=eventData.logId+" "+eventData.playerId+" "+eventData.playerName+" "+eventData.serverName+" "+eventData.gems;
			var tp:TweenPosition=TweenPosition.Begin(eventLabel.gameObject,10,new Vector3(-600,0,0));
			tp.SetOnFinished(TweenMid);
//			tp.RemoveOnFinished(TweenFinish);
			MonsterController.instance().monsterEventList.RemoveAt(0);
		}
	}
	private var isMid=true;
	public function TweenMid()
	{
		if(isMid)
		{
			eventLabel.transform.localPosition=new Vector3(600,0,0);
			var tp:TweenPosition=TweenPosition.Begin(eventLabel.gameObject,10,new Vector3(-600,0,0));
			tp.SetOnFinished(TweenMid);
			isMid=false;
		}else{
			isMid=true;
			TweenFinish();
		}
		
		
	}

	public function TweenFinish()
	{
		eventObject.SetActive(false);
		eventLabel.transform.localPosition=new Vector3(600,0,0);
	}

	public function Refresh(bossType:int,data:MonsterEventData,refreshType:int):void 
	{
		p_bossType=bossType; p_data=data;
		if (data.isDead==1)
	    {
	    	DeadTAShow(bossIcon.gameObject,false);
	    }
	    else if (data.isRun==1)
	    {
	    	ShowNotice(3);
	    	DeadTAShow(bossRunObj.gameObject,true);
	    }
		timeLabel.text=Datas.getArString("Labyrinth.TimeEnd")+"[f34f34]"+MonsterController.instance().GetLeftTime();
		myItemsCount.text=KBN.MyItems.singleton.GetItemCount(4201).ToString();
		print("UGUI--Monster--Refresh");
		if (bossType == 1) {   //commmon
			bossName.text=Datas.getArString(data.commonName);
			if (isDeadFinsh) 
			{
				TweenSlider.Begin(blood,0.2f,data.curCommonBossBlood/100.00);
				sliderTxt.text=(data.curCommonBossBlood>50?"[000000]":"[ffffff]")+data.curCommonBossBlood+"%";
				// ShowTA(bossIcon);
				backGround.mainTexture=TextureMgr.singleton.LoadTexture(data.commonBackground, TextureType.MONSTER_BG) as Texture;//Resources.Load("Textures/UGUI/MonsterBoss/background/"+data.commonBackground) as Texture;
				bossIcon.mainTexture=TextureMgr.singleton.LoadTexture(data.commonPicture, TextureType.MONSTER_BOSS) as Texture;//Resources.Load("Textures/UGUI/MonsterBoss/boss/"+data.commonPicture) as Texture;
			}
			if (refreshType==3)
			{
				// pool.text=data.curCommonPool.ToString();
				SetPool(data.curElitePool,data.curCommonPool);
			}
			else{
				// if (data.curCommonPool.ToString()!=pool.text)
				// {
				// 	poolTS.ResetToBeginning();
				// 	TweenText.Begin(pool,8f,data.curCommonPool);
				// 	poolTS.PlayForward();
				// }
				SetPool(curPool,data.curCommonPool);
			}
			if (data.dailyFree>0||data.commonFree>0)
			{
				// btnbg.spriteName="attack";
				btnbg.gameObject.SetActive(false);
				attackBtnText.text=Datas.getArString("Labyrinth.Attack_Text2");
				NotEnoghLabel.gameObject.SetActive(false);
				btnTi.SetActive(false);
				attackBtnText.transform.localPosition=new Vector3(0,0,0);

			}else if (data.GetCurCost(bossType)<=KBN.MyItems.singleton.GetItemCount(4201)) 
			{
				btnbg.gameObject.SetActive(false);

				// btnbg.spriteName="attack";
				attackBtnText.text=Datas.getArString("Labyrinth.Attack_Text1");
				attackCostText.text=data.commonCost.ToString();
				NotEnoghLabel.gameObject.SetActive(false);
				btnTi.SetActive(true);
				attackBtnText.transform.localPosition=new Vector3(0,8,0);

			}else
			{
				btnbg.gameObject.SetActive(true);

				// btnbg.spriteName="attack";
				attackBtnText.text=Datas.getArString("Labyrinth.Attack_Text1");
				attackCostText.text=data.commonCost.ToString();
				NotEnoghLabel.gameObject.SetActive(true);
				btnTi.SetActive(true);
				attackBtnText.transform.localPosition=new Vector3(0,8,0);
			}
			nsBg.SetActive(data.commonFree>0);
			nsBg2.SetActive(data.commonFree>0);
			SetGodnessActive(data.commonFree>0);
			ShowNotice((data.commonFree&&refreshType==2)>0?2:0);
			if (data.curCommonSort==2&&refreshType==2&&data.curCommonBossBlood==100)
			{
				ShowNotice(1);
			}
		}
		else if (bossType == 2) {   //commmon
			bossName.text=Datas.getArString(data.eliteName);
			if (isDeadFinsh)
			{
				// ShowTA(bossIcon);
				TweenSlider.Begin(blood,0.2f,data.curEliteBossBlood/100.00);
				sliderTxt.text=(data.curEliteBossBlood>50?"[000000]":"[ffffff]")+data.curEliteBossBlood+"%";
				backGround.mainTexture=TextureMgr.singleton.LoadTexture(data.eliteBackground, TextureType.MONSTER_BG);//Resources.Load("Textures/UGUI/MonsterBoss/background/"+data.eliteBackground) as Texture;
				bossIcon.mainTexture=TextureMgr.singleton.LoadTexture(data.elitePicture, TextureType.MONSTER_BOSS);//Resources.Load("Textures/UGUI/MonsterBoss/boss/"+data.elitePicture) as Texture;
			} 
			if (refreshType==3)
			{
				// pool.text=data.curElitePool.ToString();
				SetPool(data.curElitePool,data.curElitePool);
			}
			else
			{
				// if (data.curElitePool.ToString()!=pool.text)
				// {
				// 	poolTS.ResetToBeginning();
				// 	TweenText.Begin(pool,8f,data.curElitePool);
				// 	poolTS.PlayForward();
				// }
				SetPool(curPool,data.curElitePool);
			}
			
			if (data.eliteFree>0)
			{
				// btnbg.spriteName="attack";
				btnbg.gameObject.SetActive(false);
				attackBtnText.text=Datas.getArString("Labyrinth.Attack_Text2");
				NotEnoghLabel.gameObject.SetActive(false);
				btnTi.SetActive(false);
				attackBtnText.transform.localPosition=new Vector3(0,0,0);


			}else if (data.GetCurCost(bossType)<=KBN.MyItems.singleton.GetItemCount(4201)) 
			{
				// btnbg.spriteName="attack";
				btnbg.gameObject.SetActive(false);
				attackBtnText.text=Datas.getArString("Labyrinth.Attack_Text1");
				attackCostText.text=data.eliteCost.ToString();
				NotEnoghLabel.gameObject.SetActive(false);
				btnTi.SetActive(true);
				attackBtnText.transform.localPosition=new Vector3(0,8,0);


			}else
			{
				// btnbg.spriteName="attack";
				btnbg.gameObject.SetActive(true);
				attackBtnText.text=Datas.getArString("Labyrinth.Attack_Text1");
				attackCostText.text=data.eliteCost.ToString();
				NotEnoghLabel.gameObject.SetActive(true);
				btnTi.SetActive(true);
				attackBtnText.transform.localPosition=new Vector3(0,8,0);
				

			}
			nsBg.SetActive(data.eliteFree>0);
			nsBg2.SetActive(data.eliteFree>0);
			SetGodnessActive(data.eliteFree>0);
			ShowNotice((data.eliteFree&&refreshType==2)>0?2:0);
			if (data.curEliteSort==2&&refreshType==2&&data.curEliteBossBlood==100)
			{
				ShowNotice(1);
			}
			
		}
		if (data.crit>0) 
		{
			Tweenparticle(data.crit);
			// CameraShake.ShakeFor (0.2f, 20f);
			boosTP.ResetToBeginning();
			boosTP.PlayForward();
			boosTS.ResetToBeginning();
			boosTS.PlayForward();
			if (data.crit>1)
			{
				if (baojiObj!=null)
				{
					Destroy(baojiObj.gameObject);
				}
				var obj:GameObject=GameObject.Instantiate(baojiPre) as GameObject;
				obj.transform.parent=baojiParent.transform;
				obj.transform.localPosition=new Vector3(0,60,0);
				obj.transform.localScale=Vector3.one;
				obj.SetActive(true);
				obj.transform.Find("baoji").GetComponent(UISprite).spriteName=data.crit.ToString();
				baojiObj=obj;
			}
		}	
		if (data.dropGems!=0) 
		{
			// OpenTip();
			// Invoke("OpenTip",1.2f);
		   // MenuMgr.getInstance().PushMenu("MonsterGetRewardTip", data,"");
		   // OpenTipNew();
		   Invoke("OpenTipNew",1.3f);
			
		}

	}

	public function RefreshPool(bossType:int,data:MonsterEventData):void
	{
		if (bossType == 1) {   //commmon
			if (data.curCommonPool.ToString()!=pool.text)
				{
					// poolTS.ResetToBeginning();
					// TweenText.Begin(pool,8f,data.curCommonPool);
					// poolTS.PlayForward();

					// RefreshPoolCoutt(data.curCommonPool);
					SetPool(curPool,data.curCommonPool);
				}
		}
		if (bossType == 2) {   //commmon
			if (data.curElitePool.ToString()!=pool.text)
				{
					// poolTS.ResetToBeginning();
					// TweenText.Begin(pool,8f,data.curElitePool);
					// poolTS.PlayForward();

					// RefreshPoolCoutt(data.curElitePool);
					SetPool(curPool,data.curElitePool);
				}
			
		}
	}
	private var curPool:int;
	private var curTarget:int;
	private function SetPool(cur:int,tar:int)
	{
		curPool=cur;
		curTarget=tar;
	}
	private function NewPoolTween()
	{
		if (curPool+100<curTarget)
		{
			pool.text=curPool.ToString();
			TweenText.Begin(pool,0.2f,curTarget-100);
			poolTS.ResetToBeginning();	
			poolTS.PlayForward();
			curPool=curTarget-100;
		}else if (curPool>=curTarget)
		{
			pool.text=curTarget.ToString();
			curPool=curTarget;
		}
		else
		{
			if (curPool+5>curTarget) 
			{
				pool.text=curPool.ToString();
				TweenText.Begin(pool,0.2f,curTarget);
				poolTS.ResetToBeginning();	
				poolTS.PlayForward();
				curPool=curTarget;
			}else
			{
				pool.text=curPool.ToString();
				TweenText.Begin(pool,0.2f,curPool+5);
				poolTS.ResetToBeginning();	
				poolTS.PlayForward();
				curPool=curPool+5;
			}
			
		}
	}

	private function RefreshPoolCoutt(count:int)
	{
		pool.text="0";
		TweenText.Begin(pool,4f,count);
		poolTS.style=UITweener.Style.Loop;
		poolTS.ResetToBeginning();	
		poolTS.PlayForward();
		Invoke("StopRefreshPool",4f);
	}
	public function StopRefreshPool()
	{
		poolTS.ResetToBeginning();
		poolTS.style=UITweener.Style.Once;
	}

	private function ShowNotice(type:int)
	{
		if (type==0) {return;}
		if (type==1)
		{
			ShowNoticeBoss();
		}
		else if (type==2)
		{
			ShowNoticeGoddess();
		}
		else if (type==3)
		{
			ShowNoticeBossRun();
		}
	}
	private var taShowNotice:TweenAlpha;
	private function ShowNoticeBoss()
	{
		if (godnoticePanel.gameObject.active) 
		{
			noticePanel.transform.localPosition=new Vector3(0,-541,0);
			godnoticePanel.transform.localPosition=new Vector3(0,-687,0);
		}else{
			noticePanel.transform.localPosition=new Vector3(0,-650,0);
			godnoticePanel.transform.localPosition=new Vector3(0,-650,0);
		}
		noticePanel.gameObject.SetActive(true);
		// noticePanel.alpha=1;
		// taShowNotice=TweenAlpha.Begin(noticePanel.gameObject,1.5,0.5);
		// taShowNotice.AddOnFinished(ShowNoticeEnd);
		noticeLabel.text=Datas.getArString("Labyrinth.Information_Text3");

		noticeTA.ResetToBeginning();
		noticeTA.delay=2f;
		noticeTA.PlayForward();
	}
	private function ShowNoticeGoddess()
	{
		if (noticePanel.gameObject.active) 
		{
			noticePanel.transform.localPosition=new Vector3(0,-541,0);
			godnoticePanel.transform.localPosition=new Vector3(0,-687,0);
		}else{
			noticePanel.transform.localPosition=new Vector3(0,-650,0);
			godnoticePanel.transform.localPosition=new Vector3(0,-650,0);
		}
		godnoticePanel.gameObject.SetActive(true);
		// noticePanel.alpha=1;
		// taShowNotice=TweenAlpha.Begin(noticePanel.gameObject,1.5,0.5);
		// taShowNotice.AddOnFinished(ShowNoticeEnd);
		godnoticeLabel.text=Datas.getArString("Labyrinth.Information_Text4");
		godnoticeTA.ResetToBeginning();
		godnoticeTA.delay=0f;
		godnoticeTA.PlayForward();
	}
	private function ShowNoticeBossRun()
	{
		if (godnoticePanel.gameObject.active) 
		{
			noticePanel.transform.localPosition=new Vector3(0,-541,0);
			godnoticePanel.transform.localPosition=new Vector3(0,-687,0);
		}else{
			noticePanel.transform.localPosition=new Vector3(0,-650,0);
			godnoticePanel.transform.localPosition=new Vector3(0,-650,0);
		}
		noticePanel.gameObject.SetActive(true);
		// noticePanel.alpha=1;
		// taShowNotice=TweenAlpha.Begin(noticePanel.gameObject,1.5,0.5);
		// taShowNotice.AddOnFinished(ShowNoticeEnd);
		noticeLabel.text=Datas.getArString("Labyrinth.Information_Text5");

		noticeTA.ResetToBeginning();
		noticeTA.delay=0f;
		noticeTA.PlayForward();
	}
	public function ShowNoticeEnd():void
	{
		noticePanel.gameObject.SetActive(false);
	}
	public function ShowGodNoticeEnd():void
	{
		godnoticePanel.gameObject.SetActive(false);
	}

	private function ShowTA(obj:UITexture)
	{
		obj.alpha=0;
		TweenAlpha.Begin(obj.gameObject,0.1,1);
	}
	private var deadTA:TweenAlpha;
	public function DeadTAShow(obj:GameObject,isRun:boolean)
	{
		mask_TA.ResetToBeginning();
		mask_TA.PlayForward();
		if (isRun)
		{
			bossRunObj.gameObject.SetActive(true);
			// bossIcon.gameObject.SetActive(false);
			// TweenAlpha.Begin(bossIcon.gameObject,0.2,0);
			bossIcon.alpha=0;
		}else
		{
			TweenSlider.Begin(blood,0.2f,0);
			sliderTxt.text="[ffffff]"+"0%";
		}
		
		
		deadTA=TweenAlpha.Begin(obj,2,0);
		deadTA.AddOnFinished(DeadTAShowFinsh);
		isDeadFinsh=false;
	}
	public function DeadTAShowFinsh():void
	{
		isDeadFinsh=true;
		bossIcon.alpha=1;
		bossRunObj.alpha=1;
		bossRunObj.gameObject.SetActive(false);
		bossIcon.gameObject.SetActive(true);

		if (p_bossType==1) 
		{
			blood.value=1;
			sliderTxt.text="[000000]"+"100%";
			// ShowTA(bossIcon);
			backGround.mainTexture=TextureMgr.singleton.LoadTexture(p_data.commonBackground, TextureType.MONSTER_BG) as Texture;//Resources.Load("Textures/UGUI/MonsterBoss/background/"+p_data.commonBackground) as Texture;
			bossIcon.mainTexture=TextureMgr.singleton.LoadTexture(p_data.commonPicture, TextureType.MONSTER_BOSS) as Texture;//Resources.Load("Textures/UGUI/MonsterBoss/boss/"+p_data.commonPicture) as Texture;
		}else if (p_bossType==2)
		{
			blood.value=1;
			sliderTxt.text="[000000]"+"100%";
			// ShowTA(bossIcon);
			backGround.mainTexture=TextureMgr.singleton.LoadTexture(p_data.eliteBackground, TextureType.MONSTER_BG) as Texture;//Resources.Load("Textures/UGUI/MonsterBoss/background/"+p_data.eliteBackground) as Texture;
			bossIcon.mainTexture=TextureMgr.singleton.LoadTexture(p_data.elitePicture, TextureType.MONSTER_BOSS) as Texture;//Resources.Load("Textures/UGUI/MonsterBoss/boss/"+p_data.elitePicture) as Texture;
		}
	}
	private function Tweenparticle(crit:int)
	{
		if (IsInvoking("InvokeStopTween")) 
		{
			CancelInvoke("InvokeStopTween");
			InvokeStopTween();
		}
		if (particles[crit-1]!=null)
		{
			particles[crit-1].SetActive(true);
			Invoke("InvokeStopTween",1);
		}
	}
	private function InvokeStopTween():void
	{
		for(var i:int=0;i<particles.length;i++)
		{
			if (particles[i].gameObject.active)
			{
				particles[i].SetActive(false);
			}
		}
	}
	private function OpenTipNew()
	{
		var m:MonsterMenu=MenuMgr.getInstance().GetCurMenu() as MonsterMenu;
		m.OpenTip(p_data.dropGems);
		p_data.dropGems=0;
	}

	private function OpenTip()
	{
		Payment.instance().AddShadowGems(p_data.dropGems);
		getRewardTitle.text=Datas.getArString("Labyrinth.GetRewardTip");
		getRewardDes.text=Datas.getArString("Labyrinth.Tips_Text2");
		priceCount.text=p_data.dropGems.ToString();
		GetRewardTip.gameObject.SetActive(true);
		// TweenP.Play(true);
		getRewardPartic.gameObject.SetActive(true);
		p_data.dropGems=0;
	}

	public function CloseTip()
	{
		GetRewardTip.gameObject.SetActive(false);
		getRewardPartic.gameObject.SetActive(false);
	}

	public function RefreshItem()
	{
		myItemsCount.text=KBN.MyItems.singleton.GetItemCount(4201).ToString();
	}
	public var eyesObj:GameObject;
	private function Zhayan()
	{
		eyesObj.SetActive(true);
		Invoke("biyan",0.5f);
	}
	private function biyan()
	{
		eyesObj.SetActive(false);
	}

}