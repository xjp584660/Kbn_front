@SerializeField
class Shake{
	public enum END_TYPE
	{
		NOT_RECOVER,
		RECOVER,
	};
	
	public enum NEXT_TYPE
	{
		NOT_PAUSE,
		PAUSE,
	};
	@SerializeField private var endType:END_TYPE = END_TYPE.RECOVER;
	@SerializeField private var nextType:NEXT_TYPE = NEXT_TYPE.NOT_PAUSE;
	private var beginLocation:Vector2;
	private var endLocation:Vector2;
	private var speedTransX:float;
	private var speedTransY:float;
	private var isInShake:boolean;
	private var trsMatrix:Matrix4x4;
	private var curLocation:Vector2;
	private var curLocationIndex:int;
	private var matrix:Matrix4x4;
	private var endFunction :System.Action = null;
	private var nextFunction :System.Action.<int> = null;
	
	@SerializeField private var speedShake:float;
	@SerializeField private var shakeLocation:Vector2[];
	@SerializeField private var repeatTime:int = 1;
	@SerializeField private var repeatInterval:float = 0;//secend
	private var curRepeatTime:int = 0;
	private var curRepeatInterval:float = 0;
	private var isInRepeatInterval:boolean = false;
	
	public function SetEndFunction(_endFunction :System.Action)
	{
		endFunction = _endFunction;
	}
	
	public function SetNextFunction(_nextFunction :System.Action.<int>)
	{
		nextFunction = _nextFunction;
	}
	
	public function Shake()
	{
		trsMatrix = Matrix4x4.TRS (new Vector3(0, 0, 0), Quaternion.identity, Vector3.one);
		isInShake = false;
		isInRepeatInterval = false;
		curRepeatTime = 0;
	}
	
	public function Init()
	{
		trsMatrix = Matrix4x4.TRS (new Vector3(0, 0, 0), Quaternion.identity, Vector3.one);
		isInShake = false;
		endFunction = null;
		nextFunction = null;
		isInRepeatInterval = false;
		curRepeatTime = 0;
	}
	
	public function Init(_endFunction :System.Action)
	{
		trsMatrix = Matrix4x4.TRS (new Vector3(0, 0, 0), Quaternion.identity, Vector3.one);
		isInShake = false;
		isInRepeatInterval = false;
		endFunction = _endFunction;
		curRepeatTime = 0;
	}
	
	public function get TrsMatrix() : Matrix4x4 
	{
		return trsMatrix;
	}
	
	public function Begin()
	{
		isInShake = true;
		
		curLocationIndex = 0;
		curLocation.x = beginLocation.x = 0;
		curLocation.y = beginLocation.y = 0;
		endLocation.x = shakeLocation[curLocationIndex].x;
		endLocation.y = shakeLocation[curLocationIndex].y;
		var dx:float = endLocation.x-beginLocation.x;
		var dy:float = endLocation.y-beginLocation.y;
		var distance:float = Mathf.Sqrt( dx*dx + dy*dy );
		speedTransX = distance == 0?0:speedShake*dx/distance;
		speedTransY = distance == 0?0:speedShake*dy/distance;
		
		curRepeatInterval = 0;
		isInRepeatInterval = false;
	}
	
	public function Update()
	{
		if(isInShake)
		{
			if(isInRepeatInterval)
			{
				curRepeatInterval -= Time.deltaTime;
				if(curRepeatInterval <= 0)
				{
					Begin();
				}
			}
			else
			{
				UpadteShake();
			}
		}
	}
	
	private function UpadteShake()
	{
		var endFlgX:boolean = false; 
		var endFlgY:boolean = false; 
		curLocation.x += speedTransX*Time.deltaTime;
		curLocation.y += speedTransY*Time.deltaTime;
		
		if(System.Math.Abs(curLocation.x - endLocation.x) <= System.Math.Abs(speedTransX*Time.deltaTime))
		{
			curLocation.x = endLocation.x;
			endFlgX = true;
		}
		
		if(System.Math.Abs(curLocation.y - endLocation.y) <= System.Math.Abs(speedTransY*Time.deltaTime))
		{
			curLocation.y = endLocation.y;
			endFlgY = true;
		}
		
		trsMatrix = Matrix4x4.TRS (new Vector3(curLocation.x, curLocation.y, 0), Quaternion.identity, Vector3.one);
		
		if(endFlgX && endFlgY)
		{
			if(!Next())
			{
				End();
			}
			
			if(nextType == NEXT_TYPE.PAUSE)
			{
				isInShake = false;
			}
		}
	}
	
	public function End()
	{
		curRepeatTime++;
		if(curRepeatTime>=repeatTime)
		{
			isInShake = false;
			if(endFunction!=null)
				endFunction();
			curRepeatTime = 0;
		}
		else
		{
			isInRepeatInterval = true;
			curRepeatInterval = repeatInterval;
		}
		
	}
	
	private function Next():boolean
	{
		curLocation.x = beginLocation.x = endLocation.x ;
		curLocation.y = beginLocation.y = endLocation.y;
		curLocationIndex++;
		if(shakeLocation.Length==curLocationIndex)
		{
			if(endType == END_TYPE.NOT_RECOVER)
				return false;
			endLocation.x = 0;
			endLocation.y = 0;
		}
		else if((shakeLocation.Length<curLocationIndex))
		{
			return false;
		}
		else
		{
			endLocation.x = shakeLocation[curLocationIndex].x;
			endLocation.y = shakeLocation[curLocationIndex].y;
		}
		var dx:float = endLocation.x-beginLocation.x;
		var dy:float = endLocation.y-beginLocation.y;
		var distance:float = Mathf.Sqrt( dx*dx + dy*dy );
		speedTransX = distance == 0?0:speedShake*dx/distance;
		speedTransY = distance == 0?0:speedShake*dy/distance;
		
		if(nextFunction!=null)
			nextFunction(curLocationIndex);
		return true;
	}
	
	//ForceNext do not call nextFunction 
	public function ForceNext()
	{
		var oldNextFunction :System.Action.<int> = nextFunction;
		nextFunction = null;
		Next();
		trsMatrix = Matrix4x4.TRS (new Vector3(curLocation.x, curLocation.y, 0), Quaternion.identity, Vector3.one);
		nextFunction = oldNextFunction;
	}
	
	public function ShakeMatrixBegin()
	{
		matrix = GUI.matrix; 
		GUI.matrix = trsMatrix*matrix ;
	}
	
	public function ShakeMatrixEnd()
	{
		GUI.matrix = matrix;
	}
	
	public function RecoverShake()
	{
		isInShake = true;
	}
	
	public function SetNextType(_nextType:NEXT_TYPE)
	{
		nextType = _nextType;
	}
}