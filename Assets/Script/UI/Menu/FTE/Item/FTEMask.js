public class FTEMask extends SimpleUIElement
{
	public var stepStr:String="";
	protected var texture:Texture2D;
	protected var TW:int = 640;
	protected var TH:int = 960;
	
	protected var dRect:Rect;
	//debug..
	protected var bn:FTEBlueNextButton;
//	public var alpha:float = 0.5;
	protected var flag:int = 0;	// 1:fadeIn  2:FadeOut.
	
	public static var globalAlpha:float = 0.5;
	protected var destAlpha:float;
	
	public function Init():void
	{
		super.Init();
		this.alpha = 0.5;
		this.mystyle.normal.background  = 
		texture = Resources.Load("Textures/UI/background/square_black");
		this.mystyle.normal.textColor = Color(1,1,1,1);
		this.mystyle.alignment = TextAnchor.MiddleCenter;
		dRect = new Rect(0,0,0,0);
		
		
		bn = new FTEBlueNextButton();
		bn.Sys_Constructor();
		bn.txt = "SkipTo 1301";
		bn.OnClick = function(clickParam:Object):void
		{
			KBN.FTEMgr.getInstance().Debug_SkipTo(1301);
		};
		
	}	
	
	public function FixedUpdate():void
	{
		switch(flag)
		{
			case 1:
				alpha += 0.05;
				if(alpha >= destAlpha)
				{
					flag = 0;
					alpha = destAlpha;
				}
				globalAlpha = alpha;
				break;				
			case 2:
				alpha -= 0.05;
				if(alpha <= destAlpha)
				{
					alpha = destAlpha;
					flag = 0;
					this.visible = false;
				}
				globalAlpha = alpha;							
				break;
			
			
		}
		
	}
	public function startFadeInToAlpha(dalpha:float):void
	{		
		this.destAlpha = dalpha;
		this.alpha = globalAlpha;
		
		if(this.alpha > dalpha)
			flag = 2;
		else 
			flag = 1;
	}
	public function startFadeIn():void
	{
		flag = 1;
		this.alpha = globalAlpha;
		this.destAlpha = 0.5;
	}
	
	public function startFadeOut():void
	{
		flag = 2;
		this.alpha = globalAlpha;
		this.destAlpha = 0;
	}
	public function drillRect(rect:Rect):void
	{
		dRect = rect;
	}
	
	public function Draw():int
	{
		if(!visible)
			return -1;
		SetFont();
		SetNormalTxtColor();
		GUI.BeginGroup(rect);
				
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0,alpha);	
		
		if(dRect.width > 0 && dRect.height > 0)
		{
			drawByRect(Rect(0,0,TW,dRect.y));
			drawByRect(Rect(0,dRect.y,dRect.x,dRect.height) );
			drawByRect(Rect(0,dRect.y + dRect.height, TW, TH-dRect.y - dRect.height) );
			drawByRect(Rect(dRect.x + dRect.width,dRect.y,TW - dRect.x - dRect.width, dRect.height) );
		}
		else
			drawByRect(rect);		
		
		GUI.color = oldColor;
		GUI.EndGroup();
	}

	protected function drawByRect(rect:Rect):void
	{
//		GUI.DrawTexture(rect,texture, ScaleMode.ScaleToFit, false, 0);
		GUI.Label(rect,"",mystyle);
		
		
	}
}