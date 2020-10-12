class SceneMain extends Phaser.Scene {
    constructor() {
      super({ key: "SceneMain" });
    //   var gameScore;

    }

    preload() {
        this.load.image("sprBg0", "content/sprBg0.png");
        this.load.image("sprBg1", "content/sprBg1.png");
        this.load.spritesheet("sprExplosion", "content/sprExplosion.png", {
        frameWidth: 32,
        frameHeight: 32
        });

        this.load.image("sprDart", "content/sprDart.png");
        this.load.image("sprPlayer", "content/sprPlayer.png");
        this.load.image("redBalloon", "content/redBalloon.png");

        this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
        this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");
        this.load.image("sprBtnPlayDown", "content/sprBtnPlayDown.png");
        this.load.image("sprBtnRestart", "content/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "content/sprBtnRestartHover.png");
        this.load.image("sprBtnRestartDown", "content/sprBtnRestartDown.png");

    }
  
    create() {
        var gameScore = 0;
        var highScore = 5;
        document.getElementById("highScore").innerHTML = "High Score: " + highScore;

        this.anims.create({
            key: "sprExplosion",
            frames: this.anims.generateFrameNumbers("sprExplosion"),
            frameRate: 20,
            repeat: 0
        });
      
        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprPlayer",
            0
          ); 
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerDarts = this.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: function() {


                //change the values to other balloons as desired for more features
                var enemy = null;

                if (Phaser.Math.Between(0, 10) >= 3) {
                  enemy = new RedBalloon(
                    this,
                    Phaser.Math.Between(0, this.game.config.width),
                    0
                  );
                }
                else if (Phaser.Math.Between(0, 10) >= 5) {
                  if (this.getEnemiesByType("RedBalloon").length < 5) {
            
                    enemy = new RedBalloon(
                      this,
                      Phaser.Math.Between(0, this.game.config.width),
                      0
                    );
                  }
                }
                else {
                  enemy = new RedBalloon(
                    this,
                    Phaser.Math.Between(0, this.game.config.width),
                    0
                  );
                }
            
                if (enemy !== null) {
                  //enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
                  this.enemies.add(enemy);
                }

            //   var enemy = new RedBalloon(
            //     this,
            //     Phaser.Math.Between(0, this.game.config.width),
            //     0
            //   );
            //   this.enemies.add(enemy);





            },
            callbackScope: this,
            loop: true
          });

        this.physics.add.collider(this.playerDarts, this.enemies, function(playerDart, enemy) {
            if (enemy) {
                if (enemy.onDestroy !== undefined) {
                  enemy.onDestroy();
                }
              
                enemy.pop(true);
                playerDart.destroy();
                // this.gameScore++;
                gameScore++;
                document.getElementById("gameScore").innerHTML = "Current Score: " + gameScore;
                if (gameScore > highScore){
                    highScore = gameScore;
                }
                document.getElementById("highScore").innerHTML = "High Score: " + highScore;

                // console.log(this.player.gameScore);
                //console.log(document.getElementById("gmaeScore").innerHTML);
              }
        });

        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead")) {
              player.pop(false);
              enemy.pop(true);
            }
          });
    }

    update(){
        if (!this.player.getData("isDead")) {
            this.player.update();
            if (this.keyW.isDown) {
              this.player.moveUp();
            }
            else if (this.keyS.isDown) {
              this.player.moveDown();
            }
            if (this.keyA.isDown) {
              this.player.moveLeft();
            }
            else if (this.keyD.isDown) {
              this.player.moveRight();
            }
          
            if (this.keySpace.isDown) {
              this.player.setData("isShooting", true);
            }
            else {
              this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
              this.player.setData("isShooting", false);
            }
          }
        

        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var enemy = this.enemies.getChildren()[i];
      
            enemy.update();

            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight) {
            
                if (enemy) {
                  if (enemy.onDestroy !== undefined) {
                    enemy.onDestroy();
                  }
            
                  enemy.destroy();
                }
            
            }
          }

          for (var i = 0; i < this.playerDarts.getChildren().length; i++) {
            var dart = this.playerDarts.getChildren()[i];
            dart.update();
      
            if (dart.x < -dart.displayWidth ||
                dart.x > this.game.config.width + dart.displayWidth ||
                dart.y < -dart.displayHeight * 4 ||
                dart.y > this.game.config.height + dart.displayHeight) {
              if (dart) {
                dart.destroy();
              }
            }
          }

        }
        

    getEnemiesByType(type) {
        var arr = [];
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
          var enemy = this.enemies.getChildren()[i];
          if (enemy.getData("type") == type) {
            arr.push(enemy);
          }
        }
        return arr;
      }


  }