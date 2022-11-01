
class SelectKnight extends PopMenu implements IEventHandler
{
    public var scroll_general :ScrollList;
    public var ins_GeneralItem :ListItem;
    public var navHead:NavigatorHead;	
    public var btn_next :Button;
    public var texture_line :Texture2D;
    public var blankTip	:Label;


    private var generalList	:Array;
    private var item_general_data	:GeneralInfoVO;


     public function Init()
     {
        super.Init();
        ins_GeneralItem.Init();
        scroll_general.Init(ins_GeneralItem);
        scroll_general.itemDelegate = this;
        navHead.titleTxt = Datas.getArString("ModalTitle.Select_General");
        btn_next.OnClick = OnNextBtnClick;
     }
     public function OnPush(param:Object)
     {
        setData();
        scroll_general.rect.x = 0;
        if(generalList == null || generalList.length == 0)
        {
            blankTip.txt = Datas.getArString("Generals.NoGeneral");
            this.blankTip.SetVisible(true);
            this.scroll_general.Clear();
            this.scroll_general.SetVisible(false);			
        }			
         else{
            this.scroll_general.Clear();
            scroll_general.SetData(generalList);
            scroll_general.ResetPos();
            if(!MarchDataManager.instance().isAVA){
                refreshGeneralScrollData();
            }
            this.blankTip.SetVisible(false);
            this.scroll_general.SetVisible(true);	
         }
       // SetData(data);
       
        btn_next.txt = MarchDataManager.instance().GetNextBtnTxt();
        
     }
     public function DrawBackground()
     {
         super.DrawBackground();
         this.drawTexture(texture_line,45,105,490,17);
     }

     public	function	OnPopOver()
     {
        scroll_general.Clear();
     }
     public function Update()
     {
        scroll_general.Update();
     }
         
     public function DrawItem()
     {
        btn_next.Draw();
        scroll_general.Draw();
        navHead.Draw();
        blankTip.Draw();
     }


     function setData():void
     {
        generalList = MarchDataManager.instance().generalList;
        item_general_data = MarchDataManager.instance().item_general_data;
     }
	function refreshGeneralScrollData(){
	
		var okFunc:Function=function(mData:Array){
			generalList=mData;
			scroll_general.SetData(generalList);
			if(generalList.length>0){
				(generalList[0] as GeneralInfoVO).selected=true;
			}
		};
		General.instance().refreshGeneralStatus(okFunc,-1);
    }
    

   
    public function updateGeneralExp():void
	{
			var gid:int = 0;
			if(item_general_data)
				gid = item_general_data.knightId;			
			generalList = General.instance().getMarchAbleKinghtList(gid);
			calcSelectedGeneral();
            scroll_general.SetData(generalList);		
    }
    protected function calcSelectedGeneral():void
	{
		if(!generalList)
			return;
		var i:int;
		item_general_data = null;
		for(i=0; i<generalList.length; i++)
		{
			if((generalList[i] as GeneralInfoVO).selected)
				item_general_data = generalList[i] as GeneralInfoVO;
		}
    }
    public function handleItemAction(action:String,param:Object):void
	{
        var last_itemData:Object;
		var data:Hashtable = param as Hashtable;
		switch(action)
		{
            case Constant.Action.MARCH_GENERAL_SELECT:
                if(item_general_data)
                    item_general_data.selected = false;
                item_general_data = param;
                item_general_data.selected = true;	
                MarchDataManager.instance().item_general_data = this.item_general_data;
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
				MenuMgr.getInstance().PopMenu("SelectKnight");
			
				//March.instance().addPveQueueItem();
				break;
    	}
    }
    function OnNextBtnClick()
    {
        var error:int = 0;
        var errorStr:String = "";
        if( MarchDataManager.instance().isAVA)
        {
            if(item_general_data == null)
				{
					error =  11;					
					errorStr = Datas.getArString("Error.March_NeedGeneral");
				}
        }else{
           if(Building.instance().getMaxLevelForType(Constant.Building.GENERALS_QUARTERS,GameMain.instance().getCurCityId() ) <= 0)
            {
                error = 21;
                errorStr = Datas.getArString("March.Need_GeneralsQuarters");
            }
            else
            if(item_general_data == null)
            {
                error =  11;					
                errorStr = Datas.getArString("Error.March_NeedGeneral");
            }
        }
        if(error > 0)
		{
			ErrorMgr.instance().PushError("",errorStr);
			return;
        }
        MarchDataManager.instance().item_general_data = this.item_general_data;
        if(MarchDataManager.instance().IsDefaultType()){
          MenuMgr.getInstance().PopMenu("");
          MenuMgr.instance.sendNotification (Constant.Notice.SET_MARCH_GENERAL,null);
        }
        else
        {
         MenuMgr.getInstance().PushMenu("ChooseTroops",null,"trans_zoomComp");
        }
    }



}