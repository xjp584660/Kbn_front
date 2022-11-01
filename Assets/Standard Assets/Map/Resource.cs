using UnityEngine;
using System.Collections;

namespace KBN {

	public abstract class Resource {

		public static Resource singleton;
		//static 
		public static Texture2D getResourceTexure(int type)
		{
			Texture2D texture = null;
			switch(type)
			{
			case Constant.ResourceType.FOOD:
				texture = TextureMgr.instance().LoadTexture("resource_Food_icon",TextureType.ICON);
				break;
			case Constant.ResourceType.IRON:
				texture = TextureMgr.instance().LoadTexture("resource_Ore_icon",TextureType.ICON);
				break;
			case Constant.ResourceType.STONE:
				texture = TextureMgr.instance().LoadTexture("resource_Stone_icon",TextureType.ICON);
				break;
			case Constant.ResourceType.LUMBER:
				texture = TextureMgr.instance().LoadTexture("resource_Wood_icon",TextureType.ICON);
				break;
			case Constant.ResourceType.GOLD:
				texture = TextureMgr.instance().LoadTexture("resource_Gold_icon",TextureType.ICON);
				break;	
			case Constant.ResourceType.CARMOT:
				texture = TextureMgr.instance().LoadTexture("resource_Steel_icon",TextureType.ICON);
				break;
			}
			return texture;
		}

		public abstract double getCountForTypeInSeed(int resourceId, int cityId);
		public abstract	double addToSeed(int resourceId, long amount, int cityId);
		public abstract void UpdateRecInfo();
		public abstract int GetCastleLevel();
		public abstract int GetCastleLevel(int cityId);
	}

}