class MigrateWordItem extends ListItem
{
	public var radioBtn : ToggleButton;
	public var m_data:MigrateMenu.WordData;
	public var wordName:Label;
	public var might:Label;
	public var level:Label;
	public var line:Label;
	public var lblCapacityPre:Label;
	public var population:Label;
	function DrawItem()
	{
//		if(m_data.type<0)
//			return;
		//GUI.BeginGroup(rect);
		super.DrawItem();
		line.Draw();
//		title.Draw();
		if(m_data)
			radioBtn.selected = m_data.selected;
		radioBtn.Draw();
		wordName.Draw();
		might.Draw();
		level.Draw();
		lblCapacityPre.Draw();
		population.Draw();
	
		//GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as MigrateMenu.WordData;
//		if(m_data.type<0)
//			return;
			
//		title.txt = m_data.name;
		radioBtn.valueChangedFunc = valueChangedFunc;	
		wordName.txt=m_data.name;
			
		if(m_data.accountStatus == 1){
			might.txt=m_data.might;
			level.txt=m_data.level;
			level.SetVisible(true);
		
		}else{
			might.SetVisible(false);
			level.txt= Datas.getArString("Migrate.ChooseServer_NoAccount");
//			lblCapacityPre.rect.y = 48;
//			population.rect.y = 48;
//			might.rect.y = 80;
//			level.rect.y = 80; 
		}	
		lblCapacityPre.rect.y = 48;
		population.rect.y = 48;
		might.rect.y = 80;
		level.rect.y = 80;
		
		lblCapacityPre.txt = Datas.getArString("ChangWorld.Capacity") + ":";
		//lblCapacityPre.SetFont(FontSize.Font_22, FontType.TREBUC);
		switch(m_data.population)
		{
			case 0:
				population.txt = Datas.getArString("ChangWorld.CapacityLow");
				population.SetNormalTxtColor(FontColor._Green_);//mystyle.normal.textColor = Color(0,1,0,1);
				
				break;
			case 1:
				population.txt = Datas.getArString("ChangWorld.CapacityMedian");
				population.SetNormalTxtColor(FontColor.Yellow);//mystyle.normal.textColor = Color(1,1,0,1);
				break;
			case 2:
				population.txt = Datas.getArString("ChangWorld.CapacityHigh");
				population.SetNormalTxtColor(FontColor.Red);//mystyle.normal.textColor = Color(248.0/255.0,26.0/255.0,26.0/255.0,1);
				break;
		}
		var populationleft:float = lblCapacityPre.rect.x + lblCapacityPre.GetWidth() + 5;
		population.rect.x = populationleft;	
	}
	
	protected function valueChangedFunc(b:boolean):void
	{
		if(m_data.type<0)
			return;
//		if( radioBtn.selected )
//		{	
//			title.SetNormalTxtColor(FontColor.Milk_White);
//		}
//		else
//		{
//			title.SetNormalTxtColor(FontColor.Description_Light);
//		}
		if(b && handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.PROVINCE_SELECT,m_data);
	}

}