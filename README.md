## d3-vector

A module for [forceSimulations](https://github.com/d3/d3-force) to define connections between nodes as directional vectors, consisting of angles within a cone of dispersion, and magnitudes defined either by a constant or by a function of the individual `vector`s. Reverse-engineered from the [`Link`](https://github.com/d3/d3-force/blob/master/src/link.js) force by Mike Bostock.

#### Usage

Public methods on `vector` are all defined on the `force` object at the bottom of `vector.js`.

- `force.initialize`: begins running the simulation
- `force.nodes`: the data used for each node
- `force.vectors`: the connections between nodes, defined as an array of `source` and `target` objects
- `force.id`: a function to allow the simulation to internally identify each `node` for updates
- `force.iterations`: (ADVANCED) I'm not really sure... it's just kind of a thing that Mike made work and it affects how strongly your force is applied during the simulation
- `force.orientation`: the basis degree for orienting the angles of `force.cone`
- `force.direction`: 'reverse' will invert the cone of dispersion
- `force.strength`: a relative multiplier that affects the potency of each vector's `magnitude` while the simulation is running
- `force.magnitude`: either a constant number indicating the length in pixels of each vector, or a function applied to each `vector` to determine its relative length
- `force.cone`: an interpolative scale that is applied to a raw `degree` value to coerce the vector to go in a specific angle relative to its source
