class AllianceConditionPopup extends PopMenu
{
	private var m_isCanEdit			: boolean = false;
	private var m_isSendRequest		: boolean = false;
	private var m_allianceInfo		: AllianceVO;

	public var m_btnEdit			: Button;
	public var m_btnClose			: Button;
	public var m_lbTitle			: Label;
	public var m_lbNotice			: Label;

	public var m_chkConditionLevel	: CheckBox;
	public var m_chkConditionMight	: CheckBox;

	public var m_editConditionLevel	: InputText;
	public var m_editConditionMight	: InputText;

	public var m_lbConditionLevel	: Label;
	public var m_lbConditionMight	: Label;

	public var m_lineTop			: SimpleLabel;
	public var m_lineBottom			: SimpleLabel;
	
	@SerializeField
	private var m_labelForRecrutiting : Label;
	@SerializeField
	private var m_labelForRecrutitingTip : Label;
	@SerializeField
	private var m_switchForRecruiting : SwitchButton;

	@SerializeField
	private var m_arrayShowListForRecruiting : UIObject[];
	
	@SerializeField
	private var m_arrayShowListForNormalCondition : UIObject[];
	
	private var m_activeShowList : UIObject[];

	public function Init()
	{
		super.Init();

		m_btnEdit.changeToBlueNew();
		this.m_isSendRequest = false;
		this.m_chkConditionLevel.txt = Datas.getArString("Common.Level");
		this.m_chkConditionMight.txt = Datas.getArString("Common.Might");
		m_editConditionLevel.type = TouchScreenKeyboardType.NumberPad;
		m_editConditionMight.type = TouchScreenKeyboardType.NumberPad;
		m_lbNotice.txt = Datas.getArString("Alliance.InfoReqDesc");
		m_btnEdit.txt = Datas.getArString("Common.Done");
		m_labelForRecrutiting.txt = Datas.getArString("AllianceRecruitingMode.text");
		m_labelForRecrutitingTip.txt = Datas.getArString("AllianceRecruitingMode.Tips");
		m_editConditionLevel.Init();
		m_editConditionMight.Init();
		m_editConditionMight.SetVisible(true);
		m_editConditionLevel.SetVisible(true);

		m_chkConditionMight.OnSelectChanged = function(ckBox : CheckBox, isSelected : boolean)
		{
			return;
			//m_editConditionMight.SetVisible(isSelected && this.m_isCanEdit);
			//m_lbConditionMight.SetVisible(!m_editConditionMight.visible);
		};

		m_chkConditionLevel.OnSelectChanged = function(chkBox : CheckBox, isSelected : boolean)
		{
			return;
			//m_editConditionLevel.SetVisible(isSelected && this.m_isCanEdit);
			//m_lbConditionLevel.SetVisible(!m_editConditionLevel.visible);
		};

		m_editConditionLevel.endInput = function(txt : String)
		{
			if ( !txt.Length )
				m_editConditionLevel.txt = m_allianceInfo.minLevelCanJoin.ToString();

			var level : int = _Global.INT32(__getValidNumString(m_editConditionLevel.txt));
			if ( level < 1 )
				m_editConditionLevel.txt = "1";
			else if ( level > 200 )
				m_editConditionLevel.txt = "200";
			else
				m_editConditionLevel.txt = level.ToString();

			m_lbConditionLevel.txt = m_editConditionLevel.txt;
		};

		m_editConditionMight.endInput = function(txt : String)
		{
			if ( !txt.Length )
				m_editConditionMight.txt = m_allianceInfo.minMightCanJoin.ToString();

			var might : long = _Global.INT64(__getValidNumString(m_editConditionMight.txt));
			if ( might < 0 )
				m_editConditionMight.txt = "0";
			else if ( might > 999999999 )
				m_editConditionMight.txt = "999999999";
			else
				m_editConditionMight.txt = might.ToString();

			m_lbConditionMight.txt = m_editConditionMight.txt;
		};

		var onOKFun = function(res : HashObject)
		{
			m_isSendRequest = false;
			m_allianceInfo.minMightCanJoin = this.MinMight;
			m_allianceInfo.minLevelCanJoin = this.MinLevel;
			m_allianceInfo.joinCheckMode = !this.m_switchForRecruiting.on;
			__updateLimitValue();
			m_btnClose.Click();
		};
		
		m_switchForRecruiting.OnClick = function(isCheck : boolean)
		{
			priv_updateSwitchRecruitingModeType(!isCheck);
		};
		m_switchForRecruiting.SetDefaultInfo();


		//var onLostFun = function(msg, errType)
		//{
		//	m_isSendRequest = false;
		//	return;
		//};

		m_btnEdit.OnClick = function()
		{
			if ( m_isSendRequest == true )
				return;
				
			m_editConditionLevel.setDone();
			m_editConditionMight.setDone();

			if ( this.MinLevel > 200 )
				m_editConditionLevel.txt = "200";
			if ( this.MinLevel < 1 )
				this.m_chkConditionLevel.IsSelect = false;

			if ( this.MinMight > 999999999 )
				m_editConditionMight.txt = "99999999";
			if ( this.MinMight < 0 )
				this.m_chkConditionMight.IsSelect = false;

			m_isSendRequest = true;
			m_btnEdit.changeToGreyNew();
			var recurtMod : int = m_switchForRecruiting.on ? 1: 0;
			//	send request.
			UnityNet.UpdateAllianceJoinLimit(this.MinMight, this.MinLevel, recurtMod, onOKFun);//onLostFun);
			return;
		};
	}
	
