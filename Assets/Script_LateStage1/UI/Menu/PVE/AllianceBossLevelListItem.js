
class AllianceBossLevelListItem extends ListItem
{
	enum Type
	{
		TYPE_UNLOCK = 0,
		TYPE_CURRENT = 1,
		TYPE_LOCKED = 2,
	};
	public var m_type:Type;
	@SerializeField private var circleBack :SimpleLabel;
	@SerializeField private var btnReset :Button;
	@SerializeField private var resetLight :FlickerLabel;
	@SerializeField private var animLabel:AnimationLabel;
//	@SerializeField private var doubleArraw:DoubleArraw;
	@SerializeField private var btnBack :Button;
	@SerializeField private var btnArrow :Button;
	@SerializeField private var lightTop :FlickerLabel;
	@SerializeField private var nameText :SimpleLabel;
	@SerializeField private var currentTips :SimpleLabel;
	@SerializeField private var levelNum :SimpleLabel;
	@SerializeField private var colorDark :Color;
	@SerializeField private var lockColor :Color;
	@SerializeField private var circleBackRect1 :Rect;
	@SerializeField private var btnResetRect1 :Rect;
	@SerializeField private var btnBackRect1 :Rect;
	@SerializeField private var circleBackRect2 :Rect;
	@SerializeField private var btnResetRect2 :Rect;
	@SerializeField private var btnBackRect2 :Rect;
	private var oldColor:Color;
	var dataItem:KBN.AllianceBossLayerInfo;
//	private var unhideAnimation : Tweener = null;
//	private var defenseStatusMaterial : Material;
//	@System.Serializable
//    private class UnhideAnimationConfig
//    {
//        public var loopCount : int;
//        
//        public var easeType : EaseType;
//        
//        public var duration : float;
//        
//        public var from : float;
//
//        public var to : float;
//        
//        public var shaderName : String;
//        
//        public var paramName : String;
//    }
//    @SerializeField private var unhideAnimationConfig : UnhideAnimationConfig;
//	private var unhideAnimationGammaFactor : float;
//    
//	public function set UnhideAnimationGammaFactor(value : boolean)
//	{
//		unhideAnimationGammaFactor = value;
//		defenseStatusMaterial.SetFloat(unhideAnimationConfig.paramName, unhideAnimationGammaFactor);
//	}
//    
//	public function get UnhideAnimationGammaFactor() : float
//	{
//		return unhideAnimationGammaFactor;
//	}
	
	public function Init():void
	{
		super.Init();
		if(circleBack.mystyle.normal.background == null)
		{
			circleBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui",TextureType.DECORATION);
		}
		btnBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Hexagon-bg", TextureType.DECORATION);
		btnBack.mystyle.active.background = TextureMgr.instance().LoadTexture("pve-cave-Hexagon-bg", TextureType.DECORATION);
		btnBack.OnClick = handleClick;
		btnReset.OnClick = handleReset;
		lightTop.setBackground("Orange_AndDown_gradient",TextureType.DECORATION);
		lightTop.Init();
		btnArrow.setNorAndActBG("button_moreinfo_small2_normal","button_moreinfo_small2_down");
		levelNum.txt = "";
		currentTips.txt = "Dungeon.CurrentLevel";
		resetLight.setBackground("icon-cave-retry",TextureType.DECORATION);
		resetLight.Init();
//		doubleArraw.Init();
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		oldColor = GUI.color;
		switch(m_type)
		{
		case Type.TYPE_UNLOCK:
			GUI.color = colorDark;	
			break;
		case Type.TYPE_CURRENT:
			break;
		case Type.TYPE_LOCKED:
			GUI.color = colorDark;	
			break;
		}
		btnBack.Draw();
		circleBack.Draw();
		var oldColor2:Color = GUI.color;
		if(m_type == Type.TYPE_LOCKED)
			GUI.color = lockColor;
		btnReset.Draw();
		GUI.color = oldColor2;
		resetLight.Draw();
		btnArrow.Draw();
		lightTop.Draw();
//		DrawLightTop();
		animLabel.Draw();
//		doubleArraw.Draw();
		GUI.color = oldColor;
		nameText.Draw();
		levelNum.Draw();
		currentTips.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		var curLayer:int = KBN.AllianceBossController.instance().curLayer;
		dataItem = data as KBN.AllianceBossLayerInfo;
		if(dataItem.layer<curLayer)
			m_type = Type.TYPE_UNLOCK;
		else if(dataItem.layer==curLayer)
			m_type = Type.TYPE_CURRENT;
		else
			m_type = Type.TYPE_LOCKED;
		
		nameText.txt = String.Format(Datas.getArString("Dungeon.Level"), dataItem.layer+1);//"Dungeon"
		switch(m_type)
		{
		case Type.TYPE_UNLOCK:
			circleBack.rect = circleBackRect1;
			btnReset.rect = btnResetRect1;
			btnBack.rect = btnBackRect1;
			btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui3", TextureType.DECORATION);
			btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui3", TextureType.DECORATION);
			
			resetLight.SetVisible(false);
//			doubleArraw.SetVisible(false);
			lightTop.SetVisible(false);
			btnArrow.SetVisible(true);
			levelNum.SetVisible(true);
			currentTips.SetVisible(false);
			nameText.SetVisible(true);
			nameText.rect.y = 52;
			var levelCount1:int = dataItem.levelList.Count;
			levelNum.txt = levelCount1+"/"+levelCount1;
			break;
		case Type.TYPE_CURRENT:
			circleBack.rect = circleBackRect1;
			btnReset.rect = btnResetRect1;
			btnBack.rect = btnBackRect1;
			nameText.rect.y = 52;
			
			if(!KBN.AllianceBossController.instance().IsInProgress() || !KBN.AllianceBossController.instance().IsFail())
			{
				resetLight.SetVisible(false);
				if(KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0)
				{
					btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui3", TextureType.DECORATION);
					btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui3", TextureType.DECORATION);
				}
				else
				{
					btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui1", TextureType.DECORATION);
					btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui1", TextureType.DECORATION);
				}
				
				currentTips.SetVisible(false);
				nameText.SetVisible(true);
				var levelCount2:int = dataItem.levelList.Count;
				levelNum.txt = KBN.AllianceBossController.instance().curLevelIndex+1+"/"+levelCount2;
				levelNum.SetVisible(true);
			}
			else
			{
				resetLight.SetVisible(true);
				btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("button-cave-Retry", TextureType.DECORATION);
				btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("button-cave-Retry", TextureType.DECORATION);
				currentTips.txt = Datas.getArString("Dungeon.CurrentLevel");
				currentTips.SetVisible(true);
				nameText.SetVisible(false);
				levelNum.SetVisible(false);
			}
			
//			doubleArraw.SetVisible(true);
			lightTop.SetVisible(true);
			btnArrow.SetVisible(true);
//			defenseStatusMaterial = new Material(Shader.Find(unhideAnimationConfig.shaderName));
//			StartUnhideAnimation();
			break;
		case Type.TYPE_LOCKED:
			circleBack.rect = circleBackRect2;
			btnReset.rect = btnResetRect2;
			btnBack.rect = btnBackRect2;
			btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_whisper", TextureType.ICON);
			btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("icon_whisper", TextureType.ICON);
			
			resetLight.SetVisible(false);
//			doubleArraw.SetVisible(false);
			lightTop.SetVisible(false);
			btnArrow.SetVisible(false);
			levelNum.SetVisible(false);
			currentTips.SetVisible(false);
			nameText.SetVisible(true);
			nameText.rect.y = 40;
			break;
		}
	}
	
