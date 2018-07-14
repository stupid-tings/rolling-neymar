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
    const player = localStorage.getItem("player");
    this.add.image(window.outerWidth / 2, window.outerHeight / 2, "background");
    this.key_enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    dbRef.child(`${player}`).once("value", s => {
      if (s.exists()) {
        const scoreText = `Your last score : ${s.val()}`;
        this.add.text(0, 0, scoreText, { fontSize: 30 });
      } else {
        this.add.text(20, 200, "You r new! Enter ya name!", { fontSize: 24 });
        this.add.text(20, 260, "_________________________", { fontSize: 24 });
        // show input name
      }
    });
    // for (let i = 65; i >= 65 && i <= 90; i++) {
    //   const key = this.input.keyboard.addKey(i);
    //   if (key.isDown) {
    //     console.log(i);
    //   }
    // }
  }

  update(delta) {
    if (this.key_enter.isDown) {
      this.scene.start("Game");
      this.key_enter.isDown = false;
    }
  }
}
