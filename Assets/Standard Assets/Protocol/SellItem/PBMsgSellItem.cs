//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgSellItem.proto
namespace PBMsgSellItem
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgSellItem")]
  public partial class PBMsgSellItem : global::ProtoBuf.IExtensible
  {
    public PBMsgSellItem() {}
    
    private int _itemId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"itemId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemId
    {
      get { return _itemId; }
      set { _itemId = value; }
    }
    private int _itemNum;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"itemNum", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemNum
    {
      get { return _itemNum; }
      set { _itemNum = value; }
    }
    private int _totalGold;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"totalGold", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int totalGold
    {
      get { return _totalGold; }
      set { _totalGold = value; }
    }
    private int _cityId;
    [global::ProtoBuf.ProtoMember(4, IsRequired = true, Name=@"cityId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int cityId
    {
      get { return _cityId; }
      set { _cityId = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}