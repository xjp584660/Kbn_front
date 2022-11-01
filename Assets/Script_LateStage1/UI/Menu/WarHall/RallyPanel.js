public class RallyPanel extends UIObject
{
	public var rallyAttackItem : RallyAttackItem;
	// public var rallyAttackItemClone : RallyAttackItem;
	public var scrollView : ScrollView;

    public var rallyItems : List.<RallyAttackItem>;

	public function Init()
	{		
		rallyItems = new List.<RallyAttackItem>();
	}

	public function Update()
	{
		scrollView.Update();
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);
		scrollView.Draw();
		GUI.EndGroup();
	}

	public function updateData()
	{
		updateRallyList();
		scrollView.MoveToTop();    
	}
	
	private function updateRallyList()
	{
		Clear();

		var rallyDatas : List.<PBMsgRallySocket.PBMsgRallySocket> = KBN.RallyController.instance().GetRallyList();

		scrollView.Init();
		for (var i : int = 0; i < rallyDatas.Count; ++i) 
		{
			var region : RallyAttackItem = Instantiate(rallyAttackItem);
			rallyItems.Add(region);
			region.Init(rallyDatas[i]);
			
			scrollView.addUIObject(region);
			scrollView.SetItemAutoScale(region);		
		}		
		scrollView.AutoLayout();   
	}

	function FixedUpdate()
	{
		
	}

	public function Clear()
	{
		if (rallyItems == null) {
			return;
    	}
    	for (var region : RallyAttackItem in rallyItems) {
    		if (region == null) {
    			continue;
    		}
    		UnityEngine.Object.Destroy(region.gameObject);
    	}
    	rallyItems.Clear();
	}
}