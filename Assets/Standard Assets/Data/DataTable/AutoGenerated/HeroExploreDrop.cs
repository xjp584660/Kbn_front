using System.Linq;

namespace KBN.DataTable
{
    public class HeroExploreDrop : IDataItem
    {
        #region Fields
        
        public int ID;

        public int MIN_SPEED;

        public int MAX_SPEED;

        public int MIN_HEROLEVEL;

        public int MAX_HEROLEVEL;

        public string LAYOUT_;

        public string WEIGHT_;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            MIN_SPEED = int.Parse(columns[1]);
            MAX_SPEED = int.Parse(columns[2]);
            MIN_HEROLEVEL = int.Parse(columns[3]);
            MAX_HEROLEVEL = int.Parse(columns[4]);
            LAYOUT_ = columns[5];
            WEIGHT_ = columns[6];
        }

        #endregion
    }
}
