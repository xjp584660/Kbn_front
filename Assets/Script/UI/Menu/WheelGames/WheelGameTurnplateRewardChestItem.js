/*
 * @FileName:		WheelGameTurnplateRewardChestItem.js
 * @Author:			xue
 * @Date:			2022-11-07 10:23:04
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 宝箱 - 奖励 - 物品项
 *
*/


public class WheelGameTurnplateRewardChestItem extends UIObject {
    @Space(30) @Header("---------- WheelGame- Turnplate - Reward - Chest - Item ----------")

	@SerializeField private var bgImg: Label;
	@SerializeField private var iconImg: Label;
	@SerializeField private var countLabel: Label;
	@SerializeField private var nameLabel: Label;
	@SerializeField private var picBox: FlashLabel;


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
		picBox.Init();
		picBox.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light", TextureType.DECORATION);
		picBox.Screenplay.OnPlayFinish = OnFlashFinish;
		picBox.To = 1.0f;
		picBox.Times = 1;

		iconImg.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		iconImg.useTile = true;
	}


	public function Update() {
		picBox.Update();
	}


	public function Draw(): int {

		if (!visible)
			return;
		GUI.BeginGroup(rect);
		picBox.Draw();
		bgImg.Draw();
		iconImg.Draw();
		nameLabel.Draw();
		countLabel.Draw();
		GUI.EndGroup();

	}

	public function SetData(id: String, count: int): void {
		isShowName = false;
		nameLabel.txt = Datas.getArString("itemName.i" + id);
		var color = nameLabel.mystyle.normal.textColor;
		color.a = 0;
		nameLabel.mystyle.normal.textColor = color;
		if (count == 0) {
			countLabel.SetVisible(false);
		} else {
			countLabel.txt = "x" + count;
			countLabel.SetVisible(true);
		}

		var tileName = TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(id));
		iconImg.tile = TextureMgr.instance().ItemSpt().GetTile(tileName);
		picBox.Begin();

	}

	public function Active() {
		this.rect.x = fromPos.x;
		this.rect.y = fromPos.y;
		this.scaleX = fromScale.x;
		this.scaleY = fromScale.y;

		isActive = true;
		SetVisible(true);
	}



	public function SetAnimeForm(pos: Vector2, sacale: Vector2) {
		fromPos = pos;
		fromScale = sacale;
	}

	public function SetAnimeTo(pos: Vector2, sacale: Vector2) {
		toPos = pos;
		toScale = sacale;
	}




	public function DoAnime() {
		this.rect.x = toPos.x;
		this.rect.y = toPos.y;

		this.scaleX = toScale.x;
		this.scaleY = toScale.y;

		if (animeCallback != null) {
			animeCallback();
		}
	}

	private function OnFlashFinish(screenplay: IScreenplay) {
		var temp: FlashLabel = (screenplay.myObject as FlashLabel);
		temp.Begin();
	}

}