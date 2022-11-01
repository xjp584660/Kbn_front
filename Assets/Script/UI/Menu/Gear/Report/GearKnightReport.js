

public class GearKnightReport extends TabContentUIObject
{
	public var selfview:KnightViewPort;
	public var enemyview:KnightViewPort;
	
	public function Init()
	{
		selfview.Init();
		enemyview.Init();
	}

	public function Update()
	{
		selfview.Update();
		enemyview.Update();
	}
	
	public function Draw()
	{
		selfview.Draw();
		enemyview.Draw();
	}
	
	
	public function OnPush(param:Object)
	{
		var selfKnight:Knight = GearReport.Instance().Self;
		var enemyKnight:Knight = GearReport.Instance().Enemy;
		if(selfKnight == null) return;
		if(enemyKnight == null) return;
		if(!enemyKnight.IsIDValid())	return;
	
	
		selfview.TheKnight = selfKnight;
		enemyview.TheKnight = enemyKnight;
	}
	public function OnPop()
	{
		
	}
	public function OnPopOver()
	{
		
	}

	public function OnSelect()
	{
		
	}
	
}