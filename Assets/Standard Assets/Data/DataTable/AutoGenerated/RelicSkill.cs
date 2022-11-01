using System.Linq;

namespace KBN.DataTable
{
    public class RelicSkill : IDataItem
    {
        #region Fields
        
        public int SKILL_ID;

        public int TYPE;

        public string SUBTYPE;

        public int RARE;

        public string DESC;

        public string LEVEL_VALUE;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            SKILL_ID = int.Parse(columns[0]);
            TYPE = int.Parse(columns[1]);
            SUBTYPE = columns[2];
            RARE = int.Parse(columns[3]);
            DESC = columns[4];
            LEVEL_VALUE = columns[5];
        }

        #endregion
    }
}
