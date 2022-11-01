/*
 * @FileName:		MoveCityMenuItem.js
 * @Author:			xue
 * @Date:			2022-04-28 04:36:18
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迁城道具 - UI界面 - 物品项
 *
*/


public class MoveCityMenuItem extends ListItem {
    @Space(30) @Header("MoveCityMenu - Item")

    @SerializeField private var label_Incon: Label;

    @SerializeField private var label_Name: Label;

    @SerializeField private var label_Owned: Label;

    @SerializeField private var label_Info: Label;

    @SerializeField private var label_Describe: Label;

    @SerializeField private var label_Bg: Label;

    @SerializeField private var label_Iine: Label;

    @SerializeField private var label_countDown: Label;

    @SerializeField private var button_Detall: Button;

    @SerializeField private var button_Use: Button;

    private var itemID: String = String.Empty;

    public function Init() {
        super.Init();

        label_Incon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
        label_Incon.useTile = true;

        label_Name.Init();
        label_Owned.Init();

        label_Info.Init();
        label_Describe.Init();
        label_Bg.Init();

        label_Iine.Init();
        button_Detall.Init();
        button_Use.Init();

        label_countDown.Init();

        label_countDown.SetFont(FontSize.Font_18, FontType.TREBUC);
        label_countDown.SetNormalTxtColor(FontColor.Red);

        button_Use.txt = Datas.getArString("Common.Use_button");
        button_Use.OnClick = MoveCityDialog;

    }


    public function Update() {
        priv_updateLessTime();
    }


    public function DrawItem() {
        if (!visible) return;

        label_Bg.Draw();
        label_Incon.Draw();
        label_Name.Draw();
        label_Owned.Draw();

        label_Info.Draw();
        label_Describe.Draw();

        label_Iine.Draw();
        label_countDown.Draw();

        button_Detall.Draw();
        button_Use.Draw();

    }

    public function SetRowData(tempData: Object): void {

        var data: InventoryInfo = tempData as InventoryInfo;

        SetID(data.id);

        var texMgr: TextureMgr = TextureMgr.instance();
        label_Incon.tile.name = texMgr.LoadTileNameOfItem(ID);


        label_Name.txt = Datas.getArString("itemName." + "i" + ID);

        var cnt: int = data.quant;
        label_Owned.txt = Datas.getArString("Common.Owned") + ': ' + cnt;


        label_Describe.txt = data.description;

    }

    /*迁城道具 倒计时间*/
    private function priv_updateLessTime() {
        var myItems: MyItems = MyItems.instance();
        var lessTime: int = myItems.GetItemTimeLeft(ID);
        if (lessTime < 0) {
            label_countDown.SetVisible(false);
        }
        else {
            label_countDown.SetVisible(true);
            label_countDown.txt = _Global.timeFormatShortStr(lessTime, true);
            if (label_countDown.txt == "")
                label_countDown.txt = "0s";
        }
    }


    /*Use 弹窗*/
    private function MoveCityDialog() {

        var leftTime: int = ID;
        var confirmStr: String = Datas.getArString("Teleport.TeleportConfirm_Text2");

        var detail: String[] = TileInfoPopUp.GetDetailInfo();

        confirmStr = confirmStr + "\n" + "(" + detail[0] + "," + detail[1] + ")";
        var cd: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
        cd.setLayout(600, 380);
        cd.setTitleY(120);
        cd.setButtonText(Datas.getArString("Common.OK_Button"), Datas.getArString("Common.Cancel"));
        MenuMgr.getInstance().PushConfirmDialog(confirmStr, "", MoveCity, null);
    }


    /*迁城方法*/
    private function MoveCity(): void {

        var detail: String[] = TileInfoPopUp.GetDetailInfo();

        var x: int = _Global.INT32(detail[0]);
        var y: int = _Global.INT32(detail[1]);

        var leftTime: int = ID;

        MyItems.instance().useTeleportDo(leftTime, x, y);
    }

}