using System.Collections.Generic;
using System;
using KBN;
/*chat notice in global chat menu*/
public class ChatNotices{
	private	static ChatNotices singleton;
	private List<Notice> noticeList;
	private Notice currentNotice;
	private double displaySeconds = 0.0;
	
	private Notice urgentNotice = null;
	public	static	ChatNotices instance(){
		if( singleton == null ){
			singleton = new ChatNotices();
			GameMain.singleton.resgisterRestartFunc(new Action( delegate () {
				singleton = null;
			}));
		}
		return singleton;
	}
	
	public Notice UrgentNotice
	{
		get
		{
			return urgentNotice;
		}
	}
	
	public void InitChatNotices()
	{
		HashObject seed = GameMain.singleton.getSeed();
		Notice urgentIdTemp = null;
		HashObject chatSales = seed["chatSales"];
		if ( chatSales != null )
		{
			
			noticeList = new List<Notice>();
			string[] keys = _Global.GetObjectKeys(chatSales);
			for(var i=0;i<keys.Length;i++)
			{
				HashObject ntcObj = chatSales[keys[i]];
				Notice notice = new Notice();
				notice.Destination = _Global.ToString(ntcObj["destination"]);
				notice.Param = _Global.ToString(ntcObj["desParams"]);
				notice.Detail = _Global.ToString(ntcObj["detail"]);
				notice.Image = _Global.ToString(ntcObj["imgFile"]);
				notice.EmbedImage = _Global.ToString(ntcObj["embedImage"]);
				notice.SaleId = _Global.INT32(ntcObj["saleId"]);
				notice.Sort = _Global.INT32(ntcObj["sort"]);
				notice.Title = _Global.ToString(ntcObj["title"]);
				notice.WorldId = _Global.ToString(ntcObj["worldId"]);
				notice.Seconds = _Global.INT32(ntcObj["rollSeconds"]);
				int urgent = _Global.INT32(ntcObj["urgent"]);
				if(urgent == 1)
				{
					urgentIdTemp = notice;
				}
				noticeList.Add(notice);
			}
			noticeList.Sort((comparea, compareb) => {
				return comparea.Sort - compareb.Sort;
			});
			urgentNotice = urgentIdTemp;
		}
		else
		{
			noticeList = null;
		}
	}
	
	public List<Notice> GetNoticesList()
	{
		if(noticeList == null)
		{
			InitChatNotices();
		}
		return noticeList;
	}
	
	public Notice GetCurrentNotice()
	{
		if(noticeList == null || noticeList.Count ==0)
		{
			currentNotice = null;
			displaySeconds = 0;
		}
		else if(currentNotice == null)
		{
			if(noticeList != null && noticeList.Count > 0)
			{
				currentNotice = noticeList[0] as Notice;
				displaySeconds = currentNotice.Seconds;
			}
		}
		else if(displaySeconds <= 0)
		{
			if(noticeList != null && noticeList.Count > 0)
			{
				int index = 0;
				for(var i=0;i<noticeList.Count;i++)
				{
					if(currentNotice.SaleId == (noticeList[i] as Notice).SaleId)
					{
						index = i;
						break;
					}
				}
				if(index >= (noticeList.Count - 1))
				{
					index = 0;
				}
				else{
					index += 1;
				}
				
				currentNotice = noticeList[index] as Notice;
				displaySeconds = currentNotice.Seconds;
			}
			else
			{
				currentNotice = null;
			}
		}
		return currentNotice;
	}
	
	public void Update(double seconds)
	{
		if(currentNotice != null)
		{
			this.displaySeconds -= seconds;
		}
	}
}

