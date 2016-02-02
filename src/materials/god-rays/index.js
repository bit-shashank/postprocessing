import shader from "./inlined/shader";
import THREE from "three";

/**
 * A crepuscular rays shader material.
 *
 * References:
 *
 * Thibaut Despoulain, 2012:
 *  (WebGL) Volumetric Light Approximation in Three.js
 *  http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html
 *
 * Nvidia, GPU Gems 3 - Chapter 13:
 *  Volumetric Light Scattering as a Post-Process
 *  http://http.developer.nvidia.com/GPUGems3/gpugems3_ch13.html
 *
 * @class GodRaysMaterial
 * @constructor
 * @extends ShaderMaterial
 */

export function GodRaysMaterial() {

	THREE.ShaderMaterial.call(this, {

		defines: {

			NUM_SAMPLES_FLOAT: "20.0",
			NUM_SAMPLES_INT: "20"

		},

		uniforms: {

			tDiffuse: {type: "t", value: null},
			lightPosition: {type: "v3", value: null},

			exposure: {type: "f", value: 0.6},
			decay: {type: "f", value: 0.93},
			density: {type: "f", value: 0.96},
			weight: {type: "f", value: 0.4},
			clampMax: {type: "f", value: 1.0}

		},

		fragmentShader: shader.fragment,
		vertexShader: shader.vertex

	});

}

GodRaysMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
GodRaysMaterial.prototype.constructor = GodRaysMaterial;