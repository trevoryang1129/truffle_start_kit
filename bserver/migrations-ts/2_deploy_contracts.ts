const ConvertLib = artifacts.require('ConvertLib')
const MetaCoin = artifacts.require('MetaCoin')
module.exports =function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  let MetaCoinInst=deployer.deploy(MetaCoin)
} as Truffle.Migration
export {}