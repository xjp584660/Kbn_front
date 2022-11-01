using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public class ServerMergeDetail
	{
		private List<FromServerDetail> m_DetailServerList = new List<FromServerDetail> ();
		
		public ServerMergeDetail( string targetServerName, int targetServerId,int lastChoiceServerId, long startTime, List<FromServerDetail> detailList)
		{
			TargetServerName = targetServerName;
			TargetServerId = targetServerId;
			LastChoiceServerId = lastChoiceServerId;
			StartTime = startTime;
			m_DetailServerList = detailList;
		}
		
		public string TargetServerName 
		{
			get;
			set;
		}

		public int TargetServerId 
		{
			get;
			set;
		}

		public int LastChoiceServerId
		{
			get;
			set;
		}
		
		public long StartTime
		{
			get;
			set;
		}
		
		public List<FromServerDetail> MyDetailServerList
		{
			get
			{
				return m_DetailServerList;
			}
		}
		
		public int GetTotalReturnGems()
		{
			int total = 0;
			foreach (FromServerDetail detailMsg in m_DetailServerList)
			{
				if( !detailMsg.bSelected )
					total += detailMsg.returnGems;
			}
			return total;
		}

		public int GetSelectServerId()
		{
			foreach (FromServerDetail detailMsg in m_DetailServerList)
			{
				if( detailMsg.bSelected )
				{
					return detailMsg.serverId;
				}
			}
			return 0;
		}

		public string GetCurServerName()
		{
			string retServerName = "";
			int curWorldId = Datas.singleton.worldid ();
			foreach (FromServerDetail detailMsg in m_DetailServerList)
			{
				if( detailMsg.serverId == curWorldId )
				{
					retServerName = detailMsg.serverName;
					break;
				}
			}
			return retServerName;
		}
	}


	public class FromServerDetail
	{
		public int serverId = 0;
		public string serverName;
		public long might = 0;
		public int cityCount = 0;
		public int returnGems = 0;
		public int level = 0;
		public bool bSelected = false;
		
		public FromServerDetail( int _id,string _name,long _might,int _cityCount,int _gems,int _level,bool bSelected=false )
		{
			serverId = _id;
			serverName = _name;
			might = _might;
			cityCount = _cityCount;
			returnGems = _gems;
			bSelected = false;
			level = _level;
		}
	}
}