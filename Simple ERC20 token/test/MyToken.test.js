const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require( "hardhat");

describe("MyToken", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    const initialSupply = 10000;

    async function deployMyTokenFixture() {

      // Contracts are deployed using the first signer/account by default
      const signers = await ethers.getSigners();
      const owner = signers[0];
      const otherAccount = signers[1];


      const MyToken = await ethers.getContractFactory("MyToken");
      const token = await MyToken.deploy(initialSupply);

      return { token, owner, otherAccount };
    }

    describe("Deployment", function () {
      it("Should assign the total supply of tokens to the owner", async function () {
        const fixture = await loadFixture(deployMyTokenFixture);
        const token = fixture.token;
        const owner = fixture.owner;
        const total = await token.totalSupply();
        expect(total).to.equal(await token.balanceOf(owner.address));
      });

    });

    describe("Transaction", function () {

        it("Should transfer tokens between accounts", async function () {
            const { token, owner, otherAccount } = await loadFixture(deployMyTokenFixture);

            const ownerBalance = await token.balanceOf(owner.address);

            await token.transfer(otherAccount.address, 50);
            const addr1Balance = await token.balanceOf(otherAccount.address);
            expect(addr1Balance).to.equal(50);

            const ownerNewBalance = await token.balanceOf(owner.address);
            expect(ownerNewBalance).to.equal(ownerBalance.sub(50));
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const { token, owner, otherAccount } = await loadFixture(deployMyTokenFixture);

            // Transfer 10001 GLD tokens from owner to otherAccount
            await expect(
             token.transfer(otherAccount.address, ethers.utils.parseEther('10001'))
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });        

      });

});