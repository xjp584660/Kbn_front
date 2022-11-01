class EventAwardMenu extends KBNMenu
{
	public var labelFrame:Label;
	public var bg_Flower:Label;
	public var bg_Line:Label;
	public var bg_Title:Label;
	public var titleText:Label;
	public var lCongrats:Label;
	public var mask:SimpleLabel;
	public var btn_OK:Button;
	private var bgTitlePos:Rect;
	@SerializeField private var scrollView : ScrollView;
    @SerializeField private var regionTemplate : EventAllRewardRegion;
    
    private var regions : List.<EventAllRewardRegion>;
	
	//public var rewardItem:QuestRewardItem;
	//public var componentObj:ComposedUIObj;
	public function Init()
	{
		repeatTimes = 6;
		bgStartY = 165;
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		bgMiddleBodyPic.rect.width = rect.width - 30;

		if(mask.mystyle.normal.background == null)
		{
			mask.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black",TextureType.BACKGROUND);
		}
		
		titleText.txt = Datas.getArString("EventCenter.PrizesPage");
		lCongrats.txt = Datas.getArString("EventCenter.PrizesPageDesc");
		btn_OK.OnClick = CloseMenu;
	}
	
	public function DrawItem()
	{
		labelFrame.Draw();
		bg_Flower.Draw();
		bg_Line.Draw();
		btn_OK.Draw();
		bg_Title.Draw();
		titleText.Draw();
		lCongrats.Draw();
		scrollView.Draw();
	}
	
	function OnPush(param:Object)
	{
		var data : EventCenterAwardInfo = param as EventCenterAwardInfo;
		
		Clear();
		regions = new List.<EventAllRewardRegion>();
		scrollView.Init();
		if(data.rankRewardList.Count > 0)
		{
			var region : EventAllRewardRegion = Instantiate(regionTemplate);
			regions.Add(region);
			region.InitAward(data.rankRewardList, Datas.getArString("Tournament.RankingReward"));

			scrollView.SetItemAutoScale(region);
			scrollView.addUIObject(region);
		}
	
		if(data.scoreRewardList.Count > 0)
		{
			var region1 : EventAllRewardRegion = Instantiate(regionTemplate);
			regions.Add(region1);
			region1.InitAward(data.scoreRewardList,Datas.getArString("Tournament.ScoreReward"));

			scrollView.SetItemAutoScale(region1);
			scrollView.addUIObject(region1);
		}
			
		scrollView.AutoLayout();
		scrollView.MoveToTop();
	}
	
	public	function	OnPopOver()
	{
		Clear();
		//prizeList.Clear();
	}	
	
	public function Update()
	{
		scrollView.Update();
	}
	
	function DrawMask()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.5);	
		mask.Draw();
		GUI.color = oldColor;
	}
	
	protected function DrawBackground()
	{	
		if(Event.current.type != EventType.Repaint)
			return;
		DrawMiddleBg(570,36);
	}
	
	public function CloseMenu():void
	{
		MenuMgr.getInstance().PopMenu("");
		var info:HashObject = EventCenter.getInstance().getCurEventDetailInfo();
		if(info == null) return;
		var popUp:int = 0;
		if(info["ranking"] != null)
			if(info["ranking"]["rater"] != null)
				if(info["ranking"]["rater"]["popUp"] != null)
					popUp = _Global.INT32(info["ranking"]["rater"]["popUp"]);
		if(popUp == 1)
			GameMain.instance().CheckAndOpenRaterAlert("eventcenter");
		
	}
	
    private function Clear() {
    	if (regions == null) {
    		return;
    	}
    	for (var region : EventAllRewardRegion in regions) {
    		if (region == null) {
    			continue;
    		}
    		UnityEngine.Object.Destroy(region.gameObject);
    	}
    	regions.Clear();
    }
}