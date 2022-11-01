
public class MissionBalloon extends FoldablePanel {
    private enum QuestCategory
    {
        Normal
    ,   Daily
    }

    private class QuestFacade
    {
        public var category : QuestCategory;
        public var questId : int;
        public var isFinish : boolean;
        public var desc : String;
        
        public function QuestFacade()
        {
            // Empty
        }
        
        public function QuestFacade(other : QuestFacade)
        {
            category = other.category;
            questId = other.questId;
            isFinish = other.isFinish;
            desc = other.desc;
        }
        
        public function QuestFacade(recommendQuest : Quests.QuestItem)
        {
            category = QuestCategory.Normal;
            questId = recommendQuest.questId;
            isFinish = recommendQuest.isFinish;
            
            var isColored:boolean = Quests.instance().isColorLabeledQuest(recommendQuest.questId.ToString());
            desc = Datas.getArString("questObjectives.q" + recommendQuest.questId.ToString() + (isColored ? "_1" : ""));
        }
        
        public function QuestFacade(dailyQuest : DailyQuestDataAbstract)
        {
            category = QuestCategory.Daily;
            questId = dailyQuest.Id;
            isFinish = dailyQuest.CanClaim;
            
            if (dailyQuest.DoneCount < dailyQuest.RequestedCount)
            {
                var color = FontMgr.GetColorFromTextColorEnum(FontColor.Orange);
                desc = String.Format("{0} <color={3}>({1}/{2})</color>", dailyQuest.Desc,
                    dailyQuest.DoneCount, dailyQuest.RequestedCount, _Global.ColorToString(color));
            }
            else
            {
                desc = dailyQuest.Desc;
            }
        }
    }
    
    private var inited : boolean;

	public var balloon:Button;
	public var buttonDetail:Button;
	public var buttonClaim:Button;
	
	public var head:Button;
	public var arrow:Label;
	public var redDot:Label;
	
	public var animLabel:KBN.AnimationLabel;
	public var animSize:int = 200;
	
	private var leftArrow:Texture;
	private var rightArrow:Texture;
	
	private var lastQuest:QuestFacade = null;
	
	private static var LAST_QUEST_ID:String = "LASTQUESTID";
	private static var LAST_QUEST_FINISHED:String = "LASTQUESTFINISHED";
	private static var LAST_BALLOON_STATUS:String = "LASTQUESTBALLOONSTATUS";
    private static var LAST_QUEST_CATEGORY:String = "LAST_QUEST_CATEGORY";
	
	private var lastQuestChanged:boolean = false;
	private var buttonForbiden:boolean = false;
	private var hideButtons:boolean = false;
	private var startAnimInMainThread:boolean = false;
	private var unfoldAfterQuestUpdated:boolean = false;
	private var noticeClaimButton:boolean = true;
	public var noticeAnimRate:float = 5.0f;
	private var timeElapsed:float = 0.0f;
	private var lastCompletedQuestId:int = -1;

	// BEGIN: these setters used by layout xml
	private var rectUpdated:boolean = false;
	private var balloonRelativeRect:Rect;
	private var buttonDetailRelativeRect:Rect;
	private var buttonClaimRelativeRect:Rect;
	private var lastRectWidth:float;
	
	public function set balloonRelative(value:Object) { // NOTE actually a Rect property in C#
		var r:Rect = CastStringToTexture.CastToRect(value as String);
		balloonRelativeRect = r;
		rectUpdated = true;
	}

	public function set buttonDetailRelative(value:Object) { // NOTE actually a Rect property in C#
		var r:Rect = CastStringToTexture.CastToRect(value as String);
		buttonDetailRelativeRect = r;
		rectUpdated = true;
	}

	public function set buttonClaimRelative(value:Object) { // NOTE actually a Rect property in C#
		var r:Rect = CastStringToTexture.CastToRect(value as String);
		buttonClaimRelativeRect = r;
		rectUpdated = true;
	}

