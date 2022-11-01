
class	Embassy{
	private	static	var	singleton:Embassy;
	private var	seed:HashObject;
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Embassy();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
	}
	
	public	class	EncampedAlliesInfo{
		public	var	x:String;
		public	var	y:String;
		public	var	allyName:String;
		public	var	upkeep:int;
	}
	
	public	function	isInAlliance(){
		
		var allianceDiplomacies:HashObject = seed["allianceDiplomacies"];
		var allianceId:int = 0;
		if( allianceDiplomacies ){
			allianceId = _Global.INT32(allianceDiplomacies["allianceId"]);
		}
		return allianceId != 0;
	}
	
	public	function	encampedAllies():Array{
		if( !isInAlliance() ){
			return null;
		}
		
		var currentcityid:int = GameMain.instance().getCurCityId();
		var ret:Array = new Array();
		
		if( seed["queue_atkinc"] ){
			var values:Array = _Global.GetObjectValues(seed["queue_atkinc"]);
			var collectFunc:Function = function(march:HashObject){
				if (_Global.INT32(march["toCityId"]) == currentcityid &&
					march["marchStatus"] && 
					_Global.INT32(march["marchStatus"]) == Constant.MarchStatus.DEFENDING &&
					_Global.INT32(march["fromCityId"]) != currentcityid) {
					return march;
				}
			};
			var collectValues:Array = _Global.SelectArray(values, collectFunc);
			
			//var unitupkeeps:HashObject = Datas.instance().unitupkeeps();

			var unitupkeepsKeys:Array = (GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTroopIDs() as System.Collections.ArrayList).ToArray();
			var encampedAlliesInfo:EncampedAlliesInfo;
			var i:int;
			for( var march:Object in collectValues ){
				if(!march)
					continue;
				encampedAlliesInfo = new EncampedAlliesInfo();
//				for( i = 1; i <= 13; i ++ ){
//					if( unitupkeeps["" + i] != null ){
////						_Global.Log("i:" + i );
////						_Global.Log("i:" + i + " march = null:" + (march["unit" + i + "Count"] == null));
//						encampedAlliesInfo.upkeep += _Global.INT32(march["unit" + i + "Count"]) * _Global.INT32(unitupkeeps["" + i]);
//					}
//				}
				for( var dataKey:String in unitupkeepsKeys ){
					var _dataKey = dataKey.Substring(1);
					if((march as HashObject)["unit" + _dataKey + "Count"] != null){
						encampedAlliesInfo.upkeep += _Global.INT32((march as HashObject)["unit" + _dataKey + "Count"]) 
							* GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,_Global.INT32(_dataKey),Constant.TroopAttrType.UPKEEP);
					}
				}
				
				encampedAlliesInfo.allyName = "";
				if( seed["players"] && seed["players"]["u" + (march as HashObject)["fromPlayerId"].Value] ){
					encampedAlliesInfo.allyName = seed["players"]["u" + (march as HashObject)["fromPlayerId"].Value]["n"].Value;
				}
				
				encampedAlliesInfo.x = (march as HashObject)["fromXCoord"].Value;
				encampedAlliesInfo.y = (march as HashObject)["fromYCoord"].Value;
				
				ret.Push(encampedAlliesInfo);
			
			}
		}
		return ret;
	}
	
//	public	function	kickOutAllies (mid, cid, fromUid:int, fromCid:int, upkeep, modalType) {
//		
////		if(modalType === "EmbassyMain") {
////			KTrack.event(['_trackEvent', 'Embassy', 'SendHome', 'Default']);
////		} else if(modalType === "EmbassyDetails") {
////			KTrack.event(['_trackEvent', 'Embassy', 'SendHome', 'DetailView']);
////		}
//	
//		var	currentcityid:int = GameMain.instance().getCurCityId();
//		var params = new Array();
//		params.Add(mid);
//		params.Add(cid);
//		params.Add(fromUid);
//		params.Add(fromCid);
//		
//		var okFunc:Function = function(result:Object){
//			_Global.Log("kickOutAllies OK");
//			
//			var curmarch;
//			var	marchtime;
////			Modal.showAlert(arStrings.Embassy.TroopsSentHome);
//			seed["resources"]["city" + currentcityid]["rec1"][3] = _Global.INT32(seed["resources"]["city" + currentcityid]["rec1"][_Global.ap + 3]) - upkeep;
////			Modal.hideModalAll();
//			if ( fromUid == Datas.instance().tvuid()) {
//				curmarch = seed["outgoing_marches"]["c" + fromCid]["m" + mid];
//				marchtime = Mathf.Abs(_Global.INT32(curmarch["destinationUnixTime"]) - _Global.INT32(curmarch["eventUnixTime"]));
//				curmarch["returnUnixTime"] = GameMain.unixtime() + marchtime;
//				curmarch["marchStatus"] = Constant.MarchStatus.RETURNING;
//			}
////			delete seed.queue_atkinc["m" + mid]
//
//		};
//		
//		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("kickOutAllies Error:"+msg);
//		};
//		
//		UnityNet.reqMuseumBuyItem(params, okFunc, errorFunc );
//
//	}
}
