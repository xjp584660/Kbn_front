using UnityEngine;
using System;
using System.Collections;
using KBN;
public class AvaSpeedUpMenu:PopMenu,IEventHandler
{
	public Label titleDesc;
	public Label separateLine;
	public Label timeTxtLabel;
	public Label timeIconLabel;
	public PercentBar percentBar;
	public	ScrollList	scroll_ItemList;
	public AvaSpeedUpItem item;
	private bool isCloseAfterAnimationFinish = false;

	private AvaSpeedUp.AvaSpeedUpData m_data = new AvaSpeedUp.AvaSpeedUpData ();
	
	public override void Init()
	{
		base.Init();
		title.txt = Datas.getArString("Common.Speedup");
		titleDesc.txt = Datas.getArString("Common.AvaSpeedupDesc");
		separateLine.setBackground("between line", TextureType.DECORATION);
		isCloseAfterAnimationFinish = false;
		btnClose.OnClick = new Action(OnCloseClick);
		scroll_ItemList.Init (item);
		scroll_ItemList.itemDelegate = this;
	}

	public override void Update()
	{
		scroll_ItemList.Update ();
		percentBar.Update ();
		if(getLeftTime() > 0)
		{
			percentBar.update (getCurProgress());
		}
		else
		{
			if(percentBar.getCurBarState() == PercentBar.PercentBarState.STOP)
			{
				MenuMgr.instance.PopMenu("AvaSpeedUpMenu");
			}
		}
		if(isCloseAfterAnimationFinish && percentBar.getCurBarState() == PercentBar.PercentBarState.STOP)
		{
			MenuMgr.instance.PopMenu("AvaSpeedUpMenu");
		}
		timeTxtLabel.txt = getLeftTimeStr ();
	}
	
	protected override void DrawItem()
	{
		separateLine.Draw ();
		scroll_ItemList.Draw();
		titleDesc.Draw ();
		percentBar.Draw();
		timeIconLabel.Draw();
		timeTxtLabel.Draw();
	}
	
	public override void OnPush( object p )
	{
		base.OnPush( p );
		m_data = p as AvaSpeedUp.AvaSpeedUpData;
		if (null == m_data)
			return;
		scroll_ItemList.SetData(MyItems.singleton.GetAvaSpeedItemList());
		percentBar.Init( getCurProgress(),m_data.origTotalTime, true);
		timeTxtLabel.txt = getLeftTimeStr ();
	}

	public override void OnPopOver()
	{
		scroll_ItemList.Clear();
	}
	
	public override void handleNotification(string type, object body)
	{
		switch(type)
		{
		case Constant.Notice.AvaUseSpeedUpItemOk:
			m_data = body as AvaSpeedUp.AvaSpeedUpData;
			UpdateItems();
			break;
		}
	}
	
	private void  OnCloseClick()
	{
		MenuMgr.instance.PopMenu("AvaSpeedUpMenu");
	}
	
	public void handleItemAction(string action,object param)
	{
		int itemId = _Global.INT32(param);
		switch(action)
		{
		case Constant.Action.USE_SPEEDUP_ITEM:
			if(percentBar.GetCurstate() != PercentBar.PercentBarState.STOP || isCloseAfterAnimationFinish)
			{
				return;
			}
			PBMsgReqAVA.PBMsgReqAVA.SpeedUp reqSpeedUpData = new PBMsgReqAVA.PBMsgReqAVA.SpeedUp();
			reqSpeedUpData.id = m_data.id;
			reqSpeedUpData.type = m_data.type;
			reqSpeedUpData.itemId = itemId;
			reqSpeedUpData.itemCount = 1;
			GameMain.Ava.SpeedUp.RequestSpeedUp(reqSpeedUpData);
			break;
		}
	}

	private void UpdateItems()
	{
		scroll_ItemList.SetData (MyItems.singleton.GetAvaSpeedItemList());
//		scroll_ItemList.ResetPos ();
		if(getLeftTime() > 0)
		{
			timeTxtLabel.txt = getLeftTimeStr ();
			percentBar.updateWithAnimation(getCurProgress());
		}
		else
		{
			isCloseAfterAnimationFinish = true;
			percentBar.updateWithCompleteAnimation();
		}

	}

	private int getCurProgress()
	{
		return m_data.origTotalTime - getLeftTime();
	}

	private int getLeftTime()
	{
		int leftTime = m_data.endTime - (int)GameMain.unixtime ();
		if(leftTime < 0)
		{
			leftTime = 0;
		}
		return leftTime;
	}

	private string getLeftTimeStr()
	{
		return (m_data.endTime - GameMain.unixtime()) > 0 
			? _Global.timeFormatStr (m_data.endTime - GameMain.unixtime()) :  _Global.timeFormatStr(0);
	}

}
