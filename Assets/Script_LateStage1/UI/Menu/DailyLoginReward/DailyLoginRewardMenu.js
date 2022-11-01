#pragma strict

public class DailyLoginRewardMenu extends PopMenu {
    public class CellDisplayData {
        private final var itemName : String;
        private final var itemImageName : String;
        private final var theRect : Rect;
        
        public function get ItemName() : String { return itemName; }
        public function get ItemImageName() : String { return itemImageName; }
        public function get TheRect() : Rect { return theRect; }
        
        public function CellDisplayData(itemName : String, itemImageName : String, theRect : Rect) {
            this.itemName = itemName;
            this.itemImageName = itemImageName;
            this.theRect = theRect;
        }
    }

    private var data : DailyLoginRewardData;
    private var loginDayCnt : int;
    private var cellDisplayDataArray : CellDisplayData[];
    private var cellBtns : SimpleButton[];
    private var drawDataUpdated : boolean;
    private var firstOpenToday : boolean;

    // Controls and graphics
    @SerializeField private var bgBorder : Label;
    @SerializeField private var divisionLine : Label;
    @SerializeField private var descLbl : Label;
    @SerializeField private var claimBubble : ClaimBubble;
    
    @SerializeField private var baseHeight : float;
    @SerializeField private var cellBgSize : float;
    @SerializeField private var cellSpecialLightMargin : Vector2;
    @SerializeField private var cellDigitSize : Vector2;
    @SerializeField private var cellDigitMargin : float;
    @SerializeField private var cellIconSize : float;
    @SerializeField private var cellMargin : float;
    @SerializeField private var baseLineYPos : float;
    @SerializeField private var cellDigitStartMargin : float;
    @SerializeField private var borderAugmentSize : Vector2;
    @SerializeField private var afterClaim : Color;
    @SerializeField private var cellHighlightSize : float = 125f;

    // Colored mask for rewards that cannot be claimed yet
    @SerializeField private var itemWhiteMaskColor : Color = new Color(1, 1, 1, .3);
    
    @System.Serializable
    private class SpecialAnimParams {
        @SerializeField private var size : Vector2;
        @SerializeField private var frameNum : int;
        @SerializeField private var frameRate : float;
        
        public function get Size() : Vector2 { return size; }
        public function get FrameNum() : int { return frameNum; }
        public function get FrameRate() : float { return frameRate; }
    }
    
    @SerializeField private var specialAnimParams : SpecialAnimParams;
    
    // Params for animation on first login per day
    @SerializeField private var firstLoginAnimStartSize : Vector2;
    @SerializeField private var firstLoginAnimScaleDuration : float = .3f;
    @SerializeField private var firstLoginAnimAlphaFactor : float = 4;
    @SerializeField private var firstLoginAnimAlphaDuration : float = .2f;
    @SerializeField private var firstLoginAnimEasePower : float = 3f;
    @SerializeField private var firstLoginAnimIconDarkness : float = .3f;
    
    // For debugging only, should set to false for release version in the prefab
    @SerializeField private var alwaysPlayFirstLoginAnim : boolean = false;
    
    // Params for rect shaking for THIS menu
    @SerializeField private var rectShakerRadius : float = 5f;
    @SerializeField private var rectShakerPeriod : float = .1f;
    @SerializeField private var rectShakerCount : int = 2;
    @SerializeField private var rectShakerScale : float = .9f;
    
    // RenderRectMakers, used to save draw calls
    private var cellGridBgDraw : RenderRectMaker;
    private var cellGridItemDefaultBgDraw : RenderRectMaker; // for better visual feeling
    private var cellGridNumDraw : RenderRectMaker;
    private var cellGridItemDraw : RenderRectMaker;
    private var cellGridItemWhiteMaskDraw : RenderRectMaker;
    private var cellGridSpecialAnim : RenderRectMaker;
    private var cellGridHighlightDraw : RenderRectMaker;
    
    // Tile sprites
    private var bgSprite : TileSprite;
    private var iconSprite : TileSprite;
    private var specialAnimSprite : TileSprite;

    private var cellGridWidth : float;
    private var cellGridHeight : float;
    private var specialAnimFrame : int;
    private var specialAnimTimer : float;
    private var firstOpenAnimCtl : DailyLoginRewardFirstOpenAnimCtl;
    private var rectShaker : RectShaker;
    public var iphoneXitemOffet:int=53;
    
    // Sounds
    @SerializeField private var bangSoundName : String = "KBN_bang";

