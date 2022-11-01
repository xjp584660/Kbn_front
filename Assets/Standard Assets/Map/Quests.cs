using UnityEngine;
using System.Collections;

namespace KBN
{
    public abstract class Quests
    {
        public static Quests singleton { get; protected set; }

        public abstract void checkForElse();

		public Tile getTexture(int questId)
		{
			HashObject questlist = Datas.singleton.questlist();
			HashObject questImage = questlist["q" + questId]["image"];

			TileSprite spt = TextureMgr.instance().BuildingSpt();
			Tile tile = null;
			if(_Global.GetString(questImage["a0"]) != "999")
			{
				if(_Global.GetString(questImage["a0"]) != "7")
				{
					tile = spt.GetTile(_Global.GetString(questImage["a1"]));
				}
				else
				{
					return null;
				}
			}
			return tile;
        }

        public void SetQuestTexture(Label lbl, int questId, bool useTileSize)
        {
            var questlist = Datas.singleton.questlist();
            var questImage = questlist["q" + questId]["image"];
            var tile = getTexture(questId);

            lbl.mystyle.normal.background = null;
            lbl.useTile = false;

            if (_Global.GetString(questImage["a0"]) != "999")
            {
                if (_Global.GetString(questImage["a0"]) != "7")
                {
                    if(tile != null)
                    {
                        lbl.useTile = true;
                        if (useTileSize)
                        {
                            lbl.rect.width = tile.rect.width;
                            lbl.rect.height = tile.rect.height;
                        }
                        lbl.tile = tile;
                    }
                }
                else
                {
                    lbl.mystyle.normal.background = TextureMgr.instance()
						.LoadTexture(_Global.GetString(questImage["a1"]),TextureType.MAP17D3A_TILE);
                }
            }
            else
            {
                lbl.mystyle.normal.background = TextureMgr.instance()
                    .LoadTexture(_Global.GetString(questImage["a1"]),TextureType.BUTTON);
            }
        }
    }
}
