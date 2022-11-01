import System.Collections.Generic.List;

class TechnologyUpgrate extends PopMenu
{
	public var btnResearch : Button;
	public var btnInstant : Button;
	public var btnSpeedUp : Button;
	public var btnCancel : Button;
	public var titleLabel : Label;
	public var description : Label;
	public var skillIcon : Label;
	public var upTime : Label;
	public var cmTime : Label;
	public var time : Label;
	public var oldTime : Label;
	public var timeIcon : Label;
	public var price : Label;
	public var notMet : Label;
	public var progressBar : ProgressBarWithBg;
	public var skillLevel : Label;
	public var techBg : Label;
	public var l_curLevel : Label;
	public var l_nextLevel : Label;
	public var l_curLevelValue : Label;
	public var l_curNextLevelValue : Label;
	public var l_curMignt : Label;
	public var l_nextMight : Label;
	public var l_curMightValue : Label;
	public var l_nextMightValue : Label;

	public var requireContentClone : TechnologyRequireContent;
	public var requireContent : TechnologyRequireContent;

	public var tech : TechnologyInfo;

	private static var instance:TechnologyUpgrate;

	public static var ACTION_RESEARCH : String = "research";
	public static var ACTION_RESEARCH_PREVIOUS : String = "previous_research";
	private	  var isWaitingTech : boolean = false;
	
	public static function getInstance():TechnologyUpgrate
	{
		return instance;	
	}
	
	public function Init():void
	{
		super.Init();
		
		instance = this;	

		btnResearch.OnClick = handleResearch;
		btnInstant.OnClick = handleInstant;	
		btnCancel.OnClick = handleCancel;
		btnSpeedUp.OnClick = handleSpeedUp;

		btnCancel.txt = Datas.getArString("Common.Cancel");
		btnSpeedUp.txt = Datas.getArString("Common.Speedup");
		btnResearch.txt = Datas.getArString("Common.Research");
		btnInstant.txt = Datas.getArString("OpenAcademy.InstantResearch");

		requireContent = Instantiate(requireContentClone);
		requireContent.Init();
		progressBar.Init();
		progressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		progressBar.SetBg("pvpbuilding_hpmeter",TextureType.MAP17D3A_UI);
		skillIcon.tile = TextureMgr.instance().GetTechSkillSpt().GetTile(null);
		skillIcon.useTile = true;	
		
		isWaitingTech = false;
	}
	
	public function setWaitingFlagTrue() : void
	{
		isWaitingTech = true;
	}
	
	public function OnPush(param : Object)
	{
		super.OnPush(param);

		var temp : TechnologyInfo = param as TechnologyInfo;

		SetData(temp);
	}
	
	public function OnPop()
	{
		super.OnPop();
		Clear();
	}

	public function SetMightValue() : void 
	{
		l_curLevel.txt = Datas.getArString("TechModal.Lv") + tech.curLevel + ":";
		l_nextLevel.txt = Datas.getArString("TechModal.NextLv") + ":";
		l_curMignt.txt = Datas.getArString("TechModal.Might") + ":";
		l_nextMight.txt = Datas.getArString("TechModal.Might") + ":";
		l_curMightValue.txt = "+" + Technology.instance().getMightValue(tech.skillID,tech.curLevel).ToString();
		l_nextMightValue.txt = "+" + Technology.instance().getMightValue(tech.skillID,tech.curLevel + 1).ToString();

		var effectIndex : int = Technology.instance().getEffectIndex(tech.skillID,1);
		var curLevelValue : String = Technology.instance().getEffectString(tech.skillID,tech.curLevel,effectIndex);

		var nextLevelValue : String = Technology.instance().getEffectString(tech.skillID,tech.curLevel + 1,effectIndex);
		// 只有effect12不是百分比
		if(effectIndex == 1 || effectIndex == 2 || effectIndex == 3 || effectIndex == 4 /*effectIndex == 12*/)
		{
			if(curLevelValue != "" && _Global.IsNumber(curLevelValue))
			{
				l_curLevelValue.txt = "+" + curLevelValue + "%";
				l_curNextLevelValue.txt = "+" + nextLevelValue + "%";
			}
			else
			{
				if(curLevelValue != "")
				{
					var curArr : String[] = curLevelValue.Split("_"[0]);
					if(curArr.length > 1)
					{
						var curString : String = curArr[1];
						var lCurValue : float = _Global.FLOAT(curString) / 100;
		    			l_curLevelValue.txt = "+" + lCurValue + "%";
					}	
				}
				
				if(nextLevelValue != "")
				{
					var nextArr : String[] = nextLevelValue.Split("_"[0]);
					if(nextArr.length > 1)
					{
						var nextString : String = nextArr[1];
						var lNextValue : float = _Global.FLOAT(nextString) / 100;
						l_curNextLevelValue.txt = "+" + lNextValue + "%";
					}	    	
				}	    	
			}
		}
		else
		{
			var fCurLevelValue : float = _Global.FLOAT(curLevelValue) / 100;
			var fNextLevelValue : float = _Global.FLOAT(nextLevelValue) / 100;
			
			if(effectIndex == 12 || effectIndex == 5 || effectIndex == 27 || effectIndex == 28 || effectIndex == 29 || effectIndex == 30)
			{
				l_curLevelValue.txt = "+" + curLevelValue.ToString();
				l_curNextLevelValue.txt = "+" + nextLevelValue.ToString();
			}
			else
			{
				l_curLevelValue.txt = "+" + fCurLevelValue.ToString() + "%";
				l_curNextLevelValue.txt = "+" + fNextLevelValue.ToString() + "%";
			}			
		}

		if(tech.curLevel == tech.maxLevel)
		{
			l_nextLevel.SetVisible(false);
			l_curNextLevelValue.SetVisible(false);
			l_nextMight.SetVisible(false);
			l_nextMightValue.SetVisible(false);
		}
		else
		{
			l_nextLevel.SetVisible(true);
			l_curNextLevelValue.SetVisible(true);
			l_nextMight.SetVisible(true);
			l_nextMightValue.SetVisible(true);
		}

		if(tech.curLevel == 0)
		{
			if(effectIndex == 12 || effectIndex == 5 || effectIndex == 27 || effectIndex == 28 || effectIndex == 29 || effectIndex == 30)
			{
				l_curLevelValue.txt = "+0";
				l_curMightValue.txt = "+0";
			}
			else
			{
				l_curLevelValue.txt = "+0%";
				l_curMightValue.txt = "+0";
			}		
		}
	}

