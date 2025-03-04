//Definir a cena inicial usando a biblioteca Phaser
class Inicial extends Phaser.Scene {
    //Construtor da cena
    constructor() {
        super({
            key: 'inicial',
            backgroundColor: '#4D6AE8'
        })
    }
    create() {
        console.log("Cena carregada")

    }
}