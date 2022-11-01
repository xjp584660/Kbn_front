
class	GeneralTabContent extends	UIObject{
	public var noGeneralLabel:Label;
	
	public var generalItem:GeneralItem;
	public var generalArray:ListItem[];
	public var generalList:ScrollList;
	
	
	function Init()
	{
		generalItem.Init();
		generalList.Init(generalItem);
		// generalList.Init(generalArray);
		noGeneralLabel.txt = Datas.getArString("Generals.NoGeneral");
	}
	
	public	function	Draw(){
		GUI.BeginGroup(rect);
//			infoLabel.Draw();
			noGeneralLabel.Draw();
			generalList.Draw();
			
			// generalItem.Draw();
		GUI.EndGroup();
	}
	
	public	function	setListData(data:Array){
		if( data.length > 0 ){
			generalList.SetVisible(true);
			noGeneralLabel.SetVisible(false);
			generalList.SetData(data);
			generalList.ResetPos();
		}else{
			generalList.SetVisible(false);
			noGeneralLabel.SetVisible(true);
		}
	}
	
	public	function	Clear()
	{
		generalList.Clear();
	}
}