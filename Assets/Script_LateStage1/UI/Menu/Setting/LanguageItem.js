class LanguageItem extends ListItem
{
	public var radioBtn : ToggleButton;
	public var m_data:ChooseLanguage.Lang;
	public var backLabel:Label;
	public var selectedBack:Label;
	function Draw()
	{
		if(m_data.type<0)
			return;
		GUI.BeginGroup(rect);
		if(!m_data.selected)
		{
			backLabel.Draw();
		}
		else
		{
			selectedBack.Draw();
		}
		title.Draw();
		if(m_data)
			radioBtn.selected = m_data.selected;
		radioBtn.Draw();
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as ChooseLanguage.Lang;
		if(m_data.type<0)
			return;
		title.txt = m_data.name;
		radioBtn.valueChangedFunc = valueChangedFunc;	
		
		if(m_data.selected)
		{		
			title.SetNormalTxtColor(FontColor.Milk_White);
		}
		else
		{
			title.SetNormalTxtColor(FontColor.Description_Light);
		}		
	}
	
	protected function valueChangedFunc(b:boolean):void
	{
		if(m_data.type<0)
			return;
		if( radioBtn.selected )
		{	
			title.SetNormalTxtColor(FontColor.Milk_White);
		}
		else
		{
			title.SetNormalTxtColor(FontColor.Description_Light);
		}
		if(b && handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.PROVINCE_SELECT,m_data);
	}

}

