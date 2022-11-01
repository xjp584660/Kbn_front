class RiseTips extends MonoBehaviour
{
	public enum ALPHA_TYPE{
		START_WHITH_ZERO,
		START_ZERO_END_ZERO,
		START_WHITH_FULL,
		START_LOW_FINISH_FAST
	};
	public enum ALPHA_STATE{
		LIGHT,
		PAUSE,
		DARK,
		NONE
	};
	public var rect :Rect;
	@SerializeField private var endFunction :System.Action;
	@SerializeField private var beforePauseFunction :System.Action;
	@SerializeField private var afterPauseFunction :System.Action;
	@SerializeField private var alphaType:ALPHA_TYPE = ALPHA_TYPE.START_WHITH_FULL;
	@SerializeField private var riseSpeed :float;
	@SerializeField private var riseSpeed2 :float;
	@SerializeField private var pauseTime :float;
	public var bottomDesc :SimpleLabel;
	private var curAlpha :float;
	private var curAlphaState :ALPHA_STATE;
	private var isVisible :boolean;
	private var alphaSpeed :float;
	private var alphaSpeed2 :float;
	private var curPauseTime :float;
	
	public function set RiseSpeed(value:float)
	{
		riseSpeed = value;
	}
	
	public function set PauseTime(value:float)
	{
		pauseTime = value;
	}
	
	public function SetVisible(_isVisible :boolean){
		isVisible = _isVisible;
	}
	public function IsVisible() :boolean{
		return isVisible;
	}
	
	public function Init()
	{
		isVisible = false;
	}
	
	public function Init(_alphaType:ALPHA_TYPE, _endFunction :System.Action)
	{
		isVisible = false;
		alphaType = _alphaType;
		endFunction = _endFunction;
	}
	
	public function Init(_endFunction :System.Action)
	{
		isVisible = false;
		endFunction = _endFunction;
	}
	
	public function get txt() :String {
		if(bottomDesc!=null)
			return bottomDesc.txt;
		return null;
	}
	
	public function set txt(value : String) {
		if(bottomDesc!=null)
			bottomDesc.txt = value;
	}
	
	public function Begin() : void
	{
		curPauseTime = 0;
		isVisible = true;
		bottomDesc.rect.y = rect.height - bottomDesc.rect.height;
		switch(alphaType)
		{
		case ALPHA_TYPE.START_WHITH_ZERO:
			curAlpha = 0;
			SetCurAlphaState(ALPHA_STATE.LIGHT);
			alphaSpeed = riseSpeed/bottomDesc.rect.y;
			break;
		case ALPHA_TYPE.START_ZERO_END_ZERO:
			curAlpha = 0;
			SetCurAlphaState(ALPHA_STATE.LIGHT);
			alphaSpeed = 2*riseSpeed/bottomDesc.rect.y;
			break;
		case ALPHA_TYPE.START_WHITH_FULL:
			if(pauseTime<=0)
				SetCurAlphaState(ALPHA_STATE.DARK);
			else
				SetCurAlphaState(ALPHA_STATE.PAUSE);
			curAlpha = 1;
			alphaSpeed = riseSpeed/bottomDesc.rect.y;
			break;
		case ALPHA_TYPE.START_LOW_FINISH_FAST:
			curAlpha = 0;
			SetCurAlphaState(ALPHA_STATE.LIGHT);
			alphaSpeed = 2*riseSpeed/bottomDesc.rect.y;
			alphaSpeed2 = 2*riseSpeed2/bottomDesc.rect.y;
			break;
		}
	}
	
	public function Draw()
	{
		if(!isVisible)return;
		GUI.BeginGroup(rect);
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = curAlpha;
			bottomDesc.Draw();
		GUI.color.a = oldAlpha;
		GUI.EndGroup();
		UpdateState();
	}
	
	public function UpdateState()
	{
		switch(curAlphaState)
		{
		case ALPHA_STATE.LIGHT:
			bottomDesc.rect.y -= riseSpeed*Time.deltaTime;
			if(bottomDesc.rect.y<=0)End();
			curAlpha += alphaSpeed*Time.deltaTime;
			if(curAlpha>=1)
			{
				curAlpha = 1;
				if(alphaType == ALPHA_TYPE.START_WHITH_ZERO)
				{
					End();
					break;
				}
				SetCurAlphaState(ALPHA_STATE.PAUSE);
			}
			break;
		case ALPHA_STATE.PAUSE:
			curPauseTime+=Time.deltaTime;
			if(curPauseTime>=pauseTime)
				SetCurAlphaState(ALPHA_STATE.DARK);
			break;
		case ALPHA_STATE.DARK:
			var tempRiseSpeed:float = riseSpeed;
			var tempAlphaSpeed:float = alphaSpeed;
			if(alphaType == ALPHA_TYPE.START_LOW_FINISH_FAST)
			{
				tempRiseSpeed = riseSpeed2;
				tempAlphaSpeed = alphaSpeed2;
			}
			bottomDesc.rect.y -= tempRiseSpeed*Time.deltaTime;
			if(bottomDesc.rect.y<=0)End();
			curAlpha -= tempAlphaSpeed*Time.deltaTime;
			if(curAlpha<=0)End();
			break;
		case ALPHA_STATE.NONE:
			break;
		}
	}
	
	public function End()
	{
		isVisible = false;
		if(endFunction!=null)
			endFunction();
	}
	
	public function NormalDraw()
	{
		isVisible = true;
		SetCurAlphaState(ALPHA_STATE.NONE);
	}
	
	public function SetBeforePauseFunction(_beforePauseFunction :System.Action)
	{
		beforePauseFunction = _beforePauseFunction;
	}
	
	public function SetAfterPauseFunction(_afterPauseFunction :System.Action)
	{
		afterPauseFunction = _afterPauseFunction;
	}
	
	private function SetCurAlphaState(_alphaSate:ALPHA_STATE)
	{
		if(afterPauseFunction!=null && ALPHA_STATE.PAUSE == curAlphaState)
			afterPauseFunction();
		curAlphaState = _alphaSate;
		if(beforePauseFunction!=null && ALPHA_STATE.PAUSE == curAlphaState)
			beforePauseFunction();
	}
	
	public function Stop()
	{
		isVisible = false;
	}
}