//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgVerifyPlayerStatus.proto
namespace PBMsgVerifyPlayerStatus
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgVerifyPlayerStatus")]
  public partial class PBMsgVerifyPlayerStatus : global::ProtoBuf.IExtensible
  {
    public PBMsgVerifyPlayerStatus() {}
    
    private int _status;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"status", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int status
    {
      get { return _status; }
      set { _status = value; }
    }
    private int? _x;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"x", DataFormat = global::ProtoBuf.DataFormat.ZigZag)]
    public int x
    {
      get { return _x?? default(int); }
      set { _x = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool xSpecified
    {
      get { return this._x != null; }
      set { if (value == (this._x== null)) this._x = value ? this.x : (int?)null; }
    }
    private bool ShouldSerializex() { return xSpecified; }
    private void Resetx() { xSpecified = false; }
    
    private int? _y;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"y", DataFormat = global::ProtoBuf.DataFormat.ZigZag)]
    public int y
    {
      get { return _y?? default(int); }
      set { _y = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool ySpecified
    {
      get { return this._y != null; }
      set { if (value == (this._y== null)) this._y = value ? this.y : (int?)null; }
    }
    private bool ShouldSerializey() { return ySpecified; }
    private void Resety() { ySpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}