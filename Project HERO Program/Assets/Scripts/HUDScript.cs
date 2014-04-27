using UnityEngine;
using System.Collections;

public class HUDScript : MonoBehaviour {

    public float healthDisplay; //health
	public float energyDisplay;
    private Vector2 size;
	private Vector2 iconSize;
    public Texture2D emptyTex;
    public Texture2D fullTex;
	public Texture2D playerIcon;
	public Texture2D[] arrayOfIcons;
	private int barPosX;
	private int barPosY;
	
	void Start(){
		barPosX = (int)((Screen.width /2) - (size.x/2));
		barPosY = Screen.height;
	}
 
    void OnGUI() {
	setupHPAndEnergyBar();
	setupSkillIcons();
	setupCharacterIcon();
    }
 
    void Update() {
       //for this example, the bar display is linked to the current time,
       //however you would set this value based on your desired display
       //eg, the loading progress, the player's health, or whatever.
    	healthDisplay = Time.time*0.05f;
		energyDisplay = Time.time*0.1f;
		barPosX = (int)((Screen.width /2) - (size.x/2));
		barPosY = Screen.height;
		size = new Vector2(Screen.width/2,20);
		iconSize.x = playerIcon.width;
		iconSize.y = playerIcon.height;
//   barDisplay = MyControlScript.staticHealth;
    }
	
	 void setupHPAndEnergyBar()
	{
		
			//health
       //draw the background:
       GUI.BeginGroup(new Rect(barPosX, barPosY - 4*size.y, size.x, size.y));
         GUI.Box(new Rect(0,0, size.x, size.y), emptyTex);
		GUI.Label(new Rect(size.x/4,0,size.x,size.y),"999/999");
         //draw the filled-in part:
         GUI.BeginGroup(new Rect(0,0, size.x * healthDisplay, size.y));
          GUI.Box(new Rect(0,0, size.x, size.y), fullTex);
		
         GUI.EndGroup();
       GUI.EndGroup();
		
		
		//energy
		GUI.BeginGroup(new Rect(barPosX , barPosY - 3*size.y, size.x, size.y));
         GUI.Box(new Rect(0,0, size.x, size.y),emptyTex);
		GUI.Label(new Rect(size.x/4,0,size.x,size.y),"999/999");
         //draw the filled-in part:
         GUI.BeginGroup(new Rect(0,0, size.x * energyDisplay, size.y));
          GUI.Box(new Rect(0,0, size.x, size.y), fullTex);
         GUI.EndGroup();
       GUI.EndGroup();
		
	}
	
	void setupSkillIcons()
	{
			GUI.BeginGroup(new Rect(barPosX, barPosY - 2*size.y, size.x, size.y*2));
				GUI.Box (new Rect (0*(barPosX/arrayOfIcons.Length)*2,0,(barPosX/arrayOfIcons.Length)*2,size.y*2), arrayOfIcons[0]);
				GUI.Box (new Rect (1*(barPosX/arrayOfIcons.Length)*2,0,(barPosX/arrayOfIcons.Length)*2,size.y*2), arrayOfIcons[1]);
				GUI.Box (new Rect (2*(barPosX/arrayOfIcons.Length)*2,0,(barPosX/arrayOfIcons.Length)*2,size.y*2), arrayOfIcons[2]);
				GUI.Box (new Rect (3*(barPosX/arrayOfIcons.Length)*2,0,(barPosX/arrayOfIcons.Length)*2,size.y*2), arrayOfIcons[3]);
				GUI.Box (new Rect (4*(barPosX/arrayOfIcons.Length)*2,0,(barPosX/arrayOfIcons.Length)*2,size.y*2), arrayOfIcons[4]);
				GUI.Box (new Rect (5*(barPosX/arrayOfIcons.Length)*2,0,(barPosX/arrayOfIcons.Length)*2,size.y*2), arrayOfIcons[5]);
			GUI.EndGroup();
		
	}
	
	void setupCharacterIcon()
	{
		GUI.Box (new Rect(barPosX-iconSize.x,barPosY-iconSize.y,iconSize.x,iconSize.y), playerIcon);
	}
	
	void debugStats()
	{
		
	}
	
}