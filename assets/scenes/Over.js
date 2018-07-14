class Over extends Phaser.Scene {
  constructor() {
    super({
      key: "Over"
    });
  }
  preload() {
    this.load.image("red", "assets/particles/red.png");
    this.load.image("over_bg", "assets/background/over.png");
  }

  create() {
    const scores = localStorage.getItem("scores");
    this.add.image(400, 300, "over_bg");
    this.text = this.add.text(0, 0, `Your score:: ${scores}`, 36);
    this.key_enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    dbRef.child("staging").set(parseInt(scores));
  }

  update() {
    if (this.key_enter.isDown) {
      this.scene.start("Menu");
    }
  }
}
