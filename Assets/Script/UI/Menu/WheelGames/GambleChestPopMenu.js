

public class GambleChestPopMenu extends ComposedMenu
{
	private var isTransition:boolean;
	public var btnQuit:Button;			//Button: 退出
	public var back:Label;				//黑色蒙板
	public var backFrame:Label;
		
	public var picBox1:FlashLabel;
	public var picBox2:FlashLabel;
	public var picBox3:FlashLabel;
	public var picBox4:FlashLabel;
	public var picBox5:FlashLabel;
	public var picBox6:FlashLabel;
	public var picBox7:FlashLabel;
	public var picBox8:FlashLabel;
	public var picBox9:FlashLabel;
	
	public var giftPic1:ItemPic;
	public var giftPic2:ItemPic;
	public var giftPic3:ItemPic;
	public var giftPic4:ItemPic;
	public var giftPic5:ItemPic;
	public var giftPic6:ItemPic;
	public var giftPic7:ItemPic;
	public var giftPic8:ItemPic;
	public var giftPic9:ItemPic;
	
	public var giftName1:Label;
	public var giftName2:Label;
	public var giftName3:Label;
	public var giftName4:Label;
	public var giftName5:Label;
	public var giftName6:Label;
	public var giftName7:Label;
	public var giftName8:Label;
	public var giftName9:Label;
	
	public var picNineBoxes:Label;
	
	public  var backlight1:FlashLabel;
	
	private static var POSITION_X = [50, 225, 400];
	private static var POSITION_Y = [50, 210, 370];
	
	private static var POSITION_GIFT_X = [70, 245, 420];
	private static var POSITION_GIFT_Y = [100, 260, 420];
	
	private var g_hasCalculateSpeed:boolean;
	
	private var rewardBoxes:FlashLabel;
	private var rewardGifts:ItemPic;
	private var rewardsArr:ItemPic[];
	
	private var movePosBox:Vector2 = new Vector2(230, 500);
	private var movePosGift:Vector2 = new Vector2(285, 580);
	
	private var g_speedBox:Vector2 = new Vector2();
	private var g_speedGift:Vector2 = new Vector2();
	
	private var picOpen:Texture2D;
	private var picUnopen:Texture2D;
	private var btnBoxes:FlashLabel[];
	private var giftPics:ItemPic[];
	private var giftNames:Label[];
	private var backLights:FlashLabel[];
	
	private var boxOldPosX:int;
	private var boxOldPosY:int;
	private var giftOldPosX:int;
	private var giftOldPosY:int;
	
	private var prizes:int[];
	
	public var giftComposeObj:ComposedUIObj;	
	public var boxComposeObj:ComposedUIObj;
	
	private var posArr:Array = new Array();
	private var posGift:Array = new Array();
	
	public static var NinePlayAgain:boolean = false;
	
	private static var DURATION:int = 10;
	private static var PAUSE:int = 10;
	
	public class GambleParam
	{
		public var from : Rect;
		public var ids : Array;
		public var standard:int;
		public var callBack : function() : void;
		public var gameType : int; //1 : Minlin nine draw;  2 :  WheelGame nine rool
		public var tile : Tile;
	}

	private var to1:Rect;
	private var to2:Rect;
	private var to3:Rect;
	private var to4:Rect;
	private var to5:Rect;
	private var to6:Rect;
	private var to7:Rect;
	private var to8:Rect;
	private var to9:Rect;
	private var toGift1:Rect;
	private var toGift2:Rect;
	private var toGift3:Rect;
	private var toGift4:Rect;
	private var toGift5:Rect;
	private var toGift6:Rect;
	private var toGift7:Rect;
	private var toGift8:Rect;
	private var toGift9:Rect;
	
	private var gambleCenter:Rect;
	private var boxesCenter:Rect;
	
	private var isFirst:boolean = true;
	private var from:Rect;
	private var idsArr:Array = new Array();
	private var standardNum:int;
	private var timer:double;

	private var g_tokenCount:int;
	private var isFinished:boolean = false;
	
	private var callBack:Function;
	
