class	BookmarkMenu extends KBNMenu implements IEventHandler{
	
	public var headBgLabel:Label;
	public var bottomBgLabel:Label;
	public var l_title:Label;
	public var btn_home:Button;
	public var btn_edit:Button;
	public var btn_del:Button;
	
	public var btnAll:Button;
	public var btnFriendly:Button;
	public var btnHostile:Button;
	public var btnFavorite:Button;
	public var lblAll:Label;
	public var lblFriendly:Label;
	public var lblHostile:Label;
	public var lblFavorite:Label;
	
	public var togbtSelectedAll:ToggleButton;
	
	public	var	scrollList:ScrollList;
	public	var	listItem:ListItem;
	public 	var lblEmpty:Label;
	
	private	var	bookmarkInfo:Array;
	
	public var menuType:BookMarkMenuType = BookMarkMenuType.All;
	private var uiBottoms:SimpleUIObj[];
	
	private var editItem:Bookmark.BookmarkItemInfo;
	
	private var curDataSource:Array;
	private var m_rotate:Rotate;
	
	public	function	Init(){
		GameMain.instance().resgisterRestartFunc(function(){
			BookmarkItem.reset();
		});	
		editItem = null;
		scrollList.Init(listItem);
		scrollList.itemDelegate = this;
		uiBottoms = [btnAll,btnFavorite,btnHostile,btnFriendly,lblAll,lblFavorite,lblHostile,lblFriendly];
//		var arStrings:Object = Datas.instance().arStrings();
		l_title.txt = Datas.getArString("Bookmark.Bookmarks");
		btn_edit.txt = Datas.getArString("Common.Edit");
		btn_del.txt = Datas.getArString("Common.Delete");
		lblEmpty.txt = Datas.getArString("Bookmark.Empty");
		btn_del.SetVisible(false);
		togbtSelectedAll.SetVisible(false);
		btn_home.OnClick = function( param:Object ){
			var okCallBack:Function = function(changed:boolean){
				MenuMgr.getInstance().PopMenu("");
				if(changed)
				{
					var message:String = Datas.getArString("bookmark.BookmarkSaved");
					MenuMgr.getInstance().PushMessage(message);
				}
			};
			var errorFunc:Function = function(errorMsg:String, errorCode:String){
				var message:String = UnityNet.localError(errorCode, errorMsg, null);
				ErrorMgr.instance().PushError("",message);
				MenuMgr.getInstance().PopMenu("");
			};
			
			Bookmark.instance().setLocationsChanged(okCallBack,errorFunc);
		};
		
		btn_edit.OnClick = function( param:Object ){
			BookmarkItem.editMode = !BookmarkItem.editMode;
			togbtSelectedAll.selected = false;
			if(editItem)
			{
				editItem.editing = false;
			}
			scrollList.ForEachItem(function(listItem:ListItem) : boolean
			{
				var bookmarkItem:BookmarkItem = listItem as BookmarkItem;
				bookmarkItem.bgButton.SetDisabled(BookmarkItem.editMode);
				return true;
			});
			if( BookmarkItem.editMode )
			{
				btn_edit.txt = Datas.getArString("Common.Done");
				btn_del.SetVisible(true);
				togbtSelectedAll.SetVisible(true);
				bottomBgLabel.SetVisible(true);
			}
			else
			{
				btn_edit.txt = Datas.getArString("Common.Edit");
				btn_del.SetVisible(false);
				togbtSelectedAll.SetVisible(false);

				scrollList.ForEachItem(function(listItem:ListItem) : boolean
				{
					var bookmarkItem:BookmarkItem = listItem as BookmarkItem;
					bookmarkItem.toggle.selected = false;
					return true;
				});
				bottomBgLabel.SetVisible(false);
			}
		};
		
		btn_del.OnClick = function( param:Object )
		{
			if( !bookmarkInfo || bookmarkInfo.length <= 0 ){
				return;
			}
			
			var	delIds:Array = new Array();
			for( var i:int = 0; i< bookmarkInfo.length; i++ ){
				var bmInfo:Bookmark.BookmarkItemInfo =  bookmarkInfo[i] as Bookmark.BookmarkItemInfo;
				if( (bmInfo as Bookmark.BookmarkItemInfo).selectedFlag ){
					delIds.Add( (bmInfo as Bookmark.BookmarkItemInfo).id );
				}
			}
			
			if( delIds.length > 0 ){
				var onFunc = function(){
					ResetDataSource();
					togbtSelectedAll.selected = false;
				};
				Bookmark.instance().deleteBookmark( delIds,onFunc);
			}
		};
		
		togbtSelectedAll.valueChangedFunc = function(val:boolean)
		{
			if(curDataSource != null && curDataSource.length >0)
			{
				for(var item:Bookmark.BookmarkItemInfo in curDataSource)
				{
					if(item.permitDel)
					{
						item.selectedFlag = val;
					}
				}
			}
			ResetDataSource();
		};
		
		headBgLabel.useTile = false;
		headBgLabel.setBackground("small_bar_bottom",TextureType.BACKGROUND);
		m_rotate = new Rotate();
		m_rotate.init(headBgLabel,EffectConstant.RotateType.ROTATE_INSTANT,Rotate.RotateDirection.CLOCKWISE,0,0);
		m_rotate.playEffect();
		
		bottomBgLabel.useTile = false;
		bottomBgLabel.setBackground("tool bar_bottom",TextureType.BACKGROUND);
		bottomBgLabel.SetVisible(false);
		
		btnHostile.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_Hostility",TextureType.BUTTON);
		btnAll.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_book",TextureType.BUTTON);
		btnFavorite.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_xingdi",TextureType.BUTTON);
		btnFriendly.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_Peace",TextureType.BUTTON);
		
		btnHostile.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_Hostility2",TextureType.BUTTON);
		btnAll.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_book2",TextureType.BUTTON);
		btnFavorite.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_xingdi2",TextureType.BUTTON);
		btnFriendly.mystyle.active.background = TextureMgr.instance().LoadTexture("Type_Peace2",TextureType.BUTTON);
		
		var lblbgNormal:Texture2D = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		lblAll.mystyle.normal.background = lblbgNormal;
		lblFavorite.mystyle.normal.background = lblbgNormal;
		lblHostile.mystyle.normal.background = lblbgNormal;
		lblFriendly.mystyle.normal.background = lblbgNormal;
		
		initButtonsBottomClickHandler();
	}
	
