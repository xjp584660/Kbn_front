import System.IO;

public class Message extends KBN.Message {
	private var g_inboxHeaders: Array = new Array();
	private var g_inboxHeaders_2: Array = new Array();
	private var g_outboxHeaders: Array = new Array();
	private var g_reportHeaders: Array = new Array();

	public static function getInstance(): Message {
		if (g_instance == null) {
			g_instance = new Message();
			GameMain.instance().resgisterRestartFunc(function () {
				g_instance.Free();
				g_instance = null;
			});
		}

		return g_instance as Message;
	}

	protected function Message() {
		super();
		dao = new MessageDAO();
	}

	public function ResetMessage() {
		SetMessageReady();
		dao.ResetMessageStatistics();
	}

	public function getMessageHeader(_type: int, _index: int): HashObject {
		if (_type == EmailMenu.INBOX_TYPE) {
			return g_inboxHeaders[_index];
		}
		else if (_type == EmailMenu.INBOX_TYPE2) {
			return g_inboxHeaders_2[_index];
		}
		else if (_type == EmailMenu.REPORT_TYPE) {
			return g_reportHeaders[_index];
		}
		else if (_type == EmailMenu.SENT_TYPE) {
			return g_outboxHeaders[_index];
		}
	}

	public function clearMessageHeader() {
		g_inboxHeaders.Clear();
		g_inboxHeaders_2.Clear();
		g_reportHeaders.Clear();
		g_outboxHeaders.Clear();
		
	}

	public function get reportHeaders(): Array {
		return g_reportHeaders;
	}

	public function view(boxType: String, messageId: int, resultFunc: Function, isSys: boolean) {
		switch (boxType) {
			case MessageCacheType.inbox.ToString():
				ViewInbox(messageId, resultFunc, isSys);
				break;
			case MessageCacheType.sysInbox.ToString():
				ViewInbox2(messageId, resultFunc, isSys);
				break;
			case MessageCacheType.outbox.ToString():
				ViewOutBox(messageId, resultFunc);
				break;
		}
	}
	public function ViewInbox(messageId: int, resultFunc: Function, isSys: boolean) {
		var sys: int = isSys ? 1 : 0;

		for (var message: HashObject in g_inboxHeaders) {
			if (message != null && _Global.INT32(message["messageId"].Value) == messageId && _Global.INT32(message["isSys"].Value) == sys) {
				resultFunc(message["boxContent"]);
				if (_Global.INT32(message["messageRead"]) == 0) {
					message["messageRead"].Value = "1";
					dao.SetMessageReaded(messageId, isSys);
				}
				break;
				//change mail read status
			}
		}
	}

	public function ViewInbox2(messageId: int, resultFunc: Function, isSys: boolean) {
		var sys: int = isSys ? 1 : 0;

		for (var message: HashObject in g_inboxHeaders_2) {
			if (message != null && _Global.INT32(message["messageId"].Value) == messageId && _Global.INT32(message["isSys"].Value) == sys) {
				resultFunc(message["boxContent"]);
				if (_Global.INT32(message["messageRead"]) == 0) {
					message["messageRead"].Value = "1";
					dao.SetMessageReaded(messageId, isSys);
				}
				break;
				//change mail read status
			}
		}
	}

	public function ViewOutBox(messageId: int, resultFunc: Function) {
		for (var message: HashObject in g_outboxHeaders) {
			if (message != null && _Global.INT32(message["messageId"].Value) == messageId) {
				resultFunc(message["boxContent"]);
				break;
			}
		}
	}

	public function viewMarchReportWithoutSetRead(rid: int, side: int, resultFunc: Function) {
		for (var report: HashObject in g_reportHeaders) {
			if (report != null && _Global.INT32(report["rid"].Value) == rid) {
				var result: HashObject = report["boxContent"];
				resultFunc(result);
				break;
			}
		}
	}

	public function viewMarchReport(rid: int, side: int, resultFunc: Function) {
		for (var report: HashObject in g_reportHeaders) {
			if (report != null && _Global.INT32(report["rid"].Value) == rid) {
				if (_Global.INT32(report["messageRead"]) == 0) {
					report["messageRead"].Value = "1";
					currentReportViewingStrategy.SetReportRead(dao, rid);
				}
				var result: HashObject = report["boxContent"];
				resultFunc(result);
				break;
				//change mail read status
			}
		}
	}

	public function viewAllianceBossReport(resultFunc: Function, needCount: int) {
		var canStop: boolean = false;
		var MAX_LOOP_COUNT = 100;
		var resultList: System.Collections.Generic.List.<Hashtable> = new System.Collections.Generic.List.<Hashtable>();
		var okFunction: Function = function (headers: Array) {
			if (headers.length <= 0) {
				canStop = true;
				return;
			}
			for (var report: HashObject in headers) {
				if (_Global.INT32(report["marchtype"].Value) == Constant.MarchType.ALLIANCEBOSS) {
					if (KBN.AllianceBossController.instance().startTime == 0 || _Global.INT64(report["boxContent"]["reportUnixTime"]) > KBN.AllianceBossController.instance().startTime) {
						var rid: int = _Global.INT32(report["rid"].Value);
						var data: Hashtable = { "data": report["boxContent"], "header": report, "id": _Global.INT32(report["rid"]) };
						var h: Hashtable;
						var isHave: boolean = false;
						for (var j = 0; j < resultList.Count; j++) {
							h = resultList[j] as Hashtable;
							if (rid == _Global.INT32(h["id"])) {
								isHave = true;
								break;
							}
						}
						if (!isHave) {
							resultList.Add(data);
						}

						if (resultList.Count >= needCount) {
							canStop = true;
							return;
						}
					}
				}
			}
		};
		var i: int = 1;
		while (i <= MAX_LOOP_COUNT) {
			ShowReportList(i, okFunction, null, 1);
			i++;
			if (canStop)
				break;
		}

		resultFunc(resultList);
	}

