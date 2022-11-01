
class MenuMgr extends KBN.MenuMgr {

	// Use this for initialization
	var menuStack:Array;
	protected var state:MENUSTATE = MENUSTATE.Disappear;

	public function getState():MENUSTATE
	{
		return state;
	}
	protected var curTransition:Transition;

	public  var MainChrom:MainChrom;
	public	var popMenuComp:PopMenuComponent;
	public var Chat:ChatMenu;
	@SerializeField
	private var AvaChat:AvaChatMenu;

	public var	netConnectMenu:NetConnectMenu;

	//share
	public var shareMenu : KBNMenu;

	//build city done popup
	public var EventDonePopup:EventDoneDialog;

    private var passTime:float = 0;
    private var frame:long = 0;
    private var popMenu : KBNMenu = null;
	public var mySkin : GUISkin;

	public var default_trans:function():Transition;

	public var  floatMessage:FloatMessage;
	public var  scenceMessage:FloatMessage;

	public var  commonTips:CommonTips;

	private var transitionTable:System.Collections.Generic.Dictionary.<String, function():Transition>;
	private var  menuArray:Hashtable = new Hashtable();
	private var prefabs: System.Collections.Generic.Dictionary.<String, String>;
	private	var	 needInstanceMenuList:System.Collections.Generic.HashSet.<String>;
	private var MenuDictionary:System.Collections.Generic.Dictionary.<String, GameObject> = new System.Collections.Generic.Dictionary.<String, GameObject>();
//	private var  menuInitFlagArray;
//	var textFieldString = "";
	private var frameRate:float;

//	public  var test:UITest;

	public  var messageTime:float;

	public  var mask:Label; 

	private var bError: boolean;
	private var m_needOnPopOverMenu : System.Collections.Generic.LinkedList.<KBNMenu> = new System.Collections.Generic.LinkedList.<KBNMenu>();
//	var testTexture:Texture2D ;
//	private var m_errorMgr:ErrorMgr;
	function Awake()
	{
	//	init();
//		DontDestroyOnLoad (transform.gameObject);
		//useGUILayout = false;
		enabled = true;
		instance = this;
		menuStack = new Array();
		floatMessage.OnStartShow = OnStartToast;
		floatMessage.OnFinishShow = OnFinishToast;

		InitMenuDelegates();
	}

	public static function getInstance():MenuMgr
	{
		return instance as MenuMgr;
	}

	public	static	function free(){
		instance = null;
	}

	public function getStackNum():int
	{
		if(menuStack)
			return menuStack.length;
		return 0;
	}

	public function hasMenuByName(_menuName:String):boolean
	{
		if(menuStack)
		{
			for(var a:int = 0; a < menuStack.length; a++)
			{
				if(menuStack[a] == menuArray[_menuName])
				{
					return true;
				}
			}

			return false;
		}
	}

	private function fromPrefab( menuClassName:String ):boolean{
		var it:System.Collections.DictionaryEntry;
		for(it in menuTestArray)
		{
			if( menuClassName == it.Key ){
				return false;
			}
		}
		return true;
	}

	private function loadMenu(menuClassName:String,  callback:Function):void{

		if(menuArray.ContainsKey(menuClassName))
		{
			var tmpMenu : KBNMenu = menuArray[menuClassName];
			for ( var iMenu : KBNMenu in menuStack )
			{
				if ( iMenu == tmpMenu )
				{
					tmpMenu.OnPop();
					break;
				}
			}
			tmpMenu.OnPopOver();
			//tmpMenu.Init();
			callback(tmpMenu.gameObject);
			return;
		}
		//var gObj:GameObject;
		//  if(needInstanceMenuList.Contains(menuClassName))
		//  {
		// 	if(MenuDictionary.ContainsKey(menuClassName))
		// 	{
		// 	    MenuDictionary[menuClassName].GetComponent(typeof(Menu)).SetVisible(true);
		// 		callback(MenuDictionary[menuClassName]);
		// 		return;
		// 	}
		//  }
		// // {
		// // 	gObj = GameObject.Instantiate();
		// // 	gObj.name = menuClassName;
		//   TextureMgr.instance().LoadPrefab(prefabs[menuClassName]);
		// // }
		// // else
		// // {
		// 	//TextureMgr.instance().LoadMenuPrefabAysn(prefabs[menuClassName],callback);
		// 	//TextureMgr.instance().LoadPrefab(pre);
		// //}
		var gObj:GameObject;
		if(needInstanceMenuList.Contains(menuClassName))
		{
			if (prefabs.ContainsKey(menuClassName)) {
				gObj = GameObject.Instantiate(TextureMgr.instance().LoadPrefab(prefabs[menuClassName])) as GameObject;
				gObj.name = menuClassName;
			} else {
				_Global.LogError("<color=#FF008EFF> no this menu config path data : <color=#FF0000FF>" + menuClassName + " </color> , see [Resurces/MenuResConfig.json] file.</color>");
			}

		}
		else
		{
			if (prefabs.ContainsKey(menuClassName)) {
				gObj = TextureMgr.instance().LoadPrefab(prefabs[menuClassName]);
				if(gObj!=null)
				callback(gObj);
			
			}
			else {
				_Global.LogError("<color=#FF008EFF> no this menu config path data : <color=#FF0000FF>" + menuClassName + " </color> , see [Resurces/MenuResConfig.json] file.</color>");
			}
						// if(menuClassName=="MuseumEventListMenu")
						// {
						// 	gObj = TextureMgr.instance().LoadPrefab(prefabs[menuClassName]);
						// 	if(gObj!=null)
						// 	callback(gObj);
						// }
						// else
						// {
						// 	TextureMgr.instance().LoadMenuPrefabAysn(prefabs[menuClassName],callback);
						// }
						
			
		}

        // if(gObj!=null){
		// 	callback(gObj);
		// }
	
	}

	private function unloadMenu( menu : KBNMenu ):void{
		if( menu == null ) return;
		var menuClassName:String = menu.menuName;


		if( !fromPrefab(menuClassName) ){ //only for test
			return;
		}

		// if(needInstanceMenuList.Contains(menuClassName))
		// {
		// 	Destroy(menu.gameObject);
		// }else{
			menu.SetVisible(false);
		// }

		menuArray.Remove( menuClassName );
		//TextureMgr.instance().unloadUnusedAssets();
     	//System.GC.Collect();
	}

	public function getMenu( menuClassName:String ) : KBNMenu
	{
		return getMenu(menuClassName,false);
	}

	public function getMenu( menuClassName:String, bOrig:boolean ) : KBNMenu
	{
		if(!bOrig && (menuArray[menuClassName] as PopMenuComponent) != null)
		{
			return (menuArray[menuClassName] as PopMenuComponent).GetPopMenu();
		}
		else
		{
			return menuArray[menuClassName];
		}
	}

	class GetMenuCallback {
		public var menuName : String;
		public var func : function(KBNMenu):void;
		public var time : DateTime;

