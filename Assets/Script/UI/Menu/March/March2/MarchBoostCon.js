public class MarchBoostCon extends UIObject
{
    @SerializeField
    protected var itemTemplate : MarchBoostItem;
    @SerializeField
    protected var buffTemplate : MarchBuffItem;
    @SerializeField
    protected var scrollView : ScrollView;

	protected var b_item1 : MarchBoostItem;
	protected var b_item2 : MarchBoostItem;
	protected var b_buff1 : MarchBuffItem;
	protected var b_buff2 : MarchBuffItem;
	protected var b_buff3 : MarchBuffItem;
	protected var b_buff4 : MarchBuffItem;
	protected var b_buff5 : MarchBuffItem;
	protected var b_buff6 : MarchBuffItem;
	
	public var tipsVipPve1:SimpleLabel;
	public var tipsVipPve2:SimpleLabel;
	public var vipIcon:SimpleLabel;
	public var line:SimpleLabel;
	
	private var vipLevel1 = 3;
	private var vipLevel2 = 5;
	
	private var buffs : String = null;
	private var buffSettingCallback : System.Action.<String> = null;
	private var maryType : int;
	
	public function Init()
	{
		scrollView.Init();
		
		tipsVipPve1.SetVisible(false);
		tipsVipPve2.SetVisible(false);
		vipIcon.setBackground("VIP",TextureType.DECORATION);
		line.setBackground("between line_list_small",TextureType.DECORATION);
		
		b_item1 = null;
		b_item2 = null;
		b_buff1 = null;
		b_buff2 = null;
		b_buff3 = null;
		b_buff4 = null;
		b_buff5 = null;
		b_buff6 = null;
		
		buffs = null;
	}
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		tipsVipPve1.Draw();
		tipsVipPve2.Draw();
		vipIcon.Draw();
		line.Draw();
		
		scrollView.Draw();
		
		GUI.EndGroup();
	}

	public function updateData(march_type:int)
	{

		maryType = march_type;
		var isShowVipTips : boolean = (march_type == Constant.MarchType.PVE || march_type == Constant.MarchType.ALLIANCEBOSS);

		if (march_type != Constant.MarchType.TRANSPORT && march_type != Constant.MarchType.REASSIGN
			&& march_type != Constant.MarchType.GIANTTPWER)
		{
			b_item1 = Instantiate(itemTemplate);
			b_item1.Init();
			scrollView.addUIObject(b_item1);
			b_item2 = Instantiate(itemTemplate);
			b_item2.Init();
			scrollView.addUIObject(b_item2);
		}
		if(march_type == Constant.MarchType.COLLECT)
		{

		}
		else if (march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REINFORCE || march_type == Constant.MarchType.REASSIGN
			|| march_type == Constant.MarchType.GIANTTPWER)
		{
			if (null == b_buff3)
			{
				b_buff3 = Instantiate(buffTemplate);
				b_buff3.Init();
				b_buff3.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff3);
			}
		}
		else if (march_type == Constant.MarchType.ALLIANCEBOSS || march_type == Constant.MarchType.PVE)
		{
			if (null == b_buff1)
			{
				b_buff1 = Instantiate(buffTemplate);
				b_buff1.Init();
				b_buff1.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff1);
			}
			if (null == b_buff2)
			{
				b_buff2 = Instantiate(buffTemplate);
				b_buff2.Init();
				b_buff2.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff2);
			}
		}
		else if(march_type == Constant.MarchType.COLLECT_RESOURCE)
		{
			if (null == b_buff1)
			{
				b_buff1 = Instantiate(buffTemplate);
				b_buff1.Init();
				b_buff1.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff1);
			}
		}
		else
		{
			if(march_type == Constant.MarchType.EMAIL_WORLDBOSS)
			{
				if (null == b_buff6)
				{
					b_buff6 = Instantiate(buffTemplate);
					b_buff6.Init();
					b_buff6.SetToggleCallback(OnBuffSelectionChanged);
					scrollView.addUIObject(b_buff6);
				}
			}
		
			if (null == b_buff1)
			{
				b_buff1 = Instantiate(buffTemplate);
				b_buff1.Init();
				b_buff1.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff1);
			}
			if (null == b_buff2)
			{
				b_buff2 = Instantiate(buffTemplate);
				b_buff2.Init();
				b_buff2.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff2);
			}
			
			if(march_type != Constant.MarchType.EMAIL_WORLDBOSS)
			{		
				if (null == b_buff3)
				{
					b_buff3 = Instantiate(buffTemplate);
					b_buff3.Init();
					b_buff3.SetToggleCallback(OnBuffSelectionChanged);
					scrollView.addUIObject(b_buff3);
				}
			}
			if (null == b_buff4)
			{
				b_buff4 = Instantiate(buffTemplate);
				b_buff4.Init();
				b_buff4.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff4);
			}
			if (null == b_buff5)
			{
				b_buff5 = Instantiate(buffTemplate);
				b_buff5.Init();
				b_buff5.SetToggleCallback(OnBuffSelectionChanged);
				scrollView.addUIObject(b_buff5);
			}
		}
		
		Shop.instance().getShopData(resetDisplay);
		
		var vipLevel:int = 0;
		if(GameMain.singleton.IsVipOpened())
		{
			vipLevel = GameMain.singleton.GetVipOrBuffLevel();
			tipsVipPve1.SetVisible(isShowVipTips);
			tipsVipPve2.SetVisible(isShowVipTips);
			vipIcon.SetVisible(isShowVipTips);
			line.SetVisible(isShowVipTips);
		}
		else
		{
			tipsVipPve1.SetVisible(false);
			tipsVipPve2.SetVisible(false);
			vipIcon.SetVisible(false);
			line.SetVisible(false);
		}
		
		if(vipLevel<vipLevel1)
		{
			tipsVipPve1.txt = Datas.getArString("VIP.March_Tip1");
			tipsVipPve1.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			tipsVipPve1.txt = Datas.getArString("VIP.March_UnlockTip1");
			tipsVipPve1.SetNormalTxtColor(FontColor.Description_Light);
		}
		if(vipLevel<vipLevel2)
		{
			tipsVipPve2.txt = Datas.getArString("VIP.March_Tip2");
			tipsVipPve2.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			var leftTime:int = GameMain.instance().GetVipReturnTroopLeftTime();
			var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
			tipsVipPve2.txt = String.Format( Datas.getArString("VIP.March_UnlockTip2"), leftTime,vipDataItem.PVE_TROOP_RETURN );
			tipsVipPve2.SetNormalTxtColor(FontColor.Description_Light);
		}
		
		UpdateElementPosition(isShowVipTips&&GameMain.singleton.IsVipOpened());
		
		scrollView.AutoLayout();
		scrollView.MoveToTop();
		
		buffs = null;
	}
	
	private function UpdateElementPosition(bShowVipTips:boolean)
	{
		if(bShowVipTips)
		{
			scrollView.rect.y = 160;
			scrollView.rect.height = 650 - 160;
		}
		else
		{
			scrollView.rect.y = 10;
			scrollView.rect.height = 640;
		}
	}
	
	private function resetDisplay():void
	{
		if (null != b_item1) b_item1.setItemId(261);
		if (null != b_item2) b_item2.setItemId(271);		
		
		if(maryType == Constant.MarchType.COLLECT_RESOURCE)
		{
			if (null != b_buff1) b_buff1.setItemId(3299);
		}
		else
		{
			if (null != b_buff1) b_buff1.setItemId(3290);
		}
		
		if (null != b_buff2) b_buff2.setItemId(3291);
		if (null != b_buff3) b_buff3.setItemId(3292);
		if (null != b_buff4) b_buff4.setItemId(3295);
		if (null != b_buff5) b_buff5.setItemId(3296);
		if (null != b_buff6) b_buff6.setItemId(3297);
	}
	
	public	function	Clear()
	{
        b_item1 = null;
		b_item2 = null;
		
		b_buff1 = null;
		b_buff2 = null;
		b_buff3 = null;
		b_buff4 = null;
		b_buff5 = null;
		b_buff6 = null;
		
		scrollView.clearUIObject();
	}
	
	function Update()
	{
		scrollView.Update();
	}
	
	private function OnBuffSelectionChanged(sender : ToggleButton, v : boolean)
	{
		if(v)
		{
			var selectedItem:MarchBuffItem  = sender.Parent as MarchBuffItem;
			if(selectedItem.ItemId == 3290)
			{
				if(null!=b_buff4)
				{
					b_buff4.Selected = false;
				}
			}
			else if(selectedItem.ItemId == 3295)
			{
				if(null!=b_buff1)
				{
					b_buff1.Selected = false;
				}
			}
			else if(selectedItem.ItemId == 3291)
			{
				if(null!=b_buff5)
				{
					b_buff5.Selected = false;
				}
			}
			else if(selectedItem.ItemId == 3296)
			{
				if(null!=b_buff2)
				{
					b_buff2.Selected = false;
				}
			}
		}
		
		var b = new System.Collections.Generic.List.<String>();
		if(maryType == Constant.MarchType.COLLECT_RESOURCE)
		{
			if (null != b_buff1 && b_buff1.Selected) b.Add("3299");
		}
		else
		{
			if (null != b_buff1 && b_buff1.Selected) b.Add("3290");
		}
		
		if (null != b_buff2 && b_buff2.Selected) b.Add("3291");
		if (null != b_buff3 && b_buff3.Selected) b.Add("3292");
		if (null != b_buff4 && b_buff4.Selected) b.Add("3295");
		if (null != b_buff5 && b_buff5.Selected) b.Add("3296");
		if (null != b_buff6 && b_buff6.Selected) b.Add("3297");
		
		buffs = System.String.Join(",", b.ToArray());
		
		if (null != buffSettingCallback)
		{
			buffSettingCallback(buffs);
		}
	}
	
	public function SetBuffCallback(callback : System.Action.<String>)
	{
		buffSettingCallback = callback;
		
		if (null != buffSettingCallback)
		{
			buffSettingCallback(buffs);
		}
	}
}