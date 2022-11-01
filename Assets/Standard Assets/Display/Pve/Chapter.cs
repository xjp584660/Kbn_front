using UnityEngine;
using System.Collections;

public class Chapter : MonoBehaviour 
{
	private Vector3 m_starPos = new Vector3();
	public Vector3 Offset = new Vector3(0,0,0.1f);
	private bool bDown = true;
	private int MAXSTEP = 10;
	private int step = 0;
	private bool bMove = true;
	private bool bCanMove = false;

	public void setCanMove( bool canMove )
	{
		bCanMove = canMove;
	}

	// Use this for initialization
	void Start () 
	{
		m_starPos = transform.localPosition;
	}
	
	// Update is called once per frame
	void Update () 
	{
		if( !bCanMove )
			return;

		if(bMove)
		{
			if (bDown) 
			{
				step++;
				transform.localPosition -= Offset;
				if(step == MAXSTEP)
				{
					step = 0;
					bDown =  !bDown;
				}
			}
			else
			{
				step++;
				transform.localPosition += Offset;
				if(step == MAXSTEP)
				{
					step = 0;
					bDown = !bDown;
				}
			}
		}
		bMove = !bMove;
	}
}
