import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { TurnCount, TurnEndOrder, TurnStarted } from './turn-count'

export const TurnEntityName = 'turnBuoy'

// tslint:disable-next-line: one-variable-per-declaration
export let startingTurn: any = {
    components: [TurnCount, TurnStarted],
    listen: {
        added: true
    }
}

export let turnEvents: any = {
    components: [TurnCount, TurnEndOrder],
    listen: {
        added: true
    }
}

@registerWithPriority(2)
export class TurnSystem extends System {
    static queries = {
        turnEvents
    }


    init() {
        const turnEntity = this.world.createEntity(TurnEntityName)
        turnEntity.addComponent(TurnCount)
    }


    execute(delta: number, time: number): void {
        this.queries.turnEvents.added!.forEach(entity => {
            const turnCount = entity.getMutableComponent(TurnCount)!
            turnCount.value++

            entity.removeComponent(TurnEndOrder)
            entity.addComponent(TurnStarted)
        })
    }
}

@registerWithPriority(10000)
export class TurnSystemCleanUp extends System {
    static queries = {
        startingTurn
    }

    execute(delta: number, time: number): void {
        this.queries.startingTurn.added!.forEach(entity => {
            entity.removeComponent(TurnStarted)
        })
    }
}