class EventDoneDialog extends PopMenu
{
	public var MainMsg:Label;
	public var extraLabe:Label;
	public var extraLabe2:Label;
	public var extraLabe3:Label;
	public var extraLabe4:Label;
	public var extraLabe5:Label;
	public var extraLabe6:Label;
	public var timeRemaining:Label;
	public var btnConfirm:Button;
	//public var frameLabel:SimpleLabel;
	public var icon:Label;
	public var lighticon:Label;
	public var l_bg1:Label;
	public var l_bg2:Label;
	public var l_bg3:Label;
	
	public var  line1:SimpleLabel;
	public var  line2:SimpleLabel;
	
	public var  isLineShown:boolean;
	public var  timeRemainingShown:boolean;
	
	protected var _callBack:Function;
	private var endtime:long;
	private	var	responseBackKey:boolean = true;
	
	function Init():void
	{
		super.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		
		//icon.Background = TextureMgr.instance().loadBuildingTextureFromSprite( "f1_0_4_1");
		if( lighticon.mystyle.normal.background == null )
		{
			lighticon.mystyle.normal.background = TextureMgr.instance().LoadTexture("light_box",TextureType.DECORATION);
		}
		lighticon.rect = icon.rect;
		lighticon.rect.x -= 0.3 * icon.rect.width;
		lighticon.rect.y -= 0.2 * icon.rect.height;
		lighticon.rect.width = 1.6 * icon.rect.width;
		lighticon.rect.height = 1.6 * icon.rect.height;
		MainMsg.txt = Datas.getArString("AdditionalCity.RestartNotif");
		btnConfirm.txt = Datas.getArString("AdditionalCity.Restart");
		btnConfirm.OnClick = null;
//		function()
//		{
//			GameMain.instance().restartGame();
//		};		
		
		frameSimpleLabel.rect.x = 0;
		frameSimpleLabel.rect.y = 0;
		frameSimpleLabel.rect.width = rect.width;
		frameSimpleLabel.rect.height = rect.height + 5;

		//frameSimpleLabel.useTile = true;
		//frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
		
		//var img:Texture2D = texMgr.LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		//bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");//TextureMgr.instance().BackgroundSpt();
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		bgMiddleBodyPic.rect.width = rect.width;
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		//bgMiddleBodyPic.spt.edge = 2;
		
		btnClose.SetVisible(false);	
		extraLabe.mystyle.name = null;
		extraLabe.mystyle.normal.textColor = Color(0.6, 0.4, 0.2, 1.0);
		
		
		l_bg1.setBackground("report-cup-bg",TextureType.DECORATION);
		l_bg2.useTile = true;
		l_bg2.tile = TextureMgr.instance().IconSpt().GetTile("Round_CheckBox");
	}
	
	public function DrawItem()
	{
		if(timeRemaining.isVisible())
			updateTime();
	
		MainMsg.Draw();
		btnConfirm.Draw();
		line1.Draw();
		line2.Draw();
		extraLabe.Draw();
		extraLabe2.Draw();
		extraLabe3.Draw();
		extraLabe4.Draw();
		extraLabe5.Draw();
		extraLabe6.Draw();
		timeRemaining.Draw();
		l_bg1.Draw();
		l_bg2.Draw();
		l_bg3.Draw();
		lighticon.Draw(); 
		icon.Draw();	
	}
	
	private function updateTime():void
	{
		var curTime:long = GameMain.instance().unixtime();
		timeRemaining.txt = _Global.timeFormatShortStr(endtime -curTime,true);
	}
	
