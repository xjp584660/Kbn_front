import System.Collections.Generic;
class	BirdMgr{
	private var textureDic : System.Collections.Generic.Dictionary.<String, Texture>;
	private		static	var		MAX_CLOUD_CNT:int = 7;
	private		var		birds:Array;
	private		var		activeTime:float[];
	private		var		nextAppareTime:float;
	private		var		isWaitingNext:boolean = false;
//	private		var	   	displayCnt:int;
	
	private		static	var		MIN_SPEED:float = 0.010;//0.015
	private		static	var		MAX_SPEED:float = 0.016;//0.033
	private		static	var		FIRSTFRAMEMAX_LENGHT:int = 160;
	
	private		var	range:Rect;
	private		var	birdspeed:Vector2;
	private		var	active:boolean;
	
	public		var	birdPrefab:GameObject;
	public		var	eaglePrefab:GameObject;
	public		var eagle:GameObject;
    
	var frameRate:float = 5;

	var ealgeframeCnt:int = 7;
	var birdframeCnt:int = 6;
	var firstFrameLengh:int[];
	var eagleImgName:String;
	var birdImgName:String;
	var eaglestaticimgName:String = "bird7";
	var birdstaticimgName:String = "pigeon6";
	var loopCnt:int[];
	var ifInLoop:boolean[];
	
	private var isEagleTurn = true;
	
	private var baseScale:Vector3[];
	private	var curFrameIndex:int[];
	private	var	isOver:boolean;
	private	var time:float[];
	private	var delta:int = 1;
	private	var birdScale:float;
	private var eagleScale:float;
	
	var statictexture:Texture;
	
