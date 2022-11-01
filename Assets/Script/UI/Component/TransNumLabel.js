class TransNumLabel extends Label implements PveMenuState
{
	enum LABEL_STATE{
		NONE,
//		WORK,
		TRANS,
		NUMADD,
		ANIMATION,
		OVER
	};
	private var beginLocation:Vector2;
	private var endLocation:Vector2;
	private var speedTransX:float;
	private var speedTransY:float;
	private var isInTrans:boolean;
	private var trsMatrix:Matrix4x4;
	private var curLocation:Vector2;
	private var curLocationIndex:int;
		
	@SerializeField private var speedTrans:float;
	@SerializeField private var transLocation:Vector2[];
	
	@SerializeField private var aniBeginPage:int;
	@SerializeField private var numTime:float;//s
	
	private var strHead:String;
	private var curNum:long;
	private var endNum:long;
	private var beginNum:long;
	@SerializeField private var aniName:String;
	@SerializeField private var aniNum:int;
	private var curAni:int;
	private var stepNum:int;
	private var labelState:LABEL_STATE;
	private var endFlgNum:boolean; 
	
	@SerializeField private var aniRepeatNum:int = 1;
//	@SerializeField private var aniInterval:int = 3;
	@SerializeField private var aniIntervalTime:float = 0.1;
	private var curAniIntervalTime:float;
	private var curAniRepeatNum:int;
	
	@SerializeField private var beginAlpha:float;//[0,1]
	@SerializeField private var endAlpha:float;
	private var alphaSpeed:float;
	private var curAlpha:float;

	public function Init(_strHead:String, _beginNum:long, _endNum:long, _aniName:String, _aniNum:int):void
	{
		super.Init();
		this.SetVisible(false);
		
		strHead = _strHead;
		curNum = beginNum = _beginNum;
		endNum = _endNum;
		aniName = _aniName;
		aniNum = _aniNum;
		curAni = -1;
		
		stepNum = (_endNum - _beginNum)/ numTime/15;
		if(stepNum<=0)
			stepNum = 1;
		
		this.setBackground("None",TextureType.DECORATION);
		
		if(endNum>=0)
		{
			var mydata=_Global.NumSimlify(curNum);
			this.txt =  String.Format(strHead, mydata);
		}
		else
		{
			this.txt =  strHead;
		}
		endFlgNum = true; 
		labelState = LABEL_STATE.NONE;
		
		curLocationIndex = 0;
		curLocation.x = beginLocation.x = transLocation[curLocationIndex].x;
		curLocation.y = beginLocation.y = transLocation[curLocationIndex].y;
		
		trsMatrix = Matrix4x4.TRS (new Vector3(curLocation.x, curLocation.y, 0), Quaternion.identity, Vector3.one);
		
		curAlpha = beginAlpha;
		alphaSpeed = (endAlpha - beginAlpha)/GetTrainsTime();
		curAniIntervalTime = 0;
	}
	
	private function GetTrainsTime():float
	{
		var i:int = 0;
		var time:float = 0;
		var dx:float = 0;
		var dy:float = 0;
		var distance:float = 0;
		
		for(i=0; i<transLocation.Length-1; i++)
		{
			dx = transLocation[i+1].x-transLocation[i].x;
			dy = transLocation[i+1].y-transLocation[i].y;
			distance = Mathf.Sqrt( dx*dx + dy*dy );
			time += distance/speedTrans;
		}
		return time;
	}
	
	public function Draw()
	{
		if(!this.visible)return;
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = curAlpha;
		
		var matrix:Matrix4x4 = GUI.matrix; 
		GUI.matrix = matrix*trsMatrix ;
		super.Draw();
		GUI.matrix = matrix;
		
		GUI.color.a = oldAlpha;
	}

	function Update () {
		switch(labelState)
		{
		case LABEL_STATE.NONE:
			break;
		case LABEL_STATE.TRANS:
			curAlpha+=alphaSpeed*Time.deltaTime;
			var endFlgX:boolean = false; 
			var endFlgY:boolean = false; 
			curLocation.x += speedTransX*Time.deltaTime;
			curLocation.y += speedTransY*Time.deltaTime;
			
			if(Math.Abs(curLocation.x - endLocation.x) <= Math.Abs(speedTransX*Time.deltaTime))
			{
				curLocation.x = endLocation.x;
				endFlgX = true;
			}
			
			if(Math.Abs(curLocation.y - endLocation.y) <= Math.Abs(speedTransY*Time.deltaTime))
			{
				curLocation.y = endLocation.y;
				endFlgY = true;
			}
			
			trsMatrix = Matrix4x4.TRS (new Vector3(curLocation.x, curLocation.y, 0), Quaternion.identity, Vector3.one);
			
			if(endFlgX && endFlgY)
			{
				if(!Next())
				{
					SoundMgr.instance().PlayEffect("kbn_pve_score", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
					labelState = LABEL_STATE.NUMADD;
				}
			}
			break;
		case LABEL_STATE.NUMADD:
			if(endNum>=0)
			{
				this.txt =  String.Format(strHead, curNum);
				curNum += stepNum;
				if(curNum>=endNum)
				{
					curNum = endNum;
					this.txt =  String.Format(strHead, curNum);
					labelState = LABEL_STATE.ANIMATION;
				}
			}
			else
			{
				this.txt =  strHead;
				labelState = LABEL_STATE.ANIMATION;
			}
			break;
		case LABEL_STATE.ANIMATION:
			curAniIntervalTime += Time.deltaTime;
			this.setBackground(aniName+curAni,TextureType.DECORATION);
			if(curAniIntervalTime >= aniIntervalTime)
			{
				curAniIntervalTime = 0;
				++curAni;
				
				if(curAni>=aniNum)
				{
					curAni = 0;
					if(++curAniRepeatNum >= aniRepeatNum)
					{
						labelState = LABEL_STATE.OVER;
						this.setBackground("None",TextureType.DECORATION);
						
						End();
						return;
					}
				}
			}
			break;
		case LABEL_STATE.OVER:
			break;
		}		
	}
	
	private function Next():boolean
	{
		curLocation.x = beginLocation.x = endLocation.x ;
		curLocation.y = beginLocation.y = endLocation.y;
		curLocationIndex++;
		if(transLocation.Length<=curLocationIndex)
		{
			return false;
		}
		else
		{
			endLocation.x = transLocation[curLocationIndex].x;
			endLocation.y = transLocation[curLocationIndex].y;
		}
		var dx:float = endLocation.x-beginLocation.x;
		var dy:float = endLocation.y-beginLocation.y;
		var distance:float = Mathf.Sqrt( dx*dx + dy*dy );
		speedTransX = distance == 0?0:speedTrans*dx/distance;
		speedTransY = distance == 0?0:speedTrans*dy/distance;
		return true;
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
		this.SetVisible(true);
		labelState = LABEL_STATE.TRANS;
		isInTrans = true;
		endFlgNum = false; 
		
		curNum = beginNum;
		
		if(endNum>=0)
		{
			this.txt =  String.Format(strHead, curNum);
		}
		else
		{
			this.txt =  strHead;
		}
		trsMatrix = Matrix4x4.TRS (new Vector3(curLocation.x, curLocation.y, 0), Quaternion.identity, Vector3.one);
		
		curLocationIndex = 0;
		curLocation.x = beginLocation.x = transLocation[curLocationIndex].x;
		curLocation.y = beginLocation.y = transLocation[curLocationIndex].y;
		curLocationIndex++;
		endLocation.x = transLocation[curLocationIndex].x;
		endLocation.y = transLocation[curLocationIndex].y;
		var dx:float = endLocation.x-beginLocation.x;
		var dy:float = endLocation.y-beginLocation.y;
		var distance:float = Mathf.Sqrt( dx*dx + dy*dy );
		speedTransX = distance == 0?0:speedTrans*dx/distance;
		speedTransY = distance == 0?0:speedTrans*dy/distance;
		
		
		curAni = -1;
		this.setBackground("None",TextureType.DECORATION);
		curAniRepeatNum = 0;
		curAniIntervalTime = 0;
	}
	
	function End()
	{
		if(overFuntion!=null)
			overFuntion();
	}	
	
	function DefaultShow()
	{
		this.SetVisible(true);
		curAlpha = 1;
		labelState = LABEL_STATE.OVER;
		trsMatrix = Matrix4x4.TRS (new Vector3(transLocation[transLocation.Length-1].x, transLocation[transLocation.Length-1].y, 0), Quaternion.identity, Vector3.one);
	}
	
	function NormalShow()
	{
		this.SetVisible(true);
		curAlpha = 1;
		labelState = LABEL_STATE.OVER;
		trsMatrix = Matrix4x4.identity;
	}
}