using UnityEngine;
using KBN;


public class PopMenu : KBNMenu
{
	[Space(30),Header("-------- PopMenu ---------")]
	//	public Label backLabel;
	public SimpleLabel frameSimpleLabel;
	private Rect backRect;
	private Rect m_rdRect;
	public bool m_lockRadio = true;
	
	private static float UI_BG_WOOD_WEN_HEIGHT = 20;
	
	public override void Init()
	{
		TextureMgr texMgr = TextureMgr.instance();
		TileSprite iconSpt = texMgr.IconSpt();

		canBeBottom = false;
		int borderX = 8;
		int borderY = 11;
		if( btnClose ){
			btnClose.rect = new Rect(rect.width - 100 - borderX, 0, 100 + borderX, 100 + borderY);
			if ( btnClose.mystyle.normal.background == null )
			{
				btnClose.mystyle.normal.background = texMgr.LoadTexture("button_popup1_close_normal", TextureType.BUTTON);
				btnClose.mystyle.active.background = texMgr.LoadTexture("button_popup1_close_down", TextureType.BUTTON);
			}

			btnClose.mystyle.overflow.left = btnClose.mystyle.normal.background.width - 100;
			btnClose.mystyle.overflow.bottom = btnClose.mystyle.normal.background.height  - 100;
			btnClose.mystyle.overflow.top =  -borderY;
			btnClose.mystyle.overflow.right =  - borderX;

			btnClose.OnClick = new System.Action(()=>
			{
				MenuMgr.instance.PopMenu("");
			});
		}
		
		frameSimpleLabel.Sys_Constructor();
		frameSimpleLabel.mystyle.border = new RectOffset(65, 65, 65, 65);
		frameSimpleLabel.rect = new Rect(0, 0, rect.width, rect.height -3);

		if ( iconSpt != null )
		{
			frameSimpleLabel.useTile = true;
			frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
		}

		bgStartY = 0;
		Texture2D img = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_paper_bottomSystem");
		bgMiddleBodyPic.rect = new Rect(bgMiddleBodyPic.rect.x, bgMiddleBodyPic.rect.y, rect.width, bgMiddleBodyPic.rect.height);

		if(this.setDefautlFrame)
		{
			marginT = texMgr.LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
		}
	
		resetLayout();
	}
	
	public bool LockRadio
	{
		get
		{
			return m_lockRadio;
		}
		set
		{
			m_lockRadio = value;
		}
	}

	public virtual void resetLayout()
    {
        ResetLayoutWithRectOffset(new RectOffset(0, 0, 0, 0));
    }
    
    protected void ResetLayoutWithRectOffset(RectOffset rectOffset)
	{
    	repeatTimes = (int)((rect.height - 15 - rectOffset.vertical) / UI_BG_WOOD_WEN_HEIGHT);
		backRect = new Rect( 5 + rectOffset.left, 5 + rectOffset.top, rect.width - 15 - rectOffset.horizontal, rect.height - 15 - rectOffset.vertical);
		frameSimpleLabel.rect.x = rectOffset.left;
		frameSimpleLabel.rect.y = rectOffset.top-7;
		frameSimpleLabel.rect.width = rect.width - rectOffset.horizontal;
		frameSimpleLabel.rect.height = rect.height - rectOffset.vertical+7;
        if (btnClose != null)
        {
            btnClose.rect.y += rectOffset.top;
            btnClose.rect.x -= rectOffset.right;
        }
	}
	
	public Rect GetRenderRect()
	{
		return m_rdRect;
	}
	
	private class RenderInfo
	{
		public Rect rdRect;
		public Matrix4x4 matrix;
	}
	
