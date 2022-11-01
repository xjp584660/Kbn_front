class ComposeObj extends UIObject
{
	public var btnSend:Button;
	public var labelTitle:Label;
	public var labelTo:Label;
	public var labelSubject:Label;
	public var txtTo:InputText;
	public var txtSubject:InputText;
	public var txtMessage:InputTextArea;
	public var icon:Label;
	
	private var successFunc:Function;
	private var _Param:Object;
	private var _Type:int;
	
	public static var InviteMail:int = 1;
	
	public function Init()
	{
		labelTitle.Init();
		btnSend.Init();
		labelTo.Init();
		labelSubject.Init();
		txtTo.Init();
		txtSubject.Init();
//		txtTo.setCursorEnable(true);
//		txtSubject.setCursorEnable(true);
		txtMessage.Text.setKeyboardMultiLine();
		btnSend.OnClick = handleSend;
		txtMessage.Init();
	}
	
	public function Draw()
	{	
		GUI.BeginGroup(rect);
		labelTitle.Draw();
		btnSend.Draw();		
		labelTo.Draw();	
		labelSubject.Draw();	
		txtTo.Draw();
		icon.Draw();
		txtSubject.Draw();	
		txtMessage.Draw();
		GUI.EndGroup();	
	}
	
	public function Update()
	{
		super.Update();
		txtMessage.Update();
	}
	
	private function handleSend()
	{
		var to:String = txtTo.txt;
		var subject:String = txtSubject.txt;
		var message:String = txtMessage.Text.txt;
		
		if(to == "")
		{
//			_Global.Log("please input the correct infor to send!");
			return;			
		}
		if(InputText.getKeyBoard())
		{
			InputText.getKeyBoard().active = false;
		}	
		if(_Type == InviteMail)
		{
			Alliance.getInstance().SendInvite(to,subject,message,handleResult,_Param);
		}
		else
		{
			Message.getInstance().SendMessage(to,subject,message,handleResult);
		}
		
	}
	
	private function handleResult(data:HashObject)
	{
		if(data["ok"].Value)
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.SentMailSuccess"));
			
			if(EmailMenu.getInstance().isInSubMenu)
			{
				EmailMenu.getInstance().PopSubMenu();
			}
			else
			{
				MenuMgr.getInstance().PopMenu("");
			}
			
			if(successFunc)
			{
				successFunc();
			}
			
			return;
		}
		else
		{
//			_Global.Log("please enter the exist name");
		}
	}
	
	public function clearKeyboard()
	{
		if(txtTo.getKeyBoard())
		{
			txtTo.getKeyBoard().active = false;
		}
		
		if(txtSubject.getKeyBoard())
		{
			txtSubject.getKeyBoard().active = false;
		}
		
		if(txtMessage.Text.getKeyBoard())
		{
			txtMessage.Text.getKeyBoard().active = false;
		}				
	}
	
	/*		
	** param
	**	 name
	**	 subject
	*/
	
	public function  setData(param:Object)
	{
//		var arString:Object = Datas.instance().arStrings();
		
		var ParamObject:Hashtable = param as Hashtable;
		
		txtTo.maxChar = 15;
		txtTo.SetDisabled(_Global.ToBool(ParamObject["readonlyto"]));
		txtTo.txt = _Global.ToString(ParamObject["name"]);
		
		//caimingtemp
		_Global.Log("setdisabled InputText"+_Global.ToBool(ParamObject["readonlyto"]));
		
		txtSubject.maxChar = 36;
		txtSubject.SetDisabled(_Global.ToBool(ParamObject["readonlysubject"]));
		txtSubject.txt = _Global.ToString(ParamObject["subject"]);

		//caimingtemp
		_Global.Log("setdisabled InputText"+_Global.ToBool(ParamObject["readonlysubject"]));

		_Param = ParamObject["param"];
		_Type = _Global.INT32(ParamObject["type"]);
		
		txtMessage.Text.maxChar = 2000;
		txtMessage.SetTextContent(_Global.ToString(ParamObject["messageBody"]));

		labelTitle.txt = _Global.ToString(ParamObject["title"]);
		
		btnSend.txt = Datas.getArString("Common.Send_button");
		labelSubject.txt = Datas.getArString("Common.Subject");		
		labelTo.txt = Datas.getArString("Common.To");
		if (_Type == InviteMail) 
		{
			icon.visible = true;
			icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("Invitations_small2", TextureType.DECORATION);
		} 
		else 
		{
			icon.visible = false;
		}
	}
	
	public function setSeccessFunc(_func:Function)
	{
		successFunc = _func;
	}
}
