//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgPveResultInfo.proto
namespace PBMsgPveResultInfo
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgPveResultInfo")]
  public partial class PBMsgPveResultInfo : global::ProtoBuf.IExtensible
  {
    public PBMsgPveResultInfo() {}
    
    private int _levelID;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"levelID", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int levelID
    {
      get { return _levelID; }
      set { _levelID = value; }
    }
    private int? _score;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"score", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int score
    {
      get { return _score?? default(int); }
      set { _score = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool scoreSpecified
    {
      get { return this._score != null; }
      set { if (value == (this._score== null)) this._score = value ? this.score : (int?)null; }
    }
    private bool ShouldSerializescore() { return scoreSpecified; }
    private void Resetscore() { scoreSpecified = false; }
    
    private int? _star;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"star", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int star
    {
      get { return _star?? default(int); }
      set { _star = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool starSpecified
    {
      get { return this._star != null; }
      set { if (value == (this._star== null)) this._star = value ? this.star : (int?)null; }
    }
    private bool ShouldSerializestar() { return starSpecified; }
    private void Resetstar() { starSpecified = false; }
    
    private int? _speed;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"speed", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int speed
    {
      get { return _speed?? default(int); }
      set { _speed = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool speedSpecified
    {
      get { return this._speed != null; }
      set { if (value == (this._speed== null)) this._speed = value ? this.speed : (int?)null; }
    }
    private bool ShouldSerializespeed() { return speedSpecified; }
    private void Resetspeed() { speedSpecified = false; }
    
    private int? _vitality;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"vitality", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int vitality
    {
      get { return _vitality?? default(int); }
      set { _vitality = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool vitalitySpecified
    {
      get { return this._vitality != null; }
      set { if (value == (this._vitality== null)) this._vitality = value ? this.vitality : (int?)null; }
    }
    private bool ShouldSerializevitality() { return vitalitySpecified; }
    private void Resetvitality() { vitalitySpecified = false; }
    
    private int? _tactics;
    [global::ProtoBuf.ProtoMember(6, IsRequired = false, Name=@"tactics", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int tactics
    {
      get { return _tactics?? default(int); }
      set { _tactics = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool tacticsSpecified
    {
      get { return this._tactics != null; }
      set { if (value == (this._tactics== null)) this._tactics = value ? this.tactics : (int?)null; }
    }
    private bool ShouldSerializetactics() { return tacticsSpecified; }
    private void Resettactics() { tacticsSpecified = false; }
    
    private bool? _isHighest;
    [global::ProtoBuf.ProtoMember(7, IsRequired = false, Name=@"isHighest", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public bool isHighest
    {
      get { return _isHighest?? default(bool); }
      set { _isHighest = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool isHighestSpecified
    {
      get { return this._isHighest != null; }
      set { if (value == (this._isHighest== null)) this._isHighest = value ? this.isHighest : (bool?)null; }
    }
    private bool ShouldSerializeisHighest() { return isHighestSpecified; }
    private void ResetisHighest() { isHighestSpecified = false; }
    
    private readonly global::System.Collections.Generic.List<int> _item = new global::System.Collections.Generic.List<int>();
    [global::ProtoBuf.ProtoMember(8, Name=@"item", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public global::System.Collections.Generic.List<int> item
    {
      get { return _item; }
    }
  
    private bool? _isFirstWin;
    [global::ProtoBuf.ProtoMember(9, IsRequired = false, Name=@"isFirstWin", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public bool isFirstWin
    {
      get { return _isFirstWin?? default(bool); }
      set { _isFirstWin = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool isFirstWinSpecified
    {
      get { return this._isFirstWin != null; }
      set { if (value == (this._isFirstWin== null)) this._isFirstWin = value ? this.isFirstWin : (bool?)null; }
    }
    private bool ShouldSerializeisFirstWin() { return isFirstWinSpecified; }
    private void ResetisFirstWin() { isFirstWinSpecified = false; }
    
    private byte[] _heroInfo;
    [global::ProtoBuf.ProtoMember(10, IsRequired = false, Name=@"heroInfo", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public byte[] heroInfo
    {
      get { return _heroInfo?? null; }
      set { _heroInfo = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool heroInfoSpecified
    {
      get { return this._heroInfo != null; }
      set { if (value == (this._heroInfo== null)) this._heroInfo = value ? this.heroInfo : (byte[])null; }
    }
    private bool ShouldSerializeheroInfo() { return heroInfoSpecified; }
    private void ResetheroInfo() { heroInfoSpecified = false; }
    
    private long? _bossCurHP;
    [global::ProtoBuf.ProtoMember(11, IsRequired = false, Name=@"bossCurHP", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long bossCurHP
    {
      get { return _bossCurHP?? default(long); }
      set { _bossCurHP = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool bossCurHPSpecified
    {
      get { return this._bossCurHP != null; }
      set { if (value == (this._bossCurHP== null)) this._bossCurHP = value ? this.bossCurHP : (long?)null; }
    }
    private bool ShouldSerializebossCurHP() { return bossCurHPSpecified; }
    private void ResetbossCurHP() { bossCurHPSpecified = false; }
    
    private long? _bossTotalHP;
    [global::ProtoBuf.ProtoMember(12, IsRequired = false, Name=@"bossTotalHP", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long bossTotalHP
    {
      get { return _bossTotalHP?? default(long); }
      set { _bossTotalHP = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool bossTotalHPSpecified
    {
      get { return this._bossTotalHP != null; }
      set { if (value == (this._bossTotalHP== null)) this._bossTotalHP = value ? this.bossTotalHP : (long?)null; }
    }
    private bool ShouldSerializebossTotalHP() { return bossTotalHPSpecified; }
    private void ResetbossTotalHP() { bossTotalHPSpecified = false; }
    
    private int? _attackNum;
    [global::ProtoBuf.ProtoMember(13, IsRequired = false, Name=@"attackNum", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int attackNum
    {
      get { return _attackNum?? default(int); }
      set { _attackNum = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool attackNumSpecified
    {
      get { return this._attackNum != null; }
      set { if (value == (this._attackNum== null)) this._attackNum = value ? this.attackNum : (int?)null; }
    }
    private bool ShouldSerializeattackNum() { return attackNumSpecified; }
    private void ResetattackNum() { attackNumSpecified = false; }
    
    private int? _nextLevelID;
    [global::ProtoBuf.ProtoMember(14, IsRequired = false, Name=@"nextLevelID", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int nextLevelID
    {
      get { return _nextLevelID?? default(int); }
      set { _nextLevelID = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool nextLevelIDSpecified
    {
      get { return this._nextLevelID != null; }
      set { if (value == (this._nextLevelID== null)) this._nextLevelID = value ? this.nextLevelID : (int?)null; }
    }
    private bool ShouldSerializenextLevelID() { return nextLevelIDSpecified; }
    private void ResetnextLevelID() { nextLevelIDSpecified = false; }
    
    private int? _incrementBuff;
    [global::ProtoBuf.ProtoMember(15, IsRequired = false, Name=@"incrementBuff", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int incrementBuff
    {
      get { return _incrementBuff?? default(int); }
      set { _incrementBuff = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool incrementBuffSpecified
    {
      get { return this._incrementBuff != null; }
      set { if (value == (this._incrementBuff== null)) this._incrementBuff = value ? this.incrementBuff : (int?)null; }
    }
    private bool ShouldSerializeincrementBuff() { return incrementBuffSpecified; }
    private void ResetincrementBuff() { incrementBuffSpecified = false; }
    
    private int? _totalBuff;
    [global::ProtoBuf.ProtoMember(16, IsRequired = false, Name=@"totalBuff", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int totalBuff
    {
      get { return _totalBuff?? default(int); }
      set { _totalBuff = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool totalBuffSpecified
    {
      get { return this._totalBuff != null; }
      set { if (value == (this._totalBuff== null)) this._totalBuff = value ? this.totalBuff : (int?)null; }
    }
    private bool ShouldSerializetotalBuff() { return totalBuffSpecified; }
    private void ResettotalBuff() { totalBuffSpecified = false; }
    
    private int? _damageRank;
    [global::ProtoBuf.ProtoMember(17, IsRequired = false, Name=@"damageRank", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int damageRank
    {
      get { return _damageRank?? default(int); }
      set { _damageRank = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool damageRankSpecified
    {
      get { return this._damageRank != null; }
      set { if (value == (this._damageRank== null)) this._damageRank = value ? this.damageRank : (int?)null; }
    }
    private bool ShouldSerializedamageRank() { return damageRankSpecified; }
    private void ResetdamageRank() { damageRankSpecified = false; }
    
    private long? _nextBossCurHP;
    [global::ProtoBuf.ProtoMember(18, IsRequired = false, Name=@"nextBossCurHP", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long nextBossCurHP
    {
      get { return _nextBossCurHP?? default(long); }
      set { _nextBossCurHP = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool nextBossCurHPSpecified
    {
      get { return this._nextBossCurHP != null; }
      set { if (value == (this._nextBossCurHP== null)) this._nextBossCurHP = value ? this.nextBossCurHP : (long?)null; }
    }
    private bool ShouldSerializenextBossCurHP() { return nextBossCurHPSpecified; }
    private void ResetnextBossCurHP() { nextBossCurHPSpecified = false; }
    
    private long? _nextBossTotalHP;
    [global::ProtoBuf.ProtoMember(19, IsRequired = false, Name=@"nextBossTotalHP", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long nextBossTotalHP
    {
      get { return _nextBossTotalHP?? default(long); }
      set { _nextBossTotalHP = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool nextBossTotalHPSpecified
    {
      get { return this._nextBossTotalHP != null; }
      set { if (value == (this._nextBossTotalHP== null)) this._nextBossTotalHP = value ? this.nextBossTotalHP : (long?)null; }
    }
    private bool ShouldSerializenextBossTotalHP() { return nextBossTotalHPSpecified; }
    private void ResetnextBossTotalHP() { nextBossTotalHPSpecified = false; }
    
    private int? _attackNumPerDay;
    [global::ProtoBuf.ProtoMember(20, IsRequired = false, Name=@"attackNumPerDay", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int attackNumPerDay
    {
      get { return _attackNumPerDay?? default(int); }
      set { _attackNumPerDay = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool attackNumPerDaySpecified
    {
      get { return this._attackNumPerDay != null; }
      set { if (value == (this._attackNumPerDay== null)) this._attackNumPerDay = value ? this.attackNumPerDay : (int?)null; }
    }
    private bool ShouldSerializeattackNumPerDay() { return attackNumPerDaySpecified; }
    private void ResetattackNumPerDay() { attackNumPerDaySpecified = false; }
    
    private long? _activeTime;
    [global::ProtoBuf.ProtoMember(21, IsRequired = false, Name=@"activeTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long activeTime
    {
      get { return _activeTime?? default(long); }
      set { _activeTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool activeTimeSpecified
    {
      get { return this._activeTime != null; }
      set { if (value == (this._activeTime== null)) this._activeTime = value ? this.activeTime : (long?)null; }
    }
    private bool ShouldSerializeactiveTime() { return activeTimeSpecified; }
    private void ResetactiveTime() { activeTimeSpecified = false; }
    
    private int? _normalAttackNumPerWeek;
    [global::ProtoBuf.ProtoMember(22, IsRequired = false, Name=@"normalAttackNumPerWeek", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int normalAttackNumPerWeek
    {
      get { return _normalAttackNumPerWeek?? default(int); }
      set { _normalAttackNumPerWeek = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool normalAttackNumPerWeekSpecified
    {
      get { return this._normalAttackNumPerWeek != null; }
      set { if (value == (this._normalAttackNumPerWeek== null)) this._normalAttackNumPerWeek = value ? this.normalAttackNumPerWeek : (int?)null; }
    }
    private bool ShouldSerializenormalAttackNumPerWeek() { return normalAttackNumPerWeekSpecified; }
    private void ResetnormalAttackNumPerWeek() { normalAttackNumPerWeekSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}