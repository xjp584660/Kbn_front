using System;
using KBN;
using KBN.DataTable;
using System.Collections.Generic;

public class AvaAlliance : AvaModule
{
	public event OnEapChangedDelegate OnEapChanged;
	public event OnCapChangedDelegate OnCapChanged;
	public event OnLevelChangedDelegate OnLevelChanged;

	public delegate void OnGetSkillInfoOk();
	public delegate void OnEapChangedDelegate( long oldEap, long newEap );
	public delegate void OnCapChangedDelegate( long oldCap, long newCap );
	public delegate void OnLevelChangedDelegate( long oldLevel, long newLevel );

	private long _cap;
	private long _eap;
	private int _level;

    public AvaAlliance(AvaManager avaEntry)
        : base(avaEntry)
    {
    }
	
    public long ExpendablePoint
    {
        get
		{
			return _eap;
		}
        set
		{
			if( value == _eap )
				return;
			
			long old = _eap;
			_eap = value;

			if( OnEapChanged != null )
            {
				OnEapChanged( old, _eap );
			}
		}
    }

    public long CumulatePoint
    {
        get
		{
			return _cap;
		}
        set
		{
			if( value == _cap )
				return;
			
			long old = _cap;
			_cap = value;

			if( OnCapChanged != null )
            {
				OnCapChanged( old, _cap );
			}
		}
    }

	public int Level
	{
		get
		{
			return _level;
		}
		set
		{
			if( value == _level )
				return;
		
			long old = _level;
			_level = value;
			
			if( OnLevelChanged != null )
	        {
	            OnLevelChanged( old, _level );
	        }
		}
    }
    
    public long UpgradeCumulatePoint()
	{
		GDS_AllianceUpgrade upgradeGds = GameMain.GdsManager.GetGds<GDS_AllianceUpgrade>();
		AllianceUpgrade upgradeGdsItem = upgradeGds.GetItemById( Level );

		return upgradeGdsItem == null ? long.MaxValue : upgradeGdsItem.CAP;
	}

	private List<AvaAllianceSkill> _skills;

	public List<AvaAllianceSkill> Skills
	{
		get
		{
			if( _skills == null ){
				InitSkills();
			}
			return _skills;
		}
	}

	public void GetSkillInfoFromServer( int allianceId, OnGetSkillInfoOk onGetSkillInfoOk )
	{
		PBMsgReqAllianceSkillInfo.PBMsgReqAllianceSkillInfo request = new PBMsgReqAllianceSkillInfo.PBMsgReqAllianceSkillInfo();
		
		Action<byte[]> responseOk = delegate( byte[] data ){

			if( data != null ){
				var result = _Global.DeserializePBMsgFromBytes<PBMsgAllianceSkillInfo.PBMsgAllianceSkillInfo>(data);

				foreach( var item in result.skillList ){

					foreach ( var skill in Skills ){
						if( skill.Id == item.skillId ){
							skill.Level = item.skillLevel;
							break;
						}
					}
				}
			}

			if( onGetSkillInfoOk != null ){
				onGetSkillInfoOk();
			}

		};
		request.allianceId = allianceId;
		UnityNet.RequestForGPB("allianceSkillInfo.php", request, responseOk, null);
	}

	public bool SkillToNextLevelCostSatisfied(AvaAllianceSkill skill)
	{
		return ExpendablePoint >= skill.ToNextLevelCost.Eap;
	}
	
	public bool SkillToNextLevelRequirementSatisfied(AvaAllianceSkill skill)
	{
		if( skill.ToNextLevelRequirement.AllianceLevel > Level )
			return false;
		
		foreach( var kv in skill.ToNextLevelRequirement.Skills ){
			int needSkillId = kv.Key;
			int needLevel = kv.Value;
			
			int curLevel = GetSkillLevel( needSkillId );

			if( needLevel > curLevel ){
				return false;
			}
        }
        
        return true;
	}

	public int GetSkillLevel( int skillId )
	{
		foreach( var curSkill in Skills ){
			if( curSkill.Id == skillId ){
				return curSkill.Level;
			}
		}

		return 0;
	}

	public int GetSkillBuffValue(int skillId)
	{
		foreach( var curSkill in Skills ){
			if( curSkill.Id == skillId ){
				return curSkill.Value;
			}
		}
		
		return 0;
	}

	public float GetSkill24BuffValue()
	{
		foreach( var curSkill in Skills ){
			if( curSkill.Id == 24 ){
				return curSkill.Value / 10000f;
			}
		}
		
		return 0;
	}

	public float GetSkillBuffId(int skillId)
	{
		foreach( var curSkill in Skills ){
			if( curSkill.Id == skillId ){
				return curSkill.BuffId;
			}
		}
		
		return 0;
	}

	public List<AvaAllianceSkill> GetSkillsByScene( BuffScene scene )
	{
		List<AvaAllianceSkill> ret = new List<AvaAllianceSkill>();

		foreach( var curSkill in Skills ){
			if( curSkill.Scene == scene ){
				ret.Add( curSkill );
			}
		}

		return ret;
	}

	public void OnLeaveAlliance()
	{
		ExpendablePoint = 0;
		CumulatePoint = 0;
		Level = 0;
		_skills = null;
	}

	private void InitSkills()
	{
		_skills = new List<AvaAllianceSkill>();
		List<int> skillIds = AvaAllianceSkill.SkillIds();

		foreach( var skillId in skillIds ){
			_skills.Add( new AvaAllianceSkill( skillId, 0 ) );
		}
	}

    public override void Init()
    {
		HashObject seed = GameMain.singleton.getSeed();
		_level = _Global.INT32(seed["allianceLevel"]);
    }

    public override void Update()
    {

    }

    public override void Clear()
    {

    }
}
