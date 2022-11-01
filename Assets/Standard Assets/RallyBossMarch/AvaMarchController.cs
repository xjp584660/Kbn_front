using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;
using UnityEngine;

namespace KBN
{
	public class AvaMarchController {

		protected static AvaMarchController singleton = null;

		public static AvaMarchController instance()
		{
			if( singleton == null )
			{
				if (GameMain.singleton!=null)
				{
					singleton = new AvaMarchController();
					GameMain.singleton.resgisterRestartFunc(new Action(resginster));
				}
			}
			return singleton as AvaMarchController;
		}

		public void Init(Action action){
			NewSocketNet.instance.RegisterConnectedHandlers(action);
		}

		private static void resginster(){
			singleton = null;
		}

		protected Dictionary<int,PBMsgMarchInfo.PBMsgMarchInfo> MarchDic
			=new Dictionary<int,PBMsgMarchInfo.PBMsgMarchInfo>();

		public Dictionary<int,PBMsgMarchInfo.PBMsgMarchInfo> getMarchDic{
			get{ return MarchDic;}
		}

		public PBMsgMarchInfo.PBMsgMarchInfo getMarch(int marchId){
			return MarchDic.ContainsKey(marchId)?MarchDic[marchId]:null;
		}

		//march 信息变更 socket
		public void OnMarchReceive(PBMsgMarchInfo.PBMsgMarchInfo march){
			if (GameMain.GetIsShowAVAMarch())
			{
				AddMarch(march);
			}	
		}

		private bool IsMyMarch(int fromPlayerId){
			return fromPlayerId==GameMain.singleton.getUserId();
		}

		//添加March
		public void AddMarch(PBMsgMarchInfo.PBMsgMarchInfo march){
			if (IsMyMarch(march.fromPlayerId))
			{
				return;
			}
			if(MarchDic.ContainsKey(march.marchId)){
				MarchDic[march.marchId]=march;
			}else{
				MarchDic.Add(march.marchId,march);
			}

			if(GameMain.singleton.getMapController2()!=null){
			
				// if(!GameMain.singleton.getMapController2().IsFire(march.fromX,march.fromY,march.marchId)
				// 	&&!GameMain.singleton.getMapController2().IsFire(march.toX,march.toY,march.marchId)){
			
					GameMain.singleton.getMapController2().AddRallyAndBossMarchsInfo(march);
				// }
			}
			
		}
		//删除March,暂时没有用到
		public void DelMarch(PBMsgMarchInfo.PBMsgMarchInfo march){
			if(MarchDic.ContainsKey(march.marchId)){
				MarchDic.Remove(march.marchId);
			}
		}
	}
}
