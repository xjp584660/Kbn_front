public class TechnologyHint extends MonoBehaviour
{
	public var fteLight : Transform;
	public var cameraObj : GameObject;

	function Awake()
	{		
		
	}

	public function SetLightPos(pos : Vector2)
	{
		gameObject.SetActive(true);
		var curCamera : Camera = cameraObj.GetComponent(Camera);
		fteLight.transform.position = curCamera.ScreenToWorldPoint(new Vector3(pos.x,pos.y,0));
		_Global.Log("Hint : Pos : " + fteLight.transform.position);
	}
}