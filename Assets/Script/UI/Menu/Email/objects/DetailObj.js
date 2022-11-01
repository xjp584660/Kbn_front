class DetailObj extends UIObject
{
	public var labelAttackerHeader:Label;
	public var labelAttackerTitle:Label;
	public var labelDefenderHeader:Label;
	public var labelDefenderTitle:Label;
	
	public var divideLine1:Label;
	public var divideLine2:Label;
	public var temp:Label;
	
	public var componentAttacker:ReportDetailTroopsView;
	public var componentDefender:ReportDetailTroopsView;
	public var componentARow:ComposedUIObj;
	public var componentDRow:ComposedUIObj;
	
	public var componentAttackerHero:ReportDetailHeroesView;
	public var componentDefenderHero:ReportDetailHeroesView;

	@SerializeField	
	private var noticeBar : Label;
    
    private var tooWeakToInspect : boolean;
	
	public var scrollView:ScrollView;
	
	private var g_header:HashObject;
	private var g_data:HashObject;
	private var g_defaultHeight:int = 0;
	
	private var dataList: System.Collections.Generic.List.<Hashtable> = new System.Collections.Generic.List.<Hashtable>();
	private var curAllianceBossReportIndex:int;
	@SerializeField private var inputPager:Input2Page;
	@SerializeField private var allianceBossTitle:Label;
	public var g_marchType : int;

	public function Init()
	{
        componentAttackerHero.Init();
        componentDefenderHero.Init();
        componentAttacker.Init();
        componentDefender.Init();
    
		labelAttackerHeader.Init();
		labelAttackerTitle.Init();
		labelDefenderHeader.Init();
		labelDefenderTitle.Init();
		
		divideLine1.Init();
		divideLine2.Init();
		
		divideLine1.setBackground("between line", TextureType.DECORATION);
		divideLine2.setBackground("between line", TextureType.DECORATION);
        
		scrollView.Init();
            
        inputPager.Init();
		inputPager.pageChangedHandler = inputPager_Changed;
	}
	
	private function GetHealRateString() : String
	{
		var ratio : HashObject = g_data["side1CureRatio"];
		if (null == ratio)
		{
			return priv_getHealRat().ToString();
		}
		else
		{
			var playerId = Datas.instance().tvuid();
			var s0Id = _Global.INT32(g_header["side0PlayerId"]);
			if (playerId == s0Id)
			{
				ratio = g_data["side0CureRatio"];
			}
			var buff = _Global.INT32(ratio["buff"]);
			return buff > 0 ? ("(" + _Global.INT32(ratio["base"]) + "+" + _Global.INT32(ratio["buff"]) + ")") : _Global.INT32(ratio["base"]).ToString();
		}
	}
	
	private function priv_getHealRat() : int
	{
		var defRat : int = 50;
		var gameMain : GameMain = GameMain.instance();
		var seed : HashObject = gameMain.getSeed();
		var serverSetting : HashObject = seed["serverSetting"];
		if ( serverSetting == null )
			return defRat;
		var troopCanCurePercent : HashObject = serverSetting["troopCanCurePercent"];
		if ( troopCanCurePercent == null )
			return defRat;
		return _Global.INT32(troopCanCurePercent);
		//var city : City = CityQueue.instance().GetCreatedCityByIdx(5);
		//if ( city == null )
		//	return 0;
		//return HospitalMenu.GetAllSlotCountForHealthInCity(city.cityId);
	}
	

	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		scrollView.Draw();
		
		divideLine2.Draw();
		
		noticeBar.Draw();
		
		inputPager.Draw();
		
		allianceBossTitle.Draw();
		
		GUI.EndGroup();		
	}
	
	public function Update()	
	{
		scrollView.Update();
	}
	
	public function setData(_data:Object)
	{
		var hashData:Hashtable = _data as Hashtable;
		if(hashData["AllianceBoss"] != null && hashData["AllianceBoss"] == 1)
		{
			dataList = hashData["data"] as System.Collections.Generic.List.<Hashtable>;
			setAllianceBossData();
			return;
		}
		allianceBossTitle.SetVisible(false);
		inputPager.SetVisible(false);
		noticeBar.SetVisible(true);
		divideLine2.SetVisible(true);
		g_header = hashData["header"] as HashObject;
		g_data = hashData["data"] as HashObject;
        tooWeakToInspect = _Global.GetBoolean(g_data["tooWeakToInspect"]);
		
		scrollView.clearUIObject();
		scrollView.MoveToTop();
		
		renderDetail();
	}

    private function SetupAttackersView() : void
    {
        labelAttackerHeader.txt = (Datas.getArString("Common.Attackers") as String).ToUpper();
        
        var multipleAttackers : HashObject = g_data["atks"];
        
        if (multipleAttackers == null || _Global.GetObjectKeys(multipleAttackers).Length == 0)
        {
            labelAttackerTitle.txt = CalcAttackerTitle();
            var attackerHeros : ReportDetailHeroesView.Data = ReportDetailHeroesView.Data.Create("s1Hero", g_data);
            //componentAttackerHero.SetVisible(attackerHeros.hasValue);
            componentAttackerHero.SetUIData(attackerHeros);
            var attackerInfo : ReportDetailTroopsView.Data = PopulateAttackerInfo();
            componentAttacker.SetUIData(attackerInfo);
            AddAttackerToScrollView();
            return;
        }
        
        scrollView.addUIObject(labelAttackerHeader);
        var multipleAttackersKeys : String[] = _Global.GetObjectKeys(multipleAttackers);
        for (var i : int = 0; i < multipleAttackersKeys.Length; ++i)
        {
            var key : String = _Global.ap + i.ToString();
            var data : HashObject = multipleAttackers[key];
            PopulateAttackerView(data);
        }
    }

