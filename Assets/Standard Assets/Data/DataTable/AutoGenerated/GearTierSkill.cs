using System.Linq;

namespace KBN.DataTable
{
    public class GearTierSkill : IDataItem
    {
        #region Fields
        
        public int tier;

        public int partid;

        public string skill;

        public string resetItem;

        public string resetItemCount;

        public string levelItem;

        public string levelItemCount;

        public string skillinfo;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            tier = int.Parse(columns[0]);
            partid = int.Parse(columns[1]);
            skill = columns[2];
            resetItem = columns[3];
            resetItemCount = columns[4];
            levelItem = columns[5];
            levelItemCount = columns[6];
            skillinfo = columns[7];
        }

        #endregion
    }
}
