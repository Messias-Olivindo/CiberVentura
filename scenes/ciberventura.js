class CiberVentura extends Phaser.Scene{
    constructor(){
        super({
            key: 'ciberVentura',
            
        })
    }

    create(){
        this.cameras.main.setBackgroundColor("#e87373");
        console.log("estouaqui");
    }
}