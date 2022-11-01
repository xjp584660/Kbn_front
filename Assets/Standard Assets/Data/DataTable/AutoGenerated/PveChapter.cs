using System.Linq;

namespace KBN.DataTable
{
    public class PveChapter : IDataItem
    {
        #region Fields
        
        public int ID;

        public int TYPE;

        public string NAME;

        public string ICON;

        public int SLOT_ID;

        public int PARENT_CHAPTER_ID;

        public int ENABLED;

        public int UNLOCK_STAR;

        public int UNLOCK_MAP_ID;

        public System.DateTime EXPIRE_TIME;

        public int ACTIVE_DURATION;

        public int PROBABILITY;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            TYPE = int.Parse(columns[1]);
            NAME = columns[2];
            ICON = columns[3];
            SLOT_ID = int.Parse(columns[4]);
            PARENT_CHAPTER_ID = int.Parse(columns[5]);
            ENABLED = int.Parse(columns[6]);
            UNLOCK_STAR = int.Parse(columns[7]);
            UNLOCK_MAP_ID = int.Parse(columns[8]);
            EXPIRE_TIME = System.DateTime.Parse(columns[9],System.Globalization.CultureInfo.CreateSpecificCulture("en-US"));
            ACTIVE_DURATION = int.Parse(columns[10]);
            PROBABILITY = int.Parse(columns[11]);
        }

        #endregion
    }
}
