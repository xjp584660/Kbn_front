class BuffIcon extends UIObject
{
	public var iconAttack:Label;
	public var iconAttackNum:Label;
	
	public var iconBuff1:Label;
	public var iconBuff2:Label;
	public var iconBuff3:Label;
	public var iconBuff4:Label;
	public var iconBuff5:Label;
	
	public var simpleBtn:SimpleButton;
	public var simpleBtnAlert:SimpleButton;
	
	public var attackComponent:ComposedUIObj;
	public var buffComponent:ComposedUIObj;
	private var g_isDisplayAlert:boolean = false;
	private static var MAX_ATTACK_NUMBER:int = 99;
	
	private static var PATH:String = "buff_";
	
	public function Init():void
	{
		iconAttack.Init();
		iconAttackNum.Init();
		
		iconAttack.useTile = true;
		iconAttack.drawTileByGraphics = true;
		iconAttack.tile = TextureMgr.instance().ElseIconSpt().GetTile("buff_attack");
		
		iconBuff1.Init();
		iconBuff2.Init();
		iconBuff3.Init();
		iconBuff4.Init();
		iconBuff5.Init();
		
		simpleBtn.Init();
		simpleBtn.OnClick = handleClick;
		
		simpleBtnAlert.Init();
		simpleBtnAlert.OnClick = handleClickAlert;	

		g_isDisplayAlert = false;
		iconAttack.SetVisible(g_isDisplayAlert);
		iconAttackNum.SetVisible(g_isDisplayAlert);
		this.simpleBtnAlert.SetDisabled(!g_isDisplayAlert);

		attackComponent.Init();
		buffComponent.Init();

		priv_initLayout();
		Update();
	}

	private function handleClickAlert():void
	{
		var	slotId:int = Building.instance().getPositionForType(Constant.Building.WATCH_TOWER);
		
		if( slotId  == -1 )
		{
//			ErrorMgr.instance().PushError("",arStrings["Scout"]["NoUniversityDesc"]);
		}
		else
		{
			var buildInfor:Building.BuildingInfo = Building.instance().buildingInfo(slotId, Constant.Building.WATCH_TOWER);		
			MenuMgr.getInstance().PushMenu("WatchTowerMenu", buildInfor);
			MenuMgr.getInstance().getMenuAndCall("WatchTowerMenu", function(menu : KBNMenu) { 
				var watchTowerMenu:WatchTowerMenu = menu as WatchTowerMenu;
				if ( watchTowerMenu != null )
					watchTowerMenu.titleTab.SelectTab(1);
			});
		}

	}
	
	private function handleClick():void
	{
		MenuMgr.getInstance().PushMenu("BuffMenu", null, "trans_zoomComp", GameMain.instance().ScreenToRelativeRect(simpleBtn.ScreenRect).center);
	}

	public function Draw()
	{
		if ( Event.current.type == EventType.Repaint )
			return;
		//var oldMatrix : Matrix4x4 = GUI.matrix;
		//GUI.matrix = Matrix4x4.identity;
		var tempLabel:Label;
		var arr:Array = BuffAndAlert.instance().buffIconForMainChrome;	
		if(arr.length > 0)
		{
			tempLabel = buffComponent.component[5 - arr.length];
			simpleBtn.rect.x = tempLabel.rect.x;
			simpleBtn.rect.width = buffComponent.component[buffComponent.component.length-1].rect.xMax - simpleBtn.rect.x;
			simpleBtn.rect.y = tempLabel.rect.y;
			simpleBtn.rect.height = tempLabel.rect.height;
		}
		else
		{
			tempLabel = buffComponent.component[buffComponent.component.length-1];
			simpleBtn.rect.x = tempLabel.rect.x;
			simpleBtn.rect.width = tempLabel.rect.width;
			simpleBtn.rect.y = tempLabel.rect.y;
			simpleBtn.rect.height = tempLabel.rect.height;

			//tempLabel = buffComponent.component[4];
			//tempLabel.useTile = true;
			//tempLabel.tile.spt = TextureMgr.instance().ElseIconSpt();
			//tempLabel.tile.name = PATH + "5";
		}
		simpleBtn.MakeNeedScreenRectOnce();
		simpleBtn.Draw();
		//GUI.matrix = oldMatrix;
		return;
		//GUI.BeginGroup(rect);
	
		//if(g_isDisplayAlert)
		//{			
		//	attackComponent.Draw();
		//	simpleBtnAlert.Draw();
		//}

		//var oldMatrix:Matrix4x4 = GUI.matrix;
		//GUI.matrix = Matrix4x4.identity;		
		//globalPos = GUIUtility.GUIToScreenPoint(new Vector2(simpleBtn.rect.x + simpleBtn.rect.width * 0.5, simpleBtn.rect.y + simpleBtn.rect.height * 0.5));
		//GUI.matrix = oldMatrix;

		//buffComponent.Draw();
		//simpleBtn.Draw();

		//GUI.EndGroup();
	}
	
	public function get isDisplayAlert():boolean
	{
		return g_isDisplayAlert;
	}
	
	public function Update()
	{
		BuffAndAlert.instance().update();
	
		var lastState : boolean = g_isDisplayAlert;
		if(BuffAndAlert.instance().isUpdateAlert)
		{
			if(BuffAndAlert.instance().attackNum > 0)
			{
				g_isDisplayAlert = true;
				//m_iconsLayout.AddItem(m_attackFrame, 0, 0); 
				iconAttackNum.txt = createAttackNum(BuffAndAlert.instance().attackNum);
			}
			else
			{
				g_isDisplayAlert = false;
				//m_iconsLayout.AddItem(null, 0, 0); 
			}
			
			iconAttack.SetVisible(g_isDisplayAlert);
			iconAttackNum.SetVisible(g_isDisplayAlert);
			this.simpleBtnAlert.SetDisabled(!g_isDisplayAlert);
			BuffAndAlert.instance().setAlertFalse();
		}
		
		if (lastState != g_isDisplayAlert)
		{
			MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
		}
		
		if(BuffAndAlert.instance().isUpdateBuff)
		{
			clearPic();
			
			var tempLabel:Label;
			var arr:Array = BuffAndAlert.instance().buffIconForMainChrome;	
			if ( arr.length != 0 )
			{
				for(var a:int = 0; a < arr.length; a++)
				{
					tempLabel = buffComponent.component[5 - arr.length + a];
					tempLabel.useTile = true;
					tempLabel.tile = TextureMgr.instance().ElseIconSpt().GetTile(PATH + arr[a]);
					//tempLabel.tile.name = PATH + arr[a];
				}
			}
			else
			{
				tempLabel = buffComponent.component[4];
				tempLabel.useTile = true;
				tempLabel.tile = TextureMgr.instance().ElseIconSpt().GetTile(PATH + "5");
				//tempLabel.tile.name = PATH + "5";				
			}
			
			BuffAndAlert.instance().setBuffFalse();
		}
	}
	
	private function createAttackNum(num:int):String
	{
		var returnNum:String;
		if(num > MAX_ATTACK_NUMBER)
		{
			returnNum = MAX_ATTACK_NUMBER + "";
		}
		else
		{
			if(num < 10)
			{
				returnNum = "0" + num;
			}
			else
			{
				returnNum = num + ""; 
			}
		}
		
		return returnNum;
	}
	
	private function clearPic():void
	{
		var temp:Label;
		for(var a:int = 0; a < buffComponent.component.length; a++)
		{
			temp = buffComponent.component[a] as Label;
			temp.mystyle.normal.background = null;
			temp.useTile = false;
		}
	}
	
	public function SetDisabled(disabled:boolean)
	{
		this.simpleBtn.SetDisabled(disabled);
		//this.simpleBtnAlert.SetDisabled(disabled);
		super.SetDisabled(disabled);
	}

	private function priv_initLayout()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var textResource : TextAsset;
		if ( _Global.IsLargeResolution() )
			textResource = texMgr.LoadUILayout("BuffIcon.high");
		else
			textResource = texMgr.LoadUILayout("BuffIcon.low");

		var memStream : System.IO.Stream = new System.IO.MemoryStream(textResource.bytes);
		var initPropList : System.Collections.Generic.Dictionary.<String, Object> = new System.Collections.Generic.Dictionary.<String, Object>();
		initPropList["@ThisMenu"] = this;
		m_Root = UILayout.XAMLResReader.ReadFile(memStream, initPropList) as UILayout.UIFrame;
		m_iconsLayout = m_Root.FindItem("_Main") as UILayout.Grid;
		m_attackFrame = m_Root.FindItem("AttackZone");
		//if ( !g_isDisplayAlert )
		//	m_iconsLayout.AddItem(null, 0, 0); 
		/*
		m_iconsLayout = new UILayout.Grid(3, 1);
		m_iconsLayout.Row(0).Max = 60;
		m_iconsLayout.Row(0).Min = 32;
		var attackZone : UIObjContainForLayout = new UIObjContainForLayout(); 
		attackZone.Name = "AttackZone";
		m_attackFrame = attackZone;
		if ( g_isDisplayAlert )
			m_iconsLayout.AddItem(m_attackFrame, 0, 0); 
		attackZone.AddItem(ObjToUI.Cast(simpleBtnAlert));

			var attackGrid : UILayout.Grid = new UILayout.Grid(2, 1);
			attackZone.SetChrFrame(attackGrid);
	
			priv_putInfo(attackGrid, iconAttack, 0);
			var attackNumUI : UIObjContainForLayout = priv_putInfo(attackGrid, iconAttackNum, 1); 
			var attackNumUIInfo : UIObjContainForLayout.UIObjInfo = attackNumUI.GetUIItem(0);
			//attackNumUIInfo.lockType = UIObjContainForLayout.LockType.LockHeight;
			attackNumUIInfo.vFill = UIObjContainForLayout.FillVertical.Center;
			//attackNumUI.TargetArea.Width.Max = 60;

 		var normalZone : UIObjContainForLayout = new UIObjContainForLayout();
 		normalZone.Name = "NormalZone";
 		//normalZone.AddItem(ObjToUI.Cast(simpleBtn));
 		m_iconsLayout.AddItem(normalZone, 2, 0); 

	  		var normalGrid : UILayout.Grid = new UILayout.Grid(5, 1);
			normalZone.SetChrFrame(normalGrid);

			priv_putInfo(normalGrid, iconBuff1, 0);
			priv_putInfo(normalGrid, iconBuff2, 1);
			priv_putInfo(normalGrid, iconBuff3, 2);
			priv_putInfo(normalGrid, iconBuff4, 3);
			priv_putInfo(normalGrid, iconBuff5, 4);
		*/
	}

	//private function priv_putInfo(uiPnt : UILayout.Grid, uiObj : UIObject, index : uint) : UIObjContainForLayout
	//{
	//	var uiObjContain : UIObjContainForLayout = new UIObjContainForLayout();
	//	uiObjContain.AddItem(ObjToUI.Cast(uiObj), 0, UIObjContainForLayout.FillHorizon.DockRight, UIObjContainForLayout.FillVertical.DockTop, UIObjContainForLayout.LockType.LockRadio);
	//	uiObjContain.TargetArea.Width.Min=16;
	//	uiObjContain.TargetArea.Width.Max=60;
	//	uiPnt.AddItem(uiObjContain, index, 0);
	//	return uiObjContain;
	//}
	
	public function get UIFrame() : UILayout.UIFrame
	{
		return m_Root;
	} 
	
	public var m_Root : UILayout.UIFrame;
	public var m_iconsLayout : UILayout.Grid;
	public var m_attackFrame : UILayout.UIFrame;
}