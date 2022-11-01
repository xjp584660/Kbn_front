
class InGameHelp extends KBNMenu
{
	// Use this for initialization
	public var menuHead:MenuHead;
	public var subTitle:Label;
	public var content:Label;
	public var info:InGameHelpSetting;
	public var overviewTitle:Label;
	public var overview:Label;
	public var funcTitle:Label;
	public var backLayer:Label;
	public var scroll:ScrollView;
	public var helpLink:LinkButton;
	
	public var subTitles:Label[];
	public var texts:Label[];
	
	var nameTable : Hashtable = new Hashtable();
	function Start () {
	}
	
	// Update is called once per frame
	function Update () {
		scroll.Update();
	}
	
	function Init()
	{
		menuHead.Init();
		menuHead.btn_getmore.SetVisible(false);	
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			menuHead.btn_back.rect.width = 92;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			menuHead.btn_back.rect.width = 115;
		}
		else
		{
			menuHead.btn_back.rect.width = 105;
		}
		menuHead.btn_back.rect.height = 64;
		
		menuHead.l_gem.SetVisible(false);
		menuHead.rect.height = 150;
		menuHead.backTile.rect.height = 130;
		menuHead.setTitle(Datas.getArString("Settings.Help"));
		menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_ARROW);
		
		frameTop.rect = Rect( 0, 67, frameTop.rect.width, frameTop.rect.height);
		
//		overviewTitle.txt = (Datas.getArString("IngameHelp.OverView_Title"]);
//		funcTitle.txt = (Datas.getArString("IngameHelp.Function_Title"]);
		scroll.component = [];
		scroll.clearUIObject();
		for(var i:int = 0; i<10; i++)
		{
			scroll.addUIObject(subTitles[i]);
			scroll.addUIObject(texts[i]);
		}
		scroll.addUIObject(helpLink);
		helpLink.setInnerLinker( (Datas.getArString("IngameHelp.HelpLink")), Constant.LinkerType.HELP);
		nameTable.Clear();
		nameTable.Add("b" + Constant.Building.EMBASSY, "Embassy");
		nameTable.Add("b" + Constant.Building.ACADEMY, "AlchemyLab");
		nameTable.Add("b" + Constant.Building.STOREHOUSE, "Storehouse");
		nameTable.Add("b" + Constant.Building.VILLA, "Cottage");
		nameTable.Add("b" + Constant.Building.GENERALS_QUARTERS, "KnightsHall");
		nameTable.Add("b" + Constant.Building.RALLY_SPOT, "RallyPoint");
		nameTable.Add("b" + Constant.Building.WATCH_TOWER, "WatchTower");
		nameTable.Add("b" + Constant.Building.BARRACKS, "Barracks");
		nameTable.Add("b" + Constant.Building.WALL, "Wall");		
		nameTable.Add("b" + Constant.Building.PALACE, "Castle");
		
		nameTable.Add("b" + Constant.Building.FARM, "Storehouse");
		nameTable.Add("b" + Constant.Building.SAWMILL, "Storehouse");
		nameTable.Add("b" + Constant.Building.QUARRY, "Storehouse");
		nameTable.Add("b" + Constant.Building.MINE, "Storehouse");
		nameTable.Add("b" + Constant.Building.RELIEF_STATION, "Reliefstation");
		nameTable.Add("b" + Constant.Building.MUSEUM, "RoundTower");
		nameTable.Add("b" + Constant.Building.HOSPITAL, "Hospital");
		nameTable.Add("b" + Constant.Building.HERO, "Hero");
		nameTable.Add("b" + Constant.Building.TECHNOLOGY_TREE, "TechnologyTree");
		
		nameTable.Add("b" + ConquerContent.CONQUESTHELP, ConquerContent.CONQUESTHELP);
		
		nameTable.Add("other" + "rank", "Leaderboard");
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
//		var arStrings:Object = Datas.instance().arStrings();
		info = param as InGameHelpSetting;
		subTitle.txt = info.name;
		
	//	subTitles[0].txt = Datas.getArString("IngameHelp"][info.buildName + "_Subtitle" + i];
	//	texts[0].txt = Datas.getArString("IngameHelp"][info.buildName + "_Text" + i];
	//	var strHeight:int = texts[0].GetTxtHeight();
	//	texts[0].rect.height = strHeight + 20;
		var key:String = "";
		if(info.type == "building")
		{
			key = nameTable["b" + info.key];
		}
		else if (info.type == "other")
		{
			key = nameTable["other" + info.key];
		}
		else if (info.type == "one_context")
		{
			key = info.key;
		}
		else
		{
			key = info.key;
		}
		
		var tempY:int = subTitles[0].rect.y;
		var i:int = 0;
		for(i=0;i<10;i++)
		{
			subTitles[i].SetFont();
			texts[i].SetFont();
		}
		if(info.type == "one_context")
		{
			i = 0;
			subTitles[i].visible = false;
			subTitles[i].rect.height = 0;
			texts[i].visible = true;
			texts[i].txt = key;
			var contextHeight:int = texts[i].GetTxtHeight();
			texts[i].rect.y = subTitles[i].rect.y;
			texts[i].rect.height = contextHeight + 20;
			i = 1;
		}
		else
		{
			for(i=0; i<10; i++)
			{
				var index:String = key + "_Subtitle" + (i+1);
				if(Datas.IsExistString("IngameHelp."+index))
				{
					subTitles[i].visible = true;
					texts[i].visible = true;
					subTitles[i].txt = Datas.getArString("IngameHelp."+index);
					var strHeight:int = subTitles[i].GetTxtHeight();
					subTitles[i].rect.y = tempY;
					subTitles[i].rect.height = strHeight + 20;		
					index = key + "_Text" + (i+1);
					texts[i].txt = Datas.getArString("IngameHelp."+index);
					strHeight = texts[i].GetTxtHeight();
					texts[i].rect.y = subTitles[i].rect.y + subTitles[i].rect.height;
					texts[i].rect.height = strHeight + 20;
					tempY = texts[i].rect.y + texts[i].rect.height;
				}
				else
					break;
			}
		}
		
		if ( i > 0 )
			helpLink.rect.y = texts[i-1].rect.y + texts[i-1].rect.height + 10;
		for(var j:int = i; j < 10; j++)
		{
			subTitles[j].visible = false;
			texts[j].visible = false;
		}	
		scroll.AutoLayout();
		scroll.MoveToTop();
		
		if(info.menuHeadBtnType >= 0)
			menuHead.setBackButtonMotif(info.menuHeadBtnType);
	}
	
	function DrawItem()
	{
		subTitle.Draw();
		backLayer.Draw();
		scroll.Draw();
	}
	
	public function DrawBackground()
	{
		menuHead.Draw();
		if(Event.current.type != EventType.Repaint)
			return;
		bgStartY = 68;
		DrawMiddleBg();
		
		frameTop.Draw();

	}
	
	public function OnPopOver()
	{
		scroll.clearUIObject();
	}
	
}
