//Cena jogável
class CiberVentura extends Phaser.Scene {
    constructor() {
        super({
            key: 'CiberVentura', //nome da cena
            //Adicionar física
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false, //ativar o debug
                    gravity: { y: 400 } //definição da gravidade
                }
            }
        })

    }

    //Carregar os elementos
    preload() {
        //Carregar o tileset
        this.load.image('tiles', "assets/mapas/tileset.png");
        //Carregar o tilemap em JSON
        this.load.tilemapTiledJSON('mapaTeste', "assets/mapas/mapaTeste.json");

        //Carregar os pontos
        this.load.image('ponto', "assets/ponto.png");

        //Carregar o player
        this.load.spritesheet('jogadora', "assets/personagens/jogadoraSpritesheet.png", { frameWidth: 47, frameHeight: 48 });

        //Carregar os sprites dos inimigos
        //Usando laço de repetição e lista
        this.robos = ['robo1', 'robo2'];
        for (let i = 0; i < this.robos.length; i++) {
            this.load.spritesheet(this.robos[i], "assets/robos/" + this.robos[i] + "Camin.png", { frameWidth: 1024 / 8, frameHeight: 81 });
        }

        //Carregar imagens do tutorial
        this.load.image('direita', "assets/direitaTutorial.png");
        this.load.image('esquerda', "assets/esquerdaTutorial.png");
        this.load.image('pular', "assets/pularTutorial.png");
        this.load.image('matarRobo', "assets/matarRoboTutorial.png");
        this.load.image('roboPerigo', "assets/roboPerigTutorial.png");

        //Carregar background
        this.load.image('bgJogo', "assets/bgJogo.png");

    }

    //Adicionar os elementos
    create() {
        //Adicionar background
        this.bgJogo = this.add.tileSprite(this.game.config.width / 2, this.game.config.height / 2, (this.game.config.width * 2), this.game.config.height, 'bgJogo');

        //Adicionar imagens do tutorial
        this.add.image(190, 400, 'direita').setScale(0.7);
        this.add.image(50, 400, 'esquerda').setScale(0.7);
        this.add.image(120, 300, 'pular').setScale(0.65);
        this.add.image(350, 250, 'matarRobo').setScale(0.65);
        this.add.image(275, 255, 'roboPerigo').setScale(0.65);



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
        this.player = this.physics.add.sprite(100, 0, 'jogadora').setScale(1.9);
        this.player.setCollideWorldBounds(true); //colisão com limites
        this.physics.add.collider(this.player, this.plataforma); //colisão entre player e plataformas
        //Animação do player
        this.anims.create({
            key: 'parada',
            frames: this.anims.generateFrameNumbers('jogadora', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'pular',
            frames: this.anims.generateFrameNumbers('jogadora', { start: 4, end: 7 }),
            frameRate: 0.5,
            repeat: 1
        });
        this.anims.create({
            key: 'correr',
            frames: this.anims.generateFrameNumbers('jogadora', { start: 8, end: 13 }),
            framRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'morrer',
            frames: this.anims.generateFrameNumbers('jogadora', { start: 14, end: 19 }),
            frameRate: 1,
            repeat: 1
        });


        //Adicionar os inimigos aleatoriamente
        this.numAleat = Phaser.Math.Between(0, 1);
        this.inimigo = this.physics.add.sprite(770, 400, this.robos[this.numAleat]).setSize(40);
        //this.inimigo = this.physics.add.sprite(750, 400, 'nome');
        this.physics.add.collider(this.plataforma, this.inimigo); //colisão com a plataforma
        this.aparecerNovosInimigos = false; //atributo para controlar o aparecimento de inimigos
        this.velocidade = 100;//velocidade do inimigo inicialmente
        //Animação do inimigo com laço
        for (let i = 0; i < this.robos.length; i++) {
            this.anims.create({
                key: 'caminhar',
                frames: this.anims.generateFrameNumbers(this.robos[i], { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        //Adicionar placar
        this.pontuacao = 0;
        this.placar = this.add.text(20, 20, `Pontuação: ${this.pontuacao}`, {
            fontSize: '25px',
            fontFamily: 'glitchRobot',
            fill: '#211C84'
        })



        //Adicionar os pontos coletáveis
        this.ponto = this.physics.add.group({
            key: 'ponto',
            repeat: 4, //adicionar 5 pontos coletáveis
            setXY: { x: 400, y: 400, stepX: 80 }
        });
        this.physics.add.collider(this.ponto, this.plataforma); //colidir com a plataforma
        //Player pode pegar pontos
        this.physics.add.overlap(this.player, this.ponto, (player, ponto) => {
            //desativar os pontos
            ponto.disableBody(true, true);

            //Atualizar placar
            this.pontuacao += 10;
            this.placar.setText(`Pontuação: ${this.pontuacao}`); //setText apenas atualiza o texto

        }, null, this);

        //Definir os limites da camera
        // this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heigthInPixels);
        // //this.cameras.main.startFollow(this.player); //seguir o jogador
        // if( this.player.x === 300 ){
        //     this.cameras.main.scrollX(300);
        // }

        //Adicionar as setas
        this.teclado = this.input.keyboard.createCursorKeys();
        //Adicionar a teclas WASD
        this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.teclaW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);



    }

    //Adicionar as ações do jogo
    update() {
        //Animar background
        this.bgJogo.tilePositionX += 0.1;
        //Animar pontos
        //for(let i = 0; i < )

        //Adicionar a movimentação do player
        //Eixo X
        if (this.teclado.left.isDown || this.teclaA.isDown) {
            this.player.setVelocityX(-150);
            this.player.setFlip(true, false);
            this.player.anims.play('correr', true);

        }
        else if (this.teclado.right.isDown || this.teclaD.isDown) {
            this.player.setVelocityX(150);
            this.player.setFlip(false, false);
            this.player.anims.play('correr', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('parada', true);
        }
        //Eixo Y
        if ((this.teclado.up.isDown || this.teclaW.isDown) && this.player.body.blocked.down) { //player só pode pular se estiver no chão, touching.down não estava funcionando por isso foi trocado por blocked.down que é melhor para a mecânica de pulo
            this.player.setVelocityY(-400);
        }
        else { }
        //animação de pulo
        if (!this.player.body.blocked.down) {
            this.player.anims.play('pular', true);
        }

        //Adicionar novos pontos e permitir adicionar novos inimigos, somente se os pontos acabarem e o inimgo estiver morto
        if (this.ponto.countActive(true) === 0 && this.inimigo.body.enable === false) {
            this.ponto.children.iterate((ponto) => {
                ponto.enableBody(true, ponto.x, 0, true, true); //Aparecer novos pontos
                this.aparecerNovosInimigos = true;
            })
        }
        //Adicionar inimigos
        if (this.aparecerNovosInimigos === true) {
            //Lógica de local de nascimento de inimigos
            //this.meioBatalha = 410 + (780-410)/2; //variável para guardar o meio do local onde o player pega os pontos e mata inimigos
            if (this.player.x < 770 || this.player.x > 595) {
                this.nascerInimigoX = 410;
            }
            if (this.player > 300 || this.player.x < 595) {
                this.nascerInimigoX = 770;

            }
            //Aumentar a dificuldade
            this.velocidade += 50;
            //Adicionar os inimigos aleatoriamente
            this.numAleat = Phaser.Math.Between(0, 1);
            this.inimigo = this.physics.add.sprite(this.nascerInimigoX, 400, this.robos[this.numAleat]).setSize(40);
            this.physics.add.collider(this.plataforma, this.inimigo); //colisão com a plataforma
            this.aparecerNovosInimigos = false;
        }

        //Movimentação inimigo
        if (this.inimigo.x > 765 && this.inimigo.x <= 775) {
            this.ida = true; //Variável para indicar se está indo ou voltando


        }
        if (this.inimigo.x <= 780 && this.ida === true) {
            this.inimigo.setVelocityX(-this.velocidade);
            this.inimigo.setFlip(true, false);
            this.inimigo.anims.play('caminhar', true);

        }
        if (this.inimigo.x <= 415 && this.inimigo.x > 405) {
            this.ida = false;


        }
        if (this.inimigo.x < 780 && this.ida === false) {
            this.inimigo.setVelocityX(this.velocidade);
            this.inimigo.setFlip(false, false);
            this.inimigo.anims.play('caminhar', true);
        }

        //Animação de morrer
        if (this.player.enableBody === false) {
            this.player.anims.play('morrer', true);
        }
        //Conflito entre player e inimigo, se o inimigo encostar nas laterais do player ele morre, se o plaver pular na cabeça dele o inimigo morre. Dever ser atualizado assim que adicionar novos inimigos -- futuramente trocar para o inimigo atacando o player e o player atacando o inimigo
        this.physics.add.overlap(this.player, this.inimigo, (player, inimigo) => {
            //Matar inimigo
            if (inimigo.body.touching.up && !inimigo.hit) { //precisa ser tocado na parte de cima e não ser acertado nos lados
                inimigo.disableBody(true, true); //desativar o inimigo
                player.setVelocityY(-200);
                this.animar = true;
                pontAnterior = this.pontuacao;

            }

            //Matar player
            else {
                player.disableBody(false, false); //desativar o player
                this.animar = true;
                this.time.delayedCall(2000, () => {
                    this.scene.start('GameOver', this.game);
                });
                //Mover para a cena gameOver 

            }

        }, null, this);

        //Animação de morrer
        // if (!this.player.body.enable && this.animar === true) {
        //     this.player.anims.stop();
        //     this.animar = false;
        //     this.player.anims.play('morrer', true);
        //     console.log("aqui");
        // }

    }
}