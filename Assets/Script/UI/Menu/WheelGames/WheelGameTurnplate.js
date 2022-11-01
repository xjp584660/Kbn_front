#pragma strict
import System.Collections.Generic.List;

enum WheelGameEnumType
{	PlatinumPrize
,	GoldPrize
,	SilverPrize
,	BronzePrize
,	Key
,	GrandPrize
}

enum WheelRollType
{
	oneRollType = 1,
	nineRollType = 3,
}

@JasonReflection.JasonDataAttribute
class WheelGameData
{
	public var wheelGameId : int;
	@JasonReflection.JasonDataAttribute("gems")
	public var costGems : int;
	@JasonReflection.JasonDataAttribute("tokens")
	public var costToken : int;
	@JasonReflection.JasonDataAttribute("prizeinbox")
	public var prizeInboxId : int;
	@JasonReflection.JasonDataAttribute("startflag")
	public var isCanStart : int;
	@JasonReflection.JasonDataAttribute("segment")
	public var itemsId : int[];
	@JasonReflection.JasonDataAttribute("segmenttype")
	public var itemsType : int[];
	@JasonReflection.JasonDataAttribute("keyslot")
	public var keySlot : int[];
}


@JasonReflection.JasonDataAttribute
class WheelGamePrize
{
	public var prize : int;
	public var keyslot : int[];
	public var itemid : int;
	public var slot : int;
}

class WheelGameTurnplate   extends KBNMenu
{
	public static var gm_isHaveBKColor : boolean = false;
	public static var gm_bkColor : Color;
	public static function SetBackgroundColor(value : Color)
	{
		gm_bkColor = value;
		gm_bkColor.a = 1.0f;
		gm_isHaveBKColor = true;
	}

	public var clone_menuHead : MenuHead;
	
	public var timeLeftToSpin : Label;
	public var topPointer : Label;
	public var tabTheChest : Label;
	//public var btnGemsSpin : Button;
	//public var btnTokensSpin : Button;
	public var oneBtn : Button;
	public var nineBtn : Button;
	public var btnSpin : Button;
	public var lbLessKeys : Label;
	public var youOwnTokens : Label;
	public var lbWheelPanel : Label;
	public var leftLionEyes : SimpleLabel;
	public var rightLionEyes : SimpleLabel;
	public var bottomLabel : Label;
	public var startItemBackgroundColor : Color;
	public var m_itemBackgroundColor : Color;
	public var startItemColor : Color;
	public var m_itemColor : Color;
	
	public var bgStartPos : Vector2;	//	410,80
	public var ladyStartPos : Vector2;	//	??,??
	public var panelItemRadiuAndSize : Vector2;
	
	//public var material : Material;
	public var m_bkColor : Color;
	public var m_openKeyColor : Color;
	//private var m_allKeyColor : Color;
	
	public var m_keyArea : Label;

	public var m_spinTxt : Label;
	public var m_costTxt : Label;

	public var m_wheelPanel : WindmillAnim;
	//private var m_wheelLight : WindmillAnim;
	public var m_backGroundDraw : RenderRectMaker;
	public var m_backLightDraw : RenderRectMaker;
	public var m_backLightArray : RenderRectMaker[];
	//private var m_uiFrameRoot : UILayout.UIFrame;
	//private var m_uiFrameMgr : UIElementMgr = new UIElementMgr();
	public var m_menuHead : MenuHead;
	public var m_waitingLabel : LoadingLabelImpl;
	//private	var m_stopTime : System.DateTime;
	
	public var m_lightPic : Tile[];
	
	public var m_pfnUpdate : function():void = null;
	public var m_pfnUpdateTimeLeft : function() : void = null;

	public var m_wheelCount : int = 8;
	public var m_lightCount : int = 32;

	public var m_doorDistance : float = 0.0f;
	public var startDoorDistance : float;

	public var startLightStartY : float;
	public var startLightFromCenterLength : float;
	public var startLightRangeDistance : float;

	public var cfg_firstKeyAngle : float;
	public var lightSize : float;
	public var lightRadius : float;
	public var m_beginStartColorTurnTime : float;

	public var m_wheelGameData : WheelGameData;
	public var m_wheelSprit : TileSprite;
	public var m_isCanStop : boolean;
	
	public var m_hightLayer : int = 1;
	public var m_haveKeyCount : Label;
	public var m_buyOneCostGems : Label;
	public var m_buyNineCostGems: Label;

	@Space(30) @Header("=============")
	@SerializeField private var infoBtn: Button;

	public var testYPos:int=960;
	public function Init()
	{
		super.Init();
		m_waitingLabel = null;
		m_isCanStop = false;
		//m_allKeyColor = Color.white;
		//m_allKeyColor.a = 1.0f;
		var texMgr : TextureMgr = TextureMgr.instance();
		texMgr.DestroyGearSpt();
		m_wheelSprit = texMgr.GetWheelGamesSpt();
		m_itemBackgroundColor = startItemBackgroundColor;
		m_itemColor = startItemColor;
		m_doorDistance = startDoorDistance;
		//m_doorDistance = m_keyArea.rect.height * 0.5f;

		m_isTouch = false;
		m_wheelGameData = null;
		m_backGroundDraw = null;
		m_backLightDraw = null;
		m_backLightArray = null;
		m_moveKey = null;
		m_pfnUpdate = null;
		m_pfnUpdateTimeLeft = null;
		btnSpin.OnClick = priv_tryStartRoll;
		oneBtn.OnClick = priv_oneRewardGameStart;
		nineBtn.OnClick = priv_nineRewardGameStart;

		//lbWheelPanel.NeedScreenRect = true;
		priv_updateTokenCount();
		priv_updateLessKeyCount();
		//priv_updateButtonState();
		priv_updateTimeLeft();

		btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_gray", TextureType.BUTTON);
		btnSpin.mystyle.active.background = texMgr.LoadTexture("RoundButton_gray", TextureType.BUTTON);

		topPointer.tile = m_wheelSprit.FindTile("Pointer");
		topPointer.useTile = true;

		m_spinTxt.txt = Datas.getArString("WheelGame.ButtonSpin");
		tabTheChest.txt = Datas.getArString("WheelGame.LabelTapTheChest");

		if ( gm_isHaveBKColor )
			m_bkColor = gm_bkColor;

		leftLionEyes.tile = m_wheelSprit.FindTile("Lion_Eyes");
		leftLionEyes.useTile = true;
		leftLionEyes.rect.height = leftLionEyes.tile.rect.height;
		leftLionEyes.rect.width = leftLionEyes.tile.rect.width;
		rightLionEyes.tile = m_wheelSprit.FindTile("Lion_Eyes");
		rightLionEyes.useTile = true;
		rightLionEyes.rect.height = rightLionEyes.tile.rect.height;
		rightLionEyes.rect.width = rightLionEyes.tile.rect.width;
	}

	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		wheelGameNineDatas = null;
		wheelGameNineKeys.Clear();
		priv_getKeysCount();
		
		m_menuHead = this.Instantiate(clone_menuHead);
		m_menuHead.Init();
		m_menuHead.setTitle(Datas.getArString("WheelGame.PageTitle"));
		setUIRect();
		
		btnSpin.rect = new Rect(lbWheelPanel.rect.center.x - btnSpin.rect.width*0.5f
		, lbWheelPanel.rect.center.y - btnSpin.rect.height*0.5f
		, btnSpin.rect.width
		, btnSpin.rect.height)
		;
		
		var logicSize : Vector2 = priv_LogicScreenSize;//var logicHeight : float = Screen.height*640.0f/Screen.width;
		this.rect.width = logicSize.x;
		this.rect.height = logicSize.y;
		this.frameTop.rect.width = this.rect.width;
		youOwnTokens.rect.y = logicSize.y - youOwnTokens.rect.height;
		
		if(adapterIphoneX)
		{
			m_bottom.rect.height = IphoneXBottomFrameHeight(logicSize.y);
			var b_offsetY:int = m_bottom.rect.height;

			youOwnTokens.rect.y = logicSize.y - youOwnTokens.rect.height-b_offsetY;
		}
		

		m_menuHead.btn_getmore.rect.x = this.rect.width - m_menuHead.btn_getmore.rect.width;
		m_menuHead.btn_getmore.rect.height+=10;
		m_menuHead.btn_back.rect.height+=10;
		m_menuHead.l_gem.rect.x += this.rect.width - 640;
		m_menuHead.backTile.rect.width = this.rect.width;
		m_menuHead.backTile.rect.height +=20;
		m_menuHead.rect.width = this.rect.width;

		//m_menuHead.l_gem.mystyle.normal.background = null;
		m_wheelGameData = new WheelGameData();
		m_wheelGameData.wheelGameId = param;

		UnityNet.WheelGamesGetDetailInfo(m_wheelGameData.wheelGameId, priv_onRecvWheelGameInfo, null);

		priv_loadCtrl();
		priv_initPanelAndItems();
		m_wheelPanel.SetColor(startItemBackgroundColor, 0);
		m_wheelPanel.SetColor(startItemColor, 2);
		m_wheelPanel.SetColor(startItemColor, 3);
		m_isCanStop = true;


