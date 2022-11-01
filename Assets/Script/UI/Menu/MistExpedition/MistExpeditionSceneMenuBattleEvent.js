/*
 * @FileName:		MistExpeditionSceneMenuBattleEvent.js
 * @Author:			lisong
 * @Date:			2022-04-02 05:30:49
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 战斗
 *
*/


public class MistExpeditionSceneMenuBattleEvent extends KBNMenu {

	@Space(30) @Header("---------- MistExpedition SceneMenu BattleEvent ----------") 
	

	@Header("----------language key")
	@SerializeField private var langKey_battleNormal: String;
	@SerializeField private var langKey_battleNormalDesc: String;
	@SerializeField private var langKey_battleElite: String;
	@SerializeField private var langKey_battleEliteDesc: String;
	@SerializeField private var langKey_battleBoss: String;
	@SerializeField private var langKey_battleBossDesc: String;
	@SerializeField private var langKey_battleRandomReward: String;
	@Space(20)


	@SerializeField private var battleType = MistExpeditionMapSlotEventType.Battle_Normal;

	@Space(20)
	@SerializeField private var frameRect: Rect;

	/* BG */
	@Space(20) @Header("---------- BG") 

	@SerializeField private var headRect: Rect;
	@SerializeField private var mask: Label;
	@SerializeField private var backImage: Label;
	@SerializeField private var bgFrame: Label;

	@SerializeField private var leftTopImg: Label;
	@SerializeField private var leftMiddleImg: Label;
	@SerializeField private var leftBottomImg: Label;

	@SerializeField private var rightTopImg: Label;
	@SerializeField private var rightMiddleImg: Label;
	@SerializeField private var rightBottomImg: Label;
	@SerializeField private var centerBottomImg: Label;

	@SerializeField private var iconBG: Label;
	@SerializeField private var topLoop: Label;
	@SerializeField private var line: Label;



	/* Top */
	@Space(20) @Header("---------- Top") 


	@SerializeField private var battleIcon: Label;
	@SerializeField private var battleName: Label;
	@SerializeField private var might: Label;
	@SerializeField private var mightTxt: Label;

	@SerializeField private var dialogBtn: Button;


	/* Center */
	@Space(20) @Header("---------- Center") 

	@SerializeField private var desc: Label;

	@SerializeField private var coinRewardTxt: Label;
	@SerializeField private var coinReward: Label;
	@SerializeField private var randomRewardTxt: Label;
	@SerializeField private var rewardList: ScrollList;
	@SerializeField private var rewardItem: ListItem;



	/* Bottom */
	@Space(20) @Header("---------- Bottom") 

	@SerializeField private var attackBtn: Button;



	private var eventPointId: int = 0;
	private var layer: int = 0;




	public function Init() {

		btnClose.OnClick = handleBack;
		dialogBtn.OnClick = handleClickDialog;


		attackBtn.txt = Datas.getArString("Common.Attack");
		attackBtn.OnClick = OnClickAttack;

		topLoop.setBackground("bossinfo-bg3", TextureType.DECORATION);
		iconBG.setBackground("bossinfo-bg-lv2", TextureType.PVEBOSS);

	
		leftTopImg.setBackground("bossinfo-bg1", TextureType.DECORATION);
		leftMiddleImg.setBackground("bossinfo-bg2", TextureType.DECORATION);
		leftBottomImg.setBackground("bossinfo-bg-bottom", TextureType.DECORATION);



		line.setBackground("between line", TextureType.DECORATION);

		rightTopImg.setBackground("bossinfo-bg1", TextureType.DECORATION);
		rightMiddleImg.setBackground("bossinfo-bg2", TextureType.DECORATION);
		rightBottomImg.setBackground("bossinfo-bg-bottom", TextureType.DECORATION);

		battleName.setBackground("hiddenbossname", TextureType.DECORATION);


		var texMgr: TextureMgr = TextureMgr.instance();
		marginT = texMgr.LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);

		coinRewardTxt.txt = Datas.getArString("Common.Rewards");
		randomRewardTxt.txt = Datas.getArString(langKey_battleRandomReward);

		bgFrame.Init();

