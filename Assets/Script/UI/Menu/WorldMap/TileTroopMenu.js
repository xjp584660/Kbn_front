
class	TileTroopMenu extends	PopMenu implements IEventHandler
{
	public	var	separateLine1:Label;
	public	var	separateLine2:Label;
	
	public 	var troops:ComposedUIObj;
	public	var	troopEmpty:Label;
	
	public	var	list:ScrollList;
	public	var	listItem:ListItem;
	public	var	marchInfo:RallyMarchInfo;
	public	var	carmotTroopInfo:CarmotTileTroopInfo;
	
	private var nc:NavigatorController = new NavigatorController();
	
	protected var tileTroopMenuParam : TileInfoPopUp.TileTroopMenuParam;
	
	public var bgMenu : BGMenu;
	
	
	public	function Init(){
	
		super.Init();
		bgMenu.Init();
		bgMenu.m_color = new Color(1, 1, 1, 0.8);
		
		troops.component = [list, troopEmpty];
		
//		var	arStrings:Object = Datas.instance().arStrings();
		troopEmpty.txt = Datas.getArString("March.NO_MoveMent");
		
 		list.Init(listItem);
 		list.itemDelegate = this;
 		
 		nc.Init();
 		nc.soundOn = false;
 		nc.popedFunc = popedFunc;
 		nc.pushedFunc = priv_onPushed;
 		nc.push(troops);
 		marchInfo.Init(nc);
 		carmotTroopInfo.Init();
 		
		
 	}
 	
 	public function OnPush(param:Object){
 		checkIphoneXAdapter();
 		tileTroopMenuParam = param as TileInfoPopUp.TileTroopMenuParam;
 		if(tileTroopMenuParam.isCarmot){
 			nc.clear();
 			title.txt = tileTroopMenuParam.title;
 			carmotTroopInfo.SetVisible(true);
 			carmotTroopInfo.SetData(tileTroopMenuParam.coordX,tileTroopMenuParam.coordY);
 			troops.SetVisible(false);
 		}else{
 			carmotTroopInfo.SetVisible(false);
	 		title.txt = tileTroopMenuParam.title;
	 		if( tileTroopMenuParam.troopList && tileTroopMenuParam.troopList.length > 0 ){
	 			list.SetData(tileTroopMenuParam.troopList);
	 			list.SetVisible(true);
	 			troopEmpty.SetVisible(false);
	 		}else{
	 			list.SetVisible(false);
	 			troopEmpty.SetVisible(true);
	 		}
//	 		nc.pop2Root();
//	 		nc.switchRootUI(troops);
 		}
 		
 		
 	}
 	
 	
 	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
 	public function Update(){
 		nc.u_Update();
 		if(tileTroopMenuParam.isCarmot)
 				carmotTroopInfo.Update();
 	}
 	
	public function Draw()
	{
		bgMenu.Draw();
		super.Draw();
	}
	
	
	
	public function DrawItem()
	{
		if(tileTroopMenuParam.isCarmot){			
 			carmotTroopInfo.Draw();
 		}
		separateLine1.Draw();
		nc.DrawItems();
		separateLine2.Draw();
	}
	
	public	function	handleItemAction(action:String, param:Object):void{
		nc.push(marchInfo);
		marchInfo.showMarchInfo(param);
	}
	
	
	protected function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		var wildTroop:Attack.TileTroopInfo = marchInfo.getTileTroopInfo();
		
		if(wildTroop && wildTroop.c_willBeRemoved)
		{
			var tlist:Array = tileTroopMenuParam.troopList;
			for(var i:int = 0; i<tlist.length; i++)
			{
				if(tlist[i] == wildTroop)
				{
					tlist.RemoveAt(i);
					list.ResetPos();
					list.SetData(tileTroopMenuParam.troopList);
					break;
				}
			}
			
			if( tileTroopMenuParam.troopList.length > 0 ){
	 			list.SetVisible(true);
	 			troopEmpty.SetVisible(false);
	 		}else{
	 			list.SetVisible(false);
	 			troopEmpty.SetVisible(true);
	 		}
			
		}
		
	}
	
	public function OnPopOver()
	{
		if(tileTroopMenuParam.isCarmot){
 			carmotTroopInfo.onClose();
 		}
 		nc.clear();
		list.Clear();
		marchInfo.Clear();
		carmotTroopInfo.Clear();
	}

	private function priv_onPushed(navCtrl : NavigatorController, uiObj : UIObject)
	{
		var rm : RallyMarchInfo = navCtrl.topUI as RallyMarchInfo;
		if ( rm == null )
			return;
		rm.didShowed();
	}
}
