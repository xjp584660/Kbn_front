public class CitySelector extends UIObject
{
	public var city0:CitySelectorItem;
	public var city1:CitySelectorItem;
	public var city2:CitySelectorItem;
	public var city3:CitySelectorItem;
	public var city4:CitySelectorItem;
	
	private var citiesUI:CitySelectorItem[] = [city0,city1,city2,city3,city4];
	
	public function Init()
	{
		citiesUI = [city0,city1,city2,city3,city4];
		for(var i:int = 0;i<citiesUI.length;i++)
		{
			citiesUI[i].On_SelectedIndexChanged = selectedIndexChanged;
			citiesUI[i].Init();
		}
	}
	
	public function selectedIndexChanged(tb:ToggleButton,val:boolean)
	{
		var cities:System.Collections.Generic.List.<CityInfo> = MyCitiesController.MyCities();

		for(var i:int = 0;i< cities.Count;i++)
		{
			cities[i].Selected = false;
		}
		//SetData();
	}
	
	public function SelectedCity():CityInfo
	{
		var cityInfo:CityInfo = null;
		var cities:System.Collections.Generic.List.<CityInfo> = MyCitiesController.MyCities();
		for(var i:int = 0;i< cities.Count && i < citiesUI.length;i++)
		{
			if(citiesUI[i].Selected)
			{
				cityInfo = citiesUI[i].City;
				break;
			}
		}
		return cityInfo;
	}
	
	public function SetData()
	{
		var cities:System.Collections.Generic.List.<CityInfo> = MyCitiesController.MyCities();
		if(cities.Count > 0)
		{
			cities[0].Selected = true;
		}
		for(var i:int = 0;i< cities.Count && i < citiesUI.length;i++)
		{
			citiesUI[i].SetData(cities[i]);
		}
	}
	public function Update()
	{
		
	}
	
	public function Draw()
	{
		var cities:System.Collections.Generic.List.<CityInfo> = MyCitiesController.MyCities();
		for(var i:int = 0;i< cities.Count && i < citiesUI.length;i++)
		{
			citiesUI[i].Draw();
		}
	}
}