	public function OnPush(param:Object)
	{		
		super.OnPush(param);
		
		extraLabe.SetVisible(false);
		extraLabe2.SetVisible(false);
		extraLabe3.SetVisible(false);
		extraLabe4.SetVisible(false);
		extraLabe5.SetVisible(false);
		extraLabe6.SetVisible(false);
		timeRemaining.SetVisible(false);
		btnConfirm.SetVisible(false);

		icon.SetVisible(false);
		lighticon.SetVisible(false);
		l_bg1.SetVisible(false);
		l_bg2.SetVisible(false);
		l_bg3.SetVisible(false);

		line1.SetVisible(false);
		line2.SetVisible(false);
		
		setMsgTxtColor(FontColor.Description_Light);
		
		var data:Hashtable = param as Hashtable;
		btnClose.SetVisible(data["isShowCloseButton"]);
		if(data["btnTxt"])
		{
			btnConfirm.txt = data["btnTxt"];
			btnConfirm.SetVisible(true);
		}
		else
			btnConfirm.SetVisible(false);
		btnConfirm.OnClick = data["btnHandler"];
		MainMsg.txt = data["Msg"];
		
		if(data["MainIcon"])
		{
			icon.SetVisible(true);
			icon.Background = TextureMgr.instance().loadBuildingTextureFromSprite(data["MainIcon"]);//Resources.Load(data["MainIcon"]);
		}
		
		if(data["DecrateIcon"])
		{
			lighticon.SetVisible(true);
			lighticon.setBackground(data["DecrateIcon"],TextureType.DECORATION);
			lighticon.rect = icon.rect;
			lighticon.rect.x -= 0.3 * icon.rect.width;
			lighticon.rect.y -= 0.2 * icon.rect.height;
			lighticon.rect.width = 1.6 * icon.rect.width;
			lighticon.rect.height = 1.6 * icon.rect.height;
		}
		
		if(data["bg1"])
		{
			l_bg1.SetVisible(true);
			l_bg1.setBackground(data["bg1"],TextureType.DECORATION);
		}
		
		if(data["bg2"])
		{
			l_bg2.SetVisible(true);
			l_bg2.tile = TextureMgr.instance().GetGearIcon(data["bg2"]);
		}
		
		if(data["bg3"])
		{
			l_bg3.SetVisible(true);
			l_bg3.setBackground(data["bg3"],TextureType.DECORATION);
		}
		
		if(data["isLineShown"])
		{
			line1.SetVisible(true);
			line2.SetVisible(true);
		}
		else if(data["isLine1Show"])
		{
			line1.SetVisible(true);
			line2.SetVisible(false);
		}
		else if(data["isLine2Show"])
		{
			line1.SetVisible(false);
			line2.SetVisible(true);
		}
		else
		{
			line1.SetVisible(false);
			line2.SetVisible(false);
		}
		
		
		
		if(data["timeRemainingShown"] != null )
			timeRemaining.SetVisible(data["timeRemainingShown"]);
		else
			timeRemaining.SetVisible(false);
		if(data["timeRemaning"] != null)
			endtime = data["timeRemaning"];
		if(data["extraLabel"])
		{
			extraLabe.SetVisible(true);
			extraLabe.txt = data["extraLabel"];
		}
		else
			extraLabe.SetVisible(false);
		
		if(data["extraLabe2"])
		{
			extraLabe2.SetVisible(true);
			extraLabe2.txt = data["extraLabe2"];
		}
		else
			extraLabe2.SetVisible(false);
		
		if(data["extraLabe3"])
		{
			extraLabe3.SetVisible(true);
			extraLabe3.txt = data["extraLabe3"];
		}
		else
			extraLabe3.SetVisible(false);
			
		if(data["extraLabe4"])
		{
			extraLabe4.SetVisible(true);
			extraLabe4.txt = data["extraLabe4"];
		}
		else
			extraLabe4.SetVisible(false);
		
		if(data["extraLabe5"])
		{
			extraLabe5.SetVisible(true);
			extraLabe5.txt = data["extraLabe5"];
		}
		else
			extraLabe5.SetVisible(false);
			
		if(data["extraLabe6"])
		{
			extraLabe6.SetVisible(true);
			extraLabe6.txt = data["extraLabe6"];
		}
		else
			extraLabe6.SetVisible(false);
			
		if(data["responseBackKey"] != null){
			responseBackKey = data["responseBackKey"];
		}else{
			responseBackKey = true;
		}
	}
	
