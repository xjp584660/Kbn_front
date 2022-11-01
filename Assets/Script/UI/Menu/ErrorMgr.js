class ErrorMgr extends KBN.ErrorMgr
{
	public  var m_errorDialog:ErrorDialog;
	private var transition:Transition_ZoomPop;
	private var immediateTransition:Transition_immediate;
	private var m_bShow;
	protected var state:MENUSTATE = MENUSTATE.Disappear;
	private var errorQueue:Array = new Array();
    
	public function IsShowError()
	{
		return m_bShow;
	}
	
	public function IsShow():boolean
	{
		return m_bShow;
	}
	
	function Init()
	{
		m_errorDialog.Init();
		singleton = this;
		GameMain.instance().resgisterRestartFunc(function(){
			singleton = null;
		});
		transition = new Transition_ZoomPop();
		immediateTransition = new Transition_immediate();
		m_bShow = false;
		errorQueue.Clear();
	}
	
	public static function instance():ErrorMgr
	{
		return singleton as ErrorMgr;
	}
	
	function PushError(title:String, errorMsg:String, closeAble:boolean)
	{
		this.PushError(title, errorMsg, closeAble, "", null, null, Rect(0,0,0,0));
	}
	function PushError(title:String, errorMsg:String)
	{
		PushError(title, errorMsg, true, "", null, null, Rect(0,0,0,0));
	}
    
	function PushError(title: String, errorMsg: String, closeAble: boolean, btnName: String, action: MulticastDelegate)
	{
		PushError(title, errorMsg, closeAble, btnName, action, null, Rect(0,0,0,0));
	}


	function PushError(title: String, errorMsg: String, closeAble: boolean, btnName: String, action: MulticastDelegate, clsoeAction: MulticastDelegate) {
		PushError(title, errorMsg, closeAble, btnName, action, clsoeAction, Rect(0, 0, 0, 0));
	}

	function ForcePushError(title:String, errorMsg:String):void
	{
		if(errorQueue.length > 0)
		{
			errorQueue.Clear();
		}
		
		if(m_bShow)
		{
			m_bShow = false;
			state = MENUSTATE.Disappear;
			
			immediateTransition.StartTrans(m_errorDialog, null);				
			immediateTransition.FadeoutUpdate();			
		}

		PushError(title, errorMsg, true, "", null, null, Rect(0,0,0,0));
	}
	
	function PushError(title: String, errorMsg: String, closeAble: boolean, btnName: String, action: MulticastDelegate, clsoeAction: MulticastDelegate, contentRect:Rect)
	{
		if(m_bShow || errorQueue.length > 0)
		{
			if(action != null)
			{
				var error:Error = new Error();
				error.btnName = btnName;
				error.title = title;
				error.errorMsg = errorMsg;
				error.action = action;
				error.clsoeAction = clsoeAction;
				error.rect = contentRect;
				error.closeAble = closeAble;
				errorQueue.Push(error);
//				_Global.Log("push error in queue");
			}
			else
			{
//				_Global.Log("skip this error");
				return;
			}	
		}
		else 
		{
			PushErrorDialog(title, errorMsg, closeAble);
			if(contentRect.width > 0)
				m_errorDialog.setContentRect(contentRect);
			if(action != null)
			{
				m_errorDialog.setAction(btnName, action);
			}
			if (clsoeAction != null) {
				m_errorDialog.SetCloseAction(clsoeAction);
			}
		}	
	}
	
	private function PushErrorDialog(title:String, errorMsg:String,closeAble:boolean)
	{
		
		if(m_bShow)
		{
			if(state == MENUSTATE.FadeOut)
			{
				transition.FadeOut2End();
			}
			else
			{
//				_Global.Log("ErrorDialog Already Show... SKIP SHOW CALL!");
				return;
			}
		}
			
			
		var gMain:GameMain = GameMain.instance();
		if( gMain ){
			gMain.hideTileInfoPopup();
		}
		
		m_errorDialog.SetTip(title);
		m_errorDialog.SetMsg(errorMsg);
		m_errorDialog.SetDefault();
		m_errorDialog.btnClose.SetVisible(closeAble);		
		m_errorDialog.OnPush(null);
		m_errorDialog.SetVisible(true);
		m_errorDialog.SetDisabled(false);
		m_errorDialog.transition = transition;
		transition.StartTrans(null, m_errorDialog);
		state = MENUSTATE.FadeIn;
		transition.FadeinUpdate();	
		m_bShow = true;
		if(InputText.getKeyBoard())
			InputText.getKeyBoard().active = false;
	}
	
	function PopError()
	{
		if(!m_bShow)
			return;
		transition.StartTrans(m_errorDialog, null);				
		transition.FadeoutUpdate();
		state = MENUSTATE.FadeOut;
	}
	
	function FixedUpdate()
	{
	   if(state == MENUSTATE.FadeIn)
	   {
	   		transition.FadeinUpdate();
	   		if( transition.IsFin() )
	   		{
	   			state = MENUSTATE.Show;
	   		}
	   }
	   else if(state == MENUSTATE.FadeOut)
	   {
	   		transition.FadeoutUpdate();
	   		if( transition.IsFin() )
	   		{
	   			state = MENUSTATE.Show;
	   			m_bShow = false;
	   			if(errorQueue.length > 0)
	   			{
	   				PushNext();
	   			}
	   		}	
	   }   
	   
	   m_errorDialog.Update();
	}
	
	private function PushNext()
	{
		var error:Error = errorQueue.Shift();
		PushErrorDialog(error.title, error.errorMsg, error.closeAble);
		if(error.action != null)
		{
			m_errorDialog.setAction(error.btnName, error.action);
		}
		if (error.clsoeAction != null) {
			m_errorDialog.SetCloseAction(error.clsoeAction);
		}

		if(error.rect.width > 0)
			m_errorDialog.setContentRect(error.rect);
	}
	
	public function OpenNoMoneyDialog(needMoney:int)
	{	
		PushError(Datas.instance().getArString("Error.NeedCash_Title "), Datas.instance().getArString("Error.NeedCash"));
	}
	
	public function Draw()
	{
		if(!m_bShow)
			return;
		//var oldDepth : int = GUI.depth;
		GUI.depth = 0;//oldDepth - 1;
		m_errorDialog.Draw();	
		//GUI.depth = oldDepth;
	}
}

