class Menu extends Phaser.Scene {
  constructor() {
    super({
      key: "Menu"
    });
  }
  preload() {
    this.load.image("red", "assets/particles/red.png");
    this.load.image("background", "assets/background/start.jpg");
  }

  create() {
    const player = localStorage.getItem("player") || "staging";
    this.add.image(400, 300, "background");
    this.key_enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    dbRef.child(`${player}`).once("value", s => {
      if (s.exists()) {
        this.add.text(0, 0, s.val(), 30, 30);
      } else {
        // show input name
      }
    });
  }

  update(delta) {
    if (this.key_enter.isDown) {
      this.scene.start("Game");
    }
  }
}
