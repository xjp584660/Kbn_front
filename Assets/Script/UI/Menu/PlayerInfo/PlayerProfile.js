class UserDetailInfo
{	
	public	var userId:String = "";
	public	var	userName:String = "";
	public	var	userLevel:String = "";
	public	var	might:String = "";
	public	var	allianceName:String = "";
	public	var	allianceDip:String = "";
	public  var allianceEmblem:AllianceEmblemData = null;
	public	var	desc:String = "";
	public  var allianceId:String = "0";
	public  var avatar:String = "";
	public  var avatarFrame:String = "";
	public  var badge:String = "";
	public  var kills:String="";
	public  var rank:String="";
	public  var bestKnight:String="";
	
	public	var viewFrom:String = "";
	
	public static var ViewFromChat = "ChatMenu";
	public static var ViewFromLeaderBoard = "LeaderBoardMenu";
	public static var ViewFromMail:String = "Mail";
	public static var ViewFromTilePopUp:String = "TolePopup";
	public static var ViewFromOne2OneChat = "PrivateDetail";
	
	
	public	function	reset(){
		userId = "";
		userName = "";
		userLevel = "";
		might = "";
		allianceId = "0";
		allianceName = "";
		allianceDip = "";
		desc = "";
		viewFrom = "";
		avatar = "";
		avatarFrame = "";
		badge = "";
		kills="";
		rank="";
		bestKnight="";
	}
}

class PlayerProfile extends PopMenu
{
	public static var  waitingUserId:int = 0;
	public var  avatar:SimpleLabel;
	public var  avatarFrame:SimpleLabel;
	public var  playerName:Label;
	public var  level:Label;
	public var  power:Label;
	//yyyyy
	public var  kills:Label;
	public var  rank:Label;
	public var  bestKnight:Label;
	public var leagueLevel:Label;
	
	public var btnAlliance1Name:Label;
	public var btnAlliance1:Button;
	
	public var lbFrameCombat:SimpleLabel;

	public var mCombatScrollList:ScrollList;
	public var mCombatItem:ListItem;
 	public var mCombatArray:Array;

	//yyyyy
	public var  allianceName:Label;
	public var  allianceDiplomacy:Label;
	public var  allianceEmblem:AllianceEmblem;
	public var  badge:SimpleLabel;
	public var  badgeDesc:SimpleLabel;
	public var  btnMail:Button;
	
	public var line1:SimpleLabel;
	public var line2:SimpleLabel;
	public var lbFrame:SimpleLabel;
	
	/*buttons for chatpopup userprofile*/
	public var btnMarch:SimpleButton;
	public var btnWhisper:SimpleButton;
	public var btnEmail:SimpleButton;
	public var btnAlliance:SimpleButton;
	public var btnIgnore:SimpleButton;
	
	public var btnReport:SimpleButton;
	public var btnInvite:SimpleButton;
	
	/*loading label*/
	public var waitingLabel:LoadingLabel;
	
	public var minBadgeWidth : int;
	
	public static var bNum : boolean;
	private static var instance:PlayerProfile = null;
	public static function GetInstance():PlayerProfile
	{
		if(!instance)
		{
			instance = new PlayerProfile();
		}
		
		return instance;
	}
	
	public function Init(){
		super.Init();
		waitingLabel.rect = new Rect(240,200,128, 128);
		waitingLabel.Init();
		
		btnAlliance.rect.x = 53;
		btnAlliance.rect.y = 725;
		btnAlliance.rect.width = 225;
		
		btnEmail.rect.x = 310;
		btnEmail.rect.y = 725;
		btnEmail.rect.width = 225;
		
		btnIgnore.rect.x = 48;
		btnIgnore.rect.y = 785;
		btnIgnore.rect.width = 225;
		
		btnReport.rect.x = 310;
		btnReport.rect.y = 785;
		btnReport.rect.width = 225;
		
		mCombatArray = new Array();
		mCombatScrollList.Init(mCombatItem);
			
		line2.setBackground("between line", TextureType.DECORATION);
		lbFrame.setBackground("Quest_kuang", TextureType.DECORATION);
		lbFrameCombat.setBackground("Quest_kuang", TextureType.DECORATION);
		

		btnMail.setNorAndActBG("button_mail_normal", "button_mail_down");
		
		avatar.useTile = true;
		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile("player_avatar_default");
		avatarFrame.useTile = false;
		badge.SetVisible(false);
		badgeDesc.SetVisible(false);
		
		avatar.inScreenAspect = !_Global.IsFitLogicScreen();
		avatar.lockWidthInAspect = _Global.IsTallerThanLogicScreen();
		avatar.lockHeightInAspect = _Global.IsShorterThanLogicScreen();
		avatarFrame.inScreenAspect = !_Global.IsFitLogicScreen();
		avatarFrame.lockWidthInAspect = _Global.IsTallerThanLogicScreen();
		avatarFrame.lockHeightInAspect = _Global.IsShorterThanLogicScreen();
		
		allianceEmblem.SetVisible(false);
		
		
		var globalCombatStats:int = GameMain.instance().GetCombatStats();
		if(globalCombatStats==1)
		{
			SetCombatStatsVisible(true);
		
		}
		else
		{
			SetCombatStatsVisible(false);
		}
		
	}
	