	public function SetInboxsRead(inboxIds: int[], callback: function()) {
		SetMessageReadInternal(inboxIds, null, null, callback);
	}
	public function SetSysboxsRead(sysIds: int[], callback: function()) {
		SetMessageReadInternal(null, sysIds, null, callback);
	}
	public function SetReportsRead(reportIds: int[], callback: function()) {
		SetMessageReadInternal(null, null, reportIds, callback);
	}
	private function SetMessageReadInternal(inboxIds: int[], sysIds: int[], reportIds: int[], callback: function()) {
		if (inboxIds != null) {
			dao.SetMessagesReaded(null, inboxIds);
		}
		if (sysIds != null) {
			dao.SetMessagesReaded(sysIds, null);
		}
		if (reportIds != null) {
			currentReportViewingStrategy.SetReportsRead(dao, reportIds);
		}

		if (callback != null) {
			callback();
		}
	}

	public function ReadAllSysEmail(callback: function())
	{
		dao.ReadAllSysEmail();
		if(callback != null)
			callback();
	}

	public function ReadAllEmail(callback : function())
	{
		dao.ReadAllEmail();
		if(callback != null)
			callback();
	}

	public function ReadAllReport(callback : function())
	{
		dao.ReadAllReport();
		if(callback != null)
			callback();
	}

	public function EmptySysInboxMessages(callback: function()) {
		dao.DeleteSysInbox();
		if (callback != null) {
			callback();
		}
	}

	public function EmptyInboxMessages(callback: function()) {
		dao.DeleteNormalInbox();
		if (callback != null) {
			callback();
		}
	}

	public function EmptyReportMessages(callback: function()) {
		currentReportViewingStrategy.DeleteAllReports(dao);
		if (callback != null) {
			callback();
		}
	}
	public function EmptyOutboxMessages(callback: function()) {
		dao.DeleteAllOutbox();
		if (callback != null) {
			callback();
		}
	}

	public function DeleteMessageInbox(messageId: int, isSys: boolean, callback: function()) {
		if (messageId > 0) {
			dao.DeleteInbox(messageId, isSys);
			callback();
		}
	}
	public function DeleteMessageOutbox(messageId: int, callback: function()) {
		if (messageId > 0) {
			dao.DeleteOutbox(messageId);
			callback();
		}
	}
	public function DeleteReport(messageId: int, callback: function()) {
		if (messageId > 0) {
			currentReportViewingStrategy.DeleteReport(dao, messageId);
			callback();
		}
	}


	public function DeleteSysMessages(messageIds: int[], callback: function()): void {
		DeleteMessageInternal(null, messageIds, null, null, callback, false);
	}
	public function DeleteInboxMessages(messageIds: int[], callback: function()): void {
		DeleteMessageInternal(messageIds, null, null, null, callback, false);
	}
	public function DeleteSysMessagesTrue(messageIds: int[], callback: function()): void {
		DeleteMessageInternal(null, messageIds, null, null, callback, true);
	}
	public function DeleteInboxMessagesTrue(messageIds: int[], callback: function()): void {
		DeleteMessageInternal(messageIds, null, null, null, callback, true);
	}

	public function DeleteOutboxMessages(messageIds: int[], callback: function()): void {
		DeleteMessageInternal(null, null, null, messageIds, callback, false);
	}

	public function DeleteReportMessages(messageIds: int[], callback: function()): void {
		DeleteMessageInternal(null, null, messageIds, null, callback, false);
	}
	private function DeleteMessgae(inboxIds: int[], sysIds: int[], reportIds: int[], outboxIds: int[], isSys: boolean) {
		if (inboxIds != null && inboxIds.length > 0) {
			if (isSys) {
				for (var i = 0; i < inboxIds.length; i++) {
					for (var j = 0; j < g_inboxHeaders.length; j++) {
						if (g_inboxHeaders[j] != null && _Global.INT32((g_inboxHeaders[j] as HashObject)["messageId"]) ==
							inboxIds[i]) {
							g_inboxHeaders[j] = null;
							break;
						}
					}
				}
			} else {
				for (var iiiii = 0; iiiii < inboxIds.length; iiiii++) {
					for (var jjjjj = 0; jjjjj < g_inboxHeaders_2.length; jjjjj++) {
						if (g_inboxHeaders_2[jjjjj] != null && _Global.INT32((g_inboxHeaders_2[jjjjj] as HashObject)["messageId"]) ==
							inboxIds[iiiii]) {
							g_inboxHeaders_2[jjjjj] = null;
							break;
						}
					}
				}
			}
		}
		if (sysIds != null && sysIds.length > 0) {
			if (isSys) {
				for (var iiiiii = 0; iiiiii < sysIds.length; iiiiii++) {
					for (var jjjjjj = 0; jjjjjj < g_inboxHeaders.length; jjjjjj++) {
						if (g_inboxHeaders[jjjjjj] != null && _Global.INT32((g_inboxHeaders[jjjjjj] as HashObject)["messageId"]) ==
							sysIds[iiiiii]) {
							g_inboxHeaders[jjjjjj] = null;
							break;
						}
					}
				}
			} else {
				for (var ii = 0; ii < sysIds.length; ii++) {
					for (var jj = 0; jj < g_inboxHeaders_2.length; jj++) {
						if (g_inboxHeaders_2[jj] != null && _Global.INT32((g_inboxHeaders_2[jj] as HashObject)["messageId"]) ==
							sysIds[ii]) {
							g_inboxHeaders_2[jj] = null;
							break;
						}
					}
				}
			}
		}

		if (outboxIds != null && outboxIds.length > 0) {
			for (var iii = 0; iii < outboxIds.length; iii++) {
				for (var jjj = 0; jjj < g_outboxHeaders.length; jjj++) {
					if (g_outboxHeaders[jjj] != null && _Global.INT32((g_outboxHeaders[jjj] as HashObject)["messageId"]) ==
						outboxIds[iii]) {
						g_outboxHeaders[jjj] = null;
						break;
					}
				}
			}
		}

		if (reportIds != null && reportIds.length > 0) {
			for (var iiii = 0; iiii < reportIds.length; iiii++) {
				for (var jjjj = 0; jjjj < g_reportHeaders.length; jjjj++) {
					if (g_reportHeaders[jjjj] != null && _Global.INT32((g_reportHeaders[jjjj] as HashObject)["rid"]) ==
						reportIds[iiii]) {
						g_reportHeaders[jjjj] = null;
						break;
					}
				}
			}
		}
	}

