#pragma strict

var destination : GameObject;
var modifier = 1.0;

function Start () {

}

function ApplyDamage (dmg : float) {
	if (destination != null) {
		destination.SendMessage("ApplyDamage", dmg * modifier);
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Trigger/Forward damage message")