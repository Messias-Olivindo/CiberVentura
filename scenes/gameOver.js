//Definindo a cena game Over
class GameOver extends Phaser.Scene {
    //construtor da cena
    constructor() {
        super({
            key: 'GameOver',
        })
    }

    //Carregar elemento
    preload() {
        //Carregar o background
        this.load.image('bgEscuro', "assets/bgFim.png");
    }

    //Adicionar os elementos
    create() {
        //Adicionar o background
        this.bgFim = this.add.tileSprite(this.game.config.width / 2, this.game.config.height / 2, this.game.config.width * 2, this.game.config.height, 'bgEscuro');

        //Adicionar texto de fim de jogo
        this.add.text(
            this.game.config.width / 4,
            this.game.config.height / 4,
            'Fim de jogo',
            {
                fontSize: '60px',
                fill: '#ffffff',
                fontFamily: 'glitchRobot'
            }
        );

        //Adicionar botão para reiniciar o jogo
        this.retangulo = this.add.rectangle(
            (this.game.config.width/4) + 165,
            (this.game.config.height/4) + 115,
            200,
            50,
            0x211C84
        )
        .setOrigin(0.5)
        .setInteractive();
        this.retangulo.on('pointerdown', () => {
            this.scene.start('CiberVentura', this.game);
        })
        this.add.text( //texto do botão
            (this.game.config.width/4) + 80,
            (this.game.config.height/4) + 100,
            'Reiniciar',
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontFamily: 'glitchRobot'
            }
        );
        console.log(pontAnterior);
    }

    //Realizar ações
    update() {
        //Movimento do fundo
        this.bgFim.tilePositionX += 1;
    }


}