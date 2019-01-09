module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*" // Match any network id
          },

          chainskills: {
            host:"localhost",
            port:8545,
            network_id:"4224",
            gas: 4700000,
            //deployment from the second account
            //from: '0xfcb9b2103bc3026ec2f6a71b09272d2b99490e2f'
          },

          rinkeby: {
            host:"localhost",
            port:8545,
            network_id:4,//, //rinkeby test networks
            gas: 4700000
          }
     }
};
