import { Coordinate } from "./coordinate-system/coordinate"

export function pathfind(start: Coordinate, end: Coordinate, passableCallback: (pos: Coordinate) => Boolean): Coordinate[] {
    return aStarPathfind(start, end, passableCallback)
}

function aStarPathfind(start: Coordinate, end: Coordinate, passableCallback: (pos: Coordinate) => Boolean): Coordinate[] {
    const frontier: Coordinate[] = [start]
    const visited: Coordinate[] = []
    
    //while (frontier.length > 0) {
    //    const nextCoordinate = frontier.;
    //}
    
    return []
}