using GameMain = KBN.GameMain;

public enum QueueType{
	BuildingQueue,
	ResearchQueue,
	TrainningQueue,
	MarchQueue,
	ScoutQueue,
	WildernessQueue,
	
	WallTrainingQueue,
	HealQueue,
	Hero,
    SelectiveDefense,
	TechnologyQueue,
};

public class QueueItem : BaseVO
{
	public  int id;
	public	int	itemType;	//
	public  string itemName;	//
	public 	int cityId;
	public	long	startTime;
	public	long	endTime;
	public	long	needed;
	public	long	timeRemaining;
	public  QueueType classType;
	public	int	level;
	public  string titleStr;
	
	public bool showSpeedUp = true;
	public bool showTime = true;
	public bool showExtraButton = false;
	
	public string btnStr	=null;	//default will show 'speed up'
	public string btnAction	=null;  //default will popup speedup menu.
	
	public string extraBtnStr	=null;	//extraButton will show 'SURVEY'
	public string extraBtnAction	=null;  //extraButton will popup SURVEY menu.	
	
	public int help_cur;
	public int help_max;
	
	public bool helpNeedCheck = true;
	public string customKey = "";
	
	protected long last_help_time = 0;
	protected bool help_tick = false;	// true:waiting for next help
	
	public bool canUseHelp()
	{
		return help_max > 0 && help_cur < help_max && !help_tick;
	}
	public void helpSended()
	{
		last_help_time = GameMain.unixtime();
		help_tick = true;
	}
	
	public virtual void calcRemainingTime()
	{
		this.timeRemaining =  endTime - GameMain.unixtime();	
		this.needed = this.endTime - this.startTime;	
		
		if(help_tick  && GameMain.unixtime() - last_help_time > 60)	// 60 seconds
		{
			helpNeedCheck = true;
			help_tick = false;
		}
		
	}
	
	public virtual void speed2EndTime(long neweta)
	{
		long speeded = endTime - neweta;
		endTime = neweta;
		startTime -= speeded;
		
	}
	
	public virtual bool willBeRemoveFromBar
	{
		get
		{
			return timeRemaining <= 0;
		}
	}
}

