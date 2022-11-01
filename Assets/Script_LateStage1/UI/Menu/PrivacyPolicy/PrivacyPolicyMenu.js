

class PrivacyPolicyMenu extends PopMenu 
{
    @SerializeField private var rankItem: ListItem;
    @SerializeField private var backLabel2: Label;
    @SerializeField private var btnBack: Button;
    @SerializeField private var btnPolicy: Button;
    @SerializeField private var btnService: Button;
    @SerializeField private var scroll: ScrollView;
    @SerializeField private var privacyPolicyLabel: Label;
    @SerializeField private var serveClauseLabel: Label;
    @SerializeField private var privacyPolicyUrl: Button;
    @SerializeField private var serveClauseUrl: Button;
    var data: Datas;

    private static var isChecked = false;/* 检测一次是否已经有同意隐私条款 */
    private static var isServiced: boolean;/* 是否已经接受隐私条款 */
    public static function IsPrivacyPolicyServiced(): boolean{

        if (!isChecked) {
            isChecked = true;
            isServiced = false;

            var dirPath: String = KBN._Global.ApplicationPersistentDataPath + "/Privacy";
            var filePath = dirPath + "/PrivacyPolicyMenu.txt";

            if (System.IO.Directory.Exists(dirPath) && System.IO.File.Exists(filePath)) {
                var privacyMessage: String = System.IO.File.ReadAllText(filePath);

                isServiced = !String.IsNullOrEmpty(privacyMessage);

            }
        }
        return isServiced;
    }



    function Init()
    {
        data = Datas.instance();
        super.Init();
        rankItem.Init();
        backLabel2.Init();
        btnBack.Init();
        btnPolicy.Init();
        btnService.Init();
        scroll.Init();
        privacyPolicyLabel.Init();
        serveClauseLabel.Init();
        privacyPolicyUrl.Init();
        serveClauseUrl.Init();


        /*var ItemTxt: String = "DECAGames是一家专注于游戏运营和服务的独立发行商，" +
        //    "拥有丰富的游戏运营经验和技术团队。之后将继续为亚瑟王国（Kingdoms of Camelot: Battle for the North）" +
        //    "提供优质的服务。  这对于您来说意味着什么？ - 您的游戏和进度将不会改变！ - 您可以继续使用 iOS 或是安卓 Android " +
        //    "平台来进行游戏。 - 您会拥有更优质的客服服务  在接下来的几个月，我们将会对游戏做一些微小的改动（请记住，您的游戏进度将不会丢失。）  " +
        //    "那么我们会带来什么变化？亚瑟王国（Kingdoms of Camelot: Battle for the North）将会被属DECA Games 隐私政策及使用条例下。" +
        //    "在此之后，继续参与游戏则代表您已阅读并同意新的隐私政策及使用条例。";*/

        TitleInit();
        rankItem.icon.txt = Datas.getArString("PrivacyPolicy.text");

        var strHeight: int = rankItem.icon.GetTxtHeight();
        rankItem.icon.rect.height = strHeight + 50;


        btnPolicy.txt = Datas.getArString("Common.OK_Button");
        btnService.txt = Datas.getArString("Common.Cancel");
        privacyPolicyLabel.txt = Datas.getArString("PrivacyPolicy.pri");
        serveClauseLabel.txt = Datas.getArString("PrivacyPolicy.tos");


        btnClose.OnClick = OnRefuseClick;
        btnBack.OnClick = OnRefuseClick;
        btnPolicy.OnClick = OnClickItem;
        btnService.OnClick = OnRefuseClick;
        privacyPolicyUrl.OnClick = OnPrivacyPolicyUrl;
        serveClauseUrl.OnClick = OnServeClauseUrl;

        scroll.clearUIObject();
        scroll.addUIObject(rankItem.icon);

    }

    function TitleInit()
    {
        title.txt = Datas.getArString("PrivacyPolicy.Title");
        var titleHeight: int = title.GetTxtHeight();
        _Global.Log("<color=#00FFFF>start strHeight</color>" + titleHeight);
        if (titleHeight < 50)
            title.rect.y = 69;
        else if (titleHeight < 100)
            title.rect.y = 39;
        else if (titleHeight >= 100)
            title.rect.y = 10;
    }
    
    function DrawItem()
    {
        backLabel2.Draw();
        btnBack.Draw();
        btnPolicy.Draw();
        btnService.Draw();
        scroll.Draw();
        privacyPolicyLabel.Draw();
        serveClauseLabel.Draw();
        privacyPolicyUrl.Draw();
        serveClauseUrl.Draw();
    }

    function Update()
    {
        scroll.Update();
    }


    function OnPush(param: Object)
    {
        super.OnPush(param);
        scroll.AutoLayout();
        scroll.MoveToTop();
    }

    function OnServeClauseUrl(): void
    {
        var url: String = serveClauseUrl.txt;
        Application.OpenURL(url);
    }

    function OnPrivacyPolicyUrl(): void
    {
        var url: String = privacyPolicyUrl.txt;
        Application.OpenURL(url);
    }
    

    function OnClickItem(): void
    {
        /* PlayerPrefs.SetString("privacyPolicy", "YSE"); */
        data.GetPrivacy();
        data.GetPrivacyPolicyMenu("PrivacyPolicy");
        MenuMgr.getInstance().PopMenu("");
        isServiced = true;
    }
    
    function OnRefuseClick(): void
    {
        var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
        dialog.setDefaultButtonText();
        var content: String = Datas.getArString("PrivacyPolicy.Refuse");
        //content = "如果拒绝以上条款,您将无法继续相关服务,点击确定将退出游戏。";
        dialog.setLayout(580, 320);
        dialog.setContentRect(70, 80, 0, 100);
        dialog.SetCancelAble(true);
        MenuMgr.getInstance().PushConfirmDialog(content, "", Quit, null);
    }

    function Quit(): void
    {
        Application.Quit();
    }


}