	private function DeleteMessageInternal(inboxIds: int[], sysIds: int[], reportIds: int[], outboxIds: int[], callback: function(), isSys: boolean): void {
		if (inboxIds != null && inboxIds.length > 0) {
			dao.DeleteInboxs(inboxIds, null);
		}
		if (sysIds != null && sysIds.length > 0) {
			dao.DeleteInboxs(null, sysIds);
		}

		if (outboxIds != null && outboxIds.length > 0) {
			dao.DeleteOutboxs(outboxIds);
		}

		if (reportIds != null && reportIds.length > 0) {
			currentReportViewingStrategy.DeleteReports(dao, reportIds);
		}
		DeleteMessgae(inboxIds, sysIds, reportIds, outboxIds, isSys);
		if (callback != null) {
			callback();
		}
	}

	public function ShowAllianceMarchReportsList(pageNo: int, group: String, filterType: int, resultFunc: Function, isRefresh: boolean): void {
		var params: Hashtable = { "pageNo": pageNo };

		//params.Add(pageNo);
		if (group != null) {
			params["group"] = group;
		}

		if (filterType > 0) {
			params["filterType"] = filterType;
		}
		var okFunction: Function = function (rslt: HashObject) {
			if (rslt["ok"].Value) {
				if (resultFunc != null) {
					g_reportHeaders.clear();

					var keys: Array;
					if (rslt["arReports"] != null)
						keys = _Global.GetObjectKeys(rslt["arReports"]);
					else
						keys = new Array();

					keys = changeOrderByKey(keys);

					for (var a: int = 0; a < keys.length; a++) {
						var r: HashObject = rslt["arReports"]["r" + keys[a]];
						var subject: String = getMarchReportTitle(r, rslt);
						var seed: HashObject = GameMain.instance().getSeed();

						var _side: int;
						if (group == "a") {
							_side = _Global.INT32(r["side1AllianceId"]) == _Global.INT32(seed["allianceDiplomacies"]["allianceId"]) ? 1 : 0;
						}
						else {
							_side = _Global.INT32(r["side0PlayerId"]) == tvuid ? 0 : 1;
						}

						var hasRead: String;
						if (r["reportStatus"] == null) {
							hasRead = "read";
						}
						else {
							hasRead = _Global.INT32(r["reportStatus"]) == 2 ? "unread" : "read";
						}

						var defName: String;
				
						if (r["side0PlayerId"] == null) {
							defName = Datas.getArString("Common.Enemy");
						}
						else {
							defName = _Global.INT32(r["side0PlayerId"]) != 0 ? rslt["arPlayerNames"]["p" + r["side0PlayerId"].Value].Value : Datas.getArString("Common.Enemy");										
						}
						var attacker: String = Datas.getHashObjectValue(rslt, "arPlayerNames.p" + Datas.getHashObjectValue(r, "side1PlayerId"));
		
						var report: HashObject = InitMarchReportInternal(r);
						report["isWin"].Value = isWin(Datas.getHashObjectValue(r, "side1AllianceId"), Datas.getHashObjectValue(r, "marchTypeState"), seed);
						report["reportsClass"].Value = hasRead;
						report["subject"].Value = subject;
						report["side"].Value = _side;
						report["defnm"].Value = defName;
						report["atknm"].Value = attacker;

						var def_Icon:String="oldEmail";
						var atk_Icon:String="oldEmail";
						if (rslt["arPlayerNames"]!=null) {
							if(r["side0PlayerId"]!=null&&_Global.INT32(r["side0PlayerId"]) != 0&&rslt["arPlayerNames"]["a" + r["side0PlayerId"].Value]!=null&&rslt["arPlayerNames"]["a" + r["side0PlayerId"].Value].Value!=null){
								def_Icon=rslt["arPlayerNames"]["a" + r["side0PlayerId"].Value].Value;
							}
							if(rslt["arPlayerNames"]["a" + r["side1PlayerId"].Value]!=null&&
							rslt["arPlayerNames"]["a" + r["side1PlayerId"].Value].Value!=null){
								atk_Icon=rslt["arPlayerNames"]["a" + r["side1PlayerId"].Value].Value;
							}		
						}

						report["new_atfIcon"].Value = atk_Icon;
						report["new_defIcon"].Value = def_Icon;

						var def_AvatarFrame:String="img0";
						var atk_AvatarFrame:String="img0";
						if (rslt["arAvatarFrame"]!=null) {
							if(r["side0PlayerId"]!=null&&_Global.INT32(r["side0PlayerId"]) != 0&&rslt["arAvatarFrame"]["" + r["side0PlayerId"].Value]!=null&&rslt["arAvatarFrame"]["" + r["side0PlayerId"].Value].Value!=null){
								def_AvatarFrame=rslt["arAvatarFrame"]["" + r["side0PlayerId"].Value].Value;
							}
							if(rslt["arAvatarFrame"]["" + r["side1PlayerId"].Value]!=null&&
							rslt["arAvatarFrame"]["" + r["side1PlayerId"].Value].Value!=null){
								atk_AvatarFrame=rslt["arAvatarFrame"]["" + r["side1PlayerId"].Value].Value;
							}		
						}
						report["new_defAvatarFrame"].Value = def_AvatarFrame;
						report["new_atfAvatarFrame"].Value = atk_AvatarFrame;

						g_reportHeaders.push(report);	//fix.. not rslt.
					}

					if (resultFunc != null) {
						resultFunc(rslt, g_reportHeaders);
					}
				}
			}
			else {
				if (resultFunc != null) {
					resultFunc(rslt, new Array());
				}
			}
		};

		UnityNet.reqWWW("listReports.php", params, okFunction, null);
	}

