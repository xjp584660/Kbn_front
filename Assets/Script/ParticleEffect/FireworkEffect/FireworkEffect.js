class FireworkEffect extends MonoBehaviour
{	
	private var fireworkArr:Array;
	private var gapArr:Array;
	private var gapIndex:int = 0;
	private var typeNumOfFirework:int = 4;
	private var generateTime:long = 0;
	private var multipleValue:int;
	private var isPlay:boolean;
	private var playTime:long;
	private var parentObj:GameObject;
	private var fireworkParent:Transform;
	
	public function Awake()
	{
		gapArr = new Array();
		gapArr.Add(1);
		gapArr.Add(0);
		gapArr.Add(1);
		gapArr.Add(0);
		gapArr.Add(1);
		
		if(parentObj == null)
		{
			parentObj = gameObject.Find("City").gameObject;
		}
		
		fireworkArr = new Array();
		for(var i:int = 1; i <= typeNumOfFirework; i++)
		{
			var firework:GameObject = Resources.Load("Effect/Firework/firework_" + i);		
			if(firework != null)
			{
				fireworkArr.Add(firework);
			}
		}
	}
	
	private function setEffectState(_stateName:String):void
	{	
		var gap:int;
		switch(_stateName)
		{
			case "normalFirework":
				multipleValue = 1;
				gapIndex = 0;
				gap = gapArr[gapIndex];
				fireworkParent = this.transform.parent.Find("0");
			    generateTime = GameMain.unixtime() + gap * multipleValue;  
			    isPlay = true;
			    
				break;
			case "festivalFirework":	
				multipleValue = 1;
				gapIndex = 0;
				gap = gapArr[gapIndex];
				fireworkParent = this.transform.parent.Find("0");
				generateTime = GameMain.unixtime() + gap * multipleValue;
				isPlay = true;
				break;
			case "off":
				isPlay = false;
				break;	
		}
	}
	
	public function FixedUpdate()
	{
		if(!isPlay)
		{
			return;
		}

		if(GameMain.unixtime() > generateTime)
		{
			gapIndex += 1; 
		
			if(gapIndex >= gapArr.length)
			{
				gapIndex -= gapArr.length;
			}
			
			Debug.Log("firework gapIndex : " + gapIndex);
			
			var gap:int = gapArr[gapIndex];
			generateTime = GameMain.unixtime() + gap * multipleValue;
			
			var fireworkIndex:int = Random.Range(0, fireworkArr.length);
			var firework:GameObject = fireworkArr[fireworkIndex];
			firework = Instantiate(firework);
			
			var pos:Vector2 = Random.insideUnitCircle * 2;
			firework.transform.parent = fireworkParent;
			firework.transform.localPosition = new Vector3(pos.x + 9 , Constant.LayerY.LAYERY_FIREWORK, pos.y * 0.5 + 1);
			
			SoundMgr.instance().PlayEffect( "firework", /*TextureType.AUDIO*/"Audio/" );
			
		}
	}
}