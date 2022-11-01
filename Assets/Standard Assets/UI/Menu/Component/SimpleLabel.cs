using UnityEngine;
using System;
using System.Collections;

[Serializable]
public class SimpleLabel : SimpleUIElement
{

	[UnityEngine.Space(30), UnityEngine.Header("----------SimpleLabel----------")]



	public Texture image;
	public bool useTile = false;
	public Tile tile;

	public void Copy(Label src)
	{
		rect = src.rect;
		mystyle = src.mystyle;
		category = src.category;
		content = src.content;
	}

	public void Copy(SimpleLabel src)
	{
		rect = src.rect;
		mystyle = src.mystyle;
		category = src.category;
		content = src.content;
	}
	
	public override int Draw()
	{	
		if( !visible ){
			return -1;
		}
        
		Matrix4x4 oldMatrix = GUI.matrix;
		bool matrixChanged = applyRotationAndScaling();

        Color oldColor = GUI.color;
        GUI.color *= m_color;
		SetFont();
		SetNormalTxtColor();
		if(useTile && null != tile && tile.IsValid)
		{
			tile.rect = rect;
			tile.Draw(rect);
		}
		else
			GUI.Label(rect, new GUIContent(txt,image, tips), mystyle);
            
        GUI.color = oldColor;
		if (matrixChanged) {
			GUI.matrix = oldMatrix;
		}
		return -1;
	}
	
	public void setBackground(string picPath, string textureType)
	{
		mystyle.normal.background = TextureMgr.instance().LoadTexture(picPath, textureType);
	}
	
	public int GetTxtHeight()
	{
		return (int)mystyle.CalcHeight( new GUIContent(txt, null, null), rect.width);
	}
	
	public int GetWidth()
	{
		int w = (int)mystyle.CalcSize( new GUIContent(txt, image, tips)).x;
		return w;
	}
}

