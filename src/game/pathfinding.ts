import { Coordinate } from "./coordinate-system/coordinate"
import { coordinateToXY, equalCoordinates, getDistance, getNeighbourCoordinates } from "./coordinate-system/omnipotent-coordinates"



export function pathfind(start: Coordinate, end: Coordinate,
                         passableCallback: (pos: Coordinate) => boolean): Coordinate[] {
    return breadthFirstPathfind(start, end, passableCallback)
}

function breadthFirstPathfind(start: Coordinate, end: Coordinate,
                              passableCallback: (pos: Coordinate) => boolean): Coordinate[] {
    if (start === undefined || end === undefined) {
        console.error("pathfind start or end if undefined")
    }

    const frontier: Coordinate[] = [start]
    const cameFrom : {[id: string] : Coordinate} = {}

    let foundPath = false

    // the loop starts with first coordinate by default
    while (frontier.length > 0) {
        const newAnalysisCoordinate = frontier[0]
        frontier.splice(0, 1)
        if (equalCoordinates(newAnalysisCoordinate, end)) {
            foundPath = true
            break
        }
        for (const next of checkNeighbourCoordinates(newAnalysisCoordinate, passableCallback)) {
            const key : string = "" + next.x + "," + next.y + "," + next.z
            if (!(key in cameFrom)){
                frontier.push(next)
                cameFrom[key] = newAnalysisCoordinate
            }
        }
    }

    if (!foundPath) {
        return []
    }

    let current : Coordinate = end
    const path: Coordinate[] = []
    while (!equalCoordinates(current, start)) {
        path.push(current)
        const key : string = "" + current.x + "," + current.y + "," + current.z
        current = cameFrom[key]

        if (current === undefined)
            break
    }
    path.push(start)
    return path.reverse()
}

function aStarPathfind(start: Coordinate, end: Coordinate,
                       passableCallback: (pos: Coordinate) => boolean): Coordinate[] {
    const frontier: Coordinate[] = [start]
    const visited: Coordinate[] = []
    const path: Coordinate[] = []
    // first try
    /*
    while (frontier.length > 0) {
        const nextCoordinate = frontier[length - 1]
        if (nextCoordinate === end){
            console.log("Found target coordinate " + nextCoordinate);
            return path;
        }
        // check the closest coordinates and find one that is closest to the target
        // currently doesn't take into account any terrain
        let closestDistance = Number.MAX_VALUE
        let closestCoordinate = frontier[0]
        for (let index = 0; index < frontier.length; index++) {
            const element = frontier[index]
            const currentDistance = getDistance(element, end)
            if (currentDistance <= closestDistance){
                if (tryGetNeighboringCoordinate(frontier[index], passableCallback)){
                    // found a way that is closer to the target
                    closestDistance = currentDistance
                    closestCoordinate = frontier[index]
                }
            }
            visited.push(frontier[index])
        }
    }
    */
    return []
}

export function checkNeighbourCoordinates(origin: Coordinate,
                                          passableCallback: (pos: Coordinate) => boolean) : Coordinate[] {
    const result : Coordinate[] = []

    const unfilteredNeighbors : Coordinate[] = getNeighbourCoordinates(origin)

    for (const element of unfilteredNeighbors) {
        if (passableCallback(element)){
            result.push(element)
        }
    }

    return result
}
