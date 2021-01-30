import './index.scss'
import { World } from 'ecsy'
import { registerComponents } from './game/components.ts'
import { registerSystems } from './game/systems.ts'
import { initializeEntities } from './game/initialize.ts'
import {
    dumpAllPersistentSystems, restoreAllPersistentSystems, initializeAllPersistentSystems
} from './persistent-system.ts'

/** This setup is executed only once regardless of hot module reloading. */
function firstTimeSetup() {
    initializeWorld();
    initializeAllPersistentSystems(module.world)
    initializeEntities(module.world);
}

function initializeWorld() {
    module.world = new World();
    registerComponents(module.world);
    registerSystems(module.world);
}

/** Creates a new world and clones all entities from the previous world into it. */
function reloadWorld() {
    const oldWorld = module.world;
    const systemDumps = dumpAllPersistentSystems(oldWorld)
    initializeWorld();

    // Clone all entities into the new world.
    for (let oldEntity of oldWorld.entityManager._entities) {
        let newEntity = module.world.createEntity(oldEntity.name);

        for (let ecsyComponentId in oldEntity._components) {
            var srcComponent = oldEntity._components[ecsyComponentId];
            newEntity.addComponent(srcComponent.constructor);
            var component = newEntity.getMutableComponent(srcComponent.constructor);
            component.copy(srcComponent);
        }
    }

    module.world.entityManager._nextEntityId = oldWorld.entityManager._nextEntityId;
    restoreAllPersistentSystems(module.world, systemDumps)
}

/** Returns current time in seconds. */
function getTime() {
    return performance.now() / 1000.0
}

if (module.world === undefined) {
    firstTimeSetup();
}

let prevTime = getTime();
function update() {
    const time = getTime();
    const dt = time - prevTime;
    prevTime = time;

    if (module.world) {
        module.world.execute(dt, time);
    }

    requestAnimationFrame(update);
}

setTimeout(() => {
    prevTime = getTime();
    requestAnimationFrame(update);
}, 500);

if (module.hot) {
    module.hot.accept('./game/systems.ts', function() {
        console.log("Accepting updated systems");
        reloadWorld();
    });

    module.hot.accept('./game/components.ts', function() {
        console.log("Accepting updated components");
        //reloadWorld(); disabled for now
    });

    module.hot.accept('./game/initialize.ts', function() {
        console.log("Accepting updated initialize");
        //reloadWorld(); disabled for now
    });
}