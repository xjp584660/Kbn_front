
namespace JasonReflection
{
	[System.AttributeUsage(System.AttributeTargets.Property | System.AttributeTargets.Field | System.AttributeTargets.Class, AllowMultiple = false, Inherited=false)]
	public class JasonDataAttribute
		: System.Attribute
	{
		public enum SearchType
		{	Default
		,	Stop
		,	All
		}
		private readonly string _key;
		private SearchType _serchInfo = SearchType.All;
		public SearchType SearchInfo{ get{return _serchInfo; } set{_serchInfo = value; } }
		public JasonDataAttribute()
		{
			_key = null;
		}
		public JasonDataAttribute(string key)
		{
			_key = key;
		}
		public string Key{get{return _key;}}
		public bool CreateNew { get; set;}
		public System.Type MapKey{get;set;}
		public System.Type MapValue{get;set;}
	}
}

