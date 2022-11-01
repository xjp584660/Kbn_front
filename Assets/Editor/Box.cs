
namespace PicUV
{
	public class Box
	{
		private struct Range
		{
			public uint start;
			public uint end;

			public Range(Range o)
			{
				start = o.start;
				end = o.end;
			}

			static public bool CombinRange(ref Range result, Range l, Range r)
			{
				uint start_max = System.Math.Max(l.start, r.start);
				uint end_min = System.Math.Min(l.end, r.end);
				if ( end_min < start_max )
					return false;
				result.start = start_max;
				result.end = end_min;
				return true;
			}
		}

		private readonly uint _width;
		private readonly uint _heigh;
		private System.Collections.Generic.List<System.Collections.Generic.LinkedList<Range>> _xRangeArray;

		public class Position
		{
			public Position(uint in_x, uint in_y)
			{
				x = in_x;
				y = in_y;
			}
			public readonly uint x;
			public readonly uint y;
		}

		public uint Width{get{return _width;}}
		public uint Heigh{get{return _heigh;}}

		public override string ToString()
		{
			System.Text.StringBuilder sb = new System.Text.StringBuilder(1024);
			foreach ( var rangeList in _xRangeArray )
			{
				foreach ( var range in rangeList )
				{
					sb.Append("{" + range.start.ToString() + ", " + range.end.ToString () + "},");
				}
				sb.AppendLine();
			}

			return sb.ToString();
		}

		public Box (uint w, uint h)
		{
			_width = w;
			_heigh = h;
			_xRangeArray = new System.Collections.Generic.List<System.Collections.Generic.LinkedList<Range>>((int)_width);
			for ( uint x = 0; x != _width; ++x )
			{
				var rangeList = new System.Collections.Generic.LinkedList<Range>();
				rangeList.AddLast(new Range{start = 0, end = _heigh});
				_xRangeArray.Add(rangeList);
			}
		}

		public Position Insert(uint width, uint heigh, uint additionWidth, uint additionHeigh)
		{
			width += additionWidth;
			heigh += additionHeigh;
			
			if ( width > _width || heigh > _heigh )
				return null;

			for ( uint x = 0; x != _width - width; ++x )
			{
				foreach ( Range range in this.priv_getCombinRangeInXSpace(x, x + width + 1, heigh) )
				{
					this.priv_FillWithUsed(x, range.start, width, heigh);
					return new Position(x, range.start);
				}
			}
			return null;
		}

		private System.Collections.Generic.IEnumerable<Range> priv_getCombinRangeInXSpace(uint startPos, uint endPos, uint minSize)
		{
			System.Collections.Generic.LinkedList<Range> startRange = new System.Collections.Generic.LinkedList<Range>();
			startRange.AddLast(new Range{start = 0, end = this._heigh});
			System.Collections.Generic.IEnumerable<Range> rangeDat = startRange;
			for ( uint i = startPos; i != endPos; ++i )
			{
				rangeDat = priv_getCombineRange(i, rangeDat);
			}

			foreach ( var range in rangeDat )
			{
				if ( range.end - range.start >= minSize )
					yield return range;
			}
		}

		private System.Collections.Generic.IEnumerable<Range> priv_getRangeWithLargeSpace(uint xPos, uint minSize)
		{
			foreach ( Range r in _xRangeArray[(int)xPos] )
			{
				if ( r.end - r.start >= minSize )
					yield return r;
			}
		}

		private System.Collections.Generic.IEnumerable<Range> priv_getCombineRange(uint xPos, System.Collections.Generic.IEnumerable<Range> inRange)
		{
			System.Collections.Generic.LinkedList<Range> lRange = new System.Collections.Generic.LinkedList<Range>();
			foreach ( var range in priv_getRangeWithLargeSpace(xPos, 1) )
			{
				lRange.AddLast(new Range(range));
			}

			foreach ( var irg in inRange )
			{
				//	skip front data.
				for ( var node = lRange.First; node != null; )
				{
					var nrg = node.Value;
					var oldNode = node;
					node = node.Next;
					if ( nrg.end <= irg.start )
					{
						lRange.Remove(oldNode);
						continue;
					}

					if ( nrg.start >= irg.end )
						break;

					Range rgResult = new Range();
					if ( Range.CombinRange(ref rgResult, nrg, irg) )
						yield return rgResult;
				}
			}
		}

		private void priv_FillWithUsed(uint x, uint y, uint width, uint heigh)
		{
			Range[] lessRange = new Range[] { new Range{start = 0, end = y}, new Range{start = y + heigh, end = _heigh} };
			for ( uint xPos = x; xPos != x + width; ++xPos )
			{
				var newRange = this.priv_getCombineRange(xPos, lessRange);
				var newRangeList = new System.Collections.Generic.LinkedList<Range>();
				foreach ( var r in newRange )
				{
					newRangeList.AddLast(r);
				}
				this._xRangeArray[(int)xPos] = newRangeList;
			}
		}
	}
}

