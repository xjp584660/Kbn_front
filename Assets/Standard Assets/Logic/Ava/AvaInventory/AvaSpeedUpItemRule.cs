using System;

public class AvaSpeedUpItemRule : AvaUseItemRule
{
    public override int[] GetIdoneousItemTypes()
    {
        return new int[] { 6802, 6803, 6804, 6805, 6902, 6903, 6904, 6905 };
    }

    public override bool ShowUse(AvaItem item)
    {
        return false;
    }

    public override bool CanUse(AvaItem item)
    {
        return false;
    }

    public override void Use(AvaItem item, object[] args)
    {
    }
}
