
public class _Global extends KBN._Global
{
    static function IsValueInArray(array:Array, v:int):boolean
    {
        if (array == null) return false;
        return KBN._Global.IsValueInArray(array.ToBuiltin(System.Object), v);
    }

    static function IsValueInArray(array:Array, v:System.Object):boolean
    {
        if (array == null) return false;
        return KBN._Global.IsValueInArray(array.ToBuiltin(System.Object), v); 
    }

    static function MaxValue(array:Array):int
    {
        return KBN._Global.MaxValue(array.ToBuiltin(int));
    }

    // Used only in Embassy class
    // TODO: Use LINQ instead
    static	function	SelectArray(array:Array, func:Function):Array{
    	var ret:Array = new Array();
    	for( var i:int = 0; i < array.length; i ++ ) 
    	{
    		if( func(array[i]) ){
    			ret.Add( array[i] );
    		}
    	}
    	return ret;
    }

    public static  function IndexOf(array:Array,item:int):int
    {
        return KBN._Global.IndexOf(array.ToBuiltin(int), item);
    }
    public static function HashtableToHashObject(hash: Hashtable): HashObject {
        var rtn: HashObject = new HashObject(hash);
        for (var key in hash.Keys) {
            if (hash[key] instanceof Hashtable) {
                rtn[key] = HashtableToHashObject(hash[key]);
            }
            else if (hash[key] instanceof Object[]) {
                var arr: HashObject = new HashObject();
                var hashArray: Object[] = hash[key] as Object[];
                for (var i: int = 0; i < hashArray.Length; ++i) {
                    arr.Add(ap + i, HashtableToHashObject(hashArray[i]));
                }
                rtn[key] = arr;
            }
        }
        return rtn;
    }
    
}
