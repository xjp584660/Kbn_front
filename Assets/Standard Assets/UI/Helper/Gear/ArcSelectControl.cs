
using UnityEngine;
using KBN;

public class ArcSelectControl : UIObject , ITouchable
{
	public  Label[] ItemLabels;
	public  Button MainLabel;
	//private Button mainLabel;
	
	public  string[] ItemImageNames;
	public  string[] ItemImageActiveNames;
	public  string MainImageName;
	public  string MainImageActiveName;
	public  string BackgroundImageName;
	
	public  System.Action<int> OnTouchEnd;
	
	public  Label Background;
	public  Label DebugLabel;
	public  Label CurrentItem;
	
	private Label backGround;
	
	private bool mIsOK = false;
	
	private IScreenplay ItemInScreenplay;
	private IScreenplay ItemOutScreenplay;
	private IScreenplay ItemTrembleScreenplay;
	
	
	private Rect[] Destinations;
//	public  Rect MainDestination;
	private Rect BackgroundDestination;
	private Rect backgroundDestination;
	
	private int mTestInt = 0;
	
	public  Button TestButton;
	
	private Vector2[] mItemsDistances;
	private Vector2 mBackgroundDistance; 
	private Vector2 backgroundDistance;
	private Vector2 mBasePoint;
	
	public  DisplayType displayType = DisplayType.RightArc;
	
	private float mR = 0.0f;
	
	public  float MainRadiusRate = 0.3f;
	public  float ItemRadiusRate = 0.2f;
	
	private TileSprite sprite;
	
	private bool useTile;
	//private bool enable;
	
	private bool diableInput = false;
	
	public enum DisplayType
	{
		LeftArc,
		RightArc,
		SemiCircle
	}
	
	public enum State
	{
		Fold,
		Expand,
		FoldStill,
		ExpandStill
	}
	private State mState = State.FoldStill;
	private void SetState(State state)
	{
		this.mState = state;
	}
	public TileSprite SPT
	{
		set
		{
		sprite = value;
		}
	}
	public bool UseTile
	{
		get
		{
			return useTile;
		}

		set
		{
			if(sprite == null) return;
			useTile = value;
			int i;
			if(useTile)
			{
				for(i = 0;i< ItemLabels.Length;i++)
				{
					ItemLabels[i].Init();
					ItemLabels[i].useTile = true;
					ItemLabels[i].tile = sprite.GetTile(ItemImageNames[i]);
					//if(ItemLabels[i].tile == null)
					//	ItemLabels[i].tile = new Tile();
					//ItemLabels[i].tile.spt = sprite;
					//ItemLabels[i].tile.name = ItemImageNames[i];
				}
				this.CurrentItem.Init();
				this.CurrentItem.useTile = true;
				this.CurrentItem.tile = sprite.GetTile(null);
				//if(this.CurrentItem.tile == null)
				//	this.CurrentItem.tile = new Tile();
				//CurrentItem.tile.spt = sprite;
				
			}
			else
			{
				for(i = 0;i< ItemLabels.Length;i++)
				{
					ItemLabels[i].Init();
					ItemLabels[i].useTile = false;
				}
				this.CurrentItem.Init();
				this.CurrentItem.useTile = false;
				this.CurrentItem.tile = null;
				//if(this.CurrentItem.tile == null)
				//	this.CurrentItem.tile = new Tile();
			}
		}
	}
	
	//public bool Enable
	//{
	//	set
	//	{
	//		enable = value;
	//	}
	//}

	public bool DisableInput
	{
		set
		{
			diableInput = value;
		}
	}

	public override void Init()
	{ 
		InitState();
		InitRate();
		InitItemLabels();
		InitMainLabel(); 
		InitScreenplay();
		InitDestinations();
		InitBackground();
		//InitBackgroundDestination();
		InitTestDebug();
		InitBasePoint();
		InitDistance();
		InitBackgroundDistance();
		
		diableInput = false;
	}  
	private void InitCurrentItem()
	{
		CurrentItem.Init();
	}
	private void InitState()
	{
		SetState(State.FoldStill);
	}
	private void InitRate()
	{
		mR = rect.height;
	}
	
	private void InitBasePoint()
	{
		mBasePoint = new Vector2(); 
		if(displayType != DisplayType.RightArc)
		{
			mBasePoint.x = mR;
		} 
		else
		{
			mBasePoint.x = 0;
		}
		mBasePoint.y = mR;
	}
	
