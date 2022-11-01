// import KBN;
class AllianceLanguageItem extends ListItem
{
	public var toggleBtn:ToggleButton;
	// public var bg:Label;
	public var l_icon:Label;
	public var l_name:Label;
	public var defultBtn:Button;

	public var _selected:boolean;
	public var id:int;
	public var data:KBN.DataTable.AllianceLanguage;

	public function Init()
	{
		super.Init();
		toggleBtn.Init();
		// bg.Init();
		l_icon.Init();
		l_name.Init();
		defultBtn.Init();

		var thismenu:AllianceLanguageMenu = MenuMgr.getInstance().getMenu("AllianceLanguageMenu") as AllianceLanguageMenu;
		if (thismenu!=null)
			handlerDelegate=thismenu;

		toggleBtn.selected = false;
		_selected=false;

		defultBtn.OnClick=selectClick;
	}

	public function SetRowData(data:Object)
	{
		SetSelected(false);
		this.data=data as KBN.DataTable.AllianceLanguage;
		id=this.data.LanguageId;
		l_icon.mystyle.normal.background=TextureMgr.instance().LoadTexture(this.data.flagicon,TextureType.ALLIANCELANGUAGE);
		l_name.txt=Datas.getArString(this.data.LanguageName);
	}

	protected function selectClick(clickParam:Object):void
	{
		if(!_selected)
        {
			SetSelected(true);
        }
	}
	public function SetSelected(b:boolean)
	{
		_selected = b;
		toggleBtn.selected = b;
		
		if(b)
		{
			defultBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("paymentSelectBack", TextureType.DECORATION);
			
			l_name.SetNormalTxtColor(FontColor.New_Level_Yellow);
			// l_name.SetNormalTxtColor(FontColor.New_Level_Yellow);
		}
		else
		{
			l_name.SetNormalTxtColor(FontColor.New_Common_Red);
			// l_name.SetNormalTxtColor(FontColor.New_Common_Red);
			defultBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("paymentBack", TextureType.DECORATION);
		}

		if(b && handlerDelegate != null)
		{
			handlerDelegate.handleItemAction("Alliance_Language_toggle",this);
		}
			
	}

	public function DrawItem()
	{		
		// bg.Draw();
		defultBtn.Draw();
		l_icon.Draw();
		l_name.Draw();
		toggleBtn.Draw();
	}
		
}