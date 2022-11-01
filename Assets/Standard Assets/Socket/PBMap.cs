using UnityEngine;
using System.Collections;
using System.Text;

public class PBMap :IPacket
{
	public int Opcode{
		get{
			return (int)PBOpcode.map;
		}
	}

	private string data;
	public void SetData(string str){
		data=str;
	}

	public byte[] GetData(){
		return System.Text.Encoding.Default.GetBytes ( data );
	}

	private global::ProtoBuf.IExtension extensionObject;
	global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
  	{ return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
}
