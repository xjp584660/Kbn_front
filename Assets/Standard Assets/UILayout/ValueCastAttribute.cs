namespace UILayout
{
	/// <summary>
	/// Mark for a class to speciels that this class have type convert method.
	/// </summary>
	[System.AttributeUsage(System.AttributeTargets.Class, AllowMultiple=false, Inherited=false)]
	public class HaveValueCastAttribute
		: System.Attribute
	{
	}

	[System.AttributeUsage(System.AttributeTargets.Method, AllowMultiple=true, Inherited=false)]
	public class ValueCastAttribute
		: System.Attribute
	{
		public System.Type DstType;
		public System.Type SrcType;
		public int Order = 0;
		public ValueCastAttribute()
		{
			DstType = null;
			SrcType = null;
		}
		public ValueCastAttribute(System.Type dstType, System.Type srcType)
		{
			DstType = dstType;
			SrcType = srcType;
		}
	}
}
