#pragma strict

var localSpace : boolean = true;
var speed = Vector3(0.0, 0.0, 40.0);

function Start () {
	if (localSpace == false) {
		rigidbody.velocity = speed;
	}
	else {
		rigidbody.velocity = transform.right * speed.x + transform.up * speed.y + transform.forward * speed.z;
	}
}