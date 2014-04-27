using UnityEngine;
using System.Collections;

public class PierceBullet : Bullet { //inherited the bullet script

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	public void setDirection(Vector3 dir)
	{
		bulletDirection = dir;	//sets the bullets direction
	}
	
	public void applyForce()
	{
		rigidbody.AddForce(bulletDirection*speed);	//gives the direction force
		Destroy(gameObject, bulletLife);
	}
	
	public void setCount(int num)
	{
		pierceCount = num;
	}
}
