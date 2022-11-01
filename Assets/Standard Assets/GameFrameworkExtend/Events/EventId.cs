//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace KBN
{
	/// <summary>
	/// 事件类型编号。
	/// </summary>
	public enum EventId
	{
		Reserved = 0,
		DownloadStart,
		DownloadUpdate,
		DownloadSuccess,
		DownloadFailure,
		DownloadCheckFailure,

        AvaPlayerSkillLevelUp,
        AvaUseItem,
        AvaMoveTile,
		AvaBuffListOk,
		AvaOutPostStatus,
		AvaStatus,
		AvaBuyItem,
		CampaignMode,
		MistExpeditionMapRefresh,/* 迷雾远征 事件 完成，刷新地图显示 */
		MistExpeditionBattling,/* 迷雾远征 战斗事件 动画显示状态 */
	}
}
