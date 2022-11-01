class	CloudMgr{
	private		static	var		MAX_CLOUD_CNT:int = 3;
	private		var		clouds:Array;
	private		var		activeTime:float[];
//	private		var	   	displayCnt:int;
	
	private		static	var		MIN_SPEED:float = 0.005;
	private		static	var		MAX_SPEED:float = 0.013;
	
	private		var	range:Rect;
	private		var	cloudSpeed:Vector2;
	private		var	active:boolean;
	
	public		var	cloudPrefab:GameObject;
	
	public	function Update () {
//		if( !active ){
//			return;
//		}
		var transform:Transform;
		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ ){
			if( clouds[i] != null ){
				if( (clouds[i] as GameObject).active ){
					transform = (clouds[i] as GameObject).transform;
					transform.position.x += cloudSpeed.x;
					transform.position.z += cloudSpeed.y;
					if( transform.position.x < range.xMin || 
						transform.position.x > range.xMax || 
						transform.position.z < range.yMin ||
						transform.position.z > range.yMax ){
						resetCloud(i);
					}
				}else if(active && activeTime[i]){
					activeTime[i] -= Time.deltaTime;
					if( activeTime[i] <= 0 ){
						(clouds[i] as GameObject).SetActiveRecursively(true);
					}
				}
			}
		}
	}
	
	public		function	init(){
		clouds = new float[ MAX_CLOUD_CNT ];
		activeTime = new Array( MAX_CLOUD_CNT );
		var xDir:int = Random.Range(1,100) % 2 == 0 ? 1 : -1;
		var zDir:int = Random.Range(1,100) % 2 == 0 ? 1 : -1;
		cloudSpeed = new Vector2(xDir * Random.Range(MIN_SPEED, MAX_SPEED), zDir * Random.Range(MIN_SPEED, MAX_SPEED));
		
		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ ){
			clouds[i] = GameObject.Instantiate(cloudPrefab);
			(clouds[i] as GameObject).GetComponent.<Renderer>().material.mainTexture = TextureMgr.instance().LoadTexture("cloud",TextureType.EFFECT);
			resetCloud(i);
		}
	}
	
	public		function	reset(){
		var xDir:int = Random.Range(1,100) % 2 == 0 ? 1 : -1;
		var zDir:int = Random.Range(1,100) % 2 == 0 ? 1 : -1;
		cloudSpeed.x = xDir * Random.Range(MIN_SPEED, MAX_SPEED);
		cloudSpeed.y = zDir * Random.Range(MIN_SPEED, MAX_SPEED);
		
		
//		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ ){
//			if( clouds[i] ){
//				resetCloud(i);
//			}
//		}
	}
	
	public		function	setRange( newWorldRange:Rect ){
		// range = newWorldRange;
		// range.xMin -= 2;
		// range.xMax += 2;
		// range.yMin -= 2;
		// range.yMax += 2;
		
		// for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ ){
		// 	if( clouds[i] && !(clouds[i] as GameObject).active ){
		// 		randPos( clouds[i] );
		// 	}
		// }
	}
	
	public		function	isEnabled():boolean{
		return active;
	}
	
	public		function	setEnable(e:boolean){
		active = e;
		for( var i:int = 0; i < MAX_CLOUD_CNT; i ++ ){
			if((clouds[i] as GameObject).active == true){
				(clouds[i] as GameObject).GetComponent.<Renderer>().enabled = active;
			}
		}
	}
	
	private		function	resetCloud( i:int ){
		activeTime[i] = Random.Range( 5.0, 30.0 );
		
		(clouds[i] as GameObject).SetActiveRecursively(false);
		(clouds[i] as GameObject).transform.localScale.x = Random.Range(250.0, 300.0);
		(clouds[i] as GameObject).transform.localScale.z = Random.Range(250.0, 300.0);
		(clouds[i] as GameObject).transform.localRotation = Quaternion.identity;
		(clouds[i] as GameObject).transform.Rotate(Random.Range(-30.0, 30.0),Random.Range(0.0, 359),Random.Range(-30.0, 30.0));
		
		randPos( clouds[i] );
	}
	
	private		function	randPos( cloud:GameObject ){
		if( Time.frameCount % 3 == 0 ){
			cloud.transform.position.x = cloudSpeed.x > 0 ? range.xMin : range.xMax;
			cloud.transform.position.z = Random.Range(range.yMin, range.yMax);
		}else{
			cloud.transform.position.x = Random.Range(range.xMin, range.xMax);
			cloud.transform.position.z = cloudSpeed.y > 0 ? range.yMin : range.yMax;
		}
	}
}

