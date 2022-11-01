class FlickerLabel extends Label
{
	enum LIGHT_STATE{
		NONE,
		LIGHT,
		DARK
	};
	enum FLICKER_TYPE{
		DEFALT,
		QUICK_TWICE
	};
	private var MAX_NUM:int = 1147483647;
	@SerializeField private var alphaSpeed:float = 1;
	@SerializeField private var alphaSpeed2:float = 0.1;
	@SerializeField private var alphaBegin:float = 0;
	@SerializeField private var alphaEnd:float = 1;
	@SerializeField private var flickerType:FLICKER_TYPE = FLICKER_TYPE.DEFALT;
	private var curAlpha:float;
	private var lightType:LIGHT_STATE = LIGHT_STATE.LIGHT;
	private var curFlickerNum:int = 0;//cur flicker num, begin from 0, 
	private var curAlphaSpeed:float;
	
	public function Init():void
	{
		super.Init();
		
		curAlpha = 0;
		lightType = LIGHT_STATE.LIGHT;
		curFlickerNum = 0;
		curAlphaSpeed = alphaSpeed;
	}
	
	public function Draw()
	{
		if(!isVisible())
			return;
		switch(lightType)
		{
		case LIGHT_STATE.LIGHT:
			curAlpha+=curAlphaSpeed*Time.deltaTime;
			if(curAlpha>=alphaEnd)
			{
				curAlpha = alphaEnd;
				lightType = LIGHT_STATE.DARK;
				UpdateSpeed();
			}
			break;
		case LIGHT_STATE.DARK:
			curAlpha-=curAlphaSpeed*Time.deltaTime;
			if(curAlpha<=alphaBegin)
			{
				curAlpha = alphaBegin;
				lightType = LIGHT_STATE.LIGHT;
				UpdateSpeed();
			}
			break;
		}
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = curAlpha;
		
		super.Draw();
		
		GUI.color.a = oldAlpha;
		
	}
	
	function Update () {
		super.Update ();
	}
	
	private function UpdateSpeed ()
	{
		curFlickerNum++;
		if(MAX_NUM<=curFlickerNum)
			curFlickerNum = 0;
		if(flickerType == FLICKER_TYPE.QUICK_TWICE)
		{
			var modFlickerNum:int = curFlickerNum%4; 
			if(modFlickerNum == 0)
				curAlphaSpeed = alphaSpeed;
			else if(modFlickerNum == 3)
				curAlphaSpeed = alphaSpeed2;
		}
	}
}