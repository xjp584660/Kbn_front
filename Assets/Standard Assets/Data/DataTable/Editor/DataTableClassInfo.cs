using System.Collections.Generic;

namespace KBN.DataTable.Editor
{
    public class DataTableClassInfo
    {
        public string ClassName;

        public bool Collapse = true;

        public List<DataTableFieldInfo> DataTableFieldInfoList = new List<DataTableFieldInfo>();
    }
}
