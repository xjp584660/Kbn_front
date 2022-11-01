using UnityEngine;
using UILayout;
using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using KBN;
using _Global = KBN._Global;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;
using AvaChatMenu = KBN.AvaChatMenu;

public partial class AvaMainChrome : KBNMenu {

	// top bar
	public InputText textInputX;
	public InputText textInputY;

    // stats bar
    public SimpleLabel yourEmblemBg;
    public SimpleLabel enemyEmblemBg;
    public AllianceEmblem yourEmblem;
    public AllianceEmblem enemyEmblem;
    public SimpleLabel yourAllianceName;
    public SimpleLabel yourScore;
    public SimpleLabel enemyAllianceName;
    public SimpleLabel enemyScore;
    public SimpleLabel remainingTime;
    public SimpleLabel blinkFrame;


	public SimpleLabel bigWonderIcon;
	public SimpleLabel ownBigWonderNum;
    public SimpleLabel smallWonderIcon;
    public SimpleLabel ownSmallWonderNum;
    public SimpleLabel ownSpeed;
    public SimpleLabel enemyBigWonderIcon;
    public SimpleLabel enemyBigWonderNum;
    public SimpleLabel enemySmallWonderIcon;
    public SimpleLabel enemySmallWonderNum;
    public SimpleLabel enemySpeed;
	
    // Incoming attack
    public SimpleLabel incomingAttackIcon;
    public SimpleLabel incomingAttackNum;
    public SimpleButton incomingAttackBtn;

	// progress view
	[SerializeField]
	private AvaMainChromeProgressView progressView;
	public UIObject btnMarch;
	public UIObject btnShowList;
	public UIObject marchNote;

	// chat bar
	public SimpleLabel chatIcon1;
	public SimpleLabel chatIcon2;
	public SimpleLabel chatText1;
	public SimpleLabel chatText2;

	// bottom
	public ScrollView buttonScrollView;
	[SerializeField]
	private ChromeButtonObj chromeButtonObjTemplate;
	private Dictionary<string, ChromeButtonObj> chromeButtons = new Dictionary<string, ChromeButtonObj>();

	//
	private UIElementMgr elementMgr = null;
	private UILayout.Grid uiRoot = null;

    [SerializeField]
    private AvaMainChromeFrozenTipBar frozenTipBar;
    [SerializeField]
    private NormalTipsBar endFrozenTipBar;
	[SerializeField]
	private NormalTipsBar marchLineTipBar;
	
	private Texture2D texGlobalChat;
	private Texture2D texAllianceChat;

    private static List<Hashtable> lastChatTexts = null;
    private static int lastChatTextsEventId = -1;

	public LoadingLabel waitingLabel;

	public override void Init ()
	{
		base.Init ();

		texGlobalChat = TextureMgr.singleton.LoadTexture("icon_globle", TextureType.ICON);
		texAllianceChat = TextureMgr.singleton.LoadTexture("icon_alliance", TextureType.ICON);

		textInputX.filterInputFunc = handlerFilterInputFunc;
		textInputY.filterInputFunc = handlerFilterInputFunc;
		
		textInputX.inputDoneFunc = handlerInputDoneFunc;		
		textInputY.inputDoneFunc = handlerInputDoneFunc;
		
		textInputX.type = TouchScreenKeyboardType.NumberPad;
		textInputY.type = TouchScreenKeyboardType.NumberPad;
		
		textInputX.Init();
		textInputY.Init();

        yourAllianceName.Init();
        yourScore.Init();
        enemyAllianceName.Init();
        enemyScore.Init();
        remainingTime.Init();

		buttonScrollView.Init();

		progressView.Init();
		progressView.OnReorderLayout = ReorderLayout;
		
		InitLayout();

		chromeButtonObjTemplate.Init(); // get origin size

        Clear();

		InitMainChromeButtons();
        
        InitMarchStats();

        InitIncomingAttacks();
        InitFrozenTipBar();
        InitEndFrozenTipBar();
		InitMarchLineTipBar();
		waitingLabel.Init ();
		if ( _Global.IsLargeResolution() )
		{
			waitingLabel.rect = new Rect(640/2-128,960/2-128,256, 256);
		}
		else
		{
			waitingLabel.rect = new Rect(640/2-64,960/2-64,128, 128);
		}
	}

    private void InitFrozenTipBar()
    {
        frozenTipBar.Init();
        frozenTipBar.SetVisible(false);
    }

