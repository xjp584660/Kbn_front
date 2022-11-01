#pragma strict
import System.Collections.Generic;
import System;

public class NewCastleDefenseContent extends UIObject
{
	public var bg_mid_label:SimpleLabel;

	public var hideTroops_Title_Label:Label;
	public var hideTroops_Count_label:Label;
	public var hideTroops_Des_label:Label;
	public var hideTroops_rule_btn:Button;
	public var hideTroops_chosse_btn:Button;
	public var hideTroops_dimss_btn:Button;
	public var hideTroops_jidu_xia_label:Label;
	public var hideTroops_jidu_shang_label:Label;
	public var hideTroops_zi_di_label:Label;

	private var data:HashObject;
	private var isHaveTroop:boolean=false;

	private var limit:long;
	private var troops:HashObject;
	private var startTime:long;
	private var endTime:long;
	private var nowCount:long;
	private var limitTime:Object[];
	private var troopCount:Object[];
	private var info:Object;

	@SerializeField
    private var itemToDefend : Item2Defend;
    public function get ItemToDefend() : Item2Defend
    {
        return itemToDefend;
    }
	
	//周期函数 start
	public function Init(){
		hideTroops_Title_Label.txt=Datas.getArString("HideTroops.Text1");

		hideTroops_rule_btn.OnClick=OpenRule;
		hideTroops_chosse_btn.txt=Datas.getArString("HideTroops.Text2");
		hideTroops_chosse_btn.OnClick=OnChoose;
		hideTroops_dimss_btn.txt=Datas.getArString("HideTroops.Text3");
		hideTroops_dimss_btn.OnClick=Dismiss;
		hideTroops_Des_label.txt=Datas.getArString("HideTroops.Text13");
		InitItemToDefend();
	}

	public function SetData(){

		data=GameMain.singleton.GetHideTroopData();
		isHaveTroop=false;
		if (data!=null) {
			var cityId:String=GameMain.instance().getCurCityId().ToString();
			// var now:long=GameMain.unixtime();

			limit=_Global.INT64(data["limit"][cityId]);
			limitTime=_Global.GetObjectKeys(data["hideTroopLimitTime"]);
			troops=data["hideTroopLimitTime"];
			hideTroops_Count_label.txt="0/"+limit;
			var queueBase:HashObject=data["hideUnitQueue"];
			if (queueBase!=null&&queueBase.ToString()!=""&&queueBase[cityId]!=null) {
				isHaveTroop=true;
				var queue:HashObject=data["hideUnitQueue"][cityId];
				startTime=_Global.INT64(queue["startTime"]);
				endTime=_Global.INT64(queue["endTime"]);
				info=queue["data"];
				troopCount=_Global.GetObjectValues(queue["data"]);
				nowCount=GetAllTroops(troopCount);

				hideTroops_Count_label.txt=nowCount+"/"+limit;
				
			}
		}

		SetDataForItemToDefend();
	}

	private function GetAllTroops(h:Object[]):long{
		var count:long=0;
		if (h!=null) {
			for (var i = 0; i < h.length; i++) {
				count+=_Global.INT64(h[i]);
			}
		}
		return count;
	}

	private function Dismiss(){
		if (info!=null) {
			var keys:String[]=_Global.GetObjectKeys(info);
			var values:Object[]=_Global.GetObjectValues(info);
			var troopInfos:Array=new Array();
			var count=keys.Length;
			for (var i = 0; i < keys.length; i++) {
				var key=_Global.INT32(keys[i].Replace("u",""));
				var troopInfo:Barracks.TroopInfo=Barracks.instance().GetTroopInfo(key);
				if (troopInfo!=null) {
					troopInfo.owned=_Global.INT32(values[i]);
					troopInfos.Push(troopInfo);
				}
			}
			 var now=GameMain.unixtime();
			 var hideTroopInfo:Hashtable = {
			 	"size":(nowCount+"/"+limit),
			 	"time":_Global.timeFormatShortStrNotNull(endTime-now,true),
			 	"troopInfos":troopInfos
			 };
     		MenuMgr.getInstance().PushMenu("HideTroopDimissMenu", hideTroopInfo, "trans_zoomComp");
		}
	}

	public function Draw(){
		bg_mid_label.Draw();
		hideTroops_Title_Label.Draw();
		hideTroops_Count_label.Draw();
		hideTroops_Des_label.Draw();
		hideTroops_rule_btn.Draw();
		hideTroops_chosse_btn.Draw();
		hideTroops_jidu_xia_label.Draw();
		hideTroops_jidu_shang_label.Draw();
		hideTroops_zi_di_label.Draw();
		hideTroops_dimss_btn.Draw();
		itemToDefend.Draw();
	}

