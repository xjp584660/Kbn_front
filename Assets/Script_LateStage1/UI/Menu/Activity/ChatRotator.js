#pragma strict

public class ChatRotator extends KBN.ChatRotator {

	protected override function View(notice : Notice) : void {
		UnityNet.SendNoticeBI(notice.SaleId);
		MenuMgr.instance.PopMenu("");

		if(notice.Destination.StartsWith(urlPrefix))
		{
			var url = notice.Destination.Substring(urlPrefix.Length);
			url = url.Replace("$$USERID$$", "" + Datas.singleton.tvuid());
			Application.OpenURL(url);
		}
		else
		{
			Linker.DefaultActionHandler(notice.Destination, notice.Param);
		}
	}

}
