public class HeroExplore extends KBNMenu
{
	@SerializeField
	public class HeroExploreControl
	{
		public var npcTitle : Label;
	    public var npcHead : Label;
	    public var npcBall : Label;
	    public var npcName : Label;
	    public var npcMessage : Label;
	    public var npcMessageArrow : Label;
	    public var npcHand : Label;
	    public var npcHandTips : Label;
        public var gameProgress : PercentBar;
        public var gameProgressText : Label;
        public var blackPanel : Label;
        public var blankPanel : Label;
        public var itemTile : Label[];
        public var itemEffect : Label[];
        public var itemFrame : Label[];
        public var itemBackground : Label[];
        public var itemAlpha : Label[];
        public var itemAlphaTips : Label;
        public var itemLight : Label[];
        public var item : Button[];
        public var itemDescription : Label;
        public var headButton : Button;
        public var headBack : Label;
	    public var head : Label;
	    public var headFrame : Label;
        public var number : Label;
	    public var message : Label;
	    public var map : Label;
	    public var explore : Button[];
	    public var exploreEffect : Label[];
        public var box : Label[];
        public var boxIcon : Label[];
	    public var lineBottom : Label;
	    public var bottomBackground : Label;
	    public var description : Label;
	    public var finish : Button;
	    public var lightBackground : Label;
		public var effectRotate : Rotate;
		public var autoButton : Button;
		public var autoHelpButton : Button;
		public var ballButton : Button;
	}
    @SerializeField
    private var control : HeroExploreControl;

    @SerializeField
    public class HeroExploreArgument
    {
    	public var npcSpeakCount : int;
        public var itemStart : Vector2[];
        public var itemNext : Vector2[];
        public var itemEnd : Vector2[];
        public var itemAlphaTipsDelay : float;
        public var exploreBasePos : Vector2[];
        public var explorePosOffset : int;
        @HideInInspector
        public var explorePos : Vector2[];
        public var boxPosOffset : Vector2;
        public var itemCenter : Vector2;
        public var arrowFromPos : Vector2;
        public var arrowToPos : Vector2;
        public var arrowSpeed : float;
        public var handFromPos : Vector2;
        public var handToPos : Vector2;
        public var handSpeed : float;
        public var handInterval : float;
        public var heroSpeakCount : int;
        public var heroSpeakInterval : float;
    }
    @SerializeField
    private var argument : HeroExploreArgument;

    @SerializeField
    public class HeroExploreAnimation
    {
        public var refLabel : Label;
        public var animActive : boolean;
        public var animationName : String[];
        public var speed : float;
        public var loop : boolean;
        public var elapse : float;

        public function Update() : void
        {
            if (animActive && animationName.length > 0)
            {
                elapse += Time.deltaTime;
                refLabel.SetVisible(true);
                var name : String = animationName[(elapse / speed) % animationName.length];
                if (refLabel.tile == null || name != refLabel.tile.name)
                {
                    refLabel.tile = TextureMgr.instance().GetHeroSpt().GetTile(name);
                }
                if (!loop && elapse >= speed * animationName.length)
                {
                    animActive = false;
                    refLabel.SetVisible(false);
                }
            }
            else
            {
                elapse = 0.0f;
                refLabel.SetVisible(false);
            }
        }
    }
    @SerializeField
    private var itemAnimation : HeroExploreAnimation[];
    @SerializeField
    private var exploreAnimation : HeroExploreAnimation[];

    private var animationManager : GUIAnimation = null;
    private var statusList : Dictionary.<HeroExploreStatusType, HeroExploreStatus> = null;
    private var currentStatus : HeroExploreStatus = null;
    private var heroInfo : KBN.HeroInfo = null;
    private var currentExploreIndex : int = -1;
    private var currentExploreItemIndex : int = -1;
    private var currentShowDescriptionIndex : int = -1;

