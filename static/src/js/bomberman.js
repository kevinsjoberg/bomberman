(function () {
  var canvas = document.getElementById("board");
  canvas.width = 500;
  canvas.height = 500;
  var ctx = canvas.getContext("2d");
  var renderBoard = function (board) {
    _.each(board, function (row, y) {
      _.each(row, function (tile, x) {
        ctx.fillStyle = {g: "rgb(1, 166, 17)", s: "rgb(139, 141, 122)", w: "rgb(102, 51, 0)"}[tile];
        ctx.fillRect(x * 50, y * 50, 50, 50);
      });
    });
  };
  var renderPlayers = function (players) {
    _.each(players, function (player) {
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fillRect(player[0] * 50 * 10, player[1] * 50 * 10, 40, 40);
    });
  };
  var render = function (game) {
    ctx.clearRect(0, 0, 500, 500);
    renderBoard(game.board);
    renderPlayers(game.players);
  };
  var ws = new WebSocket("ws://127.0.0.1:3000");
  ws.onmessage = function (message) {
    render(JSON.parse(message.data));
  };

  var movementDirections = {"87": "up", "83": "down", "65": "left", "68": "right"};
  document.addEventListener("keydown", function (evt) {
    var direction = evt.keyCode.toString();
    if (!_.has(movementDirections, direction) || evt.repeat) {
      return;
    }
    startMovementData = JSON.stringify({command: "start-movement", arguments: [movementDirections[direction]]});
    ws.send(startMovementData);
  });

  document.addEventListener("keyup", function (evt) {
    var direction = evt.keyCode.toString();
    if (!_.has(movementDirections, direction) || evt.repeat) {
      return;
    }
    stopMovementData = JSON.stringify({command: "stop-movement", arguments: []});
    ws.send(stopMovementData);
  });
}());