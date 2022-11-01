#pragma strict
import System.IO;
import System.Collections.Generic;
import System.Text;
import System;

public class ChooseDefenseTroopsPopMenu extends PopMenu
{
    @SerializeField
    private var splitLine : Label;
    
    @SerializeField
    private var troopSelectionItemTemplate : TroopSelectionListItem;
    
    @SerializeField
    private var troopSelectionScrollList : ScrollList;
    
    @SerializeField
    private var soldierIcon : SimpleLabel;
    
    @SerializeField
    private var amountLabel : SimpleLabel;
    
    @SerializeField
    private var okButton : Button;
    
    @SerializeField
    private var emptyTip : SimpleLabel;
    
    @SerializeField
    private var emptyTipBgImageName : String = "square_black";
    
    private var defenseCapacity : int = 0;
    
    private var lastSelectedTroops : HashObject;
    
    private var seed : HashObject;
    
    private var currentCityId : int = -1;
    
    private var currentCityOrder : int = -1;
    
    private var scrollListData : TroopSelectionListItem.DisplayData[];

    public var timeTab:ToolBar;

    public var togglr_pre:ToggleButton;
    public var toggle_label_pre:Label;
    public var toggleArray:ComposedUIObj;
    public var toggleLabelArray:ComposedUIObj;
    private var cur_toggle:ToggleButton;
    private var curToggleId:int;
    
    public function Init() : void
    {
        super.Init();
    
        seed = GameMain.instance().getSeed();
        currentCityId = GameMain.instance().getCurCityId();
        currentCityOrder = GameMain.instance().getCurCityOrder();
    
        title.txt = Datas.getArString("ModalTitle.Choose_Troops");
        troopSelectionScrollList.Init(troopSelectionItemTemplate);
        
        okButton.txt = Datas.getArString("Common.Done");
        okButton.OnClick = OnOk;
        okButton.changeToGreyNew();
        
        splitLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line", TextureType.DECORATION);
        
        emptyTip.mystyle.normal.background = TextureMgr.instance().LoadTexture(emptyTipBgImageName, TextureType.DECORATION);
        emptyTip.txt = Datas.getArString("March.NO_Troop");
        var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = -6;


        if (timeTab!=null) {          
            timeTab.SetVisible(false);
        }
        
    }
    //切换时间
    private function changeToolBar(){
        hideTroopIndex=timeTab.selectedIndex;
    }
    
    public function OnPush(param : Object) : void
    {
        super.OnPush(param);
        var data:Hashtable=param as Hashtable;
        var defenseUnits : HashObject = GetCurrentDefenseData();
        if (data["hideTroop"]!=null) {
            defenseUnits=GetCurrentHideTroopData();
        }
        var troopList : Barracks.TroopInfo[] = Barracks.instance()
            .GetTroopList().ToBuiltin(typeof(Barracks.TroopInfo));
        var curCityLastSelected : HashObject = LoadSelectedData();

        scrollListData = PrepareScrollListData(defenseUnits, troopList, curCityLastSelected);
        troopSelectionScrollList.SetData(scrollListData);
        
        defenseCapacity = _Global.INT32(data["count"]);
        if (data["hideTroop"]!=null) {
            // SetHideTroopNew(data["hideTroop"]);
            setToggle(data["hideTroop"],data["troops"]);
        }
        UpdateAmountLabelAndOkButton();
    }
    //初始化toggle
    private function setToggle(data:Object[],troops){
        title.txt = Datas.getArString("HideTroops.Text6");
        okButton.OnClick = OnHideTroop;

        var myTroops:HashObject=troops as HashObject;
        for(var i:int=0;i<data.Length;i++){
            var toggleObj:ToggleButton=(Instantiate(togglr_pre.gameObject) as GameObject).GetComponent(ToggleButton);
            // toggleObj.txt=Datas.getArString("HideTroops."+_Global.INT32(data[i]));
            toggleObj.transform.name=_Global.GetString(data[i]);
            toggleObj.valueChangedFunc2=toggleChage;
            toggleObj.rect.x=50+130*i;
            var toggleObj_label:Label=(Instantiate(toggle_label_pre.gameObject) as GameObject).GetComponent(Label);
            toggleObj_label.txt=Datas.getArString("HideTroops.Text7",[_Global.GetString(myTroops[i+1+""])]);;
            // toggleObj_label.rect=toggleObj.rect;
            toggleObj_label.rect.x=toggleObj.rect.x+50f;

            toggleArray.addUIObject(toggleObj);
            toggleLabelArray.addUIObject(toggleObj_label);
            if (i==0) {
                cur_toggle=toggleObj;
                cur_toggle.selected=true;
            }else{
                toggleObj.selected=false;
            }  
        }
    }
    //切换toggle
    private function toggleChage(t:ToggleButton,isS:boolean) {
        // body...
        if (isS) {
            cur_toggle=t;
            curToggleId=_Global.INT32(t.transform.name);
            for (var i = 0; i < toggleArray.getUIObject().length; i++) {
                if ((toggleArray.getUIObject()[i] as ToggleButton)!=cur_toggle) {
                    (toggleArray.getUIObject()[i] as ToggleButton).SetSelected(false);
                }
            }
        }else{
            if (cur_toggle==t) {
                t.SetSelected(true);
            }
        }
    }

