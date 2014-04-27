using UnityEngine;
using System.Collections;

public class Bullet : MonoBehaviour {
	
	public int speed = 2000;
	public int bulletLife = 15;
	public int pierceCount = 0;
	public Vector3 bulletDirection;
	
	// Use this for initialization
	void Start () {
		//rigidbody.AddForce(transform.forward * speed);
		//rigidbody.AddForce(Camera.main.transform.forward*speed);
		Destroy(gameObject, bulletLife);
	}
	
	// Update is called once per frame
	void Update () {

	}
	
	public void ApplyForce(Vector3 Direction)
	{
		rigidbody.AddForce(Direction*speed);
	}
}
