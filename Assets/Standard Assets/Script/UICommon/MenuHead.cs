using UnityEngine;
using System;
using System.Collections;

public class MenuHead : UIObject
{
	[Space(30), Header("--------MenuHead---------")]

	public Label l_title;
	public Button btn_back;
	public Button btn_getmore;
	public Label l_gem;
	public Button btn_left;
	public Tile backTile;
	public Label l_star1;
	public Label l_star2;
	public Label l_star3;

	public Label l_offerGemsTitle;
	public Label l_offerGems;
	public Button btn_gemsInfoButton;
	
	public static int BACK_BUTTON_MOTIF_HOME = 0;
	public static int BACK_BUTTON_MOTIF_ARROW = 1;
	public static int BACK_BUTTON_MOTIF_OUTPOST = 2;

	public float gemsInfoButtonLeftMargin = 5f;
	
	public GemsAnimation gemAnimation;
	
	private static int TITILE_X = 170;
	private static int STAR_WIDTH = 25;
	private static int STAR_OFFSET = 14;

	private Vector2 l_gemsOffset = new Vector2(-70, 4);
	
	protected System.MulticastDelegate _leftCallBack;

	public override  void Update()
	{
		gemAnimation.Update();
	}
	
	public void SetGemsAnimationVisible(bool show)
	{
		gemAnimation.SetVisible(show);
	}
	
	public override void Init()
	{	
		if(btn_getmore != null)
		{
			btn_getmore.SetVisible(true);
			l_gem.SetVisible(true);
			btn_getmore.txt = KBN.Datas.getArString("Common.GetMore");			
			btn_getmore.OnClick = new System.Action<System.Object>(buttonHandle);
			btn_getmore.mystyle.border.top = 0;
			btn_getmore.mystyle.border.left = 0;
			btn_getmore.mystyle.border.right = 0;
			btn_getmore.mystyle.border.bottom = 0;
			btn_getmore.gemsChangeToGreen();
		}
		if(btn_left != null)
			btn_left.OnClick = new System.Action<System.Object>(_leftHandler);
		this.leftHandler = null;
		//	background = TextureMgr.instance().LoadTexture("bg_ui_second_layer", TextureType.BACKGROUND);
		backTile = TextureMgr.instance().BackgroundSpt().GetTile("bg_ui_second_layer");
		//backTile.rect = backTile.spt.GetTileRect("bg_ui_second_layer");
		backTile.rect = new Rect(0,0,640,rect.height);
		//backTile.name = "bg_ui_second_layer";
		
		btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_home_normal",TextureType.BUTTON);
		btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_home_down",TextureType.BUTTON);
		btn_back.SetVisible(true);

		if (KBN._Global.IsLargeResolution ()) 
		{
			btn_left.rect.width = 92;
			btn_back.rect.width = 92;
			btn_getmore.rect.x = 483;
			btn_getmore.rect.width = 155;
			l_gem.rect.x = 575;
			l_gem.rect.width = 70;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btn_left.rect.width = 115;
			btn_back.rect.width = 115;
			btn_getmore.rect.x = 468;
			btn_getmore.rect.width = 170;
			l_gem.rect.x = 574;
			l_gem.rect.width = 76;
		}
		else
		{
			btn_left.rect.width = 105;
			btn_back.rect.width = 105;
			btn_getmore.rect.x = 468;
			btn_getmore.rect.width = 170;
			l_gem.rect.x = 570;
			l_gem.rect.width = 70;
		}
		l_gem.rect.y = 10;
		l_gem.rect.height = 48;

		btn_back.rect.x = 2;
		btn_left.rect.y = 2;
		btn_back.rect.y = 2;
		btn_getmore.rect.y = 2;
		btn_back.rect.height = 64;
		btn_getmore.rect.height = 64;
		btn_left.rect.height = 64;

		l_gem.mystyle.fontSize = 18;
		l_gem.mystyle.border.left = 96;
		l_gem.mystyle.contentOffset = l_gemsOffset;

//		btn_back.rect.width = 84  + 30;
		btn_back.mystyle.overflow.right = -30;
		btn_back.OnClick = new System.Action( () => {
			KBN.MenuMgr.instance.PopMenu("");
			//KBN.MenuMgr.instance.PopMenu("OfferMenu", "trans_zoomComp");
		});
		
		if(btn_left)
		{
//			btn_left.rect.width = 84  + 30;
			btn_left.mystyle.overflow.right = -30;
		}
		l_star1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star1.SetVisible(false);
		l_star2.SetVisible(false);
		l_star3.SetVisible(false);
		
		l_gem.setBackground("chrome_gems",TextureType.ICON);
		l_title.SetFont(FontSize.Font_25,FontType.GEORGIAB);
		l_title.SetNormalTxtColor(FontColor.Title);

		if(l_offerGemsTitle != null)
		{
			l_offerGemsTitle.SetVisible(false);
			l_offerGems.SetVisible(false);
			btn_gemsInfoButton.SetVisible(false);
		}
		//		FontMgr.SetStyleFont(l_title.mystyle, FontSize.Font_25,FontType.GEORGIAB);
	}	