    private var isNewHideTroop:boolean=false;
    private var hideTroopsArray:Object[];
    private var hideTroopIndex:int;
    public function SetHideTroopNew(data:Object[]){  
        isNewHideTroop=true;
        if (timeTab!=null&&data!=null) {
            timeTab.SetVisible(true);
            timeTab.Init();
            var array:String[]=new String[data.Length];
            for(var i:int=0;i<data.Length;i++){
                array[i]=Datas.getArString("HideTroops."+_Global.INT32(data[i]));
            }
            timeTab.toolbarStrings=array;
            timeTab.indexChangedFunc=changeToolBar;
            hideTroopsArray=data;
            okButton.OnClick = OnHideTroop;
        }
    }
    private function OnHideTroop(){

        var url : String = "deployCityHideTroop.php";
        var payload : Hashtable = new Hashtable();
        var cityId:String=GameMain.instance().getCurCityId().ToString();
        payload.Add("cid", cityId.ToString());
        for (var displayData : TroopSelectionListItem.DisplayData in GetAllNonZeroDisplayData())
        {
            payload.Add(String.Format("u{0}", displayData.troopId), displayData.selectCount.ToString());
        }
        payload.Add("hideTime",curToggleId);
        UnityNet.reqWWW(url, payload, HideTroopOk, null);
    }
    private function HideTroopOk(result : HashObject):void{

        MenuMgr.getInstance().PopMenu("");
        var data:HashObject=result as HashObject;
        if (data["ok"]) {
            MenuMgr.getInstance().sendNotification("HideTroopInfo",result);
        }


    }
    
    public function OnPopOver() : void
    {
        Clear();
    }
    
    public function OnDestroy() : void
    {
        Clear();
    }
    
    private function Clear() : void
    {
        if (troopSelectionScrollList != null)
        {
            troopSelectionScrollList.Clear();
        }
        toggleArray.clearUIObject();
        toggleLabelArray.clearUIObject();
    }
    
    public function DrawItem() : void
    {
        timeTab.Draw();
        splitLine.Draw();
        if (scrollListData.Length > 0)
        {
            troopSelectionScrollList.Draw();
            soldierIcon.Draw();
            amountLabel.Draw();
            okButton.Draw();
        }
        else
        {
            emptyTip.Draw();
        }
        toggleArray.Draw();
        toggleLabelArray.Draw();
    }
    
    public function Update() : void
    {
        if (scrollListData.Length > 0)
        {
            troopSelectionScrollList.Update();
        }
    }
    
