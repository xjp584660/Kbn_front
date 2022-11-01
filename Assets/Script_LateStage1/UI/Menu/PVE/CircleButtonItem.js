class CircleButtonItem extends MonoBehaviour
{
	public var rect :Rect;
	@SerializeField private var backImage :Button;
	@SerializeField private var bottomDesc :BlowUpLabel;
	@SerializeField private var infoIcon :SimpleLabel;
	@SerializeField private var iconTop :SimpleLabel;
	@SerializeField private var shake:Shake;
	@SerializeField private var tipsAni:RiseTips;
	@SerializeField private var textBack :Label;
	private var endTips:String;
	
	public function get OnClick() :System.MulticastDelegate {
		if(backImage!=null)
			return backImage.OnClick;
		return null;
	}
	
	public function set OnClick(value : System.MulticastDelegate) {
		if(backImage!=null)
			backImage.OnClick = value;
	}
	
	public function get txt() :String {
		if(bottomDesc!=null)
			return bottomDesc.txt;
		return null;
	}
	
	public function set txt(value : String) {
		if(bottomDesc!=null)
			bottomDesc.txt = value;
	}
	
	public function get Image() :Texture2D {
		if(iconTop!=null)
			return iconTop.mystyle.normal.background;
		return null;
	}
	
	public function set Image(value : Texture2D) {
		if(iconTop!=null)
		{
			iconTop.useTile = false;
			iconTop.mystyle.normal.background = value;
		}
	}
	
	public function get tile() :Tile {
		if(iconTop!=null)
			return iconTop.tile;
		return null;
	}
	
	public function set tile(value : Tile) {
		if(iconTop!=null)
		{
			iconTop.useTile = true;
			iconTop.tile = value;
		}
	}
	
	public function BeginNotice() {
		if(infoIcon.mystyle.normal.background == null)
		{
//			var m_animationSprClone:GameObject = TextureMgr.instance().loadAnimationSprite("Chapter_100", Constant.AnimationSpriteType.Campaign);
//			var texture :Texture2D = null;
//			if(m_animationSprClone != null)
//			{
//				m_animationSprClone = Instantiate(m_animationSprClone);
//				texture = m_animationSprClone.transform.GetChild(0).renderer.material.mainTexture as Texture2D;
//			}
//				
//			infoIcon.mystyle.normal.background = texture;

			infoIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("RoundTower_icon2",TextureType.DECORATION);
		}
	}
	
	public function EndNotice() {
		infoIcon.mystyle.normal.background = null;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		if(backImage!=null)backImage.Draw();
		
		shake.ShakeMatrixBegin();
		if(iconTop!=null)iconTop.Draw();
		shake.ShakeMatrixEnd();
		
		if(textBack!=null)textBack.Draw();
		if(bottomDesc!=null)bottomDesc.Draw();
		if(tipsAni!=null)tipsAni.Draw();
		if(infoIcon!=null)infoIcon.Draw();
		GUI.EndGroup();
	}
	
	public function Init()
	{
		backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button-pve-bg",TextureType.DECORATION);
		backImage.mystyle.active.background = TextureMgr.instance().LoadTexture("button-pve-bg",TextureType.DECORATION);
		shake.Init(OnShakeEnd);
		if(tipsAni!=null)
		{
			tipsAni.Init();
			tipsAni.SetAfterPauseFunction(BlowUpTips);
		}
		if(bottomDesc!=null)
		{
			bottomDesc.Init();
			bottomDesc.DefaultShow();
		}
	}
	
	private function OnShakeEnd()
	{
//		shake.Begin();
	}
	
	public function BeginShake()
	{
		shake.Begin();
	}
	
	public function Update()
	{
		shake.Update();
		if(bottomDesc!=null)bottomDesc.Update();
	}
	
	public function PlayTipsAni(_bottomStr:String, _aniStr:String, _endStr:String)
	{
		bottomDesc.DefaultShow();
		bottomDesc.txt = _bottomStr;
		tipsAni.txt = _aniStr;
		endTips = _endStr;
		tipsAni.Begin();
	}
	
	private function BlowUpTips()
	{
		bottomDesc.txt = endTips;
		bottomDesc.Begin();
	}
}