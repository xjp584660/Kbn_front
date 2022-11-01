


class OverviewContent extends UIObject
{

	@Space(30) @Header("----------OverviewContent----------")




	public var toolBar:ToolBar;
	
	public var sliderTax:Slider;
	//public var sliderBg:Label;
	public var btnChangeTax:Button;
	public var labelPercentSign:SimpleLabel;
	public var inputTaxNum:InputText;
	
	public var labelTaxRate:Label;
	
//	public var iconAdd:Label;
	public var labelMiniNum:Label;
	public var labelMaxNum:Label;
	public var labelPercent:Label;
	public var bgTaxInput:Label;
	public var bgTaxRate:Label;
	
	public var labelTaxRateTip:Label;
	
	public var resourceContent:ResourceViewObj;
	public var resourceSubContent: ResourceItemObj;



	/*------城堡皮肤个性化Personalize界面内容----------*/

	private var citySkinController: NavigatorController;/*切换 city skin */

	public var citySkinView: CitySkinView;
	public var citySkinPropView: CitySkinPropView;

	private var lastViewIndex: int;/* 在选中 城堡界面之前的一个tab界面 的 索引 */
	private var isShowedCitySkinPropView: boolean;/* 是否已经显示了 Cityskin 的道具界面 */
	/*---------------------------------------------*/


	private var controller:NavigatorController;
	private var selectedToolBarIndex: int;/*0:city  1:production  2:personalize*/

	/*resource data*/
	private var g_curProduction:Array;
	private var g_upKeep:long;
	private var g_baseProduction:float[];
	private var g_quartermasterBonus:Array;
	private var g_researchBonus:Array;	
	private var g_wildsBonus:Array;
	private var g_itemBonus:Array;
	private var g_otherBonus:Array;
	private var g_totalBonus:float[];
	private var g_totalBonusAmount:Array;
	private var totalBonus:float;
	private var g_curCityID:int;
	private var seed:HashObject;
	private var g_lastTax:int;




	function Init()
	{
		toolBar.Init();
		
		toolBar.selectedIndex = 0;
		toolBar.indexChangedFunc = indexChangedFunc;
		selectedToolBarIndex = 0;
		lastViewIndex = toolBar.selectedIndex;

		sliderTax.Init(100);
		sliderTax.sliderStyle.normal.background = TextureMgr.instance().LoadTexture("Drag feet_train troops2",TextureType.DECORATION);
		sliderTax.thumbStyle.normal.background = TextureMgr.instance().LoadTexture("button_Drag feet_normal",TextureType.BUTTON);
		sliderTax.thumbStyle.active.background = TextureMgr.instance().LoadTexture("button_Drag feet_down",TextureType.BUTTON);
		sliderTax.thumbStyle.onNormal.background = TextureMgr.instance().LoadTexture("button_Drag feet_down",TextureType.BUTTON);
		sliderTax.valueChangedFunc = handlerSliderValueChanged;
		sliderTax.sliderStyle.padding.left = 35;
		sliderTax.sliderStyle.padding.right = 30;
		sliderTax.thumbStyle.padding.right = 3;
		sliderTax.rect = new Rect(187, 320, 390, 31);
		
		//sliderBg.Init();

		btnChangeTax.Init();
		
		inputTaxNum.type = TouchScreenKeyboardType.NumberPad;
		inputTaxNum.filterInputFunc = handlerFilterInputFunc;
		inputTaxNum.inputDoneFunc = handlerInputDoneFunc;
		inputTaxNum.Init(); 
		inputTaxNum.txt = "" + g_lastTax;
		labelTaxRateTip.txt = Datas.getArString("OpenPalace.changeTaxRateTip");

		labelTaxRate.Init();

		labelMiniNum.Init();
		labelMaxNum.Init();
		labelPercent.Init();
		labelPercentSign.Init();
		bgTaxInput.Init();
		bgTaxRate.Init();	

		controller = new NavigatorController();
		controller.Init();


		citySkinController = new NavigatorController();
		citySkinController.Init();
		isShowedCitySkinPropView = false;

		citySkinView.Init();
		citySkinPropView.Init();
	}
	
	public function get navigatorController():NavigatorController
	{
		return controller;
	}
	
