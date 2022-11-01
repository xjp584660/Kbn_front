class BlowUpButton extends Button implements PveMenuState
{
	enum BTN_STATE{
		NONE,
		BLOW_UP,
		REDUCE,
		OVER
	};

@Space(30) @Header("---------- BlowUpButton ----------") 

	@SerializeField private var frameRect:Rect;
	@SerializeField private var speedBlowUp:float;//[0,1]
	@SerializeField private var speedReduce:float;//[0,1]
	@SerializeField private var moreScale:float;
	private var HdW:float;
	private var btnState:BTN_STATE;
	private var trsMatrix:Matrix4x4;
	private var scaleMatrix:Matrix4x4;
	
	private var mScale:float;
//	private var x0:float;
//	private var y0:float;

	public function Init():void
	{
		super.Init();
		HdW = rect.height/rect.width;
		btnState = BTN_STATE.NONE;
		mScale = 0.001f;
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
		scaleMatrix = Matrix4x4.Scale( Vector3 (0.001f, 0.001f, 1.0f) );
		trsMatrix = Matrix4x4.TRS (new Vector3(frameRect.x, frameRect.y, 0), Quaternion.identity, Vector3.one);
	}

	public function Draw()
	{
		if (!visible) return;

		var matrix:Matrix4x4 = GUI.matrix; 
		GUI.matrix = matrix*trsMatrix*scaleMatrix ;
		super.Draw();
		GUI.matrix = matrix;
	}

	function Update () {
		var tansX:float;
		var tansY:float;
		switch(btnState)
		{
		case BTN_STATE.NONE:
			scaleMatrix = Matrix4x4.Scale( Vector3 (0.001f, 0.001f, 1.0f) );
			trsMatrix = Matrix4x4.TRS (new Vector3(frameRect.x, frameRect.y, 0), Quaternion.identity, Vector3.one);
			break;
		case BTN_STATE.BLOW_UP:
			mScale+=speedBlowUp*Time.deltaTime;
			tansX = frameRect.x + (1-mScale)*frameRect.width/2;
			tansY = frameRect.y + (1-mScale)*frameRect.height/2;
			
			scaleMatrix = Matrix4x4.Scale( Vector3 (mScale, mScale, 1.0));
			trsMatrix = Matrix4x4.TRS (new Vector3(tansX, tansY, 0), Quaternion.identity, Vector3.one);
			if(mScale >= 1+moreScale)
				btnState = BTN_STATE.REDUCE;
			break;
		case BTN_STATE.REDUCE:
			mScale -= speedReduce*Time.deltaTime;
			tansX = frameRect.x + (1-mScale)*frameRect.width/2;
			tansY = frameRect.y + (1-mScale)*frameRect.height/2;
			scaleMatrix = Matrix4x4.Scale( Vector3 (mScale, mScale, 1.0));
			trsMatrix = Matrix4x4.TRS (new Vector3(tansX, tansY, 0), Quaternion.identity, Vector3.one);
			if(mScale <= 1)
			{
				End();
			}
			break;
		case BTN_STATE.OVER:
			scaleMatrix = Matrix4x4.Scale( Vector3.one );
			trsMatrix = Matrix4x4.TRS (new Vector3(frameRect.x, frameRect.y, 0), Quaternion.identity, Vector3.one);
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
		btnState = BTN_STATE.BLOW_UP;
	}
	
	function End()
	{
		btnState = BTN_STATE.OVER;
		if(overFuntion!=null)
			overFuntion();
	}
	
	function DefaultShow()
	{
		this.SetVisible(true);
		btnState = BTN_STATE.OVER;
	}
}