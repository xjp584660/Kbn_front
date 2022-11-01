public class RallyMoveItem extends FullClickItem
{
	public var l_img 	:Label;
	public var l_status	:Label;
	public var l_action	:Label;
	public var l_corxy	:Label;
	public var btn_view :Button;
	public var bg_line :Texture2D;
	public var bgY:float = 120;
//	public var area_Btn:SimpleButton;	

//	public var btn_recall:Button;
//	public var btn_speedup:Button;
	
	protected var rmVO:MarchVO;
	
	public function Awake()
	{
		super.Awake();
		
//		Init();
	}
	
	function Init()
	{
		super.Init();
		btnDefault.OnClick = buttonHandler;
		btn_view.OnClick = buttonHandler;
//		btn_recall.OnClick = buttonHandler;
//		btn_speedup.OnClick = buttonHandler;
//		
//		btn_view.txt = "View";
//		btn_speedup.txt = "Speed UP";
		
		btnDefault.clickParam = btn_view.clickParam = "view";
//		btn_recall.clickParam = "recall";
//		btn_speedup.clickParam = "speed";
		
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		DrawDefaultBtn();		
		line.Draw();
		
		if(rmVO && rmVO.marchStatus != Constant.MarchStatus.DEFENDING)
		{
			var status:String;
			if(rmVO.marchType == Constant.MarchType.SURVEY && rmVO.marchStatus == Constant.MarchStatus.OUTBOUND)
			{
				status = Datas.getArString("Common.Surveying");
			}			
			else if(rmVO.marchType == Constant.MarchType.COLLECT && rmVO.marchStatus == 2)
			{
				status = Datas.getArString("Newresource.march_gathering_Nolevel");
			}
			else if(rmVO.marchType == Constant.MarchType.COLLECT_RESOURCE && rmVO.marchStatus == 2)
			{
				status = Datas.getArString("Newresource.march_gathering_Nolevel1");
			}	
			else
			{
				status = rmVO.marchStatusStr;
			}
				
			l_status.txt = status + "(" + _Global.timeFormatStr(rmVO.timeRemaining) + ")";
		}
		
//		this.drawTexture(bg_line,0,bgY);
		l_img.Draw();
		l_action.Draw();
		l_status.Draw();
		l_corxy.Draw();
		btn_view.Draw();
//		btn_recall.Draw();
//		btn_speedup.Draw();
		
		GUI.EndGroup();
	}

	public function SetRowData(data:Object)
	{
		//
		Init();
		rmVO = data as MarchVO;
		if(rmVO.marchType == Constant.MarchType.TRANSPORT || rmVO.marchType == Constant.MarchType.REASSIGN)
		{
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_transport");
			//l_img.tile.name = "icon_transport";
		//	l_img.mystyle.normal.background  = TextureMgr.instance().LoadTexture("icon_transport", TextureType.ICON_ELSE);
		}
		else
		{
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().GeneralSpt().GetTile(General.instance().getGeneralTextureName(rmVO.knightName, GameMain.instance().getCurCityOrder()));
			//l_img.tile.name = General.instance().getGeneralTextureName(rmVO.knightName, GameMain.instance().getCurCityOrder());
			
//			l_img.mystyle.normal.background = General.getGeneralTexture(rmVO.knightName);
		}
		
		l_action.txt = rmVO.marchTypeStr;
		if(rmVO.marchType == Constant.MarchType.SURVEY && rmVO.marchStatus == Constant.MarchStatus.OUTBOUND)
			l_status.txt = Datas.getArString("Common.Surveying");
		else if(rmVO.marchType == Constant.MarchType.COLLECT && rmVO.marchStatus == 2)
			l_status.txt=Datas.getArString("Newresource.march_gathering_Nolevel");
		else if(rmVO.marchType == Constant.MarchType.COLLECT_RESOURCE && rmVO.marchStatus == 2)
		{
			l_status.txt=Datas.getArString("Newresource.march_gathering_Nolevel1");
		}
		else
			l_status.txt = rmVO.marchStatusStr;
		if(rmVO.toXCoord>=0 && rmVO.toYCoord>=0)
			l_corxy.txt = "(" + rmVO.toXCoord + "," + rmVO.toYCoord + ")";
		else
			l_corxy.txt = "";
		
//		btn_recall.SetVisible(rmVO.marchStatus == Constant.MarchStatus.DEFENDING);
//		btn_speedup.SetVisible(rmVO.marchStatus != Constant.MarchStatus.DEFENDING);
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "view": // TODO: popupMarch View.
//				MenuMgr.getInstance().PushMenu("MarchInfo",rmVO.marchId);
				if(handlerDelegate)
					handlerDelegate.handleItemAction("RALLY_ITEM_NEXT",rmVO);

				break;
			case "recall":
				RallyPoint.instance().recall(rmVO.marchId, rmVO.marchType, rmVO.cityId, null); 
				
				MenuMgr.getInstance().PopMenu("");
				break;
			case "speed":
				MenuMgr.getInstance().PushMenu("SpeedUpMenu",rmVO, "trans_zoomComp");

				break;
		}	
			
	}
}
