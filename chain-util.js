const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const uuidV1 = require('uuidv1');
const SHA256 = require('crypto-js/sha256');

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }
    static id() {
        //V1 usese the time stamp to generate a unique id
        return uuidV1();
    }
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }
    static verifySignature(publicKey, signature, dataHash) {
        //keyFromPublic takes the public key and the format of the key
        //verify takes the dataHash(hashed data) and the signature
        //returns true or false if the signature is valid
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }

}
module.exports = ChainUtil;