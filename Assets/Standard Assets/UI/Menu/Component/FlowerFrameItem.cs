using UnityEngine;
using KBN;
public class FlowerFrameItem : UIObject {
	[SerializeField] private SimpleLabel flowerFrame;
	[SerializeField] private SimpleLabel icon;
	[SerializeField] private SimpleLabel itemTitle;
	[SerializeField] private SimpleLabel itemDesc;

	public void Init()
	{
		base.Init();
		flowerFrame.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("Quest_kuang", TextureType.DECORATION);
	}

	public void SetIcon(string name, string type)
	{
		icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(name, type);
	}

	public string title{
		set{
			itemTitle.txt = value;
		}
		get{
			return itemTitle.txt;
		}
	}

	public string desc{
		set{
			itemDesc.txt = value;
		}
		get{
			return itemDesc.txt;
		}
	}

	public void Draw()
	{
		GUI.BeginGroup(rect);
		flowerFrame.Draw();
		icon.Draw();
		itemTitle.Draw();
		itemDesc.Draw();
		GUI.EndGroup();
	}
}
