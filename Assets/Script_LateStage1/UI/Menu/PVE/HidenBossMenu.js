class HidenBossMenu extends PopMenu
{
//	@SerializeField private var titleIcon:Label;
//	@SerializeField private var titleIcon2:Label;
	@SerializeField private var line:Label;
	
	@SerializeField private var topDesc1:Label;
	@SerializeField private var topDesc2:Label;
	@SerializeField private var topDesc3:Label;
	
	
	@SerializeField private var bossList:ScrollList;
	@SerializeField private var bossItem:ListItem;
	
	@SerializeField private var yOffset:int;
	
	@SerializeField private var topBackFram :SimpleLabel;
	@SerializeField private var star :SimpleLabel;
	
	private var frameRect:Rect;
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	private var listData:System.Collections.ArrayList;	
	public function Init()
	{
		super.Init();
		//yOffset = 165;
		
		btnClose.Init();
		btnClose.OnClick = handleBack;
		title.Init();
		
//		titleIcon.Init();
//		titleIcon2.Init();
		line.Init();
		topDesc1.Init();
		topDesc2.Init();
		topDesc3.Init();
		
		bossItem.Init();
		bossList.Init(bossItem);
		
		line.setBackground("Brown_Gradients",TextureType.DECORATION);
//		titleIcon.setBackground("hideboss-title-bg",TextureType.DECORATION);
//		titleIcon2.setBackground("level_up_bg",TextureType.DECORATION);
		
//		bgStartY = yOffset;
//	
//		btnClose.rect.y = yOffset;
//		frameSimpleLabel.rect.y = yOffset;
//		frameSimpleLabel.rect.height = rect.height -3 -yOffset;
		
//		frameRect = Rect( 5, 5, rect.width - 15, rect.height - 15);
//		repeatTimes = (rect.height - 15 - yOffset) / UI_BG_WOOD_WEN_HEIGHT;
		
		title.txt = Datas.getArString("Campaign.HiddenBoss_Title");//"Hiden Boss";
		topDesc1.txt = Datas.getArString("Campaign.HiddenBoss_Text");//"Hiden Bosses will appear in camlot randomly.";
		topDesc2.txt = Datas.getArString("Campaign.HiddenBoss_SubTitle");//"current stars";
		topDesc3.txt = "";
		
		if(topBackFram.mystyle.normal.background == null)
		{
			topBackFram.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang",TextureType.DECORATION);
		}
		
		if(star.mystyle.normal.background == null)
		{
			star.mystyle.normal.background = TextureMgr.instance().LoadTexture("BIGstar",TextureType.ICON);
		}
		
	}
//	protected function prot_drawFrameLine()
//	{
//		if(frameTop != null && marginT != null)
//		{
//			Graphics.DrawTexture(Rect(frameTop.rect.x -10, frameTop.rect.y + yOffset, 23, 20 * repeatTimes), marginT, marginM);
//			Graphics.DrawTexture(Rect(frameTop.rect.x + frameTop.rect.width - 13, frameTop.rect.y + yOffset, 23, 20 * repeatTimes), marginT, marginM);
//		}
//	}

	public function DrawItem()
	{
		topBackFram.Draw();
		line.Draw();
		topDesc1.Draw();
		topDesc2.Draw();
		topDesc3.Draw();
		star.Draw();
		
		bossList.Draw();
		
		title.Draw();
	}
	
//	public function DrawLastItem()
//	{
//		titleIcon.Draw();
//		titleIcon2.Draw();
//		title.Draw();
//	}
	
	function OnPush(param:Object)
	{
		//var listData:System.Collections.ArrayList = getTestDate();
		listData = KBN.PveController.instance().GetHidenBossInfo() as System.Collections.ArrayList;
		if(listData==null)return;
		
		bossList.Clear();
		bossList.SetData(listData.ToArray());
		bossList.UpdateData();
		bossList.ResetPos();
		
		var totalData:KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo() as KBN.PveTotalData;
		topDesc3.txt = "x"+totalData.totalStar;
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
        bossList.Clear();
    }
	
	public function Update()
	{
		bossList.Update();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("HidenBossMenu");
		
		//MenuMgr.getInstance().PushMenu("HidenBossDescMenu", null, "trans_zoomComp");
	}
	
//	function DrawBackground()
//	{
//		if(Event.current.type != EventType.Repaint)
//			return;
//
//		GUI.BeginGroup(frameRect);
//			DrawMiddleBg(frameRect.width-13, 10);
//			Graphics.DrawTexture(Rect(0, yOffset, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(rect.width - 9 - 23, yOffset, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
//			
//		GUI.EndGroup();
//		
//	}
	
	function getTestDate():System.Collections.ArrayList
	{	
		var testDate1:Hashtable  = {
			"ID":1,
			"IsUnLock":true,
			"CurNum":45
		};	
		var testDate2:Hashtable  = {
			"ID":2,
			"IsUnLock":true,
			"CurNum":45
		};
		var testDate3:Hashtable  = {
			"ID":2,
			"IsUnLock":true,
			"CurNum":45
		};
		var testDate4:Hashtable  = {
			"ID":2,
			"IsUnLock":true,
			"CurNum":20
		};
		var testDate5:Hashtable  = {
			"ID":2,
			"IsUnLock":true,
			"CurNum":20
		};
		var testDate6:Hashtable  = {
			"ID":2,
			"IsUnLock":true,
			"CurNum":20
		};
		var testDate7:Hashtable  = {
			"ID":2,
			"IsUnLock":true,
			"CurNum":20
		};
		var testDate8:Hashtable  = {
			"ID":2,
			"IsUnLock":false,
			"CurNum":20
		};
		var testDate9:Hashtable  = {
			"ID":2,
			"IsUnLock":false,
			"CurNum":20
		};
		var testDate10:Hashtable  = {
			"ID":2,
			"IsUnLock":false,
			"CurNum":20
		};
		var testDate11:Hashtable  = {
			"ID":2,
			"IsUnLock":false,
			"CurNum":20
		};
		var testDate12:Hashtable  = {
			"ID":2,
			"IsUnLock":false,
			"CurNum":20
		};
		var array:System.Collections.ArrayList = new System.Collections.ArrayList();
		array.Add(testDate1);
		array.Add(testDate2);
		array.Add(testDate3);
		array.Add(testDate4);
		array.Add(testDate5);
		array.Add(testDate6);
		array.Add(testDate7);
		array.Add(testDate8);
		array.Add(testDate9);
		array.Add(testDate10);
		array.Add(testDate11);
		array.Add(testDate12);
		
		return array;
	}
}