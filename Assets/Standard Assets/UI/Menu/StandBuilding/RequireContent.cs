using UnityEngine;

using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;

public class TechnologyRequireContent : UIObject
{
	public Label l_bg;
	public Label l_line1;
	public Label l_line2;

	public Label l_needTitle;
	public Label l_needNum;
	public Label l_have;

	public RequireItem requireItem;
	public ScrollList scroll;
	public bool req_ok;

	public SimpleLabel sbg_1;
	public SimpleLabel sbg_2;
	//public RequireItem[] requireArray;
//	public void Awake()
//	{
//		base.Awake();
//		Init();
//	}
	private  int MAX_SHOW = 5;
	protected int sn = 0;

	public override void Init()
	{
		base.Init();

		requireItem.Init();

//		l_bg.SetVisible(true);
//		l_bg.setBackground("square_black", TextureType.DECORATION);

		sbg_1.rect.width = this.rect.width - sbg_1.rect.x * 2;
//		sbg_2.rect.width = this.rect.width - sbg_2.rect.x * 2;
		scroll.rowPerPage = 1 + MAX_SHOW;
		scroll.Init(requireItem);
		l_needTitle.txt = Datas.getArString("Common.Type");
		l_needNum.txt = Datas.getArString("Common.Required");
		l_have.txt = Datas.getArString("Common.youOwn");
	}

	public void setMaxShowNum(int maxNum)
	{
		MAX_SHOW = maxNum;
	}

	public void setFrameVisible(bool enable)
	{
		l_bg.SetVisible(enable);
	}

	public override int Draw()
	{
		//
		if(!visible)
			return -1;

		GUI.BeginGroup(rect);
		//background .
		sbg_1.Draw();
//		sbg_2.Draw();
		l_bg.Draw();

		if (l_line1 != null && l_line2 != null) 
		{
			l_line1.Draw ();
			l_line2.Draw ();
		}

		l_needTitle.Draw();
		l_needNum.Draw();
		l_have.Draw();
		scroll.Draw();



		GUI.EndGroup();

		return -1;
	}

	public  void showRequire(Requirement[] requirements)
	{
		showRequire(requirements,false);
	}

	public  void showRequire(Requirement[] requirements,bool autoSize)
	{
		RequireItem item ;
		Requirement idata;
		int i;
		//ScrollList scroll = requirecon.getChildByID("sl_require") as ScrollList;
//		scroll.Clear();

		if(null == requirements)
			return;
		sn = requirements.Length;
		req_ok = true;
		for (i=0; i< sn; i++)
		{
			idata = requirements[i] as Requirement;
			requireItem.SetIndexInList(i + 1);
			if(idata.ok != true/*  && idata.ok != "true"*/)
			{
				req_ok = false;
				break;
			}
//			item = Instantiate(requireItem);
//			item.UpdateData(idata);
//			scroll.AddItem(item);
		}
//		scroll.rect.height = n * requireItem.rect.height;
		//resetPos(autoSize);
		scroll.Clear();
		scroll.SetData(requirements);
		scroll.ResetPos();


		//scroll.Refresh();
	}
	public void ForceUpdate(bool force)
	{
		if(force)
			scroll.Update();
	}
	public override void Update()
	{
		base.Update();

		if(sn > MAX_SHOW -1 )
			scroll.Update();
	}

	private void resetPos(bool autoSize)
	{
		int n = sn;
		if(sn > MAX_SHOW && !autoSize)
			n = MAX_SHOW;

		if(n > MAX_SHOW)
		{
			this.rect.height = scroll.rect.y + MAX_SHOW * requireItem.rect.height + 15 - requireItem.rect.height * 0.5f + 10;
			scroll.rect.height = MAX_SHOW * requireItem.rect.height  - requireItem.rect.height * 0.5f + 15;

			scroll.rowPerPage = MAX_SHOW;
		}
		else
		{
			this.rect.height = scroll.rect.y + n * requireItem.rect.height + 15;
			scroll.rect.height = n * requireItem.rect.height;

			scroll.rowPerPage = n;
		}

//		l_bg.rect.width = this.rect.width;
//		l_bg.rect.height = this.rect.height;

		sbg_1.rect.height = this.rect.height - 5;
	}


	public void Clear()
	{
		scroll.Clear();
	}

}