	public function ShowReportList(pageNo: int, resultFunc: Function, exceptionCallback: Function, isShowAll: int) {
		var okFunction: Function = function (rslt: HashObject) {
			if (resultFunc != null) {
				//Debug.Log("isShowAll Out = " + isShowAll);
				if (isShowAll == 1) {
				//	Debug.Log("isShowAll in = " + isShowAll);
					g_reportHeaders.clear();
				}

				try {
					for (var i: System.Collections.DictionaryEntry in rslt.Table) {
						var r: HashObject = i.Value;
						var subject: String = getMarchReportTitleLocal(r);
						var seed: HashObject = GameMain.instance().getSeed();

						var _side: int = CalcPlayerSide(_Global.INT32(r["side0PlayerId"]), _Global.INT32(r["side0WorldId"]));
						var heroCarmotSpeed: int = 0;
						var hasRead: String;
						if (r["messageRead"].Value == "1") {
							hasRead = "read";
						}
						else {
							hasRead = "unread";
						}

						var defName: String;
			
						if (r["side0PlayerId"] != null && _Global.INT32(r["side0PlayerId"]) > 0) // side0PlayerId is the defending side
						{
							defName = r["s0Name"].Value;
						}
						else {
							defName = Datas.getArString("Common.Enemy");
						}

						if (r["boxContent"]["heroCarmotSpeed"] != null) // side0PlayerId is the defending side
						{
							heroCarmotSpeed = r["boxContent"]["heroCarmotSpeed"].Value;
						}

						var report: HashObject = InitMarchReportInternal(r);

						report["isWin"].Value = isWin(Datas.getHashObjectValue(r, "side1AllianceId"), Datas.getHashObjectValue(r, "marchTypeState"), seed);
						report["reportsClass"].Value = hasRead;
						report["subject"].Value = subject;
						report["side"].Value = _side;
						report["defnm"].Value = defName;
						report["heroCarmotSpeed"].Value = heroCarmotSpeed;


						//fix.. not rslt.
						var isHave = false;
						for (var j = 0; j < g_reportHeaders.length; j++) {
							if (g_reportHeaders[j] != null && _Global.INT32((g_reportHeaders[j] as HashObject)["rid"]) ==
								_Global.INT32(report["rid"])) {
								g_reportHeaders[j] = report;
								isHave = true;
								break;
							}
						}
						if (!isHave) {
							g_reportHeaders.push(report);
						}
						if(ReportViewingType == ReportViewingType.Default)
						{
							var isHave1:Boolean = false;
							for (var k = 0; k < reportarr.length; k++)
							{
								if (reportarr[k] != null && _Global.INT32((reportarr[k] as HashObject)["rid"]) ==
								_Global.INT32(report["rid"])) 
								{
									isHave1 = true;
									break;
								}
							}
							if (reportarr.length > 0 && !isHave1)
							{
								reportarr.push(report);
							}
							
						}
						else if (ReportViewingType == ReportViewingType.Ava)
						{
							var isHave2:Boolean = false;
							for (var n = 0; n < avaReportarr.length; n++)
							{
								if (avaReportarr[n] != null && _Global.INT32((avaReportarr[n] as HashObject)["rid"]) ==
								_Global.INT32(report["rid"])) 
								{
									isHave2 = true;
									break;
								}
							}
							if (avaReportarr.length > 0 &&!isHave2)
							{
								avaReportarr.push(report);
							}							
						}
					}
					g_reportHeaders.Sort(function (objA: HashObject, objB: HashObject) {
						return _Global.INT32(objB["rid"].Value) - _Global.INT32(objA["rid"].Value);
					});
					
				}
				catch (error: System.Exception) {
					UnityNet.reportErrorToServer("EmailMenu", null, "Client Exception", error.Message, false);
					EmptyReportMessages(function () {
						//_Global.Log("Report Data Exception");
						if (exceptionCallback != null) {
							exceptionCallback();
						}
					});
					return;
				}
				resultFunc(g_reportHeaders);
			}
		};
		try {
			var reports: Hashtable = isShowAll != 1 ?
				currentReportViewingStrategy.SelectReports(dao, pageNo, pageSize) :
				currentReportViewingStrategy.SelectReports(dao, 1, pageNo * pageSize);
		}
		catch (e: System.Exception) {
			if (!OnDBSqliteException(e))
				throw;
			return;
		}

		okFunction(new HashObject(reports));
	}

