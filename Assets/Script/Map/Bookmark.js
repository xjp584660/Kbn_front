enum BookMarkTag{
	Favorite = 1,
	Friendly = 2,
	Hostile = 3
};
class	Bookmark{
	private	static	var	singleton:Bookmark;
	private var	seed:HashObject;
	
	private	var	infoArray:Array;

	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Bookmark();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
	}
	
	public	class	BookmarkItemInfo{
		public	var	selectedFlag:boolean;
		public	var	permitDel:boolean;
		public	var	id:int;
		public	var	name:String;
		public	var	x:String;
		public	var	y:String;
		public	var isFavorite:boolean;
		public	var isFriendly:boolean;
		public	var isHostile:boolean;
		public	var editing:boolean;
		public	var tileId:String;
		public	var attachInfo:String = "";
		
		private var changed:boolean = false;
		
		/*pls don't use this function but u want to change this item on server*/
		public function ChangeFavorite(val:boolean)
		{
			if(this.isFavorite != val)
			{
				this.isFavorite = val;
				this.changed = true;
			}
		}
		
		public function ChangeHostile(val:boolean)
		{
			if(this.isHostile != val)
			{
				isHostile = val;
				changed = true;
			}
		}
		
		public function ChangeFriendly(val:boolean)
		{
			if(isFriendly != val)
			{
				isFriendly = val;
				changed = true;
			}
		}
		
		public function ChangeName(val:String)
		{
			if(name != val)
			{
				name = val;
				changed = true;
			}
		}
		
		public function IsChanged()
		{
			return changed;
		}
		public function ResetChangeStatus()
		{
			changed = false;
		}
	}
	
	public	function	getBookmarks():Array
	{
		if(infoArray)
		{
			infoArray.Sort(function(obja:BookmarkItemInfo,objb:BookmarkItemInfo){return String.Compare(obja.name,objb.name,false);});
			return infoArray;
		}
		else
		{
			return null;
		}
	}
	
	public function setLocationsChanged(okCallback:Function,errorFunc:Function)
	{
		if(infoArray && infoArray.length >0)
		{
			var tileIds:Array = new Array();
			var bookmarkNames:Array = new Array();
			var types:Array = new Array();
			
			for(var item:BookmarkItemInfo in infoArray)
			{
				if(item != null && item.IsChanged())
				{
					tileIds.Add(item.tileId);
					bookmarkNames.Add(item.name);
					types.Add(item.isFavorite ? 1:0);
					types.Add(item.isFriendly ? 1:0);
					types.Add(item.isHostile ? 1:0);
					
					item.ResetChangeStatus();
				}
			}
			
			if(tileIds.length > 0)
			{
				var params:Array = new Array();
				params.Add("BOOKMARK_LOCATION");
				params.Add(tileIds.join(","));
				params.Add(bookmarkNames.join(","));
				params.Add(types.join(','));
				
				var okFunc:Function = function(result:HashObject){
					if (okCallback){
						okCallback(true);
					}
				};
				
				var errorFuncInternal:Function = function(errorMsg:String, errorCode:String){
				
					infoArray = null;
					if(errorFunc)
					{
						errorFunc(errorMsg, errorCode);
					}
				};
				
				UnityNet.reqSetBookmarkLocation(params, okFunc, errorFuncInternal);
			}
			else
			{
				okCallback(false);
			}
		}
		else if(okCallback)
		{
			okCallback(false);
		}
		else
		{
			//nothing to do
		}
	}
	
	public	function	setLocation (tileId:String, bookmarkName:String, x:String, y:String,types:Array, okCallback:Function) {
	
		if( infoArray ){
			for( var item:BookmarkItemInfo in infoArray ){
				if( item.x == x && item.y == y ){
					ErrorMgr.instance().PushError("",Datas.instance().getArString("Error.err_405"));
					return;
				}
			}
		}
		
		var params:Array = new Array();
		params.Add("BOOKMARK_LOCATION");
		params.Add(tileId);
		params.Add(bookmarkName || "");
		params.Add(types.join(','));
		var okFunc:Function = function(result:HashObject){
//			_Global.Log("bookmark setLocation OK");
			
			if( infoArray ){//has gotton bookmarks from server
				var info:BookmarkItemInfo = new BookmarkItemInfo();
				info.id = _Global.INT32(result["bid"]);
				info.name = bookmarkName;
				info.permitDel = true;
				info.x = x;
				info.y = y;
				info.isFavorite = types[0] == 1;
				info.isFriendly = types[1] == 1;
				info.isHostile = types[2] == 1;
				info.tileId = tileId;
				infoArray.Push(info);
			}
			
			if (okCallback){
				okCallback();
			}
		};
		
		UnityNet.reqSetBookmarkLocation(params, okFunc, null );
	}
	
	public	function	reqServerBookmarks(okCallback:Function) {
		
		if( infoArray ){
			if( okCallback ){
				okCallback();
			}
			return;
		}
		
		var params:Array = new Array();                                                            
		params.Add("GET_BOOKMARK_INFO"); 
		
			
		var okFunc:Function = function(result:HashObject){
//			_Global.Log("BookmarkOpen OK");
			
//			infoArray.Clear();
			infoArray = new Array();
			var info:BookmarkItemInfo;
			
			var cities:Array = _Global.GetObjectValues( seed["cities"] );
			for( var city:Object in cities ){
				info = new BookmarkItemInfo();
				info.name = (city as HashObject)[_Global.ap + 1].Value;
				info.x = (city as HashObject)[_Global.ap + 2].Value;
				info.y = (city as HashObject)[_Global.ap + 3].Value;
				info.attachInfo = Datas.getArString("bookmark.BookmarkYourCity");
				infoArray.Push(info);
			}
			
			var bookmarks:Array = _Global.GetObjectValues( result["bookmarkInfo"] );
			for( var bookmark in bookmarks ){
				info = new BookmarkItemInfo();
				info.name = (bookmark as HashObject)["name"].Value;
				info.x = (bookmark as HashObject)["xCoord"].Value;
				info.y = (bookmark as HashObject)["yCoord"].Value;
				info.id = _Global.INT32((bookmark as HashObject)["bookmarkId"]);
				info.permitDel = true;
				info.isFavorite = (bookmark as HashObject)["isFavorite"].Value == "1";
				info.isFriendly = (bookmark as HashObject)["isFriendly"].Value == "1";
				info.isHostile = (bookmark as HashObject)["isHostile"].Value == "1";
				info.tileId = (bookmark as HashObject)["tileId"].Value;
				infoArray.Push(info);
			}
			
			if( okCallback ){
				okCallback();
			}

		};

		UnityNet.reqBookmarkInfo(params, okFunc, null );
	}
	
	public	function	deleteBookmark (bid:Array,okFunction:Function) {
		var params:Array = new Array();
		params.Add("REMOVE_BOOKMARK");
		params.Add(bid.Join(","));
		
		var okFunc:Function = function(result:HashObject){
//			_Global.Log("BookmarkDel OK");
			
			if( !infoArray ){
				return;
			}
			
			var i:int = 0;
			
			for( i = 0; i < infoArray.length; i ++ ){
				
				for( var id in bid ){
					if( (infoArray[i] as BookmarkItemInfo).id == id ){
						infoArray.RemoveAt(i);
						i --;
						break;
					}
				}
			}
			if(okFunction)
			{
				okFunction();
			}
		};
		
		UnityNet.reqDelBookmark(params, okFunc, null );
	}
	
	public	function	moveCityTo( tox:int, toy:int ){
		infoArray = null; //need request bookmark from server
	}
	
	public function changeCityName()
	{
		infoArray = null;
	}
}