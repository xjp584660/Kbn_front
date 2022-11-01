class MigrateCondition extends SubMenu implements IEventHandler
{
class ConditionData
    {
    	var type:int;
    	var description:String;
    	var state:boolean;
    	
    };
	public var introLabel:Label;
	public var infoButton:Button;
	public var nextButton:Button;
	public var mframeTop:Label;
	public var mframeTopTitle:Label;
	public var mframeBotom:Label;
	public var mtitle:Label;
	public var line:Label;
	public var line2:Label;
	public var scroll:ScrollList;
	public var conditionItem:MigConditionItem;
	public var smallTitleFlower:Label;
	
	public var notice2Label:Label;
	public var icon:Label;
	public var itemName:Label;
	public var owned:Label;
	public var roleInfo:MigrateRoleInfo;
	private var langData:Array;
	private var conditionsList:Array;
	private var migrateMenu:MigrateMenu;
	private var needItemCount:int;
	private var mightRank:int;
	private var allowLevel:int;
	public var troopLimit:MigrateTroopLimit;

	function Init()
	{
		roleInfo.Init();
		troopLimit.Init();
		nextButton.OnClick = OnNextBtnClick;
		infoButton.OnClick = OnInfo;
		langData = new Array();
		conditionsList=new Array();
		scroll.itemDelegate = this;
		scroll.Init( conditionItem );
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		introLabel.txt=Datas.getArString("Migrate.Condition_Text");
		mframeTopTitle.txt=Datas.getArString("Migrate.Condition_Title");
		mtitle.txt=Datas.getArString("Migrate.Condition_Title");
//		needItem.txt=Datas.getArString("Migrate.Condition_Text2");
		nextButton.txt=Datas.getArString("Migrate.Condition_ButtonNext");
		nextButton.changeToGreyNew();
		icon.useTile = true;
		if(KBN._Global.IsLargeResolution ())
		{
			icon.rect = new Rect(54,683,80,80);									
		}
		else
		{
			icon.rect = new Rect(61,681,89,83);		
		}
	}
	
	public function OnPush(param:Object):void
	{
		var popMenu:PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
		migrateMenu =popMenu.GetPopMenu() as MigrateMenu;
		setConditionInfo(param);
		scroll.ResetPos();
	}
	
	function setConditionInfo(param:Object)
	{
	
		var result : HashObject = param as HashObject;
			if (result["ok"].Value) {

				var conditions:HashObject = result["conditions"];
				var needItem:HashObject = result["needItem"];
				var itemId:int=_Global.INT32(needItem["itemId"]);
				mightRank = _Global.INT32(result["mightRank"]);
				allowLevel = _Global.INT32(result["allowLevel"]);
				needItemCount = _Global.INT32(needItem["needCount"]);
				notice2Label.txt=Datas.getArString("Migrate.Condition_Text2",[mightRank,migrateMenu.getSelectServeId(),needItemCount]);
				
				var ownItemCount:int=_Global.INT32(MyItems.instance().getItemCount(itemId));
				var ownItemCountTxt:String=_Global.NumSimlify(_Global.INT64(MyItems.instance().getItemCount(itemId)), Constant.MightDigitCountInList, false);
				if(needItemCount>ownItemCount){
					owned.txt=String.Format(Datas.getArString("Common.Owned")+":<color=#ff0000>{0}</color>/{1}",ownItemCountTxt,needItemCount);
				}else{
					owned.txt=String.Format(Datas.getArString("Common.Owned")+":{0}/{1}",ownItemCountTxt,needItemCount);
				}
				//itemDesc.i
				itemName.txt=Datas.getArString(String.Format("itemName.i{0}",itemId));
				icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(itemId);
				var keys:Array =  _Global.GetObjectKeys(conditions);
				var curData:HashObject;
				scroll.Clear();
				var flag:boolean=true;
				
				var itemCountCondition:ConditionData=new ConditionData();
				itemCountCondition.type=Constant.MigrateConditionType.ITEM_COUNT;
				itemCountCondition.description=GetDescriptionByType(itemCountCondition.type);
				itemCountCondition.state=needItemCount <= ownItemCount?true:false;
				conditionsList.push(itemCountCondition);
				if(!itemCountCondition.state){
					flag=false;
				}
				
				for(var i:int =0; i<keys.length; i++)
				{
					curData = conditions[ _Global.ap + i ];
					var conditionData:ConditionData=new ConditionData();
					conditionData.type=_Global.INT32(curData["type"]);
					conditionData.description=GetDescriptionByType(conditionData.type);
//					if(conditionData.type==Constant.MigrateConditionType.ITEM_COUNT){
//						var outMarch:int=Attack.instance().GetAllCitiesOutMarchCount();
//						conditionData.state=outMarch<=0?true:false;
//					}else if(conditionData.type==Constant.MigrateConditionType.OUT_MARCH){
//						conditionData.state=needItemCount<=ownItemCount?true:false;
//					}else{
						conditionData.state=_Global.INT32(curData["state"])==1?true:false;
//					}
					
					
					if(!conditionData.state){
						flag=false;
					}
					conditionsList.push(conditionData);
				}
				if(flag) nextButton.changeToBlueNew();
				scroll.SetData(conditionsList);
				scroll.ResetPos();

			} else {
			
			}

		
	}
	
	
	public	function	OnPopOver(){
		super.OnPopOver();
		scroll.Clear();
	}
	
	private function OpenRoleInfo()
	{
		var okFunc:Function = function(result:HashObject)
		{
		    migrateMenu.setNeedItemCount(needItemCount);
			migrateMenu.PushSubMenu(roleInfo, result);
		};
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		
		var popMenu:PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
	    var migrateMenu:MigrateMenu=popMenu.GetPopMenu() as MigrateMenu;
	    var selectServerId:int=migrateMenu.getSelectServeId();

		UnityNet.GetMigrateRoleInfo(selectServerId, okFunc, errorFunc);
	}
	
	private function OnNextBtnClick(param:Object)
	{
    	var okFunc:Function = function(result:HashObject)
		{
		    if(_Global.GetBoolean(result["ok"]))
			{
				var troopLimitData : HashObject = result["data"];
				var keys : Array = _Global.GetObjectKeys(troopLimitData);
				var flag : boolean = false;
				for(var j : int = 0; j < keys.length; j++)
				{
					var total : long = _Global.INT64(troopLimitData[keys[j]]["total"]);
					var limit : long = _Global.INT64(troopLimitData[keys[j]]["limit"]);
					if(total > limit)
					{
						flag = true;
					}
				}
				
				if(flag)
				{
					migrateMenu.setNeedItemCount(needItemCount);
					migrateMenu.PushSubMenu(troopLimit, result);
				}
				else
				{
					OpenRoleInfo();
				}
			}
		};
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		
		UnityNet.GetMigrateTroopLimit(okFunc, errorFunc);
	}
	
	private function OnInfo(param:Object)
	{
		
		MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "migrate", "trans_zoomComp");
//		MenuMgr.getInstance().PopMenu("");
	}
	
	function Update()
	{
	   scroll.Update();
	}
	
	function DrawItem()
	{
		
//		btnBack.Draw();
		introLabel.Draw();
		infoButton.Draw();
		nextButton.Draw();
		mframeTop.Draw();
		mframeTopTitle.Draw();
		smallTitleFlower.Draw();
		mframeBotom.Draw();
		line.Draw();
		notice2Label.Draw();
		icon.Draw();
		itemName.Draw();
		owned.Draw();
		line2.Draw();
		mtitle.Draw();
		scroll.Draw();
	}
	
	function GetDescriptionByType(type:int):String
	{
		var desc:String=""; 
		switch(type){
			case Constant.MigrateConditionType.ITEM_COUNT:
				desc=Datas.getArString("Migrate.Condition_Req1");
			break;
			case Constant.MigrateConditionType.ALIANCE_STATE:
				desc=Datas.getArString("Migrate.Condition_Req2");
			break;
			case Constant.MigrateConditionType.OUT_MARCH:
//				var outMarch:int=Attack.instance().GetAllCitiesOutMarchCount();
				desc=Datas.getArString("Migrate.Condition_Req3");
			break;
			case Constant.MigrateConditionType.OCCUPY_TIELS:
				desc=Datas.getArString("Migrate.Condition_Req4");
			break;
			case Constant.MigrateConditionType.CAN_MIGRATE:
				desc=Datas.getArString("Migrate.Condition_Req5");
			break;
			case Constant.MigrateConditionType.TS_PLANS:
				desc=Datas.getArString("Migrate.Condition_Req6");
			break;
			case Constant.MigrateConditionType.TS_ALLIANCE:
				desc=Datas.getArString("Migrate.Condition_Req7");
			break;
			case Constant.MigrateConditionType.TS_OUTMARCH:
				desc=Datas.getArString("Migrate.Condition_Req8",[allowLevel]);
			break;
			case Constant.MigrateConditionType.TS_OCCUPY:
				desc=Datas.getArString("Migrate.Condition_Req9");
			break;
			case Constant.MigrateConditionType.BOUNT_EMAIL:
				desc=Datas.getArString("Migrate.Condition_Req10");
			break;
			case Constant.MigrateConditionType.CURRENT_WORLDID:
				desc=Datas.getArString("Migrate.Condition_Req11");
			break;
			case Constant.MigrateConditionType.TARGET_WORLDID:
				desc=Datas.getArString("Migrate.Condition_Req12");
			break;
			default:
			break;
		}
		return desc;
	}
	
	function DrawBackground()
	{
		
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
				
	}
}