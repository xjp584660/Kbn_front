using UnityEngine;
using System.Collections;

using _Global = KBN._Global;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class AllianceEmblemRenderer : MonoBehaviour {

	private Tile banner;
	private Tile style;
	private Tile symbol;

	AtlasGroup.Image bannerProp;
	AtlasGroup.Image styleProp;
	AtlasGroup.Image symbolProp;

	public AllianceEmblemData Data {
		set {
			GetComponent<Renderer>().enabled = (null != value && !value.IsEmpty);
			if (GetComponent<Renderer>().enabled) {
				Material mat = new Material(Shader.Find("_KBNShaders_/kbnEmblem"));
				mat.name = "Emblem";
				banner = TextureMgr.singleton.IconSpt().GetTile("Banner");
				style = TextureMgr.singleton.IconSpt().GetTile("Banner_Graph" + value.style);
				symbol = TextureMgr.singleton.IconSpt().GetTile("Banner_Pattern" + value.symbol);
				Color bannerColor = AllianceEmblemMgr.GetColor(value.banner);
				Color styleColor = AllianceEmblemMgr.GetColor(value.styleColor);
				Color symbolColor = AllianceEmblemMgr.GetColor(value.symbolColor);
				
				bannerProp = banner.GetTileNode(0).prop;
				styleProp = style.GetTileNode(0).prop;
				symbolProp = symbol.GetTileNode(0).prop;
				
				mat.mainTexture = banner.GetTileNode(0).sprite.ValidateTexture(bannerProp.texIdx);

				mat.SetTexture("_MaskTex", TextureMgr.singleton.LoadTexture("Flag_Mask", TextureType.DECORATION));
				mat.SetTexture("_ShadowTex", TextureMgr.singleton.LoadTexture("Flag_Shadow", TextureType.DECORATION));
				
				mat.SetColor("_BannerColor", bannerColor);
				mat.SetVector("_BannerUVRect", _Global.RectToVec4(bannerProp.uvRect));
				
				mat.SetColor("_StyleColor", styleColor);
				mat.SetVector("_StyleUVRect", _Global.RectToVec4(styleProp.uvRect));
				
				mat.SetColor("_SymbolColor", symbolColor);
				mat.SetVector("_SymbolUVRect", _Global.RectToVec4(symbolProp.uvRect));
				
				ReplaceMaterial(mat);
			} else {
				ReplaceMaterial(null);

				banner = null;
				style = null;
				symbol = null;
				bannerProp = null;
				styleProp = null;
				symbolProp = null;
			}
		}
	}

	private void ReplaceMaterial(Material mat) 
	{
		Material oldmat = GetComponent<Renderer>().material;
		GetComponent<Renderer>().material = mat;
		if (null != oldmat)
			Destroy(oldmat);
	}

	void Update() {
		// avoid Tile release Texture
		if (null != banner && null != bannerProp)
			banner.GetTileNode(0).sprite.ValidateTexture(bannerProp.texIdx);
	}

}
