public class AllianceReportDetailCon extends ComposedUIObj
{
	public var nav_head :NavigatorHead;
	public var clone_reportObj : ReportObj;
	public var txtColor:Color;
	
	public var rpt_content : ReportObj;
	
	public function Init()
	{
		nav_head.Init();
		nav_head.titleTxt = "";//Datas.getArString("Common.Report"); // TODO..
		rpt_content = Instantiate(clone_reportObj);
		rpt_content.Init();
		rpt_content.setObjColor(txtColor);
		rpt_content.scrollDisplay.rect.height = 800;
		this.addUIObject(rpt_content);
		this.addUIObject(nav_head);
	}
	//TODO..
	public function showReportDetail(head:Object):void
	{
		rpt_content.setData(head);		
		nav_head.updateBackButton();
		
		ShowContent(true);
	}
	
	public function Update()
	{
		rpt_content.Update();
	}
	
	public function ShowContent(b:boolean):void
	{
		rpt_content.SetVisible(b);
	}
	
	public	function	Clear()
	{
//		TryDestroy(rpt_content);
		this.clearUIObject();
	}
}