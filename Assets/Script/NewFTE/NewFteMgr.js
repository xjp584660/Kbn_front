#pragma strict

import System.Collections;
import System.Collections.Generic;

public class NewFteMgr extends KBN.NewFteMgr
{
	private function NewFteMgr() {}
	
	public static function Instance():NewFteMgr
	{
		if (null == instance && null != GameMain.instance())
		{
			instance = new NewFteMgr();
			(instance as NewFteMgr).Init();
			
			GameMain.instance().resgisterRestartFunc(function(){
				(instance as NewFteMgr).Free();
				instance = null;
			});
		}
		
		return instance as NewFteMgr;
	}
	
	//-----------------------------------------------------------------
	public static final var FtesPath:String = "Data/Ftes/";   
	public static final var FtesFileName:String = "NewFtes";  
	
	public static var IsOpenFte:boolean = true;  
	//-----------------------------------------------------------------
	
	//-----------------------------------------------------------------
	private var allFteDataMap:Dictionary.<int, NewFteData> = null;
	private var notCompletedFteDataMap:Dictionary.<int, NewFteData> = null;  
	
	// If is true, early break, and not need to load guide file
	private var completedFteDataMap:Dictionary.<int, NewFteData> = null;   
	
	private var fakeDataTransmitList:List.<NewFteFakeDataTransmit> = null;
		
	private var doingFteList:List.<NewFte> = null;
	
	///----------------------------------------------------------------
	private var onDragDropBeginDels:Array = null;
	private var onDragDropDoneDels:Array = null;
	
	///----------------------------------------------------------------
	private function Init()
	{
		InitVariables();
	}
	
	public function InitDatas()
	{
		IsEnterGame = true;
		
		// IsOpenFte = true;
		if (IsOpenFte)
		{
			UnityNetReqGetFteDatas();
			// ReqGetFteDatasOk(null);
			
			RegisterMenuEvents(); 
			NewFteFakeDatasMgr.Instance().InitDataTransmits();
		}
		else
		{
			isAllFteCompleted = true;
		}
	}
	
	private function Free()
	{
		IsEnterGame = false;
		isAllFteCompleted = false;
		
		allFteDataMap.Clear();
		notCompletedFteDataMap.Clear();
		completedFteDataMap.Clear();
		
		fakeDataTransmitList.Clear();
		
		doingFteList.Clear();
		
		onDragDropBeginDels.Clear();
		onDragDropDoneDels.Clear();
	}
	
	private function InitVariables()
	{
		IsEnterGame = false;
		isAllFteCompleted = false;
		
		allFteDataMap = new Dictionary.<int, NewFteData>();
		notCompletedFteDataMap = new Dictionary.<int, NewFteData>();
		completedFteDataMap = new Dictionary.<int, NewFteData>();
		
		fakeDataTransmitList = new List.<NewFteFakeDataTransmit>(); 
		
		doingFteList = new List.<NewFte>();
		
		onDragDropBeginDels = new Array();
		onDragDropDoneDels = new Array();
	}
	
	private function RegisterMenuEvents()
	{
		MenuMgr.getInstance().RegisterMenuOnPushPrev(OnMenuOnPushPrev);
		MenuMgr.getInstance().RegisterMenuOnPush(OnMenuOnPush);
		MenuMgr.getInstance().RegisterMenuOnPushOver(OnMenuOnPushOver);
		
		MenuMgr.getInstance().RegisterMenuOnPopPrev(OnMenuOnPopPrev);
		MenuMgr.getInstance().RegisterMenuOnPop(OnMenuOnPop);
		MenuMgr.getInstance().RegisterMenuOnPopOver(OnMenuOnPopOver);
	}
	
	private function OnMenuOnPushPrev(menu : KBNMenu)
	{
		CheckDataTransmitByMenu(menu);
	}
	
	private function OnMenuOnPush(menu : KBNMenu)
	{
		var active:boolean = false; 
		var activeFte:NewFte = null;
		for (var i:int = 0; i < doingFteList.Count; i++)
		{
			active = doingFteList[i].FteData.IsReachConditions(menu);
			doingFteList[i].ForceActive(active); 
			
			if (active)
				activeFte = doingFteList[i];
		}  
		if (null != activeFte)
			activeFte.ForceActive(true); 
	}
	
