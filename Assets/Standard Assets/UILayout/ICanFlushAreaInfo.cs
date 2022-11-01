
namespace UILayout
{
	public interface ICanFlushAreaInfo
	{
		bool PrevCalcAreaSize();
		void AfterCalcAreaSize(uint x, uint y, uint width, uint height);
	}
}

