using System.Linq;

namespace KBN.DataTable
{
    public class HeroSkillLevel : IDataItem
    {
        #region Fields
        
        public int SKILLID;

        public int SKILLLV;

        public string PARAMS;

        public string REQUIREHEROLV;

        public string REQUIREMENTS;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            SKILLID = int.Parse(columns[0]);
            SKILLLV = int.Parse(columns[1]);
            PARAMS = columns[2];
            REQUIREHEROLV = columns[3];
            REQUIREMENTS = columns[4];
        }

        #endregion
    }
}
