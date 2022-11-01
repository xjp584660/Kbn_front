import System.Collections.Generic;

public class Mission extends KBNMenu
{
    @SerializeField
    private var toolBar : ToolBar;
    @SerializeField
    private var toolBarStringKeys : String[];

    @System.Serializable
    private class ToolBarTextColors
    {
        public var normal : Color;
        public var transNormal : Color;
        public var transDelta : Color;
    }
    
    @SerializeField
    private var toolBarTextColors : ToolBarTextColors;

	public var scrollList:ScrollList;
	public var missionItemObj:MIssionItemObj;
	public var listItem:QuestListItem;
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;

	public var titleRec:Label;
	public var titleBg:Label;
	public var titleStar:Label;
	
	public var finishDescription:Label;
	public var iconWomen:Label;
	public var itemGoto:Label;
	public var itemTitle:Label;
	public var btnAchievement:Button;
	public var itemBg:Label;
	public var bg_title:Label;
	public var bg_flower:Label;
	public var componentRec:ComposedUIObj;
	public var btnGoto:Button;
	public var btnClaim:Button;
	public var btnClaimArea:Button;
	

	private var hasRecomandQuest:boolean;
	
	private var g_displayQuests:System.Collections.Generic.Dictionary.<String, Array>;
	private var g_displayRec:Quests.QuestItem;
	private var questlist:Object;
	private var arStrings:Object;
		
	private var g_listDataArray:Array;
    
    @SerializeField
    private var dailyQuestContent : DailyQuestContent;

    private function OnTabIndexChanged(index : int) : void
    {
        if (index == 1) // Daily quest
        {
            ResetToolBarColor();
            dailyQuestContent.ReqUpdateData();
        }
    }
    
    private function InitToolBar() : void
    {
        toolBar.Init();
        toolBar.indexChangedFunc = OnTabIndexChanged;
        
        var toolBarStrings : List.<String> = new List.<String>();
        for (var key : String in toolBarStringKeys)
        {
            toolBarStrings.Add(Datas.getArString(key));
        }
        toolBar.toolbarStrings = toolBarStrings.ToArray();
        
        ResetToolBarColor();
    }
    
    private function InitDailyQuestContent() : void
    {
        dailyQuestContent.Init();
    }

	function Init()
	{
        InitToolBar();
        InitNormalQuestContent();
        InitDailyQuestContent();
    }

    function InitNormalQuestContent()
    {
		priv_moveToRight();
		m_totalEscapeTime = g_moveTime;
		m_curXPos = g_endXPos;

		QuestListItem.g_curSelectedId = -1;

		menuHead = GameObject.Instantiate(clone_menuHead);
		missionItemObj.Init();
		missionItemObj.setBtnBackVisible(false);
		missionItemObj.rect.x = this.priv_getCurrentPos();
		g_displayQuests = new System.Collections.Generic.Dictionary.<String, Array>();
		g_listDataArray = new Array();
		menuHead.Init();
		titleRec.Init();
		titleBg.Init();
		titleStar.Init();
		iconWomen.Init();
		iconWomen.setBackground("Quest_Morgause", TextureType.DECORATION);
		if(KBN._Global.IsLargeResolution ())
		{
			iconWomen.rect = new Rect(45,117,100,115);			
		}
		else
		{
			iconWomen.rect = new Rect(45,105,128,147);
		} 
				
		itemGoto.Init();
		itemTitle.Init();
		btnAchievement.Init();
		finishDescription.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		btnClaim.Init();
		btnClaim.OnClick = handleClaim;
		btnClaim.mystyle.normal.background = texMgr.LoadTexture("claim_normal", TextureType.BUTTON);
		btnClaim.mystyle.active.background = texMgr.LoadTexture("claim_down", TextureType.BUTTON);
		btnClaim.txt = Datas.getArString("fortuna_gamble.win_claimButton");	
		btnClaimArea.Init();
		btnClaimArea.OnClick = handleClaim;
		btnClaimArea.mystyle.normal.background = null;
		btnClaimArea.mystyle.active.background = null;
		btnClaimArea.txt = null;

		scrollList.Init(listItem);
		scrollList.bindActRectToRect = false;
		scrollList.actRect = new Rect(scrollList.rect);

		btnGoto.OnClick = handleClick;
		
		titleBg.useTile = true;
		titleBg.tile = TextureMgr.instance().BackgroundSpt().GetTile("title bar");

		componentRec.component = [scrollList, itemBg, bg_title, bg_flower, titleBg, titleStar, itemTitle, iconWomen, btnClaim, btnClaimArea, itemGoto, btnAchievement, titleRec, finishDescription, btnGoto];
	}
	
