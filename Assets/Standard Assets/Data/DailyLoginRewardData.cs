using UnityEngine;
using System.Collections;
using System;
using System.Text;

using _Global = KBN._Global;
using MystryChest = KBN.MystryChest;

public class DailyLoginRewardData  {
    #region nested classes
    public struct CellData {
        private readonly int itemId;
        private readonly int itemCnt; 
        private readonly bool special;

        public int ItemId {
            get { return itemId; }
        }

        public int ItemCnt {
            get { return itemCnt; }
        }

        public bool Special {
            get { return special; }
        }

        public CellData(int itemId, int itemCnt, bool special) : this() {
            this.itemId = itemId;
            this.itemCnt = itemCnt;
            this.special = special;
        }

        public override string ToString() {
            return string.Format(
                "[DailyLoginRewardData.CellData: ItemId={0}, ItemCnt={1}, Special={2}]",
                ItemId, ItemCnt, Special);
        }
    }
    #endregion

    #region fields and properties
    private readonly int rowCnt;
    private readonly int colCnt;
    private readonly int length;
    private readonly long timeStamp;
    private readonly int currentMonth;
    public int RowCnt { 
        get {
            return rowCnt;
        }
    }
    public int ColCnt {
        get {
            return colCnt;
        }
    }
    public int Length {
        get {
            return length;
        }
    }
    public long TimeStamp {
        get {
            return timeStamp;
        }
    }
    public int CurrentMonth {
        get {
            return currentMonth;
        }
    }
    private CellData[] cellDataArray;

    public bool HasMystryChest {
        get {
            if (cellDataArray == null) {
                return false;
            }
            foreach (CellData cd in cellDataArray) {
                if (MystryChest.IsMystryChest_Temp(cd.ItemId)) {
                    return true;
                }
            }
            return false;
        }
    }

    public int RewardCount {
        get {
            if (cellDataArray == null)  {
                return 0;
            }
            int ret = 0;
            foreach (CellData cd in cellDataArray) {
                if (cd.ItemId > 0) {
                    ret++;
                }
            }
            return ret;
        }
    }
    #endregion

    private DailyLoginRewardData(long timeStamp, int rowCnt, int colCnt, int currentMonth) {
        this.timeStamp = timeStamp;
        this.rowCnt = rowCnt;
        this.colCnt = colCnt;
        this.length = rowCnt * colCnt;
        this.currentMonth = currentMonth;
        cellDataArray = new CellData[Length];
    }

    #region public interface
    public override string ToString() {
        StringBuilder sb = new StringBuilder();
        sb.Append(string.Format("[DailyLoginRewardData: RowCnt={0}, ColCnt={1}, Length={2}\n",
                RowCnt, ColCnt, Length));
        for (int i = 0; i < Length; ++i) {
            sb.Append(string.Format("{0}: {1}", i, cellDataArray[i]));
        }
        sb.Append("]");
        return sb.ToString();
    }

    public CellData this[int index] {
        get {
            return cellDataArray[index];
        }
        set {
            cellDataArray[index] = value;
        }
    }

    public static DailyLoginRewardData CreateWithHashObject(HashObject ho) {
        if (ho == null) {
            throw new ArgumentNullException("'ho' couldn't be empty");
        }
        DailyLoginRewardData ret = new DailyLoginRewardData(
                _Global.INT64(ho["timeStamp"]),
                _Global.INT32(ho["rowCnt"]),
                _Global.INT32(ho["colCnt"]),
                _Global.INT32(ho["month"]));
        HashObject itemsHo = ho["itemlist"];
        if (itemsHo == null) return ret;
        for (int i = 0; i < ret.Length; ++i) {
            int itemId = -1;
            int itemCnt = 0;
            bool special = false;
            HashObject cellHo = itemsHo[(i + 1).ToString()];
            if (cellHo != null) {
                string itemIdStr = (cellHo["itemId"] == null ? null : cellHo["itemId"].Value as string);
                if (!string.IsNullOrEmpty(itemIdStr)) {
                    itemId = Convert.ToInt32(itemIdStr);
                }
                string itemCntStr = (cellHo["itemCnt"] == null ? null : cellHo["itemCnt"].Value as string);
                if (!string.IsNullOrEmpty(itemCntStr)) {
                    itemCnt = Convert.ToInt32(itemCntStr);
                }
                special = (cellHo["special"] == null ? false : _Global.GetBoolean(cellHo["special"].Value));
            }
            ret.cellDataArray[i] = new CellData(itemId, itemCnt, special);
        }
        return ret;
    }
    #endregion
}
