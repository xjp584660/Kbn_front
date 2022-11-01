class PveFteMenu extends KBNMenu
{
	@SerializeField private var topLine:SimpleLabel;
	
	@SerializeField private var roundBack:SimpleLabel;
	@SerializeField private var roundCheckBox:SimpleLabel;
	@SerializeField private var lightBack:Label;
	@SerializeField private var pveImage:SimpleLabel;
	
	@SerializeField private var middleDesc:SimpleLabel;
	
	@SerializeField private var darkBack:SimpleLabel;
	@SerializeField private var desc1:SimpleLabel;
	@SerializeField private var desc2:SimpleLabel;
	@SerializeField private var desc3:SimpleLabel;
	@SerializeField private var desc4:SimpleLabel;
	@SerializeField private var desc5:SimpleLabel;
	
	@SerializeField private var leftImage1:SimpleLabel;
	@SerializeField private var leftImage2:SimpleLabel;
	@SerializeField private var leftImage3:SimpleLabel;
	@SerializeField private var leftImage4:SimpleLabel;
	@SerializeField private var leftImage5:SimpleLabel;
	
	@SerializeField private var line1:SimpleLabel;
	@SerializeField private var line2:SimpleLabel;
	@SerializeField private var line3:SimpleLabel;
	@SerializeField private var line4:SimpleLabel;
	
	@SerializeField private var goCampaignBtn:Button;
	
	@SerializeField private var rotateSpeed:float;
	private var m_rotate:Rotate;
	
	
	@SerializeField private var backRect:Rect;
	@SerializeField private var frameSimpleLabel:SimpleLabel;
	@SerializeField private var backGround:SimpleLabel;
	
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	
	public function Init():void
	{
		super.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();

		if(backGround.mystyle.normal.background == null)
		{
			backGround.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		}
		
		title.txt = Datas.getArString("Campaign.Notice_Title");//"Join Campaign!"
		btnClose.OnClick = handleClick;
		
		topLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line",TextureType.DECORATION);
		
		roundBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("report-cup-bg",TextureType.DECORATION);
		
		roundCheckBox.tile = TextureMgr.instance().GetGearIcon("Round_CheckBox");
		roundCheckBox.useTile = true;	
		pveImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_campaign",TextureType.BUTTON);
		lightBack.setBackground("payment_light",TextureType.DECORATION);
		m_rotate = new Rotate();
		m_rotate.init(lightBack,EffectConstant.RotateType.LOOP,Rotate.RotateDirection.CLOCKWISE,0.0f,0.0f);
		m_rotate.playEffect();
		
		middleDesc.txt = Datas.getArString("Campaign.Notice_Desc");//The North is in crisis!
		
		darkBack.mystyle.normal.background = texMgr.LoadTexture("square_black2",TextureType.DECORATION);
		desc1.txt = Datas.getArString("Campaign.Notice_Text1");//"111111111111111";
		desc2.txt = Datas.getArString("Campaign.Notice_Text2");//"222222222222222";
		desc3.txt = Datas.getArString("Campaign.Notice_Text3");//"333333333333333";
		desc4.txt = Datas.getArString("Campaign.Notice_Text4");//"444444444444444";
		desc5.txt = Datas.getArString("Campaign.Notice_Desc");//"555555555555555";
		
		leftImage1.mystyle.normal.background = texMgr.LoadTexture("icon_alliance_Fist",TextureType.ICON);
		leftImage2.mystyle.normal.background = texMgr.LoadTexture("icon_alliance_Fist",TextureType.ICON);
		leftImage3.mystyle.normal.background = texMgr.LoadTexture("icon_alliance_Fist",TextureType.ICON);
		leftImage4.mystyle.normal.background = texMgr.LoadTexture("icon_alliance_Fist",TextureType.ICON);
		leftImage5.mystyle.normal.background = texMgr.LoadTexture("icon_alliance_Fist",TextureType.ICON);
		
		line1.mystyle.normal.background = texMgr.LoadTexture("between line_list_small",TextureType.DECORATION);
		line2.mystyle.normal.background = texMgr.LoadTexture("between line_list_small",TextureType.DECORATION);
		line3.mystyle.normal.background = texMgr.LoadTexture("between line_list_small",TextureType.DECORATION);
		line4.mystyle.normal.background = texMgr.LoadTexture("between line_list_small",TextureType.DECORATION);
		
		goCampaignBtn.OnClick = handleClick;
		//goCampaignBtn.setNorAndActBG("button_60_blue_normal","button_60_blue_down");
		goCampaignBtn.txt = Datas.getArString("Common.OK_Button");//"OK";
		
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
	}
	
	public function DrawItem()
	{
		backGround.Draw();
		
		GUI.BeginGroup(backRect);
//			Graphics.DrawTexture(Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(backRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
			//GUI.DrawTextureWithTexCoords(new Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
			//GUI.DrawTextureWithTexCoords(new Rect(backRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.EndGroup();
		
		title.Draw();
		topLine.Draw();
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = 0.2f;
		roundBack.Draw();
		roundCheckBox.Draw();
		GUI.color.a = oldAlpha;
		
//		lightBack.Draw();
		m_rotate.drawItems();
		pveImage.Draw();
		
		middleDesc.Draw();
		
		darkBack.Draw();
		desc1.Draw();
		desc2.Draw();
		desc3.Draw();
		desc4.Draw();
//		desc5.Draw();
		
		leftImage1.Draw();
		leftImage2.Draw();
		leftImage3.Draw();
		leftImage4.Draw();
//		leftImage5.Draw();
		
		line1.Draw();
		line2.Draw();
		line3.Draw();
//		line4.Draw();
		
		goCampaignBtn.Draw();
		
		frameSimpleLabel.Draw();
		btnClose.Draw();
	}
	
	function Update() 
	{
		m_rotate.rotateMultiple = rotateSpeed;
		m_rotate.updateEffect();
	}
	
	public function OnPush(param:Object)
	{
	}
	
	public function OnPop()
	{
		super.OnPop();
		KBN.PveController.instance().SetPveFteStep(1);
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
    }
	
	private function handleClick():void
	{
// 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
//		mainChrom.SetShowPopUpLight(true);
		MenuMgr.getInstance().PopMenu("PveFteMenu");
	}
	
	protected function prot_drawFrameLine()
	{
	}
}