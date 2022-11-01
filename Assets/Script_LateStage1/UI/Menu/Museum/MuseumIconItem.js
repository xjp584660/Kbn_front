class MuseumIconItem extends ListItem
{
	public var piecePic:ItemPic;
	public var l_itemCount:Label;
	public var fuhao:Label;

	public function Init()
	{
		super.Init();
		piecePic.Init();
		l_itemCount.Init();
		fuhao.Init();
	}

	public function DrawItem()
	{
		piecePic.Draw();
		l_itemCount.Draw();
		fuhao.Draw();
	}

	public function SetRowData(param:Object):void
	{
		var data:KBN.EventEntity.EventPiece = param as KBN.EventEntity.EventPiece;

		piecePic.SetId(data.id);
		if(data.ownNum >= data.needNum)
		{
			l_itemCount.txt = "<color=white>" + _Global.NumSimlify(data.ownNum) + "</color>" + "/" + _Global.NumSimlify(data.needNum);
		}
		else
		{
			l_itemCount.txt = "<color=red>" + _Global.NumSimlify(data.ownNum) + "</color>" + "/" + _Global.NumSimlify(data.needNum);
		}

		fuhao.mystyle.normal.background=TextureMgr.instance().LoadTexture(data.IsOrLogic?"or":"jia",TextureType.DECORATION);

		// fuhao.SetVisible(indexInList!=itemCount);
	}

	public function SetListCount(count:int)
	{
		super.SetListCount(count);
		fuhao.SetVisible(indexInList!=(itemAllCount-1));
	}
}