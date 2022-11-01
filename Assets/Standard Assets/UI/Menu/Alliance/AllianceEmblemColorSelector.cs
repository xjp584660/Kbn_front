using UnityEngine;
using System;
using System.Collections.Generic;

[Serializable]
public class AllianceEmblemColorSelector : BubbleFrame {

	public int numRow;
	public int numCol;
	public Vector2 originPos;
	public Vector2 blockSize;
	public Vector2 cellSize;
	public Vector2 lockSize;

	public List<AllianceEmblemItemData> colorList { get; set; }

	public Action<string> OnSelected { get; set; }

	[SerializeField]
	private GUIStyle blockStyle;

	private Texture2D lockTex;

	public override void Sys_Constructor ()
	{
		base.Sys_Constructor ();

		blockStyle.normal.background = TextureMgr.singleton.WhiteTex();

		lockTex = TextureMgr.singleton.LoadTexture("icon_whisper", TextureType.ICON);
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		if (null == colorList)
			return;

		Rect block = new Rect(originPos.x, originPos.y, blockSize.x, blockSize.y);
		Rect lockRect = new Rect(0, 0, lockSize.x, lockSize.y);
		Vector2 lockPos = (blockSize - lockSize) * 0.5f;
		Color oldColor = GUI.color;

		for (int i = 0, k = 0; i < numRow; i++) {
			for (int j = 0; j < numCol; j++, k++) {
				if (k >= colorList.Count) continue;

				block.x = originPos.x + j * cellSize.x;
				block.y = originPos.y + i * cellSize.y;
				lockRect.x = block.x + lockPos.x;
				lockRect.y = block.y + lockPos.y;

				Color color = AllianceEmblemMgr.GetColor(colorList[k].color);
				bool locked = colorList[k].locked;

				if (locked)
					color *= Color.grey;
				GUI.color = color;

				if (GUI.Button(block, GUIContent.none, blockStyle)) {
					OnBlockClick(k);
				}

				if (locked) {
					GUI.color = Color.white;
					GUI.DrawTexture(lockRect, lockTex);
				}
			}
		}

		GUI.color = oldColor;
	}

	private void OnBlockClick(int idx) {
		if (colorList[idx].locked)
			return;

		if (null != OnSelected) {
			OnSelected(colorList[idx].color);
		}
		Close();
	}
}
