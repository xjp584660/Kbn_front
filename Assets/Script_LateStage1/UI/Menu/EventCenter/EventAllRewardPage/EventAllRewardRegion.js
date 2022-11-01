#pragma strict

public class EventAllRewardRegion extends ListItem {
	@SerializeField private var dividerTemplate: Label;
	@SerializeField private var dividerImageName : String;
	
	@SerializeField private var rowTemplate : EventAllRewardRow;

	@SerializeField private var outBox : Label;
	@SerializeField private var titleView : EventAllRewardRegionTitle;
	@SerializeField private var placeHolder : Label;
	
	private var dividers : List.<Label>;
	private var rows : List.<EventAllRewardRow>;
	
	public function InitAward(data : List.<EventCenterGroupRewardItem>,titleText : String): void
	{
		super.Init();
		dividerTemplate.rect = new Rect(33,0,580,2);
		AddAwardTitleView(titleText);
		AddAwardRowsAndDividers(data);
		AddItem(placeHolder);
		InitAwardOutBox();
	}
	
	private function AddAwardTitleView(titleText : String)
	{
		titleView.InitAward(titleText);
		AddItem(titleView);		
	}
	
	private function AddAwardRowsAndDividers(data : List.<EventCenterGroupRewardItem>)
	{
		var rowCnt : int = (data.Count + 1) / 2;
		dividers = new List.<Label>();
		rows = new List.<EventAllRewardRow>();
		for (var i : int = 0; i < data.Count; i = i + 2) {
			var row : EventAllRewardRow = Instantiate(rowTemplate);
			rows.Add(row);
			row.Init(data[i], (i + 1 < data.Count ? data[i + 1] : null));
			AddItem(row);
		
			if (i / 2 < rowCnt - 1) {
				var divider : Label = Instantiate(dividerTemplate);
				//divider.mystyle.normal.background = TextureMgr.instance().LoadTexture(dividerImageName, TextureType.DECORATION);
				dividers.Add(divider);
				AddItem(divider);
			}
		}
	}
	
	private function InitAwardOutBox() {
		outBox.rect = new Rect(35, 0, rect.width, rect.height);
	}
	
	
	

	public function Init(data : EventCenterGroupRewardsPerRank, index : int,prizeType : String) : void {
		super.Init();
		dividerTemplate.rect = new Rect(0,0,630,2);
		this.useGroupDraw=true;
		AddTitleView(data, index, prizeType);
		AddRowsAndDividers(data);
		AddItem(placeHolder);
		InitOutBox();				
	}
		
	private function AddTitleView(data, index : int,prizeType : String) {
		titleView.Init(data, index,prizeType);
		AddItem(titleView);
	}
	
	private function AddRowsAndDividers(data : EventCenterGroupRewardsPerRank) {
		var rowCnt : int = (data.Count + 1) / 2;
		dividers = new List.<Label>();
		rows = new List.<EventAllRewardRow>();
		for (var i : int = 0; i < data.Count; i = i + 2) {
			var row : EventAllRewardRow = Instantiate(rowTemplate);
			rows.Add(row);
			row.Init(data[i], (i + 1 < data.Count ? data[i + 1] : null));
			AddItem(row);
		
			if (i / 2 < rowCnt - 1) {
				var divider : Label = Instantiate(dividerTemplate);
				//divider.mystyle.normal.background = TextureMgr.instance().LoadTexture(dividerImageName, TextureType.DECORATION);
				dividers.Add(divider);
				AddItem(divider);
			}
		}
	}
	
	private function InitOutBox() {
		outBox.rect = new Rect(0, 0, rect.width, rect.height);
		//outBox.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang", TextureType.DECORATION);
	}
	
	public function DrawItem() {
		//GUI.BeginGroup(rect);
		outBox.Draw();	
		
		for(var i=0; i<dividers.Count; i++)
		{
			dividers[i].Draw();
		}
		
		for(var j=0; j<rows.Count; j++)
		{
			rows[j].Draw();
		}	
		
		titleView.Draw();		
		//GUI.EndGroup();
		//super.DrawItem();
	}
	
	private function OnDestroy() {
		if (dividers != null) {
			for (var divider : Label in dividers) {
				if (divider == null) {
					continue;
				}
				UnityEngine.Object.Destroy(divider.gameObject);
			}
			dividers.Clear();
		}
		
		if (rows != null) {
			for (var row : EventAllRewardRow in rows) {
				if (row == null) {
					continue;
				}
				UnityEngine.Object.Destroy(row.gameObject);
			}
			rows.Clear();
		}
	}
}