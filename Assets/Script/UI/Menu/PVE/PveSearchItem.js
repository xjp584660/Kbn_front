class PveSearchItem extends ListItem{

	public var toggle_button:ToggleButton;
	public var defultBtn:Button;
	public var obj:HashObject;
	public var _selected:boolean;
	public var id:int;
	public var iconName:String;
	public var first:boolean=true;

	public function Init(){
		super.Init();
		var thismenu:PveSearchMenu = MenuMgr.getInstance().getMenu("PveSearchMenu") as PveSearchMenu;
		if (thismenu!=null)
			handlerDelegate=thismenu;
		toggle_button.Init();
		defultBtn.Init();
		toggle_button.selected = false;
		_selected=false;
		defultBtn.OnClick=selectClick;
	}

	public function DrawItem(){
		defultBtn.Draw();
		toggle_button.Draw();
	}

	public function SetRowData(data:Object){
		// obj=data;
		SetSelected(false);
		var d:HashObject=new HashObject(data);
		obj=d;
		id=_Global.INT32(d["id"]);
		var iconStr=d["icon"].Value+"";
		iconName=d["icon"].Value;
		defultBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture(iconStr,TextureType.PVESEARCH);
		if (PlayerPrefs.GetString("MarchSearchIcon", "no")==(d["icon"].Value+"")&&first) {
			var thismenu:PveSearchMenu = MenuMgr.getInstance().getMenu("PveSearchMenu") as PveSearchMenu;
			if (thismenu!=null)
				thismenu.first=true;
			selectClick(null);
			first=false;
		}
	}

	protected function selectClick(clickParam:Object):void
	{
		if(!_selected)
        {
			SetSelected(true);
        }
	}
	public function SetSelected(b:boolean){
		_selected = b;
		toggle_button.selected = b;
		
		if(b && handlerDelegate != null)
			handlerDelegate.handleItemAction("PVE_SEARCH_TOOGLE",this);
	}
}