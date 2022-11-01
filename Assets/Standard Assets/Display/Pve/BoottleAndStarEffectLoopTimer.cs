using System.Collections;
using UnityEngine;

namespace Assets
{
	public class BoottleAndStarEffectLoopTimer : MonoBehaviour
	{
		#region Fields

		public float Interval;
		private float timer = 0;
		
		#endregion
		
		#region Methods
		
		public void Update()
		{
			timer += Time.deltaTime;
			if(timer > Interval)
			{
				timer = 0;
				gameObject.SetActive (false);
				gameObject.SetActive (true);
			}
		}
		
		#endregion
	}
}
