import { System } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { TurnCount, TurnEndOrder, TurnStarted, TurnEnded } from './turn-count'

export let startingTurn: any = {
    components: [TurnCount, TurnStarted],
    listen: {
        added: true
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
