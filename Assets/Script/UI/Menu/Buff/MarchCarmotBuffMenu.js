class MarchCarmotBuffMenu extends PopMenu
{
	public var scrollView : ScrollView;
	public var line : Label;
	public var time : Label;
	public var item:BuffSubMenuItem;
	private var curTimer:long;
	private var oldTimer:long;
	private var updateTimer:boolean;
	private var endTimer:long;
	private var info : CollectResourcesInfo;
	
	public function Init():void
	{
		super.Init();
		scrollView.Init();
	}
	
	function Update() 
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
			if(info.resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				time.txt = String.Format(Datas.getArString("Carmot.SpeedUp_Text1") , _Global.timeFormatStr(endTimer - curTimer));
			}
			else
			{
				time.txt = String.Format(Datas.getArString("ResourceCollect.SpeedUp_Text1") , _Global.timeFormatStr(endTimer - curTimer));
			}	 
		}
		else
		{
			updateTimer = false;
			time.SetVisible(false);
		}
	}
	
	public function DrawItem()
	{
		time.Draw();
		line.Draw();
		
		scrollView.Draw();
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Action.CLOSE_MARCHCARMOTBUFF_MENU:
				MenuMgr.getInstance().PopMenu("MarchCarmotBuff");
//				if (GameMain.instance().getMapController()!=null) {
//	    			GameMain.instance().getMapController().hitLastSlot();
//	   		 	}
				break;
		}			
	}
		
	public function OnPush(param:Object)
	{
		var data : Hashtable;
		info = param as CollectResourcesInfo;
		if(info.resourcesType == Constant.CollectResourcesType.CARMOT)
		{
			data = BuffAndAlert.instance().getSubMenuInfor(Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT, 3000); 
			title.txt = Datas.getArString("Carmot.SpeedUp_Text3");
		}
		else
		{
			data = BuffAndAlert.instance().getSubMenuInfor(Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT, 3001);
			title.txt = Datas.getArString("ResourceCollect.SpeedUp_Text2");
		}
				
		curTimer = GameMain.unixtime();
		endTimer = data["endTime"];
		if(endTimer > curTimer)
		{
			updateTimer = true;	
			time.SetVisible(true) ;
		}
		else
		{
			updateTimer = false;
			time.SetVisible(false);
		}
		
		scrollView.clearUIObject();
		var arr : Array = data["items"] as Array;
		var buffSubMenuItem : BuffSubMenuItem;		
		for(var a:int = 0; a < arr.length; a++)
		{
			buffSubMenuItem = Instantiate(item);
			buffSubMenuItem.Init();
			buffSubMenuItem.setData(arr[a]);		
			scrollView.addUIObject(buffSubMenuItem);
		}
		
		scrollView.AutoLayout();
		scrollView.MoveToTop();
	}
	
	public function OnPop()
	{
		super.OnPop();
		scrollView.clearUIObject();
	}
}