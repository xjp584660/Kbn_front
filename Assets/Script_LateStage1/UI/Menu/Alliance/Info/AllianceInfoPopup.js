class AllianceInfoPopup extends PopMenu
{
	public var btnBack:Button;

	/*labels for info*/
	public var labelAllianceName:SimpleLabel;
	public var labelAllianceNameKey:SimpleLabel;
	
	public var labelAllianceLevel:SimpleLabel;
	public var labelAllianceLevelKey:SimpleLabel;
	
	public var labelAllianceFounder:SimpleLabel;
	public var labelAllianceFounderKey:SimpleLabel;
	
	public var labelAllianceLeague:SimpleLabel;
	public var labelAllianceLeagueKey:SimpleLabel;
	
	public var labelAllianceMembersCount:SimpleLabel;
	public var labelAllianceMembersCountKey:SimpleLabel;
	
	public var labelAllianceRanking:SimpleLabel;
	public var labelAllianceRankingKey:SimpleLabel;
	
	public var labelAllianceMight:SimpleLabel;
	public var labelAllianceMightKey:SimpleLabel;
	
	public var labelAllianceRequirementsKey:SimpleLabel;
	public var labelAllianceMightRequired:SimpleLabel;
	public var labelAllianceLevelRequired:SimpleLabel;
	
	public var labelAllianceDesc:SimpleLabel;
	public var labelAllianceDescKey:SimpleLabel;
	
	public  var allianceEmblem:AllianceEmblem;
	public var labelLeagueLevelIcon:Label;
	
	
	public var labelJoinAllianceNotice:Label;
	public var buttonRequestJoin:Button;
	
	@SerializeField
	private var buttonMail2Chancellor : Button;
	
	public var l_ToJoin		:Label;
	public var l_ToJoin_Might:Label;
	public var l_ToJoin_Level:Label;
	
	@SerializeField
	private var m_rectForCenter : Rect;
	@SerializeField
	private var m_rectForLeft : Rect;
	@SerializeField
	private var m_rectForRight : Rect;

	/*division line*/
	public var  line:SimpleLabel;
	//yyyyy
	
	
	public var  line1:SimpleLabel;
	public var  line2:SimpleLabel;
	public var  line3:SimpleLabel;
	public var  line4:SimpleLabel;
	public var  line5:SimpleLabel;
	public var  line6:SimpleLabel;
	public var  line7:SimpleLabel;
	public var  line8:SimpleLabel;
	//yyyyy
	/*loading label*/
	private var waitingLabel : LoadingLabelImpl;
	
	private var currentAllianceId:int = 0;
	private var currentUserId:int = 0;
	
	private var m_allianceName : String;
	
	public function Init()
	{ 
		super.Init();
		waitingLabel = null;
		
		line.setBackground("between line", TextureType.DECORATION);
		line1.setBackground("between line_list_small", TextureType.DECORATION);
		line2.setBackground("between line_list_small", TextureType.DECORATION);
		line3.setBackground("between line_list_small", TextureType.DECORATION);
		line4.setBackground("between line_list_small", TextureType.DECORATION);
		line5.setBackground("between line_list_small", TextureType.DECORATION);
		line6.setBackground("between line_list_small", TextureType.DECORATION);
		line7.setBackground("between line_list_small", TextureType.DECORATION);
		line8.setBackground("between line_list_small", TextureType.DECORATION);
		var	_mColor:Color = new Color(153.0/255, 108.0/255,51.0/255 , 1.0); 
		labelAllianceName.mystyle.normal.textColor = _mColor;
		labelAllianceNameKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceLevel.mystyle.normal.textColor = _mColor;
		labelAllianceLevelKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceFounder.mystyle.normal.textColor = _mColor;
		labelAllianceFounderKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceLeague.mystyle.normal.textColor = _mColor;
		labelAllianceLeagueKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceMembersCount.mystyle.normal.textColor = _mColor;
		labelAllianceMembersCountKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceRanking.mystyle.normal.textColor = _mColor;
		labelAllianceRankingKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceMight.mystyle.normal.textColor = _mColor;
		labelAllianceMightKey.mystyle.normal.textColor = _mColor;
		
		labelAllianceRequirementsKey.mystyle.normal.textColor = _mColor;
		labelAllianceMightRequired.mystyle.normal.textColor = _mColor;
		labelAllianceLevelRequired.mystyle.normal.textColor = _mColor;
		
		labelAllianceDesc.mystyle.normal.textColor = _mColor;
		labelAllianceDescKey.mystyle.normal.textColor = _mColor;
		
		
		
		l_ToJoin.mystyle.normal.textColor = _mColor;
		l_ToJoin.txt = Datas.getArString("Alliance.InfoJoinReqs");
		
		btnBack.OnClick = btnBackClick;
		btnBack.visible = true;
		btnBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_back2_normal", TextureType.BUTTON);
		btnBack.mystyle.active.background = TextureMgr.instance().LoadTexture("button_back2_down", TextureType.BUTTON);
		buttonRequestJoin.OnClick = HandlerRequestToJoin;
		buttonRequestJoin.visible = false;
		buttonMail2Chancellor.txt = Datas.getArString("Alliance.MessageLeader");
		buttonMail2Chancellor.SetVisible(false);
		m_allianceName = "";
	}
	public function btnBackClick():void
	{
		MenuMgr.instance.PopMenu("");
	}
	public function OnPush(param:Object)
	{
		waitingLabel = new LoadingLabelImpl();
		currentUserId = _Global.INT32((param as Hashtable)["userId"]);
		labelJoinAllianceNotice.SetVisible(false);

		var okFunc = function(result:HashObject){
			if(Embassy.instance().isInAlliance())
			{
				labelJoinAllianceNotice.visible = false;
				buttonRequestJoin.visible = false;
			}
			else
			{
				var el:int = Building.instance().getMaxLevelForType(Constant.Building.EMBASSY);
				if(el == 0)
				{
					labelJoinAllianceNotice.visible = true;
					buttonRequestJoin.visible = false;
				}
				else
				{
					labelJoinAllianceNotice.visible = false;
					buttonRequestJoin.changeToGreyNew();
					buttonRequestJoin.visible = true;
				}
			}
			
			var allianceInfo : HashObject = result["userInfo"][_Global.ap + "0"];
			currentAllianceId = _Global.INT32(allianceInfo["allianceId"]);
			m_allianceName = allianceInfo["allianceName"].Value;
			var allianceLeader:String = allianceInfo["leaderName"].Value;
			var allianceMembersCount:String = allianceInfo["number"].Value;
			var allianceRanking:String = allianceInfo["ranking"].Value;
			var allianceMight:String = allianceInfo["alliancemight"].Value.ToString();
			var allianceDesc:String = allianceInfo["allianceDescription"].Value;
			var allianceLevel:String = allianceInfo["level"].Value.ToString();
			var allianceLeague:String = allianceInfo["leagueLevel"].Value.ToString();

			var matchMight:long = _Global.INT32(allianceInfo["mightLimit"]);
			var matchLevel:int = _Global.INT32(allianceInfo["levelLimit"]);
			
			var recrutingmode : int = _Global.INT32(allianceInfo["recrutingmode"]);
			if ( recrutingmode != 0 )
			{
				matchMight = 0;
				matchLevel = 1;
			}

			waitingLabel = null;

			labelAllianceDescKey.txt = Datas.getArString("Common.Description") + ": \n"; 
			labelAllianceDesc.txt =  allianceDesc; 
			
            var mightStr : String = allianceMight;
            try
            {
                mightStr = _Global.NumFormat(_Global.INT64(allianceMight));
            }
            catch (e : System.Exception)
            {
                // Do nothing
            }
			
			labelAllianceNameKey.txt = Datas.getArString("ShowCreateAlliance.AllianceName") + ": " ;
			labelAllianceName.txt =  m_allianceName;
			
			labelAllianceLevelKey.txt = Datas.getArString("Alliance.InviteLevel");
			labelAllianceLevel.txt = _Global.NumFormat(_Global.INT64(allianceLevel));
			
			labelAllianceFounderKey.txt = Datas.getArString("allianceTitle.title1") + ": ";
			labelAllianceFounder.txt =allianceLeader;
			
			labelAllianceLeagueKey.txt = Datas.getArString("Alliance.InviteLeague");
			labelAllianceLeague.txt = Datas.getArString("LeagueName.League_"+_Global.NumFormat(_Global.INT64(allianceLeague)));
			
			labelAllianceMembersCountKey.txt = Datas.getArString("Alliance.Members") + ": " ;
			labelAllianceMembersCount.txt = allianceMembersCount;
			
			labelAllianceRankingKey.txt = Datas.getArString("Common.Ranking") + ": ";
			labelAllianceRanking.txt = allianceRanking;
			
			labelAllianceMightKey.txt = Datas.getArString("Common.Might") + ": " ;
			labelAllianceMight.txt = mightStr;
			
			
			if (null != allianceInfo["leagueLevel"]) {
				  var leagueName = allianceInfo["leagueLevel"].Value;
				  labelLeagueLevelIcon.setBackground (SeasonLeagueMgr.instance().GetLeagueIconName(leagueName), TextureType.DECORATION);
			  }
			   if (null != allianceInfo["allianceEmblem"]) {
			  	var aedata : AllianceEmblemData = new AllianceEmblemData();
			  	JasonReflection.JasonConvertHelper.ParseToObjectOnce(aedata, allianceInfo["allianceEmblem"]);
			  	allianceEmblem.Data = aedata;
			  	ShowAllianceEmblem(null != aedata && !aedata.IsEmpty);
			  } else {
			  	ShowAllianceEmblem(false);
			  }
			  
			  
			title.txt = m_allianceName;
			
			labelJoinAllianceNotice.txt = Datas.getArString("Alliance.BuildAnEmbassy");
			
			labelAllianceRequirementsKey.txt = Datas.getArString("Alliance.InfoJoinReqs")+":";
			
			if(KBNPlayer.Instance().getMight() < matchMight)
			{
				labelAllianceMightRequired.mystyle.normal.textColor = _Global.RGB(255,48,48);
				//this.l_ToJoin_Might (255,48,48)
			}
			else
			{
				labelAllianceMightRequired.mystyle.normal.textColor = _Global.RGB(79,69,52);
			}
			if(KBNPlayer.Instance().getTitle() < matchLevel)
			{
				labelAllianceLevelRequired.mystyle.normal.textColor = _Global.RGB(255,48,48);
			}
			else
			{
				labelAllianceLevelRequired.mystyle.normal.textColor = _Global.RGB(79,69,52);
			}
			labelAllianceMightRequired.txt = String.Format("{0} {1} {2}",Datas.getArString("Common.Might"),Datas.getArString("Alliance.InfoRequired"),_Global.NumFormat(matchMight)); 
			labelAllianceLevelRequired.txt = String.Format("{0} {1} {2}",Datas.getArString("Common.Level"),Datas.getArString("Alliance.InfoRequired"),matchLevel); 

			if( matchMight > KBNPlayer.Instance().getMight() || matchLevel > KBNPlayer.Instance().getTitle() )
			{
				buttonRequestJoin.changeToGreyNew();
			}
			else
			{
				buttonRequestJoin.changeToBlueNew();
			}
			
			if (!labelJoinAllianceNotice.visible)
			{
				if ( recrutingmode == 0 )
				{
					buttonMail2Chancellor.SetVisible(true);
					buttonMail2Chancellor.OnClick = function()
					{
						var _obj:Object = {"subMenu":"compose", "name":allianceLeader};
						MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
					};
					buttonRequestJoin.txt = Datas.getArString("Alliance.RequestJoin_Button");
					buttonRequestJoin.rect.x = this.rect.width - buttonMail2Chancellor.rect.right;
				}
				else
				{
					buttonRequestJoin.txt = Datas.getArString("AllianceInfo.JoinAlliance");
					buttonRequestJoin.rect.x = 0.5f*(this.rect.width - buttonRequestJoin.rect.width);
					buttonMail2Chancellor.SetVisible(false);
				}
			}
			this.priv_chgButtonRect();
		};
		var errorFunc = function(msg:String, errorCode:String){
			//nothing
		}; 
		UnityNet.GetUserInformation(currentUserId,okFunc,errorFunc,false);
	}
	
	private function priv_chgButtonRect()
	{
		if ( buttonRequestJoin.visible && buttonMail2Chancellor.visible )
		{
			buttonRequestJoin.rect = m_rectForLeft;
			buttonMail2Chancellor.rect = m_rectForRight;
		}
		else if ( buttonRequestJoin.visible )
		{
			buttonRequestJoin.rect = m_rectForCenter;
		}
		else if ( buttonMail2Chancellor.visible )
		{
			buttonMail2Chancellor.rect = m_rectForCenter;
		}
	}
	
	private function HandlerRequestToJoin():void
	{	
		var okFunc:function(boolean):void = function(isDirectLogin : boolean):void
		{
			var message:String = null;
			if ( isDirectLogin == true )
			{
				var strFmt : String = Datas.getArString("AllianceJoin.toaster");
				buttonRequestJoin.SetVisible(false);
				message = String.Format(strFmt, m_allianceName);
				
				UpdateSeed.instance().update_seed_ajax( true, null );
			}
			else
			{
				message = Datas.getArString("ToastMsg.Alliance_RequestJoin");
			}
			priv_chgButtonRect();
			MenuMgr.getInstance().PushMessage(message);	
		};
		//AllianceJoin.toaster
		UnityNet.reqJoinAlliance(Datas.getArString("HtmlAllianceRequest.SendRequest"),currentAllianceId,Datas.getArString("HtmlAllianceRequest.InterestInJoining"),okFunc );				
		buttonRequestJoin.changeToGreyNew();
	}
	
	// Use this for initialization
	function Start () {
	}
	
	
	// Update is called once per frame
	function Update () {
		if ( waitingLabel != null )
			waitingLabel.Update();
	}

	function DrawItem()
	{
		labelAllianceName.Draw(); 
		labelAllianceNameKey.Draw(); 
		
        labelAllianceLevel.Draw(); 
        labelAllianceLevelKey.Draw(); 
		
	    labelAllianceFounder.Draw(); 
	    labelAllianceFounderKey.Draw(); 
	    
		labelAllianceLeague.Draw(); 
		labelAllianceLeagueKey.Draw(); 
	    
        labelAllianceMembersCount.Draw(); 
        labelAllianceMembersCountKey.Draw(); 
	    
        labelAllianceRanking.Draw(); 
        labelAllianceRankingKey.Draw(); 
	    
        labelAllianceMight.Draw(); 
        labelAllianceMightKey.Draw(); 
        
        labelAllianceRequirementsKey.Draw(); 
        labelAllianceMightRequired.Draw(); 
        labelAllianceLevelRequired.Draw(); 
        
        labelAllianceDesc.Draw(); 
        labelAllianceDescKey.Draw(); 
        
        labelLeagueLevelIcon.Draw();
        
        line.Draw();
        line1.Draw();
        line2.Draw();
        line3.Draw();
        line4.Draw();
        line5.Draw();
        line6.Draw();
        line7.Draw();
        line8.Draw();
        allianceEmblem.Draw();

        labelJoinAllianceNotice.Draw();
        buttonRequestJoin.Draw();
        btnBack.Draw();
        
        buttonMail2Chancellor.Draw();
//        if ( waitingLabel != null )
//        	waitingLabel.Draw();

//      l_ToJoin.Draw();
//		l_ToJoin_Might.Draw();
//		l_ToJoin_Level.Draw();
	}
	private function ShowAllianceEmblem(visible:boolean)
	{
		allianceEmblem.SetVisible(visible);
		if (visible) {
			//allianceName.rect.x = 150;
			//allianceDiplomacy.rect.x = 150;
			//lbFrame.rect.height = 290;
		} else {
			//allianceName.rect.x = 70;
			//allianceDiplomacy.rect.x = 70;
			//lbFrame.rect.height = 265;
		}
	}
}