	public function ShowAnimation()
	{
		if(m_type == Type.TYPE_CURRENT)
		{
			animLabel.Init("tongyongbaopo000", 6, AnimationLabel.LABEL_STATE.ANIMATION);
			animLabel.Start();
			if(!KBN.AllianceBossController.instance().IsInProgress() || !KBN.AllianceBossController.instance().IsFail())
			{
				resetLight.SetVisible(false);
				if(KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0)
				{
					btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui3", TextureType.DECORATION);
					btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui3", TextureType.DECORATION);
				}
				else
				{
					btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui1", TextureType.DECORATION);
					btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("pve-cave-Attackui1", TextureType.DECORATION);
				}
				currentTips.SetVisible(false);
				nameText.SetVisible(true);
				var levelCount = dataItem.levelList.Count;
				levelNum.txt = KBN.AllianceBossController.instance().curLevelIndex+1+"/"+levelCount;
				levelNum.SetVisible(true);
			}
			else
			{
				resetLight.SetVisible(true);
				btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("button-cave-Retry", TextureType.DECORATION);
				btnReset.mystyle.active.background = TextureMgr.instance().LoadTexture("button-cave-Retry", TextureType.DECORATION);
				currentTips.txt = Datas.getArString("Dungeon.CurrentLevel");//reset this layer
				currentTips.SetVisible(true);
				nameText.SetVisible(false);
				levelNum.SetVisible(false);
			}
		}
	}
	
	public function handleClick()
	{
		if(m_type == Type.TYPE_LOCKED)
			return;
		MenuMgr.getInstance().PushMenu("AllianceBossMenu", dataItem.layer, "trans_immediate_hide_bottom");
	}
	
	public function handleReset()
	{
		if(m_type != Type.TYPE_CURRENT)
			return;
		if(!KBN.AllianceBossController.instance().IsInProgress())
			return;
		if(!KBN.AllianceBossController.instance().IsFail())
			return;
		MenuMgr.getInstance().PushMenu("AllianceBossResetMenu", null, "trans_zoomComp");
	}
	
//	private function StartUnhideAnimation() : void
//	{
//		if (unhideAnimation != null)
//		{
//			return;
//		}
//		UnhideAnimationGammaFactor = unhideAnimationConfig.from;
//		unhideAnimation = HOTween.To(this, unhideAnimationConfig.duration,
//			new TweenParms().Prop("UnhideAnimationGammaFactor", unhideAnimationConfig.to).
//			AutoKill(true).Loops(unhideAnimationConfig.loopCount, LoopType.Yoyo).Ease(unhideAnimationConfig.easeType));
//    }
    
//    private function DrawLightTop(): void
//    {
//		if (!lightTop.isVisible())
//		{
//			return;
//		}
//		Graphics.DrawTexture(lightTop.rect, lightTop.mystyle.normal.background, defenseStatusMaterial);
//    }
}