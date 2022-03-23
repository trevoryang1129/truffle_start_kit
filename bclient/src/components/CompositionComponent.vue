<template>
  <div>
    <p>当前账号{{currentAccount}}</p>
    <p>账号:{{reqAccount}}  余额:{{reqAccountBlance}}</p><br>
    <q-input v-model="reqAccount"></q-input>
    <q-btn @click="getBlance()" label="获取用户余额"></q-btn><br>
    发送 <q-input v-model="sendAmt" label="MetaCoin 数量"></q-input> 到账号：<p>{{reqAccount}}</p>
    <q-btn @click="sendCoin()" label="发送MetaCoin"></q-btn><br>
  </div>
</template>

<script lang="ts">
import {defineComponent,PropType,computed,ref,toRef,Ref,} from 'vue';
import { AbiItem } from 'web3-utils'
import {MetaCoin} from "src/typechain/MetaCoin"
import MetaCoinAbi from 'src/artifacts/contracts/MetaCoin.json'
import Web3 from 'web3';

//以下类型声明声明可以放到单独的文件中
export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id?: string | number;
}
export interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
}
declare global {
  interface Window {
    ethereum:{
    isConnected():boolean,
    request(args: { method: string;params?: unknown[] | object;}): Promise<any>,
    on(event:string, handler: (para: any) => void):void,
    sendAsync(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void;
    send?(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void;
    connected?: boolean;
    }
  }
}
export default defineComponent({
  name: 'CompositionComponent',
  setup(props) {
    return {currentAccount:ref(""),reqAccount:ref("---"),reqAccountBlance:ref(0),sendAmt:ref(0)};
  },
  mounted()
  {
     this.requestAccount()
  },
  methods:
  {
    handleAccountsChanged(accounts:string[]) 
    {
        if (accounts.length === 0) 
        {
            console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== this.currentAccount) 
        {
            this.currentAccount = accounts[0];
        }
        console.log('WalletAddress in HandleAccountChanged =',this.currentAccount)
    },
    async  requestAccount() 
    {
        let accs=await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.handleAccountsChanged(accs)
    },
    async  getBlance() 
    {
      const web3 = new Web3(window.ethereum);
      const netId:number = await web3.eth.net.getId();
      const deployedNetwork = MetaCoinAbi.networks[netId];
      const metaCoin_inst = (new web3.eth.Contract(MetaCoinAbi.abi as  AbiItem[],deployedNetwork.address) as any) as MetaCoin
      //TypeChain 并没有准确的生成 getBalance 函数签名，返回值为String ,目前尚未找到解决办法
      let balance=await metaCoin_inst.methods.getBalance(this.reqAccount).call()
      this.reqAccountBlance=+balance
      console.log("balance ",typeof(balance),balance)
    },
    async  sendCoin() 
    {
      const web3 = new Web3(window.ethereum);
      const netId:number = await web3.eth.net.getId();
      const deployedNetwork = MetaCoinAbi.networks[netId];
      const metaCoin_inst = (new web3.eth.Contract(MetaCoinAbi.abi as  AbiItem[],deployedNetwork.address) as any) as MetaCoin
      let receipt=await metaCoin_inst.methods.sendCoin(this.reqAccount,this.sendAmt).send({from:this.currentAccount})
      console.log("receipt ",receipt)
    }
  }
});
</script>