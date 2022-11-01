using UnityEngine;
using System.Collections;

public	class MapGrid : MonoBehaviour{
	public	GameObject gridLine;
	private	float xStep;
	private	float yStep;
	
	private	float cameraXMoved;
	private	float cameraYMoved;
	
	public	void init( float xStep, float yStep, int xCnt, int yCnt ){
		this.xStep = xStep;
		this.yStep = yStep;
		
		int i;
		GameObject lineInst;
		float startPos = -xStep * (xCnt-1) /2;
		float scale = yCnt * 77;// 77 is tile hight
		Shader shader = Shader.Find("_KBNShaders_/kbnMapGrid");
		for( i = 0; i < xCnt; i ++ ){
			lineInst = GameObject.Instantiate( gridLine ) as GameObject;
			
			lineInst.transform.Rotate(0,90,0);
			lineInst.transform.parent = transform;
			lineInst.transform.SetPositionX(startPos + i * xStep);
			lineInst.transform.SetLocalScaleX(scale);
//			lineInst.renderer.material.mainTexture = TextureMgr.instance().LoadTexture("map_grid",TextureType.BACKGROUND);
			MaterialMgr.instance.SetTextureWithSameMaterial(lineInst.GetComponent<Renderer>(), "map_grid", TextureType.BACKGROUND, shader);
		}
		
		startPos = -yStep * (yCnt-1) /2;
		scale = xCnt * 128;//128 is tile width
		for( i = 0; i < yCnt; i ++ ){
			lineInst = GameObject.Instantiate( gridLine ) as GameObject;
			
			lineInst.transform.parent = transform;
			lineInst.transform.SetPositionZ(startPos + i * yStep);
			lineInst.transform.SetLocalScaleX(scale);
//			lineInst.renderer.material.mainTexture = TextureMgr.instance().LoadTexture("map_grid",TextureType.BACKGROUND);
			MaterialMgr.instance.SetTextureWithSameMaterial(lineInst.GetComponent<Renderer>(), "map_grid", TextureType.BACKGROUND, shader);
		}
	}
	
	public	void recenter( float x, float y ){
		cameraXMoved = 0f;
		cameraYMoved = 0f;
		
		transform.SetPositionX(x);//transform.position.x = x;
		transform.SetPositionZ(y);//transform.position.z = y;
	}
	
	public	void onCameraMoved( float x, float y ){
		cameraXMoved += x;
		cameraYMoved += y;
		
		float xTrans = 0;
		float yTrans = 0;
		int stepCnt;
		int dir;
		
		stepCnt = Mathf.FloorToInt(Mathf.Abs(cameraXMoved*100)/(xStep*100));
		//		_Global.Log("xstepCnt:" + stepCnt + " cameraXMoved:" + cameraXMoved + " xStep:" + xStep );
		if( stepCnt > 1 ){
			dir = cameraXMoved > 0 ? 1 : -1;
			xTrans =  stepCnt * xStep * dir;
			cameraXMoved -= xTrans;
		}
		
		
		stepCnt = Mathf.FloorToInt(Mathf.Abs(cameraYMoved*100)/(yStep*100));
		//		_Global.Log("ystepCnt:" + stepCnt + " cameraYMoved:" + cameraYMoved + " yStep:" + yStep );
		if( stepCnt > 1 ){
			dir = cameraYMoved > 0 ? 1 : -1;
			yTrans =  stepCnt * yStep * dir;
			cameraYMoved -= yTrans;
		}
		
		//		_Global.Log( "xTrans:" + xTrans + " yTrans:" + yTrans + " cx:" + cameraXMoved + " cy:" + cameraYMoved );
		transform.Translate( xTrans, 0, yTrans, Space.World );
		
	}
}
