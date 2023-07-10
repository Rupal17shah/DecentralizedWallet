const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const uuidV1 = require('uuid/v1');


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
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}
module.exports = ChainUtil;