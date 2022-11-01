class InventoryObjBase extends ListItem
{ 
	@SerializeField
	protected var owned:Label;	 
	@SerializeField
	protected var reverseBg:Label;
	@SerializeField
	protected var inforIcon:Label;	

	protected var combination:CombinationController;
	protected var turnover:Turnover; 
	protected var iconInforFade:Fade;
	protected var nameFade:Fade;

	//@SerializeField
	private var m_flashFrame : SimpleLabel;	//	Orange_AndDown_gradient

	private static var m_hightLightItemID : int;
	private static var m_hightLightAlpha : float;

	public static function SetHightLightItemID(itemId : int)
	{
		m_hightLightItemID = itemId;
	}

	public static function SetHightLightAlpha(alpha : float)
	{
		m_hightLightAlpha = alpha;
	}
	
	public static function GetHightLightAlpha() : float
	{
		return m_hightLightAlpha;
	}

	public function Init()
	{
		super.Init();
		reverseBg.alphaEnable = true;
		reverseBg.alpha = 0.7f;

		combination = new CombinationController(CombinationController.CombinationType.SERIAL);

		turnover = new Turnover();
		turnover.init(null ,reverseBg, true);
		combination.add(turnover);

		iconInforFade = new Fade();
		iconInforFade.init(inforIcon, EffectConstant.FadeType.FADE_OUT);
		combination.add(iconInforFade);

		nameFade = new Fade();
		nameFade.init(title, EffectConstant.FadeType.FADE_IN);
		combination.add(nameFade);
	}

	protected function SetOwnedCnt(cnt:int)
	{
		owned.txt = Datas.getArString("Common.Owned") + ': ' + cnt;
	}

	protected function prot_showFlashFrame()
	{
		if ( ID != m_hightLightItemID )
			return;

		if ( m_flashFrame == null )
		{
			m_flashFrame = new SimpleLabel();
			m_flashFrame.rect = this.rect;
			m_flashFrame.rect.y = 0;
			m_flashFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("Orange_AndDown_gradient", TextureType.DECORATION);
		}
		var oldColor : Color = GUI.color;
		GUI.color = new Color(oldColor.r, oldColor.g, oldColor.b, oldColor.a * m_hightLightAlpha);
		m_flashFrame.Draw();
		GUI.color = oldColor;
		return;
	}
}

