namespace KBN
{
	public class GDS_AllianceSkill : GDS_Template<DataTable.AllianceSkill, GDS_AllianceSkill>
	{
		protected override void UpdateItemsFromString()
		{
			m_DT.UpdateItemsFromString<DataTable.AllianceSkill> (m_strData,0,1);
		}// Empty

		protected override void pri_UpdateItemsFromString(){
            m_strData = DesDeCode(m_strData);
            m_DT.UpdateItemsFromString<DataTable.AllianceSkill>(m_strData,0,1);
        }
	}
}