	private static RenderInfo priv_calcLockRadioValueInfo(Rect inRect, float scale, bool lockRadio)
	{
        Matrix4x4 scaleMatrix = Matrix4x4.Scale  ( new Vector3 (scale, scale, 1.0f));
		RenderInfo rdInfo = new RenderInfo();
		if ( !lockRadio )
		{
			rdInfo.rdRect = inRect;
			rdInfo.matrix = scaleMatrix * GUI.matrix;
			return rdInfo;
		}

		float logicWidth = 1.0f;
		float logicHeight = 1.0f;
		if ( (_Global.ScreenWidth * MenuMgr.SCREEN_HEIGHT) > (MenuMgr.SCREEN_WIDTH * _Global.ScreenHeight) )
		{
			logicWidth = (1.0f * _Global.ScreenWidth * MenuMgr.SCREEN_HEIGHT) / (1.0f * MenuMgr.SCREEN_WIDTH * _Global.ScreenHeight);
		}
		else
		{
			logicHeight = (1.0f * MenuMgr.SCREEN_WIDTH * _Global.ScreenHeight) / (1.0f * _Global.ScreenWidth * MenuMgr.SCREEN_HEIGHT);
		}

		rdInfo.matrix = _Global.calcGUIMatrix(logicWidth * MenuMgr.SCREEN_WIDTH, logicHeight * MenuMgr.SCREEN_HEIGHT);
		
		rdInfo.matrix = scaleMatrix*rdInfo.matrix;

		rdInfo.rdRect = new Rect(inRect);
		Vector2 center = inRect.center;
		rdInfo.rdRect.x =  logicWidth * center.x - rdInfo.rdRect.width * 0.5f;
		rdInfo.rdRect.y = logicHeight * center.y - rdInfo.rdRect.height * 0.5f;
		return rdInfo;
	}
	
	public override int Draw()
	{
		if(!visible)
			return -1;

		if(disabled && Event.current.type != EventType.Repaint)	
			return -1;

		Color oldColor = GUI.color;
		GUI.color = m_color;

		Matrix4x4 matrix = GUI.matrix;
		RenderInfo rdInfo = priv_calcLockRadioValueInfo(rect, m_scale, m_lockRadio);
		GUI.matrix = rdInfo.matrix;

       	m_rdRect = rdInfo.rdRect;
		if(adapterIphoneX){
			Matrix4x4 scaleMatrix = Matrix4x4.Scale  ( new Vector3 (scaleX, iphoneXSacleY, 1.0f));
			GUI.matrix = scaleMatrix * rdInfo.matrix;
			float f= m_rdRect.y*scaleY+offsetY;

			GUI.BeginGroup(new Rect (m_rdRect.x,f,m_rdRect.width,m_rdRect.height));
			DrawBackground();
			DrawTitle();
			DrawItem();
			
			//last draw framelabel and btnClose
			frameSimpleLabel.Draw();
			if( btnClose ){
				btnClose.Draw();
			}
			DrawLastItem();

			GUI.EndGroup();


		}else{
			GUI.BeginGroup(m_rdRect);
			DrawBackground();
			DrawTitle();
			DrawItem();
			
			//last draw framelabel and btnClose
			frameSimpleLabel.Draw();
			if( btnClose ){
				btnClose.Draw();
			}
			DrawLastItem();
			GUI.EndGroup();
		}

//		GUI.BeginGroup(m_rdRect);
//		DrawBackground();
//		DrawTitle();
//		DrawItem();
//
//		//last draw framelabel and btnClose
//		frameSimpleLabel.Draw();
//		if( btnClose ){
//			btnClose.Draw();
//		}
//		DrawLastItem();
//		GUI.EndGroup();	




		GUI.color = oldColor;
		GUI.matrix = matrix;
		return -1;
	}
	
	public override void OnPush(object param)
	{			
		checkIphoneXAdapter();
		PlayModalOpen();
	}
	
	
    protected override void DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;

		//if ( marginT == null )
			//return;
	//	backLabel.Draw();
		GUI.BeginGroup(backRect);
//			DrawMiddleBg(rect.width - 10);
			DrawMiddleBg((int)backRect.width, 0);
		//GUI.DrawTextureWithTexCoords(new Rect(0, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		//GUI.DrawTextureWithTexCoords(new Rect(rect.width - 9 - 23, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.EndGroup();
		
	}
	
	protected override void DrawTitle()
	{
		if ( title != null )
			title.Draw();
	}
	
	protected virtual void DrawLastItem()
	{
	}
}
