using UnityEngine;
using System;
using System.Collections;

using _Global = KBN._Global;

[Serializable]
public class AllianceEmblem : UIElement {

	private AllianceEmblemData data;

	private Tile banner;
	private Tile style;
	private Tile symbol;

	[SerializeField]
	private Color bannerColor;
	[SerializeField]
	private Color styleColor;
	[SerializeField]
	private Color symbolColor;
	[SerializeField]
	private bool drawShadow;
	[SerializeField]
	private GUIStyle shadowStyle;

	private Texture2D tex = null;
	private Material mat = null;

	public AllianceEmblemData Data {
		get {
			return data;
		}
		set {
			data = value;

			if (null != data && !data.IsEmpty) {
				banner = TextureMgr.singleton.IconSpt().GetTile("Banner");
				style = TextureMgr.singleton.IconSpt().GetTile("Banner_Graph" + data.style);
				symbol = TextureMgr.singleton.IconSpt().GetTile("Banner_Pattern" + data.symbol);
				bannerColor = AllianceEmblemMgr.GetColor(data.banner);
				styleColor = AllianceEmblemMgr.GetColor(data.styleColor);
				symbolColor = AllianceEmblemMgr.GetColor(data.symbolColor);

				if (null == shadowStyle.normal.background)
					shadowStyle.normal.background = TextureMgr.singleton.LoadTexture("Flag_Shadow2", TextureType.DECORATION);

				UpdateMaterial();
			}
		}
	}

	public override int Draw ()
	{
		if (!visible || null == banner || null == style || null == symbol)
			return 0;

		if (drawShadow) {
			Rect srect = shadowStyle.border.Add(rect);
			GUI.Box(srect, GUIContent.none, shadowStyle);
		}

		Color oldColor = GUI.color;

		GUI.color = oldColor * bannerColor;
		banner.Draw(rect, false);

		GUI.color = oldColor * styleColor;
		style.Draw(rect, false);

		GUI.color = oldColor * symbolColor;
		symbol.Draw(rect, false);

		GUI.color = oldColor;

		return 0;
	}

	private void UpdateMaterial() {
		if (null == mat)
			return;

		AtlasGroup.Image bannerProp = banner.GetTileNode(0).prop;
		AtlasGroup.Image styleProp = style.GetTileNode(0).prop;
		AtlasGroup.Image symbolProp = symbol.GetTileNode(0).prop;
		
		tex = banner.GetTileNode(0).sprite.ValidateTexture(bannerProp.texIdx);

		mat.SetColor("_BannerColor", bannerColor);
		mat.SetVector("_BannerUVRect", _Global.RectToVec4(bannerProp.uvRect));

		mat.SetColor("_StyleColor", styleColor);
		mat.SetVector("_StyleUVRect", _Global.RectToVec4(styleProp.uvRect));

		mat.SetColor("_SymbolColor", symbolColor);
		mat.SetVector("_SymbolUVRect", _Global.RectToVec4(symbolProp.uvRect));
	}

	public void DrawWithMask() {
		if (null == mat) {
			mat = new Material(Shader.Find("_KBNShaders_/kbnEmblem"));
			
			UpdateMaterial();
		}

		Graphics.DrawTexture(rect, tex, mat);
	}

}