    public function Init() : void {
        firstOpenToday = DailyLoginRewardMgr.Instance.HasNotOpenedUI && DailyLoginRewardMgr.Instance.FirstLoginToday;
        specialAnimFrame = 0;
        drawDataUpdated = false;
        InitText();
        InitDecoration();
        InitSprites();
        InitRenderRectMakers();
        InitClaimBubble();
        rectShaker = new RectShaker();
        UpdateDrawData();
        super.Init();
    }
    
    public function GetCellDisplayDataAtIndex(index : int) {
        return cellDisplayDataArray[index];
    }
    
    private function InitText() : void {
        title.txt = Datas.getArString("Common.Loading");
        descLbl.txt = String.Empty;
    }
    
    private function InitDecoration() : void {
        bgBorder.mystyle.normal.background = TextureMgr.instance().LoadTexture("Login_kuang", TextureType.DECORATION);
        divisionLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line", TextureType.DECORATION);
    }
    
    private function InitSprites() : void {
        bgSprite = TextureMgr.instance().BackgroundSpt();
        iconSprite = TextureMgr.instance().ItemSpt();
        specialAnimSprite = TileSprite.CreateSprite(TextureMgr.instance().LoadText("DailyLoginUIAnim", TextureType.ATLAS));
    }
    
    private function InitRenderRectMakers() : void {
        cellGridBgDraw = new RenderRectMaker();
        cellGridBgDraw.Cache.SourceGroup = bgSprite;
        cellGridNumDraw = new RenderRectMaker();
        cellGridNumDraw.Cache.SourceGroup = bgSprite;
        cellGridItemDefaultBgDraw = new RenderRectMaker();
        cellGridItemDefaultBgDraw.Cache.SourceGroup = bgSprite;
        cellGridItemDraw = new RenderRectMaker();
        cellGridItemDraw.Cache.SourceGroup = iconSprite;
        cellGridHighlightDraw = new RenderRectMaker();
        cellGridHighlightDraw.Cache.SourceImages = [TextureMgr.instance().LoadTexture("DailyLoginHighlight1", TextureType.DECORATION)];
        cellGridItemWhiteMaskDraw = new RenderRectMaker();
        cellGridItemWhiteMaskDraw.Cache.SourceGroup = iconSprite;
        cellGridSpecialAnim = new RenderRectMaker();
        cellGridSpecialAnim.Cache.SourceGroup = specialAnimSprite;
        firstOpenAnimCtl = new DailyLoginRewardFirstOpenAnimCtl();
    }
    
    private function InitClaimBubble() : void {
        claimBubble.Init(this);
    }
    
    public function OnPop() : void {
        if (firstOpenAnimCtl != null && firstOpenAnimCtl.IsPlaying) {
            firstOpenAnimCtl.Stop();
        }
        if (rectShaker != null && rectShaker.IsPlaying) {
            rectShaker.Stop();
        }
        super.OnPop();
    }
    
    public function OnPopOver() : void {
        FinalizeRenderRectMakers();
        FinalizeDecoration();
        FinalizeSprites();
        FinalizeClaimBubble();
        super.OnPopOver();
        TextureMgr.instance().unloadUnusedAssets();
    }
    
    private function FinalizeRenderRectMakers() {
        cellGridBgDraw = null;
        cellGridNumDraw = null;
        cellGridItemDefaultBgDraw = null;
        cellGridItemDraw = null;
        cellGridHighlightDraw = null;
        cellGridItemWhiteMaskDraw = null;
        cellGridSpecialAnim = null;
    }
    
    private function FinalizeDecoration() {
        bgBorder.mystyle.normal.background = null;
        divisionLine.mystyle.normal.background = null;
    }
    
    private function FinalizeSprites() {
        bgSprite = null;
        iconSprite = null;    
        if (specialAnimSprite.SourceImages != null) {
            for ( var tex : Texture2D in specialAnimSprite.SourceImages )
                   Resources.UnloadAsset(tex);
        }
        specialAnimSprite = null;
    }
    
    private function FinalizeClaimBubble() {
        claimBubble.OnParentPopOver();
    }
    
    public function handleNotification(type : String, body : System.Object):void {
        super.handleNotification(type, body);
        var notification : Hashtable;
        switch (type) {
            case Constant.Notice.DailyLoginRewardClaimSuccess:
                OnClaimSuccess(body as Hashtable);
                break;
            case Constant.Notice.DailyLoginRewardClaimFailure:
                OnClaimFailure(body as Hashtable);
                break;
            default: break;
        }   
    }
    
