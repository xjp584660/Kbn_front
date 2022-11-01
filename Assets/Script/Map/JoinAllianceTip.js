class JoinAllianceTip
{
	private static var instance:JoinAllianceTip;
	
	private var isPopupTip:boolean = false;

	public function JoinAllianceTip()
	{
		isPopupTip = false;
	}

	public static function getInstance():JoinAllianceTip
	{
		if(instance == null)
		{
			instance = new JoinAllianceTip();
			
			GameMain.instance().resgisterRestartFunc(function()
			{
				instance = null;
			});			
		}
		
		return instance;
	}

	public function setJoinAllianceTipEnable(_isPop:boolean):void
	{			
		isPopupTip = _isPop;
	}

	public function popupJoinAllianceTip():void
	{
		if(isPopupTip && !hasJoinAlliance())
		{
			MenuMgr.getInstance().PushMenu("JoinAlliancePopupMenu", null, "trans_zoomComp", true);
		}
		
		isPopupTip = false;				
	}
	
	public function handleOperation(OpName:String):void
	{
		switch(OpName)
		{
			case "createAlli":
				openCreateAllianceMenu();
				break;
				
			case "joinAlli":
				openJoinAllianceMenu();
				break;	
		}
	}
	
	private function openCreateAllianceMenu():void
	{
		var el:int = hasAllianceBuilding();
	
		if(el)
		{
			var object:Object = {"el":el, "submenu":"createAlli"};
			MenuMgr.getInstance().PushMenu("AllianceMenu", object);		
		}
		else
		{	
			var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
			ErrorMgr.instance().PushError("",Datas.getArString("Alliance.BuildAnEmbassy") );		
		}
	}
	
	private function openJoinAllianceMenu():void
	{
		var el:int = hasAllianceBuilding();
	
		if(el)
		{
			var object:Object = {"el":el, "submenu":"joinAlli"};
			MenuMgr.getInstance().PushMenu("AllianceMenu", object);
		}
		else
		{	
			var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
			ErrorMgr.instance().PushError("",Datas.getArString("Alliance.BuildAnEmbassy") );		
		}		
	}
	
	private function hasJoinAlliance():boolean
	{
		var hasjoin:boolean = false;

		if (Alliance.getInstance().MyAllianceId() <= 0)
		{
			hasjoin = false;
		}
		else
		{
			hasjoin = true;
		}		
						
		return hasjoin;
	}
	
	private function hasAllianceBuilding():int
	{
		var cityId:int;
		var el:int = 0;
		var seed:HashObject = GameMain.instance().getSeed();
		var cityInfos:Array = _Global.GetObjectValues( seed["cities"]);
		for( var i = 0; i < cityInfos.length; i ++ )
		{
			cityId = _Global.INT32((cityInfos[i] as HashObject)[_Global.ap+0]);
			el = Building.instance().getCountForType(Constant.Building.EMBASSY, cityId);
			if( el > 0 )
			{
				break;
			}
		}
		
		return el;
	}
}