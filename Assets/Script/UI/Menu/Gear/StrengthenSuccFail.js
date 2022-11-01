#pragma strict

class StrengthenSuccFail extends UIObject
{
	public var frameBackground:Label;
	
	public var succFailPicLH:Label;
	public var succFailPicRH:Label;
	public var succFailText:Label;
	public var succEffectBG:Label;
	
	public var mightText:Label;
	public var bottomText:Label;
	
	//------------------------------------------------------------
	public override function Init()
	{
		InitLabel();
		InitVariables(); 
		this.SetVisible(false);
	}
	
	private function InitLabel()
	{
		succEffectBG.useTile = true;
		succEffectBG.tile = TextureMgr.instance().GetGearSpt().GetTile("StrengthenSuccessBG");
		//succEffectBG.tile.name = "StrengthenSuccessBG";
		succFailPicLH.setBackground("StrengthenSuccess",TextureType.GEAR);
		succFailPicRH.setBackground("StrengthenSuccess",TextureType.GEAR);
	}
	
	private function InitVariables()
	{
	}
	
	public override function Draw()
	{
		if (!super.visible)
			return;
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = super.alpha;
		
		GUI.BeginGroup(super.rect); 
		
		frameBackground.Draw();
		
		succEffectBG.Draw();
		
		succFailPicLH.Draw();
		succFailPicRH.Draw();
		succFailText.Draw();
		
		bottomText.Draw();
		mightText.Draw();
		
		GUI.EndGroup();
		GUI.color.a = oldAlpha;
	}
	
	public function SetSuccessOrFail(success:boolean)
	{	 
		this.SetVisible(true);
		
		succEffectBG.SetVisible(success);
		succFailText.txt = success ? Datas.getArString("Gear.LvUpSuccessPopTitle") : Datas.getArString("Gear.LvUpFailPopTitle");
		bottomText.txt = success ? Datas.getArString("Gear.LvUpSuccessPopDesc") : Datas.getArString("Gear.LvUpFailPopDesc"); 
		 
		if(success)
		{
			SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.LevelUpGearSuccess);	
		}
		else
		{	
			SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.LevelUpGearFail);	
		}
		 
		BeginExtendAnim();
	} 
	
	public function SetMight(val:int)
	{
		mightText.txt = Datas.getArString("Common.Might") + "+" + val.ToString();  
	}
	
	private function ResetRect()
	{
		super.rect.x = 0; 
		super.rect.y = 300;
		super.rect.width = 640;
		super.rect.height = 390;
	}

	private function BeginExtendAnim()
	{
		ResetRect(); 
		BothwayExtendAnim.StartAnim(this, BothwayExtendAnim.ExtendStyle.UpDown, 1.2f, function()
		{
			TimeStayAnimation.StartAnim(this, 1.0f, function()
			{
				this.SetVisible(false);
			});
		}); 
	}
}