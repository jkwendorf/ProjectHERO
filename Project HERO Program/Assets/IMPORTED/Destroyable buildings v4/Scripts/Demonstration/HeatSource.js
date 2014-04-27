#pragma strict

var heat = 100.0;
var interval = 0.01;
private var last = 0.01;

function Start () {

}

function OnTriggerStay (coll : Collider) {
	if (Time.time > last + interval) {
		coll.gameObject.SendMessage("Burning", heat, SendMessageOptions.DontRequireReceiver);
		last = Time.time;
	}
}