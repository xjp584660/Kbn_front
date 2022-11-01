class MarchSaveMenu extends PopMenu
{
   
    public var ok_Btn     :Button;
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

    public var bufficon1  : Label;
    public var bufficon2  : Label;
    public var bufficon3  : Label;

    private var listBUff   : Array;
    private var listheroImg: Array;
    private var listName   : Array;

    private var tempTroopList:Array;
    private var giVO         :GeneralInfoVO;
    private var tempheroList :Array = new Array();
    private var tempbuffList :Array = new Array();
    private var CurIndex     : int;

    private var MarchDataIns :MarchDataManager;
    
    public function Init()
    {
        super.Init();
        this.listBUff = [bufficon1,bufficon2,bufficon3];
        this.listheroImg = [l_img,l_img2,l_img3];
        this.listName = [l_name,l_name2,l_name3];
        generalCon.clearUIObject();
        scroll_troop.Init(ins_troopItem);
        navHead.titleTxt = Datas.getArString("Preset.SavePresetTitle");
        this.L_Title1.txt = Datas.getArString("Preset.KnightTitle");
        this.l_Title2.txt = Datas.getArString("Preset.HeroTroopTitle");
        this.generalCon.addUIObject(this.ins_generalItem);
        MarchDataIns = MarchDataManager.instance();
        this.ok_Btn.txt = Datas.getArString("Common.OK_Button");
        this.ok_Btn.OnClick = OnClickOKBtn;
    }
    public function OnPush(params:Object)
    {
        InitCompose();
        var data:Hashtable = params as Hashtable;
        //scroll_troop.SetData(MarchDataIns.troopList);
        tempTroopList = data["troops"];
        if(this.tempTroopList!=null && this.tempTroopList.length > 0)
        {
            scroll_troop.SetData(tempTroopList);
        }
        this.giVO = data["knight"] as GeneralInfoVO;
        ins_generalItem.SetRowData(giVO);
        this.tempheroList = data["heros"];
        var index:int = 0;
        for (var heroId : long in  this.tempheroList)
        {   
           // var heroId :long = _Global.INT64(obj);
            if(heroId > 0)
            {
              var info:KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
              if(info!=null && index<3){
                 ( this.listheroImg[index] as Label).SetVisible(true);
                 ( this.listheroImg[index] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(info.HeadSmall);
                 (this.listName[index] as Label).SetVisible(true);
                 (this.listName[index] as Label).txt = info.Name;
                 (this.listName[index] as Label).SetNormalTxtColor(FontColor.TabNormal);
                 index ++;
              }
             // tempheroList.push(heroId);
            }
        }
        this.tempbuffList = data["buffs"];
        index = 2;
        for(var buffId :long in tempbuffList)
        {
          //var buffId :long = _Global.INT64(obj1);
          if(buffId > 0&&index>=0)
          { 
             (this.listBUff[index] as Label).SetVisible(true);
             (this.listBUff[index] as Label).tile = TextureMgr.instance().ItemSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(buffId));
             //this.tempbuffList.push(buffId);
             index--;
          }
        }
        this.CurIndex = _Global.INT32(data["Num"]);
     
    }


    private function InitCompose()
    {
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
        ins_generalItem.SetRowData(null);
        scroll_troop.SetData(new Array());
    }


	public function DrawBackground()
	{
		super.DrawBackground();
		this.drawTexture(texture_line,45,140,490,17);
	}
    public function DrawItem()
    {
        navHead.Draw();
        line.Draw();
        generalCon.Draw();
        scroll_troop.Draw();
        l_img2.Draw();
        l_name2.Draw();
        l_img.Draw();
        l_name.Draw();
        this.l_name3.Draw();
        this.l_img3.Draw();
        this.bufficon1.Draw();
        this.bufficon2.Draw();
        this.bufficon3.Draw();
        this.ok_Btn.Draw();
    }
    public function Update(){
        scroll_troop.Update();
    }
    public function OnPopOver()
    {
        scroll_troop.Clear();
        this.generalCon.clearUIObject();
    }

  

    
    private function OnClickOKBtn():void
    {
        if(this.giVO ==null||this.tempTroopList.length<=0)
        {
            ErrorMgr.instance().PushError("", Datas.getArString("Preset.NoSelected"));
            return;
        }
       var cityId:int = GameMain.instance().getCurCityId();
       var kid:int = this.giVO.knightId;
       var heroStr:String = "";
       for (var heroId : long in  this.tempheroList)
       {
           heroStr += heroId + ",";
       }
       var oneTimeBuffs:String = "";
       for(var buffId :long in tempbuffList)
       {
        oneTimeBuffs += buffId + ",";
       }
		
       var okFunction = function(result:HashObject)
       {
           MenuMgr.getInstance().PushMessage(Datas.getArString("Preset.SaveSuccess"));
           MenuMgr.getInstance().PopMenu("");
       };
       var confirmStr:String= String.Format( Datas.getArString("Preset.SavePresetText"),this.CurIndex);
       var cd:ConfirmDialog = MenuMgr.instance.getConfirmDialog();
       cd.setLayout(600, 380);
       cd.setTitleY(120);
       cd.setButtonText(Datas.getArString("Common.OK_Button"), Datas.getArString("Common.Cancel"));

       var okFunc:System.Action = function()
           {
            UnityNet.saveDefaultMarch(cityId,CurIndex,kid,this.tempTroopList,heroStr,oneTimeBuffs,okFunction,null);
            cd.close();
           };

       MenuMgr.instance.PushConfirmDialog(confirmStr, "", okFunc, null);
    }
    
}