    private function UpdateAmountLabelAndOkButton() : void
    {
        var amount : int = 0;
        for (var i : int = 0; i < scrollListData.Length; ++i)
        {
            amount += scrollListData[i].selectCount;
        }

        var format : String;
        if (amount > defenseCapacity)
        {
            format = "<color=red>{0}</color>/{1}";
            okButton.changeToGreyNew();
        }
        else
        {
            format = "{0}/{1}";
            if (amount > 0)
            {
                okButton.changeToBlueNew();
            }
            else
            {
                okButton.changeToGreyNew();
            }
        }
        amountLabel.txt = String.Format(format, amount, defenseCapacity);
    }

    private function OnValueChanged() : void
    {
        UpdateAmountLabelAndOkButton();
    }

    private function OnOk(param : Object) : void
    {
        _Global.Log("[ChooseDefenseTroopsPopMenu OnOk]");
        SaveSelectedData();
        RequestDeployingDefense();
    }
    
    private function PrepareScrollListData(
        defenseUnits : HashObject, troopList : Barracks.TroopInfo[], curCityLastSelected : HashObject)
        : TroopSelectionListItem.DisplayData[]
    {
        var displayDataList : List.<TroopSelectionListItem.DisplayData>
            = new List.<TroopSelectionListItem.DisplayData>();
        for (var i : int = 0; i < troopList.Length; ++i)
        {
            var id : int = troopList[i].typeId;
            var inDefenseNumber : int = _Global.INT32(defenseUnits[String.Format("u{0}", id)]);
            var inBarrackNumber : int = troopList[i].owned;
            var totalOwned : int = inDefenseNumber + inBarrackNumber;
            
            if (totalOwned <= 0)
            {
                continue;
            }

            var displayData : TroopSelectionListItem.DisplayData
                = new TroopSelectionListItem.DisplayData(id, totalOwned);
            
            var lastSelectedNumber : int = _Global.INT32(curCityLastSelected[String.Format("u{0}", id)]);
            displayData.selectCount = Mathf.Min(lastSelectedNumber, displayData.troopCount);
            displayData.onValueChanged = OnValueChanged;
            displayDataList.Add(displayData);
        }
        
        displayDataList.Sort
        (
            function (l : TroopSelectionListItem.DisplayData, r : TroopSelectionListItem.DisplayData) : int
            {
                return l.troopId < r.troopId ? -1 : 1;
            }
        );
        
        return displayDataList.ToArray();
    }
    
    private function SaveSelectedData()
    {
        lastSelectedTroops[currentCityOrder.ToString()] = new HashObject();
        var curCityLastSelected : HashObject = lastSelectedTroops[currentCityOrder.ToString()];
        for (var displayData : TroopSelectionListItem.DisplayData in scrollListData)
        {
            if (displayData.selectCount <= 0)
            {
                continue;
            }
            
            curCityLastSelected[String.Format("u{0}", displayData.troopId)] = new HashObject(displayData.selectCount);
        }
        
        var ms : MemoryStream = new MemoryStream();
        var sw : TextWriter = new StreamWriter(ms);
        lastSelectedTroops.FormatToJson(sw, "a");
        sw.Flush();
        ms.Seek(0, SeekOrigin.Begin);
        var sr : StreamReader = new StreamReader(ms);
        Datas.instance().LastSelectedDefenseTroopsData = sr.ReadToEnd();
        sr.Dispose();
        sw.Dispose();
        ms.Dispose();
    }
    
    private function LoadSelectedData() : HashObject
    {
        try
        {
            lastSelectedTroops = JSONParse.instance.Parse(Datas.instance().LastSelectedDefenseTroopsData);
        }
        catch (e : System.Exception)
        {
            lastSelectedTroops = new HashObject();
        }
    
        var curCityLastSelected : HashObject = lastSelectedTroops[currentCityOrder.ToString()];
        if (curCityLastSelected == null)
        {
            curCityLastSelected = new HashObject();
        }
        
        return curCityLastSelected;
    }
    
