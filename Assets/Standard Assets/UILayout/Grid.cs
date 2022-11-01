
namespace UILayout
{
	[UIFrameLayout(TypeName="Grid")]
	public class Grid
		: UIFrame
	{
		//[UILayout.UIFrameLayout(TypeName="Grid.ColumnDefinitions")]
		public class Grid_ColumnDefinitions
			: _SizeAdjustContain<Grid_ColumnDefinition>
		{
		}
		//[UILayout.UIFrameLayout(TypeName = "Grid.RowDefinitions")]
		public class Grid_RowDefinitions
			: _SizeAdjustContain<Grid_RowDefinition>
		{
		}

		//private uint m_row;
		//private uint m_col;

		private Grid_RowDefinitions m_rowInfo = new Grid_RowDefinitions();
		private Grid_ColumnDefinitions m_colInfo = new Grid_ColumnDefinitions();

		private System.Collections.Generic.List</*row*/System.Collections.Generic.List</*col*/UIFrame>> m_dicFrame
			= new System.Collections.Generic.List<System.Collections.Generic.List<UIFrame>>();

		private float m_minPointPerWeightWidth;
		private float m_maxPointPerWeightWidth;
		private float m_minPointPerWeightHeight;
		private float m_maxPointPerWeightHeight;

		public Grid()
		{
			//m_row = 0;
			//m_col = 0;
		}

		public Grid(uint col, uint row)
		{
			//m_row = row;
			//m_col = col;

			m_rowInfo.Capacity = row;
			for ( uint r = 0; r != row; ++r )
			{
				m_rowInfo.AddItem(new Grid_RowDefinition());
			}

			m_colInfo.Capacity = col;
			for ( uint c = 0; c != col; ++c )
			{
				m_colInfo.AddItem(new Grid_ColumnDefinition());
			}

			for ( uint r = 0; r != row; ++r )
			{
				m_dicFrame.Add(new System.Collections.Generic.List<UIFrame>());
				for ( uint c = 0; c != col; ++c )
				{
					m_dicFrame[(int)r].Add(null);
				}
			}
		}

		public UISize Row(uint pos)
		{
			return m_rowInfo[pos].tgtSize;
		}

		public UISize Col(int pos)
		{
			return m_colInfo[pos].tgtSize;
		}

		public Grid_RowDefinitions RowDefinitions
		{
			get { return m_rowInfo; }
		}

		public Grid_ColumnDefinitions ColumnDefinitions
		{
			get { return m_colInfo; }
		}
		
		public void AddItem(UIFrame frame)
		{
			this.AddItem(frame, 0, 0);
		}

		public void AddItem(UIFrame frame, uint Col, uint Row)
		{
			if ( frame == null )
			{
				if ( m_dicFrame.Count <= Row )
					return;
				var rowData = m_dicFrame[(int)Row];
				if ( rowData == null || rowData.Count <= Col )
					return;
				rowData[(int)Col] = null;
				return;
			}

			while ( m_rowInfo.Count <= Row )
			{
				//++m_row;
				m_rowInfo.AddItem(new Grid_RowDefinition());
			}
			while ( m_colInfo.Count <= Col )
			{
				//++m_col;
				m_colInfo.AddItem(new Grid_ColumnDefinition());
			}
			while (m_dicFrame.Count <= Row)
			{
				m_dicFrame.Add(new System.Collections.Generic.List<UIFrame>());
			}
			while (m_dicFrame[(int)Row].Count <= Col)
			{
				m_dicFrame[(int)Row].Add(null);
			}
			m_dicFrame[(int)Row][(int)Col] = frame;
			frame.Parent = this;
		}

		public override UIFrame FindItem(string frameName)
		{
			if ( frameName == this.Name )
				return this;
			foreach ( var rowFrames in m_dicFrame )
			{
				if ( rowFrames == null )
					continue;
				foreach ( var colFrame in rowFrames )
				{
					if ( colFrame == null)
						continue;
					if ( colFrame.Name == frameName )
						return colFrame;
					var frame = colFrame.FindItem(frameName);
					if ( frame != null)
						return frame;
				}
			}

			return null;
		}

		public override void Reorder(uint x, uint y, uint width, uint height)
		{
			if (!this.PrevCalcAreaSize())
				return;
			this.AfterCalcAreaSize(x, y, width, height);
		}

		public override bool PrevCalcAreaSize( )
		{
			m_rowInfo.Reset();
			m_colInfo.Reset();

			for ( uint r = 0; r != m_dicFrame.Count; ++r )
			{
				var rowSize = m_rowInfo[r];
				//rowSize.Reset();

				var rowFrame = m_dicFrame[(int)r];
				for ( int c = 0; c != rowFrame.Count; ++c )
				{
					var uiFrame = rowFrame[c];
					if ( uiFrame == null )
						continue;
					if ( !uiFrame.PrevCalcAreaSize() )
						return false;
					var colSize = m_colInfo[c];
					//colSize.Reset();
					if ( !colSize.curSize.Cover(uiFrame.Area.Width) )
						return false;
					if ( !rowSize.curSize.Cover(uiFrame.Area.Height) )
						return false;
				}
			}

			var thisArea = this.Area;
			thisArea.Clear();

			if (!this.priv_collectionSizeInfo(this.Area.Height, m_rowInfo.GetIEnumerable<Grid_RowDefinition>(), ref m_minPointPerWeightHeight, ref m_maxPointPerWeightHeight))
				return false;
			if (!this.priv_collectionSizeInfo(this.Area.Width, m_colInfo.GetIEnumerable<Grid_ColumnDefinition>(), ref m_minPointPerWeightWidth, ref m_maxPointPerWeightWidth))
				return false;
			if ( (int)this.Area.Width.Min + this.Border.horizontal >= 0 )
				this.Area.Width.Min += (uint)this.Border.horizontal;
			else
				this.Area.Width.Min = 0;

			if ( (int)this.Area.Height.Min + this.Border.vertical >= 0 )
				this.Area.Height.Min += (uint)this.Border.vertical;
			else
				this.Area.Height.Min = 0;
			
			if ( this.Area.Width.HaveMax )
				this.Area.Width.Max += (uint)this.Border.horizontal;
			if ( this.Area.Height.HaveMax )
				this.Area.Height.Max += (uint)this.Border.vertical;
			return true;
		}

		private bool priv_collectionSizeInfo(UISize chk, System.Collections.Generic.IEnumerable<Grid_RowDefinition> items, ref float minPointPerWeight, ref float maxPointPerWeight)
		{
			UISize prt = new UISize();
			prt.MakeZero();
			Fraction minFrac = new Fraction(0, 1);
			Fraction maxFrac = new Fraction(1, 0);

			foreach (var sizeInfo in items)
			{
				if (!this.priv_combinSizeInfo(ref minFrac, ref maxFrac, prt, sizeInfo))
					return false;
			}

			minPointPerWeight = minFrac.Value;
			maxPointPerWeight = maxFrac.Value;
			return chk.Cover(prt);
		}


		private bool priv_collectionSizeInfo(UISize chk, System.Collections.Generic.IEnumerable<Grid_ColumnDefinition> items, ref float minPointPerWeight, ref float maxPointPerWeight)
		{
			UISize prt = new UISize();
			prt.MakeZero();
			Fraction minFrac = new Fraction(0, 1);
			Fraction maxFrac = new Fraction(1, 0);
			
			foreach (var sizeInfo in items)
			{
				if (!this.priv_combinSizeInfo(ref minFrac, ref maxFrac, prt, sizeInfo))
					return false;
			}
			
			minPointPerWeight = minFrac.Value;
			maxPointPerWeight = maxFrac.Value;
			return chk.Cover(prt);
		}

		private bool priv_combinSizeInfo(ref Fraction minFrac, ref Fraction maxFrac, UISize prt, _SizeAdjust srcSizeAdjust)
		{
			var src = srcSizeAdjust.curSize;
			if (!src.HaveWeight)
			{
				prt.Min += src.Min;

				if (src.HaveMax)
				{
					if (prt.HaveMax)
						prt.Max += src.Max;
				}
				else
				{
					prt.ClearMax();
				}

				return true;
			}

			if (src.HaveValue)
			{
				Fraction out_node = new Fraction(src.Value, src.Weight);
				if (out_node != minFrac || out_node != maxFrac)
					return false;
				prt.Min += src.Value;
				prt.Max += src.Value;
				return true;
			}

			//if (src.Min!=0)
			{
				Fraction out_node = new Fraction(src.Min, src.Weight);
				if (out_node < minFrac)
					src.Min = minFrac * src.Weight;
				else
					minFrac = out_node;

				prt.Min += src.Min;
			}

			if (src.HaveMax)
			{
				Fraction out_node = new Fraction(src.Max, src.Weight);
				if (out_node > maxFrac)
					src.Max = maxFrac * src.Weight;
				else
					maxFrac = out_node;

				if (prt.HaveMax)
					prt.Max += src.Max;
			}
			else
			{
				prt.ClearMax();
			}

			return true;
		}

		public override void AfterCalcAreaSize(uint x, uint y, uint width, uint height)
		{
			width -= (uint)this.Border.horizontal;
			height -= (uint)this.Border.vertical;
 
			this.priv_calcWidth(m_minPointPerWeightWidth, m_maxPointPerWeightWidth, width, this.Area.Width, this.m_colInfo.GetIEnumerable<_SizeAdjust>());
			this.priv_calcWidth(m_minPointPerWeightHeight, m_maxPointPerWeightHeight, height, this.Area.Height, this.m_rowInfo.GetIEnumerable<_SizeAdjust>());
			uint h = y + (uint)this.Border.top;
			for ( uint r = 0; r != m_rowInfo.Count; ++r )
			{
				uint curHeight = m_rowInfo[(int)r].curSize.Min;
				uint w = x + (uint)this.Border.left;
				if ( m_dicFrame.Count > r )
				{
					var rowFrame = m_dicFrame[(int)r];
					for ( uint c = 0; c != m_colInfo.Count; ++c )
					{
						uint curWidth = m_colInfo[(int)c].curSize.Min;
						if ( rowFrame.Count > c )
						{
							var frame = rowFrame[(int)c];
							if ( frame != null )
								frame.AfterCalcAreaSize(w, h, curWidth, curHeight);
						}
						w += curWidth;
					}
				}
				h += curHeight;
			}
		}

		private void priv_calcWidth(float minPointPerWeight, float maxPointPerWeight, uint total, UIRange curRange, System.Collections.Generic.IEnumerable<_SizeAdjust> items)
		{
			int totalLessSpace = (int)total - (int)curRange.Min;
			if (totalLessSpace <= 0)
			{	//	按照最小的来吧,看看到哪儿会中止
				foreach (var sizeAdjust in items)
					sizeAdjust.curSize.Value = sizeAdjust.curSize.Min;
				return;
			}

			//	可以满足每一个的最小间距了,剩下的如何划分?
			uint weightCnt = 0;
			uint totalCnt = 0;
			uint totalWeight = 0;
			uint normalTotalMinSize = 0;

			foreach (var sizeAdjust in items)
			{
				++totalCnt;
				if (!sizeAdjust.curSize.HaveWeight)
				{
					normalTotalMinSize += sizeAdjust.curSize.Min;
					continue;
				}
                if (sizeAdjust.curSize.Weight == 0)
                {
                    --totalCnt;
                    continue;
                }
				++weightCnt;
				totalWeight += sizeAdjust.curSize.Weight;
			}

			if ( totalCnt == 0)
				return;

			uint lessSpace = (uint)totalLessSpace;
			uint detalSellSize = (uint)lessSpace / totalCnt;

			uint normalTotalSize = normalTotalMinSize + detalSellSize * (totalCnt - weightCnt);
			uint weightTotalSize = total - normalTotalSize;
			uint sizePerWeight = 0;
			if ( totalWeight != 0 )
			{
				weightTotalSize = ( weightTotalSize / totalWeight ) * totalWeight;
				//	每一个weight 对应的点数
				sizePerWeight = weightTotalSize / totalWeight;
				if ( sizePerWeight < minPointPerWeight )
				{
					sizePerWeight = (uint)System.Math.Ceiling(minPointPerWeight);
				}
				else if ( sizePerWeight > maxPointPerWeight )
				{
					sizePerWeight = (uint)System.Math.Floor(maxPointPerWeight);
				}
				weightTotalSize = sizePerWeight * totalWeight;
				if ( weightTotalSize > total )
				{
					lessSpace = 0;
					detalSellSize = 0;
				}
				else if ( totalCnt - weightCnt != 0 )
				{
					detalSellSize = (total - weightTotalSize - normalTotalMinSize) / ( totalCnt - weightCnt );
					lessSpace = total - detalSellSize * ( totalCnt - weightCnt ) - weightTotalSize - normalTotalMinSize;
				}
				else
				{
					detalSellSize = 0;
					lessSpace = total - weightTotalSize;
				}
			}
			else
			{
				lessSpace = total - detalSellSize * (totalCnt - weightCnt) - curRange.Min;
			}

			//lessSpace = total - normalTotalSize - weightTotalSize;
			//detalSellSize += lessSpace / (totalCnt - weightCnt);
			//normalTotalSize = normalTotalMinSize + detalSellSize * (totalCnt - weightCnt);
			//lessSpace = total - normalTotalSize - weightTotalSize;

			uint canAddCnt = 0;
			foreach (var sizeAdjust in items)
			{
				if ( !sizeAdjust.curSize.HaveWeight )
				{
					uint curCellSize = sizeAdjust.curSize.Min + detalSellSize;
					if ( lessSpace != 0 )
					{
						curCellSize += 1;
						lessSpace -= 1;
					}

					if ( sizeAdjust.curSize.HaveMax && curCellSize > sizeAdjust.curSize.Max )
					{
						lessSpace += curCellSize - sizeAdjust.curSize.Max;
						curCellSize = sizeAdjust.curSize.Max;
					}
					else
					{
						++canAddCnt;
					}

					sizeAdjust.curSize.Min = curCellSize;
				}
				else
				{
					uint curCellSize = sizeAdjust.curSize.Weight * sizePerWeight;
					//if ( sizeAdjust.curSize.HaveMax && sizeAdjust.curSize.Max < curCellSize )
					//{
					//	sizePerWeight = sizeAdjust.curSize.Max / sizeAdjust.curSize.Weight;
					//	break;
					//}
					sizeAdjust.curSize.Min = curCellSize;
				}
			}

			while ( lessSpace != 0 && canAddCnt != 0 )
			{
				detalSellSize = lessSpace/canAddCnt;
				lessSpace -= detalSellSize * canAddCnt;
				canAddCnt = 0;
				foreach ( var sizeAdjust in items )
				{
					if ( sizeAdjust.curSize.HaveWeight )
						continue;

					if ( sizeAdjust.curSize.HaveMax && sizeAdjust.curSize.Max == sizeAdjust.curSize.Min )
						continue;
	
					uint curCellSize = sizeAdjust.curSize.Min + detalSellSize;
					if ( lessSpace != 0 )
					{
						curCellSize += 1;
						lessSpace -= 1;
					}

					if ( sizeAdjust.curSize.HaveMax && curCellSize > sizeAdjust.curSize.Max )
					{
						lessSpace += curCellSize - sizeAdjust.curSize.Max;
						curCellSize = sizeAdjust.curSize.Max;
					}
					else
					{
						++canAddCnt;
					}

					sizeAdjust.curSize.Min = curCellSize;
				}
			}

			//	还剩下就在权重集合中平分
			if ( lessSpace != 0 && weightCnt != 0 )
			{
				uint detalSellSizePerWeight = lessSpace / totalWeight;
				lessSpace -= detalSellSizePerWeight * totalWeight;
				
				detalSellSize = lessSpace / weightCnt;
				lessSpace -= detalSellSize * weightCnt;
				foreach ( var sizeAdjust in items )
				{
                    if ( !sizeAdjust.curSize.HaveWeight || sizeAdjust.curSize.Weight == 0 )
						continue;
					sizeAdjust.curSize.Min += detalSellSize + sizeAdjust.curSize.Weight * detalSellSizePerWeight;
					if ( lessSpace != 0 )
					{
						++sizeAdjust.curSize.Min;
						--lessSpace;
					}
				}
			}
		}

		public override bool VisitItems(VisitItemsDelegate visitor, uint startLevel, object usrItem)
		{
			if ( !visitor(this, startLevel, usrItem) )
				return false;
			foreach ( var romItems in m_dicFrame )
			{
				foreach ( var colItems in romItems )
				{
					if ( colItems == null )
						continue;
					if ( !colItems.VisitItems(visitor, startLevel+1, usrItem) )
						return false;
				}
			}

			return true;
		}
	}
}

