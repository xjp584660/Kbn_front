using UnityEngine;
using KBN;

public class ProgressBarWithBg : ProgressBar
{
	[SerializeField] private SimpleLabel backImage;
	[SerializeField] private Label topTips;

	public void SetColor(FontColor color)
	{
		topTips.normalTxtColor = color;
	}
	
	public void SetBg(string bgImage, string textureType) 
	{
		backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture(bgImage,textureType);
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		backImage.Draw();
		GUI.EndGroup();
		base.Draw();
		
		if(topTips !=null)
		{
			GUI.BeginGroup(rect);
			topTips.Draw();
			GUI.EndGroup();
		}
		return -1;
	}
	
	public void SetValue(int _curValue, int _maxValue)
	{
		float curValue = _curValue;
		float maxValue = _maxValue;
		SetCurValue(curValue/maxValue);
		topTips.txt = _curValue+"/"+_maxValue;
	}

	public void SetTxt(string tips)
	{
		topTips.txt = tips;
	}

	public void HideTips()
	{
		topTips.SetVisible(false);
	}
}
