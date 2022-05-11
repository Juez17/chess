import { Piece } from './Piece.js';
import { VirtualGameBoard } from './VirtualGameBoard.js';
import { King } from './King.js';
export class Rook extends Piece {
    constructor() {
        // abstract getPossibleMovesIndexes: () => number[];
        super(...arguments);
        this.getPossibleMovesIndexes = () => {
            let possibleMoves = [];
            let row = Math.floor(this.currentIndex / 8);
            let column = this.currentIndex - row * 8;
            // movements up
            for (let i = 1; i < row + 1; i++) {
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex - (i * 8))) {
                    if (!this.isYourFriendOnField(this.currentIndex - (i * 8))) {
                        possibleMoves.push(this.currentIndex - (i * 8));
                    }
                    break;
                }
                possibleMoves.push(this.currentIndex - (i * 8));
            }
            // movements down
            for (let i = row + 1; i < 8; i++) {
                if (!VirtualGameBoard.isFieldEmpty(column + (i * 8))) {
                    if (!this.isYourFriendOnField(column + (i * 8))) {
                        possibleMoves.push(column + (i * 8));
                    }
                    break;
                }
                possibleMoves.push(column + (i * 8));
                // console.log('checking', column + (i * 8));
            }
            //movements left
            for (let i = 1; i < column + 1; i++) {
                if (!VirtualGameBoard.isFieldEmpty((row * 8) + column - i)) {
                    // console.log('IFFFF');
                    // console.log('LOGG',(row * 8) + column - i);
                    if (!this.isYourFriendOnField((row * 8) + column - i)) {
                        possibleMoves.push((row * 8) + column - i);
                    }
                    break;
                }
                possibleMoves.push((row * 8) + column - i);
            }
            //movements right
            for (let i = column + 1; i < 8; i++) {
                if (!VirtualGameBoard.isFieldEmpty((row * 8) + i)) {
                    // console.log('IFFFF');
                    // console.log('LOGG',(row * 8) +  i);
                    if (!this.isYourFriendOnField((row * 8) + i)) {
                        possibleMoves.push((row * 8) + i);
                    }
                    break;
                }
                possibleMoves.push((row * 8) + i);
            }
            // console.log('possiblemoves', possibleMoves);
            let kingsIndexAr = [King.Kings[0].currentIndex, King.Kings[1].currentIndex];
            possibleMoves = possibleMoves.filter((digit) => {
                if ((digit > 63) || (digit < 0))
                    return false;
                if (this.isYourFriendOnField(digit))
                    return false;
                if (digit === kingsIndexAr[0] || digit === kingsIndexAr[1])
                    return false;
                if (King.willMyKingBeChecked.call(this, digit))
                    return false;
                return true;
            });
            Piece.currentPossibleMoves = possibleMoves;
            return possibleMoves;
        };
    }
}
