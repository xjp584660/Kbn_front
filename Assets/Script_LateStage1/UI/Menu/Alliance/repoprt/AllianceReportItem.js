public class AllianceReportItem extends FullClickItem
{
	public var l_line	:Label;
	public var l_data :Label;
	public var l_type :Label;
	
	public var l_from:Label;
	public var l_from_name:Label;
	public var l_to:Label;
	public var l_to_name:Label;
	public var l_result:Label;
	
	public var btn_next :Button;
//	public var area_Btn:SimpleButton;
	
//	protected var apvo :AllianceReportVO;
	protected var mdata:HashObject;
	public function Init()
	{
		super.Init();
		btn_next.OnClick = onClick;
		btnDefault.OnClick = onClick;
		
		l_from.txt = Datas.getArString("Common.From")+":";
		l_to.txt = Datas.getArString("Common.To")+":";
		
//		var f_min:float;
//		var f_max:float;
//		
//		l_from.mystyle.CalcMinMaxWidth(GUIContent(l_from.txt),f_min,f_max);
//		l_from_name.rect.x = l_from.rect.x + f_min;
//		
//		l_to.mystyle.CalcMinMaxWidth(GUIContent(l_to.txt),f_min,f_max);
//		l_to_name.rect.x = l_to.rect.x + f_min;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);			
			DrawDefaultBtn();
			line.Draw();
			
			l_data.Draw();
			l_type.Draw();
			l_to.Draw();
			l_to_name.Draw();
			l_from.Draw();
			l_from_name.Draw();
			l_result.Draw();
			btn_next.Draw();
		GUI.EndGroup();
	}
	public function SetRowData(data:Object):void
	{
		Init();
		var tpStr:String;		
		this.mdata = data as HashObject;
		/**
		apvo = data as AllianceReportVO;	//for old method
		if(apvo)
		{
			tpStr = _Global.timeFormatStr(apvo.reportUnixTime);
			l_data.txt = tpStr;
			//
			tpStr = March.getMarchTypeString(apvo.marchType);
			
			if(apvo.side0PlayerId == Datas.instance().tvuid())
			{
				tpStr = tpStr + "(" + AllianceReportVO.getCityName(apvo.side0CityId) + ")";
			}
			else
			{
				tpStr = tpStr + "(" + apvo.side0XCoord + "," + apvo.side0YCoord + ") ";
			}
			//reportType.push(g_mapObject.types[_Global.INT32(report.side0TileType, 10)].capitalize());
			tpStr = tpStr + March.getTileTypeString(apvo.side0TileType);
			
			if(apvo.side0PlayerId == 0) //barbarian camp.
			{
				tpStr = tpStr + " (" + Datas.instance().arStrings()["common"]["BarbarianCamp"] + ")";
			}
			else
			{
				tpStr = tpStr + " (" + AllianceReportVO.getPlayerName(apvo.side1PlayerId) + ")";
			}
			
			l_type.txt = tpStr;
		}		
		**/
		/**
			fromUserName
			toUserName
			isWin
			marchType { scount,
			
			Message,
		*/
		l_data.txt = mdata["date24"].Value;
		//l_type.txt = data["subject"];
		/// from to _name  color
		//CC9D4D  EB121B
		if(Datas.getHashObjectValue(mdata,"side") == 1)	//
		{
//			l_from_name.mystyle.normal.textColor = _Global.ARGB("0xFFFFFFFF");
//			l_to_name.mystyle.normal.textColor = _Global.ARGB("0xFFCF1300");
			l_from_name.SetNormalTxtColor(FontColor.Button_White);
			l_to_name.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
//			l_from_name.mystyle.normal.textColor = _Global.ARGB("0xFFCF1300");
//			l_to_name.mystyle.normal.textColor = _Global.ARGB("0xFFFFFFFF");
			l_from_name.SetNormalTxtColor(FontColor.Red);
			l_to_name.SetNormalTxtColor(FontColor.Button_White);
		}
		
		l_from_name.SetFont();
		l_to_name.SetFont();
		var clippedText : String = _Global.GUIClipToWidth(l_from_name.mystyle, 
			mdata["atknm"].Value, l_from_name.rect.width, "...", null);
		l_from_name.txt = clippedText;
		
		clippedText = _Global.GUIClipToWidth(l_to_name.mystyle, 
			mdata["defnm"].Value, l_to_name.rect.width, "...", null);
		l_to_name.txt = clippedText;
		
		
		l_type.useTile = true;
		//l_type.tile.spt = TextureMgr.instance().ElseIconSpt();
		
		l_result.useTile = true;
		//l_result.tile.spt = TextureMgr.instance().ElseIconSpt();
		
		var marchType:int = _Global.INT32(mdata["marchtype"]);
		
		switch(marchType)
		{
			case Constant.MarchType.SCOUT:
				l_type.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_reports_scout");	//TODO..
				break;
			default:
				l_type.tile = TextureMgr.instance().ElseIconSpt().GetTile("swords");
				break;
		}
		
		if(mdata["isWin"]!= null && mdata["isWin"].Value == true)
		{
			l_result.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_reports_win");
		}
		else
		{
			l_result.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_reports_lose");
		}
		
		
	}
	
	public function onClick(clickParam:Object)
	{
		if(this.handlerDelegate)
		{	
			handlerDelegate.handleItemAction(Constant.Action.ALLIANCE_REPORT_NEXT,mdata);
		}
	}
	
	
}
