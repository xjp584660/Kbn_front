
import System.Collections;
import System.Collections.Generic;
import System;

class MonthlyCardMenu extends PopMenu
{

	// public var monthlyTitle:Label;
	public var line:Label;
	public var monthlyName:Label;
	public var day:Label;
	public var icon:Label;
	public var lingquBtn:Button;
	public var bg:Label;

	public var itemList:ScrollList;
	public var subItem:NewSubItem;
	public var btnInfo:Button;

	private var isLingqu:boolean;

	function Init(){
		super.Init();
		// monthlyTitle.Init();
		line.Init();
		bg.Init();
		monthlyName.Init();
		day.Init();
		icon.Init(); 
		itemList.Init(subItem);
		lingquBtn.Init();
		lingquBtn.OnClick=Lingqu;
		btnInfo.Init();
		btnInfo.OnClick=HelpInfo;
		// monthlyTitle.txt=Datas.getArString("Common.MonthlyCard");
		title.txt=Datas.getArString("Common.MonthlyCard");
	}

	function OnPush(param:Object){
		var data:HashObject=GameMain.singleton.GetMonthlyCard();
		if (data==null) {
			itemList.Clear();
			lingquBtn.SetVisible(false);
			return;
		}

		super.OnPush(data);
		itemList.ClearData2();
		isLingqu=_Global.GetBoolean(data["isReceive"]);

		lingquBtn.txt = Datas.getArString("Monthlypack.Collect");
		lingquBtn.SetVisible(!isLingqu);	

		var Id=_Global.INT32(data["chestId"]);
		monthlyName.txt=data["chestName"].Value + "(Day" + _Global.INT32(data["day"].Value) + ")";
		day.txt=data["chestDesc"].Value;
		icon.tile = TextureMgr.instance().LoadTileOfItem(Id);
	
		var items:List.<InventoryInfo> = _Global.GetItems(data["subItems"] as HashObject);
		if (items.Count>0)
		{
			itemList.SetData(items.ToArray());
			itemList.ResetPos();
		}
	}

	function Lingqu(){
		if (!isLingqu) {
			UnityNet.getMonthlyCardReward(okFun,null);
		}
	}
	
	function HelpInfo()
	{
		MenuMgr.getInstance().PushMenu("MonthlyCardHelpMenu", null, "trans_zoomComp");
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "UpdateMonthlyCard":
				OnPush(null);
				break;
		}
	}

	function okFun(result:HashObject){

		//_Global.LogWarning(result as String);
		if(_Global.GetBoolean(result["ok"]))
		{
			var subItems : HashObject = result["subItems"];
			var keys : String[] = _Global.GetObjectKeys(subItems);
			for(var j : int = 0; j < keys.Length; j ++)
			{
				var itemId : int = _Global.INT32(keys[j]);
				var itemCount : int = _Global.INT32(subItems[keys[j]]);
				MyItems.instance().AddItem(itemId, itemCount);
			}
			
			UpdateSeed.instance().update_seed_ajax(true, null);	
			lingquBtn.SetVisible(false);
		}
	}

	function DrawItem()
	{
		// monthlyTitle.Draw();
		line.Draw();
		bg.Draw();
		monthlyName.Draw();
		day.Draw();
		icon.Draw();
		lingquBtn.Draw();
		btnInfo.Draw();

		itemList.Draw();
		
	}
	
	function Update()
	{
		itemList.Update();
	}
	
	public function OnPopOver()
	{
		itemList.Clear();
	}


}