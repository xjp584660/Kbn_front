class PveCup extends BlowUpLabel
{
	enum LIGHT_TYPE{
		NONE,
		LIGHT,
		DARK
	};
	@SerializeField private var cupLight :Label;
	@SerializeField private var alphaSpeed:float;
	private var curAlpha:float;
	private var lightType:LIGHT_TYPE;
	private var m_rotate:Rotate;
	@SerializeField private var rotateSpeed:float;
	
	public function Init():void
	{
		super.Init();
//		cupLight.setBackground("cup_light",TextureType.DECORATION);
		cupLight.setBackground("payment_light",TextureType.DECORATION);
		cupLight.SetVisible(false);
		m_rotate = new Rotate();
		m_rotate.init(cupLight,EffectConstant.RotateType.LOOP,Rotate.RotateDirection.CLOCKWISE,0.0f,0.0f);
		m_rotate.playEffect();
		
		curAlpha = 0;
		lightType = LIGHT_TYPE.NONE;
	}
	
	public function Draw()
	{
		var oldAlpha:float = GUI.color.a;
//		GUI.color.a = curAlpha;
//		
//		cupLight.Draw();
//		
//		GUI.color.a = oldAlpha;
		m_rotate.rotateMultiple = rotateSpeed;
		m_rotate.drawItems();
		
		super.Draw();
	}
	
	function Update () {
		super.Update ();
		if(labelState == LABEL_STATE.OVER)
		{
//			switch(lightType)
//			{
//			case LIGHT_TYPE.LIGHT:
//				curAlpha+=alphaSpeed*Time.deltaTime;
//				if(curAlpha>=1)
//				{
//					curAlpha = 1;
//					lightType = LIGHT_TYPE.DARK;
//				}
//				break;
//			case LIGHT_TYPE.DARK:
//				curAlpha-=alphaSpeed*Time.deltaTime;
//				if(curAlpha<=0)
//				{
//					curAlpha = 0;
//					lightType = LIGHT_TYPE.LIGHT;
//				}
//				break;
//			}
				
			m_rotate.updateEffect();
			
		}
	}
	
	function End()
	{
		super.End();
		cupLight.SetVisible(true);
		curAlpha = 0;
		lightType = LIGHT_TYPE.LIGHT;
	}
	
	function Begin () {
		SoundMgr.instance().PlayEffect("kbn_pve_newrecord", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		labelState = LABEL_STATE.BLOW_UP;
	}
}