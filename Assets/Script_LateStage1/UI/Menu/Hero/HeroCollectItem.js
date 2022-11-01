public class HeroCollectItem extends ListItem
{
	private enum HeroCollectItemStatus
	{
		Free,
		City,
		Unlock,
		Lock
	};
	
	// Common status
	@SerializeField
	private var headBack : Label;
	@SerializeField
	private var head : Label;
	@SerializeField
	private var detail : Button;
	@SerializeField
	private var frame : Label;
	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var level : Label;
    // Special status
    @SerializeField
    private var cityBack : Label;
    @SerializeField
	private var city : Label;
	@SerializeField
	private var lock : Label;
	@SerializeField
	private var elevate : Label;
	
	private var status : HeroCollectItemStatus = HeroCollectItemStatus.Free;
	private var heroInfo : KBN.HeroInfo = null;
	
	public function Init() : void
	{
	    city.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_city");
	    lock.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_collect_lock");
		elevate.setBackground("icon_hero_collection_elevate",TextureType.DECORATION);
		detail.OnClick = OnDetailClick;
	}
	
	public function Update() : void
	{
	}
	
	public function Draw() : int
	{
        if (heroInfo == null)
        {
            return;
    	}
    	
		GUI.BeginGroup(rect);
		headBack.Draw();
		frame.Draw();
		detail.Draw();
		if (status == HeroCollectItemStatus.Unlock || status == HeroCollectItemStatus.Lock)
		{
		    var oldColor : Color = GUI.color;
		    GUI.color = Color(0.3f, 0.3f, 0.3f, 1.0f);
		    head.Draw();
		    GUI.color = oldColor;
		}
		else
		{
		    head.Draw();
		}
		switch (status)
		{
		case HeroCollectItemStatus.Free:
			break;
		case HeroCollectItemStatus.City:
            cityBack.Draw();
		    city.Draw();
			break;
		case HeroCollectItemStatus.Unlock:
			break;
		case HeroCollectItemStatus.Lock:
		    lock.Draw();
			break;
		}
		heroName.Draw();
		level.Draw();
		elevate.Draw();
		GUI.EndGroup();
		
		return -1;
	}
	
	public function SetRowData(data : Object) : void
	{
	    heroInfo = data as KBN.HeroInfo;
	    UpdateData();
	}

	public function UpdateData() : void
    {
        if (heroInfo == null)
	    {
            return;
    	}

        heroName.txt = heroInfo.Name;
	    switch (heroInfo.Status)
	    {
	        case KBN.HeroStatus.Locked:
	            status = HeroCollectItemStatus.Lock;
	            level.txt = String.Format(Datas.getArString("HeroHouse.Collection_Level"), "???");
	            break;
	        case KBN.HeroStatus.Unlocked:
	            status = HeroCollectItemStatus.Unlock;
	            level.txt = String.Format(Datas.getArString("HeroHouse.Collection_Level"), "???");
	            break;
	        case KBN.HeroStatus.Assigned:
	        case KBN.HeroStatus.Marching:
	        case KBN.HeroStatus.Sleeping:
	            status = HeroCollectItemStatus.City;
	            level.txt = String.Format(Datas.getArString("HeroHouse.Collection_Level"), heroInfo.Level.ToString());
	            city.txt = (KBN.HeroManager.Instance.GetHeroCityIndex(heroInfo.Id) + 1).ToString();
	            break;
	        case KBN.HeroStatus.Unassigned:
	            status = HeroCollectItemStatus.Free;
	            level.txt = String.Format(Datas.getArString("HeroHouse.Collection_Level"), heroInfo.Level.ToString());
	            break;
	    }
	    headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
	    head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
	    elevate.txt = heroInfo.Elevate.ToString();
	    elevate.SetVisible(heroInfo.Elevate >= 1);
    }
	
	private function OnDetailClick(param : Object) : void
	{
		var heroCollect : HeroCollect = MenuMgr.getInstance().getMenu("HeroCollect") as HeroCollect;
		if (heroCollect == null)
		{
		    return;
		}

		heroCollect.OpenHeroDetail(heroInfo);
	}
}