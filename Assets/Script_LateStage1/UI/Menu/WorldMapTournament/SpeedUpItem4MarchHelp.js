
class	SpeedUpItem4MarchHelp	extends	ListItem{

	public var l_Line:Label;
	public var cntLabel:Label;
	public var sale:Label;
	public var itemIcon:Label;
	
	private	var	contentData:Hashtable;
	private var itemCount:int;
	private var itemID:int;
	
	private var canGiveHelp : System.Action.<HashObject>;
	private var cannotGiveHelp : System.Action.<HashObject>;
		
	function Init()
	{
		btnSelect.OnClick = handleClick;
	}
	
	public	function	Draw()
	{
		GUI.BeginGroup(rect);
		itemIcon.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		cntLabel.Draw();
		l_Line.Draw();
		
		
		sale.Draw();
		GUI.EndGroup();
	}
	
	function Update()
	{
	}
	
	public function SetRowData(data:Object){
		
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		contentData = data as Hashtable;
		
		itemCount = _Global.INT32( contentData["count"] );
		btnSelect.visible = itemCount != 0;
		cntLabel.txt = Datas.getArString("Common.Own") + ": " + itemCount;
		
		itemID = _Global.INT32( contentData["itemId"] );
		var itemName : String = "i" + contentData["itemId"];
		itemIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(itemName);
		itemIcon.useTile = true;
			
			
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = contentData["itemName"];
		description.txt = contentData["itemDesc"];
		
		canGiveHelp = contentData["canGiveHelp"] as System.Action.<HashObject>;
		cannotGiveHelp = contentData["cannotGiveHelp"] as System.Action.<HashObject>;
	}


	private function handleClick(param:Object):void
	{
		KBN.TournamentManager.getInstance().requestAllianceHelpItemUsing( itemID, canGiveHelp, cannotGiveHelp );
	}
}
