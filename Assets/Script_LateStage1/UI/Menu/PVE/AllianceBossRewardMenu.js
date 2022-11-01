class AllianceBossRewardMenu extends PopMenu
{	@SerializeField private var menuTitle :SimpleLabel;
	@SerializeField private var flowerFram :SimpleLabel;
	@SerializeField private var tipsDesc :SimpleLabel;
	@SerializeField private var line :SimpleLabel;
	@SerializeField private var listbar:ToolBar;
	@SerializeField private var rewardList:ScrollList;
	@SerializeField private var rewardItem:ListItem;
	private var allianceData:Array;
	private var playerData:Array;
	public function Init()
	{
		super.Init();
		btnClose.OnClick = handleBack;
		if(flowerFram.mystyle.normal.background == null)
		{
			flowerFram.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang",TextureType.DECORATION);
		}
		if(menuTitle.mystyle.normal.background == null)
		{
			menuTitle.mystyle.normal.background = TextureMgr.instance().LoadTexture("Decorative_strips2",TextureType.DECORATION);
		}
		menuTitle.txt = Datas.getArString("PVP.Event_Leaderboard_SubTitle4");
		tipsDesc.txt = Datas.getArString("PVE.RewardDesc");
		if(line.mystyle.normal.background == null)
		{
			line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line",TextureType.DECORATION);
		}
		listbar.Init();
		listbar.toolbarStrings = [Datas.getArString("PVP.Details_AllianceReward"),Datas.getArString("Event.IndividualRewards")];
		listbar.indexChangedFunc = SelectTab;
		listbar.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_normal", TextureType.BUTTON);
		listbar.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_down", TextureType.BUTTON);
		listbar.SetNormalTxtColor(FontColor.New_PageTab_Yellow);
		listbar.SetOnNormalTxtColor(FontColor.New_PageTab_Yellow);
		rewardList.Init(rewardItem);
	}
	
	public function DrawItem()
	{
		flowerFram.Draw();
		menuTitle.Draw();
		tipsDesc.Draw();
		line.Draw();
		listbar.Draw();
		rewardList.Draw();
	}
	
	function Update() 
	{
		rewardList.Update();
	}
	
	public function OnPush(param:Object)
	{
		var hashData:Hashtable = param as Hashtable;
		var allianceDictionary:System.Collections.Generic.Dictionary.<int, Hashtable> = hashData["alliance"] as System.Collections.Generic.Dictionary.<int, Hashtable>;
		var playerDictionary:System.Collections.Generic.Dictionary.<int, Hashtable> = hashData["player"] as System.Collections.Generic.Dictionary.<int, Hashtable>;
		allianceData = new Array(allianceDictionary.Values);
		playerData = new Array(playerDictionary.Values);
		SelectTab(0);
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		rewardList.Clear();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("AllianceBossRewardMenu");
	}
	
	private function SelectTab(index:int)
	{
		if(index == 0)
		{
			rewardList.Clear();
			rewardList.SetData(allianceData);
			rewardList.UpdateData();
			rewardList.ResetPos();
		}
		else if(index == 1)
		{
			rewardList.Clear();
			rewardList.SetData(playerData);
			rewardList.UpdateData();
			rewardList.ResetPos();
		}
	}
}