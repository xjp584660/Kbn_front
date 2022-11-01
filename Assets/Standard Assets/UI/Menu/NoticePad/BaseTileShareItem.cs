using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using _Global = KBN._Global;

public abstract class BaseTileShareItem : FullClickItem
{
    public Label flag;
    public Label cityName;
    public Label cityLevel;
    public Label cityIntergration;
    public Label cityCoordinate;
    public Label cityCoordinatePosition;
    public Label occupantName;
    public Label allinaceName;
    public Label cityMight;
    public Button buttonSelect;
    public Label backgroundPic;
    public ToggleButton tb_Selected;
    
    [SerializeField]
    protected int flagYNormal = 55;
    [SerializeField]
    protected int flagYEdit = 70;
    [SerializeField]
    protected int flagX = 20;
    [SerializeField]
    protected Rect btnDefaultRect = new Rect(12f, 30.35f, 556.5f, 117.4f);
    [SerializeField]
    protected float btnDefaultAlpha = .3f;
    [SerializeField]
    protected FontColor coordinateColor = FontColor.Blue;
    
    protected SharedTileInfoData tmpdata = new SharedTileInfoData();
    
    public bool IsEdit { get; set; }
    public bool IsLeader { get; set; }

    public override void Init()
    {
        base.Init();
        btnDefault.rect = btnDefaultRect;
        btnDefault.alpha = btnDefaultAlpha;
        IsEdit = false;
        IsLeader = false;
    }

    public override int Draw()
    {
        if (!visible)
            return -1;
        GUI.BeginGroup(rect);
        backgroundPic.Draw();
        buttonSelect.Draw();
        flag.Draw();
        if (IsEdit == true)
        {
            flag.rect.y = this.flagYEdit;
        }
        else
        {
            flag.rect.y = this.flagYNormal;
        }
        
        cityName.Draw();
        cityLevel.Draw();
        cityIntergration.Draw();
        cityCoordinate.Draw();
        occupantName.Draw();
        allinaceName.Draw();
        cityMight.Draw();
        if (IsLeader && IsEdit)
        {
            tb_Selected.Draw();
        }
        btnDefault.Draw();
        
        GUI.EndGroup();
        return -1;
    }
    
    protected abstract void OnClickAttack(object param);
    
    protected abstract void OnClickAbandon(object param);
    
    protected abstract void OnClickSupport(object param);
    
    protected virtual void OnClickDefault(object param)
    {
        if (IsEdit)
        {
            tb_Selected.selected = !tb_Selected.selected;
        }
    }

    protected virtual void OnSelect(bool selected)
    {
        tmpdata.isTb_Selected = selected;
    }
    
    public override void SetRowData(object data)
    {
        tmpdata = (data as SharedTileInfoData);
        //flag.txt="flag"+tmpdata.flagid;
        
        buttonSelect.changeToBlueNew();
        
        tb_Selected.valueChangedFunc = new Action<bool>(OnSelect);
        
        switch (tmpdata.flagid)
        {        
            /*
        boss 3-No flag-Attack.
        self 4-Yellow flag-Abandon.
        self 5-alliance-Blue flag-Support.
        enemy other-Red flag-Attack.
        */
        case 3:
            flag.SetVisible(false);
            break;
            
        case 4:
            flag.SetVisible(true);
            flag.setBackground("icon_map_view_flag_yellow_0", TextureType.ICON_ELSE);
            break;
            
        case 5:
            flag.SetVisible(true);
            flag.setBackground("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
            break;
            
        default:
            flag.SetVisible(true);
            flag.setBackground("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
            break;
        }
        flag.rect.x = flagX;
        
        cityName.txt = KBN.Datas.getArString((tmpdata.tileKind == 1) ? "PVP.TileType_Boss" : "PVP.TileType_Resource");
        cityLevel.txt = "(LV" + tmpdata.level + ")";
        if (tmpdata.tileKind == 1)
        {
            cityIntergration.SetVisible(true);
            cityIntergration.txt = string.Format(KBN.Datas.getArString("PVP.Event_Share_Data5"), tmpdata.intergration);
        }
        else
        {
            cityIntergration.SetVisible(false);
        }
        occupantName.txt = string.Format(KBN.Datas.getArString("PVP.Event_Share_Data2"), tmpdata.s_occupantName);
        allinaceName.txt = string.Format(KBN.Datas.getArString("PVP.Event_Share_Data3"), tmpdata.s_allinaceName);
        cityMight.txt = string.Format(KBN.Datas.getArString("PVP.Event_Share_Data4"), tmpdata.might);
        //buttonSelect.txt="b"+tmpdata.btn_type;
        /*
        boss 3-No flag-Attack.
        self 4-Yellow flag-Abandon.
        self 5-alliance-Blue flag-Support.
        enemy other-Red flag-Attack.
        */
        buttonSelect.SetVisible(true);
        switch (tmpdata.flagid/*tmpdata.btn_type*/)
        {
            
        case 3://boss-No flag-Attack.
            buttonSelect.txt = KBN.Datas.getArString("Common.Attack");
            buttonSelect.OnClick = new Action<object>(OnClickAttack);
            break;
            
        case 4://self-Yellow flag-Abandon.
            buttonSelect.txt = KBN.Datas.getArString("Common.Abandon");
            buttonSelect.OnClick = new Action<object>(OnClickAbandon);
            break;
            
        case 5://self-alliance-Yellow flag-Support.
            buttonSelect.txt = KBN.Datas.getArString("PVP.Event_Support");
            buttonSelect.OnClick = new Action<object>(OnClickSupport);
            break;
            
        default:
            buttonSelect.txt = KBN.Datas.getArString("Common.Attack");
            buttonSelect.OnClick = new Action<object>(OnClickAttack);
            break;
        }
        
        Color coordinateRealColor = FontMgr.GetColorFromTextColorEnum(this.coordinateColor);
        cityCoordinatePosition.txt = string.Format("<color={0}>({1}, {2})</color>",
                                                   _Global.ColorToString(coordinateRealColor),
                                                   tmpdata.coordinateX,
                                                   tmpdata.coordinateY);
        tb_Selected.selected = tmpdata.isTb_Selected;
        cityCoordinate.txt = string.Format(KBN.Datas.getArString("PVP.Event_Share_Data1"), cityCoordinatePosition.txt);
        
        btnDefault.OnClick = new Action<object>(OnClickDefault);
    }
}
