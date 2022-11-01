using System.Linq;

namespace KBN.DataTable
{
    public class AllianceLanguage : IDataItem
    {
        #region Fields
        
        public int LanguageId;

        public string LanguageName;

        public string flagicon;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            LanguageId = int.Parse(columns[0]);
            LanguageName = columns[1];
            flagicon = columns[2];
        }

        #endregion
    }
}
