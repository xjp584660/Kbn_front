using UnityEngine;
using System.Collections;
#if UNITY_EDITOR
using UnityEditor;
#endif

public class CharacterAnimationManager : MonoBehaviour 
{
	private int _level = 0;
	public int level
	{
		get { return _level; }
		set 
		{
			_level = value;
			SetLevel(_level);
		}
	}
	
	void SetLevel(int level)
	{
		CharacterAnimation[] anims = this.transform.GetComponentsInChildren<CharacterAnimation>(true);
		foreach(CharacterAnimation anim in anims)
		{
			anim.gameObject.SetActive(anim.level <= level);
		}
	}
	
	public GameObject birdAnimPrefab;
	public Vector3 birdBegin;
	public Vector3 birdEnd;
	public float   randomUp;
	public float   randomDown;
	public float   avoid;
	public float   speed = 1f;
	const float birdY = 50;
	
	AnimatedSpritesManage bird;
//	TweenPosition birdTween;
	
	void Start()
	{
//		if (bird != null) NGUITools.Destroy(bird);
		
//		bird = (GameObject.Instantiate(birdAnimPrefab) as GameObject).GetComponent<AnimatedSpritesManage>();
//		bird.gameObject.transform.parent = this.transform;
//		bird.gameObject.SetActive(true);
//		bird.State = "Fly";
		
//		birdTween = bird.gameObject.GetComponent<TweenPosition>();
//		if (birdTween == null)
//			birdTween = UITweener.Begin<TweenPosition>(bird.gameObject, birdDuration());
		
		birdBegin.y = birdY;
		birdEnd.y = birdY;
		
//		birdTween.eventReceiver = this.gameObject;
//		birdTween.callWhenFinished = "ResetBirdPath";
		
		ResetBirdPath();
		
		this.CancelInvoke();
		InvokeRepeating("ResetBirdAnim", 5, 3);
	}
	
	void ResetBirdPath()
	{
		randomUp = Mathf.Abs(randomUp);
		randomDown = -Mathf.Abs(randomDown);
		avoid = Mathf.Abs(avoid);
		
		float random = (randomUp - randomDown) * Random.Range(0f, 1f) + randomDown;
		if (random > 0) random = randomUp - (randomUp - random) * (randomUp - avoid)/randomUp;
		else if (random < 0) random = randomDown + (random - randomDown) * (avoid + randomDown)/randomDown;
		
		Vector3 randomVec = new Vector3(0, 0, random);
		
//		birdTween.from = birdBegin + randomVec;
//		birdTween.to = birdEnd + randomVec;
//		
//		birdTween.Reset();
	}
	
	void ResetBirdAnim()
	{
		float glideRate = 0.3f;
//		bird.State = Random.Range(0f, 1f) < glideRate ? "Glide" : "Fly";
	}
	
	float birdDuration()
	{
		return (birdEnd - birdBegin).magnitude / Mathf.Max(0.01f, speed);
	}

#if UNITY_EDITOR	
	void OnDrawGizmos ()
	{
		randomUp = Mathf.Abs(randomUp);
		randomDown = -Mathf.Abs(randomDown);
		avoid = Mathf.Abs(avoid);
		
		Gizmos.color = Color.red;
		Gizmos.matrix = this.gameObject.transform.localToWorldMatrix;
		
		Gizmos.DrawLine(birdBegin + new Vector3(0, 0, randomUp), birdBegin + new Vector3(0, 0, randomDown));
		
		Gizmos.DrawLine(birdBegin + new Vector3(0, 0, randomUp), birdEnd + new Vector3(0, 0, randomUp));
		Gizmos.DrawLine(birdBegin + new Vector3(0, 0, randomDown), birdEnd + new Vector3(0, 0, randomDown));
		
		Gizmos.color = Color.green;
		Vector3 avoidVec = new Vector3(0, 0, avoid);
		Gizmos.DrawLine(birdBegin + avoidVec, birdEnd + avoidVec);
		Gizmos.DrawLine(birdBegin - avoidVec, birdEnd - avoidVec);
	}
#endif
	
	public void WalkKeyPoints(System.Action<Transform> callback)
	{
		CharacterKeyPoint[] keyPoints = this.transform.GetComponentsInChildren<CharacterKeyPoint>();
		foreach (CharacterKeyPoint kp in keyPoints)
		{
			callback(kp.transform);
		}
	}
}
