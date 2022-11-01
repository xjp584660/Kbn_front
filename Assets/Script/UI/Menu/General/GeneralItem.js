
class	GeneralItem	extends	GeneralReincarnationInfo
{

	public	var	experience:Label;
	public	var	percentBar:PercentBar;
	public	var	separateLine:Label;
	public	var	flag:Label;
	
	public  var attackIcon:Label;
	public  var attackContent:Label;
	public  var healthIcon:Label;
	public  var healthContent:Label;
	public  var troopCntIcon:Label;
	
	public var mask:Label;
	public var lockButton:Button;
	public var renameButton:Button;
	private var knightID:int;
	// LiHaojie 2013.08.02: Add dress gear button
	public var dressBtn	:Button;
	
	public function Init():void
	{
		separateLine.setBackground("between line_list_small", TextureType.DECORATION);
		percentBar.Init();
		mask.rect = icon.rect;
		mask.setBackground("icon_lock",TextureType.ICON);
		dressBtn.SetVisible(GearSysController.IsOpenGearSys());
		lockButton.txt = Datas.getArString("Knights.Unlock");
		lockButton.OnClick = OnUnLockClicked;
		renameButton.OnClick = OnRenameKnight;
		Lock();
	}

	public	function	Draw(){
		GUI.BeginGroup(rect);		
			icon.Draw();
			description.Draw();
			
			percentBar.Draw();
			experience.Draw();
			separateLine.Draw();

			levelIcon.Draw();
			attackIcon.Draw();
			attackContent.Draw();
			healthIcon.Draw();
			healthContent.Draw();
			troopCntIcon.Draw();
			
			this.prot_drawItems();
			flag.Draw();

			btnSelect.Draw();
			dressBtn.Draw();
			lockButton.Draw();
			renameButton.Draw();
			mask.Draw();
		GUI.EndGroup();
	}
	
	public function Lock()
	{
		mask.SetVisible(true);
		btnSelect.SetVisible(false);
		dressBtn.SetVisible(false);
		lockButton.SetVisible(true);
	}
	public function UnLock()
	{
		mask.SetVisible(false);
		btnSelect.SetVisible(true);
		dressBtn.SetVisible(true);
		lockButton.SetVisible(false);
		
	}
	
	private function OnRenameKnight()
	{
		MenuMgr.getInstance().PushMenu("RenameKnightMenu", {"kid":knightID}, "trans_zoomComp");
	}
	
	private function OnUnLockClicked()
	{
		if(knightID <= 0) return;
		UnityNet.UnlockKnights(knightID,UnLockOK,UnLockError);
	}
	
	private function UnLockOK(hash:HashObject)
	{
		if(hash == null) return;
		var knight:Knight = GearManager.Instance().GearKnights.GetKnight(knightID);
		var knightName:String = General.singleton.getKnightShowName(knight.Name,GameMain.instance().getCityOrderWithCityId(knight.CityID));
		if(knight == null) 
		{	
			_Global.Log("ming UnLockOK knight does not have at all.");
			return;
		}
		
		var list:HashObject = hash["gearlist"];
		if(list != null)
		{
			for(var i:int = 1;i<=5;i++)
			{
				var arm:Arm = new Arm();
				arm.Parse(list["pos" + i]);
				GearManager.Instance().GearWeaponry.AddArm(arm);
				GearManager.Instance().PutArm(arm,knight);
			}
		}
		UnLock();
		knight.Locked = 0;
		knight.SynLocked();
		
		var format:String = String.Format(Datas.getArString("ToasterPrompt.PumpkinKnightUsed"),knightName);
		MenuMgr.getInstance().PushMessage(format);
		if(hash["costItem"] != null)
			MyItems.instance().subtractItem(_Global.INT32(hash["costItem"]));
	}
	private function UnLockError(message:String,code:String)
	{
		if(code.Trim() != "236") return;
		var knight:Knight = GearManager.Instance().GearKnights.GetKnight(knightID);
		var knightName:String = General.singleton.getKnightShowName(knight.Name,GameMain.instance().getCityOrderWithCityId(knight.CityID));
		var itemName:String = Datas.getArString("itemName.i" + message);
		var format:String = String.Format(Datas.getArString("ToasterPrompt.ItemRequired"),itemName,knightName);
		MenuMgr.getInstance().PushMessage(format);
	}
	
	
	