	private function OnMenuOnPushOver(menu : KBNMenu)
	{
		_Global.Log("The menu : " + menu.menuName + " is OnPushOver");

#if UNITY_EDITOR 
		Debug.Log("<color=#E79400FF> The menu: <color=#D100FFFF>" + menu.menuName + " </color> is OnPushOver</color>");
#endif

		var newFteData:NewFteData = CheckNewFteDataByMenu(menu);
		if (null != newFteData)
		{ 
			var newFte:NewFte = CreateFte(newFteData);
			if (null != newFte)
				newFte.Begin();
		}
	}
	
	private function OnMenuOnPopPrev(menu : KBNMenu)
	{
		if (null == menu) return;
	}
	
	private function OnMenuOnPop(menu : KBNMenu)
	{
		if (null == menu) return;
		_Global.Log("The menu : " + menu.menuName + " is visible");
		
		var active:boolean = false; 
		var activeFte:NewFte = null;
		for (var i:int = 0; i < doingFteList.Count; i++)
		{
			active = doingFteList[i].FteData.IsReachConditions(menu);
			doingFteList[i].ForceActive(active);
			
			if (active)
				activeFte = doingFteList[i];
		}  
		if (null != activeFte)
			activeFte.ForceActive(true); 
	}
	
	private function OnMenuOnPopOver(menu : KBNMenu)
	{
		if (null == menu) return;
		_Global.Log("The menu : " + menu.menuName + " is OnMenuOnPopOver");
		
		for (var keyVal:KeyValuePair.<int, NewFteData> in allFteDataMap)
		{
			var fteData:NewFteData = keyVal.Value;
			if (null == fteData) continue;
			
			if (fteData.HasConditionType(typeof(NewFteConditionMenu))
				&& fteData.IsEqualCondition(menu)) 
			{
				NewFteFakeDatasMgr.Instance().TrimFteFakeDatas(fteData.id);
			}
		}
	}
	
	public function OnTabChangedIndex(toolbar:ToolBar, index:int)
	{
		var active:boolean = false; 
		var activeFte:NewFte = null;
		for (var i:int = 0; i < doingFteList.Count; i++)
		{
			active = doingFteList[i].FteData.IsReachConditions(toolbar);
			doingFteList[i].ForceActive(active);
			
			if (active)
				activeFte = doingFteList[i];
		}  
		if (null != activeFte)
			activeFte.ForceActive(true); 
		
		var newFteData:NewFteData = CheckNewFteDataBySwitchTab(toolbar);
		if (null != newFteData)
		{ 
			var newFte:NewFte = CreateFte(newFteData);
			if (null != newFte)
				newFte.Begin();
		}
	}
	
	///----------------------------------------------------------------
	public function LoadFromLocalFile()
	{
		var ftesFile:TextAsset = TextureMgr.instance().LoadText(FtesFileName, FtesPath);
		if (null == ftesFile) return;
		
		var ftesJsonData:HashObject = JSONParse.defaultInst().Parse(ftesFile.text); 
		if (null == ftesJsonData)
		{
			throw new System.NullReferenceException("Cann't parse the file from " + FtesFileName);
		} 
		
		LoadFromJson(ftesJsonData["Datas"]);
		// ParseByJsonFx(ftesFile);
	} 
	
	private function LoadFromJson(jsonData:HashObject)
	{  
//		_Global.Log(jsonData.ToString());
		for (var jsonEnt:DictionaryEntry in jsonData.Table)
		{   
//			_Global.Log("jsonEnt.Key: " + jsonEnt.Key.ToString());
//			_Global.Log("jsonEnt.Value: " + jsonEnt.Value.ToString());
			
			var fteData:NewFteData = new NewFteData(jsonEnt.Value); 
			allFteDataMap.Add(fteData.id, fteData); 
		} 
		
		FilterNotCompleteDatas();
	}
	
	private function LoadFromXml(fileName:String)
	{}
	
	private function LoadFromExcel(fileName:String)
	{}
	
	private function LoadFromJsonDatas(datas:HashObject)
	{}
	
	private function LoadFromMemery(datas:byte[])
	{}
	///-----------------------------------------------------------------
	
	public function get IsClickMenuForbidRect():boolean
	{
		return NewFteDisplayMgr.Instance().IsClickMenuForbidRect;
	}
	
	public function get IsDoingFte():boolean
	{
		if (isAllFteCompleted) return false;
		
		if (NewFteDisplayMgr.Instance().IsUIObjsVisible())
			return true;
		
		return false;
	}
	
