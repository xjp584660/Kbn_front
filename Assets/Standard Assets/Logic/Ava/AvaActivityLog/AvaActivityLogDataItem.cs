using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaActivityLogDataItem : IComparable<AvaActivityLogDataItem> {

	public string RawData
	{
		get;
		private set;
	}

	public int Type
	{
		get;
		private set;
	}

	public int EventId
	{
		get;
		private set;
	}

	public int Timestamp
	{
		get;
		private set;
	}

	public string TimeString
	{
		get;
		private set;
	}

	public int TileXCoord
	{
		get;
		private set;
	}

	public int TileYCoord
	{
		get;
		private set;
	}

	public string ColoredString
	{
		get;
		private set;
	}

	public int sharePlayerId
	{
		get;
		private set;
	}

	public int reportId
	{
		get;
		private set;
	}

	class CombatPlayer : IEquatable<CombatPlayer>
	{
		private int serverId = -1;
		private int userId = -1;

		public CombatPlayer(int serverId, int userId)
		{
			this.userId = userId;
			this.serverId = serverId;
		}

		public bool Equals (CombatPlayer other)
		{
			return serverId.Equals(other.serverId) && userId.Equals(other.userId);
		}
	}

	private List<CombatPlayer> players = new List<CombatPlayer>();

	public AvaActivityLogDataItem(string data)
	{
		RawData = data;

		string[] arr = data.Split('#');
		if (arr.Length <= 3) {
			throw new System.Exception("Invalid Activit Log String");
		}

		Type = _Global.INT32(arr[0]);
		EventId = _Global.INT32(arr[1]);
		Timestamp = _Global.INT32(arr[2]);

		TileXCoord = 0;
		TileYCoord = 0;

		TimeString = _Global.HourTime24WithoutSecond(Timestamp);

		generateColoredString(arr);
	}

	private string username(string username, int userId, int worldId)
	{
		bool isMe = (userId == Datas.singleton.tvuid() && worldId == Datas.singleton.worldid());
		return isMe ? ("<color=#ffffff>" + username + "</color>") : username;
	}

	private void generateColoredString(string[] arr)
	{
		ColoredString = RawData;

		switch (Type)
		{
		// ======
		case Constant.AvaActivityLogType.LOG_TYPE_WINNING_POSITION_CHANGE:
		{
			if (arr.Length < 4)
				throw new System.Exception("Invalid Activit Log String");

			string allianceName = arr[3];
			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_AllianceTookLeadLog"), "<color=#ffffff>" + allianceName + "</color>");

			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_SUPERWONDER_CHANGE_HANDS:
		{
			if (arr.Length < 19)
				throw new System.Exception("Invalid Activit Log String");

			string allianceName = arr[3];
			sharePlayerId = _Global.INT32(arr[17]);
			reportId = _Global.INT32(arr[18]);
			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_AllianceTookGreatWonderLog"), "<color=#ffffff>" + allianceName + "</color>");

			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_START_RALLY:
		{
			if (arr.Length < 11)
				throw new System.Exception("Invalid Activit Log String");
			
			int userId = _Global.INT32(arr[4]);
			string userName = arr[5];
			int userServer = _Global.INT32(arr[6]);
			int tileType = _Global.INT32(arr[7]);
			int xcoord = _Global.INT32(arr[8]);
			int ycoord = _Global.INT32(arr[9]);
			int timeLeft = _Global.INT32(arr[10]);
			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_StartRallyAttackLog"),
			                              username(userName, userId, userServer),
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>",
			                              "<color=#ffffff>" + (timeLeft / 60) + "</color>");

			players.Add(new CombatPlayer(userServer, userId));

			TileXCoord = xcoord;
			TileYCoord = ycoord;
			
			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_ATTACK:
		{
			if (arr.Length < 19)
				throw new System.Exception("Invalid Activit Log String");
			
			int userId = _Global.INT32(arr[4]);
			string userName = arr[5];
			int userServer = _Global.INT32(arr[6]);
			int tileType = _Global.INT32(arr[7]);
			int xcoord = _Global.INT32(arr[8]);
			int ycoord = _Global.INT32(arr[9]);
			int result = _Global.INT32(arr[11]);
			int troopKilled = _Global.INT32(arr[12]);


			string[] list = arr[16].Split(',');
			sharePlayerId = _Global.INT32(arr[17]);
			
			reportId = _Global.INT32(arr[18]);
            _Global.LogWarning("reportId"+reportId);
			int myScore = -1;
			int myWorld = Datas.singleton.worldid();
			int myUserId = Datas.singleton.tvuid();

			players.Add(new CombatPlayer(userServer, userId));
			for (int i = 0; i < list.Length; i++) {
				string[] user = list[i].Split(':');
				int id = _Global.INT32(user[0]);
				if (id != userId)
					players.Add(new CombatPlayer(userServer, id));
				if (myWorld == userServer) 
				{
					if (myUserId == id)
						myScore = _Global.INT32(user[1]);
				}
			}

			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_AttackNoteLog"),
			                              username(userName, userId, userServer),
			                              Datas.getArString("AVA.WarRoom_Attack"),
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>",
			                              (result == 1 ? ("<color=#3D9A27>" + Datas.getArString("AVA.WarRoom_Won")) : ("<color=#D70015>" + Datas.getArString("AVA.WarRoom_Lost"))) + "</color>",
			                              troopKilled);

			if (myScore >= 0)
				ColoredString += string.Format(Datas.getArString("AVA.WarRoom_YouScored"), myScore);

			TileXCoord = xcoord;
			TileYCoord = ycoord;
			
			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_RALLYATTACK:
		{
			if (arr.Length < 19)
				throw new System.Exception("Invalid Activit Log String");
			
			int userId = _Global.INT32(arr[4]);
			string userName = arr[5];
			int userServer = _Global.INT32(arr[6]);
			int tileType = _Global.INT32(arr[7]);
			int xcoord = _Global.INT32(arr[8]);
			int ycoord = _Global.INT32(arr[9]);
			int result = _Global.INT32(arr[11]);
			int troopKilled = _Global.INT32(arr[12]);

			string[] list = arr[16].Split(',');
			
			int myScore = -1;
			int myWorld = Datas.singleton.worldid();
			int myUserId = Datas.singleton.tvuid();

			sharePlayerId = _Global.INT32(arr[17]);
			reportId = _Global.INT32(arr[18]);
			
			players.Add(new CombatPlayer(userServer, userId));
			for (int i = 0; i < list.Length; i++) {
				string[] user = list[i].Split(':');
				int id = _Global.INT32(user[0]);
				if (id != userId)
					players.Add(new CombatPlayer(userServer, id));
				if (myWorld == userServer) 
				{
					if (myUserId == id)
						myScore = _Global.INT32(user[1]);
				}
			}

			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_AttackNoteLog"),
			                              username(userName, userId, userServer),
			                              Datas.getArString("AVA.WarRoom_RallyAttack"),
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>",
			                              (result == 1 ? ("<color=#3D9A27>" + Datas.getArString("AVA.WarRoom_Won")) : ("<color=#D70015>" + Datas.getArString("AVA.WarRoom_Lost"))) + "</color>",
			                              troopKilled);

			if (myScore >= 0)
				ColoredString += string.Format(Datas.getArString("AVA.WarRoom_YouScored"), myScore);

			TileXCoord = xcoord;
			TileYCoord = ycoord;
			
			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_DEFENCE:
		{
			if (arr.Length < 17)
				throw new System.Exception("Invalid Activit Log String");
			
			int userId = _Global.INT32(arr[4]);
			string userName = arr[5];
			int userServer = _Global.INT32(arr[6]);
			int tileType = _Global.INT32(arr[7]);
			int xcoord = _Global.INT32(arr[8]);
			int ycoord = _Global.INT32(arr[9]);
			int result = _Global.INT32(arr[11]);
			int troopKilled = _Global.INT32(arr[12]);

			string[] list = arr[16].Split(',');
			
			int myScore = -1;
			int myWorld = Datas.singleton.worldid();
			int myUserId = Datas.singleton.tvuid();
			
			players.Add(new CombatPlayer(userServer, userId));
			for (int i = 0; i < list.Length; i++) {
				string[] user = list[i].Split(':');
				int id = _Global.INT32(user[0]);
				if (id != userId)
					players.Add(new CombatPlayer(userServer, id));
				if (myWorld == userServer) 
				{
					if (myUserId == id)
						myScore = _Global.INT32(user[1]);
				}
			}

			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_DefenceNoteLog"),
			                              username(userName, userId, userServer),
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>",
			                              (result == 1 ? ("<color=#3D9A27>" + Datas.getArString("AVA.WarRoom_Won")) : ("<color=#D70015>" + Datas.getArString("AVA.WarRoom_Lost"))) + "</color>",
			                              troopKilled);

			if (myScore >= 0)
				ColoredString += string.Format(Datas.getArString("AVA.WarRoom_YouScored"), myScore);

			TileXCoord = xcoord;
			TileYCoord = ycoord;
			
			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_JOIN_RALLYATTACK:
		{
			if (arr.Length < 16)
				throw new System.Exception("Invalid Activit Log String");
			
			int userId = _Global.INT32(arr[4]);
			string userName = arr[5];
			int userServer = _Global.INT32(arr[6]);
			int tileType = _Global.INT32(arr[7]);
			int xcoord = _Global.INT32(arr[8]);
			int ycoord = _Global.INT32(arr[9]);
			int user2Id = _Global.INT32(arr[13]);
			string user2Name = arr[14];
			int user2Server = _Global.INT32(arr[15]);

			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_JoinARallyAttackNoteLog"),
			                              username(userName, userId, userServer),
			                              username(user2Name, user2Id, user2Server),
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>");

			players.Add(new CombatPlayer(userServer, userId));
			players.Add(new CombatPlayer(user2Server, user2Id));

			TileXCoord = xcoord;
			TileYCoord = ycoord;
			
			break;
		}
		case Constant.AvaActivityLogType.LOG_TYPE_REINFOCE:
		{
			if (arr.Length < 16)
				throw new System.Exception("Invalid Activit Log String");
			
			int userId = _Global.INT32(arr[4]);
			string userName = arr[5];
			int userServer = _Global.INT32(arr[6]);
			int tileType = _Global.INT32(arr[7]);
			int xcoord = _Global.INT32(arr[8]);
			int ycoord = _Global.INT32(arr[9]);
			int user2Id = _Global.INT32(arr[13]);
			string user2Name = arr[14];
			int user2Server = _Global.INT32(arr[15]);
			
			ColoredString = string.Format(Datas.getArString("AVA.WarRoom_ReinforcementLog"),
			                              username(userName, userId, userServer),
			                              username(user2Name, user2Id, user2Server),
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>");
			
			players.Add(new CombatPlayer(userServer, userId));
			players.Add(new CombatPlayer(user2Server, user2Id));

			TileXCoord = xcoord;
			TileYCoord = ycoord;
			
			break;
		}
		// ======
		}
	}

	public bool ContainsPlayer(int serverId, int userId)
	{
		return players.Contains(new CombatPlayer(serverId, userId));
	}

	public int CompareTo(AvaActivityLogDataItem other)
	{
		return Timestamp.CompareTo(other.Timestamp);
	}
}
