//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgResGate.proto
namespace PBMsgResGate
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgResGate")]
  public partial class PBMsgResGate : global::ProtoBuf.IExtensible
  {
    public PBMsgResGate() {}
    
    private long _reqmicrotime;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"reqmicrotime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long reqmicrotime
    {
      get { return _reqmicrotime; }
      set { _reqmicrotime = value; }
    }
    private long _resmicrotime;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"resmicrotime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long resmicrotime
    {
      get { return _resmicrotime; }
      set { _resmicrotime = value; }
    }
    private long _gateCoolTime;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"gateCoolTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long gateCoolTime
    {
      get { return _gateCoolTime; }
      set { _gateCoolTime = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}