	private void InitTestDebug()
	{
		DebugLabel.Init();
		TestButton.Init();
		TestButton.OnClick = new System.Action(OnTestClick);
	}
	
	private void OnTestClick()
	{
		int n = 7;
		if( mTestInt % n == 0)
		{
			Expand();
		}
		else if(mTestInt % n == 1)
		{
			if(OnTouchEnd != null)
				OnTouchEnd(0);			
		}
		else if(mTestInt % n == 2)
		{
			if(OnTouchEnd != null)
				OnTouchEnd(1); 
		}
		else if(mTestInt % n == 3)
		{
			if(OnTouchEnd != null)
				OnTouchEnd(2); 
		}
		else if(mTestInt % n == 4)
		{
			if(OnTouchEnd != null)
				OnTouchEnd(3); 
		}
		else if(mTestInt % n == 5)
		{
			if(OnTouchEnd != null)
				OnTouchEnd(3); 
		}		
		else if(mTestInt % n == 6)
		{
			Fold();	
		}		
		mTestInt++;		
	}
	
	//private Rotate rotateEffect;
	
	private void InitBackground()
	{ 
		if(Background == null) return; 
		Background.Init();
		Background.mystyle.normal.background = TextureMgr.instance().LoadTexture(BackgroundImageName,TextureType.GEAR);
		
		//rotateEffect = new Rotate();
		
		if(this.displayType == DisplayType.LeftArc)
		{
			BackgroundDestination = new Rect(0,0,mR,mR);
		} 
		else if(this.displayType == DisplayType.RightArc)
		{
			BackgroundDestination = new Rect(0,0,mR,mR);
		}
		else if(this.displayType == DisplayType.SemiCircle)
		{
			backGround = (Label)GameObject.Instantiate(Background);
			
			BackgroundDestination = new Rect(mR,0,mR,mR);
			backgroundDestination = new Rect(0,0,mR,mR); 
			
			Background.rect = BackgroundDestination;
			backGround.rect = backgroundDestination;

			backGround.rotateAngle = -90;
			
			//rotateEffect.init(backGround, EffectConstant.RotateType.ROTATE_INSTANT, Rotate.RotateDirection.CLOCKWISE, 0, -90);
			//rotateEffect.playEffect();
		}
	}
	private void InitDestinations()
	{
		float min = 0.0f;
		float max = 0.0f;
		Destinations = new Rect[ItemLabels.Length];
		if(DisplayType.LeftArc == displayType)
		{
			min = Mathf.PI / 2;
			max = Mathf.PI;
		}
		else if(DisplayType.RightArc == displayType)
		{
			min = 0.0f;
			max = Mathf.PI / 2;
		}
		else if(DisplayType.SemiCircle == displayType)
		{
			min = 0.0f;
			max = Mathf.PI;
		}
		
		int n = ItemLabels.Length;
		float centerX = 0.0f;
		float centerY = 0.0f;
		float arc = 0.0f;
		float per = (max - min) / n;
		float r = mR * 0.6666667f;
		
		for(int i = 0; i < n; i++)
		{
			arc = min + i * per + per / 2;
			
			centerX = r * Mathf.Cos(arc);
			centerY = r * Mathf.Sin(arc);
			
			if(DisplayType.RightArc != displayType)
			{
				centerX += mR;
			}
			centerY = mR - centerY;
			Destinations[i] = _Global.CalculateLeftTopFromCenter(centerX,centerY,ItemRadiusRate * mR,ItemRadiusRate * mR);
		}
	}
	

	private void InitScreenplay()
	{
		ItemInScreenplay = new ArcInScreenplay();
		ItemOutScreenplay = new ArcInScreenplay();
		ItemTrembleScreenplay = new ArcTrembleScreenplay();
		 
		ItemInScreenplay.OnFinish = OnInFinish;
		ItemOutScreenplay.OnFinish = OnOutFinish;
		ItemTrembleScreenplay.OnFinish = OnTrembleFinish;
	}

