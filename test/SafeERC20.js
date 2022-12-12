const { expect } = require("chai");

async function waitTx(txPromisse) {
  const tx = await txPromisse;
  return await tx.wait();
}

describe('Test SafeERC20', async function () {
  let ERC20;
  let LibUser;
  let libUser;

  let erc20;
  let owner;
  let to;
  let amount;

  before(async function () {
    LibUser = await ethers.getContractFactory('LibUser');
    ERC20 = await ethers.getContractFactory('MockERC20');

    libUser = await LibUser.deploy();
    await libUser.deployed();

    const address = (await ethers.getSigners()).map(signer => signer.address);
    owner = address[0];
    to = address[1];
    amount = 100;
  });

  beforeEach(async function () {
    erc20 = await ERC20.deploy();
    await erc20.deployed();
  });
  
  describe('transfer', async function () {
    it('Transfer done', async function () {
      await waitTx(libUser.transfer(erc20.address, to, amount));

      const _to = await erc20.to();
      expect(_to).equal(to);

      const _amount = await erc20.amount();
      expect(_amount).equal(amount);
    });

    it('Fail', async function () {
      await waitTx(erc20.setFail(true));
      const tx = libUser.transfer(erc20.address, to, amount);
      await expect(tx).revertedWith('Token transfer not successfull');
    });

    it('Revert', async function () {
      await waitTx(erc20.setRevert(true));
      const tx = libUser.transfer(erc20.address, to, amount);
      await expect(tx).revertedWith('Token transfer not successfull');
    });
  });
  
  describe('transferFrom', async function () {
    it('Transfer done', async function () {
      await waitTx(libUser.transferFrom(erc20.address, owner, to, amount));

      const _owner = await erc20.owner();
      expect(_owner).equal(owner);
      
      const _to = await erc20.to();
      expect(_to).equal(to);

      const _amount = await erc20.amount();
      expect(_amount).equal(amount);
    });

    it('Fail', async function () {
      await waitTx(erc20.setFail(true));
      const tx = libUser.transferFrom(erc20.address, owner, to, amount);
      await expect(tx).revertedWith('Token transferFrom not successfull');
    });

    it('Revert', async function () {
      await waitTx(erc20.setRevert(true));
      const tx = libUser.transferFrom(erc20.address, owner, to, amount);
      await expect(tx).revertedWith('Token transferFrom not successfull');
    });
  });
});
