class AllianceHelpItem extends ListItem
{
	public var marchInfo:Label;
	public var btn_Help:Button;
	public var allianBar:PercentBar;
	public var linedown:Label;
	public var tmpdata:AllianceHelpMarchData=new AllianceHelpMarchData();
	public var curValue:float;
	private var s1:String="";
	private var s2:String="";
	
	public function Init()
	{
		
	}
	
	public function SetRowData(data:Object)
	{
		
		tmpdata=(data as AllianceHelpMarchData);
		
		btn_Help.txt=Datas.getArString("Alliance.Request_March_Help");
		allianBar.FocusRecalcPercentBarWidth();
		allianBar.Init(tmpdata.barCurValue,tmpdata.barMaxValue);
		btn_Help.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_ChatHelp_Brown_normal",TextureType.BUTTON); 
		btn_Help.mystyle.active.background=TextureMgr.instance().LoadTexture("button_ChatHelp_Brown_down",TextureType.BUTTON); 
		linedown.setBackground("bg_line_bright",TextureType.DECORATION);
		curValue=tmpdata.barCurValue;
		
		btn_Help.OnClick=function(param:Object)
		{
			var marchHelpMsg : String = "";
			if( tmpdata.barCurValue > tmpdata.barMaxValue )
				tmpdata.barCurValue = tmpdata.barMaxValue;
			else if( tmpdata.barCurValue < 0 )
				tmpdata.barCurValue = 0;
			var timeWillUse : long = tmpdata.marchEndTime - GameMain.unixtime();
			var timeFormat : String = KBN.TournamentManager.getInstance().getTimeFormat2Digits( timeWillUse );
			
			if( tmpdata.m_marchType == Constant.MarchType.TRANSPORT ) { // Transport
				marchHelpMsg = String.Format( Datas.getArString( "Alliance.MarchRequestSub4" ), timeFormat );
			} else if( tmpdata.m_marchType == Constant.MarchType.REINFORCE ) { // Reinforce
				marchHelpMsg = String.Format( Datas.getArString( "Alliance.MarchRequestSub2" ), timeFormat );
			} else if( tmpdata.m_marchType == Constant.MarchType.REASSIGN ) { // Reassign
				marchHelpMsg = String.Format( Datas.getArString( "Alliance.MarchRequestSub3" ), timeFormat );
			} else if( tmpdata.m_marchType == Constant.MarchType.ATTACK ||
						tmpdata.m_marchType == Constant.MarchType.PVP ) { // Attack
				marchHelpMsg = String.Format( Datas.getArString( "Alliance.MarchRequestSub1" ), timeFormat );
			}
			MenuMgr.getInstance().getChatMenu().sendAllianceChat( marchHelpMsg );
			var a : Hashtable = new Hashtable();//send
			var curValueInt:int=curValue;
            a.Add( "htype", "help" );
            a.Add( "cid", ""+tmpdata.m_cityID );
            a.Add( "dtype", "AllianceSpeedUp" );
            a.Add( "dstype", ""+tmpdata.m_cityID+"_"+3+"_"+tmpdata.m_marchID+"_"+tmpdata.marchStartTime);
            a.Add( "did", ""+tmpdata.m_marchID+"_"+curValueInt+"_"+tmpdata.barMaxValue+"_"+tmpdata.marchEndTime+"_"+tmpdata.marchStartTime);
            a.Add( "dlv", marchHelpMsg );
			UnityNet.reqWWW("allianceHelp.php", a, okFunc, null);
		};
		s1=tmpdata.marchInfo;
	}
	
	function okFunc(result:HashObject):void
	{
	    if(result["ok"].Value)
	    {
	        MenuMgr.getInstance().PopMenu("");
	        MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
	       // var request:AllianceRequest = new AllianceRequest();
	       // request.Type=2;
	       // MenuMgr.getInstance().getChatMenu().sendAllianceChat(request.ToString());
	    }
	};
	
	public function Draw()
	{
		if(!visible)
			return;
	   	GUI.BeginGroup(rect);
		marchInfo.Draw();
		btn_Help.Draw();
		allianBar.Draw();
		linedown.Draw();
		GUI.EndGroup();
	}
	
	public function Update()
	{	
		if(this.visible==true)
		{
			//var tmpcurValue:float=tmpdata.barCurValue;
			curValue+=Time.deltaTime;
			var remainder:int=tmpdata.barMaxValue-curValue;
			allianBar.update(curValue);
			tmpdata.barCurValue=curValue;
			if(remainder<=0)
			{
				this.visible=false;
				MenuMgr.instance.SendNotification(Constant.PvPResponseOk.RefreshTheAllianceHelpList,null);
			}
			marchInfo.txt=s1+" "+KBN._Global.timeFormatShortStrEx(remainder,false);
		}	
	}

}