using UnityEngine;
using System.Collections;

public class InvisibleScript : MonoBehaviour {
	
	
	public Material defaultMaterial;
	public Material invisibleMaterial;
	KeyCode invis = KeyCode.Z;
	bool isInvis = false;
	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
	if(Input.GetKeyDown(invis))
		{
			if(!isInvis)
			{
				renderer.material = invisibleMaterial;
				isInvis = true;
			}
			else
			{
				renderer.material = defaultMaterial;
				isInvis = false;
			}
		}
	}
}
