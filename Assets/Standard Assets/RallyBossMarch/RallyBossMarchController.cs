using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;
using UnityEngine;

namespace KBN
{
	public class RallyBossMarchController {

		protected static RallyBossMarchController singleton = null;

		public static RallyBossMarchController instance()
		{
			if( singleton == null )
			{
				if (GameMain.singleton!=null)
				{
					singleton = new RallyBossMarchController();
					GameMain.singleton.resgisterRestartFunc(new Action(resginster));
				}
			}
			return singleton as RallyBossMarchController;
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
			AddMarch(march);
		}

		//添加March
		public void AddMarch(PBMsgMarchInfo.PBMsgMarchInfo march){
			if(MarchDic.ContainsKey(march.marchId)){
				MarchDic[march.marchId]=march;
			}else{
				MarchDic.Add(march.marchId,march);
			}

			if(GameMain.singleton.getMapController()!=null){
			
				if(!GameMain.singleton.getMapController().IsFire(march.fromX,march.fromY,march.marchId)
					&&!GameMain.singleton.getMapController().IsFire(march.toX,march.toY,march.marchId)){
			
					GameMain.singleton.getMapController().AddRallyAndBossMarchsInfo(march);
				}
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
