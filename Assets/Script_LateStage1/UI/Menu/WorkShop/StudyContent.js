public class StudyContent extends UIObject
{
	public var btn_back  :Button;
	public var l_title : Label;
	public var itemPic:ItemPic;
	public var l_lock1 : Label;
	public var l_lock2 : Label;
	public var l_name : Label;
	public var l_description : Label;
	public var l_requirement : Label;
	public var btn_study : Button;
	public var l_bg:Label;
	public var l_line1:Label;
//	public var l_bg2:Label;
	
	public var clone_requirecon:RequireContent;
	protected var requirecon:RequireContent;
	
	public var f_click_callBack:Function;
	
	protected var requirements:Array;
	protected var req_ok:boolean;
	private var m_data:HashObject;

	public	function Init()
	{
		requirecon = Instantiate(clone_requirecon);
		requirecon.rect.y = 448;
		
		btn_back.OnClick = OnBack;
		btn_study.OnClick = OnStudy;
		btn_study.txt = Datas.getArString("Common.Study");
		requirecon.Init();
		l_requirement.txt = Datas.getArString("Workshop.StudyRequirement");
//		l_bg2.setBackground("square_black",TextureType.DECORATION);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_bg.Draw();
		l_line1.Draw();
//		l_bg2.Draw();
		btn_back.Draw();
		btn_study.Draw();
		l_title.Draw();
		l_name.Draw();
		itemPic.Draw();
		l_lock1.Draw();
		l_lock2.Draw();
		l_description.Draw();
		
		l_requirement.Draw();
		requirecon.Draw();
		GUI.EndGroup();
	}
	
	private function OnBack()
	{
		if(f_click_callBack != null)
			f_click_callBack(1);
	}
	
	private function OnStudy()
	{
		WorkShop.instance().reqRecipeStudy(_Global.GetString(m_data["recipeId"]),OnStudySuccess);
	}
	
	public function OnStudySuccess(param:HashObject)
	{
		if(param != null && param["recipeId"] != null)
		{
			WorkShop.instance().setRecipeStudyStatus(_Global.GetString(param["recipeId"]),"1");
			OnBack();
		}
	}
	
	private function playEndSound():void
	{
		Invoke("playSound",1.5);
	}
	
	private function playSound():void
	{
		SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/" );
	}
	
	public function updateData(data:HashObject)
	{
		m_data = data;
		var rewardItemId:int = _Global.INT32(m_data["reward"]["id"]);
		l_title.txt = Datas.getArString("itemName.i" + rewardItemId);
		l_name.txt = Datas.getArString("itemName.i" + rewardItemId);
		l_description.txt = Datas.getArString("itemDesc.i" + rewardItemId);
		itemPic.SetId(rewardItemId);
		
		requirements = WorkShop.instance().getStudyRequirements(_Global.GetString(m_data["recipeId"]));		
		requirecon.showRequire(requirements.ToBuiltin(typeof(Requirement)));
		var bAllEnough:boolean = true;
		var req:Requirement;
		for(var i:int=0;i<requirements.length;i++)
		{
			req = requirements[i] as Requirement;
			if(req.ok != true  && req.ok != 'true')
			{
				bAllEnough = false;
				break;
			}
		}
		if(bAllEnough)
		{
			btn_study.changeToBlueNew();
			btn_study.SetDisabled(false);
		}
		else
		{
			btn_study.changeToGreyNew();
			btn_study.SetDisabled(true);
			
		}
	}
	
	public function Clear()
	{
		requirecon.Clear();
		TryDestroy(requirecon);
	}
}
