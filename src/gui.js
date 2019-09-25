import * as THREE from 'three';
import * as dat from 'dat.gui';

import { updateCamera } from './main';


const gui = new dat.GUI();


class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj        = obj;
        this.minProp    = minProp;
        this.maxProp    = maxProp;
        this.minDif     = minDif;
    }

    get min() {
        return this.obj[this.minProp];
    }

    set min(v) {
        this.obj[this.minProp]  = v;
        this.obj[this.maxProp]  = Math.max(this.obj[this.maxProp], v + this.minDif);
    }

    get max() {
        return this.obj[this.maxProp];
    }

    set max(v) {
        this.obj[this.maxProp]  = v;
        this.min = this.min // this  will call the min setter
    }
}

class AxisGridHelper {
    constructor(node, units = 20) {
        const axes              = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder        = 2;
        node.add(axes);

        const grid              = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder        = 1;
        node.add(grid);

        this.grid           = grid;
        this.axes           = axes;
        this.visible        = false;
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        this._visible       = v;
        this.grid.visible   = v;
        this.axes.visible   = v;
    }
}


export function makeCameraControl(camera) {
    const helper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    gui.add(helper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(helper, 'max', 0.1, 500, 0.1).name('far').onChange(updateCamera);
}

export function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}
