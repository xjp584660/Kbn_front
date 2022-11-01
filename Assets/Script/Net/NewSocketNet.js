public class NewSocketNet extends KBN.NewSocketNet
{
	public static function GetInstance() : NewSocketNet
	{
		if (instance == null)
		{
			instance = new NewSocketNet();
		}

		return instance;
	}

	public function RegisterAllHandlers() : void
	{
		super.RegisterAllHandlers();
		// js的消息回调放这里
	    RegisterHandler(new ErrorHandler());
	    RegisterHandler(new EventRespHandler());
		//RegisterHandler(new BattleInfoHandler());
	}
}