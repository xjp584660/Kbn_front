import System.Collections.Generic;

public class RallyAttackItem extends ListItem
{
	public var timeProgressBar : ProgressBarWithBg;
	public var fromUserPhoto : Label;
	public var fromName : Label;
	public var toName : Label;
	public var slot : Label;
	public var marchSize : Label;
	public var toXYBtn : Button;
	public var select : Button;
	public var line : Label;
	public var updateTime : Label;

	public var rallyData : PBMsgRallySocket.PBMsgRallySocket;

	public function Init(param:Object)
	{
		timeProgressBar.Init();
		timeProgressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		timeProgressBar.SetBg("progress_bar_bottom",TextureType.DECORATION);
		timeProgressBar.HideTips();

		toXYBtn.OnClick = locatePos;
		select.OnClick = selectCurRally;
		updateData(param);
	}

	public function Update()
	{
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

	private function locatePos(clickParam:Object):void
    {
        MenuMgr.getInstance().PopMenu("");
        
        var x : int = _Global.INT32((clickParam as Hashtable)["x"]);
        var y : int = _Global.INT32((clickParam as Hashtable)["y"]);
        
        Message.getInstance().GoToMapFromReport(x, y);
    }

    private function selectCurRally(clickParam:Object):void
    {
    	MenuMgr.instance.sendNotification (Constant.Action.RALLY_REQUEST_DETAILED_INFO,rallyData.rallyId);
    }

	public function Draw()
	{
		GUI.BeginGroup(rect);

		fromUserPhoto.Draw();
		fromName.Draw();
		toName.Draw();
		timeProgressBar.Draw();
		toXYBtn.Draw();
		slot.Draw();
		marchSize.Draw();
		line.Draw();
		select.Draw();
		updateTime.Draw();

		GUI.EndGroup();
	}

	public function updateData(param:Object)
	{
		rallyData = param as PBMsgRallySocket.PBMsgRallySocket;

		fromUserPhoto.useTile = true;
		fromUserPhoto.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(rallyData.fromUserPhoto));

		fromName.txt = rallyData.fromName;
		var sTarget : String = "Target: {0}";
		//toName.txt = String.Format(Datas.getArString("WarHall.Target"), rallyData.toName);
		toName.txt = String.Format(sTarget, rallyData.toName);

		toXYBtn.txt = " (" + rallyData.toX + "," + rallyData.toY + ")";
        toXYBtn.clickParam = {"x":rallyData.toX , "y":rallyData.toY};

		var sSlot : String = "Solt: {0}/{1}";
		slot.txt = String.Format(sSlot, rallyData.curSize, rallyData.maxSize);

		var sMarchSize : String = "March size: {0}/{1}";
		marchSize.txt = String.Format(sMarchSize, rallyData.curCount, rallyData.maxCount);
 		//slot.txt = String.Format(Datas.getArString("WarHall.Target"), rallyData.curCount, rallyData.maxCount);
 		//marchSize.txt = String.Format(Datas.getArString("WarHall.MarchSize"), rallyData.curSize, rallyData.maxSize);
	}

	function FixedUpdate()
	{
		
	}

	public function Clear()
	{

	}
}