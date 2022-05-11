import { Queen } from './Queen.js';
import * as CustomTypes from './CustomTypes.js';
export class WhiteQueen extends Queen {
    constructor() {
        super('WHITE', CustomTypes.Img.WHITE_QUEEN, CustomTypes.PieceType.QUEEN);
        this.appendPieceToBoard(WhiteQueen.freeIndexes.pop());
    }
}
WhiteQueen.freeIndexes = [59];