	public function get IsForbidMenuEvent():boolean
	{
		if (isAllFteCompleted) return false;
		
		return NewFteDisplayMgr.Instance().IsBGMaskVisible();
	} 
	
	// Check it from our cache completed list
	public function IsFteCompleted(fteId:int):boolean
	{
		if (null == completedFteDataMap) return false;
		
		var result:boolean = completedFteDataMap.ContainsKey(fteId);
		return result;
	}
	
	public function IsInDoingList(fteId:int):boolean
	{
		for (var i:int = 0; i < doingFteList.Count; i++)
		{
			if (doingFteList[i].FteData.id == fteId)
			{
				return true;
			}
		}
		
		return false;
	} 
	
	public function get GetCurrentFte():NewFte
	{ 
		if (null == doingFteList) return null; 
		
		for (var i:int = 0; i < doingFteList.Count; i++)
		{
			var newFTE : NewFte = doingFteList[i];
			if (newFTE.IsActive)
				return newFTE;
		} 
		
		return null;
	}
	
	public function CreateFte(fteData:NewFteData):NewFte
	{
		if (!IsInDoingList(fteData.id))
		{
			var newFte = new NewFte(fteData);
			newFte.SetDoneDelegate(OnFteDone);
			
			doingFteList.Add(newFte);
			return newFte;
		}
		
		return null;
	}
	
	public function OnFteDone(fte:NewFte)
	{
		_Global.Log("The current fte is done, id is " + fte.FteData.id.ToString());
		NewFteDisplayMgr.Instance().Clear();
		completedFteDataMap.Add(fte.FteData.id, fte.FteData);
		notCompletedFteDataMap.Remove(fte.FteData.id);
		doingFteList.Remove(fte);
		
		// Trim the fake datas
		NewFteFakeDatasMgr.Instance().TrimFteFakeDatas(fte.FteData.id);
		
		// Skip one frame, then to check
		var newFteData:NewFteData = CheckNewFteDataByDoneFte(fte.FteData.id);
		if (null != newFteData)
		{ 
			var newFte:NewFte = CreateFte(newFteData);
			if (null != newFte)
				newFte.Begin();
		}
	}
	
	// Be notify by upateSeed or getSeed 
	public function CheckNewFteBySeed(seed:HashObject):NewFteData
	{ 
		return null;	
	}
	
	private function CheckNewFteDataByDoneFte(fteId:int):NewFteData
	{
		var fteData:NewFteData = null;
		for (var keyVal:KeyValuePair.<int, NewFteData> in notCompletedFteDataMap)
		{ 
			fteData = keyVal.Value;
			if (fteData.HasConditionType(typeof(NewFteConditionMenu))) 
			{
				if (fteData.IsReachConditions(fteId))
				{
					return fteData;
				}
			}
		} 
		
		return null;
	} 
	
	private function CheckNewFteDataByMenu(menu : KBNMenu):NewFteData
	{ 
		var fteData:NewFteData = null;
		for (var keyVal:KeyValuePair.<int, NewFteData> in notCompletedFteDataMap)
		{ 
			fteData = keyVal.Value;
			if (fteData.HasConditionType(typeof(NewFteConditionMenu))) 
			{
				if (fteData.IsReachConditions(menu))
				{
					return fteData;
				}
			}
		} 
		
		return null;
	} 
	
	private function CheckNewFteDataBySwitchTab(toolbar:ToolBar):NewFteData
	{ 
		var fteData:NewFteData = null;
		for (var keyVal:KeyValuePair.<int, NewFteData> in notCompletedFteDataMap)
		{ 
			fteData = keyVal.Value;
			if (fteData.HasConditionType(typeof(NewFteConditionTabIndex))) 
			{
				if (fteData.IsReachConditions(toolbar))
				{
					return fteData;
				}
			}
		} 
		
		return null;
	}

	private function CheckNewFteByBuilding(buildingId:int, buildingLevel:int):NewFteData
	{ 
		var fteData:NewFteData = null;
		for (var keyVal:KeyValuePair.<int, NewFteData> in notCompletedFteDataMap)
		{ 
			fteData = keyVal.Value;
			if (fteData.HasConditionType(typeof(NewFteConditionBuilding))) 
			{
				if (fteData.IsReachConditions(buildingId, buildingLevel))
				{
					return fteData;
				}
			}
		} 
		
		return null;
	}
	
