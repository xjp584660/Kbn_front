import System.Collections;
import System.Collections.Generic;
class EventDetail extends UIObject implements IEventHandler
{
	public var desLabel:Label;
	public var scrollView:ScrollView;
	public var scrollItem:MuseumListItem;
	
	public var tabBarClone:ToolBar;
	private var tabBar:ToolBar;
	public var toolBarView:ScrollView;
	
	public static var RESET_EVENT_DISPLAY:String = "resetDis";
	
	private var scrollViewArray:ScrollView[];
	private var drawScrollView:boolean;

	public var TAB_TYPE:int=1;  //0:Artic;1:Event
	public var leftIcon:Button;
	public var rightIcon:Button;

	public function Init()
	{
		super.Init();
		tabBar=Instantiate(tabBarClone) as ToolBar;
		desLabel.Init();
		scrollView.Init();
		scrollItem.Init();

		toolBarView.Init();
		
		tabBar.Init();
		leftIcon.Init();
		rightIcon.Init();
		leftIcon.OnClick=moveToTop;
		rightIcon.OnClick=moveToButtom;
		scrollViewArray = new ScrollView[6];
		for (var i = 0; i < 6; i++) {
			scrollViewArray[i] = Instantiate(scrollView) as ScrollView;
			scrollViewArray[i].Init();
		}
		ResetFunc();
		// scrollViewArray = new ScrollView[tabBar.toolbarStrings.Length];   之前的
		

		toolBarView.addUIObject(tabBar);
		toolBarView.AutoLayout();
	
		tabBar.indexChangedFunc = indexChangedFunc;
		
		drawScrollView = true;
		
		desLabel.txt = Museum.singleton.getNoEventDes;
	}
	private function ResetFunc(){
		if (TAB_TYPE==0) {
			tabBar.toolbarStrings = [
			Datas.getArString("Museum.ArtifactSubtab1"),
			Datas.getArString("Museum.ArtifactSubtab2"),
			Datas.getArString("Museum.ArtifactSubtab3"),
			Datas.getArString("Museum.ArtifactSubtab4")
			];
			tabBar.rect.width=560;
			leftIcon.SetVisible(false);
			rightIcon.SetVisible(false);
		}else if (TAB_TYPE==1) {
			tabBar.toolbarStrings = [
			Datas.getArString("Museum.EventSubtab1"),
			Datas.getArString("Museum.EventSubtab2"),
			Datas.getArString("Museum.EventSubtab3"),
			Datas.getArString("Museum.EventSubtab4"),
			Datas.getArString("Museum.EventSubtab5"),
			Datas.getArString("Museum.EventSubtab6")
			];
			tabBar.rect.width=750;
			leftIcon.SetVisible(true);
			rightIcon.SetVisible(true);
			
			// var newscrollViewArray:ScrollView[];
			// newscrollViewArray=new ScrollView[6];
			// for (var i = 0; i < scrollViewArray.Length; i++) {
			// 	newscrollViewArray[i] = scrollViewArray[i];
			// }
			// newscrollViewArray[4]=Instantiate(scrollView) as ScrollView;
			// newscrollViewArray[5]=Instantiate(scrollView) as ScrollView;
			// newscrollViewArray[4].Init();
			// newscrollViewArray[5].Init();
			// scrollViewArray=newscrollViewArray;
		}
		// if (tabBar.selectedIndex>=tabBar.toolbarStrings.Length) {
		// 	tabBar.SelectTab(0);
		// }
	}
		
	
	public function Draw()
	{
		if (drawScrollView)
		{
			// tabBar.Draw();
		}
		
		if (drawScrollView && tabBar.selectedIndex >= 0 && tabBar.selectedIndex < scrollViewArray.Length)
		{
			scrollViewArray[tabBar.selectedIndex].Draw();
			desLabel.SetVisible(scrollViewArray[tabBar.selectedIndex].numUIObject == 0);
		}

		toolBarView.Draw();
		
		desLabel.Draw();
		leftIcon.Draw();
		rightIcon.Draw();
	}
	
	private function clearAllItems()
	{
		if(scrollViewArray == null)
		{
			return;
		}
		for (var i = 0; i < scrollViewArray.Length; i++)
		{
			if(scrollViewArray[i] != null)
			{
				scrollViewArray[i].clearUIObject();					
			}
		}
	}
//	private function clearCurItems(current:int)
//	{
//		scrollViewArray[current].clearUIObject();
//	}
	
	public function showDescription():void
	{
		clearAllItems();
		drawScrollView = false;
		desLabel.SetVisible(true);		
	}
	
	public function hideSelf():void
	{
		clearAllItems();
		drawScrollView = false;
		desLabel.SetVisible(false);			
	}
	
