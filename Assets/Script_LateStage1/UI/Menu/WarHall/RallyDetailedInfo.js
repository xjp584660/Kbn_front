public class RallyDetailedInfo extends UIObject
{
	private var nc : NavigatorController;
	public var detailedData : KBN.RallyDetailedData;
	public var rallyData : PBMsgRallySocket.PBMsgRallySocket;

	public var btnBack : Button;
	public var toName : Label;
	public var fromName : Label;
	public var toXYBtn : Button;
	public var fromXYBtn : Button;
	public var timeProgressBar : ProgressBarWithBg;
	public var updateTime : Label;
	public var toUserPhoto : Label;
	public var slot : Label;
	public var marchSize : Label;
	public var toUserName : Label;
	public var scrollView : ScrollView;
	public var line : Label;
	public var backGround : Label;
	public var btnJion : Button;

	public var parnerInfoItem : RallyParnerInfoItem;
    public var rallyParnerInfoItems : List.<RallyParnerInfoItem>;

	function Init(nc : NavigatorController)
	{
		this.nc = nc;

		btnBack.OnClick = backToRallyPanel;
		btnJion.OnClick = jionRally;
		btnJion.txt = Datas.getArString("WarHall.Jion"); 
		toXYBtn.OnClick = locatePos;
		fromXYBtn.OnClick = locatePos;

		timeProgressBar.Init();
		timeProgressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		timeProgressBar.SetBg("progress_bar_bottom",TextureType.DECORATION);
		timeProgressBar.HideTips();

		rallyParnerInfoItems = new List.<RallyParnerInfoItem>();
	}

	public function OnPush(param:Object)
	{
		detailedData = param as KBN.RallyDetailedData;
		rallyData = detailedData.pBMsgRallySocket;

		toUserPhoto.useTile = true;
		toUserPhoto.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(detailedData.toUserPhoto));

		toUserName.txt = "(" + detailedData.toAllianceName + ")" + detailedData.toUserName;

		var sfrom : String = "Initator: {0}";
		fromName.txt = String.Format(sfrom, rallyData.fromName);
		var sTarget : String = "Target: {0}";
		//toName.txt = String.Format(Datas.getArString("WarHall.Target"), rallyData.toName);
		toName.txt = String.Format(sTarget, rallyData.toName);

		toXYBtn.txt = " (" + rallyData.toX + "," + rallyData.toY + ")";
        toXYBtn.clickParam = {"x":rallyData.toX , "y":rallyData.toY};

        fromXYBtn.txt = " (" + rallyData.fromX + "," + rallyData.fromY + ")";
        fromXYBtn.clickParam = {"x":rallyData.fromX , "y":rallyData.fromY};

		var sSlot : String = "Solt: {0}/{1}";
		slot.txt = String.Format(sSlot, rallyData.curSize, rallyData.maxSize);

		var sMarchSize : String = "March size: {0}/{1}";
		marchSize.txt = String.Format(sMarchSize, rallyData.curCount, rallyData.maxCount);

		SetParnerList();

		var mySelfId : int = GameMain.singleton.getUserId();
		if(mySelfId == rallyData.fromUserId || detailedData.partnerInfos.ContainsKey(mySelfId))
		{
			btnJion.SetDisabled(true);
			btnJion.changeToGreyNew();	
		}
		else
		{
			btnJion.SetDisabled(false);
			btnJion.changeToGreenNew();	
		}
		//_Global.LogWarning("RallyDetailedInfo.OnPush !!!!!!");
	}

	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
	
	}

	protected function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		Clear();
	}

	public function SetParnerList()
	{
		var parnerDic : Dictionary.<int, KBN.RallyPartnerInfo> = detailedData.partnerInfos;

		scrollView.Init();
		for (var info in parnerDic) 
		{
			var region : RallyParnerInfoItem = Instantiate(parnerInfoItem);
			rallyParnerInfoItems.Add(region);
			region.Init(info.Value);
			
			scrollView.addUIObject(region);	
		}		
		scrollView.AutoLayout();  
		scrollView.MoveToTop();
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);

		backGround.Draw();
		scrollView.Draw();

		btnBack.Draw();
		toName.Draw();
		fromName.Draw();
		toXYBtn.Draw();
		fromXYBtn.Draw();
		timeProgressBar.Draw();
		updateTime.Draw();
		toUserPhoto.Draw();
		slot.Draw();
		marchSize.Draw();
		toUserName.Draw();
		line.Draw();
		btnJion.Draw();

		GUI.EndGroup();
	}

	public function Update()
	{
		scrollView.Update();
		UpdateTimeProgressBar();
	}

	private function UpdateTimeProgressBar()
	{
		var nowTime : long = GameMain.instance().unixtime();
		var timeRemaining : int = rallyData.endTimeStamp - nowTime;
		if(timeRemaining < 0)
		{
			timeRemaining = 0;
		}	
		var restTimeStr : String = _Global.timeFormatStr(timeRemaining);
		if(rallyData.rallyStatus == KBN.RALLY_STATUS.Rally_Waiting)
		{
			var sWaiting : String = "Waiting: {0}";
			updateTime.txt = String.Format(sWaiting, restTimeStr);
			//timeProgressBar.SetTxt(Datas.getArString("WarHall.Waiting") + " " + restTimeStr);
		}
		else if(rallyData.rallyStatus == KBN.RALLY_STATUS.Rally_OutBound)
		{
			var sAttacking : String = "Attacking: {0}";
			updateTime.txt = String.Format(sAttacking, restTimeStr);
			//timeProgressBar.SetTxt(Datas.getArString("Attacking") + " " + restTimeStr);
		}

		timeProgressBar.SetValue(nowTime - rallyData.startTimeStamp, rallyData.endTimeStamp - rallyData.startTimeStamp);
	}

	private function backToRallyPanel(clickParam:Object):void
    {
        MenuMgr.instance.sendNotification (Constant.Action.RALLY_DETAILED_INFO_POP,null);
    }

    private function jionRally(clickParam:Object):void
    {
		//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":rallyData.fromX, "y":rallyData.fromY, "type":Constant.MarchType.JION_RALLY_ATTACK, "rallyId" : rallyData.rallyId},"trans_zoomComp");
        MarchDataManager.instance().SetData({"x":rallyData.fromX, "y":rallyData.fromY, "type":Constant.MarchType.JION_RALLY_ATTACK, "rallyId" : rallyData.rallyId});
	}

    public function rallyDataRemove(removeRallyId:int):void
    {
    	if(removeRallyId == rallyData.rallyId)
    	{
    		backToRallyPanel(null);
    	}
    }

	private function locatePos(clickParam:Object):void
    {
        MenuMgr.getInstance().PopMenu("");
        
        var x : int = _Global.INT32((clickParam as Hashtable)["x"]);
        var y : int = _Global.INT32((clickParam as Hashtable)["y"]);
        
        Message.getInstance().GoToMapFromReport(x, y);
    }

	public function Clear()
	{
		if (rallyParnerInfoItems == null) {
			return;
    	}
    	for (var region : RallyParnerInfoItem in rallyParnerInfoItems) {
    		if (region == null) {
    			continue;
    		}
    		region.Clear();
    		UnityEngine.Object.Destroy(region.gameObject);
    	}
    	rallyParnerInfoItems.Clear();
	}
}