/*迷雾远征*/
    private function SetupMistExpeditionAttackersView(): void {
        labelAttackerHeader.txt = (Datas.getArString("Common.Attackers") as String).ToUpper();
        labelAttackerTitle.txt = g_header["atknm"].Value.ToString();

        var multipleAttackers: HashObject = g_data["atks"];

        if (multipleAttackers == null || _Global.GetObjectKeys(multipleAttackers).Length == 0) {
            var attackerInfo: ReportDetailTroopsView.Data = PopulateMistExpeditionAttackerInfo();
            componentAttacker.SetUIData(attackerInfo);
            AddAttackerToScrollView();
            return;
        }

        scrollView.addUIObject(labelAttackerHeader);
        var multipleAttackersKeys: String[] = _Global.GetObjectKeys(multipleAttackers);
        for (var i: int = 0; i < multipleAttackersKeys.Length; ++i) {
            var key: String = _Global.ap + i.ToString();
            var data: HashObject = multipleAttackers[key];
            PopulateAttackerView(data);
        }
    }


    private function SetupRallyAttackersView() : void
    {
    	labelAttackerHeader.txt = (Datas.getArString("Common.Attackers") as String).ToUpper();
        
        var multipleAttackers : HashObject = g_data["atks"];
        scrollView.addUIObject(labelAttackerHeader);      
        
        labelAttackerTitle.txt = CalcAttackerTitle();
        scrollView.addUIObject(labelAttackerTitle);
        var attackerHeros : ReportDetailHeroesView.Data = ReportDetailHeroesView.Data.Create("s1Hero", g_data);
        //componentAttackerHero.SetVisible(attackerHeros.hasValue);
        componentAttackerHero.SetUIData(attackerHeros);
        scrollView.addUIObject(componentAttackerHero);  

        var atts : HashObject = g_data["fght"];
		var keys : String[] = _Global.GetObjectKeys(atts);
		for(var j : int = 0; j < keys.Length; j ++)
		{
			var sKey : String = keys[j];
			if(sKey == "s0")
			{
				continue;
			}
			
			var attackerInfo : ReportDetailTroopsView.Data = ReportDetailTroopsView.Data.Create(g_header["atkCityId"], g_data["fght"][sKey], false);
        	var attackerView : ReportDetailTroopsView = Instantiate(componentAttacker);
        	attackerView.Init();
        	attackerView.SetUIData(attackerInfo);
        	
        	if(sKey == "s1")
        	{
        		attackerView.SetTitleNane(Datas.getArString("WarHall.Total") as String);
        	}
        	else
        	{
        		if(g_data["playerName"] != null)
				{
					if(g_data["playerName"]["s2"] != null)
					{
						var name : String = g_data["playerName"][sKey].Value as String;
        				attackerView.SetTitleNane(name);
					}
					else
					{
						attackerView.SetTitleNane("");
					}
				}      		
        	}
        	
        	scrollView.addUIObject(attackerView);
		}
    }
    
    private function PopulateAttackerView(data : HashObject)
    {
        var lblTitle : Label = Instantiate(labelAttackerTitle) as Label;
        lblTitle.txt = CalcAttackerTitle(data["playerName"], data["xCoord"], data["yCoord"]);

        var heroContent : ReportDetailHeroesView = Instantiate(componentAttackerHero) as ReportDetailHeroesView;
        heroContent.Init();
        var heros : ReportDetailHeroesView.Data = ReportDetailHeroesView.Data.Create("heros", data);
        heroContent.SetUIData(heros);
        
        var attackerView : ReportDetailTroopsView = Instantiate(componentAttacker) as ReportDetailTroopsView;
        attackerView.Init();
        var attackerInfo : ReportDetailTroopsView.Data = ReportDetailTroopsView.Data.Create(new HashObject(0), data["fght"], false);
        attackerView.SetUIData(attackerInfo);
        scrollView.addUIObject(lblTitle);
        scrollView.addUIObject(heroContent);
        scrollView.addUIObject(attackerView);
    }
    
    private function SetupDefendersView()
    {
        labelDefenderHeader.txt = (Datas.getArString("Common.Defenders") as String).ToUpper();
        labelDefenderTitle.txt = CalcDefenderTitle();
        var defenderInfo : ReportDetailTroopsView.Data = tooWeakToInspect ? new ReportDetailTroopsView.Data() : PopulateDefenderInfo();
        componentDefender.SetUIData(defenderInfo);
        var defenderHeros : ReportDetailHeroesView.Data = tooWeakToInspect ? new ReportDetailHeroesView.Data() : ReportDetailHeroesView.Data.Create("s0Hero", g_data);
        //componentDefenderHero.SetVisible(defenderHeros.hasValue);
        componentDefenderHero.SetUIData(defenderHeros);
        AddDefenderToScrollView();
    }

    private function renderDetail()
    {
    	g_marchType = _Global.INT32(g_header["marchtype"]);
    	if(g_marchType == Constant.MarchType.RALLY_ATTACK || g_marchType == Constant.MarchType.JION_RALLY_ATTACK)
    	{
    		SetupRallyAttackersView();
        }
        else if (g_marchType == Constant.MarchType.MistExpedition) {
            SetupMistExpeditionAttackersView();
        }
    	else
    	{
        	SetupAttackersView();    	
    	}
    	scrollView.addUIObject(temp);
        scrollView.addUIObject(divideLine1);
        scrollView.addUIObject(temp);
        scrollView.addUIObject(temp);
        SetupDefendersView();
        
        noticeBar.txt = String.Format(Datas.getArString("Hospital.ReportTip"), GetHealRateString());
        if (g_marchType == Constant.MarchType.MistExpedition)/*是迷雾远征 需要关闭 一些界面*/ {
            var array: Array = new Array();
            //array.push(labelAttackerTitle);/*移除 攻击的 位置信息*/
            array.push(componentAttackerHero);/*移除 英雄信息*/
            array.push(componentDefenderHero);/*移除 敌人英雄信息*/



            noticeBar.SetVisible(false);

            removeAttackerToScrollView(array);
        }

        scrollView.AutoLayout();/*scrollView item 设置位置*/
    }

    private function CalcAttackerTitle() : String
    {
        return CalcAttackerTitle(g_header["atknm"], g_header["atkxcoord"], g_header["atkycoord"]);
    }
    
    private function CalcAttackerTitle(attackerName : HashObject, xCoord : HashObject, yCoord : HashObject)
    {
        var whoAttacking:Array = new Array();
        if(attackerName != null && attackerName.Value!= "")
        {
            // player is attacker
            whoAttacking.push("(");
            whoAttacking.push(attackerName.Value);
            whoAttacking.push(")");
            if(xCoord != null)
            {
                whoAttacking.push(" - (" + xCoord.Value + " , " + yCoord.Value + ")");
            }
            
        }else{
            // enemy is attacker
            whoAttacking.push("(");
            whoAttacking.push(Datas.getArString("Common.Enemy"));
            whoAttacking.push(")"); 
        }
        
        var data = new Array();
        //who is attacking
        data.push(whoAttacking.join(""));
        
        if(_Global.INT32(g_data["winner"]) == 1)
        {
            data.push("- " + Datas.getArString("Common.Winner") + "\n");
        } 
        else 
        {
            data.push("" + "\n");
        }
        return data.join("");
    }

    private function CalcDefenderTitle() : String
    {
        var data = new Array();
        data.push(g_header["defnm"].Value);
        
        if(g_data["winner"] && (_Global.INT32(g_data["winner"]) != 1))
        {
            data.push(" - " + Datas.getArString("Common.Winner") + "\n");
        }
        else
        {
            data.push("\n");
        }
        return data.join("");
    }

    private function PopulateAttackerInfo() : ReportDetailTroopsView.Data
    {
        return ReportDetailTroopsView.Data.Create(g_header["atkCityId"], g_data["fght"]["s1"], false);
    }

    public function PopulateMistExpeditionAttackerInfo(): ReportDetailTroopsView.Data
    {
        return ReportDetailTroopsView.Data.Create(g_header["atkCityId"], g_data["unitsJS"]["s1"], false);
    }
    
    private function PopulateDefenderInfo() : ReportDetailTroopsView.Data
    {
        return ReportDetailTroopsView.Data.CreateWithMarchType(g_header["defCityId"], g_data,g_header["marchtype"], tooWeakToInspect);
    }
    
    private function AddAttackerToScrollView()
    {
        scrollView.addUIObject(labelAttackerHeader);
        scrollView.addUIObject(labelAttackerTitle);
        scrollView.addUIObject(componentAttackerHero);  
        scrollView.addUIObject(componentAttacker);
    }

    /*移除 不使用的 界面*/
    public function removeAttackerToScrollView(array: Array)
    {
        for (var i: int = 0; i < array.length; i++)
        {
            scrollView.removeUIObject(array[i]);
        }
    }

    public var worldbossObj:ComposedUIObj;
    public var worldboss_label1:Label;
    public var worldboss_label2:Label;
    private function AddDefenderToScrollView()
    {
        scrollView.addUIObject(labelDefenderHeader);
        scrollView.addUIObject(labelDefenderTitle); 
        scrollView.addUIObject(componentDefenderHero);
        scrollView.addUIObject(componentDefender);
        if (_Global.INT32(g_header["marchtype"])==Constant.MarchType.EMAIL_WORLDBOSS) {
        	scrollView.addUIObject(worldbossObj);
        	worldbossObj.SetVisible(true);
            if (_Global.INT32(g_data["isFront"])==1) {
                worldboss_label1.txt=Datas.getArString("WorldBoss.Report_Text4");
            }else{
                worldboss_label1.txt=Datas.getArString("WorldBoss.Report_Text5");
            }
            var string2:String="";
            if (_Global.INT32(g_data["bossStatus"])==2) {
                // worldboss_label2.txt=Datas.getArString("WorldBoss.Report_Text6");
                string2=Datas.getArString("WorldBoss.Report_Text6");
            }else if(_Global.INT32(g_data["bossStatus"])==3){
                // worldboss_label2.txt=Datas.getArString("WorldBoss.Report_Text6");
                string2=Datas.getArString("WorldBoss.Report_Text7");
            }else{
                worldboss_label2.txt="";
            }

            worldboss_label1.txt+="\n"+string2;

        }else{
        	worldbossObj.SetVisible(false);
        }
    }
	
	private function setAllianceBossData()
	{
		inputPager.SetVisible(true);
		noticeBar.SetVisible(false);
		divideLine2.SetVisible(false);
		allianceBossTitle.SetVisible(true);
		
		if(dataList.Count>0)
		{
			inputPager.setPages(1,dataList.Count);
			inputPager_Changed(1);
		}
	}
	private function setCurrentData()
	{
		var _data:Hashtable = dataList[curAllianceBossReportIndex] as Hashtable;
		g_header = _data["header"] as HashObject;
		g_data = _data["data"] as HashObject;
        tooWeakToInspect = _Global.GetBoolean(g_data["tooWeakToInspect"]);
		allianceBossTitle.txt = Datas.getArString(_Global.ToString(g_header["side0LevelName"]));
		var rid:int = _Global.INT32(g_header["rid"]);
		Message.getInstance().SetReportRead(rid);
		scrollView.clearUIObject();
		scrollView.MoveToTop();
		
		renderDetail();
	}
	
	
	public function inputPager_Changed(pageIndex:int)
	{
		if(pageIndex<=dataList.Count && pageIndex>0)
		{
			curAllianceBossReportIndex = pageIndex-1;
			setCurrentData();
		}
	}
    
    public function OnPopOver()
    {
        Clear();
    }
    
    public function Clear()
    {
        scrollView.clearUIObject();
        componentAttackerHero.Clear();
        componentDefenderHero.Clear();
        componentAttacker.Clear();
        componentDefender.Clear();
    }
}
