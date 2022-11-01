
public enum MUSOptLevel
{
	DEFAULT = 0,
	BYPASS_DEPENDENCY = 1,
	BYPASS_US = 2,
}

public class MUSConfig 
{
	public int optLevel = (int)MUSOptLevel.DEFAULT;
}
