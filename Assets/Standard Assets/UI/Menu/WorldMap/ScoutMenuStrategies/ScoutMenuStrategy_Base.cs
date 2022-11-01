using System;
using UnityEngine;

[Serializable]
public abstract class ScoutMenuStrategy_Base
{
    [SerializeField]
    protected Rect scoutButtonPos;

    public Rect ScoutButtonPos
    {
        get
        {
            return scoutButtonPos;
        }
    }

    [SerializeField]
    protected Rect scoutLabelPos;

    public Rect ScoutLabelPos
    {
        get
        {
            return scoutLabelPos;
        }
    }

    [SerializeField]
    protected string descKey;

    public string DescKey
    {
        get
        {
            return descKey;
        }
    }

    public abstract bool CanScoutInstantly();

    public abstract void StartScout(int targetX, int targetY, bool instant, Action<bool> okFunc);

    public abstract long CalcScoutTime(int targetX, int targetY);

    public abstract int CalcInstantScoutGems(int targetX, int targetY);
}
