using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using _Global = KBN._Global;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;
using ErrorMgr = KBN.ErrorMgr;
using KBNPlayer = KBN.KBNPlayer;

namespace KBN {
    public abstract class Alliance : AllianceBase {
		public static Alliance singleton { get; protected set; }
        protected HashObject seed;
        
        public void init(HashObject seed) {
            this.seed = seed;
            if (_alliance == null)
                _alliance = new AllianceVO();
            SInit();
            //      Alliance.getInstance().reqAllianceInfo();
            updateSeed(seed);
        }
        
        public void updateSeed(HashObject seed) {
            priv_updateMyAllianceDataFromGetSeed(seed);
            if (seed["serverSetting"] != null) {
                UpdateServerSetting(seed["serverSetting"]);
            }
        }

		public string clickMemberName;
        
        protected AllianceVO _alliance;
        protected List<AllianceMemberVO> _pendingApprovals;
        protected List<AllianceMemberVO> _officers;
        protected List<DipAllianceVO> _dipList;
        protected List<AllianceMemberVO> _memberList;
        protected bool _hasGetAllianceInfo;
        
		public string RankType
		{
			get;
			set;
		}

        protected void UpdateMyAllianceDataFromVO() {
            if (_hasGetAllianceInfo) {
                if (_alliance != null) {
                    SetMyAlliance(_alliance.allianceId, _alliance.name, _alliance.userOfficerType);
                } else {
                    SetMyAlliance(0, null, 0);
                }
                //UnityEngine.Debug.Log(string.Format("From Alliance MyAllianceId VO {0} MyOfficerType {1}", MyAllianceId, MyOfficerType));
            }
        }
        