	public function Update(){
		if (isHaveTroop) {
			var now=GameMain.unixtime();
			hideTroops_jidu_shang_label.SetVisible(true);
			hideTroops_jidu_xia_label.SetVisible(true);
			hideTroops_jidu_shang_label.rect.width=510*(now- startTime)/(endTime- startTime);
			hideTroops_zi_di_label.SetVisible(true);
			if (now>startTime) {
				hideTroops_zi_di_label.txt=Datas.getArString("HideTroops.Text10")+_Global.timeFormatShortStrNotNull(endTime-now,true);
			}else{
				isHaveTroop=false;
				UpdateSeed.instance().update_seed_ajax(true, SetData);
			}
			hideTroops_Des_label.SetVisible(false);

			hideTroops_chosse_btn.SetVisible(false);
			hideTroops_dimss_btn.SetVisible(true);
		}else{
			hideTroops_jidu_shang_label.SetVisible(false);
			hideTroops_jidu_xia_label.SetVisible(false);
			hideTroops_zi_di_label.SetVisible(false);
			hideTroops_Des_label.SetVisible(true);
			
			hideTroops_chosse_btn.SetVisible(true);
			hideTroops_dimss_btn.SetVisible(false);
		}
	}


	public function HandleNotification(type : String, body : Object)
    {
    	switch(type){
    		case "HideTroopInfo":
    			UpdateSeed.instance().update_seed_ajax(true, hidetroopBack);
    			break;
    			// Refresh(body);
			case "DismissTroop":
				OnChoose();
    			break;
    	}
        
    }

    private function hidetroopBack(){
    	SetData();
    	// Dismiss();
    	var dissMenu=MenuMgr.getInstance().getMenu("HideTroopDimissMenu");
    	if (dissMenu!=null) {
    		if (info!=null) {
				var keys:String[]=_Global.GetObjectKeys(info);
				var values:Object[]=_Global.GetObjectValues(info);
				var troopInfos:Array=new Array();
				var count=keys.Length;
				for (var i = 0; i < keys.length; i++) {
					var key=_Global.INT32(keys[i].Replace("u",""));
					var troopInfo:Barracks.TroopInfo=Barracks.instance().GetTroopInfo(key);
					if (troopInfo!=null) {
						troopInfo.owned=_Global.INT32(values[i]);
						troopInfos.Push(troopInfo);
					}
				}
				 var now=GameMain.unixtime();
				 var hideTroopInfo:Hashtable = {
				 	"size":(nowCount+"/"+limit),
				 	"time":_Global.timeFormatShortStrNotNull(endTime-now,true),
				 	"troopInfos":troopInfos
				 };
	     		// MenuMgr.getInstance().PushMenu("HideTroopDimissMenu", hideTroopInfo, "trans_zoomComp");
	     		(dissMenu as HideTroopDimissMenu).OnPush(hideTroopInfo);
			}
    		
    	}
    }

    public function Clear() : void
    {
        
    }
    //周期函数 end

    //自定义方法 start

    public function OpenRule(){

    	// OpenInGameHelp();
    	// return;

		var setting:InGameHelpSetting = new InGameHelpSetting();
        setting.type = "one_context";
        setting.key =Datas.getArString("HideTroops.Text5");// Datas.getArString("Labyrinth.Description");
        setting.name = Datas.getArString("HideTroops.Text4");
        
        MenuMgr.getInstance().PushMenu("InGameHelp", setting,"trans_horiz");

    }

    public function OnChoose(){
    	var data:Hashtable = {
    		"count":limit,
    		"hideTroop":limitTime,
    		"troops":troops
    	};
    	MenuMgr.getInstance().PushMenu("ChooseDefenseTroopsPopMenu", data, "trans_zoomComp");
    	var menu:ChooseDefenseTroopsPopMenu=MenuMgr.getInstance().GetCurMenu() as ChooseDefenseTroopsPopMenu;
    	if (menu!=null) {
    		menu.SetHideTroopNew(limitTime);
    	}
    }

    private function SetDataForItemToDefend()
    {
        var itemId : int = ServerSettingUtils.GetItemToDefendId();
        
        if (itemId > 0)
        {
            itemToDefend.SetVisible(true);
            itemToDefend.SetItemId(itemId);
            itemToDefend.rect.y = hideTroops_dimss_btn.rect.y+108f;
            // itemToDefendHeight = itemToDefend.rect.height;
        }
        else
        {
            itemToDefend.SetVisible(false);
            // itemToDefendHeight = 0;
        }
    }
    
    private function InitItemToDefend()
    {
        itemToDefend.Init();
        itemToDefend.OnHelpButtonDelegate = new Action(OpenInGameHelp);
    }

    private function OpenInGameHelp() : void
    {
        var castleMenu : NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
        if (castleMenu == null)
        {
            return;
        }
        castleMenu.OpenInGameHelp();
    }

    //自定义方法 end

}