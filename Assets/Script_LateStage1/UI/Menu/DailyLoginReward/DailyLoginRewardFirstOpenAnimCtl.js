#pragma strict

/// Anim steps:
/// - 1. Scale down today's item and bg image, with alpha increasing quickly and then decreasing
/// - 2. Notify the caller when step 1 finishes
/// - 3. Make today's item first darker and then brighter
public class DailyLoginRewardFirstOpenAnimCtl extends System.Object {
    // Duration of step 3;
    private var alphaDuration : float;
    
    // Duration of step 1;
    private var scaleDuration : float;
    
    // Alpha changing speed of step 1;
    private var alphaFactor : float;
    
    private var startRect : Rect;
    private var endRect : Rect;
    private var currentRect : Rect;
    private var currentIconRect : Rect;
    
    private var currentAlpha : float;

    private var dayCnt : int;
    private var digitSize : Vector2;
    private var digitMargin : float;
    private var digitStartMargin : float;
    private var darkness : float;
    
    private var time : float;
    
    private var easePower : float;

    private var isPlaying : boolean;
    public function get IsPlaying() : boolean {
        return isPlaying;
    }
    
    private var iconDefaultBgDraw : RenderRectMaker;
    private var iconDraw : RenderRectMaker;
    //private var iconFloatDraw : RenderRectMaker;
    private var iconName : String;
    private var iconTile : Tile;
    //private var iconTileFloat : Tile;
    private var initialBg : RenderRectMaker;
    private var digitDraw : RenderRectMaker;
    private var iconToGridRatio : float;
    private var bgTile : Tile;
    
    private var onFirstStageComplete : System.Action;
    private var updateAction : System.Action;
    
    public function Play(startRect : Rect, endRect : Rect,
            iconName : String, iconToGridRatio : float, 
            scaleDuration : float, alphaFactor : float, easePower : float,
            alphaDuration : float, darkness : float, onFirstStageComplete : System.Action) : void {
        this.startRect = startRect;
        this.endRect = endRect;
        this.iconToGridRatio = iconToGridRatio;
        this.scaleDuration = scaleDuration;
        this.alphaFactor = alphaFactor;
        this.alphaDuration = alphaDuration;
        this.darkness = darkness;
        this.iconName = iconName;
        this.onFirstStageComplete = onFirstStageComplete;
        this.easePower = easePower;
        
        time = 0f;
        
        currentRect = startRect;
        currentAlpha = 1f;
        currentIconRect = UtilityTools.AmplifyRectByRatio(currentRect, iconToGridRatio);
        InitRenderRectMakers();
        updateAction = UpdateScaleDown as System.Action;
        isPlaying = true;
    }
    
    public function Stop() : void {
        isPlaying = false;
    }
    
    public function Init(dayCnt : int, digitSize : Vector2, digitMargin : float, digitStartMargin : float) {
        this.dayCnt = dayCnt;
        this.digitSize = digitSize;
        this.digitMargin = digitMargin;
        this.digitStartMargin = digitStartMargin;
    }
    
    private function InitRenderRectMakers() {
        initialBg = new RenderRectMaker();
        var bgSprite : TileSprite = TextureMgr.instance().BackgroundSpt();
        initialBg.Cache.SourceGroup = bgSprite;
        bgTile = bgSprite.FindTile("Login_down");
        
        iconDefaultBgDraw = new RenderRectMaker();
        iconDefaultBgDraw.Cache.SourceGroup = bgSprite;
        
        iconDraw = new RenderRectMaker();
        var iconSprite : TileSprite = TextureMgr.instance().ItemSpt();
        iconDraw.Cache.SourceGroup = iconSprite;
        //iconFloatDraw = new RenderRectMaker();
        //iconFloatDraw.Cache.SourceImages = iconSprite.SourceImages;
        iconTile = iconSprite.GetTile(null);
        var tileOriginalName : String = TextureMgr.instance().LoadTileNameOfItem(DailyLoginRewardMgr.Instance.Data[dayCnt - 1].ItemId);
        //iconTileFloat = iconSprite.GetTile(Tile.GetSpecialName(tileOriginalName));
        iconTile.name = tileOriginalName;
        
        digitDraw = new RenderRectMaker();
        digitDraw.Cache.SourceGroup = bgSprite;
    }
    
