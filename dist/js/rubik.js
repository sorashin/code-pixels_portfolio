
function Rubik(element, dimensions, background) {

  dimensions = dimensions || 3;
  background = background || 0x303030;

  // var width = element.innerWidth(),
      // height = element.innerHeight();

  var container;

  var debug = false;

  var transitions = {
    'x': {'y': 'z', 'z': 'y'},
    'y': {'x': 'z', 'z': 'x'},
    'z': {'x': 'y', 'y': 'x'}
  }

  //こっからルービック作り
  var colours = [0xC41E3A, 0x009E60, 0x0051BA, 0xFF5800, 0xFFD500, 0xFFFFFF],
    faceMaterials = colours.map(function(c) {
      return new THREE.MeshLambertMaterial({ color: c , ambient: c });
    }),
    cubeMaterials = new THREE.MeshFaceMaterial(faceMaterials);

  var cubeSize = 3,
      spacing = 0.5;

  var increment = cubeSize + spacing,
      maxExtent = (cubeSize * dimensions + spacing * (dimensions - 1)) / 2,
      allCubes = [];

  function newCube(x, y, z) {
    var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
    cube.castShadow = true;

    cube.position = new THREE.Vector3(x, y, z);
    cube.rubikPosition = cube.position.clone();

    // cube.on('mousedown', function(e) {
    //   onCubeMouseDown(e, cube);
    // });
    //
    // cube.on('mouseup', function(e) {
    //   onCubeMouseUp(e, cube);
    // });
    //
    // cube.on('mouseout', function(e) {
    //   onCubeMouseOut(e, cube);
    // });

    // objectをObject3Dで包み込む
    rubicCube = new THREE.Object3D();
    rubicCube.add(cube);
    //sceneにはcubeではなくrubicCubeを使う
    scene.add(rubicCube);
    console.log(rubicCube);
    //↓cubeが動いてるようにみせるにはこれが必要
    allCubes.push(cube);
  }

  var positionOffset = (dimensions - 1) / 2;
    for(var i = 0; i < dimensions; i ++) {
      for(var j = 0; j < dimensions; j ++) {
        for(var k = 0; k < dimensions; k ++) {

          var x = (i - positionOffset) * increment,
              y = (j - positionOffset) * increment,
              z = (k - positionOffset) * increment;

          newCube(x, y, z);
        }
      }
    }

  /*** Manage transition states ***/
  //TODO: encapsulate each transition into a "Move" object, and keep a stack of moves
    // - that will allow us to easily generalise to other states like a "hello" state which
    // could animate the cube, or a "complete" state which could do an animation to celebrate
    // solving.
    var moveEvents = $({});

    //Maintain a queue of moves so we can perform compound actions like shuffle and solve
    var moveQueue = [],
        completedMoveStack = [],
        currentMove;

    //Are we in the middle of a transition?
    var isMoving = false,
        moveAxis, moveN, moveDirection,
        rotationSpeed = 0.2;

    //http://stackoverflow.com/questions/20089098/three-js-adding-and-removing-children-of-rotated-objects
    var pivot = new THREE.Object3D(),
        activeGroup = [];

    function nearlyEqual(a, b, d) {
      d = d || 0.001;
      return Math.abs(a - b) <= d;
    }

    //Select the plane of cubes that aligns with clickVector
    // on the given axis
    function setActiveGroup(axis) {
      if(clickVector) {
        activeGroup = [];

        allCubes.forEach(function(cube) {
          if(nearlyEqual(cube.rubikPosition[axis], clickVector[axis])) {
            activeGroup.push(cube);
          }
        });
      } else {
        console.log("Nothing to move!");
      }
    }

    var pushMove = function(cube, clickVector, axis, direction) {
      moveQueue.push({ cube: cube, vector: clickVector, axis: axis, direction: direction });
    }

    var startNextMove = function() {
      var nextMove = moveQueue.pop();

      if(nextMove) {
        clickVector = nextMove.vector;

        var direction = nextMove.direction || 1,
            axis = nextMove.axis;

        if(clickVector) {

          if(!isMoving) {
            isMoving = true;
            moveAxis = axis;
            moveDirection = direction;

            setActiveGroup(axis);

            pivot.rotation.set(0,0,0);
            pivot.updateMatrixWorld();
            scene.add(pivot);

            activeGroup.forEach(function(e) {
              THREE.SceneUtils.attach(e, scene, pivot);
            });

            currentMove = nextMove;
          } else {
            console.log("Already moving!");
          }
        } else {
          console.log("Nothing to move!");
        }
      } else {
        moveEvents.trigger('deplete');
      }
    }

    function doMove() {
      //Move a quarter turn then stop
      if(pivot.rotation[moveAxis] >= Math.PI / 2) {
        //Compensate for overshoot. TODO: use a tweening library
        pivot.rotation[moveAxis] = Math.PI / 2;
        moveComplete();
      } else if(pivot.rotation[moveAxis] <= Math.PI / -2) {
        pivot.rotation[moveAxis] = Math.PI / -2;
        moveComplete()
      } else {
        pivot.rotation[moveAxis] += (moveDirection * rotationSpeed);
      }
    }

    var moveComplete = function() {
      isMoving = false;
      moveAxis, moveN, moveDirection = undefined;
      clickVector = undefined;

      pivot.updateMatrixWorld();
      scene.remove(pivot);
      activeGroup.forEach(function(cube) {
        cube.updateMatrixWorld();

        cube.rubikPosition = cube.position.clone();
        cube.rubikPosition.applyMatrix4(pivot.matrixWorld);

        THREE.SceneUtils.detach(cube, pivot, scene);
      });

      completedMoveStack.push(currentMove);

      moveEvents.trigger('complete');

      //Are there any more queued moves?
      startNextMove();
    }
    /*** Util ***/
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    //Public API
  return {
    shuffle: function shuffle() {
      function randomAxis() {
        return ['x', 'y', 'z'][randomInt(0,2)];
      }

      function randomDirection() {
        var x = randomInt(0,1);
        if(x == 0) x = -1;
        return x;
      }

      function randomCube() {
        var i = randomInt(0, allCubes.length - 1);
        //TODO: don't return a centre cube
        return allCubes[i];
      }

        //TODO: don't reselect the same axis?
        var cube = randomCube();
        pushMove(cube, cube.position.clone(), randomAxis(), randomDirection());


      startNextMove();

      setTimeout(shuffle, 2000);
    }
  }
}
