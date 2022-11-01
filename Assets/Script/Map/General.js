class General extends KBN.General
{
	public	static	var	POS_URBAN:int = 11;
	public	static	var	POS_PRAETORIAN:int = 13;
	public	static	var	POS_ACADEMIC:int = 14;
	public	static	var	POS_CONSTRUCTION:int = 12;
    public static var POS_DEFENSE:int = 15;
	
	
	private var salaryRate:int = 20;
	private var m_LastTab:int = 0;
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new General();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton as General;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		GearData.Instance().Init();		
	}
	public function ParseKnights(knights:Knights)
	{
		if( knights != null )
			knights.Parse(seed);
			
	}
	
	public function set LastTab(value:int)
	{
		m_LastTab = value;
	}
	
	public function get LastTab():int
	{
		return m_LastTab;
	}
	
	public function getKinghtsList():Array
	{
		var list:Array = new Array();		
		var cityId:int = GameMain.instance().getCurCityId();		
		var gObj:Hashtable = seed["knights"]["city" + cityId].Table;
		if( !gObj ){
			return list;
		}
		
		var id:Object;
		var giVO:GeneralInfoVO;
		for(var i:System.Collections.DictionaryEntry in gObj)
		{
			id = (i.Value as HashObject).Value;
			giVO = new GeneralInfoVO();
			giVO.mergeDataFrom(id);
			list.push(giVO);
		}
		return list;
	}
	
	public function getKinghtInfoBykid(kid:int):GeneralInfoVO
	{
		var gvo:GeneralInfoVO;
		var arr:Array = this.getGenerals();
		for(var i:int = 0 ;  i < arr.length ; i++)
		{
			
			var obj:HashObject = arr[i] as HashObject;
			if(kid == _Global.INT32(obj["knightId"])){
				gvo = new GeneralInfoVO();
				gvo.mergeDataFrom(obj);
				return gvo;
			}
		}
		return gvo;

	}

	public function getMarchAbleKinghtList(selectedKinghtId:int):Array
	{
		var list:Array = getIdleKinghtsList();
		var rt:Array = [];
		var gvo:GeneralInfoVO;
		
		for (var gobj:Object in list)
		{
			var hash:HashObject = gobj as HashObject;
			if(hash == null) continue;
			if(_Global.INT32(hash["knightLocked"]) == 1) continue;
			gvo = new GeneralInfoVO();
			gvo.mergeDataFrom(gobj);
			rt.push(gvo);
		}
		return rt;
	}
	public function getIdleKinghtsList():Array	
	{
		var al:Array =	getUnassignedGenerals();	// getKinghtsList();		
		var rt:Array = [];
		for(var i:int=0;i<al.length;i++)
		{
			if(_Global.INT32((al[i] as HashObject)["knightLocked"]) == 1) continue;
			if ((al[i] as HashObject)["belongFteId"] )
			{
				continue;
			}
			
			if(_Global.INT32((al[i] as HashObject)["knightStatus"]) == 1)
			{
				rt.push(al[i]);
			}
		}
		rt.sort(lvSortFunc);
		return rt;
	}
	
	public function setGeneralStatus(cityId:int,knightId:int, status:int):void
	{
		//var cityId:int = GameMain.instance().getCurCityId();
		try
		{
			if(seed == null)
				return;
			if( seed["knights"] != null && seed["knights"]["city"+cityId] != null){
				var kobj:HashObject = seed["knights"]["city"+cityId]["knt" + knightId];		
				if(kobj != null)
					kobj["knightStatus"].Value = "" + status;		
			}
		}
		catch(ex:System.Exception)
		{
			var errorLog : String = "cityId: " + cityId + "knightId : " + knightId + "status : " + status;
			UnityNet.reportErrorToServer("General  setGeneralStatus : ",null,null,errorLog,false);
		}
	}
	
	public function getGeneralStatus(cityId:int,knightId:int):int
	{
		if( seed["knights"] != null && seed["knights"]["city"+cityId] != null 
			&& seed["knights"]["city"+cityId]["knt" + knightId] != null)
		{
			return _Global.INT32(seed["knights"]["city"+cityId]["knt" + knightId]["knightStatus"]);
		}
		return 0;
	}
	
	public function refreshGeneralStatus(mfunc:Function,selectedKinghtId:int):void
	{
		var currentcityid:int = GameMain.instance().getCurCityId();
		var okFunc:Function = function(result:HashObject){
			if(result["data"]!=null) {
			var keys:Array = _Global.GetObjectKeys(result["data"]);
				for(var i:int=0;i<keys.length;i++){
					var kid:int=_Global.INT32(result["data"][keys[i]]["knightId"]);
					var statues:int=_Global.INT32(result["data"][keys[i]]["knightStatus"]);
					setGeneralStatus(currentcityid,kid,statues);
				}
			}
			if(mfunc!=null){
					mfunc(getMarchAbleKinghtList(selectedKinghtId));
			}
		
		};
		
		
		UnityNet.GetGeneralStatues(currentcityid, okFunc, null );
	
	}
	
	protected function lvSortFunc(a:Object,b:Object):int
	{
		var n:int = _Global.INT32((b as HashObject)["knightLevel"]) - _Global.INT32((a as HashObject)["knightLevel"]);
		if(n==0)
			n = _Global.INT32((b as HashObject)["experience"]) - _Global.INT32((a as HashObject)["experience"]);
		return n;
	}
	public	function	useExpBoost(iid:int, knightId:int, okCallback:Function,errorFunc:Function) {
		
		var currentcityid:int = GameMain.instance().getCurCityId();
		var params:Array = new Array();
		params.Add(iid);
		params.Add(currentcityid);
		params.Add(knightId);
		
		var itemlist:HashObject = Datas.instance().itemlist();
		var g:int = 0;
		if(!seed["items"]["i"+iid]) { 
			g = itemlist["i"+iid]["price"].Value; 
		} else if(seed["items"]["i"+iid].Value == "0") {
			g = itemlist["i"+iid]["price"].Value;
		}
		params.Add(g);


		var okFunc:Function = function(result:HashObject){
//			_Global.Log("general useExpBoost OK");

			if(seed["items"]["i"+iid] && _Global.INT32(seed["items"]["i"+iid]) > 0) {
//				seed["items"]["i"+iid] = _Global.INT32(seed["items"]["i"+iid])-1;
				MyItems.instance().subtractItem(iid);
			}
			
			var knightDat : HashObject = seed["knights"]["city"+currentcityid]["knt"+ knightId];
			knightDat["experience"].Value = result["experience"].Value + "";
			knightDat["knightLevel"].Value = result["newlevel"].Value;

			if(result["updateSeed"]){
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
			
			if(g != 0) {
				var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
				Payment.instance().SubtractGems(g,isReal);
			}
			
			AvatarMgr.instance().UpdateBySeed(seed);
			
			if( okCallback ){
				okCallback();
			}

		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("general useExpBoost Error:"+msg + " errorCode:" + errorCode);
//		};
//		
//		UnityNet.reqGeneralExpBoost(params, okFunc, errorFunc );
		if(iid <= 363)
			UnityNet.reqGeneralExpBoost(params, okFunc, errorFunc );
		else
			UnityNet.reqGeneralExpLevelUp(params, okFunc, null );
		
	}
	
	
	//BEGIN HERE: assign job -------------------------------------------------------------------------------->
	public	function	assignJob (pos:int, kid:int, okCallback:Function) {
	
		
		var currentcityid:int = GameMain.instance().getCurCityId();
//		_Global.Log(" pos:" + pos + " kid:" + kid  + " cityid:" + currentcityid);
		var params:Array = new Array();
		params.Add(currentcityid);
		params.Add(kid);
		params.Add(pos);

		var okFunc:Function = function(result:HashObject){
//			_Global.Log("generalassignJob OK");
			
			seed["knights"]["city" + currentcityid]["knt" + kid]["knightEnergy"].Value = _Global.INT32(seed["knights"]["city" + currentcityid]["knt" + kid]["knightEnergy"]) - 1;
			
			//update cities seed
			if (result["updateSeed"]) {
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
        
			
			//Do dynamic data stuff for praefect bust/name/time...etc
            var kidStr : String = kid.ToString();
			switch(pos) {
			case POS_CONSTRUCTION:
				seed["leaders"]["city"+currentcityid]["politicsKnightId"].Value = kidStr;
				break;
			case POS_PRAETORIAN:
				seed["leaders"]["city"+currentcityid]["combatKnightId"].Value = kidStr;
				break;
			case POS_ACADEMIC:
				seed["leaders"]["city"+currentcityid]["intelligenceKnightId"].Value = kidStr;
				break;
			case POS_URBAN:
				seed["leaders"]["city"+currentcityid]["resourcefulnessKnightId"].Value = kidStr;
				break;
            case POS_DEFENSE:
                seed["leaders"]["city"+currentcityid]["defenseKnightId"].Value = kidStr;
			}
			
			//---------------------------------// zhou wei
			Quests.instance().checkForElse();
			//---------------------------------//				
			
			if( okCallback ){
				okCallback();
			}

		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("generalassignJob Error:"+msg + " errorCode:" + errorCode);
//		};
//		
//		UnityNet.reqGeneralAssignJob(params, okFunc, errorFunc );
		UnityNet.reqGeneralAssignJob(params, okFunc, null );
	}
	//END HERE: assign job -------------------------------------------------------------------------------->
	
	public	function	calcExpLvl(kid:String) :int[] {

		if(seed==null)
		{
			return [0,0,0];
		}
		var currentcityid:int = GameMain.instance().getCurCityId();
		if(seed["knights"]["city"+currentcityid] != null && seed["knights"]["city"+currentcityid]["knt"+kid] != null)
		{
			var exp:int = _Global.INT32(seed["knights"]["city"+currentcityid]["knt"+kid]["experience"]);
			var level:int = _Global.INT32(seed["knights"]["city"+currentcityid]["knt"+kid]["knightLevel"]);
			var oldMax:int = 0;
			var max:int = level * 20;
			
			for( var i:int = 1; i < level; i ++ ){
				oldMax += i * 20;
			}
			exp = exp - oldMax;

			return [exp, level, max];
		}
		
		return [0,0,0];
	}
	
	public	function	calcExpLvl(kid:String,knightCityId:int) :int[] {
		if(seed==null)
		{
			return [0,0,0];
		}
		var exp:int = _Global.INT32(seed["knights"]["city"+knightCityId]["knt"+kid]["experience"]);
		var level:int = _Global.INT32(seed["knights"]["city"+knightCityId]["knt"+kid]["knightLevel"]);
		var oldMax:int = 0;
		var max:int = level * 20;
		
		for( var i:int = 1; i < level; i ++ ){
			oldMax += i * 20;
		}
		exp = exp - oldMax;

		return [exp, level, max];
	}
	
//	private function popupUnassignTips(type:int, tips:String):void
//	{
//		var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
//		MenuMgr.getInstance().PushConfirmDialog(tips,"",null,null);
//		dialog.SetCancelAble(false);
//	}
	
	public	function	unassignKnight(positionId:int, iKnightId:int, okCallback:Function) 
	{
		var currentcityid:int = GameMain.instance().getCurCityId();	
//		switch(positionId)
//		{
//			case	POS_PRAETORIAN:
//				if(Barracks.instance().Queue.First() != null || Walls.instance().Queue.First() != null)
//				{
//					popupUnassignTips(positionId, Datas.getArString("Error.err_220"));
//					return;
//				}
//				break;
//				
//			case	POS_ACADEMIC:
//				if(Research.instance().getItemAtQueue(0,currentcityid) != null)
//				{
//					popupUnassignTips(positionId, Datas.getArString("Error.err_221"));
//					return;
//				}
//				break;
//				
//			case	POS_CONSTRUCTION:
//				if(BuildingQueueMgr.instance().first(currentcityid) != null)
//				{
//					popupUnassignTips(positionId, Datas.getArString("Error.err_222"));
//					return;
//				}
//				break;
//				
//			default:
//				break;
//		}
		

		var params:Array = new Array();
		params.Add(iKnightId);
		params.Add(currentcityid);

		var okFunc:Function = function(result:HashObject){
//			_Global.Log("unassignKnight OK");
			
			var arStrings:Datas = Datas.instance();
			UpdateSeed.instance().update_seed(result["updateSeed"]);
			
			switch( positionId ){
				case	POS_URBAN:
					seed["leaders"]["city"+currentcityid]["resourcefulnessKnightId"].Value = "0";
					break;
					
				case	POS_PRAETORIAN:
					seed["leaders"]["city"+currentcityid]["combatKnightId"].Value = "0";
					break;
					
				case	POS_ACADEMIC:
					seed["leaders"]["city"+currentcityid]["intelligenceKnightId"].Value = "0";
					break;
					
				case	POS_CONSTRUCTION:
					seed["leaders"]["city"+currentcityid]["politicsKnightId"].Value = "0";
					break;

                case POS_DEFENSE:
                    seed["leaders"]["city"+currentcityid]["defenseKnightId"].Value = "0";
                    break;
			}
			
			if( okCallback ){
				okCallback();
			}
			
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("unassignKnight Error:"+msg + " errorCode:" + errorCode);
//		};
//		
//		UnityNet.reqUnassignKnight(params, okFunc, errorFunc );
		UnityNet.reqUnassignKnight(params, okFunc, null );
	}
	
	// Returns the combat bonus a general is providing if assigned, as a float
    //
    public	function	combatBonus(){
    	var currentcityid:int = GameMain.instance().getCurCityId();
        var generalLevel:int = 0;
        var general:HashObject = seed["knights"]["city" + currentcityid];
        
        if (general) {
            general = general["knt" + seed["leaders"]["city" + currentcityid]["combatKnightId"].Value];
            if (general) {
                generalLevel = _Global.INT32(general["knightLevel"]);
  //              if (general["roleExpireUnixtime"] && (_Global.INT32(general["roleExpireUnixtime"]) - GameMain.unixtime()) > 0) {
//                    generalLevel = generalLevel * 1.25;
//                }
            }
        }
        return generalLevel * 0.005;
    }

	// Returns the politics bonus a general is providing if assigned, as a float
	//
	public	function	politicsBonus () :float{
		
		var currentcityid:int = GameMain.instance().getCurCityId();
		var knight:HashObject = seed["knights"]["city" + currentcityid];
		var	politicsLevel:int = 0;

		if (knight) {
			knight = knight["knt" + seed["leaders"]["city" + currentcityid]["politicsKnightId"].Value];
			if (knight) {
				politicsLevel = _Global.INT32(knight["knightLevel"]);
			}
		}
		return politicsLevel * 0.005;
	}
	
	// Returns the intelligence bonus a general is providing for the current city, as a float
    //
    public	function	intelligenceBonus():float{
    	var currentcityid:int = GameMain.instance().getCurCityId();
        var knight:HashObject = seed["knights"]["city" + currentcityid];
        var knightLevel:int = 0;
        
        if (knight) {
            knight = knight["knt" + seed["leaders"]["city" + currentcityid]["intelligenceKnightId"].Value];
            if (knight) {
                knightLevel = _Global.INT32(knight["knightLevel"]);
            }
        }
        return knightLevel * 0.005;
    } 
    
    public function InsertFteKnight(knightObj:HashObject) : boolean
    {   
    	var nodeCity:HashObject = null;
    	var currCityId:int = GameMain.instance().getCurCityId();
    	if (seed["knights"]["city" + currCityId])
		{
			nodeCity = seed["knights"]["city" + currCityId.ToString()];
		}
		else
		{
			nodeCity = new HashObject();
			seed["knights"]["city" + currCityId.ToString()] = nodeCity;
		}

		var knightId:int = _Global.INT32(knightObj["knightId"]);
		var existsKnight : HashObject = nodeCity["knt" + knightId.ToString()];
		if ( existsKnight == null || existsKnight["belongFteId"] != null )
		{
			nodeCity["knt" + knightId.ToString()] = knightObj;
			return true;
		}
		return false;
	} 

	public function RemoveFteKnight(knightObj:HashObject)
	{
    	var currCityId:int = GameMain.instance().getCurCityId();
    	var nodeCity:HashObject = seed["knights"]["city" + currCityId.ToString()];
		if (nodeCity != null )
		{
			var knightId:int = _Global.INT32(knightObj["knightId"]);
			nodeCity.Remove("knt" + knightId.ToString());
		}
    }
    
    public function ClearFteKnights()
	{
		var currCityId:int = GameMain.instance().getCurCityId();
    	var nodeCity:HashObject = seed["knights"]["city" + currCityId.ToString()];
		if (nodeCity != null )
		{
			var removeKeys:Array = new Array();
			for (var knightEnt:System.Collections.DictionaryEntry in nodeCity.Table)
			{
				var knightObj:HashObject = knightEnt.Value as HashObject;
				if (knightObj["belongFteId"])
				{
					var knightId:int = _Global.INT32(knightObj["knightId"]);
					removeKeys.Add("knt" + knightId.ToString());
					
				}
			}
			
			for (var i:int = 0; i < removeKeys.length; i++)
	    	{
	    		nodeCity.Remove(removeKeys[i] as String);
	    	}
	    	removeKeys.Clear();
		}
	}
    
    public function HasFteKnight():boolean
	{
		var currentcityid:int = GameMain.instance().getCurCityId();
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	var count:int = generals.length;
    	
    	var fteFakeKnight:HashObject = null;
    	for( var i:int = 0; i < count; i ++ )
    	{
    		if ((generals[i] as HashObject)["belongFteId"])
    		{
    			fteFakeKnight = generals[i];
    			break;
    		}
    	}
    	
    	return fteFakeKnight != null;
	}
	
    public	function	getGenerals():Array{
    	
    	var currentcityid:int = GameMain.instance().getCurCityId();
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	var count:int = generals.length;
    	var tmp:HashObject;
    	
    	var fteFakeKnight:HashObject = null;
    	for( var i:int = 0; i < count; i ++ )
    	{
    		if ((generals[i] as HashObject)["belongFteId"])
    		{
    			fteFakeKnight = generals[i];
    		}
    	}
    	
    	// Insert it at 0
    	if (null != fteFakeKnight)
    	{
    		generals.Sort(function(a:HashObject, b:HashObject)
    		{
    			if (a["belongFteId"] && null == b["belongFteId"])
    				return -1;
    				
    			if (null == a["belongFteId"] && null != b["belongFteId"])
    				return 1;
    			
    			// Level is descending order	
    			var aLvl:int = _Global.INT32(a["knightLevel"]);
    			var bLvl:int = _Global.INT32(b["knightLevel"]);
    			return bLvl - aLvl;
    		});
    	}
    	else
    	{
    		generals.Sort(function(a:HashObject, b:HashObject)
    		{
    			// Level is descending order	
    			var aLvl:int = _Global.INT32(a["knightLevel"]);
    			var bLvl:int = _Global.INT32(b["knightLevel"]);
    			return bLvl - aLvl;
    		});
    	}
    	
    	return generals;
    }
    
    public function GetGeneralIDs() : int[]
    {
    	var generals:Array = getGenerals();
    	var n:int = generals.length;
    	if(n <= 0 ) return null;
    	var ids:int[] = new int[n];
    	for(var i:int = 0;i<n;i++)
    	{
    		var hash:HashObject = (generals[i] as HashObject);
    		if(hash != null && _Global.INT32(hash["knightLocked"]) != 1)
    			ids[i] = _Global.INT32(hash["knightId"]);
    	}
    	return ids;
    }
    
    
    public	function	getUnassignedGenerals():Array{
    	var currentcityid:int = GameMain.instance().getCurCityId();
    	var leaders:HashObject = seed["leaders"]["city" + currentcityid];
    	var generals:Array = getGenerals();
    	
    	for( var i:int = generals.length - 1; i >= 0; i -- ){
    		var general:HashObject  = generals[i] as HashObject;
    		if( _Global.INT32(general["knightId"]) == _Global.INT32(leaders["politicsKnightId"])
    			|| _Global.INT32(general["knightId"]) == _Global.INT32(leaders["combatKnightId"])
    			|| _Global.INT32(general["knightId"]) == _Global.INT32(leaders["intelligenceKnightId"])
    			|| _Global.INT32(general["knightId"]) == _Global.INT32(leaders["resourcefulnessKnightId"])
                || _Global.INT32(general["knightId"]) == _Global.INT32(leaders["defenseKnightId"]) ){
    			generals.Remove(general);
    			}
    	}
    	return generals;
    }
    
    public	function	getLeaders():Array{
    
    	var currentcityid:int = GameMain.instance().getCurCityId();
    	var curCityOrder:int = GameMain.instance().getCurCityOrder();
    	var leaders:HashObject = seed["leaders"]["city" + currentcityid];
    	
    	var arStrings:Datas = Datas.instance();
    	var ret:Array;
    	if (GameMain.singleton.IsHideTroopLimitServer()) {
	    		ret=
	        [
	            {
	                "positionId":POS_URBAN,
	                "position":arStrings.getArString("Common.Urban"),
	                "info":arStrings.getArString("Generals.UrbanToolTip"),
	                "incumbent":"",
	                "kid":leaders["resourcefulnessKnightId"].Value
	            }
	            ,{
	                "positionId":POS_PRAETORIAN,
	                "position":arStrings.getArString("Common.Praetorian"),
	                "info":arStrings.getArString("Generals.PraetorianToolTip"),
	                "incumbent":"",
	                "kid":leaders["combatKnightId"].Value
	            }
	            ,{
	                "positionId":POS_ACADEMIC,
	                "position":arStrings.getArString("Common.Academic"),
	                "info":arStrings.getArString("Generals.AcademicToolTip"),
	                "incumbent":"",
	                "kid":leaders["intelligenceKnightId"].Value
	            }
	            ,{
	                "positionId":POS_CONSTRUCTION,
	                "position":arStrings.getArString("Common.Construction"),
	                "info":arStrings.getArString("Generals.ConstructionToolTip"),
	                "incumbent":"",
	                "kid":leaders["politicsKnightId"].Value
	            }
	        ];
	    	

	 		(ret[0] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["resourcefulnessKnightId"]));
	    	(ret[1] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["combatKnightId"]));
	    	(ret[2] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["intelligenceKnightId"]));
	        (ret[3] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["politicsKnightId"]));
    	}else{
		ret=
		        [
		            {
		                "positionId":POS_URBAN,
		                "position":arStrings.getArString("Common.Urban"),
		                "info":arStrings.getArString("Generals.UrbanToolTip"),
		                "incumbent":"",
		                "kid":leaders["resourcefulnessKnightId"].Value
		            }
		            ,{
		                "positionId":POS_PRAETORIAN,
		                "position":arStrings.getArString("Common.Praetorian"),
		                "info":arStrings.getArString("Generals.PraetorianToolTip"),
		                "incumbent":"",
		                "kid":leaders["combatKnightId"].Value
		            }
		            ,{
		                "positionId":POS_ACADEMIC,
		                "position":arStrings.getArString("Common.Academic"),
		                "info":arStrings.getArString("Generals.AcademicToolTip"),
		                "incumbent":"",
		                "kid":leaders["intelligenceKnightId"].Value
		            }
		            ,{
		                "positionId":POS_DEFENSE,
		                "position":arStrings.getArString("Generals.Defender"),
		                "info":arStrings.getArString("Generals.DefenderDesc"),
		                "incumbent":"",
		                "kid":_Global.GetString(leaders["defenseKnightId"])
		            }
		            ,{
		                "positionId":POS_CONSTRUCTION,
		                "position":arStrings.getArString("Common.Construction"),
		                "info":arStrings.getArString("Generals.ConstructionToolTip"),
		                "incumbent":"",
		                "kid":leaders["politicsKnightId"].Value
		            }
		        ];
		    	
		//    	(ret[0] as Hashtable)["incumbent"] = getKnightShowName(getKnightName(_Global.INT32(leaders["resourcefulnessKnightId"])), curCityOrder);
		//    	(ret[1] as Hashtable)["incumbent"] = getKnightShowName(getKnightName(_Global.INT32(leaders["combatKnightId"])), curCityOrder);
		//    	(ret[2] as Hashtable)["incumbent"] = getKnightShowName(getKnightName(_Global.INT32(leaders["intelligenceKnightId"])), curCityOrder);
		//    	(ret[3] as Hashtable)["incumbent"] = getKnightShowName(getKnightName(_Global.INT32(leaders["defenseKnightId"])), curCityOrder);
		//        (ret[4] as Hashtable)["incumbent"] = getKnightShowName(getKnightName(_Global.INT32(leaders["politicsKnightId"])), curCityOrder);

		 		(ret[0] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["resourcefulnessKnightId"]));
		    	(ret[1] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["combatKnightId"]));
		    	(ret[2] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["intelligenceKnightId"]));
		    	(ret[3] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["defenseKnightId"]));
		        (ret[4] as Hashtable)["incumbent"] = getKnightName(_Global.INT32(leaders["politicsKnightId"]));
    	}
         
    	return ret;
    	
    }
    public function getLeadersalary(generalId:int):int
    {
    	if( generalId == 0 )
    		return 0;
    	var currentcityid:int = GameMain.instance().getCurCityId();	
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	for( var general:Object in generals ){
    		if( _Global.INT32((general as HashObject)["knightId"]) == generalId ){
    			return _Global.INT32((general as  HashObject)["knightLevel"])*salaryRate;
    		}
    	}
    	return 0;
    }
    
    public function getLeadersalarySum(cityId:int):long
    {
    	var generals:Array = [0,0,0,0];
    	
    	var leaders:HashObject = seed["leaders"]["city" + cityId];
    	generals[0] = _Global.INT32(leaders["politicsKnightId"]);
    	generals[1] = _Global.INT32(leaders["combatKnightId"]);
    	generals[2] = _Global.INT32(leaders["intelligenceKnightId"]);
        generals[3] = _Global.INT32(leaders["defenseKnightId"]);
    	generals[4] = _Global.INT32(leaders["resourcefulnessKnightId"]);
    	
    	var sum:int = 0;
    	for(var i:int = 0;i < generals.length; i++)
    	{
    		sum += getLeadersalary(generals[i]);
    	}
    	return sum;
    }
    
    public function getLeaderSalaryRate():int
    {
    	return salaryRate;
    }
    public	function	getPosition(kid:String):int{
    	var currentcityid:int = GameMain.instance().getCurCityId();
    	var leaders:HashObject = seed["leaders"]["city" + currentcityid];
    	if( _Global.INT32(kid) == _Global.INT32(leaders["politicsKnightId"]) ){
    		return POS_CONSTRUCTION;
    	}
    	if( _Global.INT32(kid) == _Global.INT32(leaders["combatKnightId"]) ){
    		return POS_PRAETORIAN;
    	}
    	if( _Global.INT32(kid) == _Global.INT32(leaders["intelligenceKnightId"])){
    		return POS_ACADEMIC;
    	}
    	if( _Global.INT32(kid) == _Global.INT32(leaders["resourcefulnessKnightId"]) ){
    		return POS_URBAN;
    	}
        if (_Global.INT32(kid) == _Global.INT32(leaders["defenseKnightId"]))
        {
            return POS_DEFENSE;
        }
    	
    	return -1;
    }
    
    public function isRenamedKnithtName(id : int) : boolean
    {
    	var currentcityid:int = GameMain.instance().getCurCityId();	
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	for( var general:Object in generals ){
    		if( _Global.INT32((general as HashObject)["knightId"]) == id )
    		{
    			if((general as HashObject)["knightRemark"] != null && (general as HashObject)["knightRemark"].Value != "")
    			{
    				var curCityOrder:int = GameMain.instance().getCurCityOrder();
    				var name : String = (general as HashObject)["knightName"].Value.ToString();
    				var originalName : String = getKnightNameByCityOrderAndName(name, curCityOrder);
    				if(originalName == (general as HashObject)["knightRemark"].Value)
    				{ 
    					return false;
    				}
    				else
    				{
    					return true;
    				}   				
    			}
    			else
    			{
    				return false;
    			}
    		}
    	}
    	
    	return false;
    }
    
    public	function	getKnightName(id : int):String
    {  
    	if( id == 0 )
    		return "";
    		
    	var currentcityid:int = GameMain.instance().getCurCityId();	
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	for( var general:Object in generals ){
    		if( _Global.INT32((general as HashObject)["knightId"]) == id )
    		{
    			if((general as HashObject)["knightRemark"] != null && (general as HashObject)["knightRemark"].Value != "")
    			{
    				return (general as HashObject)["knightRemark"].Value;
    			}
    			else
    			{
    				var curCityOrder:int = GameMain.instance().getCurCityOrder();
    				var name : String = (general as HashObject)["knightName"].Value.ToString();
    				return getKnightNameByCityOrderAndName(name, curCityOrder);
    			}
    		}
    	}
    	
    	return "";
    }
    
    public function setKnightName(id:int ,newName:String)
    {
		var currentcityid:int = GameMain.instance().getCurCityId();	
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	for( var general:Object in generals )
    	{
    		if( _Global.INT32((general as HashObject)["knightId"]) == id )
    		{
    			(general as HashObject)["knightRemark"].Value = newName;
    		}
    	}
    }
    
    public	function	getKnightNameInTotalCities(id:int):String{
    
    	if( id == 0 || seed == null)
    		return "";
    	var	cities:HashObject = seed["cities"];
		var cityInfo:HashObject;
		for(var i:int = 0; i < GameMain.instance().getCitiesNumber();i++)
		{
			cityInfo = cities[_Global.ap+i];
	    	var currentcityid:int = _Global.INT32(cityInfo[_Global.ap+0]);	
	    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
	    	for( var general:Object in generals )
	    	{
	    		if( _Global.INT32((general as HashObject)["knightId"]) == id )
	    		{	    		
		    		if((general as HashObject)["knightRemark"] != null && (general as HashObject)["knightRemark"].Value != "")
	    			{
	    				return (general as HashObject)["knightRemark"].Value;
	    			}
	    			else
	    			{
	    				var curCityOrder:int = GameMain.instance().getCurCityOrder();
	    				var name : String = (general as HashObject)["knightName"].Value.ToString();
	    				return getKnightNameByCityOrderAndName(name, curCityOrder);
	    			}
	    		}
	    	}
	    }
    	
    	return "";
    }
    
    public	function	getOriginalKnightName(id:int):String{
    
    	if( id == 0 )
    		return "";
    	
    	var currentcityid:int = GameMain.instance().getCurCityId();	
    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
    	for( var general:Object in generals ){
    		if( _Global.INT32((general as HashObject)["knightId"]) == id ){
    			return (general as HashObject)["knightName"].Value;
    		}
    	}
    	
    	return "";
    }
    
    public	function	getOriginalKnightNameInTotalCities(id:int):String{
    
    	if( id == 0 || seed == null)
			return "";
		
		var	cities:HashObject = seed["cities"];
		
		if (cities==null)
		return "";
		var cityInfo:HashObject;
		for(var i:int = 0; i < GameMain.instance().getCitiesNumber();i++)
		{
			cityInfo = cities[_Global.ap+i];
			if (cityInfo==null) 
			continue;
	    	var currentcityid:int = _Global.INT32(cityInfo[_Global.ap+0]);	
	    	var generals:Array = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
	    	for( var general:Object in generals ){
	    		if( _Global.INT32((general as HashObject)["knightId"]) == id ){
	    			return (general as HashObject)["knightName"].Value;
	    		}
	    	}
	    }
    	
    	return "";
    }
    
}
