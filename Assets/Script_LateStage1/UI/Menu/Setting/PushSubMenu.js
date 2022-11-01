public class PushSubMenu extends SubMenu
{
	public var l_bg	:Label;
	public var item1 : SoundItem;
	public var item2 : SoundItem;
	public var item3 : SoundItem;
	public var item4 : SoundItem;
	public var item5 : SoundItem;
	
	public var l_tip : Label;
	public var l_bg2 : Label;
	public var l_bg3 : Label;
	public var subtitle1 : Label;
	public var subtitle2 : Label;
    public var line : Label;
    
    public var subline1 : Label;
    public var subline2 : Label;
    public var subline3 : Label;
    public var subline4 : Label;
	
	private var vList:Array;
	private var itemList:Array;
	
	private var global_set:int = 0;
	
	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
		
		title.txt = Datas.getArString("Settings.Notification");
		subtitle1.txt = Datas.getArString("Settings.ReminderTile");
		subtitle2.txt = Datas.getArString("Settings.PushTile");
		
		item1.l_text.txt = Datas.getArString("Settings.Notification_Title1");
		item1.b_switch.OnClick = item1_Click;
		
		item2.l_text.txt = Datas.getArString("Settings.Notification_Title2");
		item2.b_switch.OnClick = item2_Click;
		
		item3.l_text.txt = Datas.getArString("Settings.Notification_Title3");
		item3.b_switch.OnClick = item3_Click;
		
		item4.l_text.txt = Datas.getArString("Settings.gem_reminder");
		item4.b_switch.OnClick = item4_Click;
			
		item5.l_text.txt = Datas.getArString("Campaign.settlementSkip");
		item5.b_switch.OnClick = item5_Click;
		var seed: HashObject = GameMain.instance().getSeed();
		var pveSkipSwitch: int = _Global.INT32(seed["PVE_SKIP_SWITCH"]);
		if (pveSkipSwitch == 0)
		{
			item5.l_text.visible = false;
			item5.b_switch.visible = false;
			l_bg3.visible = false;
			PlayerPrefs.SetInt(Constant.UserSetting.CampaignSettlementSkip, 0);
        }
		else
		{
			item5.visible = true;
        }
		
		item1.b_switch.textOn = 
			item2.b_switch.textOn = 
				item3.b_switch.textOn =
				   item4.b_switch.textOn =
						item5.b_switch.textOn = Datas.getArString("Settings.On");

		item1.b_switch.textOff = 
			item2.b_switch.textOff =
				item3.b_switch.textOff = 
				    item4.b_switch.textOff =
						item5.b_switch.textOff = Datas.getArString("Settings.Off");

		vList = [false,false,false];
		itemList = [item1,item2,item3];
		
		//Init value from seed ...
	}
	
	private function saveLocalSetting():void
	{
		var item:SoundItem;
		for(var i:int = 0; i<3; i++)
		{
			item = itemList[i];
			vList[i] = item.b_switch.on;
		}
	}
	
	private function isSettingModified():boolean
	{
		var item:SoundItem;
		for(var i:int = 0; i<3; i++)
		{
			item = itemList[i];
			if( vList[i] != item.b_switch.on)
				return true;
		}
		return false;
	}
	
	function item1_Click(param:Object):void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		seed["push"]["city_set"] = new HashObject(_Global.Bool2INT(item1.b_switch.on));
	}
	
	function item2_Click(param:Object):void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		seed["push"]["march_set"] = new HashObject(_Global.Bool2INT(item2.b_switch.on));
	}
	
	function item3_Click(param:Object):void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		seed["push"]["mail_set"] = new HashObject(_Global.Bool2INT(item3.b_switch.on));
	}
	
	function item4_Click(param:Object):void 
	{
		var isOpen:boolean = _Global.GetBoolean(param);
	    
	    if(!isOpen)
		{
			PlayerPrefs.SetInt(Constant.SpeedUpHintType.GemsCost, 1);
		}
		else
		{
			PlayerPrefs.SetInt(Constant.SpeedUpHintType.GemsCost, 0);
		}	    
	}

	function item5_Click(param : Object) : void 
	{
		var isOpen:boolean = _Global.GetBoolean(param);
	    
	    if(!isOpen)
		{
			PlayerPrefs.SetInt(Constant.UserSetting.CampaignSettlementSkip, 1);
		}
		else
		{
			PlayerPrefs.SetInt(Constant.UserSetting.CampaignSettlementSkip, 0);
		}
	}
	
	////OnPushed.

	public function OnPush(param:Object):void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		if(seed!= null && seed["push"] != null)
		{
			item1.b_switch.SetOn ( _Global.INT32(seed["push"]["city_set"]) == 1 );
			item2.b_switch.SetOn ( _Global.INT32(seed["push"]["march_set"]) == 1 );
			item3.b_switch.SetOn ( _Global.INT32(seed["push"]["mail_set"]) == 1 );
		}
		saveLocalSetting();
		global_set = PlayerPrefs.GetInt(Constant.NativeDefine.KMP_PUSH_NOTIFICATION,0);
		
		item1.b_switch.disabled = 
			item2.b_switch.disabled = 
				item3.b_switch.disabled =  (global_set == 0);
				
		if(global_set == 0)	// global closed.
		{
			l_tip.txt = Datas.getArString("Settings.Notification_GlobalOff_Tip");

		}
		else
		{
			l_tip.txt = Datas.getArString("Settings.Notification_GlobalOn_Tip");

		}
		item4.b_switch.SetOn(!SpeedUp.instance().GetSpeedUpIsOpenHint());
		item5.b_switch.SetOn(!GameMain.instance().GetCampaignSettlementSkip());
	}
	
	public function OnPop():void
	{
		if(this.isSettingModified())
		{
			var seed:HashObject = GameMain.instance().getSeed();
			if(seed != null && seed["push"] != null)
			{
				seed["push"]["city_set"] = new HashObject(_Global.Bool2INT(item1.b_switch.on));
				seed["push"]["march_set"] = new HashObject(_Global.Bool2INT(item2.b_switch.on));
				seed["push"]["mail_set"] = new HashObject(_Global.Bool2INT(item3.b_switch.on));
			}
			
			GameMain.instance().sendPushSettings();
		}
	}
	
	function Update()
	{
	}
	
	function DrawItem()
	{
		title.Draw();
		btnBack.Draw();
		subtitle1.Draw();
		subtitle2.Draw();
        line.Draw();
		if(global_set == 0)
		{
			item1.Draw();
			item2.Draw();
			item3.Draw();
			
			l_bg.Draw();
		}
		else
		{
			l_bg.Draw();
			
			item1.Draw();
			item2.Draw();
			item3.Draw();
		}
		l_bg2.Draw();
		l_bg3.Draw();
		subline1.Draw();
		subline2.Draw();
		subline3.Draw();
		subline4.Draw();

		item4.Draw();
		item5.Draw();
		l_tip.Draw();
	}
}	