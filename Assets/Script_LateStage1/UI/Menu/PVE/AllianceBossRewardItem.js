class AllianceBossRewardItem extends ListItem
{
	@SerializeField private var rankIcon :SimpleLabel;
	@SerializeField private var rankName :SimpleLabel;
	@SerializeField private var line :SimpleLabel;
	@SerializeField private var viewBtn :Button;
	private var dataReward:Hashtable;
	public function Init():void
	{
		super.Init();
		viewBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		viewBtn.txt = Datas.getArString("Common.View");
		viewBtn.OnClick = handleClick;
		
		if(line.mystyle.normal.background == null)
		{
			line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
		}
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
			rankIcon.Draw();
			rankName.Draw();
			line.Draw();
			viewBtn.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		dataReward = data as Hashtable;
		if(_Global.INT32(dataReward["nIndex"])>=5)
		{
			rankIcon.txt=dataReward["nIndex"]+"";
		}
		else
		{
			rankIcon.txt="";
		}
		rankIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("Rank_"+dataReward["nIndex"],TextureType.DECORATION);
		rankName.txt = String.Format(Datas.getArString("PVP.Event_Detail_Rank"),dataReward["min"],dataReward["max"]);
	}
	
	public function handleClick()
	{
		var id:HashObject = new HashObject({"Category":"Chest",
												"inShop":false,
												"hasReward":false,
												"bonus":dataReward["bonus"],
												"isAlliance":dataReward["isAlliance"]
												});
		MenuMgr.getInstance().PushMenu("ChestDetail4IndividualProps", id, "trans_zoomComp");
	}
}

//Rank_1