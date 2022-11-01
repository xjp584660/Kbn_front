using UnityEngine;
using UnityEditor;

public class MUSWindow : EditorWindow
{
	private int listEntry = 0;
	private GUIContent[] list;
	private GUIStyle listStyle; 
	private bool showList = false;
	private MUSConfig cfg;

	private static string[] OPT_LIST = {
		"Default",
		"Bypass Compile Depenpendies",
		"Bypass Compile US"
	};

    [MenuItem("Window/MUS")]
    public static void ShowWindow()
    {
        EditorWindow.GetWindow(typeof(MUSWindow));
    }

	void OnEnable() 
	{
		// Make some content for the popup list
		list = new GUIContent[3];
		list[0] = new GUIContent(OPT_LIST[0]);
		list[1] = new GUIContent(OPT_LIST[1]);
		list[2] = new GUIContent(OPT_LIST[2]);
	 
		// Make a GUIStyle that has a solid white hover/onHover background to indicate highlighted items
		listStyle = new GUIStyle();
		listStyle.normal.textColor = Color.white;
		var tex = new Texture2D(2, 2);
		var colors = new Color[4];
		colors[0] = Color.white;
		colors[1] = Color.white;
		colors[2] = Color.white;
		colors[3] = Color.white;
		tex.SetPixels(colors);
		tex.Apply();
		listStyle.hover.background = tex;
		listStyle.onHover.background = tex;
		listStyle.padding.left = listStyle.padding.right = listStyle.padding.top = listStyle.padding.bottom = 4;

		cfg = MUSCfgSerializer.Deserialize();
	}
    
    void OnGUI()
    {
		if (MUSInstaller.HasInstalled)
		{
			if (GUILayout.Button("ReInstall MUS", GUILayout.Height(30)))
			{
				MUSInstaller.ReInstall();
			}
			if (GUILayout.Button("UnInstall MUS", GUILayout.Height(30)))
			{
				MUSInstaller.UnInstall();
			}
		}
		else 
		{
			if (GUILayout.Button("Install MUS", GUILayout.Height(30)))
			{
				MUSInstaller.Install();
			}
		}

		var index = (int)cfg.optLevel;

		var selectedName = OPT_LIST[index];

		if (Popup.List(new Rect(5, 70, 200, 20), ref showList, ref listEntry, new GUIContent(selectedName), list, listStyle)) 
		{
			Debug.Log("listEntry:" + listEntry);
			cfg.optLevel = listEntry;
			MUSCfgSerializer.Serialize(cfg);
		}
    }
}

public class Popup 
{
	static int popupListHash = "PopupList".GetHashCode();
 
	public static bool List(
			Rect position, 
			ref bool showList, 
			ref int listEntry, 
			GUIContent buttonContent, 
			GUIContent[] listContent,
			GUIStyle listStyle) 
	{
		return List(position, ref showList, ref listEntry, buttonContent, listContent, "button", "box", listStyle);
	}
 
	public static bool List (
			Rect position, 
			ref bool showList, 
			ref int listEntry, 
			GUIContent buttonContent, 
			GUIContent[] listContent,
		 	GUIStyle buttonStyle, 
			GUIStyle boxStyle, 
			GUIStyle listStyle) 
	{
		int controlID = GUIUtility.GetControlID(popupListHash, FocusType.Passive);
		bool done = false;
		switch (Event.current.GetTypeForControl(controlID)) 
		{
			case EventType.MouseDown:
				if (position.Contains(Event.current.mousePosition)) 
				{
					GUIUtility.hotControl = controlID;
					showList = true;
				}
				break;
			case EventType.MouseUp:
				if (showList) 
				{
					done = true;
				}
				break;
		}
 
		GUI.Label(position, buttonContent, buttonStyle);
		if (showList) 
		{
			Rect listRect = new Rect(position.x, position.y, position.width, listStyle.CalcHeight(listContent[0], 1.0f)*listContent.Length);
			GUI.Box(listRect, "", boxStyle);
			listEntry = GUI.SelectionGrid(listRect, listEntry, listContent, 1, listStyle);
		}
		if (done) 
		{
			showList = false;
		}
		return done;
	}
}
