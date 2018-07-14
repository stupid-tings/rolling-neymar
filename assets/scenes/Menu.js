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
        this.player = player;
      } else {
        this.add.text(20, 200, "You r new! Enter ya name!", { fontSize: 24 });
        this.add.text(20, 260, "_________________________", { fontSize: 24 });
        // show input name
      }
    });
    this.input_name = [];
  }

  update(delta) {
    const backspace = this.input.keyboard.addKey(8);
    const enter = this.input.keyboard.addKey(13);

    if (backspace.isDown) {
      this.input_name.length && this.player_name.destroy();
      this.input_name.pop();
      this.player_name = this.add.text(
        20,
        250,
        String.fromCharCode.apply(null, this.input_name),
        {
          fontSize: 24
        }
      );
      backspace.isDown = false;
    }
    for (let i = 65; i >= 65 && i <= 90; i++) {
      const key = this.input.keyboard.addKey(i);
      if (key.isDown) {
        if (this.input_name.length <= 24) {
          this.input_name.length && this.player_name.destroy();
          this.input_name.push(i);
          this.player_name = this.add.text(
            20,
            250,
            String.fromCharCode.apply(null, this.input_name),
            {
              fontSize: 24
            }
          );
        }
        key.isDown = false;
      }
    }
    if (this.key_enter.isDown) {
      if (this.player) {
        this.scene.start("Game");
        this.key_enter.isDown = false;
      } else {
        if (this.input_name.length) {
          this.player = String.fromCharCode.apply(null, this.input_name);
          localStorage.setItem("player", this.player);
        }
      }
    }
  }
}
