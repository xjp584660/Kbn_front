using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using Random = UnityEngine.Random;
using Datas = KBN.Datas;

namespace KBN
{
    /// <summary>
    /// Message, for in-game emails and march reports.
    /// </summary>
    public abstract class Message
    {
        protected ReportViewingType reportViewingType;

        public ReportViewingType ReportViewingType
        {
            get
            {
                return reportViewingType;
            }

            set
            {
                if (!reportViewingStrategies.ContainsKey(value))
                {
                    throw new ArgumentOutOfRangeException("Undefined reportViewingStrategies key: " + (int)value);
                }

                reportViewingType = value;
                currentReportViewingStrategy = reportViewingStrategies[value];
            }
        }

        protected static Message g_instance;

        public static Message Instance
        {
            get
            {
                return g_instance;
            }
        }

        
        protected int tvuid
        {
            get
            {
                return Datas.singleton.tvuid();
            }
        }

        protected Dictionary<ReportViewingType, ReportViewingStrategy_Base> reportViewingStrategies;

        protected ReportViewingStrategy_Base currentReportViewingStrategy;

        protected MessageDAO dao;

        
        protected int inboxUnreadCount = 0;
        protected int reportUnreadCount = 0;
        protected int inobxCount = 0;
        protected int reportCount = 0;
        
        protected int pageSize = 10;
        protected bool downloadMessageDoing = false;
        protected bool downloadAvaReportsDoing = false;
        public int GetPageSize(){
            return pageSize;
        }
        protected Message()
        {
            reportViewingStrategies = new Dictionary<ReportViewingType, ReportViewingStrategy_Base>();
            reportViewingStrategies.Add(ReportViewingType.Default, new ReportViewingStrategy_Default());
            reportViewingStrategies.Add(ReportViewingType.Ava, new ReportViewingStrategy_Ava());

            ReportViewingType = ReportViewingType.Default;
        }

        public void Free()
        {
            dao = null;
        }

        public void SetMessageReady()
        {
            MessageDAO.SetMessageReady();
            dao.InitDb();
        }

		public bool CheckSqlVersion(){
			if(PlayerPrefs.HasKey("sqlVersion")){
				string version=PlayerPrefs.GetString("sqlVersion");
				if(version.Equals(_Global.sqlVersion)) return true;
			}
			return false;
		}

        public MessageDAO.PrizeItems GetPrizeInMail(int messageId, bool isSys)
        {
            return dao.GetPrizeInMail(messageId, isSys);
        }

        public void ClaimPrize(int messageId, bool isSys)
        {
            dao.ClaimPrize(messageId, isSys);
        }

        public List<MessageDAO.PrizeItems> GetAllUnClaimedPrizeInMails()
        {
            return dao.GetAllUnClaimedPrizeInMails();
        }

        public void SetReportRead(int reportId)
        {
            currentReportViewingStrategy.SetReportRead(dao, reportId);
        }

        public void DeleteAvaReportsExcludingEventId(int eventId)
        {
            dao.DeleteAvaReportsExcludingEventId(eventId);
        }

        public MessageStatistics MessageStatistics
        {
            get
            {
                try
                {
                    return dao.MessageStatistics;
                }
                catch(Exception error)
                {
                    OnDBSqliteException(error);
                    throw;
                }
            }
        }

        public int UnreadReportCount
        {
            get
            {
                return currentReportViewingStrategy.UnreadReportCount(MessageStatistics);
            }
        }

        public int AllReportCount
        {
            get
            {
                return currentReportViewingStrategy.AllReportCount(MessageStatistics);
            }
        }

        protected abstract bool OnDBSqliteException(Exception ex);

        // Moved and modified from UnityNet.js
        // TODO: Better this method when time permits.
        protected void RequestNormalMarchReports(string[] paramStrs,string expedition, MulticastDelegate okFunc, MulticastDelegate errorFunc)
        {
            var url = "getReport.php";
            var form = new WWWForm();

            form.AddField("maxMailId", "" + _Global.INT32(paramStrs[0]));
            if(paramStrs.Length > 2)
            {
                form.AddField("minMailId", "" + _Global.INT32(paramStrs[2]));
            }

            if(paramStrs.Length > 1 && paramStrs[1] != "-1")
            {
                form.AddField("group", "" + paramStrs[1]); //AllianceId
            }

            if (!string.IsNullOrEmpty(expedition)) {
                form.AddField("expedition", expedition);
            }

            UnityNet.DoRequest(url, form, okFunc, errorFunc);
        }

        public void DownloadAvaReports()
        {
            if (this.downloadAvaReportsDoing)
            {
                return;
            }

            this.downloadAvaReportsDoing = true;

            var paramDict = new Hashtable
            {
                { "ava", 1 },
                { "maxMailId", this.MessageStatistics.AvaReportMaxId },
            };

            UnityNet.reqWWW("getReport.php", paramDict, new Action<HashObject>(OnDownloadAvaReportsOK), new Action<string, string>(OnDownloadAvaReportsError));
        }

