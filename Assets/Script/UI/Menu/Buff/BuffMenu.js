class BuffMenu extends PopMenu
{
	public var scrollList:ScrollList;
	public var item:BuffListItem;
	public var divideLine:Label;
	
	public var buffSubmenu:BuffSubMenu;
	
	private var controller:NavigatorController;	
	private static var g_instance:BuffMenu;
	
	public static function get instance():BuffMenu
	{
		return g_instance;		
	}
	public function getmyNacigator():NavigatorController
	{
		return controller;
	}

	public function Init():void
	{
		super.Init();
		btnClose.Init();
		btnClose.OnClick = handleBack;
		title.Init();
	
		divideLine.Init();
		divideLine.setBackground("between line", TextureType.DECORATION);
	
		item.Init();
		scrollList.Init(item);
		
		buffSubmenu.Init();
		
		controller = new NavigatorController();
		controller.Init();
		controller.push(scrollList);

		g_instance = this;
		
		GameMain.instance().resgisterRestartFunc(function(){
			g_instance = null;
		});		
	}
	
	public function DrawItem()
	{
		divideLine.Draw();
		controller.DrawItems();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("BuffMenu");
	}
	
	function Update() 
	{
		controller.u_Update();
		BuffAndAlert.instance().update();
	}

	function FixedUpdate()
	{
		controller.u_FixedUpdate();	
	}
	
	public function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		showIphoneXFrame=false;
		var array:Array = BuffAndAlert.instance().getArrayForScrollList();
		scrollList.SetData(array);
		
		scrollList.ResetPos();
		
//		var arString:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("Common.Buff");
		
		if(Shop.instance().updateShop)
		{
			Shop.instance().getShopData(null);
		}
		
		isBuffMenuOpen = true;
		BuffAndAlert.instance().handleBuffUpdate = handleUpdateBuff;
	}
	
	private var isBuffMenuOpen:boolean = false;
	private var isSubBuffMenuOpen:boolean = false;
	
	private function handleUpdateBuff():void
	{
		if(isBuffMenuOpen)
		{
			if(isSubBuffMenuOpen)
			{
				buffSubmenu.resetSubmenuPage();
			}
			else
			{
				resetMenuPage();
			}
		}
	}
	
	public function resetMenuPage():void
	{
		var array:Array = BuffAndAlert.instance().getArrayForScrollList();
		scrollList.SetData(array);		
	}
	
	public function OnPop()
	{
		super.OnPop();
		
		if(controller.uiNumbers > 0)
		{
			controller.pop2Root();
		}
		
		isBuffMenuOpen = false;
		isSubBuffMenuOpen = false;
	}
	
	public	function OnPopOver():void{
		scrollList.Clear();
		buffSubmenu.OnPopOver();
	}
	
	function pushSubMenu(_data:Object)
	{
		buffSubmenu.setData(_data);
		controller.push(buffSubmenu);
		
		isSubBuffMenuOpen = true;
	}
	
	function popSubMenu(_resetPage:boolean)
	{
		controller.pop();
		isSubBuffMenuOpen = false;
		
		if(_resetPage)
		{
			resetMenuPage();
		}
	}
}
