using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GameManager : MonoBehaviour {
	public static GameManager instance;
	public GameObject EnemyPrefab;
	public GameObject PierceBulletPrefab2;
	List<GameObject> enemies;

	List<float> enemySpawnTimes;
	float currentTime = 0;
	
	bool win = false;
	
	void Awake()
	{
		instance = this;
		enemySpawnTimes = new List<float>();
		enemySpawnTimes.Add(15.0f);
		//enemySpawnTimes.Add(60.0f);
		//enemySpawnTimes.Add(90.0f);
	}
	
	void OnApplicationClose()
	{
		for(int i = 0; i < enemies.Count; i++)
		{
			Destroy(enemies[i].gameObject);
		}
	}
	
	// Use this for initialization
	void Start () {
		enemies = new List<GameObject>();
		GenerateEnemies(5);
	}
	
	// Update is called once per frame
	void Update () {
		currentTime += Time.deltaTime;
		deleteEnemies ();
		
		if(currentTime > enemySpawnTimes[0] && enemySpawnTimes[0] != 0.0f && !win)
		{
			List<float> temp = new List<float>();
			
			for(int i = 1; i < enemySpawnTimes.Count; i++)
			{
				temp.Add(enemySpawnTimes[i]);
			}
			if(enemySpawnTimes.Count <= 1)
			{
				temp.Add(0.0f);
			}
			
			enemySpawnTimes = temp;
			GenerateEnemies(5);
		}
		
		if(enemySpawnTimes[0] == 0.0f && enemies.Count == 0)
		{
			win = true;
		}
		
		if(win)
		{
			Debug.Log ("Win");
		}
	}
	
	void GenerateEnemies(int enemy)
	{
		for(int i = 0; i < enemy; i++)
		{
			GameObject enemyObj = (GameObject)Instantiate(EnemyPrefab, new Vector3(i*3, 0, 0), Quaternion.identity);
			enemies.Add(enemyObj);
		}
	}
	
	bool checkForEnemies()
	{	
		return false;
	}
	
	void deleteEnemies()
	{
		List<GameObject> temp = new List<GameObject>();
		
		for(int i = 0; i< enemies.Count; i++)
		{
			if(enemies[i] != null)
			{
				temp.Add(enemies[i]);		
			}
		}
		enemies = temp;
	}
}
