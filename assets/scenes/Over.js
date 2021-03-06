class Over extends Phaser.Scene {
  constructor() {
    super({
      key: "Over"
    });
  }
  preload() {
    this.load.audio("cry", "assets/sounds/cry.mp3");
    this.load.image("over_bg", "assets/background/over.png");
  }

  create() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scores = localStorage.getItem("scores");
    this.add.image(centerX, centerY, "over_bg");
    const string_text = `YOUR SCORE IS ${scores}`;
    this.text = this.add.text(centerX - 200, 20, string_text, {
      fontSize: 36
    });
    this.text = this.add.text(
      centerX - 300,
      50,
      "PRESS ENTER TO ROLL HIM HOME",
      {
        fontSize: 36,
        fontFamily: "Sans-serif"
      }
    );
    this.key_enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.cry = this.sound.add("cry");
    this.cry.play();
    const player = localStorage.getItem("player");
    dbRef.child(player).once("value", s => {
      const score_int = parseInt(scores);
      if (s.val() < score_int) {
        s.ref.set(score_int);
      }
    });
    dbRef
      .orderByValue()
      .limitToLast(10)
      .once("value", s => {
        console.log(s.val());
        this.topThree = s.val();
      });
  }

  update() {
    if (this.key_enter.isDown) {
      // this.scene.start("Menu");
      // this.key_enter.isDown = false;
      window.location.reload();
    }
    if (this.topThree) {
      this.add.text(20, 20, "LEADER BORED", { fontSize: 36 });
      Object.keys(this.topThree)
        .sort((a, b) => this.topThree[b] - this.topThree[a])
        .map((player_name, i) => {
          const createText = (text, posX) =>
            this.add.text(posX, 24 * (i + 3), `${text}`, {
              fontSize: 24,
              fontFamily: "Sans-serif"
            });

          createText(player_name, 10);
          createText(this.topThree[player_name], 280);
        });
    }
  }
}
