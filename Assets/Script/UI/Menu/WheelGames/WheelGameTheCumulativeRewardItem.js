/*
 * @FileName:		WheelGameTheCumulativeRewardItem.js
 * @Author:			xue
 * @Date:			2022-10-26 11:36:21
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 累计奖励 - Item
 *
*/


public class WheelGameTheCumulativeRewardItem extends ListItem {

    @Space(30) @Header("WheelGame TheCumulative Reward - Item")

    @SerializeField private var titleLabel: SimpleLabel;
    @SerializeField private var itemIcon: ItemPic;
    @SerializeField private var itemButton: SimpleButton;
    @SerializeField private var itemNameLabel: SimpleLabel;



    @SerializeField private var itemDescLabel: SimpleLabel;
    @SerializeField private var quantityLabel: SimpleLabel;
    @SerializeField private var claimButton: Button;
    @SerializeField private var splitLine: SimpleLabel;



    @SerializeField private var titleRewardKey: String;
    @SerializeField private var titleSpendKey: String;
    @SerializeField private var claimToasterKey: String;
    @SerializeField private var splitLineImageName: String = "between line_list_small";


    @SerializeField private var milestone: GameEventDetailInfoSpendNGet.Milestone;
    @SerializeField private var reward: GameEventDetailInfoSpendNGet.Reward;
    @SerializeField private var itemCategory: MyItems.Category;
    @SerializeField private var eventId: int = -1;




    public function get Index(): int {
        return milestone.Index;
    }

    public function Init(): void {
        claimButton.changeToBlueNew();
        claimButton.txt = Datas.getArString("EventCenter.ClaimBtn");
        claimButton.OnClick = OnClaimButton;

        splitLine.mystyle.normal.background = TextureMgr.instance().LoadTexture(splitLineImageName, TextureType.DECORATION);
        itemButton.rect = itemIcon.rect;
    }

    public function Draw(): int {
        if (!visible) {
            return -1;
        }

        GUI.BeginGroup(rect);
        titleLabel.Draw();
        itemIcon.Draw();
        itemButton.Draw();
        itemNameLabel.Draw();
        itemDescLabel.Draw();
        quantityLabel.Draw();
        claimButton.Draw();
        splitLine.Draw();
        GUI.EndGroup();

        return -1;
    }

    public function SetRowData(data: System.Object): void {
        var dataDict: Hashtable = data as Hashtable;
        eventId = dataDict["eventId"];
        milestone = dataDict["milestone"] as GameEventDetailInfoSpendNGet.Milestone;

        reward = milestone.Rewards[0];

        var titleStringA: String = String.Format(Datas.getArString(titleRewardKey), Index + 1);
        var titleStringB: String = String.Format(Datas.getArString(titleSpendKey), milestone.GemsCount);
        titleLabel.txt = String.Format("{0} {1}", titleStringA, titleStringB);

        itemIcon.SetId(reward.ItemId);
        itemButton.SetDisabled(true);
        itemButton.OnClick = OnItemButton;

        itemNameLabel.txt = Datas.getArString(String.Format("itemName.i{0}", reward.ItemId));
        itemDescLabel.txt = Datas.getArString(String.Format("itemDesc.i{0}", reward.ItemId));

        UpdateClaimButton();
        UpdateQuantityLabel();

        if (MystryChest.instance().IsMystryChest_Temp(reward.ItemId)) {
            itemCategory = MyItems.Category.UnknowItem;
            MystryChest.instance().AddLoadMystryChestCallback(OnMystryChestLoaded);
        }
        else {
            itemCategory = MyItems.GetItemCategoryByItemId(reward.ItemId);
            if (itemCategory == MyItems.Category.Chest) {
                itemButton.SetDisabled(false);
            }
        }
    }

    private function UpdateQuantityLabel(): void {
        quantityLabel.txt = String.Format("{0}: {1}", Datas.getArString("Common.Quantity"), reward.ClaimableNum);
    }

    private function UpdateClaimButton(): void {
        if (reward.ClaimableNum <= 0) {
            claimButton.changeToGreyNew();
        }
        else {
            claimButton.changeToBlueNew();
        }
    }

    private function OnMystryChestLoaded(): void {
        itemCategory = MyItems.GetItemCategoryByItemId(reward.ItemId);
        itemButton.SetDisabled(false);
        itemIcon.SetId(reward.ItemId);
    }

    private function OnItemButton(): void {
        MenuMgr.getInstance().PushMenu("ChestDetail",
            new HashObject({ "ID": reward.ItemId, "Category": itemCategory, "inShop": false }),
            "trans_zoomComp");
    }

    private function OnClaimButton(): void {
        EventCenter.getInstance().ReqClaimSpendNGetReward(eventId, milestone.Index, OnClaimSuccess);
    }

    private function OnClaimSuccess(result: HashObject): void {
        var rewardKeys: String[] = _Global.GetObjectKeys(result["reward"]);
        if (rewardKeys.Length == 0) {
            return;
        }

        var firstRewardNode: HashObject = result["reward"][String.Format("{0}0", _Global.ap)];

        var itemName: String = Datas.getArString(String.Format("itemName.i{0}", _Global.INT32(firstRewardNode["itemId"])));
        var quantity: int = _Global.INT32(firstRewardNode["quantity"]);
        MenuMgr.getInstance().PushMessage(String.Format(Datas.getArString(claimToasterKey), itemName, quantity));
        reward.ClaimableNum -= quantity;

        MyItems.singleton.AddItem(_Global.INT32(firstRewardNode["itemId"]), quantity);
        UpdateClaimButton();
        UpdateQuantityLabel();
    }
}