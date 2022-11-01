public class RallyMarchInfo extends ComposedUIObj
{
	public var btn_back :Button;
	public var l_title 	:Label;
	public var l_img 	:Label;
	
	public var l_bg1 :Label;	
	
	public var l_name 		:Label;
	public var l_type		:Label;
	public var l_status		:Label;
	public var l_tileType	:Label;
	public var l_owner		:Label;
	public var l_surving	:Label;
	public var l_time		:Label;
	
	public var scroll_troop:ScrollList;
	public var ins_troopItem :ListItem;
	
//	public var scroll_resoruce :ScrollList;
//	public var ins_resourceItem :ListItem;
//	public var line_texture:Texture2D;
	public	var	seperateLine:Label;
	
	public var btn_recall :Button;
	public var btn_speedup :Button;
	
	
	protected var nc:NavigatorController;	
	protected var rmvo:MarchVO;
	protected var wildTroop:Attack.TileTroopInfo;
	
	protected var data_loaded :boolean = false;	
	
	protected var marchId:int;
	protected var marchType:int;
	protected var fromCityId:int;
	
	private var buttonDefaultWidth:float;
	private var buttonDefaultRecallX:float;
	private var buttonDefaultSpeedupX:float;
	
	private var buttonSmallWidth:float;
	private var buttonSmalltHeight:float;
	
	public var  line:SimpleLabel;
	
	public function Init(nc:NavigatorController):void
	{
		this.nc = nc;
		btn_back.OnClick = buttonHandler;
		
		scroll_troop.Init(ins_troopItem);
//		scroll_resoruce.Init(ins_resourceItem);
		
		btn_recall.OnClick = buttonHandler;
		btn_speedup.OnClick = buttonHandler;
		
		btn_back.clickParam = "BACK";
		btn_recall.clickParam = "RECALL";
		btn_speedup.clickParam = "SPEEDUP";
		
		btn_recall.txt = Datas.getArString("Common.Recall");
		btn_speedup.txt = Datas.getArString("Common.Speedup");
		
		buttonDefaultWidth = 260;
		buttonSmallWidth = 180;
		
		seperateLine.setBackground("between line", TextureType.DECORATION);
		line.setBackground("between line", TextureType.DECORATION);
	}
	
	public function resetNC(nc:NavigatorController):void
	{
		this.nc = nc;
	}
	
	public function showMarchInfo(param:Object):void
	{
		//
		rmvo = param as MarchVO;
		wildTroop = param as Attack.TileTroopInfo;
		
		data_loaded = false;

		if(rmvo)
		{
			if(rmvo.toXCoord>=0 && rmvo.toYCoord>=0)
				l_title.txt =  March.getMarchTypeString(rmvo.marchType) + "(" + rmvo.toXCoord + "," + rmvo.toYCoord + ")";
			else
				l_title.txt =  March.getMarchTypeString(rmvo.marchType)+"";
//			l_img.image = Resources.Load("Textures/UI/icon/icon_general/gi" + rmvo.knightId);
			
			marchId = rmvo.marchId;
			marchType = rmvo.marchType;
			fromCityId = rmvo.fromCityId;
			
			if(rmvo.c_marchInfo)
				updateData(rmvo.c_marchInfo);
				
			//btn_recall.SetVisible(rmvo.marchStatus == Constant.MarchStatus.DEFENDING);		
			//btn_speedup.SetVisible(rmvo.marchStatus != Constant.MarchStatus.DEFENDING);
		}
		else
		{
			wildTroop = param as Attack.TileTroopInfo;
			wildTroop.c_willBeRemoved = false;
			
			marchId = _Global.INT32(wildTroop.marchId);
			marchType = Constant.MarchType.REINFORCE;
			fromCityId = _Global.INT32(wildTroop.fromCityId);
			
			l_title.txt =  March.getMarchTypeString(Constant.MarchType.REINFORCE) + "(" + wildTroop.from + ")";
			
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().GeneralSpt().GetTile(General.instance().getGeneralTextureName(wildTroop.general,  _Global.INT32(wildTroop.fromCitySequence)));
			//l_img.tile.name = General.instance().getGeneralTextureName(wildTroop.general,  _Global.INT32(wildTroop.fromCitySequence));
			
			
			
			btn_recall.SetVisible(false);		
			btn_speedup.SetVisible(false);
			
			if(wildTroop.c_marchInfo)
				updateData(wildTroop.c_marchInfo);			
		}
//		btn_speedup.rect.width = buttonDefaultWidth;
//		btn_speedup.rect.x = (rect.width - btn_speedup.rect.width)/2;
//		btn_recall.rect.x = (rect.width - btn_recall.rect.width)/2;		
	}
	
	public function Update()
	{
		super.Update();
		if(rmvo && rmvo.c_marchInfo)
		{
			if(l_time.isVisible())
			{
				l_time.txt = _Global.timeFormatShortStr(rmvo.timeRemaining,true);	
			}
		}
		else if(wildTroop && wildTroop.c_marchInfo)
		{
			if(l_time.isVisible())
			{
				var curTime:long = GameMain.instance().unixtime();
				l_time.txt = _Global.timeFormatShortStr(wildTroop.surveyEndTime - curTime,true);	
			}
		}
	}
	
	public function didShowed():void
	{
		if(rmvo)
		{
			if(!rmvo.c_marchInfo)	// no cache.
				RallyPoint.instance().viewMarch(rmvo.marchId,updateData);
			else if((rmvo.marchType == Constant.MarchType.COLLECT || rmvo.marchType == Constant.MarchType.COLLECT_RESOURCE) &&  _Global.INT32(rmvo.marchStatus)==2){
				RallyPoint.instance().viewMarch(rmvo.marchId,updateData);
			}
		}
		else	//tile part. no cache for ever.
		{
			if(!wildTroop.c_marchInfo)
				RallyPoint.instance().viewMarch(marchId,updateData);
		}
	}
	
	protected function updateData(result:HashObject):void
	{	
		//

//		var arStrings:Object = Datas.instance().arStrings();
		var march:HashObject = result["march"];		
		
		data_loaded = true;
		var curCityOrder:int = GameMain.instance().getCityOrderWithCityId(fromCityId);
		
		if(rmvo)
			rmvo.c_marchInfo = result;
		if(wildTroop){
			wildTroop.c_marchInfo = result;
			 curCityOrder = _Global.INT32(wildTroop.fromCitySequence);
		}
		
		var marchType:int = _Global.INT32(march["marchType"]);
		if(marchType == Constant.MarchType.TRANSPORT || marchType == Constant.MarchType.REASSIGN)
		{
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_transport");
			//l_img.tile.name = "icon_transport";
		//	l_img.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_transport", TextureType.ICON_ELSE);

			l_name.txt = Datas.getArString("Common.General") +": - ";
		}	
		else
		{
				//		getCurCityOrder();
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(march["knightName"].Value, curCityOrder));
			l_name.txt = Datas.getArString("Common.General") +": " +  General.singleton.getKnightShowName(march["knightName"].Value, curCityOrder);
		}
		
		l_type.txt = Datas.getArString("Common.Type") +": " + March.getMarchTypeString(_Global.INT32(result["march"]["marchType"]));
		var status:String;
		if(marchType == Constant.MarchType.SURVEY && _Global.INT32(march["marchStatus"]) == Constant.MarchStatus.OUTBOUND)
			status = Datas.getArString("Common.Surveying");
		else
			status = March.getMarchStatusString(_Global.INT32(result["march"]["marchStatus"]));
		if(marchType == Constant.MarchType.COLLECT &&  _Global.INT32(result["march"]["marchStatus"]) == 2) 
		{
			l_status.txt = Datas.getArString("Common.Status") +": "  + Datas.getArString("Newresource.march_gathering_Nolevel");
		}
		else if(marchType == Constant.MarchType.COLLECT_RESOURCE && _Global.INT32(result["march"]["marchStatus"])==2)
		{
			l_status.txt = Datas.getArString("Common.Status") +": "  + Datas.getArString("Newresource.march_gathering_Nolevel1");
		}
		else
		{
			l_status.txt = Datas.getArString("Common.Status") +": "  + status;
		}			

//		l_target.txt = Datas.getArString("Common"]["Target"] +": "  + march["toXCoord"]+ "," + march["toYCoord"]; 
		//l_tileType.txt = Datas.getArString("Common"]["TileType"] +": " + March.getTileTypeString(_Global.INT32(result["march"]["toTileType"] ) );
	 
		if(marchType == Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE)
		{
			var tileType : int = _Global.INT32(march["resourceType"]); 
			var tileTypeName : String = CollectionResourcesMgr.instance().GetResourceName(tileType);
			l_tileType.txt = Datas.getArString("Common.TileType") + ": " + tileTypeName;
		}
		else
		{
			l_tileType.txt = Datas.getArString("Common.TileType") +": " + March.getTileTypeString(_Global.INT32(result["march"]["toTileType"] ) );
		}

		l_owner.txt = Datas.getArString("Common.Owner") +": " + GameMain.instance().getSeed()["player"]["name"].Value;
		l_surving.txt = Datas.getArString("Common.Surveying");
		l_surving.SetVisible(false);
		l_time.SetVisible(false);
		
		// unit return list.
		var ul:Array = new Array();
		
		if (HeroManager.Instance().GetHeroEnable())
		{
			var index : int = 0;
			while (true)
			{
				if (march["hero" + index.ToString()] == null)
				{
					break;
				}
				
				ul.Push(_Global.GetString(march["hero" + index.ToString()]));
				index++;
			}
		}
		
		var num:int;
		var id;
		for(var i:int=0; i<Constant.MAXUNITID; i++)
		{
			num = _Global.INT32(march["unit"  +i + "Return"]);
			if(num > 0)
			{
				id = Barracks.instance().creatTroopInfo(i,num);	//{"unitId":i,"unitNum":num};
				ul.push(id);				
			}
		}
		
		scroll_troop.SetData(ul);
		
		//
		btn_recall.rect.width = buttonSmallWidth;
		btn_recall.rect.x = rect.width - 15 - buttonSmallWidth;
		//btn_recall.rect.x = rect.x + rect.width - 15 - buttonSmallWidth;
		btn_speedup.rect.width = buttonSmallWidth;
		btn_speedup.rect.x = btn_recall.rect.x - 5 - buttonSmallWidth;
		btn_speedup.changeToGreenNew();
		
		var ms:int = _Global.INT32(march["marchStatus"]);
		if(marchType == Constant.MarchType.SURVEY)
		{
			btn_recall.SetVisible(true);
			btn_speedup.SetVisible(true);
			var mvo:MarchVO =March.instance().getMarchWithCityId(_Global.INT32(march["marchId"].Value), _Global.INT32(march["fromCityId"].Value));
			if(ms == Constant.MarchStatus.OUTBOUND)
			{		
				l_surving.SetVisible(true);
				l_time.SetVisible(true);
				var curTime:long = GameMain.instance().unixtime();
				if(rmvo)
					l_time.txt = _Global.timeFormatShortStr(rmvo.timeRemaining,true);		
				else
					l_time.txt = _Global.timeFormatShortStr(wildTroop.surveyEndTime - GameMain.instance().unixtime(),true);		
				btn_recall.clickParam = "STOP";
				btn_speedup.clickParam = "SPEEDUP";
				btn_speedup.txt = Datas.getArString("Common.Speedup");
				btn_recall.txt = Datas.getArString("Common.Stop");
			}
			else if( mvo && !mvo.isOpenedReward && mvo.surveyRewardId !=0 && ms != Constant.MarchStatus.RETURNING  && ms != Constant.MarchStatus.SITUATION_CHANGED) 
			{
				btn_speedup.SetVisible(false);
				btn_recall.clickParam = "OPENREWARD";
				btn_recall.txt = Datas.getArString("Common.CollectBtn");// Datas.getArString("Common.Recall");

				btn_recall.rect.width = buttonDefaultWidth;
				btn_recall.rect.x = (rect.width - btn_recall.rect.width)/2;	
			}
			else if(ms == Constant.MarchStatus.RETURNING ||  ms == Constant.MarchStatus.SITUATION_CHANGED)
			{
				btn_recall.SetVisible(false);
				btn_speedup.clickParam = "SPEEDUP";
				btn_speedup.txt = Datas.getArString("Common.Speedup");
				btn_speedup.rect.width = buttonDefaultWidth;
				btn_speedup.rect.x = (rect.width - btn_speedup.rect.width)/2;
			}
			else
			{
				btn_recall.clickParam = "RECALL";
				btn_recall.txt = Datas.getArString("Common.Recall");
				btn_speedup.changeToBlueNew();
				btn_speedup.clickParam = "SURVEY";
				btn_speedup.txt = Datas.getArString("Common.SurveyBtn");
				if(!March.instance().isSurveyOpen() || !WildernessMgr.instance().isConquedWild(_Global.INT32(march["toXCoord"].Value),_Global.INT32(march["toYCoord"].Value)))
					btn_speedup.SetVisible(false);
			}
				
		}
		else
		{
			//btn_speedup.rect = new Rect(buttonDefaultWidth);
			btn_recall.SetVisible(ms == Constant.MarchStatus.DEFENDING);		
			btn_speedup.SetVisible(true);
			btn_recall.clickParam = "RECALL";
			btn_recall.txt = Datas.getArString("Common.Recall");
			if(ms == Constant.MarchStatus.DEFENDING)
			{
				btn_speedup.changeToBlueNew();
				btn_speedup.clickParam = "SURVEY";
				btn_speedup.txt = Datas.getArString("Common.SurveyBtn");
				if(!March.instance().isSurveyOpen() || !WildernessMgr.instance().isConquedWild(_Global.INT32(march["toXCoord"].Value),_Global.INT32(march["toYCoord"].Value)))
					btn_speedup.SetVisible(false);
			}
			else
			{
				btn_speedup.clickParam = "SPEEDUP";
				btn_speedup.txt = Datas.getArString("Common.Speedup");
				btn_speedup.rect.width = buttonDefaultWidth;
				btn_speedup.rect.x = (rect.width - btn_speedup.rect.width)/2;	
			}
			
		}
		
	}
	
	public function buttonHandler(clickParam:Object):void
	{
		var mvo:MarchVO;
		if(rmvo)
			mvo = March.instance().getMarchWithCityId(rmvo.marchId, rmvo.cityId);
		else
			mvo = March.instance().getMarchWithCityId(_Global.INT32(wildTroop.marchId), _Global.INT32(wildTroop.fromCityId));
			
		if(mvo == null )
		{
			MenuMgr.getInstance().PopMenu("");
			return;
		}
		
		switch(clickParam)
		{
			case "STOP":	
				var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
				confirmDialog.setLayout(600,320);		
				confirmDialog.setContentRect(70,75,0,140);
				confirmDialog.setButtonText(Datas.getArString("Common.Confirm"),Datas.getArString("Common.Close_Button"));
				var okFunc:System.Action = function()
				{
					March.instance().cancelSurvey(mvo,mvo.marchId, mvo.marchType, mvo.cityId, null);
					confirmDialog.close();
					MenuMgr.getInstance().PopMenu("");
				};
				MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("MessagesModal.CancelSurvey"),"",okFunc,null);
				//nc.pop();
				break;
			case "SURVEY":
				March.instance().startSurvey(mvo,mvo.marchId, mvo.marchType, mvo.cityId, March.instance().surveyError);
				MenuMgr.getInstance().PopMenu("");
				break;
			case "OPENREWARD":
				March.instance().openSurveyReward(mvo,mvo.marchId, mvo.marchType, mvo.cityId, March.instance().surveyError);
				MenuMgr.getInstance().PopMenu("");
				break;
			case "BACK":
				nc.pop();	
				break;
			case "SPEEDUP":
				MenuMgr.getInstance().PopMenu("");
				if(rmvo != null && rmvo.marchType==20)
				{ 
					RallyPoint.instance().viewMarch(rmvo.marchId,updateData);
			    	MenuMgr.getInstance().PushMenu("CollectSpeedUpMenu",rmvo,"trans_zoomComp");   	
				}
				else
					MenuMgr.getInstance().PushMenu("SpeedUpMenu",mvo, "trans_zoomComp");
				
				break;
			case "RECALL":							
				RallyPoint.instance().recall(marchId, marchType, fromCityId, recall_back); 				
				if(rmvo)
					rmvo.c_marchInfo = null; 	//clear cache ..
				if(wildTroop)				
					wildTroop.c_marchInfo = null;				
				break;			
		}
		
		
			
	}	
	protected function recall_back(result:Object):void
	{			
		if(wildTroop)
			wildTroop.c_willBeRemoved = true;
		nc.pop();	
	}	
//	
//	private function updateInfo():void
//	{
//		if(rmvo)
//			RallyPoint.instance().viewMarch(rmvo.marchId,updateData);
//		else if(wildTroop && wildTroop.c_marchInfo)
//			RallyPoint.instance().viewMarch(marchId,updateData);
//	}
	
	public function getTileTroopInfo():Attack.TileTroopInfo
	{
		return this.wildTroop;
	}
	
	public function Clear()
	{
		scroll_troop.Clear();
	}
}
