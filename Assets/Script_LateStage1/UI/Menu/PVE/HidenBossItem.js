class HidenBossItem extends ListItem
{
	@SerializeField private var bossIcon:Label;
//	@SerializeField private var star:Label; 
	@SerializeField private var questionMark:Label;
	@SerializeField private var desc:Label;
//	@SerializeField private var progressBar:ProgressBar;
	//private var m_data:Hashtable;
	@SerializeField private var backFram :SimpleLabel;
//	@SerializeField private var backImage :SimpleLabel;
	@SerializeField private var backImage :Button;
	
	private var m_data:KBN.HidenBossInfo;
	private var isUnlock:boolean;
	private var totalData:KBN.PveTotalData;
	
	@SerializeField private var myColor = new Color();
	
	public function Init():void
	{
		bossIcon.Init();
		backImage.OnClick = handleClick;
//		star.Init();
		questionMark.Init();
		desc.Init();
//		progressBar.Init();
//		progressBar.thumb.setBackground("gems_progress-bar",TextureType.DECORATION);	
		if( backFram.mystyle.normal.background == null )
		{
			backFram.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_frame",TextureType.DECORATION);
		}
		
//		if( backImage.mystyle.normal.background == null )
//		{
//			backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenboss-head-bg",TextureType.DECORATION);
//		}

		backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenboss-head-bg", TextureType.DECORATION);
		backImage.mystyle.active.background = TextureMgr.instance().LoadTexture("hiddenboss-head-bg", TextureType.DECORATION);
		
		questionMark.setBackground("ui_pve_lock",TextureType.DECORATION);	
	}
	
	public function Draw()
	{
		if(!visible)
			return;
		GUI.BeginGroup(rect);
			backFram.Draw();
			backImage.Draw();
			
			var oldColor:Color = GUI.color;
			if(!isUnlock)
				GUI.color = myColor;
			bossIcon.Draw();
			GUI.color = oldColor;
			
			questionMark.Draw();
//			progressBar.Draw();
//			star.Draw();
//			desc.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as KBN.HidenBossInfo;
		if(m_data == null)return;
		
		totalData = KBN.PveController.instance().GetPveTotalInfo() as KBN.PveTotalData;
		
		//m_data["ID"];
		//if(true==m_data["IsUnLock"])
		
		if(totalData.totalStar>=m_data.needStars)
		{
			isUnlock = true;
//			bossIcon.SetVisible(true);
//			star.SetVisible(false);
			questionMark.SetVisible(false);
//			desc.SetVisible(false);
			//bossIcon.setBackground("boss-head",TextureType.DECORATION);
			//bossIcon.setBackground(m_data.bossIcon,TextureType.DECORATION);
			
//			progressBar.SetVisible(false);
		}
		else
		{
			isUnlock = false;
			//var maxNum:float = 45;
			//var curNum:float = m_data["CurNum"];
//			var maxNum:float = m_data.needStars;
//			var curNum:float = totalData.totalStar;
//			bossIcon.SetVisible(true);
//			star.SetVisible(true);
			questionMark.SetVisible(true);
//			desc.SetVisible(true);
//			bossIcon.setBackground("hiddenboss",TextureType.DECORATION);
//			star.setBackground("BIGstar",TextureType.ICON);
//			progressBar.SetVisible(true);
//			progressBar.SetCurValue(curNum/maxNum);
//			desc.txt = "x"+curNum+" "+maxNum;
		}
		var tex:Texture2D = TextureMgr.instance().LoadTexture(m_data.bossIcon,TextureType.PVEBOSS);
		if(tex == null)
			bossIcon.setBackground("collection_NoPic", TextureType.PVEBOSS);
		else
			bossIcon.setBackground(m_data.bossIcon, TextureType.PVEBOSS);
	
//		desc.txt = Datas.getArString(m_data.bossName);
	}
	
	public function handleClick()
	{
		if(m_data==null)return;
		if(isUnlock)
		{
			var hash1:HashObject = new HashObject({"levelID":m_data.lastLevelID, "isHIdeBossInfo":1});
			MenuMgr.getInstance().PushMenu("BossMenu",hash1,"transition_BlowUp" );
		}
		else
		{
			var hash2:HashObject = new HashObject({"curStarNum":totalData.totalStar, "totalStarNum":m_data.needStars,
				"bossName":m_data.bossName,"bossIcon":m_data.bigBossIcon});
			MenuMgr.getInstance().PushMenu("HidenBossDescMenu",hash2,"trans_zoomComp" );
		}
	}
}