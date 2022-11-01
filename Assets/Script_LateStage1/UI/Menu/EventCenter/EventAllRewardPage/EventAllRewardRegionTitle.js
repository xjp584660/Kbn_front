#pragma strict

public class EventAllRewardRegionTitle extends UIObject {
	@SerializeField private var bgs : Label[];
	@SerializeField private var bgImageName : String;
	@SerializeField private var titleLabel : Label;
	@SerializeField private var titleBack : Label;
	@SerializeField private var titleFllow: Label;

	public function InitAward(titleText : String)
	{
		for (var i : int = 0; i < bgs.Length; ++i) {
			bgs[i].SetVisible(i == 0);
		}
		titleLabel.txt = titleText;
	}

	public function Init(data : EventCenterGroupRewardsPerRank, index : int,prizeType : String) {
		for (var i : int = 0; i < bgs.Length; ++i) {
			bgs[i].SetVisible(i == index);
			//bgs[i].mystyle.normal.background = TextureMgr.instance().LoadTexture(bgImageName, TextureType.DECORATION);
		}
		
		if(index >= 3)
		{
			bgs[2].SetVisible(true);
		}
		
		if(prizeType == EventCenterUtils.RankType.ScoreType)
		{
			titleLabel.txt = String.Format(Datas.getArString("Tournament.ScoreReward_Format"), data.FromRank);
		}
		else
		{
			var prefix : String = (index == 0 ? "Tournament.Topreward_" : "Tournament.Rankreward_");
			var suffix : String = (data.FromRank == data.ToRank ? "1" : "2");
			var titleFormat : String = String.Format("{0}{1}", prefix, suffix);
			titleLabel.txt = String.Format(Datas.getArString(titleFormat), data.FromRank, data.ToRank);
		}
	}

	public function Draw() {
		titleBack.Draw();
		titleFllow.Draw();
		for (var bg : Label in bgs) {
			bg.Draw();
		}
		titleLabel.Draw();
	}
}