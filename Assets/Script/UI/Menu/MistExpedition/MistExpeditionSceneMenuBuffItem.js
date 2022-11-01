/*
 * @FileName:		MistExpeditionSceneMenuBuffItem.js
 * @Author:			xue
 * @Date:			2022-04-19 06:29:04
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 增益Buff - 物品项
 *
*/


public class MistExpeditionSceneMenuBuffItem extends ListItem {
    @Space(30) @Header("----------MistExpedition Scene Buff - Item----------")

    @SerializeField private var itemIcon: Label;
    @SerializeField private var itemDescription: Label;
    @SerializeField private var divideline: Label;
    @SerializeField private var nameLabel: Label;


    private var m_data: HashObject;


    public function Init(): void {

        itemIcon.Init();
        itemDescription.Init();
        divideline.Init();
        nameLabel.Init();
    }

    public function Draw() {
        if (!visible) return;
        GUI.BeginGroup(rect);
        itemIcon.Draw();
        nameLabel.Draw();
        itemDescription.Draw();
        divideline.Draw();


        GUI.EndGroup();
    }

    public function SetRowData(data: Object): void {

        m_data = data as HashObject;
        if (m_data == null) return;

        itemIcon.useTile = true;
        var path: String = m_data["path"].Value.ToString();
        var img = TextureMgr.instance().LoadTexture(path, TextureType.MISTEXPEDITION);
        if (img != null)
            itemIcon.mystyle.normal.background = img;

        var description: String = m_data["description"].Value.ToString();
        var type: int = _Global.INT32(m_data["Type"].Value);
        var Value: Object;
        if (type == 1) {
            Value = _Global.FLOAT(m_data["Value"].Value) / 100;
        }
        else {
            Value = m_data["Value"].Value;
        }

        var name: String = m_data["name"].Value.ToString();
        nameLabel.txt = Datas.getArString(name);
        itemDescription.txt = String.Format(Datas.getArString(description), Value);
    }
}