import System.Reflection;

public class ReportLogAndLineData
{
	public var log : HashObject;
	public var line : HashObject;
	public var tooWeakToInspect : boolean;
}

class ReportLogMenu extends PopMenu
{
    @SerializeField
    private var scrollView : ScrollView;
    @SerializeField
    private var bgLine : Label;
    @SerializeField
    private var reportLog : HashObject;
    @SerializeField
    private var reportLogItem : ReportLogItem;
    @SerializeField
   	public var reportBezierLine : ReportBezierLineObj;

        
    public function Init()
    {
        super.Init();
        scrollView.Init();
    }

    public function OnPush(param : Object)
    {
    	checkIphoneXAdapter();
    	
        title.txt = Datas.getArString("BattleReport.BattleLog_Title");

		var logAndLine : ReportLogAndLineData = param as ReportLogAndLineData;
    	reportLog = logAndLine.log;
    	
    	var lineObject : ReportBezierLineObj = Instantiate(reportBezierLine) as ReportBezierLineObj;
    	lineObject.refresh(logAndLine.line);
    	scrollView.addUIObject(lineObject);
    	
    	if(logAndLine.tooWeakToInspect)
    	{
    		var noLog : ReportLogItem = Instantiate(reportLogItem) as ReportLogItem;
            noLog.Init();
            noLog.SetLogData(Datas.getArString("Report.UnrevealTips"), String.Empty, scrollView.rect.width);

            scrollView.addUIObject(noLog);
    	}
    	else
    	{
	    	var reportlogData : ReportLogData = ReportLogData.CreateReportLogData(reportLog);
	        for(var i : int = 0; i < reportlogData.logDatas.Count; ++i)
	        {
	            var logData : ReportLogData.Data = reportlogData.logDatas[i];

	            var temp : ReportLogItem = Instantiate(reportLogItem) as ReportLogItem;
	            temp.Init();
	            temp.SetLogData(logData.title, logData.content, scrollView.rect.width);

	            scrollView.addUIObject(temp);
	        }
    	}
    	
        scrollView.AutoLayout();
        scrollView.MoveToTop();
    }
    
    public function DrawItem()
    {
        scrollView.Draw();
        bgLine.Draw();
    }
    
    public function Update()
    {
        scrollView.Update();
    }
    
    public function OnPopOver()
    {
        Clear();
    }
    
    private function Clear()
    {
        scrollView.clearUIObject();
    }
}