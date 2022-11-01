public class AllianceInfoItem extends FullClickItem
{
	public var l_canJoin: Label;
	public var l_index	:Label;
	public var l_emblem :AllianceEmblem;
	public var l_aname	:Label;
	public var l_owner	:Label;
	public var l_num	:Label;
	public var l_might	:Label;
	public var clipWidth:float;

	protected var avo:AllianceVO;

	public function Draw()
	{
		GUI.BeginGroup(rect);
		DrawDefaultBtn();
		line.Draw();

		btnSelect.Draw();
		l_index.Draw();
		l_emblem.Draw();
		l_aname.Draw();
		l_owner.Draw();
		l_num.Draw();
		l_might.Draw();
		l_canJoin.Draw();

		GUI.EndGroup();
	}

	public function SetRowData(data:Object):void
	{
		//Init();

		btnDefault.OnClick = onClick;
		btnSelect.OnClick = onClick;

		this.avo = data as AllianceVO;
		l_aname.txt = _Global.GUIClipToWidth(l_aname.mystyle, avo.name, clipWidth, "...", null);
		l_owner.txt = _Global.GUIClipToWidth(l_owner.mystyle, avo.leaderName, clipWidth, "...", null);
		l_num.txt = "" + avo.membersCount;
		if(Alliance.getInstance().RankType == Constant.AllianceRankType.LEVEL)
		{
			l_might.txt = avo.level.ToString();
		}
		else if(Alliance.getInstance().RankType == Constant.AllianceRankType.LEAGUE)
		{
			l_might.txt = Datas.getArString("LeagueName.League_" + avo.league);
		}
		else
		{
			l_might.txt = _Global.NumSimlify(avo.might, Constant.MightDigitCountInList, false);
		}
		l_index.txt = "" + avo.topIndex;

		var plyLevel = GameMain.instance().getPlayerLevel();
		var plyMight : long = GameMain.instance().getPlayerMight();
		var canJoin : boolean = true;
		var textureMng : TextureMgr = TextureMgr.instance();
		if ( avo.minLevelCanJoin <= plyLevel && avo.minMightCanJoin <= plyMight )
		{
			this.l_canJoin.mystyle.normal.background = textureMng.LoadTexture("icon_satisfactory", TextureType.ICON);
		}
		else
		{
			this.l_canJoin.mystyle.normal.background = textureMng.LoadTexture("icon_unsatisfactory", TextureType.ICON);
		}
		
		if (null != avo.emblem)
		{
			l_emblem.Data = avo.emblem;
			l_emblem.SetVisible(true);
		}
		else
		{
			l_emblem.SetVisible(false);
		}
	}

	private function onClick(obj:Object)
	{
		if(this.handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.ALLIANCE_ITEM_NEXT,avo);
	}

}