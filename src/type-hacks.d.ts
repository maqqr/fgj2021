import { Entity } from 'ecsy'

declare module 'ecsy' {
    interface EntityManager<EntityType extends Entity = Entity> {
        // All EntityManager methods must be defined here

        getEntityByName(name: string): EntityType | undefined
    }

    interface World<EntityType extends Entity = Entity> {
        entityManager: EntityManager<EntityType> // entityManager is normally not accessible, now it is
    }
}
