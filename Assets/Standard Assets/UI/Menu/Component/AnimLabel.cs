using UnityEngine;
using System.Collections;
/// <summary>
/// Animation 动画不能和shader动画同时使用，
/// animation动画控制position，rotation，scal变化类型动画 
/// shader控制漂浮类型动画.通过material控制
/// </summary>
public class AnimLabel : Label {
	public  bool useMaterial;//if use material,shold call function DrawTexture

	public int layer;
	public string imageName;
	public string mainTextureName;
	public bool useMask;
	public string maskName;
	public bool useColor;
	public Color color;
	public bool useAnimation;



	public override void Init ()
	{
		base.Init ();
		initView();
	}

	void initView(){

		if(!string.IsNullOrEmpty(imageName)){
			this.mystyle.normal.background = TextureMgr.instance().LoadTexture(imageName, TextureType.LOAD);
			
		}

		if(useMaterial){

			if(!string.IsNullOrEmpty(mainTextureName)){
				this.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture(mainTextureName, TextureType.LOAD));
			}
			if(useMask && !string.IsNullOrEmpty(maskName)){
				this.material.SetTexture("_MaskTex",TextureMgr.instance().LoadTexture(maskName, TextureType.LOAD));
			}
			if(useColor){
				this.material.SetColor("_Color",color);
			}
		}




	}

	private void UpdateTRS(){
		this.rect.x=this.transform.localPosition.x;
		this.rect.y=this.transform.localPosition.y;
		this.scaleX=this.transform.localScale.x;
		this.scaleY=this.transform.localScale.y;
		this.rotateAngle = this.transform.localEulerAngles.z;
		if(alphaEnable) this.alpha = this.transform.localPosition.z;
	}


	public void SetLayer(int layer){
		this.layer=layer;
	}

	void DrawTextureWithScale(){
		Matrix4x4 oldMatrix = GUI.matrix;
		bool matrixChanged = applyRotationAndScaling();
		DrawTexture ();
		GUI.matrix=oldMatrix;
	}

	public override int Draw ()
	{
		if(useAnimation) UpdateTRS();
		if(useMaterial) {
//			return base.DrawTexture ();
			DrawTextureWithScale();
			return -1;

		}
		else return base.Draw();
	}


}
