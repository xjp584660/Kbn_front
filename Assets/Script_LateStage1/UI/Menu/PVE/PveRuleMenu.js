class PveRuleMenu extends PopMenu
{
	@SerializeField private var topBackFram :SimpleLabel;
	@SerializeField private var topDesc :SimpleLabel;
	
	@SerializeField private var bottomBackFram :SimpleLabel;
	@SerializeField private var bottomDarkLine :SimpleLabel;
	@SerializeField private var bottomDesc1 :SimpleLabel;
	@SerializeField private var bottomDesc2 :SimpleLabel;
	@SerializeField private var bottomDesc3 :SimpleLabel;
	
	@SerializeField private var efficienceIcon:SimpleLabel;
	@SerializeField private var vitalityIcon:SimpleLabel;
	@SerializeField private var timeIcon:SimpleLabel;
	
	@SerializeField private var circle1 :SimpleLabel;
	@SerializeField private var circle2 :SimpleLabel;
	@SerializeField private var circle3 :SimpleLabel;
	@SerializeField private var backAlpha:float = 0.65f;
	
	public function Init()
	{
		super.Init();
		
		btnClose.Init();
		btnClose.OnClick = handleBack;
		
		if(topBackFram.mystyle.normal.background == null)
		{
			topBackFram.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang",TextureType.DECORATION);
		}
		topBackFram.txt = Datas.getArString("Campaign.StarText1");//"The rules of the stars";
		
		if(bottomBackFram.mystyle.normal.background == null)
		{
			bottomBackFram.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		}
		
		if(bottomDarkLine.mystyle.normal.background == null)
		{
			bottomDarkLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("Brown_Gradients2",TextureType.DECORATION);
		}
		bottomDarkLine.txt = Datas.getArString("Campaign.StarText2");//"How to gain higher score from each level";
		
		if(efficienceIcon.mystyle.normal.background == null)
		{
			efficienceIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("report-tactics",TextureType.DECORATION);
		}
		if(vitalityIcon.mystyle.normal.background == null)
		{
			vitalityIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("report-courage",TextureType.DECORATION);
		}
		if(timeIcon.mystyle.normal.background == null)
		{
			timeIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("report-speed",TextureType.DECORATION);
		}
		
		if(circle1.mystyle.normal.background == null)
		{
			circle1.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		}
		if(circle2.mystyle.normal.background == null)
		{
			circle2.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		}
		if(circle3.mystyle.normal.background == null)
		{
			circle3.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		}
		
		topDesc.txt = Datas.getArString("Campaign.StarDesc");
		bottomDesc1.txt = Datas.getArString("Campaign.StarTip1");
		bottomDesc2.txt = Datas.getArString("Campaign.StarTip2");
		bottomDesc3.txt = Datas.getArString("Campaign.StarTip3");
	}
	
	public function DrawItem()
	{
		topBackFram.Draw();
		topDesc.Draw();
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = backAlpha;	
			bottomBackFram.Draw();
			bottomDarkLine.Draw();
		GUI.color.a = oldAlpha;
		
		bottomDesc1.Draw();
		bottomDesc2.Draw();
		bottomDesc3.Draw();
		
		efficienceIcon.Draw();
		vitalityIcon.Draw();
		timeIcon.Draw();
		
		circle1.Draw();
		circle2.Draw();
		circle3.Draw();
	}
	
	function Update() 
	{
	}
	
	public function OnPush(param:Object)
	{
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
        
		topBackFram.mystyle.normal.background = null;
		bottomBackFram.mystyle.normal.background = null;
		bottomDarkLine.mystyle.normal.background = null;
		efficienceIcon.mystyle.normal.background = null;
		vitalityIcon.mystyle.normal.background = null;
		timeIcon.mystyle.normal.background = null;
		circle1.mystyle.normal.background = null;
		circle2.mystyle.normal.background = null;
		circle3.mystyle.normal.background = null;
    }
    
    private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("PveRuleMenu");
	}
}