    private void InitEndFrozenTipBar()
    {
        endFrozenTipBar.Init();
        endFrozenTipBar.SetVisible(false);
    }

	private void InitMarchLineTipBar()
	{
		marchLineTipBar.Init();
		marchLineTipBar.SetVisible(false);
	}
    
    private void SetIncomingAttackData(int num)
    {
        bool visible = false;
        if (num > 0)
        {
            visible = true;

            if (num > 99)
            {
                num = 99;
            }

            incomingAttackNum.txt = num.ToString();
        }

        incomingAttackBtn.SetDisabled(!visible);
        incomingAttackBtn.SetVisible(visible);
        incomingAttackIcon.SetVisible(visible);
        incomingAttackNum.SetVisible(visible);
    }

    private void InitIncomingAttacks()
    {
        incomingAttackBtn.SetDisabled(true);
        incomingAttackIcon.useTile = true;
        incomingAttackIcon.tile = TextureMgr.instance().IconSpt().GetTile("buff_attack");
        incomingAttackNum.txt = "";
        incomingAttackBtn.OnClick = new Action<object>(OnIncomingAttackBtn);
        SetIncomingAttackData(GameMain.Ava.March.IncomingAttackList.Count);
    }

	private void InitLayout()
	{
		TextAsset layout = null;

		if (_Global.IsLargeResolution()) {
			layout = TextureMgr.singleton.LoadUILayout("AvaMainChrome.high");
		} else {
			layout = TextureMgr.singleton.LoadUILayout("AvaMainChrome.low");
		}

		Stream stream = new MemoryStream(layout.bytes);
		Dictionary<string, object> initPropList = new Dictionary<string, object>();
		initPropList["@ThisMenu"] = this;

		var uiFrame = XAMLResReader.ReadFile(stream, initPropList) as UILayout.UIFrame;
		uiRoot = uiFrame.FindItem("AvaMainChrome") as UILayout.Grid;

		progressView.SetContainRef(uiFrame);
	}

    private void wonderNumShow()
    {
        ownSpeed.txt = "+" + GameMain.Ava.AvaScoreStats.MyIncreaseRate + "/s";
        enemySpeed.txt = "+" + GameMain.Ava.AvaScoreStats.EnemyIncreaseRate + "/s";
        ownBigWonderNum.txt = GameMain.Ava.AvaScoreStats.ownBigWonderNum.ToString();
        ownSmallWonderNum.txt = GameMain.Ava.AvaScoreStats.ownSmallWonderNum.ToString();
        enemyBigWonderNum.txt = GameMain.Ava.AvaScoreStats.enemyBigWonderNum.ToString();
        enemySmallWonderNum.txt = GameMain.Ava.AvaScoreStats.enemySmallWonderNum.ToString();
    }

    private void InitMarchStats()
    {
        blinkFrame.SetVisible(false);
        blinking = false;
        remainingTime.SetNormalTxtColor(FontColor.Light_Yellow);

        enemyEmblemBg.SetVisible(false);

        if (GameMain.Ava != null)
        {
            UpdateMarchRemainingTime();

            yourEmblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
            yourEmblemBg.SetColor(FontMgr.GetColorFromTextColorEnum(FontColor.Blue));
            if (KBN.Alliance.singleton.hasGetAllianceInfo)
            {
                pri_SetUserAllianceName();
            }
            else
            {
                KBN.Alliance.singleton.reqAllianceInfo(pri_SetUserAllianceName);
            }

			wonderNumShow();

            if (GameMain.Ava.Seed != null)
            {
                enemyEmblem.Data = GameMain.Ava.Seed.EnemyEmblemData;
                if (enemyEmblem.Data != null)
                {
                    enemyEmblemBg.SetColor(FontMgr.GetColorFromTextColorEnum(FontColor.Red));
                    enemyEmblemBg.SetVisible(true);
                }
                if (!string.IsNullOrEmpty(GameMain.Ava.Seed.EnemyAllianceName))
                {
                    enemyAllianceName.txt = GameMain.Ava.Seed.EnemyAllianceName;
                }
                else
                {
                    enemyAllianceName.txt = Datas.getArString("Chrome.match_noAlliance");
                }

                if (GameMain.Ava.Seed.UserAllianceInitScore < 0)
                {
                    yourScore.txt = "---";
                }
                else
                {
                    yourScore.txt = GameMain.Ava.Seed.UserAllianceInitScore.ToString();
                }

                if (GameMain.Ava.Seed.EnemyAllianceInitScore < 0)
                {
                    enemyScore.txt = "---";
                }
                else
                {
                    enemyScore.txt = GameMain.Ava.Seed.EnemyAllianceInitScore.ToString();
                }

                // Initialize user score and enemy score
                GameMain.Ava.AvaScoreStats.UserScore = GameMain.Ava.Seed.UserAllianceInitScore;
                GameMain.Ava.AvaScoreStats.EnemyScore = GameMain.Ava.Seed.EnemyAllianceInitScore;
            }
        }

//        if (yourEmblem.image == null)
//        {
//            yourEmblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
//        }
//        if (enemyEmblem.image == null)
//        {
//            enemyEmblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
//        }
    }

