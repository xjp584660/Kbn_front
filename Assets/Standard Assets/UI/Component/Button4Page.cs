using UnityEngine;
using System.Collections;

public class Button4Page : UIObject
{
	public enum DELIMITER_TYPE
	{
		OF,
		BACKSLASH
	};
	public DELIMITER_TYPE delimiterType = DELIMITER_TYPE.OF;
	protected const string L1 = "L1";
	protected const string L2 = "L2";
	protected const string R1 = "R1";
	protected const string R2 = "R2";
	
	public Button btn_l1;
	public Button btn_l2;
	public Button btn_r1;
	public Button btn_r2;	
	public Label l_label;
	
	//start from 1.
	protected int curPage = 0;
	protected int totalPage;
	
	public int step1 = 1;
	public int step2 = 10;
	
	public System.MulticastDelegate pageChangedHandler;
	
	public override void Init()
	{
		btn_l1.OnClick = new System.Action<System.Object>(buttonHandler);
		btn_l2.OnClick = new System.Action<System.Object>(buttonHandler);
		btn_r1.OnClick = new System.Action<System.Object>(buttonHandler);
		btn_r2.OnClick = new System.Action<System.Object>(buttonHandler);
		btn_l1.clickParam = L1;
		btn_l2.clickParam = L2;
		btn_r1.clickParam = R1;
		btn_r2.clickParam = R2;
		setPages(1,1);
		if(l_label != null)
		{
			l_label.SetFont(FontSize.Font_20);
			l_label.SetNormalTxtColor(FontColor.Button_White);
		}
	}
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		btn_l1.Draw();
		btn_l2.Draw();
		btn_r1.Draw();
		btn_r2.Draw();
		if(l_label != null)
			l_label.Draw();
		GUI.EndGroup();

		return -1;
	}
	
	public virtual void setPages(int curPage,int totalPage)
	{
		this.curPage = curPage;
		this.totalPage = totalPage;
		if(l_label != null)
		{
			if(delimiterType == DELIMITER_TYPE.OF)
				l_label.txt = KBN.Datas.GetFormattedString("Common.PagesOf", new object[] {curPage, totalPage});
			else if(delimiterType == DELIMITER_TYPE.BACKSLASH)
				l_label.txt = curPage+"/"+totalPage;
		}
	}
	
	public int getCurPage()
	{
		return this.curPage;
	}

	public int getTotalPage()
	{
		return this.totalPage;
	}
	
	public void setAllButtonVisible(bool bVisible)
	{
		btn_l1.SetVisible(bVisible);
		btn_l2.SetVisible(bVisible);
		btn_r1.SetVisible(bVisible);
		btn_r2.SetVisible(bVisible);
		//l_label.SetVisible(bVisible);
	}
	
	protected void buttonHandler(System.Object clickParam)
	{
		int lastPage = curPage;
		switch(System.Convert.ToString(clickParam))
		{
		case L1:
			curPage -= step1;
			break;
		case L2:
			curPage = 1;	//-= step2;
			break;
		case R1:
			curPage += step1;
			break;
		case R2:
			curPage = totalPage;	//+= step2;
			break;
		}
		curPage = curPage >=totalPage ? totalPage : curPage;
		curPage = curPage >=1 ? curPage : 1;
		
		
		if(pageChangedHandler!= null && lastPage != curPage)
			pageChangedHandler.DynamicInvoke(curPage);
		
		this.setPages(curPage,totalPage);
	}
}
