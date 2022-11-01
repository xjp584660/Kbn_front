using System.Linq;

namespace KBN.DataTable
{
    public class Building : IDataItem
    {
        #region Fields
        
        public int ID;

        public int LEVEL;

        public string PRESTIGE;

        public int City;

        public int Gold;

        public int Food;

        public int Wood;

        public int Stone;

        public int Iron;

        public int Population;

        public int Time;

        public int Exp;

        public string Image;

        public string Icon;

        public string REQUIREMENT;

        public string EFFECT;

        public string Carmot;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            LEVEL = int.Parse(columns[1]);
            PRESTIGE = columns[2];
            City = int.Parse(columns[3]);
            Gold = int.Parse(columns[4]);
            Food = int.Parse(columns[5]);
            Wood = int.Parse(columns[6]);
            Stone = int.Parse(columns[7]);
            Iron = int.Parse(columns[8]);
            Population = int.Parse(columns[9]);
            Time = int.Parse(columns[10]);
            Exp = int.Parse(columns[11]);
            Image = columns[12];
            Icon = columns[13];
            REQUIREMENT = columns[14];
            EFFECT = columns[15];
            Carmot = columns[16];
        }

        #endregion
    }
}
