class MapMoveLineAnim extends MonoBehaviour
{	
	var m_State:MapMoveAnim.MoveState;
	private	var time:float;
	private	var delta:int = 1;
	private	var curFrameIndex:int = 1;
	private	var	isOver:boolean;
	private var toCoor:Vector2;
	private var ifShowDefendingIcon:boolean;
	private var seed:HashObject;
	var loopCnt:int = -1;
	
	public var frameRate:float;
	
	public var isEncamped:boolean = false;
	private var MarchId:int = 0;
	private var isAttack:boolean = false;
	public var isactive:boolean;
	
	public var isChangeVir:boolean;
	
	function Start () 
	{
		m_State = MapMoveAnim.MoveState.Moving;
		toCoor = new Vector2(0,0);
		frameRate = 12.0f;//Application.targetFrameRate;
		seed = GameMain.instance().getSeed();
		ifShowDefendingIcon = true;
		isactive = true;
		isChangeVir = false;
		isAttack = false;
	}
	
	function Update () 
	{
		if(GameMain.instance() == null)
			return;
			
		if(!isactive || ( GameMain.instance().getScenceLevel() != GameMain.WORLD_SCENCE_LEVEL &&
						GameMain.instance().getScenceLevel() != GameMain.AVA_MINIMAP_LEVEL ) )
		{
			GetComponent.<Renderer>().enabled = false;
			return;
		}
			
		GetComponent.<Renderer>().enabled = true;
		isEncamped = false;
		switch(m_State)
		{
			case MapMoveAnim.MoveState.Moving:
//				if(isAttack)
//				{
//					var cl:Color = gameObject.renderer.material.color;
//					cl.r = 0.8;
//					cl.g = 0;
//					cl.b = 0;
//					gameObject.renderer.material.color = cl;
//				}
				//playAnimation(MoveImgName, MoveImgCount, frameRate);
				break;

			case MapMoveAnim.MoveState.Fighting:
				//playAnimation(MoveImgName, MoveImgCount, frameRate);
				break;
			
			case MapMoveAnim.MoveState.Returning:
				if(!isChangeVir)
				{
					isChangeVir = true;
					gameObject.transform.Rotate(0,0,180);
				}
            	
				break;
		
			default:
				GetComponent.<Renderer>().enabled = false;
				break;				
		}
	}
	
	public function getMoveState():MapMoveAnim.MoveState
	{
		return m_State;
	}
	
	public function setMoveState(state:MapMoveAnim.MoveState):void
	{
		m_State = state;
	}
	
	public function setAttackFlag(state:boolean):void
	{
		isAttack = state;
	}	

	public function setMarchid(mid:int):void
	{
		MarchId = mid;
	}
	
}