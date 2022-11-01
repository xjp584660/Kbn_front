public class EventRankItem extends	FullClickItem{
	
	public var lblRank:Label;
	public var lblName:Label;
	public var lblScore:Label;
	public var lblCustm1:Label;
	public var lblBack:Label;
	public var allianceEmblem:AllianceEmblem;
	protected var m_data:HashObject;
	public function Init()
	{
		super.Init();
		btnDefault.OnClick = PreViewReward;
		btnDefault.mystyle.active.background = null;
		//line.setBackground("Dividing_line", TextureType.DECORATION);
		//line.rect.height = 3;
		if(KBN._Global.isIphoneX()){
			DistNormal.y = 50;
			lblBack.rect.height = 50;
		}
		else
		{
			DistNormal.y = 60;
			lblBack.rect.height = 60;
		}
		allianceEmblem.SetVisible(false);
	}
	
	public	function	Update()
	{
		
	}
	
	public function SetIndexInList(index:int)
	{
		if(index % 2 == 0)
		{
			lblBack.setBackground("popup_smalltitle_back", TextureType.DECORATION);
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

		lblScore.txt = _Global.NumFinancial(_Global.INT64(_Global.DOULBE64(m_data["score"].Value)).ToString());

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
		
		Relayout();
	}
	
	private function Relayout()
	{
		if (lblCustm1.isVisible()) {
			//rect.height = 40;
			lblRank.rect = new Rect(30, 14, 80, 28);
			allianceEmblem.SetVisible(false); // not needed in this case
			lblName.rect = new Rect(64, 12, 300, 28);
			lblScore.rect = new Rect(365, 12, 300, 28);
			lblCustm1.rect = new Rect(215, 12, 300, 28);
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
	
	public function DrawItem()
	{
		//GUI.BeginGroup(rect);	
		super.DrawItem();	
		DrawDefaultBtn();
		lblBack.Draw();
		lblRank.Draw();
		allianceEmblem.Draw();
		lblName.Draw();
		lblScore.Draw();
		lblCustm1.Draw();
		line.Draw();
		//GUI.EndGroup();
	}
	
	public function PreViewReward()
	{
		if (!lblCustm1.isVisible())
			MenuMgr.getInstance().PushMenu("EventRankAwardPreviewMenu", m_data, "trans_zoomComp");
	}
	
}