public class	Requirement
{
	public	string	type;
	public	int  typeId = -1;
	public	string	required;
	public	string	own;
	public	bool	ok;
	public	int reqPrestige = 0;
	public	int ownPrestige = 0;
	public	bool bSale = false;
	
	public Requirement()
	{
		typeId = -1;
	}
}
