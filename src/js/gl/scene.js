import './libs/OrbitControls'
import loadSvg from 'load-svg'
import svgMesh3d from 'svg-mesh-3d'
import { parse as getSvgPaths } from 'extract-svg-path'

export default class GLScene {
    constructor() {
        this.t = 0;
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
        this.camera.position.set(0, 0, 20)
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.renderer = new THREE.WebGLRenderer({antialias: false});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xe9eae9);
        document.getElementById('gl-scene').appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        window.addEventListener('resize', this.resize, false);

        loadSvg('./images/congrats.svg', (err, svg)=>{
            if (err) throw err;

            let svgPath = getSvgPaths(svg);
            let o = svgMesh3d(svgPath, {
                delauney: false,
                scale: 4,
                simplify: 0.01
            });

            let g = new THREE.Geometry();


            for (let i = 0; i < o.cells.length; i++) {
                let c = o.cells[i];
                // let f = new THREE.Face3(c[0], c[1], c[2]);
                // g.faces.push(f);
                for (let j = 0; j < 3; j++) {
                    let p = o.positions[c[j]];
                    let v = new THREE.Vector3(p[0]*10, p[1]*10, p[2]*10);
                    g.vertices.push(v);

                }

                g.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
            }

            let m = new THREE.MeshBasicMaterial({
                color: 0xbf4c36, opacity: 1.0, wireframe: false,
                side: THREE.DoubleSide
            });

            let mesh = new THREE.Mesh(g, m);

            this.obj = mesh;

            this.scene.add(mesh);
        });

        this.animate();
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.t++;

        if (this.t % 200 <= 100) {
            if (this.obj) {
                let g = this.obj.geometry;
                for (let i = 0; i < g.faces.length; i++) {
                    let axis = new THREE.Vector3().subVectors(g.vertices[i*3], g.vertices[i*3+1]);
                    axis.normalize();
                    g.vertices[i*3+2].applyAxisAngle(axis, Math.PI * 0.02);
                }
                g.verticesNeedUpdate = true;
            }
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
