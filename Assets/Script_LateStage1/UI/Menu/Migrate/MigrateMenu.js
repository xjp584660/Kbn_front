class MigrateMenu extends ComposedMenu implements IEventHandler
{
	class WordData
    {
    	var type:int;
    	var wordId:int;
    	var name:String;
    	var might:String;
    	var level:String;
    	var selected:boolean;
    	var accountStatus:int;
    	var population:int;
    };
	public var scroll:ScrollList;
	private var langData:Array;
	private var wordDateList:Array;
	public var backLabel:Label;
	public var backLabel2:Label;
	public var infoLabel:Label;
	public var mTitle:Label;
	public var smallTitle:Label;
	public var smallTitleBackground:Label;
	public var bigTitleBackground:Label;
	public var time:Label;
	public var frameLabel:SimpleLabel;
	public var subframeLabel : SimpleLabel;
	public var line:Label;
	public var nextBtn:Button;
	public var infoBtn:Button;
	private var backRect:Rect;
	public var animClipRect:Rect;
	public var settingContent:ComposedUIObj;
//	public var aboutMenu:About;
	
	public var condition:MigrateCondition;
	public var comparedRoleInfo:MigrateComparedRoleInfo;
	public  var langTemplate:LanguageItem;
	public var wardItem:MigrateWordItem;
	private var selectWordData:WordData;
	private var needItemCount:int;
	private var migrateTime:long;
	private var timmer:float;
	private var isCoverSwitch:boolean;
	
	public var CloseCallback:System.Action = null;
    
    private enum RedeemInviteCodeStatus
    {
        Unknown,
        EntranceVisible,
        EntranceInvisible
    }
    
    private var redeemInviteCodeStatus : RedeemInviteCodeStatus = RedeemInviteCodeStatus.Unknown;
            	
	function Init()
	{
		super.Init();
		condition.Init();
		comparedRoleInfo.Init();
		langData = new Array();
		wordDateList=new Array();
		scroll.itemDelegate = this;
		scroll.Init( wardItem );
		
		if(KBN._Global.IsLargeResolution ())
		{
			scroll.rect = new Rect(0,225,640,502);		
		}
		else
		{
			scroll.rect = new Rect(0,215,640,502);				
		}
		time.SetVisible(false);
		mTitle.txt=Datas.getArString("Migrate.ChooseServer_Title");
		smallTitle.txt = Datas.getArString("Migrate.ChooseServer_Servers");
		infoLabel.txt=Datas.getArString("Migrate.ChooseServer_Text");
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		var borderX:int = 8;
		var borderY:int = 11;
		//btnClose.rect = Rect(rect.width - 100 - borderX, 0, 100 + borderX, 100 + borderY);
//		btnClose.mystyle.overflow.left = btnClose.mystyle.normal.background.width - 100;
//		btnClose.mystyle.overflow.bottom = btnClose.mystyle.normal.background.height  - 100;
//		btnClose.mystyle.overflow.top =  -borderY;
//		btnClose.mystyle.overflow.right =  - borderX;
		line.setBackground("between line", TextureType.DECORATION);
		
		hasOpenedGamble = false;
		
		frameLabel.Sys_Constructor();
		frameLabel.mystyle.border = new RectOffset(68, 68, 68, 68);
		//frameLabel.rect = new Rect(0, 0, rect.width + 2, rect.height);
		frameLabel.useTile = true;
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");
		btnClose.OnClick = CloseMenu;

		//create background texture
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		repeatTimes = -6;
		backRect = Rect( 5, 5, rect.width, rect.height - 10);
		
		if (animClipRect.width <= 0 || animClipRect.height <= 0)
		{
			animClipRect = Rect(10, 0, rect.width, rect.height);
		}
//		title.txt = Datas.getArString("Common.Migrate");
//		m_color = new Color(1,1,1,1);
		
		
		
		tabArray = [settingContent];
		nextBtn.txt=Datas.getArString("Migrate.ChooseServer_ButtonChoose");
        nextBtn.OnClick = OnNext;
        infoBtn.OnClick=OnInfo;
//        nextBtn.changeToGrey();
       

	}
    function getSelectServeId():int
    {
    	if(selectWordData!=null) return selectWordData.wordId;
    	else return 0;
    }
    
    function setNeedItemCount(count:int)
    {
    	needItemCount=count;
    }
    
    function getNeedItemCount():int
    {
    	return needItemCount;
    }
    
    function getMigrateTime():long
    {
    	return migrateTime;
    }

    function getCoverSwitch():boolean
    {
    	return isCoverSwitch;
    }
  
	function getWordrList(param:Object)
	{
		var result : HashObject = param as HashObject;
//		var okFunc:Function = function(result:HashObject)
//		{
			if (result!=null) {

				var worlds:HashObject = result["worlds"];
				var keys:Array =  _Global.GetObjectKeys(worlds);
				var curData:HashObject;
				wordDateList.Clear();
				for(var i:int =0; i<keys.length; i++)
				{
					curData = worlds[ _Global.ap + i ];
					var wordData:WordData  = new WordData();
					wordData.wordId= _Global.INT32(curData["worldId"]);
					wordData.name=curData["worldName"].Value;
					//wordData.selected=i==0?true:false;
					wordData.accountStatus = _Global.INT32(curData["accountStatus"]);
					if(wordData.accountStatus==1){
						wordData.might=Datas.getArString("Alliance.InviteMight")+_Global.NumSimlify(_Global.INT64(curData["Might"])); //"might:"+ _Global.NumSimlify(_Global.INT64(curData["Might"]));
						wordData.level= Datas.getArString("Alliance.InviteLevel")+curData["Level"].Value;//"level:"+curData["Level"].Value;
					}
					wordData.population = _Global.INT32(curData["population"]);
					wordDateList.push(wordData);
				}
				 
				scroll.Clear();
				wordDateList.Sort(function(a,b){
					var word1:WordData = a as WordData;
					var word2:WordData = b as WordData;
					return word1.wordId - word2.wordId;
				});
				
				if(keys.length>0) 
				{
					nextBtn.changeToBlueNew();
					var tempSelect : WordData = wordDateList[0] as WordData;
					tempSelect.selected=true;
				 	selectWordData=wordDateList[0];
				 	selectWordData.selected=true;
				}
				
				scroll.SetData(wordDateList);
				scroll.ResetPos();
				migrateTime=_Global.INT64(result["migrateTime"]);
				isCoverSwitch=_Global.ToBool(result["coverSwitch"]);
				time.SetVisible(true);
				var timeSurplus : long = migrateTime - GameMain.unixtime();
				time.txt=Datas.getArString("Migrate.ChooseServer_Time",[_Global.timeFormatExceptDate(timeSurplus)]);
//				String.Format("Next migration starts in:------> {0}",_Global.timeFormatExceptDate(timeSurplus));
				UpdateTime();
//				time.txt=String.Format(Datas.getArString("Migrate.ChooseServer_Time"),_Global.timeFormatStr(timeSurplus));

			} else {
			
			}
//		};
//		var curServerId:int=Datas.instance().worldid();
//		var userId:int=GameMain.instance().getUserId();
//		UnityNet.GetMigrateWords(curServerId,userId, okFunc, null);
		
	}
	
	function wordListSort(){
	
	}
    function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}

    private function RefreshLayout()
    {   
        scroll.AutoLayout();
        scroll.MoveToTop();
    }
    
	function OnPush( param:Object )
	{
		super.OnPush(param);
//        RefreshLayout();
        showIphoneXFrame=false;
		while(curState != State.Normal)
		{
			UpdateTransition();
		}
		curState = State.Normal;
		
		PlayModalOpen();
		
		//repeatTimes = 43;
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);
		getWordrList(param);
		if(!PlayerPrefs.HasKey(GameMain.instance().getUserId()+"migrateGuid"))
			{
				MenuMgr.getInstance().PushMenu("CarmotIntroDialog",{"type":1},"trans_pop");
			}			
	
	}

	private var hasOpenedGamble:boolean = false;
	
	public function OnPop():void
	{
		super.OnPop();
		//pushMenu.OnPop();
		subMenuStack.Clear();
	}
	
	public	function	OnPopOver(){
		super.OnPopOver();
		scroll.Clear();
	}
	
	protected function prot_OnSubMenuTransFin(menu : SubMenu, isPush : boolean)
	{
		if ( !isPush && (menu as MigrateCondition) != null )
		{
			menu.OnPopOver();
		}
	}
	
	public function DrawTitle()
	{
		frameLabel.Draw();	
		btnClose.Draw();		
	}
	
	function DrawItem()
	{ 		
		GUI.BeginGroup(animClipRect);
		super.DrawItem();
		GUI.EndGroup();
	}
	
	protected function DrawSubMenu()
	{
		GUI.BeginGroup(animClipRect);
		super.DrawSubMenu();
		GUI.EndGroup();
	}
	
	public function PushSubMenu(menu:SubMenu, param:Object)
	{
		menu.rect.x = -animClipRect.x;
		super.PushSubMenu(menu, param);
	}
	
	private function SetNotification(bPush:boolean)
	{
		Datas.instance().setPushNotification(bPush);
	}
	
	
	
	public function CloseMenu(param:Object)
	{
		if(subMenuStack.Count > 0)
		{
//			if(subMenuStack[subMenuStack.Count - 1] == kabamIdMenu)
//			{
//				UnityNet.SendKabamBI(KabamId.BIPosition, 2);
//			}
//			else if(subMenuStack[subMenuStack.Count - 1] == creatKabamIdMenu)
//			{
//				UnityNet.SendKabamBI(KabamId.BIPosition, 302);
//			}
//			else if(subMenuStack[subMenuStack.Count - 1] == login)
//			{
//				UnityNet.SendKabamBI(KabamId.BIPosition, 402);
//			}
		}
		MenuMgr.getInstance().PopMenu("");
		
	}
	
	function Update()
	{
		super.Update();
		scroll.Update();
		UpdateTime();
	}
	
	function UpdateTime(){
		if(migrateTime <= 0) return;
		timmer+=Time.deltaTime;
		if(timmer>=60){
			var timeSurplus : long = migrateTime - GameMain.unixtime();
			if(timeSurplus<0){
				timeSurplus=0;
			}//Migrate^ChooseServer_Time:Next migration starts in: {1}
			timmer=0;
//			time.txt=String.Format("Next migration starts in:------> {0}",_Global.timeFormatExceptDate(timeSurplus));
			time.txt=Datas.getArString("Migrate.ChooseServer_Time",[_Global.timeFormatExceptDate(timeSurplus)]);
		}
		
	}
	private function OnNext(param:Object)
	{
		OpenAbout(param);
	}
	private function OnInfo(param:Object)
	{
		
		MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "migrate", "trans_zoomComp");
