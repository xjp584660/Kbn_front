
class	AssignGeneralItem	extends	GeneralReincarnationInfo
{
	public	var	bgLabel:Label;
	public	var	separateLine:Label;
	public	var	salaryLabel:Label;
	
	public function Init():void
	{
		separateLine.setBackground("between line_list_small", TextureType.DECORATION);
		separateLine.rect.height = 4;
	}
	
	public	function	Draw(){
		GUI.BeginGroup(rect);
			bgLabel.Draw();
			
			icon.Draw();
			description.Draw();
			btnSelect.Draw();
			
			salaryLabel.Draw();
			
			separateLine.Draw();
			this.prot_drawItems();
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object){
	
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		var _data:Hashtable =  data as Hashtable;
		var isAva:boolean = _data.ContainsKey("ava") && _data["ava"] == true;
		var kid:int = _Global.INT32(_data["kid"]);
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().GeneralSpt().GetTile(
			isAva ? GameMain.Ava.Units.GetKnightTextureName(kid) : General.getGeneralTextureName(_data["name"], curCityOrder));

		var level : int = _Global.INT32(_data["level"]);
		title.txt = isAva ? GameMain.Ava.Units.GetKnightShowName(kid) : General.singleton.getKnightShowName(_data["name"], curCityOrder);
		description.txt = Knight.GetShowerLevel(level);
		salaryLabel.txt = isAva ? String.Empty : _data["salary"] + " " + Datas.getArString("Generals.Ghr");
		btnSelect.txt = Datas.getArString("Common.Assign");

		if (isAva) {
			btnSelect.OnClick = function( param:Object ) {
				GameMain.Ava.Units.RequestAvaGeneralAssign(kid);
				MenuMgr.getInstance().PopMenu("");
			};
		} else {
			btnSelect.OnClick = function( param:Object ){
				General.instance().assignJob(_data["pos"], _Global.INT32(_data["kid"]), function(){
					var menuMgr:MenuMgr = MenuMgr.getInstance();
					menuMgr.PopMenu("", "trans_pop");
					menuMgr.PushMessage(Datas.getArString("ToastMsg.General_ASSIGNOK"));
					var generalMenu:GeneralMenu = menuMgr.getMenu("GeneralMenu") as GeneralMenu;
					if( generalMenu ){
						generalMenu.positionList.SetData(General.instance().getLeaders());
						generalMenu.generalTab.setListData(General.instance().getGenerals());
					}
				});
			};
		}

		var isStar : boolean = Knight.IsStarLevel(level);
		this.SetData(isStar);
	}
}