//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAvaSpeedUp.proto
namespace PBMsgAvaSpeedUp
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAvaSpeedUp")]
  public partial class PBMsgAvaSpeedUp : global::ProtoBuf.IExtensible
  {
    public PBMsgAvaSpeedUp() {}
    
    private int _type;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"type", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int type
    {
      get { return _type; }
      set { _type = value; }
    }
    private int _itemId;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"itemId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemId
    {
      get { return _itemId; }
      set { _itemId = value; }
    }
    private int _itemCount;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"itemCount", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemCount
    {
      get { return _itemCount; }
      set { _itemCount = value; }
    }
    private PBMsgAvaSpeedUp.MarchInfo _marchInfo = null;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"marchInfo", DataFormat = global::ProtoBuf.DataFormat.Default)]
    [global::System.ComponentModel.DefaultValue(null)]
    public PBMsgAvaSpeedUp.MarchInfo marchInfo
    {
      get { return _marchInfo; }
      set { _marchInfo = value; }
    }
    private PBMsgAvaSpeedUp.HeroInfo _heroInfo = null;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"heroInfo", DataFormat = global::ProtoBuf.DataFormat.Default)]
    [global::System.ComponentModel.DefaultValue(null)]
    public PBMsgAvaSpeedUp.HeroInfo heroInfo
    {
      get { return _heroInfo; }
      set { _heroInfo = value; }
    }
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"MarchInfo")]
  public partial class MarchInfo : global::ProtoBuf.IExtensible
  {
    public MarchInfo() {}
    
    private int _marchId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"marchId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int marchId
    {
      get { return _marchId; }
      set { _marchId = value; }
    }
    private int _endTime;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"endTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int endTime
    {
      get { return _endTime; }
      set { _endTime = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"HeroInfo")]
  public partial class HeroInfo : global::ProtoBuf.IExtensible
  {
    public HeroInfo() {}
    
    private int _userHeroId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"userHeroId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int userHeroId
    {
      get { return _userHeroId; }
      set { _userHeroId = value; }
    }
    private int _heroId;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"heroId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int heroId
    {
      get { return _heroId; }
      set { _heroId = value; }
    }
    private int _sleepEndTime;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"sleepEndTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int sleepEndTime
    {
      get { return _sleepEndTime; }
      set { _sleepEndTime = value; }
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