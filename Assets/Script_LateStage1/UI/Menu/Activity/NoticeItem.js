class NoticeItem extends FullClickItem
{
	public function SetRowData(data:Object)
	{
		var notic:Notice = data as Notice;
		description.txt = notic.Detail;
		//var iconPath:String = notic.Image;
		//icon.image = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ActivitySpt().GetTile(notic.Image);
		//icon.tile.name = iconPath;
		//icon.tile.spt.edge = 1;
		btnDefault.OnClick = function(){
			UnityNet.SendNoticeBI(notic.SaleId);
			MenuMgr.getInstance().PopMenu("");
			var urlPrefix:String = "url:";
			if(notic.Destination.StartsWith(urlPrefix))
			{
				var url:String = notic.Destination.Substring(urlPrefix.Length);
				url = url.Replace("$$USERID$$", "" + Datas.instance().tvuid());
				Application.OpenURL(url);
			}
			else
			{
				Linker.DefaultActionHandler(notic.Destination, notic.Param);
			}	
		};
	}
	
	public function Draw()
	{
		super.Draw();
		GUI.BeginGroup(rect);
			icon.Draw();
			description.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	public function Init()
	{
		super.Init();
		line.rect = Rect(25, 121, 500, 4);
//		icon.rect.y = 10;
	}
}