		public function GetMenuCallback(menuName:String, func:function(KBNMenu):void) {
			this.menuName = menuName;
			this.func = func;
			time = DateTime.Now;
		}
	}
	private var getMenuCallbacks : System.Collections.Generic.List.< GetMenuCallback > = null;

	private function priv_getMenuAndCall(menu : KBNMenu) {
		var now:DateTime = DateTime.Now;

		for(var i:int = 0; i < getMenuCallbacks.Count;) {
			if (menu.menuName == getMenuCallbacks[i].menuName) {
				getMenuCallbacks[i].func(menu);
				getMenuCallbacks.RemoveAt(i);
				break;
			}
			if ( (now - getMenuCallbacks[i].time).TotalMinutes > 20 ) {
				getMenuCallbacks.RemoveAt(i);
				continue;
			}
			i++;
		}
	}

	public function getMenuAndCall( menuClassName:String, func:function(KBNMenu):void )
	{
		if (null == getMenuCallbacks) {
			getMenuCallbacks = new System.Collections.Generic.List.< GetMenuCallback >();
			RegisterMenuOnPush(priv_getMenuAndCall);
		}

		var menu : KBNMenu = getMenu(menuClassName);
		if (null == menu)
			getMenuCallbacks.Add(new GetMenuCallback(menuClassName, func));
		else
			func(menu);
	}

	public function GetMenuToCallFunc( menuClassName:String,func:System.Action.<KBNMenu> )
	{
		getMenuAndCall(menuClassName,func);
	}
//	private function unloadMenu(menuClassName:String):void{
//		menuArray.Remove( menuClassName );
//		TextureMgr.instance().unloadUnusedAssets();
//	}

	var menuTestArray:Hashtable;
	function InitMainMenu()
	{
		bNetBlock = false;
		bError = false;

		//netConnectMenu
//		EventDonePopup.Init();
		netConnectMenu.Init();
		confirmDialog.Init();
		catch_confirmDialog = null;

//		Login.Init();
//		download.Init();
		needInstanceMenuList = new System.Collections.Generic.HashSet.<String>();
		//needInstanceMenuList.Add("GearMenu");
		//needInstanceMenuList.Add("ArmMenu");
		//needInstanceMenuList.Add("StartupPopDialog");

		prefabs = GetMenuResConfig();
		
		 menuArray = {
		 "MainChrom":MainChrom,
		 "ChatMenu":Chat,
		 "AvaChatMenu":AvaChat,
		 "NetConnectMenu":netConnectMenu,
		 "ShareMenu":shareMenu
		};

		menuTestArray = {
		 "MainChrom":MainChrom,
		 "ChatMenu":Chat,
		 "AvaChatMenu":AvaChat,
		 "NetConnectMenu":netConnectMenu,
		 "ShareMenu":shareMenu
		};
		var it:System.Collections.DictionaryEntry;
		for(it in menuArray)
		{
			(it.Value as KBNMenu).menuName = it.Key;
		}

		transitionTable = new System.Collections.Generic.Dictionary.<String, function():Transition>();
		transitionTable.Add("trans_pop", function() : Transition{return new Transition_ZoomMovePop();});
		transitionTable.Add("trans_up",  function() : Transition{return new Transition();});
		transitionTable.Add("trans_horiz",  function() : Transition{return new TransHorMove();});
		transitionTable.Add("trans_immediate", function() : Transition{return new Transition_immediate();});
		transitionTable.Add("trans_zoomComp", function() : Transition{return new Transition_ZoomComponent();});
		transitionTable.Add("trans_down", function() : Transition{return new Transition_Down();});
		transitionTable.Add("transition_BlowUp", function() : Transition{return new Transition_BlowUp();});
		transitionTable.Add("trans_up_not_hide_bottom", function() : Transition{return new Transition_Up();});
		transitionTable.Add("trans_immediate_hide_bottom", function() : Transition{return new Transition_HideBottom();});

		default_trans = transitionTable["trans_up"];
		state = MENUSTATE.Show ;
	}

	function InitInGameMenu () {
		InitIphonexFrame();
		EventDonePopup.Init();
		MainChrom.Init();
		Chat.Init();
		AvaChat.Init();
		shareMenu.Init();
		
	}
	
	

	public	function InitInGameMenuAfterChangeCity(){
//		barrack.InitAfterChangeCity();
//		Wall.InitAfterChangeCity();
		MainChrom.InitAfterChangeCity();
		Watchtower.instance().SynDataWithSeed();

		BuffAndAlert.instance().resetBuffAndAlert();
	}

	public function getChatMenu()
	{
		return Chat;
	}
	
	public function getAvaChatMenu() : KBN.AvaChatMenu
	{
		return AvaChat as KBN.AvaChatMenu;
	}

//	public function getEventCenterMenu()
//	{
//		return eventCenter;
//	}
//
//	public function getEmailMenu()
//	{
//		return Email;
//	}

//	public function getLotteryPopupMenu():LotteryPopupMenu
//	{
//		return lottery;
//	}

	public function PushMenu( menuName:String, param:Object)
	{
		PushMenu( menuName, param, default_trans(), Vector2.zero, false);
	}

    public function PushMenu( menuName:String, param:Object, needCoolDown:boolean)
    {
		PushMenu( menuName, param, default_trans(), Vector2.zero, needCoolDown);
    }

    public function PushMenu( menuName:String, param:Object, transition:String)
    {
    	PushMenu( menuName, param, transition, false);
    }

	public function PushMenu( menuName:String, param:Object, transition:String, needCoolDown:boolean)
	{
		if(transition == "" || transition == "default_transition")
		{
			PushMenu( menuName, param, default_trans(), Vector2.zero, needCoolDown);
		}
		else
		{
			if(transitionTable.ContainsKey(transition))
			{
				PushMenu( menuName, param, transitionTable[transition](), Vector2.zero, needCoolDown);
			}
			else
			{
				PushMenu( menuName, param,  default_trans(), Vector2.zero, needCoolDown);
			}
		}
	}

	public function PushMenu(menuName:String, param:Object, transition:String, startPosition:Vector2)
	{
		PushMenu(menuName, param, transition, startPosition, false);
	}

	public function PushMenu(menuName:String, param:Object, transition:String, startPosition:Vector2, needCoolDown:boolean)
	{
		if(transition == "" || transition == "default_transition")
		{
			PushMenu( menuName, param, default_trans(), startPosition, needCoolDown);
		}
		else
		{
			if(transitionTable.ContainsKey(transition))
			{
				PushMenu( menuName, param, transitionTable[transition](), startPosition, needCoolDown);
			}
			else
			{
				PushMenu( menuName, param, default_trans(), startPosition, needCoolDown);
			}
		}
	}

	public function PushMenu(menuName:String, param:Object, transition:Transition):void
	{
		PushMenu( menuName, param, transition, Vector2.zero, false);
	}

	public function PushMenu(menuName:String, param:Object, transition:Transition, needCoolDown:boolean):void
	{
		PushMenu( menuName, param, transition, Vector2.zero, needCoolDown);
	}

