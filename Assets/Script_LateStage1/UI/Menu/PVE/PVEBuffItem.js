class PVEBuffItem extends ListItem
{

	private static var PATH:String = "buff_";
	public var itemIcon:Label;
	public var btn:Button;
	public var leftTime:Label;
	private var m_data:Hashtable;
	var g_lastTime:long=0;
	var g_endTime:long;
	public function Init(){
		itemIcon.Init();
		leftTime.Init();
		btn.Init();
		btn.OnClick=openBuffmenu;
	}

	public function openBuffmenu(){
		MenuMgr.getInstance().PushMenu("BuffMenu", null, "trans_zoomComp", GameMain.instance().ScreenToRelativeRect(this.ScreenRect).center);
	}

	public function Draw(){
		GUI.BeginGroup(rect);
		btn.Draw();
		itemIcon.Draw();
		// leftTime.Draw();
		GUI.EndGroup();
	}

	public function Update(){
		this.rect.y=this.transform.localPosition.y;
		this.rect.x=this.transform.localPosition.x;

		if(g_endTime - g_lastTime>0){
			leftTime.txt=_Global.timeFormatStr(g_endTime-g_lastTime);		
		}else{
			leftTime.txt="";
		}
	}

	public function SetRowData(data:Object){
		// m_data=data as Hashtable;
		itemIcon.useTile=true;
		itemIcon.tile=TextureMgr.instance().ElseIconSpt().GetTile(PATH + _Global.INT32(data));

		g_lastTime=GameMain.unixtime();
		// g_endTime=_Global.INT64(m_data["endTime"]);

		// if(g_endTime - g_lastTime>0){
		// 	leftTime.txt=_Global.timeFormatStr(g_endTime-g_lastTime);		
		// }else{
		// 	leftTime.txt="";
		// }
	}
}