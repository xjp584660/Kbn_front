using UnityEngine;
using UnityEngine.SocialPlatforms.Impl;
using UnityEngine.SocialPlatforms;
using KBN;
using System;

public class GameCenter
{
	private static IAchievement[] archievements;
	
	public static void Authenticate()
	{
		if(RuntimePlatform.IPhonePlayer == Application.platform)
		{
			NativeCaller.AuthehticatLocalUser();
		}
	}

	//Achievement
	public static void ReportAchievementProgress(string id,double progress)
	{
		
		if( archievements == null )
		{
			reportAchievementAfterGetAchievements(id, progress);
		}
		else
		{
			reportAchievementProgressToGameCenter(id, progress);
		}
	}

	public static void  ShowAchievementsUI()
	{
		if( Datas.GetPlatform() == Datas.AppStore.ITunes )
		{
			Social.ShowAchievementsUI();
		}
		else if ( Datas.GetPlatform() == Datas.AppStore.GooglePlay )
		{
			NativeCaller.ShowAchievements();
		}
	}

	private static void reportAchievementProgressToGameCenter( string id, double progress )
	{
		if( achievementCompleted( id ) )
		{
			return;
		}
		
		if( Datas.GetPlatform() == Datas.AppStore.ITunes )
		{
			Social.ReportProgress(id,progress,success => {
				if( success ){
					reportAchievementStateToGameServer(id, success);
				}
			});
		}else if ( Datas.GetPlatform() == Datas.AppStore.GooglePlay ){
			NativeCaller.UnlockAchievement(id);
			reportAchievementStateToGameServer(id,true);
		}
	}

	private	static void reportAchievementStateToGameServer( string id, bool success )
	{
		int status = success?1:0;
		UnityNet.SyncAchievmentStatus(id,status + "");
	}

	private static bool achievementCompleted(string id)
	{
		if(archievements == null) return false;
		for(int i=0;i<archievements.Length;i++)
		{
			if(archievements[i].id == id)
			{
				return archievements[i].completed;
			}
		}
		return false;
	}

	private static void reportAchievementAfterGetAchievements(string id, double progress)
	{
		
		if( Datas.GetPlatform() == Datas.AppStore.ITunes )
		{
			Social.LoadAchievements( achvs => {
				archievements = achvs;
				reportAchievementProgressToGameCenter(id, progress);
			});
		}
		else if ( Datas.GetPlatform() == Datas.AppStore.GooglePlay )
		{
			reportAchievementProgressToGameCenter(id, progress);
		}
	}

	//leaderboard
	public static void ShowLeaderboardUI(Datas.DeviceInfo deviceInfo)
	{
		if( Datas.GetPlatform() == Datas.AppStore.ITunes )
		{
			if(deviceInfo != null)
			{
				if(deviceInfo.IsSupportGameCenterV6() == false)
				{
					Social.ShowLeaderboardUI();
				}
				else
				{
					NativeCaller.ShowGameCenterLeaderboards();		
				}
			}
		}
		else if ( Datas.GetPlatform() == Datas.AppStore.GooglePlay )
		{
			NativeCaller.ShowLeaderboard();
		}
	}

	public static void ReportScore(long score,string boardId, MulticastDelegate callback)
	{
		if(RuntimePlatform.IPhonePlayer == Application.platform)
		{
			_Global.Log("Social.ReportScore report score to gamecenter");
			Social.ReportScore(score, boardId, null);
		}
		else if (RuntimePlatform.Android == Application.platform)
		{
			NativeCaller.SubmitScore(boardId, score);
		}
	}

	//challenges
	public static void ShowGameCenterChallengesUI(Datas.DeviceInfo deviceInfo)
	{
		if (RuntimePlatform.Android == Application.platform)
		{
			
		}
		else if(RuntimePlatform.IPhonePlayer == Application.platform)
		{
			NativeCaller.ShowGameCenterChallenges();
		}
	}
}