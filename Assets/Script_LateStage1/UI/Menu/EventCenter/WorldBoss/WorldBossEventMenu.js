
import System.Collections;
import System.Collections.Generic;
import System;

class WorldBossEventMenu extends KBNMenu
{

	@SerializeField private var eventAllReward:EventAllRewardPage;
	protected var nc:NavigatorController;
	public var clone_menuHead:MenuHead;
	public var menuHead:MenuHead;
	public var detail:WorldBossEventDetail;	

	private var m_detailInfo:HashObject;

	function Init(){
		super.Init();

		detail.Init();
		nc = new NavigatorController();
		
		eventAllReward.Init(nc);
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		menuHead.setTitle(Datas.getArString("WorldBoss.Event_Title"));
		menuHead.leftHandler = menuLeft;
		detail.openReWardViewBtn.OnClick=openReWardView;
		frameTop.rect.y=130;
		nc.push(detail);
		
	}

	function OnPush(param:Object){
		super.OnPush(param);
		if (param!=null) {
			m_detailInfo=param as HashObject;
		}

		menuHead.rect.height = Constant.UIRect.MENUHEAD_H1;
		menuHead.backTile.rect.height = 130;
		// var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");

		detail.Init(m_detailInfo,EventCenter.getInstance().getCurBossEventCurPageList());
		MenuMgr.instance.forceFinishSceneMessage();
	}

	function openReWardView(){
		var groupRewardsHo : HashObject = null;
		if (null != m_detailInfo["rankReward"])
    	{
    		groupRewardsHo = EventCenterUtils.GetGroupRewardsFromRewardConfig(m_detailInfo["rankReward"]);
    	}
    	else
    	{
	        var groupInfoHo : HashObject = EventCenterUtils.GetUserGroupInfoFromEvent(m_detailInfo);
	        groupRewardsHo = EventCenterUtils.GetGroupRewardsFromGroupInfo(groupInfoHo);
        } 

        var scoreRewardsHo : HashObject = null;
        if (null != m_detailInfo["scoreReward"])
    	{
    		scoreRewardsHo = EventCenterUtils.GetGroupRewardsFromScoreRewards(m_detailInfo["scoreReward"]);
    	}
    	else
    	{
	        var scoreInfoHo : HashObject = EventCenterUtils.GetUserGroupInfoFromEvent(m_detailInfo);
	        scoreRewardsHo = EventCenterUtils.GetGroupRewardsFromGroupInfo(scoreInfoHo);
        }   

        // MenuMgr.getInstance().PushMenu("WorldBossRewardMenu", groupRewardsHo,"trans_zoomComp");

        eventAllReward.MenuHead = menuHead;   
        eventAllReward.ResetAndShowAll(groupRewardsHo,scoreRewardsHo,EventCenterUtils.RankType.ScoreType);        
        // frameTop.rect.y=67;
        nc.push(eventAllReward);
	}

	protected function menuLeft():void
	{
        if (nc.uiNumbers <= 1) {
    		KBN.MenuMgr.instance.PopMenu("");				
        }else{
        	frameTop.rect.y=130;
        	nc.pop();
        }
		
	}
	public override function DrawBackground()
	{
		menuHead.Draw();
		DrawMiddleBg();
	}

	function DrawItem() 
	{
		frameTop.Draw();
		nc.DrawItems();
	}		
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	public function Update()
	{
		menuHead.Update();
		nc.u_Update();
	}

	public function	OnPopOver()
	{
		menuHead = null;
		TryDestroy(menuHead);	
		detail.OnPopOver();
	}
}