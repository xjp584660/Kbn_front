using System.Linq;

namespace KBN.DataTable
{
    public class Technology : IDataItem
    {
        #region Fields
        
        public int id;

        public int LEVEL;

        public int EXP;

        public int sort;

        public int MAXLEVEL;

        public string UNLOCKREQBUILD;

        public string UNLOCKREQTECH;

        public int GOLD;

        public int FOOD;

        public int WOOD;

        public int STONE;

        public int ORE;

        public int Carmot;

        public string ITEM;

        public int TIME;

        public string UPGRATEREQ;

        public string EFFECT;

        public int MIGHT;

        public string ICON;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            id = int.Parse(columns[0]);
            LEVEL = int.Parse(columns[1]);
            EXP = int.Parse(columns[2]);
            sort = int.Parse(columns[3]);
            MAXLEVEL = int.Parse(columns[4]);
            UNLOCKREQBUILD = columns[5];
            UNLOCKREQTECH = columns[6];
            GOLD = int.Parse(columns[7]);
            FOOD = int.Parse(columns[8]);
            WOOD = int.Parse(columns[9]);
            STONE = int.Parse(columns[10]);
            ORE = int.Parse(columns[11]);
            Carmot = int.Parse(columns[12]);
            ITEM = columns[13];
            TIME = int.Parse(columns[14]);
            UPGRATEREQ = columns[15];
            EFFECT = columns[16];
            MIGHT = int.Parse(columns[17]);
            ICON = columns[18];
        }

        #endregion
    }
}
