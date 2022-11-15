public class HeroExploreController extends SlotBuildController
{
    @SerializeField
    private var sceneCamera : Camera;
    @SerializeField
    private var component : GameObject[];
    @SerializeField
    private var fire : GameObject[];
    @SerializeField
    private var fireExplode : GameObject[];
    @SerializeField
    private var fireLine : GameObject[];
    @SerializeField
    private var speedScaleIOS : float = 1.0f;
    @SerializeField
    private var speedScaleAndroid : float = 1.0f;

	@SerializeField
	private var moveEffectTrans: Transform;



    private var speedScale : float = 1.0f;
    private var currentStatus : int = 0;
    private var fireCondition : float[] = null;
    private var fireCount : int = 0;
    private var sumDistance : float = 0.0f;
    private var sumScreenWidth : float = 0.0f;
    private var keyDown : boolean = false;
    private var lastPosition : Vector2 = -Vector2.one;

	public function Awake() : void
	{
		super.Awake();
		curCamera = sceneCamera;
		sceneCamera.orthographicSize = 66.0f * Screen.height / Screen.width; // 66 is magic number for art design
		if(KBN._Global.isIphoneX()) {
				sceneCamera.orthographicSize = 115.0f ; 
			}
		viewRect = curCamera.pixelRect;

		GameMain.instance().onLevelLoaded(GameMain.HERO_EXPLORE_LEVEL, this);
		GameMain.instance().RefreshSceneMusic();
	}
	
	public function Start() : void
	{	
		switch (Application.platform)
		{
			case RuntimePlatform.IPhonePlayer:
				speedScale = speedScaleIOS;
				break;
			case RuntimePlatform.Android:
				speedScale = speedScaleAndroid;
				break;
			default:
				speedScale = 1.0f;
				break;
		}
	}
	
	public function Update() : void
	{
	    if (currentStatus == 1)
        {
            if (Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android)
	        {
	            if (Input.touchCount > 0)
	            {
	                keyDown = true;
	                if (Input.GetTouch(0).phase == TouchPhase.Moved)
	                {
	                    sumDistance += Input.GetTouch(0).deltaPosition.magnitude * speedScale;
	                    lastPosition = Input.GetTouch(0).position;
	                }
	            }
	            else
	            {
	                keyDown = false;
	            }
	        }
	        else
	        {
	            if (Input.GetMouseButtonDown(0))
	            {
	                keyDown = true;
	            }
	            else if (Input.GetMouseButtonUp(0))
	            {
	                keyDown = false;
	            }

	            if (keyDown)
	            {
	                var currentPosition : Vector2 = Vector2(Input.mousePosition.x, Input.mousePosition.y);
	                if (lastPosition != -Vector2.one)
	                {
	                    sumDistance += Vector2.Distance(currentPosition, lastPosition);
	                }

	                lastPosition = currentPosition;
	            }
			}

			if (keyDown) {

				if (!moveEffectTrans.gameObject.activeSelf)
					moveEffectTrans.gameObject.SetActive(true);

				var mousePosInWorld = curCamera.ScreenToWorldPoint(lastPosition);
				mousePosInWorld.z = moveEffectTrans.position.z;
				moveEffectTrans.position = mousePosInWorld;
			}

            
            sumScreenWidth = sumDistance / Screen.width;
            UpdateFire();
	    }
	}

//	public function OnGUI() : void
//	{
//	    GUI.Label(Rect(10, 100, 600, 25), "DEBUG INFO");
//	    GUI.Label(Rect(10, 125, 600, 25), "==============================");
//	    GUI.Label(Rect(10, 150, 600, 25), "Is Key Down : " + keyDown);
//	    GUI.Label(Rect(10, 175, 600, 25), "Last Position : " + lastPosition);
//	    GUI.Label(Rect(10, 200, 600, 25), "Sum Distance : " + sumDistance);
//	    GUI.Label(Rect(10, 225, 600, 25), "Sum Screen Width : " + sumScreenWidth);
//	}
	
	public function ChangeStatus(index : int) : void
	{
	    if (index == 0)
		{
            currentStatus = 0;
            var randOffset : int = GameMain.GdsManager.GetGds.<KBN.GDS_HeroCommon>().GetItemById(1).EXPLORE_OFFSET;
            randOffset = _Global.GetRandNumber(-randOffset, randOffset);
            var fireConditionStr : String[] = GameMain.GdsManager.GetGds.<KBN.GDS_HeroCommon>().GetItemById(1).EXPLORE_FIRE.Split("_"[0]);
            fireCondition = new float[fireConditionStr.length];
            for (var i : int = 0; i < fireCondition.length; i++)
            {
            	fireCondition[i] = _Global.FLOAT(fireConditionStr[i]) * (100 + randOffset) / 100;
            }
            fireCount = 0;
		    sumDistance = 0.0f;
            sumScreenWidth = 0.0f;
		    keyDown = false;
		    lastPosition = -Vector3.one;
		    component[0].SetActive(true);
		    component[1].SetActive(true);
		    component[2].SetActive(false);
		    component[3].SetActive(true);
			component[4].SetActive(false);

			moveEffectTrans.gameObject.SetActive(false);

			for (var f: GameObject in fire)
		    {
                f.SetActive(false);
		    }
		    for (var fe : GameObject in fireExplode)
		    {
		    	fe.SetActive(false);
		    }
		    for (var fl : GameObject in fireLine)
		    {
		    	fl.SetActive(false);
		    }
		}
		else if (index == 1)
		{
		    currentStatus = 1;
		    component[0].SetActive(true);
		    component[1].SetActive(false);
		    component[2].SetActive(true);
		    component[3].SetActive(true);
		    component[4].SetActive(false);
		}
		else if (index == 2)
		{
		    currentStatus = 2;
		    component[0].SetActive(true);
		    component[1].SetActive(false);
		    component[2].SetActive(true);
		    component[3].SetActive(true);
			component[4].SetActive(true);

			moveEffectTrans.gameObject.SetActive(false);

		}
		else if (index == 3)
		{
		    currentStatus = 3;
		    component[0].SetActive(false);
		    component[1].SetActive(false);
		    component[2].SetActive(false);
		    component[3].SetActive(false);
			component[4].SetActive(false);

			moveEffectTrans.gameObject.SetActive(false);

		    for (var f : GameObject in fire)
        	{
            	f.SetActive(false);
        	}
        	for (var fe : GameObject in fireExplode)
		    {
		    	fe.SetActive(false);
		    }
        	for (var fl : GameObject in fireLine)
        	{
        		fl.SetActive(false);
        	}
		}
		else
		{
			currentStatus = 4;
			GameMain.singleton.loadLevel(GameMain.CITY_SCENCE_LEVEL);
		}
	}

    public function GetSpeed() : int
    {
        return fireCount;
	}
	
	public function SetSpeed(speed : int)
	{
		fireCount = speed;
	}

	public function PlayAutoFire() : void
	{
		for (var i : int = 0; i < fire.length; i++)
		{
			fire[i].SetActive(i < fireCount);
			fireExplode[i].SetActive(i < fireCount);
			fireLine[i].SetActive(i < fireCount);
		}
		SoundMgr.instance().PlayEffect("kbn_hero_orbfire", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
	}

    private function UpdateFire() : void
    {
    	var count : int = 0;
    	for (var i : int in fireCondition)
    	{
    		if (sumScreenWidth < i)
    		{
    			break;
    		}
    		
    		count++;
    	}

        if (count > fire.length)
        {
            count = fire.length;
        }
        
        if (count > fireCount)
        {
        	fireCount = count;
        	for (var i : int = 0; i < fire.length; i++)
        	{
            	fire[i].SetActive(i < fireCount);
            	fireExplode[i].SetActive(i < fireCount);
            	fireLine[i].SetActive(i < fireCount);
        	}
        	SoundMgr.instance().PlayEffect("kbn_hero_orbfire", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
        }
    }
}
