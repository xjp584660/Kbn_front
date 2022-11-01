class RainBox extends MonoBehaviour
{
	private var mf:MeshFilter;
	private var speed:int;
		
	public function Init(_mf:Mesh, _speed:int):void
	{		
		mf = GetComponent.<MeshFilter>();		
		mf.sharedMesh = _mf;
		
		speed = _speed;										
	}
	
	public function get Speed():int
	{
		return speed;
	}
}