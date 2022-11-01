#pragma strict

public class LabelFrameAnimator {
	private var label : Label;
	private var sprite : TileSprite;
	private var prefix : String;
	private var frameCount : int;
	private var frameRate : float;
	
	private var time : float;
	private var frameIndex : int;
	private var playing : boolean;
	
	public function get IsPlaying() : boolean {
		return playing;
	}
	
	private function set FrameIndex(value : int) {
		frameIndex = value % frameCount;
		label.tile = sprite.GetTile(String.Format("{0}{1}", prefix, frameIndex));
	}
	
	private function get FrameIndex() : int {
		return frameIndex;
	}

	public function LabelFrameAnimator(label : Label, sprite : TileSprite, prefix : String, frameCount : int, frameRate : float) {
		label.useTile = true;
		label.tile = sprite.GetTile(null);
		this.label = label;

		this.sprite = sprite;
		this.prefix = prefix;
		this.frameCount = frameCount;
		this.frameRate = frameRate;
		
		playing = false;
	}
	
	public function Play() {
		playing = true;
		FrameIndex = Random.Range(0, frameCount - 1);
	}
	
	public function Stop() {
		this.playing = false;
	}
	
	public function Update() {
		if (!playing || !label.isVisible()) {
			return;
		}
		time += Time.deltaTime;
		if (time > 1f / frameRate) {
			time = 0;
			FrameIndex += 1;
		}
	}
}