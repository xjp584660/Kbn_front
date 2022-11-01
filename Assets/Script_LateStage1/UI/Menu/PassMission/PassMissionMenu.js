import System.Collections.Generic;

public class PassMissionMenu extends KBNMenu
{
    @SerializeField
    private var toolBar : ToolBar;
    @SerializeField
    private var toolBarStringKeys : String[];

	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
    
    @SerializeField
    private var passMissionQuest : PassMissionQuest;
    public var questScrollView : ScrollView;

    @SerializeField
    private var passMissionMap : PassMissionMap;

    private function OnTabIndexChanged(index : int) : void
    {
        if (index == 1) // passMission quest
        {
            passMissionQuest.ReqUpdateData();
            questScrollView.AutoLayout();
		    questScrollView.MoveToTop();
        }
        else if(index == 0)
        {
            passMissionMap.PushMap();
        }
    }
    
    private function InitMenu() : void
    {
        toolBar.Init();
        toolBar.indexChangedFunc = OnTabIndexChanged;
        
        var toolBarStrings : List.<String> = new List.<String>();
        for (var key : String in toolBarStringKeys)
        {
            toolBarStrings.Add(Datas.getArString(key));
        }
        toolBar.toolbarStrings = toolBarStrings.ToArray();

        menuHead = GameObject.Instantiate(clone_menuHead);
        menuHead.Init();
        menuHead.setTitle(Datas.getArString("PassMission.Title"));
    }
    
    private function InitPassMissionQuest() : void
    {
        questScrollView.Init();
    }

	function Init()
	{
        InitMenu();
        InitMap();
        InitPassMissionQuest();
    }

    function InitMap()
    {
        passMissionMap.Init();
	}

	function DrawItem()
	{
        switch (toolBar.selectedIndex)
        {
            case 0:
                passMissionMap.Draw();
                break;
            case 1:
                questScrollView.Draw();
                break;
            default:
                break;
        }

        frameTop.Draw();
        toolBar.Draw();
	}

	function Update()
	{
		menuHead.Update();
        toolBar.Update();
        switch (toolBar.selectedIndex)
        {
            case 0:
                passMissionMap.Update();
                break;
            case 1:
                questScrollView.Update();
                passMissionQuest.Update();
                break;
            default:
                break;
        }
	}

	public function OnPop()
	{
		super.OnPop();
	}
	
	public function OnPopOver()
	{
        passMissionQuest.OnPopOver();
		TryDestroy(menuHead);
        menuHead = null;
        questScrollView.clearUIObject();

        passMissionMap.OnPopOver();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
	}
    
    public function OnPushOver()
    {

    }

	function DrawBackground()
	{
		menuHead.Draw();
		DrawMiddleBg();
	}
    
    public function handleNotification(type : String, body : System.Object) : void
    {
        switch (type)
        {
	        case Constant.Notice.DailyQuestProgressIncreased:
	            //CheckToolBarFlashing();
	            break;
        }
    
        if (toolBar.selectedIndex == 1)
        {
            passMissionQuest.HandleNotification(type, body);
        }
        else if(toolBar.selectedIndex == 0)
        {
            passMissionMap.HandleNotification(type, body);
        }
    }
}

