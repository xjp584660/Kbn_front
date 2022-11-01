class ServerMergeMenu extends PopMenu implements IEventHandler
{
	public var l_Title:Label; 
	public var l_Description:Label;
	public var l_MergeServerTip:Label;
	public var btnHelp:Button;
	
	public var l_bg:Label;
	public var l_StartTime:Label;
	public var l_TargetServerName:Label;
	public var l_Line:Label;
	
	public var scroll_MergeServer:ScrollList;
	public var item:ListItem;
	
	public var l_ReturnGems:Label;
	
	public var btnEnterServers:Button;
	public var btnChoose:Button;
	public var btnReset:Button;
	
	public var frameOffset : RectOffset;
	
	public var l_smallTitleBack:Label;
	public var l_smallTitleFlower:Label;
	
	private var m_ServerMergeDetail:KBN.ServerMergeDetail = null;
	private var m_SelectedItemData:KBN.FromServerDetail = null;
	public function Init()
	{
		super.Init();
		InitTextureComponent();
		InitTextString();
		
		scroll_MergeServer.Init(item);
		scroll_MergeServer.itemDelegate = this;
		
		btnClose.OnClick = OnClose;
		btnHelp.OnClick = OnHelp;
		btnEnterServers.OnClick = OnEnterServer;
		btnChoose.OnClick = OnChoose;
		btnReset.OnClick = OnReset;
		
	}
	
	public function OnPush(param:Object):void
	{
		m_ServerMergeDetail = KBN.MergeServerManager.getInstance().MyServerMergeDetail;
		if(m_ServerMergeDetail == null) return;
		
		var leftTime:long = m_ServerMergeDetail.StartTime - GameMain.unixtime();
		
		if(leftTime > 0)
		{
			l_StartTime.txt = String.Format(Datas.getArString("MergeServer.Countdown"),_Global.timeFormatStr(leftTime));
			var timeSpan : System.TimeSpan = new System.TimeSpan(leftTime*System.TimeSpan.TicksPerSecond);
			if(timeSpan.Days < 1)
			{
				l_StartTime.SetNormalTxtColor(FontColor.Red);
			}
			else
			{
				l_StartTime.SetNormalTxtColor(FontColor.New_Title_Yellow);
			}
		}
		else
		{
			l_StartTime.txt = Datas.getArString("MergeServer.Countdown2");
			l_StartTime.SetNormalTxtColor(FontColor.Red);
		}
		
		l_TargetServerName.txt = String.Format(Datas.getArString("MergeServer.Notice"),m_ServerMergeDetail.TargetServerName);
		
		scroll_MergeServer.SetData(m_ServerMergeDetail.MyDetailServerList.ToArray());
		
		RefreshButtons();
		RefreshReturnGems();
	}
	
	public function Update()
	{
		scroll_MergeServer.Update();
	}
	
	public function DrawItem()
	{
		l_Description.Draw();
		btnHelp.Draw();
		btnClose.Draw();
		l_bg.Draw();
		
		l_smallTitleBack.Draw();
		l_smallTitleFlower.Draw();
		l_StartTime.Draw();
		l_TargetServerName.Draw();
		l_Line.Draw();
		
		scroll_MergeServer.Draw();
		l_ReturnGems.Draw();
		btnChoose.Draw();
		btnEnterServers.Draw();
		btnReset.Draw();
		l_MergeServerTip.Draw();
	}
	
	public function DrawLastItem()
	{
		l_Title.Draw();
	}
	
	public function OnPopOver()
	{
		scroll_MergeServer.Clear();
	}
	
	public function resetLayout()
    {
        ResetLayoutWithRectOffset(frameOffset);
    }
	
	private function OnClose()
	{
//		if(m_ServerMergeDetail.LastChoiceServerId != 0)
//		{
			MenuMgr.getInstance().PopMenu("");
//		}
	}
	
	private function OnHelp()
	{
		MenuMgr.getInstance().PushMenu("ServerMergeHelpMenu", null, "trans_zoomComp");
	}
	
	private function OnEnterServer()
	{
		if(m_SelectedItemData != null)
		{
			m_SelectedItemData.bSelected = false;
			
			UnityNet.signup(m_SelectedItemData.serverId, SwitchWorldOk,null);	
		}
	}
	
	private function OnChoose()
	{
		if(m_SelectedItemData == null) return;
			
		MenuMgr.getInstance().PushMenu("ServerMergeConfirmMenu", m_SelectedItemData, "trans_zoomComp");
	}
	
	private function SwitchWorldOk()
	{
		Datas.instance().setWorldid(m_SelectedItemData.serverId);
		GameMain.instance().restartGame();
	}
	
	private function OnReset()
	{
		KBN.MergeServerManager.getInstance().RequestChoice(0);
	}
	
	private function InitTextureComponent()
	{
		l_Title.setBackground("level_up_bg",TextureType.DECORATION);
//		l_bg.setBackground("Quest_kuang",TextureType.DECORATION);
//		l_Line.setBackground("between line",TextureType.DECORATION);
		btnEnterServers.changeToBlueNew();
		btnChoose.changeToBlueNew();
		btnReset.changeToRedNew();
	}
	
	private function InitTextString()
	{
		l_Title.txt = Datas.getArString("MergeServer.Title");
		l_Description.txt = Datas.getArString("MergeServer.Desc");
		btnEnterServers.txt = Datas.getArString("MergeServer.EnterBtn");
		btnChoose.txt = Datas.getArString("Common.Choose");
		btnReset.txt = Datas.getArString("MergeServer.ResetBtn");
		l_MergeServerTip.txt = Datas.getArString("MergeServer.Tip");
	}
	
	public function handleItemAction(action:String,param:Object):void
	{	
		switch(action)
		{
			case Constant.Action.SERVERMERGE_ITEM_SELECT:
				if(m_SelectedItemData)
					m_SelectedItemData.bSelected = false;
				m_SelectedItemData = param as KBN.FromServerDetail;
				m_SelectedItemData.bSelected = true;
				RefreshButtons();	
				RefreshReturnGems();		
				break;
		}
	}
	
	public function RefreshReturnGems()
	{
		l_ReturnGems.txt = String.Format(Datas.getArString("MergeServer.RestoreGem"),m_ServerMergeDetail.GetTotalReturnGems());
		if(m_ServerMergeDetail.LastChoiceServerId == 0 && m_ServerMergeDetail.GetSelectServerId() == 0)
		{
			l_ReturnGems.SetVisible(false);
		}
		else
		{
			l_ReturnGems.SetVisible(true);
		}
	}
	
	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
	    	case Constant.MergeServer.SaveServerOK:
	            RefreshButtons();
	            RefreshReturnGems();
	            break;
	    }
	}
	
	public function RefreshButtons()
	{
		if(m_ServerMergeDetail.LastChoiceServerId != 0)
		{
			btnReset.SetVisible(true);
			
			btnChoose.SetVisible(false);
			btnEnterServers.SetVisible(false);
			btnClose.SetDisabled(false);
			l_MergeServerTip.SetVisible(false);
		}
		else
		{
			if(m_ServerMergeDetail.GetSelectServerId() == 0)
			{
				btnChoose.changeToGreyNew();
				btnEnterServers.changeToGreyNew();
			}
			else if(m_ServerMergeDetail.GetSelectServerId() == Datas.singleton.worldid())
			{
				btnChoose.changeToBlueNew();
				btnEnterServers.changeToGreyNew();
			}
			else
			{
				btnChoose.changeToBlueNew();
				btnEnterServers.changeToBlueNew();
			}
			btnReset.SetVisible(false);
			btnChoose.SetVisible(true);
			btnEnterServers.SetVisible(true);
			
			if(GameMain.instance().isForceServerMerge())
			{
				btnClose.SetDisabled(true);
				l_MergeServerTip.SetVisible(true);
			}
			else
			{
				btnClose.SetDisabled(false);
				l_MergeServerTip.SetVisible(false);
			}			
		}
	}
					
}