    private void pri_SetUserAllianceName()
    {
        yourAllianceName.txt = KBN.Alliance.singleton.MyAllianceName();
    }

    public void UpdateMarchScoreStats()
    {
       // Debug.Log("[UpdateMarchScoreStats]");
        if (GameMain.Ava != null && GameMain.Ava.AvaScoreStats != null)
        {
            yourScore.txt = GameMain.Ava.AvaScoreStats.UserScore >= 0 ? GameMain.Ava.AvaScoreStats.UserScore.ToString() : "---";
            enemyScore.txt = GameMain.Ava.AvaScoreStats.EnemyScore >= 0 ? GameMain.Ava.AvaScoreStats.EnemyScore.ToString() : "---";
			wonderNumShow();
        }
    }

    private void UpdateMarchRemainingTime()
    {
        if (GameMain.Ava != null && GameMain.Ava.Event != null)
        {
            if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Frozen)
            {
                long _leftTime = GameMain.Ava.Event.BattleStartTime - GameMain.unixtime();
                if (_leftTime < 0)
                {
                    _leftTime = 0;
                }
                remainingTime.txt = KBN._Global.timeFormatStr(_leftTime);
                UpdateBlinkFrame(_leftTime, FontColor.TabDown);
            }
            else if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Combat)
            {
                long _leftTime = GameMain.Ava.Event.GetCombatLeftTime();
                remainingTime.txt = GameMain.Ava.Event.GetCombatLeftTimeString();
                UpdateBlinkFrame(_leftTime, FontColor.Red);
            }
            else if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.EndFrozen)
            {
                long _leftTime = GameMain.Ava.Event.EndFrozenEndTime - GameMain.unixtime();
                if (_leftTime < 0)
                {
                    _leftTime = 0;
                }
                remainingTime.txt = KBN._Global.timeFormatStr(_leftTime);
                UpdateBlinkFrame(_leftTime, FontColor.Red);
            }
        }
    }

    #region BLINK FRAME
    private bool blinking = false;
    private float elapsedTime = 0.0f;
    private const float BLINKTIME = 5 * 60;
    private void UpdateBlinkFrame(long _leftTime, FontColor blinkColor)
    {
        if (!blinking && _leftTime <= BLINKTIME)
        {
            blinking = true;
            elapsedTime = 0.0f;
            blinkFrame.SetVisible(true);
            blinkFrame.SetColor(FontMgr.GetColorFromTextColorEnum(blinkColor));
            remainingTime.SetNormalTxtColor(blinkColor);
        }
        else if (blinking && _leftTime > BLINKTIME)
        {
            blinking = false;
            blinkFrame.SetVisible(false);
            remainingTime.SetNormalTxtColor(FontColor.Light_Yellow);
        }

        if (blinking)
        {
            elapsedTime += Time.deltaTime;
            float alpha = (Mathf.Cos(3.14159f * elapsedTime) + 1) / 2.0f;
            Color color = blinkFrame.GetColor();
            color.a = alpha;
            blinkFrame.SetColor(color);
        }
    }
    #endregion BLINK FRAME

	private Texture2D ChatTypeTexture(string type)
	{
		if (type == Constant.ChatType.CHAT_GLOBLE)
			return texGlobalChat;
		if (type == Constant.ChatType.CHAT_ALLIANCE)
			return texAllianceChat;
		return null;
	}

	private float lastUpdateTime = 0.0f;
	private void UpdateChatMessages()
	{
		AvaChatMenu chatMenu = MenuMgr.instance.getAvaChatMenu();
		
		if (null == chatMenu)
			return;

		if (chatMenu.whetherGetChat(false))
			chatMenu.getChat(true);

		float curTime = Time.realtimeSinceStartup;
		if (curTime - lastUpdateTime > 1.0f) {
			lastUpdateTime = curTime;

			if (chatMenu.isNeedUpdateMes) {
				List<Hashtable> tempArray = chatMenu.generateMesForMainChrom();

                FillChatText(tempArray);
                lastChatTexts = tempArray;
                lastChatTextsEventId = GameMain.Ava.Event.GetActId();
			}
		}
	}

    private void FillChatText(List<Hashtable> tempArray)
    {
        chatText1.txt = string.Empty;
        chatText2.txt = string.Empty;
        chatIcon1.mystyle.normal.background = null; 
        chatIcon2.mystyle.normal.background = null;                 

        if (null == tempArray)
            return;

        if(tempArray.Count > 0)
        {
            chatText1.txt = tempArray[0]["message"].ToString();
            chatIcon1.mystyle.normal.background = ChatTypeTexture(tempArray[0]["type"].ToString());
            
            if((tempArray[0]["type"].ToString()) == Constant.ChatType.CHAT_EXCEPTION)
            {
                chatText1.SetNormalTxtColor(FontColor.Red);
            }
            else
            {
                chatText1.SetNormalTxtColor(FontColor.Button_White);
            }
        }
        
        if(tempArray.Count > 1)
        {
            chatText2.txt = tempArray[1]["message"].ToString();
            chatIcon2.mystyle.normal.background = ChatTypeTexture(tempArray[1]["type"].ToString());
            
            if((tempArray[1]["type"].ToString()) == Constant.ChatType.CHAT_EXCEPTION)
            {
                chatText2.SetNormalTxtColor(FontColor.Red);
            }
            else
            {
                chatText2.SetNormalTxtColor(FontColor.Button_White);
            }
        }
    }

	private void ResizeMainChromeButtonScrollView()
	{
		buttonScrollView.forEachNewComponentObj( delegate (UIObject obj) {
			ChromeButtonObj btn = obj as ChromeButtonObj;
			if (null == btn)
				return;

			if (_Global.IsLargeResolution()) {
				btn.Resize(buttonScrollView.rect.height - 11, FontSize.Font_40, FontSize.Font_32);
			} else {
				btn.Resize(94, FontSize.Font_20, FontSize.Font_BEGIN);
			}
		});

		if (_Global.IsMiniResolution()) {
			buttonScrollView.ResetActRect();
		} else {
			buttonScrollView.ActRect = buttonScrollView.rect;
		}

		float buttonWidth = _Global.IsLargeResolution() ? 
			((buttonScrollView.rect.height - 11) / chromeButtonObjTemplate.rect.height * chromeButtonObjTemplate.rect.width) : 
			chromeButtonObjTemplate.rect.width ;

		float fCnt = buttonScrollView.rect.width / buttonWidth;
		int cnt = Mathf.FloorToInt(fCnt);
		float fDelta  = fCnt - cnt;
		
		if ( fDelta > 0.6 )
		{
			//	do nothing
		}
		else if ( fDelta < 0.4 )
		{
			--cnt;
		}
		else if ( cnt <= buttonScrollView.numUIObject )
		{
			buttonScrollView.AutoLayout();
			return;
		}

		if ( cnt > 1 )
		{
			if ( cnt < buttonScrollView.numUIObject )
			{
				float needTotalWidth = (cnt + 0.5f) * buttonWidth;
				buttonScrollView.IntervalSize = (int)((buttonScrollView.rect.width - needTotalWidth) / (cnt - 1));
			}
			else
			{
				buttonScrollView.IntervalSize = (int)((buttonScrollView.rect.width - cnt * buttonWidth) / (cnt - 1));
			}
		}
	}

	private void ReorderLayout()
	{
		if (null != elementMgr)
			elementMgr.Reorder(uiRoot);

        AvaChatMenu chatMenu = MenuMgr.instance.getAvaChatMenu();
        chatMenu.MainChromChatTextWidth = (int)chatText1.rect.width;
        chatMenu.MainChromChatTextGUIStyle = chatText1.mystyle;

	}

	public override int Draw ()
	{
		if (!visible)
			return -1;
		if (disabled && Event.current.type != EventType.Repaint)
			return -1;

		if (null == elementMgr) {
			elementMgr = new UIElementMgr();
			elementMgr.CatchElement(uiRoot);
            ReorderLayout();
			ResizeMainChromeButtonScrollView();
            progressView.SetFixedRect();
            progressView.ReloadMarchList();
		}
		DrawLayout();

		return -1;
	}

	public bool isHitUI(Vector2 pos)
	{
		if (visible && elementMgr.IsHitUI(pos))
			return true;
		return false;
	}

	private void DrawLayout()
	{
		elementMgr.Draw();
        DrawOthers();
	}

    private void DrawOthers()
    {
        frozenTipBar.Draw();
        endFrozenTipBar.Draw();
		marchLineTipBar.Draw();
		waitingLabel.Draw ();
    }

    private void UpdateFrozenTipBar()
    {
        if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Frozen && !frozenTipBar.IsShow())
        {
            frozenTipBar.SetUIData(GameMain.Ava.Seed.MatchMakingResult);
            frozenTipBar.Show();
        }

        if (frozenTipBar.IsShow())
        {
            frozenTipBar.Update();
        }
    }

    private void UpdateEndFrozenTipBar()
    {
        if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.EndFrozen && !endFrozenTipBar.IsShow())
        {
            endFrozenTipBar.StopTime = GameMain.Ava.Event.EndFrozenEndTime - GameMain.unixtime();
            endFrozenTipBar.info.txt = string.Format("<color=white>{0}</color>", Datas.getArString("Event.AVA_mapclosetimedesc"));
            endFrozenTipBar.Show();
        }

        if (endFrozenTipBar.IsShow())
        {
            endFrozenTipBar.Update();
        }
    }

	private void UpdateMarchLineTipBar()
	{
		if( marchLineTipBar.IsShow() )
		{
			marchLineTipBar.Update();
		}
	}

	public void ShowMarchLineTipBar( string text ) {
		marchLineTipBar.StopTime = 3;
		marchLineTipBar.info.txt = text;
		marchLineTipBar.Show();
	}

    public override void Update ()
	{
		base.Update ();
		waitingLabel.Update ();
		buttonScrollView.Update();
		progressView.Update();
        UpdateChromeButtons();
        UpdateMarchRemainingTime();
		UpdateChatMessages();
        UpdateFrozenTipBar();
        UpdateEndFrozenTipBar();
		UpdateMarchLineTipBar();
	}

    private bool IsUIDisabled
    {
        get 
        {
            return GameMain.Ava.Event.CurStatus != AvaEvent.AvaStatus.Combat && 
                GameMain.Ava.Event.CurStatus != AvaEvent.AvaStatus.Frozen;
        }
    }

	public override void OnPush (object param)
	{
		base.OnPush (param);

		KBNMenu mainChrome = MenuMgr.instance.getMenu("MainChrom");
		if (null != mainChrome)
			mainChrome.SetVisible(false);

		UpdateCoordinateBar();

        if (lastChatTextsEventId != GameMain.Ava.Event.GetActId())
            lastChatTexts = null;

        FillChatText(lastChatTexts);

        SetButtonsDisabled(IsUIDisabled);
        SetCoordinateBarDisabled(IsUIDisabled);

        KBN.Game.Event.RegisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChanged);
        KBN.Game.Event.RegisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChangedStatic);
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		
        KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChanged);

		KBNMenu mainChrome = MenuMgr.instance.getMenu("MainChrom");
		if (null != mainChrome)
			mainChrome.SetVisible(true);

        Clear();

		elementMgr = null;
	}

    private void Clear()
    {
        progressView.Clear();
        chromeButtons.Clear();
        buttonScrollView.clearUIObject();
    }

    private void OnAvaStatusChanged(object sender, GameFramework.GameEventArgs e)
    {
        KBN.AvaStatusEventArgs args = e as KBN.AvaStatusEventArgs;

        if (args.Status == AvaEvent.AvaStatus.EndFrozen)
        {
            SetButtonsDisabled(true);
            SetCoordinateBarDisabled(true);
        }
    }

    private static void OnAvaStatusChangedStatic(object sender, GameFramework.GameEventArgs e)
    {
        KBN.AvaStatusEventArgs args = e as KBN.AvaStatusEventArgs;

        if (args.Status == AvaEvent.AvaStatus.Frozen)
        {
            lastChatTexts = null;
        }
    }

	public string handlerFilterInputFunc(string oldStr, string newStr)
	{
		int max = Constant.Map.AVA_MINIMAP_WIDTH;
		string input = _Global.FilterStringToNumberStr(newStr);
		long count = 0;
		if(input == string.Empty)
		{
			count = 0;
		}
		else
		{
			count = _Global.INT64(input);
		}
		count = count < 0 ? 0:count;
		count = count >= max ? max : count;
		return count == 0 ? string.Empty : count.ToString();
	}

	public string handlerInputDoneFunc(string input)
	{
		if(_Global.FilterStringToNumberStr(input) == string.Empty)
		{
			return "1";
		}
		else
		{
			return input;
		}
	}

    public override void handleNotification(string type, object body)
    {
        base.handleNotification(type, body);
        switch (type)
        {
        case Constant.Notice.AvaIncomingAttackListRefreshed:
            SetIncomingAttackData(GameMain.Ava.March.IncomingAttackList.Count);
            break;
		case Constant.Notice.AvaGetSeedOK:
			UpdateCoordinateBar();
			break;
		case Constant.Notice.AvaMarchOK:
			AvaBaseMarch data = body as AvaBaseMarch;
			if (null != data) {
				progressView.AddMarch(data);
			}
			break;
		case Constant.Notice.AvaGetMarchListOK:
			progressView.ReloadMarchList();
			break;
        }
    }

	private void UpdateCoordinateBar()
	{
		int tileId = GameMain.Ava.Seed.MyOutPostTileId;
		if (0 != tileId) {
			int x = GameMain.Ava.Seed.MyOutPostTileX;
			int y = GameMain.Ava.Seed.MyOutPostTileY;
			textInputX.txt = x.ToString();
			textInputY.txt = y.ToString();
		}
	}

    private void SetCoordinateBarDisabled(bool disabled)
    {
        textInputX.SetDisabled(disabled);
        textInputY.SetDisabled(disabled);
    }

	#region MainChrome Buttons Manipulator

	public ChromeButtonObj AddChromeButton(string name, Hashtable config, Action clickDelegate)
	{
		ChromeButtonObj btn = Instantiate(chromeButtonObjTemplate) as ChromeButtonObj;
		btn.OnClick = clickDelegate;
		btn.Init();
		btn.setData(config);

		if (_Global.IsLargeResolution()) {
			btn.Resize(buttonScrollView.rect.height - 11, FontSize.Font_40, FontSize.Font_32);
		}

		chromeButtons.Add(name, btn);
		buttonScrollView.addUIObject(btn);
		buttonScrollView.AutoLayout();
		buttonScrollView.MoveToTop();

        return btn;
	}

	public ChromeButtonObj GetChromeButton(string name)
	{
		if (chromeButtons.ContainsKey(name))
			return chromeButtons[name];
		return null;
	}

	#endregion

	public void OnChatButton()
	{
		MenuMgr.instance.PushMenu("AvaChatMenu", null);
	}

	public void OnHomeButton()
	{
		GameMain.singleton.loadLevel(GameMain.CITY_SCENCE_LEVEL);
	}

	public void OnMyOutpostButton()
	{
        if (IsUIDisabled)
            return;

		int tileId = GameMain.Ava.Seed.MyOutPostTileId;
		if (0 != tileId) {
			int x = GameMain.Ava.Seed.MyOutPostTileX;
			int y = GameMain.Ava.Seed.MyOutPostTileY;
			
			GameMain.singleton.hideTileInfoPopup2();
			GameMain.singleton.searchWorldMap2(x, y);
		}
	}

	public void OnSearchButton()
	{
        if (IsUIDisabled)
            return;

		int x = _Global.INT32(textInputX.txt);
		int y = _Global.INT32(textInputY.txt);

		x = Mathf.Clamp(x, 1, Constant.Map.AVA_MINIMAP_WIDTH);
		y = Mathf.Clamp(y, 1, Constant.Map.AVA_MINIMAP_HEIGHT);

		GameMain.singleton.hideTileInfoPopup2();
		GameMain.singleton.searchWorldMap2(x, y);
	}

	public void OnMarchLineButton()
	{
        if (IsUIDisabled)
            return;

		string tips = string.Empty;
		if(GameMain.GetIsShowAVAMarch())
		{
			tips = Datas.getArString("AVA.MarchLineOff");
		}
		else
		{
			tips = Datas.getArString("AVA.MarchLineOn");
		}
		if (MenuMgr.instance.hasMenuByName("NormalTipsMenu"))
		{
			return;
		}
		MenuMgr.instance.PushMenu("NormalTipsMenu", tips, "trans_immediate");

		GameMain.singleton.toggleShowAVAMarchLineInfo();
	}

    private void OnIncomingAttackBtn(object param)
    {
        if (IsUIDisabled)
            return;

        MenuMgr.instance.PushMenu("AvaIncomingAttackMenu", null, "trans_zoomComp");
    }

	public override bool OnBackButton()
	{
		MenuMgr.instance.PushQuitGameConfirmDailog ();
		return true;
	}
}