	private function ShowNewFlagOnBuilding()
	{}
	
	///-----------------------------------------------------------------	
	public function RegisterDataTransmit(entryObj:System.Object, condType:System.Type, callback:Function)
	{  
		if (null == fakeDataTransmitList)
		{
			fakeDataTransmitList = new List.<NewFteFakeDataTransmit>();
		}
		
		var transmit:NewFteFakeDataTransmit = new NewFteFakeDataTransmit();
		transmit.conditionType = condType; 
		transmit.conditionDataObj = entryObj; 
		transmit.method = callback;
		
		fakeDataTransmitList.Add(transmit);
	}
	
	public function UnregisterDataTransmit(transmit:NewFteFakeDataTransmit)
	{
		fakeDataTransmitList.Remove(transmit);
	}
	
	public function CheckDataTransmitByMenu(menu : KBNMenu)
	{
		var fteData:NewFteData = null; 
		var tmpTransmitList:List.<NewFteFakeDataTransmit> = new List.<NewFteFakeDataTransmit>();
		
		for (var keyVal:KeyValuePair.<int, NewFteData> in notCompletedFteDataMap)
		{ 
			fteData = keyVal.Value;
			if (fteData.HasConditionType(typeof(NewFteConditionMenu))
				&& fteData.IsEqualCondition(menu)) 
			{
				var transmit:NewFteFakeDataTransmit = null; 
				for (var i:int = 0; i < fakeDataTransmitList.Count; i++)
				{ 
					transmit = fakeDataTransmitList[i];
					if (transmit.conditionType == typeof(NewFteConditionMenu)) 
					{
						var menuName:String = System.Convert.ToString(transmit.conditionDataObj); 
						if (menuName.Equals(menu.menuName)) 
						{ 
							// Transmit the fake data
							var isOk:boolean = transmit.method(fteData.id, fteData.fakeItems);   

							if (isOk && !tmpTransmitList.Contains(transmit))
								tmpTransmitList.Add(transmit);
						}
					}
				} 
			}
		} 
		
		for (var j:int = 0; j < tmpTransmitList.Count; j++)
		{
			UnregisterDataTransmit(tmpTransmitList[j]);
		}
	}
	///-----------------------------------------------------------------
	
	public function Draw()
	{
		if (isAllFteCompleted) return;
		
		NewFteDisplayMgr.Instance().Draw();
	}
	
	public function Update()
	{
		if (isAllFteCompleted) return;
		
		NewFteDisplayMgr.Instance().Update();
		for (var fte : NewFte in doingFteList)
		{
			fte.Update();
		}
	}
	
	public function BeginDraw()
	{
		if (!isAllFteCompleted)
		{
			if (Event.current.type != EventType.Repaint && IsClickMenuForbidRect)
				GUI.BeginGroup(new Rect(0, 0, 640, 205));
		}
	}
	
	public function EndDraw()
	{
		if (!isAllFteCompleted)
		{
			if (Event.current.type != EventType.Repaint && IsClickMenuForbidRect)
				GUI.EndGroup();
		}
	}

	private function FilterNotCompleteDatas()
	{  
		notCompletedFteDataMap.Clear();
		if (isAllFteCompleted) return;
		
		for (var ftePair:KeyValuePair.<int, NewFteData> in allFteDataMap) 
		{ 
			if (completedFteDataMap.ContainsKey(ftePair.Key)) 
				continue;
				
			notCompletedFteDataMap.Add(ftePair.Key, ftePair.Value);
		}
	}
	
	///-----------------------------------------------------------------
	private function UnityNetReqGetFteDatas()
	{  
		var reqParams:Hashtable = new Hashtable(); 
		reqParams.Add("act", "list"); 
		
		UnityNet.ReqNewFteData(reqParams, ReqGetFteDatasOk, ReqGetFteDatasError);  
	}  
	