	public function setDisplay(arr:List.<KBN.EventEntity>):void
	{
		// var events:List.<KBN.EventEntity> = Museum.instance().getOrderedEvents;
		if (scrollViewArray==null||arr==null) {
			return;
		}
		var events:List.<KBN.EventEntity> = arr;
		//_Global.LogWarning("setDIsplay"+arr.Count);
		
		clearAllItems();
		ResetFunc();
		toolBarView.AutoLayout();
//		if(events.length == 0)
//		{
//			drawScrollView = false;
//			desLabel.SetVisible(true);
//		}
//		else
//		{
			drawScrollView = true;
			desLabel.SetVisible(false);
			//var nonEmptyTab:int = scrollViewArray.Length;
			var obj:MuseumListItem;	

			for(var a:int = 0; a < events.Count; a ++)
			{
				var event:KBN.EventEntity = events[a] as KBN.EventEntity;
				obj = Instantiate(scrollItem);
				obj.Init();
				obj.SetRowData(event);
				// obj.eventHandler = this;
				//_Global.LogWarning("tab:"+event.tab+"tabBar.selectedIndex"+tabBar.selectedIndex);
				if (event.tab>10) {
					if (scrollViewArray[event.tab - 11]!=null) {
						scrollViewArray[event.tab - 11].addUIObject(obj);
					}
					
				}
				else{
					if (scrollViewArray[event.tab - 1]!=null) {
					
						scrollViewArray[event.tab - 1].addUIObject(obj);
					}
					
				}
				
				// if (event.tab>10) 
				// {
				// 	if (event.tab - 11 < nonEmptyTab)
				// 	{
				// 		nonEmptyTab = event.tab - 11;
				// 	}
				// }else{
				// 	if (event.tab - 1 < nonEmptyTab)
				// 	{
				// 		nonEmptyTab = event.tab - 1;
				// 	}
				// }
				
			}
			
			for (var i = 0; i < scrollViewArray.Length; i++)
			{
				scrollViewArray[i].AutoLayout();
				scrollViewArray[i].MoveToTop();
			}
			
			// if (nonEmptyTab != scrollViewArray.Length)
			// {
			// 	// tabBar.selectedIndex = nonEmptyTab;
			// 	tabBar.SelectTab(nonEmptyTab);
			// 	indexChangedFunc(nonEmptyTab);
			// }
			// else
			// {
			// 	// tabBar.selectedIndex = 0;
				tabBar.SelectTab(0);
				indexChangedFunc(0);
			// }
//		}
	}
	
	public function indexChangedFunc(index:int):void
	{
		drawScrollView=true;
		//_Global.LogWarning("index:"+index+"tabBar.selectedIndex"+tabBar.selectedIndex);
		for (var i = 0; i < scrollViewArray.Length; i++)
			scrollViewArray[i].SetVisible(i == index);
	}
		
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			case RESET_EVENT_DISPLAY:
				resetDisplay(param);
		}
	}

	public function moveToTop(){
		toolBarView.MoveToTop();
	}
	public function moveToButtom(){
		toolBarView.MoveToBottom();
	}

	
	public function resetDisplay(param:Object):void
	{
		// if (TAB_TYPE==0) {
		// 	return;
		// }
		var isArt:boolean=_Global.INT32(param)==1;
		if(scrollViewArray == null)
		{
			return;
		}
		var eventsComLists:Array[] = new Array[scrollViewArray.Length];
	
		for (var i = 0; i < scrollViewArray.Length; i++)
		{
			eventsComLists[i] = scrollViewArray[i].getUIObject();
		}
		var eventsCom:Array = null;
//		Museum.instance().EventOrder();
		var events:List.<KBN.EventEntity> = isArt?Museum.instance().getArtiFacts:Museum.instance().getOrderedEvents;
		//_Global.LogWarning("resetDisplay"+events.Count);
		var event:KBN.EventEntity;
		var eventObj:MuseumListItem;
		
		var curSelectIndex:int= tabBar.selectedIndex;
//		scrollViewArray[curSelectIndex].clearUIObject();
//		var obj:MuseumEventListItem;
		for(var b:int = 0; b < events.Count; b++)
		{
			event = events[b];
			Debug.Log("isArt:"+isArt+" event.id:"+event.id+"  event.tab:"+event.tab);
			eventsCom = eventsComLists[isArt?(event.tab - 11):(event.tab - 1)];
			for(var a:int = 0; a < eventsCom.length;a++)
			{
				eventObj = eventsCom[a];
				if(eventObj.getId == event.id)
				{
					eventObj.SetRowData(event);
				}
			}
//			if(curSelectIndex==(event.tab - 1))
//			{	
//				obj = Instantiate(scrollItem);
//				obj.SetRowData(event);
//				obj.eventHandler = this;
//				scrollViewArray[event.tab - 1].addUIObject(obj);
//			}		
	
		}
//		scrollViewArray[curSelectIndex].AutoLayout();
	}
		
	public function Update()
	{
		// Debug.Log("tabBar.selectedIndex:"+tabBar.selectedIndex);
		// Debug.Log("scrollViewArray.Count:"+scrollViewArray.Length);
		scrollViewArray[tabBar.selectedIndex].Update();

		toolBarView.Update();
	}
	
	public	function	Clear()
	{
		for (var i = 0; i < scrollViewArray.Length; i++) {
			scrollViewArray[i].clearUIObject();
			TryDestroy(scrollViewArray[i]);
			scrollViewArray[i] = null;
		}
		
		scrollViewArray = null;

		toolBarView.clearUIObject();
	}
}