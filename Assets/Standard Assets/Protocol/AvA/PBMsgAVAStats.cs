//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAVAStats.proto
namespace PBMsgAVAStats
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAVAStats")]
  public partial class PBMsgAVAStats : global::ProtoBuf.IExtensible
  {
    public PBMsgAVAStats() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgAVAStats.SignalAlliance> _alliances = new global::System.Collections.Generic.List<PBMsgAVAStats.SignalAlliance>();
    [global::ProtoBuf.ProtoMember(1, Name=@"alliances", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgAVAStats.SignalAlliance> alliances
    {
      get { return _alliances; }
    }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"SignalAlliance")]
  public partial class SignalAlliance : global::ProtoBuf.IExtensible
  {
    public SignalAlliance() {}
    
    private int? _allianceId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"allianceId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int allianceId
    {
      get { return _allianceId?? default(int); }
      set { _allianceId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool allianceIdSpecified
    {
      get { return this._allianceId != null; }
      set { if (value == (this._allianceId== null)) this._allianceId = value ? this.allianceId : (int?)null; }
    }
    private bool ShouldSerializeallianceId() { return allianceIdSpecified; }
    private void ResetallianceId() { allianceIdSpecified = false; }
    
    private long? _totalScore;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"totalScore", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long totalScore
    {
      get { return _totalScore?? default(long); }
      set { _totalScore = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool totalScoreSpecified
    {
      get { return this._totalScore != null; }
      set { if (value == (this._totalScore== null)) this._totalScore = value ? this.totalScore : (long?)null; }
    }
    private bool ShouldSerializetotalScore() { return totalScoreSpecified; }
    private void ResettotalScore() { totalScoreSpecified = false; }
    
    private long? _wonderScore;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"wonderScore", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long wonderScore
    {
      get { return _wonderScore?? default(long); }
      set { _wonderScore = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool wonderScoreSpecified
    {
      get { return this._wonderScore != null; }
      set { if (value == (this._wonderScore== null)) this._wonderScore = value ? this.wonderScore : (long?)null; }
    }
    private bool ShouldSerializewonderScore() { return wonderScoreSpecified; }
    private void ResetwonderScore() { wonderScoreSpecified = false; }
    
    private long? _troopKillScore;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"troopKillScore", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long troopKillScore
    {
      get { return _troopKillScore?? default(long); }
      set { _troopKillScore = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool troopKillScoreSpecified
    {
      get { return this._troopKillScore != null; }
      set { if (value == (this._troopKillScore== null)) this._troopKillScore = value ? this.troopKillScore : (long?)null; }
    }
    private bool ShouldSerializetroopKillScore() { return troopKillScoreSpecified; }
    private void ResettroopKillScore() { troopKillScoreSpecified = false; }
    
    private int? _wonders;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"wonders", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int wonders
    {
      get { return _wonders?? default(int); }
      set { _wonders = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool wondersSpecified
    {
      get { return this._wonders != null; }
      set { if (value == (this._wonders== null)) this._wonders = value ? this.wonders : (int?)null; }
    }
    private bool ShouldSerializewonders() { return wondersSpecified; }
    private void Resetwonders() { wondersSpecified = false; }
    
    private int? _wonderTime;
    [global::ProtoBuf.ProtoMember(6, IsRequired = false, Name=@"wonderTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int wonderTime
    {
      get { return _wonderTime?? default(int); }
      set { _wonderTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool wonderTimeSpecified
    {
      get { return this._wonderTime != null; }
      set { if (value == (this._wonderTime== null)) this._wonderTime = value ? this.wonderTime : (int?)null; }
    }
    private bool ShouldSerializewonderTime() { return wonderTimeSpecified; }
    private void ResetwonderTime() { wonderTimeSpecified = false; }
    
    private int? _superWonders;
    [global::ProtoBuf.ProtoMember(7, IsRequired = false, Name=@"superWonders", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int superWonders
    {
      get { return _superWonders?? default(int); }
      set { _superWonders = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool superWondersSpecified
    {
      get { return this._superWonders != null; }
      set { if (value == (this._superWonders== null)) this._superWonders = value ? this.superWonders : (int?)null; }
    }
    private bool ShouldSerializesuperWonders() { return superWondersSpecified; }
    private void ResetsuperWonders() { superWondersSpecified = false; }
    
    private int? _superWonderTime;
    [global::ProtoBuf.ProtoMember(8, IsRequired = false, Name=@"superWonderTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int superWonderTime
    {
      get { return _superWonderTime?? default(int); }
      set { _superWonderTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool superWonderTimeSpecified
    {
      get { return this._superWonderTime != null; }
      set { if (value == (this._superWonderTime== null)) this._superWonderTime = value ? this.superWonderTime : (int?)null; }
    }
    private bool ShouldSerializesuperWonderTime() { return superWonderTimeSpecified; }
    private void ResetsuperWonderTime() { superWonderTimeSpecified = false; }
    
    private long? _troopKills;
    [global::ProtoBuf.ProtoMember(9, IsRequired = false, Name=@"troopKills", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long troopKills
    {
      get { return _troopKills?? default(long); }
      set { _troopKills = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool troopKillsSpecified
    {
      get { return this._troopKills != null; }
      set { if (value == (this._troopKills== null)) this._troopKills = value ? this.troopKills : (long?)null; }
    }
    private bool ShouldSerializetroopKills() { return troopKillsSpecified; }
    private void ResettroopKills() { troopKillsSpecified = false; }
    
    private int? _buffTiles;
    [global::ProtoBuf.ProtoMember(10, IsRequired = false, Name=@"buffTiles", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int buffTiles
    {
      get { return _buffTiles?? default(int); }
      set { _buffTiles = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool buffTilesSpecified
    {
      get { return this._buffTiles != null; }
      set { if (value == (this._buffTiles== null)) this._buffTiles = value ? this.buffTiles : (int?)null; }
    }
    private bool ShouldSerializebuffTiles() { return buffTilesSpecified; }
    private void ResetbuffTiles() { buffTilesSpecified = false; }
    
    private int? _serverId;
    [global::ProtoBuf.ProtoMember(11, IsRequired = false, Name=@"serverId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int serverId
    {
      get { return _serverId?? default(int); }
      set { _serverId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool serverIdSpecified
    {
      get { return this._serverId != null; }
      set { if (value == (this._serverId== null)) this._serverId = value ? this.serverId : (int?)null; }
    }
    private bool ShouldSerializeserverId() { return serverIdSpecified; }
    private void ResetserverId() { serverIdSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}