	private function priv_updateSwitchRecruitingModeType(modeCheck : boolean)
	{
		if ( modeCheck )
			m_activeShowList = m_arrayShowListForNormalCondition;
		else
			m_activeShowList = m_arrayShowListForRecruiting;
	}

	public function get MinMight() : int
	{
		if ( !this.m_chkConditionMight.IsSelect )
			return 0;
		return _Global.INT32(this.m_editConditionMight.txt);
	}

	public function get MinLevel() : int
	{
		if ( !this.m_chkConditionLevel.IsSelect )
			return 1;
		return _Global.INT32(this.m_editConditionLevel.txt);
	}

	private function __updateLimitValue()
	{
		m_editConditionLevel.txt = m_allianceInfo.minLevelCanJoin.ToString();
		m_lbConditionLevel.txt = m_editConditionLevel.txt;
		m_editConditionMight.txt = m_allianceInfo.minMightCanJoin.ToString();
		m_lbConditionMight.txt = m_editConditionMight.txt;
	}

	public function OnPush(param:Object)
	{
		m_allianceInfo = param as AllianceVO;
		priv_updateSwitchRecruitingModeType(m_allianceInfo.joinCheckMode);
		m_switchForRecruiting.SetOn(!m_allianceInfo.joinCheckMode);

		this.m_isCanEdit = AllianceRights.Rights[m_allianceInfo.userOfficerType].haveRights[AllianceRights.RightsType.ChangeJoinCondition];
		m_lbTitle.txt = m_allianceInfo.name;

		__updateLimitValue();

		if ( this.m_isCanEdit )
		{
			this.m_switchForRecruiting.SetDisabled(false);
			this.m_btnEdit.SetVisible(true);
			this.m_chkConditionLevel.LockState = false;
			this.m_chkConditionMight.LockState = false;
		}
		else
		{
			this.m_switchForRecruiting.SetDisabled(true);
			this.m_btnEdit.SetVisible(false);
			this.m_chkConditionLevel.LockState = true;
			this.m_chkConditionMight.LockState = true;
		}

		m_chkConditionMight.IsSelect = m_allianceInfo.minMightCanJoin > 0;
		m_chkConditionLevel.IsSelect = m_allianceInfo.minLevelCanJoin > 1;
	}

	function DrawItem()
	{
		for ( var uiObj : UIObject in m_activeShowList )
			uiObj.Draw();

		//m_lbNotice.Draw();


		//m_lbConditionLevel.Draw();
		//m_lbConditionMight.Draw();


		m_lineTop.Draw();
		m_lineBottom.Draw();
	}

	// Use this for initialization
	function Start () {
	}

	// Update is called once per frame
	function Update () {
	}
	
	private function __getValidNumString(numString : String) : String
	{
		var strNumOut : System.Text.StringBuilder = new System.Text.StringBuilder(16);
		for ( var i : int = 0; i != numString.Length; ++i )
		{
			//if ( char.IsDigit(numString[i]) )
			if ( '0'[0] <= numString[i] && numString[i] <= '9'[0] )
				strNumOut.Append(numString[i]);
		}
		
		return strNumOut.ToString();
	}
}
