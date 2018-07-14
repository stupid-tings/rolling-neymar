class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game"
    });
    this.enamies = [];
  }
  preload() {
    this.load.image("field", "assets/background/grass.png");
    this.load.spritesheet("neymar", "assets/sprites/neymar.png", {
      frameWidth: 90,
      frameHeight: 30
    });
    this.load.spritesheet("ball", "assets/sprites/ball.png", {
      frameWidth: 28,
      frameHeight: 27
    });
  }

  create() {
    this.field = this.add.tileSprite(0, 0, 10000, 10000, "field");

    this.cursors = this.input.keyboard.createCursorKeys();
    this.neymar = this.physics.add.sprite(100, 450, "neymar");
    this.neymar.setBounce(0.2);
    this.neymar.setCollideWorldBounds(true);

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("neymar", { start: 0, end: 12 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("neymar", { start: 0, end: 12 }),
      frameRate: 10,
      repeat: 1
    });

    this.score = 0;
    this.lives = 3;
    this.scoreBoard = this.add.text(0, 0, "SCORE: 0");
    this.liveBoard = this.add.text(700, 0, "LIVES: 2");

    // this.physics.add.sprite(300, 500, 'ball')

    this.anims.create({
      key: "balling",
      frames: this.anims.generateFrameNumbers("ball", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.interval = setInterval(() => {
      if (this.score > 10) {
        this.spawnEnemy();
      }
      this.spawnEnemy();
    }, 500);
  }

  spawnEnemy() {
    const Enemy = (x, y, texture) => {
      const enemy = this.physics.add.sprite(x, y, "ball");
      // enemy.setBounce(0.2);
      // enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(-parseInt(this.score + 200));
      enemy.anims.play("balling", true);
      this.physics.add.overlap(this.neymar, enemy, () => {
        enemy.setVelocityX(Phaser.Math.RND.integerInRange(0, 1000));
        enemy.setVelocityY(Phaser.Math.RND.integerInRange(-1000, 1000));
        if (this.colliding) return;
        this.colliding = true;
        // this.lives -= 1
        this.liveBoard.setText(`LIVES: ${parseInt((this.lives -= 1))}`);
        if (this.lives <= 0) {
          clearInterval(this.interval);
          this.neymar.setVelocityY(0);
          localStorage.setItem("scores", parseInt(this.score));
          this.scene.start("Over");
        }
        setTimeout(() => {
          this.colliding = false;
        }, 2000);
      });
      return enemy;
    };
    const x = 800; //Phaser.Math.RND.integerInRange(0, 800)
    const y = Phaser.Math.RND.integerInRange(0, 600);
    const cloneNeymar = Enemy(x, y, "ball");
    this.enamies.push(cloneNeymar);
  }

  update(delta) {
    this.score += 0.07;
    this.scoreBoard.setText(`SCORE: ${parseInt(this.score)}`);
    if (this.cursors.down.isDown) {
      this.neymar.y += neymarMoving;
      this.field.y -= backgroundMoving;
      this.neymar.setVelocityY(100);
      this.neymar.anims.play("down", true);
    }
    if (this.cursors.up.isDown) {
      this.neymar.y -= neymarMoving;
      this.field.y += backgroundMoving;
      this.neymar.setVelocityY(-100);
      this.neymar.anims.play("up", true);
    }
    if (this.cursors.left.isDown) {
      this.neymar.x -= neymarMoving;
      this.field.x += backgroundMoving;
    }
    if (this.cursors.right.isDown) {
      this.neymar.x += neymarMoving;
      this.field.x -= backgroundMoving;
    }
    // if (this.key_enter.isDown) {
    //   this.spawnEnemy()
    // }
  }
}

const backgroundMoving = 1;
const neymarMoving = 7;
