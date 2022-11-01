class UserSetting
{
	public var blockUserList:Array;
	public var blockUserHash:Hashtable;
	public var ignoreUserList:Array;
	public var ignoreUserHash:Hashtable;
	private static var instance:UserSetting;
	
	private var isGetBlockUserList:boolean;
	private var isGetIgnoreUserList:boolean; 
	
	public function UserSetting()
	{
		blockUserList = new Array();
		ignoreUserList = new Array();
		
		blockUserHash = new Hashtable();
		ignoreUserHash = new Hashtable();
		
		isGetBlockUserList = false;
		isGetIgnoreUserList = false;
	}
	
	public function initIgnoredUsers(para:HashObject):void
	{
		var data:HashObject;
		var infor:Hashtable;
		var obj:HashObject;
		
		if(para["ignoreList"] == null)
		{
			isGetIgnoreUserList = false;
			return;
		}
		
		obj = para["ignoreList"];
		
		for(var i:System.Collections.DictionaryEntry  in obj.Table)
		{
			data = i.Value;
			
			ignoreUserHash[data["ignoreUserId"].Value + ""] = 1;
			
			infor = {"uid": _Global.INT32(data["ignoreUserId"]), "name":data["displayName"].Value};
			ignoreUserList.Push(infor);
		}
		
		isGetIgnoreUserList = true;
	}
	
	public function isIgnoredUser(uid:int):boolean
	{
		return ignoreUserHash.ContainsKey(uid + "");
	}
	
	public static function getInstance():UserSetting
	{
		if(instance == null)
		{
			instance = new UserSetting();	
			GameMain.instance().resgisterRestartFunc(function(){
				instance = null;
			});			
		}
		
		return instance;
	}
	
	public function getIgnoreUserList(resultFunc:Function):void
	{
		if(isGetIgnoreUserList)
		{
			resultFunc(ignoreUserList);
		}
		else
		{
			var can:Function = function(result:HashObject)
			{
		  		if(result["ok"].Value)
				{	
					isGetIgnoreUserList = true;
					
					if(result["list"] != null)
					{
						ignoreUserList = createArray(false, result["list"]);
						
						var infor:Hashtable;
						for(var a:int = 0; a < ignoreUserList.length; a ++)
						{	
							infor = ignoreUserList[a] as Hashtable;
							ignoreUserHash[infor["uid"] + ""] = 1;
						}						
					}
					else
					{
						ignoreUserList = new Array();
						ignoreUserHash = new Hashtable();
					}
				
					if(resultFunc)
					{
						resultFunc(ignoreUserList);
					}
		  		}			 
			};
			
			UnityNet.reqIgnoreUserList(can, null);
		}
	}
		
	public function getBlockUserList(resultFunc:Function):void
	{
		if(isGetBlockUserList)
		{
			resultFunc(blockUserList);
		}
		else
		{
			var can:Function = function(result:HashObject)
			{
		  		if(result["ok"].Value)
				{
					isGetBlockUserList = true;
					
					if(result["list"] != null)
					{
						blockUserList = createArray(true, result["list"]);
					}
					else
					{
						blockUserList = new Array();
					}

					if(resultFunc)
					{
						resultFunc(blockUserList);
					}
		  		}			 
			};
			
			UnityNet.reqBlockUserList(can, null);				
		}
	}
	
	private function createArray(isBlock:boolean, _data:HashObject):Array
	{
		var returnArr:Array = new Array();
		
		if(_data == null)
		{
			return returnArr;
		}
		
		var key:String;
		var tvuid:int = Datas.instance().tvuid();
		
		if(isBlock)
		{
			key = "blockedUserId";
		}
		else
		{
			key = "ignoredUserId";
		}
		
		var obj:HashObject;
		var data:Hashtable;
		var uid:int;		
		var length:int = _Global.GetObjectKeys(_data).Length;
		for(var a:int = 0; a < length; a++)
		{
			obj = _data[_Global.ap + a];
			uid = _Global.INT32(obj[key]);
			if(uid != tvuid)
			{
				data = {"uid":uid, "name":obj["displayName"].Value};
				returnArr.Push(data);			
			}			
		}
		
		return returnArr;
	}

	public function removeBlockUser(userId:int, resultFunc:Function):void
	{
		var params:Array = new Array();
		params.Add(userId);	
		
		var can:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{	
				if(isGetBlockUserList)
				{
					deleteByUserId(true, userId);
				}
				
				if(resultFunc)
				{
					resultFunc(result);
				}
	  		}
		};
		
		UnityNet.reqUnblockUser(params, can, null);		
	}
	
	private function deleteByUserId(isBlock:boolean, id:int):void
	{
		var arr:Array;
		var data:Hashtable;
		var str:String;
		if(isBlock)
		{
			arr = blockUserList;
		}
		else		
		{
			arr = ignoreUserList;
		}
		
		for(var a:int = 0; a < arr.length; a++)
		{
			data = arr[a];
			if(data["uid"] == id)
			{
				arr.Splice(a, 1);
				break;
			}
		}
	}
	
	public function BlockUser(messageId:String, userId:int, userName:String, successFunc:Function, failFunc:Function):void
	{
		
		var params:Array = new Array();
		
 		params.Add("blockUser");
 		params.Add(messageId + "");
 		params.Add("inbox");		
						
		var can:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{	
				if(isGetBlockUserList)
				{
					var data:Hashtable = {"uid":userId, "name":userName};
					blockUserList.Unshift(data);
				}

				if(successFunc)
				{
					successFunc(result);
				}
	  		}		 
		};
		
		UnityNet.reqAction(params, can, failFunc);
	}	
	
	public function removeIgnoreUser(userId:int, resultFunc:Function):void
	{
		var params:Array = new Array();
		params.Add(userId);
 		params.Add(0);	
		
		var can:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{	
				if(isGetIgnoreUserList)
				{	
					if(ignoreUserHash.ContainsKey(userId + ""))
					{
						deleteByUserId(false, userId);
						ignoreUserHash.Remove(userId + "");
					}
				}

				if(resultFunc)
				{
					resultFunc(result);
				}
	  		}			 
		};
		
		UnityNet.reqIgnoreUser(params, can, null);	
	}
	
	public function IgnoreUser(userId:int, userName:String, resultFunc:Function):void
	{
		var params:Array = new Array();
		params.Add(userId);
 		params.Add(1);	
		
		var can:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{	
				if(isGetIgnoreUserList)
				{
					if(!ignoreUserHash.ContainsKey(userId + ""))
					{
						var data:Hashtable = {"uid":userId, "name":userName};
						ignoreUserList.Unshift(data);					
					
						ignoreUserHash[userId+ ""] = 1;
					}
				}

				if(resultFunc)
				{
					resultFunc(result);
				}
	  		}			 
		};
		
		UnityNet.reqIgnoreUser(params, can, null);
	}
}