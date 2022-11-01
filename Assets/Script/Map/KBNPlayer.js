public class KBNPlayer extends KBN.KBNPlayer
{
	private var seed:HashObject = null;
	/// <summary>
	/// Gets the current player.
	/// </summary>
	/// <value>
	/// The current player.
	/// </value>
	public static function Instance():KBNPlayer
	{
		if (mInstance == null) 
		{
			mInstance = new KBNPlayer();
			GameMain.instance().resgisterRestartFunc(function(){
				mInstance = null;
			});
		}
		return mInstance as KBNPlayer;
	}
	
	public function SetSeed(s:HashObject)
	{
		if(seed != null &&  _Global.INT32(s["player"]["title"])!= _Global.INT32(seed["player"]["title"]))
		{
			NativeCaller.SetRoleLevel(_Global.INT32(s["player"]["title"]), Datas.instance().tvuid().ToString());
		}
		this.seed = s;
	}
	
	/// <summary>
	/// Initializes a new instance of the <see cref="KO"/> class.
	/// </summary>
	private function KBNPlayer()
	{

	}
	/// <summary>
	/// Gets or sets the name.
	/// </summary>
	/// <value>
	/// The name.
	/// </value>
	private var mName:String = "";
	public function getName():String
	{
		if(seed != null && seed["player"] != null && (seed["player"]["name"] != null))
			return seed["player"]["name"].Value;
		if(seed != null && seed["player"] != null && (seed["player"]["displayName"] != null))
			return seed["player"]["displayName"].Value;
		return "";
	}
	
	/// <summary>
	/// Gets or sets the tvuid.
	/// </summary>
	/// <value>
	/// The tvuid.
	/// </value>
	public function getTvuid() 
	{
		return Datas.instance().tvuid();
	}
	
	/// <summary>
	/// Gets or sets a value indicating whether this <see cref="Player"/> in test world.
	/// </summary>
	/// <value>
	/// <c>true</c> if in test world; otherwise, <c>false</c>.
	/// </value>

	public function getInTestWorld():boolean
	{
		if(seed != null && seed["player"] != null && seed["player"]["inTestWorld"] != null)
			return seed["player"]["inTestWorld"].Value;
		return false;
	}

	
	/// <summary>
	/// Gets or sets the might.
	/// </summary>
	/// <value>
	/// The might.
	/// </value>
	

	public function getMight():long 
	{
		if(seed != null && seed["player"] != null && seed["player"]["might"] != null)
			return _Global.INT64(seed["player"]["might"]);
		return 0;
	}
	
	public function setMight(might:int)
	{
		if(seed != null && seed["player"] != null && seed["player"]["might"] != null)
			seed["player"]["might"].Value = might;
	}
	

	public function getTitle():int
	{
		if(seed != null && seed["player"] != null && seed["player"]["title"] != null)
			return _Global.INT32(seed["player"]["title"]);
		return 0;
	}
	
	
	public function getDatejoinUnixTime():long
	{
		if(seed != null && seed["player"] != null && seed["player"]["datejoinUnixTime"] != null)
			return _Global.INT64(seed["player"]["datejoinUnixTime"]);
		return 0;
	}

	
	public function getTruceExpireUnixTime():long
	{
		if(seed != null && seed["player"] != null && seed["player"]["truceExpireUnixTime"] != null)
			return _Global.INT64(seed["player"]["truceExpireUnixTime"]);
		return 0;
	}
	
	public function setTruceExpireUnixTime(timeStamp : long):void
	{
		if (null == seed) 
			return;
			
		if (null == seed["player"]) {
			seed["player"] = new HashObject();
		}
		if (null == seed["player"]["truceExpireUnixTime"]) {
			seed["player"]["truceExpireUnixTime"] = new HashObject();
		}
		seed["player"]["truceExpireUnixTime"].Value = timeStamp.ToString();
	}

	public function getBeginnerProtectionExpireUnixTime():long
	{
		if(seed != null && seed["player"] != null && seed["player"]["beginnerProtectionExpireUnixTime"] != null)
			return _Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]);
		return 0;
	}
	

	
}

