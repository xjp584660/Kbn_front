

import System.Collections.Generic;

class MonsterShopMenu extends PopMenu implements IEventHandler
{

	public var myItems:Label;
	public var itemIcon:Label;
	public var line:Label;
	public var paymentList:ScrollList;
	public var payItem:MonsterPayItem;
	public var titleIcon:Label;
	public var frameLabel:SimpleLabel;

	public var settingContent:ComposedUIObj;

	public function Init()
	{
		super.Init();
		myItems.Init();
		line.Init();
		payItem.Init();
		titleIcon.Init();
		itemIcon.Init();
		paymentList.Init(payItem);

		// title.txt=Datas.getArString("MonsterCity.Shop");
		titleIcon.txt=Datas.getArString("Labyrinth.Shop");
		btnClose.OnClick = function()
		{
			MenuMgr.getInstance().PopMenu("");
		};
		btnClose.rect.y = 30;
		myItems.txt=Datas.getArString("Labyrinth.Exchang_Text2")+KBN.Payment.singleton.DisplayGems.ToString();
		bgStartY = 31;
		
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		frameLabel.Sys_Constructor();
		frameLabel.mystyle.border = new RectOffset(68, 68, 68, 68);
		frameLabel.useTile = true;
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");
		// tabArray = [settingContent];
	}

	public function OnPush(param:Object)
 	{		
 		super.OnPush(param);
 		checkIphoneXAdapter();
  
//		SetBackImage();
		var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = -6;


		paymentList.SetData(MonsterController.instance().GetShopList());	
 	}
 	public function Update()
 	{
 		paymentList.Update();
 	}
 	
 	public function DrawTitle()
	{
		frameLabel.Draw();	
		btnClose.Draw();		
	}
	
 	function DrawItem()
	{
		GUI.BeginGroup(Rect(20, 0, rect.width - 40, rect.height));
		myItems.Draw();
		itemIcon.Draw();
		line.Draw();
		paymentList.Draw();	
		titleIcon.Draw();	
		GUI.EndGroup();
	}
	public function OnPop()
	{
		super.OnPop();
		MenuMgr.getInstance().floatMessage.forceFinish();
	}
	public function OnPopOver()
 	{
 		paymentList.Clear();
 		MenuMgr.getInstance().sendNotification("Monster_buyItem",null);
 	}

 	private function SetBackImage()
 	{
 		if(KBN._Global.IsLargeResolution ())
			{
				paymentList.rect = new Rect(10,105,550,710);								
			}
			else
			{
				paymentList.rect = new Rect(10,85,550,720);
			} 
 	}
 	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "Monster_buyItem":
				myItems.txt=Datas.getArString("Labyrinth.Exchang_Text2")+KBN.Payment.singleton.DisplayGems.ToString();
				break;
		}
	}


}