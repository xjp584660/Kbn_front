#pragma strict

class LoginPopupParam
{
	public var type : int;	//	0, 1
	public var title : String;
	public var content : String;
	public var pic : Texture2D;
	public var btnParams : ButtonParam[];
	public var onPopMenu : function():void;

	public enum ButtonTextureType
	{	None,
		Blue
	}
	
	public class ButtonVisualStyle
	{
		public var rect : Rect;
		public var textureType : ButtonTextureType = ButtonTextureType.Blue;
		public var fontColor : FontColor = FontColor.Button_White;
		public var fontSize : FontSize = FontSize.Font_25;
	}
	
	public class ButtonParam
	{
		public var txt : String;
		public var linkType : String;
		public var param : String;
		public var onClick : function() : void;
		public var closeAfterClick : boolean = true;
		public var style : ButtonVisualStyle;
	}
}


class StartupPopDialog extends PopMenu
{
	public static var MaxButtonCount : int = 3;
	public enum EPopType
	{
		PicAndText
	,	PicOnly
	,	TextOnly
	}
	//private var m_title : Label;
	@SerializeField
	private var m_btnRect3 : Rect[];
	@SerializeField
	private var m_btnRect2 : Rect[];
	@SerializeField
	private var m_btnRect1 : Rect;
	
	@SerializeField
	private var m_lbPic : Label;
	@SerializeField
	private var m_lbContentFrame : Label;
	@SerializeField
	private var m_lbContent : Label;

	private var m_btnWork : SimpleButton[];
	@SerializeField
	private var m_btnWorkTemplate : SimpleButton[];

	@SerializeField
	private var m_wndRect : Rect[];	//	0: partical, 1 : full window, 3: full text
	
	@SerializeField
	private var m_picRect : Rect[];	//	0: partical, 1 : full window, 3: full text
	
	@SerializeField
	private var m_txtRect : Rect[]; //	0: partical, 1 : full window, 3: full text
	
	@SerializeField
	private var m_lbSplice : SimpleLabel;
	
	private var m_params : LoginPopupParam;
	
	@SerializeField
	private var m_svContent : ScrollView;
	
	private var m_useScrollView : boolean;

