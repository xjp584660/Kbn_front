class ConquertItem extends ListItem
{
	public var labelTypeAndCoor:Label;
	public var labelLevel:Label;
	public var labelStatus:Label;
	public var labelPosition:Label;
	public var labelDivideline:Label;
	public var btnAbandon:Button;
	public var btnPositionWild:SimpleButton;
	public var btnSpeed:Button;
	public var timeIcon:Label;
	public var leftTime:Label;
	public var tilePic:Label;
	public var stateLabel:Label;
		
	private var conquerItem:Castle.ConquerItem;
	private var isNeedTimeCounter:boolean;
	
	function Init():void
	{
		btnPositionWild.OnClick = handlePositionWild;
		btnAbandon.OnClick = handleAbandon;
		btnSpeed.OnClick = handleSpeedup;
		
		labelDivideline.setBackground("between line_list_small", TextureType.DECORATION);
        
        btnPositionWild.alpha = 0.3f;
	}
	
	private function handlePositionWild():void
	{
		MenuMgr.getInstance().PopMenu("");
		GameMain.instance().setSearchedTileToHighlight( conquerItem.xCoor, conquerItem.yCoor );
		GameMain.instance().gotoMap(conquerItem.xCoor, conquerItem.yCoor);
		MapMoveAnim.avoidForceUpdateWorldMapWithinSecond( 2 );
	}
	
	private function handleSpeedup():void
	{
		if(btnSpeed.isVisible())
		{
			var element:WildernessVO = WildernessMgr.instance().getWilderness(conquerItem.id);
			MenuMgr.getInstance().PushMenu("SpeedUpMenu",element, "trans_zoomComp");
		}
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		labelDivideline.Draw();
		labelTypeAndCoor.Draw();
		labelPosition.Draw();
		labelLevel.Draw();
		labelStatus.Draw();
		btnAbandon.Draw();
		
		btnSpeed.Draw();
		timeIcon.Draw();
		leftTime.Draw();
		tilePic.Draw();
		stateLabel.Draw();
		
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.4);				
		btnPositionWild.Draw();
		GUI.color = oldColor;		
		
		GUI.EndGroup();	
	}
	
	private function handleAbandon()
	{
		if(conquerItem.isSurveying)
		{
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("MessagesModal.AbandonTile"), "", confirmAbandon, null);
		}
		else
		{
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Common.SureAbandon"), "", confirmAbandon, null);
		}		
	}
	
	private function confirmAbandon():void
	{
		Attack.instance().wildernessAbandon(conquerItem.id, conquerItem.xCoor, conquerItem.yCoor, successFunc);

		MenuMgr.getInstance().PopMenu("");
	}
	
	private function successFunc(result:Object)
	{
		WildernessMgr.instance().abandonWilder(conquerItem.id);
		
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.AbandonWildSuccess"));
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.conquerContent.setData(null);
		}
	}
	
	function Update():void
	{
		if(isNeedTimeCounter)
		{
			curTime = GameMain.unixtime();
			
			if(curTime - oldTime >= 1)			
			{
				oldTime = curTime;
				if(conquerItem.coldDownTime > curTime)
				{
					leftTime.txt = _Global.timeFormatStr(conquerItem.coldDownTime - curTime);
				}
				else
				{
					isNeedTimeCounter = false;
					
					btnSpeed.SetVisible(false);
					timeIcon.SetVisible(false);
					leftTime.SetVisible(false);	
					
					stateLabel.txt = Datas.getArString("OpenPalace.ReadyToSurvey");				
				}
			}
		}
	}
		
	private var curTime:long;
	private var oldTime:long;	
		
	function SetRowData(_data:Object)
	{

		conquerItem = _data as Castle.ConquerItem;
		
		btnSpeed.SetVisible(false);
		timeIcon.SetVisible(false);
		leftTime.SetVisible(false);	
		
		isNeedTimeCounter = false;	

		curTime = GameMain.unixtime();

		if(WildernessMgr.instance().canTileSurvey(conquerItem.type))
		{
			if(conquerItem.isSurveying)
			{
				stateLabel.txt = Datas.getArString("Common.Surveying");					
			}
			else
			{
				if(conquerItem.coldDownTime > curTime)
				{
					stateLabel.txt = Datas.getArString("OpenPalace.TileRecovering");	
							
					btnSpeed.SetVisible(true);
					timeIcon.SetVisible(true);
					leftTime.SetVisible(true);
					
					isNeedTimeCounter = true;					
				}
				else
				{	
					stateLabel.txt = Datas.getArString("OpenPalace.ReadyToSurvey");
				}			
			}		
		}
		else
		{
			stateLabel.txt = Datas.getArString("Common.CannotSurvey");
		}

		tilePic.mystyle.normal.background = TextureMgr.instance().LoadTexture(conquerItem.tilePicName,TextureType.MAP17D3A_TILE);

		labelTypeAndCoor.txt = conquerItem.tileName;
		labelPosition.txt = "(" + conquerItem.xCoor + "," + conquerItem.yCoor + ")";
		labelLevel.txt = Datas.getArString("Common.Lv") + " " + conquerItem.level;
		labelStatus.txt = conquerItem.status;
	
		btnAbandon.txt = Datas.getArString("Common.Abandon");
		btnSpeed.txt = Datas.getArString("Common.Speedup");

	}
}