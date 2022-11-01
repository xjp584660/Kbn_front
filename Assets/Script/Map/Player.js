public class Player
{

	private static var _instance : Player;
	private function Player()
	{
	}
	
	public static function getInstance():Player
	{
		if(_instance == null){
			_instance = new Player();
			GameMain.instance().resgisterRestartFunc(function(){
				_instance = null;
			});	
		}
		return _instance;
	}
	
	protected var seed:HashObject;
	protected var _playerVO:PlayerVO;
	
	public function init(seed:HashObject):void
	{
		this.seed =  seed;
		this.syncPlayerVO();
	}
	
	public function syncPlayerVO():void
	{
		if(_playerVO == null)
			_playerVO = new PlayerVO();
		
		playerVO.mergeDataFrom(seed["player"]);
		
	}
	
	public function get playerVO():PlayerVO
	{
		return _playerVO;
	}
    
    public function get CanBuyInstantBuildOrResearch() : boolean {
        return _playerVO.CanBuyInstantBuildOrResearch;
    }
}

class PlayerVO extends BaseVO
{
	public var name		:String;
	public var sex		:int;
	public var prefix  	:String;
	public var avatarurl:String;
	public var avatarId :int;
	public var gems		:int;
	public var might	:long;	
	public var title	:int;
	
    private static final var MinLevelToBuyInstantBuildOrResearch = 2;
    
	public function mergeDataFrom(src:Object):void
	{
		super.mergeDataFrom(src);
		
		name = this.getString("name");
		sex = this.getInt("sex");
		prefix = this.getString("prefix");
		//......		
		title = this.getInt("title");
	
	}
	
	public function get level():int
	{
		return title;
	}
	
    public function get CanBuyInstantBuildOrResearch() : boolean {
        return title >= MinLevelToBuyInstantBuildOrResearch;
    }
}
