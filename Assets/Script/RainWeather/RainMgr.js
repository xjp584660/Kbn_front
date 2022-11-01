class RainMgr
{
	public var startPos:Vector3 = new Vector3(0, 0, 0);

	public var boxHorizontalXNum:int = 3;
	public var boxHorizontalYNum:int = 2;
	public var boxVerticalNum:int = 3;
	
	public var areaHeight:int = 32;
	public var cachedMinY:int = -15;

	public var fallingSpeed:int = 15;
	
	public var rainMeshes:Mesh[];
	
	private var rainsBox:Array;
	private var isRain:boolean;

	public var rainBox:RainBox;
	public var rain:GameObject;
	public var lighting:flickeringLight;
	public var internalLighting:int = 30;
	private var index:int = 0;
	private var disable:boolean;
	private var LightingTime:float;
	
	public function Init():void
	{
		rainMeshes = new Mesh[3];
		for( var i:int = 0; i < 3; i ++ ){
			rainMeshes[i] = Resources.Load("Effect/Rain/RainFx/RainDrops_LQ" + i);
		}
		
		var rainBoxPrefab:GameObject = Resources.Load("Effect/Rain/RainBox");
		var rainBoxObj:GameObject = GameObject.Instantiate(rainBoxPrefab);
		rainBox = rainBoxObj.GetComponent("RainBox");
		
		var rainPrefab:GameObject = Resources.Load("Effect/Rain/Rain");
		rain = GameObject.Instantiate(rainPrefab);
		rain.name = "rainObj";
		var lightingObj:GameObject = GameObject.Find("/rainObj/Lighting");
		lighting = lightingObj.GetComponent("flickeringLight");
		
		GameMain.instance().resgisterRestartFunc(function(){
			
			GameObject.Destroy(rainBox.gameObject);
			GameObject.Destroy(lighting.gameObject);
			
			Resources.UnloadUnusedAssets();
		});
		
		lighting.gameObject.SetActiveRecursively(false);
		enableCloudySky(false);
		rainsBox = new Array();
		disable = true;
		LightingTime = Random.Range(internalLighting, 60.0f);
	}
	
	public function createRainBoxArr():void
	{
		var tempBox:RainBox;
		rainsBox = new Array();
		
		for(var a:int = 0; a < boxHorizontalXNum; a++)
		{
			for(var b:int = 0; b < boxHorizontalYNum; b++)
			{
				for(var c:int = 0; c < boxVerticalNum; c++)
				{
					tempBox = GameObject.Instantiate(rainBox);
					
					tempBox.Init(rainMeshes[ index++ % rainMeshes.Length], fallingSpeed / ( b + 1));
					tempBox.transform.localScale = new Vector3(boxHorizontalYNum - b, boxHorizontalYNum - b, 1.0);
					tempBox.transform.position = new Vector3(a * 10 - 10, b * 10 + 30, c * 15);
					tempBox.transform.Rotate(Vector3.right, 90, Space.World);
					
					tempBox.transform.parent = rain.transform;
					rainsBox.Push(tempBox);
				}
			}
		}
	}
	
	public function SetDisable(_disabled:boolean):void
	{
		if(_disabled)
		{
			for(var rainB:RainBox in rainsBox)
			{
				GameObject.Destroy(rainB.gameObject);
			}
			
			rainsBox.Clear();
			enableCloudySky(false);	
		}
		else
		{
			if(rainsBox.length == 0)
			{
				createRainBoxArr();
				if(GameMain.instance().curSceneLev() != GameMain.WORLD_SCENCE_LEVEL &&
					GameMain.instance().curSceneLev() != GameMain.AVA_MINIMAP_LEVEL )
				{
					enableCloudySky(true);
				}
			}
			LightingTime = Random.Range(internalLighting, 60.0f);
		}
		
		disable = _disabled;
	}
	
	public function enableCloudySky(_enable:boolean):void
	{
		if(_enable)
		{
			RenderSettings.ambientLight = new Color(160.0/255, 160.0/255, 160.0/255, 1);
		}
		else
		{
			RenderSettings.ambientLight = new Color(1, 1, 1, 1);
		}		
	}
	
	public function setPosition(type:int):void
	{
		switch(type)
		{
			case GameMain.CITY_SCENCE_LEVEL:			
				rain.transform.position = new Vector3(-5, 0, 5);
				if(!disable)
				{
					enableCloudySky(true);
				}
				break;	
			case GameMain.FIELD_SCENCE_LEVEL:
				rain.transform.position = new Vector3(-10, 0, 5);
				if(!disable)
				{
					enableCloudySky(true);
				}				
				break;						
			case GameMain.AVA_MINIMAP_LEVEL:			
			case GameMain.WORLD_SCENCE_LEVEL:
				enableCloudySky(false);
				break;
		}
	}
	
	function Update() 
	{
		if(disable)
		{
			return;
		}
			
		var tempBox:RainBox;
		for(var a:int = 0; a < rainsBox.length; a++)
		{
			tempBox = rainsBox[a] as RainBox;
			
			tempBox.transform.position.z -= Time.deltaTime * tempBox.Speed;
			
			if(tempBox.transform.position.z < cachedMinY) 
			{
				tempBox.transform.position.z += areaHeight;
			}
		}
		
		LightingTime -= Time.deltaTime;
		if(LightingTime < 0) {
			lighting.gameObject.SetActiveRecursively(true);
			if (lighting.Thunder != null) {
				lighting.Thunder.mute = PlayerPrefs.GetInt("GAME_SFX",1) == 0;
				if (!lighting.Thunder.mute) {
					lighting.Thunder.volume = Random.Range(0.3f, 0.7f);
				}
			}
			LightingTime = Random.Range(internalLighting, 60.0f);
		}
	}	
}
