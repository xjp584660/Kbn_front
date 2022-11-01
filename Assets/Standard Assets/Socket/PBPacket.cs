// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

[global::System.Serializable, global::ProtoBuf.ProtoContract(Name = @"PBPacket")]
public partial class PBPacket : global::ProtoBuf.IExtensible
{
		private int _Opcode;

		[global::ProtoBuf.ProtoMember(1, IsRequired = true, Name = @"Opcode", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
		public int Opcode {
				get { return _Opcode; }
				set { _Opcode = value; }
		}

		private byte[] _Data;

		[global::ProtoBuf.ProtoMember(2, IsRequired = true, Name = @"Data", DataFormat = global::ProtoBuf.DataFormat.Default)]
		public byte[] Data {
				get { return _Data; }
				set { _Data = value; }
		}

		private int _source = default(int);

		[global::ProtoBuf.ProtoMember(3, IsRequired = false, Name = @"source", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
		[global::System.ComponentModel.DefaultValue(default(int))]
		public int source {
				get { return _source; }
				set { _source = value; }
		}

		private global::ProtoBuf.IExtension extensionObject;

		global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject (bool createIfMissing)
		{
				return global::ProtoBuf.Extensible.GetExtensionObject (ref extensionObject, createIfMissing);
		}
}