        protected HashObject InitMarchReportInternal(HashObject r)
        {
            var report = new HashObject(new Hashtable {
                { "subject", "" },
                { "date", _Global.DateTime(_Global.INT64(r["reportUnixTime"])) },
                { "date24", _Global.DateTime24(_Global.INT64(r["reportUnixTime"])) },
                { "viewStr", "View" },
                { "rid", Datas.getHashObjectValue(r,"marchReportId") },
                { "side", "" },
                { "tiletype", Datas.getHashObjectValue(r,"side0TileType") },
                { "tilelv", Datas.getHashObjectValue(r,"side0TileLevel") },
                { "defid", Datas.getHashObjectValue(r,"side0PlayerId") },
                { "defnm", "" },
                { "atknm", r["s1Name"] },
                { "messageRead", Datas.getHashObjectValue(r,"messageRead") },
                { "boxContent", r["boxContent"] },
                { "marchtype", Datas.getHashObjectValue(r,"marchType") },
                { "xcoord", Datas.getHashObjectValue(r,"side0XCoord") },
                { "ycoord", Datas.getHashObjectValue(r,"side0YCoord") },
                { "timestamp", Datas.getHashObjectValue(r,"reportUnixTime") },
                { "unread", Datas.getHashObjectValue(r,"reportStatus") },
                { "atkxcoord", Datas.getHashObjectValue(r,"side1XCoord") },
                { "atkycoord", Datas.getHashObjectValue(r,"side1YCoord") },
                { "reportsClass", "" }, //hasRead,
                { "atkCityId", Datas.getHashObjectValue(r,"side1CityId") },
                { "defCityId", Datas.getHashObjectValue(r,"side0CityId") },
                { "isWin", "" },
                { "side0LevelName", Datas.getHashObjectValue(r,"side0LevelName") },
				{ "heroCarmotSpeed", "" },

                { "new_defIcon", r["new_defIcon"] },   //新加防守方玩家icon
                { "new_atfIcon", r["new_atfIcon"] },   //新加进攻方玩家icon
                { "new_defAvatarFrame", r["new_defAvatarFrame"] },
                { "new_atfAvatarFrame", r["new_atfAvatarFrame"] }, 
            });

#if DEBUG_AVA_EMAIL
            var boxContent = report["boxContent"];
            var atks = boxContent["atks"] = new HashObject();
            for (int i = 0; i < Random.Range(5, 10); ++i)
            {
                var atk = atks[_Global.ap + i.ToString()] = new HashObject();
                atk["playerName"] = new HashObject("My Player Name" + i.ToString());
                atk["xCoord"] = new HashObject(i + 1);
                atk["yCoord"] = new HashObject(i + 2);

                var heros = atk["heros"] = new HashObject();
                for (int j = 0; j < Random.Range(0, 10); ++j)
                {
                    heros[(j + 201).ToString()] = new HashObject(new Hashtable
                    {
                        { "NAME", "Hero name " + j },
                        { "levelInfo", new Hashtable
                            {
                                { "ATTACK", 100 },
                                { "LIFE", j + 100 },
                                { "WISE", i + j + 100 },
                            }
                        },
                    });
                }

                var fght = atk["fght"] = new HashObject();
                for (int j = 0; j < Random.Range(1, 10); ++j)
                {
                    fght["u" + (j + 1).ToString()] = new HashObject(new Hashtable
                    {
                        { "a0", 320 },
                        { "a1", 100 },
                        { "a2", 320 },
                        { "a3", 10 },
                        { "a4", 10 },
                    });
                }
            }
#endif
            return report;
        }

        protected void OnDownloadAvaReportsOK(HashObject rawData)
        {
            var playerNames = rawData["arPlayerNames"];
            var alcNames = rawData["arAllianceNames"];
            var cityNames = rawData["arCityNames"];
            var frameNames = rawData["arAvatarFrame"];

            var messages = GetMessageList(rawData, playerNames, alcNames, cityNames, frameNames, ReportViewingType.Ava);
            try
            {
                dao.InsertAvaReportMessage(messages.ToArray()); 
            }
            catch (Exception error)
            {
                if (!OnDBSqliteException(error))
                    throw;
                return;
            }
            finally
            {
                downloadAvaReportsDoing = false;
            }
        }

        protected List<object> GetMessageList(HashObject rawData, HashObject playerNames, HashObject alcNames, HashObject cityNames, HashObject frameNames)
        {
            return GetMessageList(rawData, playerNames, alcNames, cityNames, frameNames, ReportViewingType.Default);
        }

