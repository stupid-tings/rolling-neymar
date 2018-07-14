class Over extends Phaser.Scene {
  constructor() {
    super({
      key: 'Over'
    })
  }
  preload() {
    this.load.image('red', 'assets/particles/red.png');
    this.load.image('over_bg', 'assets/background/over.png')
  }

  create() {
    this.add.image(400, 300, 'over_bg');
    this.text = this.add.text(0, 0, 'OH BOY ITS COMMING HOME')
  }
}
