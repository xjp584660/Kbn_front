class MuseumEventListMenu extends PopMenu
{
	public var itemClone:MuseumEventListItem;
	public var item:MuseumEventListItem;
	private var backRects:Rect;
	private var rectOffset : RectOffset;
	private var data:KBN.EventEntity;
	public function Init()
	{
		super.Init();
		BaseInit();	
	}
	private function BaseInit(){
		item=Instantiate(itemClone) as MuseumEventListItem;
		item.Init();

		var menuBuilding:MuseumBuilding=MenuMgr.getInstance().getMenu("MuseumBuilding") as MuseumBuilding;
		if (menuBuilding!=null) {
			item.eventHandler=menuBuilding.eventDetail as IEventHandler;
		}

            rectOffset = new RectOffset(0, 0, 0, 0);	
	}

	public function OnPush(param:Object)
	{
		super.OnPush(param);
		data=param as KBN.EventEntity;
		if (data==null) {return;}
		item.SetRowData(param);
		rect.height=item.rect.height+10;
		frameSimpleLabel.rect.height=rect.height+7;	
		rect.y=(960-rect.height)/2;
	}
	private function RestPush(){
		if (data!=null) {
			data=IsArt()?
				Museum.singleton.GetArtById(data.id):
				Museum.singleton.GetEventById(data.id);
		}
		TryDestroy(item);
		BaseInit();
		OnPush(data);
	}

	public function OnPopOver()
	{
		super.OnPopOver();
		TryDestroy(item);
	}

	public function DrawItem()
	{
		item.Draw();
	}

	public function DrawBackground()
	{
		backRects = new Rect( 5 + rectOffset.left, 5 + rectOffset.top, rect.width - 15 - rectOffset.horizontal, rect.height - 15 - rectOffset.vertical);
		GUI.BeginGroup(backRects);
		DrawMiddleBg(_Global.INT32(backRects.width), 0);
		GUI.EndGroup();
	}
	private function IsArt():boolean{
		if (data!=null) {
			return data.tab>10;
		}
	}
	public function Update(){
		// super.Update()
		if (item) {
			item.Update();
		}
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.OnMutiClaimOK:
				RestPush();
				break;
		}
	}
}