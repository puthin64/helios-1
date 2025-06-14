// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GmContract {
    string public gmMessage;
    uint256 public counter;

    constructor(string memory _gm) {
        gmMessage = _gm;
        counter = 0;
    }

    function increment() public {
        counter += 1;
    }
}
