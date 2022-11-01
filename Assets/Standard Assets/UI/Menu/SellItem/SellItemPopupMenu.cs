using UnityEngine;
using KBN;
public class SellItemPopupMenu : PopMenu
{
	public Label line;
	public Label itemIcon;
	public Label owned;
	public InputText input;
	public Label goldWillGet;
	public Label itemName;
	public Label itemDesc;
	public Slider slider;
	public Label min;
	public Label all;
	public Button btnSell;
	protected int gm_maxCount = 9999; 
	protected int itemId;
	protected int ownItemCount;
	public override void Init()
	{
		base.Init();
		title.txt = Datas.getArString ("Common.Sell");
		btnSell.txt = Datas.getArString ("Common.Sell");
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

		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.useTile = true; 
		goldWillGet.setBackground ("resource_Gold_icon", TextureType.ICON);
		btnSell.OnClick = new System.Action(OnSell);
	}

	// public override void Update()
	// {
	// }

	protected override void DrawItem ()
	{
		title.Draw ();
		line.Draw ();
		itemIcon.Draw ();
		owned.Draw ();
		input.Draw ();
		goldWillGet.Draw ();
		itemName.Draw ();
		itemDesc.Draw ();
		slider.Draw ();
		min.Draw ();
		all.Draw ();
		btnSell.Draw ();
	}

	public override void OnPush(object param)
	{
		itemId = (int)param;
		ownItemCount = MyItems.singleton.GetItemCount (itemId);
		slider.Init(ownItemCount-1, true);
		priv_useNumberChanged (0);
		slider.SetCurValue (0);
		itemIcon.tile.name  = TextureMgr.instance().LoadTileNameOfItem(itemId);
		itemName.txt = Datas.getArString("itemName."+"i" + itemId);
		itemDesc.txt = Datas.getArString("itemDesc."+"i" + itemId);
		all.txt = ownItemCount.ToString ();
		owned.txt = Datas.getArString("Common.Owned") + ": " + ownItemCount.ToString ();
	}

	private void SliderValueChanged(long val)
	{
		priv_useNumberChanged ((int)val + 1);
	}

	protected virtual void priv_useNumberChanged(int newNumber)
	{
		if ( newNumber <= 0 )
			newNumber = 1;
		input.txt = newNumber.ToString();
		int price = SellItemMgr.instance ().GetSellItemPrice (itemId);
		goldWillGet.txt = (newNumber * price).ToString();
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

	public virtual void EndInput(string vStr)
	{
		int v = _Global.INT32(vStr);
		if ( string.IsNullOrEmpty(vStr) )
		{
			v = 1;
			input.txt = v.ToString();
		}
		priv_useNumberChanged(v);
	}

	private void OnSell()
	{	
		ConfirmDialog cd = MenuMgr.instance.getConfirmDialog();
        cd.setLayout(600, 380);
        cd.setTitleY(120);
        cd.setButtonText(Datas.getArString("Common.OK_Button"), Datas.getArString("Common.Cancel"));
		MenuMgr.instance.PushConfirmDialog(Datas.getArString("Sellitem.SellitemNotice"), string.Empty, new System.Action<object>(SellItem), null);

	}
    private void SellItem(object param){
		MenuMgr.instance.PopMenu ("");
		int sellNum = _Global.INT32 (input.txt);
		SellItemMgr.instance().RequestSell (itemId, sellNum);
		MenuMgr.instance.PopMenu ("SellItemPopupMenu");
	}

}