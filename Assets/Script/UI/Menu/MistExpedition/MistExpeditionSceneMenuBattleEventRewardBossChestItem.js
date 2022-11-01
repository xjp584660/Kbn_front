/*
 * @FileName:		MistExpeditionSceneMenuBattleEventRewardBossChestItem.js
 * @Author:			lisong
 * @Date:			2022-08-09 14:13:00
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 战斗事件点 - Boss 奖励 - 物品项
 *
*/


public class MistExpeditionSceneMenuBattleEventRewardBossChestItem extends UIObject {


	@Space(30) @Header("---------- MistExpedition SceneMenu BattleEvent Reward BossChest Item ----------")

	@SerializeField private var bgImg: Label;
	@SerializeField private var iconImg: Label;
	@SerializeField private var countLabel: Label;
	@SerializeField private var nameLabel: Label;


	@Space(20)
	@SerializeField private var mulSpeed: float = 10.0f;
	@SerializeField private var nameLabelIntervalPos: Vector2 = Vector2.zero;
	@SerializeField private var countLabelIntervalPos: Vector2 = Vector2.zero;


	private var isActive: boolean;
	private var fromPos: Vector2 = Vector2.zero;
	private var fromScale: Vector2 = Vector2.one;
	private var toPos: Vector2 = Vector2.zero;
	private var toScale: Vector2 = Vector2.one;

	private var isShowName: boolean = false;


	public var animeCallback: Function = null;







	public function Init(): void {

		bgImg.Init();
		iconImg.Init();
		countLabel.Init();
		nameLabel.Init();


		iconImg.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		iconImg.useTile = true; 
	}



	public function Draw() {

		if (!visible)
			return;

		bgImg.Draw();
		iconImg.Draw();
		nameLabel.Draw();
		countLabel.Draw();

	}

	public function Update(){
		if (!visible || !isActive)
			return;

		DoAnime();
	}

	public function SetData(id: String, count: int): void {
		isShowName = false;
		nameLabel.txt = Datas.getArString("itemName.i" + id);
		var color = nameLabel.mystyle.normal.textColor;
		color.a = 0;
		nameLabel.mystyle.normal.textColor = color;

		countLabel.txt = "x" + count;

		var tileName = TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(id));
		iconImg.tile = TextureMgr.instance().ItemSpt().GetTile(tileName);

	}

	public function Active() {
		this.rect.x = fromPos.x;
		this.rect.y = fromPos.y;
		this.scaleX = fromScale.x;
		this.scaleY = fromScale.y;

		isActive = true;
		SetVisible(true);
	}



	public function SetAnimeForm(pos:Vector2, sacale:Vector2){
		fromPos = pos;
		fromScale = sacale;
	}

	public function SetAnimeTo(pos: Vector2, sacale:Vector2){
		toPos = pos;
		toScale = sacale;
	}


	

	private function DoAnime(){
		var val = mulSpeed * Time.deltaTime;

		this.rect.x = Mathf.Lerp(this.rect.x, toPos.x, val);
		this.rect.y = Mathf.Lerp(this.rect.y, toPos.y, val);

		this.scaleX = Mathf.Lerp(this.scaleX, toScale.x, val);
		this.scaleY = Mathf.Lerp(this.scaleY, toScale.y, val);

		var val2:float = Mathf.Abs(this.rect.x - toPos.x);

		var alphaVal = 1f - val2 / toPos.x;
		var color = nameLabel.mystyle.normal.textColor;
		color.a = alphaVal;
		nameLabel.mystyle.normal.textColor = color;

		color = countLabel.mystyle.normal.textColor;
		color.a = alphaVal;
		countLabel.mystyle.normal.textColor = color;

		if (val2 < 0.001f)
		{
			isActive = false;
			isShowName = true;

			this.rect.x = toPos.x;
			this.rect.y = toPos.y;
			this.scaleX = toScale.x;
			this.scaleY = toScale.y;

			color = nameLabel.mystyle.normal.textColor;
			color.a = 1f;
			nameLabel.mystyle.normal.textColor = color;

			color = countLabel.mystyle.normal.textColor;
			color.a = 1f;
			countLabel.mystyle.normal.textColor = color;

			if (animeCallback != null)
				animeCallback();
		}


		bgImg.rect.x = this.rect.x;
		bgImg.rect.y = this.rect.y;
		bgImg.scaleX = this.scaleX;
		bgImg.scaleY = this.scaleY;

		
		iconImg.rect.x = this.rect.x;
		iconImg.rect.y = this.rect.y;
		iconImg.scaleX = this.scaleX;
		iconImg.scaleY = this.scaleY;


		nameLabel.rect.x = this.rect.x + nameLabelIntervalPos.x;
		nameLabel.rect.y = this.rect.y + nameLabelIntervalPos.y;
		nameLabel.scaleX = this.scaleX;
		nameLabel.scaleY = this.scaleY;


		countLabel.rect.x = this.rect.x + countLabelIntervalPos.x;
		countLabel.rect.y = this.rect.y + countLabelIntervalPos.y;
		countLabel.scaleX = this.scaleX;
		countLabel.scaleY = this.scaleY;
	}

}
