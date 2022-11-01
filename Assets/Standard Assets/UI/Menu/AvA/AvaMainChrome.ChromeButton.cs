using UnityEngine;
using System.Collections;

using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;
using Message = KBN.Message;

public partial class AvaMainChrome : KBNMenu  {

    private ChromeButtonObj outpostButton;
    private ChromeButtonObj coopButton;
    private ChromeButtonObj emailButton;
    private ChromeButtonObj statsButton;
    private ChromeButtonObj helpButton;

    private int lastEmailCount = 0;

	private void InitMainChromeButtons()
	{
        outpostButton = AddChromeButton("Outpost", new Hashtable() { {"icon", "button_icon_outpost"}, {"txt", Datas.getArString("AVA.Outpost_title")}, {"num", "0"} }, OnOutpostButton);
        coopButton = AddChromeButton("Coop", new Hashtable() { {"icon", "button_icon_co_op"}, {"txt", Datas.getArString("AVA.coop_title")}, {"num", "0"} }, OnCoopButton);
        emailButton = AddChromeButton("Email", new Hashtable() { {"icon", "button_icon_Mail"}, {"txt", Datas.getArString("MainChrome.MessagesTab_Title")}, {"num", "0"} }, OnEmailButton);
        statsButton = AddChromeButton("Stats", new Hashtable() { {"icon", "button_icon_stats"}, {"txt", Datas.getArString("AVA.stats_statstitle")}, {"num", "0"} }, OnStatsButton);
        helpButton = AddChromeButton("Help", new Hashtable() { {"icon", "button_icon_help"}, {"txt", Datas.getArString("Common.Help")}, {"num", "0"} }, OnHelpButton);

        lastEmailCount = 0;
	}

	private void OnOutpostButton()
	{
		MenuMgr.instance.PushMenu("OutpostMenu", null);
		GameMain.singleton.getMapController2().dismissTileInfoPopUp();
	}
	
	private void OnCoopButton()
	{
		MenuMgr.instance.PushMenu("AvaCoopMenu", null);
		GameMain.singleton.getMapController2().dismissTileInfoPopUp();
	}

	private float lastCoopUpdateTime = 0.0f;
	private void UpdateCoopButton()
	{
		float now = Time.realtimeSinceStartup;
		if (now - lastCoopUpdateTime > 0.5f)
		{
			lastCoopUpdateTime = now;

			coopButton.SetCnt(GameMain.Ava.March.GetRallyAttackList().Count);
		}
	}

    private void OnStatsButton()
    {
        MenuMgr.instance.PushMenu("AvaStatsMenu", null);
		GameMain.singleton.getMapController2().dismissTileInfoPopUp();
    }

    private void OnHelpButton()
    {
		InGameHelpSetting setting = new InGameHelpSetting();
		setting.type = "one_context";
		setting.key = Datas.getArString("AVA.Chrome_warstarts");
		setting.name = Datas.getArString("AVA.chat_battlefieldtab");
		setting.menuHeadBtnType = MenuHead.BACK_BUTTON_MOTIF_OUTPOST;
		MenuMgr.instance.PushMenu("InGameHelp", setting, "trans_up");
    }

    private void OnEmailButton()
    {
        MenuMgr.instance.PushMenu("EmailMenu", new Hashtable()
        {
            {"BackButton", "Outpost"}
        });
		GameMain.singleton.getMapController2().dismissTileInfoPopUp();
    }

    private void UpdateEmailButton()
    {
        if (emailButton == null)
        {
            return;
        }

        var newCount = Message.Instance.MessageStatistics.UnreadAvaCount;
        emailButton.SetCnt(newCount);

        if (newCount > lastEmailCount)
        {
            SoundMgr.instance().PlayEffect( "new_message", TextureType.AUDIO);
        }

        lastEmailCount = newCount;
    }

    private void UpdateChromeButtons()
    {
        UpdateEmailButton();
		UpdateCoopButton();
    }

    private void SetButtonsDisabled(bool disabled)
    {
        if (null != outpostButton)
            outpostButton.SetDisabled(disabled);
        if (null != coopButton)
            coopButton.SetDisabled(disabled);
        if (null != emailButton)
            emailButton.SetDisabled(disabled);
    }
}