	private function handleClaim():void
	{
		if(g_displayRec!= null)
		{
			Quests.instance().getReward(g_displayRec.questId, successClaim);
		}
		this.popSubMenu(true);
	}
	
	private function successClaim(param:HashObject):void
	{
		resetDisplayInfor(g_displayRec.questId);
	}
	
	private function playClaimMusic():void
	{
		SoundMgr.instance().PlayEffect("quest_complete", "Audio/");
	}
	
	public function resetDisplayInfor(_id:int):void
	{
		Invoke("playClaimMusic", 1);
		resetDataArray();
		scrollList.SetData(g_listDataArray);
		
		var displayString:String = Datas.getArString("QuestsModal.ClaimReward");
		displayString += "\n";
		
		var rewards:Array = Quests.instance().rewards(_id);
		var count:int = 0;
		var reward:Quests.DataReward;
		for(var a:int = 0; a < rewards.length; a++)
		{
			reward = rewards[a] as Quests.DataReward;
			displayString += reward.name + ": " + reward.count + "  ";
		
			count++;
			if(count == 2)
			{
				count = 0;
				displayString += "\n";
			}
		}

		MenuMgr.getInstance().PushQuestRewardMessage(displayString, _id);	
	}
	
	private function handleClick():void
	{
		if(!hasRecomandQuest)
		{
			return;
		}
		
		var data:MissionItem = new MissionItem();
		data.id = g_displayRec.questId;
		data.isFinished = g_displayRec.isFinish;
		
		pushSubMenu(data);			
	}
	

	function pushSubMenu(_data:MissionItem)
	{
		missionItemObj.setData(_data);
		this.priv_moveToLeft();
		QuestListItem.g_curSelectedId = _data.id;
	}
	
	function popSubMenu(isBack:boolean)
	{
		this.priv_moveToRight();
		if(!isBack)
		{
			resetDataArray();
			scrollList.SetData(g_listDataArray);		
		}

		QuestListItem.g_curSelectedId = -1;
	}

	function DrawItem()
	{
        switch (toolBar.selectedIndex)
        {
        case 0:
            missionItemObj.rect.x = this.priv_getCurrentPos();
            scrollList.actRect.width = missionItemObj.rect.x - scrollList.rect.x;

            switch (UnityEngine.Event.current.type)
            {
                case UnityEngine.EventType.Repaint:
                    componentRec.Draw();
                    missionItemObj.Draw();
                    break;
                default:
                    var oldScrollListRight : float = scrollList.rect.width;
                    scrollList.rect.width = missionItemObj.rect.x - scrollList.rect.x + 5;
                    var oldBtnGotoWidth : float = btnGoto.rect.width;
                    btnGoto.rect.width = missionItemObj.rect.x - btnGoto.rect.x + 5;
                    missionItemObj.Draw();
                    componentRec.Draw();
                    scrollList.rect.width = oldScrollListRight;
                    btnGoto.rect.width = oldBtnGotoWidth;
                    break;
            }
            break;
        case 1:
            dailyQuestContent.Draw();
            break;
        default:
            break;
        }

        frameTop.Draw();
        toolBar.Draw();
	}

	function Update()
	{
		this.priv_updateCurrentPos();
		menuHead.Update();
        toolBar.Update();
        switch (toolBar.selectedIndex)
        {
        case 0:
		    componentRec.Update();
            break;
        case 1:
            dailyQuestContent.Update();
            break;
        default:
            break;
        }
	}

