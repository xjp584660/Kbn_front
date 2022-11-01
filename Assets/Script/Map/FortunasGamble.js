//
//class FortunasGamble{
//	private	static	var	singleton:FortunasGamble;
//	private var	seed:Object;
//	
//	public	static	function	instance(){
//		if( singleton == null ){
//			singleton = new FortunasGamble();
//			GameMain.instance().resgisterRestartFunc(function(){
//				singleton = null;
//			});
//		}
//		return singleton;
//	}
//	
//	public	function	init( sd:Object ){
//		seed = sd;
//	}
//	
//	public	function	chooseMmbCard (id:int) {
//	
//		var okFunc:Function = function(rslt:Object){
////			_Global.Log("chooseMmbCard OK");
//			
////			Modal.hideModal();
//			if (seed["items"]["i" + rslt["prize"]]) {
//				seed["items"]["i" + rslt["prize"]] = _Global.INT32(seed["items"]["i" + rslt["prize"]]) + 1;
//			} else {
//				seed["items"]["i" + rslt["prize"]] = 1;
//			}
//			// deduct mmb tokens
////			if (MyItems.countForItem(599) > 0) {
////			  	MyItems.subtractItem(599);
////			}
//
////			var itemids = rslt["boxes"];
////			var html1 = new Array();
////			var temp = -1;
////			for ( var i = 0; i < itemids.length; i++) {
////				if (itemids[i] == rslt.prize) {
////					if (i != id) {
////						temp = i;
////					}
////				}
////			}
////
////			if (temp > -1) {
////				var temmp_value = itemids[id];
////				itemids[id] = itemids[temp];
////				itemids[temp] = temmp_value;
////			}
////
////			for ( var i = 0; i < itemids.length; i++) {
////				if (itemids[i] == rslt.prize && id == i) {
////					html1
////							.push(FortunasGamble
////									.renderTemplate(
////											"playFortunasGambleCardItemSelected",
////											{
////												"itemId" :itemids[i],
////												"itemName" :arStrings.itemName["i"
////														+ itemids[i]],
////												"itemDesc" :arStrings.itemDesc["i"+ itemids[i]].replace("'","\\'")
////											}));
////				} else {
////					html1
////							.push(FortunasGamble
////									.renderTemplate(
////											"playFortunasGambleCardItem",
////											{
////												"itemId" :itemids[i],
////												"itemName" :arStrings.itemName["i"
////														+ itemids[i]],
////												"itemDesc" :arStrings.itemDesc["i"
////														+ itemids[i]].replace("'","\\'"),
////												"xOffset": i * 100
////											}));
////				}
////			}
////
////			var cards_set = html1.join("");
////			var html = FortunasGamble
////					.renderTemplate(
////							"renderPickCardPage",
////							{
////								"cards_set" :cards_set,
////								"itemId" :rslt.prize,
////								"win_title" :arStrings.fortuna_gamble.win_title,
////								"win_text" :arStrings.fortuna_gamble.win_text,
////								"win_claimButton" :'Claim Reward', // XXX LOCALIZE
////								"win_skipButton" :arStrings.fortuna_gamble.win_skipButton,
////								"win_youWon" :arStrings.fortuna_gamble.win_youWon,
////								"win_share":arStrings.fortuna_gamble.win_share,
////								"chooseToShareHTML":(FortunasGamble.bShare ? "checked='true' " : ""),
////								"itemName" :arStrings.itemName["i"
////										+ rslt.prize]
////							});
////			Modal.showModal(740, 400, 10, 10,
////					"Daily Air Drop", html, null, null,
////					Constant.Modal.FORTUNA);
//		};
//		
////		var	errorFunc:Function = function(msg:String, errorCode:String){
////			_Global.Log("chooseMmbCard Error:"+msg);
////		};
////		
////		UnityNet.reqChooseMmbCard(null, okFunc, errorFunc );
//		UnityNet.reqChooseMmbCard(null, okFunc, null );
//		
//	}
//	
//	public	function	getToken () {
//		var itemcost:int = 5;
//		var iid:int = 599;
//		if (itemcost > seed["player"]["gems"]) {
////			Shop.buyNotEnough();
//		} else {
//		
//			var params:Array = new Array();
//			params.Add(iid);
//	
//			var okFunc:Function = function(result:Object){
////				_Global.Log("getToken OK");
//				
//				Resource.instance().updateHardCurrency(_Global.INT32(seed["player"]["gems"]) - itemcost);
//				var quant = _Global.INT32(seed["items"]["i" + iid]);
//				if (quant) {
//					seed.items["i" + iid] = quant + 1;
//				} else {
//					seed.items["i" + iid] = 1; // quant was NaN or null, treat as 0
//				}
//				
////				Modal.hideModal();
////				FortunasGamble.renderFortunasGamblePage();
//
//			};
//			
////			var	errorFunc:Function = function(msg:String, errorCode:String){
////				_Global.Log("getToken Error:"+msg);
////				
//////				if (rslt.error_code && rslt.error_code == 701) {
//////					var txt = g_js_strings.modal_shop_buy.nolongersale
//////							.replace("%1$s", rslt.feedback);
//////					var btns = "<a class='button20' onclick='Modal.hideModal();Shop.buy("
//////							+ iid + ");return false;'>";
//////					btns += "<span>";
//////					btns += g_js_strings.commonstr.buy;
//////					btns += "</span>";
//////					btns += "</a>";
//////					btns += "<a class='button20' onclick='$(\"modal_item_"
//////							+ iid
//////							+ "\").select(\".buyitem\")[0].show();Modal.hideModal();return false;'>";
//////					btns += "<span>";
//////					btns += g_js_strings.commonstr.cancel;
//////					btns += "</span>";
//////					btns += "</a>";
//////
//////					Modal.showAlert(txt, btns);
//////
//////				} else {
//////					Modal.showAlert(printLocalError(
//////							(rslt.error_code || null),
//////							(rslt.msg || null),
//////							(rslt.feedback || null)));
//////				}
////			};
////			
////			UnityNet.reqGetToken(params, okFunc, errorFunc );
//			UnityNet.reqGetToken(params, okFunc, null );
//		}
//
//	}
//}