	public	function Update () {
//		if( !active ){
//			return;
//		}
		if(isWaitingNext)
		{
			nextAppareTime -= Time.deltaTime;
			if(nextAppareTime <= 0.1)
				isWaitingNext = false;
			return;
		}
		var transform:Transform;
		if(isEagleTurn)
		{
			if(eagle)
			{
				updatePosition(eagle,eaglestaticimgName,MAX_CLOUD_CNT,eagleImgName);
			}
		}
		else
		{
			for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ )
			{
				if( birds[i] != null )
				{
					updatePosition((birds[i] as GameObject),birdstaticimgName,i,birdImgName);
				}
			}
		}

	}
	
	
	
	private function updatePosition(obj:GameObject,statictexturename:String,index:int,texturename:String)
	{
		var transform:Transform;
		var timeIndex:int = (index == MAX_CLOUD_CNT)? MAX_CLOUD_CNT:0;
		var frameCnt:int = (index == MAX_CLOUD_CNT)? ealgeframeCnt:birdframeCnt;
		if(obj.active)
		{
			transform = obj.transform;
			transform.localPosition.x += birdspeed.x*((index == MAX_CLOUD_CNT)? 1:0.7);
            transform.localPosition.z += birdspeed.y*((index == MAX_CLOUD_CNT)? 1:0.7);			
									
			//FOR REINDEER ANIMATION
			//transform.localPosition.x += birdspeed.x*((index == MAX_CLOUD_CNT)? 3:0.7);
			//transform.localPosition.z += birdspeed.y*((index == MAX_CLOUD_CNT)? 3:0.7);
			if(!ifInLoop[index])
			{
				//if(!statictexture)
				//{
					statictexture = GetTexture(statictexturename);
				//}					
				obj.GetComponent.<Renderer>().material.SetTexture("_MainTex", statictexture); 
				if(firstFrameLengh[index]-- <1)
				{
					if(index != MAX_CLOUD_CNT)
					{
						firstFrameLengh[index] = Random.Range(1,3);
						loopCnt[index] = Random.Range(2,6);
					}
					else
					{
						firstFrameLengh[index] = Random.Range(90,FIRSTFRAMEMAX_LENGHT);
						loopCnt[index] = Random.Range(1,2);

						//FOR REINDEER ANIMATION
						//firstFrameLengh[index] = 1;						
						//loopCnt[index] = 6;
					}
					
					ifInLoop[index] = true;	
					curFrameIndex[index] = 1;	
					time[index] = 1/frameRate;			
				}
			}
			else
			{
				time[index]-= Time.deltaTime;
				if( time[index] < 0 )
				{
					curFrameIndex[index] += delta;
					if( curFrameIndex[index] > frameCnt )
					{
						loopCnt[index]--;
						curFrameIndex[index] = 1;
						delta = 1;
						if(loopCnt[index]<0)
							ifInLoop[index] = false;
					}
	
					time[index] += 1/frameRate;
					var texture:Texture = GetTexture(texturename + curFrameIndex[index]);//Resources.Load(imgName + curFrameIndex);
					obj.GetComponent.<Renderer>().material.SetTexture("_MainTex", texture); 
				}
			}
							
			
			if( transform.localPosition.x < range.xMin || 
				transform.localPosition.x > range.xMax || 
				transform.localPosition.z < range.yMin ||
				transform.localPosition.z > range.yMax )
			{
				resetBird(timeIndex);
				isWaitingNext = true;
				nextAppareTime = Random.Range(3, 15);
			}
		}
		else if(active && activeTime[timeIndex])
		{
			if(index == timeIndex)
				activeTime[timeIndex] -= Time.deltaTime;
			if( activeTime[timeIndex] <= 0 )
			{
				obj.SetActiveRecursively(true);
			}
		}
		
	}

	private function GetTexture(textureName : String) : Texture
	{
		if(textureDic.ContainsKey(textureName))
		{
			return textureDic[textureName];
		}
		else
		{
			var texture:Texture = TextureMgr.instance().LoadTexture(textureName, TextureType.BUILD_ANIMATION);
			textureDic.Add(textureName, texture);

			return texture;
		}
	}
	
	public		function	init(){
		textureDic = new System.Collections.Generic.Dictionary.<String, Texture>();
		isEagleTurn = Random.Range(1,100) % 3 == 0 ? true : false;
		birds = new GameObject[ MAX_CLOUD_CNT ];
		activeTime = new Array( MAX_CLOUD_CNT+1);
		ifInLoop = new Array( MAX_CLOUD_CNT+1);
		firstFrameLengh = new Array( MAX_CLOUD_CNT+1);
		curFrameIndex = new Array( MAX_CLOUD_CNT+1);
		baseScale = new Array(MAX_CLOUD_CNT + 1);
		loopCnt = new Array( MAX_CLOUD_CNT+1);
		time = new Array( MAX_CLOUD_CNT+1);
		isWaitingNext = false;
		var xDir:int = -1;//Random.Range(1,100) % 2 == 0 ? 1 : -1;
		var zDir:int = xDir * -1;
		var ver:float = Random.Range(MIN_SPEED, MAX_SPEED);
		birdspeed = new Vector2(xDir * ver, zDir * ver);
		statictexture = GetTexture(eaglestaticimgName);//Resources.Load(imgName + curFrameIndex);		
		
		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ ){
			firstFrameLengh[i] = Random.Range(20,FIRSTFRAMEMAX_LENGHT/3);
			ifInLoop[i] = true;
			curFrameIndex[i]=1;
			loopCnt[i]=7;
			activeTime[i] = 5;
			birds[i] = GameObject.Instantiate(birdPrefab);
			var texture:Texture = GetTexture(eagleImgName + curFrameIndex[i]);//Resources.Load(imgName + curFrameIndex);
			frameRate = 15;// Application.targetFrameRate/3;
			(birds[i] as GameObject).GetComponent.<Renderer>().material.SetTexture("_MainTex", texture); 
			(birds[i] as GameObject).name = "Bird"+i.ToString();
			(birds[i] as GameObject).transform.position.y = Constant.LayerY.LAYERY_BIRD;
		}	
		
		
		eagle = GameObject.Instantiate(eaglePrefab);
		eagle.name = "Eagle";
		(eagle as GameObject).GetComponent.<Renderer>().material.SetTexture("_MainTex", statictexture); 
		(eagle as GameObject).transform.position.y = Constant.LayerY.LAYERY_EAGLE;
		firstFrameLengh[MAX_CLOUD_CNT] = FIRSTFRAMEMAX_LENGHT/3;
		ifInLoop[MAX_CLOUD_CNT] = true;
		curFrameIndex[MAX_CLOUD_CNT]=1;
		loopCnt[MAX_CLOUD_CNT]=7;
		activeTime[MAX_CLOUD_CNT] = 5;
		resetBird(MAX_CLOUD_CNT);
		resetBird(0);
		resetBird(1);
	}
	
	public		function	reset(){
		var xDir:int;
		var zDir:int;

		xDir = -1;
		zDir = 1;
	
		birdspeed.x = xDir * Random.Range(MIN_SPEED, MAX_SPEED);
		birdspeed.y = zDir * Random.Range(MIN_SPEED, MAX_SPEED);
		
	}
	
	public		function	setRange( newWorldRange:Rect , scale:float){
		if(scale*2 <= 1)
		{
			scale = 1.01;
		}
		else
		{
			scale *=2;
		}
		range = newWorldRange;
		range.xMin -= 2;
		range.xMax += 2;
		range.yMin -= 2;
		range.yMax += 2;
		
		if(GameMain.instance().getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL)
		{
			var mp:MapController = GameMain.instance().getMapController();
			//Vector2 target = mp.calBirdEdge();
//			for(var s:int = 0; s < MAX_CLOUD_CNT; s++)
//			{
//				mp.setBirdToChildTransform(birds[s] as GameObject);
//			}
//			mp.setBirdToChildTransform(eagle);
		}
		else
		{
			var pos:Vector3;
			//var parent:Transform;
			//if(GameMain.instance().curSceneLev() == GameMain.FIELD_SCENCE_LEVEL)
			//{
				//parent = (GameMain.instance().getFieldController()).gameObject.transform;
			//}
			//else
			//{
				//parent = 
			//}
			for(var k:int = 0; k < MAX_CLOUD_CNT; k++)
			{
				pos = (birds[k] as GameObject).transform.localPosition;
				(birds[k] as GameObject).transform.parent = null;
				(birds[k] as GameObject).transform.localPosition = pos;
			}
			pos = eagle.transform.localPosition;
			eagle.transform.parent = null;
			eagle.transform.localPosition = pos;
		}
		
		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ )
		{
			(birds[i] as GameObject).transform.localScale = baseScale[i];
		}
		eagle.transform.localScale = baseScale[MAX_CLOUD_CNT];		
