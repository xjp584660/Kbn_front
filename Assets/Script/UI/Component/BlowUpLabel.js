class BlowUpLabel extends Label implements PveMenuState
{
	enum LABEL_STATE{
		NONE,
		BLOW_UP,
		REDUCE,
		OVER
	};
	@SerializeField private var frameRect:Rect;
	@SerializeField private var speedBlowUp:float;//
	@SerializeField private var speedReduce:float;//
	@SerializeField private var moreScale:float;
	@SerializeField private var beginScale:float = 0;
	private var HdW:float;
	protected var labelState:LABEL_STATE;
	
	private var mScale:float;

	public function Init():void
	{
		super.Init();
		labelState = LABEL_STATE.NONE;
		mScale = 0.001f;
	}

	public function Draw()
	{
		scaleX = mScale;
		scaleY = mScale;			
		super.Draw();
	}

	function Update () {
		switch(labelState)
		{
		case LABEL_STATE.NONE:
			mScale = 0.001f;
			break;
		case LABEL_STATE.BLOW_UP:
			mScale+=speedBlowUp*Time.deltaTime;
			if(mScale >= 1+moreScale)
				labelState = LABEL_STATE.REDUCE;
			break;
		case LABEL_STATE.REDUCE:
			mScale -= speedReduce*Time.deltaTime;
			if(mScale <= 1)
			{
				End();
			}
			break;
		case LABEL_STATE.OVER:
			mScale = 1;
			break;
		}
	}
	
	private var overFuntion:Function;
	function set OverFuncton(value : Function)
	{
		overFuntion = value;
	}
	function get OverFuncton() : Function
	{
		return overFuntion;
	}
	
	function Begin () {
		labelState = LABEL_STATE.BLOW_UP;
		mScale = beginScale;
		if(mScale<=0)
			mScale=0.001f;
	}
	
	function End()
	{
		labelState = LABEL_STATE.OVER;
		if(overFuntion!=null)
			overFuntion();
	}
	
	function DefaultShow()
	{
		this.SetVisible(true);
		labelState = LABEL_STATE.OVER;
	}
}