	private function indexChangedFunc(index:int):void
	{
		selectedToolBarIndex = index;

		
		if (selectedToolBarIndex != 2) {
			lastViewIndex = index;/* 当不是城堡皮肤时候 记录上一个界面，以便之后在次显示时 使用 */
		}

		if (selectedToolBarIndex == 1) /*production*/
		{
			controller.push(resourceContent);
		}

		else if (selectedToolBarIndex == 2)/*Personalize city skin*/
		{
			if (!isShowedCitySkinPropView) {
				citySkinView.SetListData();
				citySkinController.push(citySkinView);
			}
		}


	}

	function Draw()
	{
		toolBar.Draw();
		
		if(selectedToolBarIndex == 0)/*city*/
		{
			
			bgTaxRate.Draw();
			bgTaxInput.Draw();	
			/*iconAdd.Draw();*/
			labelTaxRateTip.Draw();
			
			/*sliderBg.Draw();*/
			sliderTax.Draw();
			
			btnChangeTax.Draw();
			inputTaxNum.Draw();
			
			labelPercentSign.Draw();
			
			labelTaxRate.Draw();

					
			labelMiniNum.Draw();
			labelMaxNum.Draw();
			labelPercent.Draw();
			
			
		}
		else if (selectedToolBarIndex == 1)/*production*/
		{
			controller.DrawItems();		
		}

		else if (selectedToolBarIndex == 2)/*Personalize city skin*/
		{ 
			citySkinController.DrawItems();
		}		
	}
	
	private function handleChangeTax()
	{
		g_lastTax = _Global.INT32(inputTaxNum.txt);
		Castle.instance().changeTaxModal(g_lastTax, successChangeTax);
	}
	
	private function successChangeTax(result:HashObject)
	{
		if(result["updateSeed"])
		{
			UpdateSeed.instance().update_seed(result["updateSeed"]);
			var taxRate:int = _Global.INT32(result["updateSeed"]["city"][g_curCityID + ""]["production"]["taxRate"]);
			seed["citystats"]['city' + g_curCityID]["gold"][_Global.ap + 1].Value = taxRate;
			sliderTax.SetCurValue(taxRate);
			g_lastTax = taxRate;
			InitResourceData();
			setData();
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.ChangeTaxSuccess"));
			
			/*--------------------------------- zhou wei */
			Quests.instance().checkForElse();
			/*---------------------------------*/
		}
	}
	
	function Update()
	{
		if(selectedToolBarIndex == 1)
		{
			controller.u_FixedUpdate();
		}
		else if (selectedToolBarIndex == 2)	/*Personalize city skin*/
		{
			citySkinController.u_FixedUpdate();
		}
	}



	public function onPop() {
		controller.pop3Root();
		citySkinController.pop3Root();
		toolBar.selectedIndex = 0;

		citySkinPropView.Clear();
		citySkinView.Clear();
	}

	function setData()
	{
		g_curCityID = GameMain.instance().getCurCityId();
		seed = GameMain.instance().getSeed();	
	
		/*var arString:Object = Datas.instance().arStrings();*/
		toolBar.toolbarStrings = [Datas.getArString("Common.City"), Datas.getArString("Common.Production"), Datas.getArString("CastleSkin.Skin")];
		//toolBar.toolbarStrings = ["City", "Production", "Personalize"];
		btnChangeTax.txt = Datas.getArString("OpenPalace.chgtaxrate");
		btnChangeTax.OnClick = handleChangeTax;

		labelTaxRate.SetFont(FontSize.Font_20,FontType.TREBUC);
		labelTaxRate.SetNormalTxtColor(FontColor.Title);
		labelTaxRate.txt = Datas.getArString("ChangeTax.TaxRate");

		g_lastTax = _Global.INT32(seed["citystats"]['city'+g_curCityID]["gold"][_Global.ap + 1]);		
		inputTaxNum.txt = g_lastTax + "";
		sliderTax.SetCurValue(g_lastTax);

		var temp =seed["citystats"]['city' + g_curCityID]["gate"];

		InitResourceData();
		resourceContent.setData(g_curProduction, g_upKeep);
	}
	
