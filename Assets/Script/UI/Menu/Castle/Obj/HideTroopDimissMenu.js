
// import KBN;

public class HideTroopDimissMenu extends PopMenu{


	public var size_label:Label;
	public var time_label:Label;

	public var bg:Label;

	public var scroll:ScrollList;
	public var prefab:RallyTroopItem;

	public var recall_btn:Button;
	public var Rearrange_btn:Button;

	public function Init(){
		super.Init();
		scroll.Init(prefab);
		recall_btn.txt=Datas.getArString("HideTroops.Text11");
		recall_btn.OnClick=recall;
		Rearrange_btn.txt=Datas.getArString("HideTroops.Text12");
		Rearrange_btn.OnClick=Rearrange;
		title.txt=Datas.getArString("HideTroops.Text4");
	}

	private function recall(){
		var okFun:Function=function(result : HashObject){
			if (result["ok"]) {
				MenuMgr.getInstance().sendNotification("HideTroopInfo",null);
			}
			MenuMgr.getInstance().PopMenu("");
		};
		UnityNet.dismissCityHideTroop(okFun,null);
	}

	private function Rearrange(){
		MenuMgr.getInstance().sendNotification("DismissTroop",null);
	}

	public function OnPush(param:Object){
		var data:Hashtable=param as Hashtable;
		size_label.txt=Datas.getArString("HideTroops.Text9")+data["size"];
		time_label.txt=Datas.getArString("HideTroops.Text10")+data["time"];

		var troopInfos:Array=data["troopInfos"];

		scroll.SetData(troopInfos);

	}

	public function Update(){
		scroll.Update();
	}

	public function DrawItem(){
		size_label.Draw();
		time_label.Draw();
		bg.Draw();
		scroll.Draw();
		recall_btn.Draw();
		Rearrange_btn.Draw();
	}

	public function OnPopOver()
	{
		super.OnPopOver();
		scroll.Clear();
	}

	public function handleNotification(type:String, body:Object):void
	{
		// switch(type)
		// {
		// 	case "Monster_buyItem":
		// 		myItems.txt=Datas.getArString("Labyrinth.Exchang_Text2")+KBN.Payment.singleton.DisplayGems.ToString();
		// 		break;
		// }
	}
}