    private function OnClaimSuccess(notification : Hashtable)
    {
        var itemName : String = Datas.getArString(String.Format("itemName.i{0}", notification["itemId"]));
        MenuMgr.getInstance().PushMessage(String.Format(Datas.getArString("DailyLogin.ClaimSuccess"), itemName));
        if (DailyLoginRewardMgr.Instance.AllClaimed)
        {
            descLbl.txt = Datas.getArString("Dailylogin.Logindesc_2");
        }
        UpdateItemDraw();
    }
    
    private function OnClaimFailure(notification : Hashtable)
    {
        ErrorMgr.instance().PushError("", notification["errMsg"] as String, false, 
            Datas.getArString("Common.OK"), null);
    }
    
    private function UpdateDrawData() : void {
        data = DailyLoginRewardMgr.Instance.Data;
        loginDayCnt = DailyLoginRewardMgr.Instance.LoginDayCnt;
        cellDisplayDataArray = new CellDisplayData[data.Length];
        cellBtns = new SimpleButton[data.Length];

        cellGridWidth = data.ColCnt * (cellBgSize + cellMargin) - cellMargin;
        cellGridHeight = data.RowCnt * (cellBgSize + cellMargin) - cellMargin;
        var startX : float = (rect.width - cellGridWidth) / 2;
        var startY : float = baseLineYPos;

        cellGridSpecialAnim.Cache.Clear();
        for (var i : int = 0; i < data.Length; ++i) {
            var row : int = i / data.ColCnt;
            var col : int = i % data.ColCnt;
            var itemId : int = data[i].ItemId;
            var itemImageName : String = TextureMgr.instance().LoadTileNameOfItem(data[i].ItemId);
            var itemName : String = Datas.getArString(String.Format("itemName.i{0}", data[i].ItemId));
            var theRect : Rect = new Rect(startX + col * (cellBgSize + cellMargin),
                startY + row * (cellBgSize + cellMargin), cellBgSize, cellBgSize);
            if(KBN._Global.isIphoneX()) {
	           theRect = new Rect(startX + col * (cellBgSize + cellMargin),
	                startY +iphoneXitemOffet +row * (cellBgSize + cellMargin), cellBgSize, cellBgSize);
            }
            cellDisplayDataArray[i] = new CellDisplayData(itemName, itemImageName, theRect);
            AddCellToDrawers(i, cellDisplayDataArray[i]);
            cellBtns[i] = new SimpleButton();
            if(KBN._Global.isIphoneX()) {
           		 cellBtns[i].rect =  new Rect(theRect.x,theRect.y-iphoneXitemOffet,theRect.width,theRect.height);
            }else
            	cellBtns[i].rect = theRect;
            cellBtns[i].OnClick = OnClickCell;
            cellBtns[i].clickParam = i;
        }

        var menuHeight = baseHeight + cellGridHeight;
        rect = new Rect(rect.x, (960 - menuHeight) * .5f, rect.width, menuHeight);
        bgBorder.rect = new Rect(startX - borderAugmentSize.x,
            startY - borderAugmentSize.y,
            cellGridWidth + borderAugmentSize.x * 2,
            cellGridHeight + borderAugmentSize.y * 2
            );
        var monthStrKey : String = String.Format("Common.Month{0}", data.CurrentMonth);
        var monthStr : String = Datas.getArString(monthStrKey);
        title.txt = String.Format(Datas.getArString("Dailylogin.Logintitle"), monthStr);
        
        if (DailyLoginRewardMgr.Instance.AllClaimed)
        {
            descLbl.txt = Datas.getArString("Dailylogin.Logindesc_2");
        }
        else
        {
            descLbl.txt = String.Format(Datas.getArString("Dailylogin.Logindesc_1"), loginDayCnt);
        }

        drawDataUpdated = true;
        
        DailyLoginRewardMgr.Instance.HasNotOpenedUI = false;
        if (firstOpenToday) {
            PlayFirstOpenAnim();
        } else if (alwaysPlayFirstLoginAnim) { // For debugging
            PlayFirstOpenAnim();
        }
    }
    
