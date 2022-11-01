#pragma strict
import System;
import System.Collections.Generic;

class FrameMgr {
	private static var _instance : FrameMgr = null;
	
	public static function instance() : FrameMgr {
		if (null == _instance) {
			_instance = new FrameMgr();
			GameMain.instance().resgisterRestartFunc(function(){
				_instance = null;
			});
		}
		return _instance;
    }

    private var headFrames : Dictionary.<String, boolean> = new Dictionary.<String, boolean>();
    private var chatFrames : Dictionary.<String, boolean> = new Dictionary.<String, boolean>();
    private var playerHeadFrame : String;
    private var playerChatFrame : String;
    
    public function init(sd : HashObject) : void 
    {
        var avatarUnlock : HashObject = sd["avatarUnlock"];
        var count : int = _Global.GetObjectKeys(avatarUnlock).Length;
		for(var i : int = 0; i < count; ++i)
		{
			var avatarData : HashObject = avatarUnlock[_Global.ap + i];
			var avatarImg : String = _Global.GetString(avatarData["img"]);
			var lockStatus : int = _Global.INT32(avatarData["lockStatus"]);

			headFrames.Add(avatarImg, _Global.GetBoolean(lockStatus));
        }
        
        var chatUnlock : HashObject = sd["chatUnlock"];
        var chatCount : int = _Global.GetObjectKeys(chatUnlock).Length;
		for(var j : int = 0; j < chatCount; ++j)
		{
			var chatData : HashObject = chatUnlock[_Global.ap + j];
			var chatImg : String = _Global.GetString(chatData["img"]);
			var chatLockStatus : int = _Global.INT32(chatData["lockStatus"]);

			chatFrames.Add(chatImg, _Global.GetBoolean(chatLockStatus));
		}

        playerHeadFrame = _Global.GetString(sd["avatarSet"]["img"]);
        playerChatFrame = _Global.GetString(sd["chatSet"]["img"]);
    }

    public function get PlayerHeadFrame() : String {
		return playerHeadFrame;
    }
    
    public function get PlayerChatFrame() : String {
		return playerChatFrame;
	}

    public function GetHeadFrames() : List.<String> {
        var list : List.<String> = new List.<String>();
		for (var a in headFrames) {
            if(a.Value)
                list.Add(a.Key);
        }
        
        for (var b in headFrames) {
            if(!b.Value)
                list.Add(b.Key);
		}
		return list;
    }

    public function GetChatFrames() : List.<String> {
        var list : List.<String> = new List.<String>();
        for (var a in chatFrames) {
            if(a.Value)
                list.Add(a.Key);
        }
        
		for (var b in chatFrames) {
            if(!b.Value)
                list.Add(b.Key);
		}
		return list;
    }
    
    public function HeadFrameLock(frame : String) : boolean {
        if(this.headFrames.ContainsKey(frame))
        {
            return this.headFrames[frame];
        }

        return false;
	}
    
    public function ChatFrameLock(frame : String) : boolean {
        if(this.chatFrames.ContainsKey(frame))
        {
            return this.chatFrames[frame];
        }

        return false;
    }  

    public function decorationUpdate(type : String, selectedFrame : String)
    {
        var id : String = selectedFrame.Replace("img", "");
        var itemId : int = _Global.INT32(id);
        var onSuccess = function(result : HashObject) {
            if(type == "avatar")
            {
                playerHeadFrame = selectedFrame;
                MenuMgr.getInstance().PushMessage(Datas.instance().getArString("PlayerInfo.AvaterChange_Success"));
            }
            else if(type == "chat")
            {
                playerChatFrame = selectedFrame;
                MenuMgr.getInstance().PushMessage(Datas.instance().getArString("UserSetting.ChatBox_Success"));
            }	
            MenuMgr.instance.sendNotification(Constant.FrameType.DECORATION_UPDATE, null);		
		};
		
		var onFailed = function(errorMsg : String, errorCode : String) {
			var arStrings:Datas = Datas.instance();
			var disMsg:String = errorCode == UnityNet.NET_ERROR ? arStrings.getArString("Error.Network_error") : UnityNet.localError( errorCode, errorMsg, null );
			ErrorMgr.instance().PushError("",disMsg);
		};
			
		UnityNet.decorationUpdate( type, itemId, onSuccess, onFailed);
    }

    public function decorationUnlock(type : String, itemId : int, succFunc : Function, failFunc : Function)
    {
        var imgKey : String = "img" + itemId;
        var onSuccess = function(result : HashObject) {     
            if(type == "avatar")
            {
                if(headFrames.ContainsKey(imgKey))
                {
                    headFrames[imgKey] = true;
                }
                MenuMgr.getInstance().PushMessage(Datas.instance().getArString("PlayerInfo.AvatarUnlock_Success"));
            }
            else if(type == "chat")
            {
                if(chatFrames.ContainsKey(imgKey))
                {
                    chatFrames[imgKey] = true;
                }
                MenuMgr.getInstance().PushMessage(Datas.instance().getArString("UserSetting.ChatBoxUnlock_Success"));
            }	
            if(succFunc != null)
                succFunc(result);		
		};
		
		var onFailed = function(errorMsg : String, errorCode : String) {
			var arStrings:Datas = Datas.instance();
			var disMsg:String = errorCode == UnityNet.NET_ERROR ? arStrings.getArString("Error.Network_error") : UnityNet.localError( errorCode, errorMsg, null );
            ErrorMgr.instance().PushError("",disMsg);
            if (null != failFunc)
				failFunc(errorMsg, errorCode);
        };
        
        if(type == "avatar")
        {
            if(headFrames.ContainsKey(imgKey))
            {
                if(headFrames[imgKey])
                {
                    ErrorMgr.instance().PushError("",Datas.instance().getArString("Error.err_3500"));
                }
                else
                {
                    UnityNet.decorationUnlock( type, itemId, onSuccess, onFailed);
                }
            }	
        }
        else if(type == "chat")
        {
            if(chatFrames.ContainsKey(imgKey))
            {
                if(chatFrames[imgKey])
                {
                    ErrorMgr.instance().PushError("",Datas.instance().getArString("Error.err_3501"));
                }
                else
                {
                    UnityNet.decorationUnlock( type, itemId, onSuccess, onFailed);
                }
            }	
        }	   
    }
}