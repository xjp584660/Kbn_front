using UnityEngine;
using System;
using System.Collections;

namespace KBN {

	public class MapMoveAnimMgr : MonoBehaviour  {
		protected static	MapMoveAnimMgr singleton;
		
		protected Hashtable MoveObjList;  
		protected Hashtable MarchIdsToCity;
		public  GameObject troopObjPrefab;
		protected Hashtable m_MovementDic;

		public Vector3 troopOffset = new Vector3(-2, 2, -2);

		protected HashObject seed;
		
		protected	float tileWorldWidth;
		protected	float tileWorldHeight;
		protected	float xOrg;
		protected	float yOrg;
		
		public static bool isInitDone = false;
		protected double timeRemainingMS;
		protected long lastUnixTime;
		
		protected float moveObjOffset = 0.7f;

		public virtual void toFront() {}
		public virtual void toBack() {}
		
		public static MapMoveAnimMgr instance()
		{
			return singleton;
		}
		
		virtual public void init()
		{
			singleton = this;
			seed = GameMain.singleton.getSeed();
			MoveObjList = new Hashtable(); 
			MarchIdsToCity = new Hashtable();
			m_MovementDic = new Hashtable();
		}
		
		public void setTileWH(float xorg, float yorg, float width, float height)
		{
			tileWorldWidth = width;
			tileWorldHeight = height;
			xOrg = xorg;
			yOrg = yorg;
			isInitDone = true;
			timeRemainingMS = GameMain.unixtime();
			lastUnixTime = GameMain.unixtime();
		}

		public void AdjustMarchLineEndPoints(ref Vector3 st, ref Vector3 ed)
		{
			Vector3 dir = (ed - st).normalized;
			float cutlen = Mathf.Min(tileWorldWidth, tileWorldHeight) * 0.5f * 1.414f;
			st += cutlen * dir;
			ed -= cutlen * dir;
		}
	}

}
