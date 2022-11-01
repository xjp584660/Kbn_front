
class NewcityItem extends ListItem
{
	var number:Label;
	var cityIcon:Label;
	var stateIcon:Label;
	var stateIcon2:Label;
	var cityInfo:City;
	var flashIcon:Label;
	var l_coming:Label;
    var cityDefenseStatusLabel : SimpleLabel;
    
   
    private var defenseStatusMaterial : Material;
    
    private var unhideAnimationFlag : boolean;
    
    public function set UnhideAnimationFlag(value : boolean)
    {
        unhideAnimationFlag = value;
    }
    
    public function get UnhideAnimationFlag() : boolean
    {
        return unhideAnimationFlag;
    }
    
    @System.Serializable
    private class UnhideAnimationConfig
    {
        public var loopCount : int;
        
        
        public var duration : float;
        
        public var from : float;

        public var to : float;
        
        public var shaderName : String;
        
        public var paramName : String;
    }
    
    @SerializeField
    private var unhideAnimationConfig : UnhideAnimationConfig;
    
    private var unhideAnimationGammaFactor : float;
    
    public function set UnhideAnimationGammaFactor(value : boolean)
    {
        unhideAnimationGammaFactor = value;
        defenseStatusMaterial.SetFloat(unhideAnimationConfig.paramName, unhideAnimationGammaFactor);
    }
    
    public function get UnhideAnimationGammaFactor() : float
    {
        return unhideAnimationGammaFactor;
    }
	
	private var flashTime:double = 0.5;
	public function Init()
	{
		number.useTile = true;
		number.drawTileByGraphics = true;
		number.TileSprite= TextureMgr.instance().ElseIconSpt();
		

		cityIcon.Background = TextureMgr.instance().LoadTexture("w_51_4_1",TextureType.MAP17D3A_TILE);
		
		stateIcon.useTile = true;
		stateIcon.drawTileByGraphics = true;
		stateIcon.TileSprite= TextureMgr.instance().ElseIconSpt();
		
//		stateIcon2.useTile = true;
//		stateIcon2.drawTileByGraphics = true;
//		stateIcon2.TileSprite= TextureMgr.instance().ElseIconSpt();
		
		icon.useTile = true;
		icon.drawTileByGraphics = true;
		icon.TileSprite= TextureMgr.instance().ElseIconSpt();
		
		flashIcon.useTile = true;
		flashIcon.drawTileByGraphics = true;
		flashIcon.TileSprite= TextureMgr.instance().ElseIconSpt();
		flashIcon.TileName = "Multi_city_Switch_Background3";
		flashIcon.SetVisible(false);
		//flashIcon.tile.SetSpriteEdge(0);
		
		l_coming.txt = Datas.getArString("Common.ComingSoon");
		l_coming.mystyle.normal.textColor = _Global.ARGB("0xFFe6cfaa");
        
        cityDefenseStatusLabel.useTile = true;
        cityDefenseStatusLabel.tile = TextureMgr.instance().IconSpt().GetTile("city_troops_unhidden");
        defenseStatusMaterial = new Material(Shader.Find(unhideAnimationConfig.shaderName));
        StopUnhideAnimation();
	}
    
    public function OnPushOver()
    {
        if (UnhideAnimationFlag)
        {
            StartUnhideAnimation();
        }
    }
    
    private var lastUpdateTime : float = -100f;
    private function UpdateDefenseStatus()
    {
        if (Time.time - lastUpdateTime < 1f)
        {
            return;
        }
        
        // SetData not called yet.
        if (cityInfo == null)
        {
            cityDefenseStatusLabel.SetVisible(false);
            return;
        }
        
        var seed : HashObject = GameMain.instance().getSeed();
        if (seed == null)
        {
            return;
        }
        
        var cityNode : HashObject = seed["citystats"]["city" + cityInfo.cityId];
        if (cityNode != null && _Global.GetString(cityNode["gate"]) == Constant.City.DEFEND)
        {
            cityDefenseStatusLabel.SetVisible(true);
            cityDefenseStatusLabel.tile = TextureMgr.instance().IconSpt().GetTile("city_troops_unhidden");
            return;
        }
        
        if (Castle.instance().HasSelectiveDefenseByCityId(cityInfo.cityId))
        {
            cityDefenseStatusLabel.SetVisible(true);
            cityDefenseStatusLabel.tile = TextureMgr.instance().IconSpt().GetTile("city_under_selective_defense");;
            return;
        }
        
        cityDefenseStatusLabel.SetVisible(false);
        
        lastUpdateTime = Time.time;
    }


