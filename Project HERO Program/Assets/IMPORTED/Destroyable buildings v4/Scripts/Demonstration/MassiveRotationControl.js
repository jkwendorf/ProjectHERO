#pragma strict

var on : boolean = true;				// Wether all objects should rotate.
var rotSpeed = Vector3(0.0, 0.25, 0.0);	// Rotation speed along all axis.

var targets : Transform[];				// All objects that are rotated.

function Start () {

}

function FixedUpdate () {
	if (on == true) {
		for (var target : Transform in targets) {
			if (target != null) {
				target.Rotate(rotSpeed * Time.deltaTime);
			}
		}
	}
}