class HidenBossDescMenu extends KBNMenu
{
	@SerializeField private var bossIcon:Label;

//	@SerializeField private var questionMark:Label;
	
	@SerializeField private var star1:Label;
//	@SerializeField private var star2:Label;
//	@SerializeField private var star3:Label;
	
	@SerializeField private var desc1:Label;
	@SerializeField private var desc2:Label;
	
	@SerializeField private var bossName:Label;
	
	@SerializeField private var backImage:SimpleLabel;
	@SerializeField private var lightBack:SimpleLabel;
	@SerializeField private var lightBackTop:Label;
	@SerializeField private var lineTop:SimpleLabel;
	@SerializeField private var lineBottom:SimpleLabel;
	
	@SerializeField private var myColor = new Color();
	
	@SerializeField private var rotateSpeed:float;
	private var m_rotate:Rotate;
	
	@SerializeField private var framRect:Rect;
	@SerializeField private var backRect:Rect;
	@SerializeField private var frameSimpleLabel:SimpleLabel;
	@SerializeField private var backGround:SimpleLabel;
	
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	
	function Init()
	{
		super.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		
		//btnClose.OnClick = handleBack;
		
		if(backGround.mystyle.normal.background == null)
		{
			backGround.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}
		
		btnClose.OnClick = handleBack;
		
		if(backImage.mystyle.normal.background == null)
		{
			backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenboss-unlock-bg",TextureType.DECORATION);
		}
		
		if(lineTop.mystyle.normal.background == null)
		{
			lineTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("Black_Gradients",TextureType.DECORATION);
		}
		
		if(lineBottom.mystyle.normal.background == null)
		{
			lineBottom.mystyle.normal.background = TextureMgr.instance().LoadTexture("100_06",TextureType.DECORATION);
		}
		
//		if(lightBack.mystyle.normal.background == null)
//		{
//			lightBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenboss-unlock-light",TextureType.DECORATION);
//		}
		
		
//		lightBackTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light",TextureType.DECORATION);
//		lightBackTop.Init();
		lightBackTop.setBackground("payment_light",TextureType.DECORATION);
		m_rotate = new Rotate();
		m_rotate.init(lightBackTop,EffectConstant.RotateType.LOOP,Rotate.RotateDirection.CLOCKWISE,0.0f,0.0f);
		m_rotate.playEffect();
		
		bossName.setBackground("hiddenbossname",TextureType.DECORATION);
		
//		bossIcon.setBackground("hiddenboss",TextureType.DECORATION);
		star1.setBackground("BIGstar",TextureType.ICON);
//		star2.setBackground("BIGstar",TextureType.ICON);
//		star3.setBackground("BIGstar",TextureType.ICON);
		
		desc2.txt = Datas.getArString("Campaign.HiddenBoss_Unlock_Text3");//"Get high scores in campaign for more rewards.";
		

		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
		
		marginT = texMgr.LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		
		repeatTimes = (backRect.height - 15) / UI_BG_WOOD_WEN_HEIGHT;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
	}
	
	function Update () 
	{
		super.Update();
//		if(Input.GetMouseButtonDown(0))
//		{
//			handleBack();
//		}
		m_rotate.rotateMultiple = rotateSpeed;
		m_rotate.updateEffect();
	} 
	
	function DrawItem() 
	{
		backGround.Draw();
		
		GUI.BeginGroup(backRect);
//			Graphics.DrawTexture(Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(backRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
			GUI.DrawTextureWithTexCoords(new Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
			GUI.DrawTextureWithTexCoords(new Rect(backRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.EndGroup();
		
		backImage.Draw();
		
//		lightBack.Draw();		
		
		m_rotate.drawItems();
		
		lineTop.Draw();
		lineBottom.Draw();
		
		var oldColor:Color = GUI.color;
		GUI.color = myColor;
		GUI.BeginGroup(framRect);
		bossIcon.Draw();
		GUI.EndGroup();
		GUI.color = oldColor;
		
		bossName.Draw();
		
		star1.Draw();
		
		desc1.Draw();
		desc2.Draw();
		
		frameSimpleLabel.Draw();
		btnClose.Draw();
	}
	
	public function OnPush(param:Object)
	{
		//var listData:Hashtable = getTestDate();
		var hash:HashObject = param as HashObject;
		if(hash == null)return;
		
		desc1.txt = "("+_Global.INT32(hash["curStarNum"])+"/"+_Global.INT32(hash["totalStarNum"])+")";
		bossName.txt = Datas.getArString(_Global.GetString(hash["bossName"]));
		
		var tex:Texture2D = TextureMgr.instance().LoadTexture(_Global.GetString(hash["bossIcon"]),TextureType.PVEBOSS);
		if(tex == null)
			bossIcon.setBackground("potrait_NoPic", TextureType.PVEBOSS);
		else
			bossIcon.setBackground(_Global.GetString(hash["bossIcon"]), TextureType.PVEBOSS);
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("HidenBossDescMenu");
	}
	
	function getTestDate():Hashtable
	{
		var testDate:Hashtable  = {
			"curStarNum":123,
			"totalStarNum":4345
		};	
		
		return testDate;
	}
	
	protected function prot_drawFrameLine()
	{
	}
}