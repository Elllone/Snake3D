import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(900, 600);
document.body.appendChild(renderer.domElement);
//Сцена
const scene = new THREE.Scene();
//Камера
const camera = new THREE.PerspectiveCamera(
    75,
    900 / 600,
    0.01,
    10000
);
camera.position.z = 50;
// camera.rotateX(1.57)
const controls = new OrbitControls(camera, renderer.domElement)
class contolEvent {
    constructor() {
        this.keyCodes = [];
        this.keyChar = [];
    }
    calculate() {
        this.leftarrow = false;
        this.uparrow = false;
        this.rightarrow = false;
        this.downarrow = false;

        if (this.keyCodes[37] || this.keyCodes[65]) {
            this.leftarrow = true;
        }

        if (this.keyCodes[38] || this.keyCodes[87]) {
            this.uparrow = true;
        }

        if (this.keyCodes[39] || this.keyCodes[68]) {
            this.rightarrow = true;
        }

        if (this.keyCodes[40] || this.keyCodes[83]) {
            this.downarrow = true;
        }
    }
    init() {
        this.keyChar = [];
        for (var i = 0; i <= 222; i++) {
            this.keyChar[i] = "-";
        }
        this.keyChar[37] = "left arrow";
        this.keyChar[38] = "up arrow";
        this.keyChar[39] = "right arrow";
        this.keyChar[40] = "down arrow";
        this.keyChar[65] = "a";
        this.keyChar[68] = "d";
        this.keyChar[83] = "s";
        this.keyChar[87] = "w";
    }

}
//Прослушиваем нажатие и отпускание клавиш 
onkeydown = onkeyup = function (e) {
    controller.keyCodes[e.keyCode] = e.type == 'keydown';
    controller.calculate();
}

class snake {
    constructor() {
        this.pos = new THREE.Vector2(0, 0);

        this.tailGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.tailMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        this.tail = []; //Хвост змеи

        this.tail.push(new THREE.Mesh(this.tailGeometry, this.tailMaterial));
        scene.add(this.tail[0]);

        this.colorSnake = "yellow"
        this.neymry = false; //Бессмертие

        this.direction = "up";

        this.head = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({
                color: this.colorSnake
            }) //Голова змеи
        );
        scene.add(this.head);
        this.pointLight = new THREE.PointLight(this.colorSnake, 2, 20);
        scene.add(this.pointLight);
    }
    calculate() {
        if (this.neymry) {
            this.pointLight.color.setColorName("blue");
            this.head.material.color.setColorName("blue");
        }

        if (this.direction == "up") {
            this.pos.y++;    
        }
        if (this.direction == "down") {
            this.pos.y--;
        }                                           //Здесь мы меняем движение змейки
        if (this.direction == "left") {
            this.pos.x--;
        }
        if (this.direction == "right") {
            this.pos.x++;
        }

        if (this.pos.x > planeSize.width / 2) {
            this.pos.x = -planeSize.width / 2;
        }
        if (this.pos.x < -planeSize.width / 2) {
            this.pos.x = planeSize.width / 2;
        }
        if (this.pos.y > planeSize.height / 2) {
            this.pos.y = -planeSize.height / 2;
        }
        if (this.pos.y < -planeSize.height / 2) {
            this.pos.y = planeSize.height / 2;
        }

        for (let i = 0; i <= this.tail.length - 1; i++) {
            if (!this.neymry) {
                if (this.tail[i].position.x == this.pos.x && this.tail[i].position.y == this.pos.y) {
                    console.log("Помер");
                    location.reload();
                }
            }

            if (food.position.x == this.pos.x && food.position.y == this.pos.y) {
                for (let i = 0; i < 5; i++) {
                    this.grow();
                }
                spawnFood();
            }
        }

        this.head.position.x = this.pos.x;
        this.head.position.y = this.pos.y;
        this.pointLight.position.set(this.pos.x, this.pos.y, 3);


        for (let i = this.tail.length - 1; i >= 1; i--) {
            let newPos = new THREE.Vector2(this.tail[i - 1].position.x, this.tail[i - 1].position.y);
            this.tail[i].position.x = newPos.x;
            this.tail[i].position.y = newPos.y;
        }

        this.tail[0].position.x = this.head.position.x;
        this.tail[0].position.y = this.head.position.y;
    }

    grow() {
        let cube = new THREE.Mesh(this.tailGeometry, this.tailMaterial); //Создаем нащ хвост
        cube.position.x = 100;
        cube.position.y = 100; //Скрываем куб за сценой при отрисовки
        this.tail.push(cube); //Добавляем сам хвост
        scene.add(this.tail[this.tail.length - 1]); //Добавляем хвост на сцену
    }
}
let planeSize = {
    width: 90,
    height: 60
}
let backgroundPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(planeSize.width, planeSize.height, 1, 1),
    new THREE.MeshPhongMaterial({
        color: 0x111111,
    })
);
backgroundPlane.position.z = -1;
scene.add(backgroundPlane);


let player = new snake();
let controller = new contolEvent();
controller.init();
let clock = new THREE.Clock();


let food = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({
        color: "green"
    })
);
scene.add(food);
let apple = new THREE.PointLight("green", 10, 20);
scene.add(apple);

function spawnFood() {
    food.position.x = Math.round(Math.random() * planeSize.width - planeSize.width / 2);
    food.position.y = Math.round(Math.random() * planeSize.height - planeSize.height / 2);

    apple.position.set(food.position.x, food.position.y, 3);

}

function start() {
    requestAnimationFrame(start);
    calculate();
    render();
}

function calculate() {
    controller.calculate();
    if (controller.uparrow) {
        if (player.direction == "down") {
            player.direction = "down";
        } else {
            player.direction = "up";
        }
    }
    if (controller.downarrow) {
        if (player.direction == "up") {
            player.direction = "up";
        } else {
            player.direction = "down";
        }
    }
    if (controller.leftarrow) {
        if (player.direction == "right") {
            player.direction = "right";
        } else {
            player.direction = "left";
        }
    }
    if (controller.rightarrow) {
        if (player.direction == "left") {
            player.direction = "left";
        } else {
            player.direction = "right";
        }
    }
    if (clock.getElapsedTime() > 1 / 15) {
        player.calculate();
        clock.start();
    }

}
function render() {
    renderer.render(scene, camera);
}

spawnFood()
start();

