#pragma strict

public class EventAllRewardPage extends ComposedUIObj {
    
    @SerializeField private var scrollView : ScrollView;
    @SerializeField private var regionTemplate : EventAllRewardRegion;
    @SerializeField private var intervalSize : int;
    @SerializeField private var dataOffset : float = 51f;
     
	public var toolBarTypes:ToolBar;
	private var indexToType : List.<String>;
    private var typeToTitleKey : Dictionary.<String, String>;
    
    private var regions : List.<EventAllRewardRegion>;
    
    private var nc : NavigatorController;
    private var groupRewards : EventCenterGroupRewards;
    private var scoreRewards : EventCenterGroupRewards;

    private var cachedMenuHeadTitle : String = "";
    private var menuHead : MenuHead;
    public function set MenuHead(value : MenuHead) {
        menuHead = value;
    }
    
    public function Init(nc : NavigatorController) {
        this.nc = nc;
        //component = [scrollView];
        Clear();
        
        toolBarTypes.Init();
        toolBarTypes.indexChangedFunc = toolBarTypes_SelectedIndex_Changed;
		toolBarTypes.selectedIndex = 0;
		InitTypeToTitleKeyDict();
		InitTypeToolBar();
    }
    
	public function toolBarTypes_SelectedIndex_Changed(index : int):void
	{
		toolBarTypes.selectedIndex = index;		
	
		if(index == 0)
		{	
			SetScrollView(scoreRewards, EventCenterUtils.RankType.ScoreType); 
		}
		else if(index == 1)
		{		
			SetScrollView(groupRewards, EventCenterUtils.RankType.RankingType);
		}
	}
    
    private function InitTypeToTitleKeyDict() : void
    {
        typeToTitleKey = new Dictionary.<String, String>();
        typeToTitleKey.Add(EventCenterUtils.RankType.ScoreType, Datas.getArString("Tournament.ScoreReward"));
        typeToTitleKey.Add(EventCenterUtils.RankType.RankingType, Datas.getArString("Tournament.RankingReward"));
        
        indexToType = new List.<String>();
        indexToType.Add(EventCenterUtils.RankType.ScoreType);
		indexToType.Add(EventCenterUtils.RankType.RankingType);
    }
    
    private function InitTypeToolBar() : void
    {
        var typeToolBarStrings : List.<String> = new List.<String>();
        for (var i : int = 0; i < indexToType.Count; ++i)
        {
            var type : String = indexToType[i];
            var title : String = Datas.getArString(typeToTitleKey[type]);
            typeToolBarStrings.Add(title);
        }
        toolBarTypes.toolbarStrings = typeToolBarStrings.ToArray();
    }
    
    public function ResetAndShowRanking(groupRewardsHo : HashObject)
    {           
       	if(KBN._Global.IsLargeResolution ())
		{
			scrollView.rect = new Rect(0,130,640,835);								
		}
		else
		{
			 scrollView.rect = new Rect(0,103,640,835);		
		}
       
	 	toolBarTypes.SetVisible(false); 
        var menu : KBNMenu = KBN.MenuMgr.instance.getMenu("EventCenterMenu");
        if(menu != null)
        {
       		menu.bgStartY = 68;
        }	

    	groupRewards = EventCenterGroupRewards.CreateFromHashObject(groupRewardsHo);     
		SetScrollView(groupRewards, EventCenterUtils.RankType.RankingType);   		
    }
    