	private function PushMenu( menuName:String, param:Object, transition:Transition, startPosition:Vector2, needCoolDown:boolean)
	{    
		if (state != MENUSTATE.Show&&(GetCurMenu()=="MonsterMenu"||menuName=="MonsterMenu")) {return;}
		if (!PopupQueue.singleton.IsDisabled()) {
			if (needCoolDown && !PopupQueue.singleton.IsCooledDown(menuName)) return;
			 if (!PopupQueue.singleton.TryPopup(menuName, needCoolDown))
			 	yield StartCoroutine(PopupQueue.singleton.WaitForPopup(menuName, needCoolDown));
		}
		while( state != MENUSTATE.Show )
		{
			yield  0;
		}
		//if in worldmap level, close tile popup info
		GameMain.instance().hideTileInfoPopup();
		if ( menuArray.ContainsKey(menuName) && menuArray[menuName] == curMenu )
		{
			PopupQueue.singleton.Dequeue(menuName);
			return;
		}

	
		var callback:Function = function(gObj:GameObject)
		{
			if (gObj!=null)
			{
				if (needInstanceMenuList.Contains(menuName)&&!MenuDictionary.ContainsKey(menuName))
				{
					MenuDictionary.Add(menuName,gObj);
				}
				var m : KBNMenu = gObj.GetComponent( menuName );
				if ( m == null )
				{	//	find all components
					m = gObj.GetComponent(typeof(KBNMenu));
				}
		
				if ( m == null )
					return;
				m.Init();
				m.menuName = menuName;
				if (!menuArray.ContainsKey(menuName)){

					menuArray.Add(menuName,m);
				}
				// else{

				// 	return;
				// }
			}
			if( menuArray[menuName] == null)
			{
				PopupQueue.singleton.Dequeue(menuName);
				return;
			}
	
			if(curMenu)
			{
				curMenu.SetDisabled(true);
			}
	
			var oldMenu : KBNMenu = curMenu;
			curMenu = menuArray[menuName];
			if(curMenu == null)
			{
				PopupQueue.singleton.Dequeue(menuName);
				return;
			}
	
			var realCurMenu : KBNMenu = curMenu;
			if( transition instanceof Transition_ZoomComponent )
			{
				curMenu.transition = transitionTable["trans_pop"]();
	
				var pmComponent:PopMenuComponent = Instantiate(popMenuComp);
				pmComponent.SetPopMenu(curMenu);
				pmComponent.Init();
				pmComponent.menuName = menuName;
				curMenu = pmComponent;
	
				menuArray[menuName] = curMenu;
			}
	
			menuStack.Remove(curMenu);
			priv_PushMenu(curMenu);
			curMenu.SetVisible(true);
			curMenu.SetDisabled(false);
			curMenu.transition = transition;
			curTransition = transition;
	
			// LiHaojie 2013.09.05: Notify the menu OnPushOver event to other module

			if (menuActionDelegateDic.ContainsKey("OnPushPrev")) {
				for (var method: Function in menuActionDelegateDic["OnPushPrev"])
				{
					if (method != null)
						method(realCurMenu);
				}
			}
	
			state = MENUSTATE.FadeIn;
			curMenu.OnPush(param);
	
			curTransition.StartTrans(oldMenu,curMenu);
			curTransition.SetStartPos(startPosition);
	
	//		curMenu.enabled = true;
			oldMenu = null;
			popMenu = null;
	
			curTransition.FadeinUpdate();
	
			if(InputText.getKeyBoard())
				InputText.getKeyBoard().active = false;
			InputBox.OutInputBox_OnPop();
	
			// LiHaojie 2013.09.05: Notify the menu OnPushOver event to other module
			if (menuActionDelegateDic.ContainsKey("OnPush")) {
				for (var method: Function in menuActionDelegateDic["OnPush"])
				{
					if (method != null)
						method(realCurMenu);
				}
			}

			if(fromPrefab(menuName) )
			{
			  UIBIMgr.getInstance().OnMenuPush(menuName);
			}

		};

		if(!fromPrefab(menuName) )
		{
			callback(menuTestArray[menuName] as GameObject);
			return;
		}
		loadMenu( menuName ,callback );
	}




	// LiHaojie 2013.09.09:
	private var menuActionDelegateDic: System.Collections.Generic.Dictionary.<String, Array>;
	private function InitMenuDelegates()
	{
		if (menuActionDelegateDic == null)
			menuActionDelegateDic = new System.Collections.Generic.Dictionary.<String, Array>();
	}

	public function RegisterMenuOnPushPrev(del:Function)
	{
		var dels:Array = null;
		if (menuActionDelegateDic.ContainsKey("OnPushPrev"))
		{
			dels = menuActionDelegateDic["OnPushPrev"];
		}
		else
		{
			dels = new Array();
			menuActionDelegateDic["OnPushPrev"] = dels;
		}
		dels.Push(del);
	}

	public function RegisterMenuOnPush(del:Function)
	{
		var dels:Array = null;
		if (menuActionDelegateDic.ContainsKey("OnPush"))
		{
			dels = menuActionDelegateDic["OnPush"];
		}
		else
		{
			dels = new Array();
			menuActionDelegateDic["OnPush"] = dels;
		}
		dels.Push(del);

		// menuOnPushDelegates.Push(del);
	}

	public function RegisterMenuOnPushOver(del:Function)
	{
		var dels:Array = null;
		if (menuActionDelegateDic.ContainsKey("OnPushOver"))
		{
			dels = menuActionDelegateDic["OnPushOver"];
		}
		else
		{
			dels = new Array();
			menuActionDelegateDic["OnPushOver"] = dels;
		}
		dels.Push(del);

		// menuOnPushOverDelegates.Push(del);
	}

	public function RegisterMenuOnPopPrev(del:Function)
	{
		var dels:Array = null;
		if (menuActionDelegateDic.ContainsKey("OnPopPrev"))
		{
			dels = menuActionDelegateDic["OnPopPrev"];
		}
		else
		{
			dels = new Array();
			menuActionDelegateDic["OnPopPrev"] = dels;
		}
		dels.Push(del);
	}

	public function RegisterMenuOnPop(del:Function)
	{
		var dels:Array = null;
		if (menuActionDelegateDic.ContainsKey("OnPop"))
		{
			dels = menuActionDelegateDic["OnPop"];
		}
		else
		{
			dels = new Array();
			menuActionDelegateDic["OnPop"] = dels;
		}
		dels.Push(del);

		// menuOnPopDelegates.Push(del);
	}

	public function RegisterMenuOnPopOver(del:Function)
	{
		var dels:Array = null;
		if (menuActionDelegateDic.ContainsKey("OnPopOver"))
		{
			dels = menuActionDelegateDic["OnPopOver"];
		}
		else
		{
			dels = new Array();
			menuActionDelegateDic["OnPopOver"] = dels;
		}
		dels.Push(del);

		// menuOnPopOverDelegates.Push(del);
	}

