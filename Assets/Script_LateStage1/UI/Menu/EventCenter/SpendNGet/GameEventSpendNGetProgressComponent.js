#pragma strict

public class GameEventSpendNGetProgressComponent extends UIObject
{
    @SerializeField
    private var bgImage : SimpleLabel;
    @SerializeField
    private var gemsSpentLabel : SimpleLabel;
    @SerializeField
    private var percentBar : PercentBar;
    @SerializeField
    private var alreadyCompleteLabel : SimpleLabel;
    
    @SerializeField
    private var bgImageName : String;
    @SerializeField
    private var gemsSpentKey : String;
    @SerializeField
    private var alreadyCompleteKey : String;
    @SerializeField
    private var graduationTemplate : SpendNGetGraduation;
    @SerializeField
    private var bgBorder : RectOffset;

    private var data : GameEventDetailInfoSpendNGet;
    private var graduations : List.<SpendNGetGraduation>;

    public function Init() : void
    {
        var texMgr : TextureMgr = TextureMgr.instance();
        bgImage.mystyle.normal.background = texMgr.LoadTexture(bgImageName, TextureType.DECORATION);
        bgImage.rect = new Rect(bgBorder.left, bgBorder.top,
            rect.width - bgBorder.left - bgBorder.right, rect.height - bgBorder.top - bgBorder.bottom);
        graduations = new List.<SpendNGetGraduation>();
    }
    
    public function SetData(data : GameEventDetailInfoSpendNGet) : void
    {
        Clear();
        this.data = data;
        gemsSpentLabel.txt = String.Format(Datas.getArString(gemsSpentKey), data.GemsSpent);
        SetDataToPercentBar();
        SetGraduations();
    }
    
    public function Clear() : void
    {
        for (var i : int = 0; i < graduations.Count; ++i)
        {
            if (graduations[i] == null)
            {
                continue;
            }
            
            Destroy(graduations[i].gameObject);
        }
        
        graduations.Clear();
    }
     
    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }
        
        GUI.BeginGroup(rect);
        bgImage.Draw();
        gemsSpentLabel.Draw();
        percentBar.Draw();
        DrawGraduations();
        alreadyCompleteLabel.Draw();
        GUI.EndGroup();
        
        return -1;
    }
    
    private function SetDataToPercentBar() : void
    {
        var progress : int = 0;
        if (data.IsRepeatable)
        {
            alreadyCompleteLabel.SetVisible(true);
            progress = data.GemsSpent % data.MaxGemsCount;
            if (data.GemsSpent >= data.MaxGemsCount && progress == 0) // Has completed the progress at least once
            {   
                progress = data.MaxGemsCount;
            }
            var times : int = data.GemsSpent / data.MaxGemsCount;
            var timesStr : String = String.Format("<color={0}>{1}</color>", 
                _Global.ColorToString(FontMgr.GetColorFromTextColorEnum(FontColor.Dark_Red)), times);
            alreadyCompleteLabel.txt = String.Format(Datas.getArString(alreadyCompleteKey), timesStr);
        }
        else
        {
            alreadyCompleteLabel.SetVisible(false);
            progress = Mathf.Min(data.GemsSpent, data.MaxGemsCount);
        }

        percentBar.Init(progress, data.MaxGemsCount);
        percentBar.changeBG("gems_progress-bar2", TextureType.DECORATION);
        percentBar.changeThumbBG("gems_progress-bar", TextureType.DECORATION);
    }
    
    private function SetGraduations() : void
    {
        for (var i : int = 0; i < data.Milestones.Count; ++i)
        {
            var milestone : GameEventDetailInfoSpendNGet.Milestone = data.Milestones[i];
            var graduation : SpendNGetGraduation = Instantiate(graduationTemplate) as SpendNGetGraduation;
            var percentage : float = (milestone.GemsCount + 0.0f) / data.MaxGemsCount;
            graduation.rect.x = percentBar.ThumbOuterRect.x + percentage * percentBar.ThumbOuterRect.width - graduation.Offset.x;
            graduation.rect.y = percentBar.rect.y - graduation.Offset.y - 0.5f * (graduation.graduationHeight - percentBar.rect.height);
            graduation.Init();
            graduation.SetData(i, milestone.GemsCount);
            graduations.Add(graduation);
        }
    }
    
    private function DrawGraduations() : void
    {
        for (var i : int = graduations.Count - 1; i >= 0 ; i--)
        {
            graduations[i].Draw();
        }
    }
}