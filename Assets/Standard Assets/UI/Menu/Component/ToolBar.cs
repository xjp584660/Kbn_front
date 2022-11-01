using UnityEngine;
using KBN;

public class ToolBar : UIObject 
{
	[UnityEngine.Space(30), UnityEngine.Header("----------ToolBar----------")]


	public  GUIStyle mystyle;
	public  GUIStyle[] styles;
	private int toolbarInt = 0;
	public string[] toolbarStrings; 
	public Texture[] buttonImages; 
	private GUIContent[] content;
	//int[] width;
	public Rect buttonRect; 
//	public bool useSameStyle =  true;
	// Use this for initialization
	public System.Action<int> indexChangedFunc; //func(index);
	public FontSize font = FontSize.Font_22;

//	public FontColor normalTxtColor;
	private FontColor m_curNormalTxtColor = FontColor.Default;
	[SerializeField]
	private FontColor m_defaultNormalTxtColor = FontColor.TabNormal;
//	public FontColor onNormalTxtColor;
	private FontColor m_curOnNormalTxtColor = FontColor.Default;
	[SerializeField]
	private FontColor m_defaultOnNormalTxtColor = FontColor.TabDown;
	
	public override void Init()
	{
		toolbarInt = 0;
		oldSelected = 0;
		
//		mystyle.border.left = 20;
//		mystyle.border.right = 20;
//		mystyle.border.top = 20;
//		mystyle.border.bottom = 20;

		TextureMgr texMgr = TextureMgr.instance();
		if ( mystyle.normal.background == null )
			mystyle.normal.background = texMgr.LoadTexture("tab_normal", TextureType.BUTTON);
		if ( mystyle.onNormal.background == null )
			mystyle.onNormal.background = texMgr.LoadTexture("tab_selected", TextureType.BUTTON);
//		if(styles && styles.Length > 0)
//		{
//			oldNormalColor = styles[0].normal.textColor;
//		}		
	}

	public void ToMainTabTexture()
	{
		TextureMgr texMgr = TextureMgr.instance();
		mystyle.normal.background = texMgr.LoadTexture("tab_normal", TextureType.BUTTON);
		mystyle.onNormal.background = texMgr.LoadTexture("tab_selected", TextureType.BUTTON);
	}

	public void ToSubTabTexture()
	{
		TextureMgr texMgr = TextureMgr.instance();
		mystyle.normal.background = texMgr.LoadTexture("tab_big_normal", TextureType.BUTTON);
		mystyle.onNormal.background = texMgr.LoadTexture("tab_big_down", TextureType.BUTTON);
	}
	
	public void ToLightTabTexture()
	{
		TextureMgr texMgr = TextureMgr.instance();
		mystyle.normal.background = texMgr.LoadTexture("tab_big_Paper_normal", TextureType.BUTTON);
		mystyle.onNormal.background = texMgr.LoadTexture("tab_big_Paper_down", TextureType.BUTTON);
	}

	void Start() 
	{
		System.Collections.Generic.List<GUIContent> guiContent = new System.Collections.Generic.List<GUIContent>();
		if(toolbarStrings.Length > 0 && buttonImages.Length > 0)
		{
			for(var i = 0; i < buttonImages.Length; i++)
			{
				var ct = new GUIContent();
				ct.text = toolbarStrings[i];
				ct.image = buttonImages[i];
				guiContent.Add(ct);
				//content[i].text = toolbarStrings[i];
				//content[i].image = buttonImages[i];
			}
		}
		content = guiContent.ToArray();
		toolbarInt = 0;
	}
	
	public void SetTabsColor(Color col)
	{
		if (styles == null)
			return;

		foreach (GUIStyle style in styles) 
		{
			 style.normal.textColor = col;
		}
	}

	//-----------------------------------------------------------------------------// zhou wei	
		
	private Color colorChangeValue;
	private int changeTimes;
	private int framePerTime;
	private Color oldNormalColor;
	private System.Collections.Generic.Dictionary<int, ColorChangedProperty> colorChangedIndexes = new System.Collections.Generic.Dictionary<int, ColorChangedProperty>();

