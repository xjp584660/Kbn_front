
namespace UILayout
{
	public class _SizeAdjustContain<SizeAdjustType>
		: System.Collections.Generic.IEnumerable<SizeAdjustType>, System.Collections.IEnumerable
		where SizeAdjustType : _SizeAdjust
	{
		private System.Collections.Generic.List<SizeAdjustType> m_romItems = new System.Collections.Generic.List<SizeAdjustType>();
		public void AddItem(_SizeAdjust obj)
		{
			SizeAdjustType rowDef = (SizeAdjustType)obj;
			m_romItems.Add(rowDef);
		}

		public SizeAdjustType this[uint idx]
		{
			get
			{
				return m_romItems[(int)idx];
			}
		}
		public SizeAdjustType this[int idx]
		{
			get
			{
				return m_romItems[idx];
			}
		}

		public int Count{get{return m_romItems.Count;}}

		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
		{
			return m_romItems.GetEnumerator();
		}

		System.Collections.Generic.IEnumerator<SizeAdjustType> System.Collections.Generic.IEnumerable<SizeAdjustType>.GetEnumerator()
		{
			return m_romItems.GetEnumerator();
		}

		class CastType<RetType>
			: System.Collections.Generic.IEnumerable<RetType>
			where RetType : _SizeAdjust
		{
			private _SizeAdjustContain<SizeAdjustType> m_dat;
			public CastType(_SizeAdjustContain<SizeAdjustType> dat) { m_dat = dat; }

			System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
			{
				foreach (var item in m_dat)
				{
					yield return item;
				}
			}
			System.Collections.Generic.IEnumerator<RetType> System.Collections.Generic.IEnumerable<RetType>.GetEnumerator()
			{
				foreach (var item in m_dat)
				{
					if ((item as RetType) == null)
						throw new System.InvalidCastException("Cast Error");
					yield return item as RetType ;
				}
			}
		}

		public System.Collections.Generic.IEnumerable<RetType> GetIEnumerable<RetType>() where RetType : _SizeAdjust
		{
			return new CastType<RetType>(this);
		}

		//public System.Collections.Generic.List<SizeAdjustType>.Enumerator GetEnumerator()
		//{
		//	return m_romItems.GetEnumerator();
		//}

		public uint Capacity
		{
			get { return (uint)m_romItems.Capacity; }
			set { m_romItems.Capacity = (int)value; }
		}

		public void Reset()
		{
			foreach (var sz in m_romItems)
				sz.Reset();
		}
	}
}
