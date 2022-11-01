public class FTEStepView extends UIElement
{	
	protected var stepVO:StepVO;
	protected var delegate:IEventHandler;
	
	protected var belowMaskList:Array;
	protected var simpleUIList:Array;
	protected var nextGroupList:Array;
//	public var mask:SimpleLabel;
	public var mask:FTEMask;
	protected var timeFlag:int = 0;	// 0:no time 1:startTime 2:time delay tick.
	protected var dtime:float = 0;
	protected var etime:float = 0;	// for effect.	
	protected var status:int = 0;
	protected var npcNextButton:FTEActionButton;
	protected var actionButton:FTEActionButton;
	protected var typingText:TypingText;
	protected var npcView  :NPCView;
	
	protected var light:FTELight;
	protected var fend:FTEEndView;
	
	public var fadeInEffect:Effect;
	public var fadeOutEffect:Effect;
	
	
	public static var ST_INITED:int = 0;
	public static var ST_FADEIN:int = 1;
	public static var ST_FADEIN_END:int = 2;
	public static var ST_FADEOUT:int =3;
	public static var ST_FADEOUT_END:int = 4;
	
	public function Init(stepVO:StepVO,delegate:IEventHandler):void
	{
		this.stepVO = stepVO;
		this.delegate = delegate;
		//InitUI.
		
			
		mask = new FTEMask();
		if(!stepVO.showMask)
			stepVO.maskAlpha = 0;
			
//		if(stepVO.showMask)
//			mask.startFadeInToAlpha(stepVO.maskAlpha);
//		else
//			mask.startFadeInToAlpha(0);
			
		mask.Sys_Constructor();
		
		belowMaskList = [];
		simpleUIList = [];
		nextGroupList = [];
		var ue:UIElement;
		var evo:ElementVO;
		var hideActionButton:boolean = false;
		var cx:float;
		var by:float;
		var v2:Vector2;
		for(var i:int =0; i<stepVO.uiElements.length; i++)
		{
			evo = stepVO.uiElements[i];
			ue = ElementFactory.getInstance().creatElement(evo);
			if(!ue) 
				continue;
			if(mask)
				mask.stepStr = "" + stepVO.curStep;
			
			switch(evo.type)
			{
				case FTEConstant.ElementType.ET_BlueNext:
					
				case FTEConstant.ElementType.ET_Button:
					ue.OnClick = buttonHandler;
					//DEBUG Feature..
//					(ue as SimpleButton).txt = (ue as SimpleButton).txt  + stepVO.curStep;
					if(evo.action == FTEConstant.Action.SkipToEnd)
					{
						var isSkipFTE:boolean= GameMain.instance().isSkipFTE();
						if(isSkipFTE){
							ue.SetVisible(true);
						}else
							ue.SetVisible(KBN.FTEMgr.isUserDidSecondFTE());
					}
					if(evo.action == FTEConstant.Action.Next)
					{
						actionButton = ue;						
					}
					if(evo.group == "npc")
						npcNextButton = ue;
					
					break;
				case FTEConstant.ElementType.ET_TypingText:						
				case FTEConstant.ElementType.ET_FloatText:					
					(ue as TypingText).typeEndFunc = typeEndFunc;
					hideActionButton = true;
					typingText = ue as TypingText;
										
					break;
					
				case FTEConstant.ElementType.ET_Hand:											
						break;
						
				case FTEConstant.ElementType.ET_Light:
						light = ue as FTELight;						
					break;
				case FTEConstant.ElementType.ET_END:					
					fend = ue as FTEEndView;
					fend.endedFunc = endFTE;
					
					break;
				case FTEConstant.ElementType.ET_NpcView:
						npcView = ue as NPCView;						
					break;
			}
			// embed to NPCView.
			if(ue == typingText || ue == npcNextButton )
				continue;

			if ( evo.group == "direct" )
			{
				ue.SetVisible(true);
				evo.group = "next";
			}

			if(evo.group == "next")
				nextGroupList.push(ue);

			if(evo.belowMask)
				belowMaskList.push(ue);
			else
				simpleUIList.push(ue);
		} // end For ..
		//npc
		
		if(light && actionButton)
			light.aroundRect(actionButton.rect, actionButton.RectGen);
		
		if(npcView && typingText)
		{
			npcView.setTypingText(typingText);
			npcView.typeEndFunc = typeEndFunc;
		}
		
		this.setGroupUIVisible(!hideActionButton && stepVO.showNext);
		
		if(stepVO.time2Next > 0)
		{
			timeFlag = 1;			
		}
		else
		if(npcView)		
		{
			if(npcNextButton)
				npcView.setNextButton(npcNextButton);
				
			if(!actionButton)
			{			
				actionButton = npcView.nextButton; 			 
				actionButton.clickParam = FTEConstant.Action.Next;
				actionButton.OnClick = buttonHandler;
			}
		}
		
		this.fadeInEffect = stepVO.fadeInEffect;
		this.fadeOutEffect = stepVO.fadeOutEffect;
		
		if(this.fadeInEffect)
			fadeInEffect.target = this;
		if(this.fadeOutEffect)
			fadeOutEffect.target = this;
		
		status = ST_INITED;		
		dtime = 0;
	}
	
	public function setNextButton(b:Object):void
	{
		//..improvemetns..			
	}
	
	public function setGroupUIVisible(b:boolean)
	{	
		var ue:UIElement;
		for(ue in nextGroupList)
			ue.SetVisible(b);
			
		if(b)
			this.focusCameraRect();
				
		if(b && mask && light && npcView && actionButton != npcView.nextButton)
		{
//			mask.drillRect(light.holeRect);
			mask.startFadeOut();
		}	
	}
	
	protected function focusCameraRect():void
	{
		var cx:float;
		var by:float;
		var v2:Vector2;
		var i:int;
		var ue:UIElement;
		
			
		if(stepVO.focusCamera && (KBN.FTEMgr.isPAD || (RuntimePlatform.Android == Application.platform)))
		{
			v2 = GameMain.instance().getSlotScreenPos(stepVO.focusSlotId);
			cx = v2.x  ;
			by = Screen.height - v2.y;
			
			cx = cx / Screen.width * MenuMgr.SCREEN_WIDTH;
			by = by / Screen.height * MenuMgr.SCREEN_HEIGHT;
			
			for(ue in nextGroupList)
				ue.focusCamera(cx,by);		
		}
		
		if(light && actionButton)
			light.aroundRect(actionButton.rect, actionButton.RectGen);
	}
	
	protected function typeEndFunc(tt:TypingText):void
	{
		if(stepVO.showNext)
			this.setGroupUIVisible(true);
		
	}
	protected function buttonHandler(clickParam:Object):void
	{
		if(delegate)
			delegate.handleItemAction(clickParam,StepVO);
	}
	protected function endFTE():void
	{
		if(delegate)
			delegate.handleItemAction("end",StepVO);
	}
	protected function time2Next():void
	{
		if(delegate)
			delegate.handleItemAction("next",StepVO);
	}
	protected function touch2Next():void
	{
		if(delegate)
			delegate.handleItemAction("next",StepVO);
	}
	/***************/
	public function Draw()
	{
		if(!visible)
			return;
			
		var oldColor:Color = GUI.color;
		if(alpha < 1.0)		
			GUI.color = new Color(1,1,1,alpha);
			
		GUI.BeginGroup(rect);
			DrawBelowMask();
			DrawMask();
			DrawContent();		
		GUI.EndGroup();
		
		GUI.color = oldColor;
		
	}
	
	public function FixedUpdate()
	{
		dtime += Time.fixedDeltaTime;
		etime += Time.fixedDeltaTime;
		
		if(timeFlag == 1 && dtime >= stepVO.time2Next)
		{
			timeFlag = 2;
			time2Next();
		}		
		
		switch(status)
		{
			case ST_FADEIN:
					fadeInStep(etime,stepVO.fadeInTime);
				break;
			case ST_FADEOUT:
					fadeOutStep(etime,stepVO.fadeOutTime);
				break;
		}
		
		for(var i:int = 0; i< simpleUIList.length; i++)
		{
			(simpleUIList[i] as UIElement).FixedUpdate();
		}
		
		if(mask)
			mask.FixedUpdate();
	}
	
	protected var uframe:int = 0;
	public function Update()
	{
		for(var i:int = 0; i< simpleUIList.length; i++)
		{
			(simpleUIList[i] as UIElement).Update();
		}		
		if(status == ST_FADEIN_END)
			checkTouch();
	}
	protected function DrawBelowMask():void
	{
		if(!belowMaskList)
			return;			
		for(var i:int = 0; i< belowMaskList.length; i++)
		{
			(belowMaskList[i] as UIElement).Draw();
		}
	}
	protected function DrawContent():void
	{
		if(!simpleUIList)
			return;			
		for(var i:int = 0; i< simpleUIList.length; i++)
		{
			(simpleUIList[i] as UIElement).Draw();
		}		
	}
	
	protected var m_bTouch:boolean;
	protected function isTouched():boolean
	{
		var clicked:boolean = false;
		if((Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android) )
		{
			 if(Input.touchCount > 0 )
			 {
			 	var touch:Touch = Input.touches[0];
			 	
			 	if (touch.phase == TouchPhase.Began)
				{
					m_bTouch = true;
				}
				else if (touch.phase == TouchPhase.Canceled)
				{
					m_bTouch = false;
				}
				else if (touch.phase == TouchPhase.Moved)
				{												
					m_bTouch = false;
				}
				else if (touch.phase == TouchPhase.Ended)
				{
					clicked = m_bTouch;
					m_bTouch = false;
				}
			 	
			 }
		}
		else
			if( Input.GetMouseButtonDown(0) )
				clicked = true;
		return clicked;
	}
	protected function checkTouch():void
	{
		if( (typingText && typingText.canEndType) || (stepVO && stepVO.touchNext) )
		{
			var clicked:boolean = isTouched();
			
			
			if(!clicked )
				return;
			
			if(typingText && typingText.canEndType)
				typingText.endTyping();							
			else
				touch2Next();
			
		}
	
	}
	protected function DrawMask():void
	{
		if(!mask)
			return;			
		mask.Draw();	
	}
	
	public function hide():void
	{
		//_Global.Log("FTE HIDE");
		simpleUIList = [];
		if(mask)
			mask.startFadeOut();
	}
	
	public function startFadeIn():void
	{
		status = ST_FADEIN;
		etime = 0;		
		if(mask)
			mask.startFadeInToAlpha(stepVO.maskAlpha);
			
		fadeInStep(0,stepVO.fadeInTime);
	}
	
	public function startFadeOut():void
	{
		if(status != ST_FADEIN_END)
			return;			
		status = ST_FADEOUT;
		etime = 0;
		fadeOutStep(0,stepVO.fadeOutTime);
	}
	/********/
	protected function fadeInStep(cur:float,total:float):void
	{
		if(fadeInEffect)
			fadeInEffect.doEffect(cur,total);
		if(cur >= total)
			fadeInEnd();
	}
	
	protected function fadeInEnd():void
	{
		if(status != ST_FADEIN)
			return;
		status = ST_FADEIN_END;
		delegate.handleItemAction(FTEConstant.Action.FadeIn_End,this);
		//
		if(typingText)
			typingText.startTyping();
		
		if(fend)
			fend.startPlay();			
	}
	
	protected function fadeOutStep(cur:float,total:float):void
	{
		if(fadeOutEffect)
			fadeOutEffect.doEffect(cur,total);
		if(cur >= total)
			fadeOutEnd();
	}
	
	protected function fadeOutEnd():void
	{
		if(status != ST_FADEOUT)
			return;
		status = ST_FADEOUT_END;
		delegate.handleItemAction(FTEConstant.Action.FadeOut_End,this);
	}
	
	

}
