const WIDTH = window.outerWidth
const HEIGHT = window.outerHeight

class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game"
    });
    this.enamies = [];
    this.latestGivedLive = 0
  }
  preload() {
    this.load.image("field", "assets/background/grass.png");

    // Load sound
    this.load.audio('bgm', ['assets/sounds/bgm-theme.mp3'])
    this.load.audio('start-game', ['assets/sounds/start-game.mp3'])
    this.load.audio('ooh', ['assets/sounds/ooh.mp3'])
    this.load.audio('cheerup', ['assets/sounds/win-cheer-soccer.mp3'])

    // Load Sprites
    this.load.spritesheet("neymar", "assets/sprites/neymar.png", {
      frameWidth: 90,
      frameHeight: 30
    });
    this.load.spritesheet("ball", "assets/sprites/ball.png", {
      frameWidth: 28,
      frameHeight: 27
    });
    this.load.spritesheet('bandit', "assets/sprites/bandit.png", {
      frameHeight: 50,
      frameWidth: 50,
    })
    this.load.spritesheet('hero', 'assets/sprites/hero.png', {
      frameHeight: 60,
      frameWidth: 60,
    })
    this.load.spritesheet('undead', 'assets/sprites/undead.png', {
      frameHeight: 39,
      frameWidth: 70,
    })

  }

  create() {
    document.getElementById('rolling').style.display = 'none'
    this.field = this.add.tileSprite(0, 0, 10000, 10000, "field");

    this.cursors = this.input.keyboard.createCursorKeys();
    this.neymar = this.physics.add.sprite(100, 450, "neymar");
    this.neymar.setBounce(0.2);
    this.neymar.setCollideWorldBounds(true);

    const loopMarker = {
      name: 'loop',
      start: 0.4,
      duration: 7.9,
      config: {
        loop: true
      }
    };
    this.music = this.sound.add('bgm');
    this.ooh = this.sound.add('ooh')
    this.startEffectSound = this.sound.add('start-game')
    this.cheerup = this.sound.add('cheerup')

    this.music.addMarker(loopMarker)
    this.music.play('loop', {
      delay: 3,
    });
    this.cheerup.play()
    this.startEffectSound.play()

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


    //  Enemy Action
    this.anims.create({
      key: 'bandit-moving',
      frames: this.anims.generateFrameNumbers("bandit", { start: 0, end: 39 }),
      frameRate: 40,
      repeat: -1
    })
    this.anims.create({
      key: "ball-moving",
      frames: this.anims.generateFrameNumbers("ball", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "undead-moving",
      frames: this.anims.generateFrameNumbers("undead", { start: 0, end: 19 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "hero-moving",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 14 }),
      frameRate: 5,
      repeat: -1
    });

    this.score = 0;
    this.lives = 3;
    this.scoreBoard = this.add.text(0, 0, "SCORE: 0", {
      fontSize: 30,
    });
    this.liveBoard = this.add.text(0, 30, "LIVES: 3", {
      fontSize: 30,
    });

    // this.physics.add.sprite(300, 500, 'ball')
    this.interval = setInterval(() => {
      if (this.score > 10) {
        this.spawnEnemy();
      }
      if (this.score > 50) {
        this.spawnEnemy();
      }
      if (this.score > 80) {
        this.spawnEnemy();
      }
      if (this.score > 150) {
        this.spawnEnemy();
      }
      if (this.score > 200) {
        this.spawnEnemy();
      }
      this.spawnEnemy();
    }, 500);
  }

  spawnEnemy() {
    const Enemy = (x, y, texture) => {
      const enemy = this.physics.add.sprite(x, y, texture);
      // enemy.setBounce(0.2);
      // enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(-parseInt(this.score + 200) - Phaser.Math.RND.integerInRange(0, 400));
      enemy.flipX = 180
      enemy.anims.play(`${texture}-moving`, true);
      this.physics.add.overlap(this.neymar, enemy, () => {
        enemy.setVelocityX(Phaser.Math.RND.integerInRange(0, 1000));
        enemy.setVelocityY(Phaser.Math.RND.integerInRange(-1000, 1000));
        this.ooh.play()
        if (this.colliding) return;

        this.colliding = true;
        this.lives -= 1
        if (this.lives <= 0) {
          clearInterval(this.interval);
          this.neymar.setVelocityY(0);
          this.neymar.x = 100;
          this.neymar.y = 450;
          localStorage.setItem("scores", parseInt(this.score));
          this.music.stop()
          this.scene.start("Over");
        }
        setTimeout(() => {
          this.colliding = false;
        }, 2000);
      });
      return enemy;
    };
    const x = WIDTH; //Phaser.Math.RND.integerInRange(0, 800)
    const y = Phaser.Math.RND.integerInRange(0, HEIGHT);
    let enemy = 'ball'
    if (this.score > 50) {
      enemy = 'bandit'
    }
    if (this.score > 100) {
      enemy = 'undead'
    }
    if (this.score > 200) {
      enemy = 'hero'
    }
    Enemy(x, y, enemy);
  }

  update(delta) {
    this.score += 0.07;
    this.scoreBoard.setText(`SCORE: ${parseInt(this.score)}`);
    this.liveBoard.setText(`LIVES: ${parseInt((this.lives))}`);
    if (this.score - this.latestGivedLive > 100) {
      this.latestGivedLive = this.score
      this.lives += 1
    }
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
  destroy() {
    console.log('DESTroy')
  }
}

const backgroundMoving = 1;
const neymarMoving = 7;