	public function Init() : void
	{
	    super.Init();

	    animationManager = new GUIAnimation();

	    statusList = new Dictionary.<HeroExploreStatusType, HeroExploreStatus>();
	    statusList.Add(HeroExploreStatusType.Load, new HeroExploreStatusLoad(this, control, argument));
	    statusList.Add(HeroExploreStatusType.Teach, new HeroExploreStatusTeach(this, control, argument));
		statusList.Add(HeroExploreStatusType.Ready, new HeroExploreStatusReady(this, control, argument));
		statusList.Add(HeroExploreStatusType.Auto, new HeroExploreStatusAuto(this, control, argument));
	    statusList.Add(HeroExploreStatusType.Help, new HeroExploreStatusHelp(this, control, argument));
	    statusList.Add(HeroExploreStatusType.Play, new HeroExploreStatusPlay(this, control, argument));
	    statusList.Add(HeroExploreStatusType.Timeout, new HeroExploreStatusTimeout(this, control, argument));
	    statusList.Add(HeroExploreStatusType.Wait, new HeroExploreStatusWait(this, control, argument));
	    statusList.Add(HeroExploreStatusType.ShowFirst, new HeroExploreStatusShowFirst(this, control, argument));
	    statusList.Add(HeroExploreStatusType.ShowNext, new HeroExploreStatusShowNext(this, control, argument));
	    statusList.Add(HeroExploreStatusType.ShowLast, new HeroExploreStatusShowLast(this, control, argument, exploreAnimation));
	    statusList.Add(HeroExploreStatusType.Normal, new HeroExploreStatusNormal(this, control, argument, exploreAnimation));
	    statusList.Add(HeroExploreStatusType.Flag, new HeroExploreStatusFlag(this, control, argument, exploreAnimation, itemAnimation));
	    for (var status : HeroExploreStatus in statusList.Values)
	    {
            status.Init();
	    }
	    currentStatus = statusList[HeroExploreStatusType.Load];

		control.npcHandTips.txt = Datas.getArString("HeroHouse.Explore_Merlin_Tip");
	    control.description.txt = Datas.getArString("HeroHouse.ExploreDesc");
	    control.finish.txt = Datas.getArString("HeroHouse.EndExploreButton");
	    control.npcTitle.txt = Datas.getArString("HeroHouse.Explore_Merlin_Title");
	    control.npcName.txt = Datas.getArString("HeroHouse.Explore_Merlin_Tile");
	    control.npcMessage.txt = Datas.getArString("HeroHouse.Explore_Merlin_Text1");
	    control.message.txt = Datas.getArString("HeroHouse.Explore_Hero_Text1");
		control.itemAlphaTips.txt = Datas.getArString("HeroHouse.Explore_HintText");
		control.autoButton.txt = Datas.getArString("Hero.ExploreAutoButton");
	    
	    control.finish.changeToBlueNew();
		
	    control.finish.OnClick = OnFinishClick;
		control.headButton.OnClick = OnHeadClick;
		control.autoButton.OnClick = OnAutoClick;
		control.autoHelpButton.OnClick = OnAutoHelpClick;
		control.ballButton.OnClick = OnBallClick;
		
		var index : int = 0;
		for (var i : Button in control.explore)
		{
            i.clickParam = index;
			i.OnClick = OnExploreClick;
            index++;
		}
		
        index = 0;
        for (var i : Button in control.item)
        {
            i.clickParam = index;
			i.OnClick = OnItemClick;
            index++;
        }

        index = 0;
        for (var i : Label in control.itemFrame)
        {
            i.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_frame");
            index++;
        }

        index = 0;
        for (var i : Label in control.itemBackground)
        {
            i.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_framebg");
            index++;
        }
        
        index = 0;
        for (var i : Label in control.itemLight)
        {
            i.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_pitchon");
            index++;
        }

		control.npcHand.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_hand");
        control.headFrame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
        control.number.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_icon");
        control.map.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_map");
        
        index = 0;
        for (var i : Label in control.box)
        {
            i.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_box");
            index++;
        }
        
        control.effectRotate = new Rotate();
	    control.effectRotate.init(control.lightBackground, EffectConstant.RotateType.LOOP, Rotate.RotateDirection.CLOCKWISE, 0, 10);
	    control.effectRotate.playEffect();
	}

	public function Update() : void
	{
	    super.Update();

	    currentStatus.Update();
        animationManager.Update(Time.deltaTime);
	}

	public function DrawItem() : void
	{
	    currentStatus.Draw();
	}
	
	public function OnPush(param : Object) : void
	{
		super.OnPush(param);

	    heroInfo = param as KBN.HeroInfo;
	    if (heroInfo != null)
	    {
	        control.headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
	        control.head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
	    }

	    currentStatus = statusList[HeroExploreStatusType.Load];
	    currentStatus.Enter();
	}
	
	public function OnPop() : void
	{
		super.OnPop();
		
		GameMain.instance().getHeroExploreController().ChangeStatus(4);
	}

