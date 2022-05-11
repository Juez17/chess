import { Piece } from './Piece.js';
import { VirtualGameBoard } from './VirtualGameBoard.js';
import { King } from './King.js';
export class Queen extends Piece {
    constructor() {
        super(...arguments);
        this.getPossibleMovesIndexes = () => {
            let possibleMoves = [];
            let row = Math.floor(this.currentIndex / 8);
            let column = this.currentIndex - row * 8;
            // console.log('CURRENTINDEX:', this.currentIndex);
            //with 0 it's <= and >= because indexes start at 0
            // with 8 is < and > because indexes end at 7!
            //======================================================================================
            //START DIAGONALLY
            // move left-up 
            for (let i = 1; row - i >= 0 && column - i >= 0; i++) {
                // console.log('MOVE- LEFT UP',this.currentIndex - (i * 9));
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex - (i * 9))) {
                    if (!this.isYourFriendOnField(this.currentIndex - (i * 9))) {
                        possibleMoves.push(this.currentIndex - (i * 9));
                    }
                    break;
                }
                possibleMoves.push(this.currentIndex - (i * 9));
            }
            //move right-up
            for (let i = 1; row - i >= 0 && column + i < 8; i++) {
                // console.log('MOVE- RIGHT UP',this.currentIndex - (i * 7));
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex - (i * 7))) {
                    if (!this.isYourFriendOnField(this.currentIndex - (i * 7))) {
                        possibleMoves.push(this.currentIndex - (i * 7));
                    }
                    break;
                }
                possibleMoves.push(this.currentIndex - (i * 7));
            }
            // //move down-left
            for (let i = 1; row - i <= 8 && column - i >= 0; i++) {
                // console.log('wykonuje',this.currentIndex + (i * 7));
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex + (i * 7))) {
                    if (!this.isYourFriendOnField(this.currentIndex + (i * 7))) {
                        possibleMoves.push(this.currentIndex + (i * 7));
                    }
                    break;
                }
                possibleMoves.push(this.currentIndex + (i * 7));
                // console.log('checking', this.currentIndex + (i * 7));
            }
            // //move down-right
            for (let i = 1; row - i <= 8 && column + i < 8; i++) {
                // console.log('wykonuje',this.currentIndex + (i * 9));
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex + (i * 9))) {
                    if (!this.isYourFriendOnField(this.currentIndex + (i * 9))) {
                        possibleMoves.push(this.currentIndex + (i * 9));
                    }
                    break;
                }
                possibleMoves.push(this.currentIndex + (i * 9));
                // console.log('checking', this.currentIndex + (i * 9));
            }
            //END DIAGONALLY
            //======================================================================================
            //======================================================================================
            //START STRAIGHT CHECK
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
            //END STRAIGHT CHECK
            //======================================================================================
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
