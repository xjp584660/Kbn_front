using UnityEngine;
using System.Collections;

/// <summary>
/// 消息包单元。
/// </summary>
public struct Packet
{
    private readonly int m_Opcode; // Packet opcode.
    private readonly byte[] m_Bytes; // Packet stream.

    public Packet(int opcode, byte[] bytes)
    {
        m_Opcode = opcode;
        m_Bytes = bytes;
    }

    public int Opcode
    {
        get
        {
            return m_Opcode;
        }
    }

    public byte[] Bytes
    {
        get
        {
            return m_Bytes;
        }
    }
}