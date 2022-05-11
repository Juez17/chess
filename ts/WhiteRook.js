import * as CustomTypes from './CustomTypes.js';
import { Rook } from './Rook.js';
export class WhiteRook extends Rook {
    constructor() {
        super('WHITE', CustomTypes.Img.WHITE_ROOK, CustomTypes.PieceType.ROOK);
        this.appendPieceToBoard(WhiteRook.freeIndexes.pop());
        WhiteRook.counter++;
        // order of freeIndexes is important, should be   static freeIndexes = [56, 63];
        if (WhiteRook.counter === 1)
            WhiteRook.rightRook = this;
        else
            WhiteRook.leftRook = this;
    }
}
// don't change the order! it's useful here: if(WhiteRook.counter === 1) WhiteRook.leftRook = this;
WhiteRook.freeIndexes = [56, 63];
WhiteRook.counter = 0;
