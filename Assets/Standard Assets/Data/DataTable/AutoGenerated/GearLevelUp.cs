using System.Linq;

namespace KBN.DataTable
{
    public class GearLevelUp : IDataItem
    {
        #region Fields
        
        public int gearid;

        public int level;

        public int mightSucc;

        public int mightFail;

        public int BaseItem;

        public int BaseItemCount;

        public string item;

        public string num;

        public string rate;

        public string showRate;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            gearid = int.Parse(columns[0]);
            level = int.Parse(columns[1]);
            mightSucc = int.Parse(columns[2]);
            mightFail = int.Parse(columns[3]);
            BaseItem = int.Parse(columns[4]);
            BaseItemCount = int.Parse(columns[5]);
            item = columns[6];
            num = columns[7];
            rate = columns[8];
            showRate = columns[9];
        }

        #endregion
    }
}
