class ProvinceItem extends ListItem
{
	public var radioBtn : ToggleButton;
	public var m_data:TeleportProvince.Province;
	public var backLabel:Label;
	public var selectedBack:Label;
	function Draw()
	{
		GUI.BeginGroup(rect);
		if(!m_data.selected)
		{
			title.SetNormalTxtColor(FontColor.SmallTitle);
			backLabel.setBackground("square_black_4",TextureType.DECORATION);
		}
		else
		{
			title.SetNormalTxtColor(FontColor.Milk_White);
			backLabel.setBackground("square_black2",TextureType.DECORATION);
			selectedBack.Draw();
		}
		backLabel.Draw();
		title.Draw();
		if(m_data)
			radioBtn.selected = m_data.selected;
		radioBtn.Draw();
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as TeleportProvince.Province;
		
//		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = m_data.name;
		radioBtn.valueChangedFunc = valueChangedFunc;	
		
	}
	
	protected function valueChangedFunc(b:boolean):void
	{
		if(b && handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.PROVINCE_SELECT,m_data);
	}
}