	private function ReqGetFteDatasOk(result:HashObject)
	{   
		// Here steps mean all ftes
		if (result && result["steps"])
		{
			if (result["steps"].Table.Count == 0)
			{
				isAllFteCompleted = false;
			}
			else
			{
				isAllFteCompleted = true;
			}
				
			for (var fteEnt:System.Collections.DictionaryEntry in result["steps"].Table)
			{
				var keyString:String = fteEnt.Key.ToString(); 
				var bFinish:boolean = _Global.INT32(fteEnt.Value) > 0; 
				
				var fteId:int = UtilityTools.GetNumberInt(keyString);  
				if (bFinish)
				{
					completedFteDataMap.Add(fteId, null); // No need NewFteData
					_Global.Log("Completed fteId: " + fteId.ToString());
				}
				
				isAllFteCompleted &= bFinish;
			} 
		}
		
		if (!isAllFteCompleted)
		{
			LoadFromLocalFile();
			FilterNotCompleteDatas();
		}
	}
	
	// UnityNetReqStrengthen callback
	private function ReqGetFteDatasError(msg:String, errorCode:String)
	{
		if(errorCode.Equals("UNKNOWN"))
			return;
		
		if (!isAllFteCompleted)
		{
			LoadFromLocalFile();
			FilterNotCompleteDatas();
		}
		
		// var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
	}
	
	public function UnityNetReqFteFinish(fteId:int)
	{  
		var reqParams:Hashtable = new Hashtable();  
		
		var sysId:int = fteId / 100;
		reqParams.Add("system", sysId);
		
		var tFteId:int = fteId % 100;
		reqParams.Add("branch", tFteId);
		reqParams.Add("act", "finish"); 
		
		UnityNet.ReqNewFteData(reqParams, ReqFteFinishOk, ReqFteFinishError);  
	}  
	
	private function ReqFteFinishOk(result:HashObject)
	{  
		var bSuccess:boolean = _Global.GetBoolean(result["succ"]);
		
		if (result["items"])
		{
			for (var itemEnt:System.Collections.DictionaryEntry in result["items"].Table)
			{
				var itemIdString:String = _Global.GetString(itemEnt.Key);
				var itemId:int = UtilityTools.GetNumberInt(itemIdString);
				var itemCnt:int = _Global.INT32(itemEnt.Value);
				
				MyItems.instance().AddItem(itemId, itemCnt);
			}
		}
		
		if (result["gearItems"])
		{
			for (var gearEnt:System.Collections.DictionaryEntry in result["gearItems"].Table)
			{
				var gearObj:HashObject = gearEnt.Value;
		
				var arm:Arm = new Arm();
				arm.Parse(gearObj);
				GearManager.Instance().GearWeaponry.AddArm(arm);
			}
			
			_Global.Log("Reward gear count: " + result["gearItems"].Table.Count);
		}
		
		if (result["gearMount"])
		{
		}
	}
	
	private function ReqFteFinishError(msg:String, errorCode:String)
	{
		if(errorCode.Equals("UNKNOWN"))
			return;
	}
	
	public function UnityNetReqFteStepFinish(fteId:int, stepId:int)
	{  
		// fteId is like: 10001,100 is sysId
		var reqParams:Hashtable = new Hashtable();
		
		var sysId:int = fteId / 100;
		reqParams.Add("system", sysId);
		
		var tFteId:int = fteId % 100;
		reqParams.Add("branch", tFteId);
		
		var tStepId:int = (fteId * 100) + stepId;
		reqParams.Add("step", tStepId);
		reqParams.Add("act", "progress"); 
		
		UnityNet.ReqNewFteData(reqParams, ReqFteStepFinishOk, ReqFteStepFinishError);  
	} 
	
	private function ReqFteStepFinishOk(result:HashObject)
	{ 
		var bSuccess:boolean = _Global.GetBoolean(result["succ"]);
	}
	
	private function ReqFteStepFinishError(msg:String, errorCode:String)
	{
		if(errorCode.Equals("UNKNOWN"))
			return;
	}
	