	public function pushSubResource(_type:int)
	{
		var data:Array = new Array();
		if(_type == 0)
		{
			data.push(g_baseProduction[_type]);
			data.push(g_lastTax);
			var techbouns : float = parseFloat(parseFloat(Technology.instance().getGoldProductionIncrease()) * 100);
			data.push(techbouns);
			var population:int = Resource.instance().populationCount(g_curCityID);
			data.push(population);
			var sumSalary:long = General.instance().getLeadersalarySum(g_curCityID);
			data.push(sumSalary);
			
			
			var goldbouns:int = Resource.instance().TaxItemBouns() * 100;
			var goldbounsStr:String = String.Format("{0}%", goldbouns.ToString());
			/*item bouns*/
			data.push(goldbounsStr);
			data.push(g_otherBonus[_type]);
			/*total bouns*/
			var totalBonus:int = goldbouns + _Global.INT32(g_otherBonus[_type]) + _Global.INT32(techbouns);
			data.push(totalBonus);
			data.push(_Global.INT32(g_baseProduction[_type] * totalBonus * 0.01f));
		}
		else
		{
			data.push(g_baseProduction[_type]);
			data.push(g_quartermasterBonus[_type]);
			data.push(g_researchBonus[_type]);
			data.push(g_wildsBonus[_type]);
			data.push(g_itemBonus[_type]);
			data.push(g_otherBonus[_type]);
			data.push(g_totalBonus[_type]);
			data.push(g_totalBonusAmount[_type]);
		}
		resourceSubContent.setData(data, _type);
		controller.push(resourceSubContent);
	}
	
	public function popSubResource()
	{
		controller.pop();
	}
	
