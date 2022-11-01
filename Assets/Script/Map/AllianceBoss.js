import UnityEngine;
import System.Collections;
public class AllianceBoss extends SlotBuildController
{
	private static var ANIMATION_DEFALT :String = "Idle";
	private static var ANIMATION_SHAKE :String = "pve-cave-bg-front_quxian";
	private static var ANIMATION_LEFT_IN :String = "pve-cave-bg-front_boss_left_in_quxi";
	private static var ANIMATION_LEFT_OUT :String = "pve-cave-bg-front_boss_left_out_quxi";
	private static var ANIMATION_RIGHT_IN :String = "pve-cave-bg-front_boss_in_quxian";
	private static var ANIMATION_RIGHT_OUT :String = "pve-cave-bg-front_boss_right_out_quxi";
	private static var ANIMATION_BOSS_DIE :String = "pve-cave-bg-front_boss_die_quxian";
	@SerializeField private var sceneCamera : Camera;
	@SerializeField private var bossAndHealthLabel : GameObject;
	@SerializeField private var levelText : GameObject;
	@SerializeField private var preBossHead : GameObject;
	@SerializeField private var preAttackAnimation : GameObject;
	@SerializeField private var effect : GameObject;
	@SerializeField private var health : GameObject;
	@SerializeField private var healthPos1 : Vector3;
	@SerializeField private var healthPos2 : Vector3;
	@SerializeField private var bgFirst : GameObject;
	@SerializeField private var bgSecond1 : GameObject;
	@SerializeField private var bgSecond2 : GameObject;
//	@SerializeField private var bossIndex : GameObject;
	@SerializeField private var colorHealth1 : Color;
	@SerializeField private var colorHealth2 : Color;
	@SerializeField private var attackPos : Vector3[];
	private var bossHead : GameObject = null;
	
	public function Awake() : void
	{
		super.Awake();
		GameMain.instance().onLevelLoaded(GameMain.ALLIANCE_BOSS_LEVEL, this);
		curCamera = sceneCamera;
		bossAndHealthLabel.SetActive(false);
		preAttackAnimation.SetActive(false);
		effect.SetActive(false);
		bgFirst.SetActive(true);
		bgSecond1.SetActive(false);
		bgSecond2.SetActive(false);
//		bossIndex.SetActive(false);
	}
	
	public function Start() : void
	{
	
	}
	
	public function Update() : void
	{
	
	}
	
	public function ShowBoss(curLevel:int, factor:int, curBossIndex:int) : void
	{
		var pveLevel:KBN.DataTable.PveLevel = GameMain.GdsManager.GetGds.<KBN.GDS_PveLevel>().GetItemById(curLevel) as KBN.DataTable.PveLevel;
		if(pveLevel == null)
			return;
		var pveBoss:KBN.DataTable.PveBoss = GameMain.GdsManager.GetGds.<KBN.GDS_PveBoss>().GetItemById(pveLevel.BOSS_ID) as KBN.DataTable.PveBoss;
		if(pveBoss == null)
			return;
		
		bossAndHealthLabel.SetActive(true);
		var tmLevel:TextMesh = levelText.GetComponent(TextMesh) as TextMesh;
		tmLevel.text = pveBoss.LEVEL*factor/100+"";
		InstantiateBoss(pveBoss.LEVEL_BOSS_ICON);
		
//		var tmBossIndex:TextMesh = bossIndex.GetComponent(TextMesh) as TextMesh;
//		tmBossIndex.text = curBossIndex+1+"";
	}
	
	public function HideBoss() : void
	{
		bossAndHealthLabel.SetActive(false);
	}
	
//	public function HideBossIndex() : void
//	{
//		bossIndex.SetActive(false);
//	}
	
	public function ShowEffect() : void
	{
		effect.SetActive(true);
	}
	
	public function HideEffect() : void
	{
		effect.SetActive(false);
	}
	