	// One step only have one request.php?
	public function CheckNeedFteLocalServer(url:String, form:WWWForm, okFunc : System.MulticastDelegate, errorFunc : System.MulticastDelegate):boolean
	{ 
		if (null == doingFteList) return false;
		if ( okFunc == null ) return false;
		
		for (var i:int = 0; i < doingFteList.Count; i++)
		{
			var newFTE : NewFte = doingFteList[i];
			if ( !newFTE.IsActive )
				continue;

			var reqPhpName : String = url.Substring(url.LastIndexOf("/") + 1);
			var res : HashObject = newFTE.CurrStepData.FindServerMsgReplay(reqPhpName);
			if ( res != null )
			{
				res["ByNewFte"] = new HashObject(true);
				UnityNet.okFuncWrapper(url, form, res, okFunc, errorFunc); 
				newFTE.CurrStepData.ClearServerMsgReplay(reqPhpName);
				return true;
			}
  
  			// No result, but also need skip
 			if (newFTE.CurrStepData.needSkipPhps)
 			{ 
 				var needSkipPhp:String = String.Empty;
	 			for (var skipPhp:HashObject in newFTE.CurrStepData.needSkipPhps)
				{
					needSkipPhp = _Global.GetString(skipPhp);
					if (!String.IsNullOrEmpty(needSkipPhp) 
						&& (needSkipPhp.Equals(reqPhpName) || url.Contains(needSkipPhp))
						)
					{  
						return true;
					}
				}
 			}
		}
		
		return false;
	}
	///-----------------------------------------------------------------
	
	///-----------------------------------------------------------------
	public function RegisterDragDropBegin(callbakc:Function)
	{
		onDragDropBeginDels.Push(callbakc);
	}
	
	public function UnregisterDragDropBegin(callbakc:Function)
	{
		onDragDropBeginDels.Remove(callbakc);
	}
	
	public function OnTraceDragDropBegin(dragObjMemName:String, parent:Object)
	{
		if (!isAllFteCompleted)
		{
			for (var i:int = 0; i < onDragDropBeginDels.Count; i++)
			{
				var callback:Function = onDragDropBeginDels[i];
				if (null != callback)
					callback(dragObjMemName, parent);
			}
		}
	}
	
	public function RegisterDragDropDone(callbakc:function(UIObject, String):void)
	{
		onDragDropDoneDels.Push(callbakc);
	}
	
	public function UnregisterDragDropDone(callbakc:function(UIObject, String):void)
	{
		onDragDropDoneDels.Remove(callbakc);
	}

	public function OnTraceDragDropDone(dragingObj:UIObject, tgtPosition : Object)
	{
		if (!isAllFteCompleted)
		{
			var tgtTypeString : String = tgtPosition.ToString();
			var callback:function(UIObject, String):void;
			for (var i:int = 0; i < onDragDropDoneDels.Count; i++)
			{
				callback = onDragDropDoneDels[i] as function(UIObject, String):void;
				if (null != callback)
					callback(dragingObj, tgtTypeString);
			}
		}
	}
	///-----------------------------------------------------------------
	
	
	///-----------------------------------------------------------------
	public static final var ArrayItemFlag:String = "arrayItem";
	public static function GetMenuMemberObject(hierarchyMemberName:String):UIObject
	{
		var splitChar:String = ".";
		var hierarchyNames:String[] = hierarchyMemberName.Split(splitChar.ToCharArray());
		if (hierarchyNames.Length == 0)
		{
			return null;
		}
		
		var current:System.Object = UtilityTools.GetMenuObject(hierarchyNames[0]);
		var parent:System.Object = current;
		if (null == current)
		{
			throw new System.ArgumentException("A wrong hierarchyMemberName: " + hierarchyMemberName);
		}
		
		for (var i:int = 1; i < hierarchyNames.Length; i++)
		{
			current = GetClassMemberObject(parent, hierarchyNames[i]);
			parent = current;
		}
		
		return current as UIObject;
	}
	
	public static function GetClassMemberObject(parent:System.Object, name:String):System.Object
	{
		var isArrayItem:boolean = name.Contains(ArrayItemFlag);
		
		if (isArrayItem)
		{
			var itemIndex:int = UtilityTools.GetNumberInt(name);
			var child:System.Object = null;
			
			if (parent as System.Object[])
			{
				child = (parent as System.Object[]).GetValue(itemIndex);
			}
			else if (parent as Array)
			{
				child = (parent as Array)[itemIndex];
			}
			else if (parent as ScrollView)
			{
				// Forbid the scroll 
				(parent as ScrollView).scrollAble = false;
				child = (parent as ScrollView).getUIObjectAt(itemIndex);
			}
			else if (parent as ScrollList)
			{
				// Forbid the scroll 
				(parent as ScrollList).updateable = false;
				child = (parent as ScrollList).GetItem(itemIndex);
			}
			else if (parent as ToolBar)
			{
				// A specific case, that need check the return value out this method
				child = parent;
			}
			
			return child;
		}
		else
		{
			return UtilityTools.GetClassMemberObject(parent, name);
		}
		
		return null;
	}
}
