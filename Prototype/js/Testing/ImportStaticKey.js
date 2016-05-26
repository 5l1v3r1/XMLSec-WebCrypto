window.crypto.subtle.importKey(
    "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
    {   //this is an example jwk key, other key types are Uint8Array objects
      ###
      kty: "RSA",
      e: "AgMBAAE",
      n: "AoGBAL4vpoH3H3byehjj7RAGxefGRATiq4mXtzc9Q91W7uT0DTaFEbjzVch9aGsNjmLs4QHsoZbuoUmi0st4x5z9SQpTAKC",
      d: "AoGAIbKXshdzP8Qe1iIsctaAYlzC2IrBEhQLpoH4cFNi6LZFUQ-q4DZdULTHt5AjVmvaQlkHGJMXiNCMwPiZhbtrIVb6EaC-3leFQntQH9989uBOOvnGOYK8TYR7fy8gp2SnIrbwnK81xMVHOZ-ip4F9JjCoJFu7JGQ8LJys4clFfME",
      p: "AkEA3ZtAx4BJBU6p1-oF0WAL80-cpjZy4OLqHrn1A3WX6SBffLB1nsop-0mjUb2XjlI31imTIR33MQ7o8wVq58m9lQ",
      q: "AkEA27QFsZNIvAU91EzVgk__W1EETj3BmWoMMJ0RQcl-4KZn5H9SJiL21lV0qV-vPyI240pE8NZ4_2I9TcBWdJ8XhQ",
      dp:"AkEAzPhRpXVBlPgaXkvlz7AfvY-wW4hXHyyi0YK8XdPBi25XA5SPZiylQfjtZ6iN6qSfYqYXoPT_c0_QJR-orvVJNQ",
      dq:"AkEA2FE81eWNVMrYYMKx6hd39mIjmiHGD5ZRoD_V8O9CxFAztNADg1cjsE79iZKTitbWMh47GOIiyljgwUAiH7tQvQ",
      qi:"AkBS-s04OsH3jJRGc74KsAhqC7r056rb8oOOc-6X3K4NnB3YAlyMvZBK3I8BorugTnrxANak1kZPm79LZJ1r3M_7",
      alg: "RS1",
      ext: true
      ###
    },
    {   //these are the algorithm options
        name: "RSASSA-PKCS1-v1_5",
        hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["verify","sign"] //"verify" for public key import, "sign" for private key imports
)
.then(function(publicKey){
    //returns a publicKey (or privateKey if you are importing a private key)
    console.log(publicKey);
})
.catch(function(err){
    console.error(err);
});