	function DrawItem()
	{
		lbFrame.Draw();
		lbFrameCombat.Draw();
		avatar.Draw();
		avatarFrame.Draw();	
		playerName.Draw();
		level.Draw();
		power.Draw();
		//yyyyy
		kills.Draw();
		rank.Draw();
		bestKnight.Draw();
		leagueLevel.Draw();
		btnAlliance1Name.Draw();
		btnAlliance1.Draw();
		mCombatScrollList.Draw();
		

		allianceDiplomacy.Draw();
		//allianceEmblem.Draw();
		badge.Draw();
		badgeDesc.Draw();
		
		line2.Draw();
		if(g_waitingDetail == true)
		{
			btnMarch.Draw();
			btnWhisper.Draw();
			btnEmail.Draw();
			//btnAlliance.Draw();
			btnIgnore.Draw();
			btnReport.Draw();
			//waitingLabel.Draw();
		}
		btnInvite.Draw();
		if(!g_hasEmailMenu)
		{
			btnMail.Draw();	
		}
		
	}
	
	private var g_hasEmailMenu:boolean;
	private var g_waitingDetail = false;
	private var userInfo:UserDetailInfo;
	function OnPush(param:Object)
	{
		repeatTimes = 47;
		
		var globalCombatStats:int = GameMain.instance().GetCombatStats();
		if(globalCombatStats==1)
		{
			SetCombatStatsVisible(true);
		
		}
		else
		{
			SetCombatStatsVisible(false);
		}
		
	
		ChatMenu.getInstance().InputBoxKeyboard_OnOut();
		
		var cityId:int;
//		var _arString = Datas.instance().arStrings();
		userInfo = param as UserDetailInfo;
		g_waitingDetail = (userInfo.viewFrom == UserDetailInfo.ViewFromChat || userInfo.viewFrom == UserDetailInfo.ViewFromLeaderBoard || userInfo.viewFrom == UserDetailInfo.ViewFromOne2OneChat);

		
//			if(userInfo.viewFrom == UserDetailInfo.ViewFromTilePopUp)
//			{
//			}
//			playerName.txt = userInfo.userName;
//            var mightStr = userInfo.might;
//            try
//            {
//                mightStr = _Global.NumFormat(Convert.ToInt64(userInfo.might));
//            }
//            catch (e : System.Exception)
//            {
//                // Do nothing
//            }
//			power.txt = Datas.getArString("MainChrome.MightInfo_Title") + ": " + mightStr;
//			//kills.txt = Datas.getArString("MainChrome.Kills_Title") + ": " + _Global.NumFormat(Convert.ToInt64(userInfo.kills));
//			//rank.txt = Datas.getArString("Rank.CampaignRank_Tex1") + ": " + _Global.NumFormat(Convert.ToInt64(userInfo.rank));
//			//bestKnight.txt = Datas.getArString("MainChrome.bestKnight_Title") + ": " + _Global.NumFormat(Convert.ToInt64(userInfo.bestKnight));
//			
//			
//		
//			level.txt = Datas.getArString("MainChrome.LevelInfo_Title")  + ": " +  userInfo.userLevel;
//			allianceName.txt =  Datas.getArString("ShowCreateAlliance.AllianceName") + ": " + userInfo.allianceName;
//	
//			allianceDiplomacy.txt = Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": " + userInfo.allianceDip;
//			title.txt = Datas.getArString("Common.PlayerProfile_Tilte");
//			
			if (!String.IsNullOrEmpty(userInfo.avatar)) {
				avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(userInfo.avatar));
				if(userInfo.avatarFrame != "img0"){
					avatarFrame.useTile = true;
					avatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(userInfo.avatarFrame);
				}
				else
				{
					avatarFrame.useTile = false;
				}
			}

//			if (!String.IsNullOrEmpty(userInfo.badge)) {
//				badge.useTile = true;
//				badge.tile = TextureMgr.instance().ElseIconSpt().GetTile(userInfo.badge);
//				badgeDesc.txt = Datas.getArString("Badge." + userInfo.badge);
//		  		badgeDesc.SetFont();
//				var badgeSize : Vector2 = badgeDesc.mystyle.CalcSize(new GUIContent(badgeDesc.txt));
//				if (badgeSize.x < minBadgeWidth)
//					badgeSize.x = minBadgeWidth;
//				badgeDesc.rect = new Rect(lbFrame.rect.xMax - badgeSize.x - 6, badgeDesc.rect.y, badgeSize.x, badgeSize.y);
//				badge.rect.x = badgeDesc.rect.x + (badgeDesc.rect.width - badge.rect.width) / 2;
//				badge.SetVisible(true);
//				badgeDesc.SetVisible(true);
//				playerName.txt = _Global.GUIClipToWidth(playerName.mystyle, playerName.txt, (badgeDesc.rect.x - playerName.rect.x), "...", null);
//			} else {
//				badge.SetVisible(false);
//				badgeDesc.SetVisible(false);
//			}
//			
//			allianceEmblem.Data = userInfo.allianceEmblem;
//			ShowAllianceEmblem(null != userInfo.allianceEmblem && !userInfo.allianceEmblem.IsEmpty);
//			
//			btnClose.OnClick =  function(param:Object)
//			{
//				MenuMgr.getInstance().PopMenu("");
//			};
//			
//			g_hasEmailMenu = MenuMgr.getInstance().hasMenuByName("EmailMenu");
//			
//			btnMail.clickParam = param;
//			btnMail.OnClick =  function(p:Object)
//			{
//				var _obj:Object = {"subMenu":"compose", "name":(param as UserDetailInfo).userName};
//				MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
//			};
//			
//			btnMail.visible = true;
//			
//			btnInvite.SetVisibleXYWidth(144, 725, 305, true);			
//			SetOneBtnAtChat();
//		}
//		else
//		{
			if(MenuMgr.getInstance().Chat.getChatType() 
				&& (userInfo.viewFrom == UserDetailInfo.ViewFromChat || userInfo.viewFrom == UserDetailInfo.ViewFromOne2OneChat)
				)
			{
				SetAllianceFiveBtnAtMap();
			
//				btnWhisper.rect.x = 310;
//				btnWhisper.rect.y = 425;
//				btnWhisper.rect.width = 225;
//		
//				btnMarch.rect.x = 53;
//				btnMarch.rect.y = 425;
//				btnMarch.rect.width = 225;
//				
//				btnEmail.rect.x = 310;
//				btnEmail.rect.y = 725;
//				btnEmail.rect.width = 225;
//				btnInvite.SetVisible(false);
//				
//				btnAlliance.rect.x = 53;
//				btnAlliance.rect.y = 725;
//				btnAlliance.rect.width = 225;
				
//				btnMarch.SetVisible(true);
//				btnWhisper.SetVisible(true);
//				btnEmail.SetVisible(true);
//				btnAlliance.SetVisible(true);
//				btnIgnore.SetVisible(true);
//				btnReport.SetVisible(true);
//				btnMail.SetVisible(false);
				
				if (userInfo.viewFrom == UserDetailInfo.ViewFromChat)
				{
					btnAlliance.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
					btnAlliance.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
					btnWhisper.EnableBlueButton(true);
				}
				else if (userInfo.viewFrom == UserDetailInfo.ViewFromOne2OneChat)
				{
					btnWhisper.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
					btnWhisper.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
					btnWhisper.EnableBlueButton(false);
				}
				
			}
			else if(userInfo.viewFrom == UserDetailInfo.ViewFromChat
				|| userInfo.viewFrom == UserDetailInfo.ViewFromOne2OneChat)
			{
				SetFiveBtnAtMap();
				
				if (userInfo.viewFrom == UserDetailInfo.ViewFromChat)
				{
					btnAlliance.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
					btnAlliance.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
					btnWhisper.EnableBlueButton(true);
				}
				else if (userInfo.viewFrom == UserDetailInfo.ViewFromOne2OneChat)
				{
					btnWhisper.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
					btnWhisper.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
					btnWhisper.EnableBlueButton(false);
				}
			}
			else
			{
				SetTwoBtnAtRank();	
			
			}

