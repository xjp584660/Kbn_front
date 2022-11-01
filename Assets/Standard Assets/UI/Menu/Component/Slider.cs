using UnityEngine;

public class Slider : UIObject
{

	[UnityEngine.Space(30), UnityEngine.Header("----------Slider----------")]

	protected long m_max = 0;
	protected long m_min = 0;
	protected long m_curValue = 0;
	private long limit_value=-999;
	public  GUIStyle sliderStyle;
	public  GUIStyle thumbStyle;
	protected Rect actRect;
	public System.Action<long> valueChangedFunc;
	public System.Action<long> toLimitFunc;
	public System.Action<bool> onMouseFunc;
	public long tmpV;
	protected bool isDown;



	/*
	 * m_max:			slider 的最大可以到达的值
	 * limit_value:		slider 被限制后，能够达到的值
	 * 
	 * limit_value <= m_max : 限制值 <= 最大值
	 */


	public override int Draw()
	{
		if ( !this.visible )
			return -1;

		if(Event.current.type == EventType.MouseDown && rect.Contains(Event.current.mousePosition) )
		{
			isDown = true;
			OnMouse(isDown);
		}
		else if(Event.current.type == EventType.MouseUp || isDown && !actRect.Contains(Event.current.mousePosition) )
		{
			isDown = false;
			OnMouse(isDown);
		}
		
		if( !isDown && Event.current.type != EventType.Repaint)
			return -1;

		tmpV = (long)GUI.HorizontalSlider (rect, m_curValue, m_min, m_max,sliderStyle, thumbStyle );

		if(tmpV > m_max)
			tmpV = m_max;

		if(tmpV != m_curValue){
			if(limit_value >= 0 && tmpV > limit_value){

				tmpV = limit_value;

				if(toLimitFunc != null)
					toLimitFunc(limit_value);
			}

			if(valueChangedFunc != null)
				valueChangedFunc(tmpV);
		}
		m_curValue = tmpV;
		
		return -1;
	}

	/// <summary>
    /// set limit value.
    /// </summary>
    /// <param name="limitValue"></param>
	public void SetLimitValue(long limitValue){

		this.limit_value = limitValue+m_curValue;
		if(this.limit_value <0 && this.limit_value != -999)
			this.limit_value = 0;
	}

	/// <summary>
    /// get limit value.
    /// </summary>
    /// <returns></returns>
	public long GetLimitValue(){
		return limit_value >= 0 ? limit_value : 0;
	}

	public long GetCurValue()
	{
		return m_curValue;
	}

	public void SetMaxValue(long maxValue)
	{
		m_max = maxValue;
	}

	public long MaxValue
	{
		get{
			return m_max;
		}
	}
	
	public void Init(long maxValue)
	{
		Init(maxValue, thumbStyle.normal.background == null);
	}
	public void Init(long minValue,long maxValue)
	{
		Init(minValue,maxValue, thumbStyle.normal.background == null);
	}



	public void Init(long maxValue, bool initDefaultTexture)
	{
		m_max = maxValue;
		tmpV = m_curValue = m_max;
		m_min = 0;
		actRect = new Rect(rect.x, rect.y, rect.width, rect.height + 30);
		
		TextureMgr texMgr = TextureMgr.instance();
		sliderStyle.normal.background = texMgr.LoadTexture("Drag feet_train troops2", TextureType.DECORATION);
		if ( initDefaultTexture )
		{
			thumbStyle.normal.background = texMgr.LoadTexture("button_Drag feet_normal",TextureType.BUTTON);
			thumbStyle.active.background = texMgr.LoadTexture("button_Drag feet_down",TextureType.BUTTON);
			thumbStyle.onNormal.background = texMgr.LoadTexture("button_Drag feet_down",TextureType.BUTTON);
			//thumbStyle.padding.right = 30;
		}
	}
	public void Init(long minValue,long maxValue, bool initDefaultTexture)
	{
		m_max = maxValue;
		tmpV = m_curValue = m_max;
		m_min = minValue;
		actRect = new Rect(rect.x, rect.y, rect.width, rect.height + 30);
		
		TextureMgr texMgr = TextureMgr.instance();
		sliderStyle.normal.background = texMgr.LoadTexture("Drag feet_train troops2", TextureType.DECORATION);
		if ( initDefaultTexture )
		{
			thumbStyle.normal.background = texMgr.LoadTexture("button_Drag feet_normal",TextureType.BUTTON);
			thumbStyle.active.background = texMgr.LoadTexture("button_Drag feet_down",TextureType.BUTTON);
			thumbStyle.onNormal.background = texMgr.LoadTexture("button_Drag feet_down",TextureType.BUTTON);
			//thumbStyle.padding.right = 30;
		}
	}
	
	public virtual void SetCurValue(long v)
	{
		m_curValue = v;
		
		// tmpV=v;
		// if(tmpV > m_max) tmpV = m_max;	
		// // if(tmpV != m_curValue && valueChangedFunc!=null){
		// 	if(limit_value>=0&&tmpV>limit_value){
		// 		tmpV=limit_value;			
		// 		if(toLimitFunc!=null)
		// 			toLimitFunc(limit_value);
		// 	}
		// 	// valueChangedFunc(tmpV);
		// // }
		// m_curValue=tmpV;
		// valueChangedFunc(tmpV);

		// tmpV=v;

		// if(tmpV > m_max) tmpV = m_max;	
		// if(tmpV != m_curValue && valueChangedFunc!=null){
		// 	if(limit_value>=0&&tmpV>limit_value){
		// 		tmpV=limit_value;
		// 		if(toLimitFunc!=null)
		// 			toLimitFunc(limit_value);
		// 	}
		// 	valueChangedFunc(tmpV);
		// }
		// m_curValue = tmpV;

		// isDown = false;
		// OnMouse(isDown);
	}

	public void SetActRect(Rect _actRect)
	{
		actRect = _actRect;
	}

	protected virtual void OnMouse(bool _isDown)
	{
		if(onMouseFunc!=null)
			onMouseFunc(_isDown);
	}
}

