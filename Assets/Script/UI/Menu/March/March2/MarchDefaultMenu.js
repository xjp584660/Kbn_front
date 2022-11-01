class MarchDefaultMenu extends PopMenu
{
   
    public var march_Btn     :Button;
    public var save_Btn      :Button;
    public var knight_Btn    :Button;
    public var troops_Btn    :Button;
    public var buff_Btn      :Button;
	public var navHead       :NavigatorHead;		
    public var texture_line  :Texture2D;
    public var line          :Label;

    public var ins_generalItem   :MarchGeneralItem3;
    public var generalCon    :ComposedUIObj;

    public var scroll_troop  :ScrollList;
    public var ins_troopItem :ListItem;

    public var l_img    : Label;
    public var l_name   : Label;
    public var l_img2   : Label;
    public var l_name2  : Label;
    public var l_img3   : Label;
    public var l_name3  : Label;

    public var L_Title1 : Label;
    public var l_Title2 : Label;

    public var toggleBtn1 : ToggleButton;
    public var toggleBtn2 : ToggleButton;
    public var toggleBtn3 : ToggleButton;
    public var toggleBtn4 : ToggleButton;
    public var toggleBtn5 : ToggleButton;

    public var bufficon1  : Label;
    public var bufficon2  : Label;
    public var bufficon3  : Label;

    public var l_mtile    : Label;
    public var l_Notice1  : Label;
    public var l_Notice2  : Label;


    @Space(20) @Header("----------发送March的时间间隔----------")
    public var Marchtime: float;

    private var listToggle : Array;
    private var listBUff   : Array;
    private var listheroImg: Array;
    private var listName   : Array;

    private var tempTroopList:Array = new Array();
    private var giVO         :GeneralInfoVO;
    private var tempheroList :Array = new Array();
    private var tempbuffList :Array = new Array();
    private var curIndex     :int;


    private var MarchDataIns :MarchDataManager;

    private var isCity : boolean = false;
    
    public function Init()
    {
        super.Init();
        listToggle = [toggleBtn1,toggleBtn2,toggleBtn3,toggleBtn4,toggleBtn5];
        this.listBUff = [bufficon1,bufficon2,bufficon3];
        this.listheroImg = [l_img,l_img2,l_img3];
        this.listName = [l_name,l_name2,l_name3];
        generalCon.clearUIObject();
        scroll_troop.Init(ins_troopItem);
        navHead.titleTxt = Datas.getArString("ModalTitle.March");
        L_Title1.txt = Datas.getArString("Preset.KnightTitle");
        this.l_Title2.txt = Datas.getArString("Preset.HeroTroopTitle");
        this.generalCon.addUIObject(this.ins_generalItem);
        MarchDataIns = MarchDataManager.instance();
        this.knight_Btn.txt =  Datas.getArString("Preset.Button_Change");
        knight_Btn.OnClick = OnCLickKnightBtn;
        this.troops_Btn.txt = Datas.getArString("Common.Edit");
        troops_Btn.OnClick = OnClickTroopBtn;
        this.save_Btn.txt = Datas.getArString("Common.Save_Button");
        this.save_Btn.OnClick = OnClickSaveBtn;
        this.march_Btn.txt = Datas.getArString("ModalTitle.March");
        this.march_Btn.OnClick = OnClickMarchBtn;
        this.buff_Btn.OnClick = OnClickBuffBtn;
        InitCompose(true);
        toggleBtn1.valueChangedFunc = this.valueChangedFunc1;
        toggleBtn2.valueChangedFunc = this.valueChangedFunc2;
        this.toggleBtn3.valueChangedFunc = this.valueChangedFunc3;
        this.toggleBtn4.valueChangedFunc = this.valueChangedFunc4;
        this.toggleBtn5.valueChangedFunc = this.valueChangedFunc5;
        l_Notice2.txt = Datas.getArString("Preset.NoHero");
        l_Notice1.txt = Datas.getArString("Preset.NoTroops");
    }
    public function OnPush(params:Object)
    {
        this.isCity = false;
        if(params != null)
        {
            this.isCity = true;
        }
        //scroll_troop.SetData(MarchDataIns.troopList);
        var cityId:int = GameMain.instance().getCurCityId();
        UnityNet.getDefaultMarches(cityId,getDefaultMarchDataOk,null);
        var vipData:HashObject = GameMain.instance().GetVipData();
        var num:int = _Global.INT32(vipData["marchPreset"]);
        for(var i:int = 0;i < num;i++)
        {
            if(i <this.listToggle.length)
            {
                (this.listToggle[i] as ToggleButton).SetVisible(true);
            }
            this.dataList[i] = null;
        }
       this.DefaultCompose(true);
       this.save_Btn.changeToGreyNew();
    }


    public function UpdateGeneralData()
    {
        if(giVO == null || MarchDataIns.item_general_data!=null){
            ins_generalItem.SetRowData(MarchDataIns.item_general_data);
            this.giVO = this.MarchDataIns.item_general_data;
            if(this.tempTroopList.length>0)
            {
                this.MarchDataIns.SetTroopData(this.tempTroopList);
                l_mtile.txt = _Global.timeFormatStr(MarchDataManager.instance().march_time);
            }else{
                l_mtile.txt = "——";
            }
     
        }
    }

    public function UpdateTroopsAndHeroData()
    {
        tempTroopList = new Array();
        MarchDataIns.CheckSelectTroops();
        for(var i : int = 0; i < MarchDataIns.troopList.length; i++)
		{
			var troop:Barracks.TroopInfo = MarchDataIns.troopList[i] as Barracks.TroopInfo;
			if (troop != null)
			{
                if(troop.selectNum > 0)
                {
                    var mtroop:Barracks.TroopInfo = new Barracks.TroopInfo();
                    mtroop.selectNum=troop.selectNum;
                    mtroop.typeId=troop.typeId;
                    mtroop.troopName = Datas.getArString("unitName."+"u" + mtroop.typeId );
                    mtroop.troopTexturePath = "ui_" + mtroop.typeId ;
					tempTroopList.push(mtroop);
                }
			}
        }
        scroll_troop.SetData(tempTroopList);
        if(this.tempTroopList.length>0)
        {
            this.MarchDataIns.SetTroopData(this.tempTroopList);
            l_mtile.txt = _Global.timeFormatStr(MarchDataManager.instance().march_time);
        }else{
            l_mtile.txt = "——" ;
        }
        this.tempheroList = new Array();
        for (var ii : int = 0; ii<3 ; ii++)
        {
           if( ii< MarchDataIns.marchHeroId.Count)
           {
             var heroId = _Global.INT64(this.MarchDataIns.marchHeroId[ii]);
             var info:KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
             if(info!=null){
               ( this.listheroImg[ii] as Label).SetVisible(true);
               ( this.listheroImg[ii] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(info.HeadSmall);
               (this.listName[ii] as Label).SetVisible(true);
               (this.listName[ii] as Label).txt = info.Name;
               (this.listName[ii] as Label).SetNormalTxtColor(FontColor.TabNormal);
               this.tempheroList.push(heroId);
              }
         
           }
           else
           {
               (this.listName[ii] as Label).SetVisible(false);
               ( this.listheroImg[ii] as Label).SetVisible(false);
           }
        }
        if(this.tempTroopList.length <= 0)
        {
            l_Notice1.SetVisible(true);
        }
        else
        {
            l_Notice1.SetVisible(false);
        }
        if(this.tempheroList.length <= 0)
        {
            l_Notice2.SetVisible(true);
        }
        else
        {
            this.l_Notice2.SetVisible(false);
        }
    }

    public function UpdateBuffData()
    {
        this.tempbuffList = new Array();
        for(var iii :int = 0 ;iii < this.listBUff.length;iii++)
        {
            (this.listBUff[iii] as Label).SetVisible(false);
        }
        if(!String.IsNullOrEmpty(MarchDataIns.oneTimeBuffs))
        {
          
            var index:int = 2;
            var arr:String[] = this.MarchDataIns.oneTimeBuffs.Split(','[0]);
            for(var j:int = 0;j < arr.length;j++)
            {
                if(index>=0){

                    var buffId :long = _Global.INT64(arr[j]);
                    (this.listBUff[index] as Label).SetVisible(true);
                    (this.listBUff[index] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(buffId));
                    index --;
                    tempbuffList.push(buffId);
                }
            }
        }
    }
    // public function UpdateData()
    // {
    //     if(giVO == null || MarchDataIns.item_general_data!=null){
    //         ins_generalItem.SetRowData(MarchDataIns.item_general_data);
    //         this.giVO = this.MarchDataIns.item_general_data;
    //     }
    //     tempTroopList = new Array();
    //     for(var i : int = 0; i < MarchDataIns.troopList.length; i++)
	// 	{
	// 		var troop:Barracks.TroopInfo = MarchDataIns.troopList[i] as Barracks.TroopInfo;
	// 		if (troop != null)
	// 		{
    //             if(troop.selectNum > 0)
    //             {
    //                 var mtroop:Barracks.TroopInfo = new Barracks.TroopInfo();
    //                 mtroop.selectNum=troop.selectNum;
    //                 mtroop.typeId=troop.typeId;
    //                 mtroop.troopName = Datas.getArString("unitName."+"u" + mtroop.typeId );
    //                 mtroop.troopTexturePath = "ui_" + mtroop.typeId ;
	// 				tempTroopList.push(mtroop);
    //             }
	// 		}
    //     }
    //     if(MarchDataIns.troopList.length > 0){

    //         scroll_troop.SetData(tempTroopList);
    //     }
    //     var index:int = 0;
    //     this.tempheroList = new Array();
    //     for (var ii : int = 0; ii<3 ; ii++)
    //     {
    //        if( ii< MarchDataIns.marchHeroId.Count)
    //        {
    //          var heroId = _Global.INT64(this.MarchDataIns.marchHeroId[ii]);
    //          var info:KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
    //          if(info!=null){
    //            ( this.listheroImg[ii] as Label).SetVisible(true);
    //            ( this.listheroImg[ii] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(info.HeadSmall);
    //            (this.listName[ii] as Label).SetVisible(true);
    //            (this.listName[ii] as Label).txt = info.Name;
    //            (this.listName[ii] as Label).SetNormalTxtColor(FontColor.TabNormal);
    //            this.tempheroList.push(heroId);
    //         }
    //         else
    //         {
    //             (this.listName[ii] as Label).SetVisible(false);
    //             ( this.listheroImg[ii] as Label).SetVisible(false);
    //         }
    //        }
    //     }
    //     this.tempbuffList = new Array();
    //     for(var iii :int = 0 ;iii < this.listBUff.length;iii++)
    //     {
    //         (this.listBUff[iii] as Label).SetVisible(false);
    //     }
    //     if(!String.IsNullOrEmpty(MarchDataIns.oneTimeBuffs))
    //     {
    //         index = 2;
    //         var arr:String[] = this.MarchDataIns.oneTimeBuffs.Split(','[0]);
    //         for(var j:int = 0;j < arr.length;j++)
    //         {
    //             if(index>=0){

    //                 var buffId :long = _Global.INT64(arr[j]);
    //                 (this.listBUff[index] as Label).SetVisible(true);
    //                 (this.listBUff[index] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(buffId));
    //                 index --;
    //                 tempbuffList.push(buffId);
    //             }
    //         }
    //     }
        

    // }
    

    private function RefreshData(data:HashObject)
    {
       InitCompose(false);
       
       this.MarchDataIns.ClearHero();

       var kid:int = _Global.INT32(data["knightId"]);
       this.giVO = General.instance().getKinghtInfoBykid(kid);
       this.MarchDataIns.item_general_data = this.giVO;
       ins_generalItem.SetRowData(giVO);
       tempTroopList = new Array();
       var until:String[] = _Global.GetObjectKeys( data["unit"] );
       for( var i:int = 0; i<until.length;  i++){
          
            if(data["unit"][until[i]]!=null)
            {
                var mtroop:Barracks.TroopInfo = new Barracks.TroopInfo();
                mtroop.selectNum = _Global.INT32(data["unit"][until[i]].Value);
                mtroop.typeId =  _Global.INT32(until[i]);
                mtroop.troopName = Datas.getArString("unitName."+"u" + mtroop.typeId );
		        mtroop.troopTexturePath = "ui_" + mtroop.typeId ;
                tempTroopList.push(mtroop);
           }
       }
       scroll_troop.SetData(tempTroopList);
    //    if(this.tempTroopList.length>0)
    //    {
    //        this.MarchDataIns.SetTroopData(this.tempTroopList);
    //        l_mtile.txt = _Global.timeFormatStr(MarchDataManager.instance().march_time);
    //    }else{
    //        l_mtile.txt = "——";
    //    }
       var arr:Array = _Global.GetObjectValues(data["heroList"]);
       var index:int = 0;
       tempheroList.Clear();
       for(var obj:HashObject in arr)
       {   
           var heroId :long = _Global.INT64(obj);
           if(heroId > 0)
           {
             var info:KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
             if(info!=null && index<3){
                ( this.listheroImg[index] as Label).SetVisible(true);
                ( this.listheroImg[index] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(info.HeadSmall);
                (this.listName[index] as Label).SetVisible(true);
                (this.listName[index] as Label).txt = info.Name;
                index ++;
             }
             tempheroList.push(heroId);
             this.MarchDataIns.JoinHero(heroId);
           }
       }

       if(this.tempTroopList.length>0)
       {
           this.MarchDataIns.SetTroopData(this.tempTroopList);
           l_mtile.txt = _Global.timeFormatStr(MarchDataManager.instance().march_time);
       }else{
           l_mtile.txt = "——";
       }

       if(this.tempTroopList.length <= 0)
       {
           l_Notice1.SetVisible(true);
       }
       else
       {
           l_Notice1.SetVisible(false);
       }
       if(this.tempheroList.length <= 0)
       {
           l_Notice2.SetVisible(true);
       }
       else
       {
           this.l_Notice2.SetVisible(false);
       }
       var arr2:Array = _Global.GetObjectValues(data["buffList"]);
       this.tempbuffList.Clear();
       index = 2;
       for(var obj1:HashObject in arr2)
       {
         var buffId :long = _Global.INT64(obj1);
         if(buffId > 0&&index>=0)
         { 
            (this.listBUff[index] as Label).SetVisible(true);
            (this.listBUff[index] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(buffId));
            this.tempbuffList.push(buffId);
            index--;
         }
       }
    }
    ///初始化UI
    private function InitCompose(isInit:Boolean)
    {
        if(isInit){

            for(var i:int = 0;i <this.listToggle.length;i++)
            {
                (this.listToggle[i] as ToggleButton).SetVisible(false);
                (this.listToggle[i] as ToggleButton).SetSelected(false);
            }
        }
        for(var ii:int = 0;ii <this.listBUff.length;ii++)
        {
            (this.listBUff[ii] as Label ).SetVisible(false);
        }
        for(var iii:int = 0;iii <this.listheroImg.length;iii++)
        {
           (this.listheroImg[iii]as Label).SetVisible(false);
        }
        for(var iiii:int = 0;iiii <this.listName.length;iiii++)
        {
            (this.listName[iiii]as Label).txt = "";
        }
        // if(this.MarchDataIns.generalList.length > 0)
        // {
        //    this.giVO  = this.MarchDataIns.generalList[0] as  GeneralInfoVO;
        // }
        ins_generalItem.SetRowData(null);
        scroll_troop.SetData(new Array());

    }
    //square_blackorg
    //没有预设使用默认数据
    private function DefaultCompose (bool:Boolean):void
    {
        InitCompose(false);
        if(this.MarchDataIns.generalList.length > 0)
        {
           this.giVO  = this.MarchDataIns.generalList[0] as  GeneralInfoVO;
           MarchDataIns.item_general_data = this.giVO;
        }
        ins_generalItem.SetRowData(this.giVO);
        if(bool)
        {
            this.UpdateTroopsAndHeroData();
        }
        else
        {
            tempTroopList.Clear();
            this.tempheroList.Clear();
            if(this.tempTroopList.length <= 0)
            {
                l_Notice1.SetVisible(true);
            }
            else
            {
                l_Notice1.SetVisible(false);
            }
            if(this.tempheroList.length <= 0)
            {
                l_Notice2.SetVisible(true);
            }
            else
            {
                this.l_Notice2.SetVisible(false);
            }
            l_mtile.txt = "——";
        }
        this.tempbuffList.Clear();
     
 
    }

	public function DrawBackground()
	{
		super.DrawBackground();
		this.drawTexture(texture_line,45,140,490,17);
	}
    public function DrawItem()
    {
        navHead.Draw();
        march_Btn.Draw();
        save_Btn.Draw();
        knight_Btn.Draw();
        troops_Btn.Draw();
        buff_Btn.Draw();
        line.Draw();
        generalCon.Draw();
       // this.scroll_troop.background.Draw();
        scroll_troop.Draw();
        l_img2.Draw();
        l_name2.Draw();
        l_img.Draw();
        l_name.Draw();
        this.l_name3.Draw();
        l_img3.Draw();
        L_Title1.Draw();
        this.l_Title2.Draw();
        toggleBtn1.Draw();
        this.toggleBtn2.Draw();
        this.toggleBtn3.Draw();
        this.toggleBtn4.Draw();
        this.toggleBtn5.Draw();
        this.bufficon1.Draw();
        this.bufficon2.Draw();
        this.bufficon3.Draw();
        this.l_mtile.Draw();
        this.l_Notice1.Draw();
        this.l_Notice2.Draw();
    }
    private var lockMarchBtn: Boolean = false;
    public function Update(){
        scroll_troop.Update();

    }
    public function OnPopOver()
    {
        scroll_troop.Clear();
        this.generalCon.clearUIObject();
        this.dataList.Clear();
        tempTroopList.Clear();
        this.tempheroList.Clear();
        this.giVO =null;
        this.tempbuffList.Clear();
        //this.InitCompose(true);
    }
 
    private var dataList:Array = new Array();
    private function getDefaultMarchDataOk(result:HashObject)
    {
        var arr:Array = _Global.GetObjectValues(result["defaultMarches"]);
        // arr.Sort(function(a:HashObject ,b:HashObject)
        //     {
        //         if(_Global.INT32(a["marchNumber"]) > _Global.INT32(b["marchNumber"]) )
        //         {
        //             return -1;
        //         }
        //         else
        //         {
        //             return 1;
        //         }
        //     }
        //   );
        // arr.Reverse();

        if(arr!=null &&arr.length>0)
        {
            for (var i:int = 0;i<arr.length; i++)
            {
                var data:HashObject = arr[i] as HashObject;
                if(data!=null){
                   // this.dataList.push(data);
                    this.dataList[_Global.INT32(data["marchNumber"])-1] = data;
                    _Global.LogWarning("Number"+_Global.INT64(data["marchNumber"]) );
                }
               
            }
         
        }else{
            //DefaultCompose();
        }
     

        
 
    }

    private  function valueChangedFunc1(b:boolean):void
    {
        curIndex = 1;
            for(var i:int = 0;i <this.listToggle.length;i++)
            {
                if(this.curIndex == i + 1 )
                {
                    (this.listToggle[i] as ToggleButton).SetSelected(true);
                    if(i < this.dataList.length && this.dataList[i]!= null)
                    {
                        this.RefreshData(this.dataList[i]);
                    }
                    else
                    {
                        DefaultCompose(false);
                    }

                }else{
                    (this.listToggle[i] as ToggleButton).SetSelected(false);
                }
            }
            this.save_Btn.changeToBlueNew();
    }
    private  function valueChangedFunc2(b:boolean):void
    {
        curIndex = 2;
            for(var i:int = 0;i <this.listToggle.length;i++)
            {
                if(this.curIndex == i + 1 )
                {
                    (this.listToggle[i] as ToggleButton).SetSelected(true);
                    if(i < this.dataList.length &&  this.dataList[i]!= null)  
                    {
                        this.RefreshData(this.dataList[i]);
                    }
                    else
                    {
                        DefaultCompose(false);
                    }

                }else{
                    (this.listToggle[i] as ToggleButton).SetSelected(false);
                }
            }
            this.save_Btn.changeToBlueNew();
    }
    private  function valueChangedFunc3(b:boolean):void
    {
        curIndex = 3;
            for(var i:int = 0;i <this.listToggle.length;i++)
            {
                if(this.curIndex == i + 1 )
                {
                    (this.listToggle[i] as ToggleButton).SetSelected(true);
                    if(i < this.dataList.length && this.dataList[i]!= null)
                    {                  
                        this.RefreshData(this.dataList[i]);
                    }
                    else
                    {
                        DefaultCompose(false);
                    }

                }else{
                    (this.listToggle[i] as ToggleButton).SetSelected(false);
                }
            }
            this.save_Btn.changeToBlueNew();
    }
    private  function valueChangedFunc4(b:boolean):void
    {
        curIndex = 4;
            for(var i:int = 0;i <this.listToggle.length;i++)
            {
                if(this.curIndex == i + 1 )
                {
                    (this.listToggle[i] as ToggleButton).SetSelected(true);
                    if(i < this.dataList.length && this.dataList[i] != null)
                    {
                        this.RefreshData(this.dataList[i]);
                    }
                    else
                    {
                        DefaultCompose(false);
                    }

                }else{
                    (this.listToggle[i] as ToggleButton).SetSelected(false);
                }
            }
            this.save_Btn.changeToBlueNew();
    }
    private  function valueChangedFunc5(b:boolean):void
    {
        curIndex = 5;
            for(var i:int = 0;i <this.listToggle.length;i++)
            {
                if(this.curIndex == i + 1 )
                {
                    (this.listToggle[i] as ToggleButton).SetSelected(true);
                    if(i < this.dataList.length && this.dataList[i]!=  null)
                    {
                        this.RefreshData(this.dataList[i]);
                    }
                    else
                    {
                        DefaultCompose(false);
                    }

                }else{
                    (this.listToggle[i] as ToggleButton).SetSelected(false);
                }
            }
            this.save_Btn.changeToBlueNew();
    }

    private function setDataList():HashObject
    {
        var tempData:HashObject = new HashObject();
        tempData["knightId"] = new HashObject(this.giVO.knightId+"");
        tempData["unit"] = new HashObject();
        for(var i :int = 0;i < this.tempTroopList.length;i++)
        {
            var info:Barracks.TroopInfo = this.tempTroopList[i] as Barracks.TroopInfo; 
            tempData["unit"][info.typeId+""] = new HashObject(info.selectNum+"");
        }
          tempData["heroList"] = new HashObject();
        for(var ii:int = 0;ii < this.tempheroList.length;ii++)
        {
            tempData["heroList"][ii+""] = new HashObject(this.tempheroList[ii]+"");
        }
        tempData["buffList"] = new HashObject(new Hashtable());
        for(var iii:int = 0;iii<this.tempbuffList.length;iii++)
        {
            tempData["buffList"][iii+""] = new HashObject(this.tempbuffList[iii]+"");
        }
        return tempData;
    }

    public function handleNotification(type:String, body:Object):void
	{
       
		switch(type)
		{
			case Constant.Notice.SET_MARCH_GENERAL:
                this.UpdateGeneralData();
            break;
            case Constant.Notice.SET_MARCH_TROOP:
                this.UpdateTroopsAndHeroData();
            break;
            case Constant.Notice.SET_MARCH_BUFF:
                this.UpdateBuffData();
            break;
            case Constant.Notice.SEND_MARCH:
                if(Constant.MarchType.PVE == MarchDataManager.instance().march_type  )
                {
                    return;
                }
				MenuMgr.getInstance().PopMenu("MarchDefaultMenu");
            break;
            case Constant.Notice.PVE_MARCH_BEGIN:
                March.instance().addPveQueueItem();
                _Global.LogWarning("addPveQueueItem");
				//add march progressbar to mainchrom
				MenuMgr.getInstance().PopMenu("MarchDefaultMenu");
			
			break;
    	}
    }

    private function OnCLickKnightBtn():void
    {
        MenuMgr.getInstance().PushMenu("SelectKnight",null,"trans_zoomComp");

    }
    private function OnClickTroopBtn():void
    {
        if(isCity)
        {
            MenuMgr.getInstance().PushMenu("ChooseTroops",this.isCity,"trans_zoomComp");
        }
        else
        {
            MenuMgr.getInstance().PushMenu("ChooseTroops",null,"trans_zoomComp");
        }
    }
    private function OnClickSaveBtn():void
    {
        if(this.giVO==null||this.tempTroopList.length<=0)
        {
            ErrorMgr.instance().PushError("", Datas.getArString("Preset.NoSelected"));
            return;
        }
        if(this.curIndex==0)
        {
            return;
        }
        var list:HashObject = this.setDataList();
        this.dataList[this.curIndex-1] = list;
        MenuMgr.getInstance().PushMenu("MarchSaveMenu",{"troops":this.tempTroopList,"knight":this.giVO,"buffs":this.tempbuffList,"heros":this.tempheroList,"Num":this.curIndex},"trans_zoomComp");
    }
    private function OnClickMarchBtn(): void
    {
        if (lockMarchBtn) return;
        this.MarchDataIns.item_general_data = this.giVO;
        _Global.LogWarning("length: "+this.tempTroopList.length);
        this.MarchDataIns.troopList = this.tempTroopList;
        this.MarchDataIns.marchHeroId.Clear();
        for (var ii:int = 0; ii<this.tempheroList.length;ii++)
        {
            this.MarchDataIns.marchHeroId.Add(_Global.INT64(this.tempheroList[ii]));
        }
        if(String.IsNullOrEmpty(this.MarchDataIns.oneTimeBuffs))
        {
            for(var i :int = 0;i<this.tempbuffList.length;i++)
            {
                this.MarchDataIns.oneTimeBuffs +=this.tempbuffList[i] + ",";
            }

        }
        MarchDataManager.instance().SendMarch();
        lockMarchBtn = true;
        this.march_Btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
        Invoke("ClickMarchBtn", Marchtime);

}
    private function ClickMarchBtn(): void
    {
        this.march_Btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
        lockMarchBtn = false;
    }
    private function OnClickBuffBtn():void
    {
        var march_type = MarchDataManager.instance().march_type;
        if(march_type == Constant.AvaMarchType.ATTACK || march_type == Constant.AvaMarchType.REINFORCE || march_type == Constant.AvaMarchType.RALLYATTACK || march_type == Constant.AvaMarchType.RALLYREINFORCE)
            MenuMgr.getInstance().PushMenu("MarchBoostComplex",{"type":MarchBoostComplex.BOOST_TYPE.AVA},"trans_zoomComp");
        else
            MenuMgr.getInstance().PushMenu("MarchBoostComplex",{"type":MarchBoostComplex.BOOST_TYPE.NORMAL},"trans_zoomComp");
        
    }

}
