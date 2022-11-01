using System;

public abstract class AvaUseItemRule
{
    public abstract int[] GetIdoneousItemTypes();

    public abstract bool ShowUse(AvaItem item);

    public abstract bool CanUse(AvaItem item);

    public abstract void Use(AvaItem item, object[] args);
}
