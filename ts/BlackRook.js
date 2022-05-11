import * as CustomTypes from './CustomTypes.js';
import { Rook } from './Rook.js';
export class BlackRook extends Rook {
    constructor() {
        super('BLACK', CustomTypes.Img.BLACK_ROOK, CustomTypes.PieceType.ROOK);
        this.appendPieceToBoard(BlackRook.freeIndexes.pop());
        BlackRook.counter++;
        // order of freeIndexes is important, should be   static freeIndexes = [56, 63];
        if (BlackRook.counter === 1)
            BlackRook.rightRook = this;
        else
            BlackRook.leftRook = this;
    }
}
// don't change the order! it's useful here: if(WhiteRook.counter === 1) WhiteRook.leftRook = this;
BlackRook.freeIndexes = [0, 7];
BlackRook.counter = 0;
