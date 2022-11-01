using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace KBN
{
	public class AnimationLabel : Label
	{
		public enum LABEL_STATE{
			NONE,
			ANIMATION,
			OVER
		};
		
		[SerializeField] protected string aniName;
		[SerializeField] protected int aniNum;
		[SerializeField] protected int aniRepeatNum = 0;
	//	[SerializeField] private int aniInterval = 3;
		[SerializeField] protected float aniIntervalTime = 0.1f;
		protected float curAniIntervalTime;
		protected int curAniRepeatNum;
		protected int curAni;
		protected LABEL_STATE labelState;
        protected string m_textureType;
		
		public System.Action OnAnimationOver;
		
		public void Init()
		{
			curAni = -1;
            m_textureType = TextureType.BUILD_ANIMATION;
			this.setBackground("None",TextureType.BUILD_ANIMATION);
			curAniIntervalTime = 0;
			labelState = LABEL_STATE.ANIMATION;
		}
		
		public void Init(string _aniName, int _aniNum)
		{
			Init(_aniName, _aniNum, LABEL_STATE.ANIMATION);
		}
		
		public void Init(string _aniName, int _aniNum, LABEL_STATE _status)
		{
            Init(_aniName, _aniNum, TextureType.BUILD_ANIMATION, _status);
        }

        public void Init(string _aniName, int _aniNum, string textureType, LABEL_STATE _status)
        {
			base.Init();
			
			aniName = _aniName;
			aniNum = _aniNum;
			curAni = -1;

            m_textureType = textureType;
			this.setBackground("None",m_textureType);
			curAniIntervalTime = 0;
			labelState = _status;
		}
		
		public void Draw()
		{
			if(!this.visible)return;
			if(labelState != LABEL_STATE.ANIMATION)return;
			
			curAniIntervalTime += Time.deltaTime;
			this.setBackground(aniName+curAni,m_textureType);
			if(curAniIntervalTime >= aniIntervalTime)
			{
				curAniIntervalTime -= aniIntervalTime;
				++curAni;
				
				if(curAni>=aniNum)
				{
					curAni = 0;
					if (OnAnimationOver != null) 
						OnAnimationOver();
					if(++curAniRepeatNum >= aniRepeatNum && aniRepeatNum > 0)
					{
						labelState = LABEL_STATE.OVER;
						this.setBackground("None",m_textureType);
						return;
					}
				}
			}
			base.Draw();
		}
		
		public void Start()
		{
			if (labelState == LABEL_STATE.ANIMATION) return;
			curAniRepeatNum = 0;
			curAni = -1;
			labelState = LABEL_STATE.ANIMATION;
		}
		
		public void Stop()
		{
			if (labelState != LABEL_STATE.ANIMATION) return;
			labelState = LABEL_STATE.OVER;
			curAniRepeatNum = 0;
			curAni = -1;
		}
	}
}