	private void UpdateGemsInfoButton() 
	{  
		btn_gemsInfoButton.OnClick = new System.Action<System.Object>(OnClickGemsInfo);

		long lGems = KBN._Global.INT64(KBN.GameMain.singleton.getSeed()["player"]["gems"]);
		long lShadowGems = KBN._Global.INT64(KBN.GameMain.singleton.getSeed()["player"]["shadowGems"]);
		long lNormalGems = lGems - lShadowGems;

		btn_gemsInfoButton.SetVisible(lShadowGems > 0);
		btn_gemsInfoButton.txt = String.Format("({0} + {1})", lNormalGems, lShadowGems);
		btn_gemsInfoButton.rect = new Rect(l_offerGems.rect.x + l_offerGems.mystyle.CalcSize(new GUIContent(l_offerGems.txt, l_offerGems.image, null)).x + gemsInfoButtonLeftMargin,
		                                   btn_gemsInfoButton.rect.y, btn_gemsInfoButton.mystyle.CalcSize(new GUIContent(btn_gemsInfoButton.txt, null, null)).x, btn_gemsInfoButton.rect.height);
	}

	private void OnClickGemsInfo(System.Object clickParam)
	{
		KBN.MenuMgr.instance.PushMenu("GemsInfoMenu", null, "trans_zoomComp");
	}

	public void wheelGameRollStart()
	{
		btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_home_down",TextureType.BUTTON);
		btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_home_down",TextureType.BUTTON);
		btn_back.SetDisabled(true);
	}

	public void wheelGameRollEnd()
	{
		btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_home_normal",TextureType.BUTTON);
		btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_home_down",TextureType.BUTTON);
		btn_back.SetDisabled(false);
	}

	public void offerGemsDataSet()
	{
		btn_getmore.txt = "";
		btn_getmore.SetVisible(false);
		l_gem.SetVisible(false);
		l_title.SetVisible(false);

		l_offerGemsTitle.txt = KBN.Datas.getArString("paymentLabel.MenuTitle");
		float min = 0f;
		float max = 0f;
		l_offerGemsTitle.mystyle.CalcMinMaxWidth( new UnityEngine.GUIContent(l_offerGemsTitle.txt, null, null) ,out min, out max); 
		l_offerGems.rect.x = l_offerGemsTitle.rect.x + min + 5;
		int curCityId = KBN.GameMain.singleton.getCurCityId();
		l_offerGems.txt =  KBN.Payment.singleton.DisplayGems.ToString();

		l_offerGemsTitle.SetVisible(true);
		l_offerGems.SetVisible(true);

		UpdateGemsInfoButton();
	}
	
	public void setBackButtonMotif( int motif ) {
		if( motif == BACK_BUTTON_MOTIF_HOME ) {
			btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_home_normal",TextureType.BUTTON);
			btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_home_down",TextureType.BUTTON);
		} else if( motif == BACK_BUTTON_MOTIF_ARROW ) {
			btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_back2_normal",TextureType.BUTTON);
			btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_back2_down",TextureType.BUTTON);
		} else if( motif == BACK_BUTTON_MOTIF_OUTPOST ) {
			btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_minimap_normal",TextureType.BUTTON);
			btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_minimap_down",TextureType.BUTTON);
		}
	}
	
