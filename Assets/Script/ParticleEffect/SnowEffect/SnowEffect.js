
class SnowEffect extends MonoBehaviour
{
	private var ps:ParticleSystem;
	public function Awake()
	{
		transform.localPosition.y = Constant.LayerY.LAYERY_PARTICLE;
		ps = this.GetComponent(ParticleSystem);
	}
	
	private function setEffectState(_stateName:String):void
	{	
		switch(_stateName)
		{
			case "on":
				ps.emissionRate = 10;
				break;
				
			case "off":			
				ps.emissionRate = 0;
				break;			
		}
	}
}