using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using KBN;
public class AddMarchSizePopup : PopMenu,IEventHandler
{
	[SerializeField]
	protected MarchSizeBuffItem buffTemplate;
	protected MarchSizeBuffItem b_buff1;
	protected MarchSizeBuffItem b_buff2; 
	protected MarchSizeBuffItem b_buff3;
	[SerializeField]
	protected ScrollView scrollView;
	public SimpleLabel line;

	private List<AddMarchSizeData.MarchBuffItemData> buffList = null;

	public override void Init ()
	{
		base.Init ();
		line.setBackground("between line",TextureType.DECORATION);
		scrollView.Init();
		b_buff1 = null;
		b_buff2 = null;
		b_buff3 = null;
		title.txt = Datas.getArString ("MachSizePopup.Tiitle");

	}

	public override void Update()
	{
		scrollView.Update ();
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);
		buffList = param as List<AddMarchSizeData.MarchBuffItemData>;
		InitBuffItem ();

	}
	
	public override void OnPopOver()
	{
		b_buff1 = null;
		b_buff2 = null;
		b_buff3 = null;
		TryDestroy (b_buff1);
		TryDestroy (b_buff2);
		TryDestroy (b_buff3);
		scrollView.clearUIObject();
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();
		title.Draw ();
		line.Draw ();

		scrollView.Draw ();
	}

	private void InitBuffItem()
	{
		if (buffList == null || buffList.Count < 3)
			return;
		if (null == b_buff1)
		{
			b_buff1 = Instantiate(buffTemplate) as MarchSizeBuffItem;
			b_buff1.Init();
			b_buff1.SetData(buffList[0]);
			b_buff1.handlerDelegate = this;
			scrollView.addUIObject(b_buff1);
		}
		if (null == b_buff2)
		{
			b_buff2 = Instantiate(buffTemplate) as MarchSizeBuffItem;
			b_buff2.Init();
			b_buff2.SetData(buffList[1]);
			b_buff2.handlerDelegate = this;
			scrollView.addUIObject(b_buff2);
		}
		if (null == b_buff3)
		{
			b_buff3 = Instantiate(buffTemplate) as MarchSizeBuffItem;
			b_buff3.Init();
			b_buff3.SetData(buffList[2]);
			b_buff3.handlerDelegate = this;
			scrollView.addUIObject(b_buff3);
		}
		scrollView.AutoLayout();
		scrollView.MoveToTop();
	}

	public void handleItemAction(string action, object param)
	{
		switch(action)
		{
		case Constant.Action.SELECTMARCHSIZEBUFF:
			MenuMgr.instance.PopMenu("AddMarchSizePopup");
			sendNotification(Constant.Notice.OnMarchSizeBuffSeleted,param as String);
			break;
		}
	}

}
