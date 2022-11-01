
using UnityEngine;
using KBN;

public class GearScrollViewItem
	: ListItem , ITouchable
{
	public enum ItemType
	{
		Scroll,
		Blank,
		Knight,
		ArmPanel,
		Move
	}

	public class Tag
	{
		public ItemType type = ItemType.Scroll;
		public int position = -1;
		public ItemType sourceType = ItemType.Blank;
	}
	//======================================================================================================
	//field
	protected string mImageName;
	protected string mBackgroundName;
	protected string mBackgroundActiveName;
	public Tag tagItem;
	public Button btn;
	private SimpleLabel m_gearFrame = new SimpleLabel ();
	public Label lblIcon;
	//public NotifyBug notfiyNum;
	protected FlashSqare m_flushAnim = null;
	private Arm mArm;

	public SimpleButton leftButton;
	
	//======================================================================================================
	//initialzation
	public int margin;

	public override void Init ()
	{
		InitStar ();
		InitNumber ();
		InitHilight ();
		InitTag ();
		InitSensingArea ();
		useIcon = false;
		InitLeftButton();
		GestureManager.singleton.RegistTouchable (this);
	}

	private void InitTag ()
	{
		if (tagItem == null)
		{
			tagItem = new Tag ();
			tagItem.type = ItemType.Scroll;
		}
	}
	
	protected void InitButton()
	{
		isRed = false;

		if (btn != null)
		{
			btn.Init (); 
			InitPicName ();
			btn.mystyle.padding.top = 65;
			btn.mystyle.border.left = 0;
			btn.mystyle.border.right = 0;
			btn.mystyle.border.top = 0;
			btn.mystyle.border.bottom = 0;
			//btn.OnClick = new System.Action (OnItemClick);

			m_gearFrame.rect = btn.rect;
		}
	}

	private void InitLeftButton()
	{
		leftButton.Init();
		leftButton.SetVisible(false);
		leftButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mysterious_property", TextureType.DECORATION);

	}



	protected void InitPicName ()
	{ 
		if (btn == null)
			return;
		GearManager gearMgr = GearManager.Instance ();

		if (TheArm != null) 
		{
			if(TheArm.PlayerID == Constant.Gear.InValidArmID)
			{
				string name =  gearMgr.GetBackgroundName (mArm);
				btn.mystyle.normal.background = TextureMgr.instance ().LoadTexture (name, TextureType.BUTTON);
				return;
			}
		}
		mBackgroundActiveName = gearMgr.GetBackgroundActiveName (mArm);
		btn.mystyle.active.background = TextureMgr.instance ().LoadTexture (mBackgroundActiveName, TextureType.BUTTON);
		if (!isRed)
		{
			mBackgroundName = gearMgr.GetBackgroundName (mArm);
			btn.mystyle.normal.background = TextureMgr.instance ().LoadTexture (mBackgroundName, TextureType.BUTTON);
			m_gearFrame.mystyle.normal.background = gearMgr.GetGearFrameLabel (mArm);
		}
		else
		{
			mBackgroundName = gearMgr.GetBackgroundNameRed (mArm);
			m_gearFrame.mystyle.normal.background = null;
			btn.mystyle.normal.background = TextureMgr.instance ().LoadTexture (mBackgroundName, TextureType.BUTTON);
			btn.normalColor = Color.white;
			btn.activeColor = Color.white;
		}
	}
	//label
	private float armPicWidth;
	private float armPicHeight;

	public int PicWidth
	{
		get
		{
			return (int)armPicWidth;
		}
	}

	public int PicHeight
	{
		get
		{
			return (int)armPicHeight;
		}
	}

	protected void InitLabel()
	{
		if (TheArm != null) 
		{
			if(TheArm.PlayerID == Constant.Gear.InValidArmID)
			{
				return;
			}
		}

		if (lblIcon != null)
		{	
			mImageName = GearManager.Instance ().GetImageName (mArm);
			lblIcon.Init ();
			Rect r;

			lblIcon.tile = TextureMgr.instance ().GetGearIcon (mImageName);
			lblIcon.useTile = true;
			r = TextureMgr.instance ().GetGearSpt ().GetFullRect (mImageName);
	
			CalculateDrawRect (r);
		}
	}

	private bool isRed;
	
	public bool IsRed
	{
		set
		{
			if (TheArm == null) 
				return;

			if(TheArm.PlayerID == Constant.Gear.InValidArmID)
			{
				return;
			}


			isRed = value;
			if (btn == null)
			return;
			if (isRed)
			{
				btn.mystyle.normal.background = TextureMgr.instance ().LoadTexture (mBackgroundName + "_red", TextureType.BUTTON);
				m_gearFrame.mystyle.normal.background = null;
			}
			else
			{
				btn.mystyle.normal.background = TextureMgr.instance ().LoadTexture (mBackgroundName, TextureType.BUTTON);
				GearManager gearMgr = GearManager.Instance ();
				m_gearFrame.mystyle.normal.background = gearMgr.GetGearFrameLabel (mArm);
			}
		}
	}

	private void CalculateDrawRect (Rect r)
	{
		armPicWidth = r.width;
		armPicHeight = r.height;

		if (btn == null || armPicWidth == 0 || armPicHeight == 0)
		{
			lblIcon.rect.width = armPicWidth;
			lblIcon.rect.height = armPicHeight;
			lblIcon.rect.x = 0;
			lblIcon.rect.y = 0;
			return;
		}
		//WithinRect(r);
		/**/
		float dw = armPicWidth;
		float dh = armPicHeight;
	
		float bw = btn.rect.width;
		float bh = btn.rect.height;
	
		float dp = dh / dw;
		float bp = bh / bw;
	
		if (dp > bp)
		{
			dh = bh;
			dw = dh / dp;
		}
		else if (dp < bp)
		{
			dw = bw;
			dh = dw * dp;
		}
		else
		{
			dw = bw;
			dh = bh;
		}

		lblIcon.rect.width = dw;
		lblIcon.rect.height = dh;
		lblIcon.rect.x = btn.rect.x + bw / 2 - dw / 2;
		lblIcon.rect.y = btn.rect.y + bh / 2 - dh / 2;
        
        
        /*
        if(lblIcon != null && btn != null)
		{
			lblIcon.rect.x = btn.rect.x + lblIcon.rect.x;
			lblIcon.rect.y = btn.rect.y + lblIcon.rect.y;
		}
		*/
	}
	
	public void WithinRect (Rect r)
	{
		float dw = armPicWidth;
		float dh = armPicHeight;
	
		float bw = r.width;
		float bh = r.height;
	
		float dp = dh / dw;
		float bp = bh / bw;
	
		if (dp > bp)
		{
			dh = bh;
			dw = dh / dp;
		}
		else if (dp < bp)
		{
			dw = bw;
			dh = dw * dp;
		}
		else
		{
			dw = bw;
			dh = bh;
		}
		if(lblIcon != null)
		{
			lblIcon.rect.width = dw;
			lblIcon.rect.height = dh;
			lblIcon.rect.x = bw / 2 - dw / 2;
			lblIcon.rect.y = bh / 2 - dh / 2;
		}
		rect = r;
	}
	
	public override  void SetRect (Rect r)
	{
		SetRect (r.x, r.y, r.width, r.height);
	}

	public void SetRect (float x, float y, float width, float height)
	{
		rect.x = x;
		rect.y = y;
		rect.width = width;
		rect.height = height;
	
		if (lblIcon != null)
		{
			lblIcon.rect.x = margin / 2;
			lblIcon.rect.y = 0;
			lblIcon.rect.width = rect.width - margin;
			lblIcon.rect.height = rect.height;
		}
		if (btn != null)
		{
			btn.rect.x = 0;
			btn.rect.y = 0;
			btn.rect.width = width;
			btn.rect.height = height;	
			m_gearFrame.rect = btn.rect;
		}
	}
	//======================================================================================================
	//ITouchable interface
	private Vector2 mAbsoluteVector;
	private Rect mAbsoluteRect;
	private System.Action<ITouchable> mActivated;
	private int mZOrder = 10;

	public string GetName ()
	{
		return "";
	}

	public bool IsVisible ()
	{
		return visible;
	}
	
	public Rect GetAbsoluteRect ()
	{
		mAbsoluteRect.x = mAbsoluteVector.x;
		mAbsoluteRect.y = mAbsoluteVector.y;
		if (useSensingArea)
		{
			mAbsoluteRect.width = sensingArea.width;
			mAbsoluteRect.height = sensingArea.height;	
		}
		else if (btn != null)
		{
			mAbsoluteRect.width = rect.width;
			mAbsoluteRect.height = rect.height;	
		}
		else
		{
			mAbsoluteRect.width = rect.width;
			mAbsoluteRect.height = rect.height;
		}
		return mAbsoluteRect;
	}

	//public void SetZOrder ()
	//{
	//	return mZOrder;
	//}

	public int GetZOrder ()
	{
		return mZOrder;
	}

	private void UpdateAbsoluteVector ()
	{
		if (useSensingArea)
			GUI.BeginGroup (sensingArea);
		else if (btn != null)
			GUI.BeginGroup (btn.rect);
	
		mAbsoluteVector = GUIUtility.GUIToScreenPoint (new Vector2 (0, 0));
	
		if (useSensingArea)
			GUI.EndGroup ();
		else if (btn != null)
			GUI.EndGroup ();
	}

	public void SetTouchableActiveFunction (System.Action<ITouchable> Activated)
	{
		mActivated = Activated;
	}

	private void DrawInterface ()
	{	
		if (mActivated != null)
			mActivated (this);
	}

	//======================================================================================================
	//update
	public override void Update ()
	{
		if (alphaEnable)
		{
			if (lblIcon != null)
			{
				lblIcon.alphaEnable = true;
				lblIcon.alpha = this.alpha;
			}
		}
		UpdateHilight ();
		UpdateLeftButton();
	}
	//======================================================================================================
	//draw
	Color color;

	public override int Draw ()
	{	
		if (!base.visible)
			return -1;
	
		base.prot_calcScreenRect ();
	
		GUI.BeginGroup (rect);
		
		
		if (EventType.Repaint == Event.current.type)
        {
			UpdateAbsoluteVector ();
			color = GUI.color;

		
			if (btn != null)
			{
				btn.Draw ();
				m_gearFrame.Draw ();
			}
			GUI.color = color;	
			DrawNubmer ();
		
			if (lblIcon != null)
			{
				if (btn != null)
				GUI.BeginGroup (btn.rect);
				lblIcon.Draw ();
				if (btn != null)
				GUI.EndGroup ();	
			}
			if (m_flushAnim != null)
			{
				m_flushAnim.Draw(lblIcon.rect);
			}
			DrawInterface ();
			DrawStar ();
			DrawLeftButton();
			DrawHilight ();
		}
		else
		{
			DrawLeftButton();
			if (btn != null)
			{
				btn.Draw ();
			}
		}

		GUI.EndGroup ();
		return 0;
	}
	//======================================================================================================
	//getter and setter
	private bool useIcon;

	public bool UseIcon
	{
		set
		{
			useIcon = value;
		}
		get
		{
			return useIcon; 
		}
	}
	
	public Arm TheArm
	{
		set 
		{
			this.mArm = value;
			if (value == null)
			return;

			InitButton ();
			InitLabel ();
			if (star != null)
				star.Level = TheArm.StarLevel;
		}
	
		get
		{
			return this.mArm;
		}
	}
	
	public override void SetUIData (System.Object data)
	{
		useIcon = false;
		TheArm = data as Arm;
		this.WithinRect (rect);
	}
	//======================================================================================================	
	//event

	//======================================================================================================	
	//star
	public StarLevel star;
	
	public void InitStar ()
	{
		if (star != null)
			star.Init ();
	}
	
	public void DrawStar ()
	{
		if (star != null)
			star.Draw ();
	}

	public override void OnPopOver ()
	{
		GestureManager.singleton.RemoveTouchable (this);	
		if (this.btn != null)
			this.btn.OnPopOver ();
		if (this.lblIcon != null)
			this.lblIcon.OnPopOver ();
		if (this.star != null)
			this.star.OnPopOver ();
		btn = null;
		m_gearFrame = null;
		lblIcon = null;
		UIObject.TryDestroy (this);
	}
	
	
	//======================================================================================================
	//number
	public Label number;
	private int num;
	
	public int Num
	{
		set
		{
			if (number != null)
			{
				num = value;
				number.txt = num.ToString ();
			}
		}
	}
	
	private void InitNumber ()
	{
		if (number != null)
		{
			number.Init ();
			number.txt = "";
		}
	}

	private void DrawNubmer ()
	{
//		if(number != null)
//		number.Draw();
	}
	
	//======================================================================================================
	//hilight
	public FlashLabel hilight;
	
	private void InitHilight ()
	{
		if (hilight == null)
			return;
		hilight.Init ();
		GearManager.Instance ().SetImageNull (hilight);
		hilight.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("kuang1", TextureType.DECORATION);
	
		hilight.mystyle.border.top = 8;
		hilight.mystyle.border.bottom = 8;
		Darken ();
	
		hilight.Screenplay.OnPlayFinish = OnFlashFinish;
		hilight.From = 1.0f;
		hilight.To = 1.0f;
		hilight.Times = 0;
	
	}
	
	private void OnFlashFinish (IScreenplay screenplay)
	{
	/*
		if(hilight.isVisible())
	{
		hilight.Begin();
	}
	*/
	}
	
	private void DrawHilight ()
	{
		if (hilight == null)
			return;
		hilight.Draw ();
	}

	private void UpdateHilight ()
	{
		if (hilight == null)
			return;
		hilight.Update ();
	}
	private void UpdateLeftButton()
	{
		leftButton.Update();
	}
	private void DrawLeftButton()
	{
		leftButton.Draw();
	}
	public void Hilighten ()
	{
		if (hilight == null)
			return;
		hilight.SetVisible (true);
		hilight.Begin ();
	}
	
	public void Darken ()
	{
		if (hilight == null)
			return;
		hilight.SetVisible (false);
	}
	
	public override void SetRowData (object data)
	{
		Arm arm = data as Arm;
		if (arm == null)
			return;
	
		useIcon = false;

		//if (arm.PlayerID != Constant.Gear.InValidArmID)
		TheArm = arm;


		if ( hilight != null )
			hilight.SetVisible (false);
		if ( star != null )
			star.SetVisible (true);
		if (number != null)
			number.txt = "";
		if(lblIcon != null)
			lblIcon.SetVisible(true);
		if(m_gearFrame != null) 
			m_gearFrame.SetVisible(true);
		GestureManager.singleton.RegistTouchable (this);
		IsRed = arm.Tag.isRed;


		if (arm.PlayerID == Constant.Gear.InValidArmID)
		{
			IsRed = false;
			GestureManager.singleton.RemoveTouchable (this);
			if ( star != null )
				star.SetVisible (false);
			if(lblIcon != null)
				lblIcon.SetVisible(false);
			if(m_gearFrame != null) 
				m_gearFrame.SetVisible(false);

			//hilight.SetVisible (false);
			GestureManager.singleton.RemoveTouchable (this);
		}


	}
	//======================================================================================================
	//Sensing area
	private Rect sensingArea;
	private bool useSensingArea;
	//private Label testLable;
	private void InitSensingArea ()
	{
		useSensingArea = false;
	//	testLable = GameObject.Instantiate(lblIcon);
	//	testLable.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mask_Lightcolor",TextureType.GEAR);
	//	testLable.rect = lblIcon.rect;
	}
	
	public Rect SensingArea
	{
		set
		{
			sensingArea = value;
			useSensingArea = true;
		}
	}
}
