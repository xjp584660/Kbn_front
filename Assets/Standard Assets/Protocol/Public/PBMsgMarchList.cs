//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgMarchList.proto
namespace PBMsgMarchList
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgMarchList")]
  public partial class PBMsgMarchList : global::ProtoBuf.IExtensible
  {
    public PBMsgMarchList() {}
    
    private readonly global::System.Collections.Generic.List<byte[]> _marchList = new global::System.Collections.Generic.List<byte[]>();
    [global::ProtoBuf.ProtoMember(1, Name=@"marchList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<byte[]> marchList
    {
      get { return _marchList; }
    }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}