	private void InitItemLabels()
	{
		if(ItemImageNames == null) return;
		for(int i = 0;i < ItemImageNames.Length;i++)
		{ 
			ItemLabels[i].Init();
//			ItemLabels[i].mystyle.normal.background = TextureMgr.instance().LoadTexture(ItemImageNames[i],TextureType.GEAR);
//			ItemLabels[i].mystyle.active.background = TextureMgr.instance().LoadTexture(ItemImageActiveNames[i],TextureType.GEAR);
//			ItemLabels[i].mystyle.hover.background = TextureMgr.instance().LoadTexture(ItemImageNames[i],TextureType.GEAR);

		}
	}
	private void InitMainLabel()
	{
		if(MainImageName == null) return; 
		MainLabel.Init();
		MainLabel.mystyle.normal.background =  TextureMgr.instance().LoadTexture(MainImageName,TextureType.BUTTON);
		MainLabel.mystyle.active.background =  TextureMgr.instance().LoadTexture(MainImageActiveName,TextureType.BUTTON);
		MainLabel.rect.height = mR * MainRadiusRate;
		MainLabel.rect.width = mR * MainRadiusRate * 2;
		
		
/*		
		if(DisplayType.LeftArc == displayType)
		{
			MainLabel.rect.x = mR - MainLabel.rect.width;
			MainLabel.rect.y = mR - MainLabel.rect.height;
		}
		else if(DisplayType.RightArc == displayType)
		{
			MainLabel.rect.x = 0.0f;
			MainLabel.rect.y = mR - MainLabel.rect.height;
		}
		else if(DisplayType.SemiCircle == displayType)
		{
			mainLabel = GameObject.Instantiate(MainLabel); 
			MainLabel.rect.x = mR - MainLabel.rect.width;
			MainLabel.rect.y = mR - MainLabel.rect.height;
			
			mainLabel.rect.x = mR;
			mainLabel.rect.y = mR - mainLabel.rect.height;
			mainLabel.rect.height = mR * MainRadiusRate;
			mainLabel.rect.width = mR * MainRadiusRate;
			
		}
*/
		if(DisplayType.LeftArc == displayType)
		{
			MainLabel.rect.x = mR - MainLabel.rect.width / 2;
			MainLabel.rect.y = mR - MainLabel.rect.height; 
			rect.width = mR;
		}
		else if(DisplayType.RightArc == displayType)
		{
			MainLabel.rect.x = - MainLabel.rect.width / 2;
			MainLabel.rect.y = mR - MainLabel.rect.height; 
			rect.width = mR;
		}
		else if(DisplayType.SemiCircle == displayType)
		{
			//mainLabel = GameObject.Instantiate(MainLabel); 
			MainLabel.rect.x = mR - MainLabel.rect.width / 2;
			MainLabel.rect.y = mR - MainLabel.rect.height;
			rect.width = mR * 2;
			this.CurrentItem.rect.width = MainLabel.rect.height / 2;
			this.CurrentItem.rect.height = MainLabel.rect.height / 2;
			this.CurrentItem.rect.x = mR - CurrentItem.rect.width / 2;
			this.CurrentItem.rect.y = mR - CurrentItem.rect.height;
			//mainLabel.rect.x = mR;
			//mainLabel.rect.y = mR - mainLabel.rect.height;
			//mainLabel.rect.height = mR * MainRadiusRate;
			//mainLabel.rect.width = mR * MainRadiusRate;
			
		}
		
	}
	
	private void InitBackgroundDestination()
	{
		this.Background.rect.x = BackgroundDestination.x;
		this.Background.rect.y = BackgroundDestination.y;
		this.Background.rect.width = BackgroundDestination.width;
		this.Background.rect.height = BackgroundDestination.height;
	}
	
	private void InitDistance()
	{
		int n = ItemLabels.Length;
		mItemsDistances = new Vector2[n];
		for(int i = 0;i < n;i++)
		{
			mItemsDistances[i].x = Destinations[i].x - mBasePoint.x;
			mItemsDistances[i].y = Destinations[i].y - mBasePoint.y;
		}
	}
	
	private void InitBackgroundDistance()
	{
		mBackgroundDistance = new Vector2();
		mBackgroundDistance.x = BackgroundDestination.x - mBasePoint.x;
		mBackgroundDistance.y = BackgroundDestination.y - mBasePoint.y;
		if(this.displayType == DisplayType.SemiCircle && backGround != null)
		{
			backgroundDistance = new Vector2();
			backgroundDistance.x = backgroundDestination.x - mBasePoint.x;// + mR;
			backgroundDistance.y = backgroundDestination.y - mBasePoint.y;
		}
	}

#if UNITY_EDITOR
	private bool mouseHolding = false;
#endif

