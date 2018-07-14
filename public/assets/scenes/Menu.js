class Menu extends Phaser.Scene {
  constructor() {
    super({
      key: 'Menu'
    })
  }
  preload() {
    this.load.image('red', 'assets/particles/red.png');
    this.load.image('background', 'assets/background.jpg')
  }

  create() {
    this.add.image(800, 300, 'background');
    this.key_enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.text = this.add.text(0, 0, 'hello')
  }

  update(delta) {
    if (this.key_enter.isDown) {
      this.scene.start('Game');
    }
  }
}
