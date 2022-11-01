class TeleportProvince extends PopMenu implements IEventHandler
{
    class Province
    {
    	var id:int;
    	var name:String;
    	var selected:boolean;
    };
	private var provinceData:Array;
	public  var provinceList:ScrollList;
	public  var provinceTemplate:ProvinceItem;
	public  var btnSubmit:Button;
	public  var btnCancel:Button;
	public  var icon:Label;
	public  var curProvince:SimpleLabel;
	public  var newProvince:SimpleLabel;
	private var selectedProvince:Province;
	
	function Init()
	{
		super.Init();
		provinceData = new Array();
		InitProvinceData();
		provinceList.Init(provinceTemplate);
		provinceList.itemDelegate = this;
		btnCancel.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PopMenu("");
		};
		btnSubmit.OnClick = function(param:Object)
		{
			var confirmStr:String = Datas.getArString("Teleport.TeleportConfirm");
			confirmStr = confirmStr + "\n" + selectedProvince.name;
			var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			cd.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
			cd.setLayout(600,380);
			cd.setTitleY(120);
			MenuMgr.getInstance().PushConfirmDialog(confirmStr, "", StartTeleport, null);
		//	StartTeleport();
		};
//		var arString:Object = Datas.instance().arStrings();
		btnSubmit.txt = Datas.getArString("Common.Submit");
		btnCancel.txt = Datas.getArString("Common.Cancel_Button");
		title.txt = Datas.getArString("itemName.i911");
		
		newProvince.txt = Datas.getArString("Common.NewProvince");
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i911", TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i911");		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile("i911");
		//icon.tile.name = "i911";
		icon.drawTileByGraphics = true;
			
	}
	
	public	function	OnPopOver()
	{
		provinceList.Clear();
	}

	
	function OnPush(param:Object)
	{
//		var arStrings:Object = Datas.instance().arStrings();
		var curCityId:int = GameMain.instance().getCurCityId();
		var cityInfo:HashObject = GameMain.instance().GetCityInfo(curCityId);

		provinceList.SetData(provinceData);
		provinceList.ResetPos();

		curProvince.txt = Datas.getArString("Common.CurrentProvince") + ": ";
		curProvince.txt = curProvince.txt + Datas.getArString("provinceName."+"p" + cityInfo[_Global.ap + 4].Value);

		
		if(!selectedProvince)
		{
			selectedProvince = provinceData[0] as Province;
			selectedProvince.selected = true;
		}	
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i911", TextureType.ICON_ITEM);
	}
	
	function InitProvinceData()
	{
		var provinceKeys:Array = _Global.GetObjectKeys(Datas.instance().provinceNames());
//		var arString:Object = Datas.instance().arStrings();
		for(var i:int = 0; i<provinceKeys.length; i++ )
		{
			var province:Province = new Province();
			province.id = _Global.INT32( ( provinceKeys[i] as String).Split("p"[0])[1] ) ;
			province.name = Datas.getArString("provinceName."+provinceKeys[i]);
			provinceData.Push(province);
		}

	}
	
	public function handleItemAction(action:String,param:Object):void
	{
			switch(action)
			{
			case Constant.Action.PROVINCE_SELECT:
				if(selectedProvince)
					selectedProvince.selected = false;
				selectedProvince = param as Province;
				selectedProvince.selected = true;	
			}	
	}
	
	function DrawItem()
	{
		icon.Draw();
		curProvince.Draw();
		newProvince.Draw();
		provinceList.Draw();
		btnSubmit.Draw();
		btnCancel.Draw();
	}
	
	function StartTeleport()
	{
		MyItems.instance().useTeleportProvinceDo(911, selectedProvince.id);
	}
	
	function Update()
	{
		provinceList.Update();
	}
	
}

