using UnityEngine;
using System.Collections;
using KBN;

public class ChromeOrganizerListItem : ListItem
{
    public class Data
    {
        public Texture2D iconText;
        public string title;
        public string desc;
        public System.Action clickButtonPosition;
        public System.Action<ChromeOrganizerListItem> updateCallback;
        public bool isNeedShowDot;
        public long endTime = -1;

        [System.Serializable]
        public class AuxLabelData
        {
            public string textKey;
            public FontColor color;
            public FontType font;
            public FontSize size;
            public Rect rect;
            public TextAnchor alignment;
        }
        public AuxLabelData auxLabelData;
    }
    private System.Action<ChromeOrganizerListItem> m_usrUpdate;

    [SerializeField]
    private SimpleLabel m_backGroundLabel;
    [SerializeField]
    private SimpleLabel m_dotInfo;
    [SerializeField]
    private SimpleLabel m_endTime;
    [SerializeField]
    private SimpleLabel m_auxLabel;
    [SerializeField]
    private string m_animParam;

    private long m_endTime64;


    private Data dat;

    public override void Init()
    {
        var texMgr = TextureMgr.instance();
        var iconSpt = texMgr.IconSpt();
        m_backGroundLabel.tile = iconSpt.GetTile("event_Background");
        m_backGroundLabel.useTile = true;
        title.tile = iconSpt.GetTile("event_BackgroundBanner");
        title.useTile = true;
        m_backGroundLabel.rect = new Rect(0, 0, this.rect.width, this.rect.height);
        btnSelect.changeToBlueNew();
        btnSelect.txt = Datas.getArString("Common.GO");
        m_auxLabel.SetVisible(false);
    }

    private void OnClickItem()
    {
        MenuMgr.instance.PopMenu("ChromeOrganizerMenu");
        if (dat == null || dat.clickButtonPosition == null)
        {
            return;
        }
        dat.clickButtonPosition();
    }

    public override void SetRowData(object inDat)
    {
        var texMgr = TextureMgr.instance();
        dat = (Data)inDat;
        icon.mystyle.normal.background = dat.iconText;
        title.txt = dat.title;
        description.txt = dat.desc;
        btnSelect.OnClick = new System.Action(OnClickItem);
        m_usrUpdate = dat.updateCallback;

        m_dotInfo.mystyle.normal.background = texMgr.LoadTexture("RedDot", TextureType.DECORATION);
        m_endTime.mystyle.normal.background = texMgr.LoadTexture("chrome_icon_Countdown2", TextureType.BACKGROUND);

        if ( dat.isNeedShowDot )
        {
            DotVisible = true;
        }
        else
        {
            DotVisible = false;
        }

        m_endTime64 = dat.endTime;
        if ( dat.endTime > 0 )
        {
            m_endTime.SetVisible(true);
        }
        else
        {
            m_endTime.SetVisible(false);
        }

        SetAuxLabelData(dat.auxLabelData);
    }

    private void SetAuxLabelData(Data.AuxLabelData data)
    {
        if (data == null)
        {
            m_auxLabel.SetVisible(false);
            return;
        }

        m_auxLabel.SetVisible(true);
        m_auxLabel.txt = Datas.getArString(data.textKey);
        m_auxLabel.fontType = data.font;
        m_auxLabel.SetNormalTxtColor(data.color);
        m_auxLabel.rect = data.rect;
        m_auxLabel.mystyle.alignment = data.alignment;
    }

    public override void UpdateData()
    {
        if ( m_usrUpdate != null )
            m_usrUpdate(this);
    }

    public override int Draw()
    {
        if (!visible)
            return -1;
        GUI.BeginGroup(rect);
        m_backGroundLabel.Draw();
        prot_drawSelfWithoutGroup();
        m_dotInfo.Draw();
        m_auxLabel.Draw();
        if (m_endTime64 >= GameMain.unixtime())
        {
            var deltaTime = m_endTime64 - GameMain.unixtime();
            m_endTime.txt = (deltaTime<259200)? _Global.timeFormatShortStrEx(deltaTime,false):Datas.getArString("Common.Special");
            m_endTime.Draw();
        }
        else if (m_endTime64 > 0)
        {
            m_endTime.txt = _Global.timeFormatShortStrEx(0,false);
            m_endTime.Draw();
        }
        GUI.EndGroup();

        return -1;
    }

    public float priv_iconRotate
    {
        get
        {
            return icon.rotateAngle;
        }

        set
        {
            icon.rotateAngle = value;
        }
    }

    public bool DotVisible
    {
        get
        {
            return m_dotInfo.isVisible();
        }
        set
        {
            m_dotInfo.SetVisible(value);
            if ( value )
            {
                var texMgr = TextureMgr.instance();
                m_dotInfo.mystyle.normal.background = texMgr.LoadTexture("RedDot", TextureType.DECORATION);
                m_dotInfo.SetVisible(true);
            }
            else
            {
                m_dotInfo.mystyle.normal.background = null;
                m_dotInfo.SetVisible(false);
            }
        }
    }

    public bool PlayRotateAnim;
  
}
