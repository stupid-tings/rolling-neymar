// import Menu from './Menu'

var config = {
  type: Phaser.AUTO,
  width: window.outerWidth,
  height: window.outerHeight,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 100 }
    }
  },
  scene: [Menu, Game, Over]
};

var game = new Phaser.Game(config);
