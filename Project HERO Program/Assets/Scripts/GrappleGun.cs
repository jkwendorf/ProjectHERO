using UnityEngine;
using System.Collections;

public class GrappleGun : MonoBehaviour {

	public KeyCode launchGrab = KeyCode.Alpha1;
	public float modelThickness = 1.0f;
	public float maxGrappleDistance = 20.0f;
	public float coolDown = 1.0f;
	
	bool hasHit = false;
	bool toggleGrapple = false;//false not grappling, true is grappling
	bool hasReached = false;
	bool onCoolDown = false;
	
	float buttonTimer = 0.0f;
	float coolDownTimer = 0.0f;
	
	float buttonDelay = 1.0f;
	

	Vector3 desiredPosition;

	void Start () {
	}
	void Update () 
	{
		
		Ray ray = Camera.mainCamera.ScreenPointToRay(Input.mousePosition);
		RaycastHit hit;
		
		
		if(hasHit)
			buttonTimer += Time.deltaTime;
		
		if (Input.GetKey(launchGrab) && !hasHit && !toggleGrapple && !onCoolDown)

		{
			//changes the hasHit flag and changes the desired position to the hitray point also, if not in range nothing will happen
			if(Physics.Raycast(ray, out hit) && hit.distance <= maxGrappleDistance)
			{
				//flag changes
				hasHit = true;
				toggleGrapple = true;
				//sets the desired postions
				desiredPosition = hit.point;
				
				/*these ifs statements make it so that depending in which direction you are appraching
				  the desired grappling point the vector for the desiredPostiton gets reduced (or increased)
				  so that you dont clip to things*/
				if(desiredPosition.x - transform.position.x <= 0)
					desiredPosition.x = hit.point.x + (modelThickness);
				else desiredPosition.x = hit.point.x - (modelThickness);
				if(desiredPosition.z - transform.position.z <= 0)
					desiredPosition.z = hit.point.z + (modelThickness);
				else desiredPosition.z = hit.point.z - (modelThickness);
			}
		}
		if(toggleGrapple && !hasReached) //Checks to see if the player is still grappling and has not reached destination
		{
			Vector3 temp = desiredPosition - transform.position; //point b - point a so that we can the desired vector direction and magnitude	
			
			//if the magnitude of the temp vector is one or less then it assumes the character has reached the destination
			if(temp.magnitude <=1)
			{
				hasReached = true;
			}
			else
			{
				//adds the normal components to the current postion.	
				transform.position += temp.normalized;
			}
		}
		
		if(toggleGrapple && hasReached)//character has reached destination
		{
			transform.position = desiredPosition;//makes sure the player stays in its current position
			
		}
		if(buttonTimer > buttonDelay && Input.GetKey(launchGrab) && toggleGrapple )
		{
			rigidbody.velocity = new Vector3(0,-10,0);//cancels out the gravitational potential energy. 
			onCoolDown = true;
			buttonTimer = 0.0f;
			toggleGrapple = false;
			hasReached = false;
			hasHit = false;
		}
		//---------------This whole Section deals with the CoolDown-----------------
		if(onCoolDown)
		{
			coolDownTimer += Time.deltaTime;
			if(coolDownTimer > coolDown)
			{
				onCoolDown = false;
				coolDownTimer = 0.0f;
			}
		}
	}
}
