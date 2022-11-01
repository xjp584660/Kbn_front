class BoxAnimation extends UIObject
{	
	public var boxClosed:Label;
	public var boxOpened:Label;
	public var boxFlash:Label;
	public var description:Label;
	
	private var eventHandler:IEventHandler;

	public var originalBoxX:int = 0;
	public var originalBoxY:int = 0;
	public var originalBoxW:int = 0;
	public var originalBoxH:int = 0;	

	public var newBoxX:int = 0;
	public var newBoxY:int = 0;
	public var newBoxW:int = 0;
	public var newBoxH:int = 0;	
	
	public var expandBoxX:int = 0;
	public var expandBoxY:int = 0;
	public var expandBoxW:int = 0;
	public var expandBoxH:int = 0; 
	
	private var duration:float = 1.0;
	private var frameNum:int = 5; 
	private var frameTime:float = 0;
	private var distanceX:float = 0;
	private var distanceY:float = 0;
	private var distanceW:float = 0;
	private var distanceH:float = 0;

	private var distanceEX:float = 0;
	private var distanceEY:float = 0;
	private var distanceEW:float = 0;
	private var distanceEH:float = 0;		
	
	private var isPlay:boolean = false;
	private var isExpand:boolean = false;
	private var alphaNum:float = 1;
	private var alphaEnd:float = 0.2;
	
	private var counter:int = 0;
	private var timer:float = 0;
	
	public function Init(_delegate:IEventHandler):void
	{
		boxClosed.Init();
		boxOpened.Init();
		boxFlash.Init();
		description.Init();
		
		eventHandler = _delegate;
	}
	
	public function resetState():void
	{
		frameTime = duration / frameNum;
		
		distanceX = (originalBoxX - newBoxX) / frameNum;
		distanceY = (originalBoxY - newBoxY) / frameNum;
		distanceW = (originalBoxW - newBoxW) / frameNum;
		distanceH = (originalBoxH - newBoxH) / frameNum;
		
		distanceEX = (newBoxX - expandBoxX) / frameNum;
		distanceEY = (newBoxY - expandBoxY) / frameNum;
		distanceEW = (newBoxW - expandBoxW) / frameNum;
		distanceEH = (newBoxH - expandBoxH) / frameNum;
	
		boxClosed.rect = new Rect(originalBoxX, originalBoxY, originalBoxW, originalBoxH);
		boxOpened.rect = new Rect(newBoxX, newBoxY, newBoxW, newBoxH);
		
		isPlay = false;
		isExpand = false;
		counter = 0;
		
		boxOpened.SetVisible(false);
		boxFlash.SetVisible(false);
		
		description.txt = Datas.getArString("Common.HaHa");
	}

	public function playAnimation():void
	{
		isPlay = true;
	}
	
	private function useStake():void
	{
		boxFlash.SetVisible(true);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		boxClosed.Draw();
		boxOpened.Draw();
		boxFlash.Draw();
		description.Draw();	
		GUI.EndGroup();	
	}
	
	function Update():void
	{	
		if(isPlay)
		{
			timer += Time.deltaTime;
			
			if(timer >= frameTime)
			{
				counter++;
			
				if(isExpand)
				{
					if(counter > frameNum)
					{
						boxOpened.rect = new Rect(originalBoxX, originalBoxY, originalBoxW, originalBoxH);
						isPlay = false;
						
						description.txt = Datas.getArString("Common.Heihei");
						
						eventHandler.handleItemAction(TreasurePopmenu.BOX_ANIMATION_FINISH, null);
					}
					else
					{
						boxOpened.rect = new Rect(newBoxX + counter * distanceEX, 
												  newBoxY + counter * distanceEY, 
												  newBoxW + counter * distanceEW, 
												  newBoxH + counter * distanceEH);					
					}
				}
				else
				{
					if(counter > frameNum)
					{
						boxOpened.SetVisible(true);
						boxClosed.SetVisible(false);
						counter = 0;
						isExpand = true;
					}
					else
					{
						boxClosed.rect  = new Rect(originalBoxX + counter * distanceX,
												   originalBoxY + counter * distanceY,
												   originalBoxW + counter * distanceW,
												   originalBoxH + counter * distanceH);
					}
				}
				
				timer = 0;
			}
		}
	}
}