	public void updateButtonBackGround()
	{
		if(btn_back.mystyle.normal.background == null)
		{
			btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_home_normal",TextureType.BUTTON);
			btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_home_down",TextureType.BUTTON);
		}
		//if(btn_getmore != null )
		//{
		//	if(World.instance().IsTestWorld() && Payment.instance().TestGems > 0)
		//	{
		//		btn_getmore.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normal",TextureType.BUTTON);
		//		btn_getmore.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_down",TextureType.BUTTON);
		//	}
		//	else
		//	{
		//		btn_getmore.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normal",TextureType.BUTTON);
		//		btn_getmore.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_down",TextureType.BUTTON);
		//	}
		//}
	}
	
	
	public override  int Draw()
	{

		if (!visible) return 0;

		GUI.BeginGroup(rect);
		
		DrawBackGround();
		l_title.Draw();
		btn_back.Draw();
		
		updateGold();
		
		if(btn_getmore)
			btn_getmore.Draw();	
		
		if(l_gem)
			l_gem.Draw();
		
		if(btn_left)
			btn_left.Draw();
		if(gemAnimation)
		{
			gemAnimation.Draw();
		}
		l_star1.Draw();
		l_star2.Draw();
		l_star3.Draw();

		if(l_offerGemsTitle != null)
		{
			l_offerGemsTitle.Draw();
			l_offerGems.Draw();
			btn_gemsInfoButton.Draw();
		}

		GUI.EndGroup();
		
		return 0;
	}
	
	public void updateGold()
	{
		if(l_gem && l_gem.isVisible())
		{		
			int curCityId = KBN.GameMain.singleton.getCurCityId();
			l_gem.txt =  KBN.Payment.singleton.DisplayGems.ToString();
			updateButtonBackGround();
		}
	}
	
	public void setTitle(string s)
	{
		if(l_title)
			l_title.txt = s;
		updateGold();
	}
	public void setTitle(string name, int level, int pLevel)
	{
		this.setTitle(name  + " (" + KBN.Datas.getArString("Common.Lv") + level.ToString() + ")" );
		
		updateGold();
		resetTitlePosition(pLevel);
	}
	
	public string getTitle()
	{
		if (l_title != null) {
			return l_title.txt;
		}
		return System.String.Empty;
	}
	
	public void setGems(int gem)
	{
		l_gem.txt = gem.ToString();
	}
	
	public System.MulticastDelegate leftHandler
	{
		set
		{
			_leftCallBack = value;
			if(btn_left)
				btn_left.SetVisible(value != null);
			btn_back.SetVisible(value == null);
		}
	}
	
	protected void _leftHandler(System.Object clickParam)
	{
		if(_leftCallBack!=null)
			_leftCallBack.DynamicInvoke();	
	}
	
	public void DrawBackGround()
	{
		if(backTile.IsValid)
			backTile.Draw(true);
		//		DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height ), Rect( 0, 0, background.width, background.height),UIRotation.None);
		
	}
	
	protected void buttonHandle(System.Object clickParam)
	{
		//		MenuMgr.getInstance().PushMenu("PaymentMenu","");
		//
		//		var okCallback:Function = function( result:Object )
		//		{
		//			MenuMgr.getInstance().PushMenu("PaymentMenu", result, "trans_pop" );
		//		};
		//		
		//		Payment.callPaymentServer(okCallback);
		//KBN.Payment.setCurNoticeType(KBN.MenuMgr.instance.GetTopOfferTypeOfMainChrome());
		KBN.MenuMgr.instance.PushPaymentMenu(Constant.PaymentBI.MenuOpen);
	}
	
	public void setBackBtnDisabled(bool disabled)
	{
		if(btn_back)
		{
			btn_back.SetDisabled(disabled);
		}
	}
	
	public void setPaymentContentsVisible(bool visible)
	{
		if(btn_getmore != null)
		{
			btn_getmore.SetVisible(visible);
		}
		if(l_gem != null)
		{
			l_gem.SetVisible(visible);
		}
		SetGemsAnimationVisible(visible);
	}
	
	public void setStar1Visible(bool visible)
	{
		l_star1.SetVisible(visible);
	}
	
	public void setStar2Visible(bool visible)
	{
		l_star2.SetVisible(visible);
	}
	
	public void setStar3Visible(bool visible)
	{
		l_star3.SetVisible(visible);
	}
	
	public void resetTitlePosition(int pLevel)
	{
		if(pLevel >= 1)
		{
			l_title.rect.x = TITILE_X + (STAR_WIDTH + (pLevel-1.0f)*STAR_OFFSET + 5.0f)/2.0f;
			int txtWidth = l_title.GetWidth();
			int txtX = System.Convert.ToInt32(l_title.rect.x + l_title.rect.width/2 - txtWidth/2);
			l_star1.rect.x = txtX - l_star1.rect.width - 5;
			l_star2.rect.x = l_star1.rect.x - STAR_OFFSET;
			l_star3.rect.x = l_star2.rect.x - STAR_OFFSET;
		}
		else
		{
			l_title.rect.x = TITILE_X;
		}
		l_star1.SetVisible(pLevel>=1);
		l_star2.SetVisible(pLevel>=2);
		l_star3.SetVisible(pLevel>=3);
	}
}
