import System.Reflection;
class ErrorDialog extends PopMenu
{
	public var l_bg:Label;
	public var tip:Label;
	public var errorMsg:Label;
	public var timerLabel:Label;
	public var timerMsgLabel:Label;
	public var btnConfirm:Button;
	public var bgMenu : BGMenu;
	protected var _callBack:MulticastDelegate;

	protected var _clsoeCallBack: MulticastDelegate;/* 添加关闭按钮的回调函数 */

	@SerializeField private var isDisplayTimer:boolean;
    @SerializeField private var headImage : Label;
    
	private var endTime:long;
	private var curTime:long;
	private var oldTime:long;
	public function Init():void
	{
		
		super.Init();
		bgMenu.Init();
		bgMenu.m_color = new Color(1, 1, 1, 0.8);
		btnConfirm.OnClick = onClick;
		btnClose.OnClick = 	onClick;
		btnClose.clickParam = "CLOSE";
		
		isDisplayTimer = false;
		
//		btnConfirm.txt = Datas.getArString("Common.OK_Button");
		btnConfirm.txt = "OK"; //cann't use data.arstrings, arstrings maybe not load over
        headImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
        
         var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
	}
	public function DrawTitle()
	{
	
	}
	public function IsCloseVisible():boolean
	{
		if(btnClose == null) return false;
		return btnClose.IsVisible();
	}
	public function OnCloseClick()
	{
		if(btnClose == null) return;
		if(btnClose.OnClick != null)
			ErrorMgr.instance().PopError();
	}
	public function Draw()
	{
		bgMenu.Draw();
		super.Draw();
	}
	public function DrawItem()
	{
		
        headImage.Draw();
		tip.Draw();
		errorMsg.Draw();
		btnClose.Draw();
		btnConfirm.Draw();
		
		if(isDisplayTimer)
		{
			timerLabel.Draw();
			timerMsgLabel.Draw();
		}
	}
	
	function Update()
	{
		if(isDisplayTimer)
		{
			if(curTime - oldTime >= 1)
			{
				if(endTime >= curTime)
				{
					timerLabel.txt = _Global.timeFormatStr(endTime - curTime);
					oldTime = curTime;
				}
				else
				{
					_callBack.DynamicInvoke([]);			
				}
			}
		}
	}
	
	public function SetTip(txt:String)
	{
		tip.txt = txt;
	}
	
	public function SetMsg(txt:String)
	{
		errorMsg.txt = txt;
	}
	
	function OnPush(param:Object)
	{
	headImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width) /2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height) /2;
        KBN.LoadingTimeTracker.Instance.OnInterrupt();
        
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		if ( iconSpt == null )
			return;
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
        l_bg.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_fte_bottom", TextureType.FTE);
	}

	public function lockScreen(isTimeType:boolean, time:long):void
	{
		if(isTimeType)
		{
			isDisplayTimer = true;
			endTime = time;
			curTime = GameMain.unixtime();
			InvokeRepeating("subSecondUpdate", 1, 1);
		}

		btnClose.SetVisible(false);
 		btnConfirm.SetVisible(false);		
	}
	
	private function subSecondUpdate():void
	{
		curTime ++;
	}
	
	public function SetDefault():void
	{
		var data:Datas = Datas.instance();
//		var arStrings:Object = data ? data.arStrings() : null;
		
		btnClose.SetVisible(true);
		btnConfirm.SetVisible(true);
		
		timerMsgLabel.txt = Datas.getArString("PopUpInfor.AccessGame");
		
		btnConfirm.txt =  Datas.getArString("Common.OK_Button") ? Datas.getArString("Common.OK_Button") : "OK";//Datas.getArString("Common.OK_Button");
		_callBack = null;
		_clsoeCallBack = null;
		resetLayout();
	}
	
	public function setTitleY(y:int):void
	{
		title.rect.y = y;	
	}
	
	public function setContentRect(contentRect:Rect):void
	{
		errorMsg.rect.x = contentRect.x;
		errorMsg.rect.y = contentRect.y;
		if(contentRect.width == 0)
			contentRect.width = rect.width - 2*contentRect.x;
		errorMsg.rect.width = contentRect.width;
		errorMsg.rect.height = contentRect.height;
		resetLayout();
	}
	
	public function setLayout(wid:int,hgt:int):void
	{
		if(wid <= 0)
			wid = this.rect.width;
			
		this.rect.width = wid;
		this.rect.height = hgt;
		
		l_bg.rect.width = wid - l_bg.rect.x * 2;	// 10
		l_bg.rect.height = hgt - l_bg.rect.y * 2;	//10
//		
//		backLabel.rect.width = wid;
//		backLabel.rect.height = hgt;
		
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width)/2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height)/2;		
		
		layout();		
	}
	
	public function OnPop()
	{
		isDisplayTimer = false;
		super.OnPop();
	}
	
	protected function layout():void
	{
		btnClose.rect.x = rect.width - btnClose.rect.width - 15;	
		
		btnConfirm.rect.x = (rect.width - btnConfirm.rect.width) / 2;
		btnConfirm.rect.y = rect.height - btnConfirm.rect.height - 30;
		
	}
	
	public function setAction(str:String,func:MulticastDelegate):void
	{
		if( str && str != ""){
			btnConfirm.txt = str;
		}
		_callBack = func;
	}


	/*  设置 关闭按钮的 回调 函数*/
	public function SetCloseAction(func: MulticastDelegate): void {

		_clsoeCallBack = func;
	}

	public function setButtonName(str:String)
	{
		btnConfirm.txt = str;
	}
	
	protected function onClick(param:Object):void
	{
		ErrorMgr.instance().PopError();
		if(_callBack && param!= "CLOSE" ){
			_callBack.DynamicInvoke([]);
		}
		/* 执行close的 回调函数 */
		else if (_clsoeCallBack && param == "CLOSE") {
			_clsoeCallBack.DynamicInvoke([]);
		}
	}
}