	private function InstantiateBoss(iconNam:String)
	{
		var tempBossHead = bossHead;
		// add boss
		var bossSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite(iconNam, Constant.AnimationSpriteType.AllianceBossHead);
		if(bossSprTmp != null)
		{
			bossHead = Instantiate(bossSprTmp);
			if(tempBossHead != null)
			{
				bossHead.transform.position = tempBossHead.transform.position;
				bossHead.transform.rotation = tempBossHead.transform.rotation;
				bossHead.transform.localScale = tempBossHead.transform.localScale;
				GameObject.Destroy(tempBossHead);
			}
			else
			{
				bossHead.transform.position = preBossHead.transform.position;
				bossHead.transform.rotation = preBossHead.transform.rotation;
				bossHead.transform.localScale = preBossHead.transform.localScale;
			}
			
			bossHead.name = iconNam;
			bossHead.transform.parent = bossAndHealthLabel.transform;
			//add box collider
			bossHead.AddComponent(BoxCollider);
		}
	}
	
	public function OnHitSlot(slotId:int)
	{
	
	}
	
	public function SetHp(_curHp:double, _totalHP:double)
	{
		if(_totalHP == 0)
			throw new System.ApplicationException("SetHp Error.");
		var lineRenderer:LineRenderer = health.GetComponent ("LineRenderer") as LineRenderer;
		var rate:float = _curHp/_totalHP;
		var newX:float = healthPos2.x + (healthPos1.x - healthPos2.x)*rate;
		var v0:Vector3 = new Vector3(newX, healthPos1.y, healthPos1.z);
		lineRenderer.SetPosition (0, v0);
		var c1 : Color = Color.Lerp(colorHealth1, colorHealth2, rate);
		lineRenderer.SetColors(c1, c1);
	}
	
	public function ShowFirstBg()
	{
		bgFirst.SetActive(true);
		bgSecond1.SetActive(false);
		bgSecond2.SetActive(false);
	}
	
	public function ShowSecondBg()
	{
		bgFirst.SetActive(false);
		bgSecond1.SetActive(true);
		bgSecond2.SetActive(true);
	}
	
	public function PlayAnimationLeftOut()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_LEFT_OUT);
		}
	}
	
	public function PlayAnimationLeftIn()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_LEFT_IN);
		}
	}
	
	public function PlayAnimationRightOut()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_RIGHT_OUT);
		}
	}
	
	public function PlayAnimationRightIn()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_RIGHT_IN);
		}
	}
	
	public function PlayAnimationMiddleOut()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_BOSS_DIE);
			SoundMgr.instance().PlayEffect("kbn ally dungeon 3.3 boss withdrawal", "Audio/Pve/");
		}
	}
	
	public function PlayAnimationShake()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_SHAKE);
		}
	}
	
	public function PlayAnimationDefalt()
	{
		var animator:Animator = bossAndHealthLabel.GetComponent(Animator); 
		if(animator != null)
		{
			animator.Play(ANIMATION_DEFALT);
		}
	}
	
	public function toFront()
	{
		MenuMgr.getInstance().PushMenu("AllianceBossListMenu",null,"trans_immediate_hide_bottom" );
	}
	
	public function toBack()
	{
		super.toBack();
		ClearBossHead();
	}
	
	public function ClearBossHead()
	{
		bossAndHealthLabel.transform.position = new Vector3(0, 0, 0);
		PlayAnimationDefalt();
		if(bossHead!=null)
			GameObject.Destroy(bossHead);
		bossHead=null;
	}
	
	public function CreateAttackAnimation()
	{
		var attackAnimation:GameObject = Instantiate(preAttackAnimation,preAttackAnimation.transform.position, preAttackAnimation.transform.rotation);
		var posIndex:int = Random.Range(0, attackPos.Length-1);
		attackAnimation.transform.position = attackPos[posIndex];
		attackAnimation.transform.eulerAngles.y = Random.Range(0, 360);
		attackAnimation.transform.parent = transform;
		attackAnimation.SetActive(true);
		SoundMgr.instance().PlayEffect("kbn ally dungeon 1.2 boss attack", "Audio/Pve/");
	}
}