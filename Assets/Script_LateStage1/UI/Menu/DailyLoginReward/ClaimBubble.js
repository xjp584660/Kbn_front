#pragma strict

// Bubble displaying in DailyLoginRewardMenu for user to claim rewards
public class ClaimBubble extends UIObject {
    @SerializeField private var itemIcon : Label;
    @SerializeField private var itemDefaultBgIcon : Label;
    @SerializeField private var claimBtn : Button;
    @SerializeField private var claimTip : Label;
    @SerializeField private var descLabel : Label;

    @SerializeField private var bgButton : Button;
    @SerializeField private var closeButton : Button;
    @SerializeField private var closeButtonHeightToReduce : float = 30f;
    @SerializeField private var bgLabel : Label;
    @SerializeField private var arrowOffset : float;
    @SerializeField private var arrowBgOverlayUp : float;
    @SerializeField private var arrowBgOverlayDown : float;
    @SerializeField private var arrowSize : Vector2;

    @SerializeField private var claimTipStringKey : String;
    
    private var arrow : Texture2D;
    private var arrowPosRect : Rect;
    private var arrowRotation : Quaternion;
    private var arrowDraw : RenderRectMaker;
    private var indexShowing : int;
    private var parent : DailyLoginRewardMenu;
    
    public function get IndexShowing() : int { return indexShowing; }
    public function get IsShowing() : boolean { return visible; }
    
    public enum ArrowDir {
        Up,
        Down,
    };
    
    public enum ArrowAlign {
        Left,
        Middle,
        Right,
    };
    
    public function Init(parent : DailyLoginRewardMenu) {
        indexShowing = -1;
        visible = false;
        this.parent = parent;
        InitBg();
        InitControls();
    }
    
    private function InitBg() {
    	var texMgr : TextureMgr = TextureMgr.instance();
    	var iconSpt : TileSprite = texMgr.IconSpt();
        bgButton.Init();
        closeButton.OnClick = OnClickCloseBtn;
        closeButton.Init();
        //var bgImage : Texture2D = texMgr.LoadTexture("Login_bubble", TextureType.BACKGROUND);
        //bgLabel.mystyle.normal.background = bgImage;
        bgLabel.useTile = true;
        bgLabel.tile = iconSpt.GetTile("Login_bubble");
        arrow = texMgr.LoadTexture("Login_bubbleArrow", TextureType.BACKGROUND);
        arrowDraw = new RenderRectMaker();
        arrowDraw.Cache.SourceImages = [arrow];
    }
    
    private function InitControls() {
        itemIcon.useTile = true;
        itemIcon.Init();
        itemDefaultBgIcon.useTile = true;
        itemDefaultBgIcon.Init();
        descLabel.Init();
        claimBtn.txt = Datas.getArString("fortuna_gamble.win_claimButton");
        claimBtn.OnClick = OnClickClaimBtn;
        claimBtn.Init();
    }

    public function Show(index : int, arrowPos : Vector2, arrowDir : ArrowDir, arrowAlign : ArrowAlign) {
        arrowDraw.Cache.Clear();
        indexShowing = index;
        ConfigBgForShow(index, arrowPos, arrowDir, arrowAlign);
        ConfigControlsForShow(index);
        visible = true;
    }
    
