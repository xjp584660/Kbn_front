public class AllianceLeaveItem extends ListItem
{
	public var l_name :Label;
	public var l_might :Label;
	public var line_texture:Texture2D;

	protected var  mdata:HashObject;
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		drawTexture(line_texture,40,85,500,17);
		
		l_name.Draw();
		l_might.Draw();
		btnSelect.Draw();
		
		GUI.EndGroup();
	}
	/**
					userId
				  	fbuid
				  	usertype
				  	displayName
				  	avatarId
				  	playerSex**/
				  	
	public function SetRowData(data:Object):void
	{
		mdata = data as HashObject;
		Init();
		l_name.txt = mdata["displayName"].Value;
		if(mdata["might"])
			l_might.txt = mdata["might"].Value + "";
		//TODO
	}
	
	public function Init():void
	{
		btnSelect.txt = Datas.getArString("Common.Assign");
		btnSelect.OnClick = onClick;
	}
	
	protected function onClick(obj:Object):void
	{
		if(handlerDelegate)
			handlerDelegate.handleItemAction("",mdata);
	}
}