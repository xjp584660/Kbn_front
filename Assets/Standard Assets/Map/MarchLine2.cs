using UnityEngine;
using System.Collections;

//[RequireComponent(typeof(MeshRenderer), typeof(MeshFilter))]
public class MarchLine2 : MonoBehaviour {

	public NewMarchLine marchLine;
	public NewMarchLine marchOutLine;
	public NewMarchLine marchOutLight;

	public MeshRenderer renderer;

	public void SetProgress(Vector3 position) {
		marchLine.SetProgress(position);
		marchOutLine.SetProgress(position);
		marchOutLight.SetProgress(position);
	}

	public void SetLineColor(int marchLineType){
		//marchLineType = Constant.MarchLineType.BLUE;
		switch(marchLineType)
		{
			case Constant.MarchLineType.GREEN:
				marchLine.SetLineColor(Constant.NewMarchlineColor.GREEN,Constant.NewMarchlineColor.LIGHT);
				marchOutLine.SetLineColor(Constant.NewMarchlineColor.GREEN_OUTLINE,Constant.NewMarchlineColor.TRANSPARENT);
				marchOutLight.SetLineColor(Constant.NewMarchlineColor.TRANSPARENT,Constant.NewMarchlineColor.GREEN_OUTLIGHT);
				break;
			case Constant.MarchLineType.BLUE:
				marchLine.SetLineColor(Constant.NewMarchlineColor.BLUE,Constant.NewMarchlineColor.LIGHT);
				marchOutLine.SetLineColor(Constant.NewMarchlineColor.BLUE_OUTLINE,Constant.NewMarchlineColor.TRANSPARENT);
				marchOutLight.SetLineColor(Constant.NewMarchlineColor.TRANSPARENT,Constant.NewMarchlineColor.BLUE_OUTLIGHT);
				break;
			case Constant.MarchLineType.RED:
				marchLine.SetLineColor(Constant.NewMarchlineColor.RED,Constant.NewMarchlineColor.LIGHT);
				marchOutLine.SetLineColor(Constant.NewMarchlineColor.RED_OUTLINE,Constant.NewMarchlineColor.TRANSPARENT);
				marchOutLight.SetLineColor(Constant.NewMarchlineColor.TRANSPARENT,Constant.NewMarchlineColor.RED_OUTLIGHT);
				break;
			case Constant.MarchLineType.WHITE:
				marchLine.SetLineColor(Constant.NewMarchlineColor.WHITE,Constant.NewMarchlineColor.LIGHT);
				marchOutLine.SetLineColor(Constant.NewMarchlineColor.WHITE_OUTLINE,Constant.NewMarchlineColor.TRANSPARENT);
				marchOutLight.SetLineColor(Constant.NewMarchlineColor.TRANSPARENT,Constant.NewMarchlineColor.WHITE_OUTLIGHT);
				break;
		}
	}

	public void setTileFromTo( int tileFromX, int tileFromY, int tileToX, int tileToY ) {
		marchLine.setTileFromTo(tileFromX, tileFromY, tileToX, tileToY);
		marchOutLine.setTileFromTo(tileFromX, tileFromY, tileToX, tileToY);
		marchOutLight.setTileFromTo(tileFromX, tileFromY, tileToX, tileToY);
	}

	public void SetFromTo(Vector3 start, Vector3 end) {
		marchLine.SetFromTo(start, end);
		marchOutLine.SetFromTo(start, end);
		marchOutLight.SetFromTo(start, end);
	}

	void Awake() {

	}

	void OnDisable() {

	}

	void OnDestroy() {

	}

	// Use this for initialization
	void Start () {
		//renderer =
	}
	
	// Update is called once per frame
	void Update () {

	}
}
