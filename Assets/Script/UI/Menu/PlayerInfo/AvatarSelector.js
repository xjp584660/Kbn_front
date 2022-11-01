#pragma strict
import System.Collections.Generic;

public class AvatarSelector extends PopMenu implements IEventHandler {

	public var  titleLine   : SimpleLabel;
	public var  avatarList  : ScrollList;
	public var  lbTips      : SimpleLabel;
	public var  lbOwned     : SimpleLabel;
	public var  moneyTemplate : SaleComponent;
	public var  btnUse      : SimpleButton;
	
	public var  avatarListItem : AvatarListItem;
	
	private var initialAvatar  : String;
	private var selectedAvatar : String;
    
    private var money : SaleComponent;
    
    @SerializeField
    private var moneyPositionSale : Vector2;
    @SerializeField
	private var moneyPositionNoSale : Vector2;
	
	@SerializeField
	private var toolBar : ToolBar;
	public var  frameList  : ScrollList;
	public var  frameListItem : FrameListItem;
	public var  btnOK      : SimpleButton;
	private var selectedFrame : String;
	private var initialFrame : String;

	public function Init() {
		super.Init();
		avatarList.Init(avatarListItem);
		frameList.Init(frameListItem);
		
		title.txt = Datas.getArString("Avatar.SelectorTitle");
		titleLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line", TextureType.DECORATION);
        
        if (money != null)
        {
            TryDestroy(money);
            money = null;
        }
        money = Instantiate(moneyTemplate);
        money.Init();
        
		avatarList.itemDelegate = this;
		frameList.itemDelegate = this;

		toolBar.Init();
		toolBar.toolbarStrings = [Datas.getArString("PlayerInfo.AvaterChange_Avater"), Datas.getArString("PlayerInfo.AvaterChange_Frame")];	
		toolBar.indexChangedFunc = OnTabIndexChanged;
		btnOK.OnClick = OnOKClicked;
		btnOK.txt = Datas.getArString("Common.OK_Button");
	}

	private function OnOKClicked(param : Object)
    {
		if(initialFrame == selectedFrame)
			return;
		
		FrameMgr.instance().decorationUpdate("avatar", selectedFrame);
	}

	private function OnTabIndexChanged(index : int) : void
    {
        if (index == 1) // passMission quest
        {

        }
        else if(index == 0)
        {

        }
    }
	
	public function OnPush(param:Object) {
		super.OnPush(param);
		
		lbTips.txt = String.Format(Datas.getArString("Avatar.SelectorTips"), AvatarMgr.instance().AvatarUnlockLevel);;
		updateItemInfo();
		updateAvatarList();
		updateFrameList();
		setButtonEnable(false);
		setOKEnable(false);
	}
	