	public function PopMenu(menuName:String)
	{
//		_Global.Log("Pop menu:"+menuName);
		if (GetCurMenuName()=="MonsterMenu") {
			Transition.SetMonsterMenuBool();
		}
		PopMenu(menuName, default_trans());
	}

	public function PopMenu(menuName:String, transition:String)
	{
		if(transition == "" || transition == "default_transition")
		{
			PopMenu( menuName);
		}
		else
		{
			if(transitionTable.ContainsKey(transition) != null)
				PopMenu( menuName, transitionTable[transition]());
//			else
//				_Global.Log("Error: no such transition");
		}
	}

	public function PopMenu(menuName:String, transition:Transition)
	{
		priv_popMenu(menuName, transition);
	}
	private function priv_popMenu(menuName:String, transition:Transition)
	{
		if(menuStack.length < 1)
			return;

		while( state != MENUSTATE.Show )
		{
			yield ;
		}

		_Global.LogWarning("PopMenu : " + menuName);
		if(menuName == "")
		{
			state = MENUSTATE.FadeOut;
			popMenu = priv_PopMenu();
			if(menuStack.length >= 1)
			{
				curMenu = menuStack[menuStack.length - 1];
				curMenu.SetVisible(true);
				curMenu.SetDisabled(false);
			}
			else
			{
				curMenu = null;
			}

			curTransition = popMenu.transition;
			popMenu.OnPop();
			popMenu.SetDisabled(true);
			curTransition.StartTrans(popMenu, curMenu);
			curTransition.FadeoutUpdate();
			//this.unloadMenu(popMenu);
			UIBIMgr.getInstance().OnMenuPop(popMenu.menuName);
		}
		else
		{
			if( _Global.IsValueInArray(menuStack, menuArray[menuName]))
			{
				state = MENUSTATE.FadeOut;
				curMenu = menuArray[menuName];
				while(menuStack[menuStack.length - 1 ] != curMenu)
				{
					if(menuStack.length <= 1)
						return;

					var localPopMenu : KBNMenu = priv_PopMenu();
					localPopMenu.OnPop();
					m_needOnPopOverMenu.AddLast(localPopMenu);
					//localPopMenu.OnPopOver();
					localPopMenu.SetDisabled(true);
					this.unloadMenu(localPopMenu);
				}

				popMenu = priv_PopMenu();
				curMenu = menuStack[menuStack.length-1];
			    

				curTransition = popMenu.transition;
				//	state = MENUSTATE.FadeOut;
				
				
				popMenu.OnPop();
				popMenu.SetDisabled(true);
				curMenu.SetVisible(true);
				curMenu.SetDisabled(false);

				curTransition.StartTrans(popMenu, curMenu);
				curTransition.FadeoutUpdate();
				UIBIMgr.getInstance().OnMenuPop(popMenu.menuName);
				//this.unloadMenu(popMenu);
			}
			else
			{
//				_Global.Log("Error: Trying to pop a menu not found in the stack: " + menuName);
			}
		}
		if(InputText.getKeyBoard())
			InputText.getKeyBoard().active = false;
		InputBox.OutInputBox_OnPop();

		/* LiHaojie 2013.09.05: Notify the menu OnPushOver event to other module */
		if (menuActionDelegateDic.ContainsKey("OnPop")) {
			for (var method: Function in menuActionDelegateDic["OnPop"])
			{
				if (method != null)
					method(curMenu);
			}
		}
	}

	public function SwitchMenu( menuName:String, param:Object)
	{
		SwitchMenu( menuName, param, default_trans() );
	}

	public function SwitchMenu( menuName:String, param:Object, needCoolDown:boolean)
	{
		SwitchMenu( menuName, param, default_trans(), needCoolDown);
	}

	public function SwitchMenu( menuName:String, param:Object, transition:String)
	{
		SwitchMenu( menuName, param, transition, false);
	}

	public function SwitchMenu( menuName:String, param:Object, transition:String, needCoolDown:boolean)
	{
		if(transition == "" || transition == "default_transition")
		{
			SwitchMenu( menuName, param, needCoolDown);
		}
		else
		{
			if(transitionTable.ContainsKey(transition) != null)
				SwitchMenu( menuName, param, transitionTable[transition](), needCoolDown);
//			else
//				_Global.Log("Error: no such transition");
		}
	}

	public function SwitchMenu( menuName:String, param:Object, transition:Transition)
	{
		priv_switchMenu(menuName, param, transition, false);
	}

	public function SwitchMenu( menuName:String, param:Object, transition:Transition, needCoolDown:boolean)
	{
		priv_switchMenu(menuName, param, transition, needCoolDown);
	}

	private function priv_switchMenu( menuName:String, param:Object, transition:Transition, needCoolDown:boolean)
	{
		if(menuArray[menuName] == curMenu)
		{
			return;
		}

		if( _Global.IsValueInArray(menuStack, menuArray[menuName]))
		{
			if (!PopupQueue.singleton.IsDisabled()) {
				if (needCoolDown && !PopupQueue.singleton.IsCooledDown(menuName)) return;
				if (!PopupQueue.singleton.TryPopup(menuName, needCoolDown))
					yield StartCoroutine(PopupQueue.singleton.WaitForPopup(menuName, needCoolDown));
			}
			while( state != MENUSTATE.Show )
			{
				yield;
			}

			var localPopMenu : KBNMenu = null;
			curMenu = menuArray[menuName];
			while(menuStack[menuStack.length - 1 ] != curMenu)
			{
				if(menuStack.length == 0)
					break;
				if ( localPopMenu != null )
				{
					m_needOnPopOverMenu.AddLast(localPopMenu);
					//localPopMenu.OnPopOver();
					this.unloadMenu(localPopMenu);
				}
				localPopMenu = priv_PopMenu();
				localPopMenu.OnPop();
			}
			popMenu = localPopMenu;
			curTransition = popMenu.transition;
			curTransition.StartTrans(popMenu, curMenu);
			//popMenu.OnPop();
			popMenu.SetDisabled(true);
			curMenu.SetVisible(true);
			state = MENUSTATE.FadeOut;
			curTransition.FadeoutUpdate();
		}
		else
		{
			PushMenu(menuName, param, transition, needCoolDown);
		}
	}
	public function pop2Menu(menuName:String):void
	{
		if( _Global.IsValueInArray(menuStack, menuArray[menuName]))
		{
			curMenu = menuArray[menuName];
			while(menuStack[menuStack.length - 1 ] != curMenu)
			{
				if(menuStack.length == 0)
					break;
				popMenu = priv_PopMenu();
				popMenu.OnPop();
				m_needOnPopOverMenu.AddLast(popMenu);
				//popMenu.OnPopOver();
				this.unloadMenu(popMenu);
				popMenu.SetDisabled(true);
				popMenu = null;
			}
			curMenu.SetVisible(true);
			curMenu.SetDisabled(false);
//			_Global.Log("");
		}
	}
//	public function PushErrorDialog(tip:String, errorMsg:String)
//	{
//
//	}
	private function priv_PushMenu(menu : KBNMenu)
	{
		menuStack.Push(menu);
		var menu2 : KBNMenu;
		if(menuStack.length > 1)	menu2 = menuStack[menuStack.length -2];
		else menu2 = null;

		OnChangeMenu(menu2,menu,"push");
	}
	private function priv_PopMenu() : KBNMenu
	{
		var menu2 : KBNMenu;
		if(menuStack.length > 1)	menu2 = menuStack[menuStack.length -2];
		else menu2 = null;

		var top : KBNMenu = Top();
		OnChangeMenu(top,menu2,"pop");
		PopupQueue.singleton.Dequeue(top.menuName);
		top = null;
		return menuStack.Pop();
	}

