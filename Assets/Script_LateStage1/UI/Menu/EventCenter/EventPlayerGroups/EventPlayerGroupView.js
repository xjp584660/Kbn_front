#pragma strict

import System.Text;

public class EventPlayerGroupView extends UIObject {
	@SerializeField private var descLabel : Label;
	@SerializeField private var pillar : Label;
	@SerializeField private var pillarHighlight : Label;
	@SerializeField private var shield : Label;
	@SerializeField private var shieldEffect : Label;
	private var shieldEffectAnim : LabelFrameAnimator;
	private var shieldEffectSpt : TileSprite;
	
	@SerializeField private var rewardIconDefaultBg : Label;
	@SerializeField private var rewardIcon : Label;
	@SerializeField private var rewardFrame : Label;
	@SerializeField private var rewardEffect : Label;
	@SerializeField private var rewardInspectBtn : Button; // To inspect chests
	private var rewardEffectAnim : LabelFrameAnimator;
	private var rewardEffectSpt : TileSprite;
	
	@SerializeField private var pillarColorPlayer : Color;
	@SerializeField private var pillarColorOther : Color;
	@SerializeField private var pillarHighlightMaxAlpha : float = 1f;
	@SerializeField private var pillarHighlightMinAlpha : float = 0.8f;
	@SerializeField private var pillarHighlightPeriod : float = 1f;
	@SerializeField private var pillarHighlightHeightDiff : float;
	
	@SerializeField private var pillarIconDistance : float;
	@SerializeField private var shieldOffset : Vector2;
	@SerializeField private var shieldEffectOffset : Vector2;
	@SerializeField private var descLabelOffset : Vector2;
	@SerializeField private var pillarHighlightOffset : Vector2;
	
	private var userInGroup : boolean;
	private var timeElapsed : float;
	private var pillarHighlightAlpha : float;
	private var needInspectBtn : boolean;
	private var rewardCategory : int;
	private var rewardId : int;
	private var rewardInspectBtnScreenRect : Rect;
	
	@System.Serializable
    public class GroupViewLayoutConfig {
    	@SerializeField private var pillarHeight : float;
    	@SerializeField private var xOffset : float;
    	
    	public function get PillarHeight() : float {
    		return pillarHeight;
    	}
    	
    	public function get XOffset() : float {
    		return xOffset;
    	}
    }

	public function Init(layoutConfig : GroupViewLayoutConfig, 
			data : EventCenterGroupBasicInfo, groupIndex : int, userInGroup : boolean) {
		this.userInGroup = userInGroup;
		InitDescLabel(data);
		InitPillar();
		InitPillarHighlight();
		shield.mystyle.normal.background = TextureMgr.instance().LoadTexture(String.Format("league_{0}", groupIndex), TextureType.DECORATION);
		InitTopReward(data);
		InitEffects();
		InitLayout(layoutConfig);
		timeElapsed = 0f;
	}
	
	private function InitDescLabel(data : EventCenterGroupBasicInfo) {
		var sb : StringBuilder = new StringBuilder();
		sb.Append(data.Title);
		sb.Append("\nLv ");
		sb.Append(data.MinLevel);
		if (data.MaxLevel == int.MaxValue) {
			sb.Append(" +");
		} else {
			sb.Append(" - ");
			sb.Append(data.MaxLevel);
		}
		descLabel.txt = sb.ToString();
	}
	
	private function InitPillar() {
		pillar.mystyle.normal.background = TextureMgr.instance().LoadTexture("league_Column", TextureType.DECORATION);
	}
	
	private function InitPillarHighlight() {
		pillarHighlight.mystyle.normal.background = TextureMgr.instance().LoadTexture("league_ColumnHighlight", TextureType.DECORATION);
	}
	
	private function InitTopReward(data : EventCenterGroupBasicInfo) {
		rewardIconDefaultBg.useTile = true;
		rewardIconDefaultBg.tile = TextureMgr.instance().BackgroundSpt().GetTile("icon_default_bg");
		rewardIcon.useTile = true;
		rewardIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		rewardIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(data.TopRewardItemId);
		rewardFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("chestFrame", TextureType.DECORATION);
		rewardFrame.SetVisible(userInGroup);
		rewardId = data.TopRewardItemId;
		rewardCategory = MyItems.GetItemCategoryByItemId(rewardId);
		if (rewardCategory in [MyItems.Category.Chest, MyItems.Category.MystryChest, MyItems.Category.LevelChest, MyItems.Category.TreasureChest]) {
			needInspectBtn = true;
		}
		rewardInspectBtn.OnClick = OnClickRewardInspectBtn;
	}
	
	private function InitEffects() {
		shieldEffect.SetVisible(userInGroup);
		if (userInGroup) {
			shieldEffectSpt = TileSprite.CreateSprite(TextureMgr.instance().LoadText("EventPlayerGroupAnim", TextureType.ATLAS));
			shieldEffectAnim = new LabelFrameAnimator(shieldEffect, shieldEffectSpt, "EventPlayerGroupAnim_000", 8, 8f);
			shieldEffectAnim.Play();
		}
		
		rewardEffect.SetVisible(userInGroup);
		if (userInGroup) {
			rewardEffectSpt = TileSprite.CreateSprite(TextureMgr.instance().LoadText("DailyLoginUIAnim", TextureType.ATLAS));
			rewardEffectAnim = new LabelFrameAnimator(rewardEffect, rewardEffectSpt, "xingxing_000", 8, 6f);
			rewardEffectAnim.Play();
		}
	}
	