			PlayerProfile.waitingUserId = _Global.INT32(userInfo.userId);
			title.txt = Datas.getArString("Common.PlayerProfile_Tilte");
			g_hasEmailMenu = false;
			//buttons
			
			btnMarch.txt = Datas.getArString("Common.March");
			btnWhisper.txt = Datas.getArString("Common.Whisper");
			btnEmail.txt = Datas.getArString("Common.SendMessage");
			btnAlliance.txt = Datas.getArString("Embassy.ViewAlliance");
			btnIgnore.txt = Datas.getArString("Common.Ignore");
			btnReport.txt = Datas.getArString("Common.ReportAbusive");
			
			btnMarch.OnClick = handleMarchClick;
			
			btnEmail.clickParam = param;
			btnEmail.OnClick = function(args:Object)
			{
				var _obj:Object = {"subMenu":"compose", "name":(args as UserDetailInfo).userName};
				MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
			};
			btnEmail.EnableBlueButton(Datas.instance().tvuid() != userInfo.userId);
			btnIgnore.clickParam = param;
			btnIgnore.OnClick = function(args:Object){
				var ignoreUserid:int = _Global.INT32((args as UserDetailInfo).userId);
				ChatMenu.getInstance().ignoreUser(ignoreUserid, (args as UserDetailInfo).userName, resultFunc);
			};
			