	public function Init()
	{
		super.Init();
		picOpen = TextureMgr.instance().LoadTexture("gamble_box_open" , TextureType.BUTTON);
		picUnopen = TextureMgr.instance().LoadTexture("gamble_box" , TextureType.BUTTON);
		picNineBoxes.mystyle.normal.background = TextureMgr.instance().LoadTexture("gamble_box1",TextureType.BUTTON);
		
		giftPic1.Init();
		giftPic2.Init();
		giftPic3.Init();
		giftPic4.Init();
		giftPic5.Init();
		giftPic6.Init();
		giftPic7.Init();
		giftPic8.Init();
		giftPic9.Init();
		
		giftName1.Init();
		giftName2.Init();
		giftName3.Init();
		giftName4.Init();
		giftName5.Init();
		giftName6.Init();
		giftName7.Init();
		giftName8.Init();
		giftName9.Init();
		
		picNineBoxes.Init();
		
		isTransition = true;
		to1 = new Rect(45,40,150,165);
		to2 = new Rect(245,40,150,165);
		to3 = new Rect(445,40,150,165);
		to4 = new Rect(45,240,150,165);
		to5 = new Rect(245,240,150,165);
		to6 = new Rect(445,240,150,165);
		to7 = new Rect(45,440,150,165);
		to8 = new Rect(245,440,150,165);
		to9 = new Rect(445,440,150,165);
		
		toGift1 = new Rect(70,70,100,100);
		toGift2 = new Rect(270,70,100,100);
		toGift3 = new Rect(470,70,100,100);
		toGift4 = new Rect(70,270,100,100);
		toGift5 = new Rect(270,270,100,100);
		toGift6 = new Rect(470,270,100,100);
		toGift7 = new Rect(70,470,100,100);
		toGift8 = new Rect(270,470,100,100);
		toGift9 = new Rect(470,470,100,100);
		
		gambleCenter = new Rect(225,550,200,200);
		boxesCenter = new Rect(270,600,100,100);
		btnQuit.Init();
		btnQuit.OnClick = OnQuitClick;

		btnQuit.txt = Datas.getArString("Common.OK_Button");
		btnQuit.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		btnQuit.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		
		back.Init();
		backFrame.Init();
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent",TextureType.DECORATION);
		back.rect = new Rect(0,-20,rect.width,rect.height+40); 
		isFirst = true;
		timer = 0.0f;
		
		backlight1.Init();
		backlight1.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light",TextureType.DECORATION);
		backlight1.From = 0.4f;
		backlight1.To = 1.0f;
		backlight1.Times = 1f;
		backlight1.Begin();
	}
//	private function initiateMenu()
//	{
//		var btnTemp:Button;
//		for(var a:int = 0; a < btnBoxes.length; a++)
//		{
//			btnTemp = btnBoxes[a];
//			btnTemp.SetDisabled(false);
//		}
//	}
	private function setBoxAndGiftByID(Id:int):void
	{
		rewardBoxes = btnBoxes[Id - 1];
		rewardGifts = giftPics[Id - 1];
		
		boxOldPosX = rewardBoxes.rect.x;
		boxOldPosY = rewardBoxes.rect.y;
		
		giftOldPosX = rewardGifts.rect.x;
		giftOldPosY = rewardGifts.rect.y;
	}
	private function addAllBoxAndGift():void
	{
		boxComposeObj.clearUIObject();
		giftComposeObj.clearUIObject();
		
		var btnTemp:FlashLabel;
		var labelTemp:ItemPic;
		for(var a:int = 0; a < btnBoxes.length; a++)
		{
			btnTemp = btnBoxes[a];
			labelTemp = giftPics[a];
			boxComposeObj.addUIObject(btnTemp);
			giftComposeObj.addUIObject(labelTemp);
		}
	}
	private function addBoxesAndGiftsExceptID(Id:int):void
	{
		boxComposeObj.clearUIObject();
		giftComposeObj.clearUIObject();

		var btnTemp:FlashLabel;
		var labelTemp:ItemPic;
		for(var a:int = 0; a < btnBoxes.length; a++)
		{	
			if(Id != a + 1)
			{
				btnTemp = btnBoxes[a];
				labelTemp = giftPics[a];
				boxComposeObj.addUIObject(btnTemp);	
				giftComposeObj.addUIObject(labelTemp);
			}
		}
	}
	private function calculateSpeed():void
	{	
		var tempSpeedX:float;
		var tempSpeedY:float;
		
		tempSpeedX = (movePosBox.x - rewardBoxes.rect.x) / DURATION;
		tempSpeedY = (movePosBox.y - rewardBoxes.rect.y) / DURATION;
		
		g_speedBox = new Vector2(tempSpeedX, tempSpeedY);
		
		tempSpeedX = (movePosGift.x - rewardGifts.rect.x) / DURATION;
		tempSpeedY = (movePosGift.y - rewardGifts.rect.y) / DURATION;

		g_speedGift = new Vector2(tempSpeedX, tempSpeedY);		
	}
	private function changeBoxPic(isOpen:boolean):void
	{
		var btnTemp:FlashLabel;
		for(var a:int = 0; a < btnBoxes.length; a++)
		{
			btnTemp = btnBoxes[a];
			if(isOpen)
			{
				btnTemp.mystyle.normal.background = picOpen;
			}
			else
			{
				btnTemp.mystyle.normal.background = picUnopen;
			}
		}		
	}	
	private function OnPlayFinish()
	{
		g_tokenCount = MyItems.instance().countForItem(599);
		isTransition = false;
		if(isFinished == true)
		{
			backlight1.SetVisible(false);
			btnQuit.SetVisible(true);
			isFinished = false;
		}
	}
	public function DrawBackground()
	{
		
	}
	private function OnQuitClick()
	{
		MenuMgr.getInstance().PopMenu("");
		if(callBack != null) 
			callBack();
	}
	function DrawItem()
	{
		back.Draw();
		backFrame.Draw();
			
		picBox1.Draw();
		picBox2.Draw();
		picBox3.Draw();
		picBox4.Draw();
		picBox5.Draw();
		picBox6.Draw();
		picBox7.Draw();
		picBox8.Draw();
		picBox9.Draw();
		
		giftName1.Draw();
		giftName2.Draw();
		giftName3.Draw();
		giftName4.Draw();
		giftName5.Draw();
		giftName6.Draw();
		giftName7.Draw();
		giftName8.Draw();
		giftName9.Draw();
		
		giftPic1.Draw();
		giftPic2.Draw();
		giftPic3.Draw();
		giftPic4.Draw();
		giftPic5.Draw();
		giftPic6.Draw();
		giftPic7.Draw();
		giftPic8.Draw();
		giftPic9.Draw();		
		
		backlight1.Draw();
		picNineBoxes.Draw();
		btnQuit.Draw();
	}
	
