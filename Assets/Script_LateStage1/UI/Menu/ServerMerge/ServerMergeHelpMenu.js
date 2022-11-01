import System.Collections.Generic;
class ServerMergeHelpMenu extends PopMenu
{
	public var l_Title:Label; 
	public var l_Line:Label;
	
	public var toolBar:ToolBar;

	public var l_Description:Label;
	public var scroll_View:ScrollView;
	public var item:ListItem;
	
	public var titleBg:Label;
	public var frameLabel:SimpleLabel;
	private var backGroundRect:Rect;
	
	private var m_DataList:List.<KBN.MergerServerUnit> = null;
	
	public function Init()
	{
		super.Init();
		l_Line.setBackground("between line",TextureType.DECORATION);
		
		scroll_View.Init();
		toolBar.toolbarStrings = [Datas.getArString("Common.Description"),Datas.getArString("MergeServer.Detail_Info_Title")];
		toolBar.indexChangedFunc = TabChanged;
		toolBar.selectedIndex = 0;
		l_Description.SetVisible(true);
		scroll_View.SetVisible(false);
		l_Title.txt = Datas.getArString("MergeServer.Title");
		l_Description.txt = Datas.getArString("MergeServer.Detail_Desc_text");
		
		btnClose.OnClick = OnClose;
		
		var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		
		bgStartY = 31;
		
		backGroundRect = Rect( 5, 5, rect.width, rect.height - 10);
		
		frameLabel.Sys_Constructor();
		frameLabel.mystyle.border = new RectOffset(68, 68, 68, 68);
		frameLabel.useTile = true;
		var iconSpt : TileSprite = texMgr.IconSpt();
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");
		frameLabel.rect = frameSimpleLabel.rect;
		frameLabel.rect.y = frameLabel.rect.y + bgStartY;
		frameLabel.rect.height = frameLabel.rect.height - bgStartY;
		
		frameSimpleLabel.useTile = false;
		btnClose.rect.y = 25;
		btnClose.rect.x = 458;
	}
	
	public function OnPush(param:Object):void
	{
		m_DataList = KBN.MergeServerManager.getInstance().AllMergerServerList;
		if(m_DataList == null) return;
		
	
		
		var itemClone:AllMergeServerListItem = null;
		for(var i:int = 0;i<m_DataList.Count;i++)
		{
			itemClone = Instantiate(item);
			itemClone.Init();
			itemClone.SetRowData(m_DataList[i]);
			scroll_View.addUIObject(itemClone);
		}
		scroll_View.AutoLayout();
		scroll_View.MoveToTop();
	}
	
	public function Update()
	{
		scroll_View.Update();
	}
	
 	public function Draw()
 	{
		super.Draw();	
 	}
	
	public function DrawItem()
	{		
		frameLabel.Draw();
		titleBg.Draw();

		l_Title.Draw();
		l_Line.Draw();
		l_Description.Draw();
		btnClose.Draw();
		toolBar.Draw();
		scroll_View.Draw();
	}
	
	function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backGroundRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}

	
	private function TabChanged(index:int)
	{
		l_Description.SetVisible(false);
		scroll_View.SetVisible(false);
		switch (index)
		{
			case 0:
				l_Description.SetVisible(true);
			break;
			case 1:
				scroll_View.SetVisible(true);
			break;
		}
	}
	
	private function OnClose()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
}