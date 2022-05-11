import { Piece } from './Piece.js';
import * as CustomTypes from './CustomTypes.js';
import { VirtualGameBoard } from './VirtualGameBoard.js';
import { WhiteRook } from './WhiteRook.js';
import { BlackRook } from './BlackRook.js';
export class King extends Piece {
    constructor(color) {
        super(color, color === 'BLACK'
            ? CustomTypes.Img.BLACK_KING
            : CustomTypes.Img.WHITE_KING, CustomTypes.PieceType.KING);
        this.getPossibleMovesIndexes = () => {
            let possibleMoves = [];
            if (this.currentIndex % 8 === 7) {
                possibleMoves.push(this.currentIndex - 8, this.currentIndex - 9, this.currentIndex - 1, this.currentIndex + 7, this.currentIndex + 8);
            }
            else if (this.currentIndex % 8 === 0) {
                possibleMoves.push(this.currentIndex - 8, this.currentIndex + 8, this.currentIndex - 7, this.currentIndex + 9, this.currentIndex + 1);
            }
            else {
                possibleMoves.push(this.currentIndex - 7, this.currentIndex - 8, this.currentIndex - 9, this.currentIndex - 1, this.currentIndex + 1, this.currentIndex + 7, this.currentIndex + 8, this.currentIndex + 9);
            }
            // if the king has already moved, it can't do any castling
            if (this.doneMoves === 0) {
                // if fields are empty between the rook and the king
                // if king isn't checked
                if (VirtualGameBoard.isFieldEmpty(this.currentIndex - 3) && VirtualGameBoard.isFieldEmpty(this.currentIndex - 1)) {
                    if (!this.isKingChecked() && !King.willMyKingBeChecked.call(this, this.currentIndex - 1)) {
                        // checks if the rook in question has previously done any moves 
                        let rook = BlackRook.leftRook;
                        if (this.pieceColor === 'WHITE') {
                            rook = WhiteRook.leftRook;
                        }
                        const pieceFound = VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][VirtualGameBoard.findPieceInVirtualBoard(rook.currentIndex)][0];
                        if (rook.doneMoves === 0 && pieceFound === rook) {
                            // console.log('ROOK',rook);
                            possibleMoves.push(this.currentIndex - 2);
                        }
                    }
                }
                if ((VirtualGameBoard.isFieldEmpty(this.currentIndex + 2)) && (VirtualGameBoard.isFieldEmpty(this.currentIndex + 1))) {
                    if (!this.isKingChecked() && !King.willMyKingBeChecked.call(this, this.currentIndex + 1)) {
                        // checks if the rook in question has previously done any moves 
                        let rook = BlackRook.rightRook;
                        if (this.pieceColor === 'WHITE') {
                            rook = WhiteRook.rightRook;
                        }
                        // console.log('current Index of the rook:', rook.currentIndex);
                        // console.log('found??',VirtualGameBoard.findPieceInVirtualBoard(rook.currentIndex));
                        // console.log(VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
                        const pieceFound = VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][VirtualGameBoard.findPieceInVirtualBoard(rook.currentIndex)][0];
                        // console.log('pieceFound',pieceFound);
                        // && VirtualGameBoard.findPieceInVirtualBoard(rook.currentIndex) !== -1
                        if (rook.doneMoves === 0 && pieceFound === rook) {
                            // console.log('ROOK',rook);
                            possibleMoves.push(this.currentIndex + 2);
                        }
                    }
                }
            }
            possibleMoves = possibleMoves.filter((digit) => {
                // console.log('filter');
                if (digit > 63 || digit < 0)
                    return false;
                if (this.isYourFriendOnField(digit))
                    return false;
                if (King.willMyKingBeChecked.call(this, digit))
                    return false;
                return true;
            });
            // console.log(`POSSIBLE MOVES`, possibleMoves);
            possibleMoves = possibleMoves.filter((possibleMove) => {
                if (King.willMyKingBeChecked.call(this, possibleMove)) {
                    return false;
                }
                return true;
            });
            // console.log(`POSSIBLE MOVES`, possibleMoves);
            Piece.currentPossibleMoves = possibleMoves;
            return possibleMoves;
        };
        King.Kings.push(this);
        // arrayOfPawnsToBeCreated - either freeIndexesWhite OR  freeIndexesBlack
        const arrayOfKingsToBeCreated = color === 'BLACK' ? King.freeIndexesBlack : King.freeIndexesWhite;
        this.appendPieceToBoard(arrayOfKingsToBeCreated.pop());
    }
    castleLong() {
        if (this.pieceColor === 'WHITE') {
            WhiteRook.leftRook.currentIndex += 3;
        }
        else {
            BlackRook.leftRook.currentIndex += 3;
        }
    }
    castleShort() {
        if (this.pieceColor === 'WHITE') {
            WhiteRook.rightRook.currentIndex -= 2;
        }
        else {
            BlackRook.rightRook.currentIndex -= 2;
        }
    }
    isKingChecked() {
        // console.log('isKINGCHECKEDAR: ', VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
        let lastAr = VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1];
        let blackKingIndex = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.KING, 'BLACK')[0][1];
        // console.log('BLACKKINGIDEX:', blackKingIndex);
        let whiteKingIndex = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.KING, 'WHITE')[0][1];
        // console.log('WHITEKINGIDEX:', whiteKingIndex);
        let kingsIndexInAr = this.pieceColor === 'BLACK' ? blackKingIndex : whiteKingIndex;
        // console.log(
        //   'PIZZ IS KING CHECKED - SHOWING YOU LAST ARRAY: ',
        //   VirtualGameBoard.virtualGameBoardsArray[
        //     VirtualGameBoard.virtualGameBoardsArray.length - 1
        //   ]
        // );
        ////////////////////////////////////////////////////////////////////////////////////////
        // START WHITEPAWN
        if (this.pieceColor === 'WHITE') {
            const checkedByBlack = [];
            const blackPawnsAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.PAWN, 'BLACK');
            // console.log('blackPawnsAr:',blackPawnsAr);
            for (let i = 0; i <= blackPawnsAr.length - 1; i++) {
                if (blackPawnsAr[i][0].isBeingTaken())
                    continue;
                // console.log(lastAr[blackPawnsAr[i][1]]);
                // console.log(blackPawnsAr[i][1]);
                let pawnIndex = lastAr[blackPawnsAr[i][1]][1];
                // console.log(pawnIndex);
                if (pawnIndex % 8 === 7) {
                    // console.log('if, pushing: ', pawnIndex+7);
                    checkedByBlack.push(pawnIndex + 7);
                }
                else if (pawnIndex % 8 === 0) {
                    // console.log('else if, pushing: ', pawnIndex+9);
                    checkedByBlack.push(pawnIndex + 9);
                }
                else {
                    // console.log('else, pushing:', pawnIndex+7, pawnIndex+9 );
                    checkedByBlack.push(pawnIndex + 9, pawnIndex + 7);
                }
            }
            // console.log('PIZZ CHECKED BY BLACKS ', checkedByBlack);
            // console.log('PIZZ lastAr[8][1] = ', lastAr[whiteKingIndex][1]);
            if (checkedByBlack.indexOf(lastAr[whiteKingIndex][1]) !== -1) {
                // console.log('PIZZ ZWRACAM TRUE');
                return true;
            }
        }
        //END WHITEPAWN
        // START BLACKPAWN
        else {
            const checkedByWhites = [];
            const whitePawnsAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.PAWN, 'WHITE');
            // console.log('whitePawnsAr:',whitePawnsAr);
            for (let i = 0; i <= whitePawnsAr.length - 1; i++) {
                if (whitePawnsAr[i][0].isBeingTaken())
                    continue;
                // console.log(lastAr[whitePawnsAr[i][1]]);
                // console.log(whitePawnsAr[i][1]);
                let pawnIndex = lastAr[whitePawnsAr[i][1]][1];
                // console.log(pawnIndex);
                if (pawnIndex % 8 === 7) {
                    // console.log('if, pushing: ', pawnIndex-9);
                    checkedByWhites.push(pawnIndex - 9);
                }
                else if (pawnIndex % 8 === 0) {
                    // console.log('else if, pushing: ', pawnIndex-7);
                    checkedByWhites.push(pawnIndex - 7);
                }
                else {
                    // console.log('else, pushing:', pawnIndex-7, pawnIndex-9 );
                    checkedByWhites.push(pawnIndex - 9, pawnIndex - 7);
                }
            }
            // console.log('PIZZ CHECKED BY BLACKS ', checkedByWhites);
            // console.log('PIZZ lastAr[8][1] = ', lastAr[blackKingIndex][1]);
            if (checkedByWhites.indexOf(lastAr[blackKingIndex][1]) !== -1) {
                // console.log('PIZZ ZWRACAM TRUE');
                return true;
            }
        }
        //end BLACKPAWN
        ////////////////////////////////////////////////////////////////////////////////////////
        //START WHITE KING
        if (this.pieceColor === 'BLACK') {
            const checkedByWhites = [];
            const whiteKing = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.KING, 'WHITE')[0][0];
            // console.log('whitePawnsAr:',whitePawnsAr);
            // console.log('WHITEKINGAR',whiteKing.currentIndex);
            checkedByWhites.push(whiteKing.currentIndex - 9, whiteKing.currentIndex - 8, whiteKing.currentIndex - 7, whiteKing.currentIndex - 1, whiteKing.currentIndex + 1, whiteKing.currentIndex + 7, whiteKing.currentIndex + 8, whiteKing.currentIndex + 9);
            if (checkedByWhites.indexOf(lastAr[blackKingIndex][1]) !== -1) {
                // console.log('PIZZ ZWRACAM TRUE');
                return true;
            }
        }
        // //END WHITE KING
        // //START BLACK KING
        else {
            const checkedByBlacks = [];
            const blackKing = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.KING, 'BLACK')[0][0];
            // console.log('blackKingAR',blackKing.currentIndex);
            checkedByBlacks.push(blackKing.currentIndex - 9, blackKing.currentIndex - 8, blackKing.currentIndex - 7, blackKing.currentIndex - 1, blackKing.currentIndex + 1, blackKing.currentIndex + 7, blackKing.currentIndex + 8, blackKing.currentIndex + 9);
            if (checkedByBlacks.indexOf(lastAr[whiteKingIndex][1]) !== -1) {
                // console.log('PIZZ ZWRACAM TRUE');
                return true;
            }
        }
        //END BLACK KING
        ////////////////////////////////////////////////////////////////////////////////////////
        //START WHITE KNIGHT
        if (this.pieceColor === 'BLACK') {
            const checkedByWhite = [];
            const whiteKnightsAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.KNIGHT, 'WHITE');
            // console.log('whiteKnightAr:', whiteKnightsAr);
            for (let i = 0; i <= whiteKnightsAr.length - 1; i++) {
                if (whiteKnightsAr[i][0].isBeingTaken())
                    continue;
                // console.log(lastAr[whiteKnightsAr[i][1]]);
                // console.log(whiteKnightsAr[i][1]);
                let pawnIndex = lastAr[whiteKnightsAr[i][1]][1];
                // console.log(pawnIndex);
                // pawnIndex % 8 === 7
                if (pawnIndex % 8 === 7) {
                    checkedByWhite.push(pawnIndex - 17, pawnIndex + 15, pawnIndex - 10, pawnIndex + 6);
                }
                else if (pawnIndex % 8 === 0) {
                    checkedByWhite.push(pawnIndex - 15, pawnIndex + 17, pawnIndex + 10, pawnIndex - 6);
                }
                else if (pawnIndex % 8 === 1) {
                    checkedByWhite.push(pawnIndex - 15, pawnIndex + 15, pawnIndex - 17, pawnIndex + 17, pawnIndex + 10, pawnIndex - 6);
                }
                else if (pawnIndex % 8 === 6) {
                    checkedByWhite.push(pawnIndex - 15, pawnIndex + 15, pawnIndex - 17, pawnIndex + 17, pawnIndex - 10, pawnIndex + 6);
                }
                else {
                    checkedByWhite.push(pawnIndex - 15, pawnIndex + 15, pawnIndex - 17, pawnIndex + 17, pawnIndex - 10, pawnIndex + 6, pawnIndex + 10, pawnIndex - 6);
                }
            }
            // console.log('PIZZ CHECKED BY WHITES', checkedByWhite);
            if (checkedByWhite.indexOf(lastAr[blackKingIndex][1]) !== -1) {
                // console.log('PIZZ ZWRACAM TRUE');
                return true;
            }
        }
        //END WHITE KNIGHT
        //START BLACK KNIGHT
        else {
            const checkedByBlack = [];
            const blackKnightsAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.KNIGHT, 'BLACK');
            // console.log('whiteKnightAr:', blackKnightsAr);
            for (let i = 0; i <= blackKnightsAr.length - 1; i++) {
                if (blackKnightsAr[i][0].isBeingTaken())
                    continue;
                // console.log(lastAr[blackKnightsAr[i][1]]);
                // console.log(blackKnightsAr[i][1]);
                let pawnIndex = lastAr[blackKnightsAr[i][1]][1];
                // console.log(pawnIndex);
                // pawnIndex % 8 === 7
                if (pawnIndex % 8 === 7) {
                    checkedByBlack.push(pawnIndex - 17, pawnIndex + 15, pawnIndex - 10, pawnIndex + 6);
                }
                else if (pawnIndex % 8 === 0) {
                    checkedByBlack.push(pawnIndex - 15, pawnIndex + 17, pawnIndex + 10, pawnIndex - 6);
                }
                else if (pawnIndex % 8 === 1) {
                    checkedByBlack.push(pawnIndex - 15, pawnIndex + 15, pawnIndex - 17, pawnIndex + 17, pawnIndex + 10, pawnIndex - 6);
                }
                else if (pawnIndex % 8 === 6) {
                    checkedByBlack.push(pawnIndex - 15, pawnIndex + 15, pawnIndex - 17, pawnIndex + 17, pawnIndex - 10, pawnIndex + 6);
                }
                else {
                    checkedByBlack.push(pawnIndex - 15, pawnIndex + 15, pawnIndex - 17, pawnIndex + 17, pawnIndex - 10, pawnIndex + 6, pawnIndex + 10, pawnIndex - 6);
                }
            }
            // console.log('PIZZ CHECKED BY WHITES', checkedByBlack);
            if (checkedByBlack.indexOf(lastAr[whiteKingIndex][1]) !== -1) {
                // console.log('PIZZ ZWRACAM TRUE');
                return true;
            }
        }
        //END BLACK KNIGHT
        ////////////////////////////////////////////////////////////////////////////////////////
        //START WHITE ROOK
        if (this.pieceColor === 'BLACK') {
            const checkedByWhite = [];
            const whiteRooksAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.ROOK, 'WHITE');
            // console.log('whiteRooksAr:', whiteRooksAr);
            outer: for (let j = 0; j <= whiteRooksAr.length - 1; j++) {
                // console.log(lastAr[whiteRooksAr[j][1]]);
                // console.log(whiteRooksAr[j][1]);
                let pawnIndex = lastAr[whiteRooksAr[j][1]][1];
                let row = Math.floor(pawnIndex / 8);
                let column = pawnIndex - row * 8;
                // console.log('CANTTT, ROW:', row);
                //movement up        
                for (let i = 1; i < row + 1; i++) {
                    // console.log('CURRENT',pawnIndex - (i * 8));
                    if (whiteRooksAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 8))) {
                        if (!whiteRooksAr[j][0].isYourFriendOnField(pawnIndex - (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push(pawnIndex - (i * 8));
                            break;
                        }
                        else {
                            checkedByWhite.push(pawnIndex - (i * 8));
                            break;
                        }
                    }
                    checkedByWhite.push(pawnIndex - (i * 8));
                }
                //movement down
                for (let i = row + 1; i < 8; i++) {
                    // console.log('CURRENT',column + (i * 8));
                    if (whiteRooksAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty(column + (i * 8))) {
                        if (!whiteRooksAr[j][0].isYourFriendOnField(column + (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push(column + (i * 8));
                            break;
                        }
                        else {
                            checkedByWhite.push(column + (i * 8));
                            break;
                        }
                    }
                    checkedByWhite.push(column + (i * 8));
                }
                // movement left 
                for (let i = 1; i < column + 1; i++) {
                    // console.log('CURRENT',(row * 8) + column - i);
                    if (whiteRooksAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + column - i)) {
                        if (!whiteRooksAr[j][0].isYourFriendOnField((row * 8) + column - i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push((row * 8) + column - i);
                            break;
                        }
                        else {
                            checkedByWhite.push((row * 8) + column - i);
                            break;
                        }
                    }
                    checkedByWhite.push((row * 8) + column - i);
                }
                // movement right
                for (let i = column + 1; i < 8; i++) {
                    // console.log('CURRENT',(row * 8) +  i);
                    if (whiteRooksAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + i)) {
                        if (!whiteRooksAr[j][0].isYourFriendOnField((row * 8) + i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push((row * 8) + i);
                            break;
                        }
                        else {
                            checkedByWhite.push((row * 8) + i);
                            break;
                        }
                    }
                    checkedByWhite.push((row * 8) + i);
                }
            }
            // console.log('checkedByWhite', checkedByWhite);
            if (checkedByWhite.indexOf(lastAr[blackKingIndex][1]) !== -1) {
                return true;
            }
        }
        //END WHITE ROOK
        //START BLACK ROOK
        else {
            const checkedByBlack = [];
            const blackRooksAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.ROOK, 'BLACK');
            // console.log('blackRooksAr:', blackRooksAr);
            outer: for (let j = 0; j <= blackRooksAr.length - 1; j++) {
                // console.log(lastAr[blackRooksAr[j][1]]);
                // console.log(blackRooksAr[j][1]);
                let pawnIndex = lastAr[blackRooksAr[j][1]][1];
                let row = Math.floor(pawnIndex / 8);
                let column = pawnIndex - row * 8;
                // console.log('CANTTT, ROW:', row);
                //movement up        
                for (let i = 1; i < row + 1; i++) {
                    // console.log('CURRENT',pawnIndex - (i * 8));
                    if (blackRooksAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 8))) {
                        if (!blackRooksAr[j][0].isYourFriendOnField(pawnIndex - (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push(pawnIndex - (i * 8));
                            break;
                        }
                        else {
                            checkedByBlack.push(pawnIndex - (i * 8));
                            break;
                        }
                    }
                    checkedByBlack.push(pawnIndex - (i * 8));
                }
                //movement down
                for (let i = row + 1; i < 8; i++) {
                    // console.log('CURRENT',column + (i * 8));
                    if (blackRooksAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty(column + (i * 8))) {
                        if (!blackRooksAr[j][0].isYourFriendOnField(column + (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push(column + (i * 8));
                            break;
                        }
                        else {
                            checkedByBlack.push(column + (i * 8));
                            break;
                        }
                    }
                    checkedByBlack.push(column + (i * 8));
                }
                // movement left 
                for (let i = 1; i < column + 1; i++) {
                    // console.log('CURRENT',(row * 8) + column - i);
                    if (blackRooksAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + column - i)) {
                        if (!blackRooksAr[j][0].isYourFriendOnField((row * 8) + column - i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push((row * 8) + column - i);
                            break;
                        }
                        else {
                            checkedByBlack.push((row * 8) + column - i);
                            break;
                        }
                    }
                    checkedByBlack.push((row * 8) + column - i);
                }
                // movement right
                for (let i = column + 1; i < 8; i++) {
                    // console.log('CURRENT',(row * 8) +  i);
                    if (blackRooksAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + i)) {
                        if (!blackRooksAr[j][0].isYourFriendOnField((row * 8) + i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push((row * 8) + i);
                            break;
                        }
                        else {
                            checkedByBlack.push((row * 8) + i);
                            break;
                        }
                    }
                    checkedByBlack.push((row * 8) + i);
                }
            }
            // console.log('checkedByBlack', checkedByBlack);
            if (checkedByBlack.indexOf(lastAr[whiteKingIndex][1]) !== -1) {
                return true;
            }
        }
        //END BLACK ROOK
        ////////////////////////////////////////////////////////////////////////////////////////
        //START WHITE BISHOP
        if (this.pieceColor === 'BLACK') {
            const checkedByWhite = [];
            const whiteBishopsAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.BISHOP, 'WHITE');
            // console.log('whiteBishopsAr:', whiteBishopsAr);
            outer: for (let j = 0; j <= whiteBishopsAr.length - 1; j++) {
                // console.log(lastAr[whiteBishopsAr[j][1]]);
                // console.log(whiteBishopsAr[j][1]);
                let pawnIndex = lastAr[whiteBishopsAr[j][1]][1];
                let row = Math.floor(pawnIndex / 8);
                let column = pawnIndex - row * 8;
                //move left-up
                for (let i = 1; row - i >= 0 && column - i >= 0; i++) {
                    if (whiteBishopsAr[j][0].isBeingTaken())
                        break;
                    // console.log('MOVE- LEFT UP',pawnIndex - (i * 9));
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 9))) {
                        // if(!whiteBishopsAr[j][0].isYourFriendOnField(pawnIndex - (i * 9))) {
                        //     checkedByWhite.push(pawnIndex - (i * 9));
                        // }
                        checkedByWhite.push(pawnIndex - (i * 9));
                        break;
                    }
                    checkedByWhite.push(pawnIndex - (i * 9));
                }
                //move right-up
                for (let i = 1; row - i >= 0 && column + i < 8; i++) {
                    // console.log('MOVE- RIGHT UP',this.currentIndex - (i * 7));
                    if (whiteBishopsAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 7))) {
                        // if(!whiteBishopsAr[j][0].isYourFriendOnField(pawnIndex - (i * 7))) {
                        //     checkedByWhite.push(pawnIndex - (i * 7));
                        // }
                        checkedByWhite.push(pawnIndex - (i * 7));
                        break;
                    }
                    checkedByWhite.push(pawnIndex - (i * 7));
                }
                // //move down-left
                for (let i = 1; row - i <= 8 && column - i >= 0; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 7));
                    if (whiteBishopsAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 7))) {
                        // if(!whiteBishopsAr[j][0].isYourFriendOnField(pawnIndex + (i * 7))) {
                        //     checkedByWhite.push(pawnIndex + (i * 7));
                        // }
                        checkedByWhite.push(pawnIndex + (i * 7));
                        break;
                    }
                    checkedByWhite.push(pawnIndex + (i * 7));
                    // console.log('checking', pawnIndex + (i * 7));
                }
                // //move down-right
                for (let i = 1; row - i <= 8 && column + i < 8; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 9));
                    if (whiteBishopsAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 9))) {
                        // if(!whiteBishopsAr[j][0].isYourFriendOnField(pawnIndex + (i * 9))) {
                        //     checkedByWhite.push(pawnIndex + (i * 9));
                        // }
                        checkedByWhite.push(pawnIndex + (i * 9));
                        break;
                    }
                    checkedByWhite.push(pawnIndex + (i * 9));
                    // console.log('checking', pawnIndex + (i * 9));
                }
                // console.log('CHECKEDBYWHITE, ', checkedByWhite);
            }
            // console.log('checkedByWhite', checkedByWhite);
            if (checkedByWhite.indexOf(lastAr[blackKingIndex][1]) !== -1) {
                return true;
            }
        }
        //END WHITE BISHOP
        //START BLACK BISHOP
        else {
            const checkedByBlack = [];
            const blackBishopsAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.BISHOP, 'BLACK');
            // console.log('blackBishopsAr:', blackBishopsAr);
            outer: for (let j = 0; j <= blackBishopsAr.length - 1; j++) {
                // console.log(lastAr[blackBishopsAr[j][1]]);
                // console.log(blackBishopsAr[j][1]);
                let pawnIndex = lastAr[blackBishopsAr[j][1]][1];
                let row = Math.floor(pawnIndex / 8);
                let column = pawnIndex - row * 8;
                //move left-up
                for (let i = 1; row - i >= 0 && column - i >= 0; i++) {
                    if (blackBishopsAr[j][0].isBeingTaken())
                        break;
                    // console.log('MOVE- LEFT UP',pawnIndex - (i * 9));
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 9))) {
                        // if(!blackBishopsAr[j][0].isYourFriendOnField(pawnIndex - (i * 9))) {
                        //     checkedByBlack.push(pawnIndex - (i * 9));
                        // }
                        checkedByBlack.push(pawnIndex - (i * 9));
                        break;
                    }
                    checkedByBlack.push(pawnIndex - (i * 9));
                }
                //move right-up
                for (let i = 1; row - i >= 0 && column + i < 8; i++) {
                    // console.log('MOVE- RIGHT UP',this.currentIndex - (i * 7));
                    if (blackBishopsAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 7))) {
                        // if(!blackBishopsAr[j][0].isYourFriendOnField(pawnIndex - (i * 7))) {
                        //     checkedByBlack.push(pawnIndex - (i * 7));
                        // }
                        checkedByBlack.push(pawnIndex - (i * 7));
                        break;
                    }
                    checkedByBlack.push(pawnIndex - (i * 7));
                }
                // //move down-left
                for (let i = 1; row - i <= 8 && column - i >= 0; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 7));
                    if (blackBishopsAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 7))) {
                        // if(!blackBishopsAr[j][0].isYourFriendOnField(pawnIndex + (i * 7))) {
                        //     checkedByBlack.push(pawnIndex + (i * 7));
                        // }
                        checkedByBlack.push(pawnIndex + (i * 7));
                        break;
                    }
                    checkedByBlack.push(pawnIndex + (i * 7));
                    // console.log('checking', pawnIndex + (i * 7));
                }
                // //move down-right
                for (let i = 1; row - i <= 8 && column + i < 8; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 9));
                    if (blackBishopsAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 9))) {
                        // if(!blackBishopsAr[j][0].isYourFriendOnField(pawnIndex + (i * 9))) {
                        //     checkedByBlack.push(pawnIndex + (i * 9));
                        // }
                        checkedByBlack.push(pawnIndex + (i * 9));
                        break;
                    }
                    checkedByBlack.push(pawnIndex + (i * 9));
                    // console.log('checking', pawnIndex + (i * 9));
                }
                // console.log('checkedByBlack, ', checkedByBlack);
            }
            // console.log('checkedByBlack', checkedByBlack);
            if (checkedByBlack.indexOf(lastAr[whiteKingIndex][1]) !== -1) {
                return true;
            }
        }
        //END BLACK BISHOP
        //START WHITE QUEEN
        if (this.pieceColor === 'BLACK') {
            const checkedByWhite = [];
            const whiteQueensAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.QUEEN, 'WHITE');
            // console.log('whiteQueensAr:', whiteQueensAr);
            outer: for (let j = 0; j <= whiteQueensAr.length - 1; j++) {
                // console.log(lastAr[whiteQueensAr[j][1]]);
                // console.log(whiteQueensAr[j][1]);
                let pawnIndex = lastAr[whiteQueensAr[j][1]][1];
                let row = Math.floor(pawnIndex / 8);
                let column = pawnIndex - row * 8;
                //move left-up
                for (let i = 1; row - i >= 0 && column - i >= 0; i++) {
                    if (whiteQueensAr[j][0].isBeingTaken())
                        break;
                    // console.log('MOVE- LEFT UP',pawnIndex - (i * 9));
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 9))) {
                        // if(!whiteQueensAr[j][0].isYourFriendOnField(pawnIndex - (i * 9))) {
                        //     checkedByWhite.push(pawnIndex - (i * 9));
                        // }
                        checkedByWhite.push(pawnIndex - (i * 9));
                        break;
                    }
                    checkedByWhite.push(pawnIndex - (i * 9));
                }
                //move right-up
                for (let i = 1; row - i >= 0 && column + i < 8; i++) {
                    // console.log('MOVE- RIGHT UP',this.currentIndex - (i * 7));
                    if (whiteQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 7))) {
                        // if(!whiteQueensAr[j][0].isYourFriendOnField(pawnIndex - (i * 7))) {
                        //     checkedByWhite.push(pawnIndex - (i * 7));
                        // }
                        checkedByWhite.push(pawnIndex - (i * 7));
                        break;
                    }
                    checkedByWhite.push(pawnIndex - (i * 7));
                }
                // //move down-left
                for (let i = 1; row - i <= 8 && column - i >= 0; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 7));
                    if (whiteQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 7))) {
                        // if(!whiteQueensAr[j][0].isYourFriendOnField(pawnIndex + (i * 7))) {
                        //     checkedByWhite.push(pawnIndex + (i * 7));
                        // }
                        checkedByWhite.push(pawnIndex + (i * 7));
                        break;
                    }
                    checkedByWhite.push(pawnIndex + (i * 7));
                    // console.log('checking', pawnIndex + (i * 7));
                }
                // //move down-right
                for (let i = 1; row - i <= 8 && column + i < 8; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 9));
                    if (whiteQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 9))) {
                        // if(!whiteQueensAr[j][0].isYourFriendOnField(pawnIndex + (i * 9))) {
                        //     checkedByWhite.push(pawnIndex + (i * 9));
                        // }
                        checkedByWhite.push(pawnIndex + (i * 9));
                        break;
                    }
                    checkedByWhite.push(pawnIndex + (i * 9));
                    // console.log('checking', pawnIndex + (i * 9));
                }
                // console.log(lastAr[whiteQueensAr[j][1]]);
                // console.log(whiteQueensAr[j][1]);
                // console.log('CANTTT, ROW:', row);
                //movement up        
                for (let i = 1; i < row + 1; i++) {
                    // console.log('CURRENT',pawnIndex - (i * 8));
                    if (whiteQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 8))) {
                        if (!whiteQueensAr[j][0].isYourFriendOnField(pawnIndex - (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push(pawnIndex - (i * 8));
                            break;
                        }
                        else {
                            checkedByWhite.push(pawnIndex - (i * 8));
                            break;
                        }
                    }
                    checkedByWhite.push(pawnIndex - (i * 8));
                }
                //movement down
                for (let i = row + 1; i < 8; i++) {
                    // console.log('CURRENT',column + (i * 8));
                    if (whiteQueensAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty(column + (i * 8))) {
                        if (!whiteQueensAr[j][0].isYourFriendOnField(column + (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push(column + (i * 8));
                            break;
                        }
                        else {
                            checkedByWhite.push(column + (i * 8));
                            break;
                        }
                    }
                    checkedByWhite.push(column + (i * 8));
                }
                // movement left 
                for (let i = 1; i < column + 1; i++) {
                    // console.log('CURRENT',(row * 8) + column - i);
                    if (whiteQueensAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + column - i)) {
                        if (!whiteQueensAr[j][0].isYourFriendOnField((row * 8) + column - i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push((row * 8) + column - i);
                            break;
                        }
                        else {
                            checkedByWhite.push((row * 8) + column - i);
                            break;
                        }
                    }
                    checkedByWhite.push((row * 8) + column - i);
                }
                // movement right
                for (let i = column + 1; i < 8; i++) {
                    // console.log('CURRENT',(row * 8) +  i);
                    if (whiteQueensAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + i)) {
                        if (!whiteQueensAr[j][0].isYourFriendOnField((row * 8) + i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByWhite.push((row * 8) + i);
                            break;
                        }
                        else {
                            checkedByWhite.push((row * 8) + i);
                            break;
                        }
                    }
                    checkedByWhite.push((row * 8) + i);
                }
                // console.log('CHECKEDBYWHITE, ', checkedByWhite);
            }
            // console.log('checkedByWhite', checkedByWhite);
            if (checkedByWhite.indexOf(lastAr[blackKingIndex][1]) !== -1) {
                return true;
            }
        }
        //START BLACK QUEEN
        else {
            const checkedByBlack = [];
            const blackQueensAr = VirtualGameBoard.getArOfPiecesOfSpecifiedType(CustomTypes.PieceType.QUEEN, 'BLACK');
            // console.log('blackQueensAr:', blackQueensAr);
            outer: for (let j = 0; j <= blackQueensAr.length - 1; j++) {
                // console.log(lastAr[blackQueensAr[j][1]]);
                // console.log(blackQueensAr[j][1]);
                let pawnIndex = lastAr[blackQueensAr[j][1]][1];
                let row = Math.floor(pawnIndex / 8);
                let column = pawnIndex - row * 8;
                //move left-up
                for (let i = 1; row - i >= 0 && column - i >= 0; i++) {
                    if (blackQueensAr[j][0].isBeingTaken())
                        break;
                    // console.log('MOVE- LEFT UP',pawnIndex - (i * 9));
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 9))) {
                        // if(!blackQueensAr[j][0].isYourFriendOnField(pawnIndex - (i * 9))) {
                        //     checkedByBlack.push(pawnIndex - (i * 9));
                        // }
                        checkedByBlack.push(pawnIndex - (i * 9));
                        break;
                    }
                    checkedByBlack.push(pawnIndex - (i * 9));
                }
                //move right-up
                for (let i = 1; row - i >= 0 && column + i < 8; i++) {
                    // console.log('MOVE- RIGHT UP',this.currentIndex - (i * 7));
                    if (blackQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 7))) {
                        // if(!blackQueensAr[j][0].isYourFriendOnField(pawnIndex - (i * 7))) {
                        //     checkedByBlack.push(pawnIndex - (i * 7));
                        // }
                        checkedByBlack.push(pawnIndex - (i * 7));
                        break;
                    }
                    checkedByBlack.push(pawnIndex - (i * 7));
                }
                // //move down-left
                for (let i = 1; row - i <= 8 && column - i >= 0; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 7));
                    if (blackQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 7))) {
                        // if(!blackQueensAr[j][0].isYourFriendOnField(pawnIndex + (i * 7))) {
                        //     checkedByBlack.push(pawnIndex + (i * 7));
                        // }
                        checkedByBlack.push(pawnIndex + (i * 7));
                        break;
                    }
                    checkedByBlack.push(pawnIndex + (i * 7));
                    // console.log('checking', pawnIndex + (i * 7));
                }
                // //move down-right
                for (let i = 1; row - i <= 8 && column + i < 8; i++) {
                    // console.log('wykonuje',this.currentIndex + (i * 9));
                    if (blackQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex + (i * 9))) {
                        // if(!blackQueensAr[j][0].isYourFriendOnField(pawnIndex + (i * 9))) {
                        //     checkedByBlack.push(pawnIndex + (i * 9));
                        // }
                        checkedByBlack.push(pawnIndex + (i * 9));
                        break;
                    }
                    checkedByBlack.push(pawnIndex + (i * 9));
                    // console.log('checking', pawnIndex + (i * 9));
                }
                // console.log(lastAr[blackQueensAr[j][1]]);
                // console.log(blackQueensAr[j][1]);
                // console.log('CANTTT, ROW:', row);
                //movement up        
                for (let i = 1; i < row + 1; i++) {
                    // console.log('CURRENT',pawnIndex - (i * 8));
                    if (blackQueensAr[j][0].isBeingTaken())
                        break;
                    if (!VirtualGameBoard.isFieldEmpty(pawnIndex - (i * 8))) {
                        if (!blackQueensAr[j][0].isYourFriendOnField(pawnIndex - (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push(pawnIndex - (i * 8));
                            break;
                        }
                        else {
                            checkedByBlack.push(pawnIndex - (i * 8));
                            break;
                        }
                    }
                    checkedByBlack.push(pawnIndex - (i * 8));
                }
                //movement down
                for (let i = row + 1; i < 8; i++) {
                    // console.log('CURRENT',column + (i * 8));
                    if (blackQueensAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty(column + (i * 8))) {
                        if (!blackQueensAr[j][0].isYourFriendOnField(column + (i * 8))) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push(column + (i * 8));
                            break;
                        }
                        else {
                            checkedByBlack.push(column + (i * 8));
                            break;
                        }
                    }
                    checkedByBlack.push(column + (i * 8));
                }
                // movement left 
                for (let i = 1; i < column + 1; i++) {
                    // console.log('CURRENT',(row * 8) + column - i);
                    if (blackQueensAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + column - i)) {
                        if (!blackQueensAr[j][0].isYourFriendOnField((row * 8) + column - i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push((row * 8) + column - i);
                            break;
                        }
                        else {
                            checkedByBlack.push((row * 8) + column - i);
                            break;
                        }
                    }
                    checkedByBlack.push((row * 8) + column - i);
                }
                // movement right
                for (let i = column + 1; i < 8; i++) {
                    // console.log('CURRENT',(row * 8) +  i);
                    if (blackQueensAr[j][0].isBeingTaken())
                        continue outer;
                    if (!VirtualGameBoard.isFieldEmpty((row * 8) + i)) {
                        if (!blackQueensAr[j][0].isYourFriendOnField((row * 8) + i)) {
                            // console.log('WWEEEEEEEEEEWNETRZNY IF');
                            checkedByBlack.push((row * 8) + i);
                            break;
                        }
                        else {
                            checkedByBlack.push((row * 8) + i);
                            break;
                        }
                    }
                    checkedByBlack.push((row * 8) + i);
                }
                // console.log('checkedByBlack, ', checkedByBlack);
            }
            // console.log('checkedByBlack', checkedByBlack);
            if (checkedByBlack.indexOf(lastAr[whiteKingIndex][1]) !== -1) {
                return true;
            }
        }
        //END BLACK QUEEN
        return false;
    }
    static willMyKingBeChecked(index) {
        // copies the last array (to check later how would it look with new indexes)
        const lastIndex = VirtualGameBoard.virtualGameBoardsArray.length - 1;
        new VirtualGameBoard(VirtualGameBoard.virtualGameBoardsArray[lastIndex]);
        // console.log('CHEKOUT THIS ARRAY' ,VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
        VirtualGameBoard.updateIndexesOfPieces(this, index);
        // console.log(
        //   'CHEKOUT THIS ARRAY - AFTER MODIFYING',
        //   VirtualGameBoard.virtualGameBoardsArray[
        //     VirtualGameBoard.virtualGameBoardsArray.length - 1
        //   ]
        // );
        let king;
        if (this.pieceColor === 'BLACK') {
            king = King.Kings[0];
        }
        else {
            king = King.Kings[1];
        }
        if (king.isKingChecked()) {
            VirtualGameBoard.virtualGameBoardsArray.pop();
            VirtualGameBoard.counter--;
            return true;
        }
        else {
            VirtualGameBoard.virtualGameBoardsArray.pop();
            VirtualGameBoard.counter--;
            return false;
        }
    }
}
// indexes to place kings on the board
King.freeIndexesWhite = [60];
King.freeIndexesBlack = [4];
King.Kings = [];
