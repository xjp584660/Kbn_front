class PveResultStar extends Label implements PveMenuState
{
	enum LABEL_STATE{
		NONE,
		BLOW_UP,
		REDUCE,
		ANIMATION,
		OVER
	};
	
	@SerializeField private var frameRect:Rect;
//	@SerializeField private var frameRectAni:Rect;
	@SerializeField private var speedBlowUp:float;//[0,1]
	@SerializeField private var speedReduce:float;//[0,1]
	@SerializeField private var beginScale:float;
	@SerializeField private var maxScale:float;
	
	private var mScale:float;
	private var labelState:LABEL_STATE;
	private var trsMatrix:Matrix4x4;
	private var scaleMatrix:Matrix4x4;
	private var originMatrix:Matrix4x4;
	
	@SerializeField private var aniLabel :Label;
	@SerializeField private var aniName:String;
	@SerializeField private var aniNum:int;
	@SerializeField private var aniRepeatNum:int = 1;
	@SerializeField private var aniInterval:int = 1;
	
	@SerializeField private var beginAlpha:float;//[0,1]
	@SerializeField private var endAlpha:float;
	private var alphaSpeed:float;
	private var curAlpha:float;
	
	private var curAniRepeatNum:int;
	private var curAni:int;
	
	public function Init(_aniName:String, _aniNum:int):void
	{
		super.Init();
		labelState = LABEL_STATE.NONE;
		mScale = 0.001f;
		curAni = -1;
//		x0 = frameRect.x + frameRect.width/2;
//		y0 = frameRect.y + frameRect.height/2;
//		trsMatrix = Matrix4x4.TRS (new Vector3(x0, y0, 0), Quaternion.identity, Vector3.one);
		//fuck GUI.BeginGroup
//		rect.x = -frameRect.width/2;
//		rect.y = -frameRect.height/2;
		rect.x = 0;
		rect.y = 0;
		rect.width = frameRect.width;
		rect.height = frameRect.height;
		
		aniLabel.setBackground("None",TextureType.BUILD_ANIMATION);
//		aniLabel.rect.x = 0;
//		aniLabel.rect.y = 0;
//		aniLabel.rect.width = frameRectAni.width;
//		aniLabel.rect.height = frameRectAni.height;
		
		scaleMatrix = Matrix4x4.Scale( Vector3 (0.001f, 0.001f, 1.0f) );
		trsMatrix = Matrix4x4.TRS (new Vector3(frameRect.x, frameRect.y, 0), Quaternion.identity, Vector3.one);
		
		originMatrix = Matrix4x4.identity;
		curAniRepeatNum = 0;
		
		aniName = _aniName;
		aniNum = _aniNum;
		
		curAlpha = beginAlpha;
		alphaSpeed = (endAlpha - beginAlpha)/( (maxScale-beginScale)/speedBlowUp + (maxScale - 1)/speedReduce ); 
	}
	
	public function Draw()
	{
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = curAlpha;
				
		var matrix:Matrix4x4 = GUI.matrix; 
//		if(labelState == LABEL_STATE.REDUCE || labelState == LABEL_STATE.BLOW_UP)
//			GUI.matrix = originMatrix*trsMatrix*scaleMatrix ;
//		else
//			GUI.matrix = matrix*trsMatrix*scaleMatrix ;
		GUI.matrix = matrix*trsMatrix*scaleMatrix ;
			
		super.Draw();
		GUI.matrix = matrix;
		aniLabel.Draw();
		
		GUI.color.a = oldAlpha;
	}
	
	function Update () {
		//_Global.LogWarning(">>>>>>>>..PveResultStar.Update"+Time.time);
		var tansX:float;
		var tansY:float;
		switch(labelState)
		{
		case LABEL_STATE.NONE:
			scaleMatrix = Matrix4x4.Scale( Vector3 (0.001f, 0.001f, 1.0f) );
			trsMatrix = Matrix4x4.TRS (new Vector3(frameRect.x, frameRect.y, 0), Quaternion.identity, Vector3.one);
			break;
		case LABEL_STATE.BLOW_UP:
			curAlpha+=alphaSpeed*Time.deltaTime;
			mScale+=speedBlowUp*Time.deltaTime;
			tansX = frameRect.x + (1-mScale)*frameRect.width/2;
			tansY = frameRect.y + (1-mScale)*frameRect.height/2;
			
			scaleMatrix = Matrix4x4.Scale( Vector3 (mScale, mScale, 1.0));
			trsMatrix = Matrix4x4.TRS (new Vector3(tansX, tansY, 0), Quaternion.identity, Vector3.one);
			if(mScale >= maxScale)
				labelState = LABEL_STATE.REDUCE;
			break;
		case LABEL_STATE.REDUCE:
			curAlpha+=alphaSpeed*Time.deltaTime;
			mScale -= speedReduce*Time.deltaTime;
			
			if(mScale <= 1)
			{
				mScale = 1;
				End();
			}
			tansX = frameRect.x + (1-mScale)*frameRect.width/2;
			tansY = frameRect.y + (1-mScale)*frameRect.height/2;
			scaleMatrix = Matrix4x4.Scale( Vector3 (mScale, mScale, 1.0));
			trsMatrix = Matrix4x4.TRS (new Vector3(tansX, tansY, 0), Quaternion.identity, Vector3.one);
			break;
		case LABEL_STATE.ANIMATION:
			++curAni;
			var aniIndex:int = curAni/aniInterval;
			//_Global.LogWarning("aniIndex:"+aniIndex);
			if(aniIndex >= aniNum)
			{	
				curAni = 0;
				
				if(++curAniRepeatNum >= aniRepeatNum)
				{
					labelState = LABEL_STATE.OVER;
					aniLabel.setBackground("None",TextureType.BUILD_ANIMATION);
					break;
				}
			}
			aniLabel.setBackground(aniName+aniIndex,TextureType.BUILD_ANIMATION);
			++curAni;
			 aniIndex = curAni/aniInterval;
			//_Global.LogWarning("aniIndex:"+aniIndex);
			if(aniIndex >= aniNum)
			{	
				curAni = 0;
				
				if(++curAniRepeatNum >= aniRepeatNum)
				{
					labelState = LABEL_STATE.OVER;
					aniLabel.setBackground("None",TextureType.BUILD_ANIMATION);
					break;
				}
			}
			aniLabel.setBackground(aniName+aniIndex,TextureType.BUILD_ANIMATION);
			break;
		case LABEL_STATE.OVER:
			scaleMatrix = Matrix4x4.Scale( Vector3.one );
			trsMatrix = Matrix4x4.TRS (new Vector3(frameRect.x, frameRect.y, 0), Quaternion.identity, Vector3.one);
			break;
		}
	}
	
	function SetOriginMatrix()
	{
		originMatrix = GUI.matrix;
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
		curAni = -1;
		mScale = beginScale;
		labelState = LABEL_STATE.BLOW_UP;
		aniLabel.setBackground("None",TextureType.BUILD_ANIMATION);
		curAniRepeatNum = 0;
		curAlpha = beginAlpha;
	}
	
	function End()
	{
		SoundMgr.instance().PlayEffect("kbn_pve_stars", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		labelState = LABEL_STATE.ANIMATION;
		if(overFuntion!=null)
			overFuntion();
	}	
	
	function DefaultShow()
	{
		curAlpha =1;
		this.SetVisible(true);
		labelState = LABEL_STATE.OVER;
	}
}