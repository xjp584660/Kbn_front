using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public partial class MergeServerManager
	{

		private ServerMergeDetail m_ServerMergeDetail = null;
		private List<MergerServerUnit> m_AllMergeList = new List<MergerServerUnit>();

		public List<MergerServerUnit> AllMergerServerList
		{
			get
			{
				return m_AllMergeList;
			}
		}


		public ServerMergeDetail MyServerMergeDetail
		{
			get
			{
				return m_ServerMergeDetail;
			}
		}


		//for test
//		public ServerMergeDetail GetMyDetail()
//		{
//			List <FromServerDetail> detailList = new List <FromServerDetail> ();
//			FromServerDetail detailItem = null;
//			for (int i=0;i<4;i++)
//			{
//				detailItem = new FromServerDetail(i+1,"Server" + i+ 1,10000+i+1,i+1,100+i+1,false);
//				detailList.Add(detailItem);
//			}
//			m_ServerMergeDetail = new ServerMergeDetail ("Server 5",0,GameMain.unixtime(),detailList);
//			return m_ServerMergeDetail;
//		}

//		public List<MergerServerUnit> GetAllServerList()
//		{
//			List <MergerServerUnit> mergeList = new List <MergerServerUnit> ();
//			MergerServerUnit mergeItem = null;
//			for(int i=0;i<5;i++)
//			{
//				List<FromServerMsg> serverList = new  List<FromServerMsg>();
//				FromServerMsg serverItem = null;
//				for(int j=0;j<5;j++)
//				{
//					serverItem = new FromServerMsg(j+i+1,"Server" + j+i+1);
//					serverList.Add(serverItem);
//				}
//
//				mergeItem = new MergerServerUnit("Server" + i +1,GameMain.unixtime(),serverList);
//				mergeList.Add(mergeItem);
//			}
//			m_AllMergeList = mergeList;
//			return m_AllMergeList;
//		}

	}


}