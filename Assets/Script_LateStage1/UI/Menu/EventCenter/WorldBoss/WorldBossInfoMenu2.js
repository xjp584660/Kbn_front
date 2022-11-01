

public class WorldBossInfoMenu2 extends PopMenu
{
	public var worldBossInfo:WorldBossInfoMenu;
	public var item:WorldBossDropItem;
	public var scroll:ScrollList; 

	public var gds_worldboss:KBN.DataTable.WorldBoss;

	public function Init(){
		super.Init();
		bgMiddleBodyPic=null;
		worldBossInfo.Init();
		scroll.Init(item);
		// bgMiddleBodyPic.SetVisible(false);
	}

	public function OnPush(param:Object){
		worldBossInfo.OnShow(param);
		var data:PBMsgWorldBossSocket.PBMsgWorldBossSocket=param as PBMsgWorldBossSocket.PBMsgWorldBossSocket;
		gds_worldboss=GameMain.GdsManager.GetGds.<KBN.GDS_WorldBoss>().GetItemById(data.bossTypeId);
		var showRewards:String[]=_Global.GetStringListByString(gds_worldboss.show_reward);
		scroll.SetData(showRewards);
	}

	public function OnPopOver(){
		// worldBossInfo.close();
		worldBossInfo.OnPopOver();
		scroll.Clear();
	}

	public function DrawItem(){
		worldBossInfo.Draw();
		// worldBossInfo.scroll.Draw();
		scroll.Draw();
	}

	public function Update(){
		// worldBossInfo.UpdateItems();
		scroll.Update();

	}
}