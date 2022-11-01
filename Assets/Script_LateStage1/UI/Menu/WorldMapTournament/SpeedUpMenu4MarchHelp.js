
class	SpeedUpMenu4MarchHelp extends	PopMenu implements IEventHandler{

	public	var	separateLine1:Label;
	public	var	timeTxtLabel:Label;
	public	var	timeIconLabel:Label;
	public	var	percentBar:PercentBar;
	
	public	var	listView:ScrollList;
	public	var	speedUpItem:SpeedUpItem4MarchHelp;
	
	
	private	var	speedUpData:QueueItem;
	private	var	typeId:int;
	private	var	onMinAgo:long;
	private	var data:Array = new Array();
	private var isCloseAfterAnimationFinish:boolean = false;
	
	private var barCurValue:float;
	private var barMaxValue:int;
	private var marchEndTime:long;
	private var marchStartTime:long;

	
	function Init()
	{
	    super.Init();
		listView.Init(speedUpItem);
		title.txt = Datas.getArString("Common.Speedup");
		separateLine1.setBackground("between line", TextureType.DECORATION);
		
		
		isCloseAfterAnimationFinish = false;
		btnClose.OnClick = OnCloseClick;
		listView.itemDelegate = this;
	}
	
	
	public	function	Update()
	{
		listView.Update();


		var remainder:int=barMaxValue-barCurValue;
		barCurValue+=Time.deltaTime;
		timeTxtLabel.txt=KBN._Global.timeFormatShortStrEx(remainder,false);
		if(percentBar.visible==true)
		{
			percentBar.update(barCurValue);
			if(remainder<=0)
			{
				MenuMgr.getInstance().PopMenu("");
	        	MenuMgr.getInstance().PushMessage(Datas.getArString("Alliance.Request_March_Toaster"));
			}
		}
	}
	
	public function handleNotification(type : String, param : Object) : void
    {
    	switch (type)
	    {
	    	case Constant.PvPResponseOk.RefreshTheEndTimeOfMarchLine:
	    		if(GameMain.unixtime()>=KBN.TournamentManager.getInstance().theNewEndTime)
	    		{
	    			MenuMgr.getInstance().PopMenu("");
	        		MenuMgr.getInstance().PushMessage(Datas.getArString("Alliance.Request_March_Toaster"));
	    		}
	    		else
	    		{
	    			MenuMgr.instance.PopMenu("");
	    		}
	    	break;
	    }
    }
	
	public function DrawItem()
	{
		separateLine1.Draw();
		
		listView.Draw();
		percentBar.Draw();
		timeIconLabel.Draw();
		timeTxtLabel.Draw();
	}
	
	public	function	OnPush( p:Object ){
		super.OnPush( p );
		
		var array : Array = new Array();
		
		var marchData:HashObject=(p as HashObject);
		marchEndTime=_Global.INT64(marchData["marchEndTime"].Value);
		marchStartTime=_Global.INT64(marchData["marchStartTime"].Value);
		barCurValue=GameMain.unixtime()-marchStartTime;
		barMaxValue=marchEndTime-marchStartTime;
		percentBar.Init(barCurValue,barMaxValue);
		
		var items : Array = [21100, 21101, 21102, 21103];
		
		for( var i : int = 0; i < items.Count; ++i ) {
			var id : int = items[i];
			var num : int = KBN.MyItems.singleton.countForItem( id );
		
			var a : Hashtable = new Hashtable();
		    a.Add( "itemId", ""+id );
		    a.Add( "itemName", Datas.getArString( String.Format( "itemName.i{0}", ""+id ) ) );
		    a.Add( "itemDesc", Datas.getArString( String.Format( "itemDesc.i{0}", ""+id ) ) );
			a.Add( "count", ""+num );
			a.Add( "canGiveHelp", marchData["canGiveHelp"].Value );
			a.Add( "cannotGiveHelp", marchData["cannotGiveHelp"].Value );
			array.Add( a );
		}
		listView.SetData( array );
	}
	
	public	function	OnPopOver()
	{
		listView.Clear();
	}
	
	private function OnCloseClick()
	{
		MenuMgr.getInstance().PopMenu("SpeedUpMenu4MarchHelp");
	}

}
