using UnityEngine;
using System.Collections;

public class PauseMenu : MonoBehaviour {
	//Press escape to pause the game and show curser
	//Press escape or resume button to return to game
	
	
	public GUI skin;
	public bool isPaused = false;
	public Texture2D resumeButton = null;
	public Texture2D optionButton = null;
	public Texture2D exitButton = null;
	public Texture2D mainMenu = null;
	public Texture2D menuBox = null;
	public Texture2D title = null;
	public Texture2D pausedAlert = null;
	
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () 
	{
		
		if(isPaused)
		{
			if(PhotonNetwork.offlineMode)
				Time.timeScale = 0;

			Screen.showCursor = true;
			Screen.lockCursor = false;
		}
		else
		{
			if(PhotonNetwork.offlineMode)
				Time.timeScale = 1;

			Screen.showCursor = false;
			Screen.lockCursor = true;
		}
		
		if(Input.GetKeyDown(KeyCode.Escape))
		{
			isPaused = !isPaused;
		}
	}
	
	void OnGUI()
	{
		if(isPaused)
		{
			pauseScreen();
		
			((MonoBehaviour)GetComponent<NetworkManager>().getPlayer().GetComponent<MouseLook>()).enabled = false;
			((MonoBehaviour)GetComponent<NetworkManager>().getPlayer().transform.FindChild("Main Camera").GetComponent<MouseLook>()).enabled = false;
		}
		else
		{
			((MonoBehaviour)GetComponent<NetworkManager>().getPlayer().GetComponent<MouseLook>()).enabled = true;
			((MonoBehaviour)GetComponent<NetworkManager>().getPlayer().transform.FindChild("Main Camera").GetComponent<MouseLook>()).enabled = true;
		}
	}
	
	void pauseScreen()
	{
		//		GUILayout.BeginArea(new Rect((Screen.width * 0.5f) - 50, (Screen.height * 0.3f) - 100, 100, 200));
		//		
		//		if(GUILayout.Button(resumeButton)){
		//			
		//			isPaused = !isPaused;
		//		}
		GUI.Box(new Rect((Screen.width * 0.5f) - 70, (Screen.height * 0.5f) - 235, menuBox.width, menuBox.height), menuBox);
		GUI.Box(new Rect((Screen.width * 0.5f) - 60, (Screen.height * 0.5f) - 225, title.width - 20, title.height -50), title);
		GUI.Box(new Rect((Screen.width * 0.5f) - 60, (Screen.height * 0.5f) - 400, pausedAlert.width - 20, pausedAlert.height), pausedAlert);
		
		if(GUI.Button(new Rect((Screen.width * 0.5f) - 60, (Screen.height * 0.5f) - 20, resumeButton.width - 20, resumeButton.height), resumeButton))
		{
			isPaused = !isPaused;
		}
		
		if(GUI.Button(new Rect((Screen.width * 0.5f) - 60, (Screen.height * 0.5f) + 50, resumeButton.width - 20, resumeButton.height), mainMenu))
		{
			//Main Menu
		}
		
		if(GUI.Button(new Rect((Screen.width * 0.5f) - 60, (Screen.height * 0.5f) + 120, optionButton.width - 20, optionButton.height), optionButton))
		{
			//Options Menu
		}
		
		if(GUI.Button(new Rect((Screen.width * 0.5f) - 60, (Screen.height * 0.5f) + 190, exitButton.width - 20, exitButton.height), exitButton))
		{
			//Exit Game
		}
		
		
		
		
		//		GUILayout.EndArea();
	}
	
	
}
