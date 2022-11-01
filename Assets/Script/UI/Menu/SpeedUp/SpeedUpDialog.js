import System.Reflection;
class SpeedUpDialog extends PopMenu
{
	public var msgLabel:Label;
	public var btnConfirm:Button;
	public var bgMenu : BGMenu;
	protected var _callBack:MulticastDelegate;
	public var l_bg:Label;
	public var tip:Label;
    public var toggle_button : ToggleButton;
	private	var	contentData:Hashtable;
	private    var    typeId:int;
	private var speedUpType : String;
	private var _selected:boolean;
	
	public function Init():void
	{		
		super.Init();
		bgMenu.Init();
		bgMenu.m_color = new Color(1, 1, 1, 0.8);
		toggle_button.selected = false;
		toggle_button.valueChangedFunc = valueChangedFunc;	
		btnConfirm.OnClick = OnConfirmClick;
		btnClose.OnClick = 	OnCloseClick;
		
		btnConfirm.txt = Datas.getArString("Gear.GearNotUnlockButton");
        msgLabel.txt = Datas.getArString("NotificationMsg.CostConfirmation_Text2");
        var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
	}
	
	public function DrawItem()
	{		
		tip.Draw();
		msgLabel.Draw();
		btnClose.Draw();
		btnConfirm.Draw();
		toggle_button.Draw();
	}
	
	function OnPush(param:Object)
	{
		_callBack = null;
		contentData = param as Hashtable;
		var item : Hashtable = contentData["item"] as Hashtable;
		var price : int;
		if(item != null)
		{
			price = item["price"];
		}
		else
		{
			price = contentData["price"];
		}
		
		tip.txt = String.Format(Datas.getArString("NotificationMsg.CostConfirmation_Text1") , price);
		
		_selected = SpeedUp.instance().GetSpeedUpIsOpenHint();
		toggle_button.selected = _selected;
	
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width) /2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height) /2;
        
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		if ( iconSpt == null )
			return;
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");		
	}
	
	protected function valueChangedFunc(b:boolean):void
	{
		toggle_button.selected = b;
		_selected = b;
	}
	
	public function OnPop()
	{
		super.OnPop();
		_Global.Log("SpeedUpDialog  SpeedUpType : " + speedUpType + "  open : " + _selected);
	}
	
	public function setLayout(wid:int,hgt:int):void
	{
		if(wid <= 0)
			wid = this.rect.width;
			
		this.rect.width = wid;
		this.rect.height = hgt;
		
		l_bg.rect.width = wid - l_bg.rect.x * 2;	// 10
		l_bg.rect.height = hgt - l_bg.rect.y * 2;	//10

		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width)/2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height)/2;					
	}
	
	public function OnCloseClick()
	{
		_Global.Log("SpeedUpDialog  SpeedUpType : " + speedUpType + "  open : " + _selected);
		MenuMgr.getInstance().PopMenu("");
 	}
 	
 	public function setAction(func:MulticastDelegate):void
	{
		_callBack = func;
	}
 			
 	public function OnConfirmClick()
 	{
 		MenuMgr.getInstance().PopMenu("SpeedUpDialog");
 		if(_callBack != null)
 		{
 			_callBack.DynamicInvoke([]);
 		}
		SpeedUp.instance().SetSpeedUpIsOpenHint(_selected);		
 	}
}