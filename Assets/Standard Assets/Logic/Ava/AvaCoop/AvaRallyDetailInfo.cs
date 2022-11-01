using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;

public class AvaRallyDetailInfo
{
    public enum PlayerRole
    {
        Starter = 1,
        Supporter = 2,
    }

    public class Player
    {
        public class Unit
        {
            public int Id { get; set; }
            public int Count { get; set; }
            
            public Unit(PBMsgAVAMarchList.PBMsgAVAMarchList.Unit rawData)
            {
                Id = rawData.unitId;
                Count = rawData.count;
            }
        }

        public class Hero
        {
            public int Id { get; set; }
            public int TypeId { get; set; }
            public int Level { get; set; }

            public Hero(PBMsgAVAMarchList.PBMsgAVAMarchList.HeroInfo rawData)
            {
                Id = rawData.heroId;
                TypeId = rawData.heroTypeId;
                Level = rawData.level;
            }
        }

        public AvaRallyDetailInfo RallyAttack { get; set; }
        public PlayerRole Role { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public long TroopCount { get; private set; }
        public string GeneralName { get; set; }
        public int GeneralCityOrder { get; set; }
        public List<Unit> Units { get; private set; }
        public List<Hero> Heros { get; private set; }

        /// <summary>
        /// if the current player is a supporter, this property represents when he will arrive at the starter's tile.
        /// </summary>
        public long ArrivalTime { get; set; }

        /// <summary>
        /// if the current player is a supporter, this property represents the march id of the supporting (rally reinforce).
        /// </summary>
        public int MarchId { get; set; }

        public bool HasArrived
        {
            get
            {
                return ArrivalTime < GameMain.unixtime();
            }
        }

        public Player(PBMsgAVAMarchList.PBMsgAVAMarchList.RallyPlayerInfo rawData, AvaRallyDetailInfo rallyAttack)
        {
            PlayerId = rawData.playerId;
            PlayerName = rawData.playerName;
            Role = (PlayerRole)rawData.role;
            TroopCount = AvaRallyAttack.CalcPlayerTroopCount(rawData);

            GeneralName = rawData.knightName;
            GeneralCityOrder = rawData.knightCityOrder;

            RallyAttack = rallyAttack;

            ArrivalTime = (long)rawData.arrivalTime;

            Units = new List<Unit>();
            foreach (var unit in rawData.unitlist)
            {
                Units.Add(new Unit(unit));
            }

            Heros = new List<Hero>();
            foreach (var hero in rawData.herolist)
            {
                Heros.Add(new Hero(hero));
            }

            if (Role == PlayerRole.Supporter)
            {
                MarchId = rawData.marchId;
            }
        }
    }

    public int Id { get; set; }
    public int StarterPlayerId { get; set; }
    public string StarterPlayerName { get; set; }

    public int MaxMarchSlotCnt { get; set; }
    public int CurMarchSlotCnt { get; set; }

    /// <summary>
    /// Gets or sets the starting time of this rally attack.
    /// </summary>
    /// <value>The starting time.</value>
    public long StartingTime { get; set; }

    /// <summary>
    /// Gets or sets the leaving time of all the participants of this rally attack.
    /// </summary>
    /// <value>The leaving time.</value>
    public long LeavingTime { get; set; }

    /// <summary>
    /// Gets or sets the battle time of this rally attack, when all the troops arrive at the target tile.
    /// </summary>
    /// <value>The battle time.</value>
    public long BattleTime { get; set; }
    public string TargetTileTypeName { get; set; }
    public int TargetCoordX { get; set; }
    public int TargetCoordY { get; set; }
    public int StarterCoordX { get; set; }
    public int StarterCoordY { get; set; }

    public long WaitingDuration
    {
        get
        {
            return LeavingTime - StartingTime;
        }
    }

    public long OrigMarchDuration { get; private set; }

    public List<Player> Players { get; private set; }

    public int Count
    {
        get
        {
            return Players.Count;
        }
    }

    public Player this[int index]
    {
        get
        {
            return Players[index];
        }
    }

    public bool IsStartedByMe
    {
        get
        {
            return StarterPlayerId == Datas.singleton.tvuid();
        }
    }

    public bool IsSupportedByMe
    {
        get
        {
            if (this.Count < 2)
            {
                return false;
            }

            return Players[1].PlayerId == Datas.singleton.tvuid();
        }
    }

    public bool HasLeft
    {
        get
        {
            return GameMain.unixtime() > this.LeavingTime;
        }
    }

    public AvaRallyDetailInfo(AvaRallyAttack rawData)
    {
        var marchData = rawData.MarchData;
        
        Id = marchData.marchId;
        StarterPlayerId = marchData.fromPlayerId;
        StarterPlayerName = marchData.fromPlayerName;

        var rallyData = marchData.rallyAttackInfo;
        var rallyPlayers = rallyData.rallyPlayerList;

        MaxMarchSlotCnt = rallyData.rallyNumber;
        CurMarchSlotCnt = rallyPlayers.Count;

        LeavingTime = (long)(rallyData.leaveTime);
        StartingTime = (long)(marchData.marchTimestamp);
        BattleTime = (long)(marchData.destinationEta);
        OrigMarchDuration = (long)(marchData.oneWaySecond);

        TargetTileTypeName = Datas.getArString(AvaUtility.GetTileNameKey(marchData.toTileType));
        TargetCoordX = marchData.toXCoord;
        TargetCoordY = marchData.toYCoord;
        StarterCoordX = marchData.fromXCoord;
        StarterCoordY = marchData.fromYCoord;

        Players = new List<Player>();

        foreach (var rawPlayer in rallyPlayers)
        {
            Players.Add(new Player(rawPlayer, this));
        }
        SortPlayers();
        LimitDisplayCount();
    }

    private void SortPlayers()
    {
        if (this.IsStartedByMe)
        {
            return;
        }

        Player me = null;
        int myId = Datas.singleton.tvuid();
        for (int i = 2; i < Players.Count; ++i)
        {
            if (Players[i].PlayerId == myId)
            {
                me = Players[i];
                break;
            }
        }

        if (me != null)
        {
            Players.Remove(me);
            Players.Insert(1, me);
        }
    }

    private void LimitDisplayCount()
    {
        var displayLimit = GameMain.Ava.Seed.RallyDetailDisplayLimit;
        if (Players.Count > displayLimit)
        {
            Players.RemoveRange(displayLimit, Players.Count - displayLimit);
        }
    }
}
