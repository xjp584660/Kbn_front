using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

/* Classes in this file should be generic, but it really sucks to use generics in UnityScript,
 * and there is probably JIT error on iOS when using generic types across assemblies.
 * So here they're simply implemented for int (what's needed for now).
 */

namespace KBN {
    public struct IntRange {
        private readonly int minValue;
        private readonly int maxValue;

        public int MinValue {
            get {
                return minValue;
            }
        }

        public int MaxValue {
            get {
                return maxValue;
            }
        }

        public IntRange(int minValue, int maxValue) : this() {
            if (maxValue < minValue) {
                throw new ArgumentException("minValue should be <= maxValue");
            }
            this.minValue = minValue;
            this.maxValue = maxValue;
        }

        public bool Contains(int val) {
            return minValue <= val && val <= maxValue;
        }

        public override string ToString() {
            return string.Format("IntRange: [{0}, {1}]", minValue, maxValue);
        }
    }

    // A utility class to save unions of intervals and test whether a value is contained in the set
    public class IntIntervalUnion {
        private List<IntRange> intervals = new List<IntRange>();

        public IntIntervalUnion() : this(null) {
        }

        // Currently you should only pass increasing, non-intersected close intervals
        public IntIntervalUnion(IList<IntRange> intervals) {
            if (intervals == null) return;
            for (int i = 1; i < intervals.Count; ++i) {
                if (intervals[i].MinValue <= intervals[i - 1].MaxValue) {
                    throw new ArgumentException("Input interval list is not increasing and non-intersected");
                }
            }
            this.intervals.AddRange(intervals);
        }

        public bool Contains(int val) {
            return ContainsRecur(val, 0, intervals.Count);
        }

        private bool ContainsRecur(int val, int beg, int end) {
            if (beg >= end) return false;
            int mid = beg + (end - beg) / 2;
            if (intervals[mid].Contains(val)) {
                return true;
            }
            if (val < intervals[mid].MinValue) {
                return ContainsRecur(val, beg, mid);
            } else { // val > intervals[mid].MaxValue
                return ContainsRecur(val, mid + 1, end);
            }
        }

        public override string ToString() {
            StringBuilder sb = new StringBuilder();
            sb.Append("IntIntervalUnion: {");
            foreach (var interval in intervals) {
                sb.Append(interval.ToString());
                sb.Append(", ");
            }
            sb.Append("}");
            return sb.ToString();
        }

        public static IntIntervalUnion CreateFromHashObject(HashObject ho) {
            if (ho == null) return new IntIntervalUnion();
            List<IntRange> ranges = new List<IntRange>();

            int keyCnt = _Global.GetObjectKeys(ho).Length;
            for (int i = 0; i < keyCnt; ++i) {
                HashObject rawRange = ho[string.Format("{0}{1}", _Global.ap, i)];
                int minValue = _Global.INT32(rawRange[string.Format("{0}0", _Global.ap)]);
                int maxValue = _Global.INT32(rawRange[string.Format("{0}1", _Global.ap)]);
                ranges.Add(new IntRange(minValue, maxValue));
            }
            return new IntIntervalUnion(ranges);
        }
    }
}
