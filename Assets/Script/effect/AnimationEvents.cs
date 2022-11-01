using UnityEngine;
using System.Collections;

namespace KBN
{ 
	public class AnimationEvents : MonoBehaviour {

		public void  OnEvent_UnlockPveLevel()
		{
			int levelSlotId = _Global.INT32(transform.parent.parent.name);
			GameMain.singleton.UnlockPveLevel_Step2(levelSlotId);
		}

		public void  OnEvent_UnlockPveLevel2()
		{
			SoundMgr.instance().PlayEffect("kbn_pve_newrecord", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
			int levelSlotId = _Global.INT32(transform.parent.parent.name);
			GameMain.singleton.UnlockPveLevel_Step3(levelSlotId);
		}

		public void OnEvent_UnlockPveBoss()
		{
			GameMain.singleton.UnlockPveBoss_Step2();
		}

		public void OnEvent_ChapterCloudDisappearOnEnter()
		{
			PveController.instance ().OnEnterChapter ();
			Destroy(transform.parent.gameObject);
		}

		public void OnEvent_ScreenWhite()
		{
			GameMain.singleton.loadLevel(GameMain.CHAPTERMAP_SCENE_LEVEL);
		}

		public void OnEvent_FogDisappear()
		{
			int mapId = _Global.INT32 (gameObject.name);
			PveController.instance ().OnMapUnlock (mapId);
			Destroy (gameObject);
		}

		public void OnEvent_IntoChapter()
		{
			Destroy (gameObject);
			GameMain.singleton.CreateScreenWhiteAnimation();
		}

		public void OnEvent_UnlockChapter()
		{
			KBN.GameMain.singleton.UnlockPveNextChapter_Step2();
		}

		public void OnEvent_FlagDown()
		{
			GameMain.singleton.PveChapterCheckUnlockLevel();
		}

		public void OnEvent_PveLoadingOver()
		{
			GameMain.singleton.CheckPveGds();
		}

		public void OnEvent_PveTipsOver()
		{
			GameMain.singleton.ForceTouchForbidden = false;
			Destroy (transform.parent.gameObject);
		}

		public void OnEvent_PlaySoundEffect()
		{
			SoundMgr.instance().PlayEffect("open_rally_point", TextureType.AUDIO_OPENMENU);
		}

		public void OnEvent_AllianceBossAnimationOver()
		{
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_ANIMATION_NOTICE,"Over");
		}

		public void OnEvent_AllianceBossLeftOutOver()
		{
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_ANIMATION_NOTICE,"LeftOut");
		}

		public void OnEvent_AllianceBossRingtOutOver()
		{
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_ANIMATION_NOTICE,"RightOut");
		}

		public void OnEvent_AllianceBossShakeOver()
		{
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_ANIMATION_NOTICE,"ShakeOver");
		}

		public void OnEvent_AllianceBossDieOver()
		{
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_ANIMATION_NOTICE,"DieOver");
		}

		public void CreateAttackAnimation()
		{
			GameMain.singleton.CreateAllianceBossAttackAni ();
		}

		public void DestroyCurAni()
		{
			Destroy (transform.gameObject);
		}

		public void GotoAVAMinimap()
		{
			GameMain.singleton.GotoAVAMinimap();
		}

		/// <summary>
		/// 进入 迷雾远征，云层关闭遮罩动画结束后的 触发事件
		/// </summary>
		public void OnEvent_GotoMistExpedition_CloudCloseAnimeMaskOver()
		{
			GameMain.singleton.CheckGotoMistExpedition();
		}

		/// <summary>
		/// 进入 迷雾远征，云层开启遮罩动画结束后的 触发事件
		/// </summary>
		public void OnEvent_GotoMistExpedition_CloudOpenAnimeMaskOver()
		{
			GameMain.singleton.CheckMistExpeditionCloudAnimationOver();
		}


		/// <summary>
		/// 退出 迷雾远征，云层关闭遮罩动画结束后的 触发事件
		/// </summary>
		public void OnEvent_ExitMistExpedition_CloudCloseAnimeMaskOver()
		{
			GameMain.singleton.CheckExitMistExpedition();
		}
		/// <summary>
		/// 退出 迷雾远征，云层开启遮罩动画结束后的 触发事件
		/// </summary>
		public void OnEvent_ExitMistExpedition_CloudOpenAnimeMaskOver()
		{
			GameMain.singleton.CheckMistExpeditionCloudAnimationOver(); 
		}
	}
}