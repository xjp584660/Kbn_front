//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgReqProcessHeroExplore.proto
namespace PBMsgReqProcessHeroExplore
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgReqProcessHeroExplore")]
  public partial class PBMsgReqProcessHeroExplore : global::ProtoBuf.IExtensible
  {
    public PBMsgReqProcessHeroExplore() {}
    
    private long _hid;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"hid", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long hid
    {
      get { return _hid; }
      set { _hid = value; }
    }
    private long _eid;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"eid", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long eid
    {
      get { return _eid; }
      set { _eid = value; }
    }
    private int _itemId;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"itemId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemId
    {
      get { return _itemId; }
      set { _itemId = value; }
    }
    private int _gems;
    [global::ProtoBuf.ProtoMember(4, IsRequired = true, Name=@"gems", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int gems
    {
      get { return _gems; }
      set { _gems = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}