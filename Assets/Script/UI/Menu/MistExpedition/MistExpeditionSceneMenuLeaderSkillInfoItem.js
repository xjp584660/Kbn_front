/*
 * @FileName:		MistExpeditionSceneMenuLeaderSkillInfoItem.js
 * @Author:			xue
 * @Date:			2022-05-13 11:43:58
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 领袖技能 - 物品项
 *
*/


public class MistExpeditionSceneMenuLeaderSkillInfoItem extends ListItem {
    @Space(30) @Header("---------- MistExpedition - SceneMenu - LeaderSkillInfo - Item ----------")

	 
	@SerializeField private var panelBackground: Label;

	@SerializeField private var captionBackground: Label;

	@SerializeField private var leaderBuffName: Label;

	@SerializeField private var leaderBuffDescription: Label;

	@SerializeField private var leaderBuffShopBuy: Label;


	private var leaderSkill: MistExpeditionLeaderSkillInfo;


	@Space(20)/*字符串*/
	@SerializeField private var langKey_LeaderSkillUnlock: String;/*远征商人处购买*/
	@SerializeField private var langKey_LeaderName_: String;/*领袖名字 (301为领袖id) */
	@SerializeField private var langKey_LeaderDesc_: String;/*领袖描述 (301为领袖id) */



	public function Init(): void {
		panelBackground.Init();
		captionBackground.Init();
		leaderBuffName.Init();
		leaderBuffDescription.Init();
		leaderBuffShopBuy.Init();
	}

	public function Draw(): int {

		if (!visible) {
			return;
		}

		GUI.BeginGroup(rect);
		panelBackground.Draw();
		captionBackground.Draw();
		leaderBuffName.Draw();
		leaderBuffDescription.Draw();
		leaderBuffShopBuy.Draw();
		
		GUI.EndGroup();

		return -1;
	}

	public function SetRowData(data: Object): void {
		leaderSkill = data as MistExpeditionLeaderSkillInfo;

		/*领袖buff名称*/
		var Name: String = leaderSkill.Name;
		leaderBuffName.txt = Datas.getArString(Name);

		/*领袖buff简介*/
		var Description: String = leaderSkill.Description;
		var type: int = leaderSkill.Type;
		var Value: float;
		if (type == 1) {
			Value = leaderSkill.Value / 100;
			leaderBuffDescription.txt = String.Format(Datas.getArString(Description), Value);
		} else {
			Value = leaderSkill.Value;
			leaderBuffDescription.txt = String.Format(Datas.getArString(Description), Value);
		}

		

		/*该buff是否已购买*/
		var isBuffShop: boolean = _Global.GetBoolean(leaderSkill.alreadyOwned);
		leaderBuffDescription.SetNormalTxtColor(isBuffShop ? FontColor.Light_Yellow : FontColor._Title2_);
		leaderBuffName.SetNormalTxtColor(isBuffShop ? FontColor.Light_Yellow : FontColor._Title2_);

		if (isBuffShop == true) /*等于true 就是已拥有*/{
			leaderBuffShopBuy.txt = "";
		} else /*需要购买*/{
			leaderBuffShopBuy.txt = Datas.getArString(langKey_LeaderSkillUnlock);/*远征商人处购买解锁*/
			leaderBuffShopBuy.SetNormalTxtColor(FontColor.Red);/*字体颜色设置为红色*/
		}
	}

	
}