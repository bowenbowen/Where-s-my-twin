// 1: hat ghost
// 2: green ghost
// 3: pig ghost
// 4: evil ghost

let graveArray = [];
let ghostArray = [1, 1, 2, 2, 3, 3, 4, 4];
let active1,
    active2;
let $body = $('body');
let $scene = $('.scene');
let $grave = $('.grave'); $grave = $grave.not('.grave-5'); 
let $bgm8bit = $('#bgm-8bit');
let $bgmAmbience = $('#bgm-ambience');
let unmatchedArray = Array.from($grave); //https://stackoverflow.com/questions/3199588/fastest-way-to-convert-javascript-nodelist-to-array
//removeIndex(unmatchedArray, 4);

let pigOink = new Audio('audios/pig-oink.wav');
let ahAhn = new Audio('audios/ah-ah-sr.wav');
let pop = new Audio('audios/pop.wav');
let appear = new Audio('audios/appear.wav');
let select = new Audio('audios/menu-selection.wav');
let allMatched = new Audio('audios/ahhhh.mp3');
let restartSelect = new Audio('audios/menu-select-restart.wav');
let restartSound = new Audio('audios/card-shuffle.wav');
let bgmPlaying = true;
let sfxPlaying = true;

let rx = -30;
let ry = 45;

/*------------------------ doc ready ------------------------*/
$(document).ready(function () {
    console.log("ready!");
    
    $('*').not('#pause').on('click', function() {if(bgmPlaying){$bgm8bit[0].play();$bgmAmbience[0].play();}});
    $('*').prop('draggable', false);
    
    /*---- sound control ----*/
    $bgm8bit.prop("volume", 0.2);
    $grave.on('mouseenter', function(){select.currentTime = 0; select.play();});
    $('.restart').on('mouseenter', function(){restartSelect.currentTime = 0; restartSelect.play();});
    $('.mute-bgm').on('click', toggleBGM);
    $('.mute-sfx').on('click', toggleSFX);
    

    /*---- create grave ----*/

    for (let i = 0; i < 9; i++) {
        if (i != 4) {
            graveArray[i] = new Grave(i + 1);
            graveArray[i].render();
        }
    }

    /*---- scene rotation ----*/
//    $('.ghost-body').css( '--ry', -$scene.css('--ry') );

    $body.on('mousedown', function () {
        $body.on('mousemove', rotateScene)
    });
    $body.on('mouseup', function () {
        $body.off('mousemove', rotateScene);
        rx = -30;
        ry = 45;
        $scene.css('--ry', ry + 'deg');
        $scene.css('--rx', rx + 'deg');
    $('.ghost-body').css( '--ry', '-45deg' );
        
    });

    $('img').prop('draggable', false);
    

    function rotateScene(e) {
        let xMove = e.originalEvent.movementX;
        let yMove = e.originalEvent.movementY;
        
        
        if (ry < 75 && ry > 15 && rx < -5 && rx > -35) {
            ry += xMove/10;
            rx -= yMove/10;

        }
        
        $scene.css('--ry', ry + 'deg');
        $scene.css('--rx', rx + 'deg');
        $('.ghost-body').css( '--ry', -ry+'deg' );
    }

    /*---- matched? ----*/
    $grave.on('click', ifMathched);
});

/*------------------------ functions ------------------------*/

function toggleBGM() {
    if ( $bgm8bit[0].paused && $bgmAmbience[0].paused ){
        $bgm8bit[0].play();
        $bgmAmbience[0].play();
        bgmPlaying = true;
        $('.mute-bgm .cross').css('visibility','hidden');
        console.log('play bgm');
    } else {
        $bgm8bit[0].pause();
        $bgmAmbience[0].pause();
        bgmPlaying = false;
        $('.mute-bgm .cross').css('visibility','visible');
        console.log('pause bgm');
    }
}

function toggleSFX() {
    if ( !sfxPlaying ){
        pigOink.muted = false;
        ahAhn.muted = false;
        pop.muted = false;
        appear.muted = false;
        select.muted = false;
        allMatched.muted = false;
        restartSelect.muted = false;
        restartSound.muted = false;
        sfxPlaying = true;
        $('.mute-sfx .cross').css('visibility','hidden');
        console.log('play sfx');
    } else {
        pigOink.muted = true;
        ahAhn.muted = true;
        pop.muted = true;
        appear.muted = true;
        select.muted = true;
        allMatched.muted = true;
        restartSelect.muted = true;
        restartSound.muted = true;
        sfxPlaying = false;
        $('.mute-sfx .cross').css('visibility','visible');
        console.log('pause sfx');
    }
}

function restart() {        
    active1 = undefined;
    active2 = undefined;
    $('.restart').removeClass('restart-active');
    restartSound.currentTime = 0; restartSound.play();
    $('.stone-container').remove();
    $('.ghost-container').remove();
    ghostArray = [1, 1, 2, 2, 3, 3, 4, 4];
    
    for (let i = 0; i < 9; i++) {
        if (i != 4) {
            graveArray[i] = new Grave(i + 1);
            graveArray[i].render();
        }
    }
    
    unmatchedArray = Array.from($grave); //https://stackoverflow.com/questions/3199588/fastest-way-to-convert-javascript-nodelist-to-array
}

