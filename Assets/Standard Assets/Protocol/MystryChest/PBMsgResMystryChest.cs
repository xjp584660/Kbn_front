//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgResMystryChest.proto
namespace PBData
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgResMystryChest")]
  public partial class PBMsgResMystryChest : global::ProtoBuf.IExtensible
  {
    public PBMsgResMystryChest() {}
    
    private long _version;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"version", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long version
    {
      get { return _version; }
      set { _version = value; }
    }
    private readonly global::System.Collections.Generic.List<PBMsgResMystryChest.ChestData> _data = new global::System.Collections.Generic.List<PBMsgResMystryChest.ChestData>();
    [global::ProtoBuf.ProtoMember(2, Name=@"data", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgResMystryChest.ChestData> data
    {
      get { return _data; }
    }
  
    private readonly global::System.Collections.Generic.List<PBMsgResMystryChest.LevelData> _ldata = new global::System.Collections.Generic.List<PBMsgResMystryChest.LevelData>();
    [global::ProtoBuf.ProtoMember(3, Name=@"ldata", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgResMystryChest.LevelData> ldata
    {
      get { return _ldata; }
    }
  
    private readonly global::System.Collections.Generic.List<int> _order = new global::System.Collections.Generic.List<int>();
    [global::ProtoBuf.ProtoMember(4, Name=@"order", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public global::System.Collections.Generic.List<int> order
    {
      get { return _order; }
    }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"ChestData")]
  public partial class ChestData : global::ProtoBuf.IExtensible
  {
    public ChestData() {}
    
    private int _id;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"id", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int id
    {
      get { return _id; }
      set { _id = value; }
    }
    private string _icon;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"icon", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string icon
    {
      get { return _icon; }
      set { _icon = value; }
    }
    private long _starttime;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"starttime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long starttime
    {
      get { return _starttime; }
      set { _starttime = value; }
    }
    private long _finishtime;
    [global::ProtoBuf.ProtoMember(4, IsRequired = true, Name=@"finishtime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long finishtime
    {
      get { return _finishtime; }
      set { _finishtime = value; }
    }
    private int _price;
    [global::ProtoBuf.ProtoMember(5, IsRequired = true, Name=@"price", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int price
    {
      get { return _price; }
      set { _price = value; }
    }
    private bool _forSale;
    [global::ProtoBuf.ProtoMember(6, IsRequired = true, Name=@"forSale", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public bool forSale
    {
      get { return _forSale; }
      set { _forSale = value; }
    }
    private long _discountStarttime;
    [global::ProtoBuf.ProtoMember(7, IsRequired = true, Name=@"discountStarttime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long discountStarttime
    {
      get { return _discountStarttime; }
      set { _discountStarttime = value; }
    }
    private long _discountFinishtime;
    [global::ProtoBuf.ProtoMember(8, IsRequired = true, Name=@"discountFinishtime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long discountFinishtime
    {
      get { return _discountFinishtime; }
      set { _discountFinishtime = value; }
    }
    private int _discountPrice;
    [global::ProtoBuf.ProtoMember(9, IsRequired = true, Name=@"discountPrice", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int discountPrice
    {
      get { return _discountPrice; }
      set { _discountPrice = value; }
    }
    private readonly global::System.Collections.Generic.List<int> _gearDrop = new global::System.Collections.Generic.List<int>();
    [global::ProtoBuf.ProtoMember(10, Name=@"gearDrop", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public global::System.Collections.Generic.List<int> gearDrop
    {
      get { return _gearDrop; }
    }
  
    private readonly global::System.Collections.Generic.List<int> _serverId = new global::System.Collections.Generic.List<int>();
    [global::ProtoBuf.ProtoMember(11, Name=@"serverId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public global::System.Collections.Generic.List<int> serverId
    {
      get { return _serverId; }
    }
  
    private int _isExchange;
    [global::ProtoBuf.ProtoMember(12, IsRequired = true, Name=@"isExchange", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int isExchange
    {
      get { return _isExchange; }
      set { _isExchange = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"LevelData")]
  public partial class LevelData : global::ProtoBuf.IExtensible
  {
    public LevelData() {}
    
    private int _id;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"id", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int id
    {
      get { return _id; }
      set { _id = value; }
    }
    private string _icon;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"icon", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string icon
    {
      get { return _icon; }
      set { _icon = value; }
    }
    private int _level;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"level", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int level
    {
      get { return _level; }
      set { _level = value; }
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