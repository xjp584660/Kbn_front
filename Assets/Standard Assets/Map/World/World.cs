public class World
{
	private HashObject _seed;
	private static World singleton;
	private  HashObject Seed
	{
		get
		{
			if(_seed == null)
			{
				_seed = KBN.GameMain.singleton.getSeed();
			}
			return _seed;
		}
	}
	
	public bool IsTestWorld()
	{
		if( Seed["player"] != null &&  Seed["player"]["inTestWorld"] != null)
		{
			bool testing = KBN._Global.GetBoolean(Seed["player"]["inTestWorld"]);
			return testing;
		}
		return false;
	}

	public static World instance()
	{
		if(singleton == null)
		{
			singleton = new World();
			System.Action resetFunc = ()=>singleton = null;
			KBN.GameMain.singleton.resgisterRestartFunc(resetFunc);		
		}
		
		return singleton;
	}
}