	private function resetDataArray():void
	{
		Quests.instance().createDisplayInfor();
		g_displayQuests = Quests.instance().nonRecommandQuests;
		g_displayRec = Quests.instance().recommandQuest;

		g_listDataArray.clear();

		if(g_displayRec != null)
		{
			hasRecomandQuest = true;
			btnGoto.visible = true;
			
			if(g_displayRec.isFinish)
			{
				btnClaim.visible = true;
				btnClaimArea.visible = true;
			}
			else
			{
				btnClaim.visible = false;
				btnClaimArea.visible = false;
			}
			
			itemTitle.txt = Datas.getArString("questName."+"q" + g_displayRec.questId) + "";
		}
		else
		{
			hasRecomandQuest = false;
			btnGoto.visible = false;
			
			btnClaim.visible = false;
			btnClaimArea.visible = false;		
			
			itemGoto.visible = false;
			itemTitle.visible = false;
			finishDescription.visible = true;

			titleRec.visible = false;
			titleStar.visible = false;
		}

		var questItem:Quests.QuestItem;
		var missionItem:MissionItem;
		var strAdvanceYourCity	: String	= Datas.getArString("questCategory.q1000");
		var strGrowYourEconomy	: String	= Datas.getArString("questCategory.q1013");
		var strExpandYourCity	: String	= Datas.getArString("questCategory.q1052");
		var strGrowYourArmy		: String	= Datas.getArString("questCategory.q1091");
		var strImproveYourTitle	: String	= Datas.getArString("questCategory.q11002");
		var strAdvanceYourResearch: String	= Datas.getArString("questCategory.q1112");

		var getQuestType = function(strData : String) : MissionItem.MissionType
		{
			if ( strData == strAdvanceYourCity )
				return MissionItem.MissionType.City;
			if ( strData == strGrowYourEconomy )
				return MissionItem.MissionType.Economy;
			if ( strData == strExpandYourCity )
				return MissionItem.MissionType.City;
			if ( strData == strGrowYourArmy )
				return MissionItem.MissionType.Army;
			if ( strData == strImproveYourTitle )
				return MissionItem.MissionType.Unkown;
			if ( strData == strAdvanceYourResearch )
				return MissionItem.MissionType.Research;
			return MissionItem.MissionType.Unkown;
		};

		for(var qid : String in g_displayQuests.Keys)
		{
			var quests:Array = g_displayQuests[qid];
			missionItem = new MissionItem();
			missionItem.isTitle = true;
			missionItem.title = qid;
			missionItem.missionType = getQuestType(missionItem.title);
			g_listDataArray.push(missionItem);			

			for(var b=0; b < quests.length; b++)
			{
				missionItem = new MissionItem();
				questItem = quests[b] as Quests.QuestItem;
				if(b == quests.length - 1)
				{
					missionItem.isTitle = false;
					missionItem.name = Datas.getArString("questName."+"q" + questItem.questId); 
					missionItem.isFinished = questItem.isFinish; 
					missionItem.needDivideLine = false;
					missionItem.id = questItem.questId;
				}
				else
				{
					missionItem.isTitle = false;
					missionItem.name = Datas.getArString("questName."+"q" + questItem.questId);
					missionItem.isFinished = questItem.isFinish;
					missionItem.needDivideLine = true;
					missionItem.id = questItem.questId;			  			  
				}
					  
				g_listDataArray.push(missionItem);
			}
		}		
	}
	
	class MissionItem
	{
		public enum MissionType
		{	Economy
		,	City
		,	Research
		,	Army
		,	Unkown
		}

		public var missionType : MissionType;
		public var isTitle:boolean;
		public var name:String;
		public var isFinished:boolean;
		public var needDivideLine:boolean;
		public var id:int;
		public var title:String;
		
		public function MissionItem()
		{missionType = MissionType.Unkown;}
	}	

	public function OnPop()
	{
		MenuMgr.getInstance().MainChrom.StopQuestAnimation();
		super.OnPop();
	}
	
