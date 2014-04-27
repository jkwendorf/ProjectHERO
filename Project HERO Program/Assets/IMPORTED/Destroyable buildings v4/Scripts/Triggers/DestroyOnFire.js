#pragma strict

private var flaming : boolean = false;
var ignitionHeat = 100.0;
var hitpoints = 100.0;
private var lastBurn = 0.2;
var flames : Transform;
var destroyer : GameObject;		// Leave blank if this is the breakable part/object itself.

function Start () {
	if (destroyer == null) {
		destroyer = gameObject;
	}
}

function Burning (heat : float) {
	if (heat >= ignitionHeat) {
		if (Time.time > lastBurn + 0.25) {
			if (flaming == false) {
				var fl = Instantiate(flames, transform.position, transform.rotation);
				fl.parent = transform;
				flaming = true;
			}
			hitpoints -= heat * 0.05;
			lastBurn = Time.time;
		}
		if (hitpoints <= 0.0) {
			destroyer.SendMessage("InternalBreakObject");
		}
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Trigger/On fire")