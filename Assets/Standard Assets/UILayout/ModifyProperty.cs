
namespace UILayout
{
	public class _ModifyPropertyBase
		: ISourceProperty
	{
		private ISourceProperty m_srcProp = null;
		private bool m_isNeedFetchValue;
		private object m_valCatch;
		private bool m_isCanCatch = true;

		public object GetValue()
		{
			if (!m_isNeedFetchValue)
				return m_valCatch;
			object val = m_srcProp.GetValue();
			if (m_srcProp.IsCanCatch)
			{
				m_valCatch = val;
				m_isNeedFetchValue = false;
			}
			this.priv_markForChange();
			return val;
		}

		public event OnSourceValueChanged ValueChanged;
		public bool IsCanCatch { get { return m_isCanCatch; } }

		public void SetValue(object val)
		{
			m_isNeedFetchValue = false;
			m_valCatch = val;
			m_isCanCatch = true;
			this.priv_markForChange();
		}

		public void LinkSource(ISourceProperty prop)
		{
			if (m_srcProp != null)
				m_srcProp.ValueChanged -= priv_onPropChanged;

			m_srcProp = prop;
			if (m_srcProp != null)
			{
				m_srcProp.ValueChanged += priv_onPropChanged;
				m_isCanCatch = m_srcProp.IsCanCatch;
				m_isNeedFetchValue = m_isCanCatch;
				//m_valCatch = null;
			}
			else
			{
				//m_valCatch = null;
				m_isCanCatch = true;
				m_isNeedFetchValue = false;
			}

			this.priv_markForChange();
		}

		private void priv_onPropChanged(ISourceProperty prop)
		{
			m_isNeedFetchValue = true;
			priv_markForChange();
		}

		private void priv_markForChange()
		{
			if (ValueChanged != null)
				ValueChanged(this);
		}
	}
	
	public class ModifyProperty<T>
		: _ModifyPropertyBase
	{
		public T Value
		{
			get { return (T)base.GetValue(); }
			set { base.SetValue((T)value); }
		}
	}
}
