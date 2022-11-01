using System.Linq;

namespace KBN.DataTable
{
    public class GearSkill : IDataItem
    {
        #region Fields
        
        public int skillid;

        public int type;

        public string subtype;

        public string color;

        public int rare;

        public string iconskill;

        public int iconlevel;

        public string icontarget;

        public int isPercent;

        public string lv;

        public string item;

        public string val;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            skillid = int.Parse(columns[0]);
            type = int.Parse(columns[1]);
            subtype = columns[2];
            color = columns[3];
            rare = int.Parse(columns[4]);
            iconskill = columns[5];
            iconlevel = int.Parse(columns[6]);
            icontarget = columns[7];
            isPercent = int.Parse(columns[8]);
            lv = columns[9];
            item = columns[10];
            val = columns[11];
        }

        #endregion
    }
}
