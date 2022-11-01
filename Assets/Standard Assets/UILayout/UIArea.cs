
namespace UILayout
{
	public class UIArea
	{
		private UISize m_height = new UISize();
		private UISize m_width = new UISize();
		public UISize Height { get { return m_height; } set { m_height.Copy(value); } }
		public UISize Width { get { return m_width; } set { m_width.Copy(value); } }

		public void Clear()
		{
			m_height.Clear();
			m_width.Clear();
		}
		
		public void Copy(UIArea o)
		{
			m_height.Copy(o.m_height);
			m_width.Copy(o.m_width);
		}
		
		public void Cover(UIArea o)
		{
			m_height.Cover(o.m_height);
			m_width.Cover(o.m_width);
		}
	}
}

