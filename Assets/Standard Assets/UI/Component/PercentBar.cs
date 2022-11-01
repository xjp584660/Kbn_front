using UnityEngine;
public class PercentBar:UIObject
{
	[Space(30), Header("--------PercentBar---------")]

	private float maxValue;
	private float curValue;
	public Label thumb;
	public RectOffset border;
	public GUIStyle mystyle;
	public GUIStyle slideLightStyle;
	public GUIStyle decorationLightStyle; 
	public GUIStyle haloStyle;
	public GUIStyle whiteBar;
	
	private PercentBarState curState;
	private int oldState;
	private float targetPercent;	
	private Rect tarRect;
	private Rect curRect;
	private float newPosX = 0;
	private float smoothTime = 0.2f;
	private float xVelocity = 0.0f;
	
	private float slideLightSpeed;
	private float increaseTime;
	private Rect slideLightRect;
	private Rect decoLightRect;
	private Rect haloRect;
	private float timeCounter;
	private float distance;
	private int slideSpeed = 400;
	private float haloAlpha = 0.0f;
	private float alphaSpeed1 = 2;
	private float haloMaxAlpha = 1;
	private float guiAlpha = 0.0f;
	private bool needAnimation = false;

	public enum PercentBarState
	{
		STOP = 0,
		FADE_IN,
		SLIDE_WITH_ANIMATION,
		FADE_OUT
	};
    
    public Rect ThumbOuterRect
    {
		get
		{
			return new Rect(rect.x + border.left, rect.y + border.top, 
			                rect.width - border.left - border.right, rect.height - border.top - border.bottom);
		}
       
    }
	
	public void Draw()
	{
		if (!visible) return;

		GUI.Label(rect, "", mystyle);
							
		thumb.Draw();
		
		if(!needAnimation)
		{
			return;
		}
		
		GUI.BeginGroup(thumb.rect);
		GUI.Label(slideLightRect, "", slideLightStyle);
		GUI.Label(decoLightRect, "", decorationLightStyle);
		GUI.EndGroup();
		
		if(curState != PercentBarState.STOP)
		{
			guiAlpha = GUI.color.a;
			GUI.color = new Color(GUI.color.r, GUI.color.g, GUI.color.b, haloAlpha);
			GUI.Label(haloRect, "", haloStyle);
			GUI.Label(thumb.rect, "", whiteBar);
			GUI.color = new Color(GUI.color.r, GUI.color.g, GUI.color.b, guiAlpha);			
		}
	}
	
	public void Init(float current, float max)
	{
		Init(current, max, false);
	}
	
	public void Init(float current, float max, bool _needAnimation)
	{
		maxValue = max;
		curValue = current;
		targetPercent = current;
		needAnimation = _needAnimation;

		if ( mystyle.normal.background == null )
			mystyle.normal.background = TextureMgr.instance().LoadTexture("progress_bar_bottom", TextureType.DECORATION);

		if(thumb.mystyle.normal.background == null)
		{
			thumb.mystyle.normal.background = TextureMgr.instance().LoadTexture("progress_bar2_rate",TextureType.DECORATION);
		}

		calPercentBarWidth();
		curState = PercentBarState.STOP;
		
		slideLightRect = new Rect(-142, 
							      0, 
							      142, 
							      thumb.rect.height);
		
		decoLightRect = new Rect(thumb.rect.width - 26,
								 0, 
								 26, 
								 thumb.rect.height);
								 
		haloRect = new Rect(thumb.rect.x - 10,
							thumb.rect.y - 14,
							rect.width - border.left - border.right + 2 * 10,
							thumb.rect.height + 2 * 14);								 								 							 							 
	}
	
	public void changeBG(string bgName, string type)
	{
		mystyle.normal.background = TextureMgr.instance().LoadTexture(bgName, type);
	}
    
    public void changeThumbBG(string bgName, string type)
    {
        thumb.mystyle.normal.background = TextureMgr.singleton.LoadTexture(bgName, type);
    }
	
	public void  update(float current)
	{
		if(curState != PercentBarState.STOP)
		{
			return;
		}
	
		curValue = current;
		calPercentBarWidth();
	}
	
	public void updateWithAnimation(float _targetPercent)
	{
		if(curState == PercentBarState.STOP)
		{
			curState = PercentBarState.FADE_IN;
			haloAlpha = 0.0f;
		}
		else if(curState == PercentBarState.FADE_OUT)
		{
			curState = PercentBarState.FADE_IN;
		}
		
		targetPercent = _targetPercent;
	}
	
	public void updateWithCompleteAnimation()
	{
		updateWithAnimation(maxValue);
	}
	
	public PercentBar.PercentBarState getCurBarState()
	{
		return curState;
	}
	
	private void calPercentBarWidth()
	{
		float length = rect.width - border.left - border.right;
		float scale = Mathf.Max(Mathf.Min(1.0f, 1.0f * curValue / maxValue), 0.0f);
		length *= scale;
		thumb.rect = new Rect(rect.x + border.left, rect.y + border.top, length, rect.height - border.top - border.bottom);
	}
	
	public void FocusRecalcPercentBarWidth()
	{
		calPercentBarWidth();
	}

	public override void Update()
	{
		if(!needAnimation)
		{
			return;
		}
	
		timeCounter = Time.deltaTime;
		distance = timeCounter * slideSpeed;
		
		slideLightRect.x += distance;		
		if(slideLightRect.x > thumb.rect.x + rect.width - border.left - border.right)
		{
			slideLightRect.x = -slideLightRect.width;
		}
		
		decoLightRect.x = thumb.rect.width - decoLightRect.width;				
	
		if(curState == PercentBarState.FADE_IN)
		{
			haloAlpha += alphaSpeed1 * timeCounter;
			if(haloAlpha >= haloMaxAlpha)
			{
				curState = PercentBarState.SLIDE_WITH_ANIMATION;
				haloAlpha = haloMaxAlpha;
			} 
		}
		else if(curState == PercentBarState.SLIDE_WITH_ANIMATION)
		{
			curValue = Mathf.SmoothDamp(curValue, targetPercent, ref xVelocity, smoothTime);
	
			if(targetPercent <= curValue + 3)
			{
				curState = PercentBarState.FADE_OUT;		
				curValue = targetPercent;		
			}
			
			calPercentBarWidth();		
		}
		else if(curState == PercentBarState.FADE_OUT)
		{
			haloAlpha -= alphaSpeed1 * timeCounter;
			if(haloAlpha <= 0.0f)
			{
				curState = PercentBarState.STOP;
				haloAlpha = 0.0f;
			} 			
		}
	}
	
	public PercentBarState GetCurstate()
	{
		return curState;
	}
}

