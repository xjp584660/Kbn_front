using GameFramework;

namespace KBN
{
    public class AvaMoveTileEventArgs : GameEventArgs
    {
        public AvaMoveTileEventArgs(int oldXCoord, int oldYCoord, int newXCoord, int newYCoord)
        {
            OldXCoord = oldXCoord;
            OldYCoord = oldYCoord;
            NewXCoord = newXCoord;
            NewYCoord = newYCoord;
        }

        public override int Id
        {
            get
            {
                return (int)EventId.AvaMoveTile;
            }
        }

        public int OldXCoord
        {
            get;
            private set;
        }

        public int OldYCoord
        {
            get;
            private set;
        }

        public int NewXCoord
        {
            get;
            private set;
        }

        public int NewYCoord
        {
            get;
            private set;
        }
    }
}
