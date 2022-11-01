class ChangePageObj extends UIObject
{
	public var btnNext:Button;
	public var btnPre:Button;
	public var btnLast:Button;
	public var btnFirst:Button;

//	public var curPage:Label;
//	public var totalPage:Label;	
	public var labelOF:Label;
	public var pageBg:Label;
	
	private var g_curPage:int;
	private var g_totalPage:int;
	private var g_type:int;
	
	private var g_setListFunc:Function;
		
	public function Init()
	{
		
		btnNext.Init();
		btnPre.Init();
		btnLast.Init();
		btnFirst.Init();
		
		btnNext.OnClick = handleBtnNext;
		btnPre.OnClick = handleBtnPre;
		btnLast.OnClick = handleBtnLast;
		btnFirst.OnClick = handleBtnFirst;
		
		pageBg.Init();
//		curPage.Init();		
//		totalPage.Init();				
		labelOF.Init();	
		
		
		g_curPage = 1;
		g_totalPage = 1;														
	}
	
	public function setFunction(_setListFunc:Function)
	{
		g_setListFunc = _setListFunc;
	}

	private function handleBtnNext()
	{
		if(g_curPage < g_totalPage)
		{
			g_curPage++;
		}
		else
		{
			return -1;
		}		
		g_setListFunc(g_curPage, g_totalPage);
	}
	
	public function GoToNextPage()
	{
		if(g_curPage < g_totalPage)
		{
			g_curPage++;
		}
		else
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("Mail.Content_text1"));
			return -1;
		}		
		g_setListFunc(g_curPage, g_totalPage);
	}
	
	private function handleBtnPre()
	{
		if(g_curPage > 1)
		{
			g_curPage--;		
		}
		else
		{
			return -1;
		}	
		g_setListFunc(g_curPage, g_totalPage);	
	}
	
	private function handleBtnLast()
	{
		if(g_curPage != g_totalPage)
		{
			g_curPage = g_totalPage;
		}
		else
		{
			return -1;
		}	
		g_setListFunc(g_curPage, g_totalPage);
	}
	
	private function handleBtnFirst()
	{
		if(g_curPage != 1)
		{
			g_curPage = 1;	
		}
		else
		{
			return -1;
		}
		g_setListFunc(g_curPage, g_totalPage);
	}
	
	public function setData(_curPage:int, _totalPage:int)
	{
		g_curPage = _curPage;
		g_totalPage = _totalPage;
	}	
				
	function Draw()
	{
		
//		if(g_totalPage != 1)
//		{	
			GUI.BeginGroup(rect);
			btnNext.Draw();
			btnPre.Draw();
			btnLast.Draw();
			btnFirst.Draw();
			
			if(g_curPage == g_totalPage)
			{
				btnNext.SetDisabled(true);
				btnLast.SetDisabled(true);
			}
			else if(g_curPage < g_totalPage)
			{
				btnNext.SetDisabled(false);
				btnLast.SetDisabled(false);			
			}
			
			if(g_curPage == 1)
			{
				btnPre.SetDisabled(true);
				btnFirst.SetDisabled(true);
			}
			else
			{
				btnPre.SetDisabled(false);
				btnFirst.SetDisabled(false);			
			}				
			
			pageBg.Draw();				
//			curPage.Draw();		
//			totalPage.Draw();				
			labelOF.Draw();	
			GUI.EndGroup();
			
			labelOF.txt = Datas.getArString("Common.PagesOf2",[g_curPage, g_totalPage]);
			
//			curPage.txt = g_curPage + "";
//			totalPage.txt = g_totalPage + "";		
//		}
	}
}