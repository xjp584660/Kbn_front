//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAVATileMarchLineList.proto
namespace PBMsgAVATileMarchLineList
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAVATileMarchLineList")]
  public partial class PBMsgAVATileMarchLineList : global::ProtoBuf.IExtensible
  {
    public PBMsgAVATileMarchLineList() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgAVATileMarchLineList.MarchLineInfo> _marchLineList = new global::System.Collections.Generic.List<PBMsgAVATileMarchLineList.MarchLineInfo>();
    [global::ProtoBuf.ProtoMember(1, Name=@"marchLineList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgAVATileMarchLineList.MarchLineInfo> marchLineList
    {
      get { return _marchLineList; }
    }
  
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"MarchLineInfo")]
  public partial class MarchLineInfo : global::ProtoBuf.IExtensible
  {
    public MarchLineInfo() {}
    
    private int? _marchId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"marchId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int marchId
    {
      get { return _marchId?? default(int); }
      set { _marchId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool marchIdSpecified
    {
      get { return this._marchId != null; }
      set { if (value == (this._marchId== null)) this._marchId = value ? this.marchId : (int?)null; }
    }
    private bool ShouldSerializemarchId() { return marchIdSpecified; }
    private void ResetmarchId() { marchIdSpecified = false; }
    
    private int? _fromXCoord;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"fromXCoord", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int fromXCoord
    {
      get { return _fromXCoord?? default(int); }
      set { _fromXCoord = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromXCoordSpecified
    {
      get { return this._fromXCoord != null; }
      set { if (value == (this._fromXCoord== null)) this._fromXCoord = value ? this.fromXCoord : (int?)null; }
    }
    private bool ShouldSerializefromXCoord() { return fromXCoordSpecified; }
    private void ResetfromXCoord() { fromXCoordSpecified = false; }
    
    private int? _fromYCoord;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"fromYCoord", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int fromYCoord
    {
      get { return _fromYCoord?? default(int); }
      set { _fromYCoord = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromYCoordSpecified
    {
      get { return this._fromYCoord != null; }
      set { if (value == (this._fromYCoord== null)) this._fromYCoord = value ? this.fromYCoord : (int?)null; }
    }
    private bool ShouldSerializefromYCoord() { return fromYCoordSpecified; }
    private void ResetfromYCoord() { fromYCoordSpecified = false; }
    
    private int? _toXCoord;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"toXCoord", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toXCoord
    {
      get { return _toXCoord?? default(int); }
      set { _toXCoord = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toXCoordSpecified
    {
      get { return this._toXCoord != null; }
      set { if (value == (this._toXCoord== null)) this._toXCoord = value ? this.toXCoord : (int?)null; }
    }
    private bool ShouldSerializetoXCoord() { return toXCoordSpecified; }
    private void ResettoXCoord() { toXCoordSpecified = false; }
    
    private int? _toYCoord;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"toYCoord", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toYCoord
    {
      get { return _toYCoord?? default(int); }
      set { _toYCoord = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toYCoordSpecified
    {
      get { return this._toYCoord != null; }
      set { if (value == (this._toYCoord== null)) this._toYCoord = value ? this.toYCoord : (int?)null; }
    }
    private bool ShouldSerializetoYCoord() { return toYCoordSpecified; }
    private void ResettoYCoord() { toYCoordSpecified = false; }
    
    private int? _startTime;
    [global::ProtoBuf.ProtoMember(6, IsRequired = false, Name=@"startTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int startTime
    {
      get { return _startTime?? default(int); }
      set { _startTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool startTimeSpecified
    {
      get { return this._startTime != null; }
      set { if (value == (this._startTime== null)) this._startTime = value ? this.startTime : (int?)null; }
    }
    private bool ShouldSerializestartTime() { return startTimeSpecified; }
    private void ResetstartTime() { startTimeSpecified = false; }
    
    private int? _endTime;
    [global::ProtoBuf.ProtoMember(7, IsRequired = false, Name=@"endTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int endTime
    {
      get { return _endTime?? default(int); }
      set { _endTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool endTimeSpecified
    {
      get { return this._endTime != null; }
      set { if (value == (this._endTime== null)) this._endTime = value ? this.endTime : (int?)null; }
    }
    private bool ShouldSerializeendTime() { return endTimeSpecified; }
    private void ResetendTime() { endTimeSpecified = false; }
    
    private int? _isWin;
    [global::ProtoBuf.ProtoMember(8, IsRequired = false, Name=@"isWin", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int isWin
    {
      get { return _isWin?? default(int); }
      set { _isWin = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool isWinSpecified
    {
      get { return this._isWin != null; }
      set { if (value == (this._isWin== null)) this._isWin = value ? this.isWin : (int?)null; }
    }
    private bool ShouldSerializeisWin() { return isWinSpecified; }
    private void ResetisWin() { isWinSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}