	private function setBoxesDisabled(_enable:boolean)
	{
		var btnTemp:FlashLabel;
		for(var a:int = 0; a < btnBoxes.length; a++)
		{
			btnTemp = btnBoxes[a];
			btnTemp.SetDisabled(_enable);
		}		
	}
	
	private function OnFlashFinish(screenplay:IScreenplay)
	{
		var temp : FlashLabel = (screenplay.myObject as FlashLabel);
		temp.Begin();
	}
	
	public function OnPush(param:Object)
	{
		var paramDat : GambleParam = param as GambleParam;
		if ( paramDat == null )
			return;
			
		callBack = null;
		callBack = paramDat.callBack;
		from = paramDat.from;
		idsArr = paramDat.ids;
		standardNum = paramDat.standard;
		
		btnBoxes = [picBox1,picBox2,picBox3,picBox4,picBox5,picBox6,picBox7,picBox8,picBox9];
		for(var n:int = 0;n < btnBoxes.length;n++)
		{
			btnBoxes[n].Init();
			btnBoxes[n].Screenplay.OnPlayFinish = OnFlashFinish;
			btnBoxes[n].To = 1.0f;
			btnBoxes[n].Times = 1;
			if(paramDat.gameType == 1)
			{
				btnBoxes[n].mystyle.normal.background = TextureMgr.instance().LoadTexture("gamble_box_open",TextureType.BUTTON);					
				btnBoxes[n].From = 1f;
				btnBoxes[n].scaleY = 1f;
				btnBoxes[n].scaleX = 1f;
			}
			else if(paramDat.gameType == 2)
			{
				btnBoxes[n].mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light",TextureType.DECORATION);					
				btnBoxes[n].From = 0.4f;
				btnBoxes[n].scaleY = 1.3f;
				btnBoxes[n].scaleX = 1.3f;
				from = gambleCenter;
			}
			btnBoxes[n].Begin();
		}
		
		giftPics = [giftPic1,giftPic2,giftPic3,giftPic4,giftPic5,giftPic6,giftPic7,giftPic8,giftPic9];
		giftNames = [giftName1,giftName2,giftName3,giftName4,giftName5,giftName6,giftName7,giftName8,giftName9];
		posArr = [to1,to2,to3,to4,to5,to6,to7,to8,to9];
		posGift = [toGift1,toGift2,toGift3,toGift4,toGift5,toGift6,toGift7,toGift8,toGift9];
		
		for(var i:int = 0;i < idsArr.length;i++)
		{	
			var id = _Global.INT32(idsArr[i]);
			giftNames[i].txt = Datas.getArString("itemName.i" + id);
			giftNames[i].SetVisible(false);
		}
		
		//initiateMenu();
		setBoxesDisabled(false);
		picNineBoxes.rect = from;
		picNineBoxes.SetVisible(false);
		
		btnQuit.rect.y = 750;
		
		for(var j:int = 0; j < btnBoxes.length;j++)
		{
			btnBoxes[j].rect = boxesCenter;
			giftPics[j].rect = boxesCenter;
			giftPics[j].SetVisible(false);
			btnBoxes[j].SetVisible(false);
		}
		var tempLabel:ItemPic;
		for(var m:int = 0;m< giftPics.length;m++)
		{	
			tempLabel = giftPics[m];
			tempLabel.SetId(idsArr[m]);
			giftPics[m].SetVisible(false);
		}
		btnQuit.SetVisible(false);	
		
		if(paramDat.gameType == 1)
		{
			changeBoxPic(true);	
			picNineBoxes.mystyle.normal.background = TextureMgr.instance().LoadTexture("gamble_box1",TextureType.BUTTON);
			picNineBoxes.useTile = false;
			Invoke("setBoxDisable",0.8f);
		}
		else if(paramDat.gameType == 2)
		{
			picNineBoxes.mystyle.normal.background = null;
			picNineBoxes.useTile = true;
			picNineBoxes.tile = paramDat.tile;
			picNineBoxes.SetVisible(true);
			setBoxDisable();
			isFirst = false;
		}		
	}
	
