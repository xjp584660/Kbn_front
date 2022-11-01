using JasonReflection;

[JasonData]
public class AllianceEmblemData {

	[JasonData("curBanner")]
	public string banner;

	[JasonData("curStyle")]
	public int style;

	[JasonData("curStyleColor")]
	public string styleColor;

	[JasonData("curSymbol")]
	public int symbol;

	[JasonData("curSymbolColor")]
	public string symbolColor;

	public AllianceEmblemData() {
		this.banner = null;
		this.style = 0;
		this.styleColor = null;
		this.symbol = 0;
		this.symbolColor = null;
	}

    public AllianceEmblemData(string _banner, int _style, string _styleColor, int _symbol, string _symbolColor)
    {
        this.banner = _banner;
        this.style = _style;
        this.styleColor = _styleColor;
        this.symbol = _symbol;
        this.symbolColor = _symbolColor;
    }

	public AllianceEmblemData(AllianceEmblemData data) {
		this.banner = data.banner;
		this.style = data.style;
		this.styleColor = data.styleColor;
		this.symbol = data.symbol;
		this.symbolColor = data.symbolColor;
	}

	public bool Equals(AllianceEmblemData a) {
		return 	(null != a) && 
				(a.banner == this.banner) &&
				(a.style == this.style) &&
				(a.styleColor == this.styleColor) &&
				(a.symbol == this.symbol) &&
				(a.symbolColor == this.symbolColor);
	}

	public bool IsEmpty {
		get {
			return Empty.Equals(this);
		}
	}

	public readonly static AllianceEmblemData Empty = new AllianceEmblemData();
}