        protected List<object> GetMessageList(HashObject rawData, HashObject playerNames, HashObject alcNames, HashObject cityNames, HashObject frameNames, ReportViewingType viewType)
        {
            var ret = new List<object>();

            foreach (DictionaryEntry i in rawData["arReports"].Table)
            {
                var message = i.Value as HashObject;
                
                if (message["side0AllianceId"] != null && _Global.INT32(message["side0AllianceId"].Value) > 0 && message["s0AlcName"] == null)
                {
                    var s0AlcName = alcNames["a" + message["side0AllianceId"].Value];
                    if (s0AlcName == null)
                    {
                        s0AlcName = new HashObject("");
                    }
                    message["s0AlcName"] = s0AlcName;
                }

                if (message["side1AllianceId"] != null && _Global.INT32(message["side1AllianceId"].Value) > 0 && message["s1AlcName"] == null)
                {
                    var s1AlcName = alcNames["a" + message["side1AllianceId"].Value];
                    if (s1AlcName == null)
                    {
                        s1AlcName = new HashObject("");
                    }
                    message["s1AlcName"] = s1AlcName;
                }

                if (message["side0PlayerId"] != null && _Global.INT32(message["side0PlayerId"].Value) > 0 && message["s0Name"] == null)
                {
                    message["s0Name"] = playerNames["p" + message["side0PlayerId"].Value];
                    if (message["s0Name"] == null)
                    {
                        message["s0Name"] = new HashObject(string.Empty);
                    }
                }

                if (message["side1PlayerId"] != null && _Global.INT32(message["side1PlayerId"].Value) > 0 && message["s1Name"] == null)
                {
                    message["s1Name"] = playerNames["p" + message["side1PlayerId"].Value];
                    if (message["s1Name"] == null)
                    {
                        message["s1Name"] = new HashObject(string.Empty);
                    }
                }

                if (message["side1PlayerId"] != null && _Global.INT32(message["side1PlayerId"].Value) > 0 && message["new_atfIcon"] == null)
                {
                    message["new_atfIcon"] = playerNames["a" + message["side1PlayerId"].Value];
                    if (message["new_atfIcon"] == null)
                    {
                        message["new_atfIcon"] = new HashObject("oldEmail");
                    }
                    message["new_atfAvatarFrame"] = frameNames["" + message["side1PlayerId"].Value];
                    if(message["new_atfAvatarFrame"] == null)
                    {
                        message["new_atfAvatarFrame"] = new HashObject("img0");
                    }
                }

                if (message["side1PlayerId"] != null && _Global.INT32(message["side1PlayerId"].Value) > 0 && message["new_defIcon"] == null)
                {
                    message["new_defIcon"] = playerNames["a" + message["side0PlayerId"].Value];
                    if (message["new_defIcon"] == null)
                    {
                        message["new_defIcon"] = new HashObject("oldEmail");
                    }
                    message["new_defAvatarFrame"] = frameNames["" + message["side0PlayerId"].Value];
                    if(message["new_defAvatarFrame"] == null)
                    {
                        message["new_defAvatarFrame"] = new HashObject("img0");
                    }
                }
                
                if (message["side0CityId"] != null && _Global.INT32(message["side0CityId"]) > 0 && message["s0CityName"] == null)
                {
                    var cityName = cityNames["c" + message["side0CityId"].Value];
                    if (cityName != null)
                    {
                        message["s0CityName"] = cityName;
                    }
                }

                if (message["side1CityId"] != null && _Global.INT32(message["side1CityId"].Value) > 0 && message["s1CityName"] == null)
                {
                    var cityName = cityNames["c" + message["side1CityId"].Value];
                    if (cityName != null)
                    {
                        message["s1CityName"] = cityName;
                    }
                }
                
                if (message["marchType"] != null)
                {
                    if (viewType == ReportViewingType.Default && _Global.INT32(message["marchType"].Value) == Constant.MarchType.ALLIANCEBOSS)
                    {
                        MenuMgr.instance.sendNotification(Constant.Notice.ALLIANCE_BOSS_REPORT, null);
                    }
                }

                var boxContent = message["boxContent"];
                if (boxContent != null)
                {
                    var atks = boxContent["atks"];
                    var keys = _Global.GetObjectKeys(atks);
                    foreach (var key in keys)
                    {
                        var atk = atks[key];
                        var playerId = _Global.INT32(atk["playerId"]);
                        if (playerId > 0)
                        {
                            var attackerName = playerNames["p" + playerId.ToString()];
                            if (atk["playerName"] == null)
                            {
                                atk["playerName"] = (attackerName == null ? new HashObject("") : attackerName);
                            }
                        }
                    }
                }
                
                ret.Add(message);
            }

            return ret;
        }

        protected void OnDownloadAvaReportsError(string errMsg, string errCode)
        {
            this.downloadAvaReportsDoing = false;
        }

        public bool IsSuccessReport(HashObject header, HashObject data)
        {
            return currentReportViewingStrategy.IsSuccessReport(header, data);
        }

        public string GetAttackReportType(HashObject header, HashObject data)
        {
            return currentReportViewingStrategy.GetAttackReportType(header, data);
        }

        public void GoToMapFromReport(int x, int y)
        {
            currentReportViewingStrategy.GoToMapFromReport(x, y);
        }

        protected int CalcPlayerSide(int defenderPlayerId, int defenderWorldId)
        {
            if (defenderPlayerId != this.tvuid)
            {
                return 1; // Player is attacker
            }

            if (defenderWorldId > 0 && defenderWorldId != KBN.Datas.singleton.worldid())
            {
                return 1; // Player is attacker
            }

            return 0; // Player is defender
        }
    }
}
