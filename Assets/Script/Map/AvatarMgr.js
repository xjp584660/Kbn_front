#pragma strict
import System;
import System.Collections.Generic;

class AvatarMgr {
	private static var _instance : AvatarMgr = null;
	
	public static function instance() : AvatarMgr {
		if (null == _instance) {
			_instance = new AvatarMgr();
			GameMain.instance().resgisterRestartFunc(function(){
				_instance = null;
			});
		}
		return _instance;
	}
	
	
	
	// hard coding config
	private final var MAX_GENERAL_PER_CITY : int = 16;
	private final var MAX_CITY_NUM : int = 5;
	
	private class GeneralId {
		public var generalName:String;
		public var cityOrder:int;
		
		public function GeneralId(g : String, c : int) {
			generalName = g;
			cityOrder = c;
		}
	}
	
	private class ItemAvatar {
		public var image : String;
		public var itemId : int;
		public var itemAmount : int;
		
		public function ItemAvatar(image : String, itemId : int, itemAmount : int) {
			this.image = image;
			this.itemId = itemId;
			this.itemAmount = itemAmount;
		}
	}
	
	private var avatarUnlockLevel : int = 100;
	private var generalAvatars : Dictionary.<String, GeneralId> = new Dictionary.<String, GeneralId>();
	private var otherAvatars : Dictionary.<String, String> = new Dictionary.<String, String>();
	private var itemAvatars : Dictionary.<String, ItemAvatar> = new Dictionary.<String, ItemAvatar>();
	
	private var generalAvatarIdTable : Dictionary.<String, String> = new Dictionary.<String, String>();
	
	private var playerAvatar : String = "";
	private var playerBadge : String = "";
	
	public function get AvatarUnlockLevel() : int {
		return avatarUnlockLevel;
	}
	
