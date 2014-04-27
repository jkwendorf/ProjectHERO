#pragma strict

private var destroyed : boolean = false;
var minDamage = 2.0;
var hitpoints = 120.0;
var destroyer : GameObject;		// Leave blank if this is the breakable part/object itself.

function Start () {
	if (destroyer == null) {
		destroyer = gameObject;
	}
}

function ApplyDamage (dmg : float) {
	if (dmg > minDamage && destroyed == false) {
		hitpoints -= dmg;
		if (hitpoints <= 0.0) {
			destroyer.SendMessage("InternalBreakObject");
			destroyed = true;
		}
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Trigger/On damage")