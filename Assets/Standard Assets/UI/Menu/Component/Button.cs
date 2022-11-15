using UnityEngine;
using System;
using System.Collections;

public class Button : SimpleUIObj, ITouchable
{
	[Space(30), Header("----------Button----------")]

	// Use this for initialization
	public string action;
	public string actionParam;
	public string transition;
	
	public Texture image;
	
	public Color normalColor = Color.white;
	public Color activeColor = Color.white;

	public object clickParam = null;
	//private float delayTime = 0.0f;
	private bool m_bClicked = false;
	private Texture2D normalTexture;
	private bool isDown;
	private bool hasOnlyDownBG = false;
	
	[SerializeField] private bool _enableSound = true;
	[SerializeField] private string _clickSound = string.Empty;

	//public	void Awake(){
	//	base.Awake();
	//}
	
	void Start() {
	//	InitPos();
		InitTouchable();
	}

	/*
		// Update is called once per frame
		public override void Update() {
	
		}
	 */
	
	void Copy(Button src)
	{
		rect = src.rect;
		mystyle = src.mystyle;
		category = src.category;
		content = src.content;
	}

	private bool isPlay = false; 
	private bool isFadein = false;
	private bool isFadeout = false; 
	private int normalSpeed = 5;
	private int speedup = 10; 
	private int speed = 0;
	private float curGUICounter = 0;
	//private float timer = 0;
 
	
	public void hasOnlyDownBackground(bool _hasOnlyDownBG)
	{
		hasOnlyDownBG = _hasOnlyDownBG;
	}
	
	public override int Draw()
	{
		Color oldColor = GUI.color;
        Matrix4x4 oldMatrix = GUI.matrix;
		int r = priv_DrawBYRect(rect,true);
        GUI.matrix = oldMatrix;
		GUI.color = oldColor;
		return r;
	}



