using UnityEngine;
using System.Collections;
using KBN;
public class NormalTipsMenu : PopMenu 
{
	public NormalTipsBar tip;
	
	public override void Init ()
	{
		tip.Init();
	}
	
	public override int Draw ()
	{
		tip.Draw ();
		return 1;
	}
	
	public override void Update ()
	{
		tip.Update();
		rect = tip.rect;
		if(!tip.IsShow())
		{
			KBN.MenuMgr.instance.PopMenu("");
		}
	}
	
	public override void OnPush(object param)
	{	
		tip.setInfoContent (param as string);
		tip.Show();
	}
	
	
}
