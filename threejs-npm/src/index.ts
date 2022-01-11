import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  Clock,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
//@ts-ignore
import { GUI } from "lil-gui";

// stats
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const stats = new Stats();
const clock = new Clock();

function guiAddPosition(gui: GUI, object: { position: Vector3 }) {
  gui.add(object.position, 'x').listen(true)
  gui.add(object.position, 'y').listen(true)
  gui.add(object.position, 'z').listen(true)
}

// template
function template() {
  const scene = new Scene();
  const renderer = new WebGLRenderer();
  const container = document.querySelector("#container")!;
  container.appendChild(renderer.domElement);
  const gui = new GUI();
  gui.open()

  //region 摄像机
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 5;
  const camera = new PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 2;
  //endregion

  //region 渲染和每帧更新
  function render() {
    renderer.render(scene, camera);
  }

  const tickers: ((time: number) => void)[] = [];

  function ticker() {
    const delta = clock.getDelta();
    tickers.forEach(fn => fn(delta));
    render();
    stats.update();
    requestAnimationFrame(ticker);
  }

  requestAnimationFrame(ticker);
  ticker();
  //endregion

  //region orbitControls
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  tickers.push(() => {
    orbitControls.update();
  });
  //endregion

  //region orbitControls Camera Position
  const cameraGUI = gui.addFolder('camera')
  guiAddPosition(cameraGUI, camera)
  //endregion

  //region 光照
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new AmbientLight(color, intensity);
  scene.add(light);
  //endregion

  //region plane
  const planeGeometry = new PlaneGeometry(15, 15, 15, 15);
  const planeMaterial = new MeshStandardMaterial({ color: 0xcccccc });
  const planeMesh = new Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);
  planeMesh.rotateX(-Math.PI * 0.5);
  //endregion

  //region window resize
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerHeight / window.innerWidth;
    camera.updateProjectionMatrix();
  }

  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  //endregion

  //region status
  container.appendChild(stats.dom);
  //endregion
}

// fundamentals
function fundamentals() {

  const scene = new Scene();

  const renderer = new WebGLRenderer();

  const container = document.querySelector("#container")!;

  container.appendChild(renderer.domElement);

  //region 摄像机
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 5;
  const camera = new PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 2;
  //endregion

  //region 光照
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  //endregion

  //region 几何体
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

  //endregion

  function createXCubeInstance(geometry: BoxGeometry, color: number, x: number) {
    const material = new MeshPhongMaterial({ color });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }

  //region 带颜色的几何体
  const cubes = [
    createXCubeInstance(geometry, 0x44aa88, 0),
    createXCubeInstance(geometry, 0x8844aa, -2),
    createXCubeInstance(geometry, 0xaa8844, 2),
  ];
  //endregion

  //region 几何体旋转
  setTimeout(() => {
    // TODO: 在何时 加入动画
    tickers.push((time) => {
      cubes.forEach((cube, index) => {
        const speed = 1 + index * .1;
        const rot = time * speed;
        cube.rotation.x += rot;
        cube.rotation.y += rot;
      });
    });
  });
  //endregion

  //region 渲染和每帧更新
  function render() {
    renderer.render(scene, camera);
  }

  const tickers: ((time: number) => void)[] = [];

  function ticker() {
    const delta = clock.getDelta();
    tickers.forEach(fn => fn(delta));
    render();
    stats.update();
    requestAnimationFrame(ticker);
  }

  requestAnimationFrame(ticker);
  ticker();

  //endregion

  //region window resize
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerHeight / window.innerWidth;
  }

  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  //endregion

  container.appendChild(stats.dom);
}

// journey
function journey() {
  const scene = new Scene();
  scene.background = new Color(0xf4f5f6);

  // red cube
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(2, 2, 0);
  mesh.scale.set(0.2, 0.3, 0.4);
  scene.add(mesh);
  const axesHelper = new AxesHelper();
  axesHelper.position.copy(mesh.position);
  scene.add(axesHelper);

  // size
  const sizes = {
    width: 800,
    height: 600,
  };

  // camera
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(0, 0, 4);
  scene.add(camera);
  const cameraHelper = new CameraHelper(camera);
  scene.add(cameraHelper);

  // canvas
  const container = document.querySelector("#container")!;
  const canvas = document.createElement("canvas");
  container.appendChild(stats.dom);
  container.appendChild(canvas);

  // renderer
  const renderer = new WebGLRenderer({ canvas });

  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  //region 渲染和每帧更新
  function render() {
    renderer.render(scene, camera);
  }

  const tickers: ((time: number) => void)[] = [];

  function ticker() {
    const delta = clock.getDelta();
    tickers.forEach(fn => fn(delta));
    render();
    stats.update();
    requestAnimationFrame(ticker);
  }

  requestAnimationFrame(ticker);
  ticker();
  //endregion
}

// journey house

function journeyHouse() {
  const scene = new Scene();
  const renderer = new WebGLRenderer();
  const container = document.querySelector("#container")!;
  container.appendChild(renderer.domElement);
  const gui = new GUI();
  gui.open()

  //region 摄像机
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1;
  const far = 20;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(6, 6, 6);
  camera.lookAt(new Vector3(0, 0, 0));
  //endregion

  //region 渲染和每帧更新
  function render() {
    renderer.render(scene, camera);
  }

  const tickers: ((time: number) => void)[] = [];

  function ticker() {
    const delta = clock.getDelta();
    tickers.forEach(fn => fn(delta));
    render();
    stats.update();
    requestAnimationFrame(ticker);
  }

  requestAnimationFrame(ticker);
  ticker();
  //endregion

  //region orbitControls
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  tickers.push(() => {
    orbitControls.update();
  });
  //endregion

  //region orbitControls Camera Position
  const cameraGUI = gui.addFolder('camera')
  guiAddPosition(cameraGUI, camera)
  //endregion

  //region plane
  const planeGeometry = new PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new MeshStandardMaterial({ color: 0xcccccc });
  const planeMesh = new Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);
  planeMesh.rotateX(-Math.PI * 0.5);
  //endregion

  planeMesh.receiveShadow = true;

  //region 光照
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new AmbientLight(color, intensity);
  scene.add(light);
  //endregion

  //region window resize
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerHeight / window.innerWidth;
    camera.updateProjectionMatrix();
  }

  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  //endregion+

  //region status
  container.appendChild(stats.dom);
  //endregion

  const house = new Group();
  scene.add(house);

  const walls = new Mesh(
    new BoxGeometry(4, 2.5, 4),
    new MeshStandardMaterial({ color: 0xac8e82 }),
  );
  house.add(walls);
  walls.position.y = 1.25
}

window.addEventListener("load", journeyHouse);