	private function InitLayout(layoutConfig : GroupViewLayoutConfig) {
		this.rect = new Rect(layoutConfig.XOffset - rect.width * .5f, rect.y, rect.width, rect.height);
		pillar.rect = new Rect((rect.width - pillar.rect.width) * .5f, 
				rect.yMax - layoutConfig.PillarHeight, pillar.rect.width, layoutConfig.PillarHeight);
		pillarHighlight.rect = new Rect((rect.width - pillarHighlight.rect.width) * .5f + pillarHighlightOffset.x,
				rect.yMax - layoutConfig.PillarHeight - pillarHighlightOffset.y,
				pillarHighlight.rect.width, layoutConfig.PillarHeight - pillarHighlightHeightDiff);
				
		shield.rect = new Rect((rect.width - shield.rect.width) * .5f + shieldOffset.x, 
				rect.yMax - shieldOffset.y, shield.rect.width, shield.rect.height);
		shieldEffect.rect = new Rect((rect.width - shieldEffect.rect.width) * .5f + shieldEffectOffset.x,
				rect.yMax - shieldEffectOffset.y, shieldEffect.rect.width, shieldEffect.rect.height);
		rewardFrame.rect = new Rect((rect.width - rewardFrame.rect.width) * .5f, 
				pillar.rect.y - pillarIconDistance - rewardFrame.rect.height, 
				rewardFrame.rect.width, rewardFrame.rect.height);
		rewardInspectBtn.rect = rewardFrame.rect;
		rewardEffect.rect = new Rect((rect.width - rewardEffect.rect.width) * .5f,
				rewardFrame.rect.center.y - rewardEffect.rect.height * .5f,
				rewardEffect.rect.width, rewardEffect.rect.height);
		rewardIcon.rect = rewardIconDefaultBg.rect = new Rect(rewardFrame.rect.center.x - rewardIcon.rect.width * .5f, 
				rewardFrame.rect.center.y - rewardIcon.rect.height * .5f,
				rewardIcon.rect.width, rewardIcon.rect.height);
		descLabel.rect = new Rect((rect.width - descLabel.rect.width) * .5f + descLabelOffset.x,
				descLabelOffset.y, 
				descLabel.rect.width, descLabel.rect.height);
	}
	
	public function Update() {
		if (rewardEffectAnim != null && rewardEffectAnim.IsPlaying) {
			rewardEffectAnim.Update();
		}
		if (shieldEffectAnim != null && shieldEffectAnim.IsPlaying) {
			shieldEffectAnim.Update();
		}
		UpdatePillarHighlight();
	}
	
	private function UpdatePillarHighlight() {
		if (!userInGroup) {
			return;
		}
		timeElapsed += Time.deltaTime;
		var cos : float = Mathf.Cos(2 * Mathf.PI / pillarHighlightPeriod * timeElapsed);
		pillarHighlightAlpha = .5f * (cos * (pillarHighlightMaxAlpha - pillarHighlightMinAlpha) + pillarHighlightMaxAlpha + pillarHighlightMinAlpha);
	}
	
	public function OnPopped() {
		if (rewardEffectAnim != null && rewardEffectAnim.IsPlaying) {
			rewardEffectAnim.Stop();
		}
		if (shieldEffectAnim != null && shieldEffectAnim.IsPlaying) {
			shieldEffectAnim.Stop();
		}
	}
	
	public function Draw() {
		GUI.BeginGroup(this.rect);
		DrawPillar();
		DrawPillarHighLight();
		descLabel.Draw();
		
		shieldEffect.Draw();
		shield.Draw();
		
		rewardIconDefaultBg.Draw();
		rewardIcon.Draw();
		rewardFrame.Draw();

		rewardEffect.Draw();

		if (needInspectBtn) {
			rewardInspectBtn.Draw();
			rewardInspectBtnScreenRect = _Global.CalcScreenRect(rewardInspectBtn.rect);
		}
		GUI.EndGroup();
	}
	
	private function DrawPillar() {
		var cachedBgColor : Color = GUI.backgroundColor;
		GUI.backgroundColor = userInGroup ? pillarColorPlayer : pillarColorOther;
		pillar.Draw();
		GUI.backgroundColor = cachedBgColor;
	}
	
	private function DrawPillarHighLight() {
		if (!userInGroup) {
			return;
		}
		var cachedGUIBgColor : Color = GUI.backgroundColor;
		GUI.backgroundColor = new Color(1, 1, 1, pillarHighlightAlpha);
		pillarHighlight.Draw();
		GUI.backgroundColor = cachedGUIBgColor;
	}
	
	private function OnClickRewardInspectBtn(param : System.Object) {
		var id:HashObject = new HashObject({"ID" : rewardId, "Category" : rewardCategory, "inShop" : false});
		var pos : Vector2 = new Vector2(rewardInspectBtnScreenRect.center.x / GameMain.horizRatio, rewardInspectBtnScreenRect.center.y / GameMain.vertRatio);
		MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_zoomComp", pos);
	}
}