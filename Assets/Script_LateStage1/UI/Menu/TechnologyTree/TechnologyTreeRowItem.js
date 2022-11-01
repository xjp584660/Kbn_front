import System.Collections.Generic;
/*规则：第一行没有上面横线 每个显示的技能上竖线一定有 下竖线不一定有   所有的点，线默认都隐藏*/
public class TechnologyTreeRowItem extends UIObject
{
	// 技能横线
	@System.Serializable
	public class SkillAcrossUpLinePanel
	{
		@SerializeField public var skillUpLine : List.<Label>;
		@SerializeField public var skillUpLineGrey : List.<Label>;
		@SerializeField public var skillUpPoint : List.<Label>;
		@SerializeField public var skillUpPointGrey : List.<Label>;
	}

	public var skillAcrossUpLinePanel : SkillAcrossUpLinePanel;

	// 技能Panel
	@System.Serializable
	public class SkillPanel 
	{
		@SerializeField public var skillLight : Label;
		@SerializeField public var skillBack : Button;
		@SerializeField public var skillIcon : Label;
		@SerializeField public var skillName : Label;
		@SerializeField public var skillLevel : Label;
		@SerializeField public var skillUpLine : Label;
		@SerializeField public var skillDownLine : Label;
		@SerializeField public var skillUpLineGrey : Label;
		@SerializeField public var skillDwonLineGrey : Label;
		@SerializeField public var skillLock : Label;
		@SerializeField public var skillTimeBack : Label;
		@SerializeField public var skillTimeIcon : Label;
		@SerializeField public var skillTimeLabel : Label;
		@SerializeField public var progressBar : ProgressBarWithBg;
		@SerializeField public var skillID : int;
		// 是否是解锁技能  （一个技能解锁条件需要此技能） 不是解锁技能一定没有下竖线
		@SerializeField public var isUnlockSkill : boolean;
		@SerializeField public var isLight : boolean;
		@SerializeField public var isIconGrey : boolean;
		@SerializeField public var isResearch : boolean;
	}

	@SerializeField
	public var skillPanels : List.<SkillPanel>;

	public var composeUIObjs : List.<ComposedUIObj>;

	public var data : OneRowSkill;
	public var rowCount : int;

	// rowCount 1 第一行  999 最后一行  0 其他
	public function Init(param : OneRowSkill, rowCount : int) : void 
	{
		super.Init();
		data = param as OneRowSkill;	
		this.rowCount = rowCount;	
		ResetPanelInfo();
		DrawSkillPanelAndSetData();
		SetLightLinePassPointSetVisible();
		SetButtonClick();
	}

	public function Update()
	{
		
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);

		for(var i : int = 0; i < data.rowSkill.Count;++i)
		{
			if(data.rowSkill[i] != 0)
			{
				composeUIObjs[i].Draw();

				if(skillPanels[i].isResearch)
				{
					var techQueue : TechnologyQueueElement = Technology.instance().getTechnologyQueueById(skillPanels[i].skillID);
					if(techQueue != null)
					{
						skillPanels[i].skillTimeLabel.txt = _Global.timeFormatStrPlus(techQueue.timeRemaining);
						skillPanels[i].skillLight.SetVisible(true);
					}
				}
				else
				{
					skillPanels[i].skillLight.SetVisible(false);
				}
			}
		}
		
		if(rowCount == 1)
		{
			LineFlag(true);
		}
		else if(rowCount == 999)
		{
			DrawSkillAcrossUpLinePanel();
			LineFlag(false);
		}
		else
		{
			DrawSkillAcrossUpLinePanel();
		}

