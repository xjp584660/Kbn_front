/*
 * @FileName:		MistExpeditionEventArgs.cs
 * @Author:			lisong
 * @Date:			2022-04-25 15:55:56
 * @UnityVersion:	2017.4.40c1
 * 
 * @Description:	MistExpeditionMapController 响应事件 类别
*/

using GameFramework;

namespace KBN
{


	/// <summary>
    /// 迷雾远征 地图刷新
    /// </summary>
	public class MistExpeditionEventArgs : GameEventArgs
	{

		public override int Id
		{
			get
			{
				return (int)EventId.MistExpeditionMapRefresh;
			}
		}

	}

	/// <summary>
	/// 迷雾远征 战斗事件点 - 战斗动画的显示状态
	/// </summary>
	public class MistExpeditionBattleAnimeEventArgs: GameEventArgs
	{
		private readonly int eventPointId = 0;
		public int EventPointId{
			get { return eventPointId; }
		}

		private readonly bool isBattling = false;
		public bool IsBattling {
			get { return isBattling; }
		}


		public MistExpeditionBattleAnimeEventArgs(int eventPointId, bool isBattling)
		{
			this.eventPointId = eventPointId;
			this.isBattling = isBattling;
		}

		public override int Id
		{
			get
			{
				return (int)EventId.MistExpeditionBattling;
			}
		}

	}



}