	public function ShowList(boxType: String, pageNo: int, resultFunc: Function, isRefresh: boolean, exceptionCallback: Function) {
		ShowList(boxType, pageNo, resultFunc, isRefresh, exceptionCallback, 0, 0);
	}
	// 	public function ShowList(boxType:String,pageNo:int, resultFunc:Function,isRefresh:boolean,exceptionCallback:Function):void
	public function ShowList(boxType: String, pageNo: int, resultFunc: Function, isRefresh: boolean, exceptionCallback: Function, isSysMail: int, isShowAll: int): void {
		var okFunction: Function = function (result: HashObject) {
			if (resultFunc != null) {
				var temp_array: Array;
				try {
					temp_array = orderArrayById(result);
				}
				catch (error: System.Exception) {
					UnityNet.reportErrorToServer("EmailMenu", null, "Client Exception", error.Message, false);
					if (boxType == "inbox") {
						EmptyInboxMessages(function () {
							//_Global.Log("Inbox Data Exception");
							if (exceptionCallback != null) {
								exceptionCallback();
							}
						});
					}
					else {
						EmptyOutboxMessages(function () {
							//_Global.Log("Inbox Data Exception");
							if (exceptionCallback != null) {
								exceptionCallback();
							}
						});
					}

					return;
				}

				if (boxType == "inbox") {
					if (isSysMail) {
						if (isShowAll == 1) {
							g_inboxHeaders.clear();
							g_inboxHeaders = temp_array;
						} else {
							for (var i = 0; i < temp_array.length; i++) {
								var isHave = false;
								for (var j = 0; j < g_inboxHeaders.length; j++) {
									if (g_inboxHeaders[j] != null && _Global.INT32((temp_array[i] as HashObject)["messageId"]) ==
										_Global.INT32((g_inboxHeaders[j] as HashObject)["messageId"])) {
										g_inboxHeaders[j] = temp_array[i];
										isHave = true;
										break;
									}
								}
								if (!isHave) {
									g_inboxHeaders.push(temp_array[i]);
								}
							}
							// g_inboxHeaders.AddRange(temp_array);
						}

						resultFunc(result, g_inboxHeaders);
					} else {
						if (isShowAll == 1) {
							g_inboxHeaders_2.clear();
							g_inboxHeaders_2 = temp_array;
						} else {
							for (var ii = 0; ii < temp_array.length; ii++) {
								var isHavei = false;
								for (var jj = 0; jj < g_inboxHeaders_2.length; jj++) {
									if (g_inboxHeaders_2[jj] != null && _Global.INT32((temp_array[ii] as HashObject)["messageId"]) ==
										_Global.INT32((g_inboxHeaders_2[jj] as HashObject)["messageId"])) {
										g_inboxHeaders_2[jj] = temp_array[ii];
										isHavei = true;
										break;
									}
								}
								if (!isHavei) {
									g_inboxHeaders_2.push(temp_array[ii]);
								}
							}
							// g_inboxHeaders_2.AddRange(temp_array);
						}

						resultFunc(result, g_inboxHeaders_2);
					}

				}
				else {
					if (isShowAll == 1) {
						g_outboxHeaders.clear();
						g_outboxHeaders = temp_array;
					} else {
						for (var iii = 0; iii < temp_array.length; iii++) {
							var isHaveii = false;
							for (var jjj = 0; jjj < g_outboxHeaders.length; jjj++) {
								if (g_outboxHeaders[jjj] != null && _Global.INT32((g_outboxHeaders[jjj] as HashObject)["messageId"]) ==
									_Global.INT32((temp_array[iii] as HashObject)["messageId"])) {
									g_outboxHeaders[jjj] = temp_array[iii];
									isHaveii = true;
									break;
								}
							}
							if (!isHaveii) {
								g_outboxHeaders.push(temp_array[iii]);
							}
						}
					}

					resultFunc(result, g_outboxHeaders);
				}

			}
		};
		var message: Hashtable;
		try {

			if (MessageCacheType.inbox.ToString() == boxType)
				message = dao.SelectInboxMessages(isShowAll == 1 ? 1 : pageNo, isShowAll == 1 ? pageNo * pageSize : pageSize, isSysMail);
			//				message = dao.SelectInboxMessages(pageNo,pageSize);
			else
				message = dao.SelectOutBoxMessages(isShowAll == 1 ? 1 : pageNo, isShowAll == 1 ? pageNo * pageSize : pageSize);
		}
		catch (e: System.Exception) {
			if (!this.OnDBSqliteException(e))
				throw;
			return;
		}
		//init result as same as from server

		var result: Hashtable = new Hashtable();
		result["message"] = message;
		result["pageNo"] = pageNo;

		result["ok"] = true;
		okFunction(new HashObject(result));
	}

	public function DeleteCheckedReports(s0rids: Array, s1rids: Array, resultFunc: Function): void {

	}
	private function changeOrderByKey(keys: Array): Array {
		var returnArray: Array = new Array();
		var key: int;
		var a: int;
		var temp: int;

		for (a = 0; a < keys.length; a++) {
			key = _Global.INT32((keys[a] as String).Split("r"[0])[1]);
			returnArray.push(key);
		}

		for (var j: int = 0; j < returnArray.length; j++) {
			for (var i: int = returnArray.length - 1; i > j; i--) {
				if (_Global.INT32(returnArray[j]) < _Global.INT32(returnArray[i])) {
					temp = returnArray[j];
					returnArray[j] = returnArray[i];
					returnArray[i] = temp;
				}
			}
		}

		return returnArray;
	}


	private function isWin(side1Alliance: String, marchStateType: String, seed: HashObject): boolean {
		if (seed["allianceDiplomacies"] != null) {
			if (side1Alliance == seed["allianceDiplomacies"]["allianceId"].Value) {
				return marchStateType == "0" ? false : true;
			}
			else {
				return marchStateType == "0" ? true : false;
			}
		}

		return false;
	}
	private function getMarchReportTitleLocal(report: HashObject): String {
		return getMarchReportTitle(report, null);
	}

	private function getMarchReportTitle(report: HashObject, rslt: HashObject): String {
		return currentReportViewingStrategy.GetMarchReportTitle(report, rslt);
	}

	public function SendMessage(_to: String, _subject: String, _message: String, resultFunc: Function): void {
		var params: Array = new Array();
		params.Add(_to);
		params.Add(_subject);
		params.Add(_message);
		params.Add("COMPOSED_MAIL");

		var okFunction: Function = function (result: HashObject) {
			if (result["ok"].Value) {
				if (resultFunc != null) {
					resultFunc(result);
				}
			}
		};
		UnityNet.reqSend(params, okFunction, null);
	}

	private function orderArrayById(result: HashObject): Array {
		var returnArr: Array = new Array();
		var emailHeaderArr: Array = new Array();
		var header: HashObject;

		for (var i: System.Collections.DictionaryEntry in result["message"].Table) {
			header = i.Value as HashObject;
			returnArr.push(header);
		}
		returnArr.Sort(function (comparea: Object, compareb: Object) {
			var timea: long = _Global.INT64((comparea as HashObject)["unixTime"].Value);
			var timeb: long = _Global.INT64((compareb as HashObject)["unixTime"].Value);
			return timeb - timea;
		});

		return returnArr;
	}


	/***********************************/
	private function DownloadMessages(type: MessageCacheType, callback: Function): void {
		if (downloadMessageDoing) {
			return;
		}
		downloadMessageDoing = true;
		var statistics: MessageStatistics = dao.MessageStatistics;
		var params: Array = new Array();
		params[0] = "GET_ALL_MESSAGES_FOR_USER_INBOX";
		params[1] = type.ToString();
		switch (type) {
			case MessageCacheType.inbox:
				params[2] = statistics.InboxMaxId;
				break;
			case MessageCacheType.sysbox:
				params[2] = statistics.SysMaxId;
				break;
			case MessageCacheType.outbox:
				params[2] = statistics.OutboxMaxId;
				break;
		}
		params[3] = -1;

		var ok: Function = function (result: HashObject) {
			downloadMessageDoing = false;
			callback(result);
		};
		var error: Function = function () {
			downloadMessageDoing = false;
		};
		UnityNet.reqNewShowList(params, ok, error);
	}