	public function SetData(temp : TechnologyInfo) : void
	{
		allHide();
		
		tech = temp;
		if(tech == null)
		{
			return;
		}

		titleLabel.txt = tech.name;
		description.txt = tech.dicscribe;
		skillLevel.txt = "Lv";
		//progressBar.SetTxt(tech.curLevel + "/" + tech.maxLevel);
		progressBar.SetValue(tech.curLevel , tech.maxLevel);
		skillIcon.tile = TextureMgr.instance().GetTechSkillSpt().GetTile(null);
		skillIcon.tile.name = tech.icon;

		SetMightValue();
		
		if(tech.curLevel >= tech.maxLevel)
		{
			//满级
			notMet.SetVisible(true);
			notMet.txt = Datas.getArString("BuildingModal.TopLevel");
			notMet.rect.y = 195;
			notMet.SetNormalTxtColor(FontColor.New_PageTab_Yellow);
			notMet.mystyle.normal.background = TextureMgr.instance().LoadTexture("popup_scroll_background", TextureType.DECORATION);
			return;
		}

		cmTime.txt = Datas.getArString("Common.Time") + ":" +  _Global.timeFormatStr(tech.time);
		cmTime.rect.x = 60;
		cmTime.SetNormalTxtColor(FontColor.New_Payment_Grey);

		var seed:HashObject = GameMain.instance().getSeed();
		//var rate:float = _Global.FLOAT(seed["buyUpgradeRateTechnology"].Value);
		var rate:float = _Global.FLOAT(seed["buyUpgradeRateTech"].Value);
		var techSeedupGemsCost : int =  Technology.instance().getInstantTechnologyGems(tech.time);
		var gemsCost : int =  _Global.INT32(techSeedupGemsCost*_Global.INT32(rate*10000) + 9999)/10000;
		price.txt =  "" + gemsCost;

		if(tech.isUnlock)
		{
			requireContent.showRequire(tech.requirements.ToArray());	

			var req_ok : boolean = requireContent.req_ok;
			// 研究的科技已满
			var full : boolean = Technology.instance().isTechnologyQueueFull();
			var techQueue : TechnologyQueueElement = Technology.instance().getTechnologyQueueById(tech.skillID);

//			noResearch();
//			return;

			// 点击的是此科技 正在研究
			if(techQueue != null)
			{
				btnSpeedUp.SetVisible(true);
				upTime.SetVisible(true);
			}
			else 
			{
				// 资源足够
				if(req_ok)
				{
					// 有在研究的科技 但不是此科技
					if(full)
					{
						var splicTest : int = 0;
						btnResearch.SetVisible(true);

						if(seed["directbuyType"] != null )
						splicTest = _Global.INT32(seed["directbuyType"]);
					
						if(splicTest == 0)	
						{
							btnResearch.changeToGreyNew();
						}
					
						btnResearch.clickParam = ACTION_RESEARCH_PREVIOUS;
						btnResearch.rect.x = 187;
						cmTime.SetNormalTxtColor(FontColor.New_Tech_Red);
						//cmTime.mystyle.normal.textColor = _Global.ARGB("0xFFFB3C48");
						cmTime.rect.x = 184;
						cmTime.SetVisible(true);
					}//没有研究的科技
					else
					{
						btnResearch.SetVisible(true);
						btnInstant.SetVisible(true);
						price.SetVisible(true);
						
						if(tech.time != tech.oldTime)
						{
							time.SetVisible(true);
							oldTime.SetVisible(true);
							timeIcon.SetVisible(true);
							
							timeIcon.txt = Datas.getArString("Common.Time") + ":" ;
							oldTime.txt =  _Global.timeFormatStr(tech.oldTime);
							time.txt = _Global.timeFormatStr(tech.time);					
						}
						else
						{							
							cmTime.SetVisible(true);
						}
					}
				}// 资源不够
				else
				{
					if(full)
					{
						// 显示资源不够 红条提示 什么按钮都不显示
						notMet.SetVisible(true);
						notMet.txt = Datas.getArString("OpenAcademy.ReqNotMet");
					}
					else
					{
						// 显示buy
						if(Utility.instance().checkInstantRequire(tech.requirements) && Player.getInstance().CanBuyInstantBuildOrResearch)
						{
							btnInstant.txt = Datas.getArString("ModalBuild.InstantUpgrade");
							btnInstant.SetVisible(true);
							btnInstant.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
							btnInstant.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
							btnInstant.rect.x = 187;
							price.rect.x = 167;
							
							
							var timePrice:int = Technology.instance().getInstantTechnologyGems(tech.time);
							var RsPrice:float = Technology.instance().techCostResToGems(tech.requirements,tech.curLevel + 1,tech.skillID);
							
							var totalCost:int = _Global.INT32(timePrice*_Global.INT32(rate*10000) + 9999)/10000+ Mathf.Ceil(RsPrice*rate);
						
							price.txt = "" + totalCost;
							price.SetVisible(true);
						}
						else
						{
							// 提示资源不够
							notMet.SetVisible(true);
							notMet.txt = Datas.getArString("OpenAcademy.ReqNotMet");
						}
					}
				}
			}
		}
		else
		{
			var unlock : List.<Requirement> = new List.<Requirement>();

			var i : int;
			var upDateReqs : List.<Requirement> = Technology.instance().GetUpdateReqs(tech.skillID,1);
			for(i = 0; i < upDateReqs.Count; i++)
			{
				unlock.Add(upDateReqs[i]);
			}

//			for (i = 0; i < tech.unlockBuilding.Count; i++) {
//				unlock.Add(tech.unlockBuilding[i]);
//			};

//			if(tech.unlockSkill.Count > 1)
//			{
//				var tempRe : Requirement = new Requirement();
//				tempRe.type = "11111";
//				tempRe.required = Datas.getArString("TechModal.SkillCondition");
//				unlock.Add(tempRe);
//			}
		
			for (i = 0; i < tech.unlockSkill.Count; i++) {
				unlock.Add(tech.unlockSkill[i]);
			};
			requireContent.showRequire(unlock.ToArray());
			
			// 解锁条件不足
			notMet.SetVisible(true);
			notMet.txt = Datas.getArString("TechModal.Unlock");
		}
		
		var isTechFull : boolean = Technology.instance().isTechnologyQueueFull();
		if(!isTechFull && isWaitingTech)
		{
			Technology.instance().upgradeTechnology(tech.skillID,tech.curLevel + 1);
			isWaitingTech = false;
		}
	}