//		MenuMgr.getInstance().PopMenu("");
	}
	
	public function OnBackButton() : boolean
	{
		return false;
	}
	
	private function OpenAbout(param:Object)
	{
		if(isCoverSwitch)
		{
			if(selectWordData.accountStatus == 1)
			{
				OpenComparedRoleInfoMenu();
			}
			else
			{
				OpenConditionMenu();
			}
		}
		else
		{
			OpenConditionMenu();
		}
	}

	private function OpenComparedRoleInfoMenu()
	{
		var okFunc:Function = function(result:HashObject)
		{
			PushSubMenu(comparedRoleInfo, result);
		};
		
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		
		var selectServerId:int=getSelectServeId();
		UnityNet.GetComparedMigrateRoleInfo(selectServerId, okFunc, errorFunc);
	}

	public function OpenConditionMenu()
	{
		var okFunc:Function = function(result:HashObject)
		{
			PushSubMenu(condition, result);
		};
		
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		
		var selectServerId:int=getSelectServeId();
		UnityNet.GetMigrateConditions(selectServerId, okFunc, errorFunc);
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
			switch(action)
			{
			case Constant.Action.PROVINCE_SELECT:

			 if(selectWordData!=null){
			 	if(selectWordData.selected) selectWordData.selected=false;
			 	
			 }
			 selectWordData=param;
			 selectWordData.selected=true;
			break;
			

			}	
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.MigrateLeftPage : 
				condition.roleInfo.ChangePage(-1);
				break;
			case Constant.Notice.MigrateRightPage : 
				condition.roleInfo.ChangePage(1);
				break;
		}							
	}

}
