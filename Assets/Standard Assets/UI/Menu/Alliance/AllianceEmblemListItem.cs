using UnityEngine;
using System;
using System.Collections;

public class AllianceEmblemListItem : ListItem {

	public AllianceEmblemItemData Data { get; private set; }

	public Rect tileRect;
	private Tile tile;
	private Color tileColor;
	
	public Rect lockRect;
	private Texture2D lockTex;

	public SimpleLabel lblHighlight;
	public SimpleButton btnCover;

	public bool drawBg = false;
	public Color bgColor = new Color(218 / 255.0f, 183 / 255.0f, 141 / 255.0f);

	public bool Highlighted {
		get {
			return lblHighlight.isVisible();
		}
		set {
			lblHighlight.SetVisible(value);
		}
	}

	public override void Init ()
	{
		base.Init ();

		lockTex = TextureMgr.singleton.LoadTexture("icon_whisper", TextureType.ICON);

		lblHighlight.Init();
		lblHighlight.mystyle.normal.background = TextureMgr.singleton.WhiteTex();
		lblHighlight.SetColor(new Color(7 / 255.0f, 245 / 255.0f, 74 / 255.0f));
		lblHighlight.SetVisible(false);

		btnCover.Init();
		btnCover.rect = rect;
		btnCover.rect.x = btnCover.rect.y = 0;
		btnCover.OnClick = new Action(OnClick);
	}

	public override int Draw ()
	{
		if (!visible || null == tile)
			return 0;

		GUI.BeginGroup(rect);
		
		lblHighlight.Draw();

		Color oldColor = GUI.color;

		if (drawBg) {
			GUI.color = oldColor * bgColor;
			if (Data.locked)
				GUI.color = GUI.color * Color.gray;
			GUI.DrawTexture(tileRect, TextureMgr.singleton.WhiteTex());
		}

		GUI.color = oldColor * tileColor;
		if (Data.locked)
			GUI.color = GUI.color * Color.gray;
		tile.Draw(tileRect, false);

		GUI.color = oldColor;

		if (Data.locked && null != lockTex) {
			GUI.DrawTexture(lockRect, lockTex);
		}

		btnCover.Draw();

		GUI.EndGroup();

		return 0;
	}

	public override void SetRowData (object data)
	{
		base.SetRowData (data);
		Data = data as AllianceEmblemItemData;

		string tilename = "Banner";
		Color tilecolor = Color.grey;
		if (Data.type == AllianceEmblemItemType.BannerColor) {
			tilecolor = AllianceEmblemMgr.GetColor(Data.color);
			drawBg = false;
		} else if (Data.type == AllianceEmblemItemType.Style) {
			tilename = "Banner_Graph" + Data.tile;
			drawBg = true;
		} else if (Data.type == AllianceEmblemItemType.Symbol) {
			tilename = "Banner_Pattern" + Data.tile;
			drawBg = true;
		}

		tile = TextureMgr.singleton.IconSpt().GetTile(tilename);
		tileColor = tilecolor;

		UpdateData();
	}

	public override void UpdateData ()
	{
		if (Data.locked) {

			Highlighted = false;

		} else {
			
			if (null != handlerDelegate) {
				handlerDelegate.handleItemAction("OnUpdateData", this);
			}

		}
	}

	private void OnClick() {

		if (null != handlerDelegate) {
			if (Data.locked) {
				handlerDelegate.handleItemAction("OnTips", this);
			} else {
				handlerDelegate.handleItemAction("OnClick", this);
			}
		}
	}
}
