class Menu extends Phaser.Scene {
  constructor() {
    super({
      key: "Menu"
    });
  }
  preload() {
    this.load.image("button", "assets/sprites/button.png");
    this.load.image("background", "assets/background/start.jpg");
    this.loading = true;
  }

  create() {
    const width = window.outerWidth;
    const height = window.outerHeight;
    const player = localStorage.getItem("player");
    this.add.image(width / 2, height / 2, "background");
    this.key_enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.showName(player);
    this.input_name = [];
    const button = this.add.sprite(width / 2, height - 200, "button");
    button.setInteractive();
    button.on("pointerdown", () => {
      if (!this.loading && this.player) {
        this.scene.start("Game");
        this.key_enter.isDown = false;
      }
    });
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
      if (!this.player && key.isDown) {
        if (this.input_name.length <= 24) {
          this.input_name.length && this.player_name.destroy();
          this.input_name.push(i);
          this.player_name = this.add.text(
            window.outerWidth / 2 - 160,
            150,
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
      if (this.input_name.length) {
        this.player = String.fromCharCode.apply(null, this.input_name);
        localStorage.setItem("player", this.player);
        this.loading = false;
      }
    }
  }

  showName(player) {
    dbRef.child(`${player}`).once("value", s => {
      const middle = window.outerWidth / 2 - 160;
      const createText = (text, posY) =>
        this.add.text(middle, 100 + posY * 25, text, {
          fontSize: 24,
          fontFamily: "Sans-serif"
        });
      if (s.exists()) {
        const scoreText = `Your last score : ${s.val()}`;
        createText(`Hello ${player}`, 1);
        createText(scoreText, 2);
        this.player = player;
        this.loading = false;
      } else {
        createText("You r new! Enter ya name!", 1);
        createText("_________________________", 3);
        // show input name
      }
    });
  }
}
