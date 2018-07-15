const MAX_LENGTH = 14;

class Menu extends Phaser.Scene {
  constructor() {
    super({
      key: "Menu"
    });
  }
  preload() {
    this.load.image("button", "assets/sprites/button.png");
    this.load.image("background", "assets/background/start.jpg");
    this.load.image("logo", "assets/sprites/game-logo.png");
    this.loading = true;
  }

  create() {
    localStorage.removeItem("player");
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
    const logo = this.add.image(width / 2, 80, "logo");
    logo.setScale(0.5);
  }

  update(delta) {
    const backspace = this.input.keyboard.addKey(8);
    const enter = this.input.keyboard.addKey(13);

    if (backspace.isDown) {
      this.input_name.length && this.player_name.destroy();
      this.input_name.pop();
      this.player_name = this.add.text(
        window.outerWidth / 2 - 160,
        224,
        String.fromCharCode.apply(null, this.input_name),
        {
          fontSize: 24,
          backgroundColor: "#000"
        }
      );
      backspace.isDown = false;
    }
    for (let i = 65; i >= 65 && i <= 90; i++) {
      const key = this.input.keyboard.addKey(i);
      if (!this.player && key.isDown) {
        if (this.input_name.length <= MAX_LENGTH) {
          this.input_name.length && this.player_name.destroy();
          this.input_name.push(i);
          this.player_name = this.add.text(
            window.outerWidth / 2 - 160,
            224,
            String.fromCharCode.apply(null, this.input_name),
            {
              fontSize: 24,
              backgroundColor: "#000"
            }
          );
        }
        key.isDown = false;
      }
    }
    for (let i = 48; i >= 48 && i <= 57; i++) {
      const key = this.input.keyboard.addKey(i);
      if (!this.player && key.isDown) {
        if (this.input_name.length <= 24) {
          this.input_name.length && this.player_name.destroy();
          this.input_name.push(i);
          this.player_name = this.add.text(
            window.outerWidth / 2 - 160,
            224,
            String.fromCharCode.apply(null, this.input_name),
            {
              fontSize: 24,
              backgroundColor: "#000"
            }
          );
        }
        key.isDown = false;
      }
    }
    if (this.key_enter.isDown) {
      if (this.input_name.length) {
        // this.player = String.fromCharCode.apply(null, this.input_name);
        localStorage.setItem("player", this.player);
        // this.showName(this.player);
        this.loading = false;
        this.scene.start("Game");
      }
    }
  }

  showName(player) {
    const middle = window.outerWidth / 2 - 160;
    const createText = (text, posY) =>
      this.add.text(middle, 150 + posY * 25, text, {
        fontSize: 24,
        fontFamily: "Sans-serif"
      });
    if (!player) {
      this.text1 = createText("You r new! Enter ya name!", 1);
      this.text2 = createText("_________________________", 3);
    } else {
      if (this.text1 || this.text2) {
        this.text1.destroy();
        this.text2.destroy();
        this.player_name.destroy();
      }
      createText(`Hello ${player}`, 2);
    }
    dbRef.child(`${player}`).once("value", s => {
      if (s.exists()) {
        const scoreText = `Your high score :: ${s.val()}`;
        createText(scoreText, 2);
      }
      this.loading = false;
    });
  }
}
