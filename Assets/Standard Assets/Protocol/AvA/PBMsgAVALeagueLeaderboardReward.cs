//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAVALeagueLeaderboardReward.proto
namespace PBMsgAVALeagueLeaderboardReward
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAVALeagueLeaderboardReward")]
  public partial class PBMsgAVALeagueLeaderboardReward : global::ProtoBuf.IExtensible
  {
    public PBMsgAVALeagueLeaderboardReward() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgAVALeagueLeaderboardReward.LeagueRewardItems> _leagueRewardItems = new global::System.Collections.Generic.List<PBMsgAVALeagueLeaderboardReward.LeagueRewardItems>();
    [global::ProtoBuf.ProtoMember(1, Name=@"leagueRewardItems", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgAVALeagueLeaderboardReward.LeagueRewardItems> leagueRewardItems
    {
      get { return _leagueRewardItems; }
    }
  
    private int? _isReward;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"isReward", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int isReward
    {
      get { return _isReward?? default(int); }
      set { _isReward = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool isRewardSpecified
    {
      get { return this._isReward != null; }
      set { if (value == (this._isReward== null)) this._isReward = value ? this.isReward : (int?)null; }
    }
    private bool ShouldSerializeisReward() { return isRewardSpecified; }
    private void ResetisReward() { isRewardSpecified = false; }
    
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"LeagueRewardItems")]
  public partial class LeagueRewardItems : global::ProtoBuf.IExtensible
  {
    public LeagueRewardItems() {}
    
    private int? _itemId;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"itemId", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemId
    {
      get { return _itemId?? default(int); }
      set { _itemId = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool itemIdSpecified
    {
      get { return this._itemId != null; }
      set { if (value == (this._itemId== null)) this._itemId = value ? this.itemId : (int?)null; }
    }
    private bool ShouldSerializeitemId() { return itemIdSpecified; }
    private void ResetitemId() { itemIdSpecified = false; }
    
    private int? _itemNum;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"itemNum", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int itemNum
    {
      get { return _itemNum?? default(int); }
      set { _itemNum = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool itemNumSpecified
    {
      get { return this._itemNum != null; }
      set { if (value == (this._itemNum== null)) this._itemNum = value ? this.itemNum : (int?)null; }
    }
    private bool ShouldSerializeitemNum() { return itemNumSpecified; }
    private void ResetitemNum() { itemNumSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}