$(function () {

  // animations
  var gameAnimation;
  var moveUp = false;
  var moveDown = false;
  var moveRight = false;
  var moveLeft = false;

  // Sounds

  var volume = true;

  var starSound = document.createElement('audio');
  starSound.src = 'sound/star.mp3';
  starSound.volume = 1;
  starSound.autoplay = false;
  starSound.preload = true;
  starSound.controls = true;

  var crashSound = document.createElement('audio');
  crashSound.src = 'sound/hit.mp3';
  crashSound.volume = 1;
  crashSound.autoplay = false;
  crashSound.preload = true;
  crashSound.controls = true;

  var backgroundSound = document.createElement('audio');
  backgroundSound.src = 'sound/background.mp3';
  backgroundSound.volume = 1;
  backgroundSound.autoplay = false;
  backgroundSound.preload = true;
  backgroundSound.controls = true;
  backgroundSound.repeat = true;

  var finishSound = document.createElement('audio');
  finishSound.src = 'sound/finish.mp3';
  finishSound.volume = 1;
  finishSound.autoplay = false;
  finishSound.preload = true;
  finishSound.controls = true;
  finishSound.repeat = true;

  var scene = measuring($('#scene'));

  // Plane
  var plane = measuring($('.plane'));

  // Clouds
  var cloud = $('.cloud');
  var cloud1 = measuring($('#clouds1'));
  var cloud2 = measuring($('#clouds2'));
  var cloud3 = measuring($('#clouds3'));
  var cloud4 = measuring($('#clouds4'));

  // birds
  var bird = $('.bird');
  var bird1 = measuring($('#birds1'));
  var bird2 = measuring($('#birds2'));
  var bird3 = measuring($('#birds3'));
  var bird4 = measuring($('#birds4'));

  var star = measuring($('.star'));
  var canister = measuring($('.canister'));

  var gameOver = false;
  var gameStart = true;
  var gamePause = false;

  var scoreTracker = 0;
  var canisterTracker = 100;

  var speedBird = 13;

  gameAnimation = requestAnimationFrame(game);


  function game() {
    if (gameOver === true) {
      backgroundSound.pause();
    } else if(gameStart === true && gamePause === false) {
      $('#pause').on('click', function () {
        gamePause = true;
        backgroundSound.pause();
        $('#pause').fadeOut(0);
        $('#continue').fadeIn();
      });

      $('#continue').on('click', function () {
        gamePause = false;
        $('#continue').fadeOut(0);
        $('#pause').fadeIn();
      });
      repeatX(cloud1, 5, -100, -150);
      repeatX(cloud2, 5, -300, -350);
      repeatX(cloud3, 5, -400, -450);
      repeatX(cloud4, 5, -500, -650);

      repeatXY(bird1, speedBird, -100, -200);
      repeatXY(bird2, speedBird, -300, -400);
      repeatXY(bird3, speedBird, -400, -500);
      repeatXY(bird4, speedBird, -600, -700);

      repeatY(star, 5, 2, -3000, -6000);
      repeatY(canister, 5, 2, -1000, -1100);


      scoreTracker ++;
      if (scoreTracker % 20 === 0) {
        $('#score-tracker').text(parseInt($('#score-tracker').text()) + 1);
      }

      if (scoreTracker % 400 === 0) {
        speedBird ++;
      }

      canisterTracker --;
      if (canisterTracker % 6 === 0) {
        $('#canister-line').text(parseInt($('#canister-line').text()) - 1);
        $('#canister-line').css('width', parseInt($('#canister-line').css('width')) -1);
      }

      if (parseInt($('#canister-line').css('width')) <= 0) {
        gameOver = true;
      }

      if (collision(plane.model, bird1.model) || collision(plane.model, bird2.model) || collision(plane.model, bird3.model) || collision(plane.model, bird4.model)) {
        gameOver = true;
        if (volume === true) {
          crashSound.play();
        }
      }

      if (collision(plane.model, canister.model)) {
        canister.model.fadeOut(0);
        $('#canister-line').text(100);
        $('#canister-line').css('width', 100);
        setTimeout(function () {
          canister.model.fadeIn(0);
        }, 4000);
      }

      if (collision(plane.model, star.model)) {
        star.model.fadeOut(0);
        if (volume === true) {
          starSound.play();
        }
        $('#star-tracker').text(parseInt($('#star-tracker').text()) + 1);
        setTimeout(function () {
          star.model.fadeIn(0);
        }, 4000)
      }

      if (volume === true) {
        backgroundSound.play();
      }
    } if (gameStart === false) {
      finishSound.play();
    }
    gameAnimation = requestAnimationFrame(game)
  }

  function repeatX(model, speed, min, max) {
    var currentPosition = parseInt(model.model.css('right'));

    model.model.css('right', currentPosition + speed);

    if(currentPosition > scene.width + model.width) {
      model.model.css('right', Math.random() * (max - min) + min);
    }
  }

  function repeatXY(model, speed, min, max) {
    var currentPositionX = parseInt(model.model.css('right'));

    model.model.css('right', currentPositionX + speed);

    if (currentPositionX > scene.width + model.width) {
      model.model.css({
        right: Math.random() * (max - min) + min,
        top: Math.random() * (scene.height - model.height)
      });

    }
  }

  function repeatY(model, speedX, speedY, min, max) {
    var currentPositionY = parseInt(model.model.css('top'));
    var currentPositionX = parseInt(model.model.css('right'));

    model.model.css('right', currentPositionX + speedX);

    if (collision(model.model, scene.model)) {
      model.model.css('top', currentPositionY + speedY);
    } else if(currentPositionX > scene.width + model.width) {
      model.model.css({
        top: 0,
        right: Math.random() * (max - min) + min
      });
    }
  }

  function collision($model1, $model2) {
    var x1 = $model1.offset().left;
    var y1 = $model1.offset().top;
    var h1 = $model1.outerHeight(true);
    var w1 = $model1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;

    var x2 = $model2.offset().left;
    var y2 = $model2.offset().top;
    var h2 = $model2.outerHeight(true);
    var w2 = $model2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
  }

  function measuring($model) {
    return {
      model: $model,
      top: parseInt($model.css('top')),
      right: parseInt($model.css('right')),
      left: parseInt($model.css('left')),
      bottom: parseInt($model.css('bottom')),
      width: $model.width(),
      height: $model.height()
    }
  }

  function up() {
    if  (parseInt(plane.model.css('top')) > 0 && gameOver === false) {
      plane.model.css('top', parseInt(plane.model.css('top')) - 10);
    }
    moveUp = requestAnimationFrame(up);
  }

  function down() {
    if (parseInt(plane.model.css('top')) < scene.height - plane.height && gameOver === false) {
      plane.model.css('top', parseInt(plane.model.css('top')) + 10);
    }
    moveDown = requestAnimationFrame(down);
  }

  function left() {
    if (parseInt(plane.model.css('left')) > 0 && gameOver === false) {
      plane.model.css('left', parseInt(plane.model.css('left')) - 6);
    }
    moveLeft = requestAnimationFrame(left);
  }

  function right() {
    if (parseInt(plane.model.css('left')) < scene.width - plane.width && gameOver === false) {
      plane.model.css('left', parseInt(plane.model.css('left')) + 6);
    }
    moveRight = requestAnimationFrame(right);
  }

  $(document).on('keydown', function (e) {
    var key = e.keyCode;
    if (gameOver === false && gamePause === false) {
      if(key === 38 && moveUp === false) {
        moveUp = requestAnimationFrame(up);
      } else if (key === 40 && moveDown === false) {
        moveDown = requestAnimationFrame(down);
      } else if (key === 39 && moveRight === false) {
        moveRight = requestAnimationFrame(right);
      } else if (key === 37 && moveLeft === false) {
        moveLeft = requestAnimationFrame(left);
      }
    }
    if (key === 32 && gamePause === false) {
      gamePause = true;
      backgroundSound.pause();
      $('#pause').fadeOut(0);
      $('#continue').fadeIn();
    } else if(key === 32 && gamePause === true) {
      gamePause = false;
      $('#continue').fadeOut(0);
      $('#pause').fadeIn();
    }
  });

  $(document).on('keyup', function (e) {
    if (gameOver === false) {
      var key = e.keyCode;

      if (key === 38) {
        cancelAnimationFrame(moveUp);
        moveUp = false;
      } else if(key === 40) {
        cancelAnimationFrame(moveDown);
        moveDown = false;
      } else if(key === 39) {
        cancelAnimationFrame(moveRight);
        moveRight = false;
      } else if(key === 37) {
        cancelAnimationFrame(moveLeft);
        moveLeft = false;
      }
    }
  })
});