	public function allHide()
	{
		btnResearch.SetVisible(false);
		btnInstant.SetVisible(false);
		btnCancel.SetVisible(false);
		btnSpeedUp.SetVisible(false);
		time.SetVisible(false);
		oldTime.SetVisible(false);
		timeIcon.SetVisible(false);
		cmTime.SetVisible(false);
		upTime.SetVisible(false);
		price.SetVisible(false);
		notMet.SetVisible(false);
		notMet.rect.y = 560;
		notMet.mystyle.normal.background = null;
		notMet.SetNormalTxtColor(FontColor.New_Tech_Red);

		btnCancel.txt = Datas.getArString("Common.Cancel");
		btnSpeedUp.txt = Datas.getArString("Common.Speedup");
		btnResearch.txt = Datas.getArString("Common.Research");
		btnInstant.txt = Datas.getArString("OpenAcademy.InstantResearch");
		btnInstant.rect.x = 315;
		price.rect.x = 298;

		btnResearch.clickParam = ACTION_RESEARCH;
		btnResearch.rect.x = 59;
		btnResearch.changeToBlueNew();
	}
	
	function Update() 
	{
		if(requireContent != null)
		{
			requireContent.Update();
		}
	}
	
	public function DrawItem()
	{
		btnResearch.Draw();
		btnInstant.Draw();
		btnSpeedUp.Draw();
		btnCancel.Draw();
		titleLabel.Draw();	
		description.Draw();	
		skillIcon.Draw();
		progressBar.Draw();
		skillLevel.Draw();

		if(tech.curLevel < tech.maxLevel)
		{
			if(requireContent != null)
			{
				requireContent.Draw();
			}
		}

		cmTime.Draw();
		time.Draw();
		oldTime.Draw();
		timeIcon.Draw();
		upTime.Draw();
		price.Draw();
		notMet.Draw();

		var techQueue : TechnologyQueueElement = Technology.instance().getTechnologyQueueById(tech.skillID);
		if(techQueue != null)
		{
			upTime.txt = Datas.getArString("Common.TimeRemining") +  _Global.timeFormatStr(techQueue.timeRemaining);
		}
		else
		{
			var firstQueue : TechnologyQueueElement = Technology.instance().getFirstQueue();
			if(firstQueue != null)
			{
				cmTime.txt = Datas.getArString("ModalBuild.AvailableTime") + _Global.timeFormatStrPlus(firstQueue.timeRemaining );
			}
		}

		techBg.Draw();
		l_curLevel.Draw();
		l_nextLevel.Draw();
		l_curLevelValue.Draw();
		l_curNextLevelValue.Draw();
		l_curMignt.Draw();
		l_nextMight.Draw();
		l_curMightValue.Draw();
		l_nextMightValue.Draw();
	}


