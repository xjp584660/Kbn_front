#pragma strict

public class TroopSelectionListItem extends ListItem
{
    public class DisplayData extends TroopListItem.DisplayData
    {
        public var selectCount : int = 0;
        
        public var onValueChanged : System.Action;
    
        public function DisplayData() {}

        public function DisplayData(id : int, cnt : int)
        {
            super(id, cnt);
        }
    }
    
    @SerializeField
    protected var m_spliceLine : Label;
    @SerializeField
    protected var m_selectCount : Slider;
    @SerializeField
    protected var m_minValue : Label;
    @SerializeField
    protected var m_maxValue : Label;
    @SerializeField
    protected var m_curValue : InputText;

    protected var m_dat : DisplayData;
    
    public function Init()
    {
        var texMgr : TextureMgr = TextureMgr.instance();
        m_spliceLine.mystyle.normal.background = texMgr.LoadTexture("mail_Split-line", TextureType.DECORATION);

        btnSelect.OnClick = function()
        {
            m_selectCount.SetCurValue(m_selectCount.MaxValue);
            protOnValueChanged(m_selectCount.MaxValue);
        };
        btnSelect.mystyle.normal.background = texMgr.LoadTexture("icon_max", TextureType.BUTTON);

        m_selectCount.valueChangedFunc = this.protOnValueChanged;
        m_curValue.Init();
        m_curValue.type = TouchScreenKeyboardType.NumberPad;
        SetInputText();     
        m_curValue.endInput = function(vStr : String)
        {
            var v : long = _Global.INT64(vStr);
            m_selectCount.SetCurValue(v);
            protOnValueChanged(v);
        };
        m_curValue.filterInputFunc = function(oldStr:String,newStr:String):String
        {
            newStr = _Global.FilterStringToNumberStr(newStr);
            var n:long = _Global.INT64(newStr);
            if(m_dat != null && n > m_dat.troopCount) 
                n = m_dat.troopCount;
            return n.ToString();
        };
    }
    
    public function SetInputText()
    {
      if( m_curValue.mystyle.normal.background == null )
        {
            var texMgr : TextureMgr = TextureMgr.instance();
            m_curValue.mystyle.normal.background = texMgr.LoadTexture("type_box", TextureType.DECORATION);
            m_curValue.mystyle.active.background = texMgr.LoadTexture("type_box2", TextureType.DECORATION);
            m_curValue.mystyle.border.left = 10;
            m_curValue.mystyle.border.right = 10;
            m_curValue.mystyle.border.top = 10;
            m_curValue.mystyle.border.bottom = 10;
        }
    }
    
    public function SetRowData(dat : System.Object)
    {
        var inf : DisplayData = dat as DisplayData;
        var texMgr : TextureMgr = TextureMgr.instance();
        var unitSpt : TileSprite = texMgr.UnitSpt();
        icon.tile = unitSpt.GetTile("ui_" + inf.troopId.ToString());
        icon.useTile = true;
        title.txt = Datas.getArString("unitName.u" + inf.troopId.ToString());
        //description.txt = inf.troopCount.ToString();
        var curSelectCount : int = inf.selectCount;
        m_selectCount.Init(inf.troopCount);
        m_selectCount.SetCurValue(curSelectCount);
        m_selectCount.thumbStyle.padding.right = 0;
        m_curValue.txt = curSelectCount.ToString();
        m_minValue.txt = "0";
        m_maxValue.txt = inf.troopCount.ToString();
        m_dat = inf;
    }

    public function Draw()
    {
        super.Draw();
        GUI.BeginGroup(this.rect);
            m_spliceLine.Draw();
            m_selectCount.Draw();
            m_minValue.Draw();
            m_maxValue.Draw();
            m_curValue.Draw();
        GUI.EndGroup();
    }

    protected function protOnValueChanged(newValue : int)
    {
        m_curValue.txt = newValue.ToString();
        m_dat.selectCount = newValue;
        if (m_dat.onValueChanged != null)
        {
            m_dat.onValueChanged();
        }
    }
}