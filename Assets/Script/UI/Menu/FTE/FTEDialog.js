public class FTEDialog implements IEventHandler
{	
	protected var delegate:IEventHandler;
	
	protected var stepVO:StepVO;
	
	protected var prevStepView:FTEStepView;
	protected var nextStepView:FTEStepView;
	protected var rect:Rect;
	
	public var globalMask:boolean = false;
	protected var mask:SimpleLabel;
	
	public function Init(delegate:IEventHandler)
	{
		this.delegate = delegate;
		rect = new Rect(0,0,MenuMgr.SCREEN_WIDTH,MenuMgr.SCREEN_HEIGHT);
		
		mask = new SimpleLabel();
		mask.Sys_Constructor();
		if(mask.mystyle.normal.background == null)
		{
			mask.mystyle.normal.background = Resources.Load("Textures/UI/background/square_black");
		}
		//
	}
	public function clearStep():void
	{
		prevStepView = null;
		nextStepView = null;
	}
	private function clearPrevStep():void
	{
		prevStepView = null;
		//GCThread.getInstance().sendGCSign();
	}
	
	public function loadStep(step:int):StepVO
	{
		stepVO = new StepVO();
		var obj: Hashtable = FTEConstant.FTE_Steps();
		if(obj["step"+step] )
		{
			stepVO.mergeDataFrom( obj["step"+step] );
		}
		else
		{
			//debug feature
			ErrorMgr.instance().PushError("FTE"," STEP: " + step +" Missed!");
			return;
		}
		stepVO.setStep(step);		
		prevStepView = nextStepView;		
		nextStepView = StepViewFactory.getInstance().creatStepView(stepVO);
		nextStepView.Init(stepVO,this);
		
		startStep();
		
		return stepVO;
	}
	
	public function setNextButton(b:Object):void
	{
		if(nextStepView)
			nextStepView.setNextButton(b);
	}	
	
	public function hideStep():void
	{
		if(nextStepView) 
			nextStepView.hide();
	}
	
	public function showNext():void
	{
		if(nextStepView) 
			nextStepView.setGroupUIVisible(true);
	}
	
	protected function startStep():void
	{
		if(prevStepView) 
			prevStepView.startFadeOut();
		if(nextStepView)
			nextStepView.startFadeIn();
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			case FTEConstant.Action.FadeIn_End:
				break;
			case FTEConstant.Action.FadeOut_End:
					this.clearPrevStep();				
				break;
			default:
				this.delegate.handleItemAction(action,param);
		}
	
	}
	
	
	/************DRAW************/
	public function Draw()
	{
		GUI.BeginGroup(rect);
		if(globalMask)
			drawGlobalMask();
			
		if(prevStepView)
			prevStepView.Draw();
		if(nextStepView)
			nextStepView.Draw();
		
		GUI.EndGroup();
	}
	
	protected function drawGlobalMask():void
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 1);	
		mask.Draw();
		GUI.color = oldColor;
	}
	
	public function Update()
	{
		if(prevStepView)
			prevStepView.Update();
		if(nextStepView)
			nextStepView.Update();
	}
	
	public function FixedUpdate()
	{
		if(prevStepView)
			prevStepView.FixedUpdate();
		if(nextStepView)
			nextStepView.FixedUpdate();
	}
	
	

}