			btnReport.clickParam = param;
			btnReport.OnClick = function(args:Object){
				var reportUserId:int = _Global.INT32((args as UserDetailInfo).userId);
				ChatMenu.getInstance().reportUser(reportUserId,0,0);
			};
			
			if(_Global.INT32(userInfo.allianceId) > 0)
			{
				btnAlliance.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
				btnAlliance.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
				btnAlliance.clickParam = param;
				btnAlliance.OnClick = function(args:Object){
					var allianceInfoParams:Hashtable = {"allianceId":(args as UserDetailInfo).allianceId};
					MenuMgr.getInstance().PushMenu("AllianceInfoPopup", allianceInfoParams);
				};
			}
			else
			{
				btnAlliance.OnClick = function(args:Object){
					//btn alliance will do nothing
				};
				//can't be down
				btnAlliance.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
				btnAlliance.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
				btnAlliance.EnableBlueButton(userInfo.allianceId != 0);
			}
			
			btnWhisper.clickParam = param;
			btnWhisper.OnClick = function(args:Object)
			{
				var chatUserName:String = (args as UserDetailInfo).userName;
				MenuMgr.getInstance().PopMenu("");
				ChatMenu.getInstance().activeKeyboard(chatUserName);
			};
				
			waitingLabel.visible = true;
			
			level.txt = Datas.getArString("MainChrome.LevelInfo_Title")  + ": ";
			power.txt = Datas.getArString("MainChrome.MightInfo_Title") + ": ";
			allianceName.txt =  Datas.getArString("ShowCreateAlliance.AllianceName") + ": ";