        protected void priv_updateMyAllianceDataFromGetSeed(HashObject seed) {
        
            HashObject PlayerSeed = seed["players"] != null ? seed["players"]["u" + Datas.singleton.tvuid()] : null;
            if (PlayerSeed != null) {
                SetMyAlliance(_Global.INT32(PlayerSeed["a"]), null, _Global.INT32(PlayerSeed["officerType"]));
                if (PlayerSeed["mvp"] != null)
                    MyIsMVP = (_Global.INT32(PlayerSeed["mvp"]) != 0);
                //UnityEngine.Debug.Log(string.Format("From MyAllianceId GetSeed {0} MyOfficerType {1}", MyAllianceId, MyOfficerType));
                MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED, null);
            } else if (seed["player"] != null) {
                if (seed["player"]["mvp"] != null)
                    MyIsMVP = (_Global.INT32(seed["player"]["mvp"]) != 0);
                
                if (seed["player"]["officerType"] != null) {
                    SetMyAlliance(_Global.INT32(seed["player"]["allianceId"]), null, _Global.INT32(seed["player"]["officerType"]));
                    MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED, null);
                }
            }
            //UpdateMyAllianceDataFromUpdateSeed(seed["player"]);
        }
        
        public void UpdateMyAllianceDataFromUpdateSeed(HashObject PlayerSeed) {
            if (PlayerSeed != null) {
                SetMyAlliance(_Global.INT32(PlayerSeed["allianceId"]), _Global.ToString(PlayerSeed["allianceName"]), _Global.INT32(PlayerSeed["officerType"]));
                //UnityEngine.Debug.Log(string.Format("From MyAllianceId UpdateSeed {0} MyOfficerType {1}", MyAllianceId, MyOfficerType));
            }
        }
        
        public void UpdateServerSetting(HashObject Setting) {
            if (Setting != null) {
                if (Setting["allowJumpAllianceFromInvitation"] != null) {
                    _PoachInviteEnable = _Global.ToBool(Setting["allowJumpAllianceFromInvitation"]);
                }
            }
        }
        
        public bool CanInviteUser(int UserId, int UserAllianceId) {
            if (!this.IsHaveRights(AllianceRights.RightsType.InvitingMember))
                return false;
            
            if (UserAllianceId == MyAllianceId()) {
                return false;
            }
            
            if (UserAllianceId != 0 && !IsPoachInviteEnable()) {
                return false;
            }
            
            return true;
        }
        
        public void SendInvite(string to, string subject, string message, MulticastDelegate resultFunc, object param) {
            Hashtable ParamObject = param as Hashtable;
            AllianceVO avo = ParamObject["allianceVO"] as AllianceVO;
            string content = string.Format("{0}\r\n{1}\r\n{2}\r\n{3}\r\n{4}",
                                               Datas.getArString("Alliance.InviteReceived") + avo.name,
                                               Datas.getArString("Alliance.InviteRegent") + avo.leaderName,
                                               Datas.getArString("Alliance.InviteRank") + avo.ranking,
                                               Datas.getArString("Alliance.InviteMight") + avo.might,
                                               message);
            
            UnityNet.reqWWW("allianceInvites.php", new Hashtable {
                {"action", "send"},
                {"toUserId", (_Global.ToString(ParamObject["userId"]))},
                {"emailTo", to},
                {"subject", subject},
                {"msg", content},
                {"fromAllianceId", _Global.ToString(avo.allianceId)},
            }, resultFunc, null);
        }

        protected abstract int GetInviteEmailType();

        protected abstract void EmailMenuClickCompose(Hashtable _obj);

        protected void RealInviteUser(string name, int UserId) {
            if (!this.IsHaveRights(AllianceRights.RightsType.InvitingMember)) {
                //MenuMgr.instance.PushMessage(Datas.getArString("Alliance.InvitePermissions"));
                ErrorMgr.singleton.PushError("", Datas.getArString("Alliance.InvitePermissions"));
                return;
            }
            Hashtable _obj = new Hashtable {
                {"subMenu", "compose"},
                {"name", name},
                {"readonlyto", "true"},
                {"title", Datas.getArString("Alliance.InviteTitle")},
                {"subject", string.Format("{0} {1}", Datas.getArString("Alliance.InviteSubject"), MyAllianceName())},
                {"readonlysubject", "true"},
                {"messageBody", string.Format("{0} {1}", Datas.getArString("Alliance.InviteBody"), MyAllianceName())},
                {"param", new Hashtable
                    {
                        {"userName", name},
                        {"userId", UserId}, 
                        {"allianceVO", _alliance},
                        {"type", GetInviteEmailType()},
                    }
                },
				{"type", 1},	//	1 : Alliance inviting
            };
            if (MenuMgr.instance.hasMenuByName("EmailMenu")) {
                MenuMgr.instance.pop2Menu("EmailMenu");
                EmailMenuClickCompose(_obj);
            } else {
                MenuMgr.instance.PushMenu("EmailMenu", _obj);
            }
        }
        
        public void DoInviteUser(string name, int UserId) {
            if (MyAllianceDataDirty()) {
                Action action = delegate () {
                    RealInviteUser(name, UserId);
                };
                reqAllianceInfo(action);
            } else {
                RealInviteUser(name, UserId);
            }
        }
        
        public void DoAccept(int UserId, int AllianceId, MulticastDelegate OnOk) {
            UnityNet.reqWWW("allianceInvites.php", new Hashtable {
                {"action", "accept"},
                {"fromUserId", UserId},
                {"fromAllianceId", AllianceId},
            }, OnOk, null);
        }
        
        public void DoRefuse(int UserId, int AllianceId) {
            UnityNet.reqWWW("allianceInvites.php", new Hashtable {
                {"action", "refuse"},
                {"fromUserId", UserId},
                {"fromAllianceId", AllianceId},
            }, null, null);
        }
        
        public bool hasGetAllianceInfo {
            get {
                return _hasGetAllianceInfo;
            }
        }
        
        public AllianceVO myAlliance {
            get {
                return _alliance;
            }
        }

        public void SetMyAllianceLanguage(int languageId){
            if(_alliance!=null){
                _alliance.languageId=languageId;
                // MenuMgr.instance.SendNotification(Constant.Notice.ALLIANCE_EMBLEM_CHANGED);
                MenuMgr.instance.SendNotification(Constant.Notice.ALLIANCE_INFO_LOADED);
            }
        }
        
        public AllianceMemberVO[] pendingApprovals {
            get {
                return _pendingApprovals == null ? null : _pendingApprovals.ToArray();
            }
        }
        
        public AllianceMemberVO[] allianceOfficers {
            get {
                return _officers == null ? null : _officers.ToArray();
            }
        }
        
        public DipAllianceVO[] dipAllianceList {
            get {
                return _dipList == null ? null : _dipList.ToArray();
            }
        }

        public bool hasAllianceInSeed() {
            
            return Datas.getIntValue(seed, "allianceDiplomacies.allianceId") > 0;
        }
        
        //
        protected void addDipObjects2List(HashObject obj, int status) {
            DipAllianceVO davo;
            if (obj == null)
                return;
            foreach (System.Collections.DictionaryEntry i in obj.Table) {
                davo = new DipAllianceVO();
                davo.status = status; // statusStr;
                
                davo.mergeDataFromDipView(i.Value);
                _dipList.Add(davo);
            }
        }
        
        public void removeLeaderById(int id) {
            for (int i = 0; i < _officers.Count; i++) {
                if (_officers[i].userId == id) {
                    _officers.RemoveAt(i);
                    break;
                }
            }
        }
        
        public void removeLeaderByType(int type) {
            for (int i = 0; i < _officers.Count; i++) {
                if (_officers[i].positionType == type) {
                    _officers.RemoveAt(i);
                    break;
                }
            }
        }
        
        public void addLeaderbyId(int uid, int newType) {
            for (int i = 0; i < _memberList.Count; i++) {
                if (_memberList[i].userId == uid) {
                    _officers.Add(_memberList[i]);
                    _memberList[i].changePositionType(newType);
                    break;
                }
            }
            //sort.
            
        }
        
        public AllianceMemberVO[] Members {
            get {
                return _memberList == null ? null : _memberList.ToArray();
            }
        }
        
        ////end  view functions .
        
        /// Net part.  remote call..
        public void __FUNC() {
            Action<HashObject> okFunc = delegate (HashObject result) {
                
            };
            UnityNet.reqWWW("__URL.php", new Hashtable(), okFunc, null);
        }
        
        public bool isAvailablePosForViceChancellor() {
            return FindMemberCountByOfficer(Constant.Alliance.ViceChancellor) < 2;
        }
        
        public int FindMemberCountByOfficer(int officer) {
            if (officer == Constant.Alliance.ViceChancellor)
                return priv_findMemberCountByOfficerInArray(officer, _officers);
            if (officer == Constant.Alliance.Chancellor)
                return 1;
            return priv_findMemberCountByOfficerInArray(officer, _memberList);
        }
        
        protected static int priv_findMemberCountByOfficerInArray(int officer, IEnumerable<AllianceMemberVO> arr) {
            int count = 0;
            foreach (AllianceMemberVO obj in arr) {
                if (obj.positionType == officer) {
                    ++count;
                }
            }
            return count;
        }
        
        public void reqAllianceInfo() {
            reqAllianceInfo(null);
        }
        
        public void reqAllianceInfo(Action funCallBack) {
            // allianceInfo . officers. pendingApprovals. diplomaticAlliances.
            Action<HashObject> okFunc = delegate (HashObject result) {
                _hasGetAllianceInfo = true;
                
                if (result["inAlliance"] != null && _Global.GetBoolean(result["inAlliance"])) { // in alliance ..
                    if (_alliance == null)
                        _alliance = new AllianceVO();
                    _alliance.mergeDataFromMy(result["allianceInfo"]);
					if (null != _alliance.emblem) {
						AllianceEmblemMgr.instance.UpdateAllianceEmblem(_alliance.emblem, false);
					}
                    //
                    HashObject paObj = result["pendingApprovals"];
                    _pendingApprovals = new List<AllianceMemberVO>();
                    AllianceMemberVO amvo;
                    if (paObj != null) {
                        foreach (DictionaryEntry it in paObj.Table) {
                            amvo = new AllianceMemberVO();
                            amvo.mergeDataFromApproval(it.Value);
                            amvo.userId = _Global.INT32(it.Key);
                            _pendingApprovals.Add(amvo);
                        }
                    }
                    paObj = result["officers"];
                    this._officers = new List<AllianceMemberVO>();
                    if (paObj != null) {
                        foreach (DictionaryEntry it in paObj.Table) {
                            amvo = new AllianceMemberVO();
                            amvo.mergeDataFromOfficer(it.Value);
                            _officers.Add(amvo);
                        }
                    }
                    _alliance.setUserOfficerType(result["userOfficerType"]);
                    //_diplomaticAlliances ...
                    
                    _dipList = new List<DipAllianceVO>();
                    if (seed != null) {
                        seed["allianceDiplomacies"] = result["diplomaticAlliances"];
                    }
                    this.addDipObjects2List(result["diplomaticAlliances"]["friendly"], 1);
                    this.addDipObjects2List(result["diplomaticAlliances"]["hostile"], 2);
                    this.addDipObjects2List(result["diplomaticAlliances"]["friendlyToThem"], 3);
                    this.addDipObjects2List(result["diplomaticAlliances"]["friendlyToYou"], 3);

					UpdateAvaAllianceInfo( result["allianceInfo"] );
					UpdateAvaPlayerInfo( result["personalInfo"] );

                    //---------------------------------// zhou wei
                    Quests.singleton.checkForElse();
                    //---------------------------------//
                } else {
                    _alliance = null;
					AllianceEmblemMgr.instance.UpdateAllianceEmblem(null, false);
                    _officers = null;
                    _pendingApprovals = null;
                    _dipList = null;
                    _memberList = null;
                    if (seed != null && seed["allianceDiplomacies"] != null) {
                        seed.Remove("allianceDiplomacies");
                    }
                }
                UpdateMyAllianceDataFromVO();
				MenuMgr.instance.SendNotification(Constant.Notice.ALLIANCE_EMBLEM_CHANGED);
				MenuMgr.instance.SendNotification(Constant.Notice.ALLIANCE_INFO_LOADED);
                if (funCallBack != null) {
                    funCallBack();
                }
            };
            
            UnityNet.reqWWW("allianceGetInfo.php", new Hashtable(), okFunc, null);
        }

		private void UpdateAvaAllianceInfo(HashObject info)
		{
			if( info == null )
				return;

			AvaAlliance avaAlliance = GameMain.Ava.Alliance;
			avaAlliance.ExpendablePoint = _Global.INT64(info["eap"]);
			avaAlliance.CumulatePoint = _Global.INT64(info["cap"]);
			avaAlliance.Level = _Global.INT32(info["level"]);

		}
        

		private void UpdateAvaPlayerInfo(HashObject info)
		{
			if( info == null )
				return;

			AvaPlayer avaPlayer = GameMain.Ava.Player;
			avaPlayer.UnclaimedPoint = _Global.INT32(info["unclaimed"]);
			avaPlayer.AlliesPurchaseAp = _Global.INT32(info["alliespap"]);
			avaPlayer.SelfPurchaseAp = _Global.INT32(info["selfpap"]);
			avaPlayer.ExpendablePoint = _Global.INT64(info["eap"]);
			avaPlayer.StoneAp = _Global.INT32(info["stoneAp"]);
			avaPlayer.OreAp = _Global.INT32(info["oreAp"]);
			avaPlayer.FoodAp = _Global.INT32(info["foodAp"]);
			avaPlayer.WoodAp = _Global.INT32(info["woodAp"]);
			avaPlayer.GoldAp = _Global.INT32(info["goldAp"]);

			HashObject itemCount = info["count"];
			Dictionary<int, int> itemTimesDic = avaPlayer.ItemTimes;
			string[] keys = _Global.GetObjectKeys(itemCount);
			foreach( var key in keys ){
				int intkey;

				if( int.TryParse( key, out intkey ) ){
					if( itemTimesDic.ContainsKey(intkey) ){
						itemTimesDic[intkey] = _Global.INT32( itemCount[key] );
					}else{
						itemTimesDic.Add(intkey, _Global.INT32( itemCount[key] ));
					}
				}

			}

		}

        public void reqAllianceGetOtherInfO(string type, int pageNo, Action<HashObject, AllianceVO[]> resultFunc) {
            reqAllianceGetOtherInfO(type,pageNo, "", resultFunc);
        }

        public void reqAllianceGetOtherInfO(string type, int pageNo, string searchString, Action<HashObject, AllianceVO[]> resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                int adjustPageNo = pageNo;
                if (adjustPageNo <= 0)
                    adjustPageNo = 1;
                object[] vList = _Global.GetObjectValues(result["otherAlliances"]);
                HashObject order = result["allianceorder"];
                
                List<AllianceVO> otherList = new List<AllianceVO>();
                AllianceVO avo;
                int pageN = _Global.INT32(result["recordsPerPage"]);
                //
                int i;
                for (i=0; i<vList.Length; i++) {
                    avo = new AllianceVO();
                    avo.mergeDataFromOthers(vList[i]);
                    otherList.Add(avo);
                    //fix data ..
                }
                if (order == null) {
                    otherList.Sort(rankSortFunc); // 1-->9;
                } else {
                    otherList.Sort(delegate (AllianceVO l, AllianceVO r) {
                        Func<AllianceVO, int> getIdx = delegate (AllianceVO v) {
                            for (int idx = 0; idx != order.Table.Count; ++idx) {
                                HashObject key = order[_Global.ap + idx.ToString()];
                                if (key == null)
                                    return order.Table.Count;
                                if (_Global.INT32(key) == v.allianceId)
                                    return idx;
                            }
                            return order.Table.Count;
                        };
                        int lOrder = getIdx(l);
                        int rOrder = getIdx(r);
                        return lOrder - rOrder;
                    });
                }
                for (i=0; i<otherList.Count; i++) {
                    avo = otherList[i];
                    avo.topIndex = (adjustPageNo - 1) * pageN + i + 1;
                }
                
                if (resultFunc != null) {
                    resultFunc(result, otherList.ToArray());
                }
            };

            UnityNet.reqWWW("allianceGetOtherInfo.php", new Hashtable {
				{"type",type},
				{"pageNo", pageNo},
                {"searchString", searchString},
            }, okFunc, null);
        }

        protected int rankSortFunc(AllianceVO a, AllianceVO b) {
            int res = a.ranking - b.ranking;
            if (res != 0)
                res = res / Convert.ToInt32(Mathf.Abs(res));
            return res;
        }
        
        protected long mightSortFunc(AllianceVO a, AllianceVO b) {
            long res = -a.might + b.might;
            if (res != 0)
                res = res / Convert.ToInt64(Mathf.Abs(res));
            return res;
        }
        
        public void reqCreateAlliance(string aName, string aDesc, int cityId, Action onOk) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    reqAllianceInfo();
                    if (onOk != null)
                        onOk();
					UpdateSeed.singleton.update_seed_ajax();
					if(_alliance != null)
					{
						NewSocketNet.instance.AllianceChanged(_alliance.allianceId);
					}
                } else {
                }
            };
            UnityNet.reqWWW("allianceCreate.php", new Hashtable {
                {"allianceDescription", aDesc},
                {"cityId", cityId},
                {"allianceName", aName},
                {"languageId",languageSet},
            }, okFunc, null);
        }
        public static int languageSet=0;
        // public void handleNotification(string type, object body)
        // {
        //     switch(type)
        //     {
        //         case "AllianceLanguage":
        //             languageSet=_Global.INT32(body);
        //             break;
        //     }
        // }
        /****
            alliance member  action functions

        ***/
        public void reqGetUserGeneralInfo(int uid, Action<GeneralUserInfoVO> resultFunc) {
            // click leaders item.
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    HashObject gInfo = result["userInfo"][_Global.ap + 0];
                    GeneralUserInfoVO gvo = new GeneralUserInfoVO();
                    gvo.mergeDataFrom(gInfo);
                    //
                    if (result["userOfficerType"] != null && _alliance != null)
                        SetMyOfficerType(_Global.INT32(result["userOfficerType"]));
                    
                    if (resultFunc != null)
                        resultFunc(gvo);
                }
            };
            UnityNet.reqWWW("getUserGeneralInfo.php", new Hashtable {
                {"uid", uid},
            }, okFunc, null);
        }
        
        public void reqAllianceMemberList(int pageNo, Action<int, int, List<AllianceMemberVO>> resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                // currenrentPage , noOfPages.
                // otherAlliances key(aid) ==> value(allianceInfo)
                List<AllianceMemberVO> pageList = new List<AllianceMemberVO>();
                AllianceMemberVO amvo;
                int cp = _Global.INT32(result["currentPage"]);
                int tp = _Global.INT32(result["noOfPages"]);
                
                foreach (System.Collections.DictionaryEntry i in result["memberInfo"].Table) {
                    amvo = new AllianceMemberVO();
                    amvo.mergeDataFrom(i.Value);
                    pageList.Add(amvo);
                }
                _memberList = pageList;
                for (int x = 0; x != _officers.Count; ++x) {
                    AllianceMemberVO offMem = _officers[x] as AllianceMemberVO;
                    foreach (AllianceMemberVO avo in _memberList) {
                        if (offMem.userId != avo.userId)
                            continue;
                        if (avo.positionType != offMem.positionType) {
                            offMem.changePositionType(avo.positionType);
                            break;
                        }
                    }
                }

				// update alliance info
				_alliance.allianceId = _Global.INT32(result["allianceId"]);
				_alliance.name = result["allianceName"].Value as string;
				_alliance.membersCount = _Global.INT32(result["memberCount"]);
				_alliance.userOfficerType = _Global.INT32(result["userOfficerType"]);
				MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED, null);

                //send notice withe object {"list":pageList,"currentPage":cp,"totalPage":tp}
                if (resultFunc != null)
                    resultFunc.DynamicInvoke(cp, tp, pageList);
            };
            UnityNet.reqWWW("allianceGetMembersInfo.php", new Hashtable {
                {"pageNo", pageNo},
            }, okFunc, null);
        }
        
        public void reqSendWallText(string message, Action<Hashtable> resultFunc) {
            List<string> param = new List<string>();
            param.Add("post");
            param.Add(message);
            
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    string time = _Global.DateTime(GameMain.unixtime());
                    short userID = (short)Datas.singleton.tvuid();
                    HashObject _seed = GameMain.singleton.getSeed();
                    string _username = _Global.GetString(_seed["players"]["u" + Datas.singleton.tvuid()]["n"]);
                    Hashtable newItem = new Hashtable {
                        {"messageId", _Global.INT32(result["messageId"])},
                        {"userId", userID},
                        {"displayName", _username},
						{"officerType", Alliance.singleton.myAlliance.userOfficerType},
                        {"message", message},
                        {"type", 1},
                        {"lastUpdatedTime", time},
                        {"modify", false},
                        {"delete", true}
                    };
                    if (resultFunc != null)
                        resultFunc(newItem);
                }
            };
            
            UnityNet.reqSendWallText(param.ToArray(), okFunc, null);
        }
        
        public void reqGetWallText(Action<HashObject> resultFunc) {
            List<string> param = new List<string>();
            param.Add("view");
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    if (resultFunc != null)
                        resultFunc(result);
                }
            };
            /*
            Action<HashObject> errorFunc = delegate (HashObject result)
            {
                if(result["error_code"] != null)
                {
                    ErrorMgr.instance().PushError("",Datas.getArString(result["error_code"].Value));
                }
            };
            */
            UnityNet.reqGetAllianceWallText(param.ToArray(), okFunc, null);
        }
        
        public void reqEditAllianceNotice(int messageId, string message, Action<Hashtable> resultFunc) {
            List<string> param = new List<string>();
            param.Add("modify");
            param.Add(message);
            param.Add(messageId.ToString());
            
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    string time = _Global.DateTime(GameMain.unixtime());
                    short userID = (short)Datas.singleton.tvuid();
                    HashObject _seed = GameMain.singleton.getSeed();
                    string _username = _Global.GetString(_seed["players"]["u" + Datas.singleton.tvuid()]["n"]);
                    Hashtable newItem = new Hashtable {
                        {"messageId", _Global.INT32(result["messageId"])},
                        {"userId", userID},
                        {"displayName", _username},
						{"officerType", Alliance.singleton.myAlliance.userOfficerType},
                        {"message", message},
                        {"type", 2},
                        {"lastUpdatedTime", time},
                        {"delete", false},
                        {"modify", true}
                    };
                    if (resultFunc != null)
                        resultFunc(newItem);
                }
            };
            UnityNet.reqEditAllianceNotice(param.ToArray(), okFunc, null);
        }

        private static string JoinIntArrayIntoString(int[] intArray, string link) {
            if (intArray == null) return "";
            string[] strArray = new string[intArray.Length];
            for (int i = 0; i < intArray.Length; ++i) {
                strArray[i] = intArray[i].ToString();
            }
            return string.Join(link, strArray);
        }

        public void reqPendingAction(int[] ids, string actionType, Action resultFunc) {
            //approve actionType reject.
            string ids_str = JoinIntArrayIntoString(ids, ",");
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    /**
                     string subject;
                     string message;
                     **/
                    this.reqAllianceInfo();
                    if (resultFunc != null)
                        resultFunc();
                }
            };
            
            UnityNet.reqWWW("alliancePendingAction.php", new Hashtable {
                {"targetUserIds", ids_str},
                {"actionType", actionType}
            }, okFunc, null);
        }
        
        
        // leave alliance .
        public void reqAllianceMemberNames(Action<object[]> resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    /*
                      allianceMembers . key->object
                        userId
                        fbuid
                        usertype
                        displayName
                        avatarId
                        playerSex
                    **/
                    object[] list = _Global.GetObjectValues(result["allianceMembers"]);
                    if (resultFunc != null)
                        resultFunc(list);
                }
            };
            UnityNet.reqWWW("allianceGetMemberNames.php", new Hashtable(), okFunc, null);
        }
        
        public void reqAllianceNewChancellor(string ncId, string ncName, int rtype, Action onOk) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    if (_alliance != null) {
                        _alliance.setUserOfficerType(Constant.Alliance.Member);
                        UpdateMyAllianceDataFromVO();
                        MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED, null);
                    }
                    if (onOk != null)
                        onOk();
                    
                }
            };
            UnityNet.reqWWW("allianceNewChancellor.php", new Hashtable {
                {"newChancellorId", ncId},
                {"newChancellorName", ncName},
                {"requestType", rtype}
            }, okFunc, null);
            
        }
        
        public void reqLeaveAlliance(Action resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    //delete current AllianceInfo.
                    _alliance = null;
					AllianceEmblemMgr.instance.UpdateAllianceEmblem(null);
                    _officers = null;
                    _pendingApprovals = null;
                    _memberList = null;
                    UpdateMyAllianceDataFromVO();
                    seed.Remove("allianceDiplomacies");
                    if (resultFunc != null)
                        resultFunc();
                    MenuMgr.instance.ClearAllianceChatInfo();

					GameMain.Ava.OnLeaveAlliance();
					NewSocketNet.instance.AllianceChanged(0);
                }
                
            };
            UnityNet.reqWWW("allianceLeave.php", new Hashtable(), okFunc, null);
        }
        
        public void reqAllianceSearch(string allianceName, Action<DipAllianceVO[]> resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    List<DipAllianceVO> list = new List<DipAllianceVO>();
                    DipAllianceVO davo;
                    foreach (DictionaryEntry it in result["alliancesMatched"].Table) {
                        davo = new DipAllianceVO();
                        davo.mergeDataFromSearch(it.Value);
                        list.Add(davo);
                    }
                    if (resultFunc != null)
                        resultFunc(list.ToArray());
                }
            };
            UnityNet.reqWWW("allianceGetSearchResults.php", new Hashtable {
                {"allianceName", allianceName}
            }, okFunc, null);
        }
        
        // set dip..
        public void reqSetAllianceDiplomacies(int[] selectIds, int status, Action resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    if (resultFunc != null) {
                        resultFunc();
                    }
                    this.reqAllianceInfo();
                }
            };
            
            string ids_str = JoinIntArrayIntoString(selectIds, ","); 
            
            UnityNet.reqWWW("allianceSetDiplomacies.php", new Hashtable {
                {"allianceSelected", ids_str},
                {"diplomacyStatus", status}
            }, okFunc, null);
        }
        
        
        //
        public void reqAllianceSetMembersPosition(int mid, int newType, Action<int> resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    Action<List<AllianceMemberVO>> updatePosition = delegate (List<AllianceMemberVO> list) {
                        for (int i =0; i<list.Count; i++) {
                            AllianceMemberVO member = list[i];
                            if (member.userId == mid) {
                                member.changePositionType(newType);
                                continue;
                            }
                            
                            if (member.positionType != newType)
                                continue;
                            
                            if (newType != Constant.Alliance.ViceChancellor && newType != Constant.Alliance.Member && newType != Constant.Alliance.Officer)
                                member.changePositionType(Constant.Alliance.Member);
                        }
                    };
                    updatePosition(_memberList);
                    updatePosition(_officers);
                    if (newType == Constant.Alliance.Chancellor)
                        myAlliance.userOfficerType = Constant.Alliance.Member;
                    
                    if (resultFunc != null)
                        resultFunc(newType);
                }
            };
            UnityNet.reqWWW("alliancePosition.php", new Hashtable {
                {"memberId", mid},
                {"newOfficerType", newType},
                {"mvp", 0}
            }, okFunc, null);
        }
        
        public void reqAllianceSetMVP(int mid, Action<int> resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"]) && resultFunc != null)
                    resultFunc(mid);
            };
            UnityNet.reqWWW("alliancePosition.php", new Hashtable {
                {"memberId", mid},
                {"newOfficerType", 0},
                {"mvp", 1}
            }, okFunc, null);
        }
        
        public void reqAllianceRemoveMember(int mid, int oldType, int newType, Action resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    if (resultFunc != null)
                        resultFunc();
                    //
                    if (this.myAlliance != null) {
                        this.myAlliance.membersCount--;
                        MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED, null);
                    }
                }
            };
            UnityNet.reqWWW("allianceRemoveMember.php", new Hashtable {
                {"memberId", mid},
                {"memberOfficerType", oldType},
                {"newOfficerType", newType}
            }, okFunc, null);
        }

        public void reqAllianceSendMessage(int toId, string tileIdstr, string subject, string message, string type, Action resultFunc) {
            Action<HashObject> okFunc = delegate (HashObject result) {
                if (_Global.GetBoolean(result["ok"])) {
                    if (resultFunc != null)
                        resultFunc();
                }
            };
            UnityNet.reqWWW("sendMessage.php", new Hashtable {
                {"toIds", toId},
                {"tileId", tileIdstr},
                {"message", message},
                {"subject", subject},
                {"type", type}
            }, okFunc, null);
        }
        
        public void reqAllianceHelp(int cityId, int dtype, int dstype, int did, int dlv, MulticastDelegate okFunc) {
            /*
            type:
                targetId 0-->buildingId;
                targetId 1-->researchId;
            */
            UnityNet.reqWWW("allianceHelp.php", new Hashtable {
                {"htype", "help"},
                {"cid", cityId},
                {"dtype", dtype},
                {"dstype", dstype},
                {"did", did},
                {"dlv", dlv}
            }, okFunc, null);
        }

        protected abstract void UpdateQueuesWithHelpData(string key, int cid, HashObject tData);

        public void updateAllianceHelpData(HashObject helpObj) {
            HashObject cityObj;
            string ckey;
            int cid;
            
            foreach (System.Collections.DictionaryEntry ci in helpObj.Table) {
                ckey = ci.Key as string;
                cityObj = ci.Value as HashObject;
                cid = _Global.INT32(ckey.Substring(4)); // cityxx
                string key;
                HashObject tData;
                
                foreach (System.Collections.DictionaryEntry i in cityObj.Table) {
                    key = i.Key as string;
                    tData = i.Value as HashObject;
                    
                    int idx = 0;
                    
                    while (tData[_Global.ap + idx] != null) {
                        idx++;
                    }
                    idx--;
                    tData = tData[_Global.ap + idx];
                    UpdateQueuesWithHelpData(key, cid, tData);
                }
                
            }
            MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_HELP_ARRIVED, null);
        }

        protected static string[] DIP = new string[] {
            "Neutral",
            "Friendly",
            "Hostile"
        };
        
        public static void SInit() {
            DIP[0] = Datas.getArString("Alliance.relationNeutral");
            DIP[1] = Datas.getArString("Alliance.relationFriendly");
            DIP[2] = Datas.getArString("Alliance.relationHostile");
            
            DipAllianceVO.SInit();
            //first time to get alliance info.
            //      Alliance.getInstance().reqAllianceInfo();
            
        }
        
        public static string getPositionStr(int index) {
            string rt = Datas.getArString("allianceTitle.title" + index);
            return rt;
        }

        public static string getDipStr(int dip) {
            return DIP[dip];
        }
    }
}