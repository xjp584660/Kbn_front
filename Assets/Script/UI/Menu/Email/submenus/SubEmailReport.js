class SubEmailReport extends BaseSubEmail
{
	public var reportObject:ReportObj;
	public var btnCompose:Button;
	public var bgBottom : Label;
	public var btnShare:Button;
	private var g_isReportShare:boolean;
	
	public function Init()
	{
		super.Init();
		reportObject.Init();
	}
	
	public function DrawItem()
	{
		reportObject.Draw();
		bgBottom.Draw();
		btnCompose.Draw();
		btnShare.Draw();
		super.DrawItem();
	}
	
	public function Update()
	{
		reportObject.Update();
	}
	
	public function OnPop()
	{
		super.OnPop();
		
		g_isReportShare = false;
		EmailMenu.getInstance().resetComponentsUnclicked();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		
//		arString = Datas.instance().arStrings();
		btnCompose.txt = Datas.getArString("Common.Compose");
		btnCompose.OnClick = handleCompose;
	    btnShare.txt = Datas.getArString("Common.Share");
		btnShare.OnClick = handleShare;
		
		var table:Hashtable = param as Hashtable;
		if (table!=null&&table["otherData"]!=null){
			var senderID:int =_Global.INT32( table["senderID"]);
		  g_header =   Message.getInstance().GetReportItem(table["otherData"] as HashObject,senderID);
		  g_isReportShare = true;
		}else{
		  g_header = Message.getInstance().getMessageHeader(g_type, g_index);
		  g_isReportShare = false;
		}
		Parse(g_header);
		if (g_header!=null&&reportObject!=null) {
			reportObject.setData(g_header);
		}
		setShareBtnState();
		
		if(g_isReportShare){
		  btnCompose.visible = false;
		  btnShare.visible = false;
		  btnDelete.visible = false;
		  btnNext.visible = false;
		  btnPre.visible = false;
		  btnBack.OnClick = handleShareBack;
		  bgBottom.visible = false;
		}else{
		  btnCompose.visible = true;
		  btnShare.visible = true;
		  btnDelete.visible = true;
		  btnNext.visible = true;
		  btnPre.visible = true;
		  bgBottom.visible = true;
		  btnBack.OnClick = handleBackBtn;
		}

		var reportType: int = _Global.INT32(g_header["marchtype"]);
		if (reportType == Constant.MarchType.MistExpedition) {/* 迷雾 远征 关闭 按钮 */
			btnCompose.SetVisible(false);
			btnShare.SetVisible(false);
		}

	}
	private function Parse(hash:HashObject)
	{
		if(hash != null)
		{
			if(hash["boxContent"] != null && hash["side"] != null)
			{
				GearReport.Instance().ParseSelf(hash["boxContent"],_Global.INT32(hash["side"]));
				GearReport.Instance().ParseEnemy(hash["boxContent"],1 - _Global.INT32(hash["side"]));
			}
		}
		
	}
	protected function nextEmail()
	{
		super.nextEmail();
		
		g_header = Message.getInstance().getMessageHeader(g_type, g_index);
		Parse(g_header);
		reportObject.setData(g_header);
		setShareBtnState();
	}
	
	private function handleCompose()
	{
		EmailMenu.getInstance().handleCompose();
	}
	
	protected function preEmail()
	{
		super.preEmail();
		
		g_header = Message.getInstance().getMessageHeader(g_type, g_index);
		Parse(g_header);
		reportObject.setData(g_header);	
		setShareBtnState();
	}
	
	protected function handleDelete()
	{	
		if (g_header==null) return;
		var tempArray:Array = new Array();
		tempArray.push(_Global.INT32(g_header["rid"]));
		Message.getInstance().DeleteReportMessages(tempArray.ToBuiltin(int), successDeleteFunc);
	}
	
	private function successDeleteFunc()
	{	
		EmailMenu.getInstance().PopSubMenu();
		// EmailMenu.getInstance().changePageWhenDelMessage(1);
		EmailMenu.getInstance().successDeleteMesReportNew();
		MenuMgr.getInstance().sendNotification("DeleteFuncAction",g_header);
	}	
	protected function handleShare()
	{    if (g_header==null) return;
		  var reportId : int = _Global.INT32(g_header["rid"].Value);
		  var str:String = "Report("+ reportId +")";
		  var paramDict : Hashtable = null;
	      paramDict = new Hashtable();
	      paramDict.Add("tabName", "normal");
		  paramDict.Add("ReportShare", str);
		  var isWin:int = g_header["boxContent"]["winner"].Value;
		  var atkName:String = g_header["atknm"].Value.ToString();
		  var defName:String = g_header["defnm"].Value.ToString();
		 
		  var g_marchType:int = _Global.INT32(g_header["marchtype"]);
		  var corMatshare:Boolean = (g_marchType == Constant.MarchType.COLLECT || g_marchType == Constant.MarchType.COLLECT_RESOURCE) && g_header["boxContent"]["winner"]!=null;
	      if(g_marchType == Constant.AvaMarchType.ATTACK || g_marchType == Constant.AvaMarchType.RALLY||g_marchType == Constant.AvaMarchType.RALLYATTACK)
	      {
			var sharereportTxt:String =defName+":"+atkName+":"+isWin+":"+reportId+":"+ KBN.Datas.singleton.worldid()+":"+KBN.GameMain.Ava.Event.GetActId();
			paramDict.Add("ReportShareTxt",sharereportTxt);
	        MenuMgr.getInstance().PushMenu("AvaChatMenu",paramDict);
	      }
		  else if (g_marchType == Constant.MarchType.ATTACK || g_marchType == Constant.MarchType.PVE || g_marchType == Constant.MarchType.EMAIL_WORLDBOSS || corMatshare)
	      {
			 var sharereportTxt1:String =  defName+":"+atkName+":"+isWin+":"+reportId;
			 paramDict.Add("ReportShareTxt",sharereportTxt1);
	         MenuMgr.getInstance().PushMenu("ChatMenu", paramDict);
	      }
	}


	private function setShareBtnState()
	{
		var reportType: int = 0;
		if (g_header!=null&&g_header["marchtype"]!=null)
		{
		reportType = _Global.INT32(g_header["marchtype"]);
		}
		var corMatshare:Boolean = (reportType == Constant.MarchType.COLLECT || reportType == Constant.MarchType.COLLECT_RESOURCE) && g_header["boxContent"]["winner"]!=null;
		if ( g_type!= EmailMenu.REPORT_TYPE||reportType == 0||(reportType!= Constant.MarchType.ATTACK && reportType!=Constant.MarchType.PVE && reportType!=Constant.MarchType.EMAIL_WORLDBOSS
			&& reportType != Constant.AvaMarchType.ATTACK && reportType != Constant.AvaMarchType.RALLY && reportType != Constant.AvaMarchType.RALLYATTACK && !corMatshare))
		{
		btnShare.changeToGreyNew();
		}
		else 
		{
		btnShare.changeToBlueNew(); 
		}
	}
	private function handleShareBack()
	{
		  EmailMenu.getInstance().PopShareReport();
	}
}