//		randPos(0);
//		
//		if(!eagle.active)
//			randPos(1);
	}
	
	public		function	isEnabled():boolean{
		return active;
	}
	
	public		function	setEnable(e:boolean){
		active = e;
		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ )
		{
			if (birds[i] != null && (birds[i] as GameObject).active) {
//				(birds[i] as GameObject).renderer.enabled = active;
				(birds[i] as GameObject).SetActiveRecursively(active);
			}
		}
	}
	
	public function setEagleEnable(enable:boolean)
	{
		if(eagle != null)
		{
			eagle.SetActiveRecursively(enable);
		}
	}
	
	private		function	resetBird( index:int ){
		
		isEagleTurn = Random.Range(1,100) % 3 == 0 ? true : false;
		
		if(index<MAX_CLOUD_CNT)
		{
//			if(!(birds[0] as GameObject).active)
//				return;
			
			for( var i:int = 0; i < MAX_CLOUD_CNT; i++ )
			{
				curFrameIndex[i]=1;
				activeTime[i] = Random.Range( 2.0, 6.0 );
				(birds[i] as GameObject).SetActiveRecursively(false);			
				
				birdScale = Random.Range(20.0, 28.0);
				(birds[i] as GameObject).transform.localScale.x = birdScale;
				(birds[i] as GameObject).transform.localScale.z = birdScale;
				(birds[i] as GameObject).transform.localRotation = Quaternion.identity;
				baseScale[i].x = birdScale;
				baseScale[i].y = 1;
				baseScale[i].z = birdScale;
				//(birds[i] as GameObject).transform.Rotate(Random.Range(-30.0, 30.0),Random.Range(0.0, 359),Random.Range(-30.0, 30.0));
				var direction:int = birdspeed.x > 0 ? 0:180;
				var shadowZ:float = birdspeed.x > 0 ? -0.03253034:0.03553034;
				(birds[i] as GameObject).transform.Rotate(Vector3.up * direction,Space.Self);
				(birds[i] as GameObject).transform.Find("shadow").gameObject.transform.localPosition = new Vector3(0,-0.1,shadowZ);
				//Mathf.Atan2(birdspeed.y,birdspeed.x)* Mathf.Rad2Deg
			}	
		}
		else
		{
			eagle.SetActiveRecursively(false);
			curFrameIndex[MAX_CLOUD_CNT]=1;
			//FOR REINDEER ANIMATION
			//eagleScale = 200;
			eagleScale = 128;
			eagle.transform.localScale.x = eagleScale;
			eagle.transform.localScale.z = eagleScale;
			baseScale[MAX_CLOUD_CNT].x = eagleScale;
			baseScale[MAX_CLOUD_CNT].y = 1;
			baseScale[MAX_CLOUD_CNT].z = eagleScale;
			eagle.transform.localRotation = Quaternion.identity;
			//(birds[i] as GameObject).transform.Rotate(Random.Range(-30.0, 30.0),Random.Range(0.0, 359),Random.Range(-30.0, 30.0));
			var eagledirection:int = birdspeed.x > 0 ? 0:180;
			var eagleshadowZ:float = birdspeed.x > 0 ? -0.03853034:0.04153034;
			eagle.transform.Rotate(Vector3.up * eagledirection,Space.Self);
			eagle.transform.Find("shadow").gameObject.transform.localPosition = new Vector3(0,0,eagleshadowZ);
			activeTime[index] = Random.Range( 2.0, 6.0 );
			//Mathf.Atan2(birdspeed.y,birdspeed.x)* Mathf.Rad2Deg
		}
		randPos(0);	
		randPos(1);
	}
	
	private		function	randPos( flag:int){
		if(flag == 1)
		{
			if( Time.frameCount % 3 == 0 )
			{
				eagle.transform.localPosition.x = birdspeed.x > 0 ? range.xMin : range.xMax;
				eagle.transform.localPosition.z = Random.Range(range.yMin, range.yMax);
			}
			else
			{
				eagle.transform.localPosition.x = Random.Range(range.xMin, range.xMax);
				eagle.transform.localPosition.z = birdspeed.y > 0 ? range.yMin : range.yMax;
			}
		}
		else
		{
			if( Time.frameCount % 3 == 0 )
			{
				(birds[0] as GameObject).transform.localPosition.x = birdspeed.x > 0 ? range.xMin+2 : range.xMax-2;
				(birds[0] as GameObject).transform.localPosition.z = Random.Range(range.yMin +2, range.yMax-2);
			}
			else
			{
				(birds[0] as GameObject).transform.localPosition.x = Random.Range(range.xMin+2, range.xMax-2);
				(birds[0] as GameObject).transform.localPosition.z = birdspeed.y > 0 ? range.yMin+2 : range.yMax-2;
			}
			for(var k:int = 1; k < MAX_CLOUD_CNT; k++)
			{	
				(birds[k] as GameObject).transform.localPosition.x = (birds[k-1] as GameObject).transform.localPosition.x + Random.Range( -0.8,  0.8);
				(birds[k] as GameObject).transform.localPosition.z = (birds[k-1] as GameObject).transform.localPosition.z + Random.Range( -0.8,  0.8);
				if(Vector3.Distance((birds[k] as GameObject).transform.localPosition,(birds[k-1] as GameObject).transform.localPosition)<1)
				{
					if( Time.frameCount % 2 == 0 )
					{
						(birds[k] as GameObject).transform.localPosition.x += Random.Range( -0.8,  0.8);
					}
					else
					{
						(birds[k] as GameObject).transform.localPosition.z += Random.Range( -0.8,  0.8);
					}
				}
			}
		}
	}

}