		infoBtn.OnClick = function () {
			MenuMgr.getInstance().PushMenu("WheelGameMenu", null);
		};

	}

	private function priv_onRecvWheelGameInfo(r : HashObject)
	{
		m_waitingLabel = new LoadingLabelImpl();
		MystryChest.instance().AddLoadMystryChestCallback(function()
		{
			var menu: WheelGameTurnplate   = MenuMgr.getInstance().getMenu("WheelGameTurnplate", false) as WheelGameTurnplate;
			if ( menu == null )
				return null;
			menu.priv_onRecvWheelGameInfoAndMystryChestLoadOK(r);
		});
	}

	private function priv_onRecvWheelGameInfoAndMystryChestLoadOK(r : HashObject)
	{
		m_waitingLabel = null;
		if ( r["ok"] == null || r["ok"] == false )
		{
			priv_onRecvWheelGameInfoLost(r);
			return;
		}
		JasonReflection.JasonConvertHelper.ParseToObjectOnce(m_wheelGameData, r);
		if ( m_wheelGameData.itemsType == null )
		{
			m_wheelGameData.itemsType = new int[m_wheelGameData.itemsId.Length];
			for (var p : int = 0; p != m_wheelGameData.itemsId.Length; ++p )
			{
				if ( m_wheelGameData.itemsId[p] == Constant.ItemId.WHEELGAME_KEY )
					m_wheelGameData.itemsType[p] = WheelGameEnumType.Key;
				else
					m_wheelGameData.itemsType[p] = WheelGameEnumType.BronzePrize;
			}
		}
		priv_loadCtrl();
		priv_updateLessKeyCount();
		priv_updateButtonState();
		if ( !priv_loadPanelItem() )
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			var confirmDlg : ConfirmDialog = menuMgr.getConfirmDialog();
			var notice : String = Datas.getArString("Wheel.FailToGetChest");
			var popMenu : System.Action = function()
			{
				menuMgr.PopMenu("");
			};
			menuMgr.PushConfirmDialog(notice, ""
				, popMenu, null, true
				);
			confirmDlg.SetCancelAble(false);
			var oldCloseFunc : Function = confirmDlg.btnClose.OnClick;
			confirmDlg.btnClose.OnClick = function(param:Object)
			{
				oldCloseFunc(null);
				popMenu();
			};
			return;
		}
		if ( m_wheelGameData.isCanStart == 1 )
		{
			isOneRoll = true; 
			priv_tryStartRoll(null);
		}
		else if(m_wheelGameData.isCanStart == 2)
		{
			btnSpin.SetDisabled(true);
			var texMgr : TextureMgr = TextureMgr.instance();
			btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_gray", TextureType.BUTTON);
			
			oneBtn.SetDisabled(true);
			oneBtn.changeToGreyNew();
			
			nineBtn.SetDisabled(true);
			nineBtn.changeToGreyNew();
			
//			m_menuHead.wheelGameRollStart();
			
			priv_wheelGameReward(9);
			priv_readyOneTurnRoundValid();	
		}
		else
		{
			m_pfnUpdate = priv_checkForClickWheel;
			m_pfnUpdateTimeLeft = priv_updateTimeLeft;
		}
	}

	private function priv_onRecvWheelGameInfoLost(r : HashObject)
	{
	}

	//public function OnPushOver() : void
	//{
	//	lbWheelPanel.MakeNeedScreenRectOnce();
	//}

	public function OnPopOver()
	{
		TryDestroy(m_menuHead);
		m_menuHead = null;
	}

	public function Update()
	{
		if ( m_waitingLabel != null )
			m_waitingLabel.Update();
		if ( m_pfnUpdate != null )
			m_pfnUpdate();

		if ( m_pfnUpdateTimeLeft != null )
			m_pfnUpdateTimeLeft();	
	}

	private function priv_updateTimeLeft() : void
	{
		var lessTime : int = MenuMgr.getInstance().MainChrom.WheelGameLeftTotalSecond;
		var st:System.TimeSpan = System.TimeSpan(lessTime*System.TimeSpan.TicksPerSecond);
		var lessTimeStr : String = _Global.timeFormatStr(lessTime);
		if ( st.TotalDays < 1 )
		{
			lessTimeStr = String.Format("<color=\"red\">{0}</color>", lessTimeStr);
		}
		var fmtString : String = Datas.getArString("WheelGame.LabelTimeLeft");
		timeLeftToSpin.txt = fmtString + " " + lessTimeStr; // String.Format(fmtString, lessTimeStr);
		if ( lessTime <= 0 && m_isCanStop )
		{
			priv_resetStage();
			m_pfnUpdateTimeLeft = null;
		}
	}

	public function Draw()
	{
		var oldMatrix : Matrix4x4 = GUI.matrix;

		var logicSize : Vector2 = priv_LogicScreenSize;
		_Global.setGUIMatrix(logicSize.x, logicSize.y);
		this.rect.width = logicSize.x;
		this.rect.height = logicSize.y;
//		
		if(adapterIphoneX){
			GUI.BeginGroup(m_top.rect);
			m_top.Draw();
			GUI.EndGroup();
		}
		GUI.BeginGroup(this.rect);
		m_menuHead.Draw();
		//m_uiFrameMgr.Draw();
		GUI.EndGroup();

		if ( IsPaint() )
		{
			var vsMatrix : Matrix4x4 = UnityEngine.Matrix4x4.TRS(new Vector3(0.0f, this.rect.y, 0.0f), UnityEngine.Quaternion.identity, UnityEngine.Vector3.one);
			m_backGroundDraw.Cache.VSMatrix = vsMatrix;
			m_backGroundDraw.Cache.OrtMatrix = GUI.matrix;
			m_backGroundDraw.Cache.Draw();
			
			m_backLightDraw.Cache.VSMatrix = vsMatrix;
			m_backLightDraw.Cache.OrtMatrix = GUI.matrix;
			m_backLightDraw.Cache.Draw();
			
			priv_updateWheelRect();
			m_wheelPanel.VSMatrix = vsMatrix;
			m_wheelPanel.OrtMatrix = GUI.matrix;
			m_wheelPanel.Draw();
			//m_wheelLight.VSMatrix = vsMatrix;
			//m_wheelLight.OrtMatrix = GUI.matrix;
			//m_wheelLight.Draw();

			GUI.BeginGroup(this.rect);
			frameTop.Draw();
			//btnGemsSpin.Draw();
			//btnTokensSpin.Draw();
			btnSpin.Draw();
			oneBtn.Draw();
			nineBtn.Draw();
			m_keyArea.Draw();
			lbLessKeys.Draw();
			timeLeftToSpin.Draw();
			tabTheChest.Draw();
			lbWheelPanel.Draw();
			bottomLabel.Draw();
			youOwnTokens.Draw();
			m_spinTxt.Draw();
			m_costTxt.Draw();
			topPointer.Draw();
			if ( m_moveKey != null )
				m_moveKey.Draw();
			leftLionEyes.Draw();
			rightLionEyes.Draw();
			m_haveKeyCount.Draw();	
			m_buyOneCostGems.Draw();
			m_buyNineCostGems.Draw();
			infoBtn.Draw();
			GUI.EndGroup();
		}
		else if ( m_waitingLabel == null )
		{
			GUI.BeginGroup(this.rect);
			//btnGemsSpin.Draw();
			//btnTokensSpin.Draw();
			btnSpin.Draw();
			oneBtn.Draw();
			nineBtn.Draw();
			m_haveKeyCount.Draw();	
			m_buyOneCostGems.Draw();
			m_buyNineCostGems.Draw();
			infoBtn.Draw();
			GUI.EndGroup();
		}
		if(adapterIphoneX){
			GUI.BeginGroup(new Rect(m_bottom.rect.x,logicSize.y-m_bottom.rect.height,m_bottom.rect.width,m_bottom.rect.height));
			m_bottom.Draw();
			GUI.EndGroup();
		}
		GUI.matrix = oldMatrix;
		if ( m_waitingLabel != null )
			m_waitingLabel.Draw();
			
		
	}
	
	private function IphoneXTopFrameHeight(height:float):float
	{
		return (45.0f/812)*height;
	}

	private function IphoneXBottomFrameHeight(height:float):float
	{
		return (36.0f/812)*height;
	}

	public function get LocalMenuHead() : MenuHead
	{
		return m_menuHead;
	}

	private function priv_loadCtrl()
	{
		priv_loadCtrlByLastKeyAndMulColor(-1, Color.white);
	}
	
	public var btnOffset : int = 45;
	private function priv_loadCtrlByLastKeyAndMulColor(keySlotIndex : int, curKeyCol : Color)
	{
		//var texMgr : TextureMgr = TextureMgr.instance();
		var spt : TileSprite = m_wheelSprit;
		if ( m_backGroundDraw == null )
		{
			m_backGroundDraw = new RenderRectMaker();
			m_backGroundDraw.Cache.SourceGroup = spt;
		}
		else
		{
			m_backGroundDraw.Cache.Clear();
		}

		var bkGround : Tile = spt.FindTile("Wheelgame_Background_gray");
		//set background
		m_backGroundDraw.Add(new Rect(-100, frameTop.rect.y, priv_LogicScreenSize.x+200, priv_LogicScreenSize.y - frameTop.rect.y+100), bkGround, m_bkColor);
		
		var keyAreaBackground : Tile = spt.FindTile("Boxes_background");
		var keyAreaBackgroundRect : Rect = new Rect(
			m_keyArea.rect.center.x - keyAreaBackground.prop.LogicRect.width / 2
			, m_keyArea.rect.center.y - keyAreaBackground.prop.LogicRect.height / 2
			, keyAreaBackground.prop.LogicRect.width
			, keyAreaBackground.prop.LogicRect.height
			);
		m_backGroundDraw.Add(keyAreaBackgroundRect, keyAreaBackground, m_itemBackgroundColor);

		//open box UI
		if ( m_wheelGameData != null && m_wheelGameData.prizeInboxId > 0 )
		{
			var tileInfo : TileById = priv_getTileByItemId(m_wheelGameData.prizeInboxId, -1);
			if ( tileInfo.isWheelGameTexture )
			{
				var tRect : Rect = tileInfo.tile.rect;
				tRect.x = m_keyArea.rect.center.x - tRect.width * 0.5f;
				tRect.y = m_keyArea.rect.center.y - tRect.height * 0.5f;
				m_backGroundDraw.Add(tRect, tileInfo.tile, m_itemColor);
			}
		}

		priv_drawDoor();

		//girl UI
		var posY : int = ladyStartPos.y;
		posY = priv_addBackground(ladyStartPos.x, posY, "Wheelgame_girl1", spt);
		//posY = priv_addBackground(ladyStartPos.x, posY, "Wheelgame_girl2", spt);

		//back lion UI
		posY = bgStartPos.y;
		posY = priv_addBackgroundMirror(bgStartPos.x, posY, -1.0f, "RotaryTable_pedestal1", spt);
		var startPos : int = posY;

		posY =testYPos;// 960.0f;
		posY = priv_addBackgroundMirror(bgStartPos.x, -posY, -1.0f, "RotaryTable_pedestal5", spt);
		m_haveKeyCount.rect.y = posY - m_haveKeyCount.rect.height;
		
		posY = priv_addBackgroundMirror(bgStartPos.x, -posY, -1.0f, "RotaryTable_pedestal4", spt);
		posY = priv_addBackgroundMirror(bgStartPos.x, -posY, -1.0f, "RotaryTable_pedestal3", spt);

		posY -= startPos;
		priv_addBackgroundMirror(bgStartPos.x, startPos, posY, "RotaryTable_pedestal2", spt);

		posY = testYPos;//960.0f;
		//priv_addBackgroundMirror(bgStartPos.x, -posY, -1.0f, "Iron_bottom", spt);
		var logicSize : Vector2 = priv_LogicScreenSize;
		if ( logicSize.y > testYPos)//960.0f )
		{
			posY = priv_addBackgroundMirror(bgStartPos.x, posY, -1.0f, "iphone5_pedestal", spt);
			
			bottomLabel.rect.y = posY;
			bottomLabel.rect.height = logicSize.y - bottomLabel.rect.y;
			bottomLabel.SetVisible(!KBN._Global.IsLargeResolution());
			if(adapterIphoneX){
				bottomLabel.rect.height = logicSize.y - bottomLabel.rect.y-m_bottom.rect.height;
			}
			var tileBottomBar : Tile = m_wheelSprit.FindTile("iphone5_pedestal2");
			if ( tileBottomBar != null )
			{
				var startXPos : float = 0.0f;
				var tileRect : Rect = tileBottomBar.rect;
				tileRect.x = 0.0f;
				tileRect.y = posY;
				tileRect.width = priv_adjustWidthToInt(tileRect.width);
				tileRect.height = logicSize.y - posY;
				while ( tileRect.x < logicSize.x )
				{
					m_backGroundDraw.Add(tileRect, tileBottomBar);
					tileRect.x += tileRect.width;
					tileRect.x = priv_adjustWidthToInt(tileRect.x);
				}
			}
		}
		else
		{
			bottomLabel.SetVisible(false);
		}

		priv_setKeysColor(keySlotIndex, curKeyCol);
	}
	
	public function priv_drawDoor()
	{
		var topDoor : Tile = m_wheelSprit.FindTile("Door1");
		var topDoorRect : Rect = new Rect(
			m_keyArea.rect.center.x - topDoor.prop.LogicRect.width / 2
			, m_keyArea.rect.center.y - topDoor.prop.LogicRect.height - m_doorDistance
			, topDoor.prop.LogicRect.width
			, topDoor.prop.LogicRect.height
			);
		m_backGroundDraw.Add(topDoorRect, topDoor);

		var bottomDoor : Tile = m_wheelSprit.FindTile("Door2");
		var bottomDoorRect : Rect = new Rect(
			m_keyArea.rect.center.x - bottomDoor.prop.LogicRect.width / 2
			, m_keyArea.rect.center.y + m_doorDistance
			, bottomDoor.prop.LogicRect.width
			, bottomDoor.prop.LogicRect.height
			);
		m_backGroundDraw.Add(bottomDoorRect, bottomDoor);
	}
	
	public function priv_setKeysColor(keySlotIndex : int, curKeyCol : Color)
	{
		var keySlot : int[] = null;
		if ( m_wheelGameData == null || m_wheelGameData.keySlot == null )
		{
			keySlot = new int[5];
		}
		else
		{
			keySlot = m_wheelGameData.keySlot;
		}
		
		var offTile : Tile = m_wheelSprit.FindTile("Lock");
		var onTile : Tile = m_wheelSprit.FindTile("Lock_black");
		var offRing : Tile = m_wheelSprit.FindTile("Keyhole");
		var onRing : Tile = m_wheelSprit.FindTile("Keyhole");
		for ( var i = 0; i != keySlot.Length; ++i )
		{
			var rct : Rect = priv_getKeyPosRect(i, new Vector2(offTile.prop.LogicRect.width, offTile.prop.LogicRect.height), keySlot.Length);
			var rd : float = priv_getKeyPosQuat(i, keySlot.Length);
			var quat : Quaternion = Quaternion.AngleAxis(-rd * Mathf.Rad2Deg, UnityEngine.Vector3.back);
			if ( keySlot[i] == 0 )
			{
				m_backGroundDraw.Add(rct, quat, offTile, Color.white);// * m_allKeyColor);
			}
			else
			{
				if ( keySlotIndex != i )
				{
					m_backGroundDraw.Add(rct, quat, onTile, m_openKeyColor);// * m_allKeyColor);
				}
				else
				{
					m_backGroundDraw.Add(rct, quat, onTile, curKeyCol);// * m_allKeyColor);
				}
			}

			rct = priv_getKeyPosRect(i, new Vector2(offRing.prop.LogicRect.width, offRing.prop.LogicRect.height), keySlot.Length);
			if ( keySlot[i] == 0 )
			{
				m_backGroundDraw.Add(rct, Quaternion.identity, offRing);
			}
			else
			{
				if ( keySlotIndex != i )
				{
					m_backGroundDraw.Add(rct, Quaternion.identity, onRing, m_openKeyColor);
				}
				else
				{
					m_backGroundDraw.Add(rct, Quaternion.identity, onRing, curKeyCol);// * m_allKeyColor);
				}
			}
		}
	}

	public function priv_adjustWidthToInt(x : int)
	{
		return x;
		var logicSize : Vector2 = priv_LogicScreenSize;
		var phyPos : int = Screen.width*x/logicSize.x;
		return logicSize.x * phyPos / Screen.width;
	}

	private function get priv_LogicScreenSize() : Vector2
	{
		var logicHeight : float = 640.0f * Screen.height/Screen.width;
		if ( logicHeight >= 960.0f )
			return new Vector2(640.0f, logicHeight);
			
		var logicWidth : float = 960.0f * Screen.width/Screen.height;
		return new Vector2(logicWidth, 960.0f);
	}

	private function priv_getClickWheelPanelIdx() : int
	{
		var pos : Vector2 = priv_getTouchPos();
		var rndVal : float = priv_getCurRound(pos);
		rndVal += System.Math.PI / m_wheelCount;
		rndVal -= m_wheelPanel.Round;
		var rdFloat : float = rndVal / (2 * System.Math.PI);
		var rdInt : int = rdFloat;
		var rdDis : float = rdFloat >= 0.0f?rdFloat - rdInt:rdFloat - rdInt + 1;
		var idx : int = rdDis * m_wheelCount;
		_Global.Log("Touch:" + idx.ToString());
		return idx;
	}
	
	private var m_lastClickIdx : int;
	private function priv_getItemType(itemId : int) : int
	{
		var itemType : int = -1;
		if ( MystryChest.instance().IsMystryChest(itemId) )
			itemType = MyItems.Category.MystryChest;
		else if ( MystryChest.instance().IsLevelChest(itemId) )
			itemType = MyItems.Category.LevelChest;
		else
		{
			var item:HashObject = (Datas.instance().itemlist())["i" + itemId];
			if(item != null )
			{
				//itemType = _Global.INT32(item["category"]);
				switch ( _Global.INT32(item["category"]) )
				{
				case MyItems.Category.TreasureChest: itemType = MyItems.Category.TreasureChest;
				case MyItems.Category.Chest: itemType = MyItems.Category.Chest;
				}
			}
		}

		return itemType;
	}
	
	private function priv_checkForClickWheel()
	{
		if ( Input.GetMouseButtonDown(0) )
		{
			var pos : Vector2 = priv_getTouchPos();
			var isClickInWheel : boolean = priv_isClickOnWheel(pos);
			if ( isClickInWheel )
			{
				m_lastClickIdx = priv_getClickWheelPanelIdx();
				m_isTouch = true;
				return;
			}

			if ( m_keyArea.rect.Contains(pos) )
			{
				m_lastClickIdx = 9;
				m_isTouch = true;
				return;
			}
			
			return;
		}

		if ( !m_isTouch )
			return;

		if ( Input.GetMouseButton(0) )
			return;

		m_isTouch = false;
		var curIdx : int = priv_getClickWheelPanelIdx();
		if ( m_lastClickIdx == curIdx )
		{
			var itemId : int = m_wheelGameData.itemsId[curIdx];
			if ( itemId != Constant.ItemId.WHEELGAME_KEY )
			{
				var itemType : int = priv_getItemType(itemId);
				var datTile : TileById = priv_getTileByItemId(m_wheelGameData.itemsId[curIdx], 1);
				var id:HashObject = new HashObject({"ID":m_wheelGameData.itemsId[curIdx], "WheelGamePrizeType":m_wheelGameData.itemsType[curIdx], "WheelGamePrizeIcon":datTile.tile, "Category":itemType, "inShop":false});
				MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_zoomComp");
			}
			else
			{
				var idHash:HashObject = new HashObject({"ID":m_wheelGameData.itemsId[curIdx], "WheelGameLessKeysCount":priv_getLessKeyCount()});
				MenuMgr.getInstance().PushMenu("ChestDetail", idHash, "trans_zoomComp");
			}
		}
		else if ( m_lastClickIdx == 9 )
		{
			var pos2nd : Vector2 = priv_getTouchPos();
			if ( m_keyArea.rect.Contains(pos2nd) )
			{
				var prizeIcon : TileById = priv_getTileByItemId(m_wheelGameData.prizeInboxId, 1);
				var itemTypePrize : int = priv_getItemType(m_wheelGameData.prizeInboxId);
				if ( itemTypePrize >= 0 )
				{
					var idPrize:HashObject = new HashObject({"ID":m_wheelGameData.prizeInboxId, "WheelGamePrizeType":WheelGameEnumType.GrandPrize, "WheelGamePrizeIcon":prizeIcon.tile, "Category":itemTypePrize, "inShop":false});
					MenuMgr.getInstance().PushMenu("ChestDetail", idPrize, "trans_zoomComp");
				}
			}
		}

		return;
	}

	private function priv_wheelRect() : Rect
	{
		return lbWheelPanel.rect;
	}

	public var pedestalHeight : float = 100f;
	public var X_Offset : float = 30f;
	private function priv_addBackgroundMirror(posMidX :int, posY : int, height: float, name : String, spt : TileSprite) : int
	{
		var lb : Tile = spt.GetTile(name);
		if(name == "RotaryTable_pedestal1")
		{
			lb.prop.LogicRect.height = 180;
		}
		
		if(name == "iphone5_pedestal")
		{
			// original 64
			lb.prop.LogicRect.height = pedestalHeight;
		}
		var rt : Rect = lb.prop.LogicRect;
		posMidX = priv_adjustWidthToInt(posMidX);
		rt.width = priv_adjustWidthToInt(rt.width);
		if ( height > 0 )
			rt.height = height;
		if ( posY >= 0 )
		{
			rt.y = posY;
		}
		else
		{
			rt.y = -posY - rt.height + 1;
		}
		rt.x = posMidX - rt.width;
		//rt.x = priv_adjustWidthToInt(rt.x);

		var uvRect : Rect = lb.prop.uvRect;
		m_backGroundDraw.Add(rt, uvRect);
		
		uvRect.x += uvRect.width;
		uvRect.width = -uvRect.width;
		rt.x = posMidX;
		m_backGroundDraw.Add(rt, uvRect);
				
		if(name == "iphone5_pedestal")
		{
			oneBtn.rect.x = rt.x - rt.width + btnOffset;
			oneBtn.rect.height = rt.height;
			
			nineBtn.rect.x = rt.x + rt.width - nineBtn.rect.width - btnOffset;
			nineBtn.rect.height = rt.height;
			
			oneBtn.rect.y = rt.y;
			nineBtn.rect.y = rt.y;
		}

		if ( posY >= 0 )
			return rt.height + posY;
		return rt.y;
	}

	private function priv_addBackground(posX :int, posY : int, name : String, spt : TileSprite) : int
	{
		var lb : Tile = spt.GetTile(name);
		var rt : Rect = lb.prop.LogicRect;
		rt.y = posY;
		rt.x = posX;

		var uvRect : Rect = lb.prop.uvRect;
		m_backGroundDraw.Add(rt, uvRect);
		return rt.height + posY;
	}

	private function priv_initPanelAndItems()
	{
		var textMgr : TextureMgr = TextureMgr.instance();
		var spt : TileSprite = textMgr.UnitSpt();

		m_wheelPanel = new WindmillAnim(priv_wheelRect(), m_wheelCount * 2);
		m_wheelPanel.AddLayer(m_wheelSprit);
		m_wheelPanel.AddLayer(m_wheelSprit);
		m_wheelPanel.AddLayer(m_wheelSprit);
		m_wheelPanel.AddLayer(spt);

		m_lightPic = new Tile[3];
		m_lightPic[0] = m_wheelSprit.FindTile("Light_black");
		m_lightPic[1] = m_wheelSprit.FindTile("Light_red");
		m_lightPic[2] = m_wheelSprit.FindTile("Light_Yellow");

		//DEBUG
		var backTile : Tile = m_wheelSprit.FindTile("Rotary_table");
		for ( var j : int = 0; j != 4; ++j )
		{
			var width : float = lbWheelPanel.rect.width*0.5f;
			var rValue : float = width * 0.70710678f;
			m_wheelPanel.AddItem(backTile, 0, new Vector2(width, width), j * 4 + 1, rValue, -System.Math.PI * 0.25f);
		}
		m_wheelPanel.DisableLayer(m_hightLayer);

		m_backLightArray = new RenderRectMaker[3];
		m_backLightArray[0] = priv_loadLightTexture(m_lightPic[0], m_lightPic[0]);
		m_backLightArray[1] = priv_loadLightTexture(m_lightPic[1], m_lightPic[2]);
		m_backLightArray[2] = priv_loadLightTexture(m_lightPic[2], m_lightPic[1]);
		m_backLightDraw = m_backLightArray[0];
		rightLionEyes.SetVisible(false);
		leftLionEyes.SetVisible(false);
	}
	
	private function priv_loadLightTexture(lTex0 : Tile, lTex1 : Tile) : RenderRectMaker
	{
		var rt : RenderRectMaker = new RenderRectMaker();
		rt.Cache.SourceGroup = lTex0.sprite;
		for ( var i : int= 0; i != 4; ++i )
		{
			var posXLeft : float = bgStartPos.x - startLightFromCenterLength - i * startLightRangeDistance - lTex0.rect.width;
			var posXRight : float = bgStartPos.x + startLightFromCenterLength + i * startLightRangeDistance;
			var leftTex : Tile = i%2==0?lTex0:lTex1;
			var rightTex : Tile = i%2==1?lTex0:lTex1;
			rt.Add(new Vector2(posXLeft, startLightStartY), leftTex);
			rt.Add(new Vector2(posXRight, startLightStartY), rightTex);
		}
		return rt;
	}
	
	private class TileById
	{
		public var tile : Tile;
		public var isWheelGameTexture : boolean;
	}
	
	private function priv_loadPanelItem() : boolean
	{
		if ( m_wheelPanel == null || m_wheelGameData == null || m_wheelGameData.itemsId == null)
			return true;
		var r : float = panelItemRadiuAndSize.x;
		var size : Vector2 = new Vector2(panelItemRadiuAndSize.y, panelItemRadiuAndSize.y);
		var idx : int = 0;
		for ( var i : int = 0; i != 8; ++i)
		{
			var itemId : int = m_wheelGameData.itemsId[i];
			var cateId : int = MyItems.GetItemCategoryByItemId(itemId);
			if ( cateId < 0 )
				return false;
			var tileInfo : TileById = priv_getTileByItemId(itemId, -1);
			var realSize : Vector2 = new Vector2();
			if ( tileInfo.tile.rect.width / tileInfo.tile.rect.height >= 1 )
			{
				realSize.x = size.x;
				realSize.y = realSize.x * tileInfo.tile.rect.height / tileInfo.tile.rect.width;
			}
			else
			{
				realSize.y = size.y;
				realSize.x = realSize.y * tileInfo.tile.rect.width / tileInfo.tile.rect.height;
			}

			m_wheelPanel.AddItem(tileInfo.tile, tileInfo.isWheelGameTexture?2:3, realSize*0.82, i*2.0f, r);
		}
		
		return true;
	}

	//	findType : -1, no case, 0: wheelgame icons, 1: icons
	private function priv_getTileByItemId(itemId : int, findType : int) : TileById
	{
		var tileInfo : TileById = new TileById();
		tileInfo.isWheelGameTexture = true;

		var texMgr : TextureMgr = TextureMgr.instance();
		var tileName : String = texMgr.LoadTileNameOfItem(itemId);
		if ( findType != 1 )
		{
			tileInfo.tile = m_wheelSprit.FindTile(tileName);
			//tile = spt.FindTile("stone_" + i.ToString());
			if ( tileInfo.tile != null )
				return tileInfo;
				
			tileInfo.tile = m_wheelSprit.FindTile("w" + tileName);
			if ( tileInfo.tile != null )
				return tileInfo;
	
			if ( tileName.Length > 2 )
			{
				var wheelGameTileName : String = "wg_" + tileName.Substring(2, tileName.Length-2);
				tileInfo.tile = m_wheelSprit.FindTile(wheelGameTileName);
				if ( tileInfo.tile != null )
					return tileInfo;
			}
		}

		if ( findType != 0 )
		{
			tileInfo.isWheelGameTexture = false;
			var spt : TileSprite = texMgr.ItemSpt();
			tileInfo.tile = spt.GetTile(tileName);
		}
		return tileInfo;
	}

	private function priv_updateWheelRect()
	{
		m_wheelPanel.SetRect(priv_wheelRect());
		//m_wheelLight.SetRect(priv_wheelRect());
	}
	
	private function priv_getTokenCount() : int
	{
		var itemMgr : MyItems = MyItems.instance();
		return itemMgr.countForItem(Constant.ItemId.WHEELGAME_TOKEN);
	}
	
	private function priv_getLessKeyCount() : int
	{
		if ( m_wheelGameData == null || m_wheelGameData.keySlot == null )
			return 5;
		var r : int = 0;
		for ( var i : int = 0; i != m_wheelGameData.keySlot.Length; ++i )
		{
			if ( m_wheelGameData.keySlot[i] == 0 )
				++r;
		}
		
		return r;
	}
	
	private function priv_updateTokenCount() : void
	{
		var tokenCnt : int = priv_getTokenCount();
		if ( tokenCnt <= 0 )
		{
			youOwnTokens.SetVisible(false);
			return;
		}
		youOwnTokens.SetVisible(true);
		youOwnTokens.txt = String.Format(Datas.getArString("WheelGame.LabelTokenAmount"), tokenCnt);
	}
	
	private function priv_updateLessKeyCount() : void
	{
		priv_getKeysCount();
		
		var keyCount : int = priv_getLessKeyCount();
		var fontColor : String = "\"#CFA972\"";
		var strKeyCount : String = "</color><color=\"white\">"+keyCount.ToString() + "</color><color=" + fontColor+">";
		lbLessKeys.txt = "<color=" + fontColor + ">" + String.Format(Datas.getArString("WheelGame.LabelCollectKeys"), strKeyCount) + "</color>";
	}
	
	private function priv_isHaveTokenTorNineDraw() : boolean
	{
		var isHaveTokenForNineDraw : boolean = m_wheelGameData==null?false:priv_getTokenCount() >= (m_wheelGameData.costToken * 9);
		return isHaveTokenForNineDraw;
	}

	private function priv_updateButtonState() : void
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var isHaveToken : boolean = m_wheelGameData==null?false:priv_getTokenCount() >= m_wheelGameData.costToken;
		
	    m_buyOneCostGems.rect = new Rect(oneBtn.rect.center.x - m_buyOneCostGems.rect.width
        , oneBtn.rect.center.y - m_buyOneCostGems.rect.height*0.1f
        , m_buyOneCostGems.rect.width
        , m_buyOneCostGems.rect.height);
        
        m_buyNineCostGems.rect = new Rect(nineBtn.rect.center.x - m_buyNineCostGems.rect.width
        , nineBtn.rect.center.y - m_buyNineCostGems.rect.height*0.1f
        , m_buyNineCostGems.rect.width
        , m_buyNineCostGems.rect.height);
        
		if ( isHaveToken )
		{
			btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_Blue", TextureType.BUTTON);
			btnSpin.clickParam = false;			
			m_costTxt.image = texMgr.LoadTexture("RotaryTable_Token", TextureType.ICON);
			m_costTxt.txt = m_wheelGameData != null?m_wheelGameData.costToken.ToString():"";
			
			oneBtn.changeToBlueNew();
			oneBtn.clickParam = false;
			oneBtn.txt = Datas.getArString("WheelGame.button_1darw");
			oneBtn.mystyle.contentOffset = Vector2.zero;
			oneBtn.SetFont(FontSize.Font_22);
			m_buyOneCostGems.SetVisible(false);
		}
		else
		{
			btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_Green", TextureType.BUTTON);
			btnSpin.clickParam = true;	
			m_costTxt.image = texMgr.LoadTexture("resource_icon_gemsorg", TextureType.ICON);
			m_costTxt.txt = m_wheelGameData != null?m_wheelGameData.costGems.ToString():"";
			
			oneBtn.changeToGreenNew();
			oneBtn.clickParam = true;
			oneBtn.txt = String.Format(Datas.getArString("WheelGame.button_buy1"), m_wheelGameData.costToken);
			oneBtn.mystyle.contentOffset = new Vector2(0, - oneBtn.rect.height * 0.25f);
			oneBtn.SetFont(FontSize.Font_20);
			m_buyOneCostGems.txt = m_wheelGameData.costGems.ToString();
			m_buyOneCostGems.SetVisible(true);
		}
		
		var isHaveTokenForNineDraw : boolean = priv_isHaveTokenTorNineDraw();
		if(isHaveTokenForNineDraw)
		{
			nineBtn.changeToBlueNew();
			nineBtn.clickParam = false;
			nineBtn.txt = Datas.getArString("WheelGame.button_9draw");
			nineBtn.mystyle.contentOffset = Vector2.zero;
			nineBtn.SetFont(FontSize.Font_22);
			m_buyNineCostGems.SetVisible(false);
		}
		else
		{
			nineBtn.changeToGreenNew();
			nineBtn.clickParam = true;
			nineBtn.txt = String.Format(Datas.getArString("WheelGame.button_buy9"), ((m_wheelGameData.costToken * 9) - priv_getTokenCount()));
			nineBtn.mystyle.contentOffset = new Vector2(0, - nineBtn.rect.height * 0.25f);
			nineBtn.SetFont(FontSize.Font_20);
			m_buyNineCostGems.txt = (((m_wheelGameData.costToken * 9) - priv_getTokenCount()) * (m_wheelGameData.costGems / m_wheelGameData.costToken)).ToString();
			m_buyNineCostGems.SetVisible(true);
		}

		var lessTime : int = MenuMgr.getInstance().MainChrom.WheelGameLeftTotalSecond;
		if ( m_wheelGameData == null || lessTime <= 0 )
		{
			btnSpin.SetDisabled(true);
			btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_gray", TextureType.BUTTON);
			oneBtn.SetDisabled(true);
			oneBtn.changeToGreyNew();
			nineBtn.SetDisabled(true);
			nineBtn.changeToGreyNew();	
			
			m_menuHead.wheelGameRollStart();	
		}
		else
		{
			btnSpin.SetDisabled(false);
			oneBtn.SetDisabled(false);
			nineBtn.SetDisabled(false);
			
			m_menuHead.wheelGameRollEnd();
		}
	}
	
	private function priv_oneRewardGameStart(param : Object)
	{
		if(m_wheelGameData.isCanStart != 0)
		{
			priv_beignOneTurnRoung();
		}
		else
		{
			if(priv_canStartRoll(param))
			{
				m_menuHead.wheelGameRollStart();
				
				var isGems : boolean = param;
				priv_unityNetBeginRoll(m_wheelGameData.wheelGameId, isGems, isGems?m_wheelGameData.costGems:m_wheelGameData.costToken,priv_readyOneTurnRoundValid);
			}
//			else
//			{
//				priv_beginValid();
//			}	
		}	
	}
	
	private function priv_readyOneTurnRoundValid()
	{
		priv_beginValid();
		Invoke("priv_beignOneTurnRoung",delayTurnTime);	
	}
	
	public var oneTurnAngleSpeed : float = 15f;
	public var wheelPanelARound : float = 4f;
	public var delayTurnTime : float = 1f;
	private function priv_beignOneTurnRoung()
	{
		//var angleSpeed : float = 6;
		m_wheelPanel.Round = wheelPanelARound;
		priv_turnRound(oneTurnAngleSpeed);
	}
	
	private function priv_nineRewardGameStart(param : Object)
	{
		if ( m_wheelGameData.wheelGameId <= 0 )
			return;
			
		btnSpin.SetDisabled(true);
		var texMgr : TextureMgr = TextureMgr.instance();
		btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_gray", TextureType.BUTTON);
		
		oneBtn.SetDisabled(true);
		oneBtn.changeToGreyNew();
		
		nineBtn.SetDisabled(true);
		nineBtn.changeToGreyNew();
		
		m_menuHead.wheelGameRollStart();
						
		var isHaveTokenForNineDraw : boolean = priv_isHaveTokenTorNineDraw();
		if(isHaveTokenForNineDraw)
		{
			priv_unityNetBeginNineRoll(0, (m_wheelGameData.costToken * 9), priv_readyOneTurnRoundValid);
		}
		else
		{
			var gemsCost : int = priv_nineRollGemsCost();
			if ( Payment.instance().Gems < gemsCost )
			{
				MenuMgr.getInstance().PushPaymentMenu();
				btnSpin.SetDisabled(false);
				btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_Green", TextureType.BUTTON);
				
				oneBtn.SetDisabled(false);
				oneBtn.changeToGreenNew();
				
				nineBtn.SetDisabled(false);
				nineBtn.changeToGreenNew();
				
				m_menuHead.wheelGameRollEnd();
				
				return;			
			}
				
			priv_unityNetBeginNineRoll(gemsCost, priv_getTokenCount(), priv_readyOneTurnRoundValid);		
		}	
	}
	
	private function priv_nineRollGemsCost() : int
	{
		var gemsCost : int = ((m_wheelGameData.costToken * 9) - priv_getTokenCount()) * (m_wheelGameData.costGems / m_wheelGameData.costToken);
		return gemsCost;
	}
	
	private function priv_canStartRoll(param : Object) : boolean
	{
		if ( m_wheelGameData.wheelGameId <= 0 )
			return false;
		btnSpin.SetDisabled(true);
		var texMgr : TextureMgr = TextureMgr.instance();
		btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_gray", TextureType.BUTTON);
		
		oneBtn.SetDisabled(true);
		oneBtn.changeToGreyNew();
		
		nineBtn.SetDisabled(true);
		nineBtn.changeToGreyNew();
		
		//m_menuHead.wheelGameRollStart();
		
		if ( param != null )
		{
			var isGems : boolean = param;
			if ( isGems )
			{
				var res : Resource = Resource.instance();
				if ( Payment.instance().Gems < m_wheelGameData.costGems )
				{
					MenuMgr.getInstance().PushPaymentMenu();
					btnSpin.SetDisabled(false);
					btnSpin.mystyle.normal.background = texMgr.LoadTexture("RoundButton_Green", TextureType.BUTTON);
					
					oneBtn.SetDisabled(false);
					oneBtn.changeToGreenNew();
					
					nineBtn.SetDisabled(false);
					nineBtn.changeToGreenNew();
					
					m_menuHead.wheelGameRollEnd();
					
					return false;
				}
			}
			
			return true;
		}
		else
		{
			priv_beginValid();
		}
		
		return false;
	}
	
	private function priv_unityNetBeginNineRoll(gemsCost : int, tokenCost : int, okFunc : Function)
	{
		UnityNet.WheelGameBeginNineRoll(m_wheelGameData.wheelGameId, gemsCost, tokenCost,
				function(r : HashObject)
				{
					if(r["ok"] == null || r["ok"] == false)
						return;
					
                    Payment.instance().SubtractGems(gemsCost);

					var itemMgr : MyItems = MyItems.instance();
					itemMgr.subtractItem(Constant.ItemId.WHEELGAME_TOKEN, tokenCost);
					priv_updateTokenCount();

					m_wheelGameData.isCanStart = 1;
					priv_wheelGameReward(9);
					//priv_beginValid();
					if(okFunc != null)
					{
						okFunc();				
					}
				}, null
			);
	}
	
	public var isOneRoll = false;
	private function priv_unityNetBeginRoll(wheelid : int, isGems : boolean, cost : int, okFunc : Function)
	{
		UnityNet.WheelGameBeginRoll(m_wheelGameData.wheelGameId, isGems, isGems?m_wheelGameData.costGems:m_wheelGameData.costToken,
				function(r : HashObject)
				{
					if ( isGems )
					{
                        Payment.instance().SubtractGems(m_wheelGameData.costGems);
					}
					else
					{
						var itemMgr : MyItems = MyItems.instance();
						itemMgr.subtractItem(Constant.ItemId.WHEELGAME_TOKEN, m_wheelGameData.costToken);
						priv_updateTokenCount();
					}
					m_wheelGameData.isCanStart = 1;
					isOneRoll = true;
					//priv_wheelGameReward(1);
					//priv_beginValid();
					if(okFunc != null)
					{
						okFunc();				
					}
				}, null
			);
	}
	
	private function priv_tryStartRoll(param : Object)
	{
		if(priv_canStartRoll(param))
		{
			var isGems : boolean = param;
			priv_unityNetBeginRoll(m_wheelGameData.wheelGameId, isGems, isGems?m_wheelGameData.costGems:m_wheelGameData.costToken,priv_beginValid);
		}
//		else
//		{
//			priv_beginValid();
//		}
	}

	private function priv_beginValid()
	{
		tabTheChest.txt = Datas.getArString("WheelGame.LabelSwipeToSpin");
		m_backLightDraw = m_backLightArray[1];
		m_startRollTime = System.DateTime.Now;
		priv_loadLightTexture(m_lightPic[1], m_lightPic[2]);
		m_pfnUpdate = priv_updateStartValid;
	}

	private var m_startRollTime : System.DateTime;
	private var m_startAngleSpeed : float;
	
	private function priv_getColor(from : Color, end : Color, val : float) : Color
	{
		var col : Color = new Color();
		col.r = end.r * val + from.r * (1.0f - val);
		col.g = end.g * val + from.g * (1.0f - val);
		col.b = end.b * val + from.b * (1.0f - val);
		col.a = end.a * val + from.a * (1.0f - val);
		return col;
	}

	private function priv_updateStartValid()
	{
		var disTime : float = priv_disTime();
		var disDis : float = Mathf.SmoothStep(0.0f, 1.0f, disTime/m_beginStartColorTurnTime);
		m_itemBackgroundColor = priv_getColor(startItemBackgroundColor, Color.white, disDis);
		m_itemColor = priv_getColor(startItemColor, Color.white, disDis);
		m_wheelPanel.SetColor(m_itemBackgroundColor, 0);
		//m_wheelPanel.SetColor(m_itemBackgroundColor, 1);
		m_wheelPanel.SetColor(m_itemColor, 2);
		m_wheelPanel.SetColor(m_itemColor, 3);

		//m_doorDistance = startDoorDistance;
		//m_doorDistance = (1.0f - disDis) * m_keyArea.rect.height* 0.5f + disDis * startDoorDistance;
		//m_allKeyColor.a = disDis;
		if ( disTime > m_beginStartColorTurnTime )
		//curColor.r >= 1.0f && curColor.g >= 1.0f && curColor.b >= 1.0f && curColor.a >= 1.0f )
		{
			m_pfnUpdate = priv_waitForTouch;
		}
		//priv_loadCtrl();
	}

	private var m_touchPos : Vector2[];
	private var m_startAngle : float;
	private var m_startClickAngle : float;

	private var m_isTouch : boolean = false;

	private function priv_getTouchPos() : Vector2
	{
		var sSize : Vector2 = this.priv_LogicScreenSize;
		var logicPos : Vector2 = new Vector2(sSize.x * Input.mousePosition.x/Screen.width, sSize.y * (Screen.height - Input.mousePosition.y)/Screen.height);
		return logicPos;
	}
	
	private function priv_isClickOnWheel(pos : Vector2) : boolean
	{
		var l : float = (pos - lbWheelPanel.rect.center).magnitude;
		if ( l > lbWheelPanel.rect.width*0.5f )
			return false;
		if ( l < btnSpin.rect.width * 0.5f )
			return false;
		return true;
	}

	private function priv_getCurRound(pos : Vector2) : float
	{
		var center = lbWheelPanel.rect.center;
		var tens : Vector2 = pos - center;
		tens.Normalize();
		if ( tens.x < 0.0f )
		{
			var nr : float = Mathf.Acos(-tens.y);
			return -nr;
		}
		else
		{
			var pr : float = Mathf.Acos(-tens.y);
			return pr;
		}
	}

	private function priv_waitForTouch()
	{
		tabTheChest.alphaEnable = true;
		var alphaInt : int = System.DateTime.Now.Millisecond / 500;
		tabTheChest.alpha = alphaInt;
		if ( m_isTouch )
		{
			if ( Input.GetMouseButtonDown(0) )
				return;
			m_isTouch = false;
			return;
		}

		if ( !Input.GetMouseButtonDown(0) )
			return;

		m_isTouch = true;

		var pos : Vector2 = priv_getTouchPos();
		if ( !priv_isClickOnWheel(pos) )
			return;
		m_startClickAngle = priv_getCurRound(pos);
		m_startAngle = m_wheelPanel.Round;
		m_touchPos = new Vector2[1];
		m_touchPos[0] = pos;
		tabTheChest.alphaEnable = false;
		m_pfnUpdate = priv_waitForReleaseTouch;
		return;
	}

	private function priv_waitForReleaseTouch()
	{
		if ( !Input.GetMouseButton(0) )
		{
			if ( m_touchPos.Length <= 1 )
			{
				m_pfnUpdate = priv_waitForTouch;
				return;
			}
		}
		else
		{
			if ( m_touchPos.Length == 1 )
			{
				var pos2 : Vector2[] = new Vector2[2];
				pos2[0] = m_touchPos[0];
				pos2[1] = priv_getTouchPos();
				m_touchPos = pos2;
			}
			else
			{
				m_touchPos[0] = m_touchPos[1];
				m_touchPos[1] = priv_getTouchPos();
			}
			
			var curAngle1 : float = priv_getCurRound(m_touchPos[1]);
			m_wheelPanel.Round = curAngle1 - m_startClickAngle + m_startAngle;
			return;
		}

		var lastAngleVal : float = priv_getCurRound(m_touchPos[0]);
		var curAngleVal : float =  priv_getCurRound(m_touchPos[1]);
		if ( curAngleVal - lastAngleVal < -System.Math.PI )
		{
			curAngleVal += 2.0f * System.Math.PI;
			//if ( Mathf.Abs(curAngleVal - lastAngleVal)
		}
		else if ( curAngleVal - lastAngleVal > System.Math.PI )
		{
			curAngleVal -= 2.0f * System.Math.PI;
		}
		
		var angleSpeed : float = (curAngleVal - lastAngleVal) / Time.deltaTime;
		if ( Mathf.Abs(angleSpeed) < System.Math.PI * 0.125f  )
		{
			m_pfnUpdate = priv_waitForTouch;
			return;
		}

		priv_turnRound(angleSpeed);
	}
	
	private function priv_turnRound(angleSpeed : float)
	{
		m_startAngleSpeed = angleSpeed;
		//if ( angleSpeed < 0 )
		//{
		//	var x : Menu = null;
		//	x.OnPushOver();
		//}
		m_startAngle = m_wheelPanel.Round;
		m_startRollTime = System.DateTime.Now;
		if (  Mathf.Abs(angleSpeed) < System.Math.PI/2 )
		{
			//	stop slowly.
			m_pfnUpdate = priv_updateStopSlowly;
			return;
		}
		//	Send Msg and begin run......
		if(isOneRoll)
		{
			priv_wheelGameReward(1);
		}

		m_menuHead.wheelGameRollStart();
		
		m_lastSpeed = m_startAngleSpeed;
		m_pfnUpdate = priv_gotoWheelWaitForResult;
		
		return;
	}
	
	public var rollType : int; // 1 : one roll ;9 : nine roll
	var wheelGameNineDatas : List.<WheelGamePrize> = null;
	private function priv_wheelGameReward(wheelCount : int)
	{
		isOneRoll = false;
		m_wheelGamePrize = null;
		wheelGameNineDatas = null;
		UnityNet.WheelGameReward(m_wheelGameData.wheelGameId, wheelCount, function(rewardResult : HashObject)
		{
			rollType = _Global.INT32(rewardResult["type"]);
			if(rollType == WheelRollType.nineRollType)
			{
				m_wheelGameData.isCanStart = 0;
				wheelGameNineDatas = new List.<WheelGamePrize>();
				var prizeArray : Array = _Global.GetObjectValues(rewardResult["rewards"]);
				for(var i : int = 0; i < prizeArray.Count; ++i)
				{
					var tmpNineWheelGamePrize : WheelGamePrize = new WheelGamePrize();
					JasonReflection.JasonConvertHelper.ParseToObjectOnce(tmpNineWheelGamePrize, (prizeArray[i] as HashObject));
					wheelGameNineDatas.Add(tmpNineWheelGamePrize);
					if ( tmpNineWheelGamePrize.itemid != Constant.ItemId.WHEELGAME_KEY )
					{
						var myNineItems : MyItems = MyItems.instance();
						myNineItems.AddItem(tmpNineWheelGamePrize.itemid);
					}
				}
				
				
			}
			else
			{
				m_wheelGameData.isCanStart = 0;
				var tmpWheelGamePrize : WheelGamePrize = new WheelGamePrize();
				JasonReflection.JasonConvertHelper.ParseToObjectOnce(tmpWheelGamePrize, rewardResult);
				m_wheelGamePrize = tmpWheelGamePrize;
				if ( m_wheelGamePrize.itemid != Constant.ItemId.WHEELGAME_KEY )
				{
					var myItems : MyItems = MyItems.instance();
					myItems.AddItem(m_wheelGamePrize.itemid);
				}
			}		
		}, function(errMsg : String, errCode : String)
		{
			ErrorMgr.instance().PushError("", errMsg, false, Datas.getArString("Common.OK_Button")
				, function()
				{
					var menuMgr : MenuMgr = MenuMgr.getInstance();
					menuMgr.PopMenu("WheelGameTurnplate "); 
				}
			);
		});
	}

	public var gm_stopTime : float = 1.5f;
	private function priv_updateStopSlowly()
	{
		var disTime : float = priv_disTime();
		if ( disTime >= gm_stopTime )
		{
			m_pfnUpdate = priv_waitForTouch;
			return;
		}
		
		var disAngle : float = m_startAngleSpeed * disTime * (1.0f - disTime * 0.5f / gm_stopTime);
		m_wheelPanel.Round = disAngle + m_startAngle;
		priv_waitForTouch();
		return;
	}

	public var gm_minSpeed : float = System.Math.PI;
	public var gm_waitMinTime : float = 2f;
	private var m_lastSpeed : float = 0.0f;
	private var m_wheelGamePrize : WheelGamePrize;
	private function priv_gotoWheelWaitForResult()
	{
		m_isCanStop = false;
		priv_updateLightState();
		var disTime : float = priv_disTime();
		var endSpeed : float;
		if ( disTime <= gm_waitMinTime )
		{
			var tgtSpeed : float = m_startAngleSpeed > 0?gm_minSpeed:-gm_minSpeed;
			endSpeed = m_startAngleSpeed + (tgtSpeed - m_startAngleSpeed) * disTime/gm_waitMinTime;
		}
		else
		{
			if ( m_startAngleSpeed < 0.0f )
				endSpeed = -gm_minSpeed;
			else
				endSpeed = gm_minSpeed;
		}

		var disAngle : float = (m_lastSpeed + endSpeed)*Time.deltaTime * 0.5f;
		m_lastSpeed = endSpeed;
		m_wheelPanel.Round += disAngle;

		if ( (m_wheelGamePrize != null || wheelGameNineDatas != null)&& disTime > gm_waitMinTime )
		{
			m_startAngleSpeed = m_lastSpeed;
			m_startAngle = m_wheelPanel.Round;
			var stopPos : int = priv_getStopPos();
			_Global.Log("stopPos:" + stopPos.ToString());
			priv_getStopDistance(m_lastSpeed, stopPos);
			m_startRollTime = System.DateTime.Now;
			m_pfnUpdate = priv_tryStop;
		}
	}

	public var m_stopOnItemTime : float = 2.0f;
	private function priv_tryStop()
	{
		priv_updateLightState();
		var disTime : float = priv_disTime();
		if ( disTime >= m_stopOnItemTime )
		{
			m_startRollTime = System.DateTime.Now;
			disTime = m_stopOnItemTime;
			m_wheelPanel.Clear(m_hightLayer);
			var highLight : Tile = m_wheelSprit.FindTile("Winning");
			if ( highLight != null )
			{
				var stopId : int = priv_getStopPos();
				m_wheelPanel.AddItem(highLight, m_hightLayer, new Vector2(lightSize, lightSize), stopId * 2, lightRadius, 0);
				m_wheelPanel.EnableLayer(m_hightLayer);
			}
			m_pfnUpdate = priv_updateWaitForReview;
		}
		var distance : float =  (priv_stopParam[1] + priv_stopParam[0] * disTime) * disTime;
		m_wheelPanel.Round = m_startAngle + distance;
	}

	public var gm_waitForReviewTime : float = 1.0f;
	private function priv_updateWaitForReview()
	{
		priv_updateLightState();
		var disTime : float = priv_disTime();
		if ( disTime < gm_waitForReviewTime )
		{
			var disDis : float = Mathf.SmoothStep(0.0f, 1.0f, disTime/gm_waitForReviewTime);
			m_itemBackgroundColor = priv_getColor(Color.white, startItemBackgroundColor, disDis);
			m_itemColor = priv_getColor(Color.white, startItemColor, disDis);
			m_wheelPanel.SetColor(m_itemBackgroundColor, 0);
			//m_wheelPanel.SetColor(m_itemBackgroundColor, 1);
			m_wheelPanel.SetColor(m_itemColor, 2);
			m_wheelPanel.SetColor(m_itemColor, 3);
			return;
		}
		m_wheelPanel.DisableLayer(m_hightLayer);
		m_pfnUpdate = null;
		
		var startRect : Rect = new Rect();
		startRect.x = lbWheelPanel.rect.center.x - this.panelItemRadiuAndSize.y * 0.5f;
		startRect.width = this.panelItemRadiuAndSize.y;
		startRect.y = lbWheelPanel.rect.center.x - this.panelItemRadiuAndSize.x - this.panelItemRadiuAndSize.y * 0.5f;
		startRect.height = this.panelItemRadiuAndSize.y;
		
		if(rollType == WheelRollType.oneRollType)
		{
			priv_popOneRollMenu(startRect);
		}
		else if(rollType == WheelRollType.nineRollType)
		{
			priv_popNineRollMenu(startRect);
		}
	}
	
	private function priv_getKeysCount()
	{
		m_haveKeyCount.txt = "x " + wheelGameNineKeys.Count;
	}
	
	var wheelGameNineKeys : List.<WheelGamePrize> = new List.<WheelGamePrize>();
	private function priv_popNineRollMenu(startRect : Rect)
	{
		var param : GambleChestPopMenu.GambleParam = new GambleChestPopMenu.GambleParam();
		param.from = startRect;
		param.ids = new Array();
		param.standard = 1;
		param.gameType = 2;
		for(var i:int = 0;i < wheelGameNineDatas.Count;i++)
		{
			param.ids.Add(wheelGameNineDatas[i].itemid);
		}
		param.tile = priv_getTileByItemId(wheelGameNineDatas[0].itemid, -1).tile;
		param.callBack = function()
		{			
			m_moveKeyStartRect = m_haveKeyCount.rect;
			wheelGameNineKeys.Clear();
			for(var i:int = 0;i < wheelGameNineDatas.Count;i++)
			{
				if(wheelGameNineDatas[i].keyslot != null && wheelGameNineDatas[i].keyslot.Length > 0)
				{
					wheelGameNineKeys.Add(wheelGameNineDatas[i]);
				}
			}
			priv_getKeysCount();
			//priv_oneByOneSetKeysData();	
			priv_resetStage();
		};
		MenuMgr.getInstance().PushMenu("GambleChestPopMenu", param,"trans_immediate");
	}
	
	private function priv_popOneRollMenu(startRect : Rect)
	{		
		var menuMgr : MenuMgr = MenuMgr.getInstance();
		var param : WheelGameChestPopMenu.WheelGameParam = new WheelGameChestPopMenu.WheelGameParam();
		param.from = priv_localRectToLogicRect(startRect);
		param.id = m_wheelGamePrize.itemid;
		param.tile = priv_getTileByItemId(param.id, -1).tile;
		if ( m_wheelGamePrize.itemid != Constant.ItemId.WHEELGAME_KEY )
		{
			param.rewardType = 1;
			param.callBack = function()
			{
				m_pfnUpdate = priv_recvItemId;
			};
		}
		else
		{
			param.rewardType = 0;
			param.callBack = function()
			{
				var menu : WheelGameChestPopMenu = menuMgr.getMenu("WheelGameChestPopMenu", false) as WheelGameChestPopMenu;
				if ( menu != null )
					m_moveKeyStartRect = menu.TargetRect;

				m_pfnUpdate = priv_recvItemId;
			};
		}
		SoundMgr.instance().PlayEffect("Kbn_wheel_win2", /*TextureType.AUDIO_WHEELGAME*/"Audio/WheelGame/");
		menuMgr.PushMenu("WheelGameChestPopMenu", param, "trans_immediate");
	}
	
	private function priv_getCurWheelGamePrize() : WheelGamePrize
	{
		var wheelGamePrizeTemp : WheelGamePrize;
		if(rollType == WheelRollType.oneRollType)
		{
			wheelGamePrizeTemp = m_wheelGamePrize;
		}
		else if(rollType == WheelRollType.nineRollType)
		{
			wheelGamePrizeTemp = wheelGameNineDatas[0];
		}
		
		return wheelGamePrizeTemp;
	}

	private function priv_recvItemId()
	{
		m_wheelPanel.DisableLayer(m_hightLayer);
		m_pfnUpdate = null;
		//	
		if ( m_wheelGamePrize.itemid != Constant.ItemId.WHEELGAME_KEY )
		{
			priv_resetStage();
			return;
		}

		m_openKeySlotIdx = priv_getActiveLock(m_wheelGameData.keySlot, m_wheelGamePrize.keyslot);
		m_moveKey = m_wheelSprit.FindTile("wi2401");		
		var offRing : Tile = m_wheelSprit.FindTile("Keyhole");
		m_moveKeyEndRect = priv_getKeyPosRect(m_openKeySlotIdx, new Vector2(offRing.prop.LogicRect.width, offRing.prop.LogicRect.height), m_wheelGamePrize.keyslot.Length );
		m_wheelGameData.keySlot = m_wheelGamePrize.keyslot;
		//priv_loadCtrl();	
		m_startRollTime = System.DateTime.Now;
		m_pfnUpdate = priv_moveKeyToLock;
	}

	//private var m_openKeySlot : int;
	private var m_moveKeyStartRect : Rect;
	private var m_moveKeyEndRect : Rect;
	private var m_openKeySlotIdx : int;
	private var m_moveKeyTime : float = 1.0f;
	private var m_moveDoorTime : float = 0.7f;
	private var m_moveKey : Tile;
	private function priv_moveKeyToLock()
	{
		var disTime : float = priv_disTime();
		var disDis : float;
		if ( disTime <= m_moveKeyTime )
		{
			disDis = Mathf.SmoothStep(0.0f, 1.0f, disTime/m_moveKeyTime);
			var rect : Rect = new Rect(
				m_moveKeyStartRect.x * (1.0f - disDis) + m_moveKeyEndRect.x * disDis
			,	m_moveKeyStartRect.y * (1.0f - disDis) + m_moveKeyEndRect.y * disDis
			,	m_moveKeyStartRect.width * (1.0f - disDis) + m_moveKeyEndRect.width * disDis
			,	m_moveKeyStartRect.height * (1.0f - disDis) + m_moveKeyEndRect.height * disDis
			);
			m_moveKey.rect = rect;
			return;
		}
		m_moveKey = null;
		SoundMgr.instance().PlayEffect("Kbn_openLock", /*TextureType.AUDIO_WHEELGAME*/"Audio/WheelGame/");
		priv_loadCtrl();

		m_startRollTime = System.DateTime.Now;
		m_pfnUpdate = priv_updateKeyColor;
		priv_updateLessKeyCount();
		return;
	}
	
	private function priv_updateKeyColor()
	{
		var disTime : float = priv_disTime();
		if ( disTime <= m_moveDoorTime )
		{
			var disDis : float = Mathf.SmoothStep(0.0f, 1.0f, disTime/m_moveKeyTime);
			var openKeyColor : Color = priv_getColor(Color.white, m_openKeyColor, disDis);
			priv_loadCtrlByLastKeyAndMulColor(m_openKeySlotIdx, openKeyColor);
			return;
		}

		if ( m_wheelGamePrize.prize <= 0 )
		{
			priv_resetStage();
			return;
		}

		m_startRollTime = System.DateTime.Now;
		SoundMgr.instance().PlayEffect("Kbn_openTrunk", /*TextureType.AUDIO_WHEELGAME*/"Audio/WheelGame/");
		m_pfnUpdate = priv_updateDoorDistance;
		return;
	}

	private function priv_updateDoorDistance()
	{
		var disTime : float = priv_disTime();
		if ( disTime <= m_moveDoorTime )
		{
			var disDis : float = Mathf.SmoothStep(0.0f, 1.0f, disTime/m_moveKeyTime);
			m_doorDistance = disDis * m_keyArea.rect.height * 0.5f;
			priv_loadCtrl();
			return;
		}

		var ctPos : Vector2 = m_keyArea.rect.center;
		var param : WheelGameChestPopMenu.WheelGameParam = new WheelGameChestPopMenu.WheelGameParam();
		param.from = priv_localRectToLogicRect(new Rect(ctPos.x - 64, ctPos.y - 64, 128, 128));
		param.id = m_wheelGamePrize.prize;
		param.rewardType = 2;
		param.callBack = function()
		{
			m_pfnUpdate = priv_recvPrizeId;
		};
		param.tile = priv_getTileByItemId(param.id, -1).tile;

		SoundMgr.instance().PlayEffect("Kbn_openTrunk_SuperGlow", /*TextureType.AUDIO_WHEELGAME*/"Audio/WheelGame/");
		var menuMgr : MenuMgr = MenuMgr.getInstance();
		menuMgr.PushMenu("WheelGameChestPopMenu", param, "trans_immediate");
		return;
	}

	private function priv_recvPrizeId()
	{
		m_pfnUpdate = null;
		var myItems : MyItems = MyItems.instance();
		myItems.AddItem(m_wheelGamePrize.prize);

		for ( var i = 0; i != m_wheelGameData.keySlot.Length; ++i )
			m_wheelGameData.keySlot[i] = 0;
		m_itemBackgroundColor = startItemBackgroundColor;
		m_itemColor = startItemColor;

		tabTheChest.txt = Datas.getArString("WheelGame.LabelTapTheChest");
		m_doorDistance = startDoorDistance;

		priv_drawDoor();
		priv_setKeysColor(-1, Color.white);
		priv_resetStage();
	}
	
	private function priv_oneByOneSetKeysData()
	{
		if(rollType == WheelRollType.nineRollType)
		{	
			if(wheelGameNineKeys.Count > 0)
			{
				m_wheelGamePrize = wheelGameNineKeys[0];
				wheelGameNineKeys.RemoveAt(0);
				m_pfnUpdate = priv_recvItemId;	
				return true;			
			}						
		}
		
		return false;
	}

	private function priv_resetStage()
	{
		if(priv_oneByOneSetKeysData())
		{
			return;
		}			
	
		m_isCanStop = true;
		m_isTouch = false;
		m_lastClickIdx = -1;
		m_itemBackgroundColor = startItemBackgroundColor;
		m_itemColor = startItemColor;
		//m_allKeyColor.a = 1.0f;

		tabTheChest.txt = Datas.getArString("WheelGame.LabelTapTheChest");
		m_doorDistance = startDoorDistance;
		//m_doorDistance = m_keyArea.rect.height * 0.5f;
		m_backLightDraw = m_backLightArray[0];
		rightLionEyes.SetVisible(false);
		leftLionEyes.SetVisible(false);

		priv_loadCtrl();

		m_wheelPanel.Clear(2);
		m_wheelPanel.Clear(3);
		m_wheelPanel.SetColor(startItemBackgroundColor, 0);
		m_wheelPanel.SetColor(startItemColor, 2);
		m_wheelPanel.SetColor(startItemColor, 3);
		priv_updateLessKeyCount();
		priv_updateButtonState();
		priv_loadPanelItem();
		m_pfnUpdate = priv_checkForClickWheel;
	}
	
	private function priv_getActiveLock(beforKeyIdx : int[], afterKeyIdx : int[]) : int
	{
		var slotCnt : int = System.Math.Min(beforKeyIdx.Length, afterKeyIdx.Length);
		for ( var i = 0; i != slotCnt; ++i )
		{
			if ( beforKeyIdx[i] != afterKeyIdx[i] )
			{
				return i;
			}
		}
		
		return -1;
	}

	//private function priv_getKeyRect(beforKeyIdx : int[], afterKeyIdx : int[]) : Rect
	//{
	//	var i : int = priv_getActiveLock(beforKeyIdx, afterKeyIdx);
	//	if ( i >= 0 )
	//	{
	//		var slotCnt : int = System.Math.Min(beforKeyIdx.Length, afterKeyIdx.Length);
	//		var offRing : Tile = m_wheelSprit.FindTile("Keyhole");
	//		var rct = priv_getKeyPosRect(i, new Vector2(offRing.prop.LogicRect.width, offRing.prop.LogicRect.height), slotCnt);
	//		return rct;
	//	}

	//	var ctPos : Vector2 = m_keyArea.rect.center;
	//	return new Rect(ctPos.x, ctPos.y, 128, 128);
	//}
	
	private function priv_getKeyPosRect(idx : int, size : Vector2, slotCnt : int) : Rect
	{
		var rd : float = priv_getKeyPosQuat(idx, slotCnt);
		var x : float = System.Math.Sin(rd) * m_keyArea.rect.width * 0.5f + m_keyArea.rect.center.x;
		var y : float = -System.Math.Cos(rd) * m_keyArea.rect.height * 0.5f + m_keyArea.rect.center.y;
		var rct : Rect = new Rect(x - size.x * 0.5f, y - size.y * 0.5f, size.x, size.y);
		return rct;
	}
	
	private function priv_getKeyPosQuat(idx : int, slotCnt : int)
	{
		var rdStart : float = cfg_firstKeyAngle * Mathf.Deg2Rad;
		var rd : float = rdStart + idx * (System.Math.PI * 2.0f) / slotCnt;
		return rd;
	}

	private function priv_disTime() : float
	{
		return (System.DateTime.Now - m_startRollTime).TotalMilliseconds * 0.001f;
	}
	
	private function priv_getStopPos() : int
	{
		var wheelGamePrizeTemp : WheelGamePrize = priv_getCurWheelGamePrize();
		
		if ( m_wheelGameData.itemsId[wheelGamePrizeTemp.slot] == wheelGamePrizeTemp.itemid )
			return wheelGamePrizeTemp.slot;
		for ( var idx : int = 0; idx != m_wheelGameData.itemsId.Length; ++idx )
		{
			if ( m_wheelGameData.itemsId[idx] == wheelGamePrizeTemp.itemid )
				return idx;
		}
		
		return wheelGamePrizeTemp.slot;
	}
	
	private var priv_stopParam : float[];
	private function priv_getStopDistance(lastSpeed : float, rndPos : int) : void
	{
		var rdRd : float = Random.value * 0.7f - 0.35f;
		//	2
		var absDis : float = (m_wheelCount - rndPos + rdRd) * System.Math.PI / (0.5 * m_wheelCount);
		if ( lastSpeed < 0 )
		{
			absDis -= m_startAngle;
			//absDis = -absDis;
			if ( absDis < -2*System.Math.PI )
				absDis += -2 * System.Math.PI;
		}
		else
		{
			absDis -= m_startAngle;
			if ( absDis < 2*System.Math.PI )
				absDis += 2 * System.Math.PI;
		}

		priv_stopParam = new float[3];
		priv_stopParam[1] = lastSpeed;
		m_stopOnItemTime = 2.0f * absDis / lastSpeed;
		priv_stopParam[0] = -(lastSpeed*lastSpeed)/(4.0f*absDis);
		_Global.Log("abc:" + priv_stopParam[0].ToString() + "," + priv_stopParam[1].ToString());
	}
	
	private function priv_updateLightState()
	{
		var rdCnt : int = m_wheelPanel.Round / (System.Math.PI * 2) * m_wheelCount;
		var rdVal : int = rdCnt%2;
		var curDraw : RenderRectMaker = m_backLightDraw;
		m_backLightDraw = m_backLightArray[rdVal+1];
		if ( curDraw != m_backLightDraw )
			SoundMgr.instance().PlayEffect("Kbn_wheel_pinClick", /*TextureType.AUDIO_WHEELGAME*/"Audio/WheelGame/");
		rightLionEyes.SetVisible(rdVal?true:false);
		leftLionEyes.SetVisible(rdVal?true:false);
	}
	
	private function priv_localRectToLogicRect(ir : Rect) : Rect
	{
		var rr : Rect = new Rect();
		var v : Vector2 = priv_LogicScreenSize;
		rr.x = 640.0f * ir.x / v.x;
		rr.y = 960.0f * ir.y / v.y;
		rr.width = 640.0f * ir.width / v.x;
		rr.height = 960.0f * ir.height / v.y;
		return rr;
	}
	
	public var iphoneXWheelPanelY : int = 60;
	public var iphineXOffsetY : int = 115;
	public var otherWheelPanelY : int = 0;
	private function setUIRect(){
		var logicSize : Vector2 = priv_LogicScreenSize;
		if(adapterIphoneX){		
			m_top.rect.height = IphoneXTopFrameHeight(logicSize.y);
			m_bottom.rect.height = IphoneXBottomFrameHeight(logicSize.y);
			var x_offsetY:int = m_top.rect.height; 
			bgStartPos.y=80+x_offsetY;
			ladyStartPos.y=190+x_offsetY;
			//testYPos=960+x_offsetY;
			
			testYPos = logicSize.y - m_bottom.rect.height - m_top.rect.height - iphineXOffsetY;
			var tempOffset : int = testYPos - 960;
			var tempWhellPanelOffset : int = tempOffset - iphoneXWheelPanelY;
			
			m_menuHead.rect.y=0+x_offsetY;
			frameTop.rect.y = 75 + x_offsetY;
			infoBtn.rect.y = frameTop.rect.y + 9;
			//UI
			timeLeftToSpin.rect.y=95+x_offsetY;
			youOwnTokens.rect.y=1362-x_offsetY;
			bottomLabel.rect.y=1024+x_offsetY;
			tabTheChest.rect.y=126+x_offsetY;
			startLightStartY = 180+x_offsetY;
			
			lbLessKeys.rect.y=891 + tempOffset;	
			btnSpin.rect.y=330+tempOffset;
			leftLionEyes.rect.y=610+tempOffset;
			rightLionEyes.rect.y=610+tempOffset;		
			m_keyArea.rect.y=660+tempOffset;
			
			lbWheelPanel.rect = new Rect(198,(182 + tempWhellPanelOffset),440,440);
//			btnTokensSpin.rect.y=330+x_offsetY;
			m_spinTxt.rect.y=365+tempWhellPanelOffset;
			m_costTxt.rect.y=400+tempWhellPanelOffset;		
			topPointer.rect.y=158+tempWhellPanelOffset;
			
			
			panelItemRadiuAndSize = new Vector2(155,100);
			lightSize = 220;
			
			m_keyArea.rect.x = 320;
			lbLessKeys.rect.x = 254;
			m_spinTxt.rect.x = 377;
			m_costTxt.rect.x = 377;
			bgStartPos.x = 420;
			timeLeftToSpin.rect.x = 220;
			tabTheChest.rect.x = 220;
			topPointer.rect.x = 390;
			m_haveKeyCount.rect.x = 540;
		}else{
			if(KBN._Global.IsLargeResolution())
			{
				testYPos=880;
				m_keyArea.rect.y=580;
				lbWheelPanel.rect = new Rect(228 + X_Offset,182,380,380);
				panelItemRadiuAndSize = new Vector2(140,70);
				lbLessKeys.rect.y=810;
				m_spinTxt.rect.y=340;
				m_costTxt.rect.y=375;
				lightSize = 180;
				leftLionEyes.rect.y = 530;
				rightLionEyes.rect.y = 530;
				
				m_keyArea.rect.x = 320 + X_Offset;
				lbLessKeys.rect.x = 254 + X_Offset;
				m_spinTxt.rect.x = 377 + X_Offset;
				m_costTxt.rect.x = 377 + X_Offset;
				bgStartPos.x = 420 + X_Offset;
				timeLeftToSpin.rect.x = 220 + X_Offset;
				tabTheChest.rect.x = 220 + X_Offset;
				topPointer.rect.x = 390 + X_Offset;
				leftLionEyes.rect.x = 195 + X_Offset;
				rightLionEyes.rect.x = 610 + X_Offset;
				m_haveKeyCount.rect.x = 540 + X_Offset;
				
				timeLeftToSpin.rect.y=95;
				youOwnTokens.rect.y=1362;
				btnSpin.rect.y=330;
				//lbWheelPanel.rect.y=182;
				//m_keyArea.rect.y=660;
				bottomLabel.rect.y=1024;
	//			btnTokensSpin.rect.y=330;			
				tabTheChest.rect.y=126;
				topPointer.rect.y=158;
			}
			else
			{
				testYPos = logicSize.y - pedestalHeight;
				var tempOtherOffset : int = testYPos - 960 ;
				//var tempY : int = _Global.INT32(tempOtherOffset / 2f);
				var tempY : int = otherWheelPanelY;
				lbWheelPanel.rect = new Rect(198,182 + tempY,440,440);
				m_spinTxt.rect.y=365 + tempY;
				m_costTxt.rect.y=400 + tempY;
				btnSpin.rect.y=330 + tempY;
				topPointer.rect.y=158 + tempY;
				
				m_keyArea.rect.y = 660 + tempOtherOffset;			
				panelItemRadiuAndSize = new Vector2(155,100);
				lbLessKeys.rect.y=891 + tempOtherOffset;		
				lightSize = 220;
				leftLionEyes.rect.y = 610 + tempOtherOffset;
				rightLionEyes.rect.y = 610 + tempOtherOffset;			
				timeLeftToSpin.rect.y=95;
				youOwnTokens.rect.y=1362;
				bottomLabel.rect.y=1024;		
				tabTheChest.rect.y = 126;
			
				
				m_keyArea.rect.x = 320;
				lbLessKeys.rect.x = 254;
				m_spinTxt.rect.x = 377;
				m_costTxt.rect.x = 377;
				bgStartPos.x = 420;
				timeLeftToSpin.rect.x = 220;
				tabTheChest.rect.x = 220;
				topPointer.rect.x = 390;			
				leftLionEyes.rect.x = 195;
				rightLionEyes.rect.x = 610;
				m_haveKeyCount.rect.x = 540;
			}
			bgStartPos.y=80;
			ladyStartPos.y=190;		
			m_menuHead.rect.y=0;
			frameTop.rect.y = 80;
			infoBtn.rect.y = frameTop.rect.y + 9;
			//UI
				
			startLightStartY = 180;
		}
	}
}