	public function init(sd : HashObject) : void {
	
		// initialize general avatars
		for (var i : int = 1; i <= MAX_CITY_NUM; ++i) {
			for (var j : int = 1; j <= MAX_GENERAL_PER_CITY; ++j) {
				var texName : String = General.getGeneralTextureName(j.ToString(), i);
				if (!generalAvatarIdTable.ContainsKey(texName)) {
					generalAvatarIdTable.Add(texName, "2_" + i + "_" + j);
					generalAvatars.Add(generalAvatarIdTable[texName], null);
				}
			}
		}
		
		// special generals
		generalAvatars.Add("2_0_1000", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("1000", 0), "2_0_1000");
		generalAvatars.Add("2_0_1001", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("1001", 0), "2_0_1001");
		generalAvatars.Add("2_0_47000", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47000", 0), "2_0_47000");
		generalAvatars.Add("2_0_47001", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47001", 0), "2_0_47001");
		generalAvatars.Add("2_0_47002", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47002", 0), "2_0_47002");
		generalAvatars.Add("2_0_47003", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47003", 0), "2_0_47003");
		generalAvatars.Add("2_0_47004", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47004", 0), "2_0_47004");
		generalAvatars.Add("2_0_47005", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47005", 0), "2_0_47005");
		generalAvatars.Add("2_0_47006", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47006", 0), "2_0_47006");
		generalAvatars.Add("2_0_47007", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47007", 0), "2_0_47007");
		generalAvatars.Add("2_0_47008", null);
		generalAvatarIdTable.Add(General.getGeneralTextureName("47008", 0), "2_0_47008");
		// initialize other avatars
		var gd : HashObject = Datas.instance().getGameData();
		var defaultPortrait : HashObject = gd["ardefaultportrait"];
		if (null != defaultPortrait) {
			for (var k : String in defaultPortrait.Table.Keys) {
				var obj : HashObject = defaultPortrait[k];
				otherAvatars.Add("1_" + k, obj["img"].Value as String);
			}
		}
		
		// player avatar and badge
		avatarUnlockLevel = _Global.INT32(sd["serverSetting"]["KnightPortraitLevel"]);
		UpdatePlayerAvatar(null != sd["player"]["portraitname"] ? sd["player"]["portraitname"].Value : "");
		playerBadge = (null != sd["badge"] ? sd["badge"].Value : "");
		
		// unlock general avatars and item avatars
		UpdateBySeed(sd);
	}
	
	public function GetAvatarTextureName(avatar : String) : String {
		if (String.IsNullOrEmpty(avatar)) {
			return "player_avatar_default";
		}
			
		var arr : String[] = avatar.Split("_"[0]); // ugly..
		if (arr.Length == 2 && arr[0] == "1") {                                                   // 1_xxxx
			if (otherAvatars.ContainsKey(avatar))
				return otherAvatars[avatar];
			else
				return "player_avatar_default";
		} else if (arr.Length == 3 && arr[0] == "2") {                                            // 2_cc_kk
			return General.getGeneralTextureName(arr[2], _Global.INT32(arr[1]));
		} else if (arr.Length == 2 && arr[0] == "3" && itemAvatars.ContainsKey(avatar)) {         // 3_xxxx
			return itemAvatars[avatar].image;
		}
		return "player_avatar_default";
	}
	
	public function UpdatePlayerAvatar(avatar : String) : void {
		if (String.IsNullOrEmpty(avatar)) {
			playerAvatar = "1_1001";
		}
		playerAvatar = avatar.StartsWith("2_") ? GetGeneralAvatarId(GetAvatarTextureName(avatar)) : avatar;
	}
	
	public function UpdateBySeed(sd : HashObject) : void {
		var	cities:HashObject = sd["cities"];
		var cityInfo:HashObject;
		
		// unlock general avatars
		for (var i:int = 0; i < GameMain.instance().getCitiesNumber(); i++)
		{
			cityInfo = cities[_Global.ap + i];
			var currentcityid:int = _Global.INT32(cityInfo[_Global.ap + 0]);
			var cityOrder:int = _Global.INT32(cityInfo[_Global.ap + 6]);
			var generals:Array = _Global.GetObjectValues(sd["knights"]["city" + currentcityid]);
			
			for (var data:Object in generals) {
				var general : HashObject = data as HashObject;
				if (_Global.INT32(general["knightLevel"]) >= avatarUnlockLevel &&
					_Global.INT32(general["knightLocked"]) != 1) {
				
					var generalName : String = general["knightName"].Value as String;
					var avatarTex : String = General.getGeneralTextureName(generalName, cityOrder);
					var avatarId : String = generalAvatarIdTable[avatarTex];
					
					if (!generalAvatars.ContainsKey(avatarId) ||
						null != generalAvatars[avatarId])
						continue;
					
					generalAvatars[avatarId] = new GeneralId(generalName, cityOrder);
				}
			}
		}
		
		var serverSetting : HashObject = sd["serverSetting"];
		if (null == serverSetting)
			return;
		var itemAvatarList : HashObject = serverSetting["itemportrait"];
		if (null == itemAvatarList)
			return;
		var itemAvatarIds : String[] = _Global.GetObjectKeys(itemAvatarList);
		for (i = 0; i < itemAvatarIds.Length; i++) {
			var key : String = itemAvatarIds[i];
			var itemAvatarData : HashObject = itemAvatarList[key];
			itemAvatars["3_" + key] = new ItemAvatar(
				_Global.GetString(itemAvatarData["img"]),
				_Global.INT32(itemAvatarData["itemid"]),
				_Global.INT32(itemAvatarData["itemcount"])
			);
		}
		
	}
	
	private function GetGeneralAvatarId(texName : String) : String {
		if (generalAvatarIdTable.ContainsKey(texName))
			return generalAvatarIdTable[texName];
		return "1_1001";
	}
	
	public function GetUnlockedAvatars() : List.<String> {
		var list : List.<String> = new List.<String>();
		for (var a in otherAvatars) {
			list.Add(a.Key);
		}
		for (var i in itemAvatars) {
			if (i.Value.itemAmount <= MyItems.singleton.countForItem(i.Value.itemId)) {
				list.Add(i.Key);
			}
		}
		for (var b in generalAvatars) {
			if (null != b.Value)
				list.Add(b.Key);
		}
		return list;
	}
	
	public function GetAvatars() : List.<String> {
		var list : List.<String> = GetUnlockedAvatars();
		for (var b in generalAvatars) {
			if (null == b.Value)
				list.Add(b.Key);
		}
		return list;
	}
	
	public function AvatarAvailable(avatar : String) : boolean {
		return (generalAvatars.ContainsKey(avatar) && null != generalAvatars[avatar]) || 
				otherAvatars.ContainsKey(avatar) ||
				itemAvatars.ContainsKey(avatar);
	}
	
	public function RequestChangeAvatar(avatar : String, succFunc : Function, failFunc : Function) : void {
		var type : String = null;
		var kid : String;
		var corder : int;
		
		var arr : String[] = avatar.Split("_"[0]); // ugly..
		if (otherAvatars.ContainsKey(avatar)) {                                                // 1_xxxx
			type = "1";
			kid = arr[1];
		} else if (generalAvatars.ContainsKey(avatar) && null != generalAvatars[avatar]) {     // 2_cc_kk
			type = "2";
			kid = generalAvatars[avatar].generalName;
			corder = generalAvatars[avatar].cityOrder;
		} else if (itemAvatars.ContainsKey(avatar)) {                                          // 3_xxxx
			type = "3";
			kid = arr[1];
		}
		
		if (String.IsNullOrEmpty(type))
			return;
		
		var onSuccess = function(result : HashObject) {
			if (null != result["portraitname"]) {
				UpdatePlayerAvatar(result["portraitname"].Value as String);
			}
			
			if (null != succFunc)
				succFunc(result);
		};
		
		var onFailed = function(errorMsg : String, errorCode : String) {
			if (null != failFunc)
				failFunc(errorMsg, errorCode);
		};
		
		UnityNet.reqChangeAvatar( [type, kid, corder.ToString()] , onSuccess, onFailed);
	}
	
	public function get PlayerAvatar() : String {
		return playerAvatar;
	}
	
	public function get PlayerBadge() : String {
		return playerBadge;
	}
	
	public function set PlayerBadge(value : String) {
		playerBadge = value;
	}
	
}