		//resetLayout();

	}

	public function resetLayout() {
		//repeatTimes = (frameRect.height - 15) / 20;

	}

	protected function DrawBackground() {
		if (Event.current.type != EventType.Repaint)
			return;

		GUI.BeginGroup(frameRect);

		backImage.Draw();
		
		GUI.EndGroup();

		bgFrame.Draw();

		GUI.BeginGroup(headRect);
		iconBG.Draw();

		GUI.EndGroup();

		topLoop.Draw();

		battleIcon.Draw();

		leftTopImg.Draw();
		leftBottomImg.Draw();
		rightTopImg.Draw();
		rightBottomImg.Draw();

	}

	public function DrawItem() {

		line.Draw();
		leftMiddleImg.Draw();
		rightMiddleImg.Draw();
		centerBottomImg.Draw();
		battleName.Draw();



		might.Draw();
		mightTxt.Draw();

		desc.Draw();


		coinRewardTxt.Draw();
		coinReward.Draw();
		randomRewardTxt.Draw();

		rewardList.Draw();

		dialogBtn.Draw();
		btnClose.Draw();
		attackBtn.Draw();

	}

	function OnPush(param: Object) {

		checkIphoneXAdapter();
		RefreshMenu(param);

		SoundMgr.instance().PlayEffect("kbn_pve_levelinterface", "Audio/Pve/");
		GameMain.instance().PlayMusic("PVE Boss Level", TextureType.AUDIO_PVE);

	}


	public function OnPopOver() {
		super.OnPopOver();
		rewardList.Clear();

	}

	public function Update() {
		rewardList.Update();
	}


	var maskColor = new Color(0, 0, 0, 0.5);
	public function DrawMask() {
		if (!visible) return;

		var oldColor: Color = GUI.color;
		GUI.color = maskColor;
		mask.Draw();
		GUI.color = oldColor;
	}



	private function RefreshMenu(params: Object) {

		var data: HashObject = params as HashObject;

		eventPointId = _Global.INT32(data["eventPointId"].Value);
		layer = _Global.INT32(data["layer"].Value);
		battleType = System.Enum.Parse(typeof (MistExpeditionMapSlotEventType), data["battleType"].Value as String);

		leftMiddleImg.rect.height = 60;
		rightMiddleImg.rect.height = 60;
		line.rect.y = 498;

		if (battleType == MistExpeditionMapSlotEventType.Battle_Boss) {
			coinReward.rect.x = 257.5f;
			coinReward.txt = "Random";
		} else {
			var count = MistExpeditionManager.GetInstance().GetRewardExpeditionCoinCountBySlotLayerID(battleType, layer);
			coinReward.rect.x = 280.5f;
			coinReward.txt = count + "";

		}

		var iconName = "";
		var nameKeyStr = "";
		var descKeyStr = "";

		/* 显示随机奖励 buff 的图标 */
		var listItem =  MistExpeditionManager.GetInstance().GetPreviewRewardItemDataListByBattleType(battleType);

		switch (battleType) {
			case MistExpeditionMapSlotEventType.Battle_Normal:
				iconName = "potrait_Grim_Escort";
				nameKeyStr = langKey_battleNormal;
				descKeyStr = langKey_battleNormalDesc;

				break;
			case MistExpeditionMapSlotEventType.Battle_Elite:
				iconName = "potrait_Fey Knight";
				nameKeyStr = langKey_battleElite;
				descKeyStr = langKey_battleEliteDesc;

				break;
			case MistExpeditionMapSlotEventType.Battle_Boss:
				iconName = "potrait_Dragon";
				nameKeyStr = langKey_battleBoss;
				descKeyStr = langKey_battleBossDesc;

				break;
			default:
				break;
		}


		/* 设置 battle 的icon */
		battleIcon.setBackground(iconName, TextureType.PVEBOSS);
		battleName.txt = Datas.getArString(nameKeyStr);
		desc.txt = Datas.getArString(descKeyStr);


		rewardList.Init(rewardItem);
		rewardList.SetData(listItem.ToArray());
		rewardList.SetVisible(true);
		rewardList.UpdateData();
		rewardList.ResetPos();

		/* 计算 might */
		var mightNum: long = MistExpeditionManager.GetInstance().GetBattleEventMightBySlotID(battleType, layer);
		mightTxt.txt = _Global.NumSimlify(mightNum);

	}



	/* 关闭界面 */
	private function handleBack(){
		MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEvent);
	}


	/* 点击 attack 按钮 */
	function OnClickAttack() {
		handleBack();

		var data: HashObject = new HashObject({
			"eventPointId": eventPointId,
			"layer": layer,
			"battleType": MistExpeditionManager.GetEventTypeIntValue(battleType)
		});

		MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventMarch, data, "trans_zoomComp");

	}

	/* 点击 对话按钮 */
	function handleClickDialog() {


	}



}