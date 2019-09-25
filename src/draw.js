import * as THREE from 'three';


export function createReferencePoints(Imported3DObject, offset) {
    const references = [];

    const pos = Imported3DObject.geometry.attributes.position.array;
    const cnt = Imported3DObject.geometry.attributes.position.count;
    const scale_x = Imported3DObject.scale.x;
    const scale_y = Imported3DObject.scale.y;
    const scale_z = Imported3DObject.scale.z;

    for (let p = 0; p < cnt; p += 3) {
        const x = pos[3*p];
        const y = pos[3*p + 1];
        const z = pos[3*p + 2];

        const reference = new THREE.Object3D();
        
        reference.position.x = x * scale_x;
        reference.position.y = -z * scale_z;
        reference.position.z = y * scale_y;

        if (offset !== undefined) {
            reference.position.x += offset.x;
            reference.position.y += offset.y;
            reference.position.z += offset.z;
        }
        references.push(reference);
    }
    return references;
}

export function createDataPoints(references, material) {
    const points = [];

    references.forEach((ref) => {
        const geometry = new THREE.SphereBufferGeometry(0.05, 8);
        const point = new THREE.Mesh(geometry, material.clone());

        point.position.x = (Math.random() - 0.5) * 30 * ref.position.x;
        point.position.y = (Math.random() - 0.5) * 30 * ref.position.y;
        point.position.z = (Math.random() - 0.5) * 3 * ref.position.z;

        points.push(point);
    });
    return points;
}

