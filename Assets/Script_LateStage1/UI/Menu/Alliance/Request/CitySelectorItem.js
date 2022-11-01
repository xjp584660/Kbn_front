public class CitySelectorItem extends UIObject
{
	public var lblCityName:Label;
	public var rb:ToggleButton;
	public var com:ComposedUIObj;
	
	public var On_SelectedIndexChanged:Function;
	private var cityInfo:CityInfo;
	
	
	public function get Selected():boolean
	{
		return rb.selected;
	}
	
	public function get City():CityInfo
	{
		return cityInfo;
	}
	
	public function Init()
	{
		com.rect = this.rect;
		com.component = [lblCityName,rb];
		rb.valueChangedFunc2 = selectedIndexChanged;
	}
	
	public function SetData(city:CityInfo)
	{
		var order:int = GameMain.instance().getCityOrderWithCityId(city.Id);
		
		lblCityName.txt = String.Format("{0} {1} ({2},{3})",Datas.getArString("Common.City"),order,city.X,city.Y);
		cityInfo = city;
	}
	
	public function selectedIndexChanged(tb:ToggleButton,val:boolean)
	{
		if(val == true)
		{
			if(On_SelectedIndexChanged != null)
			{
				On_SelectedIndexChanged(tb,val);
			}
			if(cityInfo != null)
			{
				cityInfo.Selected = true;
				AllianceRequestPopup.curCityIdForRequest=cityInfo.Id;
				MenuMgr.instance.SendNotification(Constant.PvPResponseOk.MarchListCityChange,null);
			}
		}
	}
	
	public function Update()
	{
	
	
	}
	
	public function Draw()
	{
		if(rb !=null && cityInfo!=null)
			rb.selected = cityInfo.Selected;
		com.Draw();
	}
}