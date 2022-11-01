using UnityEngine;
using System.Collections;
using KBN;

public class AvaTileTroopMenu : PopMenu, IEventHandler
{
	public	Label separateLine1;
	public	Label separateLine2;
	
	public 	ComposedUIObj troops;
	public	Label troopEmpty;
	
	public	ScrollList list;
	public	ListItem listItem;
	public	AvaRallyMarchInfo marchInfo;
	
	private NavigatorController nc = new NavigatorController();
	
	public BGMenu bgMenu;
	
	
	public override void Init(){
		
		base.Init();
		//bgMenu.Init();
		//bgMenu.SetColor(new Color(1f, 1f, 1f, 0.8f));
		
		troops.component = new UIObject[]{list, troopEmpty};

		troopEmpty.txt = Datas.getArString("March.NO_MoveMent");
		
		list.Init(listItem);
		list.itemDelegate = this;
		
		nc.Init();
		nc.soundOn = false;
		nc.popedFunc = popedFunc;
		nc.pushedFunc = priv_onPushed;
		nc.push(troops);
		marchInfo.Init(nc);

	}
	
	public override void OnPush(object param)
	{
		int tileID = _Global.INT32(param);
		nc.pop2Root();
		nc.switchRootUI(troops);
		GameMain.Ava.March.RequestTileInfo (tileID);
		troops.rect.x = 0;
	}
	
	public override void FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	public override void Update(){
		nc.u_Update();
	}
	
	public override int Draw()
	{
		//bgMenu.Draw();
		base.Draw();
		return -1;
	}
	
	protected override void DrawItem()
	{
		separateLine1.Draw();
		nc.DrawItems();
		separateLine2.Draw();
	}
	
	public void handleItemAction(string action, object param){
		nc.push(marchInfo);
		marchInfo.showMarchInfo(param);
	}
	
	protected void popedFunc(NavigatorController nc, UIObject prevObj)
	{
	}
	
	public override void OnPopOver()
	{
		list.Clear();
		marchInfo.Clear();
	}
	
	private void priv_onPushed(NavigatorController navCtrl, UIObject uiObj)
	{
	}

	public override void handleNotification(string type, object param)
	{
		switch(type)
		{
		case Constant.Notice.AvaTileTroopsOk:
			if( GameMain.Ava.March.TileTroopInfo!=null && GameMain.Ava.March.TileTroopInfo.marchList.Count > 0 ){
				list.SetVisible(true);
				list.Clear ();
				list.SetData(GameMain.Ava.March.TileTroopInfo.marchList.ToArray());
				list.ResetPos();
				troopEmpty.SetVisible(false);
				title.txt = GameMain.Ava.March.TileTroopInfo.playerName+"("+GameMain.Ava.March.TileTroopInfo.xCoord+","+GameMain.Ava.March.TileTroopInfo.yCoord+")";
			}else{
				list.SetVisible(false);
				troopEmpty.SetVisible(true);
				title.txt = GameMain.Ava.March.TileTroopInfo.playerName+"("+GameMain.Ava.March.TileTroopInfo.xCoord+","+GameMain.Ava.March.TileTroopInfo.yCoord+")";
			}
			break;
		}
	}
}
