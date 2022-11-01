public class AllianceMail extends PopMenu
{
	public var l_title :Label;
	
	public var btn_Cancel 	:Button;
	public var btn_Send		:Button;
	
	public var l_message 	:Label;
	public var l_subject	:Label;
	public var l_to1		:Label;
	public var l_to2		:Label;
//	public var tf_subject	:TextField;
//	public var tf_message	:TextField;
	public var it_subject 	:InputText;
	public var it_message	:InputText;
	
	public var radio_everyone	: ToggleButton;
	public var radio_officer	: ToggleButton;
	public var chk_isOfficer 	: CheckBox;

	public 	var line_texture : Texture2D;
	
	protected var data:Hashtable;
		
	private var hasRight : boolean;
	private var radioGroup : RadioGroup = new RadioGroup();
	private var innerRect:Rect;
		
	public function Init()
	{
		super.Init();
		l_to1.txt = Datas.getArString("Common.To") + ":";
		l_subject.txt = Datas.getArString("Common.Subject") + ":";
		l_message.txt = Datas.getArString("Common.Message") + ":";
		btn_Cancel.txt = Datas.getArString("Common.Cancel");
		btn_Send.txt = Datas.getArString("Common.Send_button");
		
		btn_Cancel.OnClick = buttonHandler;
		btn_Send.OnClick = buttonHandler;	
		btn_Send.clickParam = "SEND";
		btnClose.OnClick = buttonHandler;
		
		radio_everyone.Init();
		radio_officer.Init();
		radio_everyone.txt = Datas.getArString("Common.Everyone");
		radio_officer.txt = Datas.getArString("Common.Officers");
		radioGroup.addButton(radio_everyone);
		radioGroup.addButton(radio_officer);
		radioGroup.buttonChangedFunc = OnChangedRecipient;
		radioGroup.setSelectedButton(radio_everyone, true);

		var textMgr : TextureMgr = TextureMgr.instance();
		hasRight = Alliance.getInstance().IsHaveRights(AllianceRights.RightsType.SendOfficialMessage);
		if ( hasRight )
		{
			chk_isOfficer.picOnSelected = textMgr.LoadTexture("check_box_1", TextureType.DECORATION);
			chk_isOfficer.picOnUnselected = textMgr.LoadTexture("check_box_2", TextureType.DECORATION);
			chk_isOfficer.txt = Datas.getArString("Alliance.OnBehalfOfAlliance");
			chk_isOfficer.SetVisible(true);
		}
		else
		{
			chk_isOfficer.SetVisible(false);
		}
		chk_isOfficer.IsSelect = false;
		
		innerRect = rect;
		innerRect.x = 0;
		innerRect.y = 0;
	}
	
	public function DrawItem()
	{
		
		drawTexture(line_texture,45,85,500,17);
		l_title.Draw();
		btnClose.Draw();
		
		radio_everyone.Draw();
		radio_officer.Draw();
		
		GUI.BeginGroup(innerRect);
		it_subject.Draw();
		it_message.Draw();
		
		l_to1.Draw();
		l_to2.Draw();
		l_subject.Draw();
		l_message.Draw();
//		tf_subject.Draw();
//		tf_message.Draw();	
		
		btn_Send.Draw();
		btn_Cancel.Draw();	
		
		chk_isOfficer.Draw();
		GUI.EndGroup();
	}
	
	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		this.data = param as Hashtable;
		
		l_title.txt = data["title"];
		l_to2.rect.x = l_to1.rect.x + l_to1.GetWidth() + 10;
		l_to2.txt = data["toname"];
		
		it_subject.txt = data["subject"];
		var msg:String = data["message"];
		msg = msg?msg:"";
		it_message.txt = msg;

		if ( data["type"] != "allianceall" && data["type"] != "alliancesys")
		{
			chk_isOfficer.SetVisible(false);
			radio_everyone.SetVisible(false);
			radio_officer.SetVisible(false);
			innerRect.y = 0;
		}
		else // send to all
		{
			innerRect.y = hasRight ? 60 : 0;
			radio_everyone.SetVisible(hasRight);
			radio_officer.SetVisible(hasRight);
			if (hasRight) {
				OnChangedRecipient(radio_everyone);
			}
		}
		//tf_subject.SetString(data["subject"]);
	}

	private function OnChangedRecipient(btnSelected : ToggleButton)
	{
		chk_isOfficer.SetVisible(btnSelected == radio_everyone);
		l_to2.txt = (btnSelected == radio_everyone ? Datas.getArString("Common.Everyone") : Datas.getArString("Common.Officers"));
	}

	protected function senderFunc(toStr:String,subject:String,message:String):void
	{
	//toIds:int,tileIdstr:String,subject:String,message:String,type:String,resultFunc:Function):void
		/*
		if(!subject || !message || subject.Length == 0 || message.Length  == 0)
		{
			
		}
		else	
		*/
		if(!subject)
			subject = "";
		if(!message)
			message = "";

		if ( data["type"] != "user" )
		{
			if (radioGroup.getSelectedButton() == radio_officer)
			{
				data["type"] = "alliance"; // send to officer
			}
			else if ( chk_isOfficer.IsSelect )
			{
				data["type"] = "alliancesys";
			}
			else
			{
				data["type"] = "allianceall";
			}
		}
		Alliance.getInstance().reqAllianceSendMessage(data["toIds"],data["tileId"],subject,message,data["type"],sendOk);
	}

	protected function sendOk():void
	{
		this.close();
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_MailSucess"));
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "SEND":
				senderFunc(data["toname"],it_subject.txt,it_message.txt );
				break;
			default:
				this.close();
		}
	}
}