	protected function OnDBSqliteException(normalException: System.Exception): boolean {
		//_Global.Log(normalException.Message);
		var sqliteException: Mono.Data.Sqlite.SqliteException = normalException as Mono.Data.Sqlite.SqliteException;
		if (sqliteException == null)
			return false;
		var errString = "The database disk image is malformed";
		if (sqliteException.Message.Length < errString.Length || sqliteException.Message.Substring(0, errString.Length) != errString)
			return false;
		dao.DestroyDB();
		var errMgr: ErrorMgr = ErrorMgr.instance();
		errMgr.PushError("", Datas.getArString("Error.err_1"), true, "", function () {
			GameMain.instance().restartGame();
		});
		return true;
	}

	public function DownLoadInboxs(isSys: boolean, callback: Function) {
		var ok: Function = function (rawData: HashObject) {
			var messages: Array = new Array();
			for (var i: System.Collections.DictionaryEntry in rawData["message"].Table) {
				var message: HashObject = i.Value;
				messages.Add(message);
			}

			try {
				dao.InsertInboxMessage(messages.ToBuiltin(System.Object), isSys);
			}
			catch (e) {
				if (!OnDBSqliteException(e))
					throw;
				return;
			}

			if (callback != null)
				callback();
		};

		var type: MessageCacheType = MessageCacheType.inbox;
		if (isSys) {
			type = MessageCacheType.sysbox;
		}

		DownloadMessages(type, ok);
	}


	public function DownLoadOutboxs(callback: Function) {
		var ok: Function = function (rawData: HashObject) {
			var messages: Array = new Array();
			for (var i: System.Collections.DictionaryEntry in rawData["message"].Table) {
				var message: HashObject = i.Value;
				messages.Add(message);
			}

			try {
				dao.InsertOutBoxMessage(messages.ToBuiltin(System.Object));
			}
			catch (e) {
				if (!OnDBSqliteException(e))
					throw;
				return;
			}

			if (callback != null) {
				callback();
			}
		};

		DownloadMessages(MessageCacheType.outbox, ok);
	}

	public function ReadEventCenterTable(): Hashtable {
		return dao.ReadEventCenterTable();
	}

	public function SetEventCenterRead(eventId: int) {
		try {
			var messages: Array = new Array();
			messages.push(eventId);
			dao.SetEventCenterRead(messages.ToBuiltin(int));
		}
		catch (e) {
			if (!OnDBSqliteException(e))
				throw;
			return;
		}
	}

	public function UpdateEventCenterTabel(seed: HashObject) {
		if (seed["geEvent"] != null && seed["geEvent"]["events"] != null) {
			var tempArray: Array = _Global.GetObjectValues(seed["geEvent"]["events"]);
			var eventItem: HashObject;
			if (tempArray.Count > 0) {
				//add
				for (var j: int = 0; j < tempArray.Count; j++) {
					eventItem = tempArray[j] as HashObject;
					if (null != eventItem["eventId"]) {
						//var reads:HashObject = dao.ReadEventCenterTable();	
						var reads: Array = _Global.GetObjectValues(dao.ReadEventCenterTable());
						var isHave: boolean = false;
						for (var i: int = 0; i < reads.Count; ++i) {
							var message: EventCenterTableInfo = reads[i] as EventCenterTableInfo;
							var id: int = _Global.INT32(eventItem["eventId"]);
							if (message.eventId == id) {
								isHave = true;
								break;
							}
						}

						if (!isHave) {
							InsertEventCenterTable(eventItem);
						}
					}
				}

				//delete
				//DeleteEventerCenterById(seed);
			}
		}

		SeasonsEvent(seed);
	}

	private function SeasonsEvent(seed: HashObject) {
		if (seed["geEvent"] != null && seed["geEvent"]["seasons"] != null) {
			var tempArray: Array = _Global.GetObjectValues(seed["geEvent"]["seasons"]);
			var eventItem: HashObject;
			if (tempArray.Count > 0) {
				//add
				for (var j: int = 0; j < tempArray.Count; j++) {
					eventItem = tempArray[j] as HashObject;
					if (null != eventItem["seasonId"]) {
						//var reads:HashObject = dao.ReadEventCenterTable();	
						var reads: Array = _Global.GetObjectValues(dao.ReadEventCenterTable());
						var isHave: boolean = false;
						for (var i: int = 0; i < reads.Count; ++i) {
							var message: EventCenterTableInfo = reads[i] as EventCenterTableInfo;
							var id: int = _Global.INT32(eventItem["seasonId"]);
							if (message.eventId == id) {
								isHave = true;
								break;
							}
						}

						if (!isHave) {
							InsertEventCenterTable(eventItem);
						}
					}
				}

				//delete
				//DeleteEventerCenterById(seed);
			}
		}
	}

	private function DeleteEventerCenterById(seed: HashObject) {
		var reads: Array = _Global.GetObjectValues(dao.ReadEventCenterTable());

		for (var i: int = 0; i < reads.Count; ++i) {
			var isHave: boolean = false;
			var message: EventCenterTableInfo = reads[i] as EventCenterTableInfo;
			var tempArray: Array = _Global.GetObjectValues(seed["geEvent"]["events"]);
			var eventItem: HashObject;
			if (tempArray.Count > 0) {
				for (var j: int = 0; j < tempArray.Count; j++) {
					eventItem = tempArray[j] as HashObject;
					if (null != eventItem["eventId"]) {
						var id: int = _Global.INT32(eventItem["eventId"]);
						if (message.eventId == id) {
							isHave = true;
							break;
						}
					}
				}
			}

			if (!isHave) {
				DeleteEventCenterTable(message.eventId);
			}
		}
	}

	private function DeleteEventCenterTable(eventId: int) {
		try {
			dao.DeleteEventCenterById(eventId);
		}
		catch (e) {
			if (!OnDBSqliteException(e))
				throw;
			return;
		}
	}

