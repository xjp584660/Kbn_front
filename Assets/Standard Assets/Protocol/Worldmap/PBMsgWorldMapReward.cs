//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgWorldMapReward.proto
namespace PBMsgWorldMapReward
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgWorldMapReward")]
  public partial class PBMsgWorldMapReward : global::ProtoBuf.IExtensible
  {
    public PBMsgWorldMapReward() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgWorldMapReward.item> _itemInfo = new global::System.Collections.Generic.List<PBMsgWorldMapReward.item>();
    [global::ProtoBuf.ProtoMember(1, Name=@"itemInfo", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgWorldMapReward.item> itemInfo
    {
      get { return _itemInfo; }
    }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"item")]
  public partial class item : global::ProtoBuf.IExtensible
  {
    public item() {}
    
    private int? _itemId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"itemId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemId
    {
      get { return _itemId?? default(int); }
      set { _itemId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool itemIdSpecified
    {
      get { return this._itemId != null; }
      set { if (value == (this._itemId== null)) this._itemId = value ? this.itemId : (int?)null; }
    }
    private bool ShouldSerializeitemId() { return itemIdSpecified; }
    private void ResetitemId() { itemIdSpecified = false; }
    
    private int? _num;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"num", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int num
    {
      get { return _num?? default(int); }
      set { _num = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool numSpecified
    {
      get { return this._num != null; }
      set { if (value == (this._num== null)) this._num = value ? this.num : (int?)null; }
    }
    private bool ShouldSerializenum() { return numSpecified; }
    private void Resetnum() { numSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}