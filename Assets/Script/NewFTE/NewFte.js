#pragma strict
import System;
import System.Collections;
import System.Collections.Generic;

class NewFte
{
	//----------------------------------------------------
	private var fteData:NewFteData = null;
	private var fteSteps:List.<NewFteStep> = null;
	
	private var currStepIndex:int = -1;
	private var currStepId:int = -1;
	
	private var doneDelegate:Function;
	
	private var isActive:boolean = false;
	//----------------------------------------------------
	public function NewFte(data:NewFteData)
	{
		fteData = data;
		
		InitVariables();
		FillSteps();
	}
	
	public function Update() : void
	{
		if ( !String.IsNullOrEmpty(fteData.updateMenu) )
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			var menu : KBNMenu = menuMgr.getMenu(fteData.updateMenu);
			if ( menu != null )
				menu.Update();
		}
	}
	
	private function InitVariables()
	{
		isActive = false;
		currStepIndex = 0;
		fteSteps = new List.<NewFteStep>();
	}
	
	public function FillSteps()
	{
		if (null == fteData) return;
		
		for (var stepData:NewFteStepData in fteData.StepDatas)
		{
			var step:NewFteStep = new NewFteStep(stepData);
			step.SetDoneDelegate(OnStepDone);
			
			fteSteps.Add(step);
		}
	}
	
	public function get FteData():NewFteData
	{
		return fteData;
	}
	
	public function get CurrStepData():NewFteStepData
	{
		if (currStepIndex >= fteData.StepDatas.Count)
		{
			return null;
		}
		
		return fteData.StepDatas[currStepIndex];
	}
	
	public function get CurrStep():NewFteStep
	{
		if (currStepIndex >= fteSteps.Count)
		{
			return null;
		}
		
		return fteSteps[currStepIndex];
	}
	
	public function Begin()
	{
		NewFteDisplayMgr.Instance().ShowBGMask(true);
		
		isActive = true;
		
		currStepIndex = 0;
		BeginStep(currStepIndex); 
	}
	
	public function OnStepDone(step:NewFteStep)
	{
		_Global.Log("The finish step id: " + step.StepData.id.ToString() + "and will go to next");
		
		NewFteMgr.Instance().UnityNetReqFteStepFinish(fteData.id, step.StepData.id);
		if (currStepIndex == fteData.StepDatas.Count - 1)
		{
			_Global.Log("The fte is finish!!! All step count is " + fteData.StepDatas.Count.ToString());
		
			OnFteDone();
			NewFteMgr.Instance().UnityNetReqFteFinish(fteData.id);
		}
		else
		{
			DoNextStep();
		}
	}
	
	private function OnFteDone()
	{
		// This fte is done 
		NewFteDisplayMgr.Instance().ShowBGMask(false);
		if (null != doneDelegate)
			doneDelegate(this);
	}
	
	public function SetDoneDelegate(del:Function)
	{
		doneDelegate = del;
	}
	
	private function BeginStep(index:int)
	{
		if (index < 0 && index >= fteSteps.Count)
		{
			_Global.Log("currStepIndex is out of task list");
			return;
		}
		
		fteSteps[index].Begin(fteData.id);	
	}
	
	private function IsStepCan(index:int):boolean
	{
		if (index < 0 && index >= fteSteps.Count)
		{
			_Global.Log("currStepIndex is out of task list");
			return false;
		}
		
		// fteSteps[index];
		return true;
	}
	
	public function DoNextStep():boolean
	{
		if (!fteSteps[currStepIndex].IsDone)
			return false;
		
		if (!IsStepCan(currStepIndex + 1))
			return false;
		
		BeginStep(++currStepIndex);
		return true;
	} 
	
	// 
	public function ForceCompleteStep(stepId:int)
	{
		currStepIndex = 0;
		for (var step:NewFteStep in fteSteps)
		{
			if (step.StepData.id < stepId)
			{
				step.ForceComplete();
			}
			else
			{
				break;
			}
			
			currStepIndex++;
		}
		
		if (currStepIndex == fteSteps.Count - 1)
			OnFteDone();
	}
	
	public function ForceComplete()
	{
		for (var step:NewFteStep in fteSteps)
		{
			step.ForceComplete();
		}
		currStepIndex = fteSteps.Count - 1;
		
		OnFteDone();
	}
	
	public function ForceGotoStep(index:int)
	{
		for (var i:int = 0; i < fteSteps.Count; i++)
		{
			if (i < index)
				fteSteps[i].ForceComplete();
			else if (i == index)
			{
				BeginStep(i);
				break;
			}
		}
	} 
	
	public function ForceActive(active:boolean)
	{  
		if (null == fteSteps || fteSteps.Count == 0)
			return;
		
		var currStep:NewFteStep = fteSteps[currStepIndex];
		if (null != currStep)
		{
			currStep.Active(active);
			this.isActive = active;
		}
	}
	
	public function get IsActive():boolean
	{
		return this.isActive;
	}
	
	public function OnTabChangedIndex(toolbar:ToolBar, index:int)
	{  
		if (null == fteData) return;
		
		var active:boolean = fteData.IsReachConditions(toolbar);  
		var currStep:NewFteStep = fteSteps[currStepIndex];
		if (null != currStep)
		{
			currStep.Active(active);
			this.isActive = active;
		}
	}
	
	private final var CommitStateFinish:String = "finish";
	private function UnityNetReqStepComplete()
	{  
		var currStep:NewFteStep = fteSteps[currStepIndex]; 
		if (null == currStep) return;
		
		// var reqParams:Hashtable = new Hashtable(); 
		// reqParams.Add("uniqId", strengthenItemUniqId);
		// reqParams.Add("itemId", hammerItemId);
		// UnityNet.ReqGearStrengthen(reqParams, ReqStepCompleteOk, ReqStepCompleteError);  
		
		var currStepId:int = currStep.StepData.id;
		var cityId = GameMain.instance().getCurCityId();
		UnityNet.reqWWW("fte.php", {"cid":cityId, "step":currStepId, "act":CommitStateFinish}, ReqStepCompleteOk, ReqStepCompleteError);
	}
	
	private function ReqStepCompleteOk(result:HashObject)
	{ 
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setDefautLayout();		
		
		GameMain.instance().seedUpdate(true);
	}
	
	// UnityNetReqStrengthen callback
	private function ReqStepCompleteError(msg:String, errorCode:String)
	{
		if(errorCode.Equals("UNKNOWN"))
			return;
		
		var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
		// ErrorMgr.instance().PushError(Datas.getArString("FTE.Commit_Title_Failed"),Datas.getArString("FTE.Commit_Content_Retry"),false ,Datas.getArString("FTE.Retry"), commitFTE);			
		// ErrorMgr.instance().PushError(Datas.getArString("FTE.Commit_Title_Failed"),Datas.getArString("FTE.Commit_Content_Restart"),false, Datas.getArString("FTE.Restart"), restartGame);
	}
}