    private function PlayFirstOpenAnim() {
        if (DailyLoginRewardMgr.Instance.LoginDayCnt - 1 >= DailyLoginRewardMgr.Instance.Data.Length) {
            return;
        }
        var cellDisplayData : CellDisplayData = cellDisplayDataArray[DailyLoginRewardMgr.Instance.LoginDayCnt - 1];
        var endRect : Rect = cellDisplayData.TheRect;
        var startRect : Rect = new Rect((this.rect.width - firstLoginAnimStartSize.x) * .5f,
                (this.rect.height - firstLoginAnimStartSize.y) * .5f,
                firstLoginAnimStartSize.x, firstLoginAnimStartSize.y);
        firstOpenAnimCtl.Init(DailyLoginRewardMgr.Instance.LoginDayCnt, cellDigitSize, cellDigitMargin, cellDigitStartMargin);
        firstOpenAnimCtl.Play(startRect, endRect, cellDisplayData.ItemImageName, cellIconSize / cellBgSize,
                firstLoginAnimScaleDuration, firstLoginAnimAlphaFactor, firstLoginAnimEasePower,
                firstLoginAnimAlphaDuration, firstLoginAnimIconDarkness, OnRectShakerShouldPlay);
    }
    
    private function OnRectShakerShouldPlay() {
        if (SoundMgr.instance() != null) {
            SoundMgr.instance().PlayEffect(bangSoundName, /*TextureType.AUDIO*/"Audio/");
        }
        rectShaker.Init(this.rect, rectShakerRadius, rectShakerScale, rectShakerPeriod, rectShakerCount, null);
        rectShaker.Play();
    }
    
    private function OnClickCell(clickParam : System.Object) {
        var index : int = System.Convert.ToInt32(clickParam);
        //_Global.LogWarning(String.Format("[DailyLoginRewardMenu OnClickCell] index={0}", index));
        if (claimBubble.IsShowing) {
            claimBubble.Hide();
        } else if (data[index].ItemId > 0) {
            var row : int = index / data.ColCnt;
            var col : int = index % data.ColCnt;
            var arrowAlign : ClaimBubble.ArrowAlign = (col * 2 == data.ColCnt - 1 ?
                ClaimBubble.ArrowAlign.Middle : col * 2 < data.ColCnt - 1 ?
                ClaimBubble.ArrowAlign.Left : ClaimBubble.ArrowAlign.Right);
                
            var arrowDir : ClaimBubble.ArrowDir = (row * 2 < data.RowCnt - 1 ? ClaimBubble.ArrowDir.Up : ClaimBubble.ArrowDir.Down);
            claimBubble.Show(index, cellDisplayDataArray[index].TheRect.center, arrowDir, arrowAlign);
        }
    }
    
    public function Update() : void {
        specialAnimTimer += Time.deltaTime;
        if (specialAnimTimer > 1 / specialAnimParams.FrameRate) {
            specialAnimTimer = 0;
            UpdateSpecialAnim();
        }
        if (firstOpenAnimCtl != null && firstOpenAnimCtl.IsPlaying) {
            firstOpenAnimCtl.Update();
        }
        if (rectShaker != null && rectShaker.IsPlaying) {
            rectShaker.Update(); 
            this.rect = rectShaker.CurrentRect;
            this.SetScale(rectShaker.CurrentScaleFactor);
        }
    }
    
    // Will refresh the mesh for the special anim (cellGridSpecialAnim)
    private function UpdateSpecialAnim() : void {
        specialAnimFrame += 1;
        if (specialAnimFrame >= specialAnimParams.FrameNum) {
            specialAnimFrame = specialAnimFrame % specialAnimParams.FrameNum;
        }
        cellGridSpecialAnim.Cache.Clear();
        for (var i : int = 0; i < data.Length; ++i) {
            UpdateSpecialAnimRect(i, cellDisplayDataArray[i]);
        }
    }
    
    public function DrawItem() : void {
        if (!drawDataUpdated) return;
        
        if (IsPaint()) {
            var renderRect : Rect = GetRenderRect();
            var vsMatrix : Matrix4x4 = UnityEngine.Matrix4x4.TRS(new Vector3(renderRect.x, renderRect.y, 0.0f), Quaternion.identity, Vector3.one);
            var ortMatrix : Matrix4x4 = GUI.matrix;
            divisionLine.Draw();
            bgBorder.Draw();
            RenderRectMaker.DrawWithMatrices([
                cellGridBgDraw, cellGridNumDraw, cellGridHighlightDraw, cellGridItemDefaultBgDraw, cellGridItemDraw, cellGridItemWhiteMaskDraw], 
                vsMatrix, ortMatrix);
            descLbl.Draw();
            RenderRectMaker.DrawWithMatrices([cellGridSpecialAnim], vsMatrix, ortMatrix);
            firstOpenAnimCtl.DrawWithMatrices(vsMatrix, ortMatrix);
            claimBubble.Draw();
        } else {
            claimBubble.Draw();
            DrawCellBtns();
        }
    }
    
