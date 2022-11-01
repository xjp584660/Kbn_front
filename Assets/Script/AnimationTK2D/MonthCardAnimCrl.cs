using UnityEngine;
using System.Collections;

public class MonthCardAnimCrl : MonoBehaviour {

	private tk2dSpriteAnimator animator;
	private tk2dSprite sprite;
	private GameObject yinYing;
	private float _timeStartedLerping;
	private bool isPlay = false;
	private float timeTakenDuringLerp = 3f;
	private float fromA = 0.3f;
	private float toA = 1f;

	// Use this for initialization
	void Start () {
		animator = GetComponent<tk2dSpriteAnimator>();
		sprite = GetComponent<tk2dSprite>();
		yinYing = transform.Find("macheyinying").gameObject;
	}

	public void PlayRun()
	{		
		animator.Play("run");
		_timeStartedLerping = Time.time;
		isPlay = true;
		yinYing.SetActive(false);
	}

	public void PlayStand()
	{
		animator.Play("stand");
		yinYing.SetActive(true);
	}
	
	// Update is called once per frame
	void Update () {
		if(isPlay)
		{
			float timeSinceStarted = Time.time - _timeStartedLerping;
			float percentageComplete = timeSinceStarted / timeTakenDuringLerp;
			
			float tempA = Mathf.Lerp(fromA,toA,percentageComplete);
			sprite.color = new Vector4(1f, 1f, 1f, tempA);
			if(percentageComplete >= 1.0f)
			{
				isPlay = false;
				sprite.color = new Vector4(1f, 1f, 1f, 1f);
			}	
		}
	}
}
