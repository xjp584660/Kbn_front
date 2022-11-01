using UnityEngine;
using System.Collections;
using KBN;

public class AddMrachMaxMenu : SellItemPopupMenu {

	private long base_tropsMax;
	private long extra_tropsMax;
	private long select_troops;
	private int minCount;
	private int curSelect;

	public Label tp_l_troop0;
	public Label tp_l_troop;

	public override void Init(){
		base.Init();
		goldWillGet.SetVisible(false);
		title.txt = Datas.getArString ("Reassign.Text1");
		btnSell.txt = Datas.getArString ("Common.Use_button");
		btnSell.OnClick = new System.Action(OnUse);
	}

	public override void OnPush(object param){
		Hashtable data=param as Hashtable;
		base_tropsMax=_Global.INT64(data["base_tropsMax"]);
		extra_tropsMax=_Global.INT64(data["extra_tropsMax"]);
		select_troops=_Global.INT64(data["select_troops"]);

		minCount=_Global.INT32((select_troops-base_tropsMax)/10000000);
		curSelect=_Global.INT32(extra_tropsMax/10000000);

		min.txt=minCount.ToString();

		itemId = _Global.INT32(data["itemId"]);
		ownItemCount = MyItems.singleton.GetItemCount (itemId);
		slider.Init(minCount-1,ownItemCount-1, true);
		priv_useNumberChanged (curSelect);
		// slider.SetCurValue (curSelect);
		itemIcon.tile.name  = TextureMgr.instance().LoadTileNameOfItem(itemId);
		itemName.txt = Datas.getArString("itemName."+"i" + itemId);
		itemDesc.txt = Datas.getArString("itemDesc."+"i" + itemId);
		all.txt = ownItemCount.ToString ();
		owned.txt = Datas.getArString("Common.Owned") + ": " + ownItemCount.ToString ();

		if(ownItemCount==0){
			btnSell.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			btnSell.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			btnSell.OnClick=null;
		}else{
			btnSell.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnSell.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			btnSell.OnClick=new System.Action(OnUse);;
		}

		tp_l_troop0.txt=_Global.GetString(data["tp_l_troop0"]);

		tp_l_troop.txt=_Global.NumSimlify(select_troops)
			+"/"+
			_Global.NumSimlify(base_tropsMax)
			+(extra_tropsMax==0?"":("+"+
			"<color=#00ff00>" + _Global.NumSimlify(extra_tropsMax) + "</color>"));
		
	}

	protected override void priv_useNumberChanged(int newNumber)
	{
		// if ( newNumber <= 0 )
		// 	newNumber = 1;
		input.txt = newNumber.ToString();
		int price = SellItemMgr.instance ().GetSellItemPrice (itemId);
		goldWillGet.txt = (newNumber * price).ToString();
		slider.SetCurValue(newNumber-1);

		tp_l_troop.txt=_Global.NumSimlify(select_troops)
			+"/"+
			_Global.NumSimlify(base_tropsMax)
			+(newNumber==0?"":("+"+
			"<color=#00ff00>" + _Global.NumSimlify(newNumber*10000000) + "</color>"));
	}

	private void OnUse(){
		int useNum = _Global.INT32 (input.txt);
		if(useNum>ownItemCount){
			useNum=ownItemCount;
			priv_useNumberChanged (useNum);
			return;
		}
		MenuMgr.instance.sendNotification(Constant.Notice.OnMarchAddItemUse,useNum);
		MenuMgr.instance.PopMenu("");
	}

	public override void EndInput(string vStr){
		int v = _Global.INT32(vStr);
		if ( string.IsNullOrEmpty(vStr)||v<=minCount)
		{
			v = minCount;
			input.txt = v.ToString();
		}
		priv_useNumberChanged(v);
	}

	protected override void DrawItem(){
		base.DrawItem();
		tp_l_troop0.Draw();
		tp_l_troop.Draw();
	}


}
