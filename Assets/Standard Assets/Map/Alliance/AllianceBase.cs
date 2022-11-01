using KBN;

public class AllianceBase 
{
    // my data
    private int _MyAllianceId;
    public int MyAllianceId()
    { 
        return _MyAllianceId; 
    }

    private string _MyAllianceName;
    public string MyAllianceName()
    { 
        return _MyAllianceName;
    }
    // name dirty for now
    private bool _MyAllianceDataDirty;
    public bool MyAllianceDataDirty()
    {
        return _MyAllianceDataDirty;
    }

    private int _MyOfficerType;
    public int MyOfficerType()
    { 
        return _MyOfficerType;
    }
    private bool _MyIsMVP;
    public bool MyIsMVP {
		get {
			return _MyIsMVP;
		}
		set {
			_MyIsMVP = value;
		}
	}
	
    protected void SetMyAlliance(int Id, string Name, int OfficerType) 
    {
        if (Id == 0)
        {
            _MyAllianceName = string.Empty;
            _MyOfficerType = 0;
            _MyAllianceDataDirty = false;
        } 
        else 
        {
            if (_MyAllianceId != Id) 
            {
                _MyAllianceDataDirty = true;
                _MyAllianceName = string.Empty;
            }
            else if (!string.IsNullOrEmpty(Name)) 
            {
                _MyAllianceDataDirty = false;
                _MyAllianceName = Name;
            }
            _MyOfficerType = OfficerType;
        }
		
		HashObject seed = KBN.GameMain.singleton.getSeed();

		// because server cannot re-register connection to new alliance broadcast group
		if (_MyAllianceId != Id)
		{
			NewSocketNet.instance.SetSignUpInformation(
				_Global.INT32(seed["player"]["worldId"]),
				_Global.INT32(seed["player"]["userId"]),
				_Global.GetString(seed["player"]["name"]),
				Id);
			NewSocketNet.instance.Reconnect();
		}

        _MyAllianceId = Id;
		seed["player"]["allianceId"].Value = Id;
    }
    
    public void SetMyOfficerType(int OfficerType)
    {
        _MyOfficerType = OfficerType;
    }
    
    public bool IsHaveRights(AllianceRights.RightsType rights)
    {
        return AllianceRights.IsHaveRights(_MyOfficerType, rights);
    }
    
    public bool IsChancellor() 
    {
        return _MyOfficerType == Constant.Alliance.Chancellor;
    }
    protected bool _PoachInviteEnable;
    public bool IsPoachInviteEnable() 
    { 
        return _PoachInviteEnable; 
    }
}