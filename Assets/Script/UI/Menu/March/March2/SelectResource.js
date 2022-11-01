class SelectResource extends PopMenu implements IEventHandler
{

    public var scroll_resource :ScrollList;
    public var ins_ResourceItem :ListItem;
  
    public var tp_l_resource2:Label;
    public var btn_next     :Button;
	public var navHead  :NavigatorHead;	
    public var texture_line :Texture2D;
    public var blankTip	:Label;
    //private var marchresource:long[] = [0l,0l,0l,0l,0l,0l,0l,0l];
    private var resourceList:Array;

    private var carmotWeight:float = 1;
    private var select_resources:long;
    private var march_type 	:int;

    function Init()
    {
        super.Init();
        ins_ResourceItem.Init();	
        scroll_resource.Init(ins_ResourceItem);
        scroll_resource.itemDelegate = this;
        var seed:HashObject = GameMain.instance().getSeed();
        carmotWeight = _Global.FLOAT(seed["carmotweight"].Value);
        btn_next.OnClick = OnNextBtnClick;
    }
    public function OnPush(param:Object)
    {
        scroll_resource.rect.x = 0;
        scroll_resource.SetResposeAngle(60);
        setData();
        calcResources();
     
       
        tp_l_resource2.txt = _Global.NumSimlify(select_resources) + "/" + _Global.NumSimlify(MarchDataManager.instance().max_resource);
        navHead.titleTxt = Datas.getArString("ModalTitle.Choose_Resources");
        tp_l_resource2.SetVisible(true);				
        switch(march_type)
        {
            case Constant.MarchType.TRANSPORT:
                btn_next.txt = Datas.getArString("Common.Transport");	
                break;
            case Constant.MarchType.REASSIGN:
                btn_next.txt = Datas.getArString("Common.Reassign");
                break;
        }
        if(resourceList == null || resourceList.length  == 0){
            blankTip.txt = Datas.getArString("March.NO_Resource");				
            this.blankTip.SetVisible(true);
            this.scroll_resource.SetVisible(false);
        }
        else{
            scroll_resource.SetData(resourceList);	
            scroll_resource.ResetPos();
            this.blankTip.SetVisible(false);
            this.scroll_resource.SetVisible(true);
        }
       
        btn_next.txt = MarchDataManager.instance().GetNextBtnTxt();
    }
    public function DrawBackground()
	{
		super.DrawBackground();
		this.drawTexture(texture_line,45,105,490,17);
//		this.drawTexture(texture_line,10,750,550,17);
//		DrawTextureClipped(texture_line, Rect( 0, 0, texture_line.width, texture_line.height ), Rect( 0, 119, 550,17), UIRotation.NONE);
	}
    public	function	OnPopOver()
	{
        scroll_resource.Clear();
    }
    function UpdateData()
    {

   
        calcResources();
        tp_l_resource2.txt = _Global.NumSimlify(select_resources) + "/" + _Global.NumSimlify(MarchDataManager.instance().max_resource);

    }

    public function DrawItem()
    {
        scroll_resource.Draw();
        tp_l_resource2.Draw();
        btn_next.Draw();
        navHead.Draw();
        blankTip.Draw();

    }
    function setData():void
    {
        resourceList = MarchDataManager.instance().resourceList;
        march_type = MarchDataManager.instance().march_type;
    }
    function setMarchData():void
	{
        MarchDataManager.instance().select_resources =  this.select_resources ;
        //marchDataIns.heroList =  this.heroList ;
	}

    public function Update()
    {
        scroll_resource.Update();
    }
    
    public function handleItemAction(action:String,param:Object):void
	{
        var last_itemData:Object;
		var data:Hashtable = param as Hashtable;
		switch(action)
        {
            case Constant.Action.MARCH_RESOURCE_SELECT:
                UpdateData();
				break;
        }
    }

        
    public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PVE_MARCH_BEGIN:
            case Constant.Notice.SEND_MARCH:
                //add march progressbar to mainchrom
                if(MenuMgr.instance.getMenu("SelectResource") != null)
				{
					MenuMgr.getInstance().PopMenu("SelectResource");
				}
				
				//March.instance().addPveQueueItem();
				break;
    	}
    }
	private function calcResources():void
	{
		select_resources = calcListSelectNum(resourceList);
		if(select_resources > MarchDataManager.instance().max_resource)
		{
			tp_l_resource2.SetNormalTxtColor(FontColor.Red);
			
		}
		else
		{
			tp_l_resource2.SetNormalTxtColor(FontColor.TabNormal);
		}
    }
    
    private function calcListSelectNum(list:Array):long
	{
        if(list == null)
            return 0;

		var n:int = list.length;
		var i:int;
		var sum:long = 0;
		for(i=0; i<n; i++)
		{	
			if(i==5){
				sum += (list[i] as ResourceVO).selectNum*carmotWeight;
			}else sum += (list[i] as ResourceVO).selectNum;
		}
		return sum;
    }
    function OnNextBtnClick():void
	{
        var error:int = 0;
		var errorStr:String = "";
        if(select_resources <= 0)
        {
            if(march_type != Constant.MarchType.REASSIGN)
            {
                error = 22;
                errorStr = Datas.getArString("Error.March_NeedResources");
            }
        }
        else
        if(select_resources > MarchDataManager.instance().max_resource)
        {
            error = 23;
            errorStr = Datas.getArString("Error.March_ResourceLimited");
        }
        if(error > 0)
		{
			ErrorMgr.instance().PushError("",errorStr);
			return;
        }
        setMarchData();
        if(march_type == Constant.AvaMarchType.ATTACK || march_type == Constant.AvaMarchType.REINFORCE || march_type == Constant.AvaMarchType.RALLYATTACK || march_type == Constant.AvaMarchType.RALLYREINFORCE)
        MenuMgr.getInstance().PushMenu("MarchBoostComplex",{"type":MarchBoostComplex.BOOST_TYPE.AVA},"trans_zoomComp");
        else
        MenuMgr.getInstance().PushMenu("MarchBoostComplex",{"type":MarchBoostComplex.BOOST_TYPE.NORMAL},"trans_zoomComp");
    }

}