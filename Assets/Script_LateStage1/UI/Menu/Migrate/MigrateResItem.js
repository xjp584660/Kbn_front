class MigrateResItem extends ListItem
{
	
	public var m_data:MigrateRoleInfo.BringResData;
	
	public var m_icon:Label;
	public var m_line:Label;
	public var m_name:Label;
	public var m_bring:Label;
	public var m_own:Label;
	
	
	public function Init()
	{
		super.Init();
		
	}
	function DrawItem()
	{
		//GUI.BeginGroup(rect);
		m_line.Draw();
		m_icon.Draw();
		m_name.Draw();
		m_bring.Draw();
		m_own.Draw();
		//GUI.EndGroup();
	}
	
	public function SetIndexInList(index:int)
	{
		if(index % 2 == 0)
		{
			m_line.setBackground("popup_listbackground", TextureType.DECORATION);
			m_line.SetVisible(true);
		}
		else
		{
			m_line.SetVisible(false);
		}
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as MigrateRoleInfo.BringResData;
		m_name.txt = m_data.typeName;
		if(m_data.isResource ){
			m_icon.mystyle.normal.background = Resource.getResourceTexure(m_data.resourceType);
			m_bring.txt = _Global.NumSimlify( m_data.bring);
			m_own.txt = _Global.NumSimlify(m_data.own);
		}else{
			if(m_data.typeName == Datas.getArString("Migrate.Role_World_Gem")){
				m_bring.txt = _Global.NumFormat( m_data.bring);
				m_own.txt = _Global.NumFormat(m_data.own);
			}else{
				m_bring.txt = _Global.NumSimlify( m_data.bring);
				m_own.txt = _Global.NumSimlify(m_data.own);
			}
		
		}
		
		

	}
	
	
	
	

}