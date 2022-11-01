class SingleObjTransition
{
	protected var currUIObj:UIObject = null;
	protected var fadeinSpeed:int = 90;
	
	protected var startPoint:Vector3 = Vector3.zero;
	protected var endPoint:Vector3 = Vector3.zero;
	
	protected var isPush:boolean = true;  
	protected var endDelegate:Function;
	
	// The UIObject is a resource, not a GameObject in scene, so cann't run Update(), and no need extends MonoBehaviour
	//public static function StartTransPush(obj:UIObject, params:Object)
	//{
	//	if (null == obj) return;
	//	
	//	var trans:SingleObjTransition = obj.gameObject.GetComponent(typeof(SingleObjTransition));
	//	if (null == trans)
	//		trans = obj.gameObject.AddComponent(typeof(SingleObjTransition));
	//	trans.BeginPush(obj, params);
	//}
	//
	//public static function StartTransPop(obj:UIObject, params:Object)
	//{
	//	if (null == obj) return;
	//	
	//	var trans:SingleObjTransition = obj.gameObject.GetComponent(typeof(SingleObjTransition));
	//	if (null == trans)
	//		trans = obj.gameObject.AddComponent(typeof(SingleObjTransition));
	//		
	//	trans.BeginPop(obj, params);
	//}
	
	public function set Speed(value:int)
	{
		fadeinSpeed = value;
	}
	
	public function BeginPush(obj:UIObject, params:Object, endDel:Function)
	{
		isPush = true;
		fadeinSpeed = 180;
		
		startPoint.x = MenuMgr.SCREEN_WIDTH;
		endPoint.x = 0;
		
		currUIObj = obj; 
		currUIObj.SetVisible(true);
		currUIObj.rect.x = startPoint.x;
		 
		endDelegate =  endDel;
		
		if (obj instanceof SubMenu)
			(obj as SubMenu).OnPush(params);
	}
	
	public function BeginPop(obj:UIObject, endDel:Function)
	{
		isPush = false; 
		fadeinSpeed = 180;
		
		startPoint.x = 0;
		endPoint.x = MenuMgr.SCREEN_WIDTH;
		
		currUIObj = obj; 
		currUIObj.SetVisible(true);
		currUIObj.rect.x = startPoint.x; 
		
		endDelegate =  endDel;
		
		if (obj instanceof SubMenu)
			(obj as SubMenu).OnPop();
	}
	
	public function Update()
	{
		if (null == currUIObj) return;
		
		if (!IsReach())
		{
			var tmpSpeed:int = isPush ? -fadeinSpeed : fadeinSpeed;
			currUIObj.rect.x += tmpSpeed; // * Time.deltaTime;
		}
		else
		{
			currUIObj.rect.x = endPoint.x;
			currUIObj = null; 
			
			if (null != endDelegate)
				endDelegate();
		}
	}
	
	private function IsReach():boolean
	{
		if (isPush)
			return currUIObj.rect.x < endPoint.x;
		else
			return currUIObj.rect.x > endPoint.x;
			
		return false;
	}
}