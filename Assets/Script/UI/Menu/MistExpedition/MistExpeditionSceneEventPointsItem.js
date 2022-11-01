/*
 * @FileName:		MistExpeditionSceneEventPointsItem.js
 * @Author:			xue
 * @Date:			2022-05-25 02:39:07
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 事件点界面 - 物品项
 *
*/


public class MistExpeditionSceneEventPointsItem extends ListItem {
    @Space(30) @Header("----------MistExpedition - Scene - EventPoints - Item----------")

    @SerializeField private var itemIcon: Label;
    @SerializeField private var itemDescription: Label;
    @SerializeField private var divideline: Label;
    @SerializeField private var itemTitle: Label;



    public function Init() {
        super.Init();

        itemIcon.Init();
        itemDescription.Init();
        divideline.Init();
        itemTitle.Init();

    }

    public function Draw() {
        if (!visible) return;
        GUI.BeginGroup(rect);
        itemIcon.Draw();
        itemDescription.Draw();
        divideline.Draw();
        itemTitle.Draw();


        GUI.EndGroup();
    }

    public function SetRowData(data: Object): void {

        var m_data = data as EventPoints;

        itemIcon.useTile = true;
        itemIcon.image = m_data.image;

       
        itemTitle.txt = Datas.getArString(m_data.langKey_Scene_EventName);
        itemDescription.txt = Datas.getArString(m_data.langKey_Scene_EventDesc);

    }


}