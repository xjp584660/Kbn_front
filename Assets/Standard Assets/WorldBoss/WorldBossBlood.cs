using UnityEngine;
using System.Collections;

public class WorldBossBlood : MonoBehaviour {
	public float progress = 1.0f;
	private int progressNameId;
	public GameObject bossName;
	public GameObject fenNu;
	public GameObject xuRuo;
	public GameObject bossSelect;
	public GameObject bossUnSelect;
	
	private static Mesh sharedMesh = null;
	
	public void SetProgress(float progress, int status) {
		this.progress = (1f - progress);
		GetComponent<Renderer>().material.SetFloat(progressNameId, this.progress);

		fenNu.SetActive(status == 2);
		xuRuo.SetActive(status == 3);

		if(status == 2 || status == 3)
		{
			bossName.transform.localPosition = new Vector3(0f, 0.4f, 0f);
		}
		else
		{
			bossName.transform.localPosition = new Vector3(0.001f, 0.4f, 0f);
		}
	}
	
	void Awake() {
		progressNameId = Shader.PropertyToID("_Progress");
		GetComponent<Renderer>().material.SetFloat(progressNameId, this.progress);
	}

	private Texture2D GetWorldBossNameTexByLanguageId(int languageId)
	{
		Texture2D bossNameTex = null;
		switch(languageId)
		{
			case 10:
				bossNameTex = TextureMgr.instance().LoadTexture("English_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 14:
				bossNameTex = TextureMgr.instance().LoadTexture("French_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 15:
				bossNameTex = TextureMgr.instance().LoadTexture("German_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 21:
				bossNameTex = TextureMgr.instance().LoadTexture("Italian_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 28:
				bossNameTex = TextureMgr.instance().LoadTexture("Portuguese_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 30:
				bossNameTex = TextureMgr.instance().LoadTexture("Russian_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 34:
				bossNameTex = TextureMgr.instance().LoadTexture("Spanish_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			case 37:
				bossNameTex = TextureMgr.instance().LoadTexture("Turkish_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
			default:
				bossNameTex = TextureMgr.instance().LoadTexture("English_WordBossName", TextureType.WORLDBOSSNAME);
				return bossNameTex;
		}
	}

	public void HideBossSelect()
	{
		bossSelect.SetActive(false);
		bossUnSelect.SetActive(false);
		PlayerPrefs.SetInt(Constant.BEFORE_FIRST_ATTACK_WORLD_BOSS, 1);
	}

	public void SelectBoss()
	{
		if(!PlayerPrefs.HasKey(Constant.BEFORE_FIRST_ATTACK_WORLD_BOSS))
		{
			bossSelect.SetActive(true);
			bossUnSelect.SetActive(false);
		}
	}

	public void UnSelectBoss()
	{
		if(!PlayerPrefs.HasKey(Constant.BEFORE_FIRST_ATTACK_WORLD_BOSS))
		{
			bossSelect.SetActive(false);
			bossUnSelect.SetActive(true);
		}
	}
	
	void OnDisable() {
	
	}
	
	void OnDestroy() {
		OnDisable();
	}
	
	// Use this for initialization
	void Start () {
		if(!PlayerPrefs.HasKey(Constant.BEFORE_FIRST_ATTACK_WORLD_BOSS))
		{
			bossSelect.SetActive(false);
			bossUnSelect.SetActive(true);
		}
		else
		{
			bossSelect.SetActive(false);
			bossUnSelect.SetActive(false);
		}

		if( PlayerPrefs.HasKey("language") )
		{
			int gameLanguage = PlayerPrefs.GetInt("language" ,LocaleUtil.defaultID);
			bossName.GetComponent<Renderer>().material.mainTexture = GetWorldBossNameTexByLanguageId(gameLanguage);
		}
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
