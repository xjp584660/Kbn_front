//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Option: missing-value detection (*Specified/ShouldSerialize*/Reset*) enabled
    
// Generated from: PBMsgAVALeagueUserInfoLeaderboard.proto
namespace PBMsgAVALeagueUserInfoLeaderboard
{
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"PBMsgAVALeagueUserInfoLeaderboard")]
  public partial class PBMsgAVALeagueUserInfoLeaderboard : global::ProtoBuf.IExtensible
  {
    public PBMsgAVALeagueUserInfoLeaderboard() {}
    
    private readonly global::System.Collections.Generic.List<PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo> _leagueUserInfoList = new global::System.Collections.Generic.List<PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo>();
    [global::ProtoBuf.ProtoMember(1, Name=@"leagueUserInfoList", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public global::System.Collections.Generic.List<PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo> leagueUserInfoList
    {
      get { return _leagueUserInfoList; }
    }
  
    private int? _curPage;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"curPage", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int curPage
    {
      get { return _curPage?? default(int); }
      set { _curPage = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool curPageSpecified
    {
      get { return this._curPage != null; }
      set { if (value == (this._curPage== null)) this._curPage = value ? this.curPage : (int?)null; }
    }
    private bool ShouldSerializecurPage() { return curPageSpecified; }
    private void ResetcurPage() { curPageSpecified = false; }
    
    private int? _totalPage;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"totalPage", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int totalPage
    {
      get { return _totalPage?? default(int); }
      set { _totalPage = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool totalPageSpecified
    {
      get { return this._totalPage != null; }
      set { if (value == (this._totalPage== null)) this._totalPage = value ? this.totalPage : (int?)null; }
    }
    private bool ShouldSerializetotalPage() { return totalPageSpecified; }
    private void ResettotalPage() { totalPageSpecified = false; }
    
    private PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo _userInfo = null;
    [global::ProtoBuf.ProtoMember(4, IsRequired = false, Name=@"userInfo", DataFormat = global::ProtoBuf.DataFormat.Default)]
    [global::System.ComponentModel.DefaultValue(null)]
    public PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo userInfo
    {
      get { return _userInfo; }
      set { _userInfo = value; }
    }
  [global::System.Serializable, global::ProtoBuf.ProtoContract(Name=@"LeagueUserInfo")]
  public partial class LeagueUserInfo : global::ProtoBuf.IExtensible
  {
    public LeagueUserInfo() {}
    
    private int? _rank;
    [global::ProtoBuf.ProtoMember(1, IsRequired = false, Name=@"rank", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int rank
    {
      get { return _rank?? default(int); }
      set { _rank = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool rankSpecified
    {
      get { return this._rank != null; }
      set { if (value == (this._rank== null)) this._rank = value ? this.rank : (int?)null; }
    }
    private bool ShouldSerializerank() { return rankSpecified; }
    private void Resetrank() { rankSpecified = false; }
    
    private string _userName;
    [global::ProtoBuf.ProtoMember(2, IsRequired = false, Name=@"userName", DataFormat = global::ProtoBuf.DataFormat.Default)]
    public string userName
    {
      get { return _userName?? ""; }
      set { _userName = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool userNameSpecified
    {
      get { return this._userName != null; }
      set { if (value == (this._userName== null)) this._userName = value ? this.userName : (string)null; }
    }
    private bool ShouldSerializeuserName() { return userNameSpecified; }
    private void ResetuserName() { userNameSpecified = false; }
    
    private int? _battleScore;
    [global::ProtoBuf.ProtoMember(3, IsRequired = false, Name=@"battleScore", DataFormat = global::ProtoBuf.DataFormat.TwosComplement)]
    public int battleScore
    {
      get { return _battleScore?? default(int); }
      set { _battleScore = value; }
    }
    [global::System.Xml.Serialization.XmlIgnore]
    [global::System.ComponentModel.Browsable(false)]
    public bool battleScoreSpecified
    {
      get { return this._battleScore != null; }
      set { if (value == (this._battleScore== null)) this._battleScore = value ? this.battleScore : (int?)null; }
    }
    private bool ShouldSerializebattleScore() { return battleScoreSpecified; }
    private void ResetbattleScore() { battleScoreSpecified = false; }
    
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
    private global::ProtoBuf.IExtension extensionObject;
    global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
      { return global::ProtoBuf.Extensible.GetExtensionObject(ref extensionObject, createIfMissing); }
  }
  
}