	private function setRelativePosition(obj:Button, relPos:Rect, ratioPosition:boolean, ratioSize:boolean) {
		var w:float = rect.width;
		var h:float = rect.height;
		var r:Rect = new Rect(
			ratioPosition ? w * relPos.x : (relPos.x >= 0 ? relPos.x : w + relPos.x),
			ratioPosition ? h * relPos.y : (relPos.y >= 0 ? relPos.y : h + relPos.y),
			ratioSize ? w * relPos.width : relPos.width,
			ratioSize ? h * relPos.height : relPos.height
			);
		obj.rect = r;
	}
	// END: these setters used by layout xml

	// BEGIN: property for scaling animation
	private var initialRect:Rect;
	public function set buttonScaler(value:float) {
		var factor:float = (value - 1.0f) * 0.5f;
		buttonClaim.rect.x = initialRect.x - factor * initialRect.width;
		buttonClaim.rect.y = initialRect.y - factor * initialRect.height;
		buttonClaim.rect.width = value * initialRect.width;
		buttonClaim.rect.height = value * initialRect.height;
	}
	
	public function get buttonScaler():float {
		return buttonClaim.rect.width / initialRect.width;
	}
	// END: property for scaling animation

	public function Init() {
		super.Init();
		
		balloon.OnClick = OnBalloonClick;
		buttonDetail.OnClick = OnButtonDetailClick;
		buttonClaim.OnClick = OnButtonClaimClick;
		head.OnClick = OnHeadClick;
		
		animLabel.OnAnimationOver = OnExplosionAnimComplete;
		animLabel.Init("tongyongbaopo000", 6, AnimationLabel.LABEL_STATE.NONE);
		
		rightArrow = TextureMgr.instance().LoadTexture("quest_Arrow1", TextureType.DECORATION);
		leftArrow = TextureMgr.instance().LoadTexture("quest_Arrow2", TextureType.DECORATION);
		arrow.mystyle.normal.background = (status == Status.FOLDED) ? rightArrow : leftArrow;
		
		head.SetVisible(false);
		balloon.SetVisible(false);
		buttonClaim.SetVisible(false);
		buttonDetail.SetVisible(false);
		redDot.SetVisible(false);
		arrow.SetVisible(false);
		
		lastQuest = new QuestFacade();
		var lastQuestId:int = PlayerPrefs.GetInt(LAST_QUEST_ID, -1);
		var lastQuestFinished:boolean = (PlayerPrefs.GetInt(LAST_QUEST_FINISHED, 0) == 1);
		lastQuest.questId = lastQuestId;
		lastQuest.isFinish = lastQuestFinished;
        lastQuest.category = PlayerPrefs.GetInt(LAST_QUEST_CATEGORY, 0);
		if (lastQuestId != -1)
			updateBalloonButton(lastQuestFinished);
		
		var lastStatus:int = PlayerPrefs.GetInt(LAST_BALLOON_STATUS, 0);
		status = lastStatus;
		UnityNet.SendQuestBalloonStatusBI(status == Status.FOLDED ? 0 : 1);
		
		timeElapsed = 0.0f;
        
        RefreshCurrentMission();
        inited = true;
        GameMain.instance().resgisterRestartFunc(function() { inited = false; });
	}

	private function updateRelativePosition() {
		setRelativePosition(balloon, balloonRelativeRect, true, true);
		setRelativePosition(buttonDetail, buttonDetailRelativeRect, false, false);
		setRelativePosition(buttonClaim, buttonClaimRelativeRect, false, false);
		rectUpdated = false;
		
		if (status == Status.FOLDED) {
			innerTrans = new Vector2(-rect.width, 0);
		} else if (status == Status.UNFOLDED) {
			innerTrans = Vector2.zero;
		}
		initialRect = buttonClaim.rect;
	}
	