	private function OnChangeMenu(oldMenu : KBNMenu,newMenu : KBNMenu,tag:String)
	{
		var array:Array = new Array();
		array.push(oldMenu == null ? null : oldMenu.menuName);
		array.push(newMenu == null ? null : newMenu.menuName);
		array.push(tag);
		this.sendNotification(Constant.Notice.TOP_MENU_CHANGE, array);
	}

	private function OnStartToast()
	{
		sendNotification(Constant.Notice.TOAST_START,null);
	}
	private function OnFinishToast()
	{
		sendNotification(Constant.Notice.TOAST_FINISH,null);
	}

	public function PushConfirmDialog(strContent:String,titleContent:String,okFunc:System.Action.<System.Object>, cancelFunc:System.Action.<System.Object>, autoClose:boolean)
	{
		if (NewFteMgr.Instance().IsDoingFte)
			return;
		var localDlg : ConfirmDialog = getConfirmDialog();
		catch_confirmDialog = null;
		//if in worldmap level, close tile popup info
		GameMain.instance().hideTileInfoPopup();
		localDlg.SetAction(strContent,titleContent, okFunc, cancelFunc, autoClose);
		localDlg.BeginActive();
		priv_PushConfirmDialog(localDlg);
	}

	public function PushConfirmDialog(strContent:String,titleContent:String,okFunc:System.Action.<System.Object>, cancelFunc:System.Action.<System.Object>, autoClose:boolean,itemId:int,itemCount:int)
	{
		if (NewFteMgr.Instance().IsDoingFte)
			return;
		var localDlg : ConfirmDialog = getConfirmDialog();
		catch_confirmDialog = null;
		//if in worldmap level, close tile popup info
		GameMain.instance().hideTileInfoPopup();
		localDlg.SetAction(strContent,titleContent, okFunc, cancelFunc, autoClose,itemId,itemCount);
		localDlg.BeginActive();
		priv_PushConfirmDialog(localDlg);
	}

	private function priv_PushConfirmDialog(localDlg : ConfirmDialog)
	{
		if (!PopupQueue.singleton.IsDisabled()) {
			if (!PopupQueue.singleton.IsCooledDown(localDlg.menuName)) return;
			// if (!PopupQueue.singleton.TryPopup(localDlg.menuName, true))
			// //ProfilerSample.BeginSample("MenuMgr.Update  KBN.GameMain.singleton.forceRepaintWorldMap()");
			// 	yield StartCoroutine(PopupQueue.singleton.WaitForPopup(localDlg.menuName, true));
			// //ProfilerSample.EndSample();
		}
		while( state != MENUSTATE.Show )
		{
			yield;
		}

		var oldMenu : KBNMenu = curMenu;
		if(curMenu)
		{
			curMenu.SetDisabled(true);
		}

		curMenu = localDlg;

		var transition : Transition_ZoomComponent = new Transition_ZoomComponent();

		curMenu.transition = transitionTable["trans_pop"]();

		var pmComponent:PopMenuComponent = Instantiate(popMenuComp);
		pmComponent.SetPopMenu(curMenu);
		pmComponent.Init();
		pmComponent.menuName = curMenu.menuName;
		curMenu = pmComponent;

		priv_PushMenu(curMenu);
		curMenu.SetVisible(true);
		curMenu.SetDisabled(false);
		curMenu.transition = transition;
		curTransition = transition;

		state = MENUSTATE.FadeIn;
		curMenu.OnPush(null);
		curTransition.StartTrans(oldMenu, curMenu);
		curTransition.SetStartPos(Vector2.zero);
		curTransition.FadeinUpdate();
	}

	public function getEventDoneDialog():EventDoneDialog
	{
		return EventDonePopup;
	}
	public function PushEventDoneDialog(param:Object)
	{
		priv_pushEventDoneDialog(param);
	}
	private function priv_pushEventDoneDialog(param : Object)
	{
		if( curMenu == EventDonePopup )
			return;
		//if in worldmap level, close tile popup info
		GameMain.instance().hideTileInfoPopup();

		//EventDonePopup.SetAction(strContent,titleContent, okFunc, cancelFunc);

		var oldMenu : KBNMenu = curMenu;
		if(curMenu)
		{
			curMenu.SetDisabled(true);
		}

		while( state != MENUSTATE.Show )
		{
			yield;
		}

		curMenu = EventDonePopup;

		var transition : Transition_ZoomComponent = new Transition_ZoomComponent();

		curMenu.transition = transitionTable["trans_pop"]();

		var pmComponent:PopMenuComponent = Instantiate(popMenuComp);
		pmComponent.SetPopMenu(curMenu);
		pmComponent.Init();
		pmComponent.menuName = curMenu.menuName;
		curMenu = pmComponent;

		priv_PushMenu(curMenu);
		curMenu.SetVisible(true);
		curMenu.SetDisabled(false);
		curMenu.transition = transition;
		curTransition = transition;

		state = MENUSTATE.FadeIn;
		curMenu.OnPush(param);
		curTransition.StartTrans(oldMenu, curMenu);
		curTransition.SetStartPos(Vector2.zero);
		curTransition.FadeinUpdate();

	}

	/*
	public function PushUpgrade(strContent:String,titleContent:String,okFunc:Function, cancelFunc:Function)
	{
		if( curMenu == confirmDialog )
		{
			PopMenu("");
		}
		while( state != MENUSTATE.Show )
		{
			yield;
		}
		//if in worldmap level, close tile popup info
		GameMain.instance().hideTileInfoPopup();

		confirmDialog.SetAction(strContent,titleContent, okFunc, cancelFunc);

		var oldMenu : KBNMenu = curMenu;
		if(curMenu)
		{
			curMenu.SetDisabled(true);
		}
		curMenu = confirmDialog;
		priv_PushMenu(confirmDialog);
		curMenu.SetVisible(true);
		curMenu.SetDisabled(false);
		curMenu.transition = transitionTable["trans_pop"];
		curTransition = curMenu.transition;
		curTransition.StartTrans(oldMenu, curMenu);
		curMenu.OnPush(null);
		state = MENUSTATE.FadeIn;
		curTransition.FadeinUpdate();
	}
	//*/

