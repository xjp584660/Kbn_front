#pragma strict

public class SpendNGetGraduation extends UIObject
{
    @SerializeField
    private var bubbleBox : SimpleLabel;
    @SerializeField
    private var rewardTip : SimpleLabel;
    @SerializeField
    private var bubbleArrow : SimpleLabel;
    @SerializeField
    private var graduation : SimpleLabel;
    @SerializeField
    private var numberLabel : SimpleLabel;
    
    @SerializeField
    private var offset : Vector2;
    @SerializeField
    private var rewardTipKey : String = "Reward {0}";

    @SerializeField private var folatY: float;


    public function getGraduation(): SimpleLabel {
        return graduation;
    }

    public function get Offset() : Vector2
    {
        return offset;
    }
    
    public function get graduationHeight() : float
    {
        return graduation.rect.height;
    }

    public function Init() : void
    {
    	var texMgr : TextureMgr = TextureMgr.instance();
    	var iconSpt : TileSprite = texMgr.IconSpt();
    	bubbleBox.useTile = true;
    	bubbleBox.tile = iconSpt.GetTile("Login_bubble");
        //bubbleBox.mystyle.normal.background = TextureMgr.instance().LoadTexture("Login_bubble", TextureType.BACKGROUND);
        bubbleArrow.mystyle.normal.background = texMgr.LoadTexture("Login_bubbleArrow", TextureType.BACKGROUND);
        graduation.tile = iconSpt.GetTile("Graduation");
    }

    public function SetData(index : int, number : int) : void
    {   
        bubbleBox.rect.x = 0f;
        bubbleBox.rect.y = 0f;
        bubbleBox.rect.width = rect.width;
        
        rewardTip.rect = bubbleBox.rect;
        rewardTip.txt = String.Format(Datas.getArString(rewardTipKey), index + 1);
        
        bubbleArrow.rect.x = offset.x - .5f * bubbleArrow.rect.width;
        bubbleArrow.rect.y = offset.y - bubbleArrow.rect.height;
        
        graduation.rect.x = offset.x - .5f * graduation.rect.width;
        graduation.rect.y = offset.y;

        if (index % 2 == 0) {
            numberLabel.rect.y = offset.y + graduation.rect.height;
        }
        else
        {
            numberLabel.rect.y = offset.y + graduation.rect.height - folatY;
        }
        numberLabel.rect.x = offset.x - .5f * numberLabel.rect.width;
        numberLabel.txt = number.ToString();
    }
    
    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }
        
        GUI.BeginGroup(rect);
        bubbleBox.Draw();
        bubbleArrow.Draw();
        rewardTip.Draw();
        graduation.Draw();
        numberLabel.Draw();
        GUI.EndGroup();
    }
}