    private function RequestDeployingDefense() : void
    {
        var url : String = "deployCityDefense.php";
        var payload : Hashtable = new Hashtable();
        payload.Add("cid", currentCityId.ToString());
        for (var displayData : TroopSelectionListItem.DisplayData in GetAllNonZeroDisplayData())
        {
            payload.Add(String.Format("u{0}", displayData.troopId), displayData.selectCount.ToString());
        }
        UnityNet.reqWWW(url, payload, OnRequestDeployingSuccess, null);
        //// Debug TODO: change to reqWWW
        //OnRequestDeployingSuccess(new HashObject({ "queueId": currentCityId, "startTime": GameMain.instance().unixtime(),
        //    "endTime": GameMain.instance().unixtime() + 20}));
    }
    
    private function UpdateBarracksTroops() : void
    {
        for (var displayData : TroopSelectionListItem.DisplayData in GetAllNonZeroDisplayData())
        {
            var cityKey : String = String.Format("city{0}", currentCityId);
            var unitKey : String = String.Format("unt{0}", displayData.troopId);
            
            var unit : HashObject = seed["units"][cityKey][unitKey];
            if (unit == null)
            {
                seed["units"][cityKey][unitKey] = new HashObject();
                unit = seed["units"][cityKey][unitKey];
            }
            unit.Value = _Global.INT64(unit) - displayData.selectCount;
        }
        Barracks.instance().UpadateAllTroop();
    }
    
    private function OnRequestDeployingSuccess(result : HashObject) : void
    {
        GenerateAndAddQueueItem(result);
        UpdateBarracksTroops();
        ClearCurrentDefenseData();
        MenuMgr.getInstance().sendNotification(Constant.Notice.SelectiveDefenseDeployStarted, null);
        MenuMgr.getInstance().PopMenu("");
    }
    
    private function GenerateAndAddQueueItem(result : HashObject) : void
    {
        var unitsData : Dictionary.<int, int> = new Dictionary.<int, int>();
        
        for (var displayData : TroopSelectionListItem.DisplayData in GetAllNonZeroDisplayData())
        {
            unitsData.Add(displayData.troopId, displayData.selectCount);
        }
        
        SelectiveDefenseQueueMgr.instance().AddQueue(currentCityId, _Global.INT32(result["queueId"]),
            _Global.INT64(result["startTime"]), _Global.INT64(result["endTime"]), unitsData);
    }
    
    private function GetCurrentDefenseData() : HashObject
    {
        var defenseUnits : HashObject = null;
        try
        {
            defenseUnits = seed["selective_defense"][String.Format("c{0}", currentCityId)];
        }
        catch (e : System.Exception)
        {
        }
        
        if (defenseUnits == null)
        {
            defenseUnits = new HashObject();
        }
        
        return defenseUnits;
    }
    //获取新的藏兵
    private function GetCurrentHideTroopData() : HashObject
    {
        var defenseUnits : HashObject = null;
        try
        {
            defenseUnits = seed["hideTroopQueue"]["hideUnitQueue"][String.Format("{0}", currentCityId)]["data"];
        }
        catch (e : System.Exception)
        {
        }
        
        if (defenseUnits == null)
        {
            defenseUnits = new HashObject();
        }
        
        return defenseUnits;
    }
    
    private function ClearCurrentDefenseData() : void
    {
        if (seed["selective_defense"] != null)
        {
            seed["selective_defense"][String.Format("c{0}", currentCityId)] = new HashObject();
        }
    }
    
    private function GetAllNonZeroDisplayData() : IEnumerable.<TroopSelectionListItem.DisplayData>
    {
        for (var displayData : TroopSelectionListItem.DisplayData in scrollListData)
        {
            if (displayData.selectCount <= 0)
            {
                continue;
            }
            
            yield displayData;
        }
    }
}