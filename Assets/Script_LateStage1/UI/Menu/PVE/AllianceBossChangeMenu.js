class AllianceBossChangeMenu extends PopMenu
{
	@SerializeField private var headImg:SimpleLabel;
	@SerializeField private var title1:SimpleLabel;
	@SerializeField private var congratulations:SimpleLabel;
	@SerializeField private var tipsDesc:SimpleLabel;
	@SerializeField private var closeTime:int;
	@SerializeField private var frameOffset : RectOffset;
	private var curTime:float;
	private var overFunc:System.Action;
	
	public function Init()
	{
		super.Init();
		if(headImg.mystyle.normal.background == null)
		{
			headImg.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenbossname",TextureType.DECORATION);
		}
		if(congratulations.mystyle.normal.background == null)
		{
			congratulations.mystyle.normal.background = TextureMgr.instance().LoadTexture("Brown_Gradients2",TextureType.DECORATION);
		}
		congratulations.txt = Datas.getArString("Dungeon.NextLevel_SubTitle");
		overFunc = null;
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		curTime = 0;
		if(param!=null)
		{
			var dataHash:Hashtable = param as Hashtable;
			overFunc = dataHash["overFunction"] as System.Action;
		}
		
		if (KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0) // if all level cleared
		{
			title1.txt = Datas.getArString("Dungeon.Clearance_Title");
			tipsDesc.txt = Datas.getArString("Dungeon.Clearance_Desc");
		}
		else
		{
			title1.txt = String.Format(Datas.getArString("Dungeon.NextLevel_Title"),KBN.AllianceBossController.instance().curLayer+1);
			tipsDesc.txt = String.Format(Datas.getArString("Dungeon.NextLevel_Desc"),KBN.AllianceBossController.instance().curLayer+1);
		}
	}
		
	function DrawItem()
	{
		tipsDesc.Draw();
	}
	
	public function DrawLastItem()
	{
		headImg.Draw();
		title1.Draw();
		congratulations.Draw();
	}
	
	public function Update() 
	{
		curTime += Time.deltaTime;
		if(curTime>=closeTime)
			MenuMgr.getInstance().PopMenu("AllianceBossChangeMenu");
	}
	
	public function resetLayout()
    {
        ResetLayoutWithRectOffset(frameOffset);
    }
    
	public function OnPopOver()
	{
		if(overFunc != null)
			overFunc();
	}
}