			allianceDiplomacy.txt = Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": ";
			playerName.txt = "";
			badge.SetVisible(false);
			badgeDesc.SetVisible(false);
		if(g_waitingDetail == false)
		{
		
			SetOneBtnAtChat();
			btnMail.clickParam = param;
			btnMail.OnClick =  function(p:Object)
			{
				var _obj:Object = {"subMenu":"compose", "name":(param as UserDetailInfo).userName};
				MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
			};
		}
			UnityNet.GetUserInformation(_Global.INT32(userInfo.userId),okFunc,errorFunc,false);
//		}
	

	}
	
	private var mCombatStatsHeight:int = 0;
	private var mIsCombatStats:boolean = true;
	
	function SetCombatStatsVisible(_value:boolean)
	{
		mCombatScrollList.SetVisible(_value);
		lbFrameCombat.SetVisible(_value);
		mIsCombatStats = _value;
		
		if(_value)
		{
			mCombatStatsHeight = 0;
			this.rect.height=959;
			this.rect.y=4;		
			
			frameSimpleLabel.rect.height=959;
			
		}
		else
		{
			mCombatStatsHeight = 280;
			frameSimpleLabel.rect.height=688;
			this.rect.height=682;
			this.rect.y=107;		
					
		}
	}
	function SetAllianceFiveBtnAtMap()
	{
		btnWhisper.SetVisibleXYWidth(48, 700-mCombatStatsHeight, 225, true);		
		btnWhisper.rect.height = 70;
		
		btnEmail.SetVisibleXYWidth(310, 700-mCombatStatsHeight, 225, true);		
		btnEmail.rect.height = 70;
		
		btnIgnore.SetVisibleXYWidth(48, 785-mCombatStatsHeight, 225, true);		
		btnIgnore.rect.height = 70;
		
		btnReport.SetVisibleXYWidth(310, 785-mCombatStatsHeight, 225, true);		
		btnReport.rect.height = 70;
		
		btnMarch.SetVisibleXYWidth(48, 870-mCombatStatsHeight, 225, true);		
		btnMarch.rect.height = 70;
		
		btnMarch.SetVisible(true);
		btnWhisper.SetVisible(true);
		btnEmail.SetVisible(true);
		btnAlliance.SetVisible(true);
		btnIgnore.SetVisible(true);
		btnReport.SetVisible(true);
		btnInvite.SetVisible(false);
		
		btnMail.SetVisible(false);
		
	}
	function SetFiveBtnAtMap()
	{
		btnWhisper.SetVisibleXYWidth(48, 700-mCombatStatsHeight, 225, true);		
		btnWhisper.rect.height = 70;
		
		btnEmail.SetVisibleXYWidth(310, 700-mCombatStatsHeight, 225, true);		
		btnEmail.rect.height = 70;
		
		btnIgnore.SetVisibleXYWidth(48, 785-mCombatStatsHeight, 225, true);		
		btnIgnore.rect.height = 70;
		
		btnReport.SetVisibleXYWidth(310, 785-mCombatStatsHeight, 225, true);		
		btnReport.rect.height = 70;
		
		btnInvite.SetVisibleXYWidth(48, 870-mCombatStatsHeight, 225, true);		
		btnInvite.rect.height = 70;
		
		btnMarch.SetVisible(false);
		btnWhisper.SetVisible(true);
		btnEmail.SetVisible(true);
		btnAlliance.SetVisible(true);
		btnIgnore.SetVisible(true);
		btnReport.SetVisible(true);
		btnMail.SetVisible(false);
		btnInvite.SetVisible(true);
		
	}
	function SetTwoBtnAtRank()
	{
		btnInvite.SetVisibleXYWidth(144, 840-mCombatStatsHeight, 305, true);		
		btnInvite.rect.height = 85;
		
		btnEmail.SetVisibleXYWidth(144, 725-mCombatStatsHeight, 305, true);			
		btnEmail.rect.height = 85;
		
		btnMarch.SetVisible(false);
		btnWhisper.SetVisible(false);
		btnEmail.SetVisible(true);
		btnAlliance.SetVisible(true);
		btnIgnore.SetVisible(false);
		btnReport.SetVisible(false);
		btnMail.SetVisible(false);
		btnInvite.SetVisible(true);
	}
	function SetOneBtnAtChat()
	{
		btnInvite.SetVisibleXYWidth(144, 840-mCombatStatsHeight, 305, true);		
		btnInvite.rect.height = 85;
		
		btnMail.Draw();	
		btnMail.SetVisible(true);
		btnMail.rect.x=55;
		btnMail.rect.y=840-mCombatStatsHeight-80;
		
		btnMail.SetVisible(true);
		
	}
	function PopOKFunc(result:HashObject)
	{
		 if(result["userOfficerType"] != null)
			Alliance.getInstance().SetMyOfficerType(_Global.INT32(result["userOfficerType"]));
		 var userAllianceId:int = _Global.INT32(result["userInfo"][_Global.ap + "0"]["allianceId"]);  
		 userInfo.allianceId = _Global.ToString(userAllianceId);
		 
		 
		 OnInviteButton();
		
	}
	function okFunc (result:HashObject)
	{
		 var globalCombatStats:int = GameMain.instance().GetCombatStats();
		if(globalCombatStats==1)
		{
			SetCombatStatsVisible(true);
		
		}
		else
		{
			SetCombatStatsVisible(false);
		}
		
		 if(result["ok"].Value)
		 {

		 	  var userId =  result["userInfo"][_Global.ap + "0"]["userId"].Value;
		 	  var userName = result["userInfo"][_Global.ap + "0"]["name"].Value; 
		 	  
		 	  if(PlayerProfile.waitingUserId == 0 || PlayerProfile.waitingUserId != _Global.INT32(userId))
		 	  {
		 	  		return;
		 	  }
		 	  else
		 	  {
		 	  		PlayerProfile.waitingUserId = 0;
		 	  }
		 	  var userAllianceId:int = _Global.INT32(result["userInfo"][_Global.ap + "0"]["allianceId"]);  
		 	  var userAllianceName:String = ""; 
		 	  var diplomacy:String = "";
		 	  if(_Global.INT32(userAllianceId) != 0)
		 	  {
		 	  	  userAllianceName =  result["userInfo"][_Global.ap + "0"]["allianceName"].Value; 
		 	  	  diplomacy = AllianceVO.getAllianceDiplomacy(0,_Global.INT32(userAllianceId)); 
		 	  	  
			 		 btnAlliance1.txt= userAllianceName.ToString(); 
				  btnAlliance1.OnClick = function(){
						var allianceInfoParams:Hashtable = {"userId":userId};
						MenuMgr.getInstance().PushMenu("AllianceInfoPopup", allianceInfoParams);
					};
				btnInvite.EnableBlueButton(false);
				
					
		 	  }
		 	  else
		 	  {
			 	btnAlliance1.txt= ""; 
		 	  	btnAlliance1Name.txt=Datas.getArString("ShowCreateAlliance.AllianceName") + ": " ; 
		 	  	
			 		 btnAlliance1.OnClick = function(){
						
					};
				btnInvite.EnableBlueButton(true);
				 btnInvite.OnClick = OnBtnInvite;
					btnInvite.txt = Datas.getArString("Common.Invite_button");
					OnInviteButton();
					
		 	  }
		 	  var might:long = _Global.INT64(result["userInfo"][_Global.ap + "0"]["might"]);  
		 	  var userLevel:int = _Global.INT32(result["userInfo"][_Global.ap + "0"]["title"]);  
		 	  
			  playerName.txt = userName;
			  allianceName.txt =  Datas.getArString("ShowCreateAlliance.AllianceName") + ": " + userAllianceName; 
			  
			  power.txt = Datas.getArString("MainChrome.MightInfo_Title") + ": " + _Global.NumFormat(might);
			  level.txt = Datas.getArString("MainChrome.LevelInfo_Title")  + ": " +  userLevel;
			  title.txt = Datas.getArString("Common.PlayerProfile_Tilte");
			  userInfo.userName = userName;
			  userInfo.allianceId = _Global.ToString(userAllianceId);
			  
		 	  btnAlliance1Name.txt=Datas.getArString("ShowCreateAlliance.AllianceName") + ": " ;  
			  allianceDiplomacy.txt = Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": " + diplomacy;
			  
			  if (null != result["userInfo"][_Global.ap + "0"]["portraitname"]) {
				  var avatarName = result["userInfo"][_Global.ap + "0"]["portraitname"].Value;
				  if (!String.IsNullOrEmpty(avatarName)) {
				    	avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(avatarName));
				  }
				  var avatarFrameName = result["userInfo"][_Global.ap + "0"]["avatarFrameImg"].Value;
				  if(avatarFrameName != "img0")
				  {
					  avatarFrame.useTile = true;
					avatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(avatarFrameName);
				  }
				  else
				  {
					  avatarFrame.useTile = false;
				  }
			  }
			  
			  kills.txt = Datas.getArString("MainChrome.Kills_Title") + ": " +_Global.NumFormat(Convert.ToInt64(_Global.INT64(result["userInfo"][_Global.ap +"0"]["mightKilled"])));
			rank.txt = Datas.getArString("MainChrome.ranking") + ": " + _Global.INT64(result["userInfo"][_Global.ap + "0"]["rankKilled"]);
			if(_Global.INT64(result["userInfo"][_Global.ap + "0"]["maxkinghtlevel"])<=255)
			bestKnight.txt = Datas.getArString("MainChrome.bestKnight_Title") + ":LV " + _Global.INT64(result["userInfo"][_Global.ap + "0"]["maxkinghtlevel"]);
			else 
			bestKnight.txt = Datas.getArString("MainChrome.bestKnight_Title") + ":*LV " + (_Global.INT64(result["userInfo"][_Global.ap + "0"]["maxkinghtlevel"])-255);
			
			if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"] && null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"])
			{
				bNum=true;
				var _kills:String = "";
				if(null != result["userInfo"][_Global.ap +"0"]["mightKilled"])
				{
					_kills = _Global.NumFormat(Convert.ToInt64(_Global.INT64(result["userInfo"][_Global.ap +"0"]["mightKilled"])));
				}
				var _combatVicitries:int = 0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"]&&null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"])
				{
					_combatVicitries = _Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"])+_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"]);
				}
				var _combatLossers :int = 0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackLosses"]&&null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseLosses"])
				{
					 _combatLossers =_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackLosses"])+_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseLosses"]);
				}
				
				var _victoryRate:float=0.0;
				if((_combatVicitries+_combatLossers)!=0)
				{
					 _victoryRate =(_combatVicitries*100/(_combatVicitries+_combatLossers));
				}
				
				var _attackVictories :int = 0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"])
				{
					 _attackVictories =_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"]);
				}
				
				var _attackVictoriesRate:float=0.0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"]&&null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackLosses"] && (_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"])+_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackLosses"]))!=0)
				{
					 _attackVictoriesRate =(_attackVictories*100/(_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackVictories"])+_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["attackLosses"])));
				}
				
				var _defenseVictories :int = 0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"])
				{
				 _defenseVictories =_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"]);
				
				}
				
				var _defenseVictoriesRate:float =0.0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"]&&null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseLosses"] && (_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"])+_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseLosses"]))!=0)
				{
				 _defenseVictoriesRate =(_defenseVictories*100/(_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseVictories"])+_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["defenseLosses"])));
				
				}
				
				var _lossedMight:int = 0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["lossedMight"])
				{
				 _lossedMight=_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["lossedMight"]);
				
				}
				var _scoutCount:int = 0;
				if(null != result["userInfo"][_Global.ap + "0"]["combatInfo"]["scoutCount"])
				{
				 _scoutCount=_Global.INT64(result["userInfo"][_Global.ap + "0"]["combatInfo"]["scoutCount"]);
				
				}
				 

				var data:Hashtable;
				data = {"kills":_kills};
				mCombatArray.Push(data);
				data = {"combatVicitries":_combatVicitries};
				mCombatArray.Push(data);
				
				data = {"combatLossers":_combatLossers};
				mCombatArray.Push(data);
				
				data = {"victoryRate":_victoryRate};
				mCombatArray.Push(data);
				
				data = {"attackVictories":_attackVictories};
				mCombatArray.Push(data);
				
				data = {"attackVictoriesRate":_attackVictoriesRate};
				mCombatArray.Push(data);
				
				data = {"defenseVictories":_defenseVictories};
				mCombatArray.Push(data);
				
				data = {"defenseVictoriesRate":_defenseVictoriesRate};
				mCombatArray.Push(data);
				
				data = {"lossedMight":_lossedMight};
				mCombatArray.Push(data);
				
				data = {"scoutCount":_scoutCount};
				mCombatArray.Push(data);
				
				mCombatScrollList.SetData(mCombatArray);
				mCombatScrollList.ResetPos();
				
				
			}
			else
			{
				bNum=false;
			
				var data1:Hashtable;
				data1 = {"kills":0};
				mCombatArray.Push(data1);
				data1 = {"combatVicitries":0};
				mCombatArray.Push(data1);
				
				data1 = {"combatLossers":0};
				mCombatArray.Push(data1);
				
				data1 = {"victoryRate":0};
				mCombatArray.Push(data1);
				
				data1 = {"attackVictories":0};
				mCombatArray.Push(data1);
				
				data1 = {"attackVictoriesRate":0};
				mCombatArray.Push(data1);
				
				data1 = {"defenseVictories":0};
				mCombatArray.Push(data1);
				
				data1 = {"defenseVictoriesRate":0};
				mCombatArray.Push(data1);
				
				data1 = {"lossedMight":0};
				mCombatArray.Push(data1);
				
				data1 = {"scoutCount":0};
				mCombatArray.Push(data1);
				
				mCombatScrollList.SetData(mCombatArray);
				mCombatScrollList.ResetPos();
			
			}

			
			 if (null != result["userInfo"][_Global.ap + "0"]["leagueLevel"]) {
				  var leagueName = result["userInfo"][_Global.ap + "0"]["leagueLevel"].Value;
				 
				 // leagueLevel.image = TextureMgr.instance().LoadTexture(leagueName, TextureType.ICON);
				  leagueLevel.setBackground (SeasonLeagueMgr.instance().GetLeagueIconName(leagueName), TextureType.DECORATION);
			  }
			 else
			 {
				  leagueLevel.setBackground ("", TextureType.DECORATION);
			 
			 }
	
			  if (null != result["userInfo"][_Global.ap + "0"]["badge"]) {
			  	var badgeName =result["userInfo"][_Global.ap + "0"]["badge"].Value;
			  	if (!String.IsNullOrEmpty(badgeName)) {
					badge.useTile = true;
					badge.tile = TextureMgr.instance().ElseIconSpt().GetTile(badgeName);
			  		badgeDesc.txt = Datas.getArString("Badge." + badgeName);
			  		badgeDesc.SetFont();
			  		var badgeSize : Vector2 = badgeDesc.mystyle.CalcSize(new GUIContent(badgeDesc.txt));
					if (badgeSize.x < minBadgeWidth)
						badgeSize.x = minBadgeWidth;
					badgeDesc.rect = new Rect(lbFrame.rect.xMax - badgeSize.x - 6, badgeDesc.rect.y, badgeSize.x, badgeSize.y);
					badge.rect.x = badgeDesc.rect.x + (badgeDesc.rect.width - badge.rect.width) / 2;
			  		badge.SetVisible(true);
			  		badgeDesc.SetVisible(true);
			  		playerName.txt = _Global.GUIClipToWidth(playerName.mystyle, playerName.txt, (badgeDesc.rect.x - playerName.rect.x), "...", null);
			  	}
			  }
			  
			  if (null != result["userInfo"][_Global.ap + 0]["allianceEmblem"]) {
			  	var aedata : AllianceEmblemData = new AllianceEmblemData();
			  	JasonReflection.JasonConvertHelper.ParseToObjectOnce(aedata, result["userInfo"][_Global.ap + 0]["allianceEmblem"]);
			  	allianceEmblem.Data = aedata;
			  	ShowAllianceEmblem(null != aedata && !aedata.IsEmpty);
			  } else {
			  	ShowAllianceEmblem(false);
			  }
			  
			  waitingLabel.visible = false;
			  
			  if(userAllianceId > 0)
			  {
			    	btnAlliance.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
					btnAlliance.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
	
					btnAlliance.OnClick = function(){
						var allianceInfoParams:Hashtable = {"allianceId":userAllianceId};
						MenuMgr.getInstance().PushMenu("AllianceInfoPopup", allianceInfoParams);
					};
				}
				else
				{
					btnAlliance.OnClick = function(args:Object){
						//btn alliance will do nothing
					};
					//can't be down
					btnAlliance.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
					btnAlliance.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
				}
				
				var seed:HashObject = GameMain.instance().getSeed();
				var currentUserName:String = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
				if(currentUserName == userName)
				{
					btnEmail.OnClick = function(args:Object){};
					btnEmail.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
					btnEmail.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
				}
				else
				{
					btnEmail.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
					btnEmail.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
					btnEmail.OnClick = function(args:Object)
					{
						var _obj:Object = {"subMenu":"compose", "name":userName};
						MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
					};
				}
		 } 
		 else
		 {
		 	//nothing
		 }
		 
		 if(result["userOfficerType"] != null)
			Alliance.getInstance().SetMyOfficerType(_Global.INT32(result["userOfficerType"]));
	
		 OnInviteButton();
		 
	}; 	
	function errorFunc(msg:String, errorCode:String)
	{
		//nothing
		var message:String = UnityNet.localError(errorCode, msg, null);
				ErrorMgr.instance().PushError("",message);
				MenuMgr.getInstance().PopMenu("");
	}; 
	
	private function ShowAllianceEmblem(visible:boolean)
	{
		allianceEmblem.SetVisible(visible);
		if (visible) {
			allianceName.rect.x = 150;
			//allianceDiplomacy.rect.x = 150;
			//lbFrame.rect.height = 290;
		} else {
			allianceName.rect.x = 70;
			//allianceDiplomacy.rect.x = 70;
			//lbFrame.rect.height = 265;
		}
	}
	
	private function OnInviteButton()
	{
		var InviteVisible:boolean = Alliance.getInstance().CanInviteUser(userInfo);
		//btnInvite.EnableBlueButton(InviteVisible);
	}
	
	private function handleMarchClick():void
	{
		if(checkMarch())
		{
			//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":0, "y":0, "types":[Constant.MarchType.TRANSPORT, Constant.MarchType.REINFORCE], "defaultSelectType":1},"trans_zoomComp");
		    MarchDataManager.instance().SetData({"x":0, "y":0, "types":[Constant.MarchType.TRANSPORT, Constant.MarchType.REINFORCE], "defaultSelectType":1});
		}
	}
	
	private function checkMarch():boolean
	{
		if( !Attack.instance().checkOverMarch() )
		{
//			var rallyMaxLevel:int = Building.instance().getMaxLevelForType(Constant.Building.RALLY_SPOT,GameMain.instance().getCurCityId() );
//			var curMaxMarchSlot:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.RALLY_SPOT,rallyMaxLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_SLOT_COUNT);
			var curMaxMarchSlot:int = Building.instance().getMaxMarchCount();
			if(curMaxMarchSlot  == (10 + Technology.instance().getTechAddMaxMarchCount()))
			{
				ErrorMgr.instance().PushError("",Datas.getArString("ModalAttack.MaxMarchLimit"));
			}
			else
			{				
				ErrorMgr.instance().PushError("", Datas.getArString("ModalAttack.OverMarch"));
			}
			return false;
		}
		return true;
	}
	
	private function resultFunc(result:HashObject):void
	{
		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
	}
	
	public function Update()
	{
		waitingLabel.Update();
		mCombatScrollList.Update();
		
	}
	
	public function OnPop()
	{
		PlayerProfile.waitingUserId = 0;
		mCombatScrollList.Clear();
	}
	
	private function OnBtnEmail(param:Object) {
		var _obj:Object = {"subMenu":"compose", "name":userInfo.userName};
		MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
	}
	
	private function OnBtnAlliance(param:Object) {
		var allianceInfoParams:Hashtable = {"allianceId":userInfo.allianceId};
		MenuMgr.getInstance().PushMenu("AllianceInfoPopup", allianceInfoParams);
	}

	private function OnBtnInvite(param:Object) {
		Alliance.getInstance().DoInviteUser(userInfo);
		UnityNet.SendAllianceInvitationClickBI(userInfo.viewFrom);
	}
}


