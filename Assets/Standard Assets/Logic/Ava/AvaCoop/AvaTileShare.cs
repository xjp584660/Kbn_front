using System;
using System.Collections.Generic;
using UnityNet = KBN.UnityNet;
using MenuMgr = KBN.MenuMgr;
using _Global = KBN._Global;

/// <summary>
/// Share tile info from the world map in AVA co-op.
/// </summary>
public sealed class AvaTileShare : AvaModule
{
    private const int ProtoCmd = 7;
    private const string Url = "ava.php";

    public enum SubCommand
    {
        Player,
        Alliance,
    }

    public AvaTileShare(AvaManager avaEntry)
        : base(avaEntry)
    {
        IsLeader = false;
        Data = new List<AvaSharedTileInfoData>();
        TilesToDelete = new List<int>();
        TilesReallyDeleted = new List<int>();
        PageToGet = -1;
    }

    public bool IsLeader { get; private set; }

    public List<AvaSharedTileInfoData> Data { get; private set; }

    public int TotalDataCount { get; private set; }

	public int OwnTotalDataCount { get; set; }

    public int PageToGet { get; private set; }

    public List<int> TilesToDelete { get; private set; }

    public List<int> TilesReallyDeleted { get; private set; }

	private int LastAbandonTileID;

    public void RefreshShareList(SubCommand subCommand, int page, int pageSize)
    {
        if (page <= 0)
        {
            throw new ApplicationException("Invalid page: " + page);
        }

        if (pageSize <= 0)
        {
            throw new ApplicationException("Invalid pageSize: " + pageSize);
        }

        var request = new PBMsgReqAVA.PBMsgReqAVA
        {
            cmd = ProtoCmd,
            subcmd = subCommand == SubCommand.Player ? 2 : 3,
            shareList = new PBMsgReqAVA.PBMsgReqAVA.ShareList
            {
                page = page,
                pageSize = pageSize,
            },
        };

        PageToGet = page;

#if DEBUG_AVA_COOP
        var response = new PBMsgAVAShare.PBMsgAVAShare();
        response.isLeader = true;
        response.total = 45;

        for (int i = 0; i < pageSize; ++i)
        {
            var tmp = new PBMsgAVAShare.PBMsgAVAShare.Item
            {
                allianceId = i + 1,
                allianceName = "Alliance name " + (i + 1),
                integration = (i + 1) * 200,
                might = (i + 1) * 5000,
                serverId = i + 1,
                serverName = /*"Server name " +*/ (i + 1),
                status = (i + 1) % 6,
                tileId = (i + 1) * 80,
                userId = (i + 1) * 100,
                userName = "Player name " + (i + 1) * 100,
                xcoord = i + pageSize * page,
                ycoord = i + pageSize * page + 1,
            };
            response.items.Add(tmp);
        }
        OnReqShareListOK(_Global.SerializePBMsg2Bytes<PBMsgAVAShare.PBMsgAVAShare>(response));
#else
        UnityNet.RequestForGPB(Url, request, new Action<byte[]>(OnReqShareListOK));
#endif
    }

    private void OnReqShareListOK(byte[] data)
    {
        var response = _Global.DeserializePBMsgFromBytes<PBMsgAVAShare.PBMsgAVAShare>(data);
        this.IsLeader = response.isLeader;
        this.Data.Clear();
        for (int i = 0; i < response.items.Count; ++i)
        {
            var item = response.items[i];
            var tmp = new AvaSharedTileInfoData()
            {
                coordinateX = item.xcoord,
                coordinateY = item.ycoord,
                flagid = item.status,
                tileid = item.tileId,
                s_occupantName = (string.IsNullOrEmpty(item.userName) ? KBN.Datas.getArString("Common.None") : item.userName),
                s_allinaceName = (string.IsNullOrEmpty(item.allianceName) ? KBN.Datas.getArString("Common.None") : item.allianceName),
                TileType = item.tileType,
                might = item.might,
            };
            this.Data.Add(tmp);
        }
        this.TotalDataCount = response.total;
        this.OwnTotalDataCount = response.myTileCount;
        MenuMgr.instance.sendNotification(Constant.Notice.AvaCoopTileShareListRefreshed, null);
    }

	public void SetOwnTotalDataCount(PBMsgAVASocket.PBMsgAVASocket msg)
	{
		if(msg == null || msg.result == null || msg.result.Count < 1)
		{
			return;
		}

		if(msg.result[0].key == "myTileCount")
		{
			OwnTotalDataCount = KBN._Global.INT32(msg.result [0].value);
		}
	}

    public void AbandonTile(int tileId)
    {
		LastAbandonTileID = tileId;

        var request = new PBMsgReqAVA.PBMsgReqAVA
        {
            cmd = ProtoCmd,
            subcmd = 8,
            giveUp = new PBMsgReqAVA.PBMsgReqAVA.GiveUp
            {
                tileId = tileId,
            },
        };

#if DEBUG_AVA_COOP
        OnAbandonTileOK(null);
#else
        UnityNet.RequestForGPB(Url, request, new Action<byte[]>(OnAbandonTileOK));
#endif
    }

    private void OnAbandonTileOK(byte[] data)
    {
        MenuMgr.instance.sendNotification(Constant.Notice.AvaAbandonTileOK, null);
		KBN.GameMain.singleton.onAbandonTileOK( LastAbandonTileID );
    }

    public void DeleteSharedTile(SubCommand subCommand, List<int> tileIds)
    {
        var request = new PBMsgReqAVA.PBMsgReqAVA
        {
            cmd = ProtoCmd,
            subcmd = subCommand == SubCommand.Player ? 6 : 4,
            shareDelete = new PBMsgReqAVA.PBMsgReqAVA.ShareDelete(),
        };
        request.shareDelete.tileId.AddRange(tileIds);
        TilesToDelete = tileIds;
        TilesReallyDeleted.Clear();

#if DEBUG_AVA_COOP
        OnDeleteSharedTileOK(null);
#else
        UnityNet.RequestForGPB(Url, request, new Action<byte[]>(OnDeleteSharedTileOK));
#endif
    }

    private void OnDeleteSharedTileOK(byte[] data)
    {
        if (data != null)
        {
            var msg = _Global.DeserializePBMsgFromBytes<PBMsgAvaDeletedSharedTile.PBMsgAvaDeletedSharedTile>(data);
            TilesReallyDeleted.AddRange(msg.deletedTileIds);
        }
        MenuMgr.instance.sendNotification(Constant.Notice.AvaDeleteSharedTileOK, null);
    }

    public void SetOrder(SubCommand subCommand, List<int> tileIds)
    {
        var request = new PBMsgReqAVA.PBMsgReqAVA
        {
            cmd = ProtoCmd,
            subcmd = subCommand == SubCommand.Player ? 7 : 5,
            shareSetTop = new PBMsgReqAVA.PBMsgReqAVA.ShareSetTop(),
        };
        request.shareSetTop.tileId.AddRange(tileIds);

#if DEBUG_AVA_COOP
        OnSetOrderOK(null);
#else
        UnityNet.RequestForGPB(Url, request, new Action<byte[]>(OnSetOrderOK));
#endif
    }

    private void OnSetOrderOK(byte[] data)
    {
        MenuMgr.instance.sendNotification(Constant.Notice.AvaCoopReorderTilesOK, null);
    }
}
