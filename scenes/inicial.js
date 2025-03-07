//Definir a cena inicial usando a biblioteca Phaser
class Inicial extends Phaser.Scene {
    //Construtor da cena
    constructor() {
        super({
            key: 'inicial'
        })
    }

    //Carregar os elementos
    preload() {
        this.load.image('bgInicio', "../bgInicio.png");
        //this.load.image('logo', "assets/ciberVenturaLogo.png")
    }

    //Adicionar os elementos
    create() {
        //Adicionar um background que se move
        this.bgCidade = this.add.tileSprite(this.game.config.width, this.game.config.height / 2, 2880, 1024, 'bgInicio').setScale(0.59);
        //this.logo = this.add.image(400, 200, 'logo')

        //Adicionar texto da logo
        this.textoLogo = this.add.text(
            this.game.config.width / 4,
            100,
            'CiberVentura',
            {
                fontSize: '60px', //tamanho da fonte
                fill: '#211C84',  //cor
                fontFamily: 'glitchRobot' //tipo da fonte
            }
        );

        //Adicionar um retangulo interativo
        this.retangulo = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 200, 50, 0x211C84).setOrigin(0.5).setInteractive(); //setInteractive indica que o elemento é interativo
        this.retangulo.on('pointerdown', () => { //.on indica o que ocorrerá quando o elemento for clicado, para isso é necessário definir o 'pointerdown' para indicar o evento de clique
            this.scene.start('ciberVentura', this.game); //Iniciar outra cena, sendo que o this.game guarda as informações obtidas nessa cena -uso futuro- 
        });

        //Adicionar um texto para iniciar o jogo
        this.textoIniciar = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'Iniciar',
            {
                fontSize: "24px",
                fill: '#ffffff',
                fontFamily: 'glitchRobot'
            }
        ).setOrigin(0.5);
        

    }

    update() {
        //Adiciona o movimento ao background
        this.bgCidade.tilePositionX += 1;
    }
}