	public void setColorChangedValue(Color _changedColorValue, int _times, int _framePerTime, Color _oldColor)
	{
		colorChangeValue = _changedColorValue;
		framePerTime = _framePerTime;
		changeTimes = _times;
		oldNormalColor = _oldColor;		
	}

	public void changeColorByIndex(int _index)
	{
		if((_index == selectedIndex) || colorChangedIndexes.ContainsKey(_index))
		{
			return;
		}
		
		ColorChangedProperty property = new ColorChangedProperty(0, 0, true);
		colorChangedIndexes.Add(_index, property);
	}
	
	public void resetColorByIndex(int _index)
	{
		if(colorChangedIndexes.ContainsKey(_index))
		{
			colorChangedIndexes.Remove(_index);
			if(_index>=0 && _index<styles.Length)
			{
				(styles[_index] as GUIStyle).normal.textColor = oldNormalColor;
			}
		}
	}
	
	public void clearColorOperation()
	{
		int index;
		foreach (System.Collections.Generic.KeyValuePair<int, ColorChangedProperty> i in colorChangedIndexes)
		{
			index = i.Key;
			if(index>=0 && index<styles.Length)
			{
				(styles[index] as GUIStyle).normal.textColor = oldNormalColor;
			}
		}
		
		colorChangedIndexes.Clear();
	}	
	
	public override void Update() 
	{
		if(colorChangedIndexes.Count > 0)
		{
			int index;
			GUIStyle style;
			
			foreach(System.Collections.Generic.KeyValuePair<int, ColorChangedProperty> i in colorChangedIndexes)
			{
				var property = i.Value;
				index = i.Key;
				
				property.count++;
				
				if(framePerTime != 0 && property.count % framePerTime == 0)
				{
					property.count = 0; 
				}
				else
				{
					continue;
				}
				
				if(property.isAdd)
				{
					property.curTimes++;
					
					if(property.curTimes <= changeTimes && index < styles.Length && index >=0)
					{
						style = styles[index] as GUIStyle;
						style.normal.textColor = new Color(
							style.normal.textColor.r + colorChangeValue.r,
							style.normal.textColor.g + colorChangeValue.g,
							style.normal.textColor.b + colorChangeValue.b,
							style.normal.textColor.a);
					}
					else
					{
						property.isAdd = false;
					}
				}
				else
				{
					property.curTimes--;
					
					if(property.curTimes > 0 && index < styles.Length && index >=0)
					{
						style = styles[index] as GUIStyle;
						
						style.normal.textColor = new Color(
							style.normal.textColor.r - colorChangeValue.r,
							style.normal.textColor.g - colorChangeValue.g,
							style.normal.textColor.b - colorChangeValue.b,
							style.normal.textColor.a);
					}
					else
					{
						property.isAdd = true;
					}
				}
			}
		}	
	} 

	//-----------------------------------------------------------------------------// zhou wei		
	
	private float curGUICounter = 0;
	private int speed = 3;
	private bool isPlaying = false;
	private int oldSelected = 0;
	//private float timer = 0;
	//private float gap = 0.05f;
	
