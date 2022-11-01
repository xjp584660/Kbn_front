using UnityEngine;
using System;
using System.Collections;

using MenuMgr = KBN.MenuMgr;
using General = KBN.General;

public class OutpostTabMyTroopsKnightItem : UIObject {

	[SerializeField]
	private SimpleLabel knightIcon;
	[SerializeField]
	private SimpleLabel infoIcon;
    [SerializeField]
    private SimpleLabel lbLevelIcon;
	[SerializeField]
	private SimpleLabel lbLevel;

	[SerializeField]
	private SimpleButton btnInfo;

	private GeneralInfoVO cachedData;

	public override void Init ()
	{
		base.Init ();

		infoIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture("infor_icon", TextureType.DECORATION);
		btnInfo.rect = new Rect(0, 0, rect.width, rect.height);
		btnInfo.OnClick = new Action(OnInfoButtonClick);

        lbLevelIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Button_UserInfo_lv", TextureType.DECORATION);
        lbLevelIcon.tile = TextureMgr.singleton.ElseIconSpt().GetTile("lv_reincarnation");
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		btnInfo.Draw();
		knightIcon.Draw();
        infoIcon.Draw();
        lbLevelIcon.Draw();
		lbLevel.Draw();
		GUI.EndGroup();

		return -1;
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		cachedData = data as GeneralInfoVO;
		if (null == cachedData)
			return;
		
		string tilename = General.getGeneralTextureName(cachedData.knightName, cachedData.cityOrder);

		knightIcon.useTile = true;
		knightIcon.tile = TextureMgr.singleton.IconSpt().GetTile(tilename);

        lbLevel.SetFont();
		lbLevel.txt =(cachedData.isStar ? cachedData.starLevel.ToString() : cachedData.knightLevel.ToString());
        Vector2 size = lbLevel.mystyle.CalcSize(new GUIContent(lbLevel.txt));

        if (cachedData.isStar)
        {
            lbLevelIcon.useTile = true;

            lbLevelIcon.rect = new Rect(
                (rect.width - size.x - 50) * 0.5f, 
                lbLevel.rect.y + size.y * 0.5f - 20, 
                40, 40);
            lbLevel.rect.x = lbLevelIcon.rect.xMax + 10;
        }
        else
        {
            lbLevelIcon.useTile = false;
            
            lbLevelIcon.rect = new Rect(
                (rect.width - size.x - 50) * 0.5f, 
                lbLevel.rect.y + size.y * 0.5f - 11, 
                50, 22);
            lbLevel.rect.x = lbLevelIcon.rect.xMax;
        }

		infoIcon.SetVisible(!cachedData.isOtherKnight);
	}

	private void OnInfoButtonClick()
	{
		if (null != cachedData)
		{
			if(cachedData.isOtherKnight)
			{
				//MenuMgr.instance.PushMenu("OtherKnightInfomationPopMenu", cachedData, "trans_zoomComp");
			}
			else
			{
				MenuMgr.instance.PushMenu("KnightInformationPopMenu", cachedData.knightId.ToString(), "trans_zoomComp");
			}
		}
	}
}
