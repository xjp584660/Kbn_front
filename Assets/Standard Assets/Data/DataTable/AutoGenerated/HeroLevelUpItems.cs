using System.Linq;

namespace KBN.DataTable
{
    public class HeroLevelUpItems : IDataItem
    {
        #region Fields
        
        public int itemId;

        public int itemType;

        public int heroType;

        public int levelLimit;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            itemId = int.Parse(columns[0]);
            itemType = int.Parse(columns[1]);
            heroType = int.Parse(columns[2]);
            levelLimit = int.Parse(columns[3]);
        }

        #endregion
    }
}
