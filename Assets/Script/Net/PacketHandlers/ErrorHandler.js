#pragma strict

import System;

public class ErrorHandler implements IPacketHandler
{
    public function get Opcode() : int { return PBOpcode.nerror; }
    
    public function Handle(bytes : byte[]) : void
    {
        var packet : egs_nerror.nerror = NewSocketNet.GetPacket.<egs_nerror.nerror>(bytes);
        
        // Force close socket in below situations.
        if (packet.code == 100008 // Server socket connection is full.
        	|| packet.code == 100010  // Another client signed up.
        )
        {
        	NewSocketNet.instance.Close();
        }
        
        if (packet.popupSpecified && packet.popup > 0)
        {
        	ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.err_" + packet.code), true, Datas.getArString("Common.OK_Button"), null);
        }
        
        if (packet.restartSpecified && packet.restart > 0)
        {
        	NewSocketNet.GetInstance().Reconnect();
        }
    }
}