	private function updateItemInfo() {
		var itemCount : int = MyItems.instance().countForItem(2411);
		lbOwned.txt = Datas.getArString("itemName.i2411") + "   " + Datas.getArString("Common.Owned") + ': ' + itemCount;
		
		if (itemCount > 0) {
			lbOwned.SetVisible(true);
			money.SetVisible(false);
			
			btnUse.txt = Datas.getArString("Common.Use_button");
			btnUse.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
			btnUse.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew", TextureType.BUTTON);
			btnUse.OnClick = onUseButton;
		} else {
			var obj : HashObject = (Datas.instance().itemlist())["i" + 2411];
			var category : int = _Global.INT32(obj["category"]);
			var item : Hashtable = Shop.instance().getItem(category, 2411);
			lbOwned.SetVisible(false);
			money.SetVisible(true);
			money.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]), false);
		
			btnUse.txt = Datas.getArString("Common.BuyAndUse_button");
			btnUse.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
			btnUse.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew", TextureType.BUTTON);
			btnUse.OnClick = onBuyAndUseButton;
		}
        
        UpdateMoneyPosition();
	}
	
	private function updateAvatarList() {
		var list : List.<String> = AvatarMgr.instance().GetAvatars();
		selectedAvatar = AvatarMgr.instance().PlayerAvatar;
//		selectedAvatar = selectedAvatar.Substring(2, selectedAvatar.Length - 2);
		initialAvatar = selectedAvatar;
		
		avatarList.Clear();
		avatarList.SetData(list);
		avatarList.MoveToTop();
	}

	private function updateFrameList() {
		var list : List.<String> = FrameMgr.instance().GetHeadFrames();
		initialFrame = FrameMgr.instance().PlayerHeadFrame;
		selectedFrame = initialFrame;
		
		frameList.Clear();
		frameList.SetData(list);
		frameList.MoveToTop();
	}
	
	private function setButtonEnable(enable : boolean) {
		if (enable) {
			if (lbOwned.isVisible()) {
				btnUse.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
			} else {
				btnUse.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
			}
		} else {
			btnUse.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		}
		btnUse.SetDisabled(!enable);
	}

	private function setOKEnable(enable : boolean) {
		if (enable) {
			btnOK.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
		} else {
			btnOK.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		}
		btnOK.SetDisabled(!enable);
	}
	
	private function onUseButton() {
		if (initialAvatar == selectedAvatar)
			return;
		MyItems.instance().changeAvatarDo(selectedAvatar);
	}
	
	private function onBuyAndUseButton() {
		if (initialAvatar == selectedAvatar)
			return;
		MyItems.instance().changeAvatarBuyAndDo(selectedAvatar);
	}
	
	function Update() {
		toolBar.Update();
        switch (toolBar.selectedIndex)
        {
            case 0:
				avatarList.Update();
				money.Update();
				UpdateMoneyPosition();
                break;
            case 1:
				frameList.Update();
                break;
            default:
                break;
        }	
	}
    
    private function UpdateMoneyPosition()
    {
        money.Update();
        
        if (money.isShowSale)
        {
            money.rect.x = moneyPositionSale.x;
            money.rect.y = moneyPositionSale.y;
        }
        else
        {
            money.rect.x = moneyPositionNoSale.x;
            money.rect.y = moneyPositionNoSale.y;
        }
    }
	
	// override
	function DrawItem() {
		switch (toolBar.selectedIndex)
        {
            case 0:
				avatarList.Draw();
				lbTips.Draw();
				lbOwned.Draw();
				money.Draw();
				btnUse.Draw();
                break;
            case 1:
				frameList.Draw();
				btnOK.Draw();
                break;
            default:
                break;
        }

        toolBar.Draw();
		titleLine.Draw();
	}
	
	private function setAvatarHighlight(avatarName : String) {
		avatarList.ForEachItem( function ( item : ListItem ) : boolean {
			var avatarItem : AvatarListItem = item as AvatarListItem;
			if (null == avatarItem)
				return true;
			avatarItem.Highlight = (avatarItem.AvatarName == avatarName);
			return true;
		} );
	}

	private function setFrameHighlight(frameName : String) {
		frameList.ForEachItem( function ( item : ListItem ) : boolean {
			var frameItem : FrameListItem = item as FrameListItem;
			if (null == frameItem)
				return true;
			frameItem.Highlight = (frameItem.FrameName == frameName);
			return true;
		} );
	}
	
	function handleItemAction(action : String, params : Object) {
		if(action == "OnUpdateData" || action == "OnClick")
		{
			var avatarItem : AvatarListItem = params as AvatarListItem;
			if (null == avatarItem)
				return;
				
			if (action == "OnUpdateData") {
				avatarItem.Highlight = (avatarItem.AvatarName == selectedAvatar);
			} else if (action == "OnClick") {
				selectedAvatar = avatarItem.AvatarName;
				setAvatarHighlight(selectedAvatar);
				setButtonEnable(selectedAvatar != initialAvatar);
			}
		}
		else
		{
			var frameItem : FrameListItem = params as FrameListItem;
			if (null == frameItem)
				return;
				
			if (action == "OnFrameUpdateData") {
				frameItem.Highlight = (frameItem.FrameName == selectedFrame);
			} else if (action == "OnFrameClick") {
				selectedFrame = frameItem.FrameName;
				setFrameHighlight(selectedFrame);
				setOKEnable(selectedFrame != initialFrame);
			}
		}		
	}
	
	public function handleNotification(type : String, body : Object) : void {
		if (type == "OnItemAmountChanged") {
			updateItemInfo();
		} else if (type == "ChangeAvatar") {
			MenuMgr.getInstance().PopMenu("AvatarSelector");
		}
		else if(type == Constant.FrameType.DECORATION_UPDATE)
		{
			initialFrame = FrameMgr.instance().PlayerHeadFrame;
			setOKEnable(selectedFrame != initialFrame);
		}
	}
	
	function OnPopOver() {
		avatarList.Clear();
		frameList.Clear();
        TryDestroy(money);
        money = null;
	}
}
