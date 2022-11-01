
public class PassMissionMapRewardItem extends ListItem
{
	public var itemCount : Label;
	public var itemIcon : Label;
	public var btn : Button;
	public var itemPic : ItemPic;
	public var reward : SeasonPassMapReward;
    public function Init()
    {
		super.Init();
		this.itemIcon.OnClick = OnBtnClicked;
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);		
	}

	public function DrawItem()
	{
		//GUI.BeginGroup(rect);
		//itemIcon.Draw();
		itemPic.Draw();
		itemCount.Draw();
		this.btn.Draw();
		//GUI.EndGroup();	
	}

	private function OnBtnClicked(param : System.Object) : void
    {
        var temprect : Rect = btn.GetAbsoluteRect();
		if (temprect!=null)
		{
		    var x : float = temprect.x + (temprect.width / 2);
			var y : float = temprect.y + (temprect.height / 2);
			
			var msg : String = Datas.getArString("itemName.i" + this.reward.ItemId);
			MenuMgr.getInstance().PushTips(msg, x,y);
		}
		this.btn.SetVisible(false);
		this.btn.SetVisible(true);
    }

	public function SetRowData(data:Object)
	{
		this.btn.OnClick = OnBtnClicked;
        var texMgr : TextureMgr = TextureMgr.instance();
		reward = data as SeasonPassMapReward;		
		//itemIcon.tile.name = texMgr.LoadTileNameOfItem(reward.ItemId);	
		itemPic.SetId(this.reward.ItemId);
		
		if(reward.ItemCount > 1)
		{
			this.itemCount.txt = "x" + reward.ItemCount.ToString();
			this.itemCount.SetVisible(true);
		}
		else
		{
			this.itemCount.txt = "";
			this.itemCount.SetVisible(false);
		}

		this.btn.SetVisible(false);
		this.btn.SetVisible(true);
	}
}