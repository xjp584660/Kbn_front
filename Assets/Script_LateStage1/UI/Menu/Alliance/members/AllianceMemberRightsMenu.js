#pragma strict

class AllianceMemberRightsMenu
	extends PopMenu
{
	public var m_rightScrollList : ScrollList;
	public var m_rightItem : AllianceRightItem;
	
	public var m_right : ToggleButton[];
	
	public var m_ctrlGroup : UIObject[];
	
	public var m_btnOk : Button;
	public var m_btnCancel : Button;
	
	public var permissionLabel:Label;
	
	
	private var m_radioGroup : RadioGroup = new RadioGroup();
	private var m_isReadOnly : boolean;
	private var m_backRect:Rect;
	
	public var m_positionStyle : UIDisableCtrl;
	private var m_onOKClick : Function;
	private var m_userID : int;

	public function Init()
	{
		super.Init();

		m_btnOk.txt = Datas.getArString("Common.OK_Button");
		m_btnCancel.txt = Datas.getArString("Common.Cancel");

		var texMgr : TextureMgr = TextureMgr.instance();
		this.background = texMgr.LoadTexture("tab_selected", TextureType.BACKGROUND);
		var alliance : Alliance = Alliance.getInstance();
		
		for ( var positionIdx : int = 0; positionIdx != m_right.length; ++positionIdx )
		{
			m_radioGroup.addButton(m_right[positionIdx]);
			m_right[positionIdx].Init();
			m_right[positionIdx].txt = alliance.getPositionStr(positionIdx + 1);
			m_right[positionIdx].mystyle.contentOffset.x = m_right[positionIdx].mystyle.border.left;
			m_right[positionIdx].SetFont(FontSize.Font_18);
			// m_right[positionIdx].SetNormalTxtColor(FontColor.Description_Light);
		}

		m_rightScrollList.Init(m_rightItem);
		
		permissionLabel.txt = Datas.getArString("Alliance.PermissionListLabel");

		m_backRect = Rect( 5, 5, rect.width, rect.height - 15);
		m_radioGroup.buttonChangedFunc = priv_changedTitle;
		m_btnCancel.OnClick = priv_Close;

		this.title.txt = Datas.getArString("Alliance.PositionLabel");
	}

	private function priv_Close(param)
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	public function get MemberUserID() : int
	{
		return m_userID;
	}
	
	public function OnPopOver()
	{
		m_rightScrollList.Clear();
		m_rightScrollList.ClearData();
	}

	public function SetData(usrID : int, userOfficerType : int, isReadOnly : boolean, onOKClick : Function)
	{
		if ( userOfficerType <= 0 )
			return;

		var alliance : Alliance = Alliance.getInstance();
		priv_SetReadOnly(isReadOnly, userOfficerType);

		if ( m_radioGroup.getSelectedButton() != m_right[userOfficerType-1] )
			m_radioGroup.setSelectedButton(m_right[userOfficerType-1], true);
		else
			priv_fillRights(AllianceRights.Rights[userOfficerType]);

		m_btnOk.visible = !isReadOnly;
		m_btnCancel.visible = !isReadOnly;
		
		m_onOKClick = onOKClick;
		m_userID = usrID;
		if ( m_onOKClick != null )
		{
			m_btnOk.OnClick = function(param)
			{
				var newOfficer : int = priv_getSelectedButtonIdx(m_radioGroup.getSelectedButton());
				m_onOKClick(m_userID, newOfficer+1);
			};
		}
		else
		{
			m_btnOk.OnClick = null;
		}
	}
	
	private function priv_getSelectedButtonIdx(btnSelected : UIObject) : int
	{
		var i : int = 0;
		for ( var ui in m_right )
		{
			if ( ui == btnSelected )
				break;
			++i;
		}

		return i;
	}

	private function priv_SetReadOnly(isReadOnly : boolean, userOfficerType : int)
	{
		var selfOfficer : int = Alliance.getInstance().MyOfficerType();
		for ( var i : int = 0; i != m_right.length; ++i )
		{
			var obj : ToggleButton = m_right[i];
			var setReadOnly : boolean = isReadOnly;
			if ( !setReadOnly && selfOfficer != Constant.Alliance.Chancellor && (selfOfficer >= userOfficerType || i + 1 <= selfOfficer) )
				setReadOnly = true;

			obj.SetDisabled(setReadOnly);
			m_positionStyle.FillStyleWithCtrlState(obj.mystyle, !setReadOnly);
		}
	}

	private function priv_changedTitle(btnSelected : ToggleButton)
	{
		var i : int = priv_getSelectedButtonIdx(btnSelected);
		if ( i == m_right.Length )
			return;

		var allianceRight : AllianceRights.AllianceRight = AllianceRights.Rights[i+1];
		priv_fillRights(allianceRight);
	}

	private function priv_fillRights(rights : AllianceRights.AllianceRight)
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		m_rightScrollList.ClearData();
		var rightsDats : System.Collections.Generic.List.<AllianceRightItem.RightData> = new System.Collections.Generic.List.<AllianceRightItem.RightData>();
		for ( var i : int = 0; i != AllianceRights.RightsType.RightsTypeCnt; ++i )
		{
			var rightsDat : AllianceRightItem.RightData = new AllianceRightItem.RightData();
			rightsDat.isHaveRight = rights.haveRights[i];
			rightsDat.rightsType = i;
			rightsDats.Add(rightsDat);
		}
		m_rightScrollList.SetData(rightsDats.ToArray());
	}

    function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		super.DrawBackground();
		
		GUI.BeginGroup(m_backRect);
		DrawMiddleBg(rect.width - 20,5);
		frameTop.Draw();
		GUI.EndGroup();
	}

	public function DrawItem() : void
	{
		for ( var btn : UIObject in m_right )
			btn.Draw();
		for ( var uiObj : UIObject in m_ctrlGroup )
			uiObj.Draw();
		m_rightScrollList.Draw();
	}
	
	public function Update()
	{
		m_rightScrollList.Update();
	}

	public function OnPush(param:Object)
	{
		super.OnPush(param);
		//bgMiddleBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("ui_paper_bottom");
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		//bgMiddleBodyPic.name = "ui_paper_bottom";

		//frameTop.spt = TextureMgr.instance().BackgroundSpt();
		//frameTop.rect = frameTop.spt.GetTileRect("frame_metal_top");
		//frameTop.rect = Rect(0, 0, rect.width, frameTop.rect.height);
		//frameTop.name = "frame_metal_top";

		//titleBack.spt = TextureMgr.instance().BackgroundSpt();
		//titleBack.rect = titleBack.spt.GetTileRect("bg_ui_second_layer");
		//titleBack.rect.x = 0;
		//titleBack.rect.y = 0;
		//titleBack.name = "bg_ui_second_layer";
		//bgStartY = 0;
		//repeatTimes = (rect.height - 1) / bgMiddleBodyPic.rect.height + 1;	

		//bgBottomBodyPic.spt = TextureMgr.instance().BackgroundSpt();
		//bgBottomBodyPic.rect = titleBack.spt.GetTileRect("tool bar_bottom");
		//bgBottomBodyPic.name = "tool bar_bottom";
	}
}