	public override int Draw()
    { 	
    	if( !visible ){
			return selectedIndex;
		}		

		
		Matrix4x4 oldMatrix = GUI.matrix;
		bool matrixChanged = applyRotationAndScaling();
		
		base.prot_calcScreenRect();

//    	FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);

    	SetNormalTxtColor();
		SetOnNormalTxtColor();
		int selected = toolbarInt; 
		
		if(toolbarStrings.Length > 0 && buttonImages.Length > 0)
		{ 
			selectedIndex = GUI.Toolbar (rect, toolbarInt, content, mystyle); 
		}
		else if(toolbarStrings.Length > 0)
		{ 
	//		selectedIndex = GUI.Toolbar (rect, toolbarInt, toolbarStrings, mystyle); 
			int border = 5;
			var width = ( rect.width - border*( toolbarStrings.Length - 1 ) )/toolbarStrings.Length;			
			var startX = rect.x;
			for(int i = 0; i< toolbarStrings.Length; i++)
			{	
			    if(styles == null || styles.Length == 0)
			    {   
					if(GUI.Toggle( new Rect( rect.x + i*( width + border ), rect.y, width, rect.height), i == selected, toolbarStrings[i], mystyle))
					{
						selected = i;
					}
						
					if(selected != oldSelected)
			    	{
			    		if(!isPlaying)
			    		{
			    			isPlaying = true;
			    			curGUICounter = 1;
			    		}
			    	}			    					    									    					
				}
				else if( i>=0 && i<styles.Length)
				{
					FontMgr.SetStyleFont(styles[i], FontSize.Font_22,FontType.TREBUC);
					if(GUI.Toggle( new Rect( startX, rect.y, width, rect.height), i == selected, toolbarStrings[i], styles[i]))
					{
						selected = i;
					}
					
					if(selected != oldSelected)
			    	{
			    		if(!isPlaying)
			    		{
			    			isPlaying = true;
			    			curGUICounter = 1;
			    		}
			    	}					
					
					startX +=  width;	
					startX +=  border;				
				}
			}			

	    	if(isPlaying)
	    	{
				GUI.color = new Color(1, 1, 1, curGUICounter);			    						    						    			    			 				    			
    			GUI.Toggle( new Rect( rect.x + oldSelected*( width + border ), rect.y, width, rect.height), true, toolbarStrings[oldSelected], mystyle);	
    			GUI.Toggle( new Rect( rect.x + selected*( width + border ), rect.y, width, rect.height), false, toolbarStrings[selected], mystyle); 			
    			GUI.color = new Color(1, 1, 1, 1);

	    		curGUICounter -= Time.deltaTime * speed;
	    		
	    		if(curGUICounter < 0)
	    		{
	    			isPlaying = false;
	    			oldSelected = toolbarInt;
	    		}
	    	}
			if(GameMain.singleton.ForceTouchForbidden)
			{
				return selectedIndex;
			}		
			selectedIndex = selected;
		} 
		else
		{ 
			selectedIndex = GUI.Toolbar (rect, toolbarInt, buttonImages, mystyle); 
		}
		
		if (matrixChanged)
			GUI.matrix = oldMatrix;

		return selectedIndex;
	
	}
	
	public void SelectTab(int tab)
	{
		toolbarInt = tab;
		oldSelected = tab;
	}
	
	public int selectedIndex
	{
		set
		{
			if(toolbarInt != value)
			{
				SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");
				toolbarInt = value;
				if(indexChangedFunc != null)
					indexChangedFunc(value);
				
				NewFteMgr.instance.OnTabChangedIndex(this, value);
			}
		}
		
		get
		{
			return toolbarInt;
		}
	}
	
	public void SetNormalTxtColor()
	{
		if(m_curNormalTxtColor == m_defaultNormalTxtColor) 
			return;
		m_curNormalTxtColor = m_defaultNormalTxtColor;
		FontMgr.SetStyleTextColor(mystyle.normal,m_curNormalTxtColor);
	}
	
	public void SetNormalTxtColor(FontColor color)
	{
		m_defaultNormalTxtColor = color;
		this.SetNormalTxtColor();
	}
	
	public void SetOnNormalTxtColor()
	{
		if(m_curOnNormalTxtColor == m_defaultOnNormalTxtColor) 
			return;
		m_curOnNormalTxtColor = m_defaultOnNormalTxtColor;
		FontMgr.SetStyleTextColor(mystyle.onNormal,m_curOnNormalTxtColor);
	}
	
	public void SetOnNormalTxtColor(FontColor color)
	{
		m_defaultOnNormalTxtColor = color;
		this.SetOnNormalTxtColor();
	}
	
	public void SetDefaultNormalTxtColor(FontColor color)
	{
		m_defaultNormalTxtColor = color;
	}
	
	public void SetDefaultOnNormalTxtColor(FontColor color)
	{
		m_defaultOnNormalTxtColor = color;
	}
}

class ColorChangedProperty
{
	public int count;
	public int curTimes;
	public bool isAdd;
	
	public ColorChangedProperty(int _count, int _curTimes ,bool _isAdd)
	{
		count = _count;
		isAdd = _isAdd;
		curTimes = _curTimes;
	}
}

