import { Bishop } from './Bishop.js';
import * as CustomTypes from './CustomTypes.js';
export class WhiteBishop extends Bishop {
    constructor() {
        super('WHITE', CustomTypes.Img.WHITE_BISHOP, CustomTypes.PieceType.BISHOP);
        this.appendPieceToBoard(WhiteBishop.freeIndexes.pop());
    }
}
WhiteBishop.freeIndexes = [58, 61];
