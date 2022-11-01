namespace KBN
{
    public class HeroExploreItem
    {
        private int m_Index = 0;

        public HeroExploreItem(int index)
        {
            m_Index = index;
        }

        public int Index
        {
            get
            {
                return m_Index;
            }
        }

        public int Type
        {
            get;
            set;
        }

        public string Name
        {
            get
            {
				return Datas.getArString(string.Format("itemName.i{0}", Type.ToString()));
            }
        }

        public string Description
        {
            get
            {
				return Datas.getArString(string.Format("itemDesc.i{0}", Type.ToString()));
            }
        }

        public bool Opened
        {
            get;
            set;
        }

        public int Count
        {
            get;
            set;
        }
    }
}
