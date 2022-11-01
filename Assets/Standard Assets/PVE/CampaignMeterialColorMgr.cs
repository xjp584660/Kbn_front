using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
public class CampaignMeterialColorMgr : MonoBehaviour
{
	public List<Material> materialList = new List<Material> ();
	public List<Color> normalColorList = new List<Color> ();
	public List<Color> eliteColorList = new List<Color> ();

	private static CampaignMeterialColorMgr singleton = null;
	private CampaignMeterialColorMgr()
	{

	}

	public static CampaignMeterialColorMgr getInstance()
	{
		if (singleton == null) 
		{
			singleton = new CampaignMeterialColorMgr();
		}
		return singleton;
	}


	public void Awake()
	{
		Game.Event.RegisterHandler(EventId.CampaignMode, OnCampaignModeChanged);
	}

	private void OnCampaignModeChanged(object Sender, GameFramework.GameEventArgs e)
	{
		CampaignModeEventArgs args = e as CampaignModeEventArgs;
		if (args.Type == Constant.PveType.NORMAL) 
		{
			SetNormalColor();
		} 
		else 
		{
			SetEliteColor();
		}
	}

	public void SetNormalColor()
	{
		for(int i=0;i<materialList.Count;i++)
		{
			materialList[i].color = normalColorList[i];
		}
	}

	public void SetEliteColor()
	{
		for(int i=0;i<materialList.Count;i++)
		{
			materialList[i].color = eliteColorList[i];
		}
	}


}