	public void setNorAndActBG(string normalBg, string activeBg)
	{
		mystyle.normal.background = TextureMgr.instance().LoadTexture(normalBg, TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture(activeBg, TextureType.BUTTON);
	}

	//public Vector2 getScreenPos()
	//{
	//	return curScreenPos;
	//}
	
	public override int Click()
	{
		KBN.GameMain.singleton.IsOnClick=true;
		if(KBN.GameMain.singleton.TouchForbidden)
		{
			return -1;
		}
		
		if(_enableSound)
		{
			SoundMgr.instance().PlayEffect(string.IsNullOrEmpty(_clickSound) ? "on_tap" : _clickSound,
										/*TextureType.AUDIO*/"Audio/");
		}

		if(m_onClick != null)
		{
			
			Click(clickParam);
			//return;
		}
//		if(action == "pushMenu")
//		{
//			MenuMgr.getInstance().PushMenu(actionParam, null, transition);
//			return 0;
//		}
//		else if(action == "popMenu")
//		{
//			MenuMgr.getInstance().PopMenu(actionParam, transition);
//			return 0;
//		}
		return -1;
	}


	
	public void DrawBackground()
	{
	}
	
	public void changeToRed()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_red_normal",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_red_down",TextureType.BUTTON);
	}
	public void changeToRedNew()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_red_normalnew",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_red_downnew",TextureType.BUTTON);
	}
	public void changeToOrange()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_Orange_normalnew",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_Orange_downnew",TextureType.BUTTON);
	}
	
	public void changeToBlue()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normal",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_down",TextureType.BUTTON);
	}
	public void changeToBlueNew()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
	}
	public void changeToGreen()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normal",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_down",TextureType.BUTTON);
	}
	public void changeToGreenNew()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
	}
	public void gemsChangeToGreen()
	{
		_enableSound = true;
		SetDisabled(false);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_getmore_normal",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_getmore_down",TextureType.BUTTON);
	}
	public void changeToGrey()
	{
		_enableSound = false;
		SetDisabled(true);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
	}
	public void changeToGreyNew()
	{
		_enableSound = false;
		SetDisabled(true);
		mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
		mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
	}

	/// <summary>
	/// 改变按钮的可点击状态：蓝色（新）
	/// </summary>
	/// <param name="InEnable"></param>
	public void EnableBlueButton(bool InEnable) {
		if (InEnable) {
			changeToBlueNew();
			SetDisabled(false);
		} else {
			changeToGreyNew();
			SetDisabled(true);
		}
	}

	/// <summary>
    /// 改变按钮的可点击状态：绿色（新）
    /// </summary>
    /// <param name="InEnable"></param>
	public void EnableGreenButton(bool InEnable)
	{
		if (InEnable)
		{
			changeToGreenNew();
			SetDisabled(false);
		}
		else
		{
			changeToGreyNew();
			SetDisabled(true);
		}
	}


	public override void OnPopOver() 
	{
		UIObject.TryDestroy(this);
	}
	//======================================================================================================
	//ITouchable interface
	protected Vector2 mAbsoluteVector;
	protected Rect mAbsoluteRect;
	protected Action<ITouchable> mActivated;
	protected string mName;
	protected int mZOrder;
	protected Rect mTouchRect;
	private void InitTouchable()
	{
		mTouchRect = rect;
	}
	public Rect TouchRect
	{
		set {
			mTouchRect = value;
		}
		get {
			if(mTouchRect == Rect.zero)
				return rect;
			return mTouchRect;
		}
	}
	
	public void SetZOrder(int order)
	{
		mZOrder = order;
	}
	public void SetName(string name)
	{	
		mName = name;
	}
	public virtual string GetName()
	{
		return mName;
	}
	public bool IsVisible()
	{
		return visible;
	}
	
	public Rect GetAbsoluteRect()
	{
		mAbsoluteRect.x = mAbsoluteVector.x;
		mAbsoluteRect.y = mAbsoluteVector.y;
		mAbsoluteRect.width = TouchRect.width;
		mAbsoluteRect.height = TouchRect.height;
		return mAbsoluteRect;
	}

	public virtual int GetZOrder()
	{
		return mZOrder;
	}	
	protected void UpdateAbsoluteVector()
	{
		GUI.BeginGroup(TouchRect);
		mAbsoluteVector = GUIUtility.GUIToScreenPoint(Vector2.zero);
		GUI.EndGroup();
	}
	public void SetTouchableActiveFunction(Action<ITouchable> Activated)
	{
		mActivated = Activated;
	}
	protected void DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this);
	}





	public int Draw(float x,float y)
	{
		Color oldColor = GUI.color;

		int r = priv_DrawBYRect(new Rect(rect.x + x, rect.y + y, rect.width, rect.height));
		GUI.color = oldColor;
		return r;
	}





	private int priv_DrawBYRect(Rect tempRect, bool isDoRotationAndScaling = false)
	{
		if( !visible ){
			return 0;
		}
		DrawInterface();
		UpdateAbsoluteVector();
		
		if(Event.current.type != EventType.Repaint && disabled ){
			return 0;
		}

		if (isDoRotationAndScaling) {
			applyRotationAndScaling();
		}

		base.prot_calcScreenRect();
		
//		FontMgr.SetStyleFont(mystyle, font,FontType.GEORGIAB);
		SetFont();
		SetNormalTxtColor();
		SetOnNormalTxtColor();



		EventType eType = Event.current.type;
		if(isDown && (!tempRect.Contains(Event.current.mousePosition) || Event.current.type == EventType.MouseUp))
		{
			isDown = false;
			
			if(isPlay)
			{						
				isFadeout = true;		
				if(isFadein)
				{ 					
					speed = speedup;					
				}
				else
				{
					speed = normalSpeed;
				}
			}			
		}
		
		if( isDown && (Application.platform ==	RuntimePlatform.IPhonePlayer || Application.platform ==	RuntimePlatform.Android) )
		{
			if (Input.touchCount  < 1 )
				isDown = false;
		}	
		
		if(Event.current.type != EventType.Repaint)
		{
			if(GUI.Button(tempRect, prot_getGUIContent(txt, image)) && !KBN.GameMain.singleton.ForceTouchForbidden && !m_bClicked)
			{
				if(isPlay)
				{		

					isFadeout = true;		
					if(isFadein)
					{ 					
						speed = speedup;					
					}
					else
					{
						speed = normalSpeed;
					}
				}
				
				m_bClicked = true;
				return 0;
			}

			if(Event.current.type != EventType.MouseDown && eType == EventType.MouseDown)
			{			
				if(!isPlay)
				{
					isDown = true; 
					isPlay = true;
					isFadein = true;
					isFadeout = false;
					curGUICounter = 1;
					speed = normalSpeed;
				}			
			}	
			return 0;
		}

		if(!isPlay || (!isFadein && !isFadeout))
		{
			if ( !isDown )
				GUI.color *= normalColor;
			else
				GUI.color *= activeColor;
			Color c = GUI.color;
			c.a *= alpha;
			GUI.color = c;
			mystyle.Draw(tempRect, prot_getGUIContent(txt,image), isDown, isDown, false, false);
			return 0;
		}

		if(!isFadein && curGUICounter == 1 && m_bClicked)
		{
			Click();
		}
		
		curGUICounter -= Time.deltaTime * speed;
		
		if(curGUICounter < 0)
		{
			curGUICounter = 0;
		}
		
		if(!hasOnlyDownBG)
		{
			Color c = GUI.color;
			c *= isFadein?activeColor:normalColor;
			c.a *= alpha;
			GUI.color = c;
			mystyle.Draw(tempRect, prot_getGUIContent(txt,image), isFadein, isFadein, false, false);			

			c *= isFadein?normalColor:activeColor;// * curGUICounter;
			c.a *= alpha * curGUICounter;
			GUI.color = c;
			mystyle.Draw(tempRect, prot_getGUIContent(txt,image), !isFadein, !isFadein, false, false);	
		}
		else
		{
			Color c = GUI.color;
			c *= normalColor;;
			c.a *= alpha * (isFadein ? 1 - curGUICounter : curGUICounter);
			GUI.color = c;
			mystyle.Draw(tempRect, prot_getGUIContent(txt,image), true, true, false, false);	
		}

		if(curGUICounter == 0)
		{ 
			if(isFadein)
			{
				isFadein = false;
				curGUICounter = 1; 
				speed = normalSpeed;	
			}
			else
			{
				if(isFadeout)
				{
					isPlay = false;
					m_bClicked = false;
				}	
			}
		}

		return -1;
	}
	
}