	public function OnPopOver()
	{
        dailyQuestContent.OnPopOver();
		scrollList.Clear();
		missionItemObj.clear();
		TryDestroy(menuHead);
		menuHead = null;
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);

		MenuMgr.getInstance().MainChrom.StopQuestAnimation();
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgStartY = 140;
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		
		iconWomen.visible = true;
		itemGoto.visible = true;
		itemTitle.visible = true;
		titleRec.visible = true;
		finishDescription.visible = false;
		titleStar.visible = true;
		btnGoto.visible = false;
		
		finishDescription.txt = Datas.getArString("QuestsModal.QuestsFinish");
		menuHead.setTitle(Datas.getArString("ModalTitle.Quest"));
		titleRec.txt = Datas.getArString("Common.Recommended");
		btnAchievement.SetVisible(false);
		questlist = Datas.instance().questlist();
		
		resetDataArray();
		if(g_listDataArray.length != 0)
		{
			scrollList.SetData(g_listDataArray);
		}
		
		if (param != null)
		{
			var str:String = param as String;
			if (str == "recommand")
			{
				handleClick();
			}
            else if (str == "daily")
            {
                toolBar.selectedIndex = 1;
            }
		}
	}
    
    public function OnPushOver()
    {
        CheckToolBarFlashing();
    }

	function DrawBackground()
	{
		menuHead.Draw();
		DrawMiddleBg();
	}

	private static var g_moveTime : float = 0.5f;
	private static var g_startXPos : int = 100;
	private static var g_endXPos : int = 610;

	private var m_curXPos : float = g_endXPos;
	private var m_curStart : int = g_endXPos;
	private var m_curTarget : int = g_endXPos;
	private var m_totalEscapeTime : float = g_moveTime;
	private function priv_getCurrentPos()
	{
		return m_curXPos;
	}

	private function priv_updateCurrentPos()
	{
		m_totalEscapeTime += UnityEngine.Time.deltaTime;
		var moveLen : float = g_endXPos - g_startXPos;
		m_curXPos = UnityEngine.Mathf.SmoothStep(m_curStart, m_curTarget, m_totalEscapeTime/g_moveTime);
	}
	
	private function priv_moveToLeft()
	{
		if ( m_curStart > m_curTarget )
		{		
			return;
		}
		missionItemObj.setBtnBackVisible(true);	
		m_curStart = g_endXPos;
		m_curTarget = g_startXPos;
		m_totalEscapeTime = 0;
	}

	private function priv_moveToRight()
	{
		if ( m_curStart < m_curTarget )
		{			
			return;
		}
		
		missionItemObj.setBtnBackVisible(false);
		m_curStart = g_startXPos;
		m_curTarget = g_endXPos;
		m_totalEscapeTime = 0;
	}

	public function OnBackButton() : boolean
	{
		if(m_curTarget < g_endXPos)
		{
			this.popSubMenu(true);
			return true;
		}
		return super.OnBackButton();
	}
    
    public function handleNotification(type : String, body : System.Object) : void
    {
        switch (type)
        {
        case Constant.Notice.DailyQuestProgressIncreased:
            CheckToolBarFlashing();
            break;
        }
    
        if (toolBar.selectedIndex == 1)
        {
            dailyQuestContent.HandleNotification(type, body);
        }
    }
    
    private function CheckToolBarFlashing()
    {       
        if (DailyQuestManager.Instance.CanClaimAny)
        {
            if (toolBar.selectedIndex != 1)
            {
                toolBar.styles[1].normal.textColor = toolBarTextColors.transNormal;
                toolBar.setColorChangedValue(toolBarTextColors.transDelta, 10, 2, toolBarTextColors.normal);
                toolBar.changeColorByIndex(1);
            }
            else
            {
                ResetToolBarColor();
            }
        }
        else
        {
            ResetToolBarColor();
        }
    }
    
    private function ResetToolBarColor()
    {
        toolBar.clearColorOperation();
        toolBar.styles[1].normal.textColor = toolBarTextColors.normal;
    }
}

