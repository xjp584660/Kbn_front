#pragma strict

import System;

public class EventRespHandler implements IPacketHandler
{
    public function get Opcode() : int { return PBOpcode.event_resp; }
    
    public function Handle(bytes : byte[]) : void
    {
		var packet : egs_event_resp.eventresp = NewSocketNet.GetPacket.<egs_event_resp.eventresp>(bytes);
        
        Scout.instance().closeScoutProgress();
    }
}
