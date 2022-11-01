using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public class MergerServerUnit
	{
		private List<FromServerMsg> m_FromServerList = new List<FromServerMsg>();

		public MergerServerUnit( string targetServerName, long startTime, List<FromServerMsg> fromServerList )
		{
			TargetServerName = targetServerName;
			StartTime = startTime;
			m_FromServerList = fromServerList;
		}

		public string TargetServerName
		{
			get;
			set;
		}

		public long StartTime
		{
			get;
			set;
		}

		public List<FromServerMsg> FromServerList
		{
			get
			{
				return m_FromServerList;
			}
		}
	}

	public class FromServerMsg
	{
		public FromServerMsg(int id,string name)
		{
			ServerId = id;
			ServerName = name;
		}

		public int ServerId
		{
			get;
			set;
		}
		public string ServerName
		{
			get;
			set;
		}
	}
}