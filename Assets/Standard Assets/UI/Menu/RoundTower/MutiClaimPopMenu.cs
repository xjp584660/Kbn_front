using UnityEngine;
using System;
using KBN;
public class MutiClaimPopMenu : PopMenu
{
	public Label line;
	//public Label itemIcon;
	public ItemPic itemPic;
//	public Label owned;
	public InputText input;
//	public Label goldWillGet;
	public Label itemName;
	public Label itemDesc;
	public Slider slider;
	public Label min;
	public Label all;
	public Button btnClaim;
	private int gm_maxCount = 9999; 
	private int itemId;
	private int exchangeMaxCount;
	private int hasClaimedCount;
	private int claimCapCount;
	private string eventName;
	private int eventId;
	private int crestId; 
	public override void Init()
	{
		base.Init();

		min.txt = "1";
		all.txt = Datas.getArString ("Common.All");
		line.setBackground ("between line",TextureType.DECORATION);
		
		input.Init();
		input.type = TouchScreenKeyboardType.NumberPad;
		input.mystyle.normal.background = TextureMgr.instance().LoadTexture("type_box",TextureType.DECORATION);
		slider.Init(100, true);
		slider.valueChangedFunc = new System.Action<long> (SliderValueChanged);
		input.filterInputFunc = new System.Func<string,string,string> (InputFilter);
		input.endInput = new System.Action<string>(EndInput);
		
//		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
//		itemIcon.useTile = true; 
//		goldWillGet.setBackground ("resource_Gold_icon", TextureType.ICON);
		btnClaim.OnClick = new System.Action(OnClaim);
	}
	
	public override void Update()
	{
	}
	
	protected override void DrawItem ()
	{
		title.Draw ();
		line.Draw ();
		itemPic.Draw ();
//		owned.Draw ();
		input.Draw ();
//		goldWillGet.Draw ();
		itemName.Draw ();
		itemDesc.Draw ();
		slider.Draw ();
		min.Draw ();
		all.Draw ();
		btnClaim.Draw ();
	}
	public override void OnPush(object param)
	{
		HashObject data = param as HashObject;
		itemId = _Global.INT32(data["itemId"]);
		exchangeMaxCount = _Global.INT32(data["exchangeMaxCount"]);
		hasClaimedCount = _Global.INT32 (data["hasClaimedCount"]);
		claimCapCount = _Global.INT32 (data["claimCapCount"]);
		eventName = _Global.GetString (data["eventName"]);
		eventId = _Global.INT32 (data["eventId"]);
		crestId = _Global.INT32 (data["crestid"]);
		tab=_Global.INT32 (data["tab"]);
		endTime=_Global.INT64 (data["endTime"]);
		exchangeMaxCount+=hasClaimedCount;

		title.txt = eventName;
		btnClaim.txt = "(" + hasClaimedCount + "/" + claimCapCount +")  " + Datas.getArString("fortuna_gamble.win_claimButton");
		int maxClaim = exchangeMaxCount < claimCapCount ? exchangeMaxCount : claimCapCount;
		slider.Init(maxClaim-1-hasClaimedCount, true);
		priv_useNumberChanged (0);
		slider.SetCurValue (0);
		//itemIcon.tile.name  = TextureMgr.instance().LoadTileNameOfItem(itemId);
		itemPic.SetId(itemId);
		itemName.txt = Datas.getArString("itemName."+"i" + itemId);
		itemDesc.txt = Datas.getArString("itemDesc."+"i" + itemId);
		all.txt = (maxClaim-hasClaimedCount).ToString();
//		owned.txt = Datas.getArString("Common.Owned") + ": " + exchangeMaxCount.ToString ();
	}
	
	private void SliderValueChanged(long val)
	{
		priv_useNumberChanged ((int)val + 1);
	}
	
	private void priv_useNumberChanged(int newNumber)
	{
		if ( newNumber <= 0 )
			newNumber = 1;
		input.txt = newNumber.ToString();
		//int price = SellItemMgr.instance ().GetSellItemPrice (itemId);
//		goldWillGet.txt = (newNumber * price).ToString();
		slider.SetCurValue(newNumber-1);

	}
	
	private string InputFilter(string oldStr, string newStr )
	{
		newStr = _Global.FilterStringToNumberStr(newStr);
		if ( string.IsNullOrEmpty(newStr) )
			return newStr;
		
		int n = _Global.INT32(newStr);
		n = Mathf.Clamp(n, 1, gm_maxCount);
		return n.ToString();
	}
	
	private void EndInput(string vStr)
	{
		int v = _Global.INT32(vStr);
		if ( string.IsNullOrEmpty(vStr) )
		{
			v = 1;
			input.txt = v.ToString();
		}
		priv_useNumberChanged(v);
	}
	private int tab;
	private long endTime;
	private void OnClaimOk(HashObject result)
	{
		Museum.singleton.OnMutiClaimOk (result);
		MenuMgr.instance.sendNotification(Constant.Notice.OnMutiClaimOK,null);
		MenuMgr.instance.PushMessage(Datas.getArString("Common.actionSucess"));
		MenuMgr.instance.sendNotification("MutiClaimSucess",(tab>10||endTime==0)?1:0);
	}

	private void OnClaim()
	{	
		MenuMgr.instance.PopMenu ("");
		int claimNum = _Global.INT32 (input.txt);
		Museum.singleton.MutiClaimEvent(eventId,crestId,claimNum, new System.Action<HashObject>(OnClaimOk));
	}
	
}