	public function handleNotification(type : String, body : Object):void
	{
		switch(type)
		{
			case  Constant.Action.TECHNOLOGY_COMPLETE:
				var techTemp : TechnologyInfo = Technology.instance().GetTechnologySkillById(tech.skillID);
				if(techTemp != null)
				{
					SetData(techTemp);
				}
				break;
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				isWaitingTech = true;
				break;
		}
	}

	private function playEndSound():void
	{
		Invoke("playSound",1.5);
	}
	
	private function handleResearch(param : Object):void
	{
		switch(param)
		{
			case ACTION_RESEARCH:			
				Technology.instance().upgradeTechnology(tech.skillID,tech.curLevel + 1);
				break;

			case ACTION_RESEARCH_PREVIOUS:
				var element:QueueItem = Technology.instance().getFirstQueue();
				if(element != null)
				{
					var aditionGems:int = SpeedUp.instance().getTechGemCost(element.timeRemaining);
					var okFunc:Function = function()
					{
						Utility.instance().instantFinishPreQueue(element, aditionGems, SpeedUp.PLAYER_ACTION_TECHNOLOGYTREE);						
					};
					
					var open : boolean = SpeedUp.instance().GetSpeedUpIsOpenHint();
					if(aditionGems >= GameMain.instance().gemsMaxCost() && !open)
					{
						var contentData : Hashtable = new Hashtable(
						{
							"price":aditionGems
						});
			            MenuMgr.getInstance().PushMenu("SpeedUpDialog", contentData , "trans_zoomComp"); 
						MenuMgr.getInstance().getMenuAndCall("SpeedUpDialog", function(menu : KBNMenu) {
							var SpeedUpDialogmenu:SpeedUpDialog = menu as SpeedUpDialog;
							if(SpeedUpDialogmenu != null)
						   {
							SpeedUpDialogmenu.setAction(okFunc);
						   }
						});
					}
					else
					{
						okFunc();
					}	
				}
				break;	

			default:
				break;
		}	
	}
	
	private function handleInstant():void
	{
		var requireEnough : boolean = Utility.instance().checkInstantRequire(tech.requirements);
		var	aditionGems:float = requireEnough ? Technology.instance().techCostResToGems(tech.requirements,tech.curLevel + 1,tech.skillID) : 0;
		Technology.instance().instantTechnology(tech.skillID,tech.curLevel + 1,playEndSound,tech.requirements.ToArray(),aditionGems);	
	}

	private function handleCancel():void
	{
		
	}

	private function handleSpeedUp():void
	{
		var curCid : int = GameMain.instance().getCurCityId();
		var techQueue : TechnologyQueueElement = Technology.instance().getTechnologyQueueById(tech.skillID);
		MenuMgr.getInstance().PushMenu("SpeedUpMenu",techQueue, "trans_zoomComp");
	}

	public function Clear()
	{
		if(requireContent != null)
		{
			requireContent.Clear();
			TryDestroy(requireContent);
		}
	}
}