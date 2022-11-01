using UnityEngine;
using System.Collections;
using KBN;
public enum MENUSTATE{
	Disappear,
	FadeIn,
	FadeOut,
	Show,
	
	StateNum,
}


public class KBNMenu : UIObject
{
	[Space(30),Header("--------KBNMenu---------")]

	//public UIObject button;
	public int fadeinSpeed = 30;
	//public var menuMgr;
	public Label title;
	public Button btnClose;
	public SimpleLabel frameTop;
	public SimpleLabel m_top;
	public SimpleLabel m_bottom;
	public Tile titleBack;
	public float offsetY = 57;
	
	//needed by zhouwei
	public Tile bgMiddleBodyPic;
	public int bgStartY;
	public int repeatTimes;
	public Tile bgBottomBodyPic;
	
	public  bool setDefautlFrame = true;
	
	public string menuName = "";
	
	protected Rect showRect;
	protected Texture2D marginT;
	//protected int state;
	public float m_scale =1;
	
	
	protected bool canBeBottom = false;
	protected float iphoneXSacleY=1;

	public  bool  adapterIphoneX=false;
	public  bool  showIphoneXFrame=true;
	
	public bool CanBeBottom
	{
		get
		{
			return canBeBottom;
		}
	}
	
	//	protected MENUSTATE state = MENUSTATE.Disappear;
	
	
	public Transition transition = null;
	//public BaseEffect effectTransition = null;

	public virtual void Start()
	{
		if(btnClose)
			btnClose.OnClick = null;
		m_scale = 1.0f;	
		canBeBottom = false;

		//SetVisible(false);
	}
	public override void Awake() {
		enabled = false;
		SetVisible(false);
		m_color = GUI.color;
		canBeBottom = false;
		//		DontDestroyOnLoad (transform.gameObject);
	}

	public virtual void PushDone()
	{
		
	}

	public void SetScale(float scale)
	{
		m_scale = scale;
	}

	public override int Draw(){		
		if(!visible)
			return -1;


		//		bool e = GUI.enabled;
		//		GUI.enabled = !disabled;	
		
//		m_top.rect.height=84;

		if(disabled && Event.current.type != EventType.Repaint)	
			return -1;
		DrawMask();
		Color oldColor = GUI.color;
		Matrix4x4 matrix = GUI.matrix; 
		Matrix4x4 scaleMatrix = Matrix4x4.Scale  ( new Vector3 (m_scale, m_scale, 1.0f));
		GUI.matrix = scaleMatrix*matrix ;
		GUI.color = m_color;	

		if(adapterIphoneX){

			if(showIphoneXFrame){
				GUI.BeginGroup(m_top.rect);
				m_top.Draw();
				GUI.EndGroup();
			}

			Matrix4x4 scale2 = Matrix4x4.Scale  ( new Vector3 (scaleX, iphoneXSacleY, 1.0f));
			GUI.matrix = scale2*matrix ;
			float f= rect.y*iphoneXSacleY+offsetY;
			GUI.BeginGroup(new Rect (rect.x,f,rect.width,rect.height));
			DrawBackground();
			DrawTitle();
			DrawItem();
			GUI.EndGroup();

			if(showIphoneXFrame){
				GUI.matrix = scaleMatrix*matrix ;
//				GUI.BeginGroup(new Rect(m_bottom.rect.x,960*0.9f+offsetY,m_bottom.rect.width,m_bottom.rect.height));
				GUI.BeginGroup(new Rect(m_bottom.rect.x,960 - m_bottom.rect.height,m_bottom.rect.width,m_bottom.rect.height));

				m_bottom.Draw();
				GUI.EndGroup();
			}



		}else{
			GUI.BeginGroup(rect);
			DrawBackground();
			DrawTitle();
			DrawItem();
			GUI.EndGroup();
		}


	

		GUI.color = oldColor;
		GUI.matrix = matrix;
		//		GUI.enabled = e;
		return -1;
	}

	public virtual void DrawMask()
	{
		
	}
	
	public virtual void OnPush(object param)
	{
		checkIphoneXAdapter();
		//	SetState(MENUSTATE.FadeIn);
		//		_Global.Log(m_scale);
		if(this.setDefautlFrame)
		{
//			repeatTimes = 44;
//			bgMiddleBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("ui_bg_wood");
			Texture2D img = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
			bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
			//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_bg_wood");
			//bgMiddleBodyPic.name = "ui_bg_wood";
			
			frameTop.Sys_Constructor();		
			frameTop.useTile = false;
			//			frameTop.tile.spt = TextureMgr.instance().BackgroundSpt();
			//			frameTop.tile.name = "frame_metal_top";
			frameTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top", TextureType.DECORATION);
			frameTop.mystyle.border = new RectOffset(27, 27, 0, 0);	
			frameTop.rect.height = 46;
			
			titleBack = TextureMgr.instance().BackgroundSpt().GetTile("bg_ui_second_layer");
			//titleBack.rect = titleBack.spt.GetTileRect("bg_ui_second_layer");
			titleBack.rect = new Rect(0, 0, titleBack.rect.width, titleBack.rect.height);
			//titleBack.name = "bg_ui_second_layer";
			//bgStartY = 0;
			
			bgBottomBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
			//bgBottomBodyPic.rect = titleBack.spt.GetTileRect("tool bar_bottom");
			//bgBottomBodyPic.name = "tool bar_bottom";
			
			marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
		}
		PlayModalOpen();
	}

