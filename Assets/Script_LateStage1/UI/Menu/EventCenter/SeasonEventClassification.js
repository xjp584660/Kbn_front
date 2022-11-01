#pragma strict

public class SeasonEventClassification extends PopMenu {

	public var desc    : SimpleLabel;
	public var titleBg : SimpleLabel;
	public var redBelt : SimpleLabel;
	
	public var titleClass     : SimpleLabel;
	public var titleMinRank   : SimpleLabel;
	public var titleMinTrophy : SimpleLabel;
	public var titleMyTrophy  : SimpleLabel;
	public var titleNum       : int;
	
	public var lineRect       : Rect;
	public var cellHeight     : int;
	public var gap            : int;
	public var bottomPadding  : int;
	public var redBeltOffset  : int;
	
	private var cells : System.Collections.Generic.List.<SimpleLabel>;
	private var lines : System.Collections.Generic.List.<SimpleLabel>;
	private var btns  : System.Collections.Generic.List.<SimpleButton>;

	public function Init() {
	    super.Init();
		cells = new System.Collections.Generic.List.<SimpleLabel>();
		lines = new System.Collections.Generic.List.<SimpleLabel>();
		btns = new System.Collections.Generic.List.<SimpleButton>();
		
		title.txt = Datas.getArString("SeasonRank.ClassPageTitle");
		desc.txt = Datas.getArString("SeasonRank.ClassPageDesc");
		
		titleClass.txt = Datas.getArString("SeasonRank.ClassTableName_1");
		titleMinRank.txt = Datas.getArString("SeasonRank.ClassTableName_2");
		titleMinTrophy.txt = Datas.getArString("SeasonRank.ClassTableName_3");
		titleMyTrophy.txt = Datas.getArString("SeasonRank.ClassTableName_4");
		
		titleBg.setBackground("square_black2", TextureType.DECORATION);
		redBelt.setBackground("Event_mytiao", TextureType.DECORATION);
		redBelt.SetVisible(false);
	}
	
	private function addRow(classIcon : String, classStr : String, minRank : String, minTrophy : String, myTrophy : String, desc : String, highlight : boolean) : int {
		var row : int = cells.Count / titleNum;
		var rowHeight : int = lineRect.height + cellHeight + gap * 2;
		var top : int = titleBg.rect.yMax + rowHeight * row; // row top
		
		top -= (lineRect.height + gap); // first row has no separator line;
		
		if (row > 0) {
			var line : SimpleLabel = new SimpleLabel();
			line.rect = lineRect;
			line.rect.y = top + gap;
			line.setBackground("between line_list_small", TextureType.DECORATION);
			lines.Add(line);
		}
		
		top += (lineRect.height + 2 * gap); // now go to cell top
		
		var btn : SimpleButton = new SimpleButton();
		btn.rect = lineRect;
		btn.rect.y = top;
		btn.rect.height = cellHeight;
		btn.OnClick = function () {
			Debug.LogWarning(desc);
			var dialog : EventDoneDialog = MenuMgr.getInstance().getEventDoneDialog();
			var dialog_param = {
				"Msg" : classStr + "\n\n" + desc,
				"isShowCloseButton" : true
			};			  
		
			dialog.extraLabe.image = null;
			dialog.setLayout(590,500);
			dialog.setMsgLayout(45,70,500,460);
			dialog.setMsgTxtColor(FontColor.Description_Light);
			
			MenuMgr.getInstance().PushEventDoneDialog(dialog_param);
		};
		btns.Add(btn);
		
		var cell : SimpleLabel = new SimpleLabel();
		cell.rect = titleClass.rect;
		cell.rect.y = top;
		cell.rect.height = cellHeight;
		cell.setBackground(classIcon, TextureType.DECORATION);
		cell.mystyle.border = new RectOffset(8, 8, 8, 8);
		cell.txt = classStr;
		cell.mystyle.alignment = TextAnchor.MiddleCenter;
		cell.normalTxtColor = FontColor.Button_White;
		cells.Add(cell);
		
		cell = new SimpleLabel();
		cell.rect = titleMinRank.rect;
		cell.rect.y = top;
		cell.rect.height = cellHeight;
		cell.txt = minRank;
		cell.mystyle.alignment = TextAnchor.MiddleCenter;
		cell.normalTxtColor = highlight ? FontColor.Button_White : FontColor.Description_Light;
		cells.Add(cell);
		
		cell = new SimpleLabel();
		cell.rect = titleMinTrophy.rect;
		cell.rect.y = top;
		cell.rect.height = cellHeight;
		cell.txt = minTrophy;
		cell.mystyle.alignment = TextAnchor.MiddleCenter;
		cell.normalTxtColor = highlight ? FontColor.Button_White : FontColor.Description_Light;
		cells.Add(cell);
		
		cell = new SimpleLabel();
		cell.rect = titleMyTrophy.rect;
		cell.rect.y = top;
		cell.rect.height = cellHeight;
		cell.txt = myTrophy;
		cell.mystyle.alignment = TextAnchor.MiddleCenter;
		cell.normalTxtColor = highlight ? FontColor.Button_White : FontColor.Description_Light;
		cells.Add(cell);
		
		if (highlight) {
			redBelt.SetVisible(true);
			redBelt.rect.y = top + redBeltOffset;
		}
		
		return top + cellHeight;
	}
	
	public function OnPush(param : Object) {
		var data : HashObject = param as HashObject;
		var myScore : int = _Global.INT32(data["myScore"]["score"]);
		var myClass : int = _Global.INT32(data["myScore"]["class"]);
		
		var yMax : int = titleBg.rect.yMax;
		
		var arr : HashObject = data["classification"];
		if (null == arr) 
			return;
		for (var i : int = 0; i < arr.Table.Count; i++) {
			var cls : HashObject = arr[_Global.ap + i];
			if (null == cls)
				continue;
			var minTrophy : int = _Global.INT32(cls["minTrophy"]);
			
			var mytrophies : String;
			if (myClass == i) {
				mytrophies = myScore.ToString();
			} else {
				var delta : int = myScore - minTrophy;
				mytrophies = (delta > 0 ? "+" + delta : delta.ToString());
			}
			
			yMax = addRow(
					_Global.GetString(cls["image"]),
					_Global.GetString(cls["name"]),
					_Global.GetString(cls["minRank"]),
					_Global.GetString(cls["minTrophy"]),
					mytrophies,
					_Global.GetString(cls["description"]),
					(myClass == i)
					);
		}
		
		
		var height : int = yMax + bottomPadding;
		var y = (960 - height ) / 2;
		rect = new Rect (0, y, 640, height);
		
		resetLayout();
	}
	
//	public function Update() {
//	}
	
	function DrawItem() {
		desc.Draw();
		titleBg.Draw();
		
		titleClass.Draw();
		titleMinRank.Draw();
		titleMinTrophy.Draw();
		titleMyTrophy.Draw();
		
		for (var b in btns)
			b.Draw();
		
		for (var l in lines)
			l.Draw();
		
		redBelt.Draw();
		
		for (var c in cells)
			c.Draw();
	}
}
