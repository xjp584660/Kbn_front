

public class WheelGameChestPopMenu extends PopMenu
{
	private var isTransition:boolean;
	public  var description1:Label;
	public  var description2:Label;
	public  var chestName:Label;
	public  var chest:ItemPic;
	public  var confirm:Button;
	public  var back:Label;
	public  var backlight:FlashLabel;
	
	public class WheelGameParam
	{
		public var from : Rect;
		public var id : int;
		public var callBack : function() : void;
		public var tile : Tile;
		public var rewardType : int; // 0, 1, 2;	0 = key, 1 = normal prize, 2 = big supperise!!
	}
	
	private var callBack:Function;
	private var id:int;
	private var chestPosition:Rect;
	private var to:Rect;
	private var isFirst:boolean = true;
	private var from:Rect;
	
	private var timer:double;
	
	public function Init()
	{
		super.Init();
		this.LockRadio = false;
		timer = 0.0f;
		isTransition = true;
		to = new Rect(290,300,100,100);
		description1.Init();
		description2.Init();
		chestName.Init();
		chest.Init();
		confirm.Init();
		confirm.OnClick = OnOKClick;
		confirm.txt = Datas.getArString("Common.OK_Button");
		frameSimpleLabel.mystyle.normal.background = null;
		//confirm.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normal",TextureType.BUTTON);
		//confirm.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_down",TextureType.BUTTON);
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent",TextureType.DECORATION);
		back.rect = new Rect(0,-20,rect.width,rect.height+40); 
		backlight.Init();
		backlight.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light",TextureType.DECORATION);
		
		backlight.Screenplay.OnPlayFinish = OnFlashFinish;
		backlight.From = 0.4f;
		backlight.To = 1.0f;
		backlight.Times = 1;
		isFirst = true;
		
	}
	private function OnFlashFinish(screenplay:IScreenplay)
	{
		backlight.Begin();
	}
	public function Update()
	{
		super.Update();
		timer += Time.deltaTime;
		description1.Update();
		description2.Update();
		chestName.Update();
		//chest.Update();
	//	if(isTransition)
	//	{
			//if(isFirst && timer >= 0.3f)
			//{
			//	isFirst = false;
			//	LineAnimate(from,to,chest,0.0f,1.0f,5.0f);
			//}
			UpdateLight();
	//	}
		backlight.Update();
	}
	
	private function UpdateLight()
	{
		backlight.rect.x = chest.rect.x - 50;
		backlight.rect.y = chest.rect.y - 50;
		backlight.rect.width = chest.rect.width + 100;
		backlight.rect.height = chest.rect.height + 100;
		
	}
	
	public function DrawBackground()
	{
		
	}
	private function OnOKClick()
	{
		if(callBack != null) 
			callBack();
		MenuMgr.getInstance().PopMenu("");
	}
	public function DrawItem()
	{
		back.Draw();
		description1.Draw();
		description2.Draw();
		chestName.Draw();
		confirm.Draw();
		backlight.Draw();
		chest.Draw();
	}
	private function OnPlayFinish()
	{
		isTransition = false;
		confirm.SetVisible(true);
	}
	public function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		offsetY=49;
		var paramDat : WheelGameParam = param as WheelGameParam;
		if ( paramDat == null )
			return;
		//var hash:Object[] = param as Object[];
		//if(hash == null) return;
		callBack = null;
		
		//if(hash[0] != null)
		from = paramDat.from;//hash[0];
		//if(hash[1] != null)
		id = paramDat.id;//_Global.INT32(hash[1]);
		//if(hash[2] != null)
		callBack = paramDat.callBack;// hash[2];
		
//		chest.useTile = true;
//		var texMgr : TextureMgr = TextureMgr.instance();
//		chest.tile = paramDat.tile;//TextureMgr.instance().ItemSpt().GetTile(texMgr.LoadTileNameOfItem(id));  
		chest.SetId(id);
		
		//var r:Rect = chest.tile.prop.LogicRect; 
		var r:Rect = chest.rect;
		to.width = r.width;
		to.height = r.height;
//		to.width = r.width * Screen.width / 640.0f;
//		to.height = r.height * Screen.height / 960.0f;
//		if ( to.width / to.height > r.width / r.height )
//		{
//			to.width = to.height * r.width / r.height;
//		}
//		else
//		{
//			to.height = to.width * r.height / r.width;
//		}
//		to.width = to.width * 640.0f/Screen.width;
//		to.height = to.height * 960.0f/Screen.height; 
		var fromCenter : Vector2 = from.center;
		from.width = to.width;
		from.height = to.height;
		from.x = fromCenter.x - 0.5f * from.width;
		from.y =  fromCenter.y - 0.5f * from.height;
		to.x = 320 - to.width / 2;
		var y00:float = description2.rect.y + description2.GetTxtHeight();
		var y11:float = description1.rect.y - y00;
		to.y = y00 + y11 / 2.0f - to.height / 2.0f;
		//chest.tile = TextureMgr.instance().ItemSpt().GetTile("i"+id.ToString());
		//chest.rect = from;TODO
		chest.rect = to;
		chestName.txt = Datas.getArString("itemName.i" + id);
		description1.txt = Datas.getArString("itemDesc.i" + id);
		if(paramDat.rewardType == 0)
		{
			description2.txt = String.Format(Datas.getArString("WheelGame.TextWonKey"),Datas.getArString("WheelGame.Key"));
		}
		else if(paramDat.rewardType == 1)
		{
			description2.txt = String.Format(Datas.getArString("WheelGame.TextWonCommonPrize"),Datas.getArString("itemName.i" + id));
		}
		else if (paramDat.rewardType == 2)
		{
			description2.txt = String.Format(Datas.getArString("WheelGame.TextWonCommonPrize"),Datas.getArString("itemName.i" + id));
		}
		

		confirm.rect.y = description1.GetTxtHeight() + description1.rect.y + 105;
		UpdateLight();
		backlight.SetVisible(true);
		backlight.Begin();
		confirm.SetVisible(true);
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
	
	public function get TargetRect() : Rect
	{
		return to;
	}
	public function OnBackButton()
	{
		OnOKClick();
		return true;
	}
	
}
