public class NPCView extends UIElement
{
	public var npc:Texture2D;
	public var bg1 :SimpleLabel;
	public var bg2 :SimpleLabel;
	
	public var npcx	:int;
	public var npcy	:int;
	
	protected var npcw:int;
	protected var npch:int;
	
	
	public var typingText:TypingText;
	public var typeEndFunc:Function;
	
	public var nextButton:SimpleButton;
	protected var noButton:boolean = false;
	protected var flag:int = 0;
	protected var dtime:float;
	public var hasNextShow:boolean = false;
	
	public var biVO:BIVO;
	
	public function Sys_Constructor():void
	{
		bg1 = new SimpleLabel();
		bg2 = new SimpleLabel();
		
		bg1.Sys_Constructor();
		bg2.Sys_Constructor();
		
		bg2.mystyle.border.left 	= 70;		
		bg2.mystyle.border.right 	= 70;
		bg2.mystyle.border.top 		= 70;
		bg2.mystyle.border.bottom 	= 70;
		
		//default value;
		var texture:Texture2D;		
		
		texture = TextureMgr.instance().LoadTexture("fte_frame", TextureType.FTE);//Resources.Load("Textures/UI/FTE/fte_frame");
		bg2.mystyle.normal.background = texture;		
		
		texture = TextureMgr.instance().LoadTexture("ui_fte_bottom", TextureType.FTE);//Resources.Load("Textures/UI/FTE/ui_fte_bottom");
		bg1.mystyle.normal.background = texture;
		
		
		
	}
		
	public function Init(evo:ElementVO):void
	{				
		npc = TextureMgr.instance().LoadTexture(evo.getString("npcPath"), TextureType.FTE);//Resources.Load(evo.getString("npcPath"));
		
		switch(evo.getString("npcPath"))
		{
			case "character_Morgause":
					npcw = 425;
					npch = 328;
				break;
			case "character_Arthur2":
					npcw = 425;
					npch = 500;
				break;
		}
		
		var bgx:int = evo.getInt("bgx");
		var bgy:int = evo.getInt("bgy");
		var bgby:int = evo.getInt("bgby");	//bottom y.
		var bgw:int = evo.getInt("bgw");
		var bgh:int = evo.getInt("bgh");
		npcx = evo.getInt("npcx");
		npcy = evo.getInt("npcy");
		
		bgx = bgx > 0 ? bgx : 20;
		bgy = bgy > 0 ? bgy : 100;//default
		bgw = bgw > 0 ? bgw : 610;
		bgh = bgh > 0 ? bgh : 310;		
		
		if(evo.getValue("BI"))
		{
			biVO = new BIVO();
			biVO.Init(evo.getValue("BI"));
		}
		
		if(bgby > 0 )
		{
			bgy = bgby - bgh;
		}
		
		this.setBGRect(bgx,bgy,bgw,bgh);
		
		if(npcx == 0  && npcy == 0 && npc != null)
		{
			npcx =  bgx  - 20;   //21  38
			npcy = 	bgy + bgh - npch - 25;	//25
		}
		
		nextButton =  new FTENPCNextButton();
		nextButton.Sys_Constructor();		
		nextButton.clickParam = FTEConstant.Action.ShowNext;
		this.setNextButton(nextButton);
		flag = 0;
		noButton = evo.getValue("noButton") == true;
	}
	
	protected function setBGRect(x:int,y:int,wid:int,hgt:int):void
	{		
		bg2.rect.width = wid;
		bg2.rect.height = hgt;		
		bg2.rect.x = x;
		bg2.rect.y = y;
		
		bg1.rect.x = x + 10;
		bg1.rect.y = y + 10;
		bg1.rect.width = wid - 30;
		bg1.rect.height = hgt - 30;		
		
	}
	
	public function setTypingText(tt:TypingText):void
	{
		this.typingText = tt;
		tt.rect.y = bg2.rect.y + 40;
		tt.rect.x = bg2.rect.x + bg2.rect.width - tt.rect.width - 35;
		tt.typeEndFunc = _typeEndFunc;
	}
	
	protected function _typeEndFunc():void
	{
		nextButton.SetVisible(!noButton);			
		if(nextButton.clickParam != FTEConstant.Action.ShowNext || noButton ) //next.
		{
			if(typeEndFunc)
				typeEndFunc(typingText);
		}
		
	}
	public function setNextButton(b:SimpleButton):void
	{
		this.nextButton = b;
		nextButton.SetVisible(false);
		
		b.rect.x = bg2.rect.x + bg2.rect.width - b.rect.width - 30;
		b.rect.y = bg2.rect.y + bg2.rect.height - b.rect.height - 30;
		
		if(b.clickParam == FTEConstant.Action.ShowNext)
		{
			b.OnClick = startFadeOut;
		}
		
	}
	
	
	protected function startFadeOut(params:Object):void
	{
		if(typeEndFunc)
			typeEndFunc(typingText);
		flag = 1;
		///send LOG......
		if(this.biVO)
		{
			UnityNet.SendBI(Constant.BIType.FTE,biVO.step,biVO.slice);
		}
	}
	
	public function Update():void
	{
		if(nextButton)
			nextButton.Update();
		if(typingText)
			typingText.Update();
			
		if(flag == 1)
		{
			this.rect.x += Time.deltaTime * MenuMgr.SCREEN_WIDTH * 4;	// 1/2 seconds
			if(rect.x >= MenuMgr.SCREEN_WIDTH)
			{
				this.visible = false;
				flag = 2;
			}
		}
	}
	
	public function FixedUpdate():void
	{
		
	}
	
	public function Draw()
	{
		if(!visible)
			return;
			
		GUI.BeginGroup(rect);
			
			bg1.Draw();
			bg2.Draw();
			if(npc)
			{
				//DrawTextureClipped( npc, Rect(0,10,npc.width,npc.height-10),  Rect(npcx,npcy + 10,npc.width, npc.height - 10),  UIRotation.None);
				// cut off the white line ..
				GUI.BeginGroup(Rect(npcx,npcy + 10,npcw,npch));
					GUI.DrawTexture(Rect(0,-10,npcw,npch), npc );
				GUI.EndGroup();
			}
			
			if(typingText)
				typingText.Draw();
				
			if(nextButton)
				nextButton.Draw();
			
		GUI.EndGroup();
	}


}