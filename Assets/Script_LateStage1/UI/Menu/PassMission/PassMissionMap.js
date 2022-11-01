import System.Collections.Generic;

public class PassMissionMap extends UIObject
{
    public var bigBg : Label;
    public var endTime : Label;
    public var iconAp : Label;
    public var apCount : Label;
    public var boxBtn : Button;
    public var boxProgress : Label;
    public var redPoint : Label;
    public var iconMapBg : Label;
    public var iconMap : Label;

    public var smallBg : Label;
    public var smallTitleBg : Label;
    public var smallTitle : Label;
    public var rewardDes : Label;
    public var rewardBg : Label;
    public var scrollList : ScrollList;
    public var costAp : Label;
    public var claimBtn : Button;
    public var l_pageLeft:Button;
 	public var l_pageRight:Button;

    public var maps : Dictionary.<int, Button>;

    public var rewardItem : PassMissionMapRewardItem;

    public var mapPanel : GameObject;
    public var mapItem : Button;
    public var mapSelected : Label;
    public var mapManager : PassMissionMapManager;

    // 第一个点的坐标
    public var firstMapPoint : Vector2 = new Vector2(58, 326);
    // 横，竖间隔
    public var horAndVerOffset : Vector2 = new Vector2(50.6, 37.4);

    public var rewardData : PassMissionMapData;
    public var selected : Label;

    public function Init() : void
    {
        var imageTex : Texture2D = TextureMgr.instance().LoadTexture("mapBg", TextureType.PASSMISSIONN); 
        iconMapBg.mystyle.normal.background = imageTex;

        scrollList.Init(rewardItem);
        maps = new Dictionary.<int, Button>();

        mapItem.Init();
        mapManager = PassMissionMapManager.Instance();

        var newGameOb : GameObject = new GameObject("PassMissionMapPanel");
        this.mapPanel = newGameOb;
        var mapDatas = mapManager.maps.GetEnumerator();
        while(mapDatas.MoveNext())
        {
            var localId : int = mapDatas.Current.Key;
            var data : PassMissionMapData = mapDatas.Current.Value;

            var mapTemp : Button = Instantiate(mapItem);
            mapTemp.gameObject.name = "map" + localId;
            mapTemp.transform.parent = newGameOb.transform;

            var index : int = localId - 1;
            var horizontal : int = index % mapManager.NUMBER_OF_ROWS;
            var vertical : int = index / mapManager.NUMBER_OF_ROWS;

            mapTemp.rect.x = firstMapPoint.x + horizontal * horAndVerOffset.x;
            mapTemp.rect.y = firstMapPoint.y + vertical * horAndVerOffset.y;

            SetMapUnlockedState(mapTemp, data);

            mapTemp.clickParam = localId;
            mapTemp.OnClick = OnMapClicked;

            this.maps.Add(localId, mapTemp);
        }
        selected = Instantiate(this.mapSelected);
        selected.transform.parent = newGameOb.transform;

        claimBtn.OnClick = OnClaimBtnClicked;
        boxBtn.OnClick = OnBoxBtnClicked;
        l_pageLeft.OnClick = OnPageLeft;
		l_pageRight.OnClick = OnPageRight;

        rewardDes.txt = Datas.getArString("PassMission.Reward");

        var defaultLocalId : int = 50;
        
        OnMapClicked(defaultLocalId); 
        SetMyApCount();      
    }

    function OnPageLeft()
	{
		scrollList.SetOffSet(0f);
	}
	
	function OnPageRight()
	{
		scrollList.SetOffSet(-scrollList.m_nMaxOffset);
	}

    public function PushMap()
    {
        SetMyApCount();
    }

    private function SetBoxRewardState()
    {
        // 0不可领取 1可领取 2已领取
        var claimState : int = mapManager.GetBoxRewardState();
        this.redPoint.SetVisible(claimState == 1);
    }

    private function SetMyApCount()
    {
        apCount.txt = "X " + mapManager.GetMyApCount();
        boxProgress.txt = mapManager.GetUnlockedCount() + "/" + this.mapManager.GetAllMapCount();

        SetBoxRewardState();
    }

    private function SetMapUnlockedState(map : Button, data : PassMissionMapData) : void
    {
        if(data.unlockedState == UnlockedState.NotUnlocked)
        {
            map.mystyle.normal.background = TextureMgr.instance().LoadTexture("notUnlockable",TextureType.PASSMISSIONN);
        }
        else if(data.unlockedState == UnlockedState.Unlockable)
        {
            map.mystyle.normal.background = TextureMgr.instance().LoadTexture("unlock",TextureType.PASSMISSIONN);
        }
        else if(data.unlockedState == UnlockedState.Unlocked)
        {
            map.mystyle.normal.background = TextureMgr.instance().LoadTexture("unlocked",TextureType.PASSMISSIONN);
        }
    }

