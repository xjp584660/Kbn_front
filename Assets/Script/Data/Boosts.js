
class Boosts
{
//	private	var	seed:Object;
//	private	static	var	singleton:Boosts;
//	
//	public	static	function	instance(){
//		if( singleton == null ){
//			singleton = new Boosts();
//		}
//		
//		return singleton;
//	}
//
//	function update_boosts(){
///*	var hasprod=false;
//	var hascom=false;
//	var hasfog=false;
//	var aTime=[];
//	var ut=unixtime();
//	if(_Global.INT32(seed.playerEffects['fogExpire'],10)>ut || _Global.INT32(seed.player.truceExpireUnixTime)>ut || (_Global.INT32(seed.player.warStatus) === 2 && _Global.INT32(seed.player["beginnerProtectionExpireUnixTime"])>ut)){
//		hasfog=true;
//	}
//	
//	for(var i=0;i<5;i++){
//		var id = 1000 + 100*i;
//		var expireTime = _Global.INT32(seed.bonus["bC"+id]["bT" + (id + 1)]);
//
//		if(expireTime > ut){
//			if($('boost'+i).hasClassName('inactive')){
//				$('boost'+i).removeClassName('inactive');
//			}
//			$('boost'+i).addClassName('active');
//			// Ensure that there's only two slots for time. (DD HH or HH MM) 
//			remainingTime = expireTime-ut;
//			$('boost'+i+'_time').innerHTML = ((timestr(remainingTime)).split(' ', 2)).join(' ');
//			if (i===0){
//				text = '100%';
//			} else{
//				text = '25%';
//			}
//			hasprod = true;
//			aTime.push(remainingTime);
//			$('boost'+i+'_per').innerHTML = text;
//		} else {
//			if ($('boost'+i).hasClassName('active')){
//				$('boost'+i).removeClassName('active');
//			}
//			$('boost'+i).addClassName('inactive');
//			$('boost'+i+'_time').innerHTML = '&nbsp;';
//			$('boost'+i+'_per').innerHTML = '&nbsp;';			
//		}
//		
//	}
//
//	if(_Global.INT32(seed.bonus["bC2600"]["bT2601"])>ut || _Global.INT32(seed.bonus["bC2700"]["bT2701"])>ut){
//		hascom=true;
//	}
//	if(hasfog){
//		$("maparea_boosts_fog").show();
//	}else{
//		$("maparea_boosts_fog").hide();
//	}
//	if (!hasprod){
//		BoostTracker.activeBoost = false;
//		BoostTracker.secondBoostOn = false;	
//	} else {
//		BoostTracker.secondBoostOn = (aTime.min() <= Constant.Time.HOUR  );
//		BoostTracker.activeBoost = true;
//	
//	}
//
//	if(hascom){
//		$("maparea_boosts_combat").show();
//	}else{
//		$("maparea_boosts_combat").hide();
//	}
//	if(hasprod || hascom || hasfog){
//		$("maparea_boosts").show();
//	}else{
//		$("maparea_boosts").hide();
//	}*/
//}
}