	//special for testing world
	public	function PushPaymentMenu(){
		Payment.instance().PushPaymentMenu(Constant.PaymentBI.BuyOpen);
	}
	public	function PushPaymentMenu(biType:int){
		Payment.instance().PushPaymentMenu(biType);
	}

	public function GetCurMenu() : KBNMenu
	{
		return curMenu;
	}

	public function GetCurMenuName():String
	{
		if(curMenu == null)
		{
			return "";
		}
		return curMenu.menuName;
	}

	public function SetCurVisible(active:boolean){
		if(GetCurMenu()!=null){
			GetCurMenu().SetVisible(active);
			// GetCurMenu().SetDisabled(active);
		}	

		if (MenuMgr.instance.getMenu("PveMainChromMenu") != null)
		{
			var avamenu : KBNMenu = MenuMgr.instance.getMenu("PveMainChromMenu");
			avamenu.SetVisible(active);
			//avamenu.SetDisabled(active);
		}

		if (MenuMgr.instance.getMenu("MainChrom") != null)
		{
			var mainmenu : KBNMenu = MenuMgr.instance.getMenu("MainChrom");
			mainmenu.SetVisible(active);
			//mainmenu.SetDisabled(active);
		}
		
	}

	// Update is called once per frame
	function Update () {
		if (!instance) { /*has been freeed*/
			return;
		}

		GearNet.Instance().Update();
		GUIAnimationManager.Instance().Update();
		passTime += Time.deltaTime;
		frame++;
		frameRate = frame/passTime;
		//for android backbutton
		if((RuntimePlatform.Android == Application.platform || RuntimePlatform.OSXEditor == Application.platform)
				&& Input.GetKeyDown(KeyCode.Escape) && backTime >= 0.2f)
		{
			UpdateAndroidBackKey();
			backTime = 0.0f;
		}
		
		KBN.FTEMgr.getInstance().Update();
		PopupMgr.getInstance().update();

		if (NewFteMgr.Instance() && !NewFteMgr.Instance().IsAllFteCompleted)
		{
			NewFteMgr.Instance().Update();
		}
		if(bNetBlock)
		{
			netConnectMenu.Update();
			return;
		}

		if( KBN.FTEMgr.getInstance().isForbiddenMenuMgrEvent || NewFteMgr.Instance().IsForbidMenuEvent)
		{
			if(curMenu == MainChrom || (curMenu instanceof SpeedUpMenu) || curMenu instanceof MaintainanceChatMenu)
			{
				curMenu.Update();	// for progress bar. update ..
			}
			floatMessage.Update();
		
			if( scenceMessage ){
				scenceMessage.Update();
			}
			return;
		}

		if(ErrorMgr.instance().IsShowError() )
			return;
       // //ProfilerSample.BeginSample("MenuMgr.Update  (menuStack[menuStack.length - 1] as KBNMenu).Update();");
		if( state == MENUSTATE.Show && menuStack.length > 0)
			(menuStack[menuStack.length - 1] as KBNMenu).Update();

        ////ProfilerSample.EndSample();
//		_Global.Log("fps:"+frameRate);
//		_Global.Log("update time:"+Time.deltaTime);
		floatMessage.Update();
		if( scenceMessage ){
			scenceMessage.Update();
		}
		ChatNotices.instance().Update(Time.deltaTime);
	}
	function Top() : KBNMenu
	{
		if( menuStack.length > 0 )
			return menuStack[menuStack.length - 1];
		return null;
	}
	
	function UpdateAndroidBackKey()
	{
		if (instance == null || androidBackEnable == false) return;
		if (RuntimePlatform.Android != Application.platform && RuntimePlatform.OSXEditor != Application.platform) return;
		if (bNetBlock) return;
		if (!KBN.FTEMgr.isCurrentCompleteFTE()) return;
		if (state != MENUSTATE.Show) return;
		if (RuntimePlatform.OSXEditor == Application.platform) {
			if (!Input.GetKey(KeyCode.Escape)) {
				return;
			}
		} else {
			if (NativeCaller.OnBackButtonPressed()) {
				return;
			}
		}


		var top : KBNMenu = Top();
		if (ErrorMgr.instance().IsShow())
		{
			if(ErrorMgr.instance().m_errorDialog != null )
			{
				if(ErrorMgr.instance().m_errorDialog.IsCloseVisible())
				{
					ErrorMgr.instance().m_errorDialog.OnCloseClick();
				}
			}
			//do nothing.
		}
		else if (GetCurMenuName() == "MonsterMenu"||
			GetCurMenuName()=="WheelGameChestPopMenu"||
			GetCurMenuName()=="GambleChestPopMenu"||
			GetCurMenuName() == "WheelGameMenu") {
			/*do nothing.*/
		}
		else if(this.menuStack.length > 1 && curMenu != null 
			&& GetCurMenuName() != "AvaMainChrome" 
			&& GetCurMenuName() != "PveMainChromMenu")
		{
			//if the menu has submenu
			//pop up the submenu

			if(!top.OnBackButton())
			{
				this.PopMenu("");

			}
		}
		else if (this.menuStack.length > 0 && curMenu != null)
		{

			var tilePopup:TileInfoPopUp = GameMain.instance().GetTileInfoPopup();
			var tilePopup2:TileInfoPopUp = GameMain.instance().GetTileInfoPopup2();
			if( tilePopup != null && tilePopup.IsDisplaying())
			{
				if(tilePopup.getmyNacigator() != null && tilePopup.getmyNacigator().uiNumbers>1)
				{
					tilePopup.getmyNacigator().pop();
				}
				else
				{
	    			GameMain.instance().hideTileInfoPopup();
	    		}
	    	}
	    	else if( tilePopup2 != null && tilePopup2.IsDisplaying())
	    	{
				if(tilePopup2.getmyNacigator() != null && tilePopup2.getmyNacigator().uiNumbers>1)
				{
					tilePopup2.getmyNacigator().pop();
				}
				else
				{
	    			GameMain.instance().hideTileInfoPopup2();
	    		}
	    	}
			else if(top.menuName == "MaintainanceChatMenu")
			{
				top.OnBackButton();
			}
			else
			{

				//back to home.
				PushQuitGameConfirmDailog();
			}
		}
		else
		{
			//do not response.
		}
	}
	private function Quit():void
	{
		Application.Quit();
	}

	var backTime:double = 0.2f;

