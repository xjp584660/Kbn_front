import System.Collections.Generic;

public class AllianceMembers extends BaseAllianceTab implements IEventHandler
{
	public var l_bg1	:Label;
	public var l_bg2	:Label;
	public var tl_1 :Label;
	public var tl_2 :Label;
	public var tl_3 :Label;
	public var tl_4 :Label;
	public var b4g	:Button4Page;
	public var line1 :Label;
	public var line2 :Label;
	
	public var scroll_list :ScrollList;	
	public var ins_item	:ListItem;
	
	public var tab	:ToolBar;
	
	public var memCon : ComposedUIObj;
	public var leadCon	:Info2_Leaders;
	
	public var leaderBoard :AllianceLeaderBoard;
	
	public var viewIndex:int = 0;
	protected var showList:Array;
	protected var curPage:int = 1;
	
	//gift
	public var gift_item : ListItem;
	public var giftCon : ComposedUIObj;	
	public var gift_l_bg1	:Label;
	public var gift_l_bg2	:Label;
	public var gift_tl_1 :Label;
	public var gift_tl_2 :Label;
	public var gift_tl_3 :Label;
	public var gift_tl_4 :Label;
	public var gift_b4g	:Button4Page;
	public var gift_scroll_list :ScrollList;	
	
	public function Init()
	{
		scroll_list.Init(ins_item);
		gift_scroll_list.Init(gift_item);
		b4g.Init();
		b4g.pageChangedHandler = pageChangedHandler;
		gift_b4g.Init();
		
		// 
		tl_1.txt = Datas.getArString("Alliance.MemberNameAndPosition");	//"Name";
		tl_2.txt = ""; //Datas.getArString("Common.Position");	//	"Position";
		tl_3.txt = Datas.getArString("Common.Might");	//MembersInfo.LastOnline
		tl_4.txt = Datas.getArString("Alliance.MemberLastLogin");
		
		tab.Init();
		tab.toolbarStrings = [Datas.getArString("Alliance.Regulars"),Datas.getArString("Alliance.Leader"),Datas.getArString("Alliance.members_performancetab")/*,"Gift"*/];
		scroll_list.itemDelegate = this;
		gift_scroll_list.itemDelegate = this;
		leadCon.Init();
		tab.indexChangedFunc = indexChangedFunc;
		
//		l_bg3.setBackground("frame_metal_square", TextureType.DECORATION);
			
		leadCon.scroll_list.itemDelegate = this;

//		memCon.addUIObject(ins_item);
		leaderBoard.Init();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		tab.Draw();
		switch(viewIndex)
		{
			case 0:
				memCon.Draw();
				break;
			case 1:
				leadCon.Draw();
				break;
			case 2:
				leaderBoard.Draw();
				break;
			case 3:
				giftCon.Draw();
				break;
		}
//		line1.Draw();
//		line2.Draw();
		GUI.EndGroup();
	}
	
	public function Update()
	{
		switch(viewIndex)
		{
			case 0:
				scroll_list.Update();
				break;
			case 1:
				leadCon.Update();
				break;
			case 2:
				leaderBoard.Update();
			case 3:
				gift_scroll_list.Update();
				break;
		}
	}
	public function UpdateMemberItems()
	{
		pageChangedHandler(curPage);
	}
	
	public function showMembers():void	
	{
		viewIndex = 0;
		tab.selectedIndex = 0;
		curPage = 1;
		pageChangedHandler(curPage);
		//
		leadCon.showLeaders();
	}
	
	protected function indexChangedFunc(idx:int):void
	{	//
		viewIndex = idx;
		switch(idx)
		{
			case 0:
				break;
			case 1:
				break;
			case 2:
				leaderBoard.OnPush(null);
				break;
			case 3:
				
				break;
		}
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			case Constant.Action.ALLIANCE_MEMB_NAME:
			case Constant.Action.ALLIANCE_LDITEM_NAME:
				MenuMgr.getInstance().PushMenu("AllianceUserProfile",param,"trans_zoomComp");
				break;
			case Constant.Action.ALLIANCE_LDITEM_MAIL:	//param allianceMemberVo
				//
				var data = {};
				data["title"] = Datas.getArString("Alliance.MessageLeader");
				data["toIds"] =  (param as AllianceMemberVO).userId;	//allianceId
				data["type"] = "user";
				data["tileId"] = "";
				data["toname"] = (param as AllianceMemberVO).name;
				MenuMgr.getInstance().PushMenu("AllianceMail",data,"trans_zoomComp");
				break;
		}		
	}
	
	
	protected function pageChangedHandler(page:int):void
	{
		Alliance.getInstance().reqAllianceMemberList(page,pageLoaded);	
	}
	
	protected function pageLoaded(cur:int,total:int,list:List.<AllianceMemberVO>):void //
	{
		b4g.setPages(cur,total);
		curPage = cur;
		scroll_list.ResetPos();
		scroll_list.SetData(list.ToArray());
		
		gift_scroll_list.ResetPos();
		gift_scroll_list.SetData(list.ToArray());
//		ins_item.SetRowData(list[0]);
	}
	
	public	function	Clear()
	{
		scroll_list.Clear();
		gift_scroll_list.Clear();
		leaderBoard.OnPopOver();
	}
	
	public function handleNotification(type:String,body:Object):void
	{
		leaderBoard.handleNotification(type,body);
	}
	
}
