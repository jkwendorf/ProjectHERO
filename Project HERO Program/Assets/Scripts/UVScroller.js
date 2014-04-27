// Scroll main texture based on time

var scrollSpeed = 0.1;
function Update ()
{
	var offset = Time.time * scrollSpeed;

	if (renderer.enabled == true) {
		renderer.material.SetTextureOffset ("_BumpMap", Vector2(offset/-7.0, offset));
		renderer.material.SetTextureOffset ("_MainTex", Vector2(offset/10.0, offset));
	}
}