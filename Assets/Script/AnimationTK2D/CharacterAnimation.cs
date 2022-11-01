using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class CharacterAnimation : MonoBehaviour
{
	public int level;
	public GameObject characterPrefab;
	public Color CharacterSkinColor = Color.white;
	
	[HideInInspector]
	public GameObject character;
	public CharacterKeyPoint root;
	public Color gizomsColor;
	
	CharacterKeyPoint current;
	CharacterKeyPoint next;
//	TweenPosition characterTween;
	
	String curCharacterState;
	Vector3 fromPos;
	Vector3 toPos;
	Vector3 curPos;
	float duration;
	float timeCounter;
	float walkSpeed = 0.3f;
	
	void Start ()
	{
		RebuildFroms();
		
		character = Instantiate(characterPrefab) as GameObject;
		character.transform.parent = this.transform;
		character.transform.localPosition = new Vector3(0,0,0);
		character.SetActive(true);
		
		if (character == null || root == null) return;
		
		GenerateNext();
	}
	
	public void GenerateNext()
	{
		if (character == null || root == null) return;
		
		if (next != null) current = next;
		if (current == null) current = root;
		
		next = current.RandomNext();
		
		fromPos = current.transform.localPosition;
		toPos = next.transform.localPosition;
		
		character.SendMessage("State", CharacterState(curCharacterState, fromPos, toPos));
		duration = CharacterDuration(curCharacterState, fromPos, toPos);
		timeCounter = 0;
	}
	
	public void FixedUpdate()
	{		
		timeCounter += Time.deltaTime;
		
		if(timeCounter > duration)
		{
			timeCounter = duration;
			
			curPos = toPos;
			character.transform.localPosition = curPos;
			
			GenerateNext();
			
			return;
		}
		
		curPos = Vector3.Lerp(fromPos, toPos, timeCounter / duration);
		character.transform.localPosition = curPos;		
	}
	
	float  CharacterDuration(string state, Vector3 from, Vector3 to)
	{
		if (from == to)
		{
			return 3f;
		}
		else
		{
			return (from - to).magnitude / walkSpeed;
		}
	}
	
	string CharacterState(string lastState, Vector3 from, Vector3 to)
	{
		if (from == to)
		{
			switch (lastState)
			{
			case "MoveTopLeft":
			case "StandTopLeft":
				return "StandTopLeft";
				
			case "MoveTopRight":
			case "StandTopRight":
				return "StandTopRight";
				
			case "MoveBottomLeft":
			case "StandBottomLeft":
				return "StandBottomLeft";
				
			case "MoveBottomRight":
			case "StandBottomRight":
				return "StandBottomRight";
			}
		}
		
		Vector3 vec = to - from;
		if (vec.x > 0 && vec.z > 0) return "MoveTopRight";
		if (vec.x > 0 && vec.z < 0) return "MoveBottomRight";
		if (vec.x < 0 && vec.z > 0) return "MoveTopLeft";
		if (vec.x < 0 && vec.z < 0) return "MoveBottomLeft";
		
		return "StandTopLeft";
	}
	
	void RebuildFroms()
	{
		CharacterKeyPoint[] keyPoints = this.transform.GetComponentsInChildren<CharacterKeyPoint>();
		foreach (CharacterKeyPoint kp in keyPoints)
		{
			kp.froms.Clear();
		}
		foreach (CharacterKeyPoint kp in keyPoints)
		{
			if (kp.to != null)
			{
				foreach (CharacterKeyPoint item in kp.to)
				{
					if (item != null)
					{
						item.froms.Add(kp);
					}
				}
			}
		}
	}

#if UNITY_EDITOR	
	void OnDrawGizmos ()
	{
		Gizmos.color = gizomsColor;
		Gizmos.matrix = this.gameObject.transform.localToWorldMatrix;
		
		if (root != null)
		{
			Gizmos.DrawSphere(root.transform.localPosition, 0.15f);
		}
		
		CharacterKeyPoint[] keyPoints = this.transform.GetComponentsInChildren<CharacterKeyPoint>();
		foreach (CharacterKeyPoint kp in keyPoints)
		{
			if (kp.to != null)
			{
				foreach (CharacterKeyPoint item in kp.to)
				{
					if (item != null)
					{
						Gizmos.DrawLine(kp.transform.localPosition, item.transform.localPosition);
					}
				}
			}
		}
	}
#endif
}
