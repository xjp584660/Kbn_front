using System.Linq;

namespace KBN.DataTable
{
    public class Troop : IDataItem
    {
        #region Fields
        
        public int ID;

        public int Type;

        public int TIER;

        public int TRAINABLE;

        public string CITY;

        public int TAP;

        public int Gold;

        public int Food;

        public int Wood;

        public int Stone;

        public int Iron;

        public int Population;

        public int Time;

        public int LIFE;

        public int ATTACK;

        public int SPEED;

        public int LOAD;

        public int UPKEEP;

        public int SPACE;

        public int MIGHT;

        public int LIFE_RATE;

        public int ATTACK_RATE;

        public string REQUIREMENT;

        public string EFFECT;

        public int CURE_GOLD;

        public int CURE_FOOD;

        public int CURE_WOOD;

        public int CURE_STONE;

        public int CURE_IRON;

        public int CURE_POPULATION;

        public int CURE_TIME;

        public int PVE_ATTACK;

        public int PVE_LIFE;

        public int AVA_LIFE;

        public int AVA_ATTACK;

        public int AVA_SPEED;

        public int Carmot;

        public int CURE_CARMOT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            Type = int.Parse(columns[1]);
            TIER = int.Parse(columns[2]);
            TRAINABLE = int.Parse(columns[3]);
            CITY = columns[4];
            TAP = int.Parse(columns[5]);
            Gold = int.Parse(columns[6]);
            Food = int.Parse(columns[7]);
            Wood = int.Parse(columns[8]);
            Stone = int.Parse(columns[9]);
            Iron = int.Parse(columns[10]);
            Population = int.Parse(columns[11]);
            Time = int.Parse(columns[12]);
            LIFE = int.Parse(columns[13]);
            ATTACK = int.Parse(columns[14]);
            SPEED = int.Parse(columns[15]);
            LOAD = int.Parse(columns[16]);
            UPKEEP = int.Parse(columns[17]);
            SPACE = int.Parse(columns[18]);
            MIGHT = int.Parse(columns[19]);
            LIFE_RATE = int.Parse(columns[20]);
            ATTACK_RATE = int.Parse(columns[21]);
            REQUIREMENT = columns[22];
            EFFECT = columns[23];
            CURE_GOLD = int.Parse(columns[24]);
            CURE_FOOD = int.Parse(columns[25]);
            CURE_WOOD = int.Parse(columns[26]);
            CURE_STONE = int.Parse(columns[27]);
            CURE_IRON = int.Parse(columns[28]);
            CURE_POPULATION = int.Parse(columns[29]);
            CURE_TIME = int.Parse(columns[30]);
            PVE_ATTACK = int.Parse(columns[31]);
            PVE_LIFE = int.Parse(columns[32]);
            AVA_LIFE = int.Parse(columns[33]);
            AVA_ATTACK = int.Parse(columns[34]);
            AVA_SPEED = int.Parse(columns[35]);
            Carmot = int.Parse(columns[36]);
            CURE_CARMOT = int.Parse(columns[37]);
        }

        #endregion
    }
}