	public function InsertEventCenterTable(eventCenterInfo: HashObject) {
		var messages: Array = new Array();
		messages.Add(eventCenterInfo);
		try {
			dao.InsertEventCenterMessage(messages.ToBuiltin(System.Object));
		}
		catch (e) {
			if (!OnDBSqliteException(e))
				throw;
			return;
		}
	}

	public function DownLoadReports(callback: Function, expedition: String) {
		if (downloadMessageDoing) {
			return;
		}
		downloadMessageDoing = true;

		var ok: Function = function (rawData: HashObject) {
			var playerNames: HashObject = rawData["arPlayerNames"];
			var alcNames: HashObject = rawData["arAllianceNames"];
			var cityNames: HashObject = rawData["arCityNames"];
			var frameNames: HashObject = rawData["arAvatarFrame"];
			var messages: List.<System.Object> = GetMessageList(rawData, playerNames, alcNames, cityNames, frameNames);

			// MyItems.instance().AddReportdDropItems(rawData["arReports"] as HashObject);

			try {
				dao.InsertReportMessage(messages.ToArray());
			}
			catch (error: System.Exception) {
				if (!OnDBSqliteException(error))
					throw;
				return;
			}
			finally {
				downloadMessageDoing = false;
				if (callback != null) {
					callback();
				}
			}
		};

		var error: Function = function (errMsg: String, errCode: String) {
			downloadMessageDoing = false;
			if (callback != null) {
				callback();
			}
		};

		var params: Array = new Array();

		params[0] = MessageStatistics.ReportMaxId.ToString();
		//_Global.Log("MessageStatistics.ReportMaxId="+MessageStatistics.ReportMaxId);
		params[1] = "-1"; //group
		params[2] = "-1";

		RequestNormalMarchReports(params.ToBuiltin(typeof (String)), expedition, ok, error);
	}

	public function getHeadersCount(_type: int): int {
		if (_type == EmailMenu.INBOX_TYPE) {
			return g_inboxHeaders.length;
		} else if (_type == EmailMenu.INBOX_TYPE2) {
			return g_inboxHeaders_2.length;
		}
		else if (_type == EmailMenu.REPORT_TYPE) {
			return g_reportHeaders.length;
		}
		else if (_type == EmailMenu.SENT_TYPE) {
			return g_outboxHeaders.length;
		}
		return 0;
	}
	public function CountPage(_type: MessageCacheType) {
		if (_type == MessageCacheType.sysInbox) {
			return MessageStatistics.SysInboxPageCount(pageSize);
		}
		else if (_type == MessageCacheType.inbox) {
			return MessageStatistics.InboxPageCount(pageSize);
		}
		else if (_type == MessageCacheType.outbox) {
			return MessageStatistics.OutboxPageCount(pageSize);
		}
		else if (_type == MessageCacheType.report) {
			return currentReportViewingStrategy.ReportPageCount(MessageStatistics, pageSize);
		}
		return 0;
	}
	
	
	public function GetReportItem(rslt: HashObject,senderid : int):HashObject 
	{
            var r: HashObject = rslt["report"];
			var subject: String = getMarchReportTitle(r, rslt);
			var seed: HashObject = GameMain.instance().getSeed();

			var _side: int;
//			if (group == "a") {
//				_side = _Global.INT32(r["side1AllianceId"]) == _Global.INT32(seed["allianceDiplomacies"]["allianceId"]) ? 1 : 0;
//			}
//			else {
	            _side = _Global.INT32(r["side0PlayerId"]) == senderid ? 0 : 1;
			//}

			var hasRead: String;
			if (r["reportStatus"] == null) {
				hasRead = "read";
			}
			else {
				hasRead = _Global.INT32(r["reportStatus"]) == 2 ? "unread" : "read";
			}

			var defName: String;
			
			if (r["side0PlayerId"] == null) {
				defName = Datas.getArString("Common.Enemy");
			}
			else {
				defName = _Global.INT32(r["side0PlayerId"]) != 0 ? rslt["arPlayerNames"]["p" + r["side0PlayerId"].Value].Value : Datas.getArString("Common.Enemy");										
			}
			var attacker: String = Datas.getHashObjectValue(rslt, "arPlayerNames.p" + Datas.getHashObjectValue(r, "side1PlayerId"));
		
			var report: HashObject = InitMarchReportInternal(r);
			report["isWin"].Value = isWin(Datas.getHashObjectValue(r, "side1AllianceId"), Datas.getHashObjectValue(r, "marchTypeState"), seed);
			report["reportsClass"].Value = hasRead;
			report["subject"].Value = subject;
			report["side"].Value = _side;
			report["defnm"].Value = defName;
			report["atknm"].Value = attacker;

			var def_Icon:String="oldEmail";
			var atk_Icon:String="oldEmail";
			if (rslt["arPlayerNames"]!=null) {
				if(r["side0PlayerId"]!=null&&_Global.INT32(r["side0PlayerId"]) != 0&&rslt["arPlayerNames"]["a" + r["side0PlayerId"].Value]!=null&&rslt["arPlayerNames"]["a" + r["side0PlayerId"].Value].Value!=null){
					def_Icon=rslt["arPlayerNames"]["a" + r["side0PlayerId"].Value].Value;
				}
				if(rslt["arPlayerNames"]["a" + r["side1PlayerId"].Value]!=null&&
				rslt["arPlayerNames"]["a" + r["side1PlayerId"].Value].Value!=null){
					atk_Icon=rslt["arPlayerNames"]["a" + r["side1PlayerId"].Value].Value;
				}		
			}

			report["new_atfIcon"].Value = atk_Icon;
			report["new_defIcon"].Value = def_Icon;

			var def_AvatarFrame:String="img0";
			var atk_AvatarFrame:String="img0";
			if (rslt["arAvatarFrame"]!=null) {
				if(r["side0PlayerId"]!=null&&_Global.INT32(r["side0PlayerId"]) != 0&&rslt["arAvatarFrame"]["" + r["side0PlayerId"].Value]!=null&&rslt["arAvatarFrame"]["" + r["side0PlayerId"].Value].Value!=null){
					def_AvatarFrame=rslt["arAvatarFrame"]["" + r["side0PlayerId"].Value].Value;
				}
				if(rslt["arAvatarFrame"]["" + r["side1PlayerId"].Value]!=null&&
				rslt["arAvatarFrame"]["" + r["side1PlayerId"].Value].Value!=null){
					atk_AvatarFrame=rslt["arAvatarFrame"]["" + r["side1PlayerId"].Value].Value;
				}		
			}
			report["new_defAvatarFrame"].Value = def_AvatarFrame;
			report["new_atfAvatarFrame"].Value = atk_AvatarFrame;

			report["isShareReport"] = new HashObject();
			report["isShareReport"].Value = true;
			return report;
						
	}
	private var reportarr: Array = new Array();

