#pragma strict
import System.Collections;
import System.Collections.Generic;

class NewFtePhpResult
{
	public var fteId:int;
	public var phpName:String;
	public var resultObj:HashObject;
	
	public static function BuildFromJson(json:HashObject):NewFtePhpResult
	{
		if (null == json) return null;
		
		var result:NewFtePhpResult = new NewFtePhpResult();
		result.ParseJson(json);
		
		return result;
	}
	
	private function ParseJson(json:HashObject)
	{
		fteId = _Global.INT32(json[NewFteConstants.FteServerNodeKey.Id]);
		phpName = _Global.GetString(json[NewFteConstants.FteServerNodeKey.PhpName]);
		resultObj = json[NewFteConstants.FteServerNodeKey.Results];
	}
}

class NewFteLocalServer
{
	private static var instance:NewFteLocalServer = null;
	private function NewFteLocalServer() {}
	
	public static function Instance():NewFteLocalServer
	{
		if (null == instance)
		{
			instance = new NewFteLocalServer();
			instance.Init();
			
			GameMain.instance().resgisterRestartFunc(function(){
				instance.Free();
				instance = null;
			});
		}
		
		return instance;
	}
	
	///----------------------------------------------------------
	public static final var FtesServerFile:String = "FteLocalServer";
	
	private var ftePhpResultList:List.<NewFtePhpResult> = null;
	
	///----------------------------------------------------------
	private function Init()
	{ 
		InitVariables(); 
		LoadFromLocalFile();
	}
	
	private function Free()
	{
	}
	
	private function InitVariables()
	{
		ftePhpResultList = new List.<NewFtePhpResult>();
	} 
	
	private function LoadFromLocalFile()
	{
		var ftesFile:TextAsset = TextureMgr.instance().LoadText(FtesServerFile, NewFteMgr.FtesPath);
		if (null == ftesFile) return;
		
		var ftesJsonData:HashObject = JSONParse.defaultInst().Parse(ftesFile.text); 
		if (null == ftesJsonData)
		{
			throw new System.NullReferenceException("Cann't parse the file from " + FtesServerFile);
		} 
		
		LoadFromJson(ftesJsonData["Datas"]);
	}
	
	private function LoadFromJson(jsonData:HashObject)
	{  
		_Global.Log(jsonData.ToString());
		for (var jsonEnt:DictionaryEntry in jsonData.Table)
		{   
			_Global.Log("jsonEnt.Key: " + jsonEnt.Key.ToString());
			_Global.Log("jsonEnt.Value: " + jsonEnt.Value.ToString());
			
			var newResult:NewFtePhpResult = NewFtePhpResult.BuildFromJson(jsonEnt.Value);
			ftePhpResultList.Add(newResult);
		}
		
		ftePhpResultList.Sort(function(a:NewFtePhpResult, b:NewFtePhpResult)
		{
			return a.fteId - b.fteId;
		});
	}
	
	public function GetLocalPhpResult(fteId:int, phpName:String):HashObject
	{
		if (null == ftePhpResultList || ftePhpResultList.Count == 0) 
			return null;
		
		for (var i:int = 0; i < ftePhpResultList.Count; i++)
		{
			if (ftePhpResultList[i].fteId == fteId && ftePhpResultList[i].phpName.Equals(phpName))
			{
				return ftePhpResultList[i].resultObj;
			}
		}
		
		return null;
	}
}