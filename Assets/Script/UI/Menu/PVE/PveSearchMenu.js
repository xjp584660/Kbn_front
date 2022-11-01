class PveSearchMenu extends KBNMenu implements IEventHandler
{
	
	public var topbg:Label;
	public var midbg:Label;
	public var levelLabel:Label;
	public var level:TextField;
	public var slider:Slider;
	public var times:Label;
	public var searchBtn:Button;
	public var bg:Button;

	public var item:PveSearchItem;
	public var scroll:ScrollList;

	private var selectItem:PveSearchItem;

	private var selectType:int;
	private var selectLevel:int;

	private var selectId:int;

	@SerializeField private var iphoneXBottomFrame:SimpleLabel;

	private var isInput=false;
	public function Init(){
		super.Init();
		if (KBN._Global.isIphoneX()) {
			rect.y=720;
		}else{
			rect.y=660;
		}
		selectItem=null;
		topbg.Init();
		midbg.Init();
		times.Init();
		levelLabel.Init();
		levelLabel.txt=Datas.getArString("MapSearch.Text1");
		
		level.type = TouchScreenKeyboardType.NumberPad;
		// level.filterInputFunc = handlerFilterInputFunc;
		level.Init();
		level.startInput = function() {
			isInput=true;
		};
		level.endInput = function() {
			Inputdone();
			isInput=false;
		};

		slider.Init(1,10);
		slider.SetCurValue(PlayerPrefs.GetInt("MarchSearchValue",1));
		bg.Init();
		bg.OnClick=returnBack;

		item.Init();
		scroll.Init(item);

		searchBtn.Init();
		searchBtn.OnClick=Search;
		searchBtn.txt=Datas.getArString("MapSearch.Text2");

		iphoneXBottomFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("iphoneX_Bottom", TextureType.LOAD);
		iphoneXBottomFrame.rect.y=420;
		iphoneXBottomFrame.rect.height=38;
	}
	private function Inputdone(){
		if (_Global.IsNumber(level.txt)) {
			var lv:int=level.txt==""?1:_Global.INT32(level.txt);
			slider.SetCurValue(lv);
		}
		
		// lv=lv>(selectItem==null?10:_Global.INT64(selectItem.obj["maxLv"]))?(selectItem==null?10:_Global.INT64(selectItem.obj["maxLv"])):lv;
		// level.SetText(lv+"");
	}
	private function Search(){
		var okFunc:Function=function(result:HashObject){
 			if (result["ok"]){
 				var x=_Global.INT32(result["targetTile"]["x"]);
 				var y=_Global.INT32(result["targetTile"]["y"]);
 				GameMain.instance().gotoMap(x,y);

 				var seed=GameMain.instance().getSeed();
 				seed["mapSearchTimes"]=new HashObject();
 				seed["mapSearchTimes"].Value=result["mapSearchTimes"].Value;
 				var time:int=GameMain.instance().getMapSearchTimes();
 				times.txt=Datas.getArString("MapSearch.Text3",[time]);
 				RereshState(time);
 				PlayerPrefs.SetInt("MarchSearchValue_"+selectType,selectLevel);

 				if (selectType==51&&selectLevel<=10) {
	 				PlayerPrefs.SetInt("MarchSearchValue_"+selectType+"_"+0,selectLevel);
	 			}else if (selectType==51&&selectLevel>10) {
	 				PlayerPrefs.SetInt("MarchSearchValue_"+selectType+"_"+1,selectLevel);
	 			}else{
	 				PlayerPrefs.SetInt("MarchSearchValue_"+selectType,selectLevel);
	 			}

 				if (time>0) {
 					SetInvoke();	
				}		

// 				var gMain:GameMain = GameMain.instance();
// 				gMain.hideTileInfoPopup();
// 				gMain.searchWorldMap(x, y);
 			}
 		};	
 		var errorFunc:Function=function(errorMsg:String, errorCode:String){	
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode.ToString())));
			SetInvoke();
		};	

		var curCityInfo:HashObject = GameMain.instance().GetCityInfo(GameMain.instance().getCurCityId());
		var x:int = _Global.INT32(curCityInfo[_Global.ap + 2]);
		var y:int = _Global.INT32(curCityInfo[_Global.ap + 3]);	
		
 		UnityNet.GetMapSearchPoint(PlayerPrefs.GetInt("MarchSearchId",selectType),selectLevel,x,y,okFunc,errorFunc);
	} 

	private function RereshState(time:int){
		var ishaveTimes:boolean=time>0;
		if (ishaveTimes) {
			searchBtn.OnClick=Search;
			searchBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
			searchBtn.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_blue_downnew", TextureType.BUTTON);
		}else{
			searchBtn.OnClick=null;
			searchBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
			searchBtn.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		}
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "UdpateMapSearchTimes":
				var time:int=GameMain.instance().getMapSearchTimes();
				times.txt=Datas.getArString("MapSearch.Text3",[time]);
				RereshState(time);
				break;
		}
	}

	private function SetInvoke(){
		searchBtn.OnClick=null;
		searchBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		searchBtn.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		if(IsInvoking("InvokeOver"))
			CancelInvoke("InvokeOver");
		Invoke("InvokeOver",3);
	}
	private function InvokeOver(){
		searchBtn.OnClick=Search;
		searchBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
		searchBtn.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_blue_downnew", TextureType.BUTTON);
	}

	private function returnBack(){
		KBN.MenuMgr.instance.PopMenu("");
	}

	public function OnPush(param:Object){
		super.OnPush(param);
		
		if(PlayerPrefs.GetString("MarchSearchIcon", "no") == "no")
		{
			PlayerPrefs.SetString("MarchSearchIcon", "Carmot300");
		}
		
		var time:int=GameMain.instance().getMapSearchTimes();
		times.txt=Datas.getArString("MapSearch.Text3",[time]);
		RereshState(time);
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_paper_bottomSystem");	
		var l=getDatas()["list"].Value as Array;
		scroll.SetData(l);
	}
	public var first=false;
	public function handleItemAction(action:String,data:Object):void
 	{
 		switch(action)
		{
			case "PVE_SEARCH_TOOGLE":	
		 		if (selectItem&&selectItem!=data) {
		 			selectItem.SetSelected(false);
		 		}
		 		selectItem=data as PveSearchItem;
		 		selectId=selectItem.id;
		 		if (selectItem.obj!=null) {
		 			slider.Init(1,_Global.INT64(selectItem.obj["maxLv"]));		 			
		 			selectType=_Global.INT32(selectItem.obj["id"]);
		 			var v:int;
		 			if (selectType==51&&selectItem.obj["maxLv"]==10) {
		 				v=PlayerPrefs.GetInt("MarchSearchValue_"+selectType+"_"+0,1);
		 			}else if (selectType==51&&selectItem.obj["maxLv"]==5) {
		 				v=PlayerPrefs.GetInt("MarchSearchValue_"+selectType+"_"+2,1);
		 			}else{
		 				v=PlayerPrefs.GetInt("MarchSearchValue_"+selectType,1);
		 			}
		 			slider.SetCurValue(v);
		 		}
		 		if (first) {
		 			slider.SetCurValue(PlayerPrefs.GetInt("MarchSearchValue",1));
		 			first=false;
		 		}
		 		PlayerPrefs.SetInt("MarchSearchId",selectItem.id);
 		 		PlayerPrefs.SetString("MarchSearchIcon",selectItem.iconName);
				break;
		}
 	}

	public function DrawItem(){
		topbg.Draw();
		midbg.Draw();
		if(KBN._Global.isIphoneX()){
			// iphoneXBottomFrame.Draw();
		}
		levelLabel.Draw();
		level.Draw();
		slider.Draw();
		searchBtn.Draw();
		scroll.Draw();
		times.Draw();
	}

	public function Draw(){
		super.Draw();
		bg.Draw();
	}

	public function OnPopOver()
 	{
 		PlayerPrefs.SetInt("MarchSearchValue",selectLevel);
 		scroll.Clear();
 	}

 	public function Update(){
 		scroll.Update();
 		if (selectItem&&selectId==selectItem.id&&!selectItem._selected) {
 			selectItem.SetSelected(true);
 		}
 		// level.txt=slider.GetCurValue()+"";
 		if (!isInput) {
 			level.txt=slider.GetCurValue()+"";
 		}
 		
 		if (selectItem!=null&&selectItem.obj!=null&&(selectItem.obj["icon"].Value as String)=="SaxonCamp51")
			selectLevel=slider.GetCurValue()+10;
		else
 			selectLevel=slider.GetCurValue();
 	}
 	
	private var datas:HashObject; 
	public function getDatas():HashObject{
		if (GameMain.instance().isShowCarmot() && GameMain.instance().isShowMapSearchResource())
		{
			if (datas==null) {
				datas=new HashObject({
					// "id":"as",
					"list":new Array([
						{
							// "icon":"g8",
							"icon":"Carmot300",
							"id":300,
							"maxLv":5
						},
						{
							"icon":"Food301",
							"id":301,
							"maxLv":5
						},
						{
							"icon":"Wood302",
							"id":302,
							"maxLv":5
						},
						{
							"icon":"Stone303",
							"id":303,
							"maxLv":5
						},
						{
							"icon":"Ore304",
							"id":304,
							"maxLv":5
						},
						{
							"icon":"Gold310",
							"id":310,
							"maxLv":5
						},
						{
							// "icon":"g6",
							"icon":"PictCamp51",
							"id":51,
							"maxLv":10
						},
						{
							// "icon":"g7",
							"icon":"SaxonCamp51",
							"id":51,
							"maxLv":5
						},
						{
							// "icon":"g0",
							"icon":"plain50",
							"id":50,
							"maxLv":10
						},
						{
							"icon":"Grassland10",
							// "icon":"g1",
							"id":10,
							"maxLv":10
						},
						{
							"icon":"Lake11",
							// "icon":"g2",
							"id":11,
							"maxLv":10
						},
						{
							// "icon":"g3",
							"icon":"Wood20",
							"id":20,
							"maxLv":10
						},
						{
							// "icon":"g4",
							"icon":"Hills30",
							"id":30,
							"maxLv":10
						},
						{
							// "icon":"g5",
							"icon":"Mountain40",
							"id":40,
							"maxLv":10
						}	
					])
				});
			}
			return datas;
		}
		if(GameMain.instance().isShowMapSearchResource())
		{
			if (datas==null) {
				datas=new HashObject({
					// "id":"as",
					"list":new Array([
						{
							"icon":"Food301",
							"id":301,
							"maxLv":5
						},
						{
							"icon":"Wood302",
							"id":302,
							"maxLv":5
						},
						{
							"icon":"Stone303",
							"id":303,
							"maxLv":5
						},
						{
							"icon":"Ore304",
							"id":304,
							"maxLv":5
						},
						{
							"icon":"Gold310",
							"id":310,
							"maxLv":5
						},
						{
							// "icon":"g6",
							"icon":"PictCamp51",
							"id":51,
							"maxLv":10
						},
						{
							// "icon":"g7",
							"icon":"SaxonCamp51",
							"id":51,
							"maxLv":5
						},
						{
							// "icon":"g0",
							"icon":"plain50",
							"id":50,
							"maxLv":10
						},
						{
							"icon":"Grassland10",
							// "icon":"g1",
							"id":10,
							"maxLv":10
						},
						{
							"icon":"Lake11",
							// "icon":"g2",
							"id":11,
							"maxLv":10
						},
						{
							// "icon":"g3",
							"icon":"Wood20",
							"id":20,
							"maxLv":10
						},
						{
							// "icon":"g4",
							"icon":"Hills30",
							"id":30,
							"maxLv":10
						},
						{
							// "icon":"g5",
							"icon":"Mountain40",
							"id":40,
							"maxLv":10
						}	
					])
				});
			}
			return datas;
		}

		if(GameMain.instance().isShowCarmot())
		{
			if (datas==null) {
				datas=new HashObject({
					// "id":"as",
					"list":new Array([
						{
							// "icon":"g8",
							"icon":"Carmot300",
							"id":300,
							"maxLv":5
						},
						{
							// "icon":"g6",
							"icon":"PictCamp51",
							"id":51,
							"maxLv":10
						},
						{
							// "icon":"g7",
							"icon":"SaxonCamp51",
							"id":51,
							"maxLv":5
						},
						{
							// "icon":"g0",
							"icon":"plain50",
							"id":50,
							"maxLv":10
						},
						{
							"icon":"Grassland10",
							// "icon":"g1",
							"id":10,
							"maxLv":10
						},
						{
							"icon":"Lake11",
							// "icon":"g2",
							"id":11,
							"maxLv":10
						},
						{
							// "icon":"g3",
							"icon":"Wood20",
							"id":20,
							"maxLv":10
						},
						{
							// "icon":"g4",
							"icon":"Hills30",
							"id":30,
							"maxLv":10
						},
						{
							// "icon":"g5",
							"icon":"Mountain40",
							"id":40,
							"maxLv":10
						}	
					])
				});
			}
			return datas;
		}

		if (datas==null) {
			datas=new HashObject({
				"list":new Array([
					{
						// "icon":"g6",
						"icon":"PictCamp51",
						"id":51,
						"maxLv":10
					},
					{
						// "icon":"g7",
						"icon":"SaxonCamp51",
						"id":51,
						"maxLv":5
					},
					{
						// "icon":"g0",
						"icon":"plain50",
						"id":50,
						"maxLv":10
					},
					{
						"icon":"Grassland10",
						// "icon":"g1",
						"id":10,
						"maxLv":10
					},
					{
						"icon":"Lake11",
						// "icon":"g2",
						"id":11,
						"maxLv":10
					},
					{
						// "icon":"g3",
						"icon":"Wood20",
						"id":20,
						"maxLv":10
					},
					{
						// "icon":"g4",
						"icon":"Hills30",
						"id":30,
						"maxLv":10
					},
					{
						// "icon":"g5",
						"icon":"Mountain40",
						"id":40,
						"maxLv":10
					}	
				])
			});
		}
		return datas;
	}
}