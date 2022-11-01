using UnityEngine;
using System.Collections.Generic;
using KBN;

public class MoveMapLoadingLabel : SimpleUIObj 
{

	public  SimpleLabel	aniLabel;
	public  const int addAngle = 36;
	private	float frameTimeCtrl;
		
	// Use this for initialization
	public override void Init () 
	{
		aniLabel.image = TextureMgr.instance().LoadTexture("mapMoveLoad",TextureType.LOADING);
	}
	
	// Update is called once per frame
	public override void Update () 
	{
		if( !visible ){
			return;
		}
		
		frameTimeCtrl -= Time.deltaTime;
		if( frameTimeCtrl < 0 ){

			aniLabel.rotateAngle += addAngle;
			
			frameTimeCtrl += 0.05f; //0.1 means 10f/s
		}
	}

	public override int Draw()
	{					
		if( !visible ){
			return -1;
		}
		aniLabel.rect = this.rect;
		aniLabel.Draw();
		return -1;
	}
}




