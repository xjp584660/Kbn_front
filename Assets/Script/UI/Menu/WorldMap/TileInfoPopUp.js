class	TileInfoPopUp extends KBN.TileInfoPopUp {
	private	static	var	TOP_RIGHT_MAIL_BTN:int = 1;
	private	static	var	TOP_RIGHT_BUILDCITY_BTN:int = 2;
	private static	var TOP_RIGHT_MARCHLINE:int = 3;
	private	var	topRightBtnType:int;
	
	public	var	bgLabel:Label;
	public var l_bottom_arrow:Label;
	
	public	var	title:Label;
	
	private static var PROGRESS_FILLING_MIN_VAL : int = 20;
	private static var PROGRESS_FILLING_MAX_VAL : int = 265;
	private static var PROGRESS_FILLING_MAX_VAL2 : int = 365;
	private static var PROGRESS_GRADUATION_LEFT : int = 138;
	private static var PROGRESS_GRADUATION_RIGHT : int = 395;
	private static var PROGRESS_TXT_LEFT : int = -154;
	private static var PROGRESS_TXT_RIGHT : int = 104;
	
	private var m_curTileKind : int = 0;
	private var m_curTileLevel : int = 0;
	private var m_isPVPBoss : boolean = false;
	
	public	var shareBtn:Button;
	public	var sharedIcon:Label;
	public	var shareBtn2:Button;
	
	//comUIObj1 content:
	public	var labelIcon:Label;
	public  var labelIconFrame:Label;
	public	var emblem:AllianceEmblemButton;
	public	var	label1Btn:Button;
	public	var	label1:Label;
	public	var	label2:Label;
	public	var	label3:Label;
	public	var	label4:Label;
	public	var	label5:Label;
	public	var	labelCoor:Label;
	public	var	bogDescLabel:Label;
	public	var	nextBtn:Button;
	public  var bounsProgressBarBack:Label;
	public	var bonusProgressBar:Label;
	public	var bonusGraduation1:Label;
	public	var bonusGraduation2:Label;
	public	var bonusGraduation3:Label;
	public	var bonusGraduation4:Label;
	public	var points1:Label;
	public	var points2:Label;
	public	var points3:Label;
	public	var points4:Label;
	public	var points5:Label;
	public	var time1:Label;
	public	var time2:Label;
	public	var time3:Label;
	public	var time4:Label;
	public	var time5:Label;
	public var league:Label;
	public var leagueIcon:Label;
	public	var progressBarFilling:Label;
	public	var tileFlag:Label;
	public	var bossIcon:Label;
	public	var abandonButton:Button;
	public	var avaBtn1:Button;
	public	var avaBtn2:Button;
	public	var avaBtn3:Button;
	public	var avaScoreProgressBar:Label;
	public	var avaScoreProgressBarFilling:Label;
	public	var avaScore:Label;
	public	var avaScore2:Label;
	public	var avaScoreName:Label;
	public	var loadingIndicator:Label;
	//end comUIObj1
	
	
	public	var	topLine:Label;
	public	var	topRightBtn:Button;
	public	var	bookmarkBtn:Button;
	
	public	var l_bookmark:Label;  // background for boormarkBtn
	public  var l_topRight:Label;  // background for topRightBtn
	
	public	var	bottomBtn1:Button;
	public	var	bottomBtn2:Button;
	public	var bottomBtn3:Button;
	public  var bottomBtnInvite:Button;
	public  var bottomBtnRallyAttack:Button;
	
	public	var	comUIObj1:ComposedUIObj;
	public	var	comUIObj2:ComposedUIObj;
	public	var comUIObj3:ComposedUIObj;
	
	//comUIObj2 content:
	public	var	preBtn:Button;
	public	var	descLabel:Label;
	public	var actTileIcon:Label;
	public	var nextBtnDes:Button;
	public	var actTileDesc:Label;
	//end comUIObj2
	
	//comUIObj3 content:
	public	var preBtnSave:Button;
	public	var labelPlayName:Label;
	public	var inputTextBookmarkName:InputText;
	public	var buttonFavorite:Button;
	public	var buttonFriendly:Button;
	public	var buttonHostile:Button;
	
	public	var lblbgFavorite:Label;
	public	var lblbgFrendly:Label;
	public	var lblbgHostile:Label;
	public	var lblTypeTips:Label;
	public var inviteBtn:Button;
	public var marchShareBtn:Button;
	public var marchShareBg:Label;
	//end comUIObj3
	
	public	static	var	STYLE_MY_CITY:int = 0;
	public	static	var	STYLE_OTHER_PLAYER_CITY:int = 1;
	public	static	var	STYLE_WILD:int = 2;
	public	static	var	STYLE_BARBARIAN_CAMP:int = 3;
	
	public	var slotInfo:HashObject;
	public	var	tileUserInfo:HashObject;
	
	private var nc:NavigatorController = new NavigatorController();
	
	private	var bottomBtn2OrgX:int;
	
	private var originalBookMark:String;
	private var bookMarkTags:Array;
	
	private var bookIsFavorite:boolean = false;
	private var bookIsFriendly:boolean = false;
	private var bookIsHostile:boolean = false;
	
	//build city
	private	var	waitingBuildCity:City;
	private var tileTexture:Texture;
	
	private var m_avaImp : TileInfoPopUpAVAImp;
	private var m_isAVA : int = -1;
	//carmot 
	private var isUpdateCarmot:boolean = false;
	private	static var  curCarmotNum:float;
	public	var	carmotBtn:Label;
	public	var	carmotBtnHelp:Button;
	public	var	carmotPlayerBtn:Button;
	
	public	var	carmotNumLabel:Label;
	public	var	carmotLoadLabel:Label;
	public  var carmotSpeedLabel:Label;
	public  var carmotSpeedTimeLabel:Label;
	public  var carmotSpeedButton:Button;
	public var carmotCollectInfo:CarmotCollectInfo=null;
	private var collectionResourcesMgr : CollectionResourcesMgr;

	public var moveCityBg:Label;                                                                                                      
	public var moveCityIcon:Button;
	
	public function setupAVATileInfo( a : PBMsgAVATileInfo.PBMsgAVATileInfo ) {
		m_avaImp.setup( a );
	}
	
	class	DetailInfo{
		public	static	var	OWNER_OWN_CUR:int = 0;
		public	static	var	OWNER_OWN_OTHER:int = 1;
		public	static	var	OWNER_SAME_ALLIANCE:int = 2;
		public	static	var	OWNER_FRIENDLY_ALLIANCE:int = 3;
		public	static	var	OWNER_STRANGER:int = 4;
		
		public	var	owner:int;
		
		public	var tileUserId:String = "";
		public	var	userName:String = "";
		public  var avatar:String = "";
		public  var avatarFrame:String = "";
		public  var badge:String = "";
		public	var	tileLevel:String = "";
		public	var	userLevel:String = "";
		public	var	might:String = "";
		public	var	allianceName:String = "";
		public	var	allianceDip:String = "";
		public	var	x:String = "";
		public	var	y:String = "";
		public	var	province:String = "";
		public	var	desc:String = "";
		public	var	tileCityId:int;
		public	var allianceEmblem:AllianceEmblemData = null;
		
		public var allianceId:int;
		public var allianceLeague:int;
		public	function	reset(){
			tileUserId = "";
			userName = "";
			avatar = "";
			this.avatarFrame = "";
			badge = "";
			tileLevel = "";
			userLevel = "";
			might = "";
			allianceName = "";
			allianceDip = "";
			x = "";
			y = "";
			province = "";
			desc = "";
			tileCityId = 0;
			allianceId = 0;
			allianceEmblem = null;
			allianceLeague = 0;
		}
	}
	var	detailInfo:DetailInfo = new DetailInfo();
	public static var detail: String[] = new String[2];/*存储点击位置*/


	class	TileTroopMenuParam{
		public	var	title:String;
		public	var	troopList:Array;
		public	var	isCarmot:boolean=false;
		public  var coordX:String;
		public  var coordY:String;
	}
	
	class CarmotCollectInfo{
		public var resourceType:int;
		public var fromPlayerId:int;
		public var allNum:long;//current troop can collect carmot max num
		public var curNum:int;
		public var begainTime:long;
		public var endTime:long;
		public var speed:float;
		public var speedAdd:float;
		public var marchLoad:int;
		public var buffList : System.Collections.Generic.List.<CarmotBuffInfo> = new System.Collections.Generic.List.<CarmotBuffInfo>();
	}
	
	class CarmotBuffInfo
	{
		public var buffType:int; // 3001  3002
		public var buffBeginTime:long;
		public var buffEndTime:long;
		public var buffSpeedAdd:float;
	}
    
    private enum BadBookmarkName {
        None,
        BadSymbols,
        BigLength
    };
    
    private function CheckBookmarkName(newStr : String) : BadBookmarkName {
        if (newStr.Contains(",") || newStr.Contains("'") || newStr.Contains('"')) {
            return BadBookmarkName.BadSymbols;
        }
        if (newStr.Length > 20) {
            return BadBookmarkName.BigLength;
        }
        return BadBookmarkName.None;
    }
	
	public	function	Awake(){

		enabled = true;
		m_avaImp = new TileInfoPopUpAVAImp();
		m_avaImp.setPopUp( this );

		shareBtn.txt = "";
		shareBtn2.txt = "";
		label1Btn.OnClick = onLabel1BtnClick;
		carmotPlayerBtn.OnClick = onLabel1BtnClick;
		
		bookmarkBtn.OnClick = onBookmarkBtnClick;
		nextBtn.OnClick = onNextBtnClick;
		preBtn.OnClick = onPreBtnClick;
		preBtnSave.OnClick = onPreBtnSaveClick;
//		carmotBtnHelp.OnClick = onCarmotBtnHelp;
		carmotSpeedButton.OnClick = onCarmotSpeedClick;
		
		comUIObj1.rect.height = rect.height;
		comUIObj2.rect.height = rect.height;
		comUIObj1.component = [labelIcon, labelIconFrame , emblem, label1Btn,carmotPlayerBtn, label1, label2, label3, label4, label5,league,leagueIcon,bogDescLabel, nextBtn, bossIcon, bonusProgressBar, bounsProgressBarBack, progressBarFilling,
								bonusGraduation1, bonusGraduation2, bonusGraduation3, bonusGraduation4, points1, points2, points3, points4, points5,
								time1, time2, time3, time4, time5,avaBtn1, avaBtn2, avaBtn3, avaScore, avaScoreProgressBar, avaScoreProgressBarFilling, avaScore,
								avaScore2, avaScoreName, loadingIndicator,carmotBtn,carmotNumLabel,carmotLoadLabel,carmotSpeedLabel,carmotSpeedTimeLabel,carmotSpeedButton];
		comUIObj2.component = [preBtn, descLabel, actTileIcon, actTileDesc];
		comUIObj3.component = [preBtnSave,labelPlayName,inputTextBookmarkName,lblbgFavorite,lblbgFrendly,lblbgHostile,buttonFavorite,buttonFriendly,buttonHostile,lblTypeTips];
		
		nc.Init();
		nc.soundOn = false;
		nc.push(comUIObj1);
		visible = false;
		
		bottomBtn2OrgX = bottomBtn2.rect.x;
		
		l_bookmark.setBackground("square_black_4",TextureType.DECORATION);
		l_topRight.setBackground("square_black_4", TextureType.DECORATION);
		topLine.setBackground("between line_list_small", TextureType.DECORATION);
		bgLabel.setBackground("popup2-new", TextureType.DECORATION);
		l_bottom_arrow.setBackground("popup2_Arrow-new", TextureType.DECORATION);
		
		
		nextBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_normal", TextureType.BUTTON);
		nextBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_down", TextureType.BUTTON);
		
		preBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_left_normal", TextureType.BUTTON);
		preBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_left_down", TextureType.BUTTON);
		
		bookmarkBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_bookmark_normal", TextureType.BUTTON);
		bookmarkBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_bookmark_down", TextureType.BUTTON);
		
		buttonHostile.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_Hostility2",TextureType.BUTTON);
		buttonFriendly.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_Peace2",TextureType.BUTTON);
		buttonFavorite.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_xingdi2",TextureType.BUTTON);

		marchShareBtn.OnClick=MarchShare;
		// marchShareBg.OnClick=MarchShare;
		moveCityIcon.OnClick=MoveCityDialog;

		showMarchShare=true;
		collectionResourcesMgr = CollectionResourcesMgr.instance();
	}
	private function MarchShare() : void
    {
        var chatMenuName = "ChatMenu";
        var paramDict : Hashtable = null;
        if (true)
        {
        	var str:String=title.txt+"-("+detailInfo.x+","+detailInfo.y+")";
            paramDict = new Hashtable();
            paramDict.Add("tabName", "normal");
            paramDict.Add("marchShare", str);
            //Debug.Log("this March = "+str);
        }
        MenuMgr.getInstance().PushMenu(chatMenuName, paramDict);
    }

	/*返回点击位置的数据*/
	public static function GetDetailInfo(): String[] {

		return detail;

	}

    private function MoveCityDialog()
	{

		/*打开迁城道具界面*/
		MenuMgr.getInstance().PushMenu("MoveCityMenu", null, "trans_zoomComp");

    	/*var leftTime:int=MyItems.instance().GetItemTimeLeft(915); 
    	var confirmStr:String = Datas.getArString(leftTime>0?"Teleport.TeleportConfirm_Text1":"Teleport.TeleportConfirm_Text2");
		confirmStr = confirmStr + "\n" + "(" + detailInfo.x + "," +  detailInfo.y+")";	
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setLayout(600,380);
		cd.setTitleY(120);
		cd.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
		MenuMgr.getInstance().PushConfirmDialog(confirmStr, "", MoveCity, null);*/
    }

    private function MoveCity():void
    {
    	dismiss();
    	var x:int=_Global.INT32(detailInfo.x);
    	var y:int=_Global.INT32(detailInfo.y);
    	/*Debug.Log("915 left time = "+MyItems.instance().GetItemTimeLeft(915));*/
    	var leftTime:int=MyItems.instance().GetItemTimeLeft(915);

    	MyItems.instance().useTeleportDo(leftTime>0?915:912,x,y);
	}




	private var loadingIndicatorAngle : float;
	private var loadingIndicatorUpdateTimer : float;
	public var LOADING_INDICATOR_ANGLE_INTERVAL = 0.5f;
	public var LOADING_INDICATOR_ANGLE_INCREMENT = 0.5f;
	public	function	FixedUpdate(){
		marchShareBtn.SetVisible(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL&&showMarchShare);
		marchShareBg.SetVisible(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL&&showMarchShare);
		nc.u_FixedUpdate();
		if( m_isAVA == 1 ) 
		{
			if( loadingIndicator.visible )
			{
				loadingIndicatorUpdateTimer -= Time.deltaTime;
				if( loadingIndicatorUpdateTimer <= 0 ) 
				{
					loadingIndicatorAngle += LOADING_INDICATOR_ANGLE_INCREMENT;
					loadingIndicator.rotateAngle = loadingIndicatorAngle;
					loadingIndicatorUpdateTimer = LOADING_INDICATOR_ANGLE_INTERVAL;
				}
			}
		}
		if(isUpdateCarmot && curCarmotNum>0){}
		//curCarmotNum -= Time.deltaTime;
		if(carmotCollectInfo!=null && carmotCollectInfo.endTime>=GameMain.unixtime())
		{
			var showCarmotSpeedBuff : boolean = false;
			var buffSpeedAdd : float = 0;
			var offsettime:float=GameMain.unixtime()-carmotCollectInfo.begainTime;
			if(offsettime>=0)
			{
				if(carmotCollectInfo.fromPlayerId == Datas.instance().tvuid())
				{
					var buffAddCarmot : float = 0;
					var buffAddAll : float = 0;
					for(var i : int = 0; i < carmotCollectInfo.buffList.Count;i++)
					{				
						var carmotBuff : CarmotBuffInfo = carmotCollectInfo.buffList[i];
						
						if(carmotCollectInfo.begainTime >= carmotBuff.buffEndTime)
						{
							continue;
						}
						
						if(carmotBuff.buffBeginTime <= carmotCollectInfo.begainTime && carmotBuff.buffEndTime <= GameMain.unixtime())
						{
							buffAddCarmot += (carmotBuff.buffEndTime - carmotCollectInfo.begainTime) * carmotBuff.buffSpeedAdd;
						}
						else if(carmotBuff.buffBeginTime <= carmotCollectInfo.begainTime && carmotBuff.buffEndTime >= GameMain.unixtime())
						{
							buffAddCarmot += (GameMain.unixtime() - carmotCollectInfo.begainTime) * carmotBuff.buffSpeedAdd;
							showCarmotSpeedBuff = true;
							buffSpeedAdd = carmotBuff.buffSpeedAdd;
						}
						else if(carmotBuff.buffBeginTime >= carmotCollectInfo.begainTime && carmotBuff.buffEndTime <= GameMain.unixtime())
						{
							buffAddCarmot += (carmotBuff.buffEndTime - carmotBuff.buffBeginTime) * carmotBuff.buffSpeedAdd;
						}
						else if(carmotBuff.buffBeginTime >= carmotCollectInfo.begainTime && carmotBuff.buffEndTime >= GameMain.unixtime())
						{
							buffAddCarmot += (GameMain.unixtime() - carmotBuff.buffBeginTime) * carmotBuff.buffSpeedAdd;
							showCarmotSpeedBuff = true;
							buffSpeedAdd = carmotBuff.buffSpeedAdd;
						}					
					}
									
					curCarmotNum=_Global.INT64(carmotCollectInfo.allNum-(carmotCollectInfo.speed+carmotCollectInfo.speedAdd)*offsettime - buffAddCarmot);
					curCarmotNum=curCarmotNum<0?0:curCarmotNum;//
					var buffcollectCarmotNum:long=carmotCollectInfo.allNum-curCarmotNum;
					var buffmaxLoadCarmotNum:long = carmotCollectInfo.marchLoad;
					if(carmotCollectInfo.marchLoad > carmotCollectInfo.allNum)
					{
						buffmaxLoadCarmotNum = carmotCollectInfo.allNum;
					}
					if(buffcollectCarmotNum > buffmaxLoadCarmotNum)
					{
						buffcollectCarmotNum = buffmaxLoadCarmotNum;
					}
					//var buffmaxLoadCarmotNum:long=Mathf.Ceil((carmotCollectInfo.endTime-carmotCollectInfo.begainTime)*(carmotCollectInfo.speed+carmotCollectInfo.speedAdd) + buffAddAll);
					carmotLoadLabel.txt=_Global.NumSimlify(buffcollectCarmotNum)+" / "+_Global.NumSimlify(buffmaxLoadCarmotNum);
					
					carmotSpeedButton.visible=true;
					carmotSpeedButton.txt = Datas.getArString("Carmot.SpeedUp_Text2");
					carmotSpeedLabel.visible=true;
					
					var nomalSpeed : float = carmotCollectInfo.speed/* + carmotCollectInfo.speedAdd*/;
					buffSpeedAdd += carmotCollectInfo.speedAdd;
					nomalSpeed *= 3600;// 每hour采集数量
					buffSpeedAdd *= 3600;

					var speedTxt : String = String.Empty;
					var speedTimeTxt : String = String.Empty;
					if(carmotCollectInfo.resourceType == Constant.CollectResourcesType.CARMOT)
					{
						speedTxt = Datas.getArString("Carmot.SpeedUp_Text0");
						speedTimeTxt = Datas.getArString("Carmot.SpeedUp_Text1");
					}
					else
					{
						speedTxt = Datas.getArString("Newresource.SpeedUp_Text0");
						speedTimeTxt = Datas.getArString("Newresource.SpeedUp_Text1");
					}

					if(buffSpeedAdd > 0)
					{
						carmotSpeedLabel.txt = String.Format(speedTxt, _Global.NumSimlify(nomalSpeed) + "/h <color=#348620>+ " +
							_Global.NumSimlify(_Global.INT32(buffSpeedAdd)) + "/h</color>"); 
					}
					else
					{
						carmotSpeedLabel.txt = String.Format(speedTxt, _Global.NumSimlify(nomalSpeed));
					}
						
					if(showCarmotSpeedBuff == true)
					{				
						carmotSpeedTimeLabel.visible=true;
															
						var leftTime : long = carmotBuff.buffEndTime - GameMain.unixtime();
						carmotSpeedTimeLabel.txt = String.Format(speedTimeTxt, _Global.timeFormatStr(leftTime));
					}
				}
				else
				{
					curCarmotNum=_Global.INT64(carmotCollectInfo.allNum-(carmotCollectInfo.speed+carmotCollectInfo.speedAdd)*offsettime);
					curCarmotNum=curCarmotNum<0?0:curCarmotNum;//
					var collectCarmotNum:long=carmotCollectInfo.allNum-curCarmotNum;
					var maxLoadCarmotNum:long=carmotCollectInfo.marchLoad;
					if(carmotCollectInfo.marchLoad > carmotCollectInfo.allNum)
					{
						maxLoadCarmotNum = carmotCollectInfo.allNum;
					}
					carmotLoadLabel.txt=_Global.NumSimlify(collectCarmotNum)+" / "+_Global.NumSimlify(maxLoadCarmotNum);
					carmotLoadLabel.visible=true;
				}
			}		
		}
	}
	
	public	function	OnGUI(){
		if( !visible ){
			return;
		}
		GUI.depth = 1;
		_Global.setGUIMatrix();
		
		var oldColor:Color = GUI.color;
		if (alphaEnable) {
			GUI.color.a *= alpha;
		}
			
		
		GUI.BeginGroup(rect);
			bgLabel.Draw();
			l_bottom_arrow.Draw();
			title.Draw();
			labelCoor.Draw();
			tileFlag.Draw();
			
			abandonButton.Draw();
			GUI.BeginGroup(Rect(40,20,comUIObj1.rect.width,comUIObj1.rect.height+50));
				nc.DrawItems();
			GUI.EndGroup();
			
			topLine.Draw();
//			bootomLine.Draw();
			
		    l_topRight.Draw();
			topRightBtn.Draw();
			// inviteBtn.Draw();
			l_bookmark.Draw();
			bookmarkBtn.Draw();
			carmotBtnHelp.Draw();
//			carmotBtn.Draw();
			
//			carmotNumLabel.Draw();
			
			shareBtn.Draw();
			shareBtn2.Draw();
			sharedIcon.Draw();
			marchShareBg.Draw();
			marchShareBtn.Draw();
			// moveCityBg.Draw();
			moveCityIcon.Draw();

			
			bottomBtn1.Draw();
			bottomBtn2.Draw();
			
			bottomBtn3.Draw();
			bottomBtnInvite.Draw();
			bottomBtnRallyAttack.Draw();
			var cur :long = curCarmotNum;
			carmotNumLabel.txt = _Global.NumSimlify(cur);
		GUI.EndGroup();
		
		if (alphaEnable) {
			GUI.color = oldColor;
		}
		if( m_isAVA == 1 ) {
			updateScoreProgressBar();
		} else if( m_isAVA == 0 ) {
		updateBonusProgressBar();
//			carmotBtnHelp.Draw();
		
	}
	}
	private function onTileSharedDetermine( shared : int ) {
		if( shared == -1 ) {
			shareBtn.visible = false;
			sharedIcon.visible = false;
			l_bookmark.SetVisible( false );
		} else {
			shareBtn.visible = shared == 0;
			shareBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_closed",
														TextureType.MAP17D3A_UI);
			shareBtn.mystyle.active.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_closed",
														TextureType.MAP17D3A_UI);
											
			shareBtn.OnClick = onShareBtnClick;
			sharedIcon.visible = shared != 0;
			sharedIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_opened", TextureType.MAP17D3A_UI );
			l_bookmark.SetVisible( shared == 0 );
		}
	}
	private function onTileStatusGet( shared : int, totalMight : long, leftMight : long ) {
		
		onTileSharedDetermine( shared );
		if( m_isPVPBoss ) {
			if( totalMight >= 0 ) {
				label1.txt = String.Format( Datas.getArString("PVP.TileDetail_Might"), totalMight );
			}
		}
	}
	
	private function updateScoreProgressBar() { // AVA
		if( m_avaImp.canShowScoreProgressBar() ) {
			var perc : float = m_avaImp.getScoreProgress();
			var fillingWidth = PROGRESS_FILLING_MAX_VAL2 - PROGRESS_FILLING_MIN_VAL;
			avaScoreProgressBarFilling.rect.width = PROGRESS_FILLING_MIN_VAL + ( perc * fillingWidth ) % fillingWidth;
			var n : long = parseInt( m_avaImp.getScore() );
			var d : long = parseInt( m_avaImp.getTotalScore() );
			avaScore.txt = ""+ n +"/"+ d;
			if( m_avaImp.getOccupationTime() != 0 ) {
				label4.txt = Datas.getArString("AVA.stats_wondersownedtime") + " " + KBN._Global.timeFormatStrPlus( m_avaImp.getOccupationTime() );
			}
		}
	}
	
	private function updateBonusProgressBar() { // PVP
		var perc : float = KBN.TournamentManager.getInstance().getBonusProgressPerc();
		var fillingWidth = PROGRESS_FILLING_MAX_VAL - PROGRESS_FILLING_MIN_VAL;
		progressBarFilling.rect.width = PROGRESS_FILLING_MIN_VAL + ( perc * fillingWidth ) % fillingWidth;
	}
	
	
	private function initBonusProgressBar( tileKind : int, tileLevel : int ) {
		if( KBN.TournamentManager.getInstance().getTileBonus( tileKind, tileLevel ) ) {
			var t1 = KBN.TournamentManager.getInstance().getBonusTime( 0 );
			var t2 = KBN.TournamentManager.getInstance().getBonusTime( 1 );
			var t3 = KBN.TournamentManager.getInstance().getBonusTime( 2 );
			var t4 = KBN.TournamentManager.getInstance().getBonusTime( 3 );
			var t5 = KBN.TournamentManager.getInstance().getBonusTime( 4 );
			points1.txt = "" + KBN.TournamentManager.getInstance().getBonusPoints( 0 );
			points2.txt = "" + KBN.TournamentManager.getInstance().getBonusPoints( 1 );
			points3.txt = "" + KBN.TournamentManager.getInstance().getBonusPoints( 2 );
			points4.txt = "" + KBN.TournamentManager.getInstance().getBonusPoints( 3 );
			points5.txt = "" + KBN.TournamentManager.getInstance().getBonusPoints( 4 );
			time1.txt = "" + ( t1 / 60 ) + "m";
			time2.txt = "" + ( t2 / 60 ) + "m";
			time3.txt = "" + ( t3 / 60 ) + "m";
			time4.txt = "" + ( t4 / 60 ) + "m";
			time5.txt = "" + ( t5 / 60 ) + "m";
			points1.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t1 / t5;
			points2.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t2 / t5;
			points3.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t3 / t5;
			points4.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t4 / t5;
			points5.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t5 / t5;
			time1.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t1 / t5;
			time2.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t2 / t5;
			time3.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t3 / t5;
			time4.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t4 / t5;
			time5.rect.x = PROGRESS_TXT_LEFT + ( PROGRESS_TXT_RIGHT - PROGRESS_TXT_LEFT ) * t5 / t5;
			bonusGraduation1.rect.x = PROGRESS_GRADUATION_LEFT + ( PROGRESS_GRADUATION_RIGHT - PROGRESS_GRADUATION_LEFT ) * t1 / t5;
			bonusGraduation2.rect.x = PROGRESS_GRADUATION_LEFT + ( PROGRESS_GRADUATION_RIGHT - PROGRESS_GRADUATION_LEFT ) * t2 / t5;
			bonusGraduation3.rect.x = PROGRESS_GRADUATION_LEFT + ( PROGRESS_GRADUATION_RIGHT - PROGRESS_GRADUATION_LEFT ) * t3 / t5;
			bonusGraduation4.rect.x = PROGRESS_GRADUATION_LEFT + ( PROGRESS_GRADUATION_RIGHT - PROGRESS_GRADUATION_LEFT ) * t4 / t5;
		} else {
			hideBonusProgressBar();
		}
	}
	public function hideAll() {
		tournamentStrip();
		bottomBtn1.visible = false;
		bottomBtn2.visible = false;
		bottomBtnRallyAttack.visible = false;
		bottomBtnInvite.visible = false;
		
		label1Btn.visible = false;
		carmotPlayerBtn.visible = false;
		label2.visible = false;
		carmotNumLabel.visible = false;
		carmotLoadLabel.visible=false;
		carmotSpeedLabel.visible=false;
		carmotSpeedTimeLabel.visible=false;
		carmotSpeedButton.visible=false;		
		label3.visible = false;
		label4.visible = false;
		label5.visible = false;
		nextBtn.visible = false;
		league.visible = false;
		leagueIcon.visible = false;
		topRightBtn.visible = false;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		bookmarkBtn.visible = false;
		carmotBtn.visible = false;
		carmotBtnHelp.visible = false;
		
		l_bookmark.SetVisible(false);
		label1.visible = false;
		bogDescLabel.visible = false;
		nextBtnDes.visible = false;
		nextBtn.visible = false;
		
		preBtnSave.visible = false;
		labelPlayName.visible = false;
		inputTextBookmarkName.visible = false;
		buttonHostile.visible = false;
		buttonFavorite.visible = false;
		buttonFriendly.visible = false;
		avaBtn1.visible = false;
		avaBtn2.visible = false;
		avaBtn3.visible = false;
		avaScoreProgressBar.visible = false;
		avaScoreProgressBarFilling.visible = false;
		avaScore.visible = false;
		avaScore2.visible = false;
		avaScoreName.visible = false;
		loadingIndicator.visible = false;
	}
	
	private var mIsDisplaying = false;
	public	function	display(sltInfo:HashObject, tileTex:Texture){
		if(sltInfo==null)return;
		//recover, maybe last display only reinfoce button
		carmotPlayerBtn.visible = false;

		showMarchShare=true;
		
		bottomBtn2.rect.x = bottomBtn2OrgX;
		bottomBtn3.visible = false;
		nc.pop2Root();
		inviteBtn.visible = false;
		inviteBtn.SetDisabled(true);
		label1Btn.rect.width = 220;
		carmotPlayerBtn.rect.width = 220;
		label5.rect.width=390;
		mIsDisplaying = true;
		slotInfo = sltInfo;
		tileTexture = tileTex;
		avaBtn1.SetVisible( false );
		avaBtn2.SetVisible( false );
		avaBtn3.SetVisible( false );
		moveCityIcon.SetVisible(false);
		moveCityBg.SetVisible(false);
		carmotNumLabel.visible = false;
		carmotLoadLabel.visible=false;
		carmotSpeedLabel.visible=false;
		carmotSpeedTimeLabel.visible=false;
		carmotSpeedButton.visible=false;	
		carmotBtn.visible = false;
		carmotBtnHelp.visible = false;
		hideAVAProgressBar();
		m_isAVA = 0;
		carmotCollectInfo=null;
//				isUpdateCarmot = false;
		var tileID : int = _Global.INT32( slotInfo["tileId"].Value );
		var tileType:int = _Global.INT32(slotInfo["tileType"]);
		var tileUserId:int = _Global.INT32( slotInfo["tileUserId"] );
		var tileCityId:int = _Global.INT32( slotInfo["tileCityId"] );
		var seed:HashObject = GameMain.instance().getSeed();
		var userID = _Global.INT32(seed["player"]["userId"].Value);

		getDetailInfo(slotInfo);
		var	tileLevelStr:String = "(" + Datas.getArString("Common.Lv") + detailInfo.tileLevel + ")"; 
		
		if( tileType == Constant.TileType.WORLDMAP_2X2_KEY_TILE ||
			tileType == Constant.TileType.WORLDMAP_1X1_DUMMY ||
			tileType == Constant.TileType.WORLDMAP_2X2_LT_DUMMY ||
			tileType == Constant.TileType.WORLDMAP_2X2_RT_DUMMY ||
			tileType == Constant.TileType.WORLDMAP_2X2_LB_DUMMY ||
			tileType == Constant.TileType.WORLDMAP_2X2_RB_DUMMY ) {
			tileType = Constant.TileType.BOG;
		}
		var coordLabelSet : boolean = false;
		var updateTitleLater : boolean = true;
		var updateInviteBtn : boolean = true;
		if( m_avaImp.handleIfPossible( sltInfo ) ) {
			inviteBtn.visible = false;
			inviteBtn.SetDisabled( true );
			updateInviteBtn = false;
			setTopRightBtn( TOP_RIGHT_MARCHLINE, true );
			m_isAVA = 1;
			label1Btn.SetVisible( false );
			carmotPlayerBtn.SetVisible( false );
			
			nextBtn.visible = true;
			if( tileType == Constant.TileType.TILE_TYPE_AVA_PLAYER ) { // Outpost needs no description.
				nextBtn.visible = false;
			}
			descLabel.visible = true;
			labelCoor.txt = detailInfo.x + "," + detailInfo.y;// + " -" + detailInfo.province;
			coordLabelSet = true;
			// Tile name
			var tileName = Datas.getArString( AvaUtility.GetTileNameKey( tileType ) );
			title.txt = tileName;
			title.SetVisible( true );
		
			// Tile description
			var desc = Datas.getArString( AvaUtility.GetTileDescKey( tileType ) );
			detailInfo.desc = desc;
			
			// User name
			if( userID == 0 ) {
				label1Btn.SetVisible( false );
				carmotPlayerBtn.SetVisible( false );
				
				label1.txt = Datas.getArString("Common.Unoccupied");
			} else {
				label1Btn.txt = detailInfo.userName;
				label1Btn.SetVisible( detailInfo.userName != "" );
				label1.txt = "";
			}
			
			var mc = GameMain.instance().getMapController2();
			mc.avaImp.reqTileInfo( tileID );
			
			updateTitleLater = false;
			loadingIndicator.visible = true;
		} else if( tileType >= Constant.TileType.WORLDMAP_1X1_ACT &&
				tileType <= Constant.TileType.WORLDMAP_2X2_RB_ACT ) { // Must be available activity tile
			
			var worldID = _Global.INT32(seed["player"]["worldId"].Value);
			
			var userNme = seed["player"]["name"].Value;
			var allianceID = _Global.INT32(seed["player"]["allianceId"].Value);
				
			var tileUserID = _Global.INT32( slotInfo["tileUserId"] );
			var tileAllianceID = _Global.INT32( slotInfo["tileAllianceId"] );
			var tileKind = ( slotInfo["tileKind"] != null ) ? _Global.INT32( slotInfo["tileKind"] ) : 0;
			var tileLevel = _Global.INT32( slotInfo["tileLevel"] );
			var xcoord = _Global.INT32( slotInfo["xCoord"] );
			var ycoord = _Global.INT32( slotInfo["yCoord"] );
			
			
			m_curTileKind = tileKind;
			m_curTileLevel = tileLevel;
			
			initBonusProgressBar( tileKind, tileLevel );
			
			KBN.TournamentManager.getInstance().requestTileBonus( tileType, xcoord, ycoord, onTileStatusGet );
			var allianceDiplomacies : HashObject = seed["allianceDiplomacies"];
			
			if( userID == tileUserID ) {
				tournamentMyself();
			} else 
			{
				var flagNumber : int = 0;
				var friendly : HashObject = allianceDiplomacies["friendly"];
				var values : Array;
				
				if( friendly != null ){
					values = _Global.GetObjectValues(friendly);
					for( var k : int = 0; k < values.Count; ++k )
					{						
						if( tileAllianceID == _Global.INT32( (values[k] as HashObject)["allianceId"] ) ){
							flagNumber = -1;
							break;
						}
					}
				}
			
				if( (allianceID == tileAllianceID) || (allianceDiplomacies != null && allianceDiplomacies["allianceId"] != null && 
				tileAllianceID == _Global.INT32(allianceDiplomacies["allianceId"])) || flagNumber == -1) 
				{
					tournamentFriend();
				} 
				else if( tileAllianceID == 0 ) 
				{
					tournamentBoss( tileKind, tileLevel );
				} 
				else 
				{
					tournamentEnemyAlliance();
				}
			}
			
			// Tile name
			originalBookMark = KBN.TournamentManager.getInstance().getTileName( tileType, userID, "", tileKind );
			
			// Sound effect
			if( slotInfo["tileId"] != null ) {
				
				var stage : int = KBN.TournamentManager.getInstance().getTileDamageStage( tileID );
				KBN.TournamentManager.getInstance().playStageSound( stage );
			}
		}
		else if( tileType == Constant.TileType.CITY ){
			if( tileUserId == 0 ){
				var lv:int=_Global.INT32(detailInfo.tileLevel);
				if(lv>10){
				 	tileLevelStr = "(" + Datas.getArString("Common.Lv") + (lv-10) + ")"; 
					originalBookMark = Datas.getArString("Common.BarbarianCamp2") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.BarbarianCityDesc4");
					getCampTileResource(tileID);
				}else{
					originalBookMark = Datas.getArString("Common.BarbarianCamp") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.BarbarianCityDesc");
				}
				
				barbarian(_Global.INT32(detailInfo.tileLevel));
				
			}else{
				originalBookMark = slotInfo["cityName"] == null ? "" : ( slotInfo["cityName"].Value);
				// slotInfo["cityName"].Value;
				if( detailInfo.owner == DetailInfo.OWNER_OWN_CUR  || detailInfo.owner == DetailInfo.OWNER_OWN_OTHER){
					myCity();
				}else if(detailInfo.owner == DetailInfo.OWNER_SAME_ALLIANCE){
					sameAllianceCity();
				}else if(detailInfo.owner == DetailInfo.OWNER_FRIENDLY_ALLIANCE)
				{
					friendlyAllienceCity();
				}else 
				{
					strangerCity();				
				}
			}	
					
		}else{
			var productionIncrease:String = " " + (_Global.INT32(detailInfo.tileLevel)*5) + "%";
			
			switch( tileType ){
				case	Constant.TileType.BOG:
					originalBookMark = Datas.getArString("Common.Bog") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.BogDesc");
					title.txt = originalBookMark;
					bog();
					return;; //this is different, need return, not call wild(tileType);
					
				case	Constant.TileType.GRASSLAND:
					originalBookMark = Datas.getArString("Common.Grassland") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.GrassDesc") + productionIncrease;
					break;
					
				case	Constant.TileType.LAKE:
					originalBookMark = Datas.getArString("Common.Lake") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.LakeDesc") + productionIncrease;
					break;
	
				case	Constant.TileType.WOODS:
					originalBookMark = Datas.getArString("Common.Woods") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.WoodsDesc") + productionIncrease;
					break;
					
				case	Constant.TileType.HILLS:
					originalBookMark = Datas.getArString("Common.Hills") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.HillsDesc") + productionIncrease;
					break;
					
				case	Constant.TileType.MOUNTAIN:
					originalBookMark = Datas.getArString("Common.Mountain") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.MountainDesc") + productionIncrease;
					break;
					
				case	Constant.TileType.PLAIN:
					originalBookMark = Datas.getArString("Common.Plain") + tileLevelStr;
					detailInfo.desc = Datas.getArString("MapView.PlainDesc");
					moveCityIcon.SetVisible(true);
					moveCityBg.SetVisible(true);
					break;
			}
			
			if( detailInfo.might.Length <= 0 ){
				detailInfo.might = _Global.NumFormat(_Global.INT64(Datas.instance().getGameData()["wildpowerlevels"]["l" + detailInfo.tileLevel]));
			}
			wild(tileType);
		}
		
		if( updateTitleLater ) {
			title.txt = originalBookMark;
		}
		if( !coordLabelSet ) {
			labelCoor.txt = detailInfo.x + "," + detailInfo.y + " -" + detailInfo.province;
		}
		
		buttonHostile.OnClick = hostileTagClick;
		buttonFriendly.OnClick = friendlyTagClick;
		buttonFavorite.OnClick =  favoriteTagClick;
		if(detailInfo.userName != null && detailInfo.userName.Trim() != "")
		{	
			if( updateInviteBtn ) {
				var canInvite:boolean = Alliance.getInstance().CanInviteUser(_Global.INT32(detailInfo.tileUserId), detailInfo.allianceId);
//				inviteBtn.visible = canInvite;
//				inviteBtn.SetDisabled(!canInvite);
				inviteBtn.OnClick = OnInviteBtn;
			}
		}
		
		if( tileType >= Constant.TileType.WORLDMAP_1X1_ACT &&
				tileType <= Constant.TileType.WORLDMAP_2X2_RB_ACT ) {
			if( updateInviteBtn ) {
				inviteBtn.visible = false;
			}
		}
	}
	
	private function onShowAvaMarchlineInfo()
	{
		var mc : MapController = GameMain.instance().getMapController2();
		if( mc != null ) {
			mc.showAVAMarchLineInfo();
		}
	}
	
	private function hostileTagClick()
	{
		bookIsHostile = !bookIsHostile;
		
		bookMarkTypeButtomsSetting();
	}
	private function friendlyTagClick()
	{
		bookIsFriendly = !bookIsFriendly;
		bookMarkTypeButtomsSetting();
	}
	private function favoriteTagClick()
	{
		bookIsFavorite = !bookIsFavorite;
		bookMarkTypeButtomsSetting();
	}
	
	//change display images
	private function bookMarkTypeButtomsSetting()
	{
		//hostile
		buttonHostile.mystyle.normal.background = bookIsHostile ? TextureMgr.instance().LoadTexture("Type_Hostility2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_Hostility",TextureType.BUTTON);
		lblbgHostile.mystyle.normal.background = bookIsHostile ? TextureMgr.instance().LoadTexture("Type_ring",TextureType.DECORATION) : TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		//friendly
		buttonFriendly.mystyle.normal.background = bookIsFriendly ? TextureMgr.instance().LoadTexture("Type_Peace2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_Peace",TextureType.BUTTON);
		lblbgFrendly.mystyle.normal.background = bookIsFriendly ? TextureMgr.instance().LoadTexture("Type_ring",TextureType.DECORATION) : TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		//favorite
		buttonFavorite.mystyle.normal.background = bookIsFavorite ? TextureMgr.instance().LoadTexture("Type_xingdi2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_xingdi",TextureType.BUTTON);
		lblbgFavorite.mystyle.normal.background = bookIsFavorite ? TextureMgr.instance().LoadTexture("Type_ring",TextureType.DECORATION) : TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
	}
	private	function	own(tileCityId:int):int{
		var ret:int = -1;
		var seed:HashObject = GameMain.instance().getSeed();
		var curCityId:int = GameMain.instance().getCurCityId();
		
		if(tileCityId == curCityId)
			ret = DetailInfo.OWNER_OWN_CUR;
		else
		{
			var cities:Array = _Global.GetObjectValues(seed["cities"]);	
			for(var i:int=0; i<cities.length; i++)
			{
				if(tileCityId == _Global.INT32((cities[i] as HashObject)[_Global.ap + 0]) )
				{
					ret = DetailInfo.OWNER_OWN_OTHER;
					break;
				}
			}
		}
		
		return ret;
	}
	private function	tournamentStrip() {
		hideBonusProgressBar();
		tileFlag.visible = false;
		shareBtn.visible = false;
		shareBtn2.visible = false;
		sharedIcon.visible = false;
		actTileIcon.visible = false;
		actTileDesc.visible = false;
		bossIcon.visible = false;
		abandonButton.visible = false;
	}
	
	private function hideAVAProgressBar() {
		avaScore.visible = false;
		avaScoreProgressBar.visible = false;
		avaScoreProgressBarFilling.visible = false;
		avaScore2.visible = false;
		avaScoreName.visible = false;
	}
	
	public function showAVAProgressBar() {
		avaScore.visible = true;
		avaScoreProgressBar.visible = true;
		avaScoreProgressBarFilling.visible = true;
		avaScoreName.visible = true;
		avaScoreName.txt = Datas.getArString("AVA.chrome_stats_scoretab");
	}
	
	private function	showBonusProgressBar() {
		bonusProgressBar.visible = true;
		bounsProgressBarBack.visible = true;
		bonusGraduation1.visible = true;
		bonusGraduation2.visible = true;
		bonusGraduation3.visible = true;
		bonusGraduation4.visible = true;
		points1.visible = true;
		points2.visible = true;
		points3.visible = true;
		points4.visible = true;
		points5.visible = true;
		time1.visible = true;
		time2.visible = true;
		time3.visible = true;
		time4.visible = true;
		time5.visible = true;
		progressBarFilling.visible = true;
	}
	private function	hideBonusProgressBar() {
		bonusProgressBar.visible = false;
		bounsProgressBarBack.visible = false;
		bonusGraduation1.visible = false;
		bonusGraduation2.visible = false;
		bonusGraduation3.visible = false;
		bonusGraduation4.visible = false;
		points1.visible = false;
		points2.visible = false;
		points3.visible = false;
		points4.visible = false;
		points5.visible = false;
		time1.visible = false;
		time2.visible = false;
		time3.visible = false;
		time4.visible = false;
		time5.visible = false;
		progressBarFilling.visible = false;
	}
	private function	tournamentCommon() {
		topRightBtn.visible = false;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		label1Btn.visible = false;
		carmotPlayerBtn.visible = false;
		
		bogDescLabel.visible = false;
		
		bookmarkBtn.visible = false;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(false);
		nextBtn.visible = true;
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = true;
		leagueIcon.visible = false;
//		var arStrings:Object = Datas.instance().arStrings();
		bottomBtn1.txt = Datas.getArString("Common.Scout");
		bottomBtn1.OnClick = onScoutBtnClick;
		
		bottomBtn2.txt = Datas.getArString("Common.Attack");
		bottomBtn2.OnClick = onAttackBtnClick;
		
		
		abandonButton.visible = false;
		
		
		var gameData:HashObject = Datas.instance().getGameData();

		var bossTexture : Texture = TextureMgr.instance().LoadTexture("button_invite_normal",TextureType.BUTTON);

		setLabelIcon(bossTexture, true);
		setEmblem(null, false);
		label1.txt = String.Format( Datas.getArString("PVP.TileDetail_Boss"), "No" );
		label2.txt = String.Format( Datas.getArString("PVP.TileDetail_Alliance"), detailInfo.allianceName );
		label3.txt = String.Format( Datas.getArString("PVP.TileDetail_Might"), detailInfo.might );
		label4.txt = "";
		label5.txt = "";
		
		nextBtnDes.visible = true;
		nextBtn.visible = true;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
		showBonusProgressBar();
		
		tileFlag.visible = true;
		
		actTileIcon.visible = false;
		
		if( slotInfo["tileKind"] != null ) {
			var tileKind : int = _Global.INT32(slotInfo["tileKind"]);
			if( tileKind == 2 ) {
				actTileIcon.visible = true;
			}
		}
		
		actTileDesc.visible = true;
		var itemsString : String = Datas.getArString( "Common.None" );
		var worldMap : KBN.DataTable.WorldMap = GameMain.GdsManager.GetGds.<KBN.GDS_WorldMap>().GetItemById( m_curTileKind, m_curTileLevel );
		if( worldMap == null ) {
			return false;
		}
		if( worldMap.ITEM != null && worldMap.ITEM != "0" ) {
			var fields1 : Array = worldMap.ITEM.Split(":"[0]);
			if( fields1.Count > 0 ) {
				itemsString = "";
			}
			for( var i : int = 0; i < fields1.Count; ++i ) {
				var fields2 : Array = ( fields1[i] as String ).Split("_"[0]);
				if( fields2[0] == "0" ) {
					continue;
				}
				itemsString += ( i == 0 ? "" : ", " ) + Datas.getArString( String.Format("itemName.i{0}", fields2[0] as String) );
			}
		}
				
		actTileDesc.txt = String.Format( Datas.getArString( "PVP.Tile_DropInfo" ), itemsString );
		m_isPVPBoss = false;
		onTileSharedDetermine( -1 );
	}
	
	private function	tournamentBoss( tileKind : int, tileLevel : int ) {
		tournamentCommon();
		m_isPVPBoss = true;
		label1.txt = String.Format( Datas.getArString("PVP.TileDetail_Might"), "..." );
		label2.txt = "";
		label3.txt = "";
		// TODO: Let the product manager determine whether we need a boss name.
		//		So we comment the boss name here.
		//label3.txt = String.Format( Datas.getArString("PVP.TileDetail_Boss"), "No" );
		
		var worldMap : KBN.DataTable.WorldMap = GameMain.GdsManager.GetGds.<KBN.GDS_WorldMap>().GetItemById( tileKind, tileLevel );
		if( worldMap != null ) {
			var bossIconName : String = worldMap.TILE_BOSS;
			var tileIconName : String = worldMap.TILE_IMAGE;
			
			bossIcon.visible = true;
			bossIconName = "potrait" + bossIconName.Substring(10);
			
			bossIcon.setBackground( bossIconName, TextureType.PVEBOSS );
			
		}
		labelIcon.visible = false;
		labelIconFrame.visible = false;
		emblem.visible = false;
		tileFlag.visible = false;
		leagueIcon.visible = false;
		hideBonusProgressBar();
	}
	private function	tournamentOccuppiedCommon() {
		tournamentCommon();
		league.visible = false;
		label1.txt = String.Format( Datas.getArString("PVP.TileDetail_Occupant"), detailInfo.userName );
		label2.txt = String.Format( Datas.getArString("PVP.TileDetail_Alliance"), detailInfo.allianceName );
		label3.visible = false;
		label3.txt = "";
		setLabelIcon(detailInfo.avatar, detailInfo.avatarFrame, true);
		setEmblem(detailInfo.allianceEmblem, true);
		bossIcon.visible = false;
	}
	
	private function	tournamentEnemyAlliance() {
		tournamentOccuppiedCommon();
		tileFlag.setBackground( "icon_map_view_flag_red_1", TextureType.ICON_ELSE );
	}
	
	private function	tournamentMyself() {
		tournamentOccuppiedCommon();
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		bottomBtn3.visible = false;
		bottomBtn1.txt = Datas.getArString( "Common.ViewTroops" );
		bottomBtn2.txt = Datas.getArString( "Common.Reinforce" );
		bottomBtn3.txt = "";
		bottomBtn1.OnClick = onViewTroopBtnClick;
		bottomBtn2.OnClick = onReinforceBtnClick;
		abandonButton.visible = true;
		abandonButton.OnClick = onGiveUpBtnClick;
		abandonButton.txt = "";
		abandonButton.mystyle.normal.background = TextureMgr.instance().LoadTexture( "Abandoned_plots", TextureType.MAP17D3A_UI );
		abandonButton.mystyle.active.background = TextureMgr.instance().LoadTexture( "Abandoned_plots", TextureType.MAP17D3A_UI );
		tileFlag.setBackground( "icon_map_view_flag_yellow_0", TextureType.ICON_ELSE );
	}
	
	private function	tournamentFriend() {
		tournamentOccuppiedCommon();
		tileFlag.setBackground( "icon_map_view_flag_blue_1", TextureType.ICON_ELSE );
		bottomBtn1.visible = false;
		bottomBtn2.visible = false;
		bottomBtn3.visible = true;
		bottomBtn3.txt = Datas.getArString( "Common.Reinforce" );
		bottomBtn3.OnClick = onReinforceBtnClick;
	}
	
	private	function	myCity(){
		tournamentStrip();
//		topRightBtn.visible = false;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		bookmarkBtn.visible = false;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(false);
		
		nextBtn.visible = false;
		label1Btn.visible = false;
		carmotPlayerBtn.visible = false;
		bogDescLabel.visible = false;
		
		nextBtnDes.visible = false;
		
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		
		
		nextBtnDes.visible = false;
		
		preBtnSave.visible = false;
		labelPlayName.visible = false;
		inputTextBookmarkName.visible = false;
		buttonHostile.visible = false;
		buttonFavorite.visible = false;
		buttonFriendly.visible = false;
		shareBtn.visible = false;
		shareBtn2.visible = false;
		
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = true;
		leagueIcon.visible = true;
//		var arStrings:Object = Datas.instance().arStrings();
		bottomBtn1.txt = Datas.getArString("Common.ViewCity");
		
		
		if( detailInfo.owner == DetailInfo.OWNER_OWN_CUR ){
			bottomBtn1.OnClick = function(param:Object){
				dismiss();
                GameMain.instance().StartCoroutine(OpenCity());
			};
		
			bottomBtn2.txt = Datas.getArString("Common.ViewReinforcements");
			bottomBtn2.OnClick = onViewTroopBtnClick;
		}else{
			bottomBtn1.OnClick = function(param:Object){
				GameMain.instance().changeCity(detailInfo.tileCityId);
				dismiss();
                 GameMain.instance().StartCoroutine(OpenCity());
				
			};
			bottomBtn2.txt = Datas.getArString("Common.March");
			bottomBtn2.OnClick = onMyCityMarchBtnClick;
		}
	
		setLabelIcon(detailInfo.avatar, detailInfo.avatarFrame, true);
		setEmblem(detailInfo.allianceEmblem, true);
		label1.txt = detailInfo.userName + "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")";
		label2.txt = Datas.getArString("Common.Might") + ": " + detailInfo.might;
		label3.txt = Datas.getArString("Common.Alliance") + ": " + detailInfo.allianceName;
		label4.txt = "";
		label5.txt = "";
		league.txt = Datas.getArString("PVP.TileLeagueTitle") + " " + Datas.getArString("LeagueName.League_"+detailInfo.allianceLeague);
		leagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(detailInfo.allianceLeague),TextureType.DECORATION);
	}

    private function OpenCity():IEnumerator
    {
        #if UNITY_EDITOR
            yield null;//new WaitForSeconds(0.2f);
        #endif
            GameMain.instance().nextLevel();
    }
	
	private	function	sameAllianceCity(){
		tournamentStrip();
//		topRightBtn.visible = true;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, true );
		bookmarkBtn.visible = true;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(true);
		nextBtn.visible = false;
		bogDescLabel.visible = false;
		
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		
		label1Btn.visible = true;
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = true;
		leagueIcon.visible = true;
		nextBtnDes.visible = true;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
		lblbgFrendly.visible = true;
		lblbgFrendly.visible = true;
		lblbgHostile.visible = true;
		lblTypeTips.visible = true;
		
//		var arStrings:Object = Datas.instance().arStrings();
		bottomBtn1.txt = Datas.getArString("Common.Transport");
		bottomBtn2.txt = Datas.getArString("Common.Reinforce");
		
		bottomBtn1.OnClick = onTransportBtnClick;
		bottomBtn2.OnClick = onReinforceBtnClick;

		setLabelIcon(detailInfo.avatar, detailInfo.avatarFrame, true);
		setEmblem(detailInfo.allianceEmblem, true);
		label3.txt = Datas.getArString("Common.Alliance") + ": " + detailInfo.allianceName;
		label1Btn.txt = detailInfo.userName + "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")";
		label1.txt = "";
		label2.txt = Datas.getArString("Common.Might") + ": " + detailInfo.might;
		label4.txt = "";
		label5.txt = "";
		league.txt = Datas.getArString("PVP.TileLeagueTitle") + " " + Datas.getArString("LeagueName.League_"+detailInfo.allianceLeague);
		leagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(detailInfo.allianceLeague),TextureType.DECORATION);
		
	}
	
	private function friendlyAllienceCity()
	{
		tournamentStrip();
		nextBtn.visible = false;
		bogDescLabel.visible = false;
		
//		topRightBtn.visible = true;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, true );
		bookmarkBtn.visible = true;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(true);
		label1Btn.visible = true;
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = true;
		leagueIcon.visible = true;
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		
		nextBtnDes.visible = false;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
//		var arStrings:Object = Datas.instance().arStrings();
		bottomBtn1.txt = Datas.getArString("Common.Scout");
		bottomBtn2.txt = Datas.getArString("Common.Attack");
		
		bottomBtn1.OnClick = onScoutBtnClick;
		bottomBtn2.OnClick = onAttackBtnClick;
		
		var canInvite:boolean = Alliance.getInstance().CanInviteUser(_Global.INT32(detailInfo.tileUserId), detailInfo.allianceId);
		inviteBtn.visible = canInvite;
		inviteBtn.SetDisabled(!canInvite);
		inviteBtn.OnClick = OnInviteBtn;
		inviteBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_invite_normal",TextureType.BUTTON);
		inviteBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_invite_down",TextureType.BUTTON);

		if (inviteBtn.visible) {
			label1Btn.rect.width = 220;
			label1Btn.SetTextClip(detailInfo.userName, "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")");
		} else {
			label1Btn.txt = detailInfo.userName + "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")";
		}
		
		setLabelIcon(detailInfo.avatar, detailInfo.avatarFrame, true);
		setEmblem(detailInfo.allianceEmblem, true);
		label1.txt = "";
		label2.txt = Datas.getArString("Common.Might") + ": " + detailInfo.might;
		label3.txt = Datas.getArString("Common.Alliance") + ": " + detailInfo.allianceName;
		label4.txt = Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": "  + detailInfo.allianceDip;
		label5.txt = "";
		league.txt = Datas.getArString("PVP.TileLeagueTitle") + " " + Datas.getArString("LeagueName.League_"+detailInfo.allianceLeague);
		leagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(detailInfo.allianceLeague),TextureType.DECORATION);	
	}
	
	public function setRallyAttack()
	{
		this.rect.width = 490;
		this.rect.height = 400;
		bgLabel.rect.height = 391;
		l_bottom_arrow.rect.y = 381;
		bottomBtnInvite.SetVisible(true);
		bottomBtnRallyAttack.SetVisible(true);
		bottomBtnInvite.txt = Datas.getArString("Common.Invite_button");
		bottomBtnRallyAttack.txt = Datas.getArString("AVA.chrome_rallyattackbtn");
		bottomBtnInvite.OnClick = onBottomBtnInviteClick;
		bottomBtnRallyAttack.OnClick = onBttomBtnRallyAttackClick;
	}
	
	public function resetRallyAttack()
	{
		this.rect.width = 490;
		this.rect.height = 350;
		bgLabel.rect.height = 320;
		l_bottom_arrow.rect.y = 310;
		bottomBtnInvite.SetVisible(false);
		bottomBtnRallyAttack.SetVisible(false);
	}
	
	public function onBottomBtnInviteClick(param:Object){
		var userinfo : UserDetailInfo = getUserInfo();
		Alliance.getInstance().DoInviteUser(userinfo);
        UnityNet.SendAllianceInvitationClickBI(userinfo.viewFrom);
	}
	
	public function onBttomBtnRallyAttackClick(param:Object){
		//todo 向后端请求时间数据
        dismiss();
        if (!couldBeAttack())
        {
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_208"));
			return;
		}
        if( checkMarch(Constant.MarchType.RALLY_ATTACK) ){
            // MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, 
            //                             "types":[1,2,3,5,10,2000], 
			//                             "type":Constant.MarchType.RALLY_ATTACK},"trans_zoomComp");
			MarchDataManager.instance().SetData({"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, 
                                       "types":[1,2,3,5,10,2000], 
			                           "type":Constant.MarchType.RALLY_ATTACK});
        }
	}
	
	private	function	strangerCity(){
		tournamentStrip();
		nextBtn.visible = false;
		bogDescLabel.visible = false;
		
//		topRightBtn.visible = true;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, true );
		bookmarkBtn.visible = true;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(true);
		label1Btn.visible = true;
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = true;
		leagueIcon.visible = true;
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		
		nextBtnDes.visible = false;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
//		var arStrings:Object = Datas.instance().arStrings();
		bottomBtn1.txt = Datas.getArString("Common.Scout");
		bottomBtn2.txt = Datas.getArString("Common.Attack");
//		bottomBtnInvite.txt = Datas.getArString("Common.Invite_button");
//		bottomBtnRallyAttack.txt = Datas.getArString("AVA.chrome_rallyattackbtn");
		
		bottomBtn1.OnClick = onScoutBtnClick;
		bottomBtn2.OnClick = onAttackBtnClick;
//		bottomBtnInvite.OnClick = onBottomBtnInviteClick;
//		bottomBtnRallyAttack.OnClick = onBttomBtnRallyAttackClick;
		
		var canInvite:boolean = Alliance.getInstance().CanInviteUser(_Global.INT32(detailInfo.tileUserId), detailInfo.allianceId);
		inviteBtn.visible = canInvite;
		inviteBtn.SetDisabled(!canInvite);
		inviteBtn.OnClick = OnInviteBtn;
		inviteBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_invite_normal",TextureType.BUTTON);
		inviteBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_invite_down",TextureType.BUTTON);

		if (inviteBtn.visible) {
			label1Btn.rect.width = 220;
			label1Btn.SetTextClip(detailInfo.userName, "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")");
		} else {
			label1Btn.txt = detailInfo.userName + "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")";
		}
		
		setLabelIcon(detailInfo.avatar, detailInfo.avatarFrame, true);
		setEmblem(detailInfo.allianceEmblem, true);
		label1.txt = "";
		label2.txt = Datas.getArString("Common.Might") + ": " + detailInfo.might;
		label3.txt = Datas.getArString("Common.Alliance") + ": " + detailInfo.allianceName;
		label4.txt = Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": "  + detailInfo.allianceDip;
		label5.txt = "";
		league.txt = Datas.getArString("PVP.TileLeagueTitle") + " " + Datas.getArString("LeagueName.League_"+detailInfo.allianceLeague);
		leagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(detailInfo.allianceLeague),TextureType.DECORATION);	
	}
	
	
	public var  isMyCarmot:boolean = false;
	public var  isSameAllianceCarmot:boolean = false;
	public var  isStrangerCarmot:boolean = false;
	public function getIsMyCarmot():boolean
	{
		return isMyCarmot;
	}
	public function getIsSameAllianceCarmot():boolean
	{
		return isSameAllianceCarmot;
	}
	public function getIsStrangerCarmot():boolean
	{
		return isStrangerCarmot;
	}
	
	private	function	wild(type:int){
		tournamentStrip();
		var	data:Datas = Datas.instance();
//		var arStrings:Object = data.arStrings();
		
		//set button
		if( _Global.INT32( slotInfo["tileUserId"] ) == data.tvuid() 
			|| detailInfo.owner == DetailInfo.OWNER_SAME_ALLIANCE ){
			
			bottomBtn2.visible = true;
			bottomBtn2.txt = Datas.getArString("Common.Reinforce");
			bottomBtn2.OnClick = onReinforceBtnClick;
			
			if( _Global.INT32( slotInfo["tileUserId"] ) == data.tvuid() ){
			
				bottomBtn1.visible = true;
				bottomBtn1.txt = Datas.getArString("Common.ViewTroops");
				bottomBtn1.OnClick = onViewTroopBtnClick;
			}else{
				
				bottomBtn2.rect.x = (bgLabel.rect.width - bottomBtn2.rect.width)/2;
				bottomBtn1.visible = false;
			}
			
			
			
		}else{
			bottomBtn1.visible = true;
			bottomBtn2.visible = true;
			bottomBtn1.txt = Datas.getArString("Common.Scout");
			bottomBtn1.OnClick = onScoutBtnClick;
			
			bottomBtn2.txt = Datas.getArString("Common.Attack");
			bottomBtn2.OnClick = onAttackBtnClick;
//		    bottomBtn2.txt = Datas.getArString("Common.Collect");
//			bottomBtn2.OnClick = onCollectBtnClick;

		}
		
		//set label1
		if( detailInfo.userName == "" ){
//			topRightBtn.visible = false;
			setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
			label1Btn.visible = false;
			carmotPlayerBtn.visible = false;
			label1.txt = Datas.getArString("Common.Unoccupied");
		}else{
//			topRightBtn.visible = _Global.INT32( slotInfo["tileUserId"] ) != data.tvuid();
			moveCityIcon.SetVisible(false);
			moveCityBg.SetVisible(false);
			if( _Global.INT32( slotInfo["tileUserId"] ) != data.tvuid() ){
				setTopRightBtn( TOP_RIGHT_MAIL_BTN, true );
			}else if( _Global.INT32(slotInfo["tileType"]) == Constant.TileType.PLAIN && cityWaitingBuild() ){
				setTopRightBtn( TOP_RIGHT_BUILDCITY_BTN, true );
			}else{
				setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
			}
			label1Btn.visible = true;
			label1Btn.txt = /*Datas.getArString("Common.General") + " " + */detailInfo.userName;
			label1.txt = "";
		}
		
		bogDescLabel.visible = false;
		
		bookmarkBtn.visible = true;
		l_bookmark.SetVisible(true);
		nextBtn.visible = true;
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = false;
		leagueIcon.visible = false;
		setLabelIcon(tileTexture, false);
		setEmblem(null, false);
		if(WildernessMgr.instance().isConquedWild(_Global.INT32(slotInfo["xCoord"].Value),_Global.INT32(slotInfo["yCoord"].Value)) && WildernessMgr.instance().canTileSurvey(_Global.INT32(slotInfo["tileType"])))
		{
			var wvo:WildernessVO = WildernessMgr.instance().getWilderness(_Global.INT32(slotInfo["tileId"].Value));
			if(wvo.tileStatus == Constant.WildernessState.DURINGCD)
				label3.txt = Datas.getArString("Common.RecoveryTime") + ": " + _Global.timeFormatShortStr(wvo.timeRemaining,true);
			else
				label3.txt = (wvo.inSurvey == 0? Datas.getArString("OpenPalace.ReadyToSurvey") : Datas.getArString("Common.Surveying"));
		}
		else if(WildernessMgr.instance().canTileSurvey(_Global.INT32(slotInfo["tileType"])))
		{
			label3.txt = Datas.getArString("Common.ConquerToSurvey");	
		}
		else
		{
			label3.txt = Datas.getArString("Common.CannotSurvey");
		}
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(!collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			carmotBtn.visible = false;
			carmotNumLabel.visible = false;
			carmotBtnHelp.visible = false;
			
			label2.txt = Datas.getArString("Common.Might") + ": " + detailInfo.might;		
			label4.txt = Datas.getArString("Common.Alliance") + ": " + detailInfo.allianceName;
			label5.txt = Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": " + detailInfo.allianceDip;
		}
		else
		{
			nextBtn.visible = false;
			carmotBtnHelp.visible = true;
			carmotBtnHelp.OnClick = onCarmotBtnHelp;

			originalBookMark = collectionResourcesMgr.GetResourcesTileName(key);
				label4.visible = false;
				label5.visible = false;
				
				if(collectionResourcesMgr.collectResources.ContainsKey(key))
				{
					curCarmotNum = _Global.INT64(collectionResourcesMgr.collectResources[key].resourcesCount);
				}else curCarmotNum=0;		
				
				label3.visible = false;	
				label2.visible = false;
			carmotNumLabel.visible = true;
				
				carmotBtn.visible = true;
				carmotBtn.mystyle.normal.background = collectionResourcesMgr.GetTilePopUpIcon(key);
	//			label2.mystyle.normal.background = TextureMgr.instance().LoadTexture("resource_Carmot_icon", TextureType.MAP17D3A_NEWRESOURCES);
				bottomBtn1.visible = false;
				bottomBtn2.visible = false;
				bottomBtn3.visible = true;
									
				var resourceType : int = collectionResourcesMgr.GetResourcesType(key);
				if( resourceType ==  Constant.CollectResourcesType.CARMOT)
				{
					bottomBtn3.txt = Datas.getArString("Newresource.tile_button_gather");
				}else{
					bottomBtn3.txt = Datas.getArString("Newresource.CollectButton");
				}
				bottomBtn3.OnClick = onCollectBtnClick;
				//当前地块只要有一个mach的状态为2，就需要更新地块carmot数量，否则不需要更新
				isUpdateCarmot = false;
				
				var isStatuesTwo:boolean=false;//1 and 2 status ,select 2;
				
				//user name
				if(collectionResourcesMgr.collectResources[key].tileResourceInfo != null)
				{
					var occupant : HashObject = collectionResourcesMgr.collectResources[key].tileResourceInfo;
					
					isStatuesTwo=true;
					var cityId = _Global.INT32( occupant["fromCityId"]) ;
					var allianceId:int = _Global.INT32( occupant["fromAllianceId"] );
					var seed:HashObject = GameMain.instance().getSeed();
					var i:int;
					var mapMemCache:MapMemCache = MapMemCache.instance();
					
					if(occupant["userInfo"]!=null){
						tileUserInfo =occupant["userInfo"];
					}else tileUserInfo = mapMemCache.getUserInfoData("u" + occupant["fromPlayerId"]);
						if( tileUserInfo != null ){
						detailInfo.tileUserId=_Global.GetString(occupant["fromPlayerId"]);
					detailInfo.userName = tileUserInfo["n"].Value;
					detailInfo.might = _Global.NumFormat( _Global.INT64(tileUserInfo["m"]));//System.Convert.ToInt64(tileUserInfo["m"], 10) );
					detailInfo.userLevel = tileUserInfo["t"].Value; //user level
			
					if( tileUserInfo["a"] != null ){
						var a:int = _Global.INT32(tileUserInfo["a"]);
						if( a!=0 ){
							var	allianceData:HashObject = mapMemCache.getAllianceInfoData("a" + a);
							if( allianceData ){
								detailInfo.allianceName = allianceData["allianceName"].Value;//allianceNames["a" + a];
								detailInfo.allianceLeague = _Global.INT32(allianceData["allianceLeague"]);
							}
						}
					}
			
					if( tileUserInfo["p"] != null ){
						detailInfo.avatar = tileUserInfo["p"].Value;
					}
					if(tileUserInfo["af"] != null)
					{
						detailInfo.avatarFrame = tileUserInfo["af"].Value;
					}
					if( tileUserInfo["b"] != null ){
						detailInfo.badge = tileUserInfo["b"].Value;
					}
					if( tileUserInfo["e"] != null ){
						detailInfo.allianceEmblem = new AllianceEmblemData();
						JasonReflection.JasonConvertHelper.ParseToObjectOnce(detailInfo.allianceEmblem, tileUserInfo["e"]);
					}
					
					var own1:int = own(cityId );
					if( own1 >= 0 ){
						detailInfo.owner = own1;
					} else if(allianceId && seed["allianceDiplomacies"] && seed["allianceDiplomacies"]["allianceId"]) {
					
						if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"])) { // they're in the player's alliance
							detailInfo.owner = DetailInfo.OWNER_SAME_ALLIANCE;
						}
						else 
						{
							var alliances1:Array = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
							for(i = 0; i<alliances1.length; i++)
							{
								if(allianceId == _Global.INT32((alliances1[i] as HashObject)["allianceId"]))
								{
									detailInfo.owner = DetailInfo.OWNER_FRIENDLY_ALLIANCE;
									detailInfo.allianceDip = Datas.getArString("Alliance.relationFriendly");
									break;
								}
							}
						}
					}
			
					carmotLoadLabel.visible = true;	 
					
					carmotCollectInfo=new CarmotCollectInfo();
					carmotCollectInfo.allNum=_Global.INT64(collectionResourcesMgr.collectResources[key].resourcesCount);
					carmotCollectInfo.resourceType = _Global.INT32(collectionResourcesMgr.collectResources[key].resourcesType);
					carmotCollectInfo.curNum=0;
					carmotCollectInfo.fromPlayerId=_Global.INT32(occupant["fromPlayerId"]);
					carmotCollectInfo.begainTime=_Global.INT64(occupant["marchUnixTime"]);
					carmotCollectInfo.endTime=_Global.INT64(occupant["destinationUnixTime"]);
					carmotCollectInfo.speed=_Global.FLOAT(occupant["carmotCollectSpeed"]);//per second can get carmot num
					carmotCollectInfo.speedAdd=_Global.FLOAT(occupant["heroCarmotSpeed"])/3600;//per second can get carmot num
					carmotCollectInfo.marchLoad=_Global.INT64(occupant["marchLoad"]);
					
					var buffs : HashObject = occupant["carmotBuffInfo"];
					var buffsCount : int = _Global.GetObjectValues(buffs).Length;
					for(var k : int = 0; k < buffsCount ;k++)
					{
						var buff : HashObject = buffs[_Global.ap + k];
						var buffInfo : CarmotBuffInfo = new CarmotBuffInfo();
						buffInfo.buffType = _Global.INT32(buff["buffType"].Value);
						buffInfo.buffBeginTime = _Global.INT64(buff["startTime"].Value);
						buffInfo.buffEndTime = _Global.INT64(buff["endTime"].Value);
						buffInfo.buffSpeedAdd = _Global.FLOAT(buff["bonus"].Value) * carmotCollectInfo.speed;
						
						carmotCollectInfo.buffList.Add(buffInfo);
					}
					
					bottomBtn3.visible = false;
					isUpdateCarmot = true;
						
					strangerCarmot();
					isMyCarmot =false;
					isSameAllianceCarmot =false;
					isStrangerCarmot=true;
							

					var own:int = own(cityId );
					if( own >= 0 )
					{
							tileUserInfo = mapMemCache.getUserInfoData("u" + _Global.INT32(seed["player"]["userId"].Value));
							if( tileUserInfo != null )
							{
							detailInfo.tileUserId=occupant["fromPlayerId"].Value;
							detailInfo.userName = tileUserInfo["n"].Value;
							detailInfo.might = _Global.NumFormat( _Global.INT64(tileUserInfo["m"]));//System.Convert.ToInt64(tileUserInfo["m"], 10) );
							detailInfo.userLevel = tileUserInfo["t"].Value; //user level
				
							if( tileUserInfo["a"] != null )
							{
									var a1:int = _Global.INT32(tileUserInfo["a"]);
									if( a1!=0 ){
										var	allianceData1:HashObject = mapMemCache.getAllianceInfoData("a" + a1);
										if( allianceData1 ){
											detailInfo.allianceName = allianceData1["allianceName"].Value;//allianceNames["a" + a];
											detailInfo.allianceLeague = _Global.INT32(allianceData1["allianceLeague"]);
										}
									}
							}
								
							if( tileUserInfo["p"] != null ){
								detailInfo.avatar = tileUserInfo["p"].Value;
							}
							if(tileUserInfo["af"] != null)
							{
								detailInfo.avatarFrame = tileUserInfo["af"].Value;
							}
							if( tileUserInfo["b"] != null ){
								detailInfo.badge = tileUserInfo["b"].Value;
							}
							if( tileUserInfo["e"] != null ){
								detailInfo.allianceEmblem = new AllianceEmblemData();
								JasonReflection.JasonConvertHelper.ParseToObjectOnce(detailInfo.allianceEmblem, tileUserInfo["e"]);
							}
							
							var own2:int = own(cityId );
							if( own2 >= 0 )
							{
								detailInfo.owner = own2;
							} 
							else if(allianceId && seed["allianceDiplomacies"] && seed["allianceDiplomacies"]["allianceId"]) 
							{
							
								if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"])) { // they're in the player's alliance
									detailInfo.owner = DetailInfo.OWNER_SAME_ALLIANCE;
								}
								else 
								{
									var alliances2:Array = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
									for(i = 0; i<alliances1.length; i++)
									{
										if(allianceId == _Global.INT32((alliances2[i] as HashObject)["allianceId"]))
										{
											detailInfo.owner = DetailInfo.OWNER_FRIENDLY_ALLIANCE;
											detailInfo.allianceDip = Datas.getArString("Alliance.relationFriendly");
											break;
										}
									}
								}
							}
						}

					inviteBtn.visible = false;
					isMyCarmot =true;
					isSameAllianceCarmot =false;
					isStrangerCarmot=false;
					myCarmot();
				} 
				else if(allianceId && seed["allianceDiplomacies"] && seed["allianceDiplomacies"]["allianceId"])
				{

						if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"])) 
						{ // they're in the player's alliance
	//                 		   detailInfo.owner = DetailInfo.OWNER_SAME_ALLIANCE;
						sameAllianceCarmot();
						isMyCarmot =false;
						isSameAllianceCarmot =true;
						isStrangerCarmot=false;
						}
						else
						{
						var alliances:Array = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
						for(i = 0; i<alliances.length; i++)
						{
							if(allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"]))
							{
	//	                            detailInfo.owner = DetailInfo.OWNER_FRIENDLY_ALLIANCE;
	//	                            detailInfo.allianceDip = Datas.getArString("Alliance.relationFriendly");
	//		                           strangerCarmot();
								isMyCarmot =false;
								isSameAllianceCarmot =true;
								isStrangerCarmot=false;
								strangerCarmot();    
								}
							}
						}
					}	              
				}
				else
				{
					var toX : int = _Global.INT32(slotInfo["xCoord"].Value);
					var toY : int = _Global.INT32(slotInfo["yCoord"].Value);
					if(GameMain.instance().getMapController().IsHaveOtherMarches(toX, toY))
					{
						label1.txt =Datas.getArString("Newresource.tile_state2");
					}
				}
			}				
		}                
		nextBtnDes.visible = true;
