public class AllianceReportTab extends BaseAllianceTab implements IEventHandler
{
	public var b4g : Button4Page;
	public var l_bg1 :Label;
	public var l_bg2 :Label;
//	public var l_bg3 :Label;
	
	public var l1	:Label;
	public var l2	:Label;
	public var l3	:Label;
	public var scroll_list :ScrollList;
	public var ins_ReportItem :ListItem;
	public var tab	:ToolBar;
	public var viewIndex:int = 0;
	public var wallCon : AllianceWallCon;
	public var reportCon : ComposedUIObj;
	
	public var l_time:Label;
	public var tb_all:ToggleButton;
	public var tb_in:ToggleButton;
	public var tb_out:ToggleButton;
	
	public var mainCon : ComposedUIObj;
	public var tipCon : ComposedUIObj;
	
	public var blankTip :Label;
	
	public var detailCon :AllianceReportDetailCon;
	
	private var curPage:int = 1;
	private var go2Page:int ;
	
	private var conData:HashObject;
	
	protected var btn_group:RadioGroup = new RadioGroup();
	
	private var androidChat:AndroidChat;
	public function SetAndroidChat(chat:AndroidChat)
	{
		androidChat = chat;
	}	
	public function Init():void
	{
		nc = new NavigatorController();		
		nc.pushedFunc = pushedFunc;	
		nc.popedFunc = popedFunc;	
		scroll_list.itemDelegate = this;
		scroll_list.Init(ins_ReportItem);		
		l1.txt = Datas.getArString("Common.Date");
		l2.txt = Datas.getArString("Common.Type");
		l3.txt = Datas.getArString("Common.View");
		blankTip.txt = Datas.getArString("MessagesModal.No_Reports");		
		//detail con.
		detailCon.nav_head.controller = nc;
		detailCon.Init();
		
		//nc.push(mainCon);
		b4g.Init();

//		l_bg3.setBackground("frame_metal_square", TextureType.DECORATION);
//		mainCon.addUIObject(ins_ReportItem);

//
		tb_all.selected = tb_in.selected = tb_out.selected = false;

		btn_group.addButton(tb_all);
		btn_group.addButton(tb_in);
		btn_group.addButton(tb_out);
		btn_group.buttonChangedFunc = buttonChangedFunc;
		//TODO...
		tb_all.txt = Datas.getArString("Alliance.Report_All");
		tb_in.txt = Datas.getArString("Alliance.Report_In");
		tb_out.txt  = Datas.getArString("Alliance.Report_Out");
		
		tb_all.rect.width = tb_in.rect.x - tb_all.rect.x;
		tb_all.mystyle.overflow.right = tb_all.mystyle.padding.left - tb_all.rect.width;
		
		tb_in.rect.width = tb_out.rect.x - tb_in.rect.x;
		tb_in.mystyle.overflow.right = tb_in.mystyle.padding.left - tb_in.rect.width;
		
		//tab.toolbarStrings = [Datas.getArString("Alliance.Regulars"),Datas.getArString("Alliance.Leader")];
		tab.Init();
		tab.toolbarStrings = [Datas.getArString("Common.AllianceWall"),Datas.getArString("Common.Reports")];
		tab.SetVisible(true);
		tab.indexChangedFunc = idxChgFunc;
		tab.SetDefaultNormalTxtColor(FontColor.New_PageTab_Yellow);
		tab.SetDefaultOnNormalTxtColor(FontColor.New_PageTab_Yellow);
		wallCon.Init();
		viewIndex = 0;
	}
	public function Update()
	{
		//scroll_list.Update();
		nc.u_Update();
		if(nc.topUI == reportCon)
		{
			scroll_list.Update();
			var second:long= GameMain.unixtime();
			l_time.txt = _Global.HourTime24WithoutSecond(second);
			reportCon.Update();
			
		}
		else if(nc.topUI == tipCon)
		{
			var time:long= GameMain.unixtime();
			l_time.txt = _Global.HourTime24WithoutSecond(time);
			tipCon.Update();
		}
		else if(nc.topUI == wallCon)
		{
			wallCon.Update();
		}
	}
	
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);		
		tab.Draw();
		nc.DrawItems();		
		GUI.EndGroup();
	}
	public function CanShowChatBar():boolean
	{
		return viewIndex == 0;
	}	
	protected function idxChgFunc(idx:int):void
	{
		viewIndex = idx;
		if(idx == 0)
		{
			wallCon.resetBottomOriginalPos();
			wallCon.getWallContext();
			nc.pop2Root();
			nc.switchRootUI(wallCon);
			androidChat.Open();
		}
		else 
		{
			wallCon.InputBoxKeyboard_OnOut();
			showReport();
			androidChat.CloseChatBar();
		}
	}
	
	public function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		tab.SetVisible(true);
	}
	
	public function pushedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		switch(nc.topUI)
		{
			case detailCon:
					detailCon.showReportDetail(conData);
				break;
		}
	}
	
	public function buttonChangedFunc(tb:ToggleButton):void
	{
		alrt_gotoPage(1);
	}
	
	public function showWall():void	
	{
		viewIndex = 0;
		tab.selectedIndex = 0;
		curPage = 1;
		tab.SetVisible(true);
		nc.switchRootUI(wallCon);
	}
	
	public function showReport():void
	{
		//set POS... load data ......	
		curPage = 1;
		btn_group.setSelectedButton(tb_all,false);
		b4g.pageChangedHandler = alrt_gotoPage;
		alrt_gotoPage(curPage);
	}
	
	protected function alrt_gotoPage(page:int):void
	{
		var btn:ToggleButton = btn_group.getSelectedButton();
		var filter_type:int  = 0;
		switch(btn)
		{
			case tb_all:
				break;
			case tb_in:
				filter_type = 2;	//defender..
				break;
			case tb_out:
				filter_type = 1;	//out going.
				break;
		}
		go2Page = page;
        
        Message.getInstance().ReportViewingType = ReportViewingType.Default;
		Message.getInstance().ShowAllianceMarchReportsList(page,"a",filter_type,list_loaded2,false);
		
	}
	protected function list_loaded2(result:HashObject,list:Array):void
	{
		curPage = go2Page;
		var tp:int =0;
		
		if(result["totalPages"] != null)
			tp = _Global.INT32(result["totalPages"]);
		
		if(tp == 0)
		{
			nc.switchRootUI(tipCon);
			return;	
		}
		else
		{
			nc.switchRootUI(reportCon);
		}
		b4g.setPages(curPage,tp);
		scroll_list.ResetPos();
		scroll_list.SetData(list);
//		ins_ReportItem.SetRowData(list[0]);
	}
	
	public function list_loaded(cp:int,  tp:int, list:Array):void
	{
		b4g.setPages(cp,tp);
		scroll_list.SetData(list);
//		ins_ReportItem.SetRowData(list[0]);
	}	
	
	protected function gotoAllianceReportDetail(data:Object):void
	{
		tab.SetVisible(false);
		detailCon.ShowContent(false);
		nc.push(detailCon);
		conData = data as HashObject;
//		detailCon.showReportDetail(data);
	}
	//////
	public function handleItemAction(action:String,data:Object):void
	{
		switch(action)
		{
			case Constant.Action.ALLIANCE_REPORT_NEXT:
				gotoAllianceReportDetail(data);
				break;
		}
	}
	
	public	function	Clear()
	{
		scroll_list.Clear();
		wallCon.Clear();
		detailCon.Clear();
	}
}
