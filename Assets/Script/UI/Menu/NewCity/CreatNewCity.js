class CreatNewCity extends ComposedMenu
{
	public var frameLabel:Label;
	public var line:Label;
	private var backRect:Rect;
	public var mask:Label;
	public var choosePlain:ChoosePlain;
	public var cityName:SetCityName;
	private var city:int;
	private static var instance:CreatNewCity;
	function Init()
	{
		super.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		var borderX:int = 8;
		var borderY:int = 11;
		btnClose.rect = Rect(rect.width - 100 - borderX, 5, 100 + borderX, 100 + borderY);
		btnClose.mystyle.overflow.left = btnClose.mystyle.normal.background.width - 100;
		btnClose.mystyle.overflow.bottom = btnClose.mystyle.normal.background.height  - 100;
		btnClose.mystyle.overflow.top =  -borderY;
		btnClose.mystyle.overflow.right =  - borderX;

		frameLabel.rect.x = 0;
		frameLabel.rect.y = 0;
		frameLabel.rect.width = rect.width + 2;
		frameLabel.rect.height = rect.height + 5;
		frameLabel.useTile = true;
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");

		btnClose.OnClick = CloseMenu;

		if(mask.mystyle.normal.background == null)
		{
			mask.mystyle.normal.background = texMgr.LoadTexture("square_black",TextureType.BACKGROUND);
		}
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");//TextureMgr.instance().BackgroundSpt();
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		
		//bgMiddleBodyPic.spt.edge = 2;
	
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		
		//repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		backRect = Rect( 5, 5, rect.width, rect.height - 15);
		choosePlain.Init(this);
		cityName.Init(this);
		instance = this;
	}
	
	public static function Instance()
	{
		return instance;
	}
	
	public function GetTopSubMenu():SubMenu
	{
		if(subMenuStack != null && subMenuStack.Count > 1)
			return subMenuStack[subMenuStack.Count - 1];
		return null;
	}

	public function OnPush(param:Object)
	{
		super.OnPush(param);
		showIphoneXFrame=false;
		curState = State.Normal;
		subMenuStack.Clear();

		var hashTableParam : Hashtable = param as Hashtable;
		var citySequence : int = (hashTableParam["buildCity"] as City).citySequence;

		if( hashTableParam["plainId"] ){
			cityName.btnBack.SetVisible(false);
			cityName.SetVisible(true);
			subMenuStack.Add(cityName);
			cityName.OnPush({"city":citySequence,
								"plainId":hashTableParam["plainId"]});
			
		}else{
			cityName.btnBack.SetVisible(true);

			subMenuStack.Add(choosePlain);
			choosePlain.OnPush(hashTableParam["buildCity"]);
			city = citySequence;
		}
	}

	public	function	OnPopOver()
	{
		choosePlain.Clear();
		super.OnPopOver();
	}
	
	function Draw()
	{
		if(!visible)
			return -1;
		if(disabled && Event.current.type != EventType.Repaint)	
			return;	
		DrawMask();
		super.Draw();
//		var oldColor:Color = GUI.color;
//		var matrix:Matrix4x4 = GUI.matrix; 
//		var scaleMatrix:Matrix4x4 = Matrix4x4.Scale  ( Vector3 (m_scale, m_scale, 1.0));
//		GUI.matrix = scaleMatrix*matrix ;
//		GUI.color = m_color;	
//		GUI.BeginGroup(rect);
//		
//		GUI.EndGroup();
//		GUI.color = oldColor;
//		GUI.matrix = matrix;		
	}	
	
	function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;	
		GUI.BeginGroup(backRect);
		DrawMiddleBg(rect.width - 8,0);
		
		GUI.EndGroup();
			
			
	}
	
	function DrawSubMenu(){
		super.DrawSubMenu();
		frameLabel.Draw();
		btnClose.Draw();
	}
	
	function DrawMask()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.5);	
		mask.Draw();
		GUI.color = oldColor;
	}	
	
	public function CloseMenu(param:Object)
	{
		MenuMgr.getInstance().PopMenu("");		
	}
	
	public function SetCityName(plainId:int)
	{
		var data:Object =
		{
			"city":city,
			"plainId":plainId
		};
		PushSubMenu(cityName, data);
	}
}
