
class	PositionItem	extends	ListItem{

//	public	var	bgLabel:Label;
	public	var	separateLine:Label;
	public	var	incumbent:Label;
	public	var	flag:Label;
	
	public	var	titleContent:Label;
	public	var	descriptionContent:Label;
	public	var	incumbentContent:Label;
	
	public  var salaryDes:Label;
	
	public function Init():void
	{
		separateLine.setBackground("between line_list_small", TextureType.DECORATION);
		separateLine.rect.height = 4;
		
		btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		btnSelect.mystyle.border.left = 0;
		btnSelect.mystyle.border.right = 0;
		btnSelect.mystyle.border.top = 0;
		btnSelect.mystyle.border.bottom = 0;
	}

	public	function	Draw(){
		GUI.BeginGroup(rect);
//			bgLabel.Draw();
			
			icon.Draw();
			title.Draw();
			titleContent.Draw();
			
			description.Draw();
			descriptionContent.Draw();
			
			flag.Draw();
			
			incumbent.Draw();
			incumbentContent.Draw();
			
			btnSelect.Draw();
			salaryDes.Draw();
			separateLine.Draw();
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object){
	

//		var arStrings:Object = Datas.instance().arStrings();
		var _data:Hashtable = data as Hashtable;

		icon.useTile = true;
		icon.tile = TextureMgr.instance().GeneralSpt().GetTile("li" + (_Global.INT32(_data["positionId"]) - 10));
		//icon.tile.name = "li" + (_Global.INT32(_data["positionId"]) - 10);
	//	icon.image = TextureMgr.instance().LoadTexture("li" + (data["positionId"] - 10), TextureType.ICON_GENERAL);//Resources.Load("Textures/UI/icon/icon_general/li" + (data["positionId"] - 10));
	//	flag.image = TextureMgr.instance().LoadTexture("position" + (data["positionId"] - 10) + "-2", TextureType.ICON_ELSE);//Resources.Load("Textures/UI/icon/position" + (data["positionId"] - 10) + "-2");
		flag.useTile = true;
		flag.tile = TextureMgr.instance().ElseIconSpt().GetTile("position" + (_Global.INT32(_data["positionId"]) - 10) + "-1");
		//flag.tile.name = "position" + (_Global.INT32(_data["positionId"]) - 10) + "-1";
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = Datas.getArString("Common.Position") + ":";
		titleContent.txt =_data["position"];
		

		description.txt = Datas.getArString("Common.Info") + ":";
		descriptionContent.txt = _data["info"];

		

		incumbent.txt = Datas.getArString("Common.Incumbent") + ":";
		incumbentContent.txt = _data["incumbent"];
		btnSelect.txt = _data["incumbent"]==null || _data["incumbent"] == "" ? Datas.getArString("Common.Assign") : Datas.getArString("Common.Unassign");
		var generalId:int = _Global.INT32(_data["kid"]);

		var salary:int = 0;
		if(generalId > 0)
		{
			salary = General.instance().getLeadersalary(generalId);	
			salaryDes.txt = "<color=#ebd0a8ff>" + Datas.getArString("Generals.salary") + ": " + "</color>" + "<color=#ea9203ff>" + salary + " " + Datas.getArString("Generals.Ghr") + "</color>";
		}
		else
		{
			salary = General.instance().getLeaderSalaryRate();
			salaryDes.txt =  "<color=#ea9203ff>" + salary + " " + Datas.getArString("Generals.generalSalaryRateDes") + "</color>";
		}	
		
		btnSelect.OnClick = function( param:Object ){

			if( btnSelect.txt == Datas.getArString("Common.Assign") ){
				MenuMgr.getInstance().PushMenu("AssignGeneralMenu", {"title":_data["position"], "positionId":_data["positionId"]}, "trans_zoomComp");

			}else{

				General.instance().unassignKnight(_data["positionId"], generalId, function(){
					var menuMgr:MenuMgr = MenuMgr.getInstance();
					menuMgr.PushMessage(Datas.getArString("ToastMsg.General_UNASSIGNOK"));

					var generalMenu:GeneralMenu = menuMgr.getMenu("GeneralMenu") as GeneralMenu;
					if( generalMenu ){
						generalMenu.positionList.SetData(General.instance().getLeaders());
						generalMenu.generalTab.setListData(General.instance().getGenerals());
					}
				});
			}
		};
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
//		scrollPos = pos;
		if(icon)
		{
			if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
			{
				icon.drawTileByGraphics = false;
				flag.drawTileByGraphics = false;
			}
			else
			{
				icon.drawTileByGraphics = true;
				flag.drawTileByGraphics = true;
			}	
			
		}
	}
}