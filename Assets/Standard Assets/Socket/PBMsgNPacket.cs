//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgNPacket.proto
namespace PBMsgNPacket
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgNPacket")]
  public partial class PBMsgNPacket : global::IPacket
  {
    public PBMsgNPacket() {}
    
    private int? _Opcode;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"Opcode", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int Opcode
    {
      get { return _Opcode?? default(int); }
      set { _Opcode = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool OpcodeSpecified
    {
      get { return this._Opcode != null; }
      set { if (value == (this._Opcode== null)) this._Opcode = value ? this.Opcode : (int?)null; }
    }
    private bool ShouldSerializeOpcode() { return OpcodeSpecified; }
    private void ResetOpcode() { OpcodeSpecified = false; }
    
    private byte[] _Data;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"Data", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public byte[] Data
    {
      get { return _Data?? null; }
      set { _Data = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool DataSpecified
    {
      get { return this._Data != null; }
      set { if (value == (this._Data== null)) this._Data = value ? this.Data : (byte[])null; }
    }
    private bool ShouldSerializeData() { return DataSpecified; }
    private void ResetData() { DataSpecified = false; }
    
    private int? _source;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"source", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int source
    {
      get { return _source?? default(int); }
      set { _source = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool sourceSpecified
    {
      get { return this._source != null; }
      set { if (value == (this._source== null)) this._source = value ? this.source : (int?)null; }
    }
    private bool ShouldSerializesource() { return sourceSpecified; }
    private void Resetsource() { sourceSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}