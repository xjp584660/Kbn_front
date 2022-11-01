using UnityEngine;
using System.Collections;
using System.Text;
using System.Collections.Generic;

using Datas = KBN.Datas;
using _Global = KBN._Global;

public class ReportHeroInfoItem : UIObject
{
    [SerializeField]
    private Label contentHeroName;
    [SerializeField]
    private Label contentHeroMight;
	[SerializeField]
	private Label contentHeroMightLost;

	public void Draw()
	{
		GUI.BeginGroup(this.rect);

		contentHeroName.Draw();
		contentHeroMight.Draw();
		contentHeroMightLost.Draw();

		GUI.EndGroup();
	}

	public override void Init()
	{
		base.Init();
	}

	public void SetUIData(object data)
	{
		var myData = data as ReportDetailHeroesView.Data.ReportHeroInfo;

		contentHeroName.txt = myData.name;
		if (_Global.IsNumber(myData.might.ToString()))
			contentHeroMight.txt = _Global.NumFormat(long.Parse(myData.might.ToString()));
		else
			contentHeroMight.txt = myData.might.ToString();
		contentHeroMightLost.txt = myData.mightLost;
	}
}
