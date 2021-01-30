import { Coordinate } from "./coordinate-system/coordinate"
import { coordinateToXY, getDistance } from "./coordinate-system/omnipotent-coordinates" 

//TODO: please where do I put this help meeeeeee
export class CoordinateDirectionVector {
    x: number
    y: number
    z: number

    static schema = {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    }
    // this might be very-sin, The Emperor might purge me of this heresy, for he is is all-powerful
    constructor(x : number,y: number,z: number){
        this.x = x
        this.y = y
        this.z = z
    }
}

export function pathfind(start: Coordinate, end: Coordinate, passableCallback: (pos: Coordinate) => Boolean): Coordinate[] {
    //return aStarPathfind(start, end, passableCallback)
    return breadthFirstPathfind(start, end, passableCallback)
}

function breadthFirstPathfind(start: Coordinate, end: Coordinate, passableCallback: (pos: Coordinate) => Boolean): Coordinate[]{
    const visited: Coordinate[] = []
    const path: Coordinate[] = []
    
    const frontier: Coordinate[] = [start]
    // the loop starts with first coordinate by default
    while (frontier.length > 0) {
        const newAnalysisCoordinate = frontier[frontier.length - 1]
        //const neighbors =
    }
    return [];
}

function aStarPathfind(start: Coordinate, end: Coordinate, passableCallback: (pos: Coordinate) => Boolean): Coordinate[] {
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

function getNeighborCoordinates(origin: Coordinate, passableCallback: (pos: Coordinate) => Boolean) : Coordinate[]{
    const result : Coordinate[] = []
    const dirSet : CoordinateDirectionVector[] = []
    const leftUp : CoordinateDirectionVector = new CoordinateDirectionVector(0,0,0);
    dirSet.push(leftUp)

    for (let index = 0; index < 6; index++) {
        if (tryGetNeighborCoordinate(origin, passableCallback)){
            result.push()
        }
    }
    return result;
}

// this is way too deep function repetition and callback pass, but I try to memorize the syntax by doing it
function tryGetNeighborCoordinate(origin: Coordinate, passableCallback: (pos: Coordinate) => Boolean): Boolean {
    return passableCallback(origin)
}
