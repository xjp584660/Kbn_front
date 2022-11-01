#pragma strict

public class TroopListItem extends ListItem
{
    public class DisplayData
    {
        public var troopId : int;

        public var troopCount : int;
    
        public function DisplayData() {}
        
        public function DisplayData(id : int, cnt : int)
        {
            troopId = id;
            troopCount = cnt;
        }

        public function DisplayData(o : DisplayData)
        {
            this(o.troopId, o.troopCount);
        }

        public function get TroopIconTile() : Tile
        {
            var texMgr : TextureMgr = TextureMgr.instance();
            var unitSpt : TileSprite = texMgr.UnitSpt();
            return unitSpt.GetTile("ui_" + this.troopId.ToString());
        }
        public function get TroopName() : String
        {
            return Datas.getArString("unitName.u" + this.troopId.ToString());
        }
    }
    
    @SerializeField
    private var bg : Label;
    
    private var coverMaterial : Material;
    public function set CoverMaterial(value : Material)
    {
        coverMaterial = value;
    }

    private var coverTexture : Texture2D;
    public function set CoverTexture(value : Texture2D)
    {
        coverTexture = value;
    }
    
    private var coverIsVisible : boolean = false;
    public function set CoverIsVisible(value : boolean)
    {
        coverIsVisible = value;
    }
    public function get CoverIsVisible() : boolean
    {
        return coverIsVisible;
    }
    
    private var clipScreenRect : Rect;
    public function set ClipScreenRect(value : Rect)
    {
        clipScreenRect = value;
    }
    
    private var progress : float;
    public function set Progress(value : float)
    {
        progress = value;
        if (coverMaterial == null)
        {
            return;
        }
        coverMaterial.SetFloat("_Radians", (1 - progress) * Mathf.PI * 2);
    }
    
    public function get Progress() : float
    {
        return progress;
    }
    
    public function Init() : void
    {
        var texMgr : TextureMgr = TextureMgr.instance();
        bg.mystyle.normal.background = texMgr.LoadTexture("square_black", TextureType.DECORATION);
        bg.rect.width = this.rect.width;
        bg.rect.height = this.rect.height;
    }
    
    public function SetRowData(obj : Object) : void
    {
        var data : DisplayData = obj as DisplayData;
        icon.useTile = true;
        icon.tile = data.TroopIconTile;
        title.txt = data.TroopName;
        description.txt = data.troopCount.ToString();
    }
    
    public function Draw() : int
    {
        if (visible)
        {
            GUI.BeginGroup(rect);
            bg.Draw();
            GUI.EndGroup();
        }
        var ret : int = super.Draw();
        if (visible && clipScreenRect.width > 0 && clipScreenRect.height > 0)
        {
            DrawProgressCover();
        }
        return ret;
    }
    
    private function DrawProgressCover() : void
    {
        if (!coverIsVisible)
        {
            return;
        }

        GUI.BeginGroup(rect);
        var coverScreenRect : Rect = _Global.CalcScreenRect(icon.rect);
        if (coverScreenRect.yMax >= clipScreenRect.y && coverScreenRect.y <= clipScreenRect.yMax)
        {
            var vMin : float = 0f;
            var vMax : float = 1f;
            var drawRect : Rect = icon.rect;
            if (coverScreenRect.y < clipScreenRect.y)
            {
                vMax = (coverScreenRect.yMax - clipScreenRect.y) / coverScreenRect.height;
            }
            if (coverScreenRect.yMax > clipScreenRect.yMax)
            {
                vMin = 1f - (clipScreenRect.yMax - coverScreenRect.y) / coverScreenRect.height;
            }
            
            drawRect.y = (1f - vMax) * drawRect.height + drawRect.y;
            drawRect.height = (vMax - vMin) * drawRect.height;

            Graphics.DrawTexture(drawRect, coverTexture, new Rect(1f, vMin, -1f, vMax - vMin),
                0, 0, 0, 0, coverMaterial);
        }
        GUI.EndGroup();
    }
}