	private void UpdateInput()
	{
		if (diableInput) return;
		float iphoneXScaleY = KBN._Global.GetIphoneXScaleY2();
#if UNITY_EDITOR
		bool mouseDown = Input.GetMouseButton(0);
		if (!mouseHolding && !mouseDown) return;

		Vector2 v2 = _Global.TransCoordFromScrren(Input.mousePosition);
		Rect r = _Global.ToAbsoluteRect(this.MainLabel.rect);

		r.y = r.y *  iphoneXScaleY;
		r.height = r.height * iphoneXScaleY;
		if (mouseDown) {
			if (!mouseHolding) {
				mouseHolding = true;
				OnBegin(v2, r);
			} else {
				OnMoved(v2, r);
			}
		} else if (mouseHolding) {
			mouseHolding = false;
			OnEnded(v2, r);
		}
#else
		if(Input.touches.Length != 1) return; 
		Vector2 v2 = Input.touches[0].position;
		v2 = _Global.TransCoordFromScrren(v2);
		
		Rect r = this.MainLabel.rect;
		r.y = r.y *  iphoneXScaleY;
		r.height = r.height * iphoneXScaleY;
		r = _Global.ToAbsoluteRect(r);
		if(Input.touches[0].phase == TouchPhase.Began)
		{
			OnBegin(v2,r);
		}
		else if(Input.touches[0].phase == TouchPhase.Moved)
		{
		 	OnMoved(v2,r);
		} 
		else if(Input.touches[0].phase == TouchPhase.Ended)
		{
			OnEnded(v2,r);
		}
		else if(Input.touches[0].phase == TouchPhase.Canceled)
		{
			OnCanceled(v2,r);
		}
#endif
	}
	
	private void OnBegin(Vector2 v,Rect r)
	{
		
//		if(this.displayType == DisplayType.SemiCircle)
//			r.width += r.width;
		if(IsInRect(v,r)) 
		{
		 	this.mIsOK = true;  
		 	if(this.mState == State.FoldStill)	
				Expand();
			if(this.mState == State.ExpandStill)
				Fold();	
		} 
		OnMoved(v,r);
	} 
	
	private void OnMoved(Vector2 v,Rect r)
	{
#if !UNITY_EDITOR
		DebugLabel.txt = Input.touches[0].position.ToString() + "ok? " + mIsOK +"v=" +v + "r=" + r.ToString();
#endif
		float iphoneXScaley = KBN._Global.GetIphoneXScaleY2();
		for(int i = 0;i < ItemLabels.Length;i++)
		{
			Rect r1 = ItemLabels[i].rect;
			r1 = _Global.ToAbsoluteRect(r1);
			r1.y= r1.y * iphoneXScaley;
			r1.height = r1.height * iphoneXScaley;
			if(IsInRect(v,r1))
			{
				SetCurrentItem(i);
			}
		}
	} 
	
	private void OnEnded(Vector2 v,Rect r)
	{ 
		if(!this.mIsOK) return;
		if( ItemLabels == null) return; 
		
		if(curentIndex >= 0 && curentIndex < ItemLabels.Length)
		{
			if(OnTouchEnd != null)
				OnTouchEnd(curentIndex);
		}
		
/*		for(int i = 0; i < ItemLabels.length; i++)
		{
			if( IsInRect(v,ItemLabels[i].rect) )
			{
				SetCurrentItem(-1);
				if(OnTouchEnd != null)
					OnTouchEnd(i);
			}
		} 
*/		
		mIsOK = false;
		if(this.mState == State.ExpandStill)
			Fold();
		
			
	} 
	
	
	private void OnCanceled(Vector2 v,Rect r)
	{
		OnEnded(v,r);
	}
	
	
			
