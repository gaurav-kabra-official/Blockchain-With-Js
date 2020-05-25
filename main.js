// AUTHOR - GAURAV KABRA
// GAURAVKABRA.OFFICIAL@GMAIL.COM

/**
 * This program does not consider communication in a peer-to-peer n/w
 * Also does not check if enough funds for transaction
 * THIS PROGRAM IS ONLY INTENDED TO DEMONSTRATE A VERY BASIC OF HOW A BLOCKCHAIN WORKS
 */

SHA256 = require('crypto-js/sha256');

class Block{
    // index : position of block on chain
    // timestamp : when block was created
    // data : content of block
    // prevHash : avoid fraudulence
    // nounce : difficulty (# of 0's that hash should start with)
    constructor(data, prevHash = ''){
        this.index = Block.index++;
        this.timestamp = this.getTimestamp();
        this.data = data;
        this. prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash(){
        let temp = this.index + this.timestamp + this.prevHash + JSON.stringify(this.data) + this.nounce;
        // convert object 'temp' to string
        return SHA256(temp).toString();
    }

    getTimestamp(){
        let currentDate = new Date();
        let date = currentDate.getDate();
        let month = currentDate.getMonth(); 
        let year = currentDate.getFullYear();
        let dateString = date + "/" +(month + 1) + "/" + year;  // added 1 bcz January is 0 not 1
        return dateString;
    }

    // proof of work (aka mining) is used so only certain number of blocks may be added to chain
    // hash of a block must start with a certain amount of zeros
    // difficulty is reqd so that as machines get faster, difficulty may be raised
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty+1).join('0')){
            this.nounce++;
            this.hash = this.calculateHash();
        }
    }
}

// static variable
Block.index = 0

class Blockchain{
    constructor(){
        // first block is called genesis block and must be added manually
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock(){
        return new Block("Genesis Block", "0");
    }

    addBlock(newBlock){
        newBlock.prevHash = this.getLastBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }   

    // chain may become invalid if temper block data

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            let currentBlock = this.chain[i];
            let prevBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash() || currentBlock.prevHash != prevBlock.hash)
                return false;
            return true;
        }
    }
}



class Main{
    runner(){
        let gaurav = new Blockchain();
        console.log("Mining Blk 1");
        let sdate = new Date();
        gaurav.addBlock(new Block({amount : 1001}));
        let edate = new Date();
        console.log("Time in sec :" + (edate-sdate)/1000);
        console.log(gaurav);
        console.log("Mining Blk 2");
        sdate = new Date();
        gaurav.addBlock(new Block({price : 499}));
        edate = new Date();
        console.log("Time in sec :" + (edate-sdate)/1000);
        console.log(gaurav);
    }
}

let m = new Main();
m.runner();