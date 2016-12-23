// https://github.com/thepeoplesbourgeois/d3-vector#readme Version 1.0.0. Copyright 2016 undefined.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-interpolate'), require('d3-collection')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-interpolate', 'd3-collection'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, (function (exports,d3Interpolate,d3Collection) { 'use strict';

var constant = function(x) {
  return function() {
    return x;
  };
};

function index(d) {
  return d.index;
}

function find(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("missing: " + nodeId);
  return node;
}

var vector = function(vectors) {
  var id = index,
      strength = defaultStrength,
      strengths,
      magnitude = constant(30),
      magnitudes,
      xComponents,
      yComponents,
      angle = defaultAngle,
      angles,
      cone = defaultCone(),
      nodes,
      totalVectors,
      totalVectorsConnectingNode,
      iterations = 1;

  if (vectors == null) vectors = [];

  function defaultStrength(vector) {
    return 1 / Math.min(totalVectorsConnectingNode[vector.source.index], totalVectorsConnectingNode[vector.target.index]);
  }

  function defaultAngle(vector, vectorNumber) {
    return cone(vectorNumber / totalVectorsConnectingNode[vector.source.index])
  }

  function defaultCone() {
    return coneDegrees(0,360)
  }

  function coneDegrees(angle1, angle2, orientation) {
    orientation = orientation || 0;
    angle1 = angle1+orientation % 360;
    angle2 = angle2+orientation % 360;
    if (angle2 <= angle1) { angle2 += 360; }
    return d3.interpolateNumber(angle1, angle2)
  }

  function force(alpha) {
    for (var iteration = 0; iteration < iterations; ++iteration) {
      for (var i = 0, source, target; i < totalVectors; ++i) {
        source = vectors[i].source, target = vectors[i].target;

        target.vx += (source.x + source.vx + xComponents[i] - target.x) * strengths[i] * alpha;
        target.vy += (source.y + source.vy + yComponents[i] - target.y) * strengths[i] * alpha;
      }
    }
  }

  function initialize() {
    if (!nodes) return;

    var i,
        totalNodes = nodes.length,
        nodeById = d3Collection.map(nodes, id),
        vector;

    totalVectors = vectors.length;
    totalVectorsConnectingNode = new Array(totalNodes);
    // convert IDs in `vectors` to object references, and count the number of vectors connecting to each node
    for (i = 0; i < totalVectors; ++i) {
      vector = vectors[i], vector.index = i;
      if (typeof vector.source !== "object") vector.source = find(nodeById, vector.source);
      if (typeof vector.target !== "object") vector.target = find(nodeById, vector.target);
      totalVectorsConnectingNode[vector.source.index] = (totalVectorsConnectingNode[vector.source.index] || 0) + 1;
      totalVectorsConnectingNode[vector.target.index] = (totalVectorsConnectingNode[vector.target.index] || 0) + 1;
    }


    strengths = new Array(totalVectors), initializeStrength();
    magnitudes = new Array(totalVectors), initializeMagnitudes();
    angles = new Array(totalVectors);
    xComponents = new Array(totalVectors), yComponents = new Array(totalVectors), initializeComponents();
  }

  function initializeStrength() {
    if (!nodes) return;


    for (var i = 0; i < totalVectors; ++i) {
      strengths[i] = +strength(vectors[i], i, vectors);
    }
  }

  function initializeMagnitudes() {
    if (!nodes) return;

    for (var i = 0; i < totalVectors; ++i) {
      magnitudes[i] = +magnitude(vectors[i], i, vectors);
    }
  }

  function initializeAngles() {
    if (!nodes) return;

    var timesNodeHasBeenSource = {};

    for (var i = 0, source, radians; i < totalVectors; ++i) {
      source = vectors[i].source;
      timesNodeHasBeenSource[source.index] = (totalVectorsConnectingNode[source.index] || 0) + 1;

      radians = +angle(vectors[i], timesNodeHasBeenSource[source.index])*Math.PI/180;
      angles[i] = radians;
    }
  }

  function initializeComponents() {
    if (!nodes) return;

    initializeAngles();
    for (var i = 0, n = totalVectors; i < n; ++i) {
      xComponents[i] = Math.round(magnitudes[i] * Math.cos(angles[i]));
      yComponents[i] = Math.round(magnitudes[i] * Math.sin(angles[i]));
    }

  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.vectors = function(_) {
    return arguments.length ? (vectors = _, initialize(), force) : vectors;
  };

  force.id = function(_) {
    return arguments.length ? (id = _, force) : id;
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
  };

  force.magnitude = function(_) {
    return arguments.length ? (magnitude = typeof _ === "function" ? _ : constant(+_), initializeMagnitudes(), force) : magnitude;
  };

  force.cone = function(_) {

    switch (arguments.length) {
      case 0:
        return cone
      case 1:
        if (Array.isArray(_)) {
          cone = coneDegrees.apply(null, _);
        } else{
          cone = typeof _ === "function" ? _ : constant(+_);
        }
        break
      case 2:
        cone = coneDegrees.apply(null, arguments);
        break

    }
    initializeComponents();
    return force;
  };

  return force;
};

exports.forceVector = vector;

Object.defineProperty(exports, '__esModule', { value: true });

})));
