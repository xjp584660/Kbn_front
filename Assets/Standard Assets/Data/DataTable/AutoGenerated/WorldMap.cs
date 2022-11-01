using System.Linq;

namespace KBN.DataTable
{
    public class WorldMap : IDataItem
    {
        #region Fields
        
        public int TILE_KIND;

        public string TILE_IMAGE;

        public int TILE_LEVEL;

        public string TILE_BOSS;

        public int KNIGHT;

        public string RANK_BETWEEN;

        public int PERCENT;

        public int BASE;

        public int POINT;

        public string ITEM;

        public string SCORE;

        public string TIME_COST;

        public string UNIT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            TILE_KIND = int.Parse(columns[0]);
            TILE_IMAGE = columns[1];
            TILE_LEVEL = int.Parse(columns[2]);
            TILE_BOSS = columns[3];
            KNIGHT = int.Parse(columns[4]);
            RANK_BETWEEN = columns[5];
            PERCENT = int.Parse(columns[6]);
            BASE = int.Parse(columns[7]);
            POINT = int.Parse(columns[8]);
            ITEM = columns[9];
            SCORE = columns[10];
            TIME_COST = columns[11];
            UNIT = columns[12];
        }

        #endregion
    }
}
