
class	BookmarkItem extends	ListItem{
	public	var	toggle:ToggleButton;
	public  var bgButton:Button;
	public 	var divideline:Label;
	public	var btnEdit:Button;
	public	var btnFavorite:Button;
	public	var btnFriendly:Button;
	public	var btnHostile:Button;
	public	var lblAttachInfo:Label;
	public 	var l_Flag:Label;
	public 	var l_remarkFlag1:Label;
	public 	var l_remarkFlag2:Label;
	public 	var l_remarkFlag3:Label;
	public	var inputTextTitle:InputText;
	
	public	static	var	editMode:boolean;
	public  static  var marchMode:boolean = false;
	
	public static var Menutype:BookMarkMenuType = BookMarkMenuType.All;
	
	private	var	posMax:int;
	private	var	itemData:Bookmark.BookmarkItemInfo;
	
	private var isFavorite:boolean = false;
	private var isFriendly:boolean = false;
	private var isHostile:boolean = false;
	
	private var m_data:Bookmark.BookmarkItemInfo;
	
	private var canEdit:boolean = false;
	
	public	static	function	reset(){
		editMode = false;
		marchMode = false;
	}
	
	public	function	Awake(){
		super.Awake();
		
		posMax = toggle.rect.x;

	}
	
	public function Init()
	{
		btnFavorite.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_xingdi2",TextureType.BUTTON);
		btnFriendly.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_Peace2",TextureType.BUTTON);
		btnHostile.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_Hostility2",TextureType.BUTTON);
	}
	
	public	function	SetRowData(data:Object){
		m_data = data as Bookmark.BookmarkItemInfo;
		inputTextTitle.hidInput = false;
		inputTextTitle.inputDoneFunc = inputDoneFunc;
		itemData = m_data;
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.SetNormalTxtColor(FontColor.Description_Light);
//		title.txt = m_data.name + " " + "(" +  "<color=#00A0E9ff>" + m_data.x + "," + m_data.y + "</color>"+ ")";
		title.txt = m_data.name + " " + "(" + m_data.x + "," + m_data.y + ")";
		inputTextTitle.txt = m_data.name;
//		description.txt = "(" +  "<color=red>" + m_data.x + "," + m_data.y + "</color>"+ ")";
		canEdit = m_data.permitDel;
		toggle.SetVisible(m_data.permitDel);
		toggle.selected =  m_data.selectedFlag;
		toggle.valueChangedFunc = function( v:boolean ){
			itemData.selectedFlag = v;
		};
		
		bgButton.clickParam = data;
		bgButton.OnClick = onItemClick;
		
		btnFavorite.visible = canEdit; 
		btnFriendly.visible = canEdit;
		btnHostile.visible = canEdit;
		
		if(m_data.attachInfo && m_data.attachInfo != "")
		{
			lblAttachInfo.visible = true;
			lblAttachInfo.txt = m_data.attachInfo;
			l_Flag.setBackground("icon_map_view_flag_yellow_0",TextureType.ICON_ELSE);
		}
		else
		{
			lblAttachInfo.visible = false;
			l_Flag.setBackground("Bookmark_labeled",TextureType.DECORATION);
		}
	
		btnFavorite.OnClick = btnFavoriteClick;
		btnFriendly.OnClick = btnFriendlyClick;
		btnHostile.OnClick = btnHostileClick;
		
		var targetPos:int = editMode ? posMax : -toggle.rect.width;
		if( toggle.rect.x != targetPos ){ 
			var dis:int = targetPos - toggle.rect.x;
			
			toggle.rect.x += dis;
			title.rect.x += dis;
			inputTextTitle.rect.x = title.rect.x;
			description.rect.x += dis;
			lblAttachInfo.rect.x += dis;
		}
		btnEdit.OnClick = btnEditClick;
		inputTextTitle.visible = false;
		title.visible = true;
		isFavorite = m_data.isFavorite;
		isHostile = m_data.isHostile;
		isFriendly = m_data.isFriendly;
		
		setButtonsOfTagDisplaySetting();
	}
	
