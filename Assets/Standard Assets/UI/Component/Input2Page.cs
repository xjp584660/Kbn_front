using UnityEngine;
using System.Collections;

public class Input2Page : Button4Page
{
	public InputText it_page;
	public Button b_go;

	public override void Init()
	{
		base.Init();
		
		it_page.type = TouchScreenKeyboardType.NumberPad;
		it_page.hidInput = false;
		it_page.filterInputFunc = filterInputFunc;
		it_page.inputDoneFunc = inputDoneFunc;
		b_go.OnClick = new System.Action<System.Object>(onGoClick);
		//		b_go.txt = Datas.getArString("Common.GO");
	}
	
	public void reSet()
	{
		//		maxPage = 1;
		it_page.txt = "";
	}
	
	public override void setPages(int curPage, int totalPage)
	{
		base.setPages(curPage,totalPage);
		it_page.txt = "" + curPage;
	}
	
	protected void onGoClick(System.Object clickParam)
	{
		int lastPage = curPage;
		curPage = KBN._Global.INT32(it_page.txt);
		
		if(pageChangedHandler!= null && lastPage != curPage)
			pageChangedHandler.DynamicInvoke(curPage);
		
		this.setPages(curPage,totalPage);
		
	}
	
	protected string filterInputFunc(string oldStr, string newStr)
	{		
		newStr = KBN._Global.FilterStringToNumberStr(newStr);		
		long n = KBN._Global.INT64(newStr);
		if(newStr == "")
			return "";
		
		return inputDoneFunc(newStr);
	}
	
	public void setShowPage(int value)
	{
		it_page.txt = value.ToString();
	}
	
	protected string inputDoneFunc(string newStr)
	{
		long n = KBN._Global.INT64(newStr);
		n = n < 1 ? 1:n;
		n = n > totalPage ? totalPage : n;
		return n.ToString();
	}
	
	public override int Draw()
	{
		if(!visible)return -1;
		GUI.BeginGroup(rect);
		btn_l1.Draw();
		btn_l2.Draw();
		btn_r1.Draw();
		btn_r2.Draw();
		it_page.Draw();
		b_go.Draw();
		
		GUI.EndGroup();

		return -1;
	}
	
	public void setAllComponentVisible(bool bVisible)
	{
		it_page.SetVisible(bVisible);
		b_go.SetVisible(bVisible);
		setAllButtonVisible(bVisible);
	}
}
