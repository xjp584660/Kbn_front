using UnityEngine;
using KBN;

public class ProgressBar : UIObject
{
	private float minValue;
	private float maxValue;
	private float curValue;
	public  Label thumb;
	public RectOffset border;
	private BaseVO data;
	private bool finished;
	public  GUIStyle mystyle;
// Use this for initialization
//	void Awake() {

//		enabled = false;
//		useGUILayout = false;
//	}
	public void Start() {
	//	Init(null);
	}

	


	/*
	void Update()
	{
		curValue+=Time.deltaTime;
		if(curValue >= maxValue)
		{
			curValue = maxValue;
			finished = true;
		}
	}
	*/
	public void SetVisible(bool isVisible)
	{
		base.SetVisible(isVisible);	
		thumb.SetVisible(isVisible);
	}

	public override int Draw()
	{
		if(!visible) return -1;
		float length = rect.width - border.left - border.right;
		length *= 1.0f*(curValue - minValue)/(maxValue - minValue);
		thumb.rect = new Rect(rect.x+border.left, rect.y+border.top,length, rect.height - border.top -border.bottom);
		GUI.Label( rect, "", mystyle);
		thumb.Draw();
		return -1;
	}
	
	public override void Init()
	{
		base.Init();
		
		maxValue = 1.0f;
		minValue = 0.0f;
		
		curValue = minValue;		
		finished = (minValue >= maxValue);
	}
	
	public void Init(BaseVO updateData, float min, float max)
	{
		if(thumb.mystyle.normal.background == null)
			thumb.mystyle.normal.background = TextureMgr.instance().LoadTexture("progress_bar2_rate",TextureType.DECORATION);
		maxValue = max;
		minValue = min;
		data = updateData;
		if(minValue == maxValue)
			minValue = maxValue -1;	
			
		// minValue = Mathf.Clamp01(minValue);
		// maxValue = Mathf.Clamp01(maxValue);
			
		curValue = minValue;		
		finished = (minValue >= maxValue);
		//_Global.LogWarning("PrigressBar.Init    minValue : " + minValue + " maxValue : " + maxValue);
	//	InvokeRepeating ("UpdateTime", 0, 1);
	}

	public void setBackground(string name, string type)
	{
		mystyle.normal.background = TextureMgr.instance().LoadTexture(name, type);
	}
	
	public bool IsFinished()
	{
		return finished;
	}
	
	public float GetRestValue()
	{
		return maxValue - curValue;
	}
	
	public void SetMaxValue(float v)
	{
		maxValue = v;
		if( curValue >= maxValue ) {
			curValue = maxValue;
		}
	}
	
	public void SetCurValue(float v)
	{
		curValue = v;
		if( curValue < 0 ){
			curValue = 0;
		}
		else if(curValue >= maxValue)
		{
			curValue = maxValue;
			finished = true;
		}
	}
	
	public void SetRemainingValue(float v)
	{
		curValue = maxValue - v;
		if( curValue < 0 ){
			curValue = 0;
		}
		else if(curValue >= maxValue)
		{
			curValue = maxValue;
			finished = true;
		}
		else if( data != null )
		{
			// Sometimes there would be some tiny error in the
			// current value, in which cases, the current value
			// is always less than the max value. So we handle
			// this problem by checking the destination time.
			if( data.GetReturnUnixTime() != 0 )
			{
				if( GameMain.unixtime() >= data.GetReturnUnixTime() )
				{
					curValue = maxValue;
					finished = true;
				}
			}
			else if( data.GetDestinationUnixTime() != 0 )
			{
				if( GameMain.unixtime() >= data.GetDestinationUnixTime() )
				{
					curValue = maxValue;
					finished = true;
				}
			}
		}
	}
	
	public float GetCurValue()
	{
		return curValue;
	}
	
	
	public override void OnPopOver()
	{
		this.thumb.OnPopOver();
		UIObject.TryDestroy(this);
	}
	
}

