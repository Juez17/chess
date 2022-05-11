import { Piece } from './Piece.js';
import * as CustomTypes from './CustomTypes.js';
import { VirtualGameBoard } from './VirtualGameBoard.js';
import { King } from './King.js';
import { WhiteQueen } from './WhiteQueen.js';
import { appVirtualGameBoard } from '../app.js';
import { BlackQueen } from './BlackQueen.js';
export class Pawn extends Piece {
    constructor(color) {
        super(color, color === 'BLACK'
            ? CustomTypes.Img.BLACK_PAWN
            : CustomTypes.Img.WHITE_PAWN, CustomTypes.PieceType.PAWN);
        this.hasTakenEnPassant = false;
        this.getPossibleMovesIndexes = () => {
            let possibleMoves = [];
            // alert(this.doneMoves);
            // checks if moved pawn is black - if it is, it can go only down the board
            if (this.pieceColor === 'BLACK') {
                // if -  checks if you move initially - you can move then 2 checkers forward
                if (this.doneMoves === 0) {
                    if (VirtualGameBoard.isFieldEmpty(this.currentIndex + 8) &&
                        VirtualGameBoard.isFieldEmpty(this.currentIndex + 16)) {
                        possibleMoves.push(this.currentIndex + 16);
                    }
                }
                // if it's not pawn's initial move, you can move only 1 checker forward then
                if (VirtualGameBoard.isFieldEmpty(this.currentIndex + 8)) {
                    possibleMoves.push(this.currentIndex + 8);
                }
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex + 7) && (this.currentIndex % 8 !== 0)) {
                    possibleMoves.push(this.currentIndex + 7);
                }
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex + 9) && (this.currentIndex % 8 !== 7)) {
                    possibleMoves.push(this.currentIndex + 9);
                }
                if (this.canTakeEnPassant('LEFT')) {
                    possibleMoves.push(this.currentIndex + 7);
                }
                if (this.canTakeEnPassant('RIGHT')) {
                    possibleMoves.push(this.currentIndex + 9);
                }
            }
            // checks if moved pawn is black - if it is, it can go only up the board
            else {
                // if -  checks if you move initially - you can move then 2 checkers forward
                if (this.doneMoves === 0) {
                    if (VirtualGameBoard.isFieldEmpty(this.currentIndex - 8) &&
                        VirtualGameBoard.isFieldEmpty(this.currentIndex - 16)) {
                        possibleMoves.push(this.currentIndex - 16);
                    }
                }
                // if it's not pawn's initial move, you can move only 1 checker forward then
                if (VirtualGameBoard.isFieldEmpty(this.currentIndex - 8)) {
                    possibleMoves.push(this.currentIndex - 8);
                }
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex - 7) && (this.currentIndex % 8 !== 7)) {
                    possibleMoves.push(this.currentIndex - 7);
                }
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex - 9) && (this.currentIndex % 8 !== 0)) {
                    possibleMoves.push(this.currentIndex - 9);
                }
                if (this.canTakeEnPassant('LEFT')) {
                    possibleMoves.push(this.currentIndex - 9);
                }
                if (this.canTakeEnPassant('RIGHT')) {
                    possibleMoves.push(this.currentIndex - 7);
                }
            }
            // for(const index of possibleMoves) {
            //     console.log('INDEX:' , index)
            //     if(King.willMyKingBeChecked.call(this, index)) {
            //         // if it can't be moved to this index, delete the impossible index from possibleMoves array
            //         possibleMoves.splice(possibleMoves.indexOf(index), 1);
            //     }
            // }
            let kingsIndexAr = [King.Kings[0].currentIndex, King.Kings[1].currentIndex];
            possibleMoves = possibleMoves.filter((digit) => {
                if (digit > 63 || digit < 0)
                    return false;
                if (digit === kingsIndexAr[0] || digit === kingsIndexAr[1])
                    return false;
                if (this.isYourFriendOnField(digit))
                    return false;
                if (King.willMyKingBeChecked.call(this, digit))
                    return false;
                return true;
            });
            Piece.currentPossibleMoves = possibleMoves;
            return possibleMoves;
        };
        // arrayOfPawnsToBeCreated - either freeIndexesWhite OR  freeIndexesBlack
        const arrayOfPawnsToBeCreated = color === 'BLACK' ? Pawn.freeIndexesBlack : Pawn.freeIndexesWhite;
        this.appendPieceToBoard(arrayOfPawnsToBeCreated.pop());
    }
    canTakeEnPassant(direction) {
        let row = Math.floor(this.currentIndex / 8);
        let column = Math.floor(this.currentIndex % 8);
        //it can only do it once
        if (this.hasTakenEnPassant === true)
            return false;
        // console.log('CANTAKE, row', row);
        // for white pawn, check if is in the right row
        if ((this.pieceColor === 'WHITE' && row === 3) || (this.pieceColor === 'BLACK' && row === 4)) {
            // check if it can even go left
            if (direction === 'LEFT' && column !== 0) {
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex - 1)) {
                    let suspectedPawnIndex = VirtualGameBoard.findPieceInVirtualBoard(this.currentIndex - 1);
                    // checks if it's a pawn that is taken into consideration to takeEnPass
                    //checks if the pawn on the left really moved twofold and that it's the piece that moved as the last one
                    if (Piece.lastMoved.pieceType === CustomTypes.PieceType.PAWN && Piece.lastMoved.doneMoves === 1 && Piece.lastMoved === VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][suspectedPawnIndex][0]) {
                        return true;
                    }
                }
            }
            // check if it can go right
            else if (direction === 'RIGHT' && column != 7) {
                if (!VirtualGameBoard.isFieldEmpty(this.currentIndex + 1)) {
                    let suspectedPawnIndex = VirtualGameBoard.findPieceInVirtualBoard(this.currentIndex + 1);
                    // checks if it's a pawn that is taken into consideration to takeEnPass
                    //checks if the pawn on the left really moved twofold and that it's the piece that moved as the last one
                    if (Piece.lastMoved.pieceType === CustomTypes.PieceType.PAWN && Piece.lastMoved.doneMoves === 1 && Piece.lastMoved === VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][suspectedPawnIndex][0]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    changeIntoQueen() {
        let pawnIndexInAppVirtualGameBoard = 0;
        for (let i = 0; i < appVirtualGameBoard.length; i++) {
            console.log('porownanie:', appVirtualGameBoard[i][0] === this);
            console.log('i:', i);
            if (appVirtualGameBoard[i][0] === this) {
                pawnIndexInAppVirtualGameBoard = i;
                break;
            }
        }
        if (this.pieceColor === 'WHITE') {
            WhiteQueen.freeIndexes.push(this.currentIndex);
            appVirtualGameBoard[pawnIndexInAppVirtualGameBoard][0] = new WhiteQueen();
        }
        else {
            BlackQueen.freeIndexes.push(this.currentIndex);
            appVirtualGameBoard[pawnIndexInAppVirtualGameBoard][0] = new BlackQueen();
        }
    }
    shouldChangeIntoQueen() {
        if (this.currentIndex < 8 && this.pieceColor === 'WHITE')
            return true;
        if (this.currentIndex > 55 && this.pieceColor === 'BLACK')
            return true;
        return false;
    }
}
// indexes of free spaces to allocate pawns to
// if lengths reach 0, no more pawns can be created of that color
Pawn.freeIndexesWhite = [48, 49, 50, 51, 52, 53, 54, 55];
Pawn.freeIndexesBlack = [8, 9, 10, 11, 12, 13, 14, 15];
