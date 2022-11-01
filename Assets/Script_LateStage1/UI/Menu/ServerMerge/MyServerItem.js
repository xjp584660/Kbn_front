public class MyServerItem extends ListItem
{
	public var l_ServerName:Label;
	public var l_Level:Label;
	public var l_Might:Label;
	public var l_CityCount:Label;
	public var l_ReturnGems:Label;
	public var l_Line:Label;
	public var toggle_button : ToggleButton;
	public var l_LastChoice:Label;
	
	private var m_Data:KBN.FromServerDetail = null;
	private var m_LastChoiceServerId:int = 0;
	
	public function Init()
	{
		l_LastChoice.setBackground("icon_satisfactory",TextureType.ICON);
		//l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		toggle_button.valueChangedFunc = valueChangedFunc;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
			
		l_Line.Draw();
		l_ServerName.Draw();
		l_Level.Draw();
		l_Might.Draw();
		l_CityCount.Draw();
		l_ReturnGems.Draw();
		
		toggle_button.Draw();
		l_LastChoice.Draw();
		
		GUI.EndGroup();
	}
	
	public function Update()
	{
		UpdateComponent();
	}
	
	public function SetRowData(data : Object) : void
	{
		m_Data = data as KBN.FromServerDetail;
		if(m_Data == null) return;
		l_ServerName.txt = m_Data.serverName;
		l_Might.txt = String.Format(Datas.getArString("MergeServer.ServerData_Might"),m_Data.might);
		l_CityCount.txt = String.Format(Datas.getArString("MergeServer.ServerData_City"),m_Data.cityCount);
		l_ReturnGems.txt = String.Format(Datas.getArString("MergeServer.ServerData_Gem"),m_Data.returnGems);
		l_Level.txt = Datas.getArString("Common.Level") + ":" + m_Data.level;
		UpdateComponent();
	}
	
	protected function valueChangedFunc(b:boolean):void
	{
		if(b && handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.SERVERMERGE_ITEM_SELECT,m_Data);
	}
	
	private function UpdateComponent()
	{
		if(m_Data != null)
			toggle_button.selected = m_Data.bSelected;
		
		if(KBN.MergeServerManager.getInstance().MyServerMergeDetail != null && KBN.MergeServerManager.getInstance().MyServerMergeDetail.LastChoiceServerId != m_Data.serverId)
		{
			l_LastChoice.SetVisible(false);
		}
		else
		{
			l_LastChoice.SetVisible(true);
		}
		if(KBN.MergeServerManager.getInstance().MyServerMergeDetail != null && KBN.MergeServerManager.getInstance().MyServerMergeDetail.LastChoiceServerId != 0)
		{
			toggle_button.SetVisible(false);
		}
		else
		{
			toggle_button.SetVisible(true);
		}
		if(m_Data.bSelected || KBN.MergeServerManager.getInstance().MyServerMergeDetail.GetSelectServerId() == 0)
		{
			l_ReturnGems.SetNormalTxtColor(FontColor.New_PassWord_Yellow);
		}
		else
		{
			l_ReturnGems.SetNormalTxtColor(FontColor.Green);
		}
	}
}