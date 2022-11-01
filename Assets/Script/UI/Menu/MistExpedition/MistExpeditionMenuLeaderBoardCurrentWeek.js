/*
 * @FileName:		MistExpeditionMenuLeaderBoardCurrentWeek.js
 * @Author:			lisong
 * @Date:			2022-04-06 10:11:56
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	本周排行
 *
*/


public class MistExpeditionMenuLeaderBoardCurrentWeek extends UIObject {
    @SerializeField public var scroll: ScrollList;
    @SerializeField public var MistExpeditionMenuLeaderItem: ListItem;

    public function Init() {
        MistExpeditionMenuLeaderItem.Init();
        scroll.Init(MistExpeditionMenuLeaderItem);
    }

    public function Update() {
        scroll.Update();
    }

    public function OnPop() {
        scroll.Clear();
    }

    public function Draw() {
        if (!visible) return;
        scroll.Draw();
    }
}