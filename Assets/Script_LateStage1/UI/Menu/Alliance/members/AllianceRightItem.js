#pragma strict

class AllianceRightItem extends ListItem
{
	class RightData
	{
		public var isHaveRight : boolean;
		public var rightsType : AllianceRights.RightsType;
		public function get rightName () : String
		{
			var permissionVal : int = rightsType+1;
			return Datas.getArString("Alliance.OfficerPermission" + permissionVal.ToString());
		}
	}

	public var m_isHaveRightIcon : Label;
	public var m_splitImg : Label;
	public var m_uiStyleCtrl : UIDisableCtrl;
	//public var m_rightName : Label;
	//function Start () { }
	//function Update () { }

	public function Init():void
	{
		m_isHaveRightIcon.Init();
		m_splitImg.Init();
		
		m_isHaveRightIcon.SetFont();
		m_isHaveRightIcon.SetNormalTxtColor();
	}

	public function SetRowData(data:Object)
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var rightsDat : RightData = data as RightData;
		if ( rightsDat.isHaveRight )
		{
			m_isHaveRightIcon.mystyle.normal.background = texMgr.LoadTexture("icon_satisfactory", TextureType.ICON);
			//m_isHaveRightIcon.mystyle.normal.textColor = Color(92.0f/255.0f, 51.0f/255.0f, 12.0f/255.0f);
		}
		else
		{
			m_isHaveRightIcon.mystyle.normal.background = texMgr.LoadTexture("icon_unsatisfactory", TextureType.ICON);
			//m_isHaveRightIcon.mystyle.normal.textColor = Color(163.0f/255.0f, 130.0f/255.0f ,52.0f/255.0f);
		}
		m_uiStyleCtrl.FillStyleWithCtrlState(m_isHaveRightIcon.mystyle, rightsDat.isHaveRight);
		m_isHaveRightIcon.txt = rightsDat.rightName;
		m_splitImg.SetVisible(rightsDat.rightsType != 0);
		//m_rightName.txt = rightsDat.rightName;
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);
		m_splitImg.Draw();
		m_isHaveRightIcon.Draw();
		//m_rightName.Draw();
		GUI.EndGroup();
	}
}
