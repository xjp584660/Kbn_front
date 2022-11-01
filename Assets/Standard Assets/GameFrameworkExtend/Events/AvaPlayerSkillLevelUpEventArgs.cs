using GameFramework;

namespace KBN
{
    public class AvaPlayerSkillLevelUpEventArgs : GameEventArgs
    {
        public AvaPlayerSkillLevelUpEventArgs(int skillType, int newLevel)
        {
            SkillType = skillType;
            NewLevel = newLevel;
        }

        public override int Id
        {
            get
            {
                return (int)EventId.AvaPlayerSkillLevelUp;
            }
        }

        public int SkillType
        {
            get;
            private set;
        }

        public int NewLevel
        {
            get;
            private set;
        }
    }
}