	private function InitResourceData()
	{
		g_curProduction = [.0,.0,.0,.0,.0];
		g_upKeep = .0;
		g_baseProduction = [.0,.0,.0,.0,.0];
		g_quartermasterBonus= [.0,.0,.0,.0,.0];
		g_researchBonus= [.0,.0,.0,.0,.0];
		g_wildsBonus= [.0,.0,.0,.0,.0];
		g_itemBonus= [.0,.0,.0,.0,.0];
		g_otherBonus= [0,0,0,0,0];
		g_totalBonus= [.0,.0,.0,.0,.0];
		g_totalBonusAmount= [.0,.0,.0,.0,.0];
		totalBonus = 1.0;
		
		g_curProduction[0] = Resource.instance().TaxRevenue(g_curCityID);
		var i:int;
		var resourceBonus:long;
		var temp:long;
		
		/*base building production*/
		for(i=1; i < 5; i++)
		{
			temp = seed["resources"]["city" + g_curCityID]["rec" + i][_Global.ap + 2].Value;
			if(temp != null && temp != "")
			{
				resourceBonus = _Global.INT64(temp);
			}
			else
			{
				resourceBonus = 0;
			}		
		
			g_baseProduction[i] = resourceBonus;
		}
		g_baseProduction[0] = Resource.instance().TaxRevenueBase(g_curCityID);
			
		/*upkeep*/
		g_upKeep = Resource.instance().GetFoodUpkeep(g_curCityID);;

		/*urban praefect*/
		temp = Resource.instance().getPraefectBonus(g_curCityID);
		if(temp != null && temp != "")
		{
			resourceBonus = _Global.INT64(temp);
		}
		else
		{
			resourceBonus = 0;
		}
		
		for(i=1; i < 5; i++)
		{
			g_quartermasterBonus[i] = resourceBonus;
			g_totalBonus[i] += resourceBonus;
		}
		
		/*research bonus*/
		for(i=1; i < 5; i++)
		{
			temp = Resource.instance().getResearchBonus(i);
			if(temp != null && temp != "")
			{
				resourceBonus = _Global.INT64(temp);
			}
			else
			{
				resourceBonus = 0;
			}			
			g_researchBonus[i] = resourceBonus;
			g_totalBonus[i] += resourceBonus;
		}
		
		/*wilderness bonus*/
		for(i=1; i < 5; i++)
		{
			temp = Resource.instance().getWildernessBonus(g_curCityID, i);
			if(temp != null && temp != "")
			{
				resourceBonus = _Global.INT64(temp);
			}
			else
			{
				resourceBonus = 0;
			}			
			
			g_wildsBonus[i] = resourceBonus;
			g_totalBonus[i] += resourceBonus;
		}
		
		/*item bonus*/
		for(i=1; i < 5; i++)
		{
			temp = Resource.instance().getItemBonus(i);
			if(temp != null && temp != "")
			{
				resourceBonus = _Global.INT64(temp);
			}
			else
			{
				resourceBonus = 0;
			}			
			
			g_itemBonus[i] = resourceBonus;
			g_totalBonus[i] += resourceBonus;
		}				
		
		/*other bonus is g_otherBonus*/
		
		/* hero of other bonus*/
		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		g_otherBonus[1] = _Global.FLOAT(g_otherBonus[1]) + 100f * HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Food);
		g_otherBonus[2] = _Global.FLOAT(g_otherBonus[2]) + 100f * HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Wood);
		g_otherBonus[3] = _Global.FLOAT(g_otherBonus[3]) + 100f * HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Stone);
		g_otherBonus[4] = _Global.FLOAT(g_otherBonus[4]) + 100f * HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Ore);
		
		/* vip of other bonus*/
		if(GameMain.instance().IsVipOpened())
		{
			var vipLevel:int = GameMain.instance().GetVipOrBuffLevel();
			var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
			g_otherBonus[0] = _Global.FLOAT(g_otherBonus[0]) + vipDataItem.GOLD;
			g_otherBonus[1] = _Global.FLOAT(g_otherBonus[1]) + vipDataItem.FOOD;
			g_otherBonus[2] = _Global.FLOAT(g_otherBonus[2]) + vipDataItem.WOOD;
			g_otherBonus[3] = _Global.FLOAT(g_otherBonus[3]) + vipDataItem.STONE;
			g_otherBonus[4] = _Global.FLOAT(g_otherBonus[4]) + vipDataItem.ORE;
		}
		
		for(i=0; i < 5; i++)
		{
			g_totalBonus[i] += _Global.FLOAT(g_otherBonus[i]);
		}
			
		//total bonus is g_totalBonus
		
		//current production
		for(i=1; i < 5; i++)
		{
			
			temp = Resource.instance().getFinalResourceProductivity(g_curCityID, i);
			if(temp != null && temp != "")
			{
				resourceBonus = _Global.INT64(temp);
			}
			else
			{
				resourceBonus = 0;
			}	
			
			g_curProduction[i] = resourceBonus;				
		}
		
		//total time reduction
		for(i=1; i < 5; i++)
		{
			var totalTimeReduction = g_baseProduction[i];
			/*
				if(g_totalBonus[i] <= 100)
				{
					totalBonus = g_totalBonus[i] * 0.01;
				}
			*/
						
			totalTimeReduction = Mathf.Round(totalTimeReduction * totalBonus);
			g_totalBonusAmount[i] = totalTimeReduction;
		}
	}
	
	protected function handlerFilterInputFunc(oldStr:String,newStr:String):String
	{		
		var input = _Global.FilterStringToNumberStr(newStr);
		var count:long = 0;
		if(input != "")
		{
			count = _Global.INT64(input);
		}
		count = count < 0 ? 0:count;
		count = count >= 100 ? 100 : count;
		sliderTax.SetCurValue(count);
		g_lastTax = count;
		return count == 0 ?"" :"" + count;
	}
	
	public function handlerInputDoneFunc(input:String)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			sliderTax.SetCurValue(0);
			g_lastTax = 0;
			inputTaxNum.txt = "0";
			return "0";
		}
		else
		{
			var lastValue:int = _Global.INT32(input);
			
			sliderTax.SetCurValue(lastValue);
			g_lastTax = lastValue;
			return input;
		}
	}
	
	protected function handlerSliderValueChanged(val:long)
	{
		inputTaxNum.txt = "" + val;
		g_lastTax = val;
	}


	/*======================================== 城堡皮肤 ==========================================*/

	/* 当城堡皮肤界面的数据无法获取时，在关闭提示弹窗后，需要返回到之前的界面 */
	public function BackOtherViewFromCitySkinView() {
		if (lastViewIndex != -1) {
			toolBar.selectedIndex = lastViewIndex;
			indexChangedFunc(lastViewIndex);
		}
	}



	/* 城堡皮肤界面 切换到  道具 详情界面 */
	public function pushCitySkinPropView(citySkinId: String, data: HashObject) {
		  
		citySkinPropView.SetListData(citySkinId, data);
		citySkinController.push(citySkinPropView);
		isShowedCitySkinPropView = true;
	}

	public function popCitySkinPropView() {
		if (citySkinView.IsCitySkinUpdated) {
			isShowedCitySkinPropView = false;
			citySkinController.pop();
		}
	}
	/*================================================================================================*/




}