	public function setLayout(wid:int,hgt:int):void
	{
		if(wid <= 0)
			wid = this.rect.width;
			
		this.rect.width = wid;
		this.rect.height = hgt;
		
//		frameLabel.rect.width = wid;
//		frameLabel.rect.height = hgt;
		
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width)/2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height)/2;		
				
		layout();		
		super.resetLayout();
	}
	
	protected function layout():void
	{
		btnConfirm.changeToBlueNew();
		btnConfirm.rect.width = 280;
		btnConfirm.rect.height = 80;
		btnClose.rect.x = rect.width - btnClose.rect.width;
		var dx:int = rect.width - btnConfirm.rect.width * 1.5;
		btnConfirm.rect.x = dx;		
		btnConfirm.rect.y = rect.height - btnConfirm.rect.height - 30;
		
		frameSimpleLabel.rect.x = 0;
		frameSimpleLabel.rect.y = 0;
		frameSimpleLabel.rect.width = rect.width;
		frameSimpleLabel.rect.height = rect.height + 5;
		
//		bgMiddleBodyPic.rect.x = 0;
//		bgMiddleBodyPic.rect.y = 0;
//		bgMiddleBodyPic.rect.width = rect.width + 2;
		//bgMiddleBodyPic.rect.height = (rect.height + 5)/bgMiddleBodyPic.Re;
	}
	
	public function setMsgLayout(x:int,y:int,w:int,h:int):void
	{
		MainMsg.rect.x = x;
		MainMsg.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		MainMsg.rect.width = w;
		MainMsg.rect.height = h;
	}
	
	public function setLine1Layout(x:int,y:int,w:int,h:int):void
	{
		line1.rect.x = x;
		line1.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		line1.rect.width = w;
		line1.rect.height = h;
	}
	
	public function setLine2Layout(x:int,y:int,w:int,h:int):void
	{
		line2.rect.x = x;
		line2.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		line2.rect.width = w;
		line2.rect.height = h;
	}
	
	public function setextraLabeLayout(x:int,y:int,w:int,h:int):void
	{
		extraLabe.rect.x = x;
		extraLabe.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		extraLabe.rect.width = w;
		extraLabe.rect.height = h;
	}
	
	public function setextraLabe2Layout(x:int,y:int,w:int,h:int):void
	{
		extraLabe2.rect.x = x;
		extraLabe2.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		extraLabe2.rect.width = w;
		extraLabe2.rect.height = h;
	}
	
	public function setextraLabe3Layout(x:int,y:int,w:int,h:int):void
	{
		extraLabe3.rect.x = x;
		extraLabe3.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		extraLabe3.rect.width = w;
		extraLabe3.rect.height = h;
	}
	
	public function setextraLabe4Layout(x:int,y:int,w:int,h:int):void
	{
		extraLabe4.rect.x = x;
		extraLabe4.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		extraLabe4.rect.width = w;
		extraLabe4.rect.height = h;
	}
	
	public function setextraLabe6Layout(x:int,y:int,w:int,h:int):void
	{
		extraLabe6.rect.x = x;
		extraLabe6.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		extraLabe6.rect.width = w;
		extraLabe6.rect.height = h;
	}
	
	public function setextraLabe5Layout(x:int,y:int,w:int,h:int):void
	{
		extraLabe5.rect.x = x;
		extraLabe5.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		extraLabe5.rect.width = w;
		extraLabe5.rect.height = h;
	}
	
	public function settimeRemainingLayout(x:int,y:int,w:int,h:int):void
	{
		timeRemaining.rect.x = x;
		timeRemaining.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		timeRemaining.rect.width = w;
		timeRemaining.rect.height = h;
	}
	
	public function setIconLayout(x:int,y:int,w:int,h:int):void
	{
		icon.rect.x = x;
		icon.rect.y = y;
		if(w == 0)
			w = rect.width - 2*x;
		icon.rect.width = w;
		icon.rect.height = h;
	}
	
	public function setBG1Layout(x:int,y:int,w:int,h:int):void
	{
		l_bg1.rect.x = x;
		l_bg1.rect.y = y;
		l_bg1.rect.width = w;
		l_bg1.rect.height = h;
	}
	
	public function setBG2Layout(x:int,y:int,w:int,h:int):void
	{
		l_bg2.rect.x = x;
		l_bg2.rect.y = y;
		l_bg2.rect.width = w;
		l_bg2.rect.height = h;
	}
	
	public function setBG3Layout(x:int,y:int,w:int,h:int):void
	{
		l_bg3.rect.x = x;
		l_bg3.rect.y = y;
		l_bg3.rect.width = w;
		l_bg3.rect.height = h;
	}
	
	public function setLighticonLayout(x:int,y:int,w:int,h:int):void
	{
		lighticon.rect.x = x;
		lighticon.rect.y = y;
		lighticon.rect.width = w;
		lighticon.rect.height = h;
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
			case Constant.Notice.RESEARCH_COMPLETE:
				if(MenuMgr.getInstance().GetCurMenu() == this)
					MenuMgr.getInstance().PopMenu("");
				break;
			
			default:
				break;
		}
	}
	
	public function OnBackButton() : boolean
	{
		return !responseBackKey;
	}
	
	public function SetExtraLabeTxtColor(color:FontColor)
	{
		extraLabe.SetNormalTxtColor(color);
	}
	
	public function setMsgTxtColor(color:FontColor)
	{
		MainMsg.SetNormalTxtColor(color);
	}
	
}
