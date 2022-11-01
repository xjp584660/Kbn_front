using System.Linq;

namespace KBN.DataTable
{
    public class HeroSkillFate : IDataItem
    {
        #region Fields
        
        public int ID;

        public int SKILL_TYPE;

        public string ICON;

        public string NAME;

        public string DESCRIPTION;

        public int EFFECT;

        public int SKILL_RENOWN;

        public int FATE_HERO_IDS;

        public int FATE_EQUIP_IDS;

        public int TIPS;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            SKILL_TYPE = int.Parse(columns[1]);
            ICON = columns[2];
            NAME = columns[3];
            DESCRIPTION = columns[4];
            EFFECT = int.Parse(columns[5]);
            SKILL_RENOWN = int.Parse(columns[6]);
            FATE_HERO_IDS = int.Parse(columns[7]);
            FATE_EQUIP_IDS = int.Parse(columns[8]);
            TIPS = int.Parse(columns[9]);
        }

        #endregion
    }
}
