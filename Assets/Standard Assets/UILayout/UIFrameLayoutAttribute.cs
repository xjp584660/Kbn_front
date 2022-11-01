
namespace UILayout
{
	public class UIFrameLayoutAttribute
		: System.Attribute
	{
		public UIFrameLayoutAttribute(){}
		public UIFrameLayoutAttribute(string typeName)
		{
			TypeName = typeName;
		}
		public string TypeName { get; set; }
	}
}
