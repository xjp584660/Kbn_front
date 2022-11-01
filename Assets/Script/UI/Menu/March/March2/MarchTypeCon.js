public class MarchTypeCon extends PopMenu implements IEventHandler
{
	public var posCon : ComposedUIObj;
	public var typeCon :ComposedUIObj;
	
	public var ins_typeItem : MarchTypeItem;
	
	public var btn_bookmark:Button;
	public var l_bookmark:Label;
	public var p_l_title:Label;
	public var p_l_bg 	:Label;
	public var p_l_icon	:Label;
	public var p_l_x	:Label;
	public var p_l_y	:Label;
	
	public var p_it_x	:InputText;
	public var p_it_y	:InputText;
	
	public var p_tf_x	:TextField;
	public var p_tf_y	:TextField;
	//
	public var t_l_title :Label;
	public var t_l_bg	:Label;
	public var t_scroll :ScrollList;
	public var next_Btn :Button;
	public var navHead  :NavigatorHead;		
	public var texture_line :Texture2D;
	//protected var defaultTypeData:Object;

	public function Init()
	{
		super.Init();
		t_scroll.Init(ins_typeItem);
//		t_scroll.itemDelegate = this;

		p_it_x.Init();
		p_it_y.Init();

		p_l_title.txt = Datas.getArString("Common.Target");
		p_l_x.txt = Datas.getArString("Common.X");
		p_l_y.txt = Datas.getArString("Common.Y");
		
		t_l_title.txt = Datas.getArString("OpenRallyPoint.MarchType");

		btn_bookmark.OnClick = buttonHandler;
		p_it_y.filterInputFunc = filterInputFunc;
		p_it_x.filterInputFunc = filterInputFunc;

		p_it_y.inputDoneFunc = inputDoneFunc;
		p_it_x.inputDoneFunc = inputDoneFunc;

		if(RuntimePlatform.Android == Application.platform )
		{
			p_it_x.hidInput = p_it_y.hidInput = false;
			p_it_x.type = p_it_y.type = TouchScreenKeyboardType.NumberPad;
		}
		
		l_bookmark.setBackground("button_bookmark_big",TextureType.BUTTON);
		btn_bookmark.setNorAndActBG("map_icon_button_Paper","map_icon_button_Paper_down");
		this.t_scroll.itemDelegate = this;
		navHead.titleTxt = Datas.getArString("ModalTitle.March");	
		next_Btn.OnClick = OnNextBtnClick;	
	}
	// public function getDefaultTypeData():Object
	// {
	// 	return defaultTypeData;
	// }
	protected function filterInputFunc(oldStr:String,newStr:String):String
	{		
		newStr = _Global.FilterStringToNumberStr(newStr);		
		var n:long = _Global.INT64(newStr);
		if(newStr == "")
			return "";
			
		return inputDoneFunc(newStr);
	}
	
	protected function inputDoneFunc(newStr:String):String
	{
		var n : int = _Global.INT32(newStr);
		n = n < 1 ? 1 : n;
        var max : int = isAva ? Constant.Map.AVA_MINIMAP_WIDTH : Constant.Map.WIDTH;
	    n = n > max ? max : n;
		return "" + n;
	}
	
	public function DrawItem()
	{
		//GUI.BeginGroup(rect);
		posCon.Draw();
		typeCon.Draw();
		next_Btn.Draw();
		navHead.Draw();
		//GUI.EndGroup();
	}
	
//	protected static var TYPE_FLAG:Array = [1,2,4];
	
	public function setXY(xStr:String,yStr:String):void
	{
		p_it_x.txt = xStr;
		p_it_y.txt = yStr;
	}
    
    private final static var MarchTypeToStringKey_Normal : Hashtable =
    {
        Constant.MarchType.TRANSPORT : "Common.Transport",
        Constant.MarchType.REINFORCE : "Common.Reinforce",
        Constant.MarchType.ATTACK : "Common.Attack",
		Constant.MarchType.REASSIGN : "Common.Reassign",
		Constant.MarchType.GIANTTPWER:"Common.GiantTowerReturn"
    };
    
    private final static var MarchTypeToStringKey_Ava : Hashtable =
    {
        Constant.AvaMarchType.ATTACK : "Common.Attack",
        Constant.AvaMarchType.RALLYATTACK : "AVA.chrome_rallyattackbtn",
        Constant.AvaMarchType.REINFORCE : "Common.Reinforce"
    };
	
    private var isAva : boolean = false;
	public function OnPush(data:Object):void
	{
		var param:Hashtable = data as Hashtable;
		var isRallyAttack : boolean = false;	
		if(param != null && param["type"] != null && _Global.INT32(param["type"]) == Constant.MarchType.RALLY_ATTACK)
		{
			isRallyAttack = true;
			t_l_title.txt = "Rally Time";/*Datas.getArString("Rally Time");*/
		}

		isAva = (param != null && _Global.INT32(param["ava"]) != 0);

		/*医院ID 等于 当前进入的城市ID  就给集结点的部队派遣  打开巨塔返回列表*/
		var types: int[];
		if (Datas.instance().getHospitalCityId() == Datas.instance().getCityId())
		{
			/*在集结点的部队派遣列表添加巨塔返回列表*/
			types = isAva ?
				[Constant.AvaMarchType.ATTACK, Constant.AvaMarchType.RALLYATTACK, Constant.AvaMarchType.REINFORCE] :
				[Constant.MarchType.TRANSPORT, Constant.MarchType.REINFORCE, Constant.MarchType.ATTACK, Constant.MarchType.REASSIGN, Constant.MarchType.GIANTTPWER];//[1,2,4,5,24];
		}
		else
		{
			/*其他城市不添加巨塔返回列表*/
			types = isAva ?
				[Constant.AvaMarchType.ATTACK, Constant.AvaMarchType.RALLYATTACK, Constant.AvaMarchType.REINFORCE] :
				[Constant.MarchType.TRANSPORT, Constant.MarchType.REINFORCE, Constant.MarchType.ATTACK, Constant.MarchType.REASSIGN];//[1,2,4,5];
		}


		
		var defselect:int = 4;
	   	
		//defaultTypeData = null;
		if(param != null)
		{
			if(param["x"] && param["y"])
			{
//				p_tf_x.SetString("" + param["x"]);			
//				p_tf_y.SetString("" + param["y"]);
				setXY(""+param["x"],""+param["y"]);
				posCon.SetVisible(false);
			}
			else
				posCon.SetVisible(true);
				
			if(param["types"])
				types = param["types"];
			
			if(param["defaultSelectType"] != null)
				defselect = _Global.INT32(param["defaultSelectType"]);
			
            if (_Global.INT32(param["ava"]) != 0)
            {
                btn_bookmark.SetVisible(false);
            }
		}
		else
		{
			posCon.SetVisible(true);
			setXY("0","0");
		}		
		//
		var list:Array = [];
		var content:String;

        if(isRallyAttack)
        {
			if(param["types"])
				types = param["types"];
			for(var j:int = 0; j < types.length; j++)
			{
	            content = types[j] + "Min";
				list.push({"selected":types[j] == defselect,"type":Constant.MarchType.RALLY_ATTACK,"content":content,"line": (j != types.length -1),"rallyTime":types[j]});		//set attack selected as default value.	
				
				if(types[j] == defselect)
				{
					MarchDataManager.instance().item_type_data = list[list.length - 1];
				}
			}
        }
        else
        {
        	var stringKeyDict : Hashtable = (isAva ? MarchTypeToStringKey_Ava : MarchTypeToStringKey_Normal);
    		for(var i:int = 0; i < types.length; i++)
			{
	            content = Datas.getArString(stringKeyDict[_Global.INT32(types[i])]);
				list.push({"selected":types[i] == defselect,"type":types[i],"content":content,"line": (i != types.length -1) });		//set attack selected as default value.	
				
				if(types[i] == defselect)
				{
					MarchDataManager.instance().item_type_data = list[list.length - 1];
				}
			}
        }
        
		// no attack and no default set. 
		if(MarchDataManager.instance().item_type_data == null)
		{
			MarchDataManager.instance().item_type_data = list[0];
			(list[0] as Hashtable)["selected"] = true;
		}
		
		t_scroll.SetData(list);	
			
		t_l_bg.rect.height = types.length * ins_typeItem.rect.height  + 10;
		typeCon.rect.height = t_l_bg.rect.height + t_l_bg.rect.y + 10;
		t_scroll.rect.height = types.length * ins_typeItem.rect.height + 5;
		
		if(posCon.isVisible() )
		{
			typeCon.rect.y = 280;			
		}
		else
		{
			typeCon.rect.y = 130;
		}
		next_Btn.txt = MarchDataManager.instance().GetNextBtnTxt();
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		BookmarkItem.marchMode = true;
		MenuMgr.getInstance().PushMenu("BookmarkMenu", null);
	}

	public function DrawBackground()
	{
		super.DrawBackground();
		this.drawTexture(texture_line,45,105,490,17);
//		this.drawTexture(texture_line,10,750,550,17);
//		DrawTextureClipped(texture_line, Rect( 0, 0, texture_line.width, texture_line.height ), Rect( 0, 119, 550,17), UIRotation.NONE);
	}
	var march_type:int;
	public function handleItemAction(action:String,param:Object):void
	{
		//............................................................
		var last_itemData:Object;
		var data:Hashtable = param as Hashtable;
		switch(action)
		{
			case Constant.Action.MARCH_TYPE_SELECT:
			if(MarchDataManager.instance().item_type_data)
				MarchDataManager.instance().item_type_data["selected"] = false;
				data["selected"] = true;
				
				MarchDataManager.instance().item_type_data = data;
				MarchDataManager.instance().SetMarchType(data["type"]);
			    march_type = data["type"];	//int ..
				if(march_type == Constant.MarchType.RALLY_ATTACK)
				{
					break;
				}
				if(march_type == Constant.MarchType.REASSIGN){
					MarchDataManager.instance().VisibleMarchCount = Attack.instance().GetVisibleMarchCount();
	//						VisibleMarchCount=March.instance().getAvaliableMarchIds(GameMain.instance().getCurCityId()).length;//Attack.instance().GetVisibleMarchCount();
		//			maxMarchCount=Attack.instance().GetMaxMarchCount();
				}else
				     MarchDataManager.instance().VisibleMarchCount = 1;
			break;
	    }
	
	}
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PVE_MARCH_BEGIN:
			case Constant.Notice.SEND_MARCH:
				//add march progressbar to mainchrom
				if(MenuMgr.instance.getMenu("MarchTypeCon") != null)
				{
					MenuMgr.getInstance().PopMenu("MarchTypeCon");
				}
				
				
				//March.instance().addPveQueueItem();
				break;
    	}
    }
	
	public	function	Clear()
	{
		t_scroll.Clear();
	}

	private function OnNextBtnClick()
	{
		MarchDataManager.instance().tx = _Global.INT32(p_it_x.txt);
		MarchDataManager.instance().ty = _Global.INT32(p_it_y.txt);
		var error:int = 0;
		var errorStr:String = "";
		if(march_type < 0)
		{
			error = 1;		
			errorStr = Datas.getArString("Error.March_NeedType");
		}
		if(MarchDataManager.instance().tx == 0 || MarchDataManager.instance().ty == 0)
		{
			error = 2;
			errorStr = Datas.getArString("Error.March_NeedXY");
		}
		if(error > 0)
		{
			ErrorMgr.instance().PushError("",errorStr);
			return;
		}
		
		 switch(march_type)
		 {
			 case Constant.MarchType.TRANSPORT:
			 case Constant.MarchType.REASSIGN:
				 MenuMgr.getInstance().PushMenu("ChooseTroops",null,"trans_zoomComp");
				 break;
			case Constant.MarchType.REINFORCE:
				 MenuMgr.getInstance().PushMenu("SelectKnight",null,"trans_zoomComp");
				 break;
			case Constant.MarchType.ATTACK:

				var onGetTileInfoByCoord = function(result : HashObject) {
					var isCity : boolean = false;
					if(result["city"] != null)
					{
						isCity = _Global.INT32(result["city"]) == 1 ? true : false;
					}
					
					if(isCity)
					{
						MenuMgr.getInstance().PushMenu("MarchDefaultMenu",true,"trans_zoomComp");	
					}
					else
					{
						MenuMgr.getInstance().PushMenu("MarchDefaultMenu",null,"trans_zoomComp");	
					}					
				};
				 UnityNet.getTileInfoByCoord(MarchDataManager.instance().tx, MarchDataManager.instance().ty, onGetTileInfoByCoord, null);
				 break;
			 case Constant.MarchType.GIANTTPWER:
				 MenuMgr.getInstance().PushMenu("ChooseTroops", null,"trans_zoomComp");
				 break;
			default:
				MenuMgr.getInstance().PushMenu("SelectKnight",null,"trans_zoomComp");
				break;
		 }
	}
}