	private int curentIndex = -1;
	public void SetCurrentItem(int index)
	{
		if(curentIndex >= 0 && curentIndex < ItemLabels.Length ) 
		{ 
			if(UseTile)
			{
				ItemLabels[curentIndex].tile.name = ItemImageNames[curentIndex];
				
			}
			else
			{
				ItemLabels[curentIndex].mystyle.normal.background = ItemLabels[curentIndex].mystyle.hover.background;
				
			}
		}
		curentIndex = index; 
		if(curentIndex >= 0 && curentIndex < ItemLabels.Length ) 
		{
			if(UseTile)
			{
				ItemLabels[curentIndex].tile.name = ItemImageActiveNames[curentIndex];
				this.CurrentItem.tile.name = ItemImageActiveNames[curentIndex];
			}
			else
			{
				ItemLabels[curentIndex].mystyle.normal.background = ItemLabels[curentIndex].mystyle.active.background; 
				this.CurrentItem.mystyle.normal.background = ItemLabels[curentIndex].mystyle.active.background;
			}
		}
	}
	private void Fold()
	{ 
		//if(this.mState != State.ExpandStill) return;
		SetState(State.Fold); 
		//ItemOutScreenplay.Begin(0.0f,5.0f,15.0f);
		ItemOutScreenplay.Begin(0.0f,3.0f,3.0f);
		
	}
	private void Expand()
	{
		//if(this.mState != State.FoldStill) return;
		SetState(State.Expand);
		ItemInScreenplay.Begin(0.0f,3.0f,3.0f);
		ItemTrembleScreenplay.Begin(0.0f,0.0f,0.0f);
		
	}

/*	private void OnTouchEnd(int index)
	{
		DebugLabel.txt = Input.touches[0].position.ToString() + " on touch label Draged the " + index + "th";
	}
*/
	private bool IsInRect(Vector2 v2,Rect r1)
	{ 
		return r1.Contains(v2);
	} 
	
	private void ZoomArcSelectControl(float scale)
	{
		if(scale > 1.0f && scale < 0.0f) return;
		ZoomItems(scale);
		ZoomBackground(scale);
		
	}
	
	private void ZoomMain(float p)
	{
		float origin = mR * MainRadiusRate;
		MainLabel.rect.width = (p + 1) * origin;
		MainLabel.rect.height = (p + 1) * origin;
		MainLabel.rect.x = mBasePoint.x - MainLabel.rect.width;
		MainLabel.rect.y = mBasePoint.y - MainLabel.rect.height;
/*		
		if(this.displayType == DisplayType.SemiCircle && mainLabel != null)
		{
			mainLabel.rect.width = (p + 1) * origin;
			mainLabel.rect.height = (p + 1) * origin;
			mainLabel.rect.x = mBasePoint.x;
			mainLabel.rect.y = mBasePoint.y - MainLabel.rect.height;
		}
*/	}
	

	private void ZoomItems(float p)
	{
		int n = ItemLabels.Length;
		for(int i = 0;i < n;i++)
		{
			ItemLabels[i].rect.x = mBasePoint.x + p * mItemsDistances[i].x;
			ItemLabels[i].rect.y = mBasePoint.y + p * mItemsDistances[i].y;
			ItemLabels[i].rect.width = p * Destinations[i].width;
			ItemLabels[i].rect.height = p * Destinations[i].height;
		}
		
	}
	
	private void ZoomBackground(float p)
	{ 
		if( Background == null ) return;
		Background.rect.width = p * BackgroundDestination.width;
		Background.rect.height = p * BackgroundDestination.height;	
		Background.rect.x = mBasePoint.x + p * mBackgroundDistance.x;
		Background.rect.y = mBasePoint.y + p * mBackgroundDistance.y;
		 
		if(this.displayType == DisplayType.SemiCircle && backGround != null)
		{
			backGround.rect.width = p * backgroundDestination.width;
			backGround.rect.height = p * backgroundDestination.height;	
			backGround.rect.x = mBasePoint.x + p * backgroundDistance.x;// - mR;
			backGround.rect.y = mBasePoint.y + p * backgroundDistance.y;
		}
		
	}
		
	public void Stop()
	{
		ItemOutScreenplay.Stop();
		OnOutFinish();
		ZoomArcSelectControl(0.0f);
	}
	
