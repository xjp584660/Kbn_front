class MIssionItemObj extends UIObject
{
	//just for submenu
	public var subMenuTitle:Label;
	public var itemIcon:Label;
	public var itemDecoration:Label;
	public var questDescription:Label;
	public var questReward:Label;
	public var lbBackground : Label;
	public var btnBack:Button;
	public var lbBack : Label;
	public var btnGetReward:Button;
	public var rewardItem:QuestRewardItem;
	public var componentObj:ComposedUIObj;

	private var g_rewards:Array;	
	private var questlist:HashObject;
	private var g_curQuestID:int;	
	private var g_isFinished:boolean;

	function Init()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		itemDecoration.setBackground("Quest_Completed", TextureType.DECORATION);
	
		subMenuTitle.Init();
		itemIcon.Init();
		questDescription.Init();
		questReward.Init();

		itemDecoration.Init();
		componentObj.Init();

		lbBackground.Init();

		btnBack.Init();
		btnBack.OnClick = handleBack;

		btnGetReward.Init();
		btnGetReward.OnClick = handleGetReward;
		
		questlist = Datas.instance().questlist();

		lbBackground.mystyle.normal.background = texMgr.LoadTexture("Quest_Page", TextureType.DECORATION);
		lbBack.mystyle.normal.background = texMgr.LoadTexture("button_flip_dark_right_normal", TextureType.BUTTON);
		//lbBack.mystyle.active.background = texMgr.LoadTexture("button_flip_dark_right_down", TextureType.BUTTON);
	}
	
	function Draw()
	{

		GUI.BeginGroup(rect);
		lbBackground.Draw();
		btnBack.Draw();
		lbBack.Draw();

		subMenuTitle.Draw();
		itemIcon.Draw();
		questDescription.Draw();
		questReward.Draw();

		componentObj.Draw();

		if(g_isFinished)
		{
			btnGetReward.Draw();
			itemDecoration.Draw();	
		}

		GUI.EndGroup();
	}

	function handleGetReward():void
	{
		Quests.instance().getReward(g_curQuestID, getRewardSuccess);
	}
	
	private function getRewardSuccess(data:HashObject):void
	{
		//
		SoundMgr.instance().PlayEffect( "quest_complete", /*TextureType.AUDIO*/"Audio/");
		var missionMenu:Mission = MenuMgr.getInstance().getMenu("Mission") as Mission;
		if ( missionMenu != null )
		{
			missionMenu.resetDisplayInfor(this.data.id);
			missionMenu.popSubMenu(false);
		}
	}

	private function handleBack(_data:Object):void
	{
		var missionMenu:Mission = MenuMgr.getInstance().getMenu("Mission") as Mission;
		if ( missionMenu != null )
			missionMenu.popSubMenu(true);
	}

	private function getInfor(curQuestID:int):void
	{
		g_rewards = Quests.instance().rewards(curQuestID);

		componentObj.clearUIObject();
		var b:int = 0;
		for(var a=0; a < g_rewards.length; a++)
		{
			var temp_reward = g_rewards[a] as Quests.DataReward;
			
			if(temp_reward.type == "resource" && temp_reward.id > 4)
			{
				continue;
			}
			
			var tempRewardItem:QuestRewardItem = (GameObject.Instantiate(rewardItem) as QuestRewardItem);
			var temp_raw:int = 140 * (b / 2);
			var row : int = b / 4;
			var col : int = b % 4;

			tempRewardItem.rect.x = 40 + col * tempRewardItem.rect.width;
			tempRewardItem.rect.y = 50 + row * tempRewardItem.rect.height;

			
			b++;
			
			tempRewardItem.setData(temp_reward);
			componentObj.addUIObject(tempRewardItem);
		}
	}
	
	public	function	clear(){
		componentObj.clearUIObject();
	}
	
	private var data:Mission.MissionItem;	

	function setData(_data:Object)
	{
		data = _data as Mission.MissionItem;
		
		g_curQuestID = data.id;
		g_isFinished = data.isFinished;

		getInfor(g_curQuestID);
		
		Quests.instance().SetQuestTexture(itemIcon, g_curQuestID, false);
		
		var isColored:boolean = Quests.instance().isColorLabeledQuest(g_curQuestID.ToString());
		subMenuTitle.txt = Datas.getArString("questObjectives."+"q" + g_curQuestID + (isColored ? "_1" : ""));
		questDescription.txt = Datas.getArString("questDesc."+"q" + g_curQuestID + (isColored ? "_1" : ""));
		questReward.txt = Datas.getArString("QuestsModal."+"QuestRewards") + ":";
		btnGetReward.txt = Datas.getArString("QuestsModal."+"GetReward");
	}
	
	
	public function setBtnBackVisible(_isVisible:boolean):void
	{
		btnBack.SetVisible(_isVisible);
		lbBack.SetVisible(_isVisible);
    }
}