    function OnGUI () {
		GUI.depth = 1;/*oldDepth - 1;*/
		backTime += Time.deltaTime;

		if (GameMain.singleton != null && GameMain.singleton.NotDrawMenu)
			return;

		/*if((RuntimePlatform.Android == Application.platform || RuntimePlatform.OSXEditor == Application.platform)
				&& Input.GetKeyDown(KeyCode.Escape) && backTime >= 0.2f)
		{
			UpdateAndroidBackKey();
			backTime = 0.0f;
		}*/

		for (var menuNeedPopOver: KBNMenu in m_needOnPopOverMenu)
    	{
    		menuNeedPopOver.OnPopOver();
		}

    	m_needOnPopOverMenu.Clear();
    	if(curTransition != null && curTransition.IsFin())
			GestureManager.Instance().Draw();

		_Global.setGUIMatrix();

		if( !instance ){ //has been freeed
			if(Event.current.type == EventType.Repaint)
			{
				MainChrom.SetVisible(true);
				MainChrom.Draw();
			}
			return;
		}

//		var toolbarStrings:String[] = ["s", "longlong", "longlonglongaaaaaa"];
//		toolbarInt = GUI.Toolbar (Rect (25, 250, 200, 30), toolbarInt, toolbarStrings);
		if(commonTips){
			commonTips.Update();
		}

		if ((state != MENUSTATE.Show || bNetBlock) && Event.current.type != EventType.Repaint)
			return;

		GUI.skin = mySkin;

		var j:int = menuStack.length - 1;
/**/
		for(; j >= 0 ; j--)
		{
			if(Event.current.type == EventType.Repaint)
			{
				var me : KBNMenu = menuStack[j] as KBNMenu;
				if(me == null) continue;
				if(me.CanBeBottom)// && me != Top())
					break;
			}
		}
		if(j < 0) j = 0;


		for( var i:int=j; i < menuStack.length - 1; i++)
		{
			if(Event.current.type == EventType.Repaint)
		   		(menuStack[i] as KBNMenu).Draw();
		}

		if(menuStack.length > 0)
		{
			do
			{
				// Control the menu event rect when is in fte state
				if (Event.current.type != EventType.Repaint
					&& NewFteMgr.Instance().IsForbidMenuEvent)
				{
					break;
				}

				if( ( !KBN.FTEMgr.getInstance().isForbiddenMenuMgrEvent && !ErrorMgr.instance().IsShowError() )
					|| Event.current.type == EventType.Repaint
					|| (KBN.FTEMgr.getInstance().isForbiddenMenuMgrEvent && PopupMgr.getInstance().getMaintanceFlag()))
				{
					////ProfilerSample.BeginSample("MenuMgr.OnGUI   Draw");
					  (menuStack[menuStack.length - 1] as KBNMenu).Draw();
					////ProfilerSample.EndSample();
				}
			}
			while(false);
		}

		if(popMenu)
			popMenu.Draw();
		if(bNetBlock && !isAvaWaitingLabelVisible)
			netConnectMenu.Draw();
//		ErrorMgr.instance().Draw();

		if(commonTips){
			commonTips.Draw();
		}
		if( scenceMessage ){
			scenceMessage.Draw();
		}
	
		if (floatMessage != null)
		{
			floatMessage.Draw();
		}

		if( instance && !PopupMgr.getInstance().getMaintanceFlag())
		{
			KBN.FTEMgr.getInstance().Draw();
		}

		if (NewFteMgr.Instance() && !NewFteMgr.Instance().IsAllFteCompleted)
		{
			NewFteMgr.Instance().Draw();
		}
	}

	function FixedUpdate()
	{
		if( !instance ){ //has been freeed
			return;
		}

	   if(state == MENUSTATE.FadeIn)
	   {
	   		curTransition.FadeinUpdate();
	   		if( curTransition.IsFin() )
	   		{
	   			state = MENUSTATE.Show;
	   			passTime = 0;
	   			frame = 0;

	   			var tMenu : KBNMenu = (menuStack[menuStack.length - 1] as KBNMenu);
	   			tMenu.PushDone();
	   			tMenu.OnPushOver();

	   			// LiHaojie 2013.09.05: Notify the menu OnPushOver event to other module


				if (menuActionDelegateDic.ContainsKey("OnPushOver")) {
					for (var method: Function in menuActionDelegateDic["OnPushOver"])
					{
						if (method != null)
							method(tMenu);
					}
				}
	   		}
	   }
	   else if(state == MENUSTATE.FadeOut)
	   {
			   curTransition.FadeoutUpdate();
	   		if( curTransition.IsFin() )
	   		{
	   			var strPopMenuName:String = popMenu.menuName;
	   			popMenu.OnPopOver();

	   			// LiHaojie 2013.09.05: Notify the menu OnPushOver event to other module

				if (menuActionDelegateDic.ContainsKey("OnPopOver")) {
					for (var method: Function in menuActionDelegateDic["OnPopOver"])
					{
						if (method != null)
							method(popMenu);
					}
				}

	   			state = MENUSTATE.Show;
	   			unloadMenu( popMenu );
	   			popMenu = null;
	   			passTime = 0;
	   			frame = 0;

	   			if(menuStack.length > 0)
				{
					var backMenu : KBNMenu = (menuStack[menuStack.length - 1] as KBNMenu);
					backMenu.OnBack(strPopMenuName);
				}
	   		}
	   }
	   else if(state == MENUSTATE.Show)
	   {
	   		if( menuStack.length > 0)
				(menuStack[menuStack.length - 1] as KBNMenu).FixedUpdate();
	   }
//	   ErrorMgr.instance().FixedUpdate();
	   floatMessage.FixedUpdate();
	   if( scenceMessage ){
	   		scenceMessage.FixedUpdate();
	   }

	   if (KBN.FTEMgr.getInstance())
	      KBN.FTEMgr.getInstance().FixedUpdate();
	}

	function OnStartBuild(qItem:QueueItem)
	{
		MainChrom.AddBuildProgress(qItem);
	}

	function OnStartMarch(qItem:QueueItem)
	{
		MainChrom.addMarchProgress(qItem);
	}

	function OnAddConqueredWild(qItem:QueueItem)
	{
		MainChrom.AddConqueredWild(qItem);
	}

	function onResearch(qItem:QueueItem):void
	{
		MainChrom.addBuildProgress(qItem);
	}

	function OnTrain()
	{
		if( curMenu == menuArray["BarrackMenu"] )
		{
            MenuAccessor.BarrackMenuSwitchToTrainList(menuArray["BarrackMenu"] as UIObject);
			sendNotification(Constant.Notice.Train, null);
		}else if( curMenu == menuArray["WallMenu"] ){
			sendNotification(Constant.Notice.Train, null);
			(menuArray["WallMenu"] as WallMenu).SwitchToTrainList();
		}
	}

	function UpdateTrainProgress()
	{
		MainChrom.AddTrainProgress();
	}

	function OnDismiss()
	{
		if( curMenu == menuArray["BarrackMenu"] )
		{
            MenuAccessor.BarrackMenuOnDismissOK(menuArray["BarrackMenu"] as UIObject);
		}
	}

	public function GetStackLength():int
	{
		return menuStack.length;
	}

