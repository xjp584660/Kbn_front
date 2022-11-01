import System.Collections.Generic;

public class RallyParnerInfoItem extends ListItem
{
	public var fromUserPhoto : Label;
	public var fromName : Label;
	public var select : Button;
	public var line : Label;
	public var updateTime : Label;
	public var troop : Label;

	public var selectTroopItem : RallySelectTroopItem;

	public var partnerInfo : KBN.RallyPartnerInfo;
	public var troopItems : List.<RallySelectTroopItem>;

	public function Init(param:Object)
	{
		select.OnClick = selectCurParner;
		troopItems = new List.<RallySelectTroopItem>();
		updateData(param);
	}

	public function Update()
	{
		UpdateTimeProgressBar();
	}

	private function UpdateTimeProgressBar()
	{		
		if(partnerInfo.rallyMarchStatus == KBN.RALLY_MARCH_STATUS.NotReachRallyPoint)
		{
			var nowTime : long = GameMain.instance().unixtime();
			var timeRemaining : int = partnerInfo.endTime - nowTime;
			if(timeRemaining < 0)
			{
				timeRemaining = 0;
			}	
			var restTimeStr : String = _Global.timeFormatStr(timeRemaining);

			var sWaiting : String = "Waiting: {0}";
			updateTime.txt = String.Format(sWaiting, restTimeStr);
		}
		else
		{
			updateTime.txt = Datas.getArString("WarHall.Jioned");
		}
	}

    private function selectCurParner(clickParam:Object):void
    {
    	partnerInfo.isSelected = !partnerInfo.isSelected;
    	MenuMgr.instance.sendNotification (Constant.Action.RALLY_SELECT_PARNER,partnerInfo);
    }

	public function Draw()
	{
		GUI.BeginGroup(rect);

		fromUserPhoto.Draw();
		fromName.Draw();
		line.Draw();
		select.Draw();
		updateTime.Draw();
		troop.Draw();

		for(var i = 0; i < troopItems.Count; i++)
		{
			troopItems[i].Draw();
		}

		GUI.EndGroup();
	}

	public function updateData(param:Object)
	{
		Clear();

		partnerInfo = param as KBN.RallyPartnerInfo;

		fromUserPhoto.useTile = true;
		fromUserPhoto.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(partnerInfo.fromUserPhoto));	
		fromName.txt = partnerInfo.fromName;
		var t : String = "Troop:{0}";
		troop.txt = String.Format(t, partnerInfo.troopTotal);

		if(partnerInfo.isSelected)
		{
			select.rotateAngle = 90;

			var unitsCount : int = partnerInfo.units.Count;
			var index : int = 1;
			for (var info in partnerInfo.units) 
			{
				var region : RallySelectTroopItem = Instantiate(selectTroopItem);
				AddItem(region);
				troopItems.Add(region);
				region.SetData(info.Key, info.Value, index == unitsCount);
				index++;
			}
	 	}
	 	else
	 	{
	 		select.rotateAngle = 0;
	 	}
	}

	function FixedUpdate()
	{
		
	}

	public function Clear()
	{
		if (troopItems == null) {
			return;
    	}
    	for (var region : RallySelectTroopItem in troopItems) {
    		if (region == null) {
    			continue;
    		}
    		UnityEngine.Object.Destroy(region.gameObject);
    	}
    	troopItems.Clear();
	}
}