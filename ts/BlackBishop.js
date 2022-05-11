import { Bishop } from './Bishop.js';
import * as CustomTypes from './CustomTypes.js';
export class BlackBishop extends Bishop {
    constructor() {
        super('BLACK', CustomTypes.Img.BLACK_BISHOP, CustomTypes.PieceType.BISHOP);
        this.appendPieceToBoard(BlackBishop.freeIndexes.pop());
    }
}
BlackBishop.freeIndexes = [2, 5];
