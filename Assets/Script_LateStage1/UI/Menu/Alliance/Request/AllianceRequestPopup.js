class AllianceRequestPopup extends PopMenu
{
    public var barGold:ResRequestItem;
    
    public var barFood:ResRequestItem;
    public var barWood:ResRequestItem;
    public var barStone:ResRequestItem;
    public var barOre:ResRequestItem;
    
    public var lblLight:Label;
//    public var lineTop:Label;
//    public var lineBottom:Label;
    public var resTip:Label;
    public var citiesTip:Label;
    
    
    public var lbl0:Label;
    public var lbl1:Label;
    public var lbl2:Label;
    public var lbl3:Label;
    public var lbl4:Label;
    
    public var selector:CitySelector;
    
    public var listBar:ToolBar;
    
    public var lblFrame:Label;
    public var lblFTE:Label;
    
    public var btnSubmit:Button;
    public var btnCancel:Button;
    
    private var lblTitles:Label[] = [lbl0,lbl1,lbl2,lbl3,lbl4];
    private var resourceItems:ResRequestItem[] = [barGold,barFood,barWood,barStone,barOre];
    
    private var reinforceItems:Label[] = [lblFrame,lblFTE];
    private var values:int[] = [0,1,2,3,4];
    
    private var RequestIndex:int = 0;
    
    private var timer:float = 0f;
    public var lightPos:int[];
    
    
    public var allianHelpList:ScrollList;
    public var allianHelpTemplate:AllianceHelpItem;
    public var allianPageLineUp:Label;
    public var allianHelpListdata:AllianceHelpMarchData=new AllianceHelpMarchData();
    public var allianHelpDataArray:Array=new Array();
    
    public static var curCityIdForRequest:int=0;
    
    public function Init()
    { 
        super.Init();
        resourceItems = [barGold,barFood,barWood,barStone,barOre];
        reinforceItems = [lblFrame,lblFTE];
        lblTitles = [lbl0,lbl1,lbl2,lbl3,lbl4];
        
        
        allianHelpList.Init(allianHelpTemplate);
        allianPageLineUp.mystyle.normal.background=TextureMgr.instance().LoadTexture("between line",TextureType.DECORATION);
        
        
        for(var i:int = 0;i< resourceItems.length;i++)
        {
            resourceItems[i].ResourceBarChangingFunc = resourceBarChanging;
            resourceItems[i].Init(i);
        }
        /*
        barGold.Init(0);
        barFood.Init(1);
        barWood.Init(2);
        barStone.Init(3);
        barOre.Init(4);
        */
        resTip.txt = Datas.getArString("Alliance.ReqResource");
        citiesTip.txt = Datas.getArString("Common.Destination");
        lbl0.txt = "0";
        lbl1.txt = "500k";
        lbl2.txt = "1m";
        lbl3.txt = "2m";
        lbl4.txt = "3m";
        selector.Init();
        listBar.Init();
        //Change by Caisen 2014.8.8 start
        listBar.toolbarStrings = [Datas.getArString("Common.Resources"),Datas.getArString("Common.Reinforce"),Datas.getArString("Alliance.Request_March_Title")];
        //Change by Caisen 2014.8.8 end
        listBar.indexChangedFunc = SelectType;
        lblFTE.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
        lblFrame.txt = Datas.getArString("FTE.NPC_Map_5");
        btnSubmit.OnClick = submit;
        btnSubmit.txt = Datas.getArString("Common.Send_button");
        btnCancel.txt = Datas.getArString("Common.Cancel");
        
        btnCancel.OnClick = function()
        {
            MenuMgr.getInstance().PopMenu("");
        };    
        
        //var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
        //bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");
        //bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
        bgMiddleBodyPic.rect.width = rect.width - 0;
        //bgMiddleBodyPic.name = "ui_paper_bottom";
        //if(RuntimePlatform.Android == Application.platform)
        //{
        //    bgMiddleBodyPic.spt.edge = 2;
        //}
        title.txt = Datas.getArString("Alliance.ReqHelpModal");
        
        listBar.SetDefaultNormalTxtColor(FontColor.New_Level_Yellow);
        listBar.SetDefaultOnNormalTxtColor(FontColor.New_Level_Yellow);
        
        //test start Caisen 2014.8.27:
        /*
        allianHelpListdata=new AllianceHelpMarchData(); 
        allianHelpListdata.barCurValue=50;
        allianHelpListdata.barMaxValue=70;
        allianHelpDataArray.Add(allianHelpListdata);
        allianHelpListdata=new AllianceHelpMarchData(); 
        allianHelpListdata.barCurValue=10;
        allianHelpListdata.barMaxValue=50;
        allianHelpDataArray.Add(allianHelpListdata); 
        allianHelpList.SetData(allianHelpDataArray);
        */
        //test end Caisen 2014.8.27:
    }
    
    private function resourceBarChanging(val:int)
    {
        lblLight.SetVisible(true);
        lblLight.rect.x = lightPos[val];
        timer = 2.0;
    }
    private function submit()
    {
        var city:CityInfo = selector.SelectedCity();
        var res:long[] = [0l,0l,0l,0l,0l];
        var okFunc:Function = function(result:HashObject):void
        {
            if(result["ok"].Value)
            {
                MenuMgr.getInstance().PopMenu("");
                MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
                var request:AllianceRequest = new AllianceRequest();
                request.city = city;
                if(RequestIndex == 0)
                {
                    request.Type = 1;
                }
                else
                {
                    request.Type = 0;
                }
                request.Res = res;
                MenuMgr.getInstance().getChatMenu().sendAllianceChat(request.ToString());
            }
        };
        
        if(RequestIndex == 0)
        {
            var hasResource:boolean = false;
            for(var i:int = 0;i<resourceItems.length;i++)
            {
                res[i] = resourceItems[i].GetValue();
                if(res[i] > 0)
                {
                    hasResource = true;
                }
            }
            if(hasResource == true)
            {
                UnityNet.AllianceResourceRequest(city.Id ,res,okFunc);
            }
            else
            {
                ErrorMgr.instance().PushError("",Datas.instance().getArString("Error.err_1408"));
            }
        }
        else if(RequestIndex == 1)
        {
            UnityNet.AllianceReinforceRequest(city.Id,okFunc);
        }
    }
    
    private function SelectType(index:int)
    {
        RequestIndex = index;
        if(index==2)
        {
        	var city:CityInfo = selector.SelectedCity();
        	var curCityId:int=city.Id;
        	if(PvPToumamentInfoData.instance().marchData!=null)
        	{
        		PvPToumamentInfoData.instance().marchData.marchList.Clear();
        	}
            PvPToumamentInfoData.instance().RequestWorldMapMarch(curCityId);
        }
    }

    public function OnPush(param:Object)
    {
        super.OnPush(param);
        selector.SetData();
        
        barGold.InitValue(0);
        barFood.InitValue(0);
        barWood.InitValue(0);
        barStone.InitValue(0);
        barOre.InitValue(0);
        lblLight.SetVisible(false);
    }
    
    
    public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
        {
            case Constant.PvPResponseOk.WorldMapMarchOK:
            allianHelpDataArray.Clear();
            for(var i:int=0;i<PvPToumamentInfoData.instance().marchData.marchList.Count;i++)
            {
            	allianHelpListdata=new AllianceHelpMarchData();
            	var marchType:int=PvPToumamentInfoData.instance().marchData.marchList[i].marchType;
            	var toXCoord:int=PvPToumamentInfoData.instance().marchData.marchList[i].xcoord;
            	var toYCoord:int=PvPToumamentInfoData.instance().marchData.marchList[i].ycoord;
            	
            	if( marchType == Constant.MarchType.TRANSPORT ) 
            	{ // Transport
					allianHelpListdata.marchInfo=Datas.getArString("March.TransportStatus",[toXCoord, toYCoord]);
				} 
				else if( marchType == Constant.MarchType.REINFORCE ) 
				{ // Reinforce
					allianHelpListdata.marchInfo=Datas.getArString("March.ReinforceStatus",[toXCoord, toYCoord]);
				} 
				else if( marchType == Constant.MarchType.REASSIGN ) 
				{ // Reassign
					allianHelpListdata.marchInfo=Datas.getArString("March.ReassignStatus",[toXCoord, toYCoord]);
				} 
				else if( marchType == Constant.MarchType.ATTACK ||
							marchType == Constant.MarchType.PVP ) 
				{ // Attack
					allianHelpListdata.marchInfo=Datas.getArString("March.AttackStatus",[toXCoord, toYCoord]);
				}
				else
				{//not visible
					continue ;
				}
				
            	if
            	(
            	PvPToumamentInfoData.instance().marchData.marchList[i].status==7||
            	PvPToumamentInfoData.instance().marchData.marchList[i].status==8||
            	PvPToumamentInfoData.instance().marchData.marchList[i].status==9
            	)
            	{
            		continue ;
            	}
           
				var timeNow:long=GameMain.unixtime();
            	var timeEnd:long=PvPToumamentInfoData.instance().marchData.marchList[i].endTime;
            	var timeStart:long=PvPToumamentInfoData.instance().marchData.marchList[i].startTime;
            	var delta:long=timeNow-timeStart;
            	var total:long=timeEnd-timeStart;
            	allianHelpListdata.barCurValue=delta;
            	allianHelpListdata.barMaxValue=total;
            	allianHelpListdata.m_cityID = PvPToumamentInfoData.instance().marchData.marchList[i].cityId;
            	allianHelpListdata.m_marchID = PvPToumamentInfoData.instance().marchData.marchList[i].marchId;
            	allianHelpListdata.m_marchType = PvPToumamentInfoData.instance().marchData.marchList[i].marchType;
            	allianHelpListdata.marchEndTime = timeEnd;
            	allianHelpListdata.marchStartTime = timeStart;
            	allianHelpDataArray.Add(allianHelpListdata);
            }
            allianHelpList.SetData(allianHelpDataArray);
     		
            break;
            
            case Constant.PvPResponseOk.RefreshTheAllianceHelpList:
            	for(i=0;i<allianHelpDataArray.length;i++)
            	{
            		var cur:float=(allianHelpDataArray[i] as AllianceHelpMarchData).barCurValue;
            		var max:int=(allianHelpDataArray[i] as AllianceHelpMarchData).barMaxValue;
            		if(cur>=max)
            		{
            			allianHelpDataArray.Remove(allianHelpDataArray[i]);
            		}
            	}
            	allianHelpList.SetData(allianHelpDataArray);
            break;
            
            case Constant.PvPResponseOk.MarchListCityChange:
            	if(RequestIndex==2)
            	{		
	        		var curCityId:int=curCityIdForRequest;
	        		if(PvPToumamentInfoData.instance().marchData!=null)
        			{
        				PvPToumamentInfoData.instance().marchData.marchList.Clear();
        				allianHelpDataArray.Clear();
        				allianHelpList.SetData(allianHelpDataArray);
        			}
	            	PvPToumamentInfoData.instance().RequestWorldMapMarch(curCityId);
            	}
            break;
        }
    }
    
    // Use this for initialization
    function Start () {
    }
    
    
    // Update is called once per frame
    function Update () {
        if(timer > 0)
        {
            timer = timer - Time.deltaTime;
        }
        allianHelpList.Update();
    }
    
    
    function DrawItem()
    {
        
        if(RequestIndex == 0)
        {
            if(timer > 0)
            {
                lblLight.Draw();
            }        
            for(var i:int = 0;i < resourceItems.length;i++)
            {
                resourceItems[i].Draw();
            }
            for(var item in lblTitles)
            {
                item.Draw();
            }
            resTip.Draw();
            btnSubmit.Draw();
            btnCancel.Draw();

        }
        else if(RequestIndex == 1)//Change by Caisen 2014.8.8 start
        {
            for(var j:int = 0;j<reinforceItems.length;j++)
            {
                reinforceItems[j].Draw();
            }
            btnSubmit.Draw();
            btnCancel.Draw();
        }
        else
        {
            allianPageLineUp.Draw();
            allianHelpList.Draw();
        }
//        lineTop.Draw();
//        lineBottom.Draw();
        citiesTip.Draw();
        selector.Draw();
        RequestIndex = listBar.Draw();
        
    }
    function DrawMiddleBg():void
    {
        for(var a:int = 0; a < repeatTimes - 1; a++)
        {
            //bgMiddleBodyPic.rect = Rect(0,bgStartY + a * bgMiddleBodyPic.rect.height, 640, bgMiddleBodyPic.rect.height);
            bgMiddleBodyPic.Draw(Rect(0,bgStartY + a * bgMiddleBodyPic.rect.height, 560, bgMiddleBodyPic.rect.height),true);
    //        GUI.DrawTexture(Rect(0,bgStartY + a * bgMiddleBodyPic.height, 640, bgMiddleBodyPic.height), bgMiddleBodyPic);
        }    
        bgMiddleBodyPic.Draw(Rect(0,bgStartY + (repeatTimes - 1)* bgMiddleBodyPic.rect.height - 1, 560, bgMiddleBodyPic.rect.height),false);
    }
    
    public function OnPopOver()
    {
        allianHelpList.Clear();
    }
    
    
}
