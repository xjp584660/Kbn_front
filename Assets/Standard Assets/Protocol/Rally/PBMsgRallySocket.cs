//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgRallySocket.proto
namespace PBMsgRallySocket
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgRallySocket")]
  public partial class PBMsgRallySocket : global::ProtoBuf.IExtensible
  {
    public PBMsgRallySocket() {}
    
    private int? _rallyId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"rallyId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int rallyId
    {
      get { return _rallyId?? default(int); }
      set { _rallyId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool rallyIdSpecified
    {
      get { return this._rallyId != null; }
      set { if (value == (this._rallyId== null)) this._rallyId = value ? this.rallyId : (int?)null; }
    }
    private bool ShouldSerializerallyId() { return rallyIdSpecified; }
    private void ResetrallyId() { rallyIdSpecified = false; }
    
    private int? _fromUserId;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"fromUserId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int fromUserId
    {
      get { return _fromUserId?? default(int); }
      set { _fromUserId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromUserIdSpecified
    {
      get { return this._fromUserId != null; }
      set { if (value == (this._fromUserId== null)) this._fromUserId = value ? this.fromUserId : (int?)null; }
    }
    private bool ShouldSerializefromUserId() { return fromUserIdSpecified; }
    private void ResetfromUserId() { fromUserIdSpecified = false; }
    
    private int? _fromAllianceId;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"fromAllianceId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int fromAllianceId
    {
      get { return _fromAllianceId?? default(int); }
      set { _fromAllianceId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromAllianceIdSpecified
    {
      get { return this._fromAllianceId != null; }
      set { if (value == (this._fromAllianceId== null)) this._fromAllianceId = value ? this.fromAllianceId : (int?)null; }
    }
    private bool ShouldSerializefromAllianceId() { return fromAllianceIdSpecified; }
    private void ResetfromAllianceId() { fromAllianceIdSpecified = false; }
    
    private string _fromName;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"fromName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string fromName
    {
      get { return _fromName?? ""; }
      set { _fromName = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromNameSpecified
    {
      get { return this._fromName != null; }
      set { if (value == (this._fromName== null)) this._fromName = value ? this.fromName : (string)null; }
    }
    private bool ShouldSerializefromName() { return fromNameSpecified; }
    private void ResetfromName() { fromNameSpecified = false; }
    
    private string _fromUserPhoto;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"fromUserPhoto", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string fromUserPhoto
    {
      get { return _fromUserPhoto?? ""; }
      set { _fromUserPhoto = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromUserPhotoSpecified
    {
      get { return this._fromUserPhoto != null; }
      set { if (value == (this._fromUserPhoto== null)) this._fromUserPhoto = value ? this.fromUserPhoto : (string)null; }
    }
    private bool ShouldSerializefromUserPhoto() { return fromUserPhotoSpecified; }
    private void ResetfromUserPhoto() { fromUserPhotoSpecified = false; }
    
    private int? _fromX;
    [global::ProtoBuf.ProtoMember(6, IsRequired = false, Name=@"fromX", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int fromX
    {
      get { return _fromX?? default(int); }
      set { _fromX = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromXSpecified
    {
      get { return this._fromX != null; }
      set { if (value == (this._fromX== null)) this._fromX = value ? this.fromX : (int?)null; }
    }
    private bool ShouldSerializefromX() { return fromXSpecified; }
    private void ResetfromX() { fromXSpecified = false; }
    
    private int? _fromY;
    [global::ProtoBuf.ProtoMember(7, IsRequired = false, Name=@"fromY", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int fromY
    {
      get { return _fromY?? default(int); }
      set { _fromY = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool fromYSpecified
    {
      get { return this._fromY != null; }
      set { if (value == (this._fromY== null)) this._fromY = value ? this.fromY : (int?)null; }
    }
    private bool ShouldSerializefromY() { return fromYSpecified; }
    private void ResetfromY() { fromYSpecified = false; }
    
    private int? _toUserId;
    [global::ProtoBuf.ProtoMember(8, IsRequired = false, Name=@"toUserId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toUserId
    {
      get { return _toUserId?? default(int); }
      set { _toUserId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toUserIdSpecified
    {
      get { return this._toUserId != null; }
      set { if (value == (this._toUserId== null)) this._toUserId = value ? this.toUserId : (int?)null; }
    }
    private bool ShouldSerializetoUserId() { return toUserIdSpecified; }
    private void ResettoUserId() { toUserIdSpecified = false; }
    
    private int? _toAllianceId;
    [global::ProtoBuf.ProtoMember(9, IsRequired = false, Name=@"toAllianceId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toAllianceId
    {
      get { return _toAllianceId?? default(int); }
      set { _toAllianceId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toAllianceIdSpecified
    {
      get { return this._toAllianceId != null; }
      set { if (value == (this._toAllianceId== null)) this._toAllianceId = value ? this.toAllianceId : (int?)null; }
    }
    private bool ShouldSerializetoAllianceId() { return toAllianceIdSpecified; }
    private void ResettoAllianceId() { toAllianceIdSpecified = false; }
    
    private string _toName;
    [global::ProtoBuf.ProtoMember(10, IsRequired = false, Name=@"toName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string toName
    {
      get { return _toName?? ""; }
      set { _toName = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toNameSpecified
    {
      get { return this._toName != null; }
      set { if (value == (this._toName== null)) this._toName = value ? this.toName : (string)null; }
    }
    private bool ShouldSerializetoName() { return toNameSpecified; }
    private void ResettoName() { toNameSpecified = false; }
    
    private int? _toX;
    [global::ProtoBuf.ProtoMember(11, IsRequired = false, Name=@"toX", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toX
    {
      get { return _toX?? default(int); }
      set { _toX = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toXSpecified
    {
      get { return this._toX != null; }
      set { if (value == (this._toX== null)) this._toX = value ? this.toX : (int?)null; }
    }
    private bool ShouldSerializetoX() { return toXSpecified; }
    private void ResettoX() { toXSpecified = false; }
    
    private int? _toY;
    [global::ProtoBuf.ProtoMember(12, IsRequired = false, Name=@"toY", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int toY
    {
      get { return _toY?? default(int); }
      set { _toY = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool toYSpecified
    {
      get { return this._toY != null; }
      set { if (value == (this._toY== null)) this._toY = value ? this.toY : (int?)null; }
    }
    private bool ShouldSerializetoY() { return toYSpecified; }
    private void ResettoY() { toYSpecified = false; }
    
    private int? _rallyStatus;
    [global::ProtoBuf.ProtoMember(13, IsRequired = false, Name=@"rallyStatus", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int rallyStatus
    {
      get { return _rallyStatus?? default(int); }
      set { _rallyStatus = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool rallyStatusSpecified
    {
      get { return this._rallyStatus != null; }
      set { if (value == (this._rallyStatus== null)) this._rallyStatus = value ? this.rallyStatus : (int?)null; }
    }
    private bool ShouldSerializerallyStatus() { return rallyStatusSpecified; }
    private void ResetrallyStatus() { rallyStatusSpecified = false; }
    
    private int? _startTimeStamp;
    [global::ProtoBuf.ProtoMember(14, IsRequired = false, Name=@"startTimeStamp", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int startTimeStamp
    {
      get { return _startTimeStamp?? default(int); }
      set { _startTimeStamp = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool startTimeStampSpecified
    {
      get { return this._startTimeStamp != null; }
      set { if (value == (this._startTimeStamp== null)) this._startTimeStamp = value ? this.startTimeStamp : (int?)null; }
    }
    private bool ShouldSerializestartTimeStamp() { return startTimeStampSpecified; }
    private void ResetstartTimeStamp() { startTimeStampSpecified = false; }
    
    private int? _endTimeStamp;
    [global::ProtoBuf.ProtoMember(15, IsRequired = false, Name=@"endTimeStamp", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int endTimeStamp
    {
      get { return _endTimeStamp?? default(int); }
      set { _endTimeStamp = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool endTimeStampSpecified
    {
      get { return this._endTimeStamp != null; }
      set { if (value == (this._endTimeStamp== null)) this._endTimeStamp = value ? this.endTimeStamp : (int?)null; }
    }
    private bool ShouldSerializeendTimeStamp() { return endTimeStampSpecified; }
    private void ResetendTimeStamp() { endTimeStampSpecified = false; }
    
    private int? _maxCount;
    [global::ProtoBuf.ProtoMember(16, IsRequired = false, Name=@"maxCount", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int maxCount
    {
      get { return _maxCount?? default(int); }
      set { _maxCount = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool maxCountSpecified
    {
      get { return this._maxCount != null; }
      set { if (value == (this._maxCount== null)) this._maxCount = value ? this.maxCount : (int?)null; }
    }
    private bool ShouldSerializemaxCount() { return maxCountSpecified; }
    private void ResetmaxCount() { maxCountSpecified = false; }
    
    private int? _curCount;
    [global::ProtoBuf.ProtoMember(17, IsRequired = false, Name=@"curCount", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int curCount
    {
      get { return _curCount?? default(int); }
      set { _curCount = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool curCountSpecified
    {
      get { return this._curCount != null; }
      set { if (value == (this._curCount== null)) this._curCount = value ? this.curCount : (int?)null; }
    }
    private bool ShouldSerializecurCount() { return curCountSpecified; }
    private void ResetcurCount() { curCountSpecified = false; }
    
    private int? _maxSize;
    [global::ProtoBuf.ProtoMember(18, IsRequired = false, Name=@"maxSize", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int maxSize
    {
      get { return _maxSize?? default(int); }
      set { _maxSize = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool maxSizeSpecified
    {
      get { return this._maxSize != null; }
      set { if (value == (this._maxSize== null)) this._maxSize = value ? this.maxSize : (int?)null; }
    }
    private bool ShouldSerializemaxSize() { return maxSizeSpecified; }
    private void ResetmaxSize() { maxSizeSpecified = false; }
    
    private int? _curSize;
    [global::ProtoBuf.ProtoMember(19, IsRequired = false, Name=@"curSize", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int curSize
    {
      get { return _curSize?? default(int); }
      set { _curSize = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool curSizeSpecified
    {
      get { return this._curSize != null; }
      set { if (value == (this._curSize== null)) this._curSize = value ? this.curSize : (int?)null; }
    }
    private bool ShouldSerializecurSize() { return curSizeSpecified; }
    private void ResetcurSize() { curSizeSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}