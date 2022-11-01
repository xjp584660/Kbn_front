

public class WorldBossRankRewardItem extends ListItem
{
	public var rank:Label;
	public var bg:Label;
	public var titleBg:Label;
	public var itemList:UIList;
	public var item:WorldBossRewardItem;

	public function Init(){
		super.Init();
		// scroll=new UIList();
		itemList.Init();
	}

	public function SetRowData(param:Object){
		var data:HashObject=param as HashObject;
		var rewardList=_Global.GetObjectValues(data["list"]);

		for (var i = 0; i < rewardList.length; i++) {
			var rewardItem=GameObject.Instantiate(item) as WorldBossRewardItem;
			rewardItem.Init();
			rewardItem.SetRowData(rewardList[i] as HashObject);
			itemList.AddItem(rewardItem);
		}
		bg.rect.height = itemList.rect.yMax;
		rect.height=bg.rect.height+10;

		var from:int=_Global.INT32(data["from"]);
		var to:int=_Global.INT32(data["to"]);
		if (from==to) {
			rank.txt=Datas.getArString("Alliance.InviteRank")+from;
		}else{
			rank.txt=Datas.getArString("Alliance.InviteRank")+from+"-"+to;
		}
	}

	public function DrawItem(){
		bg.Draw();
		rank.Draw();
		titleBg.Draw();
		
		itemList.Draw();
	}

	public function OnPopOver(){
		itemList.Clear(true);
	}

	public function OnClear(){
		itemList.Clear(true);
	}

}