	public function GetMessageByRid(rid:int):HashObject
	{
		if (reportarr.length==0)
		{
			   var reports: Hashtable = currentReportViewingStrategy.SelectReports(dao, 1, 10*pageSize);
			   var rslt:HashObject = new HashObject(reports);
				try {
					for (var i: System.Collections.DictionaryEntry in rslt.Table) {
						var r: HashObject = i.Value;
						var subject: String = getMarchReportTitleLocal(r);
						var seed: HashObject = GameMain.instance().getSeed();

						var _side: int = CalcPlayerSide(_Global.INT32(r["side0PlayerId"]), _Global.INT32(r["side0WorldId"]));
						var heroCarmotSpeed: int = 0;
						var hasRead: String;
						if (r["messageRead"].Value == "1") {
							hasRead = "read";
						}
						else {
							hasRead = "unread";
						}

						var defName: String;
			
						if (r["side0PlayerId"] != null && _Global.INT32(r["side0PlayerId"]) > 0) // side0PlayerId is the defending side
						{
							defName = r["s0Name"].Value;
						}
						else {
							defName = Datas.getArString("Common.Enemy");
						}

						if (r["boxContent"]["heroCarmotSpeed"] != null) // side0PlayerId is the defending side
						{
							heroCarmotSpeed = r["boxContent"]["heroCarmotSpeed"].Value;
						}

						var report: HashObject = InitMarchReportInternal(r);

						report["isWin"].Value = isWin(Datas.getHashObjectValue(r, "side1AllianceId"), Datas.getHashObjectValue(r, "marchTypeState"), seed);
						report["reportsClass"].Value = hasRead;
						report["subject"].Value = subject;
						report["side"].Value = _side;
						report["defnm"].Value = defName;
						report["heroCarmotSpeed"].Value = heroCarmotSpeed;


					
					    reportarr.push(report);
					}
				}
				catch (error: System.Exception) {
					// UnityNet.reportErrorToServer("EmailMenu", null, "Client Exception", error.Message, false);
					// EmptyReportMessages(function () {
					// 	_Global.Log("Report Data Exception");
					// 	if (exceptionCallback != null) {
					// 		exceptionCallback();
					// 	}
					// });
					return null;
				}
	    }
		for (var reportitem: HashObject in reportarr) 
		{
			//_Global.LogWarning("report: "+_Global.INT32(reportitem["rid"].Value) +" "+rid);
			if (reportitem != null && _Global.INT32(reportitem["rid"].Value) == rid) 
			{
               return reportitem;
			}
		}
		return null;
	}

	private var avaReportarr:Array = new Array();
	public function GetAvaMessageByRid(rid:int):HashObject
	{
		if(this.avaReportarr.length == 0)
		{
			var reports: Hashtable = currentReportViewingStrategy.SelectReports(dao, 1, 10*pageSize);
			var rslt:HashObject = new HashObject(reports);
			 try {
				 for (var i: System.Collections.DictionaryEntry in rslt.Table) {
					 var r: HashObject = i.Value;
					 var subject: String = getMarchReportTitleLocal(r);
					 var seed: HashObject = GameMain.instance().getSeed();

					 var _side: int = CalcPlayerSide(_Global.INT32(r["side0PlayerId"]), _Global.INT32(r["side0WorldId"]));
					 var heroCarmotSpeed: int = 0;
					 var hasRead: String;
					 if (r["messageRead"].Value == "1") {
						 hasRead = "read";
					 }
					 else {
						 hasRead = "unread";
					 }

					 var defName: String;
		 
					 if (r["side0PlayerId"] != null && _Global.INT32(r["side0PlayerId"]) > 0) // side0PlayerId is the defending side
					 {
						 defName = r["s0Name"].Value;
					 }
					 else {
						 defName = Datas.getArString("Common.Enemy");
					 }

					 if (r["boxContent"]["heroCarmotSpeed"] != null) // side0PlayerId is the defending side
					 {
						 heroCarmotSpeed = r["boxContent"]["heroCarmotSpeed"].Value;
					 }

					 var report: HashObject = InitMarchReportInternal(r);

					 report["isWin"].Value = isWin(Datas.getHashObjectValue(r, "side1AllianceId"), Datas.getHashObjectValue(r, "marchTypeState"), seed);
					 report["reportsClass"].Value = hasRead;
					 report["subject"].Value = subject;
					 report["side"].Value = _side;
					 report["defnm"].Value = defName;
					 report["heroCarmotSpeed"].Value = heroCarmotSpeed;


				 
					 avaReportarr.push(report);
				 }
			 }
			 catch (error: System.Exception) {
				 // UnityNet.reportErrorToServer("EmailMenu", null, "Client Exception", error.Message, false);
				 // EmptyReportMessages(function () {
				 // 	_Global.Log("Report Data Exception");
				 // 	if (exceptionCallback != null) {
				 // 		exceptionCallback();
				 // 	}
				 // });
				 return null;
			 }
		}
		for (var reportitem: HashObject in avaReportarr) 
		{
			//_Global.LogWarning("report: "+_Global.INT32(reportitem["rid"].Value) +" "+rid);
			if (reportitem != null && _Global.INT32(reportitem["rid"].Value) == rid) 
			{
               return reportitem;
			}
		}
		return null;
	}

}

class EmailHeader {
	public var messageId: long;
	public var data: HashObject;
}
public enum MessageCacheType {
	inbox = 0,
	report = 1,
	outbox = 2,
	sysbox = 3,
	sysInbox = 4
}