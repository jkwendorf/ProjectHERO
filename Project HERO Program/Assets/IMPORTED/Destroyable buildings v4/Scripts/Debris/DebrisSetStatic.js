#pragma strict

var staticDelay = 3.0;
var staticMaterial : Material;

function Start () {
	Invoke("MakeItAllDamnStaticNow", staticDelay);
}

//function Update () {

//}

function MakeItAllDamnStaticNow () {
	var rbs = gameObject.GetComponentsInChildren(Rigidbody);
	for (var rb0 : Component in rbs) {
		if (staticMaterial != null) {
			rb0.gameObject.renderer.material = staticMaterial;
		}
		var rb = rb0.gameObject.GetComponent(Rigidbody);
		rb.gameObject.Destroy(rb.gameObject.GetComponent(Rigidbody));
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Debris/Debris set static")