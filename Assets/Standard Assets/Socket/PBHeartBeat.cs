// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

[global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBHeartBeat")]
public partial class PBHeartBeat : IPacket
{
		public int Opcode { get { return (int)PBOpcode.heartbeat; } }
    
		private global::ProtoBuf.IExtension extensionObject;

		global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject (bool createIfMissing)
		{
				return global::ProtoBuf.Extensible.GetExtensionObject (ref extensionObject, createIfMissing);
		}
}
