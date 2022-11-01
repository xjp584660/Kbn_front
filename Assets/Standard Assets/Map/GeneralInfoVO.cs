using System.Collections.Generic;
using KBN;
public class GeneralInfoVO : BaseVO
{
    public int knightId;
    public int knightFbuid;
    public int knightLordUserid;
    public string knightName;
    public int knightLevel;
    public int experience;
    public int loyalty;
    public string loyaltyTimestamp;
    public int knightEnergy;
    public int knightMaxEnergy;
    public long energyReplenishmentTickerUT;
    public long salaryTickerUT;
    public string loginYMD;
    public string updateYMD;
    public int knightStatus;
    public int cityId;
    public string pic_square;
    public bool selected = false;
	public int cityOrder = 0;//for ava
	public bool bAvaOnly = false;//for ava
    public bool isOtherKnight = false;
    public Dictionary<int,GearTroopItem.GearTroopItemData> gearTroopItemDatas = new Dictionary<int,GearTroopItem.GearTroopItemData>();

    public override void mergeDataFrom(object src)
    {
        base.mergeDataFrom(src);
        
        knightId = this.getInt("knightId");   
        knightFbuid = this.getInt("knightFbuid");    
        knightLordUserid = this.getInt("knightLordUserid");   
        knightName = this.getString("knightName");  
        knightLevel = this.getInt("knightLevel");    
        experience = this.getInt("experience"); 
        loyalty = this.getInt("loyalty");    
        loyaltyTimestamp = this.getString("loyaltyTimestamp");    
        knightEnergy = this.getInt("knightEnergy");   
        knightMaxEnergy = this.getInt("knightMaxEnergy");    
        energyReplenishmentTickerUT = this.getInt("energyReplenishmentTickerUT");    
        salaryTickerUT = this.getInt("salaryTickerUT"); 
        loginYMD = this.getString("loginYMD");    
        updateYMD = this.getString("updateYMD");   
        knightStatus = this.getInt("knightStatus");   
        cityId = this.getInt("cityId");
        pic_square = this.getString("pic_square");
        calcExp();
    }

    public bool isStar
    {
        get
        {
            return Knight.IsStarLevel(knightLevel);
        }
    }

    public string starLevel
    {
        get
        {
            return Knight.GetShowerLevel(knightLevel);
        }
    }
    
    private void calcExp()
    {
        int[] expLv = KBN.General.singleton.calcExpLvl(knightId.ToString());
        this.knightLevel = expLv[1];
        this.experience = expLv[0];
    }
}
