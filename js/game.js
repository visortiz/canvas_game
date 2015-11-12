//Criar canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var request = true;

canvas.width = 512;
canvas.height = 480;

document.body.appendChild(canvas);

//Set imagem de fundo
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "img/background.png";

//Set imagem de heroi
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
    heroReady = true;
};
heroImage.src = "img/hero.png";

//Set imagem de monstro
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
    monsterReady = true;
};
monsterImage.src = "img/monster.png";

//Set imagem de monstro
var bad_monsterReady = false;
var bad_monsterImage = new Image();
bad_monsterImage.onload = function() {
    bad_monsterReady = true;
};
bad_monsterImage.src = "img/bad_monster.png";

//Set imagem da arma
var espadaReady = false;
var espadaImage = new Image();
espadaImage.onload = function() {
    espadaReady = true;
};
espadaImage.src = "img/espada.png";

//Objetos do jogo
var hero = {
    speed: 256, //movimento em pixels por segundo
    x : 256,
    y : 240
};

var monster = {
    speed: 256,
    x: 0,
    y: 0
};

var bad_monster = {
    speed: 256,
    x: 32 + (Math.random() * (canvas.width - 64)),
    y: 32 + (Math.random() * (canvas.height - 64))
};

var espada = {
    x: 32 + (Math.random() * (canvas.width - 64)),
    y: 32 + (Math.random() * (canvas.height - 64)),
    isSet: false
}

var monstersCaught = 0;

var timeOfGame = 0;

//Inputs do jogador
var keysDown = {};

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

//Reset o jogo quando o jogador capturar o monstro
var reset = function() {
    //Colocar monstro em posição aleatória no canvas
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
}

//Atualizar objetos do jogo
var update = function(modifier) {
    if(38 in keysDown) { //Jogador segurando CIMA
        if(hero.y > 0) {
        hero.y -= hero.speed * modifier;
        }
    }

    if(40 in keysDown) { //Jogador segurando BAIXO
        if(hero.y < (canvas.height - 64)) {
            hero.y += hero.speed * modifier;
        }
    }

    if(37 in keysDown) { //Jogador segurando ESQUERDA
        if(hero.x > 32) {
            hero.x -= hero.speed * modifier;
        }
    }

    if(39 in keysDown) { //Jogador segurando DIREITA
        if(hero.x < canvas.width - 64) {
            hero.x += hero.speed * modifier;
        }
    }

    if(32 in keysDown && espada.isSet) {
        espada.rotate(0.5);
    }

    //Jogador capturou monstro?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        if (espada.isSet) {
            ++monstersCaught;
            reset();
        } else {
            request = false;
        }
    }

  //Jogador matou monstro ou foi morto?
    if (
        hero.x <= (bad_monster.x + 32)
        && bad_monster.x <= (hero.x + 32)
        && hero.y <= (bad_monster.y + 32)
        && bad_monster.y <= (hero.y + 32)
    ) {
        request = false;
    }

    //Jogador pega espada
    if (
        hero.x <= (espada.x + 32)
        && espada.x <= (hero.x + 32)
        && hero.y <= (espada.y + 32)
        && espada.y <= (hero.y + 32)
    ) {
        espada.isSet = true;
    }

    if (espada.isSet) {
        espada.x = hero.x + 25;
        espada.y = hero.y + 5;
    }
}

var update_enemies = function(char, distance) {
    var random_direction = Math.floor(Math.random() * 4);

    if(random_direction == 0) {
        if(char.x <= canvas.width - 64) {
            char.x = char.x + distance;
        }
    } else if(random_direction == 1) {
        if(monster.x >= 64) {
            char.x = char.x - distance;
        }
    } else if(random_direction == 2) {
        if(char.y <= canvas.height - 64) {
            char.y = char.y + distance;
        }
    } else if(random_direction == 3) {
        if(char.y >= 64) {
            char.y = char.y - distance;
        }
    }
}

//Desenhar tudo
var render = function() {
    if(bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if(heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if(monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    if(bad_monsterReady) {
        ctx.drawImage(bad_monsterImage, bad_monster.x, bad_monster.y);
    }

    if(espadaReady) {
        ctx.drawImage(espadaImage,espada.x, espada.y);
    }

    //Pontuação
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "14px Verdana";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monstros capturados: " + monstersCaught, 50, 32);
    ctx.fillText("Tempo: " + timeOfGame, 380, 32);
}

var lastRun = Date.now();

//Loop principal do jogo
var main = function() {
    var now = Date.now();

    ++timeOfGame;

    var delta = now - then;

    update(delta / 1000);

    if(lastRun + 1000 < Date.now()) {
        update_enemies(monster, 32);
        update_enemies(bad_monster, 32);
        lastRun = Date.now();
    }

    render();

    then = now;

    //Executa novamente assim que possivel
    if(request) {
        request = requestAnimationFrame(main);
    } else {
        ctx.font = "30px Verdana";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = "15px Verdana";
        ctx.fillText("PONTUACAO: " + monstersCaught, canvas.width / 2, canvas.height / 2);
    }
}

// Suporte cross-browser para requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
main();
