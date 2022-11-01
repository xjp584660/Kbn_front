class AllianceDesPopup extends PopMenu
{
	/*labels for info*/
	public var	lblDes:Label;
	public var	input_des:InputText;
	public var	lblTips:Label;

	/*division line*/
	
	public var	btnDone:Button;
	
	private var currentAllianceId:int = 0;
	private var alliance:AllianceVO;

	@SerializeField
	private var m_infoTypeCtrl : ToolBar;

	@SerializeField
	private var m_rectForDescription : Rect;
	@SerializeField
	private var m_rectForDescriptionLabel : Rect;
	@SerializeField
	private var m_rectForDescriptionNotice : Rect;

	@SerializeField
	private var m_rectForWelcomeMessage : Rect;
	@SerializeField
	private var m_rectForWelcomeMessageLabel : Rect;
	@SerializeField
	private var m_rectForWelcomeNotice : Rect;
	
	private var m_haveModifiedPromise : boolean = false;

	private enum EInfoType
	{	InfoType_Description
	,	InfoType_WelcomeInfo
	}
	
	private class CInfoTypeDat
	{
		public function CInfoTypeDat(srcInfo : String, eInfoType : EInfoType)
		{
			m_inputInfo = srcInfo;
			m_srcInfo = srcInfo;
			m_eInfoType = eInfoType;
		}

		public function get InfoType() : EInfoType
		{
			return m_eInfoType;
		}
		
		public function get InputInfo() : String
		{
			return m_inputInfo;
		}
		public function set InputInfo(value : String)
		{
			m_inputInfo = value;
			m_isEditing = true;
		}

		public function get SrcInfo() : String
		{
			return m_srcInfo;
		}

		public function get IsEditing() : boolean
		{
			return m_isEditing;
		}
		
		public function set IsEditing(value : boolean)
		{
			m_isEditing = value;
		}
		
		public function DoSubmit(val : String) : boolean
		{
			m_inputInfo = val;
			m_isEditing = false;
			return m_inputInfo != m_srcInfo;
		}
		
		public function SubmitLost() : void
		{
			m_isEditing = true;
		}

		public function SubmitOK() : void
		{
			m_srcInfo = m_inputInfo;
		}

		private var m_isEditing : boolean = false;
		private var m_inputInfo : String;
		private var m_srcInfo : String;
		private var m_eInfoType : EInfoType;
	}

	private var m_eInfoType : EInfoType = EInfoType.InfoType_Description;

	private var m_datDescription : CInfoTypeDat;
	private var m_datWelcome : CInfoTypeDat;
	private var m_activeDat : CInfoTypeDat;

	public function Init()
	{ 
		super.Init();
		title.txt = Datas.getArString("Alliance.Description_1");
		btnDone.OnClick = btnDone_Click;
		btnDone.txt = Datas.getArString("Common.Edit");
		lblTips.txt = Datas.getArString("Alliance.CanNotChangeDescription");
		m_infoTypeCtrl.Init();
		//m_infoTypeCtrl.ToLightTabTexture();
		m_infoTypeCtrl.toolbarStrings = [Datas.getArString("Common.Description"), Datas.getArString("AllianceWelcomemsg.Tabname") ]; //["Detail","Technology"];
	}

	public function OnPush(param:Object)
	{
		alliance = param as AllianceVO;

		m_datDescription = new CInfoTypeDat(alliance.description, EInfoType.InfoType_Description);
		m_datWelcome = new CInfoTypeDat(alliance.welcomeMessage, EInfoType.InfoType_WelcomeInfo);
		m_haveModifiedPromise = AllianceRights.Rights[alliance.userOfficerType].haveRights[AllianceRights.RightsType.ChangeDescription];

		lblDes.visible = true;
		input_des.visible = false;
		input_des.setKeyboardMultiLine();
		btnDone.txt = Datas.getArString("Common.Edit");
		if ( AllianceRights.Rights[alliance.userOfficerType].haveRights[AllianceRights.RightsType.ChangeDescription] )
		{
			btnDone.SetVisible(true);
			lblTips.SetVisible(false);
		}
		else
		{
			btnDone.SetVisible(false);
			lblTips.SetVisible(true);
		}
		this.priv_changeInfoType(EInfoType.InfoType_Description);
	}

	private function btnDone_Click()
	{
		var activeDat : CInfoTypeDat = m_activeDat;
		if(activeDat.IsEditing)
		{
			var okFunc = function(result:HashObject){
				if(result["ok"].Value)
				{
					//lblDes.txt = input_des.txt;
					switch ( activeDat.InfoType )
					{
						case EInfoType.InfoType_Description:
							alliance.description = activeDat.InputInfo;
							break;
						case EInfoType.InfoType_WelcomeInfo:
							alliance.welcomeMessage = activeDat.InputInfo;
							break;
					}
					MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
					if ( activeDat == m_activeDat )
						activeDat.SubmitOK();
					priv_changeEditingMode();
				}
			};

			if ( activeDat.DoSubmit(input_des.txt) )
				UnityNet.UpdateAllianceDes(alliance.allianceId, activeDat.InfoType, activeDat.InputInfo, okFunc);
		}
		else
		{
			activeDat.IsEditing = true;
		}
		priv_changeEditingMode();
	}
	
	private function priv_changeEditingMode()
	{
		if ( m_activeDat.IsEditing )
		{
			input_des.txt = m_activeDat.InputInfo;
			input_des.visible = true;
			lblDes.visible = false;
			btnDone.txt = Datas.getArString("Common.Done");
			if ( m_activeDat.InfoType == EInfoType.InfoType_Description )
			{
				lblTips.visible = false;
			}
			else
			{
				lblTips.visible = true;
				lblTips.txt = Datas.getArString("AllianceWelcomemsg.Tips");
				lblTips.SetNormalTxtColor(FontColor.New_Payment_Grey);
			}
		}
		else
		{
			input_des.visible = false;
			lblDes.txt = m_activeDat.SrcInfo;
			lblDes.visible = true;
			btnDone.txt = Datas.getArString("Common.Edit");
			if ( m_activeDat.InfoType == EInfoType.InfoType_WelcomeInfo )
			{
				lblTips.visible = true;
				lblTips.txt = Datas.getArString("AllianceWelcomemsg.Tips");
				lblTips.SetNormalTxtColor(FontColor.New_Payment_Grey);
			}
			else
			{
				if ( m_haveModifiedPromise )
				{
					lblTips.visible = false;
				}
				else
				{
					lblTips.visible = true;
					lblTips.txt = Datas.getArString("Alliance.CanNotChangeDescription");
					lblTips.SetNormalTxtColor(FontColor.New_Payment_Grey);
				}
			}
		}
	}
	
	function DrawItem()
	{
		lblDes.Draw();
		input_des.Draw();
		btnDone.Draw();
		lblTips.Draw();

		var newInfoType : EInfoType;
		switch (m_infoTypeCtrl.Draw())
		{
		case 1:
			newInfoType = EInfoType.InfoType_WelcomeInfo;
			break;
		default:
		//case 0:
			newInfoType = EInfoType.InfoType_Description;
			break;
		}

		if ( m_eInfoType != newInfoType )
		{
			priv_changeInfoType(newInfoType);
		}
	}

	private function priv_changeInfoType(newInfoType : EInfoType)
	{
		var oldDat : CInfoTypeDat;
		var newDat : CInfoTypeDat;
		var newInputRect : Rect;
		var newDetailRect : Rect;
		var newNoticeRect : Rect;

		m_eInfoType = newInfoType;
		switch ( newInfoType )
		{
		case EInfoType.InfoType_Description:
			oldDat = m_datWelcome;
			newDat = m_datDescription;
			newInputRect = m_rectForDescription;
			newDetailRect = m_rectForDescriptionLabel;
			newNoticeRect = m_rectForDescriptionNotice;
			break;

		case EInfoType.InfoType_WelcomeInfo:
			oldDat = m_datDescription;
			newDat = m_datWelcome;
			newInputRect = m_rectForWelcomeMessage;
			newDetailRect = m_rectForWelcomeMessageLabel;
			if ( m_haveModifiedPromise )
				newNoticeRect = m_rectForWelcomeNotice;
			else
				newNoticeRect = m_rectForDescriptionNotice;
			break;
		}

		if ( oldDat.IsEditing )
			oldDat.InputInfo = input_des.txt;

		input_des.txt = newDat.InputInfo;
		lblDes.txt = newDat.SrcInfo;
		input_des.rect = newInputRect;
		lblDes.rect = newDetailRect;
		lblTips.rect = newNoticeRect;
		m_activeDat = newDat;
		priv_changeEditingMode();
	}
}