		GUI.EndGroup();
	}

	private function SetButtonClick()
	{
		for(var i : int = 0; i < skillPanels.Count;++i)
		{
			skillPanels[i].skillBack.OnClick = onClick;
		}
	}

	protected function onClick(param : Object)
	{
		var skillID : int = _Global.INT32(param);
		var tech : TechnologyInfo = Technology.instance().GetTechnologySkillById(skillID);
		MenuMgr.getInstance().sendNotification(Constant.Action.TECHNOLOGY_SKILL_ON_CLICK,tech);
	}

	// 设置前置技能的下线
	public function SetPreposeSkillDownLine(skillID : int, isLight : boolean) : void
	{
		for(var i : int = 0; i < skillPanels.Count;++i)
		{
			if(skillPanels[i].skillID == skillID)
			{
				// 本身技能和前置技能都亮
				if(skillPanels[i].isLight && isLight)
				{		
					skillPanels[i].skillDownLine.SetVisible(true);
					skillPanels[i].skillDwonLineGrey.SetVisible(false);		
				}
				else
				{
					// 亮的优先 （亮的线或点被显示过就不会隐藏）
					if(skillPanels[i].skillDownLine.isVisible())
					{
						skillPanels[i].skillDwonLineGrey.SetVisible(false);
					}
					else
					{
						skillPanels[i].skillDownLine.SetVisible(false);
						skillPanels[i].skillDwonLineGrey.SetVisible(true);
					}
				}
			}
		}
	}

	//亮线经过的点设置成亮点
	public function SetLightLinePassPointSetVisible()
	{
		for(var i : int = 0; i < data.rowSkill.Count;++i)
		{
			if(data.rowSkill[i] != 0)
			{
				var skillID : int = data.rowSkill[i];
				var index0 : int = Technology.instance().GetIndexOfRow(skillID);
				var unlock : String = Technology.instance().GetUnlockSkillCondition(skillID);
				if(unlock == "0")
				{
					continue;
				}
				var msgArr : String[] = unlock.Split(";"[0]);
				for(var j : int = 0; j < msgArr.length;++j)
				{
					var arr : String[] = msgArr[j].Split("_"[0]);
					var id : int = _Global.INT32(arr[1]);

					var index1 : int = Technology.instance().GetIndexOfRow(id);
					
					// 设置点  本技能及本技能的前置技能处显示点 (当本技能和前置技能在一列时并且没有与横线交叉时不显示点)
					if(index1 == index0)
					{
						var preIndex0 : int = index1 - 1;
						var nextIndex0 : int = index1 + 1;
						//此点的左边横线是亮的
						if(preIndex0 >= 0)
						{
							if(skillAcrossUpLinePanel.skillUpLine[preIndex0].isVisible() )
							{
								skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(true);
								skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
							}

							if(skillAcrossUpLinePanel.skillUpLineGrey[preIndex0].isVisible())
							{
								skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(true);
								if(skillPanels[index1].skillUpLine.isVisible())
								{
									skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
									skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(true);
								}
							}
						}
		
						//此点的右边横线是亮的
						if(nextIndex0 < skillAcrossUpLinePanel.skillUpLine.Count)
						{
							if(skillAcrossUpLinePanel.skillUpLine[nextIndex0].isVisible() )
							{
								skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(true);
								skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
							}

							if(skillAcrossUpLinePanel.skillUpLineGrey[nextIndex0].isVisible())
							{
								skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(true);

								if(skillPanels[index1].skillUpLine.isVisible())
								{
									skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
									skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(true);
								}
							}
						}
					}
				}
			}
		}
	}

	//设置横线
	private function DrawSkillPanelAndSetData() : void 
	{
		for(var i : int = 0; i < data.rowSkill.Count;++i)
		{
			//设置每个按钮的技能id
			skillPanels[i].skillID = data.rowSkill[i];
			skillPanels[i].skillBack.clickParam = data.rowSkill[i];
			skillPanels[i].progressBar.Init();
			skillPanels[i].progressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
			skillPanels[i].progressBar.SetBg("pvpbuilding_hpmeter",TextureType.MAP17D3A_UI);

			if(data.rowSkill[i] != 0)
			{
				var skillID : int = data.rowSkill[i];
				var tech : TechnologyInfo = Technology.instance().GetTechnologySkillById(skillID);
				skillPanels[i].skillIcon.tile = TextureMgr.instance().GetTechSkillSpt().GetTile(null);
				skillPanels[i].skillIcon.tile.name = tech.icon;
				//是灰的还是亮的
				var isLight : boolean = tech.isLight;
				skillPanels[i].isLight = isLight;
				skillPanels[i].isIconGrey = !isLight;
				skillPanels[i].skillIcon.grey = !isLight;

				var isResearch : boolean = tech.isResearch;
				skillPanels[i].isResearch = isResearch;
				skillPanels[i].skillTimeLabel.SetVisible(isResearch);	
				skillPanels[i].skillTimeIcon.SetVisible(isResearch);
				skillPanels[i].skillTimeBack.SetVisible(isResearch);
	
				skillPanels[i].skillLock.SetVisible(!tech.isUnlock);
				//解锁的技能上竖线是显示的 上灰竖线是隐藏的  未解锁反之。。。
				skillPanels[i].skillUpLine.SetVisible(isLight);
				skillPanels[i].skillUpLineGrey.SetVisible(!isLight);
				//名字
				skillPanels[i].skillName.txt = tech.name;
				if(isLight)
				{
					skillPanels[i].skillName.normalTxtColor = FontColor.New_PageTab_Yellow;
					skillPanels[i].progressBar.SetColor(FontColor.Button_White);
				}
				else
				{
					skillPanels[i].skillName.normalTxtColor = FontColor.Sale_Gray;
					skillPanels[i].progressBar.SetColor(FontColor.Sale_Gray);
				}
				skillPanels[i].skillLevel.txt = "Lv";
				//skillPanels[i].progressBar.SetTxt(tech.curLevel + "/" + tech.maxLevel);
				skillPanels[i].progressBar.SetValue(tech.curLevel , tech.maxLevel);

				// 是否是解锁技能 是解锁技能才显示下面的竖线
				var isUnlockSkill : boolean = Technology.instance().IsUnlockSkill(skillID);
				skillPanels[i].skillDownLine.SetVisible(false);
				skillPanels[i].skillDwonLineGrey.SetVisible(false);
				skillPanels[i].isUnlockSkill = isUnlockSkill;

				// 本技能在横排的位置 
				var index0 : int = Technology.instance().GetIndexOfRow(skillID);
				// 设置点  本技能及本技能的前置技能处显示点 
				// 亮的优先 
				if(skillAcrossUpLinePanel.skillUpPoint[index0].isVisible())
				{
					skillAcrossUpLinePanel.skillUpPointGrey[index0].SetVisible(false);
				}
				else
				{
					skillAcrossUpLinePanel.skillUpPoint[index0].SetVisible(isLight);
					skillAcrossUpLinePanel.skillUpPointGrey[index0].SetVisible(!isLight);
				}	
				
				var unlock : String = Technology.instance().GetUnlockSkillCondition(skillID);
				if(unlock == "0")
				{
					continue;
				}
				var msgArr : String[] = unlock.Split(";"[0]);
				for(var j : int = 0; j < msgArr.length;++j)
				{
					var arr : String[] = msgArr[j].Split("_"[0]);
					var id : int = _Global.INT32(arr[1]);

					var techTemp : TechnologyInfo = Technology.instance().GetTechnologySkillById(id);

					//当前技能解锁 他的前置技能的下亮竖线是显示的 下灰竖线是隐藏的 
			        var menu : TechnologyTreeBuilding = KBN.MenuMgr.instance.getMenu("TechnologyTreeBuilding") as TechnologyTreeBuilding;
			        if(menu != null)
			        {	// 本身技能没亮  不亮   本身技能亮了前置技能没亮  不亮   本身技能和前置技能都亮才亮
			       		menu.SetPreposeSkillDownLine(id, isLight);
			        }
			
					var index1 : int = Technology.instance().GetIndexOfRow(id);
					
					// 显示横线
					if(index1 > index0)
					{
						for(var k : int = index0; k < index1;++k)
						{
							// 亮的优先 
							if(skillAcrossUpLinePanel.skillUpLine[k].isVisible())
							{
								skillAcrossUpLinePanel.skillUpLineGrey[k].SetVisible(false);
							}
							else
							{
								// 当前和前置技能都亮  横线才亮
								if(isLight && techTemp.isLight)
								{
									skillAcrossUpLinePanel.skillUpLine[k].SetVisible(true);
									skillAcrossUpLinePanel.skillUpLineGrey[k].SetVisible(false);
								}
								else
								{
									skillAcrossUpLinePanel.skillUpLine[k].SetVisible(false);
									skillAcrossUpLinePanel.skillUpLineGrey[k].SetVisible(true);
								}
							}							
						}
					}
					else if(index1 < index0)
					{
						for(var l : int = index1; l < index0;++l)
						{
							// 亮的优先 
							if(skillAcrossUpLinePanel.skillUpLine[l].isVisible())
							{
								skillAcrossUpLinePanel.skillUpLineGrey[l].SetVisible(false);
							}
							else
							{
									// 当前和前置技能都亮  横线才亮
								if(isLight && techTemp.isLight)
								{
									skillAcrossUpLinePanel.skillUpLine[l].SetVisible(true);
									skillAcrossUpLinePanel.skillUpLineGrey[l].SetVisible(false);
								}
								else
								{
									skillAcrossUpLinePanel.skillUpLine[l].SetVisible(false);
									skillAcrossUpLinePanel.skillUpLineGrey[l].SetVisible(true);
								}
							}
						}
					}

					// 设置点  本技能及本技能的前置技能处显示点 (当本技能和前置技能在一列时并且没有与横线交叉时不显示点)
					if(index1 != index0)
					{
						// 亮的优先 
						if(skillAcrossUpLinePanel.skillUpPoint[index1].isVisible())
						{
							skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
						}
						else
						{
							if(isLight && techTemp.isLight)
							{
								skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(true);
								skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
							}
							else
							{
								skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(false);
								skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(true);
							}
						}						
					}
					else
					{
						skillAcrossUpLinePanel.skillUpPoint[index1].SetVisible(false);
						skillAcrossUpLinePanel.skillUpPointGrey[index1].SetVisible(false);
					}
				}
			}
		}
	}

	private function DrawSkillAcrossUpLinePanel() : void 
	{
		for (var i = 0; i < skillAcrossUpLinePanel.skillUpLine.Count; i++) {
			skillAcrossUpLinePanel.skillUpLine[i].Draw();
			skillAcrossUpLinePanel.skillUpLineGrey[i].Draw();
		};

		for (var j = 0; j < skillAcrossUpLinePanel.skillUpPoint.Count; j++) {
			skillAcrossUpLinePanel.skillUpPointGrey[j].Draw();
			skillAcrossUpLinePanel.skillUpPoint[j].Draw();			
		};
	}

	// 第一行和最后一行的竖线隐藏
	private function LineFlag(up : boolean) : void
	{
		for(var i : int = 0; i < skillPanels.Count;++i)
		{
			if(up)
			{
				skillPanels[i].skillUpLine.SetVisible(false);
				skillPanels[i].skillUpLineGrey.SetVisible(false);
			}
			else
			{
				skillPanels[i].skillDownLine.SetVisible(false);
				skillPanels[i].skillDwonLineGrey.SetVisible(false);
			}
		}
	}

	// 所有点和线默认都隐藏 
	private function ResetPanelInfo() : void
	{
		var i : int;
		for(i = 0; i < skillPanels.Count;++i)
		{
			skillPanels[i].skillUpLine.SetVisible(false);
			skillPanels[i].skillDownLine.SetVisible(false);
			skillPanels[i].skillUpLineGrey.SetVisible(false);
			skillPanels[i].skillDwonLineGrey.SetVisible(false);		
			skillPanels[i].skillTimeLabel.SetVisible(false);	
			skillPanels[i].skillTimeIcon.SetVisible(false);
			skillPanels[i].skillTimeBack.SetVisible(false);
			skillPanels[i].skillLight.SetVisible(false);
			skillPanels[i].skillIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
			skillPanels[i].skillIcon.useTile = true;		
		}

		for (i = 0; i < skillAcrossUpLinePanel.skillUpLine.Count; i++) {
			skillAcrossUpLinePanel.skillUpLine[i].SetVisible(false);
			skillAcrossUpLinePanel.skillUpLineGrey[i].SetVisible(false);
		};

		for (i = 0; i < skillAcrossUpLinePanel.skillUpPoint.Count; i++) {
			skillAcrossUpLinePanel.skillUpPoint[i].SetVisible(false);
			skillAcrossUpLinePanel.skillUpPointGrey[i].SetVisible(false);
		};
	}

	public function Clear() : void 
	{

	}
}