//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAvaAssignKnight.proto
namespace PBMsgAvaAssignKnight
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAvaAssignKnight")]
  public partial class PBMsgAvaAssignKnight : global::ProtoBuf.IExtensible
  {
    public PBMsgAvaAssignKnight() {}
    
    private int _knightId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"knightId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int knightId
    {
      get { return _knightId; }
      set { _knightId = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}