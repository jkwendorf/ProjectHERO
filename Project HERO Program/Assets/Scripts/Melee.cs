using UnityEngine;
using System.Collections;

public class Melee : MonoBehaviour {
	int damage = 50;
	RaycastHit hit;
	public float distance;
	// Use this for initialization

	void Start () {
		
	
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetKeyUp(KeyCode.V)){
			if(Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), out hit)){
				distance = hit.distance;
				hit.transform.SendMessage("applydamage",damage, SendMessageOptions.DontRequireReceiver);
			}
			if(distance > 0 && distance <= 1){
				print("Melee hit");
				dealDmg(damage);
			}	
		}
	}
	public int dealDmg(int dmg){
		return dmg;
	}
}