import * as CustomTypes from './CustomTypes.js';
import { Knight } from './Knight.js';
export class WhiteKnight extends Knight {
    constructor() {
        super('WHITE', CustomTypes.Img.WHITE_KNIGHT, CustomTypes.PieceType.KNIGHT);
        this.appendPieceToBoard(WhiteKnight.freeIndexes.pop());
    }
}
WhiteKnight.freeIndexes = [57, 62];
