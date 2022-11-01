using System;

namespace UILayout
{
	public struct Fraction
	{
		public readonly uint dn;	//	denominator;
		public readonly uint nm;	//	numerator;
		public Fraction(uint inNM, uint inDN)
		{
			nm = inNM;
			dn = inDN;
		}

		public float Value
		{
			get
			{
				if ( dn == 0 )
					return float.MaxValue;
				return (float)nm / (float)dn;
			}
		}

		public static bool operator <(Fraction l, Fraction r)
		{
			return l.nm * r.dn < r.nm * l.dn;
		}

		public static bool operator >(Fraction l, Fraction r)
		{
			return l.nm * r.dn > r.nm * l.dn;
		}

		public override bool Equals(object obj)
		{
			if (!(obj is Fraction))
				return false;
			Fraction o = (Fraction)obj;
			return this.nm * o.dn == o.nm * this.dn;
		}

		public override int GetHashCode()
		{
			return (int)(dn * 1011 + nm);
		}

		public static bool operator !=(Fraction l, Fraction r)
		{
			return l.nm * r.dn != r.nm * l.dn;
		}
		public static bool operator ==(Fraction l, Fraction r)
		{
			return l.nm * r.dn == r.nm * l.dn;
		}

		public static uint operator *(Fraction l, uint val)
		{
			return l.nm * val / l.dn;
		}

	}
}

