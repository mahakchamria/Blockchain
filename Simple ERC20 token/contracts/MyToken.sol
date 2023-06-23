// SPDX-Licence-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken","MT"){
        _mint(msg.sender, initialSupply*10**decimals());
    }
}
