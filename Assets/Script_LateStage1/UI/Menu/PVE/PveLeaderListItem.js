class PveLeaderListItem extends ListItem
{
	public enum JUDGE_TYPE
	{
		USER_ID,
		ALLIANCE_ID
	};
	public enum DISPLAYE_NAME_TYPE
	{
		UER_NAME,
		ALLIANCE_NAME,
		UER_NAME_AND_ALLIANCE_NAME
	};
	public enum DISPLAYE_SCORE_TYPE
	{
		NORMAL,
		PERCENT
	};
	@SerializeField private var judgeType:JUDGE_TYPE = JUDGE_TYPE.USER_ID;
	@SerializeField private var displayNameType:DISPLAYE_NAME_TYPE = DISPLAYE_NAME_TYPE.UER_NAME;
	@SerializeField private var scoreType:DISPLAYE_SCORE_TYPE = DISPLAYE_SCORE_TYPE.NORMAL;
	@SerializeField private var pveName:Label;
	@SerializeField private var pveScore:Label;
	@SerializeField private var pveLine:Label;
	@SerializeField private var pveBigLine:Label;
	@SerializeField private var bigLineAlpha:float;
	@SerializeField private var arrawBtn:Button;
	@SerializeField private var receiveBtn:Button;
	@SerializeField private var colorStr:String;
	private var clickArrawFuncton:System.Action = null;
	private var clickReceiveFuncton:System.Action.<KBN.LeaderBoardItemInfo> = null;
	private var clickFuncton:System.Action.<KBN.LeaderBoardItemInfo> = null;
	private var m_data:KBN.LeaderBoardItemInfo;
	@SerializeField private var useDefaltColor:boolean = true;
	@SerializeField private var btnDefault:SimpleButton;
	
	public function Init():void
	{
		super.Init();
		pveLine.setBackground("between line_list_small",TextureType.DECORATION);
		pveBigLine.setBackground("Event_mytiao",TextureType.DECORATION);
		if(arrawBtn!=null)
		{
			arrawBtn.setNorAndActBG("button_moreinfo_small3_normal","button_moreinfo_small3_normal");
			arrawBtn.SetVisible(true);
			arrawBtn.OnClick = handleArrawClick;
		}
		if(btnDefault!=null)
		{
			btnDefault.rect = Rect(0, 0, rect.width, rect.height);
			btnDefault.OnClick = handleClick;
		}
		if(receiveBtn!=null)
		{
			receiveBtn.txt = Datas.getArString("receive");
			receiveBtn.OnClick = handleReceiveClick;
		}
	}
	
	public function SetArrawClickFunction(_clickFuncton:System.Action):void
	{
		if(arrawBtn==null)
			return;
		clickArrawFuncton = _clickFuncton;
	}
	
	public function SetClickFunction(_clickFuncton:System.Action.<KBN.LeaderBoardItemInfo>):void
	{
		if(btnDefault==null)
			return;
		clickFuncton = _clickFuncton;
	}
	
	public function SetClickReceiveFunction(_clickFuncton:System.Action.<KBN.LeaderBoardItemInfo>):void
	{
		if(receiveBtn==null)
			return;
		clickReceiveFuncton = _clickFuncton;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		pveLine.Draw();
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = bigLineAlpha;
		pveBigLine.Draw();
		GUI.color.a = oldAlpha;
		
		title.Draw();
		pveName.Draw();
		pveScore.Draw();
		if(arrawBtn!=null)
			arrawBtn.Draw();
		if(receiveBtn!=null)
			receiveBtn.Draw();
		if(btnDefault!=null)
			btnDefault.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		var DataController:KBN.LeaderBoardInfoBase = KBN.LeaderBoardController.instance().GetLeaderBoard() as KBN.LeaderBoardInfoBase;
		m_data = data as KBN.LeaderBoardItemInfo;
		title.txt = m_data.rank + "";
		if(scoreType == DISPLAYE_SCORE_TYPE.NORMAL)
			pveScore.txt = m_data.score + "";
		else
			pveScore.txt = m_data.score/10f + "%";
		ShowName();
		
		if(Judge())
		{
			if(useDefaltColor)
			{
				title.SetNormalTxtColor(FontColor.Button_White);
				pveScore.SetNormalTxtColor(FontColor.Button_White);
				pveName.SetNormalTxtColor(FontColor.Button_White);
			}
			pveBigLine.SetVisible(true);
			if(DataController.hasReward && receiveBtn!=null)
				receiveBtn.SetVisible(true);
			else if(receiveBtn!=null)
				receiveBtn.SetVisible(false);
		}
		else
		{
			if(useDefaltColor)
			{
				title.SetNormalTxtColor(FontColor.Description_Light);
				pveScore.SetNormalTxtColor(FontColor.Description_Light);
				pveName.SetNormalTxtColor(FontColor.Description_Light);
			}
			pveBigLine.SetVisible(false);
			if(receiveBtn!=null)
				receiveBtn.SetVisible(false);
		}
	}
	
	private function ShowName()
	{
		switch(displayNameType)
		{
		case DISPLAYE_NAME_TYPE.UER_NAME:
			pveName.txt = m_data.displayName + "";
			break;
		case DISPLAYE_NAME_TYPE.ALLIANCE_NAME:
			pveName.txt = m_data.allianceName + "";
			break;
		case DISPLAYE_NAME_TYPE.UER_NAME_AND_ALLIANCE_NAME:
			pveName.txt = m_data.allianceName + "\n<color=#"+colorStr+">" + m_data.displayName + "</color>";//<color=#824300ff>"
		}
	}
	
	private function Judge():boolean
	{
		switch(judgeType)
		{
		case JUDGE_TYPE.USER_ID:
			if(Datas.instance().tvuid() == m_data.userID)
				return true;
			break;
		case JUDGE_TYPE.ALLIANCE_ID:
			if(Alliance.getInstance().MyAllianceId() == m_data.allianceId)
				return true;
			break;
		}
		return false;
	}
	
	public function handleArrawClick():void
	{
		if(clickArrawFuncton != null)
			clickArrawFuncton();
	}
	
	public function handleClick():void
	{
		if(clickFuncton != null)
			clickFuncton(m_data);
	}
	
	public function handleReceiveClick():void
	{
		if(clickReceiveFuncton != null)
			clickReceiveFuncton(m_data);
	}
	
	public function GetData(): KBN.LeaderBoardItemInfo
	{
		return m_data;
	}
	
	public function SetDisplayNameType(_type:DISPLAYE_NAME_TYPE)
	{
		displayNameType = _type;
		ShowName();
	}
	
	public function SetJudgeType(_type:JUDGE_TYPE)
	{
		judgeType = _type;
	}
}