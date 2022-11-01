class DoubleArraw extends UIObject
{
	@SerializeField private var topArraw:Label;
	@SerializeField private var bottomArraw:Label;
	@SerializeField private var transSpeed:float;
	@SerializeField private var trsDis:float;
	@SerializeField private var topY:float;
	@SerializeField private var bottomY:float;
	private var curTrsDis:float;
	private var flag:int;
	
	public function Init():void
	{
		super.Init();
		topArraw.setBackground("button_flip_left_normal",TextureType.BUTTON);
		bottomArraw.setBackground("button_flip_left_normal",TextureType.BUTTON);
		curTrsDis = 0;
		flag = 1;
	}
	
	public function Draw()
	{
		if(!this.visible)return;
		GUI.BeginGroup(this.rect);
		curTrsDis += transSpeed*Time.deltaTime*flag;
		if(curTrsDis>trsDis || curTrsDis<0)
			flag*=-1;
		topArraw.rect.y = topY + curTrsDis;
		bottomArraw.rect.y = bottomY - curTrsDis;
		topArraw.Draw();
		bottomArraw.Draw();
		GUI.EndGroup();
	}
}
