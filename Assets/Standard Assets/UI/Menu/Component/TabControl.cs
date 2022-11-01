using UnityEngine;


public class TabControl : UIObject
{
	[UnityEngine.Space(30), UnityEngine.Header("----------TabControl----------")]

	public ToolBar toolBar;

	public System.Action<int> OnTabChanged;
	//public Function UpdateCurrentTab;
	//public Function DrawCurrentTab;
	public TabContentUIObject[] Items;
	
	public System.Action<string> OnSetTitle;
	
	private int mCurrentIndex = 0;
	private Rect mDrawRect;
	public override void Init()
	{
		int n = Items.Length;
		toolBar.styles = new GUIStyle[n];
		
		toolBar.indexChangedFunc = OnTabChange;
		toolBar.rect.width = rect.width;
		toolBar.rect.height = rect.height;
		
		
		for(int i = 0; i < n; i++)
		{
			Items[i].Init();
			Items[i].OnSetTitle = OnSetTitle;
			toolBar.styles[i] = new GUIStyle(toolBar.mystyle);
			toolBar.styles[i].normal.background = TextureMgr.instance().LoadTexture("tab_normal",TextureType.BUTTON);
			toolBar.styles[i].onNormal.background = TextureMgr.instance().LoadTexture("tab_selected",TextureType.BUTTON);
			
		}
		
		toolBar.selectedIndex = mCurrentIndex;
		mDrawRect = new Rect(rect);
		mDrawRect.x = 0;
		mDrawRect.y = toolBar.rect.height;
		
		toolBar.Init();
	}
	
	public void Init(bool bInitToolBar)
	{
		int n = Items.Length;
		toolBar.styles = new GUIStyle[n];
		
		toolBar.indexChangedFunc = OnTabChange;
		toolBar.rect.width = rect.width;
		toolBar.rect.height = rect.height;
		
		
		for(int i = 0; i < n; i++)
		{
			Items[i].Init();
			Items[i].OnSetTitle = OnSetTitle;
			toolBar.styles[i] = new GUIStyle(toolBar.mystyle);
			toolBar.styles[i].normal.background = TextureMgr.instance().LoadTexture("tab_normal",TextureType.BUTTON);
			toolBar.styles[i].onNormal.background = TextureMgr.instance().LoadTexture("tab_selected",TextureType.BUTTON);
			
		}
		
		toolBar.selectedIndex = mCurrentIndex;
		mDrawRect = new Rect(rect);
		mDrawRect.x = 0;
		mDrawRect.y = toolBar.rect.height;
		
		if(bInitToolBar)
			toolBar.Init();
	}
	
	public string[] toolBarNames;
	
	public string[] ToolBarNames
	{	
		set
		{
			this.toolBar.toolbarStrings = value;
		}
	
		get
		{	
			return this.toolBar.toolbarStrings;
		}
	}
	
	public int MappingIndex
	{
		set
		{
			mCurrentIndex = value;
			Items[mCurrentIndex].SetVisible(true);
		}
		
		get
		{	
			return mCurrentIndex;
		}
	}
/**/	
	private void OnTabChange(int index)
	{
		if (-1 != mCurrentIndex) {
			bool refuse = false;
			for (int i = 0; i < Items.Length && !refuse; i++) {
				refuse = refuse ||  Items[i].RefuseTabSwitch();
			}
			if (refuse) {
				toolBar.SelectTab(mCurrentIndex);
				return;
			}
		}

		if(mCurrentIndex == index) return;
		if(mCurrentIndex >= 0 && mCurrentIndex < Items.Length)
		{
			if(Items != null && Items[mCurrentIndex] != null)
				Items[mCurrentIndex].OnInActive();
		}
		mCurrentIndex = index;
		if(mCurrentIndex >= 0 && mCurrentIndex < Items.Length)
		{
			if(OnTabChanged != null)
				OnTabChanged(mCurrentIndex);
			if(Items != null && Items[mCurrentIndex] != null)
				Items[mCurrentIndex].OnSelect();
		}
	}

	public override void FixedUpdate ()
	{
		Items[mCurrentIndex].FixedUpdate();
	}

	public override void Update()
	{
		Items[mCurrentIndex].Update();
	}
	
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		toolBar.Draw();
		GUI.EndGroup();
		
		if (Items[mCurrentIndex].isVisible())
			Items[mCurrentIndex].Draw();
		return 0;
	}
	
	public override void OnPopOver()
	{
		int n = Items.Length;
		
		for(int j = 0;j<n;j++)
			Items[j].OnClear();
		
		for(int i = 0; i < n; i++)
			Items[i].OnPopOver();
		UIObject.TryDestroy(this);
		
	}
	
	public void OnPush(object param)
	{
		int n = Items.Length;
		for(int i = 0; i < n; i++)
		{
			if(Items[i] == null) continue;
			Items[i].OnPush(param);
		}
		mCurrentIndex = -1;
		OnTabChange(0);
	}
	public void OnPop()
	{
		int n = Items.Length;
		for(int i = 0; i < n; i++)
		{
			if(Items[i] == null) continue;
			Items[i].OnPop();
		}
	}
	
	public void SendNotification(string action, object data)
	{
		int n = Items.Length;
		for(int i = 0; i < n; i++)
		{
			if(Items[i] == null) continue;
			Items[i].HandleNotification(action, data);
		}
	}

	public bool OnBackButton()
	{
		if(mCurrentIndex >= 0 && mCurrentIndex < Items.Length)
		{
			return Items [mCurrentIndex].OnBackButton ();
		}
		return false;
	}
}
