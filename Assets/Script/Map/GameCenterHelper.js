import UnityEngine;

public static class GameCenterHelper
{
	private static var gameCenterEnable:boolean = false;
	
	public static function SetEnable(val:boolean){
		 gameCenterEnable = val;
	}
	
	public	static	function isEnabled():boolean{
		if( Datas.GetPlatform() == Datas.AppStore.GooglePlay ){
		return NativeCaller.IsSignInGameServices();

		
		}else if( Datas.GetPlatform() == Datas.AppStore.ITunes ){
			return gameCenterEnable;
		}
		return false;
	}
	
	public static function Authenticate(){
		GameCenter.Authenticate();
	}
	
	public static function ReportAchievementProgress(id:String,progress:double)
	{
		if( !isEnabled() ){
			return;
		}
		
		GameCenter.ReportAchievementProgress(id, progress);
	}
	
	
	public static function ShowAchievementsUI()
	{
		if( !isEnabled() ){
			return;
		}
		
		GameCenter.ShowAchievementsUI();
	}
	
	
	public function SyncGameCenterAchievement()
	{
		SetEnable(true);
		var seed:HashObject = GameMain.instance().getSeed();
		if(seed == null || seed["gameCenter"] == null){
			return;
		}
		
		if(seed["gameCenter"]["unfinishedAchievements"] != null)
		{
			var failedAchievementKeys:Hashtable = seed["gameCenter"]["unfinishedAchievements"].Table;
			for(var idx:int = 0;idx < failedAchievementKeys.Count;idx++)
			{
				var achievement:HashObject = failedAchievementKeys[_Global.ap + idx];
				var achievementId:String = achievement.Value;
				ReportAchievementProgress(achievementId,100.0);
			}
		}
	
	}

	//leaderboard
	public static function ShowLeaderboardUI(){
		if( !isEnabled() ){
			return;
		}
		
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		GameCenter.ShowLeaderboardUI( deviceInfo );
	}
	
	public static function ReportScore(score:long,boardId:String,callback:Function)
	{
		if( !isEnabled() ){
			return;
		}
		
		GameCenter.ReportScore(score, boardId, callback);
	}
	
	public static function SyncGameCenterLeaderBoard()
	{
		if( !isEnabled() ){
			return;
		}
		
		if(RuntimePlatform.IPhonePlayer == Application.platform || RuntimePlatform.Android == Application.platform)
		{
			var ok:Function = function(result:HashObject){
				if(result["ok"]){
					var leaderboards:Array = _Global.GetObjectKeys(result["gc_leaderboard"]);
					_Global.Log("---------------leaderboard count:" + leaderboards.length);
					for(var i:int; i < leaderboards.length;i++){
						var boardId:String = leaderboards[i] + "";
						var score:long = _Global.INT64(result["gc_leaderboard"][boardId]);
						
						var log:String = String.Format("-------------score:{0},boardId:{1}",score,boardId);
						_Global.Log(log);
						ReportScore(score,boardId,null);
						//NativeCaller.ReportScore(score,boardId);
					}
				}
			};
			UnityNet.reqGameCenterLeaderBoardData(ok,null);
		}
	}
	
	//challenge
	public static function showChallengeUI(){
		if( !isEnabled() ){
			return;
		}
		
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		GameCenter.ShowGameCenterChallengesUI(deviceInfo);
		
	}
	
	public static function bindGameCenterId(playerId:String,alias:String,callback:Function)
	{
		var ok:Function = function(result:HashObject){
			
			Datas.instance().SetGameCenterPlayerId_Binded(playerId);
			Datas.instance().SetGameCenterAlias_Binded(alias);
			
			var tvuidServer:int = _Global.INT32(result["tvuid"]);
			if(tvuidServer != Datas.instance().tvuid())
			{	
				if(callback != null)
				{
					callback(true);
				}
			 	GameMain.instance().restartGame();
			}
			else
			{
				var worldIdArray:HashObject = result["worldid"];
				var worldid:int = _Global.INT32(worldIdArray[_Global.ap + 0]);
				
				var raceid:int = _Global.INT32( result["race"] );
				var data:Datas = Datas.instance();
				data.SaveServerDataForClient(result);
				data.setTvuid(tvuidServer);
				data.setWorldid(worldid);
//				data.setRaceId(raceid);
				SyncGameCenterAchievement();
				if(callback != null)
				{
					callback(false);
				}
			}
		};
		UnityNet.signup(Datas.instance().worldid(), ok,null,playerId,alias);
	}
	
	public static function switchGuestAccount(callback:Function)
	{
		Datas.instance().clearClientUserData();
		if(callback != null)
		{
			callback(true);
		}
		GameMain.instance().restartGame();
	}
	
	public static function switchGameCenterAccount(playerId:String,alias:String,callback:Function)
	{
		//bindGameCenterId(playerId:String,alias:String,callback:Function)
		
		Datas.instance().clearClientUserData();
		Datas.instance().SetGameCenterPlayerId(playerId);
		Datas.instance().SetGameCenterAlias(alias);
		
		Datas.instance().SetGameCenterPlayerId_Binded(playerId);
		Datas.instance().SetGameCenterAlias_Binded(alias);
		if(callback != null)
		{
			callback(true);
		}
		GameMain.instance().restartGame();
	}
}
