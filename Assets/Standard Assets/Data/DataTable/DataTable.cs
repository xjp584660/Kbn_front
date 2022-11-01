using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Collections;

namespace KBN.DataTable
{
    public class DataTable
    {
        #region Fields

        #region Public

        public static readonly string[] LineSplitChar = { "\r\n", "\r", "\n" };

        public const char ColumnSplitChar = '\t';

        public const string KeyConnectChar = "^";

        #endregion

        #region Private

        protected readonly Dictionary<string, IDataItem> _dataItemDictionary = new Dictionary<string, IDataItem>();

        #endregion

        #endregion

        #region Methods

		public void UpdateItemsFromString<T>(string text, params int[] keyIndies) where T : IDataItem, new()
		{
			var keyIndiesLength = keyIndies.Length;
			var keyParts = new string[keyIndiesLength];
			int beginIndex = 0;
			int skip = 0;
			int length = string.IsNullOrEmpty(text)? 0 : text.Length;
			for(int i=0;i<length;i++)
			{
				if(text[i] == '\r' || text[i] == '\n')
				{
					if(text[i] == '\r' && (i+1) < length && text[i+1] == '\n')
					{
						i++;
					}
					if(skip++ < 3)
					{
						beginIndex = i+1;
						continue;
					}
					string line = text.Substring(beginIndex,i-beginIndex);
					beginIndex = i+1;
					if(String.IsNullOrEmpty(line))
					{
						continue;
					}
					
					var columns = line.Split(ColumnSplitChar);
					for (var j = 0; j != keyIndiesLength; ++j)
					{
						keyParts[j] = columns[keyIndies[j]];
					}
					var item = new T();
					item.LoadFromText(columns);
					_dataItemDictionary[JoinString(KeyConnectChar, keyParts)] = item;
					
				}
			}
			
		}

        public void DeleteItemsWithKeyPrefix(params string[] keys)
        {
            var keyPrefix = JoinString(KeyConnectChar, keys);
            var keyHashset = new HashSet<string>();
            foreach (var dataItem in _dataItemDictionary.Where(dataItem => dataItem.Key.StartsWith(keyPrefix)))
            {
                keyHashset.Add(dataItem.Key);
            }
            foreach (var key in keyHashset)
            {
                _dataItemDictionary.Remove(key);
            }
        }

        public bool Contains(params string[] keys)
        {
            return _dataItemDictionary.ContainsKey(JoinString(KeyConnectChar, keys));
        }

        public T GetItem<T>(params string[] keys) where T : IDataItem
        {
			var joinStr = JoinString (KeyConnectChar, keys);
			return Contains (joinStr) ? (T)_dataItemDictionary [joinStr] : default(T);
        }

        public Dictionary<string, IDataItem>.ValueCollection GetItems()
        {
            return _dataItemDictionary.Values;
        }

        public static string JoinString(object seperator, string[] stringCollection)
        {
            return string.Join(seperator.ToString(), stringCollection);
        }

		public Dictionary<string, IDataItem> GetItemDictionary()
		{
			return _dataItemDictionary;
		}

		public int GetCount()
		{
			return _dataItemDictionary.Count;
		}
        #endregion
    }
}
