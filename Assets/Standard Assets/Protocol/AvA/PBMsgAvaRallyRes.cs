//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAvaRallyRes.proto
namespace PBMsgAvaRallyRes
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAvaRallyRes")]
  public partial class PBMsgAvaRallyRes : global::ProtoBuf.IExtensible
  {
    public PBMsgAvaRallyRes() {}
    
    private int? _rallyTime;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"rallyTime", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int rallyTime
    {
      get { return _rallyTime?? default(int); }
      set { _rallyTime = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool rallyTimeSpecified
    {
      get { return this._rallyTime != null; }
      set { if (value == (this._rallyTime== null)) this._rallyTime = value ? this.rallyTime : (int?)null; }
    }
    private bool ShouldSerializerallyTime() { return rallyTimeSpecified; }
    private void ResetrallyTime() { rallyTimeSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}