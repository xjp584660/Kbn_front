
public class WorldBossEventRankItem extends EventRankItem
{


	public function SetIndexInList(index:int)
	{
		if(index % 2 == 0)
		{
			lblBack.setBackground("popup_listbackground", TextureType.DECORATION);
			lblBack.SetVisible(true);
		}
		else
		{
			lblBack.SetVisible(false);
		}
	}
	public function SetRowData(_data:Object)
	{
		m_data = _data as HashObject;
		lblRank.txt = m_data["rank"].Value.ToString();
		lblName.SetFont();
		lblName.txt = _Global.GUIClipToWidth(lblName.mystyle, m_data["name"].Value, 140, "...", null);
		if(_Global.GetString(m_data["allianceName"]) != "")
		{
			lblName.txt = lblName.txt + "\n" + m_data["allianceName"].Value;
		}
		lblScore.txt = _Global.NumFinancial(m_data["score"].Value.ToString());
		//lblScore.txt = _Global.NumFinancial("...");
		lblCustm1.SetVisible(null != m_data["world"]);
		lblCustm1.txt = _Global.GetString(m_data["world"]);
		if (!String.IsNullOrEmpty(_Global.GetString(m_data["image"]))) {
			lblRank.setBackground(_Global.GetString(m_data["image"]), TextureType.DECORATION);
		} else {
			lblRank.mystyle.normal.background = null;
		}
		
		if (null != m_data["emblem"])
		{
			var emblemData : AllianceEmblemData = new AllianceEmblemData();
			JasonReflection.JasonConvertHelper.ParseToObjectOnce(emblemData, m_data["emblem"]);
			allianceEmblem.Data = emblemData;
			allianceEmblem.SetVisible(true);
		}
		
		RelayoutNew();
	}
	
	private function RelayoutNew()
	{
		if (lblCustm1.isVisible()) {
			//rect.height = 40;
			lblRank.rect = new Rect(53, 14, 80, 28);
			allianceEmblem.SetVisible(false); // not needed in this case
			lblName.rect = new Rect(138, 2, 300, 28);
			lblScore.rect = new Rect(338, 12, 300, 28);
			lblCustm1.rect = new Rect(138, 22, 300, 28);
			line.rect.y = 35;
		} else {
		
			if(KBN._Global.IsLargeResolution ())
			{
				rect.height = 55;	
			}
			else
			{
				rect.height = 70;							
			}
			lblRank.rect = new Rect(53, -5, 70, 65);
			allianceEmblem.rect = new Rect(110, 8, 30, 40);
			lblName.rect = new Rect(138, -5, 300, 65);
			lblScore.rect = new Rect(338, -5, 300, 65);
			//line.rect.y = 66;
		}
	}


	public function PreViewReward()
	{
		MenuMgr.getInstance().PushMenu("WorldBossRankAwardPreviewMenu", m_data, "trans_zoomComp");
	}
}