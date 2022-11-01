using System.Collections.Generic;

namespace KBN
{
    public enum HeroSkillAffectedProperty
    {
        Food,
        Wood,
        Stone,
        Ore,
		Protection,
		Build,
		Supply,
		Horse,
		Ground,
		Artillery,
        Load,
		GroundSpeed,
		HorseSpeed,
        Fast,
    }

    public delegate float HeroSkillAffectedRatioFunc(long effectId, IList<float> effectParam);
}
