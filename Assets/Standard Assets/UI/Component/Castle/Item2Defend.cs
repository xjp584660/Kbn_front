using UnityEngine;
using System.Collections;
using KBN;
using System;

public class Item2Defend : UIObject
{
    [SerializeField]
    private ItemPic itemView;
    [SerializeField]
    private SimpleLabel nameView;
    [SerializeField]
    private SimpleLabel descView;
    [SerializeField]
    private SimpleLabel dividingLine;
    [SerializeField]
    private SimpleButton helpButton;

    [SerializeField]
    private string descKey;

    public Action OnHelpButtonDelegate;

    public void SetItemId(int id)
    {
        itemView.SetId(id);
        PopulateNameView(id);
    }

    public override void Init()
    {
        base.Init();

        descView.txt = Datas.getArString(descKey);

        dividingLine.setBackground("between line_list_small", TextureType.DECORATION);

		helpButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_i",TextureType.DECORATION);
        helpButton.OnClick = new Action<HashObject>(OnHelpButton);
    }

    public override int Draw()
    {
        if (!isVisible())
        {
            return -1;
        }

        GUI.BeginGroup(rect);
        if (Event.current.type == EventType.Repaint)
        {
            itemView.Draw();
            nameView.Draw();
            descView.Draw();
            dividingLine.Draw();
        }
		helpButton.Draw();
        GUI.EndGroup();

        return -1;
    }

    #region Private
    private void PopulateNameView(int id)
    {
        string itemName = Datas.getArString(string.Format("itemName.i{0}", id));
        string owned = Datas.getArString("Common.Owned");
        long itemCount = MyItems.singleton.countForItem(id);
        nameView.txt = string.Format("{0} ({1}: {2})", itemName, owned, itemCount);
    }

    private void OnHelpButton(object param)
    {
        if (OnHelpButtonDelegate != null)
        {
            OnHelpButtonDelegate();
        }
    }
    #endregion
}