	public	function	Update(){
		
		var	dis:int = Constant.LISTITEM_MOVE_SPEED;
		var posMin:int = -toggle.rect.width;
//		var posMin:int = 0;
		
		if( editMode ){
			if( toggle.rect.x < posMax ){
				
				toggle.rect.x += dis;
				if( toggle.rect.x > posMax ){
					dis -= toggle.rect.x - posMax;
					toggle.rect.x = posMax;
					
				}
				
				title.rect.x += (dis -2);
				description.rect.x += (dis-2);
				inputTextTitle.rect.x = title.rect.x;
				lblAttachInfo.rect.x += (dis-2);
			}
			if(canEdit)
			{
				btnEdit.visible = true;
			}
			inputTextTitle.visible = m_data.editing;
			title.visible = !inputTextTitle.visible;
			
			btnFavorite.SetVisible(canEdit); 
			btnFriendly.SetVisible(canEdit);
			btnHostile.SetVisible(canEdit);
			l_Flag.SetVisible(false);

			l_remarkFlag1.SetVisible(false);
			l_remarkFlag2.SetVisible(false);
			l_remarkFlag3.SetVisible(false);
			
		}else{
			if( toggle.rect.x > posMin ){
			
				toggle.rect.x -= dis;
				if( toggle.rect.x < posMin ){
					dis -= posMin - toggle.rect.x;
					toggle.rect.x = posMin;
				}
				
				title.rect.x -= (dis -2);
				inputTextTitle.rect.x -= (dis -2);
				description.rect.x = title.rect.x;
				lblAttachInfo.rect.x -= (dis -2);
				inputTextTitle.visible = false;
				title.visible = true;
			}
			btnEdit.visible = false;
//			if(canEdit)
//			{
//				btnFavorite.visible = true; 
//				btnFriendly.visible = true;
//				btnHostile.visible = true;
//			}
			btnFavorite.SetVisible(false); 
			btnFriendly.SetVisible(false);
			btnHostile.SetVisible(false);
			l_Flag.SetVisible(true);
			setRemarkFlags();
			setButtonsOfTagDisplaySetting();
		}
	}
	
	private function btnEditClick()
	{
		inputTextTitle.openKeyboard(true);
		if(handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.BOOKMARK_EDIT_ITEM,m_data);
	}
	
	protected function inputDoneFunc(newStr:String):String
	{
		
		if(newStr.Contains(",") || newStr.Contains("'") || newStr.Contains("\""))
		{	
			title.txt = m_data.name + " " + "(" +  "<color=#e4154bff>" + m_data.x + "," + m_data.y + "</color>"+ ")";
			inputTextTitle.txt = m_data.name;
			ErrorMgr.instance().PushError("",Datas.getArString("bookmark.BookmarkName1"));
			return m_data.name;
		}
		else if(newStr.Length > 20)
		{
			title.txt = m_data.name;
			inputTextTitle.txt = m_data.name;
			ErrorMgr.instance().PushError("",Datas.getArString("bookmark.BookmarkName2"));
			return m_data.name;
		}
		else if(m_data.name != newStr)
		{
			m_data.ChangeName(newStr);
			title.txt = newStr;
			inputTextTitle.txt = newStr;
			return newStr;
		}
		else
		{
			return newStr;
		}
	}
	
	
	private function btnFavoriteClick()
	{
		isFavorite = !isFavorite;
		setButtonsOfTagDisplaySetting();
		setBookMarkTags();
	}
	
	private function btnFriendlyClick()
	{
		isFriendly = !isFriendly;
		setButtonsOfTagDisplaySetting();
		setBookMarkTags();
	}
	private function btnHostileClick()
	{
		isHostile = !isHostile;
		setButtonsOfTagDisplaySetting();
		setBookMarkTags();
	}
	
