//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgMergeServer.proto
namespace PBMsgMergeServer
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"FromServerMsg")]
  public partial class FromServerMsg : global::ProtoBuf.IExtensible
  {
    public FromServerMsg() {}
    
    private int _serverId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"serverId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int serverId
    {
      get { return _serverId; }
      set { _serverId = value; }
    }
    private string _serverName;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"serverName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string serverName
    {
      get { return _serverName; }
      set { _serverName = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"MergeServerUnit")]
  public partial class MergeServerUnit : global::ProtoBuf.IExtensible
  {
    public MergeServerUnit() {}
    
    private readonly global::System.Collections.Generic.List<FromServerMsg> _fromServerMsgList = new global::System.Collections.Generic.List<FromServerMsg>();
    [global::ProtoBuf.ProtoMember(1, Name=@"fromServerMsgList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<FromServerMsg> fromServerMsgList
    {
      get { return _fromServerMsgList; }
    }
  
    private string _toServerName;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"toServerName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string toServerName
    {
      get { return _toServerName; }
      set { _toServerName = value; }
    }
    private long _startTime;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"startTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long startTime
    {
      get { return _startTime; }
      set { _startTime = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgMergeServerList")]
  public partial class PBMsgMergeServerList : global::ProtoBuf.IExtensible
  {
    public PBMsgMergeServerList() {}
    
    private readonly global::System.Collections.Generic.List<MergeServerUnit> _serverList = new global::System.Collections.Generic.List<MergeServerUnit>();
    [global::ProtoBuf.ProtoMember(1, Name=@"serverList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<MergeServerUnit> serverList
    {
      get { return _serverList; }
    }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"FromServerDetail")]
  public partial class FromServerDetail : global::ProtoBuf.IExtensible
  {
    public FromServerDetail() {}
    
    private int _serverId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"serverId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int serverId
    {
      get { return _serverId; }
      set { _serverId = value; }
    }
    private string _serverName;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"serverName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string serverName
    {
      get { return _serverName; }
      set { _serverName = value; }
    }
    private long _might;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"might", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long might
    {
      get { return _might; }
      set { _might = value; }
    }
    private int _cityCount;
    [global::ProtoBuf.ProtoMember(4, IsRequired = true, Name=@"cityCount", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int cityCount
    {
      get { return _cityCount; }
      set { _cityCount = value; }
    }
    private int _returnGems;
    [global::ProtoBuf.ProtoMember(5, IsRequired = true, Name=@"returnGems", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int returnGems
    {
      get { return _returnGems; }
      set { _returnGems = value; }
    }
    private int _level;
    [global::ProtoBuf.ProtoMember(6, IsRequired = true, Name=@"level", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int level
    {
      get { return _level; }
      set { _level = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgMyMergeServerDetail")]
  public partial class PBMsgMyMergeServerDetail : global::ProtoBuf.IExtensible
  {
    public PBMsgMyMergeServerDetail() {}
    
    private readonly global::System.Collections.Generic.List<FromServerDetail> _fromServerDetailList = new global::System.Collections.Generic.List<FromServerDetail>();
    [global::ProtoBuf.ProtoMember(1, Name=@"fromServerDetailList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<FromServerDetail> fromServerDetailList
    {
      get { return _fromServerDetailList; }
    }
  
    private string _toServerName;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"toServerName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string toServerName
    {
      get { return _toServerName; }
      set { _toServerName = value; }
    }
    private int _toServerId;
    [global::ProtoBuf.ProtoMember(3, IsRequired = true, Name=@"toServerId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toServerId
    {
      get { return _toServerId; }
      set { _toServerId = value; }
    }
    private long _startTime;
    [global::ProtoBuf.ProtoMember(4, IsRequired = true, Name=@"startTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public long startTime
    {
      get { return _startTime; }
      set { _startTime = value; }
    }
    private int? _lastSaveServerId;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"lastSaveServerId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int lastSaveServerId
    {
      get { return _lastSaveServerId?? default(int); }
      set { _lastSaveServerId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool lastSaveServerIdSpecified
    {
      get { return this._lastSaveServerId != null; }
      set { if (value == (this._lastSaveServerId== null)) this._lastSaveServerId = value ? this.lastSaveServerId : (int?)null; }
    }
    private bool ShouldSerializelastSaveServerId() { return lastSaveServerIdSpecified; }
    private void ResetlastSaveServerId() { lastSaveServerIdSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgMergeServer")]
  public partial class PBMsgMergeServer : global::ProtoBuf.IExtensible
  {
    public PBMsgMergeServer() {}
    
    private PBMsgMergeServerList _mergerServerList = null;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"mergerServerList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    [global::System.ComponentModel.DefaultValue(null)]
    public PBMsgMergeServerList mergerServerList
    {
      get { return _mergerServerList; }
      set { _mergerServerList = value; }
    }
    private PBMsgMyMergeServerDetail _myMergeServerDetail = null;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"myMergeServerDetail", DataFormat = global::ProtoBuf.DataFormat.Default)]
    [global::System.ComponentModel.DefaultValue(null)]
    public PBMsgMyMergeServerDetail myMergeServerDetail
    {
      get { return _myMergeServerDetail; }
      set { _myMergeServerDetail = value; }
    }
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}