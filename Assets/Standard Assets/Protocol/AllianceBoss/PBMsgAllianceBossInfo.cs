//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAllianceBossInfo.proto
namespace PBMsgAllianceBossInfo
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAllianceBossInfo")]
  public partial class PBMsgAllianceBossInfo : global::ProtoBuf.IExtensible
  {
    public PBMsgAllianceBossInfo() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgAllianceBossInfo.PBMsgLayerInfo> _layerList = new global::System.Collections.Generic.List<PBMsgAllianceBossInfo.PBMsgLayerInfo>();
    [global::ProtoBuf.ProtoMember(1, Name=@"layerList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgAllianceBossInfo.PBMsgLayerInfo> layerList
    {
      get { return _layerList; }
    }
  
    private int? _curLayer;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"curLayer", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int curLayer
    {
      get { return _curLayer?? default(int); }
      set { _curLayer = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool curLayerSpecified
    {
      get { return this._curLayer != null; }
      set { if (value == (this._curLayer== null)) this._curLayer = value ? this.curLayer : (int?)null; }
    }
    private bool ShouldSerializecurLayer() { return curLayerSpecified; }
    private void ResetcurLayer() { curLayerSpecified = false; }
    
    private int? _curLevelId;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"curLevelId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int curLevelId
    {
      get { return _curLevelId?? default(int); }
      set { _curLevelId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool curLevelIdSpecified
    {
      get { return this._curLevelId != null; }
      set { if (value == (this._curLevelId== null)) this._curLevelId = value ? this.curLevelId : (int?)null; }
    }
    private bool ShouldSerializecurLevelId() { return curLevelIdSpecified; }
    private void ResetcurLevelId() { curLevelIdSpecified = false; }
    
    private long? _disappearTime;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"disappearTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long disappearTime
    {
      get { return _disappearTime?? default(long); }
      set { _disappearTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool disappearTimeSpecified
    {
      get { return this._disappearTime != null; }
      set { if (value == (this._disappearTime== null)) this._disappearTime = value ? this.disappearTime : (long?)null; }
    }
    private bool ShouldSerializedisappearTime() { return disappearTimeSpecified; }
    private void ResetdisappearTime() { disappearTimeSpecified = false; }
    
    private int? _leftAttackNum;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"leftAttackNum", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int leftAttackNum
    {
      get { return _leftAttackNum?? default(int); }
      set { _leftAttackNum = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool leftAttackNumSpecified
    {
      get { return this._leftAttackNum != null; }
      set { if (value == (this._leftAttackNum== null)) this._leftAttackNum = value ? this.leftAttackNum : (int?)null; }
    }
    private bool ShouldSerializeleftAttackNum() { return leftAttackNumSpecified; }
    private void ResetleftAttackNum() { leftAttackNumSpecified = false; }
    
    private int? _buff;
    [global::ProtoBuf.ProtoMember(6, IsRequired = false, Name=@"buff", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int buff
    {
      get { return _buff?? default(int); }
      set { _buff = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool buffSpecified
    {
      get { return this._buff != null; }
      set { if (value == (this._buff== null)) this._buff = value ? this.buff : (int?)null; }
    }
    private bool ShouldSerializebuff() { return buffSpecified; }
    private void Resetbuff() { buffSpecified = false; }
    
    private long? _totalBossHp;
    [global::ProtoBuf.ProtoMember(7, IsRequired = false, Name=@"totalBossHp", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long totalBossHp
    {
      get { return _totalBossHp?? default(long); }
      set { _totalBossHp = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool totalBossHpSpecified
    {
      get { return this._totalBossHp != null; }
      set { if (value == (this._totalBossHp== null)) this._totalBossHp = value ? this.totalBossHp : (long?)null; }
    }
    private bool ShouldSerializetotalBossHp() { return totalBossHpSpecified; }
    private void ResettotalBossHp() { totalBossHpSpecified = false; }
    
    private long? _curBossHp;
    [global::ProtoBuf.ProtoMember(8, IsRequired = false, Name=@"curBossHp", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long curBossHp
    {
      get { return _curBossHp?? default(long); }
      set { _curBossHp = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool curBossHpSpecified
    {
      get { return this._curBossHp != null; }
      set { if (value == (this._curBossHp== null)) this._curBossHp = value ? this.curBossHp : (long?)null; }
    }
    private bool ShouldSerializecurBossHp() { return curBossHpSpecified; }
    private void ResetcurBossHp() { curBossHpSpecified = false; }
    
    private int? _damageRank;
    [global::ProtoBuf.ProtoMember(9, IsRequired = false, Name=@"damageRank", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
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
    
    private int? _joinPlayerNum;
    [global::ProtoBuf.ProtoMember(10, IsRequired = false, Name=@"joinPlayerNum", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int joinPlayerNum
    {
      get { return _joinPlayerNum?? default(int); }
      set { _joinPlayerNum = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool joinPlayerNumSpecified
    {
      get { return this._joinPlayerNum != null; }
      set { if (value == (this._joinPlayerNum== null)) this._joinPlayerNum = value ? this.joinPlayerNum : (int?)null; }
    }
    private bool ShouldSerializejoinPlayerNum() { return joinPlayerNumSpecified; }
    private void ResetjoinPlayerNum() { joinPlayerNumSpecified = false; }
    
    private int? _hasReward;
    [global::ProtoBuf.ProtoMember(11, IsRequired = false, Name=@"hasReward", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int hasReward
    {
      get { return _hasReward?? default(int); }
      set { _hasReward = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool hasRewardSpecified
    {
      get { return this._hasReward != null; }
      set { if (value == (this._hasReward== null)) this._hasReward = value ? this.hasReward : (int?)null; }
    }
    private bool ShouldSerializehasReward() { return hasRewardSpecified; }
    private void ResethasReward() { hasRewardSpecified = false; }
    
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgLayerInfo")]
  public partial class PBMsgLayerInfo : global::ProtoBuf.IExtensible
  {
    public PBMsgLayerInfo() {}
    
    private readonly global::System.Collections.Generic.List<int> _levelList = new global::System.Collections.Generic.List<int>();
    [global::ProtoBuf.ProtoMember(1, Name=@"levelList", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public global::System.Collections.Generic.List<int> levelList
    {
      get { return _levelList; }
    }
  
    private int? _layer;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"layer", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int layer
    {
      get { return _layer?? default(int); }
      set { _layer = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool layerSpecified
    {
      get { return this._layer != null; }
      set { if (value == (this._layer== null)) this._layer = value ? this.layer : (int?)null; }
    }
    private bool ShouldSerializelayer() { return layerSpecified; }
    private void Resetlayer() { layerSpecified = false; }
    
    private int? _factor;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"factor", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int factor
    {
      get { return _factor?? default(int); }
      set { _factor = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool factorSpecified
    {
      get { return this._factor != null; }
      set { if (value == (this._factor== null)) this._factor = value ? this.factor : (int?)null; }
    }
    private bool ShouldSerializefactor() { return factorSpecified; }
    private void Resetfactor() { factorSpecified = false; }
    
    private readonly global::System.Collections.Generic.List<string> _leaveMsg = new global::System.Collections.Generic.List<string>();
    [global::ProtoBuf.ProtoMember(4, Name=@"leaveMsg", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<string> leaveMsg
    {
      get { return _leaveMsg; }
    }
  
    private readonly global::System.Collections.Generic.List<string> _avatar = new global::System.Collections.Generic.List<string>();
    [global::ProtoBuf.ProtoMember(5, Name=@"avatar", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<string> avatar
    {
      get { return _avatar; }
    }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}