function ifMathched() {
    if (unmatchedArray.includes(this)) {
        $(this).children('.ghost-container').css('--ty', '-150px'); // if selected
        if ($(this).children('.ghost-container').data('ghost-type') == 1) {
            pop.currentTime = 0;; pop.play();
        } else if ($(this).children('.ghost-container').data('ghost-type') == 2){
            ahAhn.currentTime = 0;; ahAhn.play();
        } else if ($(this).children('.ghost-container').data('ghost-type') == 3){
            pigOink.currentTime = 0;; pigOink.play();
        } else if ($(this).children('.ghost-container').data('ghost-type') == 4){
            appear.currentTime = 0;; appear.play();
        }
    }

    if (active1 == undefined && active2 == undefined && unmatchedArray.includes(this)) { // 
        active1 = $(this);
    } else if (active1 != undefined && active2 == undefined && active1.get(0) !== this && unmatchedArray.includes(this)) {
        active2 = $(this);

        if (active2.children('.ghost-container').data('ghost-type') == active1.children('.ghost-container').data('ghost-type')) { // if matched
            console.log('matched');
            removeEle(unmatchedArray, active1.get(0));
            removeEle(unmatchedArray, active2.get(0));
            if (unmatchedArray.length == 0) {
                console.log('All matched');
                allMatched.play();
                $('.restart').addClass('restart-active');
            }
        } else { // if not matched
            let ghost1 = active1.children('.ghost-container')
            let ghost2 = active2.children('.ghost-container') //temporaty variables here to store objects and hence prevent error caused by active1 & active2 becoming undefined before the settimeout happens
            
            setTimeout(function(){
            ghost1.css('--ty','0px');
            ghost2.css('--ty','0px');
            },500);
        }

        active1 = undefined;
        active2 = undefined;
        console.log(unmatchedArray);
    }
}


/*------------------------ grave class ------------------------*/

class Grave {
    constructor(index) {
        this.index = index;
        //        this.ghostType = ghostType;
        this.container = $('.grave-' + index);
    }

    createStone() {
        var stoneType = random(100);
        let $stoneContainer = $('<div class="stone-container">').appendTo(this.container);

        if (stoneType < 33) { //control possibilities
            $('<img class="face square-front" src="images/grave-square-front.jpg" />').appendTo($stoneContainer);
            $('<img class="face square-left" src="images/grave-square-peon-left.jpg" />').appendTo($stoneContainer);
            $('<img class="face square-top" src="images/grave-square-top.jpg" />').appendTo($stoneContainer);
        } else if (stoneType > 33 && stoneType > 66) {
            $('<img class="face oval-front" src="images/grave-oval-front.png" />').appendTo($stoneContainer);
            $('<img class="face oval-left" src="images/grave-oval-left.jpg" />').appendTo($stoneContainer);
            $('<img class="face oval-right" src="images/grave-oval-left.jpg" />').appendTo($stoneContainer);
            $('<img class="face oval-back" src="images/grave-oval-back.png" />').appendTo($stoneContainer);
        } else {
            $('<img class="face peon-front" src="images/grave-peontop-front.png" />').appendTo($stoneContainer);
            $('<img class="face peon-left" src="images/grave-square-peon-left.jpg" />').appendTo($stoneContainer);
            $('<img class="face peon-top-left" src="images/grave-square-top.jpg" />').appendTo($stoneContainer);
            $('<img class="face peon-top-right" src="images/grave-square-top.jpg" />').appendTo($stoneContainer);
        }
    }

    createGhost() {
        let chosenTypeIndex = random(ghostArray.length - 1);
        //        console.log(ghostArray[chosenTypeIndex]);
        let ghostType = ghostArray[chosenTypeIndex];
        removeIndex(ghostArray, chosenTypeIndex);

        let $ghostContainer = $('<div class="ghost-container" data-ghost-type=' + ghostType + '>').appendTo(this.container);
        let $eyesContainer = $('<div class="eyes-container">').appendTo($ghostContainer);

        if (ghostType == 1) {
            $('<img class="ghost-body" src="images/ghost-white.png" />').appendTo($ghostContainer);
            $('<img class="ghost-eyes" src="images/eyes-black.png" />').appendTo($eyesContainer);
        } else if (ghostType == 2) {
            $('<img class="ghost-body" src="images/ghost-green.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-face-green" src="images/face-green.png" />').appendTo($ghostContainer);
            $('<img class="ghost-eyes" src="images/eyes-green.png" />').appendTo($eyesContainer);
        } else if (ghostType == 3) {
            $('<img class="ghost-body" src="images/ghost-pink.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-pig-snout" src="images/pig-nose-pink.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-pig-ear-left" src="images/pig-ear-left.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-pig-ear-right" src="images/pig-ear-right.png" />').appendTo($ghostContainer);
            $('<img class="ghost-eyes" src="images/eyes-black.png" />').appendTo($eyesContainer);
        } else {
            $('<img class="ghost-body" src="images/ghost-red.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-tail" src="images/evil-tail.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-teeth" src="images/evil-teeth.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-horn-left" src="images/evil-horn.png" />').appendTo($ghostContainer);
            $('<img class="body-parts ghost-horn-right" src="images/evil-horn.png" />').appendTo($ghostContainer);
            $('<img class="ghost-eyes" src="images/eyes-black.png" />').appendTo($eyesContainer);
        }
    }

    render() {
        this.createStone();
        this.createGhost();
    }
}


/*------------------------ universal utilities ------------------------*/
function random(max) {
    return Math.floor(Math.random() * (max + 1));
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeIndex(array, index) {
    if (index !== -1) {
        array.splice(index, 1);
    }
}

//https://blog.mariusschulz.com/2016/07/16/removing-elements-from-javascript-arrays
function removeEle(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function rangeLimit(value, min, max){
    if (value >= min){
        console.log('small!');
        return value = min;
    } else if (value <= max) {
        console.log('large!');
        return value = max;
    }
}