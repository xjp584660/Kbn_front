#pragma strict

public class EventPlayerGroups extends UIObject {
    private var nc : NavigatorController;
    private var menuHead : MenuHead;
    private var cachedMenuHeadTitle : String;
    
    @SerializeField private var groupTemplate : EventPlayerGroupView;
    
    private var groupViews : List.<EventPlayerGroupView> = new List.<EventPlayerGroupView>();
    @SerializeField private var divider : Label;
    @SerializeField private var infoLabel : Label;
    
    // For debugging only. Set to 4 for the release version
    @SerializeField private var maxGroupCount : int = 4;
    
    @System.Serializable
    private class GroupViewListLayoutConfig {
    	@SerializeField private var groupViewLayoutConfigs : EventPlayerGroupView.GroupViewLayoutConfig[];
    	
    	public function get GroupViewLayoutConfigs() : EventPlayerGroupView.GroupViewLayoutConfig[] {
    		return groupViewLayoutConfigs;
    	}
    }
    
    // Should have a length of 3, corresponding to 2, 3 or 4 pillars (groups)
    @SerializeField private var groupViewListLayoutConfigs : GroupViewListLayoutConfig[];
    
    public function set MenuHead(value : MenuHead) {
    	menuHead = value;
    }
    
    public function Init(nc : NavigatorController) {
        Clear();
        this.nc = nc;
        infoLabel.txt = Datas.getArString("Tournament.Groupdesc");
    }
    
    public function Show(eventData : HashObject) {
    	nc.pushedFunc = OnPushed;
    	nc.popedFunc = OnPopped;
    	var userGroupIndex : int = EventCenterUtils.GetUserGroupIndexFromEvent(eventData);
    	var data : EventCenterAllGroupBasicInfo = EventCenterAllGroupBasicInfo.Create(
    		EventCenterUtils.GetAllGroupInfoFromEvent(eventData), 
    		userGroupIndex);
    	var groupCount : int = Mathf.Min(data.Count, maxGroupCount);
    	var groupViewListLayoutConfig = groupViewListLayoutConfigs[groupCount - 2];
    	for (var i : int = 0; i < groupCount; ++i) {
    		var groupView : EventPlayerGroupView = Instantiate(groupTemplate);
    		groupView.Init(groupViewListLayoutConfig.GroupViewLayoutConfigs[i], data[i], i, userGroupIndex == i);
    		groupViews.Add(groupView);
    	}
    }
    
    public function Draw() {
    	GUI.BeginGroup(rect);
    	divider.Draw();
    	infoLabel.Draw();
    	for (var groupView : EventPlayerGroupView in groupViews) {
    		groupView.Draw();
    	}
    	GUI.EndGroup();
    }
    
    public function Update() {
    	for (var groupView : EventPlayerGroupView in groupViews) {
    		groupView.Update();
    	}
    }
    
    private function OnPushed() {
    	cachedMenuHeadTitle = menuHead.getTitle();
    	menuHead.setTitle(Datas.getArString("Tournament.GroupPageTitle"));
    }
    
    private function OnPopped() {
    	Clear();
    	nc.pushedFunc = null;
    	nc.popedFunc = null;
    	menuHead.setTitle(cachedMenuHeadTitle);
    }
    
    private function Clear() {
    	if (groupViews != null) {
    		for (var groupView : EventPlayerGroupView in groupViews) {
    			if (groupView != null) {
    				groupView.OnPopped();
    				UnityEngine.Object.Destroy(groupView.gameObject);
    			}
    		}
    		groupViews.Clear();
    	}
    }
}
