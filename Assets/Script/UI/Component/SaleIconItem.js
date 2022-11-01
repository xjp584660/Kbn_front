class SaleIconItem extends FullClickItem
{
	
	
	public function Init(data:Object)
	{
		super.Init();
		line.SetVisible(false);
		var notic:saleNotice = data as saleNotice;
		//var iconPath:String = notic.Image;
		//icon.image = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ActivitySpt().GetTile(notic.Image);
		//icon.tile.name = iconPath;
		//icon.tile.spt.edge = 0;
		btnDefault.mystyle.active.background = TextureMgr.instance().LoadTexture("a_0_square",TextureType.BACKGROUND);
		description.txt = notic.Title;
		btnDefault.OnClick = function(){
			UnityNet.SendNoticeBI(notic.SaleId);
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
		if(!visible)
			return;
		btnDefault.rect.x = System.Math.Min(icon.rect.x, description.rect.x);
		btnDefault.rect.y = System.Math.Min(icon.rect.y, description.rect.y);
		btnDefault.rect.width = System.Math.Max(icon.rect.xMax, description.rect.xMax) - btnDefault.rect.x;
		btnDefault.rect.height = System.Math.Max(icon.rect.yMax, description.rect.yMax) - btnDefault.rect.y;
		super.Draw();
		//GUI.BeginGroup(rect);
		//	icon.Draw();
		//	description.Draw();
		//GUI.EndGroup();
	   	return -1;
	}

	public function SetVisible(enable:boolean)
	{
		super.SetVisible(enable);
		icon.SetVisible(enable);
		description.SetVisible(enable);
		btnDefault.SetVisible(enable);
	}

//	public function Init()
//	{
//		super.Init();
//		line.rect = Rect(0, rect.height - 5, rect.width, 5);
//		icon.rect.y = 10;
//	}
}