	public function Update() {
		super.Update();
		
		if (rectUpdated || lastRectWidth != rect.width) {
			updateRelativePosition();
			lastRectWidth = rect.width;
		}
		
		redDot.SetVisible(head.isVisible() && status == Status.FOLDED && buttonClaim.isVisible());
		
		// these must be executed in MainThread, not in which Callbacks from network request are
		if (lastQuestChanged) {
			PlayerPrefs.SetInt(LAST_QUEST_ID, lastQuest.questId);
			PlayerPrefs.SetInt(LAST_QUEST_FINISHED, lastQuest.isFinish ? 1 : 0);
            PlayerPrefs.SetInt(LAST_QUEST_CATEGORY, lastQuest.category);
			lastQuestChanged = false;
		}
		
		if (startAnimInMainThread) {
			Invoke("PlayButtonExpandAnim", 0.5);
			startAnimInMainThread = false;
		}
		
		timeElapsed += Time.deltaTime;
		if (noticeClaimButton && status == Status.UNFOLDED && buttonClaim.isVisible()) {
			buttonScaler = 1.0f + 0.1f * Mathf.Sin(timeElapsed * noticeAnimRate);
		}
		
		if (lastCompletedQuestId != -1) {
			UnityNet.SendQuestCompleteBI(lastCompletedQuestId);
			lastCompletedQuestId = -1;
		}
	}
	
	public function Draw() {
		super.Draw();
		animLabel.Draw();
	}
	
	protected function OnFold() {
		super.OnFold();
		arrow.SetVisible(false);
	}
	
	protected function OnUnfold() {
		super.OnUnfold();
		arrow.SetVisible(false);
		unfoldAfterQuestUpdated = false;
	}
	
	protected function OnFolded() {
		super.OnFolded();
		PlayerPrefs.SetInt(LAST_BALLOON_STATUS, parseInt(status));
		arrow.SetVisible(true);
		arrow.mystyle.normal.background = rightArrow;
		buttonForbiden = false;
		hideButtons = false;
		RefreshCurrentMission();
	}
	
	protected function OnUnfolded() {
		super.OnUnfolded();
		PlayerPrefs.SetInt(LAST_BALLOON_STATUS, parseInt(status));
		arrow.SetVisible(true);
		arrow.mystyle.normal.background = leftArrow;
		buttonForbiden = false;
	}
	
	function updateBalloonButton(questFinished:boolean) {
		buttonClaim.SetVisible(questFinished && !hideButtons);
		buttonDetail.SetVisible(!questFinished && !hideButtons);
	}
	
    private function GetCurrentQuestFacade() : QuestFacade
    {
        var recommendQuest : Quests.QuestItem = Quests.instance().recommandQuest;
        if (recommendQuest != null && GameMain.instance().getPlayerLevel() < Quests.instance().GetMainRecommendLevel())
        {
            return new QuestFacade(recommendQuest);
        }

        var unclaimedDailyQuests : DailyQuestDataAbstract[] = DailyQuestManager.Instance.UnclaimedQuests;
        if (unclaimedDailyQuests != null && unclaimedDailyQuests.Length > 0)
        {
            return new QuestFacade(unclaimedDailyQuests[0]);
        }
        
        return null;
    }
    
	public function RefreshCurrentMission() {
		if (hideButtons || !inited) return; // don't refresh while explosing & folding

        var questFacade : QuestFacade = GetCurrentQuestFacade();
        if (questFacade != null && !KBN.FTEMgr.isFTERuning() && BuffAndAlert.instance().attackNum <= 0) {
        
			balloon.txt = questFacade.desc;
			SetVisible(status != Status.FOLDED);
			head.SetVisible(true);
			balloon.SetVisible(true);
			
			if (null == lastQuest || lastQuest.questId != questFacade.questId || lastQuest.category != questFacade.category) {
				// new quest
				updateBalloonButton(questFacade.isFinish);
				if (status == Status.FOLDED) {
					if (unfoldAfterQuestUpdated) {
						buttonForbiden = true;
						Unfold(0.3f);
					}
				}
				lastQuestChanged = true;
                startAnimInMainThread = questFacade.isFinish;
				
			} else if (!lastQuest.isFinish && questFacade.isFinish) {
				// current finished
				if (status == Status.FOLDED) {
					updateBalloonButton(true);
				} else {
					startAnimInMainThread = true;
				}
				lastQuestChanged = true;
				
                if (questFacade.category == QuestCategory.Normal)
                {
				    lastCompletedQuestId = questFacade.questId;
                }
			} else if (lastQuest.isFinish && !questFacade.isFinish) {
				// current unfinished.... for example, destructed buildings
				updateBalloonButton(false);
				startAnimInMainThread = false;
				lastQuestChanged = true;
			}
			
            lastQuest = new QuestFacade(questFacade);
		} else { // hide all
            SetAllComponentInvisible();
		}
		
		arrow.SetVisible(head.isVisible());
	}
    