    public function Update()
    {
        UpdateDefenseStatus();
    }
    
	public function Draw()
	{
		GUI.BeginGroup(rect);
		icon.Draw();
		flashIcon.Draw();
		btnSelect.Draw();
		cityIcon.Draw();
		number.Draw();
		stateIcon.Draw();
		stateIcon2.Draw();
        DrawCityDefenseStatusLabel();
		l_coming.Draw();
		GUI.EndGroup();
	}	
    
    private function DrawCityDefenseStatusLabel()
    {
        if (!cityDefenseStatusLabel.isVisible())
        {
            return;

        }

        cityDefenseStatusLabel.tile.Draw(cityDefenseStatusLabel.rect);
    }
	
	public function SetRowData(data:Object)
	{
		cityInfo = data as City;
		if(KBN._Global.isIphoneX())
		{
			if ( cityInfo.citySequence == 5 )
			{
				number.TileName = "icon_map_view_flag_yellow_5";
				number.rect.y = 14;
			}
			else
			{
				number.TileName = cityInfo.citySequence + "city";
				number.rect.y = 16;
			}
		}else{
			if ( cityInfo.citySequence == 5 )
			{
				number.TileName = "icon_map_view_flag_yellow_5";
				number.rect.y = 7;
			}
			else
			{
				number.TileName = cityInfo.citySequence + "city";
				number.rect.y = 4;
			}
		}
		
		number.SetRectWHFromTile();
		btnSelect.OnClick = null;

		l_coming.SetVisible(false);
		var citiesMenu:Cities = MenuMgr.getInstance().getMenu("Cities") as Cities;
		if( citiesMenu ){
			flashTime = citiesMenu.flashtimeBase;
		}
		
		if(cityInfo.state == CityState.ALIVE)
		{

			if(cityInfo.cityId == GameMain.instance().getCurCityId())
				btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("Multi_city_Switch_Down",TextureType.BUTTON);
			else
				btnSelect.mystyle.normal.background = null;
			if ( cityInfo.citySequence == 5 )
				icon.TileName = "Multi_city_Switch_Background_W";
			else
				icon.TileName = "Multi_city_Switch_Background";
			cityIcon.visible = true;
			btnSelect.OnClick = EnterCity;
			btnSelect.SetVisible(true);
			if(cityInfo.bAttacked)
			{
				stateIcon.TileName = "Multi_city_icon";
				stateIcon2.Background = TextureMgr.instance().LoadTexture("Warning",TextureType.DECORATION);
				stateIcon.SetVisible(true);	
				stateIcon2.SetVisible(true);	
                UpdateStateIcon2Region();
			}	
			else
			{
				stateIcon.SetVisible(false);	
				stateIcon2.SetVisible(false);	
			}	
		}
		else
		{
			 if(cityInfo.state == CityState.LOCKED)
			 {
			 	cityIcon.visible = true;
				if ( cityInfo.citySequence == 5 )
					icon.TileName = "Multi_city_Switch_Background_W";
				else
					icon.TileName = "Multi_city_Switch_Background";
			 	stateIcon.TileName = "Multi_city_icon";
			 	stateIcon2.Background =  TextureMgr.instance().LoadTexture("not-add",TextureType.DECORATION);
			 	stateIcon2.visible = true;
			 	stateIcon.SetVisible(true);
			 	btnSelect.SetVisible(true);
			 	btnSelect.OnClick = ViewCityRequirement;
                UpdateStateIcon2Region();
			 }
			 else if(cityInfo.state == CityState.WAITINGBUILD)
			 {
			 	cityIcon.visible = true;
				if ( cityInfo.citySequence == 5 )
					icon.TileName = "Multi_city_Switch_Background_W";
				else
					icon.TileName = "Multi_city_Switch_Background";
			 	if(cityInfo.bCreat)
			 	{
			 		stateIcon.TileName = "Multi_city_icon_Green";
			 		stateIcon2.Background = TextureMgr.instance().LoadTexture("add",TextureType.DECORATION);
			 		btnSelect.OnClick = CreatCity;
			 	}
			 	else
			 	{
			 		stateIcon.TileName = "Multi_city_icon";
			 		stateIcon2.Background =  TextureMgr.instance().LoadTexture("not-add",TextureType.DECORATION);
			 		btnSelect.OnClick = ViewCityRequirement;
			 	}
			 	btnSelect.SetVisible(true);
			 	stateIcon.SetVisible(true);
			 	stateIcon2.SetVisible(true);
                UpdateStateIcon2Region();
			 }
			 else	//INCOMING
			 {
			 	if(!cityInfo.isOpenedByServer)
			 	{
	 				l_coming.txt = Datas.getArString("Common.ComingSoon");
	 				l_coming.rect.x = 22.5;
 				}
			 	icon.TileName = "Multi_city_Switch_Background4";
			 	l_coming.SetVisible(true);
			 	cityIcon.visible = false;
			 	btnSelect.SetVisible(false);
			 }
		}
	 
		flashIcon.SetVisible(false);
        
        UpdateDefenseStatus();
	}
	
