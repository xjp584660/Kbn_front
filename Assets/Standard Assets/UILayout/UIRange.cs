
namespace UILayout
{
	public class UIRange
	{
		private uint m_maxVal = uint.MaxValue;
		private uint m_minVal = uint.MinValue;

		private bool m_haveMax = false;

		public UIRange()
		{
		}

		public UIRange(UIRange o)
		{
			m_haveMax = o.m_haveMax;
			m_minVal = o.m_minVal;
			m_maxVal = o.m_maxVal;
		}

		public uint Max
		{
			get
			{
				if (m_haveMax)
					return m_maxVal;
				return uint.MaxValue;
			}

			set
			{
				m_maxVal = value;
				m_haveMax = true;
			}
		}
		public uint Min
		{
			get
			{
				return m_minVal;
			}

			set
			{
				m_minVal = value;
			}
		}

		public uint Value
		{
			get
			{
				if (this.HaveValue)
					return m_minVal;
				throw new System.InvalidOperationException("Invoke value without value exists");
			}

			set
			{
				m_minVal = value;
				m_maxVal = value;
				m_haveMax = true;
			}
		}

		public bool HaveMax { get { return m_haveMax; } }
		public bool HaveValue
		{
			get
			{
				return m_haveMax && m_maxVal == m_minVal;
			}
		}

		public void ClearMax() { m_haveMax = false; }
		public virtual void Clear()
		{
			m_haveMax = false;
			m_minVal = 0;
		}
		public virtual void MakeZero()
		{
			m_haveMax = true;
			m_maxVal = 0;
			m_minVal = 0;
		}

		public virtual void Copy(UISize o)
		{
			m_haveMax = o.m_haveMax;
			m_minVal = o.m_minVal;
			m_maxVal = o.m_maxVal;
		}

		protected bool prot_cover(UIRange o)
		{
			if (o.HaveMax)
			{
				uint maxVal = o.Max;
				if (this.Min > maxVal)
					return false;
				if (!this.HaveMax || this.Max > maxVal)
					this.Max = maxVal;
			}

			uint minVal = o.Min;
			if (this.HaveMax && this.Max < minVal)
				return false;
			if (this.Min < minVal)
				this.Min = minVal;

			return true;
		}

		public override string ToString()
		{
			if (m_haveMax)
			{
				return "[" + m_minVal.ToString() + ", " + m_maxVal.ToString() + "]";
			}
			return "[" + m_minVal.ToString() + ", ...]";
		}
	}
}
