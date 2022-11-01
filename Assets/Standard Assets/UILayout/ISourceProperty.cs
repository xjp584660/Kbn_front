
namespace UILayout
{
	public delegate void OnSourceValueChanged(ISourceProperty srcProperty);
	public interface ISourceProperty
	{
		object GetValue();
		event OnSourceValueChanged ValueChanged;
		bool IsCanCatch { get; }
	}
}