    public function SetColor(c : Color)
    {
        super.SetColor(c);
        var rrms : RenderRectMaker[] = [cellGridBgDraw, cellGridNumDraw, cellGridItemDefaultBgDraw, 
                cellGridItemDraw, cellGridItemWhiteMaskDraw, cellGridSpecialAnim, cellGridHighlightDraw];
        for (var i : int = 0; i < rrms.Length; ++i)
        {
            var rrm = rrms[i];
            if (rrm != null)
            {
                rrm.Cache.MulColor = c;
            }
        }
    }
    
    private function DrawCellBtns() : void {
        for (var btn : SimpleButton in cellBtns) {
            btn.Draw();
        }
    }

    private function AddCellToDrawers(index : int, cell : CellDisplayData) {
        var dayCnt : int = index + 1;
        var bgTileName : String;
        if (dayCnt <= DailyLoginRewardMgr.Instance.LoginDayCnt) {
            bgTileName = "Login_down";
        } else {
            bgTileName = "Login_normal";
        }
        cellGridBgDraw.Add(cell.TheRect, bgSprite.FindTile(bgTileName));

        var digitCnt : int = (dayCnt < 10 ? 1 : 2);
        for (var i : int = 0; i < digitCnt; ++i) {
            var digit : int = dayCnt % 10;
            var digitRect = new Rect(cell.TheRect.x + cellDigitStartMargin + (digitCnt - i - 1) * (cellDigitSize.x + cellDigitMargin),
                    cell.TheRect.y + cellDigitStartMargin, cellDigitSize.x, cellDigitSize.y);
            cellGridNumDraw.Add(digitRect, bgSprite.FindTile(String.Format("Login_{0}", digit)));
            dayCnt = dayCnt / 10;
        }
        
        UpdateItemIcon(index, cell);
        UpdateSpecialAnimRect(index, cell);
    }
    
    private function UpdateSpecialAnimRect(index : int, cell : CellDisplayData) {
        if (data[index].Special && !DailyLoginRewardMgr.Instance.HasClaimedOnDay(index + 1)) {
            cellGridSpecialAnim.Add(new Rect(cell.TheRect.x - (specialAnimParams.Size.x - cell.TheRect.width) / 2,
                cell.TheRect.y - (specialAnimParams.Size.y - cell.TheRect.height) / 2, specialAnimParams.Size.x, specialAnimParams.Size.y),
                specialAnimSprite.FindTile(String.Format("xingxing_{0:0000}", specialAnimFrame)));
        }
    }
    
    private function UpdateItemIcon(index : int, cell : CellDisplayData) {
        var itemIconOffset : float = (cellBgSize - cellIconSize) / 2;
        var tileOriginalName : String = TextureMgr.instance().LoadTileNameOfItem(data[index].ItemId);
        var tile : Tile = iconSprite.FindTile(tileOriginalName);
        if (data[index].ItemId > 0) {
            var itemRect : Rect = new Rect(cell.TheRect.x + itemIconOffset, cell.TheRect.y + itemIconOffset, cellIconSize, cellIconSize);
            var defaultBgImageName : String = "icon_default_bg";
            var iconColor : Color = DailyLoginRewardMgr.Instance.HasClaimedOnDay(index + 1) ? afterClaim : Color.white;

            cellGridItemDefaultBgDraw.Add(itemRect, bgSprite.FindTile(defaultBgImageName), iconColor);
            cellGridItemDraw.Add(itemRect, tile != null ? tile:iconSprite.FindTile("icon_default"), iconColor);

            if (index + 1 > DailyLoginRewardMgr.Instance.LoginDayCnt) {
                cellGridItemWhiteMaskDraw.Add(itemRect, iconSprite.FindTile("item_white"), itemWhiteMaskColor);
            } else if (!DailyLoginRewardMgr.Instance.HasClaimedOnDay(index + 1)) {
                var highlightOffset : float = (cellBgSize - cellHighlightSize) / 2;
                var highlightRect : Rect = new Rect(cell.TheRect.x + highlightOffset, cell.TheRect.y + highlightOffset,
                    cellHighlightSize, cellHighlightSize);
                cellGridHighlightDraw.Add(highlightRect, new Rect(0, 0, 1, 1));
            }
        }
    }
    
    private function UpdateItemDraw() {
        cellGridItemDraw.Cache.Clear();
        cellGridHighlightDraw.Cache.Clear();
        cellGridItemDefaultBgDraw.Cache.Clear();
        cellGridItemWhiteMaskDraw.Cache.Clear();
        for (var i : int = 0; i < data.Length; ++i) {
            UpdateItemIcon(i, cellDisplayDataArray[i]);
        }
    }
}