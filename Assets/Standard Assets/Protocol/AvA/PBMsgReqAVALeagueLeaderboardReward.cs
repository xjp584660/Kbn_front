//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgReqAVALeagueLeaderboardReward.proto
namespace PBMsgReqAVALeagueLeaderboardReward
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgReqAVALeagueLeaderboardReward")]
  public partial class PBMsgReqAVALeagueLeaderboardReward : global::ProtoBuf.IExtensible
  {
    public PBMsgReqAVALeagueLeaderboardReward() {}
    
    private int? _act;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"act", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int act
    {
      get { return _act?? default(int); }
      set { _act = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool actSpecified
    {
      get { return this._act != null; }
      set { if (value == (this._act== null)) this._act = value ? this.act : (int?)null; }
    }
    private bool ShouldSerializeact() { return actSpecified; }
    private void Resetact() { actSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}