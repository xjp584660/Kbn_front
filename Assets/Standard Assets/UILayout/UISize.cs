
namespace UILayout
{
	[HaveValueCastAttribute]
	public class UISize
		: UIRange
	{
		private uint m_weight = 1;
		private bool m_haveWeight = false;
		//private bool m_isAutoCalc = false;

		public UISize()
		{
		}

		public UISize(UISize o): base(o)
		{
			m_haveWeight = o.m_haveWeight;
			if ( m_haveWeight )
				m_weight = o.m_weight;
		}

		public uint Weight
		{
			get
			{
				if ( m_haveWeight )
					return m_weight;
				throw new System.InvalidOperationException("Invoke Weight without value exists");
			}
			set
			{
				m_weight = value;
				m_haveWeight = true;
			}
		}

		public bool HaveWeight{get{return m_haveWeight; }}
		public void ClearWeight(){m_haveWeight = false;}
		public override void Clear()
		{
			base.Clear();
			m_haveWeight = false;
		}

		public override void MakeZero()
		{
			base.MakeZero();
			m_haveWeight = false;
			m_weight = 0;
		}

		public bool Cover(UISize o)
		{
			UISize tmp = new UISize(this);
			if ( !tmp.priv_cover(o) )
				return false;
			this.Copy(tmp);
			return true;
		}

		public override void Copy(UISize o)
		{
			base.Copy(o);
			m_haveWeight = o.m_haveWeight;
			if ( m_haveWeight )
				m_weight = o.m_weight;
		}

		private bool priv_cover(UISize o)
		{
			if ( !this.HaveWeight && o.HaveWeight )
				this.Weight = o.m_weight;
			return base.prot_cover(o);
		}
		
		[ValueCastAttribute]
		static public UISize ConvertToUISize(string val)
		{
			if ( string.IsNullOrEmpty(val) )
				return new UISize();
			UISize uiSize = new UISize();
			if ( val[0] == '*' )
			{
				uiSize.Weight = System.Convert.ToUInt32(val.Substring(1, val.Length-1));
			}
			else
			{
				uiSize.Value = System.Convert.ToUInt32(val);
			}
			return uiSize;
		}
	}
}

