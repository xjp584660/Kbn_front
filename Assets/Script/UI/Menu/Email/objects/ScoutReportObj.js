class ScoutReportObj extends UIObject
{
	public var divideLine:Label;
	public var titleLable:Label;	
	public var inforLabel:Label;
	public var timeLabel:Label;

	public var mystyle:GUIStyle;
	public var font:FontSize = FontSize.Font_18;
	
	private var startX:int = 35;
	private var intervalPic:int = 10;
	private var picHeight:int = 110;
	private var numHeight:int = 27;
	private var numPicCol:int = 5;
	
	private var unitNumArray:Array;
	private var unitPicArray:Array;
	
	private var pathUnit:String = "ui_";
	private var pathRes:String = "icon_rec";

	private var g_heightData:int;
	private var g_isPic;
	private var g_countForText:int;
	private var g_title:String;
	private var g_txt:String;
	private var g_chaHeight:int = 15;
	private var g_distanceTitleAndInfor:int = 5;
	private var g_txtWidth:int = 60;
	private var g_distanceColBetweenPics:int = 10;
	private var g_distanceRowBwtweenPics:int = 6;
	private var g_inforStartY:int;
	private var g_totalHeight:int;
	
	public function Init():void
	{
		divideLine.setBackground("between line", TextureType.DECORATION);
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		
		divideLine.Draw();
		titleLable.Draw();

		if(g_isPic)
		{
			var _X:int;			
			var _numY:int;
			var _picY:int;
			
			for(var a:int = 0; a < unitNumArray.length; a++)
			{
				_X = (a % numPicCol) * (picHeight + g_distanceRowBwtweenPics) + startX;
				_picY = (a / numPicCol) * (picHeight + numHeight + g_distanceRowBwtweenPics) + g_inforStartY;
				_numY = _picY + picHeight;

			//	GUI.Label(Rect(_X, _picY, picHeight, picHeight),unitPicArray[a]);
				(unitPicArray[a] as Tile).Draw(Rect(_X, _picY, picHeight, picHeight));
				if(unitNumArray[a] != null )
				{
					GUI.Label(Rect(_X, _numY, picHeight, numHeight),unitNumArray[a] + "" , mystyle);
				}
			}
		}
		else
		{
			inforLabel.Draw();
			timeLabel.Draw();
		}

		GUI.EndGroup();
	}
	
	public function setColor(_color:Color):void
	{
		mystyle.normal.textColor = _color;
		titleLable.mystyle.normal.textColor = _color;
		inforLabel.mystyle.normal.textColor = _color;
	}
	
	function setData(data:Object):void
	{
//		FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
//		mystyle.wordWrap = true;
		
		initInfor(data);
		
		divideLine.setBackground("between line", TextureType.DECORATION);
		
		titleLable.txt = g_title;
		
		if(g_isPic)
		{
			g_totalHeight = ((unitNumArray.length - 1) / numPicCol + 1) * (picHeight + numHeight + g_distanceRowBwtweenPics) + g_inforStartY;
		}
		else
		{
			inforLabel.SetFont();
			inforLabel.rect.height = inforLabel.mystyle.CalcHeight(GUIContent(g_txt),inforLabel.rect.width);
			inforLabel.txt = g_txt;
			g_totalHeight = g_inforStartY + inforLabel.rect.height;
		}
		
		rect.height = g_totalHeight;
	}
	
	function initInfor(data:Object):void
	{
		var g_data:HashObject = data as HashObject;
		var untNum:Object;

		var key:String;
//		var arStrings:Object = Datas.instance().arStrings();

		var id:int;
		var tempTexture:Tile;//Texture2D;
		unitNumArray = new Array();
		unitPicArray = new Array();
		g_isPic = false;
		g_countForText = 0;
		g_txt = "";
		g_inforStartY = titleLable.rect.y + titleLable.rect.height + g_distanceTitleAndInfor;

		
		timeLabel.SetVisible(false);
		inforLabel.rect = new Rect(startX, g_inforStartY, 640 - startX * 2, 30);
		inforLabel.mystyle.alignment = TextAnchor.UpperLeft;
		
		if(g_data["tile"])
		{			
			inforLabel.mystyle.normal.textColor = new Color(182.0/255, 82.0/255, 8.0/255, 1.0);			
			g_title = Datas.getArString("ModalMessagesViewReports.SurveyStatus");
			
			if(_Global.INT32(g_data["tile"]["canSurveyType"]))
			{
				if(_Global.INT32(g_data["tile"]["inSurvey"]))
				{
					g_txt = Datas.getArString("ModalMeessagesViewReport.TileOwnerSurveying");
					inforLabel.mystyle.alignment = TextAnchor.UpperCenter;
				}
				else
				{
					var leftTime:long = _Global.INT64(g_data["tile"]["freezeEndTime"]) - GameMain.unixtime();
					if(leftTime > 0)
					{
						
						timeLabel.SetVisible(true);
						g_txt = Datas.getArString("OpenPalace.TileRecovering") + ": ";
						
						var _size:Vector2 = mystyle.CalcSize(GUIContent(g_txt));					
						inforLabel.rect.x = 220;
						inforLabel.rect.width = _size.x;
						inforLabel.mystyle.normal.textColor = new Color(64.0/255, 42.0/255, 19.0/255, 1.0);
						
						timeLabel.rect.y = g_inforStartY;
						timeLabel.rect.x = inforLabel.rect.x + inforLabel.rect.width + 5;
						timeLabel.txt = _Global.timeFormatStr(leftTime);
					}
					else
					{
						g_txt = Datas.getArString("March.ReadytoSurvey");
						inforLabel.mystyle.alignment = TextAnchor.UpperCenter;
					}
				}			
			}
			else
			{
				g_txt = Datas.getArString("Common.CannotSurvey");
				inforLabel.mystyle.alignment = TextAnchor.UpperCenter;
			}			
		}

		if(g_data["unts"])
		{
			g_title = Datas.getArString("ScoutReport.AvaTroop");
			PopulateUnits(g_data["unts"].Table);
			g_isPic = true;
			return;
		}
        
        if (g_data["defending_unts"])
        {
            g_title = Datas.getArString("ScoutReport.DefTroop");
            PopulateUnits(g_data["defending_unts"].Table);
            g_isPic = true;
            return;
        }
		

		if(g_data["frt"])
		{	

//			var arString:Object = Datas.instance().arStrings();
			g_title = Datas.getArString("Common.Fortification");
			for(var _frt:System.Collections.DictionaryEntry in g_data["frt"].Table)

			{
				untNum = (_frt.Value as HashObject).Value;
				key = _frt.Key;
				id = _Global.INT32(( key as String).Split("t"[0])[1]);					
			
				if(Walls.instance().isIncludedUnit(id))
				{					
					g_txt += Datas.getArString("fortName.f" + id) + ": " + untNum + "\n";
				}
				
				g_countForText++;
			}
			
			return;
		}
		
		
		if(g_data["lstlgn"])
		{
			g_title = Datas.getArString("ModalMessagesViewReports.LastLogin");
			g_txt = _Global.timeFormatStr(_Global.INT32(g_data["lstlgn"]) * 1000); 
			
			g_countForText++;
			return;
		}
		
		if(g_data["knght"])
		{
			g_title = Datas.getArString("ModalMessagesViewReports.KnightCombatLevel");
			g_txt = g_data["knght"]["cbt"].Value;
			
			g_countForText++;
			return;			
		}

		
		if(g_data["pop"] != null || g_data["gld"] != null || g_data["hap"] != null)
		{
			g_title = Datas.getArString("Common.CityOverview");
			
			if(g_data["hap"] != null)
			{
				g_txt += Datas.getArString("Common.Happiness") + ": " + _Global.NumFormat(long.Parse(g_data["hap"].Value.ToString())) + "\n";
				g_countForText++;
			}
							
			if(g_data["pop"] != null)
			{
				g_txt += Datas.getArString("Common.Population") + ": " + _Global.NumFormat(long.Parse(g_data["pop"].Value.ToString())) + "\n";
				g_countForText++;
			}
				
			if(g_data["gld"] != null)
			{
				g_txt += Datas.getArString("Common.Silver") + ": " + _Global.NumFormat(long.Parse(g_data["gld"].Value.ToString())) + "\n";
				g_countForText++;
			}
			
			return;											
		}
		
		if(g_data["blds"])
		{
	//		var buildingName:Object = arStrings["buildingName"];
			g_title = Datas.getArString("Common.Building") + " " + Datas.getArString("Common.Levels");
			for(var _frt:System.Collections.DictionaryEntry in g_data["blds"].Table)
			{
				untNum = parseObject(_frt.Value as HashObject);
				key = _frt.Key;
				id = _Global.INT32(key.Split("b"[0])[1]);					
				
				var strNums:String = _Global.GetString(untNum);
				var arr:Array = strNums.Split(","[0]);
				var retStr:String;
				if(Datas.getArString("buildingName.b" + id))
				{
					for(var i:int=0;i<arr.length;i++)
					{
						var bldLevel:int = _Global.INT32(arr[i]);
						var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(id,bldLevel);
						var prestige:int = _Global.INT32(prestigeData["prestige"]);
						var level:int = _Global.INT32(prestigeData["level"]);
						switch (prestige)
						{
							case 0:
								retStr = retStr + level;
							break;
							case 1:
								retStr = retStr + "* " + level;
							break;
							case 2:
								retStr = retStr + "** " + level;
							break;
							case 3:
								retStr = retStr + "*** " + level;
							break;
						}
						if(i != arr.length-1)
							retStr = retStr + ",";
					}
					g_txt += Datas.getArString("buildingName.b" + id) + ": " + retStr + "\n";
					g_countForText++;	
				}
			}
			
			return;
		}
		
        if (TryPopulateResAndLootItemData(g_data))
        {
            g_isPic = true;
            return;
        }
		
		if(g_data["tch"])
		{
            PopulateResearchesAndSkills(g_data);
			return;			
		}
	}
    
    private function PopulateResearchesAndSkills(g_data : HashObject) : void
    {
        g_title = Datas.getArString("Common.Research") + "\n";
        
        for (var _frt:System.Collections.DictionaryEntry in g_data["tch"].Table)
        {
            var untNum : int = _Global.INT32(_frt.Value as HashObject);
            var key : String = _frt.Key as String;
            
            if (key.StartsWith("t"))
            {
                PopulateResearchInfo(_Global.INT32(key.Split("t"[0])[1]), untNum);
                continue;
            }
            
            if (key.StartsWith("avaps"))
            {
                PopulateAvaPlayerSkillInfo(_Global.INT32(key.Replace("avaps", String.Empty)), untNum);
                continue;
            }
        }
    }
    
    private function PopulateResearchInfo(id : int, level : int) : void
    {
        g_txt += Datas.getArString("techName.t" + id) + ": " + level + "\n";
        g_countForText++;
    }
    
    private function PopulateAvaPlayerSkillInfo(id : int, level : int) : void
    {
        var skill : AvaPlayerSkillItem = GameMain.Ava.PlayerSkill.GetPlayerSkill(id);
        if (skill == null)
        {
            return;
        }
        g_txt += String.Format("{0}: {1}\n", skill.Name, level);
        g_countForText++;
    }
    
    private function TryPopulateResAndLootItemData(g_data : HashObject) : boolean
    {
        var resNode : HashObject = g_data["rsc"];
        var lootItemNode : HashObject = g_data["lootitemcount"];
        
        if(resNode == null && lootItemNode == null)
        {
            return false;
        }

        g_title = Datas.getArString("Common.Resource");

        if (resNode != null)
        {
            PopulateRes(resNode);
        }
        
        if (lootItemNode != null)
        {
            PopulateLootItem(lootItemNode);
        }
        
        return true;
    }
    
    private function PopulateRes(resNode : HashObject) : void
    {	
        var idArr : Array = new Array();
        var numArr: Array = new Array();
        for (var _frt:System.Collections.DictionaryEntry in resNode.Table)
        {
            var num : System.Object = (_frt.Value as HashObject).Value;
            var key : String = _frt.Key;
     	 	var id : int = _Global.INT32(key.Split("r"[0])[1]); 
            idArr.Add(_Global.INT32(id));
            numArr.Add(num);
        }
        for(var i:int = idArr.length ; i > 0;i--)
        {
        	for(var j:int = 0; j < i -1;j++)
        	{
        		if(_Global.INT32(idArr[j]) > _Global.INT32(idArr[j+1]))
        		{
        			var temp:int = _Global.INT32(idArr[j]);
        			idArr[j] = _Global.INT32(idArr[j+1]);
        			idArr[j+1] = temp;
        			var temp2:long = numArr[j];
        			numArr[j] = numArr[j+1];
        			numArr[j+1] = temp2;
        		}
        	}
        }     
        for (var m:int = 0; m < idArr.length;m++)
        {             
            var tempTexture : Tile = TextureMgr.instance().ElseIconSpt().GetTile(pathRes + _Global.INT32(idArr[m]).ToString());
			unitPicArray.push(tempTexture);
			var untNum: System.Object = _Global.NumFormat(long.Parse(numArr[m].ToString()));
			unitNumArray.push(untNum);
        }
    }
    
    private function PopulateLootItem(lootItemNode : HashObject) : void
    {
        var keys : String[] = _Global.GetObjectKeys(lootItemNode);
        for (var i : int = 0; i < keys.Length; ++i)
        {
            var key : String = keys[i];
            var id : int = _Global.INT32(key.Substring(1));
            var num : System.Object = lootItemNode[key].Value;
			unitPicArray.push(TextureMgr.instance().LoadTileOfItem(id));
			var untNum: System.Object = _Global.NumFormat(long.Parse(num.ToString()));
			unitNumArray.push(untNum);
        }
    }
    
    private function PopulateUnits(unitsData : Hashtable) : void
    {
        for (var _unt : System.Collections.DictionaryEntry in unitsData)
        {
            var untNum : System.Object = (_unt.Value as HashObject).Value;
            var key : String = _unt.Key as String;
            var id : int = _Global.INT32(key.Split("u"[0])[1]);
            if(untNum != "" && untNum != "0" && untNum != 0 && Barracks.instance().isIncludedUnit(id))
            {
                var tempTexture : Tile = TextureMgr.instance().UnitSpt().GetTile(pathUnit + id.ToString());
				unitPicArray.push(tempTexture);
				untNum = _Global.NumFormat(long.Parse(untNum.ToString()));
				unitNumArray.push(untNum);
            }
        }
    }
	
	private function parseObject(data:HashObject):String
	{	
		var a:int = 0;
		var returnStr:Array = new Array();
		for(var _data:System.Collections.DictionaryEntry in data.Table)
		{
			returnStr.push(data[_Global.ap + a].Value);
			a++;
		}
		
		return returnStr.join(",");
	}
}
