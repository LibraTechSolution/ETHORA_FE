import { Address } from 'wagmi';

export interface IAddressContract {
  land: Address;
  resource: Address;
  enrich: Address;
  asgToken: Address;
  nvsToken: Address;
  verifier: Address;
  manager: Address;
  stash: Address;
  calRandomResource: Address;
  calRandomItem: Address;
  inventory: Address;
  prices: Address;
  game: Address;
  gameController: Address;
  support: Address;
  gameResource: Address;
  event: Address;
  actItem: Address;
}

interface IAddress {
  [chainId: number]: IAddressContract;
}

const addresses: IAddress = {
  // mumbai
  80001: {
    land: '0x6E0ad85523957Abd70e561701f20e78A5e1a594d',
    resource: '0x4af43c581fd169cFBA3887307BfC794373A3fcf6',
    enrich: '0xb534B7ba574668De4Ad79B5dCcE54c9235B164Cc',
    asgToken: '0xdF753c700E559413963d12D789af738d5B39B81b',
    nvsToken: '0xAc026Dc184dd96975a063aAEF3253476236CB0Dc',
    verifier: '0xF26B30A21B1b53b7D1f64dfFE45A552BFdC1bEC2',
    manager: '0x456f7946fCd59d0c41463F56CB46C94F515e3cE7',
    calRandomResource: '0x0b4A54a5CfC320c69ee4aDD6a0F17Cc9A3F7698B',
    calRandomItem: '0xcb599acF6088e439c14C431e23fD93F02D75cD62',
    inventory: '0x4F87bCF318702f5f3cFD2E24c1e232965c0E5A0b',
    prices: '0x7FFE45746034D227E5A2c8BD5FAa5a2d252A115D',
    game: '0x25aA259598a394a4910FAC811f565c306dD40741',
    stash: '0xe3FDce0a3A2214501cEaA308d86812Dec9F32d01',
    support: '0x62E82c4E5CA72D471e30E9d8aa06140941c1BD9F',
    gameResource: '0x9e288733C408dFc66d93B656dD0F3B443DF26c65',
    event: '0xE5CAD883c1a2A564089b4E327F3a88145347381f',
    gameController: '0xE476F4911902a71638B6B4bB16684077E49Aa2E9',
    actItem: '0x8eaBB815d906fBd24e3D513E07e5967bBB1F42AF',
  },
};

export default addresses;