//		nextBtn.visible = true;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
	}
	private	function	myCarmot(){
		inviteBtn.visible = false;
		carmotLoadLabel.visible=true;
		bottomBtn3.visible = false;
		tournamentStrip();
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		bookmarkBtn.visible = true;
		carmotBtn.visible = false;
		carmotBtnHelp.visible = true;
		l_bookmark.SetVisible(true);		
		nextBtn.visible = false;
		label1Btn.visible = false;
		carmotPlayerBtn.visible = false;
		bogDescLabel.visible = false;		
		nextBtnDes.visible = false;		
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;		
		nextBtnDes.visible = false;		
		preBtnSave.visible = false;
		labelPlayName.visible = false;
		inputTextBookmarkName.visible = false;
		buttonHostile.visible = false;
		buttonFavorite.visible = false;
		buttonFriendly.visible = false;
		shareBtn.visible = false;
		shareBtn2.visible = false;		
		label1.visible = true;
		label2.visible = false;
		label3.visible = false;
		label4.visible = true;
		label5.visible = true;
		league.visible = false;
		leagueIcon.visible = false;
		bottomBtn1.txt = Datas.getArString("Newresource.tile_button_view");
		bottomBtn1.OnClick = onViewCarmotTroopClick;
		bottomBtn2.txt = Datas.getArString("Newresource.tile_button_gohome");
		bottomBtn2.OnClick = onGoHomeBtnClick;
		
		carmotBtn.visible = true;
		
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		carmotBtn.mystyle.normal.background = collectionResourcesMgr.GetTilePopUpIcon(key);
		label1.txt =Datas.getArString("Newresource.tile_state3") +" "+  detailInfo.userName;
		label4.txt = "";
		label5.txt = "";
	}
	
	private	function	sameAllianceCarmot(){
		carmotLoadLabel.visible=false;
	bottomBtn3.visible = false;
		tournamentStrip();
		topRightBtn.visible = false;
		inviteBtn.visible = false;
		carmotBtnHelp.visible = true;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		bookmarkBtn.visible = true;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(true);
		nextBtn.visible = false;
		bogDescLabel.visible = false;
		
		bottomBtn1.visible = false;
		bottomBtn2.visible = false;
		
//		label1Btn.visible = true;
		carmotPlayerBtn.visible = true;
		label1.visible = true;
		label2.visible = false;
		label3.visible = false;
		label4.visible = true;
		label5.visible = true;
		league.visible = false;
		leagueIcon.visible = false;
		nextBtnDes.visible = true;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
		lblbgFrendly.visible = true;
		lblbgFrendly.visible = true;
		lblbgHostile.visible = true;
		lblTypeTips.visible = true;
		
//		var arStrings:Object = Datas.instance().arStrings();
//		bottomBtn1.txt = Datas.getArString("Common.Transport");
//		bottomBtn2.txt = Datas.getArString("Common.Reinforce");
//		
//		bottomBtn1.OnClick = onTransportBtnClick;
//		bottomBtn2.OnClick = onReinforceBtnClick;

//		setLabelIcon(detailInfo.avatar, true);
//		setEmblem(detailInfo.allianceEmblem, true);
		carmotBtn.visible = true;
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		carmotBtn.mystyle.normal.background = collectionResourcesMgr.GetTilePopUpIcon(key);
		
//		var canInvite:boolean = Alliance.getInstance().CanInviteUser(_Global.INT32(detailInfo.tileUserId), detailInfo.allianceId);
//		inviteBtn.visible = canInvite;
//		inviteBtn.SetDisabled(!canInvite);
//		inviteBtn.OnClick = OnInviteBtn;
//		inviteBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_invite_normal",TextureType.BUTTON);
//		inviteBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_invite_down",TextureType.BUTTON);
//
//		if (inviteBtn.visible) {
//			label1Btn.rect.width = 300;
//			label1Btn.SetTextClip(detailInfo.userName, "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")");
//		} else {
		label1.txt =Datas.getArString("Newresource.tile_state3");
		carmotPlayerBtn.txt =detailInfo.userName;// detailInfo.userName + "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")";
//		}

		label4.txt = "";
		label5.txt = "";
		league.txt = Datas.getArString("PVP.TileLeagueTitle") + " " + Datas.getArString("LeagueName.League_"+detailInfo.allianceLeague);
		leagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(detailInfo.allianceLeague),TextureType.DECORATION);
		
	}
	
	private	function	strangerCarmot(){
		carmotLoadLabel.visible=false;
	
		carmotBtnHelp.visible = true;
		carmotBtnHelp.OnClick = onCarmotBtnHelp;
		tournamentStrip();
		nextBtn.visible = false;
		bogDescLabel.visible = false;
		
//		topRightBtn.visible = true;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		bookmarkBtn.visible = true;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(true);
		label1Btn.visible = false;
		carmotPlayerBtn.visible = true;
		
		label1.visible = true;
		label2.visible = false;
		label3.visible = false;
		label4.visible = false;
		label5.visible = false;
		league.visible = false;
		leagueIcon.visible = false;
		topRightBtn.visible = false;
		l_topRight.visible = false;
		
		bottomBtn1.visible = false;
		bottomBtn2.visible = false;
		
		nextBtnDes.visible = false;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
//		var arStrings:Object = Datas.instance().arStrings();
//		bottomBtn1.txt = Datas.getArString("Common.Scout");
		bottomBtn3.visible = true;
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		carmotBtn.mystyle.normal.background = collectionResourcesMgr.GetTilePopUpIcon(key);
		var resourceType : int = collectionResourcesMgr.GetResourcesType(key);
		if( resourceType ==  Constant.CollectResourcesType.CARMOT)
		{
			bottomBtn3.txt = Datas.getArString("Newresource.tile_button_gather");
		}else{
			bottomBtn3.txt = Datas.getArString("Newresource.CollectButton");
		}		
//		bottomBtn1.OnClick = onScoutBtnClick;
		bottomBtn2.OnClick = onCollectBtnClick;
		
		carmotBtn.visible = true;
		
		var canInvite:boolean = Alliance.getInstance().CanInviteUser(_Global.INT32(detailInfo.tileUserId), detailInfo.allianceId);
		inviteBtn.visible = false;
		inviteBtn.SetDisabled(false);
		inviteBtn.OnClick = OnInviteBtn;
		inviteBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_invite_normal",TextureType.BUTTON);
		inviteBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_invite_down",TextureType.BUTTON);

		if (inviteBtn.visible) {
			carmotPlayerBtn.rect.width = 220;
			carmotPlayerBtn.SetTextClip(detailInfo.userName, "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")");
		} else {
			carmotPlayerBtn.txt = detailInfo.userName;// + "(" + Datas.getArString("Common.Lv") + detailInfo.userLevel + ")";
		}
		label1.visible = true;
		label1.txt =Datas.getArString("Newresource.tile_state3");//  +" "+   detailInfo.userName;
//		setLabelIcon(detailInfo.avatar, true);
//		setEmblem(detailInfo.allianceEmblem, true);	
	}
	public	function	bog(){
		tournamentStrip();
		bottomBtn1.visible = false;
		bottomBtn2.visible = false;
		
		label1Btn.visible = false;
		carmotPlayerBtn.visible = false;
		label2.visible = false;
		label3.visible = false;
		label4.visible = false;
		label5.visible = false;
		nextBtn.visible = false;
		league.visible = false;
		leagueIcon.visible = false;
//		topRightBtn.visible = false;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		bookmarkBtn.visible = false;
		carmotBtn.visible = false;
		
		l_bookmark.SetVisible(false);
		label1.visible = true;
		bogDescLabel.visible = true;
		
		var	data:Datas = Datas.instance();
//		var arStrings:Object = data.arStrings();
		
		//label1.txt = Datas.getArString("Common.Coordinates") + ": " + detailInfo.x + "," + detailInfo.y + " -" + detailInfo.province;
		setLabelIcon(detailInfo.avatar, detailInfo.avatarFrame, true);
		setEmblem(detailInfo.allianceEmblem, true);
		label1.txt = "";
		labelCoor.txt = detailInfo.x + "," + detailInfo.y + " -" + detailInfo.province;
		bogDescLabel.txt = Datas.getArString("MapView.BogDesc");
		
		nextBtnDes.visible = false;
		nextBtn.visible = false;
		
		preBtnSave.visible = false;
		labelPlayName.visible = false;
		inputTextBookmarkName.visible = false;
		buttonHostile.visible = false;
		buttonFavorite.visible = false;
		buttonFriendly.visible = false;
		
		//boss fight
		if(GameMain.instance().isBoss( detailInfo.x,detailInfo.y))
		{
			bottomBtn1.visible = true;
			bottomBtn2.visible = true;
			bottomBtn1.txt = Datas.getArString("Common.Scout");
			bottomBtn1.OnClick = onScoutBtnClick;
			
			bottomBtn2.txt = Datas.getArString("Common.Attack");
			bottomBtn2.OnClick = onAttackBtnClick;
			
			title.txt =  Datas.getArString("Common.Bog")  + "(" + GameMain.instance().getBossName() + ")";
			bogDescLabel.visible = false;
				
			var curTime:long = GameMain.unixtime();
			var eventStartTime:long = GameMain.instance().getBossStartTime();
			var eventEndTime:long = GameMain.instance().getBossEndTime();
			if(curTime >= eventStartTime && curTime <= eventEndTime)
			{
				label2.txt = Datas.getArString("EventCenter.EndsIn") + "  " + _Global.timeFormatShortStr(eventEndTime-curTime,true);
				label2.SetVisible(true);
				//label4.txt = String.Format(Datas.getArString("Btb.Numberofattacks"), GameMain.instance().getBossAttackCount());
				label4.txt = String.Format("Number of attacks {0}", GameMain.instance().getBossAttackCount());
				label4.SetVisible(true);
			}	
			else
			{
				bottomBtn1.visible = false;
				bottomBtn2.visible = false;
				title.txt =  Datas.getArString("Common.Bog");
				bogDescLabel.visible = true;
			}
			
		}
	}
	
	private	function	barbarian(tileLeve:int){
		
		carmotBtnHelp.OnClick = onCampBtnHelp;
		tournamentStrip();
//		topRightBtn.visible = false;
		setTopRightBtn( TOP_RIGHT_MAIL_BTN, false );
		label1Btn.visible = false;
		carmotPlayerBtn.visible = false;
		bogDescLabel.visible = false;
		
		bookmarkBtn.visible = true;
		l_bookmark.SetVisible(true);
		nextBtn.visible = true;
		bottomBtn1.visible = true;
		bottomBtn2.visible = true;
		
		label1.visible = true;
		label2.visible = true;
		label3.visible = true;
		label4.visible = true;
		label5.visible = true;
		league.visible = false;
		leagueIcon.visible = false;
//		var arStrings:Object = Datas.instance().arStrings();
		bottomBtn1.txt = Datas.getArString("Common.Scout");
		bottomBtn1.OnClick = onScoutBtnClick;
		
		bottomBtn2.txt = Datas.getArString("Common.Attack");
		bottomBtn2.OnClick = onCampAttackBtnClick;
		
		var gameData:HashObject = Datas.instance().getGameData();

		setLabelIcon(tileTexture, false);
		setEmblem(null, false);
		label1.txt = Datas.getArString("Common.TerroristControlled");
		label2.txt = Datas.getArString("Common.Might") + ": " + _Global.NumFormat(_Global.INT64(gameData["npcpowerlevels"]["l" + detailInfo.tileLevel]));
		label3.txt = "";
		label4.txt = "";	
		if(tileLeve>10){
			carmotBtnHelp.visible = true;			
			label1.txt = Datas.getArString("Common.TerroristControlled2");
			label3.txt = Datas.getArString("MapView.BarbarianCityDesc3",[" "]);
			label5.txt = Datas.getArString("MapView.BarbarianCityDesc2",[Datas.instance().getPicCampRemainTimes()]);
		}else{
			label5.txt = Datas.getArString("PictInfo.DailyTimes",[Datas.instance().getPicCampAttackTimes()]);
		}
		
		
		nextBtnDes.visible = true;
		nextBtn.visible = true;
		
		preBtnSave.visible = false;
		labelPlayName.visible = true;
		inputTextBookmarkName.visible = true;
		buttonHostile.visible = true;
		buttonFavorite.visible = true;
		buttonFriendly.visible = true;
		
	}
	
	private function getCampTileResource(tileId:int)
	{
		var okFunc:Function=function(result:HashObject){
			if(result["ok"].Value){
				var resourceData:float = _Global.FLOAT(result["data"]);
				label3.txt = Datas.getArString("MapView.BarbarianCityDesc3",[resourceData]);
			}
		};
		
		UnityNet.getPictCampResource(tileId,okFunc,null);
	}
	
	private	function	cityWaitingBuild():boolean{
		waitingBuildCity = CityQueue.instance().CheckNewCtiyRequirement();
		return	waitingBuildCity != null;
	}
	
	private	function	setTopRightBtn( type:int, visible:boolean ){
		topRightBtn.visible = visible;
		l_topRight.visible = visible;
		if( !visible || type == topRightBtnType){
			return;
		}
		
		topRightBtnType = type;
		
		switch( type ){
			case	TOP_RIGHT_MAIL_BTN:
				topRightBtn.OnClick = onMailBtnClick;
				topRightBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_mail_small_normal",TextureType.BUTTON);
				topRightBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_mail_small_down",TextureType.BUTTON);
				break;
				
			case	TOP_RIGHT_BUILDCITY_BTN:
				topRightBtn.OnClick = onBuildCityBtnClick;
				topRightBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_add_city_normal",TextureType.BUTTON);
				topRightBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_add_city_down",TextureType.BUTTON);
				break;
			case	TOP_RIGHT_MARCHLINE:
				topRightBtn.OnClick = onShowAvaMarchlineInfo;
				topRightBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_showmarchline_normal2",TextureType.BUTTON);
				topRightBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_showmarchline_normal2",TextureType.BUTTON);
				break;
		}
		
	}
	
	private function setEmblem(data : AllianceEmblemData, visible : boolean) {
		emblem.visible = visible && (null != data) && (!data.IsEmpty);
		emblem.Data = data;
		emblem.rect = new Rect(
			labelIcon.rect.xMax - 25,
			labelIcon.rect.yMax - 39.6,
			36,
			45
			);
		emblem.UpdateRects();
	}
	
	private function setLabelIcon(tileName : String, tileFrameName : String, visible : boolean) {
		labelIcon.visible = visible;
		labelIconFrame.visible = visible;
		setLayoutForIcon(visible);
		
		if (visible) {
			labelIcon.useTile = true;
			labelIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(tileName));
			if(tileFrameName != "img0" && tileFrameName != "")
			{
				labelIconFrame.useTile = true;
				labelIconFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(tileFrameName);
			}
			else
			{
				labelIconFrame.useTile = false;
			}
		}
	}
	
	private function setLabelIcon(tex : Texture, visible : boolean) {
		labelIcon.visible = visible;
		labelIconFrame.visible = visible;
		setLayoutForIcon(visible);
		
		if (visible) {
			labelIcon.useTile = false;
			labelIcon.mystyle.normal.background = tex;
			labelIconFrame.useTile = false;
		}
	}
	
	private function setLayoutForIcon(visible : boolean) {
		var left : float = visible ? 140 : 0;
		label1Btn.rect.x = left;
		label1.rect.x = left;
		label2.rect.x = left;
		label3.rect.x = left;
		label4.rect.x = left;
		label5.rect.x = left;
//		labelCoor.rect.x = left;
		bogDescLabel.rect.x = left;
	}
	
	private	function	getDetailInfo( slotInfo:HashObject ):DetailInfo{
		var mapMemCache:MapMemCache = MapMemCache.instance();
//		var arStrings:Object = Datas.instance().arStrings();
//		var tileUserInfo:Object = mapMemCache.getUserInfoData("u" + slotInfo["tileUserId"]);//userInfo["u" + slotInfo["tileUserId"]];
		var allianceId:int = _Global.INT32( slotInfo["tileAllianceId"] );
		var cityId = _Global.INT32( slotInfo["tileCityId"]) ;
		var seed:HashObject = GameMain.instance().getSeed();
		tileUserInfo = mapMemCache.getUserInfoData("u" + slotInfo["tileUserId"].Value);//userInfo["u" + slotInfo["tileUserId"]];
		var i:int;
		detailInfo.reset();
		detailInfo.tileUserId = slotInfo["tileUserId"].Value;
		detailInfo.tileLevel = slotInfo["tileLevel"].Value;//tile level


		/*记录点击位置*/
		detailInfo.x = slotInfo["xCoord"].Value;
		detailInfo.y = slotInfo["yCoord"].Value;

		detail[0] = detailInfo.x;
		detail[1] = detailInfo.y;


		var provinceId:String = slotInfo["tileProvinceId"].Value;	
		detailInfo.province = Datas.getArString("provinceName.p" + provinceId);
		detailInfo.allianceDip = Datas.getArString("Alliance.relationNeutral");
		detailInfo.allianceName = Datas.getArString("Common.None");
		detailInfo.owner = DetailInfo.OWNER_STRANGER;
		detailInfo.tileCityId = cityId;
		detailInfo.allianceId = allianceId;
			
		if( tileUserInfo != null ){
			detailInfo.userName = tileUserInfo["n"].Value;
			detailInfo.might = _Global.NumFormat( _Global.INT64(tileUserInfo["m"]));//System.Convert.ToInt64(tileUserInfo["m"], 10) );
			detailInfo.userLevel = tileUserInfo["t"].Value; //user level
			
			if( tileUserInfo["a"] != null ){
				var a:int = _Global.INT32(tileUserInfo["a"]);
				if( a!=0 ){
					var	allianceData:HashObject = mapMemCache.getAllianceInfoData("a" + a);
					if( allianceData ){
						detailInfo.allianceName = allianceData["allianceName"].Value;//allianceNames["a" + a];
						detailInfo.allianceLeague = _Global.INT32(allianceData["allianceLeague"]);
					}
				}
			}
			
			if( tileUserInfo["p"] != null ){
				detailInfo.avatar = tileUserInfo["p"].Value;
			}
			if(tileUserInfo["af"] != null)
			{
				detailInfo.avatarFrame = tileUserInfo["af"].Value;
			}
			if( tileUserInfo["b"] != null ){
				detailInfo.badge = tileUserInfo["b"].Value;
			}
			if( tileUserInfo["e"] != null ){
				detailInfo.allianceEmblem = new AllianceEmblemData();
				JasonReflection.JasonConvertHelper.ParseToObjectOnce(detailInfo.allianceEmblem, tileUserInfo["e"]);
			}
			
			var own:int = own(cityId );
			if( own >= 0 ){
				detailInfo.owner = own;
			} else if(allianceId && seed["allianceDiplomacies"] && seed["allianceDiplomacies"]["allianceId"]) {
			
				if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"])) { // they're in the player's alliance
					detailInfo.owner = DetailInfo.OWNER_SAME_ALLIANCE;
				}
				else 
				{
					var alliances:Array = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
					for(i = 0; i<alliances.length; i++)
					{
						if(allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"]))
						{
							detailInfo.owner = DetailInfo.OWNER_FRIENDLY_ALLIANCE;
							detailInfo.allianceDip = Datas.getArString("Alliance.relationFriendly");
							break;
						}
					}
				}
			}
			
			detailInfo.allianceDip = AllianceVO.getAllianceDiplomacy(cityId,allianceId);
		}
		
		return detailInfo;
	}
	
	private	function	onMailBtnClick(params:Object){
		dismiss();
		
		var _obj:Object = {"subMenu":"compose", "name":detailInfo.userName};
		MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
	}
	
	private function OnInviteBtn(params:Object)
	{
		Alliance.getInstance().DoInviteUser(detailInfo.userName, _Global.INT32(detailInfo.tileUserId));
		UnityNet.SendAllianceInvitationClickBI(UserDetailInfo.ViewFromTilePopUp);
	}
	
	private	function	onBuildCityBtnClick( params:Object ){
		dismiss();
		if( waitingBuildCity.bCreat ){
			MenuMgr.getInstance().PushMenu("CreatNewCity",{ "plainId":slotInfo["tileId"].Value,"buildCity":waitingBuildCity}, "trans_zoomComp");
		}else{
			MenuMgr.getInstance().PushMenu("PlayerInfo", null);
			MenuMgr.getInstance().getMenuAndCall("PlayerInfo", function(menu : KBNMenu){
				var playerInfo:PlayerInfo = menu as PlayerInfo;
				if(playerInfo != null)
					playerInfo.ViewCity(waitingBuildCity.citySequence);
			});
		}
	}
	
	private	function	onBookmarkSaveBtnClick(params:Object){
		
        var name:String = inputTextBookmarkName.txt;
        InputText.closeActiveInput();
        if (CheckBookmarkName(name) != BadBookmarkName.None) {
            return;
        }
		dismiss();
		var okCallBack:Function = function(){
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Bookmark_AddOk"));
		};
		var types:Array = new Array();
		types[0] = bookIsFavorite ? 1:0;
		types[1] = bookIsFriendly ? 1:0;
		types[2] = bookIsHostile ? 1:0;
		Bookmark.instance().setLocation(slotInfo["tileId"].Value, name, slotInfo["xCoord"].Value, slotInfo["yCoord"].Value,types, okCallBack);
	}
	private var showMarchShare:boolean=false;
	private	function	onNextBtnClick(params:Object){
		descLabel.txt = detailInfo.desc;
		nc.push(comUIObj2);
		carmotBtn.visible = false;
	
		showMarchShare=false;
		
	}
	
	private function	onBookmarkBtnClick(params:Object){
		showMarchShare=false;
		nc.push(comUIObj3);
		inputTextBookmarkName.txt = originalBookMark;
		inputTextBookmarkName.inputDoneFunc = inputDoneFunc;
		inputTextBookmarkName.hidInput = false;
		labelPlayName.txt = Datas.getArString("Common.PlayerInfo_Title") + ":" + detailInfo.userName;
		bottomBtn1.visible = false;
		bottomBtn2.visible = false;
	
		bottomBtn3.visible = true;	
		bottomBtn3.txt = Datas.getArString("Common.Save_Button");
		bottomBtn3.OnClick = onBookmarkSaveBtnClick;
		bookIsFavorite = false;
		bookIsFriendly = false;
		bookIsHostile = false;
		
		lblTypeTips.txt = Datas.getArString("bookmark.SelectType");
		
		bookMarkTypeButtomsSetting();
		bookmarkBtn.visible = false;
		l_bookmark.SetVisible(false);
		inviteBtn.visible = false;
		inviteBtn.SetDisabled(true);
		title.txt = "(" + slotInfo["xCoord"].Value + "," + slotInfo["yCoord"].Value + ")";
		carmotBtnHelp.visible = false;
		
	}
	
	protected function inputDoneFunc(newStr:String):String
	{
        var bbn : BadBookmarkName = CheckBookmarkName(newStr);
		if(bbn == BadBookmarkName.BadSymbols)
		{	
			inputTextBookmarkName.txt = originalBookMark;
			ErrorMgr.instance().PushError("",Datas.getArString("bookmark.BookmarkName1"));
			return originalBookMark;
		}
		else if(bbn == BadBookmarkName.BigLength)
		{
			inputTextBookmarkName.txt = originalBookMark;
			ErrorMgr.instance().PushError("",Datas.getArString("bookmark.BookmarkName2"));
			return originalBookMark;
		}
		else if(originalBookMark != newStr)
		{
			inputTextBookmarkName.txt = newStr;
			return newStr;
		}
		else
		{
			return newStr;
		}
	}
	
	private function	onPreBtnSaveClick(params:Object){
		nc.pop();
	}
	
	private function onCarmotSpeedClick(params:Object)
	{
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			var info : CollectResourcesInfo = collectionResourcesMgr.collectResources[key];
			MenuMgr.getInstance().PushMenu("MarchCarmotBuff", info, "trans_zoomComp");
		}		
	}
	
	private function	onCarmotBtnHelp(params:Object)
	{
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			if(collectionResourcesMgr.collectResources[key].resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "carmot", "trans_zoomComp");
			}
			else
			{
				MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "Newresource", "trans_zoomComp");
			}			
		}
	}
	private function	onCampBtnHelp(params:Object){

		MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "camp", "trans_zoomComp");

	}
	private	function	onPreBtnClick(params:Object){
	var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(!collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			carmotBtn.visible = false;
		}
		else
		{
			carmotBtn.visible = true;
		}
		nc.pop();
		showMarchShare=true;
	}
	
	private function getUserInfo() : UserDetailInfo
	{
		var userinfo = new UserDetailInfo();
		userinfo.userId = detailInfo.tileUserId;
		userinfo.userName = detailInfo.userName;
		userinfo.avatar = detailInfo.avatar;
		userinfo.avatarFrame = detailInfo.avatarFrame;
		userinfo.badge = detailInfo.badge;
		userinfo.userLevel = detailInfo.userLevel;
		userinfo.might = detailInfo.might;
		userinfo.allianceName = detailInfo.allianceName;
		userinfo.allianceDip = detailInfo.allianceDip;
		userinfo.allianceEmblem = detailInfo.allianceEmblem;
		userinfo.desc = detailInfo.desc;
		userinfo.allianceId = _Global.ToString(detailInfo.allianceId);
		userinfo.viewFrom = UserDetailInfo.ViewFromTilePopUp;
		
		return userinfo;
	}
	
	private	function	onLabel1BtnClick(params:Object){
		dismiss();
		
		var userinfo : UserDetailInfo = getUserInfo();
		MenuMgr.getInstance().PushMenu("PlayerProfile", userinfo, "trans_zoomComp");
	}
	
	public	function	onScoutBtnClick(param:Object){
		dismiss();
		
		var	stealthLevel:int = Research.instance().getMaxLevelForType(Constant.Research.STEALTH);
		var slotId:int;
//		var arStrings:Object = Datas.instance().arStrings();
		
		if( stealthLevel == 0 ){
			var cofDlg:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			cofDlg.setLayout(600,400);
			cofDlg.setTitleY(60);
			cofDlg.setContentRect(70,140,0,260);
			cofDlg.setButtonText(Datas.getArString("Common.University"), Datas.getArString("Common.Cancel_Button"));
			
			var title:String = Datas.getArString("Common.Scout") + " (" + slotInfo["xCoord"].Value + ", " + slotInfo["yCoord"].Value + ")";
			var content:String = /*Datas.getArString("Scout.ResearchNeededTitle"] + "\n" + */Datas.getArString("Scout.ResearchNeededDesc");
			var okFunc:System.Action = function(){
				MenuMgr.getInstance().PopMenu("");
				slotId = Building.instance().getPositionForType(Constant.Building.ACADEMY);
				if( slotId  == -1 ){
					ErrorMgr.instance().PushError("",Datas.getArString("Scout.NoUniversityDesc"));
				}else{
                    MenuAccessor.AcademyBuildingChangeStartIndex(1);
					Building.instance().openStandardBuilding(Constant.Building.ACADEMY,slotId);
					//var academyBuildingMenu:AcademyBuilding = MenuMgr.getInstance().getMenu("AcademyBuilding") as AcademyBuilding;
					//academyBuildingMenu.toolBar.selectedIndex = 1;
				}
			};
//			cofDlg.SetAction(content, title, okFunc, null);
			MenuMgr.getInstance().PushConfirmDialog(content, title, okFunc, null);
		}else if (!couldBeScout()){
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_208"));
		}else{
			MenuMgr.getInstance().PushMenu("ScoutMenu", {"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value}, "trans_zoomComp");
		}
	}
	
	public	function	onViewTroopBtnClick( param:Object ){
		dismiss();
		var	tileTroopMenuParam:TileTroopMenuParam = new TileTroopMenuParam();
		tileTroopMenuParam.title = detailInfo.userName + " (" + detailInfo.x + "," + detailInfo.y + ")";
		var okCallback = function(troopList:Array){
			tileTroopMenuParam.troopList = troopList;
			MenuMgr.getInstance().PushMenu("TileTroopMenu",tileTroopMenuParam,"trans_pop");
		};
		Attack.instance().wildernessView(slotInfo["tileId"].Value, okCallback);
	}
	
	public function onViewCarmotTroopClick(param:Object){
		dismiss();
		var	tileTroopMenuParam:TileTroopMenuParam = new TileTroopMenuParam();
		var level:int = 1;
		var key:String = detailInfo.x + "_" + detailInfo.y;
		var collectInfo : CollectResourcesInfo = null;
		if(collectionResourcesMgr.collectResources.ContainsKey(key)){
			try {
				collectInfo = collectionResourcesMgr.collectResources[key];
				level = collectInfo.level;
			} catch (Exception) {
				
			}
		}
		if(collectInfo != null)
		{
			tileTroopMenuParam.isCarmot=true;
			if(collectInfo.resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				tileTroopMenuParam.title = Datas.getArString("Newresource.tile_name",[level]) +" (" + detailInfo.x + "," + detailInfo.y + ")";
			}
			else
			{
				var tileName : String = collectionResourcesMgr.GetResourceName(collectInfo.resourcesType);
				tileTroopMenuParam.title = tileName + "(lv." + level + ")" + " (" + detailInfo.x + "," + detailInfo.y + ")";
			}
		}
		else 
		{
			tileTroopMenuParam.title = Datas.getArString("Newresource.tile_name",[level]) +" (" + detailInfo.x + "," + detailInfo.y + ")";
		}
				
		tileTroopMenuParam.troopList=null;
		tileTroopMenuParam.coordX=detailInfo.x;
		tileTroopMenuParam.coordY=detailInfo.y;
		MenuMgr.getInstance().PushMenu("TileTroopMenu",tileTroopMenuParam,"trans_pop");
	}
	
	public	function	onReinforceBtnClick( param:Object ){
		dismiss();
		if( checkMarch(Constant.MarchType.REINFORCE) ){
			//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.REINFORCE},"trans_zoomComp" );
			MarchDataManager.instance().SetData({"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.REINFORCE});
		}
	};
	
	private	function	onTransportBtnClick( param:Object ){
		dismiss();
		if( checkMarch(Constant.MarchType.TRANSPORT) ){
			//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.TRANSPORT},"trans_zoomComp" );
			MarchDataManager.instance().SetData({"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.TRANSPORT});

		}
	};
	
	public	function	onAttackBtnClick( param:Object ){
		dismiss();
		if (!couldBeAttack()){
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_208"));
		}else 
		if( checkMarch(Constant.MarchType.ATTACK) ){
			//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.ATTACK},"trans_zoomComp" );
			MarchDataManager.instance().SetData({"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.ATTACK});

		}
	};
	
	public	function	onCampAttackBtnClick( param:Object ){
		dismiss();
		if (!couldBeAttack()){
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_208"));
		}else if(Datas.instance().getPicCampRemainTimes()<=0 && _Global.INT32(detailInfo.tileLevel) > 10){
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_258"));
		} else
		if( checkMarch(Constant.MarchType.ATTACK) ){
			//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.ATTACK,"isCamp":1,"tileLevel":slotInfo["tileLevel"].Value},"trans_zoomComp" );
			MarchDataManager.instance().SetData({"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.ATTACK,"isCamp":1,"tileLevel":slotInfo["tileLevel"].Value});
		}
	};

	private	function	onMyCityMarchBtnClick( param:Object ){
		dismiss();
		if( checkMarch(Constant.MarchType.TRANSPORT) ){
			// MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, 
			// 							"types":[Constant.MarchType.TRANSPORT,Constant.MarchType.REINFORCE,Constant.MarchType.REASSIGN], 
			// 							"defaultSelectType":Constant.MarchType.TRANSPORT,"cityId":slotInfo["tileCityId"].Value},"trans_zoomComp");
			MarchDataManager.instance().SetData({"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, 
			"types":[Constant.MarchType.TRANSPORT,Constant.MarchType.REINFORCE,Constant.MarchType.REASSIGN], 
			"defaultSelectType":Constant.MarchType.TRANSPORT,"cityId":slotInfo["tileCityId"].Value}		);			
		}
	};
	
	private function	onShareBtnClick( param:Object ) {
		if( slotInfo["tileId"] != null ) {
			var tileID : int = _Global.INT32( slotInfo["tileId"].Value );
			KBN.TournamentManager.getInstance().requestTileShare( tileID );
		}
	}
	
	private function	onGiveUpBtnClick( param:Object ) {
		if( slotInfo["tileId"] != null ) {
			var tileID : int = _Global.INT32( slotInfo["tileId"].Value );
			
			var confirmStr:String = Datas.getArString("CityactionAbandonprompt.AbandonA").Replace("%1$s","");//%1$s
			MenuMgr.getInstance().PushConfirmDialog(confirmStr,"",function(){
				MenuMgr.getInstance().PopMenu("");
				KBN.TournamentManager.getInstance().requestTileGiveUp( tileID );
			},null);
		}
	}
	
	private	function	checkMarch(type:int):boolean{
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
		
		switch(type)
		{
//			case Constant.MarchType.ATTACK:
			case Constant.MarchType.COLLECT:
			case Constant.MarchType.COLLECT_RESOURCE:
				if(Building.instance().getMaxLevelForType(Constant.Building.GENERALS_QUARTERS,GameMain.instance().getCurCityId() ) <= 0)
				{
					ErrorMgr.instance().PushError("", Datas.getArString("March.Need_GeneralsQuarters") );
					return false;
				}
				break;
		}
				
		return true;
	}
	
	private	function	couldBeAttack():boolean{
		if( slotInfo ) {
			if( slotInfo["tileType"] ) { // World map activity tiles can always be attacked.
				var tileType : int = _Global.INT32( slotInfo["tileType"] );
				if( tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY &&
					tileType <= Constant.TileType.WORLDMAP_LAST ) {
					return true;
				}
			}
		}
		if( tileUserInfo )
		{
			var	w:int = _Global.INT32( tileUserInfo["w"] );
			return w != 2 && w != 3;//w == 2 :beginner protection; w == 3: truce
		}
		return true;
	}
	
	private	function	couldBeScout():boolean{
		if( slotInfo ) {
			if( slotInfo["tileType"] ) { // World map activity tiles can always be scouted.
				var tileType : int = _Global.INT32( slotInfo["tileType"] );
				if( tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY &&
					tileType <= Constant.TileType.WORLDMAP_LAST ) {
					return true;
				}
			}
		}
		if( tileUserInfo )
		{
			var	w:int = _Global.INT32( tileUserInfo["w"] );
			
			return w != 2 && w != 3;//w == 2 :beginner protection; w == 3: truce
		}
		return true;
	}
	
	public function IsDisplaying()
	{
		return mIsDisplaying;
	}
	
	public	function	dismiss(){
		visible = false;
		gameObject.SetActive(false);
		mIsDisplaying = false;
		labelIcon.mystyle.normal.background = null;
		tileTexture = null;
		if( listener ){
			listener.onTileInfoPopUpDismiss();
		}
	}
	public function getmyNacigator():NavigatorController
	{
		return nc;
	}
	
	// temporary for MapController migration, TODO remove these if possible
	public function getBGLabelHeight():float
	{
		return bgLabel.rect.height;
	}
	
	public function setTileSharedOK()
	{
		shareBtn.SetVisible( false );
		shareBtn2.SetVisible( true );
		sharedIcon.SetVisible( false );
	}
	//add new click even for Collect resource.
	private	var	element:QueueItem;
	public	function	onGoHomeBtnClick( param:Object ){
		var cd:ConfirmDialog = MenuMgr.instance.getConfirmDialog();
        cd.setLayout(600, 380);
        cd.setTitleY(120);
        cd.setButtonText(Datas.getArString("Common.OK_Button"), Datas.getArString("Common.Cancel"));
        var okFunc:System.Action = function()
			{
				goHomeAction();
				cd.close();
			};
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			var info : CollectResourcesInfo = collectionResourcesMgr.collectResources[key];
			if(info.resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				MenuMgr.instance.PushConfirmDialog(Datas.getArString("CarmotMarch.ReturnConfirm"), "", okFunc, null);
			}
			else 
			{
				MenuMgr.instance.PushConfirmDialog(Datas.getArString("ResearchCollect.CancelNotice"), "", okFunc, null);
			}
		}       
	}

	private function goHomeAction()
	{
		if(slotInfo==null)
		{
			return;
		}
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			var info : CollectResourcesInfo = collectionResourcesMgr.collectResources[key];
			var marchType : int = info.resourcesType == Constant.CollectResourcesType.CARMOT ? Constant.MarchType.COLLECT : Constant.MarchType.COLLECT_RESOURCE;
			RallyPoint.instance().recall(info.marchId, marchType, info.cityId, null);
		}	
		
		dismiss();
	}

	public	function	onCollectBtnClick( param:Object )
	{
		var key:String = _Global.GetString(slotInfo["xCoord"].Value)+"_"+_Global.GetString(slotInfo["yCoord"].Value);
		if(collectionResourcesMgr.collectResources.ContainsKey(key))
		{
			if(collectionResourcesMgr.collectResources[key].resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				if( checkMarch(Constant.MarchType.COLLECT) ){
				//	MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.COLLECT},"trans_zoomComp" );

					MarchDataManager.instance().SetData(  {"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.COLLECT}     );

				}
			}
			else
			{
				if( checkMarch(Constant.MarchType.COLLECT_RESOURCE) ){
					//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.COLLECT_RESOURCE},"trans_zoomComp" );
					MarchDataManager.instance().SetData( {"x":slotInfo["xCoord"].Value, "y":slotInfo["yCoord"].Value, "type":Constant.MarchType.COLLECT_RESOURCE});


				}
			}			
		}		
	};
}
