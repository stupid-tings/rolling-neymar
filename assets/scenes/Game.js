class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game'
    })
    this.enamies = []
  }
  preload() {
    this.load.image('field', 'assets/background/grass.png')
    this.load.spritesheet('neymar', 'assets/sprites/dude.png', { frameWidth: 30, frameHeight: 30 })
  }

  create() {
    this.field = this.add.tileSprite(0, 0, 10000, 10000, 'field')

    const tween = this.tweens.addCounter({
      from: 1,
      to: 2,
      duration: 5000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    this.key_enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

    this.cursors = this.input.keyboard.createCursorKeys();
    this.neymar = this.physics.add.sprite(100, 450, 'neymar')
    this.neymar.setBounce(0.2);
    this.neymar.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('neymar', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'neymar', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('neymar', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.score = 0
    this.lives = 2
    this.scoreBoard = this.add.text(0, 0, 'SCORE: 0')
    this.liveBoard = this.add.text(700, 0, 'LIVES: 2')
    this.interval = setInterval(() => {
      this.spawnEnamy()
    }, 500)
  }

  spawnEnamy() {
    const Enamy = (x, y, texture) => {
      const enamy = this.physics.add.sprite(x, y, texture)
      enamy.setVelocityX(Phaser.Math.RND.integerInRange(-100, -1000))
      this.physics.add.overlap(this.neymar, enamy, () => {
        if (this.colliding) return
        this.colliding = true
        this.lives -= 1
        this.liveBoard.setText(`LIVES: ${parseInt(this.lives)}`)
        if (this.lives <= 0) {
          clearInterval(this.interval)
          this.scene.start('Over');
        }
        setTimeout(() => {
          this.colliding = false
        }, 2000)

      })
      return enamy
    }
    const x = 800 //Phaser.Math.RND.integerInRange(0, 800)
    const y = Phaser.Math.RND.integerInRange(0, 600)
    const cloneNeymar = Enamy(x, y, 'neymar')
    this.enamies.push(cloneNeymar)
  }

  update(delta) {
    this.score += 0.07
    this.scoreBoard.setText(`SCORE: ${parseInt(this.score)}`)
    // this.spawnEnamy()
    if (this.cursors.down.isDown) {
      this.neymar.y += neymarMoving
      this.field.y -= backgroundMoving
    }
    if (this.cursors.up.isDown) {
      this.neymar.y -= neymarMoving
      this.field.y += backgroundMoving
    }
    if (this.cursors.left.isDown) {
      this.neymar.x -= neymarMoving
      this.field.x += backgroundMoving
      this.neymar.setVelocityX(-100);
      this.neymar.anims.play('left', true);
    }
    if (this.cursors.right.isDown) {
      this.neymar.x += neymarMoving
      this.field.x -= backgroundMoving
      this.neymar.setVelocityX(100);
      this.neymar.anims.play('right', true);
    }
    if (this.key_enter.isDown) {
      this.spawnEnamy()
    }
  }
}

const backgroundMoving = 1
const neymarMoving = 7