    private function SetAllComponentInvisible()
    {
        SetVisible(false);
        head.SetVisible(false);
        balloon.SetVisible(false);
        buttonClaim.SetVisible(false);
        buttonDetail.SetVisible(false);
        redDot.SetVisible(false);
    }
	
	private function OnHeadClick(param:Object) {
		if (buttonForbiden) return;
		Toggle(FoldingDirection.LEFT);
	}
	
	private function OnBalloonClick(param:Object) {
		if (buttonClaim.isVisible())
			OnButtonClaimClick(param);
		else
			OnButtonDetailClick(param);
	}
	
	private function OnButtonDetailClick(param:Object) {
		if (buttonForbiden || null == lastQuest || lastQuest.questId == -1) return;
		MenuMgr.getInstance().PushMenu("Mission", lastQuest.category == QuestCategory.Normal ? "recommand" : "daily");
	}
	
	private function OnButtonClaimClick(param:Object) {
		if (buttonForbiden || null == lastQuest || lastQuest.questId == -1 || !lastQuest.isFinish) return;
        
        if (lastQuest.category == QuestCategory.Normal)
        {
		    Quests.instance().getReward(lastQuest.questId, true, OnClaimSuccess);
        }
        else
        {
            DailyQuestManager.Instance.ReqClaimQuestReward(lastQuest.questId, OnClaimDailyQuestSuccess);
        }
	}
    
    private function OnClaimDailyQuestSuccess(ho : HashObject, quest : DailyQuestDataAbstract) {
        PlayClaimSuccessSound();
        PlayClaimSuccessAnim();
        RefreshCurrentMission();
    }
	
	private function OnClaimSuccess(data:HashObject) {
        PlayClaimSuccessSound();
        PlayClaimSuccessAnim();
		
		// show rewards message
		var displayString:String = Datas.getArString("QuestsModal.ClaimReward");
		displayString += "\n";
		var rewards:Array = Quests.instance().rewards(lastQuest.questId);
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
		MenuMgr.getInstance().PushQuestRewardMessage(displayString, lastQuest.questId);
		
		// update quest info
		Quests.instance().createDisplayInfor();
	}
    
    private function PlayClaimSuccessSound() {
        SoundMgr.instance().PlayEffect( "quest_complete", TextureType.AUDIO );
    }
    
	private function PlayClaimSuccessAnim() {
		/*判断任务是否全部完成 没有完成则继续在主界面继续刷新*/
		var unclaimedDailyQuests: DailyQuestDataAbstract[] = DailyQuestManager.Instance.UnclaimedQuests;
		if (unclaimedDailyQuests.Length > 0)
		{
			/*领取完任务播放动画*/
			var btnRect: Rect = buttonClaim.rect;
			animLabel.rect = new Rect(
				btnRect.x + (btnRect.width - animSize) * 0.5f + rect.x,
				btnRect.y + (btnRect.height - animSize) * 0.5f + rect.y,
				animSize, animSize);
			animLabel.Start();
			return;
		}

        hideButtons = true;
        buttonDetail.SetVisible(false);
        buttonClaim.SetVisible(false);      
       
    }
	
	private function OnExplosionAnimComplete() {
		Fold(FoldingDirection.LEFT);
		unfoldAfterQuestUpdated = true;
	}
	
	private function PlayButtonExpandAnim() {
		updateBalloonButton(true);
		buttonScaler = 1.0f;
		noticeClaimButton = false;
	}
}
