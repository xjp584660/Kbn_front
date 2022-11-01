class AllianceLanguageMenu extends PopMenu implements IEventHandler
{
	public var scroll:ScrollList;
	public var item:AllianceLanguageItem;
	public var backbtn1:Button;
	public var backbtn2:Button;

	public var selectItem:AllianceLanguageItem;
	public var selectId:int=0;

	public var btn:Button;

	public var type:int;

	public function Init()
	{
		super.Init();
		selectId=0;
		item.Init();
		scroll.Init(item);
		backbtn1.Init();
		backbtn2.Init();
		backbtn1.OnClick=ReturnBack;
		backbtn2.OnClick=ReturnBack;
		btn.txt=Datas.getArString("paymentLabel.ok");

		btn.Init();
		btn.OnClick=ClickSelect;

		title.txt=Datas.getArString("Alliance.Language_Title");
	}

	private function ClickSelect()
	{
		if (type==0) {
			var alliancemenu:AllianceMenu=MenuMgr.getInstance().getMenu("AllianceMenu") as AllianceMenu;
			if (alliancemenu!=null&&selectId!=0) {
				Alliance.languageSet=selectId;
				alliancemenu.info1.RefreshLanguage(selectId);
			}
			ReturnBack();
		}
		else if (type==1) {
			if (selectId!=0) 
			{
				var okFun:Function = function(result:HashObject){
					if (result["ok"]) {
						var languageId=_Global.INT32(result["languageId"]);
						Alliance.getInstance().SetMyAllianceLanguage(languageId);

						ReturnBack();
					}
				};
				UnityNet.SetAllianceLanguage(selectId,okFun,null);
			}
		}		
	}

	public function OnPush(param:Object)
 	{		
 		super.OnPush(param);
 		type=_Global.INT32(param);
 		scroll.SetData(GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItems());	
 		btn.SetVisible(type!=2);
 	}

 	public function handleItemAction(action:String,data:Object):void
 	{
 		switch(action)
		{
			case "Alliance_Language_toggle":
				if (selectItem&&selectItem!=data) {
		 			selectItem.SetSelected(false);
		 		}
		 		selectItem=data as AllianceLanguageItem;
		 		selectId=selectItem.id;
		 		break;
		}
 	}

	public function DrawItem()
	{
		scroll.Draw();
		backbtn1.Draw();
		backbtn2.Draw();
		btn.Draw();
	}

	public function OnPopOver()
	{
		scroll.Clear();
		MenuMgr.getInstance().sendNotification("AllianceLanguage",selectId);
	}

	public function Update()
 	{
 		scroll.Update();
 		if (selectItem&&selectId==selectItem.id&&!selectItem._selected) {
 			selectItem.SetSelected(true);
 		}
 	}

 	public function ReturnBack()
 	{
 		MenuMgr.instance.PopMenu("");
 	}
}