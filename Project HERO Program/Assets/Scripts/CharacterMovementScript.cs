using UnityEngine;
using System.Collections;

public class CharacterMovementScript : MonoBehaviour {
	
	public GameObject BulletPrefab;
	public GameObject PierceBulletPrefab;
	
	float speed;
	float jumpHight = 200.0f;
	public float walkSpeed = 5.0f;
	public float sprintSpeed = 20.0f;
	
	float currentTime = 0.0f;
	public float shotDelay = 1.0f;
	bool shot = false;
	float altFieldOfView = 25.0f;
	
	KeyCode up = KeyCode.W;
	KeyCode down = KeyCode.S;
	KeyCode left = KeyCode.A;
	KeyCode right = KeyCode.D;
	KeyCode sprint = KeyCode.LeftShift;
	KeyCode jump = KeyCode.Space;
	KeyCode lockC = KeyCode.C;
	KeyCode unlockC = KeyCode.X;
	bool isJumping = false;
	//bool isOnGround = true;
	
	int leftMouse = 0;
	int rightMouse = 1;
	
	void Update () {
		
		if(shot)
			currentTime += Time.deltaTime;
		//Jump
		if (Input.GetKeyDown(jump) && isJumping == false)
		{
			transform.rigidbody.AddForce(Vector3.up * jumpHight);
			isJumping = true;
		}
		
		//Sprint
		if(Input.GetKey(sprint))
			speed = sprintSpeed;
		else 
			speed = walkSpeed;
		// Check up
		if(Input.GetKey(up))
			transform.Translate(new Vector3(0,0,speed*Time.deltaTime));
		// Check down
		if(Input.GetKey(down))
			transform.Translate(new Vector3(0,0,-speed*Time.deltaTime));
		//Check left
		if(Input.GetKey (left))
			transform.Translate (new Vector3(-speed*Time.deltaTime,0,0));
		//Check right
		if(Input.GetKey (right))
			transform.Translate (new Vector3(speed*Time.deltaTime,0,0));
		
		// Lock the screen
		if (Input.GetKey(lockC))
		{
			Screen.lockCursor = true;
		}
		
		// Lock the screen
		if (Input.GetKey(unlockC))
		{
			Screen.lockCursor = false;
		}
		
		if(Input.GetMouseButton(leftMouse) && !shot)
		{
			GameObject bullet = ((GameObject)Instantiate(BulletPrefab, Camera.main.transform.FindChild("BulletSpawn").transform.position, Quaternion.identity));
			bullet.GetComponent<Bullet>().ApplyForce(Camera.main.transform.forward);
			shot = true;
		}
		if(Input.GetKeyDown(KeyCode.Alpha3) &!shot)
		{
			GameObject PierceBullet = ((GameObject)Instantiate(PierceBulletPrefab, Camera.main.transform.FindChild("BulletSpawn").transform.position, Quaternion.identity));	
			PierceBullet.GetComponent<PierceBullet>().setDirection(Camera.main.transform.forward);
			PierceBullet.GetComponent<PierceBullet>().applyForce();
			shot = true;
		}
		if(currentTime > shotDelay)
		{
			currentTime = 0.0f;
			shot = false;
		}
		if(Input.GetMouseButtonUp(rightMouse))
		{
			float temp = Camera.main.fieldOfView;
			Camera.main.fieldOfView = altFieldOfView;
			altFieldOfView = temp;
		}
	}
	
	void OnCollisionEnter(Collision collision)
	{
		if (collision.gameObject.tag == "Floor" && isJumping == true)
			//if (transform.position.y-(transform.localScale.y/2) >= collision.gameObject.transform.position.y + (collision.gameObject.transform.localScale.y/2) && isJumping == true)
			//Wrote the upper line of code to take care of landing problems, if it sucks you can ditch it. - Dante. 
		{
			isJumping = false;
		}
	}
}