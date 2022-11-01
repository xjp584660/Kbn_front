using UnityEngine;
using System.Collections;

public class AvaInfoItemData
{
    public AvaInfoItemData(string _name, string _yourData, string _enemyData)
    {
        name = _name;
        yourData = _yourData;
        enemyData = _enemyData;

        type = DataType.PLAIN;
    }

    public AvaInfoItemData(string _name, string _yourData, string _enemyData, DataType _type)
    {
        name = _name;
        yourData = _yourData;
        enemyData = _enemyData;

        type = _type;
    }

    public enum DataType
    {
        PLAIN,
        TIME,
    }

	public string name;
    public string yourData;
    public string enemyData;
    public DataType type = DataType.PLAIN;
}
