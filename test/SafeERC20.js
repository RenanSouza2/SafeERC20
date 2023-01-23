const { expect } = require("chai");

async function waitTx(txPromisse) {
  const tx = await txPromisse;
  return await tx.wait();
}

describe('Test SafeERC20', async function () {
  let MockERC20;
  let LibUser;
  let libUser;

  let mockERC20;
  let owner;
  let to;
  let amount;

  before(async function () {
    LibUser = await ethers.getContractFactory('LibUser');
    MockERC20 = await ethers.getContractFactory('MockERC20');

    libUser = await LibUser.deploy();
    await libUser.deployed();

    const address = (await ethers.getSigners()).map(signer => signer.address);
    owner = address[0];
    to = address[1];
    amount = 100;
  });

  beforeEach(async function () {
    mockERC20 = await MockERC20.deploy();
    await mockERC20.deployed();
  });
  
  describe('transfer', async function () {
    it('Transfer done', async function () {
      await waitTx(libUser.transfer(mockERC20.address, to, amount));

      const _to = await mockERC20.to();
      expect(_to).equal(to);

      const _amount = await mockERC20.amount();
      expect(_amount).equal(amount);
    });

    it('Fail', async function () {
      await waitTx(mockERC20.setFail(true));
      const tx = libUser.transfer(mockERC20.address, to, amount);
      await expect(tx).revertedWith('Token transfer not successful');
    });

    it('Revert', async function () {
      await waitTx(mockERC20.setRevert(true));
      const tx = libUser.transfer(mockERC20.address, to, amount);
      await expect(tx).revertedWith('Token transfer not successful');
    });
  });
  
  describe('transferFrom', async function () {
    it('Transfer done', async function () {
      await waitTx(libUser.transferFrom(mockERC20.address, owner, to, amount));

      const _owner = await mockERC20.owner();
      expect(_owner).equal(owner);
      
      const _to = await mockERC20.to();
      expect(_to).equal(to);

      const _amount = await mockERC20.amount();
      expect(_amount).equal(amount);
    });

    it('Fail', async function () {
      await waitTx(mockERC20.setFail(true));
      const tx = libUser.transferFrom(mockERC20.address, owner, to, amount);
      await expect(tx).revertedWith('Token transferFrom not successful');
    });

    it('Revert', async function () {
      await waitTx(mockERC20.setRevert(true));
      const tx = libUser.transferFrom(mockERC20.address, owner, to, amount);
      await expect(tx).revertedWith('Token transferFrom not successful');
    });
  });

  describe('decimals', async function () {
    it('Should return tokens decimals', async function () {
      const decimals = await mockERC20.decimals();
      expect(decimals).equal(18);
    });

    it('Should return 0 if token doesnt have decimals', async function () {
      await waitTx(mockERC20.setRevert(true));
      const decimals = await libUser.decimals(mockERC20.address);
      expect(decimals).equal(0);
    });
  });
});
