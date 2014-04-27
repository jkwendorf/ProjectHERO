using UnityEngine;
using System.Collections;

public class PlayerShooting : MonoBehaviour {


	public float damage = 25f;
	public float fireRate = 0.5f;
	private float cooldown = 0;

	void Start(){

	}

	// Update is called once per frame
	void Update () 
	{
		cooldown -= Time.deltaTime;


		if(Input.GetButton("Fire1"))
		{
			Fire();
		}
	}

	void Fire()
	{
		if(cooldown > 0)
		{
			return;
		}

		Debug.Log ("Firing our gun!");

		Ray ray = new Ray(Camera.main.transform.position, Camera.main.transform.forward);
		Transform hitTransform;
		Vector3 hitPoint;

		hitTransform = FindClosestObject(ray, out hitPoint);

		if(hitTransform != null)
		{
			Debug.Log("We hit: " + hitTransform.transform.name);

			Health h = hitTransform.GetComponent<Health>();

			while(h == null && hitTransform.parent)
			{
				hitTransform = hitTransform.parent;
				h = hitTransform.GetComponent<Health>();
			}

			//Here the hitTransform might not be the hitTransform we started with

			if(h != null)
			{
				h.TakeDamage(damage);
			}
		}

		cooldown = fireRate;
	}

	Transform FindClosestObject(Ray ray, out Vector3 hitPoint)
	{
		RaycastHit[] hits = Physics.RaycastAll(ray);

		Transform closestHit = null;
		float distance = 0;
		hitPoint = Vector3.zero;

		foreach(RaycastHit hit in hits)
		{
			if(hit.transform != this.transform && (closestHit == null || hit.distance < distance))
			{
				closestHit = hit.transform;
				distance = hit.distance;
				hitPoint = hit.point;
			}
		}

		return closestHit;
	}


}






























