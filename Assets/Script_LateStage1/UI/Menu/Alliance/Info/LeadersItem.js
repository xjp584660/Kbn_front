public class LeadersItem extends ListItem
{
	public var l_line 	:Label;
	public var btn_name	:Button;	
	public var l_cities :Label;
	public var l_might	:Label;
	public var btn_mail :Button;
	
	protected var amvo:AllianceMemberVO;
	
	public function Init():void
	{
		btn_mail.setNorAndActBG("button_mail_normal", "button_mail_down");
	
		btn_name.OnClick = buttonHandler;
		btn_mail.OnClick = buttonHandler;
		btn_name.clickParam = Constant.Action.ALLIANCE_LDITEM_NAME;
		btn_mail.clickParam = Constant.Action.ALLIANCE_LDITEM_MAIL;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_line.Draw();
		btn_name.Draw();
		l_cities.Draw();
		l_might.Draw();
		btn_mail.Draw();
		GUI.EndGroup();
	}
	public function SetRowData(data:Object):void
	{
		Init();
		amvo = data as AllianceMemberVO;
		btn_name.SetFont();
		btn_name.txt = _Global.GUIClipToWidth(btn_name.mystyle, amvo.name, 180, "...", null);
		l_might.txt = "" + amvo.might;
		l_cities.txt = "" + amvo.cities;
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		if(this.handlerDelegate)
			handlerDelegate.handleItemAction(clickParam,amvo);
	}

}