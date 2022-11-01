public class FTEStoryCardStepView extends FTEStepView
{
	
	protected var texture_bg1:SimpleTexture2D;
	protected var texture_bg2:EffectTexture2D;
	protected var texture_bg3:EffectTexture2D;
	
	protected var ftext_1: FTEStoryText;
	protected var ftext_2: FTEStoryText;
	
	protected var textRect:Rect;
	
	protected var endAction:String;	
	public function Init(stepVO:StepVO,delegate:IEventHandler):void
	{
		this.stepVO = stepVO;
		this.delegate = delegate;
		this.alpha = 1.0;
		textRect = new Rect();
		
		this.fadeOutEffect = stepVO.fadeOutEffect;
		fadeOutEffect.target = this;
		
		textRect.x = stepVO.getInt("textRect.x");				
		textRect.y = stepVO.getInt("textRect.y");
		textRect.width = stepVO.getInt("textRect.width");
		textRect.height = stepVO.getInt("textRect.height");		
				
		var ue:UIElement;
		var evo:ElementVO;
		
		belowMaskList = [];
		simpleUIList = [];
		nextGroupList = [];
		
		var tText:FTEStoryText;
		
		for(var i:int =0; i<stepVO.uiElements.length; i++)
		{
			evo = stepVO.uiElements[i];
			ue = ElementFactory.getInstance().creatElement(evo);
			if(!ue) 
				continue;	
			
			var btn:SimpleButton;
			
			btn = ue as SimpleButton;
			if(btn != null)
			{
				btn.OnClick = buttonHandler;
				simpleUIList.push(ue);
				
				if(btn.clickParam == FTEConstant.Action.SkipToEnd)
				{
					var isSkipFTE:boolean= GameMain.instance().isSkipFTE();
					if(isSkipFTE){
						btn.SetVisible(true);
					}else
						btn.SetVisible(KBN.FTEMgr.isUserDidSecondFTE());
				}
				continue;
			}
			
			switch(evo.type)
			{
				case FTEConstant.ElementType.ET_StoreText:
					belowMaskList.push(ue);
					tText = ue as FTEStoryText;
					tText.startEffect();				
					break;
				case FTEConstant.ElementType.ET_EffectTexture:
					(ue as EffectElement).startEffect();
				default:	
					simpleUIList.push(ue);
					break;
			}
		}
		this.setGroupUIVisible(false);
		status = ST_INITED;	
		timeFlag = 1;	
		
		endAction = FTEConstant.Action.Next;
		/////
	}
	
	protected function typeEndFunc():void
	{
		if(endAction != null) // no click SKIP
			startFadeOut();
	}
	
	public function startFadeOut():void
	{
		super.startFadeOut();
		delegate.handleItemAction(FTEConstant.Action.Show_GlobalMask,endAction == FTEConstant.Action.Next);
	}
	
	 
	protected function buttonHandler(clickParam:Object):void
	{
		if(status >= FTEStepView.ST_FADEOUT)	//fading out .no event enaber.
			return;	
			
		switch(clickParam)
		{
			case FTEConstant.Action.SkipToEnd:
				endAction = null;
				//break;
			default:
				if(delegate)
					delegate.handleItemAction(clickParam,StepVO);
				break;
		}
	}
	 
	
	public function Update():void
	{
		var ue:UIElement;
		for(ue in simpleUIList)		
			ue.Update();
		
		for(ue in belowMaskList)
			ue.Update();
			
		dtime += Time.deltaTime;
		etime += Time.deltaTime;
		
		switch(status)
		{
			case ST_FADEIN:
					fadeInStep(etime,stepVO.fadeInTime);
				break;
			case ST_FADEOUT:
					fix_fadeOutStep(etime,stepVO.fadeOutTime);
				break;
		}
		
		if(timeFlag == 1 && dtime > stepVO.time2Next)
		{
			timeFlag = 2;
			typeEndFunc();
		}
	}
		
	public function FixedUpdate():void
	{
		var ue:UIElement;
		for(ue in simpleUIList)		
			ue.FixedUpdate();
		
		for(ue in belowMaskList)
			ue.FixedUpdate();
		
		
	}
	
	protected function fix_fadeOutStep(cur:float,total:float):void
	{
		if(fadeOutEffect)
			fadeOutEffect.doEffect(cur,total);
		if(cur >= total)
			fix_fadeOutEnd();
	}
	
	protected function fix_fadeOutEnd():void
	{
		if(status != ST_FADEOUT)
			return;
		status = ST_FADEOUT_END;
//		delegate.handleItemAction(FTEConstant.Action.FadeOut_End,this);
		this.fadeOutEffect = null;
		stepVO.fadeOutTime = 0;
		
		delegate.handleItemAction(endAction,StepVO);
	}
	
	
	public function Draw()
	{
		var oldColor:Color = GUI.color;
		if(alpha < 1.0)		
			GUI.color = new Color(1,1,1,alpha);
			
		GUI.BeginGroup(rect);
		
		for(var i:int = 0; i< simpleUIList.length; i++)
		{
			(simpleUIList[i] as UIElement).Draw();
		}					
		
		for(var ue:UIElement in nextGroupList)
		{
			ue.Draw();
		}
			// TEXT...
			GUI.BeginGroup(textRect);
				for(var ue:UIElement in belowMaskList)
					ue.Draw();
			GUI.EndGroup();
			
		GUI.EndGroup();		
		
		GUI.color = oldColor;
	}
	
}