	private function UpdateCoroutine():IEnumerator
	{
		for(var i:int = 0;i<btnBoxes.length;i++)
		{
			btnBoxes[i].SetVisible(true);
			giftPics[i].SetVisible(true);		
			LineAnimate(boxesCenter,posArr[i],btnBoxes[i],0.0f,3.0f,5.0f);
			LineAnimate(boxesCenter,posGift[i],giftPics[i],0.0f,3.0f,5.0f);
			if(i == btnBoxes.length - 1)
			{
				isFinished = true;
			}
			yield WaitForSeconds(0.2f);
			giftNames[i].SetVisible(true);			
		}	
	}
	public function Update()
	{		
		super.Update();
		timer += Time.deltaTime;

		if(isFirst && timer >= 0.3f)
		{
			isFirst = false;
			picNineBoxes.SetVisible(true);
			backlight1.SetVisible(true);
			LineAnimate(from,gambleCenter,picNineBoxes,0.0f,2.0f,5.0f);
		}
		backlight1.rect.x = picNineBoxes.rect.x - 50;
		backlight1.rect.y = picNineBoxes.rect.y - 50;
		backlight1.rect.width = picNineBoxes.rect.width + 100;
		backlight1.rect.height = picNineBoxes.rect.height + 100;
		backlight1.Update();
		
		for(var n:int = 0;n < btnBoxes.length;n++)
		{
			btnBoxes[n].Update();
		}
	}
	private function setBoxDisable()
	{
		picNineBoxes.SetVisible(false);
		backlight1.SetVisible(false);
		GameMain.instance().StartCoroutine(UpdateCoroutine());
	}
	private function showGiftPic(_result:HashObject, isAdvanced:int)
	{
		var prizeId:Array = _Global.GetObjectValues(_result["prize"]);
		var _boxes:Array = _Global.GetObjectValues(_result["boxes"]);
		var giftExceptPrize:Array = new Array();
		var tempLabel:ItemPic;
		var a:int;
		
		for(a = 0; a < _boxes.length; a++)
		{
			if(prizeId != (_boxes[a] as HashObject).Value)
			{
				giftExceptPrize.push(_boxes[a]);
			}
		}
		
		var giftIndex:int = 0;
		var spt:TileSprite = TextureMgr.instance().ItemSpt();
	}
	protected function LineAnimate(from:Rect,to:Rect,uiobject:UIObject,s:double,v:double,a:double)
	{
		var line:LineGUIAnimation = null;
		line = GUIAnimationManager.Instance().CreateLineAnimation(OnPlayFinish,from,to,uiobject);
		line.SetDefault(true);
		line.From = from;
		line.To = to;
		line.TheObject = uiobject;
		GUIAnimationManager.Instance().Start(line,s,v,a);
	}
	public function OnQuitButton()
	{
		OnQuitClick();
		return true;
	}
}
