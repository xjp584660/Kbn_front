#pragma strict


public class BatchUseAndBuyDialog
	extends PopMenu
{
	private static var gm_maxCount : int = 9999;
	@SerializeField
	private var m_splice : SimpleLabel;
	@SerializeField
	private var m_itemIcon : SimpleLabel;
	@SerializeField
	private var m_inputEditor : InputText;
	@SerializeField
	private var m_itemName : SimpleLabel;
	@SerializeField
	private var m_itemDesc : SimpleLabel;
	@SerializeField
	private var m_owned : SimpleLabel;
	//@SerializeField
	//private var m_numCnt : SimpleLabel;
	@SerializeField
	private var m_btnUse : Button;
	@SerializeField
	private var m_btnBuy : Button;
	@SerializeField
	private var m_btnBuyAndUse : Button;
	
	@SerializeField
	private var m_sliderForUse : Slider;
	@SerializeField
	private var m_sliderForBuy : Slider;
	@SerializeField
	private var m_lbRes : Button[];
	@SerializeField
	private var m_lbGems : Label;

	@SerializeField
	private var m_lbGemsFrame : Label;

	@SerializeField
	private var m_ltForBuy : UIObject[];
	@SerializeField
	private var m_ltForUse : UIObject[];

	private var m_showerList : UIObject[];
	
	private var m_inputParam : BatchBuyAndUseParam;

	public function Init()
	{
		super.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		m_splice.mystyle.normal.background = texMgr.LoadTexture("between line", TextureType.DECORATION);
		m_inputEditor.Init();
		m_inputEditor.type = TouchScreenKeyboardType.NumberPad;
		m_inputEditor.mystyle.normal.background = texMgr.LoadTexture("type_box",TextureType.DECORATION);
		m_btnBuy.changeToGreenNew();
		m_btnBuyAndUse.changeToGreenNew();
	}

	private function priv_useNumberChanged(newNumber : int)
	{
		if ( newNumber <= 0 )
			newNumber = 1;
		m_inputEditor.txt = newNumber.ToString();
		m_lbGems.txt = (newNumber * m_inputParam.price).ToString();
	}

	private function priv_useIndexChanged(newIndex : int)
	{
		var cnt : int = priv_getCountByIdx(newIndex);
		m_lbGems.txt = (cnt * m_inputParam.price).ToString();
		m_inputEditor.txt = cnt.ToString();
		for ( var idx : int = 0; idx != m_lbRes.Length; ++idx )
		{
			var tmpButton : Button = m_lbRes[idx];
			if ( newIndex != idx || !m_inputParam.isBuy )
			{
				tmpButton.mystyle.normal.background = null;
			}
			else
			{
				tmpButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("light_box2", TextureType.DECORATION);
			}
		}
	}

	public class BatchBuyAndUseParam
	{
		public var itemId : int;
		public var isBuy : boolean;
		public var price : int;
		public var mayGropGear : boolean;
		public var useDelegateOnUse : boolean = false;
		public var myDelegateOnUse : Function;
		public var upperBoundsNumber : int = -1; // -1 means ALL
	}
	
	private function priv_getCountByIdx(idx : int) : int
	{
		switch ( idx )
		{
		case 0: return 1;
		case 1: return 10;
		case 2: return 20;
		case 3: return 50;
		}
		if ( m_inputParam.isBuy )
			return 100;
		var curCnt : int = priv_updateItemCnt();
		return Mathf.Clamp(curCnt, 1, gm_maxCount);
	}
	
	private function priv_clickButton(idxObj : System.Object) : void
	{
		if ( idxObj == null )
			return;
		var idx : int = idxObj;
		priv_useIndexChanged(idx);
		if ( m_inputParam.isBuy )
		{
			m_sliderForBuy.SetCurValue(idx);
		}
		else
		{
			var curCnt = priv_getCountByIdx(idx);
			m_sliderForUse.SetCurValue(curCnt-1);
		}
	}

	public function OnPush(param : Object)
	{
		m_inputParam = param as BatchBuyAndUseParam;
		if ( m_inputParam.isBuy )
			title.txt = Datas.getArString("BatchPurchase.PurchaseTitle");
		else
			title.txt = Datas.getArString("BatchPurchase.UseTitle");

		var itemId : int = m_inputParam.itemId;
		var texMgr : TextureMgr = TextureMgr.instance();
		var itemName : String = texMgr.LoadTileNameOfItem(itemId);
		m_itemIcon.useTile = true;
		m_itemIcon.tile = texMgr.ItemSpt().GetTile(itemName);
		m_itemName.txt = Datas.getArString("itemName.i" + itemId.ToString());
		m_itemDesc.txt = Datas.getArString("itemDesc.i" + itemId.ToString());
		var itemsMgr : MyItems = MyItems.instance();
		var cnt : int = priv_updateItemCnt();

		for ( var i = 0; i != m_lbRes.Length; ++i )
		{
			m_lbRes[i].txt = priv_getCountByIdx(i).ToString();
			m_lbRes[i].clickParam = i;
			m_lbRes[i].OnClick = priv_clickButton;
		}


		if ( m_inputParam.isBuy )
		{
			m_sliderForBuy.Init(4);
			m_sliderForBuy.sliderStyle.normal.background = texMgr.LoadTexture("ScaleBarIndex_Resource", TextureType.DECORATION);
			m_sliderForBuy.thumbStyle.normal.background = texMgr.LoadTexture("ScaleButton_Resource", TextureType.DECORATION);
			m_sliderForBuy.valueChangedFunc = priv_useIndexChanged;
			m_sliderForBuy.SetCurValue(0);
			priv_useIndexChanged(0);

			m_showerList = m_ltForBuy;
			m_lbGemsFrame.mystyle.normal.background = texMgr.LoadTexture("Decorative_frame", TextureType.DECORATION);
			m_lbGems.image = texMgr.LoadTexture("resource_icon_gems", TextureType.ICON);
			if ( itemsMgr.IsCanBatchUse(itemId) )
			{
				m_btnBuy.OnClick = priv_buy;
				m_btnBuyAndUse.OnClick = priv_buyAndUse;

				m_btnBuy.txt = Datas.getArString("Common.Buy");
				m_btnBuyAndUse.txt = Datas.getArString("Common.BuyAndUse_button");

				m_btnBuy.SetVisible(true);
				m_btnBuyAndUse.SetVisible(true);
				m_btnUse.SetVisible(false);
			}
			else
			{
				m_btnUse.changeToGreenNew();
				m_btnUse.OnClick = priv_buy;

				m_btnUse.txt = Datas.getArString("Common.Buy");

				m_btnBuy.SetVisible(false);
				m_btnBuyAndUse.SetVisible(false);
				m_btnUse.SetVisible(true);
			}

			m_inputEditor.filterInputFunc = function(oldStr:String,newStr:String):String
			{
				newStr = _Global.FilterStringToNumberStr(newStr);
				if ( String.IsNullOrEmpty(newStr) )
					return newStr;

				var n:int = _Global.INT32(newStr);
				n = Mathf.Clamp(n, 1, gm_maxCount);
				return n.ToString();
			};

			m_inputEditor.endInput = function(vStr : String)
			{
				var v : int = _Global.INT32(vStr);
				if ( String.IsNullOrEmpty(vStr) )
				{
					v = 1;
					m_inputEditor.txt = v.ToString();
				}
				priv_useNumberChanged(v);
			};
		}
		else
		{
			// Change the upper bounds number of the items to use. In some cases,
			// such as when the hero will reach the max level of the current elevate
			// phase, we can't use all of the left renown items in which case
			// the value will exceed the max renown value of that level, so we
			// need to limit the number to an upperbounds.
			var upperBoundsNumber : int = m_inputParam.upperBoundsNumber;
			if( upperBoundsNumber == -1 || cnt <= upperBoundsNumber )
			{
				m_sliderForUse.Init(Mathf.Min(cnt-1, gm_maxCount-1), true);
			}
			else
			{
				m_sliderForUse.Init(upperBoundsNumber-1, true);
			}
			
			m_sliderForUse.valueChangedFunc = function(cntValue : int)
			{
				priv_useNumberChanged(cntValue+1);
			};
			m_sliderForUse.SetCurValue(0);
			priv_useNumberChanged(1);
			
			
			if( upperBoundsNumber == -1 || cnt <= upperBoundsNumber )
			{
				m_lbRes[m_lbRes.Length-1].txt = Datas.getArString("Common.All");
			}
			else
			{
				m_lbRes[m_lbRes.Length-1].txt = ""+m_inputParam.upperBoundsNumber;
			}
			m_showerList = m_ltForUse;
			m_btnUse.changeToBlueNew();
			m_btnUse.OnClick = priv_useItems;
			m_btnUse.txt = Datas.getArString("Common.Use_button");
			m_btnUse.SetVisible(true);
			if( upperBoundsNumber == 0 )
			{
				m_btnUse.changeToGreyNew();
			}
			m_inputEditor.filterInputFunc = function(oldStr:String,newStr:String):String
			{
				newStr = _Global.FilterStringToNumberStr(newStr);
				if ( String.IsNullOrEmpty(newStr) )
					return newStr;

				var n:int = _Global.INT32(newStr);
				n = Mathf.Clamp(n, 1, gm_maxCount);
				var curCnt : int = priv_updateItemCnt();
				if ( n > curCnt )
					n = curCnt;
				return n.ToString();
			};

			m_inputEditor.endInput = function(vStr : String)
			{
				var v : int = _Global.INT32(vStr);
				if ( String.IsNullOrEmpty(vStr) )
				{
					v = 1;
					m_inputEditor.txt = v.ToString();
				}
				priv_useNumberChanged(v);
				m_sliderForUse.SetCurValue(v-1);
			};
		}
	}

	public function DrawItem()
	{
		m_splice.Draw();
		m_itemIcon.Draw();
		m_itemName.Draw();
		m_itemDesc.Draw();
		m_owned.Draw();
		m_inputEditor.Draw();
		for ( var i : int = 0; i != m_showerList.Length; ++i )
			m_showerList[i].Draw();
		//m_numCnt.Draw();
		btnClose.Draw();
	}
	
	private function priv_buy()
	{
		priv_buyWithCallback(function()
		{
			MenuMgr.getInstance().PopMenu("");
		});
	}
	
	private function priv_buyAndUse()
	{
		priv_buyWithCallback(function()
		{
			priv_useItems();
		});
	}

	private function priv_updateItemCnt() : int
	{
		var itemsMgr : MyItems = MyItems.instance();
		var cnt : int = itemsMgr.countForItem(m_inputParam.itemId);
		m_owned.txt = String.Format("{0}:{1}", Datas.getArString("Common.Owned"), cnt.ToString());
		if ( !m_inputParam.isBuy )
		{
			if ( _Global.INT32(m_inputEditor.txt) > cnt )
				priv_useNumberChanged(cnt);
		}
		return cnt;
	}

	private function priv_buyWithCallback(okCallback : function():void)
	{
		m_inputEditor.endInput(m_inputEditor.txt);
		var price : int = _Global.INT32(m_lbGems.txt);
		if ( !Payment.instance().CheckGems(price) )
		{
			MenuMgr.getInstance().PushPaymentMenu();
			return;
		}
		
		var onOK : function() : void = function() : void
		{
			priv_updateItemCnt();
			if ( okCallback != null )
				okCallback();
		};

		Shop.instance().BuyInventory(m_inputParam.itemId, price, _Global.INT32(m_inputEditor.txt), m_inputParam.mayGropGear, onOK);
	}

	private function priv_useItems()
	{
		m_inputEditor.endInput(m_inputEditor.txt);
		var cnt : int = _Global.INT32(m_inputEditor.txt);
		
		if( m_inputParam.useDelegateOnUse ) {
			m_inputParam.myDelegateOnUse( cnt );
			MenuMgr.getInstance().PopMenu("");
		} else {
			var itemsMgr : MyItems = MyItems.instance();
			itemsMgr.Use(m_inputParam.itemId, cnt, function(usedCnt:int)
			{
				priv_updateItemCnt();
				MenuMgr.getInstance().PopMenu("");
			});
		}
	}

	public function OnPopOver()
	{
		for ( var idx : int = 0; idx != m_lbRes.Length; ++idx )
			m_lbRes[idx].mystyle.normal.background = null;
	}
}
