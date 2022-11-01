using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

public class JSONParse {
	public static JSONParse instance { get; protected set; }

	private JSONParse Clone ()
	{
		return new JSONParse();
	}

	public JSONParse NewInstance()
	{
		return new JSONParse();
	}
	
	public static HashObject ParseStatic(string source)
	{
		return instance.Clone().Parse(source);
	}
	
	public static JSONParse defaultInst(){
		if( null == instance ){
			instance = new JSONParse();;
		}
		return instance;
	}

	// ---------------------------------------------------------------

	private const char NullChar = (char)0;

	private int at;
	private char ch;
	private string text;
	
	private Dictionary<char, string> escapee = new Dictionary<char, string>() {
		{ '\"', "\"" },
		{ '\\', "\\" },
		{ '/', "/" },
		{ 'b', "b" },
		{ 'f', "\f" },
		{ 'n', "\n" },
		{ 'r', "\r" },
		{ 't', "\t" },
	};

	private Dictionary<char, int> hexChar = new Dictionary<char, int>() {
		{ '0', 0 },
		{ '1', 1 },
		{ '2', 2 },
		{ '3', 3 },
		{ '4', 4 },
		{ '5', 5 },
		{ '6', 6 },
		{ '7', 7 },
		{ '8', 8 },
		{ '9', 9 },
		{ 'a', 10 },
		{ 'b', 11 },
		{ 'c', 12 },
		{ 'd', 13 },
		{ 'e', 14 },
		{ 'f', 15 },
		{ 'A', 10 },
		{ 'B', 11 },
		{ 'C', 12 },
		{ 'D', 13 },
		{ 'E', 14 },
		{ 'F', 15 },
	};

	StringBuilder sb = new StringBuilder(64);
	
    private const int errorContextOffset = 20;
	private void error(string m) {
        int contextBeg = (at >= errorContextOffset ? at - errorContextOffset : 0);
        int contextEnd = (at + errorContextOffset < text.Length ? at + errorContextOffset : text.Length);
        string context = text.Substring(contextBeg, contextEnd - contextBeg);
        StringBuilder errorSb = new StringBuilder();
        errorSb.AppendLine("SyntaxError:");
        errorSb.AppendLine("Message: " + m);
        errorSb.AppendLine("At: " + at);
        errorSb.AppendLine("Context: " + context);
        errorSb.AppendLine("Text: " + text);
		throw new System.Exception(errorSb.ToString());
	}

	private char next(char c) {
		
		if(c != NullChar && c != ch) {
			error("Expected '" + c + "' instead of '" + ch + "'");
		}

		if(text.Length >= at+1) {
			try {
				ch = text[at];
			} catch {
				ch = NullChar;
			}
		}
		else {
			ch = NullChar;
		}
		
		at++;
		return ch;
	}

	private char next(){
		return next(NullChar);
	}

	private double parse_number() {
		double num;
		sb.Length = 0;

		if(ch == '-') {
			sb.Append('-');
			next('-');
		}
		while(char.IsDigit(ch)) {
			sb.Append(ch);
			next();
		}
		if(ch == '.') {
			sb.Append('.');
			while(next() != NullChar && char.IsDigit(ch)) {
				sb.Append(ch);
			}
		}
		if(ch == 'e' || ch == 'E') {
			sb.Append(ch);
			next();
			if(ch == '-' || ch == '+') {
				sb.Append(ch);
				next();
			}
			while(char.IsDigit(ch)) {
				sb.Append(ch);
				next();
			}
		}
		num = double.Parse(sb.ToString());
		
		if (double.IsNaN(num)) {
			error("Bad number");
		}
		
		return num;
	}

	private string parse_string() {
		int uffff;
		char t, m;
		sb.Length = 0;

		if(ch == '\"') {
			while(next() != NullChar) {
				if(ch == '\"') {
					next();
					return sb.ToString();
				} else if (ch == '\\') {
					next();
					if(ch == 'u') {
						uffff = 0;
						t = next();
						uffff = uffff * 16 + hexChar[t];
						t = next();
						uffff = uffff * 16 + hexChar[t];
						t = next();
						uffff = uffff * 16 + hexChar[t];
						t = next();
						uffff = uffff * 16 + hexChar[t];
						m = (char)uffff;
						sb.Append(m);
					} else if(escapee.ContainsKey(ch)) {
						sb.Append(escapee[ch]);
					} else {
						break;
					}
				} else {
					sb.Append(ch);
				}
			}
		}
		error("Bad string");
		return null;
	}

	private void white () {
		while(char.IsWhiteSpace(ch)) { // if it's whitespace
			next();
		}   
	}

	private object parse_word() {
		// We don't use a switch() statement because
		// otherwise Unity will complain about
		// unreachable code (in reality it's not unreachable).
		
		if(ch == 't') {
			next('t');
			next('r');
			next('u');
			next('e');
			return true;
		} else if (ch == 'f') {
			next('f');
			next('a');
			next('l');
			next('s');
			next('e');
			return false;
		} else if (ch == 'n') {
			next('n');
			next('u');
			next('l');
			next('l');
			return null;
		} else if (ch == NullChar) { 
			return null; // Todo: why is it doing this?
		}
		
		error("Unexpected '" + ch + "'");
		return null;
	}

	private HashObject parse_array() {
		
		HashObject array = new HashObject();
		
		if(ch == '[') {
			next('[');
			white();
			if(ch == ']') {
				next(']');
				return array; // empty array
			}
			int i = 0;
			while(ch != NullChar) {
				object data = parse_value();
				if(null != data as HashObject)
					array[KBN._Global.ap+i] = data as HashObject;
				else
				{
					if(array[KBN._Global.ap+i] == null)
						array[KBN._Global.ap+i] = new HashObject();
					array[KBN._Global.ap+i].Value = data;	
				}
				i++;
				white();
				if(ch == ']') {
					next(']');
					return array;
				}
				next(',');
				white();
			}
		}
		error("Bad array");
		return null;
	}

	private HashObject parse_object() {
		string key;
		HashObject obj = new HashObject();
		
		if(ch == '{') {
			next('{');
			white();
			if(ch == '}') {
				next('}');
				return obj; // empty object
			}
			while(ch != NullChar) {
				key = parse_string();
				white();
				next(':');
				object data = parse_value();
				if(null != data as HashObject)
				{
					obj[key] = data as HashObject;
				}
				else
				{
					if(obj[key] == null)
						obj[key] = new HashObject();
					obj[key].Value = data;
				}
				white();
				if (ch == '}') {
					next('}');
					return obj;
				}
				next(',');
				white();
			}
		}
		error("Bad object");
		return null;
	}

	private object parse_value() {
		white();
		
		if(ch == '{') {
			return parse_object();
		} else if(ch == '[') {
			return parse_array();
		} else if(ch == '\"') {
			return parse_string();
		} else if(ch == '-') {
			return parse_number();
		} else {
			return char.IsDigit(ch) ? parse_number() : parse_word();
		}
	}

	public HashObject StartParse (string source, object reviver) {
		return Parse(source);
	}

	public HashObject Parse(string source) {
		HashObject result = new HashObject();
		
		text = source;
		at = 0;
		ch = ' ';
		object data = parse_value() ;
		result = data as HashObject;
		white();
		if (ch != NullChar) {
			error("Syntax error");
		}

		sb = new StringBuilder(64);
		return result;
	}


}