	public	function	OnPush(param:Object){
	
		super.OnPush(param);
		
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		bgStartY = 86;
		repeatTimes = -6;

		btn_edit.txt = Datas.getArString("Common.Edit");
		menuType = BookMarkMenuType.All;
		buttonsBottomSetting();
		
		for(var i = 0;i <uiBottoms.length;i++)
		{
			uiBottoms[i].SetVisible(true);
		}
		
		Bookmark.instance().reqServerBookmarks(onBookMarkLoaded);
		
	}
	
	protected function onBookMarkLoaded()
	{
		bookmarkInfo = Bookmark.instance().getBookmarks();
		if( bookmarkInfo ){
			for( var bmInfo:Bookmark.BookmarkItemInfo in bookmarkInfo ){
				bmInfo.selectedFlag = false;
			}
			curDataSource = bookmarkInfo;
			scrollList.SetData(bookmarkInfo);
			scrollList.ResetPos();
			lblEmpty.SetVisible(false);
		}
	}
	
	public function ResetDataSource()
	{
		bookmarkInfo = Bookmark.instance().getBookmarks();
		curDataSource = new Array();
		
		if( bookmarkInfo ){
			for( var i:int = 0; i< bookmarkInfo.length; i++ )
			{
				var bmInfo:Bookmark.BookmarkItemInfo = bookmarkInfo[i] as Bookmark.BookmarkItemInfo;
				switch(menuType)
				{
					case BookMarkMenuType.All:
						curDataSource.Add(bmInfo);
						break;
					case BookMarkMenuType.Favorite:
						if(bmInfo.isFavorite)
						{
							curDataSource.Add(bmInfo);
						}
						break;
					case BookMarkMenuType.Friendly:
						if(bmInfo.isFriendly)
						{
							curDataSource.Add(bmInfo);
						}
						break;
					case BookMarkMenuType.Hostile:
						if(bmInfo.isHostile)
						{
							curDataSource.Add(bmInfo);
						}
						break;
				}
			}

			scrollList.SetData(curDataSource);
			scrollList.ResetPos();
			if(curDataSource.length > 0)
			{
				lblEmpty.SetVisible(false);
			}
			else
			{
				lblEmpty.SetVisible(true);
			}
		}
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			case Constant.Action.BOOKMARK_EDIT_ITEM:
				if(editItem)
					editItem.editing = false;
				editItem = param as Bookmark.BookmarkItemInfo;
				editItem.editing = true;
				break;
			default:
				break;	
		}	
	}
	
	public function OnPop()
	{
		BookmarkItem.reset();
		
		btn_del.SetVisible(false);
		togbtSelectedAll.SetVisible(false);
		togbtSelectedAll.selected = false;
		scrollList.ForEachItem(function(item : ListItem) : boolean
		{
			var bookmarkItem : BookmarkItem = item as BookmarkItem;
			bookmarkItem.bgButton.SetDisabled(false);
			return true;
		});
	}
	
	public	function	OnPopOver()
	{
		scrollList.Clear();
	}
	
	public	function	Update(){
		scrollList.Update();
	}
	
	public function DrawTitle(){
//		headBgLabel.Draw();
		m_rotate.drawItems();
		bottomBgLabel.Draw();
		
		l_title.Draw();
		btn_home.Draw();
		btn_edit.Draw();
		btn_del.Draw();
		togbtSelectedAll.Draw();
	}
	
	public	function DrawItem(){
		scrollList.Draw();
		
		lblEmpty.Draw();
		lblAll.Draw();
		btnAll.Draw();
		
		lblFavorite.Draw();
		btnFavorite.Draw();
		
		lblFriendly.Draw();
		btnFriendly.Draw();
		
		lblHostile.Draw();
		btnHostile.Draw();
	}
	
	
	private function initButtonsBottomClickHandler()
	{
		btnFavorite.OnClick = function(){
			menuType = BookMarkMenuType.Favorite;
			buttonsBottomSetting();
			ResetDataSource();
		};
		btnFriendly.OnClick = function(){
			menuType = BookMarkMenuType.Friendly;
			buttonsBottomSetting();
			ResetDataSource();
		};
		btnHostile.OnClick = function(){
			menuType = BookMarkMenuType.Hostile;
			buttonsBottomSetting();
			ResetDataSource();
		};
		
		btnAll.OnClick = function(){
		
			menuType = BookMarkMenuType.All;
			buttonsBottomSetting();
			ResetDataSource();
		};
	}
	/*buttons on bottom*/

	
	private function buttonsBottomSetting()
	{
		var isFavorite:boolean = menuType == BookMarkMenuType.Favorite;
		var isAll:boolean = menuType == BookMarkMenuType.All;
		var isHostile:boolean = menuType == BookMarkMenuType.Hostile;
		var isFriendly:boolean = menuType == BookMarkMenuType.Friendly;
		
		btnHostile.mystyle.normal.background = isHostile ? TextureMgr.instance().LoadTexture("Type_Hostility2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_Hostility",TextureType.BUTTON);
		btnAll.mystyle.normal.background = isAll ? TextureMgr.instance().LoadTexture("Type_book2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_book",TextureType.BUTTON);
		btnFavorite.mystyle.normal.background = isFavorite ? TextureMgr.instance().LoadTexture("Type_xingdi2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_xingdi",TextureType.BUTTON);
		btnFriendly.mystyle.normal.background = isFriendly ? TextureMgr.instance().LoadTexture("Type_Peace2",TextureType.BUTTON) : TextureMgr.instance().LoadTexture("Type_Peace",TextureType.BUTTON);
		
		var lblbgNormal:Texture2D = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		var lblbgDown:Texture2D = TextureMgr.instance().LoadTexture("Type_ring",TextureType.DECORATION);
		
		lblAll.mystyle.normal.background = isAll ? lblbgDown:lblbgNormal;
		lblFavorite.mystyle.normal.background = isFavorite? lblbgDown:lblbgNormal;
		lblHostile.mystyle.normal.background = isHostile? lblbgDown:lblbgNormal;
		lblFriendly.mystyle.normal.background = isFriendly? lblbgDown:lblbgNormal;
	}
	
}
