using UnityEngine;
using System.Collections;

public class CrosshairScript : MonoBehaviour {

	public Texture2D crosshair;
	public Texture2D crosshairEnemy;
	private Rect position;
	private bool isEnemy = false;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {


		position = new Rect((Screen.width - crosshair.width) / 2, (Screen.height - crosshair.height) / 2, 
		               		crosshair.width, crosshair.height);
		EnemyCrosshair();
		

	}

	void OnGUI()
	{
		if(isEnemy && Time.timeScale != 0)
		{
			GUI.DrawTexture(position, crosshairEnemy);
		}

		else if(Time.timeScale != 0)
		{
			GUI.DrawTexture(position, crosshair);
		}

	

	}

	void EnemyCrosshair()
		{
			isEnemy = false;
			Transform focusObj = null;
	
			Ray ray = new Ray(Camera.main.transform.position, Camera.main.transform.forward);
			RaycastHit hit = new RaycastHit();
	
			if(Physics.Raycast(ray, out hit))
			{
				focusObj = hit.transform;
			}
	
			if(focusObj)
			{
				Health h = focusObj.transform.GetComponent<Health>();
				
				while(h == null && focusObj.transform.parent)
				{
					focusObj = focusObj.parent;
					h = focusObj.transform.GetComponent<Health>();
				}
	
				if(h != null)
				{
					isEnemy = true;
				}
	
			}
	
		}
}
