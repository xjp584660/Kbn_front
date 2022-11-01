using System.Linq;

namespace KBN.DataTable
{
    public class PveMap : IDataItem
    {
        #region Fields
        
        public int ID;

        public string NAME;

        public string DESCRIPTION;

        public int PARENT_MAP_ID;

        public int UNLOCK_STAR;

        public int STORY_ID;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            NAME = columns[1];
            DESCRIPTION = columns[2];
            PARENT_MAP_ID = int.Parse(columns[3]);
            UNLOCK_STAR = int.Parse(columns[4]);
            STORY_ID = int.Parse(columns[5]);
        }

        #endregion
    }
}