    private function ConfigBgForShow(index : int, arrowPos : Vector2, arrowDir : ArrowDir, arrowAlign : ArrowAlign) {
        var arrowStartX : float = arrowPos.x - arrowSize.x / 2;
        var bgStartX : float = arrowPos.x - bgButton.rect.width / 2 + arrowOffset * (arrowAlign == ArrowAlign.Middle ?
            0 : arrowAlign == ArrowAlign.Left ? 1 : -1);
        var bgRect : Rect;
        if (arrowDir == ArrowDir.Up) {
            arrowPosRect = new Rect(arrowStartX, arrowPos.y, arrowSize.x, arrowSize.y);
            arrowRotation = Quaternion.identity;
            
            if(KBN._Global.isIphoneX()) {
            	bgRect = new Rect(bgStartX, arrowPos.y + arrowSize.y - arrowBgOverlayUp-53, bgButton.rect.width, bgButton.rect.height);
            }else{
            	bgRect = new Rect(bgStartX, arrowPos.y + arrowSize.y - arrowBgOverlayUp, bgButton.rect.width, bgButton.rect.height);
            }
        } else {
            arrowPosRect = new Rect(arrowStartX, arrowPos.y - arrowSize.y, arrowSize.x, arrowSize.y);
            arrowRotation = Quaternion.Euler(0, 0, 180);
            if(KBN._Global.isIphoneX()) {
            	bgRect = new Rect(bgStartX, arrowPos.y - arrowSize.y - bgButton.rect.height + arrowBgOverlayDown-53, bgButton.rect.width, bgButton.rect.height);
            }else{
            	bgRect = new Rect(bgStartX, arrowPos.y - arrowSize.y - bgButton.rect.height + arrowBgOverlayDown, bgButton.rect.width, bgButton.rect.height);
            }
            
        }
        bgLabel.rect = bgButton.rect = bgRect;
        arrowDraw.Add(arrowPosRect, arrowRotation, new Rect(0, 0, 1, 1));
        closeButton.rect = new Rect(0, closeButtonHeightToReduce, 
                parent.rect.width, parent.rect.height - closeButtonHeightToReduce);
    }
    
    private function ConfigControlsForShow(index : int) {
        var displayData : DailyLoginRewardMenu.CellDisplayData = parent.GetCellDisplayDataAtIndex(index);
        var data : DailyLoginRewardData.CellData = DailyLoginRewardMgr.Instance.Data[index];
        itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
        itemIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(data.ItemId);
        itemDefaultBgIcon.tile = TextureMgr.instance().BackgroundSpt().FindTile("icon_default_bg");
        descLabel.txt = String.Format("{0}\nx {1}", displayData.ItemName, data.ItemCnt);

        var dayCnt : int = index + 1;
        if (dayCnt <= DailyLoginRewardMgr.Instance.LoginDayCnt) {
            claimBtn.SetVisible(true);
            claimTip.SetVisible(false);
            if (DailyLoginRewardMgr.Instance.HasClaimedOnDay(dayCnt)) {
                claimBtn.changeToGreyNew();
            } else { 
                claimBtn.changeToBlueNew(); 
                claimBtn.clickParam = index;
            }
        } else {
            claimBtn.SetVisible(false);
            claimTip.SetVisible(true);
            claimTip.txt = String.Format(Datas.getArString(claimTipStringKey),
                    dayCnt - DailyLoginRewardMgr.Instance.LoginDayCnt);
        }
    }
    
    private function OnClickClaimBtn(param : System.Object) : void {
        var index : int = System.Convert.ToInt32(param);
        DailyLoginRewardMgr.Instance.ClaimReward(index + 1);
        Hide();
    }
    
    private function OnClickCloseBtn(param : System.Object) : void {
        Hide();
    }
    
    public function Hide() {
        visible = false;
        indexShowing = -1;
        arrowDraw.Cache.Clear();
    }
    
    private function DrawArrow() {
        var renderRect : Rect = parent.GetRenderRect();
        var vsMatrix : Matrix4x4 = UnityEngine.Matrix4x4.TRS(new Vector3(renderRect.x, renderRect.y, 0.0f), Quaternion.identity, Vector3.one);
        arrowDraw.Cache.VSMatrix = vsMatrix;
        arrowDraw.Cache.OrtMatrix = GUI.matrix;
        arrowDraw.Cache.Draw();
    }
    
    public function Draw() {
        if (!visible) return;
        if (IsPaint()) {
            bgLabel.Draw();
            DrawArrow();
            GUI.BeginGroup(bgButton.rect);
            itemDefaultBgIcon.Draw();
            itemIcon.Draw();
            descLabel.Draw();
            claimBtn.Draw();
            claimTip.Draw();
            GUI.EndGroup();
            closeButton.Draw();
            bgButton.Draw();
        } else {
            GUI.BeginGroup(bgButton.rect);
            claimBtn.Draw();
            GUI.EndGroup();
            bgButton.Draw();
            closeButton.Draw();
        }
    }
    
    public function OnParentPopOver() {
        FinalizeBg();
        FinalizeControls();
    }
    
    private function FinalizeBg() {
        bgLabel.mystyle.normal.background = null;
        arrow = null;
        arrowDraw = null;
    }
    
    private function FinalizeControls() {
        claimBtn.mystyle.normal.background = null;
        claimBtn.mystyle.active.background = null;
    }
}