	public function SetRowData(data:Object)
	{
		var hashData : HashObject = data as HashObject;
		var knightId:int = _Global.INT32(hashData["knightId"]);
		var name:int = _Global.INT32(hashData["knightName"]);
		var level:int = _Global.INT32(hashData["knightLevel"]);
		var locked:boolean = (_Global.INT32(hashData["knightLocked"]) == 1);
		var isStar : boolean = Knight.IsStarLevel(level);
		knightID = knightId;
		// var tData:HashObject = data as HashObject;
		var posId:int = General.instance().getPosition(knightId.ToString());
		var displayLevel : String = Knight.GetShowerLevel(level);

		this.SetData(isStar);
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();

		if( posId > 0 ){
			flag.useTile = true;
			//flag.tile.name = "position" + (posId - 10) + "-1";
			flag.tile = iconSpt.GetTile("position" + (posId - 10) + "-1");
			//	flag.image = TextureMgr.instance().LoadTexture("position" + (posId - 10) + "-1", TextureType.ICON_ELSE);//Resources.Load("Textures/UI/icon/position" + (posId - 10) + "-1");
		}else{
			flag.image = null;
			flag.tile = null;
			flag.useTile = false;
		}
		var expLv:Array = General.instance().calcExpLvl( knightId.ToString() );

		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		icon.useTile = true;
		icon.tile = texMgr.GeneralSpt().GetTile(General.getGeneralTextureName(name.ToString(), curCityOrder ));
		//icon.tile.name = General.getGeneralTextureName(name.ToString(), curCityOrder );
	//	icon.image = TextureMgr.instance().LoadTexture("gi" + data["knightName"], TextureType.ICON_GENERAL);//Resources.Load("Textures/UI/icon/icon_general/gi" + data["knightName"]);
//		var arStrings:Object = Datas.instance().arStrings();

		//title.txt = General.getKnightShowName(name.ToString(), curCityOrder);//Datas.getArString("Generals"]["GenName" + data["knightName"]];
		if(General.instance().isRenamedKnithtName(knightId))
		{
			title.SetNormalTxtColor(FontColor.New_KnightName_Blue);
		}
		else
		{
			title.SetNormalTxtColor(FontColor.Description_Dark);
		}
		
		title.txt = General.instance().getKnightName(knightId);
		var curKnight:Knight = GearManager.Instance().GearKnights.GetKnight(knightId);
		
		if(attackContent)
		{
			if (null == curKnight)
			{
				attackContent.txt = "" + level;
				healthContent.txt = "" + level;
			}
			else
			{
				attackContent.txt = "" + GearManager.Instance().GetShowKnightAttack(curKnight);
				healthContent.txt = "" + GearManager.Instance().GetShowKnightLife(curKnight);
			}
		}
		
		if (null == curKnight)
			troopCntIcon.txt = "0";
		else
			troopCntIcon.txt = "" + GearManager.Instance().GetKnightTroop(curKnight);

		description.txt = displayLevel;//expLv[1];
		experience.txt = expLv[0] + "/" + expLv[2];
		percentBar.Init(expLv[0], expLv[2]);
		
		btnSelect.txt = Datas.getArString("Common.PlusExp_button");
		btnSelect.OnClick = function( param:Object ){
			MenuMgr.getInstance().PushMenu("GenExpBoostMenu", {"kid":knightId}, "trans_zoomComp");
		};
		
		dressBtn.txt = Datas.getArString("Gear.EquipBtn");
		dressBtn.OnClick = function( param:Object )
		{
			var yesFunc:Function = function()
			{
//				var curMenu:Menu = MenuMgr.getInstance().GetCurMenu();
//				if(curMenu != null && curMenu instanceof GeneralMenu)
//				{
//					GearData.Instance().SetGearPreMenu("GeneralMenu");
//					MenuMgr.getInstance().PopMenu("");
//				}
				BuildingDecMgr.getInstance().deleteDecoWithType(BuildingDecMgr.GearDecoType.GearSystem);
				MenuMgr.getInstance().PushMenu("GearMenu", [knightId,"back"], "");
//				GearData.Instance().GearLastTab = 0;
			};
			
			var noFunc:Function = function(resultDatas:Array)
			{
				var infoDatas:Array = new Array();
				for (var iCondition:SystemCfgCondition in resultDatas)
				{
					var tType:int = _Global.INT32(iCondition.type);
					if (tType == SystemCfgConditionType.BuildingLevel)
					{
						var tBuildingTypeId:int = _Global.INT32(iCondition.key);
						var tBuildingNeedLevel:int = _Global.INT32(iCondition.val);
						var tBuildingName:String = Datas.getArString("buildingName."+"b" + tBuildingTypeId);
						
						infoDatas.Push(tBuildingNeedLevel);
						infoDatas.Push(tBuildingName);
					}
				}
				
				if (infoDatas.Count != 4)
				{
					_Global.Log("Not match the Gear.BlacksmithUnlockDesc paramters!!!");
				}
				var contentText:String = String.Format(Datas.getArString("Gear.BlacksmithUnlockDesc"), 
													infoDatas[0], infoDatas[1], infoDatas[2], infoDatas[3]);
				GearSysHelpUtils.PopupDefaultDialog("", contentText, false);
			};
			
			GearSysController.CheckIsGearSysUnlocked(yesFunc, noFunc);
		};
		
		if(locked)
			Lock();
		else
			UnLock();
		
	}
}