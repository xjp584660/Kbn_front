class ConquerContent extends UIObject
{
	public var labelTip:Label;
	public var scrolList:ScrollList;
	public var listItem:ConquertItem;
	public var maxNumWilds:Label;
	public var surveyLabel:Label;
	public var surveyDes:Label;
	public var surveynum:Label;
	public var devideLine:Label;
	public var bottomDec:Tile;
	public var btnHelp:Button;
	private var buildInfor: Building.BuildingInfo;
	
	public static var CONQUESTHELP:String = "Conquests";
	
	private var g_hasConquer:boolean;
	
	function Init()
	{
		maxNumWilds.Init();		
		
		bottomDec = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
		bottomDec.rect = new Rect( 0, rect.height -105 , 640, 105);
		//bottomDec.name = "tool bar_bottom";		
		
		
		surveyLabel.Init();
		surveyDes.Init();
		surveynum.Init();
		devideLine.Init();		
		devideLine.setBackground("between line", TextureType.DECORATION);
		
		labelTip.Init();
		labelTip.setBackground("square_black",TextureType.DECORATION);
		listItem.Init();
		scrolList.Init(listItem);
		
		btnHelp.OnClick = function(param:Object)
		{
			var setting:InGameHelpSetting = new InGameHelpSetting();
			setting.type = "building";
			setting.key = ConquerContent.CONQUESTHELP;
			setting.name = Datas.instance().getArString("Common.Conquests");
			
			MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
		};
	}
	
	public function updateConquerItem(targetId:int):void
	{
		var wildInfor:Castle.ConquerItem;
		var seed:HashObject = GameMain.instance().getSeed();
		var curCityId:int = GameMain.instance().getCurCityId();
		for(var a:int =0; a < wildArr.length; a++)
		{
			wildInfor = wildArr[a];
			
			if(wildInfor.id == targetId)
			{
				wildInfor.coldDownTime = _Global.INT64(seed["wilderness"]["city" + curCityId]["t" + targetId]["freezeEndTime"].Value);
			}
		}
		
		scrolList.SetData(wildArr);
		scrolList.ResetPos();
	}
	
	function Draw()
	{
		surveyLabel.Draw();
		surveyDes.Draw();
		surveynum.Draw();
		devideLine.Draw();		
	
		if(g_hasConquer)
		{					
			scrolList.Draw();
		}
		else
		{
			labelTip.Draw();
		}
		
		btnHelp.Draw();
		bottomDec.Draw();
		maxNumWilds.Draw();
	}
	
	function Update()
	{
		scrolList.Update();
	}
	
	var wildArr:Array;
	private function resetDisplay(data:Object):void
	{
		wildArr = data as Array; 
		
		surveynum.txt = Castle.instance().SurveyCount + "/" + Castle.instance().SurveyLimit;

		if(wildArr.length > 0)
		{
			if(buildInfor)
			{
				var wildsCount:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(buildInfor.typeId,buildInfor.curLevel,Constant.BuildingEffectType.EFFECT_TYPE_CONQUER_TILE_COUNT);
				maxNumWilds.txt = Datas.getArString("Common.youOwn") + ": " + wildArr.length + " (" + Datas.getArString("Common.Maximum") + " " + wildsCount + ")";
			}
			
			g_hasConquer = true;
			
			//btnHelp.rect.x = 484.7;
			//btnHelp.rect.y = 157.46;
		
			scrolList.SetData(wildArr);	
			scrolList.ResetPos();			
		}		
	}
	
	function setData(_infor:Object)
	{
		if(_infor)
		{
			buildInfor = _infor as Building.BuildingInfo;
		}

		surveyLabel.txt = Datas.getArString("OpenPalace.SuveryLimit") + ": ";
		surveyDes.txt = Datas.getArString("OpenPalace.SurveyLimitDesc");
		surveynum.txt = "";

		var height:float = surveyDes.mystyle.CalcHeight(GUIContent(surveyDes.txt), surveyDes.rect.width);
		surveyDes.rect.height = height;
		
		devideLine.rect.y = surveyDes.rect.y + surveyDes.rect.height + 10;
		
		scrolList.rect.y = devideLine.rect.y + devideLine.rect.height + 10;
								
		var _size:Vector2 = surveyLabel.mystyle.CalcSize(GUIContent(surveyLabel.txt));
		surveyLabel.rect.width = _size.x;
		surveynum.rect.x = surveyLabel.rect.x + surveyLabel.rect.width + 15;
	
		labelTip.txt = Datas.getArString("ShowMyWilderness.ConquestDes");
		g_hasConquer = false;
		
		//btnHelp.rect.x = 484.4;
		//btnHelp.rect.y = 168.9;

		Castle.instance().getCityWilds(resetDisplay);
		
		if(buildInfor)
		{
			var wildsCount:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(buildInfor.typeId,buildInfor.curLevel,Constant.BuildingEffectType.EFFECT_TYPE_CONQUER_TILE_COUNT);
			maxNumWilds.txt = Datas.getArString("Common.youOwn") + ": " + 0 + " (" + Datas.getArString("Common.Maximum") + " " + wildsCount + ")";
		}		
	}
	
	public	function	Clear()
	{
		scrolList.Clear();
	}
}