	private function setButtonsOfTagDisplaySetting()
	{
		btnFavorite.mystyle.normal.background = isFavorite? TextureMgr.instance().LoadTexture("Type_xingdi2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_xingdi",TextureType.BUTTON);
		btnFriendly.mystyle.normal.background = isFriendly? TextureMgr.instance().LoadTexture("Type_Peace2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_Peace",TextureType.BUTTON);
		btnHostile.mystyle.normal.background =isHostile? TextureMgr.instance().LoadTexture("Type_Hostility2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_Hostility",TextureType.BUTTON);
	}
	
	public function Draw(){
	
		var posMin:int = -toggle.rect.width;
		var alpha:float = (toggle.rect.x - posMin)/(posMax - posMin);
		
		GUI.BeginGroup(rect);
			bgButton.Draw();
			var oldColor:Color = GUI.color;
			GUI.color.a = alpha;
			toggle.Draw();
			GUI.color = oldColor;
			
			title.Draw();
			inputTextTitle.Draw();
			description.Draw();
//			lblAttachInfo.Draw();
			divideline.Draw();
			
			btnEdit.Draw();
			l_Flag.Draw();
			btnFavorite.Draw();
			btnFriendly.Draw();
			btnHostile.Draw();
			l_remarkFlag1.Draw();
			l_remarkFlag2.Draw();
			l_remarkFlag3.Draw();
		GUI.EndGroup();
	}
	
	private	function	onItemClick(param:Object){
		if(m_data.editing)
		{
			return;
		}
		
		var data:Bookmark.BookmarkItemInfo = param as Bookmark.BookmarkItemInfo;
		if(marchMode)
		{
			marchMode = false;
			var marchMenu:MarchTypeCon = MenuMgr.getInstance().getMenu("MarchTypeCon") as MarchTypeCon;
			if( marchMenu ){
				marchMenu.setXY(data.x,data.y);
			}
		}
		else
		{		
			GameMain.instance().searchWorldMap(_Global.INT32(data.x), _Global.INT32(data.y));
		}
		
		var okCallBack:Function = function(changed:boolean){
			MenuMgr.getInstance().PopMenu("");
			if(changed)
			{
				MenuMgr.getInstance().PushMessage(Datas.getArString("bookmark.BookmarkSaved"));
			}
		};
		var errorFunc:Function = function(errorMsg:String, errorCode:String){
			ErrorMgr.instance().PushError("",UnityNet.localError(errorCode, errorMsg, null));
			MenuMgr.getInstance().PopMenu("");
		};
		
		Bookmark.instance().setLocationsChanged(okCallBack,errorFunc);
	}
	
	private function setBookMarkTags()
	{
		m_data.ChangeFavorite(isFavorite);
		m_data.ChangeFriendly(isFriendly);
		m_data.ChangeHostile(isHostile);
	}
	
	private function setRemarkFlags()
	{
		l_remarkFlag1.SetVisible(false);
		l_remarkFlag2.SetVisible(false);
		l_remarkFlag3.SetVisible(false);
		var arrData:Array = new Array();
		var arrLabel:Array = new Array();
		arrLabel.Push(l_remarkFlag1);
		arrLabel.Push(l_remarkFlag2);
		arrLabel.Push(l_remarkFlag3);
		if(isFriendly) 
		{
			var objFriendly:HashObject = new HashObject({"priority":1,"icon":"Type_Peace2"});
			arrData.Push(objFriendly);
		}
		if(isHostile)
		{
			var objHostile:HashObject = new HashObject({"priority":2,"icon":"Type_Hostility2"});
			arrData.Push(objHostile);
		}
		if(isFavorite)
		{
			var objFavorite:HashObject = new HashObject({"priority":3,"icon":"Type_xingdi2"});
			arrData.Push(objFavorite);
		}
		for(var i:int=0;i<arrData.length;i++)
		{
			if(i<arrLabel.length)
			{
				var data:HashObject = arrData[i] as HashObject;
				var l_remark:Label = arrLabel[i] as Label;
				if( data != null && l_remark != null)
				{
					l_remark.setBackground(_Global.GetString(data["icon"]),TextureType.BUTTON);
					l_remark.SetVisible(true);
				}
			}
		}
	}
}