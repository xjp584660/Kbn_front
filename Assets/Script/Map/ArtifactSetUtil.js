//
//class	ArtifactSetUtil{
//
//	private	static	var	singleton:AddCityNew;
//	private var	seed:Object;
//	
//	public	static	function	instance(){
//		if( singleton == null ){
//			singleton = new AddCityNew();
//		}
//		return singleton;
//	}
//	
//	public	function	init( sd:Object ){
//		seed = sd;
//	}
//	
//	public	function	completeArtifactSet(iSetId:int) {
//	
//		var artifactData:Object = Datas.instance().artifactData();
//		
//		if ( seed["artifactSets"]["inprogress"] ) {
////			Modal.showAlert('An artifact set is already in progress.'); // XXX LOCALIZE
//			return false;
//		}
//
//		var setCraftable:boolean = true;
//		var items:Array = artifactData["artifactSets"][iSetId];
//		var i:int = 0;
//		for( i = 0; i < items.length; i ++ ){
//			if ( !seed["items"]["i"+items[i]] || seed["items"]["i"+items[i]] == 0 ) {
//				setCraftable = false;
//				break;
//			}
//		}
//		
//		if (!setCraftable) {
////			Modal.showAlert(printLocalError(null, 'You have not obtained the correct artifacts to finish this set.', null)); // XXX LOCALIZE
//			return false;
//		}
//
//		var params:Array = new Array();
//		
//		params.Add(iSetId);
//		
//		var okFunc:Function = function(result:Object){
//			_Global.Log("buildNewCity OK");
//			
//			if (result["completionTimeUT"] != -1 && result["inprogress"]) {
//				
//				items = artifactData["artifactSets"][iSetId];
//				
//				for( i = 0; i < items.length; i ++ ){
//					if ( seed["items"]["i"+items[i]] && seed["items"]['i'+items[i]] > 0 ) {
//						seed["items"]["i"+items[i]] = _Global.INT32(seed["items"]["i"+items[i]]) - 1;
//						
//					}
//				}
//
//				if(result["craftTime"] > 0) {
//					seed["artifactSets"]["inprogress"] = result["inprogress"];
//				}
////				Modal.hideModal();
//			}
//			if(result["craftTime"] > 0) {
////				queue_changetab_building();
//			}
//			else {
////				UpdateSeed.instance().update_seed_ajax(true);
//			}
//			return true;
//
//		};
//		
//		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("buildNewCity Error:"+msg);
//			
//			// XXX 
////			if (oResult.error_code === 4) {
////				Modal.showAlert('You have not met the requirements to create this artifact set.');
////				return;
////			}
////			Modal.showAlert(printLocalError((oResult.error_code || null), (oResult.msg || null), (oResult.feedback || null)));
//		};
//		
//		UnityNet.reqCompleteArtifactSet(params, okFunc, errorFunc );
//
//	}
//	
//}