    public function Update() : void {
        if (!isPlaying) { return; }
        
        initialBg.Cache.Clear();
        iconDraw.Cache.Clear();
        //iconFloatDraw.Cache.Clear();
        iconDefaultBgDraw.Cache.Clear();
        digitDraw.Cache.Clear();
        
        time += Time.deltaTime;
        
        if (updateAction != null) {
            updateAction();
        }
    }

    private function UpdateScaleDown() : void {
        var ratio : float = time / scaleDuration;
        var powRatio : float = Mathf.Pow(ratio, easePower);
        currentRect = new Rect(startRect.x + (endRect.x - startRect.x) * powRatio,
            startRect.y + (endRect.y - startRect.y) * powRatio,
            startRect.width + (endRect.width - startRect.width) * powRatio,
            startRect.height + (endRect.height - startRect.height) * powRatio);
        if (time >= scaleDuration) {
            currentRect = endRect;
            updateAction = UpdateAlphaChange as System.Action;
            if (onFirstStageComplete != null) { onFirstStageComplete(); }
        }
        var color : Color = new Color(1, 1, 1, ratio * alphaFactor);
        initialBg.Add(currentRect, bgTile, color);
        currentIconRect = UtilityTools.AmplifyRectByRatio(currentRect, iconToGridRatio);
        if (DailyLoginRewardMgr.Instance.Data[dayCnt - 1].ItemId > 0) {
            iconDefaultBgDraw.Add(currentIconRect, TextureMgr.instance().BackgroundSpt().FindTile("icon_default_bg"), color);
            iconDraw.Add(currentIconRect, iconTile, color);
            //if (iconTileFloat.prop != null) {
            //	iconFloatDraw.Add(currentIconRect, iconTileFloat, color);
            //}
        } else {
            UpdateDigitDraw(currentRect, color);
        }
    }
    
    private function UpdateAlphaChange() : void {
        currentAlpha -= Time.deltaTime / alphaDuration;
        var color : Color = new Color(1, 1, 1, currentAlpha);
        initialBg.Add(currentRect, bgTile, color);
        if (DailyLoginRewardMgr.Instance.Data[dayCnt - 1].ItemId > 0) {
            var iconColor : Color;
            if (currentAlpha > .5) {
                // Linearly maps interval [.5, 1] to [darkness, 1]
                var rgb : float = 1 - 2 * (1 - currentAlpha) * (1 - darkness);
                iconColor = new Color(rgb, rgb, rgb, 1);
            } else {
                iconColor = new Color(darkness, darkness, darkness, 2 * currentAlpha);
            }
            iconDefaultBgDraw.Add(currentIconRect, TextureMgr.instance().BackgroundSpt().FindTile("icon_default_bg"), iconColor);
            iconDraw.Add(currentIconRect, iconTile, iconColor);
            //if (iconTileFloat.prop != null) {
            //	iconDraw.Add(currentIconRect, iconTileFloat, iconColor);
            //}
        } else {
            UpdateDigitDraw(currentRect, color);
        }
        
        if (currentAlpha <= 0) {
            isPlaying = false;
        }
    }
    
    private function UpdateDigitDraw(currentRect : Rect, color : System.Nullable.<Color>) {
        var digitCnt : int = (dayCnt < 10 ? 1 : 2);
        var digitScale : float = currentRect.width / endRect.width;
        var currentDigitStartMargin = digitStartMargin * digitScale;
        var currentDigitSize = digitSize * digitScale;
        var currentDigitMargin = digitMargin * digitScale;
        var tmpDayCnt : int = dayCnt;
        for (var i : int = 0; i < digitCnt; ++i) {
            var digit : int = tmpDayCnt % 10;
            var digitRect = new Rect(currentRect.x + currentDigitStartMargin + (digitCnt - i - 1) * (currentDigitSize.x + currentDigitMargin),
                    currentRect.y + currentDigitStartMargin, currentDigitSize.x, currentDigitSize.y);
            var tile : Tile = TextureMgr.instance().BackgroundSpt().FindTile(String.Format("Login_{0}", digit));
            if (!color.HasValue) {
                digitDraw.Add(digitRect, tile);
            } else {
                digitDraw.Add(digitRect, tile, color.Value);
            }
            tmpDayCnt = tmpDayCnt / 10;
        }
    }

    public function DrawWithMatrices(vsMatrix : Matrix4x4, ortMatrix : Matrix4x4) : void {
        if (!isPlaying) { return; }
        RenderRectMaker.DrawWithMatrices([initialBg, digitDraw, iconDefaultBgDraw, iconDraw/*, iconFloatDraw*/], vsMatrix, ortMatrix);
    }
}