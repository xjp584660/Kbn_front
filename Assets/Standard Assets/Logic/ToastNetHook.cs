using UnityEngine;
using System.Collections;
using System;

using _Global = KBN._Global;
using UnityNet = KBN.UnityNet;
using MenuMgr = KBN.MenuMgr;
using Datas = KBN.Datas;

public class ToastNetHook : object
{
    private enum ToastType
    {
        Basic = 0,
        Tile = 1,
    }

    #region Instance related
    public static ToastNetHook Instance { get; private set; }

    public static void MakeInstance()
    {
        _Global.Log("[ToasterNetHook MakeInstance]");
        if (Instance != null)
        {
            throw new NotSupportedException("An instance of ToastNetHook already exists.");
        }
        Instance = new ToastNetHook();
    }

    public static void ClearInstance()
    {
        Instance.TearDown();
        Instance = null;
        _Global.Log("[ToasterNetHook ClearInstance]");
    }
    #endregion

    #region Private
    private ToastNetHook()
    {
        UnityNet.RegisterResultHook(OnNetResult);
    }

    private void TearDown()
    {
        UnityNet.UnregisterResultHook(OnNetResult);
    }

    private void OnNetResult(string url, HashObject result)
    {
        //_Global.Log("[ToasterNetHook OnNetResult]");

        var toastNode = result["toast"];
        if (toastNode == null)
        {
            return;
        }

        if (MenuMgr.instance == null)
        {
            return;
        }

        string msg = GetToastMsg(toastNode);
        Rect endPos = toastNode["endPos"] == null ? new Rect(0, 800, 640, 160) : GetRectFromHashObject(toastNode["endPos"]);
        Rect startPos = toastNode["startPos"] == null ? new Rect(endPos.x, MenuMgr.SCREEN_HEIGHT, endPos.width, endPos.height)
            : GetRectFromHashObject(toastNode["startPos"]);
        float showTime = toastNode["showTime"] == null ? 2f : _Global.FLOAT(toastNode["showTime"]);
        bool withSound = toastNode["withSound"] == null ? true : _Global.GetBoolean(toastNode["withSound"]);

        ToastType type = (ToastType)(_Global.INT32(toastNode["type"]));

        switch (type)
        {
        case ToastType.Basic:
            bool withImage = toastNode["withImage"] == null ? true : _Global.GetBoolean(toastNode["withImage"]);
            MenuMgr.instance.PushMessage(msg, startPos, endPos, showTime, withImage, withSound);
            break;
        case ToastType.Tile:
            string tileName = _Global.GetString(toastNode["tileName"]);
            Tile tile = TextureMgr.instance().IconSpt().GetTile(tileName);
            MenuMgr.instance.PushMessageWithImage(msg, startPos, endPos, tile, showTime, withSound);
            break;
        default:
            break;
        }
    }

    private static string GetToastMsg(HashObject toastNode)
    {
        if (toastNode == null)
        {
            return "";
        }

        string key = _Global.GetString(toastNode["msgKey"]);
        string baseMsg = Datas.getArString(key);
        HashObject paramNode = toastNode["msgParams"];

        int paramCount = _Global.GetObjectKeys(paramNode).Length;
        if (paramCount <= 0)
        {
            return baseMsg;
        }

        object[] msgParams = new object[paramCount];
        for (int i = 0; i < paramCount; ++i)
        {
            msgParams[i] = _Global.GetString(paramNode[_Global.ap + i]);
        }
        return string.Format(baseMsg, msgParams);
    }

    private static Rect GetRectFromHashObject(HashObject data)
    {
        var ret = new Rect();

        if (data == null)
        {
            return ret;
        }

        ret.x = _Global.FLOAT(data["x"]);
        ret.y = _Global.FLOAT(data["y"]);
        ret.width = _Global.FLOAT(data["w"]);
        ret.height = _Global.FLOAT(data["h"]);

        return ret;
    }
    #endregion
}