	public function OnPopOver() : void
	{
	    super.OnPopOver();
		
	    animationManager.Clear();
	}

	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
		{
            case Constant.Hero.HeroExploreSceneLoaded:
            	var needTeach : boolean = (PlayerPrefs.GetInt(Constant.Hero.HeroExploreOpenedFlag, 0) == 0);
	            ChangeStatus(needTeach ? HeroExploreStatusType.Teach : HeroExploreStatusType.Ready);
	            break;
		    case Constant.Hero.HeroInitExplore:
		        ChangeStatus(HeroExploreStatusType.ShowFirst);
		        break;
            case Constant.Hero.HeroProcessExplore:
                currentExploreItemIndex = (param as KBN.HeroExploreItem).Index;
                ChangeStatus(HeroExploreStatusType.Flag);
                var item : KBN.HeroExploreItem = HeroManager.Instance().GetHeroExploreItem(currentExploreItemIndex);
                MenuMgr.getInstance().PushMessage(String.Format(Datas.getArString("HeroHouse.Explore_GetItem"), item.Name, item.Count.ToString()));
                MyItems.instance().AddItemWithCheckDropGear(item.Type, item.Count);
                break;
            case Constant.Hero.HeroExploreCostGems:
				Payment.instance().SubtractGems(_Global.INT32(param));
                break;
        }
	}

    public function ChangeStatus(status : HeroExploreStatusType) : void
    {
        if (currentStatus.GetStatusType() == status)
        {
            return;
        }

		_Global.LogWarning("HeroExplore status : " + status + "     int : " + _Global.INT32(status));
        var nextStatus : HeroExploreStatus = statusList[status];
        if (nextStatus == null)
        {
            return;
        }

        currentStatus.Leave();
        currentStatus = nextStatus;
        currentStatus.Enter();
    }
	
	private function OnFinishClick(param : Object) : void
	{
		if (KBN.HeroManager.Instance.GetCurrentExploreStrength() > 0)
		{
			MenuMgr.getInstance().PushMenu("HeroExploreEnd", null, "trans_zoomComp");
		}
		else
		{
			MenuMgr.getInstance().PopMenu("HeroExplore");
		}
	}
	
	private function OnHeadClick(param : Object) : void
	{
		if (currentStatus.GetStatusType() != HeroExploreStatusType.Normal)
		{
			return;
		}
		
		(currentStatus as HeroExploreStatusNormal).NextMessage();
	}

	private function OnAutoClick(param : Object) : void
	{
		ChangeStatus(HeroExploreStatusType.Auto);
	}

	private function OnAutoHelpClick(param : Object) : void
	{
		var temprect:Rect = control.autoHelpButton.GetAbsoluteRect();
		if (temprect!=null)
		{
		    var x:float = temprect.x + (temprect.width/2);
			var y:float = temprect.y + (temprect.height/2);
			
			var msg : String = Datas.getArString("Hero.ExploreAutoTips");
			//var msg : String = "Use this button to skip the animation and complete the exploration immediately, but the number of flames is random.";
			MenuMgr.getInstance().PushTips(msg, x,y);
		}
	}

	private function OnBallClick(param : Object) : void
	{
		ChangeStatus(HeroExploreStatusType.Play);
	}
	
	private function OnExploreClick(param : Object) : void
	{
		if (currentStatus.GetStatusType() != HeroExploreStatusType.Normal)
		{
			return;
		}
		
	    currentExploreIndex = _Global.INT32(param);
	    if (heroInfo != null)
	    {
	        if (KBN.HeroManager.Instance.GetCurrentExploreStrength() > 0)
	        {
	            var exploreId : long = KBN.HeroManager.Instance.GetCurrentExploreId();
	            KBN.HeroManager.Instance.RequestProcessHeroExplore(heroInfo.Id, exploreId, 0, 0);
	        }
	        else
	        {
	            MenuMgr.getInstance().PushMenu("HeroExploreBuy", heroInfo, "trans_zoomComp");
	        }
	    }
	    else
	    {
	        ChangeStatus(HeroExploreStatusType.Flag);
	    }
	}
	
	private function OnItemClick(param : Object) : void
	{
		if (currentStatus.GetStatusType() != HeroExploreStatusType.Normal
			&& currentStatus.GetStatusType() != HeroExploreStatusType.Flag)
		{
			return;
		}
		
		var index : int = _Global.INT32(param);
		if (index == currentShowDescriptionIndex)
		{
			Animation.AddAlphaAnimation(control.itemDescription, 0.2f, null, null, control.itemDescription.alpha, 0.0f);
			Animation.AddAlphaAnimation(control.itemLight[index], 0.2f, null, null, control.itemLight[index].alpha, 0.0f);
			currentShowDescriptionIndex = -1;
			return;
		}
		
		var item : KBN.HeroExploreItem = KBN.HeroManager.Instance.GetHeroExploreItem(index);
		control.itemDescription.txt = (item != null ? item.Description : "<NULL>");
		Animation.AddAlphaAnimation(control.itemDescription, 0.2f, null, null, control.itemDescription.alpha, 1.0f);
		Animation.AddAlphaAnimation(control.itemLight[index], 0.2f, null, null, control.itemLight[index].alpha, 1.0f);
		if (currentShowDescriptionIndex >= 0)
		{
			Animation.AddAlphaAnimation(control.itemLight[currentShowDescriptionIndex], 0.2f, null, null, control.itemLight[currentShowDescriptionIndex].alpha, 0.0f);
		}
		currentShowDescriptionIndex = index;
	}

    public function get Animation() : GUIAnimation
    {
        return animationManager;
    }

    public function get HeroInfo() : KBN.HeroInfo
    {
        return heroInfo;
    }

    public function get CurrentExploreIndex() : int
    {
        return currentExploreIndex;
    }

    public function get CurrentExploreItemIndex() : int
    {
        return currentExploreItemIndex;
    }
    
    public function OnBackButton() : boolean
    {
    	switch(currentStatus.GetStatusType())
    	{
	    	case HeroExploreStatusType.Load:
	    	case HeroExploreStatusType.Play:
	    	case HeroExploreStatusType.Timeout:
	    	case HeroExploreStatusType.Wait:
	    	case HeroExploreStatusType.ShowFirst:
	    	case HeroExploreStatusType.ShowNext:
	    	case HeroExploreStatusType.ShowLast:
	    	case HeroExploreStatusType.Flag:
	    		return true;
	    	default:
				OnFinishClick(null);
	    		return true;
    	}
    }
}
