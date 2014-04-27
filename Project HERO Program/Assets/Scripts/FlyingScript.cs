using UnityEngine;
using System.Collections;

public class FlyingScript : MonoBehaviour {

	public KeyCode flyUp = KeyCode.Q;
	public KeyCode flyDown = KeyCode.E;
	
	bool isFlying = false;
	bool onGround = true;
	
	public float flySpeed = 20.0f;
	void Start () {
	
	}

	void Update () 
	{
		if(Input.GetKey(flyUp))
		{
			transform.Translate(new Vector3(0,flySpeed*Time.deltaTime,0));
			rigidbody.velocity = new Vector3(0,0,0);
			rigidbody.useGravity = false;
			onGround = false;
			print ("gravity off");
		}
		if(Input.GetKey(flyDown) && !onGround)
		{
			transform.Translate(new Vector3(0,-flySpeed*Time.deltaTime,0));
			rigidbody.velocity = new Vector3(0,0,0);
			rigidbody.useGravity = false;
		}
		if(Input.GetKey(KeyCode.Space) && !onGround)
		{
			rigidbody.velocity = new Vector3(0,0,0);
		}
			
	
	}
	void OnCollisionEnter(Collision hit)
	{
		if(transform.position.y-(transform.localScale.y/2) >= hit.gameObject.transform.position.y + (hit.gameObject.transform.localScale.y/2))
		{
			rigidbody.useGravity = true;
			onGround = true;
			rigidbody.velocity = new Vector3(0,-10,0);
		}
			
			
	}
}
