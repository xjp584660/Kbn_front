public class MemberItem extends ListItem
{
	public var l_line	:Label;
	public var btn_name :Button;
	public var l_pos	:Label;
	public var l_lastLogin :Label;
	public var l_time	:Label;
	public var l_onlineStateIcon : Label;
	
	private var m_defColorForLastLogin : Color;
	private var m_defColorForPos : Color;
	private var m_defColorForTime : Color;
	private var m_defColorForName : Color;

	protected var amvo:AllianceMemberVO;

	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_line.Draw();
		btn_name.Draw();
		l_pos.Draw();
		l_lastLogin.Draw();
		l_time.Draw();
		l_onlineStateIcon.Draw();
		GUI.EndGroup();
	}

	public function Init()
	{
		btn_name.OnClick = onClick;
		m_defColorForLastLogin = this.l_lastLogin.mystyle.normal.textColor;
		m_defColorForPos = this.l_pos.mystyle.normal.textColor;
		m_defColorForTime = this.l_time.mystyle.normal.textColor;
		m_defColorForName = this.btn_name.mystyle.normal.textColor;
	}

	public function SetRowData(data:Object):void
	{
		//Init();
		l_line.setBackground("between line_list_small",TextureType.DECORATION);
		this.amvo = data as AllianceMemberVO;
		btn_name.SetFont();
		btn_name.txt 	= _Global.GUIClipToWidth(btn_name.mystyle, amvo.name, 180, "...", null);
		l_pos.maxChar = 20;
		l_pos.txt 		= amvo.positionStr;
		l_time.txt 		= _Global.NumSimlify(amvo.might, Constant.MightDigitCountInList, false);
		if ( this.amvo.isMVP )
		{
			var textMgr : TextureMgr = TextureMgr.instance();
			var mvpTexture : Texture2D = textMgr.LoadTexture("mvp", TextureType.ICON);
			l_pos.image = mvpTexture;
			//btn_name.image = mvpTexture;
		}
		else
		{
			l_pos.image = null;
			//btn_name.image = null;
		}

		var lastOnlineTimeSpan : System.TimeSpan  = __getLastOnlineTime(this.amvo.lastLoginTS);
		l_lastLogin.txt = __getLastOnlineTimeString(lastOnlineTimeSpan);
		__flushItemColor(lastOnlineTimeSpan);
		
		if(Alliance.singleton.clickMemberName == amvo.name)
		{
			//onClick(null);
	        var menu : AllianceUserProfile = KBN.MenuMgr.instance.getMenu("AllianceUserProfile") as AllianceUserProfile;
	        if(menu != null)
	        {	
	       		menu.OnPush(amvo);
	        }
		}
	}

	protected function onClick(clickParam:Object):void
	{
		Alliance.singleton.clickMemberName = amvo.name;
		if(this.handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.ALLIANCE_MEMB_NAME,amvo);
	}

	private function __getLastOnlineTime(lastLoginTimeTS : int) : System.TimeSpan
	{
		if ( lastLoginTimeTS >= 0 )
		{
			var spanTime : System.TimeSpan = System.TimeSpan.FromSeconds(lastLoginTimeTS);
			return spanTime;
		}
		
		return System.TimeSpan.FromDays(9999);
	}

	//	change this item text color and online state icon by check if the player is online.
	private function __flushItemColor(lastOnlineTimeSpan : System.TimeSpan)
	{
		var textureMgr : TextureMgr = TextureMgr.instance();
		if ( this.__isOnlineMember(lastOnlineTimeSpan) )
		{	//	the online state icon default is offline,
			//	so we need set online state here.
			var texOnline = textureMgr.LoadTexture("Online_icon", TextureType.ICON);
			this.l_onlineStateIcon.mystyle.normal.background = texOnline;

//			this.l_lastLogin.mystyle.normal.textColor = m_defColorForLastLogin;
//			this.l_pos.mystyle.normal.textColor = m_defColorForPos;
//			this.l_time.mystyle.normal.textColor = m_defColorForTime;
//			this.btn_name.mystyle.normal.textColor = m_defColorForName;
		}
		else
		{
			var texOffline = textureMgr.LoadTexture("Offline_icon", TextureType.ICON);
			this.l_onlineStateIcon.mystyle.normal.background = texOffline;
			//	offline player, set text color to grey.
//			this.l_lastLogin.mystyle.normal.textColor = Color.grey;
//			this.l_pos.mystyle.normal.textColor = Color.grey;
//			this.l_time.mystyle.normal.textColor = Color.grey;
//			this.btn_name.mystyle.normal.textColor = Color.grey;
		}
	}

	private function __getLastOnlineTimeString(lastOnlineTimeSpan : System.TimeSpan):String
	{
		if ( lastOnlineTimeSpan.TotalHours <= 24 )
			return Datas.getArString("Alliance.MemberToday");

		if ( lastOnlineTimeSpan.TotalHours <= 48 )
			return Datas.getArString("Alliance.MemberYesterday");

		var days : int = lastOnlineTimeSpan.TotalDays;
		return System.String.Format(Datas.getArString("Alliance.MemberXDaysAgo"), days.ToString());
	}

	private function __isOnlineMember(lastOnlineTimeSpan : System.TimeSpan) : boolean
	{
		return lastOnlineTimeSpan.TotalMinutes <= 5.0;
	}
}
