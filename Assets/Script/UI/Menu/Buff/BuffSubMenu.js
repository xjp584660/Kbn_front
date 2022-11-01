class BuffSubMenu extends UIObject
{
	public var btnBack:Button;
	public var icon:Label;
	public var description:Label;
	public var timeIcon:Label;
	public var timeLabel:Label;
	public var levelDesc:Label;
	public var item:BuffSubMenuItem;
	public var timeComponent:ComposedUIObj;
	
//	public var timeLabel1:Label;
//	public var timeIcon1:Label;
//	public var levelDesc1:Label;
//	public var timeComponent1:ComposedUIObj;
//	
//	public var timeLabel2:Label;
//	public var timeIcon2:Label;
//	public var levelDesc2:Label;
//	public var timeComponent2:ComposedUIObj;

	public var permonentUpDesc:Label;
	public var permonentUpNum:Label; 
	public var BuffDescription:Label;
	
	public var scrollView:ScrollView;
	public var blankErea:Label;
	public var line2:Label;
	private var data:Hashtable;

	private var curTimer:long;
	private var oldTimer:long;
	private var updateTimer:boolean;
	private var endTimer:long;
	private var attackItems:int[] = [261, 262, 263, 264,281, 291];
	private var defenceItems:int[] = [271, 272, 273, 274,301, 311];
	
	private var effects:String[] = null;
	private var timestamps:long[] = null;
	
	@Serializable
	private class UIConfig {
		@SerializeField var scrollViewYPos : float;
		@SerializeField var scrollViewHeight : float;
		@SerializeField var buffDescriptionYPos : float;
		@SerializeField var timeComponentYPos : float;
	}
	
	@SerializeField var uiConfigNormal : UIConfig;
	@SerializeField var uiConfigBuffTypeCombatA : UIConfig;
	@SerializeField var uiConfigBuffTypeCombatB : UIConfig;
	
	@SerializeField var timeComponent1YPosBig : float;
	@SerializeField var timeComponent1YPosSmall : float;
	
	@SerializeField var timeComponentRowHeight : float = 100;
	
	private var isNeedResetPos = true;

	function Init():void
	{
		btnBack.Init();
		btnBack.OnClick = handleBack;
		icon.Init();	
		description.Init();	
		timeIcon.Init();	
		timeLabel.Init();
//		timeIcon1.Init();	
//		timeLabel1.Init();
		levelDesc.Init();
//		levelDesc1.Init();
		permonentUpDesc.Init();
		permonentUpNum.Init(); 
		BuffDescription.Init();
		item.Init();	
		
		scrollView.Init();
		timeComponent.component = [timeLabel, timeIcon, levelDesc];
//		timeComponent1.component = [timeLabel1, timeIcon1, levelDesc1];
//		timeComponent2.component = [timeLabel2, timeIcon2, levelDesc2];
		line2.setBackground("between line",TextureType.DECORATION);
		timeLabel.setBackground("contentBack",TextureType.DECORATION);
//		timeLabel1.setBackground("square_black2",TextureType.DECORATION);
		permonentUpDesc.setBackground("contentBack",TextureType.DECORATION);
		
	}

	public function setData(_para:Object):void
	{
		data = _para;
	
		curTimer = GameMain.unixtime();
		endTimer = data["endTime"];
		
		effects = null;
		timestamps = null;
		
		timeComponent.rect.y = uiConfigNormal.timeComponentYPos;
//		timeComponent1.SetVisible(false);
//		timeComponent2.SetVisible(false);
		if(endTimer > curTimer)
		{
			updateTimer = true;	
			timeComponent.SetVisible(true) ;
		}
		else
		{
			updateTimer = false;
			timeComponent.SetVisible(false);
		}
		
		scrollView.rect.y = uiConfigNormal.scrollViewYPos;
		scrollView.rect.height = uiConfigNormal.scrollViewHeight;
		BuffDescription.rect.y = uiConfigNormal.buffDescriptionYPos;
		description.txt = data["des"]; 
		
		if(data["type"] == Constant.BuffType.BUFF_TYPE_COMBAT || (data["type"] == Constant.BuffType.BUFF_TYPE_RESOURCE && (data["id"] == 3400) || 
		data["type"] == Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT && data["id"] == 3001))
		{
			levelDesc.SetVisible(true);
			var numEffect:int = 0;
			var permanantEffect : int = 0;
			var EffectLevel:int = 0;
			var seed:HashObject = GameMain.instance().getSeed();
			
			if(data["id"] == 261)
			{
				effects = new String[5];
				timestamps = new long[5];
				
				var bT2601:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2601"]) - curTimer;
				var bT2604:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2604"]) - curTimer;
				var bT2602:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2602"]) - curTimer;
				var bT2605:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2605"]) - curTimer;
				if(bT2601 > 0)
				{
					EffectLevel += 20;
					numEffect++;
				}
				
				if(bT2604 > 0)
				{
					EffectLevel += 50;
					numEffect++;
				}
				
				if(bT2602 > 0)
				{
					EffectLevel += 100;
					numEffect++;
				}
				
				if(bT2605 > 0)
				{
					EffectLevel += 130;
					numEffect++;
				}
				
				var attackBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Attack, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
				var attackEffect:int = _Global.INT32(100.0f * attackBuff.Percentage);
				
				if (attackBuff.Eta - curTimer > 0)
				{
					EffectLevel += attackEffect;
					numEffect++;
				}
				
				effects[0] = "20%";
				effects[1] = "50%";
				effects[2] = "100%";
				effects[3] = "130%";
				effects[4] = attackEffect + "%";
				
				timestamps[0] = _Global.INT64(seed["bonus"]["bC2600"]["bT2601"]);
				timestamps[1] = _Global.INT64(seed["bonus"]["bC2600"]["bT2604"]);
				timestamps[2] = _Global.INT64(seed["bonus"]["bC2600"]["bT2602"]);
				timestamps[3] = _Global.INT64(seed["bonus"]["bC2600"]["bT2605"]);
				timestamps[4] = attackBuff.Eta;
				
				permanantEffect = _Global.INT32(seed["bonus"]["bC2600"]["bT2603"].Value); 
				EffectLevel += permanantEffect;
				description.txt = EffectLevel>0 ? Datas.getArString("BuffDescription.IncreaseAttackBy",[EffectLevel]) : Datas.getArString("BuffDescription.IncreaseAttack");	
			}
			else if(data["id"] == 271)
			{
				effects = new String[5];
				timestamps = new long[5];
				
				var bT2701:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2701"]) - curTimer;
				var bT2704:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2704"]) - curTimer;
				var bT2702:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2702"]) - curTimer;
				var bT2705:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2705"]) - curTimer;
				if(bT2701 > 0)
				{
					EffectLevel += 20;
					numEffect++;
				}
				
				if(bT2704 > 0)
				{
					EffectLevel += 50;
					numEffect++;
				}
				
				if(bT2702 > 0)
				{
					EffectLevel += 100;
					numEffect++;
				}
				
				if(bT2705 > 0)
				{
					EffectLevel += 130;
					numEffect++;
				}
				
				var lifeBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Life, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
				var lifeEffect:int = _Global.INT32(100.0f * lifeBuff.Percentage);
				
				if (lifeBuff.Eta - curTimer > 0)
				{
					EffectLevel += lifeEffect;
					numEffect++;
				}
				
				effects[0] = "20%";
				effects[1] = "50%";
				effects[2] = "100%";
				effects[3] = "130%";
				effects[4] = lifeEffect + "%";
				
				timestamps[0] = _Global.INT64(seed["bonus"]["bC2700"]["bT2701"]);
				timestamps[1] = _Global.INT64(seed["bonus"]["bC2700"]["bT2704"]);
				timestamps[2] = _Global.INT64(seed["bonus"]["bC2700"]["bT2702"]);
				timestamps[3] = _Global.INT64(seed["bonus"]["bC2700"]["bT2705"]);
				timestamps[4] = lifeBuff.Eta;
				
				permanantEffect = _Global.INT32(seed["bonus"]["bC2700"]["bT2703"].Value);  
				EffectLevel += permanantEffect;
				description.txt = EffectLevel>0 ? Datas.getArString("BuffDescription.IncreaseDefenseBy",[EffectLevel]): Datas.getArString("BuffDescription.IncreaseDefense");
			}
			else if(data["id"] == 265)
			{
				effects = new String[1];
				timestamps = new long[1];
				
				var bT2801:long = _Global.INT64(seed["bonus"]["bC2800"]["bT2801"]) - curTimer;
				if(bT2801 > 0)
				{
					EffectLevel += 20;
					numEffect++;
				}
			
				effects[0] = "20%";
				
				timestamps[0] = _Global.INT64(seed["bonus"]["bC2800"]["bT2801"]);
				
				description.txt = EffectLevel>0 ? Datas.getArString("BuffDescription.FoeAttackBy",[EffectLevel]): Datas.getArString("BuffDescription.FoeAttack");
			}
			else if(data["id"] == 275)
			{
				effects = new String[1];
				timestamps = new long[1];
				
				var bT2901:long = _Global.INT64(seed["bonus"]["bC2900"]["bT2901"]) - curTimer;
				if(bT2901 > 0)
				{
					EffectLevel += 20;
					numEffect++;
				}
			
				effects[0] = "20%";
				
				timestamps[0] = _Global.INT64(seed["bonus"]["bC2900"]["bT2901"]);
				
				description.txt = EffectLevel>0 ? Datas.getArString("BuffDescription.FoeLifeBy",[EffectLevel]): Datas.getArString("BuffDescription.FoeLife");
			}	
			else if(data["id"] == 410)
			{
				var marchSizeTimestamp:long = _Global.INT64(seed["bonus"]["bC410"][_Global.ap + 1]);
				var marchSizeAddtion:int = _Global.INT32(seed["bonus"]["bC410"][_Global.ap + 0]);
				description.txt = (marchSizeTimestamp > curTimer) ? String.Format(Datas.getArString("BuffDescription.IncreaseMarchSizeby"), marchSizeAddtion) : Datas.getArString("BuffDescription.IncreaseMarchSize");
				if (marchSizeTimestamp > curTimer)
				{
					timestamps = new long[1];
					timestamps[0] = marchSizeTimestamp;
				}
				levelDesc.SetVisible(false);
			}
			else if(data["id"] == 3300)
			{
				var healBuffTimestamp:long = _Global.INT64(seed["bonus"]["bC3300"][_Global.ap + 1]);
				var healBuffEffect:int = _Global.INT32(seed["bonus"]["bC3300"][_Global.ap + 0]);
				description.txt = (healBuffTimestamp > curTimer) ? String.Format(Datas.getArString("BuffDescription.IncreaseHealSizeby"), healBuffEffect) : Datas.getArString("BuffDescription.IncreaseHealSize");
				if (healBuffTimestamp > curTimer)
				{
					timestamps = new long[1];
					timestamps[0] = healBuffTimestamp;
				}
				levelDesc.SetVisible(false);
			}
			else if(data["id"] == 3400)
			{
				var cityOrder:int = GameMain.instance().getCurCityOrder();
				var rationBuffExpireTime:long = _Global.INT64(seed["bonus"]["bC3400"]["bT340" + cityOrder]);
				description.txt = Datas.getArString("BuffDescription.Ration");
				if (rationBuffExpireTime > curTimer)
				{
					timestamps = new long[1];
					timestamps[0] = rationBuffExpireTime;
				}
				levelDesc.SetVisible(false);
			}
			else if(data["id"] == 3500)
			{
				var pveLuckBuffTimestamp:long = _Global.INT64(seed["bonus"]["bC3500"]["bT3501"]);
				description.txt = Datas.getArString("BuffDescription.PVElucky");
				if (pveLuckBuffTimestamp > curTimer)
				{
					timestamps = new long[1];
					timestamps[0] = pveLuckBuffTimestamp;
				}
				levelDesc.SetVisible(false);
			}
			else if(data["id"] == 3001)
			{
				//var pveLuckBuffTimestamp:long = _Global.INT64(seed["bonus"]["bC3500"]["bT3501"]);
				//description.txt = Datas.getArString("BuffDescription.PVElucky");
				if (endTimer > curTimer)
				{
					timestamps = new long[1];
					timestamps[0] = endTimer;
				}
				levelDesc.SetVisible(false);
			}
			else if(data["id"] == 3600)
			{
				var worldmapLuckBuffTimestamp:long = _Global.INT64(seed["bonus"]["bC3500"]["bT3502"]);
				description.txt = Datas.getArString("BuffDescription.WildLucky");
				if (worldmapLuckBuffTimestamp > curTimer)
				{
					timestamps = new long[1];
					timestamps[0] = worldmapLuckBuffTimestamp;
				}
				levelDesc.SetVisible(false);
			}
			
			if (permanantEffect > 0) numEffect++;
			
			var uiConfig : UIConfig = numEffect > 3 ? uiConfigBuffTypeCombatB : uiConfigBuffTypeCombatA;
			timeComponent.rect.y = numEffect <= 1 ? (uiConfig.timeComponentYPos + timeComponentRowHeight) : uiConfig.timeComponentYPos;
			if (timeComponent.rect.y + timeComponentRowHeight * numEffect + 5 > uiConfig.buffDescriptionYPos)
			{
				var delta = timeComponent.rect.y + timeComponentRowHeight * numEffect + 5 - uiConfig.buffDescriptionYPos;
				
				scrollView.rect.y = uiConfig.scrollViewYPos + delta;
				BuffDescription.rect.y = uiConfig.buffDescriptionYPos + delta;
				scrollView.rect.height = uiConfig.scrollViewHeight - delta;
			}
			else
			{
				scrollView.rect.y = uiConfig.scrollViewYPos;
				BuffDescription.rect.y = uiConfig.buffDescriptionYPos;
				scrollView.rect.height = uiConfig.scrollViewHeight;
			}
		}
		else
		{
			levelDesc.SetVisible(false);
		}

		icon.useTile = true;
		icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(data["icon"]);
		//icon.tile.name = data["icon"];
		
		permonentUpDesc.txt = Datas.instance().getArString("BuffDescription.AttackPermanent"); 
		BuffDescription.txt = Datas.instance().getArString("BuffDescription.ComboDesc");
		
		scrollView.clearUIObject();
		var arr:Array = data["items"] as Array;
		var buffSubMenuItem:BuffSubMenuItem;		
		for(var a:int = 0; a < arr.length; a++)
		{
			buffSubMenuItem = Instantiate(item);
			buffSubMenuItem.Init();
			buffSubMenuItem.setData(arr[a]);		
			scrollView.addUIObject(buffSubMenuItem);
			
			if(a != (arr.length - 1))
			{
				scrollView.addUIObject(blankErea);
			}
		}
		
		line2.rect.y = scrollView.rect.y - 20;
		scrollView.AutoLayout();
		
		if(isNeedResetPos)
		{
			scrollView.MoveToTop();
		}
		isNeedResetPos = false;
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		btnBack.Draw();
		icon.Draw();
		line2.Draw();
		description.Draw();	
		
		DrawPermonentLevelUp();
		scrollView.Draw();
		
//		timeComponent.Draw();
//		timeComponent1.Draw();
//		timeComponent2.Draw();
		GUI.EndGroup();
	}
	
	private function DrawPermonentLevelUp():void
	{
		if(data["type"] == Constant.BuffType.BUFF_TYPE_COMBAT || (data["type"] == Constant.BuffType.BUFF_TYPE_RESOURCE && (data["id"] == 3400) || 
		data["type"] == Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT && data["id"] == 3001))
		{ 
			BuffDescription.SetVisible(false); 
			var seed:HashObject = GameMain.instance().getSeed();
			
			if (data["id"] == 261 || data["id"] == 271 || data["id"] == 265 || data["id"] == 275 )
			{
				BuffDescription.SetVisible(true);
				
				var permanantEffect : int = (data["id"] == 261) ? _Global.INT32(seed["bonus"]["bC2600"]["bT2603"]) : _Global.INT32(seed["bonus"]["bC2700"]["bT2703"]);
				
				var startY : float = timeComponent.rect.y;
				var curY : float = (permanantEffect > 0) ? (startY + timeComponentRowHeight) : startY;
				
				for (var i = 0; i < effects.length; i++)
				{
					var timeLeft = timestamps[i] - curTimer;
					if (timeLeft <= 0)
						continue;
						
					timeComponent.rect.y = curY;
					
					levelDesc.txt = "+" + effects[i];
					timeLabel.txt = _Global.timeFormatStr(timeLeft);
					
					timeComponent.Draw();
						
					curY += timeComponentRowHeight;
				}
				
				timeComponent.rect.y = startY;
				
				if (permanantEffect > 0)
				{
					if(data["id"] == 265 || data["id"] == 275)
					{
						permonentUpDesc.SetVisible(false); 
						permonentUpNum.SetVisible(false); 
					}
					else
					{
						permonentUpDesc.SetVisible(true); 
						permonentUpNum.SetVisible(true); 
						permonentUpNum.txt = "+" +  permanantEffect + "%";
					}	
				} 
				else
				{
					permonentUpDesc.SetVisible(false); 
					permonentUpNum.SetVisible(false); 
				}
			}
			else if(data["id"] == 410 || data["id"] == 3300 || data["id"] == 3400 || data["id"] == 3500 || data["id"] == 3600 || data["id"] == 3001)
			{
				permonentUpDesc.SetVisible(false); 
				permonentUpNum.SetVisible(false); 
				
				if (null != timestamps && timestamps.length >= 1 && timestamps[0] >= curTimer)
				{
					levelDesc.txt = String.Empty;
					timeLabel.txt = _Global.timeFormatStr(timestamps[0] - curTimer);
					
					timeComponent.Draw();
				}
				
			}
			permonentUpDesc.Draw();
			permonentUpNum.Draw();
		} 
		else
		{
			BuffDescription.SetVisible(false); 
		} 
		BuffDescription.Draw();
	}
	
	public function Update():void
	{
		scrollView.Update();
	
		if(!updateTimer)
		{
			return;
		}
		
		curTimer = GameMain.unixtime();	

		if(curTimer - oldTimer > 0)
		{
			oldTimer = curTimer;
		}
		else
		{
			return;
		}
	
	
		if(endTimer - curTimer > 0)
		{
			timeLabel.txt = _Global.timeFormatStr(endTimer - curTimer);	 
		}
		else
		{
			updateTimer = false;
			timeComponent.SetVisible(false);
		}
	}
	
	private var buyItemId:int;
	private var isClickBtn1:boolean;
	
	public function resetSubmenuPage():void
	{
//		if(data["type"] != Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT)
//		{
			var buffitem:Object = BuffAndAlert.instance().getSubMenuInfor(data["type"], data["id"]);
			setData(buffitem);	
//		}			
	}
	
	public function handleBack():void
	{
		var bufferMenu:BuffMenu = MenuMgr.getInstance().getMenu("BuffMenu") as BuffMenu;
		if ( bufferMenu != null )
			bufferMenu.popSubMenu(true);
		isNeedResetPos = true;
	}
	
	public	function OnPopOver():void{
		scrollView.clearUIObject();
		effects = null;
		timestamps = null;
	}
}
