#pragma strict

public class GemsInfoMenu extends PopMenu {
    @SerializeField private var dividingLineBelowTitle : Label;
    @SerializeField private var gemsFormula : Label;
    @SerializeField private var dividingLine1 : Label;
    @SerializeField private var normalGems : Label;
    @SerializeField private var dividingLine2 : Label;
    @SerializeField private var shadowGems : Label;
    @SerializeField private var dividingLine3 : Label;
    @SerializeField private var desc : Label;
    
    @SerializeField private var baseHeight : float;
    
    public function Init() : void {
        title.txt = Datas.getArString("Gems.GemBalance").ToUpper();
        dividingLineBelowTitle.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line", TextureType.DECORATION);
        gemsFormula.txt = String.Format("{0} = {1} + {2}", 
                Datas.getArString("Gems.GemBalance"),
                Datas.getArString("Gems.NormalGems"),
                Datas.getArString("Gems.ShadowGems"));
        normalGems.txt = String.Format("{0}: {1}", Datas.getArString("Gems.NormalGems"), Payment.instance().NormalGems);
        shadowGems.txt = String.Format("{0}: {1}", Datas.getArString("Gems.ShadowGems"), Payment.instance().ShadowGems);
        desc.txt = Datas.getArString("Gems.GemsDesc");
        dividingLine1.mystyle.normal.background = dividingLine2.mystyle.normal.background = dividingLine3.mystyle.normal.background =
                TextureMgr.instance().LoadTexture("bg_line_bright", TextureType.DECORATION);
        var menuHeight : float = baseHeight + desc.mystyle.CalcHeight(new GUIContent(desc.txt, null, null), desc.rect.width);
        this.rect = new Rect(this.rect.x, (960 - menuHeight) * 0.5f, this.rect.width, menuHeight);
        super.Init();
    }
    
    public function DrawItem() : void {
        if (!IsPaint()) return;
        dividingLineBelowTitle.Draw();
        gemsFormula.Draw();
        dividingLine1.Draw();
        normalGems.Draw();
        dividingLine2.Draw();
        shadowGems.Draw();
        dividingLine3.Draw();
        desc.Draw();
    }
}