	protected  void checkIphoneXAdapter(){
		if(KBN._Global.isIphoneX()) {
			adapterIphoneX=true;
			m_bottom.useTile=false;
			m_top.useTile=false;//iphoneX_Bottom
//
//			m_bottom.tile = TextureMgr.instance().BackgroundSpt().GetTile("small_bar_bottom");
//			m_top.tile = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
			m_top.mystyle.normal.background = TextureMgr.instance().LoadTexture("iphoneX_Top", TextureType.LOAD);
			m_bottom.mystyle.normal.background = TextureMgr.instance().LoadTexture("iphoneX_Bottom", TextureType.LOAD);
			m_top.rect.height=_Global.IphoneXTopFrameHeight();
			m_bottom.rect.height=_Global.IphoneXBottomFrameHeight();
			iphoneXSacleY=0.91f;//(_Global.ScreenHeight-m_top.rect.height-m_bottom.rect.height)/_Global.ScreenHeight;
			offsetY = 57;//m_top.rect.height;
//			rect.y=m_top.rect.height;
		}else 
		{
			adapterIphoneX=false;
//			rect.y=0;
		}
		
	}
	
	public void PlayModalOpen()
	{
		SoundMgr.instance().PlayEffect( "modal_open", /*TextureType.AUDIO*/"Audio/" );
	}
	
	public virtual void OnPop()
	{
		showRect = rect;
		//	SetState(MENUSTATE.FadeOut);
		//	transition.StartTrans(this);
	}
	
	public  UIRotation rotation;
	//	public Vector3 sVector;
	protected virtual void DrawBackground()
	{	  
		if(Event.current.type != EventType.Repaint)
			return;
		DrawMiddleBg();
	}
	
	protected virtual void DrawTitle()
	{
	}
	
	protected virtual void DrawItem()
	{
	}
	
	public virtual void OnPushOver()
	{
	}
	
	////
	public void sendNotification(string type,object body)
	{
		var dat = new Hashtable();
		dat["type"] = type;
		dat["body"] = body;
		sendNotification(dat);
	}

	public void sendNotification(object note)
	{
		KBN.MenuMgr.instance.sendNotification(note);
	}
	
	////{string type,Object body}
	public void handleNotification(Hashtable note)
	{
		handleNotification(note["type"] as string,note["body"]);
	}
	public virtual void handleNotification(string type, object body)
	{
	}
	
	public virtual void UpdateData()
	{
	}
	
	
	public virtual void close()
	{
		KBN.MenuMgr.instance.PopMenu(this.menuName);
		//		MenuMgr.getInstance().PopMenu("");
	}

	protected virtual void DrawMiddleBg()
	{
		float drawheight=rect.height;
		if(drawheight>960) drawheight=960;
		float mbgStart=Mathf.Clamp(bgStartY,0,960);
		if (bgMiddleBodyPic != null) 
		{
			bgMiddleBodyPic.Draw(new Rect(0, bgStartY, KBN.MenuMgr.SCREEN_WIDTH, rect.height),false);
			bgMiddleBodyPic.Draw(new Rect(0, mbgStart, KBN.MenuMgr.SCREEN_WIDTH, drawheight),false);
		}

		this.prot_drawFrameLine();
	}
	
	protected virtual void prot_drawFrameLine()
	{
//		if(frameTop != null && marginT != null)
//		{
//			GUI.DrawTextureWithTexCoords(new Rect(frameTop.rect.x - 10, frameTop.rect.y, 23, 20 * repeatTimes),
//			                             marginT, new Rect(0, 0, 1, repeatTimes), true);
//			GUI.DrawTextureWithTexCoords(new Rect(frameTop.rect.xMax - 13, frameTop.rect.y, 23, 20 * repeatTimes),
//			                             marginT, new Rect(0, 0, 1, repeatTimes), true);
//		}
	}
	
	protected void DrawMiddleBg(int width)
	{
		this.DrawMiddleBg(width,0);
	}
	
	protected virtual void DrawMiddleBg(int width,int startx)
	{
		this.DrawMiddleBg(width, (int)rect.height, startx);
	}
	
	protected void DrawMiddleBg(int width, int height, int startx)
	{
		if ( bgMiddleBodyPic != null )
			bgMiddleBodyPic.Draw(new Rect(startx, bgStartY, width, height), false);
	}
	
	public virtual NavigatorController getmyNacigator()
	{
		return null;
	}
	
	public virtual bool OnBackButton()
	{
		if(this.getmyNacigator() == null)	return false;
		if(this.getmyNacigator().uiNumbers <=1) return false;
		this.getmyNacigator().pop();
		return true;
	}
	
	public virtual void OnFadeinEnd()
	{
		
	}

	public virtual void OnBack(string preMenuName)
	{
	}
}
