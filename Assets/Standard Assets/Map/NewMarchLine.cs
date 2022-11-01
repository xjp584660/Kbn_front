using UnityEngine;
using System.Collections;

[RequireComponent(typeof(MeshRenderer), typeof(MeshFilter))]
public class NewMarchLine : MonoBehaviour {
	
	public Transform startPoint;
	public Transform endPoint;
	
	private int m_fromTileX;
	private int m_fromTileY;
	private int m_toTileX;
	private int m_toTileY;
	
	private Vector3 startPosition;
	private Vector3 endPosition;
	
	private float progress = 0.0f;
	private int progressNameId;
	
	private static Mesh sharedMesh = null;
	
	private string targetTileName = null;
	
	public void SetProgress(Vector3 position) {
		Vector3 delta = endPosition - startPosition;
		float progress = Vector3.Dot(position - startPosition, delta.normalized) / delta.magnitude;
		progress = Mathf.Clamp01(progress);
		this.progress = progress;
	}
	/// <summary>
	/// set marchline color
	/// </summary>
	/// <param name="color1">result line color.</param>
	/// <param name="color2">move line Color.</param>
	public void SetLineColor(Color color1,Color color2){
		GetComponent<Renderer>().material.SetColor("_Color",color1);
		GetComponent<Renderer>().material.SetColor("_Color2",color2);
	}
	public void setTileFromTo( int tileFromX, int tileFromY, int tileToX, int tileToY ) {
		m_fromTileX = tileFromX;
		m_fromTileY = tileFromY;
		m_toTileX = tileToX;
		m_toTileY = tileToY;
		
		if (enabled) {
			string tileName = "l_"+m_toTileX+"_t_"+m_toTileY;
			MapController mc = MapController.IS_AVA_NOW ? KBN.GameMain.singleton.getMapController2() :
				KBN.GameMain.singleton.getMapController();
			if( mc != null ) {
				MapMarchTargetIndicatorMgr targetIndicator = mc.getMarchTargetIndicatorMgr();
				
				if (null == targetTileName) {
					targetTileName = tileName;
					targetIndicator.AddIndicator( targetTileName );
				} else if (tileName != targetTileName) {
					targetIndicator.RemoveIndicator( targetTileName );
					targetTileName = tileName;
					targetIndicator.AddIndicator( targetTileName );
				}
			}
		}
	}
	
	public void SetFromTo(Vector3 start, Vector3 end) {
		startPosition = start;
		endPosition = end;
	}
	
	void Awake() {
		MeshFilter filter = GetComponent<MeshFilter>();
		if (null == sharedMesh) {
			Mesh msh = new Mesh();
			
			msh.vertices = new Vector3[] {
				new Vector3( 0.5f, 0.0f, 0.0f),
				new Vector3( 0.5f, 0.0f, 1.0f),
				new Vector3(-0.5f, 0.0f, 1.0f),
				new Vector3(-0.5f, 0.0f, 0.0f)
			};
			msh.uv = new Vector2[] {
				new Vector2(0.0f, 1.0f),
				new Vector2(1.0f, 1.0f),
				new Vector2(1.0f, 0.0f),
				new Vector2(0.0f, 0.0f)
			};
			msh.triangles = new int[] {0, 2, 1, 0, 3, 2};
			
			msh.RecalculateNormals();
			msh.RecalculateBounds();
			sharedMesh = msh;
		}
		
		filter.mesh = sharedMesh;
		
		progressNameId = Shader.PropertyToID("_Progress");
	}
	
	void OnDisable() {
		if( !string.IsNullOrEmpty(targetTileName) ) {
			MapController mc = MapController.IS_AVA_NOW ? KBN.GameMain.singleton.getMapController2() :
				KBN.GameMain.singleton.getMapController();
			if( mc != null ) {
				MapMarchTargetIndicatorMgr targetIndicator = mc.getMarchTargetIndicatorMgr();
				targetIndicator.RemoveIndicator(targetTileName);
				targetTileName = null;
			}
		}
	}
	
	void OnDestroy() {
		OnDisable();
		MeshFilter filter = GetComponent<MeshFilter>();
		filter.mesh = null;
	}
	
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if (null != startPoint)
			startPosition = startPoint.position;
		if (null != endPoint)
			endPosition = endPoint.position;
		
		Vector3 Dir = endPosition - startPosition;
		transform.position = startPosition;
		Vector3 scale = transform.localScale;
		scale.z = Dir.magnitude;
		transform.localScale = scale;
		transform.forward = Dir.normalized;
		
		Vector2 texScale = GetComponent<Renderer>().material.mainTextureScale;
		texScale.x = Dir.magnitude;
		GetComponent<Renderer>().material.mainTextureScale = texScale;
		//renderer.material.SetColor ("_Color", new Color (100/255f,0f,1f,100/255f));
		GetComponent<Renderer>().material.SetFloat(progressNameId, progress);
	}
}
