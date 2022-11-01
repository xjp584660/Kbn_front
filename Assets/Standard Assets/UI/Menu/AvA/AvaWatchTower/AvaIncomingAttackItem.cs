using UnityEngine;
using System.Collections;
using System;
using System.Text;

using _Global = KBN._Global;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;

public class AvaIncomingAttackItem : FullClickItem
{
    [SerializeField]
    private SimpleLabel lblArrow;
    [SerializeField]
    private SimpleLabel lblDisplayText;

    private int m_marchId;
    private string m_displayName;
    private int m_coordX;
    private int m_coordY;
    private long? m_eta;
    private bool m_isRally;

    public const float TextUpdatePeriod = 1f;
    private float textLastUpdateTime = 0f;

    private static StringBuilder sharedSb = new StringBuilder();
    
    public override void Init()
    {
        base.Init();
        m_eta = null;
        lblArrow.setBackground("button_moreinfo_small2_normal", TextureType.BUTTON);
        this.line.setBackground("between line_list_small", TextureType.DECORATION);
        this.btnDefault.rect = new Rect(0f, 0f, this.rect.width, this.rect.height);
        this.btnDefault.alpha = .3f;
        this.btnDefault.OnClick = new Action<object>(OnClickItem);
    }
    
    public override int Draw()
    {
        base.Draw();
        GUI.BeginGroup(this.rect);
        lblDisplayText.Draw();
        lblArrow.Draw();
        GUI.EndGroup();
        return -1;
    }

    public override void SetRowData(object data)
    {
        var dataDict = data as Hashtable;
        m_marchId = _Global.INT32(dataDict["Id"]);
        m_displayName = _Global.GetString(dataDict["Name"]);
        m_coordX = _Global.INT32(dataDict["CoordX"]);
        m_coordY = _Global.INT32(dataDict["CoordY"]);

        if (dataDict["Eta"] != null)
        {
            m_eta = _Global.INT64(dataDict["Eta"]);
        }

        m_isRally = _Global.INT32(dataDict["IsRally"]) != 0;
        UpdateDisplayText();
    }

    public override void Update()
    {
        base.Update();
        if (Time.time - textLastUpdateTime > TextUpdatePeriod)
        {
            UpdateDisplayText();
            textLastUpdateTime = Time.time;
        }
    }
    
    private void OnClickItem(object param)
    {
        MenuMgr.instance.SendNotification(Constant.Notice.AvaInspectIncomingAttackDetail, m_marchId);
    }

    private void UpdateDisplayText()
    {
        sharedSb.Length = 0;
        sharedSb.Append(Datas.getArString("Common.Target"));

        if (m_coordX == 0 || m_coordY == 0)
        {
            sharedSb.AppendFormat(": {0}\n", this.m_displayName);
        }
        else
        {
            sharedSb.AppendFormat(": {0} ({1},{2})\n", this.m_displayName, this.m_coordX, this.m_coordY);
        }

        if (m_eta.HasValue)
        {
            sharedSb.Append(Datas.getArString("Common.Arrival"));
            long time = m_eta.Value - GameMain.unixtime();
            time = time > 0 ? time : 0;
            sharedSb.AppendFormat(": {0}", _Global.timeFormatStr(time));
        }

        if (m_isRally)
        {
            sharedSb.Append("\n");
            sharedSb.Append(Datas.getArString("AVA.chrome_rallyattackbtn"));
        }
        lblDisplayText.txt = sharedSb.ToString();
    }
}
