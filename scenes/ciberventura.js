class CiberVentura extends Phaser.Scene {
    constructor() {
        super({
            key: 'ciberVentura', //nome da cena
            //  //Adicionar física
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true, //ativar o debug
                    gravity: { y: 400 } //definição da gravidade
                }
            }
        })

    }

    //Carregar os elementos
    preload() {
        //Carregar o tileset
        this.load.image('tiles', "../assets/mapas/tileset.png");
        //Carregar o tilemap em JSON
        this.load.tilemapTiledJSON('mapaTeste', "../assets/mapas/mapaTeste.json");

        //Carregar os pontos
        this.load.spritesheet('pontos', "../assets/pontos.png", { frameWidth: 21, frameHeigth: 7 })
    }

    //Adicionar os elementos
    create() {
        //Adicionar o tilemap
        this.mapa = this.make.tilemap({ key: 'mapaTeste' }); //Criar o tilemap. Usar o nome declarado no preload
        this.tileset = this.mapa.addTilesetImage("tileset", "tiles"); //relacionar o tilemap criado para adicionar os tiles utilizados. Usar o nome do tileset declarado no tiled e relacionar com a key da imagem carregada no preload nos argumentos da função

        //Criar a layer
        this.plataforma = this.mapa.createLayer("plataforma", this.tileset, 0, 0); //relacionar o tilemap criado para chamar a função e criar uma camada. Declarar um nome para a camada e adicionar o tileset criada junto as cordenadas que ficará o elemento do tilemap.
        this.plataforma.setCollisionByProperty({ colisor: true }); //Adicionando uma colisão a partir de uma propriedade adicionada nos tiles dentro do Tiled

        //Fazer a câmera seguir o player
        // this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels); //Definir os limites do mapa
        // this.cameras.main.startFollow(this.player);

        //Adicionar o player
        this.player = this.physics.add.sprite(100, 0, 'oi');
        this.player.setCollideWorldBounds(true); //colisão com limites
        this.physics.add.collider(this.player, this.plataforma); //colisão entre player e plataformas

        //Adicionar placar
        this.pontuacao = 0;
        this.placar = this.add.text(20, 20, `Pontuação: ${this.pontuacao}`, {
            fontSize: '25px',
            fontFamily: 'glitchRobot',
            fill: '#211C84'
        })

        //Adicionar os pontos coletáveis
        this.ponto = this.physics.add.group({
            key: 'pontos',
            repeat: 4, //adicionar 5 pontos coletáveis
            setXY: { x: 400, y: 300, stepX: 100 }
        })
        this.physics.add.collider(this.ponto, this.plataforma);
        
        //Player poder pegar pontos
        this.physics.add.overlap(this.player, this.ponto, () => {

            //desativar os pontos
            this.ponto.children.disableBody(true, true);

            //Atualizar placar
            this.pontuacao += 10;
            this.placar.setText(20, 20, `Pontuação: ${this.pontuacao}`, {
                fontSize: '25px',
                fontFamily: 'glitchRobot',
                fill: '#211C84'
            })
        }
            , null, this);

        //Definir os limites da camera
        // this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heigthInPixels);
        // //this.cameras.main.startFollow(this.player); //seguir o jogador
        // if( this.player.x === 300 ){
        //     this.cameras.main.scrollX(300);
        // }

    }

    //Adicionar as ações do jogo
    update() {
        //Adicionar as setas
        this.teclado = this.input.keyboard.createCursorKeys();
        //Adicionar a teclas WASD
        this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.teclaW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //Adicionar a movimentação
        //Eixo X
        if (this.teclado.left.isDown || this.teclaA.isDown) {
            this.player.setVelocityX(-150);
        }
        else if (this.teclado.right.isDown || this.teclaD.isDown) {
            this.player.setVelocityX(150);
        }
        else {
            this.player.setVelocityX(0);
        }
        //Eixo Y
        if ((this.teclado.up.isDown || this.teclaW.isDown) && this.player.body.blocked.down) { //player só pode pular se estiver no chão, touching.down não estava funcionando por isso foi trocado por blocked.down que é melhor para a mecânica de pulo
            this.player.setVelocityY(-400);
        }
        else { }
        console.log(this.pontuacao);

    }
}