import * as CustomTypes from './CustomTypes.js';
import { Knight } from './Knight.js';
export class BlackKnight extends Knight {
    constructor() {
        super('BLACK', CustomTypes.Img.BLACK_KNIGHT, CustomTypes.PieceType.KNIGHT);
        this.appendPieceToBoard(BlackKnight.freeIndexes.pop());
    }
}
BlackKnight.freeIndexes = [1, 6];