    public function ResetAndShowAll(groupRewardsHo : HashObject ,scoreRewardsHo : HashObject, prizeType : String) {
           
       var menu : KBNMenu = KBN.MenuMgr.instance.getMenu("EventCenterMenu");
       if(menu != null)
       {
       		menu.frameTop.rect = Rect( 0, 128, menu.frameTop.rect.width, menu.frameTop.rect.height);
       		menu.bgStartY = 125;
       }
       
       	if(KBN._Global.IsLargeResolution ())
		{
			scrollView.rect = new Rect(0,200,640,835);								
		}
		else
		{
			scrollView.rect = new Rect(0,150,640,835);		
		}
       
       toolBarTypes.SetVisible(true); 
       
    	scoreRewards = EventCenterGroupRewards.CreateFromHashObject(scoreRewardsHo);
    	groupRewards = EventCenterGroupRewards.CreateFromHashObject(groupRewardsHo);     
               
        if(prizeType == EventCenterUtils.RankType.ScoreType)
        {
        	toolBarTypes_SelectedIndex_Changed(0);
        }
        else
        {
        	toolBarTypes_SelectedIndex_Changed(1);       	   
        }
    }
    
    private function SetScrollView(rewardsTemp : EventCenterGroupRewards, prizeType : String)
    {
        Clear();

		regions = new List.<EventAllRewardRegion>();
		scrollView.Init();
		scrollView.IntervalSize = intervalSize;
		
		var offsetScale : float = 0f;
		if(KBN._Global.isIphoneX())
		{
			offsetScale = 12f;
		}
		else
		{
			var mScaleY : float = scrollView.GetScrollViewScale().y;
			offsetScale = dataOffset * (1 - mScaleY);	
		}
		
		if(prizeType == EventCenterUtils.RankType.RankingType)
		{
			for (var i : int = 0; i < rewardsTemp.Count; ++i) {
				var region : EventAllRewardRegion = Instantiate(regionTemplate);
				regions.Add(region);
				region.Init(rewardsTemp[i], i, prizeType);
				
				scrollView.addUIObject(region);
				scrollView.SetItemAutoScale(region);
				
				var curDataCount : int = (rewardsTemp[i].Count + 1 ) / 2;
				if(i + 1 <= rewardsTemp.Count - 1)
				{
					var nextDataCount = (rewardsTemp[i + 1].Count + 1) / 2;
					if(nextDataCount >= curDataCount)
					{
						region.rect.height -= (nextDataCount - curDataCount) * offsetScale;
					}
					else
					{
						region.rect.height += (curDataCount - nextDataCount) * offsetScale;
					}
				}			
			}
		}
		else
		{
			var index : int = 0;
			for (var j : int = rewardsTemp.Count - 1; j >= 0; --j) {
				var region1 : EventAllRewardRegion = Instantiate(regionTemplate);
				regions.Add(region1);
				region1.Init(rewardsTemp[j], index, prizeType);
				
				scrollView.addUIObject(region1);
				scrollView.SetItemAutoScale(region1);
				
				var curDataCount1 : int = (rewardsTemp[j].Count + 1 ) / 2;
				if(j - 1 >= 0)
				{
					var nextDataCount1 = (rewardsTemp[j - 1].Count + 1) / 2;
					if(nextDataCount1 >= curDataCount1)
					{
						region1.rect.height -= (nextDataCount1 - curDataCount1) * offsetScale;
					}
					else
					{
						region1.rect.height += (curDataCount1 - nextDataCount1) * offsetScale;
					}
				}
								
				index++;
			}
		}

		scrollView.AutoLayout();
		scrollView.MoveToTop();

        nc.pushedFunc = OnPushed;
        nc.popedFunc = OnPopped;
    }
    
    private function OnPushed() {
        cachedMenuHeadTitle = menuHead.getTitle();
        menuHead.setTitle(Datas.getArString("Tournament.Rewardpagetitle"));
    }

    private function OnPopped() {
        Clear();
        menuHead.setTitle(cachedMenuHeadTitle);
        nc.pushedFunc = null;
        nc.popedFunc = null;
                        
       var menu : KBNMenu = KBN.MenuMgr.instance.getMenu("EventCenterMenu");
       if(menu != null)
       {
       		menu.frameTop.rect = Rect( 0, EventCenterUtils.EventCenterMenuRankFrameTopY, menu.frameTop.rect.width, menu.frameTop.rect.height);
       		menu.bgStartY = 68;
       }
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