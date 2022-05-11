import { Piece } from './Piece.js';
import { VirtualGameBoard } from './VirtualGameBoard.js';
import { King } from './King.js';
export class Bishop extends Piece {
    constructor() {
        super(...arguments);
        this.getPossibleMovesIndexes = () => {
            let possibleMoves = [];
            let row = Math.floor(this.currentIndex / 8);
            let column = this.currentIndex - row * 8;
            // console.log('CURRENTINDEX:', this.currentIndex);
            // move left-up 
            //with 0 it's <= and >= because indexes start at 0
            // with 8 is < and > because indexes end at 7!
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