	private void UpdateState()
	{
		if(this.mState == State.Expand)
		{
			ItemInScreenplay.Update();
			ItemTrembleScreenplay.Update();
			ZoomArcSelectControl(ItemInScreenplay.data.S);
			//ZoomMain(ItemTrembleScreenplay.data.S);
		} 
		else if(this.mState == State.Fold)
		{
			ItemOutScreenplay.Update();
			ZoomArcSelectControl(1.0f - ItemOutScreenplay.data.S);
		} 
		else if(this.mState == State.FoldStill)
		{
			 //UpdateInput();
		} 
		else if(this.mState == State.ExpandStill)
		{
			 //UpdateInput();
		}
	} 
	
	private void DrawState()
	{
		if(this.mState == State.Expand)
		{
			DrawBackground();
			DrawItems();
			
		} 
		else if(this.mState == State.Fold)
		{
			DrawBackground();
			DrawItems();
		} 
		else if(this.mState == State.FoldStill)
		{
			UpdateInput();
		} 
		else if(this.mState == State.ExpandStill)
		{
			UpdateInput();
			DrawBackground();
			DrawItems();
		}
	}
	
	
	public override void Update()
	{   
		UpdateState();
		TestButton.Update();
	} 
	private void UpdateCurrentItem()
	{
		CurrentItem.Update();
	}
	private void DrawBackground()
	{
		Background.Draw();
		if(backGround != null && this.displayType == DisplayType.SemiCircle)
		{
		//	rotateEffect.drawItems();
			backGround.Draw();
		}
	}
	
	private void DrawMain()
	{
		MainLabel.Draw();
//		if(mainLabel != null && this.displayType == DisplayType.SemiCircle)
//			mainLabel.Draw();
	}
	private void DrawItems()
	{
		for(int i = 0;i < ItemLabels.Length;i++)
		{
			ItemLabels[i].Draw();
		}
	}
	public override int Draw()
	{ 
		if(!visible) return -1;
		GUI.BeginGroup(rect);
		UpdateAbsoluteVector(); 
		DrawInterface();
		DrawState();
		DrawMain();
		DrawCurrentItem();
		//DrawTestDebug();		
		GUI.EndGroup();
		return 0;
	}
	private void DrawCurrentItem()
	{
		CurrentItem.Draw();
	}
	private void DrawTestDebug()
	{
		TestButton.Draw();
		DebugLabel.Draw();
	}
	
	private void OnInFinish()
	{
		for(int i = 0;i<ItemLabels.Length;i++)
		{
			ItemLabels[i].rect = this.Destinations[i];
		}
		ItemTrembleScreenplay.SetValue("stop",null);
		this.SetState(State.ExpandStill);
		
	}
	 
	private void OnOutFinish()
	{
		for(int i = 0;i<ItemLabels.Length;i++)
		{
			ItemLabels[i].rect = rect;
		}
		ItemTrembleScreenplay.SetValue("stop",null);
		this.SetState(State.FoldStill);
		
	}
	private void OnTrembleFinish()
	{
		
	}
	public override void OnPopOver()
	{
		if(backGround != null)
			TryDestroy(backGround);
		//if(mainLabel != null)
		//	TryDestroy(mainLabel);
	}
	//======================================================================================================
	//ITouchable interface
	private Vector2 mAbsoluteVector;
	private Rect mAbsoluteRect;
	private System.Action<ITouchable> mActivated;
	public string GetName()
	{
		return "";
	}
	public bool IsVisible()
	{
		return visible;
	}
	
	public Rect GetAbsoluteRect()
	{
		mAbsoluteRect.x = mAbsoluteVector.x;
		mAbsoluteRect.y = mAbsoluteVector.y;
		if(this.mState == State.FoldStill)
		{	
			mAbsoluteRect.width = MainLabel.rect.width;
			mAbsoluteRect.height = MainLabel.rect.height;			
		
		}
		else
		{
			mAbsoluteRect.width = rect.width;
			mAbsoluteRect.height = rect.height;

		}
		return mAbsoluteRect;
	}

	public int GetZOrder()
	{
		return 100;
	}	
	private void UpdateAbsoluteVector()
	{
		
		if(this.mState == State.FoldStill)
			GUI.BeginGroup(MainLabel.rect);
		mAbsoluteVector = GUIUtility.GUIToScreenPoint(new Vector2(0 ,0));
		if(this.mState == State.FoldStill)
			GUI.EndGroup();
		
	}
	public void SetTouchableActiveFunction(System.Action<ITouchable> Activated)
	{
		mActivated = Activated;
	}
	private void DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this);
	}

	
	
}