    private function SetClaimBtnState(data : PassMissionMapData) : void
    {
        //_Global.LogWarning("DataId : " + data.mapId + " Datastate : " + data.unlockedState);
        if(data.unlockedState == UnlockedState.NotUnlocked)
        {
            claimBtn.EnableBlueButton(false);
            claimBtn.txt = Datas.getArString("PassMission.Claim");
        }
        else if(data.unlockedState == UnlockedState.Unlockable)
        {
            claimBtn.EnableBlueButton(true);
            claimBtn.txt = Datas.getArString("PassMission.Claim");
        }
        else if(data.unlockedState == UnlockedState.Unlocked)
        {
            claimBtn.EnableBlueButton(false);
            claimBtn.txt = Datas.getArString("PassMission.Claimed");
        }
    }

    private function OnMapClicked(param : Object)
    {
        var localId : int = _Global.INT32(param);
        //_Global.LogWarning("clicked mapID : " + localId);

        smallTitle.txt = String.Format(Datas.getArString("PassMission.LocationId"), localId);

        if(this.mapManager.maps.ContainsKey(localId))
        {
            rewardData = this.mapManager.maps[localId];
            costAp.txt = String.Format(Datas.getArString("PassMission.ApCost"), rewardData.costAp);
            _Global.LogWarning("Cost Ap : " + rewardData.costAp);
            SetClaimBtnState(rewardData);

            scrollList.Clear();
            scrollList.SetData(rewardData.rewards.ToArray());
            scrollList.ResetPos();
        }

        if(maps.ContainsKey(localId))
        {
            var tempBtn : Button = maps[localId];
            selected.rect = tempBtn.rect;
        }
    }

    private function OnClaimBtnClicked(param : System.Object) : void
    {
        this.mapManager.unlockMapReward(rewardData);
    }

    private function OnBoxBtnClicked(param : System.Object) : void
    {
        // 0不可领取 1可领取 2已领取
        var claimState : int = mapManager.GetBoxRewardState();

        var id:HashObject = new HashObject({"ID":mapManager.GetBoxRewardId(), "Category":9, "inShop":false, "hasReward":true, "rewardType":1, "claimState":claimState});
        MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_zoomComp");	
    }

    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }

        this.bigBg.Draw();
        this.endTime.Draw();
        this.iconAp.Draw();
        this.apCount.Draw();
        this.boxBtn.Draw();
        this.redPoint.Draw();
        this.boxProgress.Draw();
        this.iconMapBg.Draw();
        this.iconMap.Draw();

        this.smallBg.Draw();
        this.smallTitleBg.Draw();
        this.smallTitle.Draw();
        this.rewardDes.Draw();
        this.rewardBg.Draw();
        l_pageLeft.Draw();
        l_pageRight.Draw();
        this.scrollList.Draw();
        this.costAp.Draw();
        this.claimBtn.Draw();

        var mapsGettor = maps.GetEnumerator();
        while(mapsGettor.MoveNext())
        {
            mapsGettor.Current.Value.Draw();
        }
        selected.Draw();

        return -1;
    }
    
    public function Update() : void
    {
        //this.scrollList.Update();
        endTime.txt = mapManager.FormatTimeTipText();
    }
    
    public function OnPopOver() : void
    {
        maps.Clear();
        Destroy(mapPanel);
        scrollList.Clear();
    }

    private function UpdateMap() : void
    {
        var mapDatas = mapManager.maps.GetEnumerator();
        while(mapDatas.MoveNext())
        {
            var localId : int = mapDatas.Current.Key;
            var data : PassMissionMapData = mapDatas.Current.Value;

            if(this.maps.ContainsKey(localId))
            {
                var mapTemp : Button = maps[localId];
                SetMapUnlockedState(mapTemp, data);
            }          
        }
    }

    public function HandleNotification(type : String, body : System.Object) : void
    {
        switch (type)
        {
            case Constant.Notice.PassMissionMapReward:
                var clickId : int = _Global.INT32(body);
                this.OnMapClicked(clickId);
                UpdateMap();
                SetMyApCount();
                MenuMgr.getInstance().PushMessage(Datas.getArString("PassMission.ClaimRewardSucc"));
                break;
            case Constant.Notice.PassMissionMapBoxReward:
                MenuMgr.getInstance().PopMenu("ChestDetail");
                MenuMgr.getInstance().PushMessage(Datas.getArString("PassMission.ClaimRewardSucc"));
                SetBoxRewardState();
                break;
            default:
                break;
        }
    }
}