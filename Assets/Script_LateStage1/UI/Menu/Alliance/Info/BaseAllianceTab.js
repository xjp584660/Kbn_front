public class BaseAllianceTab extends UIObject
{
	protected var nc:NavigatorController;
	protected var menuHead:MenuHead;
	
	public function Init()
	{
		nc = new NavigatorController();
		nc.Init();
		nc.popedFunc = popedFunc;
		nc.pushedFunc = pushedFunc;
	}
	public function onShow():void	
	{
		updateTitle();
	}
	public function setMenuHead(mh:MenuHead)
	{
		menuHead = mh;
	}
	public function showRoot():void
	{
		if(nc)
			nc.pop2Root();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
			nc.DrawItems();
		GUI.EndGroup();		
	}
	
	function FixedUpdate()
	{
		if(nc)
			nc.u_FixedUpdate();	
	}
	
	public function Update() // per frame.
	{
		if(menuHead)
			menuHead.Update();
		if(nc)
			nc.u_Update();
	}
	
	protected function popedFunc(nc:NavigatorController, prevObj : UIObject)
	{
		updateTitle();
	}
	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject)
	{
		updateTitle();
	}
	protected function updateTitle():void
	{
	
	}
	
	public function getmyNacigator():NavigatorController
	{
		return nc;
	}
	public function OnBackButton():boolean
	{
		if(this.getmyNacigator() == null)	return false;
		if(this.getmyNacigator().uiNumbers<=1) return false;
		this.getmyNacigator().pop();
		return true;
	}
}
