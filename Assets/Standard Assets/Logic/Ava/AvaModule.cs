using System;

public abstract class AvaModule
{
    private readonly AvaManager m_AvaEntry;

    public AvaModule(AvaManager avaEntry)
    {
        if (avaEntry == null)
        {
            throw new ArgumentNullException("avaEntry");
        }

        m_AvaEntry = avaEntry;
        m_AvaEntry.AddModule(this);
    }

    public AvaManager AvaEntry
    {
        get
        {
            return m_AvaEntry;
        }
    }

    public virtual void Init()
    {

    }

    public virtual void Update()
    {

    }

    public virtual void Clear()
    {

    }
}
