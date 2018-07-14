class Over extends Phaser.Scene {
  constructor() {
    super({
      key: "Over"
    });
  }
  preload() {
    this.load.audio('cry', 'assets/sounds/cry.mp3')
    this.load.image("over_bg", "assets/background/over.jpg");
  }

  create() {
    const centerX = window.outerWidth / 2;
    const centerY = window.outerHeight / 2;
    const scores = localStorage.getItem("scores");
    this.add.image(centerX, centerY, "over_bg");
    const string_text = `Your score:: ${scores}`;
    this.text = this.add.text(centerX - 200, 20, string_text, {
      fontSize: 36
    });
    this.text = this.add.text(
      centerX - 300,
      50,
      "Press Enter to bring Him home",
      {
        fontSize: 36
      }
    );
    this.key_enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.cry = this.sound.add('cry')
    this.cry.play()
    const player = localStorage.getItem("player");
    dbRef.child(player).set(parseInt(scores));
  }

  update() {
    if (this.key_enter.isDown) {
      this.scene.start("Menu");
      this.key_enter.isDown = false;
    }
  }
}
