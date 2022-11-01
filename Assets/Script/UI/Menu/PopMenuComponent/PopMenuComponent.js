class PopMenuComponent extends KBNMenu
{
	@SerializeField
	private var bgMenu : KBNMenu;
	public var popMenu : KBNMenu;
	private var m_bgMenu : KBNMenu;
	@SerializeField
	private var backAlpha:float = 0.6f;
	
//	public function Awake()
//	{
//		this.Init();
//		super.Init();
//	}
	
	public function get BgMenu() : KBNMenu
	{
		return m_bgMenu;
	}
	
	public function Init():void
	{
		if ( m_bgMenu != null )
			return;
		m_bgMenu = Instantiate(bgMenu);
		m_bgMenu.Init();
		
		var trans:Transition_Fade = new Transition_Fade();
		trans.SetFadeObject(m_bgMenu);
		trans.SetEndAlpha(backAlpha);
		
		m_bgMenu.transition = trans;
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		popMenu.handleNotification(type, body);
	}
		
	public function Draw()
	{

		if (!visible) return;

		m_bgMenu.Draw();
		popMenu.Draw();		
	}
	
	public function Update()
	{
		m_bgMenu.Update();
		popMenu.Update();
	}
	
	public function FixedUpdate():void
	{
		if(popMenu != null)
		{
			popMenu.FixedUpdate();
		}
	}
	
	public function SetPopMenu(_menu : KBNMenu):void
	{
		popMenu = _menu;
	}
	
	public function GetPopMenu() : KBNMenu
	{
		return popMenu;
	}
	
	public function OnPush(param:Object):void
	{
		if(popMenu != null)
		{
			popMenu.OnPush(param);
		}
	}
    
    public function OnPushOver()
    {
        if (popMenu != null)
        {
            popMenu.OnPushOver();
        }
    }
	
	public function OnPop():void
	{
		if(popMenu != null)
		{
			popMenu.OnPop();
		}
	}
	
	public function OnPopOver():void
	{
		if(popMenu != null)
		{
			popMenu.OnPopOver();
		}
		TryDestroy(this.m_bgMenu);
		TryDestroy(this);
	}
	
	public function SetVisible(_isVisible:boolean):void
	{
		if ( m_bgMenu == null )
			this.Init();
		m_bgMenu.SetVisible(_isVisible);
		
		if(popMenu != null)
		{
			popMenu.SetVisible(_isVisible);
		}
	}
	
	public function SetDisabled(_isDisabled:boolean):void
	{
		m_bgMenu.SetDisabled(_isDisabled);
		
		if(popMenu != null)
		{
			popMenu.SetDisabled(_isDisabled);
		}
	}		
	public function getmyNacigator():NavigatorController
	{
		if(popMenu == null) return;
		return popMenu.getmyNacigator();
	}
	
	public function OnBackButton() : boolean
	{
		if(popMenu == null) 
			return super.OnBackButton();
		return popMenu.OnBackButton();
	}
	
	
}