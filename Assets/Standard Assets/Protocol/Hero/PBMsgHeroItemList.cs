//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgHeroItemList.proto
namespace PBMsgHeroItemList
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgHeroItemList")]
  public partial class PBMsgHeroItemList : global::ProtoBuf.IExtensible
  {
    public PBMsgHeroItemList() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgHeroItemList.PBMsgHeroItem> _heroItem = new global::System.Collections.Generic.List<PBMsgHeroItemList.PBMsgHeroItem>();
    [global::ProtoBuf.ProtoMember(1, Name=@"heroItem", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgHeroItemList.PBMsgHeroItem> heroItem
    {
      get { return _heroItem; }
    }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgHeroItem")]
  public partial class PBMsgHeroItem : global::ProtoBuf.IExtensible
  {
    public PBMsgHeroItem() {}
    
    private int _itemId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"itemId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemId
    {
      get { return _itemId; }
      set { _itemId = value; }
    }
    private int _addRenown;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"addRenown", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int addRenown
    {
      get { return _addRenown; }
      set { _addRenown = value; }
    }
    private int _own;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"own", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int own
    {
      get { return _own; }
      set { _own = value; }
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