	public function CanTouchMap():boolean
	{


		if (!PrivacyPolicyMenu.IsPrivacyPolicyServiced()) {
			return  false;
		}
		else {
			var showFlg: boolean = false;

			if (menuStack.length <= 1
				|| menuStack.length <= 2 && (hasMenuByName("PveMainChromMenu") || hasMenuByName("AvaMainChrome") || hasMenuByName("MistExpeditionSceneMenu"))) {

				showFlg = true;
			}

			return state == MENUSTATE.Show && showFlg && !bNetBlock && !ErrorMgr.instance().IsShowError() && KBN.FTEMgr.getInstance().isAllowContentTouch;
		}

	}


	public function UpdateData()
	{
		for( var i:int=0; i < menuStack.length; i++)
		{
		   (menuStack[i] as KBNMenu).UpdateData();
		}
	}



	/* MVCmethod */
	public function sendNotification(type:String,body:Object):void
	{
		sendNotification({"type":type,"body":body});
	}
	public function sendNotification(note:Object):void
	{
		
		var menu : KBNMenu;

		for(var i:int=0; i<menuStack.length; i++)
		{
			menu = menuStack[i];
			menu.handleNotification(note);
		}
	}

	public function PushMessage(msg:String, position:Rect)
	{
		floatMessage.StartShow(msg, position, 2.0);
	}

	public function PushMessage(msg:String)
	{
		var position:Rect = Rect(0, 800, 640, 160);
		floatMessage.StartShow(msg, position, 2.0);
	}

	public function PushMessage(msg:String, showTime:float, showImage:boolean)
	{
		var position:Rect = Rect(0, 800, 640, 160);
		floatMessage.StartShow(msg, position, showTime, showImage);
	}
	public	function PushMessage( msg:String, startPosition:Rect, endPosition:Rect )
	{
		floatMessage.StartShow( msg, startPosition, endPosition, 2.0, false, true);
	}

	public	function PushScenceMessage( msg:String, startPosition:Rect, endPosition:Rect )
	{
		scenceMessage.StartShow( msg, startPosition, endPosition, 2.0, false, true);
	}

    public function PushMessage(msg : String, startPosition : Rect, endPosition : Rect,
        showTime : float, withImage : boolean, withSound : boolean)
    {
        floatMessage.StartShow(msg, startPosition, endPosition, showTime, withImage, withSound);
    }

	public function PushQuestRewardMessage(msg:String, questId:int)
	{
		var position:Rect = Rect(0, 800, 640, 160);
		floatMessage.StartShowForQuestReward(msg, position, questId);
	}

    public function PushDailyQuestRewardMessage(msg : String, quest : DailyQuestDataAbstract)
    {
        var position : Rect = Rect(0, 800, 640, 160);
        floatMessage.StartShowForDailyQuestReward(msg, position, quest);
    }

    public function PushMessageWithImage(msg : String, tile : Tile)
    {
        var position:Rect = Rect(0, 800, 640, 160);
        floatMessage.StartShowWithImage(msg, position, tile);
    }

    public function PushMessageWithImage(msg : String, startPosition : Rect, endPosition : Rect, tile : Tile,
        showTime : float, withSound : boolean)
    {
        floatMessage.StartShowWithImage(msg, startPosition, endPosition, tile, showTime, withSound);
	}
	
	public function PushTips(msg:String,Posx:float,Posy:float)
	{
		commonTips.StartShow(msg,Posx,Posy);
	}

//	public function UpdateTransition()
//	{
//	   if(state == MENUSTATE.FadeIn)
//	   {
//	   		curTransition.FadeinUpdate();
//	   		if( curTransition.IsFin() )
//	   		{
//	   			state = MENUSTATE.Show;
//	   			passTime = 0;
//	   			frame = 0;
//	   		}
//	   }
//	   else if(state == MENUSTATE.FadeOut)
//	   {
//	   		curTransition.FadeoutUpdate();
//	   		if( curTransition.IsFin() )
//	   		{
//	   			state = MENUSTATE.Show;
//	   			popMenu = null;
//	   			passTime = 0;
//	   			frame = 0;
//	   		}
//	   }
//
//	}
	function OnDestroy () : void
	{
		KChatBarMgr.closeChatBar();
	}

	// Temp for C# conversion. TODO: Remove when possible
	function ClearAllianceChatInfo() : void {
        Chat.ClearAllianceChatInfo();
	}

	// Temp for C# conversion. TODO: Remove when possible
	public function isHitUI(pos:Vector2) : boolean {
		var pveMainChrom:PveMainChromMenu = getMenu("PveMainChromMenu") as PveMainChromMenu;
		if ( pveMainChrom!=null && pveMainChrom.isHitUI(Input.mousePosition) )
			return true;
		var avaMainChrome:AvaMainChrome = getMenu("AvaMainChrome") as AvaMainChrome;
		if ( avaMainChrome!=null && avaMainChrome.isHitUI(Input.mousePosition) )
			return true;
		return MainChrom.isHitUI(pos);
	}

	// temporary for MapController migration, TODO remove these if possible
	public function setCoordinateBar(x:String, y:String) {
		var bar:CoordinateBar = MainChrom.coordinateBar;
		bar.setXFieldContent(x);
		bar.setYFieldContent(y);
	}
	public function getCoordinateBarHeight():float {
		return MainChrom.CoordingBarHeight;
	}
	public function showSceneMessage(msg:String, startPosition:Rect, endPosition:Rect, showTime:float, showImage:boolean, withSound:boolean){
		scenceMessage.StartShow(msg, startPosition, endPosition, showTime, showImage, withSound);
	}
	public function setSceneMessage(msg:String) {
		scenceMessage.setMessage(msg);
	}
	public function forceFinishSceneMessage() {
		scenceMessage.forceFinish();
	}
	public function setWaitingLabelVisiable(v:boolean) {
		//MainChrom.waitingLabel.SetVisible(v);
		MainChrom.moveMapLoadingLabel.SetVisible(v);
	}
	
	public function mainChromHideAllList() {
		MainChrom.HideAllList();
	}
	public function SetWorldBossInfoVis(show:boolean,bossInfo:Object){
		MainChrom.SetWorldBossInfoVis(show,bossInfo);
	}
	public function GetMainChromeMenu() : KBNMenu
	{
		return MainChrom;
	}
	
	public function GetCoordinateBarRect() : Rect
	{
		return MainChrom.coordinateBar.rect;
	}
	
	public function GetCoordinateBarShowMarchLineBtnRect() : Rect
	{
		return MainChrom.coordinateBar.showMarchLineBtn.rect;
	}
	
	public function GetTopOfferTypeOfMainChrome() : int
	{
		return MainChrom.topOfferType;
	}
	// end temporary MapController
    
    protected function MenuStackIsEmpty() : boolean
    {
        return (menuStack.length <= 0);
    }
    
    public function PushQuitGameConfirmDailog()
    {
    	var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		dialog.setDefaultButtonText();
		var content:String = Datas.getArString("MessagesModal.QuitVerify");
		dialog.setLayout(580,320);
		dialog.setContentRect(70,80,0,100);
		dialog.SetCancelAble(true);
		MenuMgr.getInstance().PushConfirmDialog(content,"",Quit,null);
    }
}
