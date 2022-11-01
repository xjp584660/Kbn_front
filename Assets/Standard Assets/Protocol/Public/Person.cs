//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: Person.proto
namespace Person
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"Person")]
  public partial class Person : global::ProtoBuf.IExtensible
  {
    public Person() {}
    
    private string _name;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"name", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string name
    {
      get { return _name; }
      set { _name = value; }
    }
    private int _id;
    [global::ProtoBuf.ProtoMember(2, IsRequired = true, Name=@"id", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int id
    {
      get { return _id; }
      set { _id = value; }
    }
    private string _email;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"email", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string email
    {
      get { return _email?? ""; }
      set { _email = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool emailSpecified
    {
      get { return this._email != null; }
      set { if (value == (this._email== null)) this._email = value ? this.email : (string)null; }
    }
    private bool ShouldSerializeemail() { return emailSpecified; }
    private void Resetemail() { emailSpecified = false; }
    
    private readonly global::System.Collections.Generic.List<Person.PhoneNumber> _phone = new global::System.Collections.Generic.List<Person.PhoneNumber>();
    [global::ProtoBuf.ProtoMember(4, Name=@"phone", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<Person.PhoneNumber> phone
    {
      get { return _phone; }
    }
  
    private string _surname;
    [global::ProtoBuf.ProtoMember(5, IsRequired = false, Name=@"surname", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string surname
    {
      get { return _surname?? ""; }
      set { _surname = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool surnameSpecified
    {
      get { return this._surname != null; }
      set { if (value == (this._surname== null)) this._surname = value ? this.surname : (string)null; }
    }
    private bool ShouldSerializesurname() { return surnameSpecified; }
    private void Resetsurname() { surnameSpecified = false; }
    
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PhoneNumber")]
  public partial class PhoneNumber : global::ProtoBuf.IExtensible
  {
    public PhoneNumber() {}
    
    private string _number;
    [global::ProtoBuf.ProtoMember(1, IsRequired = true, Name=@"number", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string number
    {
      get { return _number; }
      set { _number = value; }
    }
    private Person.PhoneType? _type;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"type", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public Person.PhoneType type
    {
      get { return _type?? Person.PhoneType.HOME; }
      set { _type = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool typeSpecified
    {
      get { return this._type != null; }
      set { if (value == (this._type== null)) this._type = value ? this.type : (Person.PhoneType?)null; }
    }
    private bool ShouldSerializetype() { return typeSpecified; }
    private void Resettype() { typeSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    [global::ProtoBuf.ProtoContract(Name=@"PhoneType")]
    public enum PhoneType
    {
            
      [global::ProtoBuf.ProtoEnum(Name=@"MOBILE", Value=0)]
      MOBILE = 0,
            
      [global::ProtoBuf.ProtoEnum(Name=@"HOME", Value=1)]
      HOME = 1,
            
      [global::ProtoBuf.ProtoEnum(Name=@"WORK", Value=2)]
      WORK = 2
    }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}