// Ellan Jiang 2014-03-15
import System.Collections.Generic;
public class GUIAnimation
{
    private var m_AnimationList : List.<AnimationNode> = new List.<AnimationNode>();

    protected class AnimationNode
    {
        protected var m_Control : UIObject = null;
        protected var m_Time : float = 0.0f;
        protected var m_Elapse : float = 0.0f;
        protected var m_Callback : Function = null;
        protected var m_UserData : Object = null;

        public function AnimationNode(control : UIObject, time : float, callback : Function, userData : Object)
        {
            m_Control = control;
            m_Time = time;
            m_Callback = callback;
            m_UserData = userData;
        }

        public function Update(elapse : float) : void
        {
            m_Elapse += elapse;
            if (m_Elapse >= m_Time)
            {
                m_Elapse = m_Time;
                if (m_Callback != null)
                {
                    m_Callback(m_UserData);
                }
            }
        }

        public function get Timeout() : boolean
        {
            return m_Elapse >= m_Time;
        }
    }

    protected class DelayAnimationNode extends AnimationNode
    {
        public function DelayAnimationNode(control : UIObject, time : float, callback : Function, userData : Object)
        {
            super(control, time, callback, userData);
        }

        public function Update(elapse : float) : void
        {
            super.Update(elapse);
        }
    }

    protected class AlphaAnimationNode extends AnimationNode
    {
        protected var m_FromAlpha : float = 0.0f;
        protected var m_ToAlpha : float = 0.0f;

        public function AlphaAnimationNode(control : UIObject, time : float, callback : Function, userData : Object, fromAlpha : float, toAlpha : float)
        {
            super(control, time, callback, userData);
            control.alphaEnable = true;
            control.alpha = fromAlpha;
            m_FromAlpha = fromAlpha;
            m_ToAlpha = toAlpha;
        }

        public function Update(elapse : float) : void
        {
            super.Update(elapse);
            m_Control.alpha = m_FromAlpha + (m_ToAlpha - m_FromAlpha) * (m_Elapse / m_Time);
        }
    }

    protected class MoveAnimationNode extends AnimationNode
    {
        protected var m_FromPosition : Vector2 = Vector2.zero;
        protected var m_ToPosition : Vector2 = Vector2.zero;

        public function MoveAnimationNode(control : UIObject, time : float, callback : Function, userData : Object, fromPosition : Vector2, toPosition : Vector2)
        {
            super(control, time, callback, userData);
            control.rect.x = fromPosition.x;
            control.rect.y = fromPosition.y;
            m_FromPosition = fromPosition;
            m_ToPosition = toPosition;
        }

        public function Update(elapse : float) : void
        {
            super.Update(elapse);
            m_Control.rect.x = m_FromPosition.x + (m_ToPosition.x - m_FromPosition.x) * (m_Elapse / m_Time);
            m_Control.rect.y = m_FromPosition.y + (m_ToPosition.y - m_FromPosition.y) * (m_Elapse / m_Time);
        }
    }

    public function Update(elapse : float) : void
    {
        for (var i : int = 0; i < m_AnimationList.Count; i++)
        {
            m_AnimationList[i].Update(elapse);
            if (m_AnimationList[i].Timeout)
            {
                m_AnimationList.Remove(m_AnimationList[i]);
            }
        }
    }

    public function Clear() : void
    {
        m_AnimationList.Clear();
    }

    public function AddDelayAnimation(control : UIObject, time : float, callback : Function, userData : Object) : void
    {
        m_AnimationList.Add(new DelayAnimationNode(control, time, callback, userData));
    }

    public function AddAlphaAnimation(control : UIObject, time : float, callback : Function, userData : Object, fromAlpha : float, toAlpha : float) : void
    {
        m_AnimationList.Add(new AlphaAnimationNode(control, time, callback, userData, fromAlpha, toAlpha));
    }

    public function AddMoveAnimation(control : UIObject, time : float, callback : Function, userData : Object, fromPosition : Vector2, toPosition : Vector2) : void
    {
        m_AnimationList.Add(new MoveAnimationNode(control, time, callback, userData, fromPosition, toPosition));
    }
}