    private function UpdateStateIcon2Region()
    {
        var scale : Vector2 = new Vector2(stateIcon.Region.width / stateIcon.tile.rect.width,
            stateIcon.Region.height / stateIcon.tile.rect.height);
        var width : float = stateIcon2.Background.width * scale.x;
        var height : float = stateIcon2.Background.height * scale.y;
        var x : float = stateIcon.Region.x + (stateIcon.Region.width - width) * .5f;
        var y : float = stateIcon.Region.y + (stateIcon.Region.height - height) * .5f;
        stateIcon2.Region = new Rect(x, y, width, height);
    }
    
	function CreatCity(param:Object)
	{
		MenuMgr.getInstance().PushMenu("CreatNewCity",{"plainId":null, "buildCity":cityInfo}, "trans_zoomComp");
		cityInfo.flash = false;
		CityQueue.instance().StopNote();
		flashIcon.SetVisible(false);
	}
	
	function EnterCity()
	{
        MenuMgr.getInstance().PopMenu("", "trans_pop");
		GameMain.instance().changeCity(cityInfo.cityId);
		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.priv_initLayout();
	}
	
	function ViewCityRequirement()
	{
		//MenuMgr.getInstance().PopMenu("", "trans_pop");
		MenuMgr.getInstance().PushMenu("PlayerInfo", null);
		MenuMgr.getInstance().getMenuAndCall("PlayerInfo", function(menu : KBNMenu){
			var playerInfo:PlayerInfo = menu as PlayerInfo;
			if(playerInfo != null)
				playerInfo.ViewCity(cityInfo.citySequence);
		});
		cityInfo.flash = false;
		CityQueue.instance().StopNote();
		flashIcon.SetVisible(false);
	}
	
	function UpdateData()
	{
		var citiesMenu:Cities = MenuMgr.getInstance().getMenu("Cities") as Cities;
		
		if(cityInfo.state == CityState.INCOMING && cityInfo.citySequence <= CityQueue.instance().MaxReleasedCityCnt && cityInfo.UnblockedTime!=0 && cityInfo.isOpenedByServer)
	 	{
	 		var RestTime:long = cityInfo.UnblockedTime - GameMain.instance().unixtime();
	 		if(RestTime > 0)
	 		{
	 			l_coming.rect.x = 10;
	 			var timecontent:String = "";
	 			var st:System.TimeSpan = System.TimeSpan(RestTime*System.TimeSpan.TicksPerSecond);
				var hours:int = Mathf.FloorToInt(st.TotalHours);
				var days:int = Mathf.FloorToInt(st.TotalDays);
				if(days >= 3)
					timecontent = Mathf.Ceil(st.TotalDays)+ " "+Datas.getArString("Common.Days");
				else if(hours > 0)
					timecontent = hours + "h " + st.Minutes + "m ";
				else if(st.Minutes >= 1)
					timecontent = st.Minutes + "m" + st.Seconds + "s"; 
				else 
					timecontent = st.Seconds + "s"; 
	 			
	 			l_coming.txt = Datas.getArString("Common.ComingIn") +"\n  "+ timecontent;
 			}
	 		else
	 		{
	 			l_coming.rect.x = 22.5;
	 			l_coming.txt = Datas.getArString("Common.ComingSoon");
	 			CityQueue.instance().CheckNewCtiyRequirement();
				if( citiesMenu ){
					citiesMenu.cityList.SetData(CityQueue.instance().Cities.ToArray());
				}
	 		}
	 	}

		if(cityInfo.flash)
		{
			var timebase:double;
			if( citiesMenu ){
				timebase = citiesMenu.flashtimeBase;
			}
			if(flashTime + 1.5 <= timebase)
			{
				flashTime = timebase;
				flashIcon.SetVisible( ( System.Convert.ToInt64(flashTime) - flashTime >0 )? true:false);
			}
		}
	}
	
    private function StartUnhideAnimation() : void
    {
    }
    
    private function StopUnhideAnimation() : void
    {
    }
}
