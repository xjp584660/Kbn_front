public class MarchGeneralItem2 extends GeneralReincarnationInfo
{
	public var INFO_IMG_X : int = 63;
	public var INFO_IMG_Y : int = 12;
	public var INFO_IMG_WIDTH : int = 100;
	public var INFO_IMG_HEIGHT : int = 100;
	public var toggle_button : ToggleButton;
	public var l_img 	:Label;
	public var btn_img	:Button;
	public var l_name	:Label;
	public var l_lv 	:Label;
	public var l_info	:SimpleLabel;
	public var btn_exp	:Button;
	public var p_bar	:PercentBar;
	public var l_per	:Label;
	public var area_Btn	:SimpleButton;
	protected var data:GeneralInfoVO;
	
	public  var attackIcon:Label;
	public  var attackContent:Label;
	public  var healthIcon:Label;
	public  var healthContent:Label;
	public	var l_Line:Label;
	
	private var knightID : String;

	public function Draw()
	{
		if (!visible)
			return;

		GUI.BeginGroup(rect);

		if(data)
			toggle_button.selected = data.selected;
		toggle_button.Draw();
		
		l_img.Draw();
		l_info.Draw();
		l_lv.Draw();
		btn_img.Draw();
		area_Btn.Draw();
		btn_exp.Draw();
		p_bar.Draw();	
		l_per.Draw();

		levelIcon.Draw();
		attackIcon.Draw();
		attackContent.Draw();
		healthIcon.Draw();
		healthContent.Draw();
		l_Line.Draw();

		this.prot_drawItems();
		GUI.EndGroup();
	}
	
	public function Init()	//call many
	{
		p_bar.Init();
		p_bar.Init(50,100);
		l_info.Sys_Constructor();
		l_info.rect = new Rect(138, 12, 24, 24);
		l_info.mystyle.normal.background = TextureMgr.instance().LoadTexture( "infor_icon", TextureType.DECORATION );
			

		btn_img.rect.x = INFO_IMG_X;
		btn_img.rect.y = INFO_IMG_Y;
		btn_img.rect.width = INFO_IMG_WIDTH;
		btn_img.rect.height = INFO_IMG_HEIGHT;
		btn_img.txt = "";
		btn_img.OnClick = onClickImg;
		btn_img.mystyle.normal.background = null;
		btn_img.mystyle.active.background = TextureMgr.instance().LoadTexture( "bossinfo_transparent-bg", TextureType.DECORATION );
		btn_exp.txt = Datas.getArString("Common.PlusExp_button");
		btn_exp.OnClick = buttonHandler;
		area_Btn.rect.width = btn_exp.rect.x - 20;
		area_Btn.rect.height = this.rect.height;
		area_Btn.OnClick = areaClick;
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
	}
	
	public function SetRowData(obj:Object):void
	{
		Init();
		var texMgr = TextureMgr.instance();
		this.data = obj as GeneralInfoVO;	//GeneralInfoVO	
		if(data.bAvaOnly)	
		{
			//ava
			btn_exp.changeToGreyNew();
		}
		else
		{
			btn_exp.changeToGreenNew();
		}
		toggle_button.valueChangedFunc = valueChangedFunc;	
		//TODO....general info.
		

		l_img.useTile = true;
		
		
		knightID = ""+ data.knightId;
		var expLv:Array;
		if(data.bAvaOnly)
		{
			var knightCityId:int = CityQueue.instance().GetCityIdByCityOrder(data.cityOrder);
			expLv = General.instance().calcExpLvl(""+ data.knightId,knightCityId);
			l_name.txt = General.singleton.getKnightShowName(data.knightName,data.cityOrder);
			l_img.tile = texMgr.IconSpt().GetTile(General.instance().getGeneralTextureName(data.knightName,data.cityOrder));
		}
		else
		{
			expLv = General.instance().calcExpLvl(""+ data.knightId);
			l_name.txt = General.singleton.getKnightShowName(data.knightName, GameMain.instance().getCurCityOrder());
			l_img.tile = texMgr.IconSpt().GetTile(General.instance().getGeneralTextureName(data.knightName, GameMain.instance().getCurCityOrder()));
		}
		var knight:Knight = GearManager.Instance().GearKnights.GetKnight(data.knightId);
		l_per.txt = expLv[0] + "/" + expLv[2];
		if ( String.IsNullOrEmpty(this.data.starLevel) )
		{
			l_lv.txt = expLv[1].ToString();
		}
		else
		{
			l_lv.txt = this.data.starLevel;
		}
		attackContent.txt = "" + GearManager.Instance().GetShowKnightAttack(knight);
		healthContent.txt = "" + GearManager.Instance().GetShowKnightLife(knight);
		p_bar.Init(expLv[0], expLv[2]);

		this.SetData(this.data.isStar);
	}
	
	protected function areaClick(clickParam:Object):void
	{
		if(data && !data.selected)
			valueChangedFunc(true);
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		MenuMgr.getInstance().PushMenu("GenExpBoostMenu", {"kid":data.knightId}, "trans_zoomComp");
	}
	
	private function onClickImg()
	{
		MenuMgr.getInstance().PushMenu("KnightInformationPopMenu", knightID, "trans_zoomComp");
	}
	
	protected function valueChangedFunc(b:boolean):void
	{
		if(b && handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.MARCH_GENERAL_SELECT,data);
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
//		scrollPos = pos;
		if(l_img)
		{
			if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
			{
				l_img.drawTileByGraphics = false;
			}
			else
				l_img.drawTileByGraphics = true;
			
		}
	}
}