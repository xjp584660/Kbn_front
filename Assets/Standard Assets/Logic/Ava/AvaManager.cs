public sealed partial class AvaManager
{
    private void CreateModules()
    {
        Player = new AvaPlayer(this);
        Alliance = new AvaAlliance(this);
        Inventory = new AvaInventory(this);
        Event = new AvaEvent(this);
        TileShare = new AvaTileShare(this);
        March = new AvaMarch(this);
        Seed = new AvaSeed(this);
        Units = new AvaUnits(this);
        RallyShare = new AvaRallyShare(this);
        PlayerSkill = new AvaPlayerSkill(this);
		Buff = new AvaBuff (this);
		SpeedUp = new AvaSpeedUp (this);
        AvaScoreStats = new AvaScoreStats(this);
		ActivityLog = new AvaActivityLog(this);
    }
	
    public AvaPlayer Player
    {
        get;
        private set;
    }

    public AvaAlliance Alliance
    {
        get;
        private set;
    }

    public AvaInventory Inventory
    {
        get;
        private set;
    }

    public AvaEvent Event
    {
        get;
        private set;
    }

    public AvaTileShare TileShare
    {
        get;
        private set;
    }

    public AvaMarch March
    {
        get;
        private set;
    }

    public AvaSeed Seed
    {
        get;
        private set;
    }

    public AvaUnits Units
    {
        get;
        private set;
    }
    
    public AvaRallyShare RallyShare
    {
        get;
        private set;
    }

    public AvaPlayerSkill PlayerSkill
    {
        get;
        private set;
    }

	public AvaBuff Buff
	{
		get;
		private set;
	}

	public AvaSpeedUp SpeedUp
	{
		get;
		private set;
	}

    public AvaScoreStats AvaScoreStats
    {
        get;
        private set;
    }

	public AvaActivityLog ActivityLog
	{
		get;
		private set;
	}

	public void OnLeaveAlliance()
	{
		Player.OnLeaveAlliance();
		Alliance.OnLeaveAlliance();
		KBN.UpdateSeed.singleton.update_seed_ajax();
	}
}
