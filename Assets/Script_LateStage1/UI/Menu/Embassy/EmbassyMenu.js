
class EmbassyMenu extends ComposedMenu{
	public var clone_content : StandardBuildingContent;
	private var content : StandardBuildingContent;
 	public var buildingInfo : Building.BuildingInfo;

 	public var troopList:ScrollList;
 	public var troopItem:ListItem;
 	public var troopData:Array;
 	
 	public var	allianceStatusLabel:Label;
 	public var 	viewAllianceBtn:Button;
 	
 	public  var seperateLine:Label;
 	
 	public	function	Init(){
 		super.Init();
 		//menuHead.Init();
 		troopList.Init(troopItem);
 		content = Instantiate(clone_content);
		tabArray = [content, troopList]; 
		
		viewAllianceBtn.OnClick = function(){
		
			MenuMgr.getInstance().PopMenu("");
			MenuMgr.getInstance().PushMenu("AllianceMenu",-1);
		
		};
		
 		content.rotation = this.rotation;
		content.Init();
 	}
 	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		
//		var arStrings:Object = Datas.instance().arStrings();
		troopData = Embassy.instance().encampedAllies();
		if( troopData == null ){ // not in alliance
			allianceStatusLabel.SetVisible( true );
			allianceStatusLabel.txt = Datas.getArString("Embassy.NotInAlliance");
		
			seperateLine.SetVisible(false);	
			
			viewAllianceBtn.SetDisabled( false );
			viewAllianceBtn.SetVisible( true );
			viewAllianceBtn.txt = Datas.getArString("Embassy.ViewAlliance");
		}else{
			viewAllianceBtn.SetDisabled( true );
			viewAllianceBtn.SetVisible( false );
			
			if( troopData.length == 0 ){
				seperateLine.SetVisible(false);	
				
				allianceStatusLabel.SetVisible( true );
				allianceStatusLabel.txt = Datas.getArString("Embassy.NoAlliesCamp");
			}else{
				seperateLine.SetVisible(true);		
				allianceStatusLabel.SetVisible( false );
				troopList.SetData(troopData);
				troopList.ResetPos();
			}
		}

		this.buildingInfo = param as Building.BuildingInfo;//	as BuildingInfo;		
		content.UpdateData(param);	
		
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel);	
		menuHead.setTitle(buildingInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
		var detail:String = Datas.getArString("Common.Details");
		var EncampedAllies:String = Datas.getArString("Embassy.EncampedAllies");
		
		titleTab.toolbarStrings = [detail, EncampedAllies];

		SoundMgr.instance().PlayOpenBuildMenu(this.buildingInfo.typeId);
	}
	
	public	function	OnPopOver()
	{
		troopList.Clear();
		content.Clear();
		TryDestroy(content);
		content = null;
		super.OnPopOver();
	}


	public function UpdateData(param:Object)
	{
		this.buildingInfo = param ;//	as BuildingInfo;	
		
		content.UpdateData(param);
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel);	
		menuHead.setTitle(buildingInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
	}
	
	/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				content.setWaitingFlagTrue();
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
		}
	}
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(!buildingInfo || !qItem )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildingInfo.slotId)
		{
			this.close();
		}
		else
		{	
			UpdateData(Building.instance().buildingInfo(buildingInfo.slotId,buildingInfo.typeId) );			
		}
	}
	//end  notification 
	
	public function Update()
	{
		menuHead.Update();
		if(selectedTab == 1)
		{
			troopList.Update();
		}
		else if(selectedTab == 0)
		{
			content.Update();
		}
	}
	
	function DrawItem()
	{ 
		if( selectedTab == 0 ){
			tabArray[selectedTab].Draw();
		}else if( troopData == null ){
			allianceStatusLabel.Draw();
			viewAllianceBtn.Draw();
		}else if( troopData.length == 0 ){
			allianceStatusLabel.Draw();		
		}else{
			seperateLine.Draw();
			troopList.Draw();
		}
		
	}
}