	public function OnPush(par : System.Object)
	{
		super.OnPush(par);
		m_useScrollView = false;
		bgMiddleBodyPic = null;
		var popParam : LoginPopupParam = par as LoginPopupParam;
		var texMgr = TextureMgr.instance();
		switch ( popParam.type )
		{
		case EPopType.PicAndText:	//	1+1
			this.rect = m_wndRect[0];
			this.m_lbPic.rect = m_picRect[0];
			this.m_lbPic.SetVisible(true);
			this.title.SetVisible(true);
			this.title.txt = Datas.getArString(popParam.title);
			this.m_lbContent.txt = Datas.getArString(popParam.content);
			title.mystyle.normal.background = texMgr.LoadTexture("Beginners-offer_tiao", TextureType.ICON_ELSE);
			m_lbContentFrame.mystyle.normal.background = texMgr.LoadTexture("popup2", TextureType.DECORATION);
			m_lbContentFrame.SetVisible(true);
			m_lbContentFrame.rect = m_txtRect[0];
			m_lbSplice.SetVisible(true);
			m_lbSplice.mystyle.normal.background = texMgr.LoadTexture("between line", TextureType.DECORATION);
			break;
		case EPopType.PicOnly:	//	full window, no text context.
			this.rect = m_wndRect[1];
			this.m_lbPic.rect = m_picRect[1];
			this.m_lbPic.SetVisible(true);
			this.title.SetVisible(false);
			this.m_lbContentFrame.SetVisible(false);
			this.m_lbSplice.SetVisible(false);
			break;
		case EPopType.TextOnly:	//	full window no picture.
			this.rect = m_wndRect[2];
			this.m_lbPic.SetVisible(false);
			this.title.SetVisible(false);
			m_lbContentFrame.mystyle.normal.background = texMgr.LoadTexture("popup2", TextureType.DECORATION);
			m_lbContentFrame.SetVisible(true);
			m_lbContentFrame.SetVisible(true);
			m_lbContentFrame.rect = m_txtRect[2];
			this.m_lbSplice.SetVisible(false);
			break;
		}
		
		m_lbContent.SetVisible(m_lbContentFrame.visible);
		if ( m_lbContentFrame.visible )
		{
			m_lbContent.rect = new Rect(m_lbContentFrame.rect.x + m_lbContentFrame.mystyle.padding.left
				, m_lbContentFrame.rect.y + m_lbContentFrame.mystyle.padding.top
				, m_lbContentFrame.rect.width - m_lbContentFrame.mystyle.padding.left - m_lbContentFrame.mystyle.padding.right
				, m_lbContentFrame.rect.height - m_lbContentFrame.mystyle.padding.top - m_lbContentFrame.mystyle.padding.bottom
			);
		}

		m_lbPic.mystyle.normal.background = popParam.pic;
		if ( popParam.btnParams != null && popParam.btnParams.Length != 0 )
		{
			m_btnWork = new SimpleButton[popParam.btnParams.Length];
			for ( var i : int = 0; i != popParam.btnParams.Length; ++i )
			{
				m_btnWork[i] = m_btnWorkTemplate[i];
				m_btnWork[i].EnableBlueButton(true);
				m_btnWork[i].txt = Datas.getArString(popParam.btnParams[i].txt);
			}

			switch ( popParam.btnParams.Length )
			{
			case 1:
				m_btnWork[0].rect = m_btnRect1;
				m_btnWork[0].OnClick = priv_click1stBtn;
				break;
			case 2:
				m_btnWork[0].rect = m_btnRect2[0];
				m_btnWork[0].OnClick = priv_click1stBtn;
				m_btnWork[1].rect = m_btnRect2[1];
				m_btnWork[1].OnClick = priv_click2ndBtn;
				break;
			case 3:
				m_btnWork[0].rect = m_btnRect3[0];
				m_btnWork[0].OnClick = priv_click1stBtn;
				m_btnWork[1].rect = m_btnRect3[1];
				m_btnWork[1].OnClick = priv_click2ndBtn;
				m_btnWork[2].rect = m_btnRect3[2];
				m_btnWork[2].OnClick = priv_click3rdBtn;
				break;
			}
			
			for ( var btnIdx : int = 0; btnIdx != popParam.btnParams.Length; ++btnIdx )
			{
				var btnParam : LoginPopupParam.ButtonParam = popParam.btnParams[btnIdx];
				if ( btnParam.style == null )
					continue;
				if ( btnParam.style.rect.width != 0 && btnParam.style.rect.height != 0 )
					m_btnWork[btnIdx].rect = btnParam.style.rect;
				switch ( btnParam.style.textureType )
				{
				case LoginPopupParam.ButtonTextureType.None:
					m_btnWork[btnIdx].mystyle.normal.background = null;
					m_btnWork[btnIdx].mystyle.active.background = null;
					break;
				case LoginPopupParam.ButtonTextureType.Blue:
					//	default is blue.
					break;
				}
				m_btnWork[btnIdx].SetNormalTxtColor(btnParam.style.fontColor);
				m_btnWork[btnIdx].SetFont(btnParam.style.fontSize, m_btnWork[btnIdx].fontType);
			}
			
			btnClose.SetVisible(false);
		}
		else
		{
			btnClose.SetVisible(true);
		}

		m_params = popParam;
		var maxHeight : float = _Global.CalcTextHeight(m_lbContent.mystyle, m_lbContent.txt, m_lbContent.rect.width);
		if ( maxHeight > m_lbContent.rect.height )
		{
			m_svContent.rect = m_lbContent.rect;
			m_lbContent.rect.height = maxHeight;
			m_lbContent.rect.x = 0;
			m_svContent.Init();
			m_svContent.addUIObject(m_lbContent);
			m_svContent.AutoLayout();
			m_useScrollView = true;
		}
	}
	
	private function priv_click1stBtn() : void
	{
		priv_doClickLink(m_params.btnParams[0]);
	}
	private function priv_click2ndBtn() : void
	{
		priv_doClickLink(m_params.btnParams[1]);
	}
	private function priv_click3rdBtn() : void
	{
		priv_doClickLink(m_params.btnParams[2]);
	}

	private function priv_doClickLink(btnParam : LoginPopupParam.ButtonParam)
	{
		if ( btnParam.closeAfterClick )
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			menuMgr.PopMenu("");
		}

		if ( btnParam.onClick != null )
			btnParam.onClick();
		else
			Linker.DefaultActionHandler(btnParam.linkType, btnParam.param);
	}

	public function DrawItem()
	{
		m_lbPic.Draw();
		m_lbContentFrame.Draw();
		if ( m_useScrollView )
			m_svContent.Draw();
		else
			m_lbContent.Draw();
		title.Draw();
		m_lbSplice.Draw();
		if ( m_btnWork != null )
		{
			for ( var i : int = 0; i != m_btnWork.Length; ++i )
				m_btnWork[i].Draw();
		}
	}

	public function Update() : void
	{
		if ( m_useScrollView )
			m_svContent.Update();
	}

	function DrawTitle()
	{
	}
	
	public function OnPopOver()
	{
		title.mystyle.normal.background = null;
		m_lbPic.mystyle.normal.background = null;
		m_lbSplice.mystyle.normal.background = null;
		m_lbContent.mystyle.normal.background = null;
		if ( m_params.onPopMenu != null )
			m_params.onPopMenu();
	}
	
	public function OnBackButton()
	{
		
		return true;
	}
	
	
}

