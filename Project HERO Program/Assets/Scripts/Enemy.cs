using UnityEngine;
using System.Collections;

public class Enemy : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
	
	void OnCollisionEnter(Collision hit)
	{
		if(hit.gameObject.tag == "Bullet")
		{
			int crit_range = 0; 
			crit_range = Random.Range(1, 100);
			if(crit_range >=75 && crit_range <=100)
			{
				print("critical hit sukka!"); //impliment damage and show critical animation or text on enemy
			}
			Destroy(hit.gameObject);
			
			Destroy(gameObject);
			//audio.Play();
			
		}
		if(hit.gameObject.tag == "PierceBullet"){
			
			if(hit.gameObject.GetComponent<Bullet>().pierceCount >= 3)
			{
				Destroy(hit.gameObject);
			}
			else
			{
				hit.gameObject.GetComponent<Bullet>().pierceCount++; 
				Destroy(gameObject);
				GameObject PierceBullet = ((GameObject)Instantiate(GameManager.instance.PierceBulletPrefab2, hit.gameObject.transform.position, Quaternion.identity));
				PierceBullet.GetComponent<PierceBullet>().setCount(hit.gameObject.GetComponent<Bullet>().pierceCount);
				PierceBullet.GetComponent<PierceBullet>().setDirection(Camera.main.transform.forward);
				PierceBullet.GetComponent<PierceBullet>().applyForce();
				Destroy (hit.gameObject);
			}
		}
	}
		
	
}