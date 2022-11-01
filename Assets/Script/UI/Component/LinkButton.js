class LinkButton extends Button
{
	private var linkerType:String;
	private var InnerClick:Function;
	private var url:String  = "";
	
	function Init()
	{
		super.Init();
	}
	
	public function setUrlLinker(_txt:String, _url:String):void
	{
		linkerType = Constant.LinkerType.URL;
		txt = _txt;
		url = _url;
		InnerClick = OpenURL;
	}
	
	public function autoSize():void
	{
		var _size:Vector2 = mystyle.CalcSize(GUIContent(txt));
		rect = Rect(rect.x, rect.y, _size.x + 30, _size.y + 50);
	}
	
	public function setInnerLinker(_txt:String, _linkerType:String):void
	{
		linkerType = _linkerType;
		txt = _txt;
	
		switch(linkerType)
		{
			case Constant.LinkerType.SHOP:
				InnerClick = OpenShop;
				break;
			case Constant.LinkerType.INVENTORY:
				InnerClick = OpenInventory;
				break;
			case Constant.LinkerType.ALLIANCE:
				InnerClick = OpenAlliance;
				break;
			case Constant.LinkerType.QUEST:
				InnerClick = OpenQuest;
				break;
			case Constant.LinkerType.GET_GEMS:
				InnerClick = OpenGetGems;
				break;
			case Constant.LinkerType.KABAM_ID:
				InnerClick = OpenKabamId;
				break;				
			case Constant.LinkerType.HELP:
				InnerClick = OpenHelp;	
				break;
		}
		
		autoSize();
	}
	
	private function OpenShop():void
	{
		var object:Object = {"selectedTab":0};
		MenuMgr.getInstance().PushMenu("InventoryMenu", object);
	}

	private function OpenInventory():void
	{
		var object:Object = {"selectedTab":1};
		MenuMgr.getInstance().PushMenu("InventoryMenu", object);
	}
	
	private function OpenAlliance():void
	{
		MenuMgr.getInstance().MainChrom.openAlliance(null);
	}
	
	private function OpenQuest():void
	{
		MenuMgr.getInstance().MainChrom.OpenMission();
	}

	private function OpenGetGems():void
	{
		MenuMgr.getInstance().MainChrom.OpenPayment();
	}		
	
	private function OpenKabamId():void
	{
        MenuAccessor.OpenKabamId();
	}
	
	private function OpenHelp():void
	{
        MenuAccessor.OpenHelp();
	}
	
	private function OpenURL():void
	{
		if(url != "")
		{
			Application.OpenURL(url);
		}
	}
	
	public function Click():int
	{
		SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");

		if(m_onClick != null)
		{
			Click(clickParam);
		}
		else if(InnerClick != null)
		{
			InnerClick();
		}
		
		return -1;
	}
}
